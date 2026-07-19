import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { duePublishTasks } from './lib/calendar.mjs';
import { markPublished } from './lib/state.mjs';
import { publicMediaUrl } from './lib/media.mjs';
import { publishInstagramImage } from './lib/instagram.mjs';
import { httpPostForm } from './lib/http.mjs';

// Orquestación pura: publica cada tarea vencida con el publisher de su red.
// publishers: { [network]: async ({ post, imageUrl }) => remoteId }
export async function runPublish({ posts, published, now, baseUrl, publishers }) {
  const tasks = duePublishTasks({ posts, published, now });
  let state = published;
  const results = [];
  for (const { postId, post, network } of tasks) {
    const publisher = publishers[network];
    const ts = now.toISOString();
    if (!publisher) {
      const error = `Sin publisher para ${network}`;
      results.push({ postId, network, ok: false, error });
      state = markPublished(state, postId, network, { status: 'error', error, ts });
      continue;
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
  const igUserId = requireEnv('IG_USER_ID_ES');
  const accessToken = requireEnv('IG_ACCESS_TOKEN_ES');
  const baseUrl = requireEnv('PAGES_BASE_URL');

  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const calendarPath = path.resolve(`social/calendar/${month}.json`);
  const statePath = path.resolve('social/state/published.json');

  const posts = await readJsonOr(calendarPath, []);
  const published = await readJsonOr(statePath, {});

  const publishers = {
    instagram_feed: ({ post, imageUrl }) =>
      publishInstagramImage(
        { igUserId, accessToken, imageUrl, caption: post.caption },
        httpPostForm,
      ),
  };

  const { published: nextState, results } = await runPublish({
    posts, published, now: new Date(), baseUrl, publishers,
  });

  await writeFile(statePath, JSON.stringify(nextState, null, 2) + '\n');

  for (const r of results) {
    console.log(r.ok ? `OK  ${r.postId} ${r.network} -> ${r.id}` : `ERR ${r.postId} ${r.network}: ${r.error}`);
  }
  const failures = results.filter((r) => !r.ok);
  if (failures.length) {
    console.error(`${failures.length} publicación(es) fallaron`);
    process.exit(1);
  }
  console.log(`Listo: ${results.length} tarea(s) procesada(s).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
