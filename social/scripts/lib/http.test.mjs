import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graphUrl, httpPostForm } from './http.mjs';

test('graphUrl arma la URL con la versión', () => {
  assert.equal(graphUrl('123/media'), 'https://graph.facebook.com/v23.0/123/media');
});

test('httpPostForm devuelve el json en éxito', async () => {
  const fetchImpl = async () => ({ ok: true, json: async () => ({ id: 'X' }) });
  const r = await httpPostForm('https://u', { a: '1' }, { fetchImpl });
  assert.equal(r.id, 'X');
});

test('httpPostForm lanza cuando la API responde error', async () => {
  const fetchImpl = async () => ({ ok: true, json: async () => ({ error: { message: 'boom' } }) });
  await assert.rejects(() => httpPostForm('https://u', { a: '1' }, { fetchImpl }), /boom/);
});
