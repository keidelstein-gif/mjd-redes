# Auditoría de contenido contra la línea editorial

**Método:** cada pieza pasa el GATE de `LINEA_EDITORIAL.md` §12. Veredicto: ✅ pasa · ⚠️ ajuste · ❌ reescribe. Honestidad calibrada: se reconoce lo bueno y se marca lo flojo con nombre y apellido.

## Hallazgos transversales (las fallas que marcó Karen + una más)

1. **❌ Variedad (Ley 1) — la grilla repetida.** Las 4 semanas del evergreen usan la MISMA estructura: dom figura · lun mitzvá · mar berajá · mié Reloj · jue parashá · vie Shabat. Nunca rotan a las venas ignoradas: **mussar, boca de la bobe, ladino, porqués, canción del día, escalera de Rambam, carta astral, kedoshim, trivia/adivina quién**. → Reformular la estructura a rotación de venas (`REFORMULACION.md`); no repetir vena en 14 días.

2. **❌ La segunda bajada (Ley 2) — las 4 parashot del jueves.** Las cuatro cierran con la pelota devuelta: «[parashá]» + «deja que una línea te haga una pregunta / llévala como pregunta al Shabat». Falta el oro: **la frase más importante de esa parashá + su moraleja al hoy**. → Modelo nuevo «la frase de la semana» (`contenido/parashot/`).

3. **⚠️ El slot Barkai (martes)** —trueno, mar, shehecheyanu, modé aní— ahora es trabajo del **motor dinámico** `reporte_berajot.mjs` (en condicional, según el cielo REAL del día), no de una berajá fija semanal. → Absorber al motor; el martes queda libre para otra vena.

4. **❌ Bug de hemisferio en un ancla.** **Tu BiShvat (13)** decía «en pleno invierno… el árbol despierta bajo la nieve» — solo hemisferio norte (en el sur es fin del verano). Viola la regla 3. → Reescrita (bi-hemisférica, abajo).

## Veredicto por pieza

| Bloque | Piezas | Veredicto |
|---|---|---|
| **Figuras** | Rashí · Rambam · Sara Schenirer · Rut | ✅ sólidas (fuente, eslabón, moraleja) |
| **Mitzvot** | bikur jolim · shemirat halashón · hajnasat orjim · kibud av | ✅ |
| **Reloj** | el día empieza de noche · la luna/Rosh Jódesh · las horas del sol · los dos bordes | ✅ (universales, sin sesgo de hemisferio) |
| **Shabat** | velas · neshamá yeterá · 39 melajot · Lejá Dodí | ✅ |
| **Barkai (mar)** | trueno · mar · shehecheyanu · modé aní | ⚠️ → mover al motor dinámico |
| **Parashá (jue) ×4** | genéricas con [corchete] | ❌ → modelo «frase de la semana» |
| **Anclas 01–22** | festividades + memoriales | ✅ salvo **Tu BiShvat** ❌ (hemisferio) |

**Resumen:** ~80% del contenido pasa (buena base). Lo que falla es concreto: la **estructura** (grilla → venas), las **4 parashot** (hand-off → frase de la semana), el **martes** (fijo → motor), y **Tu BiShvat** (hemisferio). Se reformula eso, no todo.

## Cola de reformulación
1. ✅ Tu BiShvat bi-hemisférica — hecho (`anclas/13-tu-bishvat.md`).
2. ✅ Modelo «frase de la semana» + ejemplo Vaetjanán — hecho (`parashot/`).
3. ⏳ Autorar las venas nuevas que rompen la grilla (mussar, bobe, porqués, ladino, canción, escalera, carta astral, kedoshim) — lote siguiente.
4. ⏳ Mover el slot Barkai del martes al motor `reporte_berajot.mjs`.
