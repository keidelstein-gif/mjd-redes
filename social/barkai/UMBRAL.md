# El umbral por la ventana — rutina diaria de berajot (Barkai)

**La idea (Karen):** cada día miro el clima real; si el cielo (o la luna, o la
temporada) está haciendo algo que tiene su berajá, invito al lector a **asomarse
a la ventana como a un umbral** entre su hoy y los 3.000 años, y a **decirla**.

**Regla de oro halájica (de Barkai):** siempre en **condicional** — «si lo viste /
si lo oíste». Nunca se afirma que la persona está obligada. El sensor solo dice
«está pasando algo»; la berajá vive en el texto revisado.

**Motor:** `reporte_berajot.mjs` cruza `open-meteo` (clima real, gratis) + `@hebcal/core`
(cielo hebreo) y devuelve la berajá que aplica, con sus excepciones. Corre cada mañana.

---

## Mapa fenómeno ↔ berajá (las del cielo/tiempo, estudiadas del catálogo de 101)

| Por la ventana | Berajá | Corazón hebreo | Fuente | Ventana / excepción |
|---|---|---|---|---|
| **Trueno** | shekojó ugvurató | כֹּחַ | Berajot 59a · OJ 227 | una vez por tormenta |
| **Relámpago / cielo que ruge** | osé maasé vereshit | בְּרֵאשִׁית | Berajot 59a · OJ 227 | |
| **Arcoíris** | zojer habrit | קֶשֶׁת | Berajot 59a · OJ 229 | al verlo |
| **Primera lluvia tras sequía** | modim (gratitud) | טִפָּה | Berajot 59b · OJ 221 | tras ≥30 días secos |
| **Viento que sobrecoge** (se'ará) | osé maasé vereshit | רוּחוֹת | OJ 227 | ráfagas fuertes |
| **Ver el mar / océano** | osé et hayam hagadol | הַיָּם | OJ 228:1 | una vez cada 30 días |
| **Gran río** | osé maasé vereshit | נְהָרוֹת | OJ 228 | cada 30 días |
| **Montaña / desierto imponente** | osé maasé vereshit | הָרִים | OJ 228 | cada 30 días |
| **Luna creciente** (noche, cielo visible) | Kidush Levaná | לְבָנָה | OJ 426 | días 4–15 · **NO** Shabat/Yom Tov · **NO** en los Nueve Días (espera tras Tishá BeAv) |
| **Estrella fugaz / cometa** | osé maasé vereshit | כּוֹכָבִים | Berajot 58b · OJ 227 | de noche, cielo despejado |
| **Árboles frutales en flor** | Birkat Ilanot | אִילָנוֹת | Berajot 43b · OJ 226 | una vez al año (Nisán; 🟡 hemisferio sur ~Tishrei) |
| **Primera fruta de la temporada** | shehecheyanu | זְמַן | OJ 225:3 | primera vez del año |
| **Terremoto** | osé maasé vereshit | רַעַשׁ | OJ 227 | |
| **El sol a su punto de origen** | Birkat Hajamá | חַמָּה | OJ 229 | cada 28 años (rarísimo) |

Prioridad del motor (de `momento_engine`): **cielo haciendo algo** > lugar (mar/río/montaña) > Shabat > calendario (fiesta/luna/estrellas/Ilanot) > la franja del día.

---

## La plantilla — «asómate a la ventana»

1. **Asómate** — invitación a mirar por la ventana (el umbral).
2. **Qué está pasando** hoy en el cielo (real, del reporte) — en condicional.
3. **El puente de 3.000 años** — cuando el pueblo vio/oyó esto, dijo estas palabras.
4. **La berajá** — hebreo + fonética + qué significa.
5. **Si hoy lo viste, dila** — se la entrega, sin obligar.
6. **La segunda bajada** — qué te deja ese instante hoy.

---

## Ejemplos

### Hoy (5 de Av · la luna que espera) — pieza real del reporte
Asómate a la ventana esta noche: la luna está creciendo. Hay una berajá de tres mil años para saludarla —el *Kidush Levaná*— que se dice de pie, mirándola, como quien recibe a alguien esperado. Pero esta semana no la decimos. Estamos en los Nueve Días, el duelo que lleva a Tishá BeAv, y una bendición que se dice con alegría no cabe en el luto (Shulján Aruj OJ 426). Así de fino es el tiempo judío: hasta el cielo espera su momento. En unos días, cuando Av gire del duelo al consuelo, saldremos a mirarla y a bendecirla. Por ahora solo mírala — y guarda las palabras para cuando la alegría vuelva a estar permitida.

### Tormenta (evergreen, cuando el reporte la gatilla)
Asómate a la ventana: truena. Hace miles de años, cuando el cielo rugía así, el pueblo judío no corría a taparse los oídos — se detenía y decía seis palabras: «*Baruj atá… shekojó ugvurató malé olam*» — bendito el que llena el mundo con su fuerza y su poder (Berajot 59a). No es una berajá de miedo: es de asombro. Convierte el susto en un instante de reverencia. Si hoy oíste el trueno por tu ventana, esa palabra es tuya. El mismo cielo que sobrecogió a tus abuelos te está hablando a ti.

### Arcoíris (evergreen)
Asómate: hay un arcoíris. La Torá lo cuenta como la primera promesa del mundo — la señal que HaShem le dio a Noé de que no volvería a empezar de cero (Bereshit 9). Por eso, si lo ves, hay una berajá que no celebra los colores: agradece que **el pacto sigue en pie** — «*zojer habrit*», el que recuerda el pacto (Berajot 59a). Un arco de luz que a todos les parece bonito, a ti además te recuerda una palabra dada hace tres mil años y todavía cumplida.

---

## Cadencia
- **Mañana:** corre `reporte_berajot.mjs` → berajá(s) del día por ciudad + estado del cielo.
- **Si hay gatillo del cielo** (tormenta, lluvia, arcoíris, luna válida, meteoros, Ilanot) → esa es la pieza «ventana» del día.
- **Si el cielo está quieto** → cae la berajá cotidiana/estacional (el sol del amanecer, las estrellas de una noche despejada, la fruta de la temporada) o la nota del calendario (como la luna que espera).
- v2: el robot puede correr esto solo (open-meteo no necesita key) y proponer la pieza para aprobar.
