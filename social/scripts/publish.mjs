import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { duePublishTasks } from './lib/calendar.mjs';
import { markPublished } from './lib/state.mjs';
import { publicMediaUrl } from './lib/media.mjs';
import { publishInstagramImage } from './lib/instagram.mjs';
import { publishFacebookPhoto } from './lib/facebook.mjs';
import { httpPostForm } from './lib/http.mjs';

// Orquestación pura: publica cada tarea vencida con el publisher que resuelve
// `resolvePublisher(network, lang)`. Si devuelve null (sin credenciales para
// esa red/idioma), la tarea se OMITE (no es error) y queda pendiente para
// cuando se configure.
// resolvePublisher: (network, lang) => (async ({post, imageUrl}) => remoteId) | null
export async function runPublish({ posts, published, now, baseUrl, resolvePublisher }) {
  const tasks = duePublishTasks({ posts, published, now });
  let state = published;
  const results = [];
  for (const { postId, post, network } of tasks) {
    const ts = now.toISOString();
    const publisher = resolvePublisher(network, post.lang);
    if (!publisher) {
      results.push({
        postId, network, ok: false, skipped: true,
        reason: `sin credenciales para ${network}/${post.lang}`,
      });
      continue; // no marca publicado: se reintenta cuando se configure
    }
    try {
      const imageUrl = publicMediaUrl(post.media, baseUrl);
      const id = await publisher({ post, imageUrl });
      results.push({ postId, network, ok: true, id });
      state = markPublished(state, postId, network, { status: 'ok', id, ts });
    } catch (err) {
      results.push({ postId, network, ok: false, error: err.message });
      state = markPublished(state, postId, network, { status: 'error', error: err.message, ts });
    }
  }
  return { published: state, results };
}

// Arma el publisher real para cada (red, idioma) leyendo credenciales de env.
// Idioma en MAYÚSCULAS: es -> ES, en -> EN. Credenciales ausentes -> null (skip).
export function resolvePublisherFromEnv(network, lang, env = process.env) {
  const L = String(lang || '').toUpperCase();

  if (network === 'instagram_feed' || network === 'instagram_stories') {
    const igUserId = env[`IG_USER_ID_${L}`];
    const accessToken = env[`IG_ACCESS_TOKEN_${L}`];
    if (!igUserId || !accessToken) return null;
    const mediaType = network === 'instagram_stories' ? 'STORIES' : undefined;
    return ({ post, imageUrl }) =>
      publishInstagramImage(
        { igUserId, accessToken, imageUrl, caption: post.caption, mediaType },
        httpPostForm,
      );
  }

  if (network === 'facebook') {
    const pageId = env[`FB_PAGE_ID_${L}`];
    const accessToken = env[`FB_PAGE_TOKEN_${L}`];
    if (!pageId || !accessToken) return null;
    return ({ post, imageUrl }) =>
      publishFacebookPhoto(
        { pageId, accessToken, imageUrl, caption: post.caption },
        httpPostForm,
      );
  }

  return null; // red desconocida
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name}`);
  return v;
}

async function readJsonOr(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function main() {
  const baseUrl = requireEnv('PAGES_BASE_URL');

  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const calendarPath = path.resolve(`social/calendar/${month}.json`);
  const statePath = path.resolve('social/state/published.json');

  const posts = await readJsonOr(calendarPath, []);
  const published = await readJsonOr(statePath, {});

  const { published: nextState, results } = await runPublish({
    posts, published, now: new Date(), baseUrl,
    resolvePublisher: (network, lang) => resolvePublisherFromEnv(network, lang),
  });

  await writeFile(statePath, JSON.stringify(nextState, null, 2) + '\n');

  for (const r of results) {
    if (r.ok) console.log(`OK   ${r.postId} ${r.network} -> ${r.id}`);
    else if (r.skipped) console.log(`SKIP ${r.postId} ${r.network}: ${r.reason}`);
    else console.log(`ERR  ${r.postId} ${r.network}: ${r.error}`);
  }

  const failures = results.filter((r) => !r.ok && !r.skipped);
  if (failures.length) {
    console.error(`${failures.length} publicación(es) fallaron`);
    process.exit(1);
  }
  const okCount = results.filter((r) => r.ok).length;
  const skipCount = results.filter((r) => r.skipped).length;
  console.log(`Listo: ${okCount} publicada(s), ${skipCount} omitida(s) por falta de credenciales.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
