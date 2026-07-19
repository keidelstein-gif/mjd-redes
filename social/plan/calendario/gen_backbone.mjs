// Genera el backbone de fechas del año MJD (exacto, vía @hebcal/core).
// Cruza: parashá, festividades, Yom Tov, ayunos, Rosh Jodesh, Omer, Shabatot
// especiales, días modernos (Shoá/Zikarón/Atzmaut/Yerushalayim) + memoriales
// civiles fijos (Shoá ONU, Embajada BA, AMIA, 7-oct, Kristallnacht).
// Salida: backbone.json (todos los días) + anchors.json (solo anclas).
// Horarios de velas/Havdalá = referencia Buenos Aires; la hora exacta del
// usuario la da la app. Diáspora (il:false) por el público Latam/global.

import { HebrewCalendar, Location, flags, HDate } from '/Users/kareneidelstein/Desktop/mjd-redes/node_modules/@hebcal/core/dist/esm/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const DIR = '/Users/kareneidelstein/Desktop/mjd-redes/social/plan/calendario';
mkdirSync(DIR, { recursive: true });

const START = new Date(2026, 6, 19);   // 19 jul 2026 (hoy)
const END   = new Date(2027, 8, 30);   // 30 sep 2027 (cubre hasta Rosh Hashaná 5788)
const loc = Location.lookup('Buenos Aires');
const F = flags;

const events = HebrewCalendar.calendar({
  start: START, end: END, isHebrewYear: false, il: false,
  candlelighting: true, location: loc, sedrot: true, omer: true,
});

const pad = n => String(n).padStart(2, '0');
const gkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

// Memoriales civiles fijos (Gregoriano)
const CIVIL = {
  '01-27': { es: 'Día Internacional en Memoria del Holocausto', en: 'Intl. Holocaust Remembrance Day', cat: 'memorial' },
  '03-17': { es: 'Atentado a la Embajada de Israel (Buenos Aires, 1992)', en: 'Israeli Embassy bombing, Buenos Aires (1992)', cat: 'memorial' },
  '07-18': { es: 'Atentado a la AMIA (Buenos Aires, 1994)', en: 'AMIA bombing, Buenos Aires (1994)', cat: 'memorial' },
  '10-07': { es: 'Masacre del 7 de octubre (2023)', en: 'October 7 massacre (2023)', cat: 'memorial' },
  '11-09': { es: 'Kristallnacht — Noche de los Cristales Rotos (1938)', en: 'Kristallnacht (1938)', cat: 'memorial' },
};

// Mapa desc(EN) → etiqueta ES + categoría (por prefijo, orden importa)
const ESMAP = [
  ['Erev Rosh Hashana', 'Erev Rosh Hashaná', 'erev'],
  ['Rosh Hashana LaBehemot', 'Rosh Hashaná de los animales', 'otro'],
  ['Rosh Hashana', 'Rosh Hashaná', 'festividad'],
  ['Leil Selichot', 'Noche de Selijot', 'preparacion'],
  ['Erev Yom Kippur', 'Erev Yom Kipur', 'erev'],
  ['Yom Kippur', 'Yom Kipur', 'festividad_solemne'],
  ['Erev Sukkot', 'Erev Sucot', 'erev'],
  ['Sukkot', 'Sucot', 'festividad'],
  ['Shmini Atzeret', 'Shminí Atzéret', 'festividad'],
  ['Simchat Torah', 'Simjat Torá', 'festividad'],
  ['Chanukah', 'Janucá', 'festividad'],
  ['Erev Purim', 'Erev Purim', 'erev'],
  ['Shushan Purim', 'Shushán Purim', 'festividad'],
  ['Purim Katan', 'Purim Katán', 'otro'],
  ['Purim', 'Purim', 'festividad'],
  ["Ta'anit Esther", 'Taanit Ester', 'ayuno'],
  ['Erev Pesach', 'Erev Pésaj', 'erev'],
  ['Pesach Sheni', 'Pésaj Shení', 'otro'],
  ['Pesach', 'Pésaj', 'festividad'],
  ['Erev Shavuot', 'Erev Shavuot', 'erev'],
  ['Shavuot', 'Shavuot', 'festividad'],
  ['Tu BiShvat', 'Tu BiShvat', 'festividad'],
  ['Lag BaOmer', 'Lag BaÓmer', 'festividad'],
  ["Tu B'Av", 'Tu BeAv', 'festividad'],
  ['Tzom Gedaliah', 'Tzom Gedaliá', 'ayuno'],
  ["Asara B'Tevet", 'Asará BeTevet (10 de Tevet)', 'ayuno'],
  ["Ta'anit Bechorot", 'Taanit Bejorot', 'ayuno'],
  ['Tzom Tammuz', 'Ayuno del 17 de Tamuz', 'ayuno'],
  ["Erev Tish'a B'Av", 'Erev Tishá BeAv', 'erev'],
  ["Tish'a B'Av", 'Tishá BeAv', 'festividad_solemne'],
  ['Yom HaShoah', 'Yom HaShoá', 'memorial'],
  ['Yom HaZikaron', 'Yom HaZikarón', 'memorial'],
  ['Yom HaAtzma', 'Yom Ha’atzmaut', 'festividad'],
  ['Yom Yerushalayim', 'Yom Yerushalayim', 'festividad'],
  ['Rosh Chodesh', 'Rosh Jodesh', 'rosh_jodesh'],
  ['Shabbat Shekalim', 'Shabat Shekalim', 'shabat_especial'],
  ['Shabbat Zachor', 'Shabat Zajor', 'shabat_especial'],
  ['Shabbat Parah', 'Shabat Pará', 'shabat_especial'],
  ['Shabbat HaChodesh', 'Shabat HaJodesh', 'shabat_especial'],
  ['Shabbat HaGadol', 'Shabat HaGadol', 'shabat_especial'],
  ['Shabbat Shuva', 'Shabat Shuvá', 'shabat_especial'],
  ['Shabbat Nachamu', 'Shabat Najamú', 'shabat_especial'],
  ['Shabbat Chazon', 'Shabat Jazón', 'shabat_especial'],
  ['Shabbat Shirah', 'Shabat Shirá', 'shabat_especial'],
];
function esFor(desc) {
  for (const [k, es, cat] of ESMAP) if (desc.startsWith(k)) return { es, cat };
  return null;
}

const days = {};
function ensure(key, greg) {
  if (!days[key]) days[key] = { date: key, dow: greg.getDay(), hebrew: null, parasha: null, omer: null, candle: null, havdalah: null, events: [], blocked: false, sober: false };
  return days[key];
}

for (const ev of events) {
  const hd = ev.getDate();
  const greg = hd.greg();
  const d = ensure(gkey(greg), greg);
  d.hebrew = hd.toString();
  const f = ev.getFlags();
  const desc = ev.getDesc();
  if (f & F.PARSHA_HASHAVUA) { d.parasha = ev.render('en').replace(/^Parashat\s+/, ''); continue; }
  if (f & F.OMER_COUNT) { d.omer = (typeof ev.omer === 'number') ? ev.omer : null; continue; }
  const ts = (typeof ev.eventTimeStr === 'string') ? ev.eventTimeStr : null;
  if (desc.startsWith('Candle lighting')) { d.candle = ts; continue; }
  if (desc.startsWith('Havdalah')) { d.havdalah = ts; continue; }
  if (desc.startsWith('Fast begins') || desc.startsWith('Fast ends')) continue;
  const es = esFor(desc);
  d.events.push({ desc, en: ev.render('en'), es: es ? es.es : null, cat: es ? es.cat : 'otro' });
  if (f & F.CHAG) d.blocked = true;
  if (f & F.MAJOR_FAST) { d.blocked = true; d.sober = true; }
  if (f & F.MINOR_FAST) d.sober = true;
  if ((f & F.MODERN_HOLIDAY) && /Shoah|Zikaron/.test(desc)) d.sober = true;
}

// Shabat (sábado) = bloqueado; sumar memoriales civiles
for (const key of Object.keys(days)) {
  const d = days[key];
  if (d.dow === 6) d.blocked = true;
  const c = CIVIL[key.slice(5)];
  if (c) { d.events.push({ desc: c.en, en: c.en, es: c.es, cat: c.cat, civil: true }); d.sober = true; }
}
// Crear el día del memorial civil si Hebcal no puso ningún evento ese día
for (const mmdd of Object.keys(CIVIL)) {
  for (const y of [2026, 2027]) {
    const key = `${y}-${mmdd}`;
    const dt = new Date(`${key}T12:00:00`);
    if (dt < START || dt > END) continue;
    const d = ensure(key, dt);
    if (!d.hebrew) d.hebrew = new HDate(dt).toString();
    if (!d.events.some(e => e.civil)) { const c = CIVIL[mmdd]; d.events.push({ desc: c.en, en: c.en, es: c.es, cat: c.cat, civil: true }); d.sober = true; }
  }
}

// Rellenar TODOS los días del rango (para asignar el ritmo a los días comunes)
for (let t = new Date(START); t <= END; t.setDate(t.getDate() + 1)) {
  const g = new Date(t);
  const d = ensure(gkey(g), g);
  if (!d.hebrew) d.hebrew = new HDate(g).toString();
}

const all = Object.values(days).sort((a, b) => a.date.localeCompare(b.date));
writeFileSync(`${DIR}/backbone.json`, JSON.stringify(all, null, 2));

// Anclas (para el calendario editorial)
const anchorCats = new Set(['festividad', 'festividad_solemne', 'memorial', 'shabat_especial', 'ayuno', 'erev']);
const anchors = [];
for (const d of all) for (const e of d.events) {
  if (anchorCats.has(e.cat) || e.civil) anchors.push({ date: d.date, dow: DOW[d.dow], es: e.es || e.en, cat: e.cat, blocked: d.blocked, sober: d.sober });
}
writeFileSync(`${DIR}/anchors.json`, JSON.stringify(anchors, null, 2));

// Resumen legible (colapsa fiestas multi-día y omite erev/rosh-jodesh)
console.log('DÍAS:', all.length, '| ANCLAS:', anchors.length, '| Rango:', all[0].date, '→', all.at(-1).date);
console.log('\n=== LÍNEA DE TIEMPO (festividades · solemnes · memoriales · shabatot especiales · ayunos) ===');
let last = '';
for (const a of anchors) {
  if (a.cat === 'erev') continue;
  if (a.es === last) continue;
  last = a.es;
  const tag = { festividad_solemne: 'SOLEMNE', memorial: 'MEMORIAL', shabat_especial: 'SHABAT·ESP', ayuno: 'AYUNO', festividad: 'FIESTA' }[a.cat] || a.cat.toUpperCase();
  console.log(`${a.date} ${a.dow}  [${tag.padEnd(9)}]  ${a.es}${a.blocked ? '  · no-publicar' : ''}${a.sober ? '  · sobrio' : ''}`);
}
