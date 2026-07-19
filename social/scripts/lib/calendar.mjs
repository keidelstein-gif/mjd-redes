import { isPublished } from './state.mjs';

// Devuelve [{ postId, post, network }] para cada red pendiente de un post
// aprobado cuya fecha/hora ya pasó y que no está publicada aún.
export function duePublishTasks({ posts, published, now }) {
  const tasks = [];
  for (const post of posts) {
    if (post.status !== 'approved') continue;
    if (new Date(post.datetime).getTime() > now.getTime()) continue;
    for (const network of post.networks) {
      if (!isPublished(published, post.id, network)) {
        tasks.push({ postId: post.id, post, network });
      }
    }
  }
  return tasks;
}
