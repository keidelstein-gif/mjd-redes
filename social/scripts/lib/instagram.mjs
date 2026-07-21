import { graphUrl, httpGetJson } from './http.mjs';

// Instagram procesa la imagen del contenedor de forma ASÍNCRONA: la descarga
// desde image_url y la deja en IN_PROGRESS hasta terminar. Si se llama a
// media_publish antes de que quede FINISHED, la API responde
// "Media ID is not available" y la publicación se pierde en silencio.
// (Nos pasó el martes 21-jul-2026 con las dos piezas en inglés.)
const INTENTOS_MAX = 15;
const ESPERA_MS = 3000;

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Publica una imagen en Instagram (3 pasos: contenedor + esperar + publish).
// mediaType opcional: "STORIES" para historias (sin caption). Sin mediaType = feed.
// httpPost: async (url, params) => json   (inyectado; en prod es httpPostForm)
// deps inyectables para tests: httpGet, wait, maxAttempts, delayMs
export async function publishInstagramImage(
  { igUserId, accessToken, imageUrl, caption, mediaType },
  httpPost,
  { httpGet = httpGetJson, wait = dormir, maxAttempts = INTENTOS_MAX, delayMs = ESPERA_MS } = {},
) {
  // El feed lleva caption; las stories usan media_type=STORIES y NO llevan caption.
  const containerParams = { image_url: imageUrl, access_token: accessToken };
  if (mediaType) containerParams.media_type = mediaType;
  else containerParams.caption = caption ?? '';

  const container = await httpPost(graphUrl(`${igUserId}/media`), containerParams);
  if (!container.id) throw new Error('Graph API no devolvió container id');

  await esperarContenedorListo(
    { containerId: container.id, accessToken },
    { httpGet, wait, maxAttempts, delayMs },
  );

  const published = await httpPost(graphUrl(`${igUserId}/media_publish`), {
    creation_id: container.id,
    access_token: accessToken,
  });
  if (!published.id) throw new Error('media_publish no devolvió id');

  return published.id;
}

// Consulta status_code hasta que el contenedor quede FINISHED.
// Consulta de inmediato la primera vez: si ya está listo, no espera nada.
async function esperarContenedorListo(
  { containerId, accessToken },
  { httpGet, wait, maxAttempts, delayMs },
) {
  const query = new URLSearchParams({ fields: 'status_code', access_token: accessToken });
  const url = `${graphUrl(containerId)}?${query}`;

  for (let intento = 1; intento <= maxAttempts; intento++) {
    const { status_code: estado } = await httpGet(url);
    if (estado === 'FINISHED') return;
    if (estado === 'ERROR' || estado === 'EXPIRED') {
      throw new Error(`el contenedor quedó en estado ${estado}`);
    }
    if (intento < maxAttempts) await wait(delayMs);
  }

  throw new Error(`el contenedor no quedó listo tras ${maxAttempts} intentos`);
}
