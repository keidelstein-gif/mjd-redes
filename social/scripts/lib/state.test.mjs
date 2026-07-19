import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPublished, markPublished } from './state.mjs';

test('isPublished: false cuando no existe', () => {
  assert.equal(isPublished({}, 'a', 'instagram_feed'), false);
});

test('markPublished marca ok y isPublished lo detecta', () => {
  const p = markPublished({}, 'a', 'instagram_feed', { status: 'ok', id: '1', ts: 't' });
  assert.equal(isPublished(p, 'a', 'instagram_feed'), true);
});

test('estado error NO cuenta como publicado', () => {
  const p = markPublished({}, 'b', 'instagram_feed', { status: 'error', error: 'x', ts: 't' });
  assert.equal(isPublished(p, 'b', 'instagram_feed'), false);
});

test('markPublished no muta el original', () => {
  const orig = {};
  const next = markPublished(orig, 'a', 'instagram_feed', { status: 'ok' });
  assert.deepEqual(orig, {});
  assert.notEqual(orig, next);
});
