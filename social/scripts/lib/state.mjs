export function isPublished(published, postId, network) {
  return published?.[postId]?.[network]?.status === 'ok';
}

export function markPublished(published, postId, network, result) {
  const next = structuredClone(published ?? {});
  next[postId] = next[postId] ?? {};
  next[postId][network] = result;
  return next;
}
