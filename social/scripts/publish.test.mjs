import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPublish } from './publish.mjs';

const post = (over = {}) => ({
  id: 'a',
  status: 'approved',
  datetime: '2026-08-01T09:00:00-04:00',
  networks: ['instagram_feed'],
  media: 'social/media/2026-08/a.jpg',
  caption: 'A',
  ...over,
});
const now = new Date('2026-08-01T13:30:00Z');

test('publica tareas vencidas y actualiza el estado a ok', async () => {
  const publishers = {
    instagram_feed: async ({ imageUrl }) => {
      assert.equal(imageUrl, 'https://x/social/media/2026-08/a.jpg');
      return 'MID1';
    },
  };
  const { published, results } = await runPublish({
    posts: [post()], published: {}, now, baseUrl: 'https://x', publishers,
  });
  assert.equal(results.length, 1);
  assert.equal(results[0].ok, true);
  assert.equal(results[0].id, 'MID1');
  assert.equal(published.a.instagram_feed.status, 'ok');
});

test('si el publisher lanza, registra error y no marca ok', async () => {
  const publishers = { instagram_feed: async () => { throw new Error('rate limit'); } };
  const { published, results } = await runPublish({
    posts: [post()], published: {}, now, baseUrl: 'https://x', publishers,
  });
  assert.equal(results[0].ok, false);
  assert.match(results[0].error, /rate limit/);
  assert.equal(published.a.instagram_feed.status, 'error');
});
