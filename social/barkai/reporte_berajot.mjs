// RUTINA DIARIA — "Hay una berajá para este momento" (umbral por la ventana).
// Cruza el clima real de hoy (open-meteo, gratis) + el cielo hebreo (Hebcal)
// y devuelve la(s) berajá(s) que aplican HOY, con su gatillo y sus EXCEPCIONES
// halájicas (Nueve Días, Shabat, Yom Tov). Réplica del motor de Barkai
// (momento_engine.dart). Regla de oro: SIEMPRE en condicional — "si lo viste".
//
// Uso: node social/barkai/reporte_berajot.mjs
// Salida: reporte del día por ciudad + la berajá destacada + semilla de copy.

import { HDate } from '/Users/kareneidelstein/Desktop/mjd-redes/node_modules/@hebcal/core/dist/esm/index.js';

// Ciudades de la audiencia (ES Latam + EN global + Jerusalén de referencia).
const CIUDADES = [
  ['Buenos Aires', -34.61, -58.38],
  ['Santiago', -33.45, -70.66],
  ['Ciudad de México', 19.43, -99.13],
  ['Jerusalén', 31.78, 35.22],
  ['Nueva York', 40.71, -74.0],
];

// Berajot del cielo/tiempo (texto y fuente verificados con el dataset de Barkai).
const BER = {
  shekojo: { he: 'שֶׁכֹּחוֹ וּגְבוּרָתוֹ מָלֵא עוֹלָם', tr: 'Baruj atá Adonai… shekojó ugvurató malé olam.', es: 'cuya fuerza y poder llenan el mundo', fuente: 'Berajot 59a · SA OJ 227:1', gatillo: 'trueno' },
  osemaase: { he: 'עֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית', tr: 'Baruj atá Adonai… osé maasé vereshit.', es: 'que hace la obra de la creación', fuente: 'Berajot 59a · SA OJ 227:1', gatillo: 'relámpago / viento / montaña / río / estrella' },
  zojer: { he: 'זוֹכֵר הַבְּרִית וְנֶאֱמָן בִּבְרִיתוֹ וְקַיָּם בְּמַאֲמָרוֹ', tr: 'Baruj atá Adonai… zojer habrit, veneemán bivritó, vekayám bemaamaró.', es: 'que recuerda el pacto, es fiel a él y sostiene su palabra', fuente: 'Berajot 59a · SA OJ 229:1', gatillo: 'arcoíris' },
  modim: { he: 'מוֹדִים אֲנַחְנוּ לָךְ עַל כָּל טִפָּה וְטִפָּה', tr: 'Modim anajnu Laj… al kol tipá vetipá.', es: 'te agradecemos por cada gota', fuente: 'Berajot 59b · SA OJ 221', gatillo: 'lluvia (buena, tras sequía)' },
  hayam: { he: 'עֹשֶׂה אֶת הַיָּם הַגָּדוֹל', tr: 'Baruj atá Adonai… osé et hayam hagadol.', es: 'que hizo el gran mar', fuente: 'SA OJ 228:1 (una vez cada 30 días)', gatillo: 'ver el mar/océano' },
  ilanot: { he: 'שֶׁלֹּא חִסַּר בְּעוֹלָמוֹ כְּלוּם… וְאִילָנוֹת טוֹבִים', tr: 'Baruj atá Adonai… shelo jisar beolamó klum… veilanot tovim.', es: 'a cuyo mundo no le falta nada, y creó árboles buenos', fuente: 'Berajot 43b · SA OJ 226', gatillo: 'árboles frutales en flor (una vez al año)' },
  levana: { he: 'בִּרְכַּת הַלְּבָנָה', tr: 'Birkat halevaná (Kidush Levaná).', es: 'la bendición de la luna nueva', fuente: 'SA OJ 426 (noches 4–15, con cielo visible)', gatillo: 'la luna creciente, de noche' },
  kojavim: { he: 'עֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית', tr: 'Baruj atá Adonai… osé maasé vereshit.', es: 'que hace la obra de la creación', fuente: 'Berajot 58b · SA OJ 227:1', gatillo: 'estrella fugaz / cometa' },
  shehecheyanu: { he: 'שֶׁהֶחֱיָנוּ וְקִיְּמָנוּ וְהִגִּיעָנוּ לַזְּמַן הַזֶּה', tr: 'Baruj atá Adonai… shehejeyanu vekiyemanu vehiguianu lazmán hazé.', es: 'que nos diste vida, nos sostuviste y nos hiciste llegar', fuente: 'Berajot 54a · SA OJ 225:3', gatillo: 'la primera fruta de la temporada' },
};

// Picos anuales de lluvias de estrellas (±1 día; de lluvias_estrellas de Barkai).
const METEOROS = [
  ['Cuadrántidas', 1, 3], ['Líridas', 4, 22], ['Eta Acuáridas', 5, 6],
  ['Delta Acuáridas', 7, 29], ['Perseidas', 8, 12], ['Oriónidas', 10, 21],
  ['Leónidas', 11, 17], ['Gemínidas', 12, 14],
];

// WMO weather_code → condición del cielo (réplica de derivarHint de Barkai).
function condicion(code, viento) {
  if (code >= 95) return 'tormenta';           // 95-99 tormenta eléctrica
  if (code >= 61 && code <= 82) return 'lluvia'; // 61-82 lluvia/chubascos
  if (viento >= 40) return 'viento';            // ruaj se'ará
  if (code === 45 || code === 48) return 'niebla';
  if (code <= 1) return 'despejado';
  return 'nubes';
}

async function clima(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m,cloud_cover&timezone=auto`;
  const r = await fetch(url);
  const c = (await r.json()).current;
  return { temp: c.temperature_2m, precip: c.precipitation, code: c.weather_code, viento: c.wind_speed_10m, nubes: c.cloud_cover, cond: condicion(c.weather_code, c.wind_speed_10m) };
}

const hoy = new Date();
const hd = new HDate(hoy);
const mes = hd.getMonthName();
const dia = hd.getDate();
const esAv = mes === 'Av';
const nueveDias = esAv && dia <= 9;                 // Kidush Levaná espera
const meteoroHoy = METEOROS.find(([, m, d]) => m === hoy.getMonth() + 1 && Math.abs(d - hoy.getDate()) <= 1);
const lunaVentana = dia >= 4 && dia <= 14;

console.log(`\n════ REPORTE DEL DÍA · ${hoy.toISOString().slice(0, 10)} · ${dia} de ${mes} ${hd.getFullYear()} ════\n`);

for (const [nombre, lat, lon] of CIUDADES) {
  const w = await clima(lat, lon);
  const berajot = [];
  // Prioridad 0 — el cielo está haciendo algo (gatillo directo)
  if (w.cond === 'tormenta') berajot.push(['shekojo', 'hay tormenta'], ['osemaase', 'hay tormenta']);
  else if (w.cond === 'lluvia') berajot.push(['modim', 'está lloviendo']);
  else if (w.cond === 'viento') berajot.push(['osemaase', 'viento fuerte (se\'ará)']);
  // Prioridad 2 — cielo/calendario (con excepciones)
  const cieloVisible = w.cond === 'despejado' || w.cond === 'nubes';
  if (lunaVentana && cieloVisible && !nueveDias) berajot.push(['levana', 'luna creciente, cielo visible']);
  if (meteoroHoy && w.cond === 'despejado') berajot.push(['kojavim', `pico de ${meteoroHoy[0]} esta noche`]);
  if (mes === 'Nisan') berajot.push(['ilanot', 'Nisán: árboles en flor']);

  const notas = [];
  if (lunaVentana && nueveDias) notas.push('luna en ventana, pero espera a después de Tishá BeAv');
  if (w.cond === 'despejado') notas.push('cielo despejado: buen día para invitar a mirar arriba');

  const destino = berajot.length ? berajot.map(([k, why]) => `${BER[k].he.split(' ').slice(-2).join(' ')} (${why})`).join(' · ') : '— sin gatillo del cielo (cae berajá cotidiana/estacional) —';
  console.log(`${nombre.padEnd(18)} ${String(w.temp).padStart(5)}°C · ${w.cond.padEnd(9)} · nubes ${String(w.nubes).padStart(3)}% · viento ${w.viento}km/h`);
  console.log(`   → ${destino}`);
  if (notas.length) console.log(`   ⚑ ${notas.join(' | ')}`);
}

console.log(`\n── Estado hebreo global ──`);
console.log(`  Kidush Levaná: ${lunaVentana ? (nueveDias ? 'EN ESPERA (Nueve Días → tras Tishá BeAv)' : 'ACTIVO de noche con cielo visible') : 'fuera de ventana (día ' + dia + ')'}`);
console.log(`  Lluvia de estrellas hoy: ${meteoroHoy ? meteoroHoy[0] + ' (pico)' : 'no'}`);
console.log(`  Birkat Ilanot (Nisán): ${mes === 'Nisan' ? 'temporada activa' : 'fuera de temporada'}`);
