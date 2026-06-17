# Plan de contenidos SEO — Power BI (Aimtech)

> Construido a partir del temario REAL de los cursos (PPTX ES + CA de Miquel Pérez).
> Estrategia: arquitectura pillar + cluster. El pillar convierte; los clusters
> capturan búsqueda informacional y enlazan al pillar. Sin FUNDAE, sin Kit Digital.

---

## 0. Nombre del fundador (coherencia de marca, confirmado con los PPTX)
- En los decks aparece como **"Miquel Pérez"** (forma catalana).
- Esquema final recomendado:
  - Web/contenido CA: **Miquel Pérez**
  - Web/contenido ES: **Miguel Pérez**
  - Uso/cara visible (ambos): **Mike**
  - Schema Person: `name` = "Miguel Pérez", `alternateName` = ["Miquel Pérez", "Mike Pérez"]
- Esto refuerza la entidad en vez de partirla: Google entiende que las tres
  formas son la misma persona.

---

## 1. El temario real (materia prima de los clusters)

### Curso "Power BI de 0 a intermedio" (deck ES — 12 temas / 2 partes)
PARTE 1 — Fundamentos · Carga · Primeros informes
1. Instalación e interfaz (Desktop gratuito, vistas informe/tabla/modelo)
2. Carga de datos (CSV, codificación, delimitador, formato de columnas)
3. Informes (lienzo, gráfico de anillos, mapas, líneas, barras apiladas)
4. Interactividad (filtros cruzados, segmentaciones, panel de filtros)
5. PROYECTO 1 — Tienda online de principio a fin
6. Orígenes de datos (ingesta múltiple, modelado, limpieza)
PARTE 2 — Geografía · Modelado · Diseño · Power Query
7. Mapas y formato (visualización geográfica, latitud/longitud, coroplético)
8. PROYECTOS 2-5 (casos prácticos guiados)
9. Modelado (relaciones 1:N, jerarquías, esquema en estrella, cardinalidad)
10. Diseño y narrativa (temas, storytelling, layout de informe)
11. Visuales avanzados (tarjetas, treemap, gráfico de cinta/ribbon, matriz, KPIs)
12. Power Query (limpieza profunda, calidad de columnas, transformaciones, tipos)

### Curso catalán (deck CA — 6 módulos, mismo contenido reorganizado)
1. Fonaments (intro, càrrega, informes, dashboards) — slides 2-40
2. Modelat & Estètica (ingesta, Power Query, mapes, format) — 42-81
3. Relacions & Filtres (relacions, pàgines, jerarquies, filtrat) — 83-139
4. Disseny visual (layout, storytelling, gràfics, temes) — 141-159
5. Visualitzacions avançades (taules, targetes, format condicional,
   TreeMap, Ribbon) — 161-213
6. Power Query a fons (editor, neteja, qualitat, transformacions) — 215-305
Cada módulo cierra con un proyecto práctico.

---

## 2. Arquitectura pillar + cluster

```
                  PILLAR (la página dinero)
                  /power-bi  (ES)   ·   /ca/power-bi (CA)
                            │
   ┌──────────┬────────────┼────────────┬──────────────┐
 CLUSTER    CLUSTER     CLUSTER       CLUSTER        CLUSTER
 informac.  técnico     comparativa   sectorial      conversión
   │           │            │             │               │
 todos enlazan SIEMPRE de vuelta al pillar con anchor
 "formación Power BI" / "formación Power BI a medida"
```

**Regla de enlazado interno:**
- Cada cluster enlaza ≥1 vez al pillar /power-bi con anchor de keyword transaccional.
- El pillar enlaza a los 3-4 clusters más relevantes (sección "Aprende más").
- Clusters relacionados se enlazan entre sí (ej: DAX ↔ modelado).

---

## 3. El PILLAR — /power-bi (reescritura/refuerzo)

**Keyword transaccional principal**: "formación Power BI empresas",
"formación Power BI" + variantes geo/B2B (Barcelona / empresas / pymes / in-company / online en directo).

**Intención**: transaccional / comercial. Esta página NO enseña; vende y convierte.

**Bloques que debe tener (y que el temario ya te permite justificar):**
1. H1 con keyword + propuesta: "Formación en Power BI para empresas — presencial
   en Barcelona, remoto en directo o in-company en toda Cataluña y España".
2. Los 2 itinerarios claros: "De 0 a intermedio" (20h) y "Avanzado" (20h),
   con el temario resumido REAL (los 12 temas / 6 módulos de arriba).
3. Metodología learn-by-doing (los proyectos 1-5 son la prueba: "no escuchas,
   construyes un informe real desde el primer día").
4. Modalidades: presencial Barcelona, remoto en directo, in-company.
5. Para quién: las 3 buyer personas (responsable formación, técnico/analista,
   AAPP/entidad).
6. Formador: Mike (Miguel/Miquel Pérez), +20 años, docencia universitaria.
7. CTA: solicitar propuesta a medida.
8. JSON-LD Course x2 + EducationalOrganization (ver bloque SEO de CLAUDE.md).

---

## 4. Los CLUSTERS (artículos de blog) — priorizados

> Cada uno: keyword objetivo, intención, ángulo Aimtech, y de qué slide/tema
> del temario sale. Priorizados por ratio impacto/esfuerzo.

### TANDA 1 — Informacionales de alto volumen (captan "qué es / para qué")
**C1. "¿Qué es Power BI y para qué sirve? Guía 2026 para empresas"**
- KW: "qué es power bi", "para qué sirve power bi"
- Intención: informacional, top funnel, alto volumen
- Ángulo: desde tema 1 del temario; explica ETL, vistas, qué resuelve en una pyme
- Enlaza a pillar con "formación Power BI a medida"

**C2. "Power BI vs Excel: cuándo dar el salto (con ejemplos reales)"**
- KW: "power bi vs excel", "diferencia power bi excel"
- Intención: informacional/comparativa, altísimo volumen
- Ángulo: el caso del temario (Excel + Power Query combinados); las 5 señales
  de que tu equipo tocó techo con Excel
- Gran captador de tráfico; el lector típico es la persona B (analista)

**C3. "¿Es gratis Power BI? Desktop, Pro y lo que de verdad cuesta"**
- KW: "power bi gratis", "power bi precio", "licencia power bi"
- Intención: informacional con duda comercial frecuente
- Ángulo: desde tema 1 (Desktop gratis, publicación requiere suscripción)

### TANDA 2 — Técnicos (captan al analista, demuestran expertise/E-E-A-T)
**C4. "DAX para principiantes: medidas vs columnas calculadas"**
- KW: "qué es dax", "dax power bi", "medidas power bi"
- Intención: informacional técnica
- Ángulo: desde temas 9-11; saca de tu material la columna "Saldo = Ingresos −
  Salidas" como ejemplo real
- Enlaza a C5 (modelado) y al pillar

**C5. "Modelado de datos en Power BI: relaciones, jerarquías y esquema en estrella"**
- KW: "modelado datos power bi", "relaciones power bi", "esquema estrella"
- Ángulo: desde tema 9; relación 1:N Clientes-Pedidos del temario, jerarquías
  de producto (Género → Familia)

**C6. "Power Query: cómo limpiar datos sucios paso a paso"**
- KW: "power query", "limpiar datos power bi", "transformar datos power query"
- Ángulo: desde tema 12; el caso real del temario (códigos "AAA001/AAA 1"
  corruptos, filas nulas variables, columna Income corrupta)
- Joya E-E-A-T: muy poca competencia tiene un tutorial tan concreto

**C7. "Mapas en Power BI: por qué no se ven y cómo activarlos"**
- KW: "mapas power bi", "power bi mapa no funciona", "mapa coroplético power bi"
- Ángulo: desde tema 7; el problema real del temario (habilitar mapas en
  Seguridad/Global, latitud/longitud, reiniciar). Resuelve un dolor MUY buscado.

### TANDA 3 — Comparativas y decisión (intención comercial media-alta)
**C8. "n8n vs Make vs Zapier para automatizar tu empresa"**
- (Ya estaba en backlog; enlaza formación ↔ IA agéntica, cross-sell)

**C9. "Formación Power BI en Barcelona: cómo elegir para tu empresa"**
- KW: "cursos power bi barcelona", "curso power bi presencial barcelona"
- Intención: COMERCIAL — capta la búsqueda geo y la dirige al pillar
- Ángulo: guía honesta de cómo elegir; posiciona a Aimtech como opción a medida
  frente a portales genéricos. Casi-pillar secundario.

### TANDA 4 — Sectorial / AAPP (tu diferencial defendible)
**C10. "Power BI para administraciones públicas: por dónde empezar"**
- KW: "power bi administración pública", "power bi sector público"
- Intención: comercial nicho, baja competencia, tu terreno
- Ángulo: casos de uso AAPP (indicadores de gestión, transparencia, cuadros
  de mando). Enlaza al pillar + a /ia-agentica.

**C11. (CA) "Curs de Power BI a Catalunya: formació en català per a empreses i administracions"**
- KW: "curs power bi català", "formació power bi catalunya"
- Intención: comercial geo+idioma, competencia envejecida = oportunidad clara
- Ángulo: versión catalana del pillar/C9 combinada; aprovecha que el contenido
  CA del nicho está caducado.

---

## 5. Versiones en catalán (/ca)
- Pillar /ca/power-bi: traducción + adaptación de /power-bi (no copia literal).
- Clusters CA prioritarios: C11 (nativo), C1, C2, C6, C10 traducidos/adaptados.
- hreflang recíproco entre cada par ES↔CA.
- inLanguage correcto en el JSON-LD de cada versión.

---

## 6. Ejecución en Claude Code (por fases, sin sobrecargar)

**FASE 1 — Pillar + schema** (1 sesión)
- Reescribir/reforzar /power-bi con los bloques del punto 3.
- Insertar JSON-LD Course x2 + EducationalOrganization.
- Commit: "feat: pillar Power BI optimizado + schema Course".

**FASE 2 — Clusters Tanda 1** (1 sesión, 3 artículos)
- Generar C1, C2, C3 con estructura SEO + enlazado al pillar.
- Commit por artículo o por tanda.

**FASE 3 — Clusters Tanda 2** (1 sesión, técnicos: C4-C7)
- Los de mayor valor E-E-A-T; usan ejemplos reales del temario.

**FASE 4 — Comparativas/comercial/sectorial** (C8-C10)

**FASE 5 — Catalán** (pillar CA + clusters CA + hreflang)

**FASE 6 — Interlinking + verificación schema con claude-seo**
- `/seo schema` y `/seo page` por URL para validar.

> Cada artículo se puede generar con el skill `claude-blog` (si lo instalaste)
> o con prompt normal. Te prepararé los prompts uno a uno con: keyword objetivo,
> estructura H2/H3, ejemplo real del temario a usar, y enlaces internos exactos.

---

## 7. Registro de estado (actualizar al cerrar cada sesión)

> Claude Code: al terminar una fase, actualiza esta tabla en el mismo commit.
> Marca estado, fecha y nota de lo realmente hecho (puede diferir del plan).

| Fase | Descripción | Estado | Fecha | Notas |
|------|-------------|--------|-------|-------|
| 1 | Pillar /power-bi + JSON-LD Course | ☑ Hecho | 2026-05-28 | EducationalOrganization + Course enriquecido (ES+CA); card "0 a intermedio" reescrita al temario PPTX; hero/modalidades/metodología reforzados + bloque Formador (ES). |
| 2 | Clusters Tanda 1 (C1 qué es, C2 vs Excel, C3 precio) | ☑ Hecho | 2026-05-28 | 3 posts ES (que-es-power-bi, power-bi-vs-excel, es-gratis-power-bi), cada uno enlaza al pillar con anchor transaccional. Versiones CA → FASE 5. |
| 3 | Clusters Tanda 2 técnicos (C4 DAX, C5 modelado, C6 Power Query, C7 mapas) | ☑ Hecho | 2026-06-01 | 4 posts ES publicados; cross-link entre ellos y al pillar; pillar enlaza a Power Query, modelado y DAX desde las cards de itinerarios. |
| 4 | Comparativa/comercial/sectorial (C8 n8n, C9 cursos BCN, C10 AAPP) | ☑ Hecho | 2026-06-01 | 3 posts ES (n8n-vs-make-vs-zapier cross-sell IA, curso-power-bi-barcelona-como-elegir geo+comercial, power-bi-administraciones-publicas sectorial). |
| 5 | Catalán: pillar CA + clusters CA + hreflang | ☑ Hecho | 2026-06-01 | 6 posts CA del cluster PB (que-es, vs-excel, es-gratuit, dax, modelatge, power-query, mapes, n8n, curs-bcn, aapp); cuerpo CA del pillar alineado al temario real (corregida divergencia "0-intermedi"); interlinks CA; hreflang ES↔CA vía translationKey. |
| 6 | Interlinking global + verificación schema | ◐ Parcial | 2026-06-01 | Interlinking pillar↔cluster hecho ES+CA; JSON-LD validado (parseo + offers) en money pages y posts; 385 enlaces CA sin roturas. Falta repaso final con claude-seo en producción. |

### Decisiones tomadas durante el desarrollo
> (Registrar aquí cualquier desviación o decisión relevante para no perder el "porqué".)
- **(2026-05-28, FASE 1) Remapeo de temario**: el contenido que la página mostraba
  como itinerario "de 0 a intermedio" (DAX CALCULATE, publicación en Service, RLS,
  deployment pipelines, DAX Studio) describía en realidad el curso **Avanzado**. Se
  reescribió la card "0 a intermedio" al temario PPTX real (instalación, Power Query,
  informes/interactividad, mapas, modelado, visuales avanzados + 5 proyectos guiados).
  El "Avanzado" se mantuvo. Corrección anti-humo confirmada por Mike.
- **(2026-05-28, FASE 1) Alcance CA**: el schema (EducationalOrganization + Course
  enriquecido con provider @id, timeRequired, location Barcelona) se aplicó a ES **y**
  CA por coherencia de entidad y hreflang. El refuerzo de CONTENIDO solo en ES; el
  cuerpo CA y las descripciones Course CA se reescriben en FASE 5 (divergencia ES↔CA
  temporal asumida conscientemente para no frenar el avance).
- **(2026-05-28) Rol de Mike DECIDIDO**: "Ingeniero de Soluciones de IA" (no
  "Arquitecto"). Alineado CLAUDE.md con la web en producción. Pendiente decidir si la
  keyword "Miguel Pérez arquitecto soluciones IA" y el tema de blog C "Qué es un
  arquitecto de soluciones de IA" se reorientan a "ingeniero".

### Estados posibles: ☐ Pendiente · ◐ En curso · ☑ Hecho · ✗ Descartado
