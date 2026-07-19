# Buenos días, Karen ☀️ — briefing de la noche

Este documento lo dejé (y fui actualizando) mientras trabajaba de noche. Léelo con el café.

## Lo que quedó LISTO y sólido (no a medias)

1. **El robot** — vivo, probado, en GitHub (`keidelstein-gif/mjd-redes`). Publica solo por horario, tests verdes, no duplica. Maneja feed + stories + Facebook, ruteando por idioma.
2. **Las 4 cuentas conectadas con tokens PERMANENTES** (verificado, `expires_at=0`, nunca expiran):
   - ES → @midiajudio + facebook.com/midiajudio
   - EN → @myjewishday + facebook.com/myjewishday
3. **Programa anual de contenido** → `social/plan/PROGRAMA_ANUAL_CONTENIDO.md`. Pilares de las 3 apps, ritmo semanal, calendario 5787, **respeta Shabat/Yom Tov** (no se publica), feed ≠ story, voz Rav Shmuel, ES+EN.
4. **Contenido de las 3 apps estudiado** (solo lectura, no toqué nada): MJD (festividades, 107 figuras, 613 mitzvot, parashá, Tehilim, palabra hebrea…), Barkai (100 berajot + motor de momento/clima/geo), Reloj (manifiesto: "3.000 años al presente", + 10 screenshots de tienda ES/EN reales).

## Lo que intenté de noche (ver log abajo)
- Redactar contenido concreto semana por semana (voz Rav Shmuel).
- Capturas reales del simulador de las 3 apps (frágil — depende de que compilen).
- Gráficas en Claude Design.

## Lo que necesita TUS manos (no lo pude cruzar sola)
- **Login/acceso a Claude Design** si pide autenticación.
- **Decisiones de marca** sobre alguna gráfica.
- **Aprobar el primer lote** antes de que el robot publique.
- (Cualquier bloqueo lo marco abajo en el log con 🔴.)

---

## Log de la noche
_(se actualiza a medida que avanzo)_

- ✅ Programa anual escrito y subido.
- ✅ **Semana 01 de contenido** lista (`social/plan/contenido/semana-01.md`): 6 días (dom–vie) con feed + story en ES+EN, voz Rav Shmuel, evergreen. Domingo Rashí, lunes bikur jolim, martes berajá del trueno (Barkai), miércoles "el día empieza de noche" (Reloj), jueves la parashá, viernes preparando Shabat. Sábado en silencio.
- ✅ **Capturas del Reloj recogidas** (10 reales de tienda, EN+ES) → `social/media/screenshots/reloj/`. Sirven directo para las gráficas del Reloj.
- 🔴 **Capturas frescas de MJD y Barkai: necesitan tu mano.** Correr las apps frías en el simulador mostraría onboarding/login vacíos (necesitan sesión + backend para ver el contenido bueno), y compilar tocaría tus repos (que me pediste no tocar). Los QA de MJD están vacíos; los de Barkai son mockups de Claude Design. **Lo hacemos juntas:** tú abres la app con tu sesión y yo capturo las pantallas que queramos, o me dices qué screenshots existentes usar. Los mockups de Barkai (`APP Beraja/design_handoff/`) sí sirven como referencia de estilo.
- ✅ **Semana 02 de contenido** lista (`semana-02.md`): domingo Rambam, lunes shemirat halashón, martes berajá del mar (Barkai), miércoles Rosh Jódesh y la luna (Reloj), jueves la parashá en círculo, viernes la neshamá yeterá de Shabat.
- ⏳ Siguiente: semanas 03 y 04, luego intento de gráficas en Claude Design.
