// Convierte backbone.json en el calendario editorial del año:
// cada día con feed + story según el ritmo semanal, con overrides por
// festividad (se publica en el erev), memorial (sobrio), ayuno, Shabat
// (silencio), parashá de la semana, Omer y bienvenida de mes (Rosh Jodesh).
// Salida: CALENDARIO_ANUAL.md (por mes, con el espíritu del mes) + plan.json.

import { readFileSync, writeFileSync } from 'node:fs';
const DIR = '/Users/kareneidelstein/Desktop/mjd-redes/social/plan/calendario';
const days = JSON.parse(readFileSync(`${DIR}/backbone.json`, 'utf8'));

const DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const RHYTHM = {
  0: ['Figura del día / Tzadik — "un eslabón"', 'Palabra hebrea + encuesta'],
  1: ['Mitzvá / concepto (rigor con calidez)', '"¿Sabías que…?" del concepto'],
  2: ['Berajá del momento (Barkai)', '"¿Qué ves ahora? hay una berajá" (toca)'],
  3: ['3.000 años (Reloj) / efeméride', 'Historia en 3 tarjetas'],
  4: ['Bajada de la parashá', '"¿Qué detalle te incomoda?" (Preguntas)'],
  5: ['Preparando Shabat', '"Sube tus velas" + cuenta regresiva a las velas'],
  6: ['— silencio (Shabat) —', '—'],
};
const SPIRIT = {
  '2026-07': '**Av — del duelo al consuelo.** Tishá BeAv (la caída) y enseguida Shabat Najamú: «consuélense, consuélense, pueblo mío» (Ishaiahu 40).',
  '2026-08': '**Av → Elul.** Entra Elul: el shofar suena cada mañana. «El Rey está en el campo» — HaShem se deja encontrar de cerca.',
  '2026-09': '**Elul → Tishrei.** Los Yamim Noraim: Rosh Hashaná y Yom Kipur. El mes más solemne y más esperanzado del año.',
  '2026-10': '**Tishrei.** Sucot, Shminí Atzéret, Simjat Torá: de la solemnidad a la alegría plena. Después, Jeshván sin fiestas.',
  '2026-11': '**Jeshván → Kislev.** «Mar Jeshván», el mes sin festividad — y hacia el final, la primera luz de Kislev.',
  '2026-12': '**Kislev → Tevet.** Janucá: la luz que crece en la noche más larga. *Pirsumei nisá*: publicar el milagro.',
  '2027-01': '**Tevet → Shvat.** 10 de Tevet (memoria) y, al cierre, Tu BiShvat: el árbol que despierta en pleno invierno.',
  '2027-02': '**Shvat → Adar.** «Mishenijnás Adar, marbín besimjá» — al entrar Adar, se multiplica la alegría.',
  '2027-03': '**Adar → Nisán.** Purim y los cuatro Shabatot especiales que preparan Pésaj (Shekalim · Zajor · Pará · HaJodesh).',
  '2027-04': '**Nisán.** Pésaj: la libertad. «En cada generación, cada quien debe verse como si él mismo hubiera salido de Egipto».',
  '2027-05': '**Iyar.** La cuenta del Omer, la sanación, y los días modernos: Yom HaShoá, Yom HaZikarón, Yom Ha’atzmaut.',
  '2027-06': '**Siván.** Shavuot: recibir la Torá. Yom Yerushalayim.',
  '2027-07': '**Tamuz → Av.** Comienzan las tres semanas de duelo hacia Tishá BeAv. AMIA (18 de julio).',
  '2027-08': '**Av.** Tishá BeAv y el consuelo de Najamú; Tu BeAv, el día del amor judío.',
  '2027-09': '**Elul → Tishrei 5788.** El ciclo vuelve a empezar: Elul y el umbral de un año nuevo.',
};

const sats = days.filter(d => d.dow === 6 && d.parasha).map(d => ({ date: d.date, p: d.parasha }));
const weekParasha = date => (sats.find(s => s.date >= date) || {}).p || null;
const labels = d => d.events.filter(e => e.es || e.en).map(e => e.es || e.en).join(' · ');

let md = `# Calendario anual de contenido — MJD\n\n`;
md += `**Rango:** ${days[0].date} → ${days.at(-1).date} · **${days.length} días.** Generado del backbone exacto (Hebcal, diáspora; horarios de velas ref. Buenos Aires — la hora exacta la da la app).\n\n`;
md += `Cruza: parashá · festividades · Yom Tov · ayunos · Rosh Jodesh · Omer · Shabatot especiales · días modernos · memoriales civiles. **No se publica en Shabat ni en Yom Tov** — el contenido de la fiesta va en su *erev*. Voz Rav Shmuel · dinámicas de historias → \`DINAMICAS_HISTORIAS.md\` · hashtags → \`HASHTAGS.md\`.\n`;

let cur = '', pub = 0;
const plan = [];
for (const d of days) {
  const ym = d.date.slice(0, 7);
  if (ym !== cur) {
    cur = ym; const [y, m] = ym.split('-');
    md += `\n## ${MES[+m - 1]} ${y}\n> ${SPIRIT[ym] || ''}\n\n| Fecha | Día | Hebreo | Feed | Story | Anclas / notas |\n|---|---|---|---|---|---|\n`;
  }
  const has = c => d.events.some(e => e.cat === c);
  let feed, story, note = labels(d);
  if (d.dow === 6) { feed = '— silencio (Shabat) —'; story = '—'; }
  else if (d.blocked) { feed = '— silencio (Yom Tov) —'; story = '—'; note += ' · se publica en el *erev*'; }
  else if (has('memorial')) { feed = 'MEMORIAL — reflexión sobria (ner neshamá)'; story = '"Enciende una vela por su memoria" (sin gamificar)'; }
  else if (has('ayuno')) { feed = 'Ayuno — reflexión sobria y breve'; story = 'Nota sobria (sin encuesta festiva)'; }
  else if (has('erev') || has('festividad')) { feed = 'FESTIVIDAD — lámina de saludo + bajada'; story = 'Dinámica de la festividad (ver DINAMICAS)'; }
  else {
    [feed, story] = RHYTHM[d.dow];
    if (d.dow === 4) { const p = weekParasha(d.date); if (p) { feed = `Parashá **${p}** — bajada a la semana`; story = `Parashá ${p}: "¿qué detalle te incomoda?"`; } }
  }
  const publish = !(d.dow === 6 || d.blocked);
  if (publish && has('rosh_jodesh')) story += ' · + Bienvenida de mes';
  if (publish && typeof d.omer === 'number') story += ` · + Omer ${d.omer} ("contamos juntos")`;
  if (publish) pub++;
  md += `| ${d.date} | ${DOW[d.dow]} | ${d.hebrew} | ${feed} | ${story} | ${note} |\n`;
  plan.push({ date: d.date, dow: DOW[d.dow], hebrew: d.hebrew, publish, feed, story, anchors: d.events.filter(e => e.es || e.en).map(e => e.es || e.en), sober: d.sober, parasha: weekParasha(d.date) });
}
writeFileSync(`${DIR}/CALENDARIO_ANUAL.md`, md);
writeFileSync(`${DIR}/plan.json`, JSON.stringify(plan, null, 2));
console.log('OK · CALENDARIO_ANUAL.md +', plan.length, 'días · publicables:', pub, '· silencio (Shabat/Yom Tov):', plan.length - pub);
