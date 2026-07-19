# mjd-redes — Autopublicador de redes de My Jewish Day

Robot que publica automáticamente contenido de MJD en Instagram y Facebook, en
**español e inglés**, corriendo gratis en GitHub Actions por cron. Cero
dependencias externas (Node.js nativo, `node:test`).

## Modelo: una marca, dos idiomas, todas las apps

Un mismo contenido se publica en su versión ES y EN, cada una en su cuenta:

| Idioma | Instagram | Facebook |
|---|---|---|
| **ES** | @midiajudio | facebook.com/midiajudio |
| **EN** | @myjewishday | facebook.com/myjewishday |

## Redes soportadas (campo `networks` del calendario)

- `instagram_feed` — foto al feed (con caption).
- `instagram_stories` — historia vertical 1080×1920 (sin caption, dura 24 h).
- `facebook` — foto a la página de Facebook (con caption).

El robot rutea cada post según su `lang` (`es` / `en`) a la cuenta correcta.

## Credenciales (GitHub Secrets / variables de entorno)

El sufijo del idioma va en MAYÚSCULAS (`es` → `ES`, `en` → `EN`).

| Variable | Para qué |
|---|---|
| `IG_USER_ID_ES` / `IG_USER_ID_EN` | ID de la cuenta de Instagram Business |
| `IG_ACCESS_TOKEN_ES` / `IG_ACCESS_TOKEN_EN` | Token de la página ligada a ese Instagram |
| `FB_PAGE_ID_ES` / `FB_PAGE_ID_EN` | ID de la página de Facebook |
| `FB_PAGE_TOKEN_ES` / `FB_PAGE_TOKEN_EN` | Token de esa página de Facebook |
| `PAGES_BASE_URL` | URL pública base de las imágenes (raw de este repo) |

**Credenciales ausentes = esa red/idioma se OMITE (skip), no rompe el robot.**
Así se puede ir conectando cuenta por cuenta. Ej.: si solo están las de EN, los
posts EN se publican y los ES se omiten con un aviso `SKIP` hasta que se
configuren.

## Correr los tests

```bash
node --test
```

Los tests nunca tocan la red real: la capa HTTP se inyecta como dependencia.
