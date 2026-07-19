import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishFacebookPhoto } from './facebook.mjs';

test('publica foto en la página y devuelve el id (prefiere post_id)', async () => {
  const calls = [];
  const httpPost = async (url, params) => {
    calls.push({ url, params });
    return { id: '111', post_id: '111_222' };
  };
  const id = await publishFacebookPhoto(
    { pageId: '111', accessToken: 'T', imageUrl: 'https://x/a.jpg', caption: 'Hola' },
    httpPost,
  );
  assert.equal(id, '111_222');
  assert.match(calls[0].url, /111\/photos$/);
  assert.equal(calls[0].params.url, 'https://x/a.jpg');
  assert.equal(calls[0].params.caption, 'Hola');
  assert.equal(calls[0].params.access_token, 'T');
});

test('usa id si no hay post_id', async () => {
  const httpPost = async () => ({ id: 'ABC' });
  const id = await publishFacebookPhoto({ pageId: '1', accessToken: 't', imageUrl: 'u', caption: '' }, httpPost);
  assert.equal(id, 'ABC');
});

test('lanza si no viene ningún id', async () => {
  const httpPost = async () => ({});
  await assert.rejects(
    () => publishFacebookPhoto({ pageId: '1', accessToken: 't', imageUrl: 'u', caption: '' }, httpPost),
    /Facebook/,
  );
});
