import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicMediaUrl } from './media.mjs';

test('une base y path sin dobles slashes', () => {
  assert.equal(
    publicMediaUrl('social/media/a.jpg', 'https://midiajudio.github.io/mjd-redes/'),
    'https://midiajudio.github.io/mjd-redes/social/media/a.jpg',
  );
});

test('tolera slash inicial en el path', () => {
  assert.equal(
    publicMediaUrl('/social/media/a.jpg', 'https://midiajudio.github.io/mjd-redes'),
    'https://midiajudio.github.io/mjd-redes/social/media/a.jpg',
  );
});
