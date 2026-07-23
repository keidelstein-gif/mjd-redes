# Laminador MDJ

Compone la lámina en **tres capas separadas**, para que el texto nunca salga feo:

1. **Escena (foto)** — la genera ChatGPT/IA. Es lo único que la IA hace bien. **Sin texto, sin marca.**
2. **Texto** — lo renderiza el **navegador** (Chrome headless) con las tipografías reales
   (Frank Ruhl Libre para hebreo/yidish, Plus Jakarta Sans para lo latino). El hebreo con
   vocales y el yidish salen **perfectos** — esto es lo que la IA se comía.
3. **Overlay de marca** — el PNG canónico transparente del `MDJ Brand System v1.0`
   (חי + footer + badges). Se pega encima, **nunca se regenera**.

## Por qué

La IA (GPT-Image) hace fotos espectaculares pero **descoloca el texto** (hebreo, yidish,
frases). Reintentar no lo arregla: es una debilidad estructural. Separando las capas, la IA
solo pone la foto y el texto lo pone tipografía real → correcto siempre, sin reintentos.

## Uso

```bash
python3 laminar.py manifest.json
```

`manifest.json` es una lista de piezas. Cada pieza:

```json
{
  "id": "bobe-feed-es",
  "format": "feed",              // feed (1080x1350) | story (1080x1920)
  "lang": "es",                  // es -> midiajudio | en -> myjewishday
  "scene": "ruta/escena.png",    // foto sin texto ni marca
  "out": "ruta/salida.png",
  "eyebrow": "EN BOCA DE LA BOBE",
  "big": "עֶס, עֶס — דוּ ביסט צוּ דאַר",   // hebreo/yidish (rtl)
  "translit": "ES, ES · DU BIST TSU DAR",
  "frase": "«…»",
  "sticker": "¿…?",              // opcional, solo stories
  "top": "53%", "big_size": 72,  // ajustes finos opcionales de layout
  "bg_pos": "center 42%"
}
```

El overlay se elige solo por `format` + `lang` desde `assets/overlay_<format>_<lang>.png`.

## Regla de oro

La escena se pide **sin texto y sin marca** (ver `PROMPT_ESCENA.md`). Si la escena ya trae
texto de la IA, no sirve: se pide de nuevo limpia.
