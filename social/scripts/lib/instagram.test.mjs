import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishInstagramImage } from './instagram.mjs';

test('crea contenedor y publica, devuelve el media id', async () => {
  const calls = [];
  const httpPost = async (url, params) => {
    calls.push({ url, params });
    if (url.endsWith('/media')) return { id: 'CONTAINER1' };
    if (url.endsWith('/media_publish')) return { id: 'MEDIA1' };
    throw new Error('url inesperada: ' + url);
  };
  const id = await publishInstagramImage(
    { igUserId: '17841400000000000', accessToken: 'TOK', imageUrl: 'https://x/a.jpg', caption: 'Hola' },
    httpPost,
  );
  assert.equal(id, 'MEDIA1');
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /17841400000000000\/media$/);
  assert.equal(calls[0].params.image_url, 'https://x/a.jpg');
  assert.equal(calls[0].params.caption, 'Hola');
  assert.equal(calls[0].params.access_token, 'TOK');
  assert.match(calls[1].url, /media_publish$/);
  assert.equal(calls[1].params.creation_id, 'CONTAINER1');
});

test('lanza si no vuelve container id', async () => {
  const httpPost = async () => ({});
  await assert.rejects(
    () => publishInstagramImage({ igUserId: '1', accessToken: 't', imageUrl: 'u', caption: '' }, httpPost),
    /container/,
  );
});

test('story: envía media_type=STORIES y sin caption', async () => {
  const calls = [];
  const httpPost = async (url, params) => {
    calls.push({ url, params });
    if (url.endsWith('/media')) return { id: 'C1' };
    if (url.endsWith('/media_publish')) return { id: 'S1' };
    throw new Error('url inesperada: ' + url);
  };
  const id = await publishInstagramImage(
    { igUserId: '99', accessToken: 'T', imageUrl: 'https://x/s.jpg', caption: 'no va', mediaType: 'STORIES' },
    httpPost,
  );
  assert.equal(id, 'S1');
  assert.equal(calls[0].params.media_type, 'STORIES');
  assert.equal(calls[0].params.caption, undefined);
  assert.equal(calls[0].params.image_url, 'https://x/s.jpg');
});
