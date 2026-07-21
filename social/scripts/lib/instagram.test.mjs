import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishInstagramImage } from './instagram.mjs';

// El contenedor ya listo: es el caso feliz que usan los tests de siempre.
const yaListo = async () => ({ status_code: 'FINISHED' });
const sinEsperar = { httpGet: yaListo, wait: async () => {} };

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
    sinEsperar,
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
    () => publishInstagramImage({ igUserId: '1', accessToken: 't', imageUrl: 'u', caption: '' }, httpPost, sinEsperar),
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
    sinEsperar,
  );
  assert.equal(id, 'S1');
  assert.equal(calls[0].params.media_type, 'STORIES');
  assert.equal(calls[0].params.caption, undefined);
  assert.equal(calls[0].params.image_url, 'https://x/s.jpg');
});

// --- La carrera que rompió el martes 21-jul-2026 ---
// Instagram procesa la imagen de forma asíncrona. Si se llama a media_publish
// antes de que el contenedor esté FINISHED, la API responde
// "Media ID is not available" y la publicación se pierde.

test('espera a que el contenedor esté FINISHED antes de publicar', async () => {
  const orden = [];
  let consultas = 0;
  const httpPost = async (url) => {
    if (url.endsWith('/media')) { orden.push('crear'); return { id: 'C1' }; }
    if (url.endsWith('/media_publish')) { orden.push('publicar'); return { id: 'M1' }; }
    throw new Error('url inesperada: ' + url);
  };
  const httpGet = async (url) => {
    consultas++;
    orden.push('estado');
    assert.match(url, /C1\?|C1$/); // consulta el contenedor recién creado
    return { status_code: consultas < 3 ? 'IN_PROGRESS' : 'FINISHED' };
  };

  const id = await publishInstagramImage(
    { igUserId: '1', accessToken: 'T', imageUrl: 'https://x/a.jpg', caption: 'c' },
    httpPost,
    { httpGet, wait: async () => {} },
  );

  assert.equal(id, 'M1');
  assert.equal(consultas, 3);
  assert.deepEqual(orden, ['crear', 'estado', 'estado', 'estado', 'publicar']);
});

test('no publica si el contenedor queda en ERROR', async () => {
  let publicaciones = 0;
  const httpPost = async (url) => {
    if (url.endsWith('/media')) return { id: 'C1' };
    publicaciones++;
    return { id: 'M1' };
  };
  const httpGet = async () => ({ status_code: 'ERROR' });

  await assert.rejects(
    () => publishInstagramImage(
      { igUserId: '1', accessToken: 'T', imageUrl: 'u', caption: '' },
      httpPost,
      { httpGet, wait: async () => {} },
    ),
    /ERROR/,
  );
  assert.equal(publicaciones, 0, 'no debe intentar publicar un contenedor con error');
});

test('se rinde con error claro si el contenedor nunca queda listo', async () => {
  const httpPost = async (url) => (url.endsWith('/media') ? { id: 'C1' } : { id: 'M1' });
  const httpGet = async () => ({ status_code: 'IN_PROGRESS' });

  await assert.rejects(
    () => publishInstagramImage(
      { igUserId: '1', accessToken: 'T', imageUrl: 'u', caption: '' },
      httpPost,
      { httpGet, wait: async () => {}, maxAttempts: 3 },
    ),
    /no quedó listo/,
  );
});
