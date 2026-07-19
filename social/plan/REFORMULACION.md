# Reformulación del motor de contenido — de la grilla fija a la riqueza real

**Qué estaba mal:** el ritmo semanal repetía las mismas 6 casillas (dom Figura, lun
Mitzvá, mar Berajá, mié Reloj, jue Parashá, vie Shabat) durante todo el año. Con una
app que tiene **154 archivos de contenido y 319 pantallas**, eso era la ley del mínimo
esfuerzo. Se reemplaza por dos leyes.

## Ley 1 · Variedad — rotar por las venas reales de la app
No hay 6 pilares: hay ~30 venas. Cada día saca de una distinta; **ninguna semana se
parece a otra** (regla: no repetir una vena en ≥14 días, salvo la parashá y el cielo,
que son ancla semanal/diaria).

| Familia | Venas (cada una = tipo de pieza) |
|---|---|
| **Torá y estudio** | parashá (con su *frase de la semana*), haftará, Daf Yomi, Pirkei Avot, Kohelet, Talmud (masejtot) |
| **Lengua y memoria** | palabra hebrea + raíz, alef-bet (la letra), **yiddish**, **boca de la bobe**, **ladino**, **canción del día**, zmirot |
| **Alma y carácter** | **mussar** (middot: emet, savlanut, anavá…), Kabalá, sefirot, **escalera de Rambam** / tzedaká / jésed, hilo rojo |
| **Vida y costumbre** | **porqués** (¿por qué la mezuzá inclinada?…), ciclo de vida, nombre/cadena, **carta astral hebrea**, mazal del mes, «un día como hoy» |
| **Personas y relatos** | figuras (ellos/ellas), tzadikim por yahrzeit, **relatos**, inspiración, **kedoshim** (AMIA, 7-oct, jayalim, «un nombre una vida») |
| **Momento y práctica** | **berajot del momento (Barkai) → el umbral por la ventana**, zmanim/Reloj, sidur, kashrut, festividades con sus mini-mundos (juegos, recetas, cuentos) |
| **Juego y comunidad** | trivia, **adivina quién**, quizzes, dreidel/grogger (en fiesta), mesa compartida |

## Ley 2 · La segunda bajada — el oro, no la pelota devuelta
Toda pieza entrega **la inteligencia concreta de esta semana**, no la costumbre en
abstracto. Nunca «deja que una línea te haga una pregunta»; sí «**la frase más
importante de esta semana es X, y para tu hoy significa Y**». La fuente antigua →
el link al presente. Sin eso, se reescribe.

## El cielo, todos los días — la rutina Barkai (ver `social/barkai/UMBRAL.md`)
El slot diario de «momento» ya no es genérico: `reporte_berajot.mjs` mira el **clima
real** + el **cielo hebreo** y elige la berajá que aplica (tormenta, arcoíris, primera
lluvia, luna, estrellas, árboles en flor), con sus **excepciones** (Nueve Días, Shabat,
Yom Tov). Plantilla: «asómate a la ventana → esto pasa hoy → hace 3.000 años se dijo
esto → la berajá → si lo viste, dila → qué te deja». Siempre en condicional.

## Peso estacional (la inteligencia del mes ya está en el calendario)
- **Elul:** mussar + selijot + el shofar de la mañana.
- **Tishrei:** teshuvá, simanim, la alegría de la Torá.
- **Omer:** sefirot + una middá por semana + el conteo.
- **En fiesta:** sus mini-mundos (juegos, recetas, cuentos, trivia de esa festividad).
- **Tamuz–Av:** las tres semanas, del duelo al consuelo.

## Ejemplo — dos semanas SIN repetir vena (muestra del motor nuevo)

**Semana A**
- Dom · **Mussar**: la middá de *savlanut* (paciencia) — un gesto hoy, con su prompt.
- Lun · **Porqué**: ¿por qué la mezuzá va inclinada? (Rashí vs. Rabeinu Tam → cómo se honra un desacuerdo).
- Mar · **Cielo/Barkai**: la berajá del día según el clima real.
- Mié · **Boca de la bobe**: un refrán yidish + su reflexión.
- Jue · **Parashá**: la frase más importante de esta semana + su link.
- Vie · **Preparando Shabat**: con la hora real de las velas (Reloj).

**Semana B** (todo distinto)
- Dom · **Escalera de Rambam**: los ocho niveles de tzedaká — ¿en cuál estás?
- Lun · **Palabra hebrea**: una palabra, su raíz, cómo vive hoy (quiz en story).
- Mar · **Cielo/Barkai**: la berajá del día.
- Mié · **Relato / kedoshim**: «un nombre, una vida».
- Jue · **Parashá**: la frase de la semana.
- Vie · **Canción del día** + preparar Shabat.

Y una **Semana C**: Pirkei Avot · alef-bet (la letra) · cielo · carta astral/mazal del mes · parashá · adivina quién (juego) + Shabat. Nunca la misma cara.
