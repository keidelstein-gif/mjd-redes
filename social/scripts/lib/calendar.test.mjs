import { test } from 'node:test';
import assert from 'node:assert/strict';
import { duePublishTasks } from './calendar.mjs';

const post = (over = {}) => ({
  id: 'a',
  status: 'approved',
  datetime: '2026-08-01T09:00:00-04:00', // = 13:00Z
  networks: ['instagram_feed'],
  media: 'social/media/2026-08/a.jpg',
  caption: 'A',
  ...over,
});

test('incluye aprobado + vencido + no publicado', () => {
  const now = new Date('2026-08-01T13:30:00Z');
  const tasks = duePublishTasks({ posts: [post()], published: {}, now });
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].postId, 'a');
  assert.equal(tasks[0].network, 'instagram_feed');
});

test('excluye no aprobado', () => {
  const now = new Date('2026-08-01T13:30:00Z');
  assert.equal(duePublishTasks({ posts: [post({ status: 'pending' })], published: {}, now }).length, 0);
});

test('excluye futuro', () => {
  const now = new Date('2026-08-01T12:00:00Z'); // antes de 13:00Z
  assert.equal(duePublishTasks({ posts: [post()], published: {}, now }).length, 0);
});

test('excluye ya publicado (idempotencia)', () => {
  const now = new Date('2026-08-01T13:30:00Z');
  const published = { a: { instagram_feed: { status: 'ok', id: '1', ts: 't' } } };
  assert.equal(duePublishTasks({ posts: [post()], published, now }).length, 0);
});
