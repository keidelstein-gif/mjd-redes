import { graphUrl } from './http.mjs';

// Publica una foto en una página de Facebook.
// httpPost: async (url, params) => json   (inyectado; en prod es httpPostForm)
export async function publishFacebookPhoto({ pageId, accessToken, imageUrl, caption }, httpPost) {
  const res = await httpPost(graphUrl(`${pageId}/photos`), {
    url: imageUrl,
    caption: caption ?? '',
    access_token: accessToken,
  });
  const id = res.post_id || res.id;
  if (!id) throw new Error('Graph API no devolvió id de la publicación de Facebook');
  return id;
}
