import { graphUrl } from './http.mjs';

// Publica una imagen en el feed de Instagram (2 pasos: contenedor + publish).
// httpPost: async (url, params) => json   (inyectado; en prod es httpPostForm)
export async function publishInstagramImage({ igUserId, accessToken, imageUrl, caption }, httpPost) {
  const container = await httpPost(graphUrl(`${igUserId}/media`), {
    image_url: imageUrl,
    caption: caption ?? '',
    access_token: accessToken,
  });
  if (!container.id) throw new Error('Graph API no devolvió container id');

  const published = await httpPost(graphUrl(`${igUserId}/media_publish`), {
    creation_id: container.id,
    access_token: accessToken,
  });
  if (!published.id) throw new Error('media_publish no devolvió id');

  return published.id;
}
