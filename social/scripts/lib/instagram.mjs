import { graphUrl } from './http.mjs';

// Publica una imagen en Instagram (2 pasos: contenedor + publish).
// mediaType opcional: "STORIES" para historias (sin caption). Sin mediaType = feed.
// httpPost: async (url, params) => json   (inyectado; en prod es httpPostForm)
export async function publishInstagramImage({ igUserId, accessToken, imageUrl, caption, mediaType }, httpPost) {
  // El feed lleva caption; las stories usan media_type=STORIES y NO llevan caption.
  const containerParams = { image_url: imageUrl, access_token: accessToken };
  if (mediaType) containerParams.media_type = mediaType;
  else containerParams.caption = caption ?? '';

  const container = await httpPost(graphUrl(`${igUserId}/media`), containerParams);
  if (!container.id) throw new Error('Graph API no devolvió container id');

  const published = await httpPost(graphUrl(`${igUserId}/media_publish`), {
    creation_id: container.id,
    access_token: accessToken,
  });
  if (!published.id) throw new Error('media_publish no devolvió id');

  return published.id;
}
