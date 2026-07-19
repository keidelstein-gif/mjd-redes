import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPublish, resolvePublisherFromEnv } from './publish.mjs';

const post = (over = {}) => ({
  id: 'a',
  status: 'approved',
  datetime: '2026-08-01T09:00:00-04:00',
  networks: ['instagram_feed'],
  media: 'social/media/2026-08/a.jpg',
  caption: 'A',
  lang: 'es',
  ...over,
});
const now = new Date('2026-08-01T13:30:00Z');

test('publica tareas vencidas y actualiza el estado a ok', async () => {
  const resolvePublisher = (network, lang) => {
    assert.equal(network, 'instagram_feed');
    assert.equal(lang, 'es');
    return async ({ imageUrl }) => {
      assert.equal(imageUrl, 'https://x/social/media/2026-08/a.jpg');
      return 'MID1';
    };
  };
  const { published, results } = await runPublish({
    posts: [post()], published: {}, now, baseUrl: 'https://x', resolvePublisher,
  });
  assert.equal(results[0].ok, true);
  assert.equal(results[0].id, 'MID1');
  assert.equal(published.a.instagram_feed.status, 'ok');
});

test('si el publisher lanza, registra error y no marca ok', async () => {
  const resolvePublisher = () => async () => { throw new Error('rate limit'); };
  const { published, results } = await runPublish({
    posts: [post()], published: {}, now, baseUrl: 'https://x', resolvePublisher,
  });
  assert.equal(results[0].ok, false);
  assert.match(results[0].error, /rate limit/);
  assert.equal(published.a.instagram_feed.status, 'error');
});

test('sin credenciales (resolver null): omite, no rompe, no marca publicado', async () => {
  const resolvePublisher = () => null;
  const { published, results } = await runPublish({
    posts: [post()], published: {}, now, baseUrl: 'https://x', resolvePublisher,
  });
  assert.equal(results[0].ok, false);
  assert.equal(results[0].skipped, true);
  assert.deepEqual(published, {});
});

test('resolvePublisherFromEnv: null si faltan credenciales', () => {
  assert.equal(resolvePublisherFromEnv('instagram_feed', 'es', {}), null);
  assert.equal(resolvePublisherFromEnv('facebook', 'en', {}), null);
  assert.equal(resolvePublisherFromEnv('red_rara', 'es', { IG_USER_ID_ES: '1' }), null);
});

test('resolvePublisherFromEnv: devuelve función con credenciales presentes', () => {
  const ig = resolvePublisherFromEnv('instagram_feed', 'es', { IG_USER_ID_ES: '1', IG_ACCESS_TOKEN_ES: 't' });
  assert.equal(typeof ig, 'function');
  const st = resolvePublisherFromEnv('instagram_stories', 'en', { IG_USER_ID_EN: '2', IG_ACCESS_TOKEN_EN: 't' });
  assert.equal(typeof st, 'function');
  const fb = resolvePublisherFromEnv('facebook', 'en', { FB_PAGE_ID_EN: '3', FB_PAGE_TOKEN_EN: 't' });
  assert.equal(typeof fb, 'function');
});
