# Aimtech — Web corporativa

## Contexto del proyecto
Web corporativa de Aimtech (www.aimtech.es), empresa de Mike (Cataluña, ES)
dedicada a formación e implantación de IA aplicada. La web anterior estaba
en WordPress con bajísimo tráfico. Migración a estático moderno para ganar
rendimiento, diseño y posicionamiento.

## Stack
- HTML5 estático (sin framework de momento)
- CSS3 vanilla con variables CSS — sin Tailwind, sin preprocesadores
- JS vanilla mínimo
- Fuentes: Instrument Serif (display), JetBrains Mono (técnico), Geist (cuerpo)
- Despliegue: Netlify (sitio estático + Netlify Functions para el formulario de contacto)

## Líneas de negocio a vender
1. Formación en Power BI e inteligencia de negocio (palanca caliente, B2B: empresas, entidades y AAPP, online o presencial)
2. Formación en IA Aplicada
3. Implantación de IA Agéntica (diferenciador clave: Claude API, n8n, RAG, Qdrant)
4. Desarrollo de software, apps y APIs

## Dirección de diseño
- Dark mode profundo (#0a0e14), NO negro puro
- Un único color acento: azul corporativo (#2580e3) — heredado del logo de Aimtech
- Cero gradientes morados, cero estética "AI slop"
- Tipografía editorial (serif itálica en headlines) + mono técnico
- Bento grid asimétrico para servicios — tamaños desiguales a propósito
- Animaciones contenidas: revelado escalonado al cargar, glow en cards al hover

## Convenciones
- Idioma de la web: español (es-ES), tono profesional pero directo, anti-humo
- Variables CSS centralizadas en :root
- Mobile-first responsive a partir de breakpoint 960px
- Comentarios en CSS con separadores ── para navegación rápida

## Estructura prevista
- / (home — ya construida en index.html)
- /power-bi
- /ia-aplicada
- /ia-agentica
- /desarrollo
- /sobre-mike
- /casos (cuando haya autorización para nombrar clientes)
- /contacto

## Decisiones tomadas
- No usar React/Vue: la web no necesita interactividad compleja
- No usar Tailwind: control total > velocidad de prototipado
- SEO técnico: meta tags por página, sitemap.xml, structured data JSON-LD
  (Organization + Course para los cursos Power BI)

## Backlog
- Sustituir stats placeholder por números reales
- Páginas internas de los 4 servicios
- Logos de clientes/AAPP (cuando haya autorización)
- Refactor del CSS inline de index.html a /css/{tokens,layout,components}.css

## SEO / GEO — Contexto para el skill claude-seo

> Da contexto al plugin `claude-seo` y a cualquier sesión que trabaje SEO, para
> que genere schema, meta y contenido a medida de Aimtech. Escrito tras auditar
> el contenido REAL ya publicado en aimtech.es (no es un plan sobre web vacía).
>
> EXCLUSIONES FIRMES (no negociar, no "colar por ayudar"):
> - NO FUNDAE: nada de formación bonificada, crédito de formación, bonificación.
> - NO Kit Digital ni ninguna otra financiación/subvención pública.
> No generar contenido, keywords, meta ni schema que mencionen ninguno de estos.
> Son decisiones de negocio firmes (saturación + carga administrativa que no se
> ofrece).

### Identidad y alcance
- **Marca**: Aimtech Consulting SL (Cataluña).
- **Fundador**: Miguel Pérez, conocido profesionalmente como "Mike Pérez".
  - Nombre legal / credenciales / schema `name`: **Miguel Pérez**
  - Nombre de uso / cara visible / `alternateName`: **Mike Pérez**
  - Rol: **Ingeniero de Soluciones de IA** (Solutions Engineer)
  - Unificar en toda la web: la home dice solo "Mike". Usar "Mike Pérez" como
    cara visible y "Miguel Pérez" en el schema Person para casar con sus
    credenciales docentes públicas (UOC, UPC, UIC, Cibernàrium).
- **Geo-targeting**: Cataluña (Barcelona y área); clientes de toda España en remoto.
- **Web bilingüe**: ES (raíz `/`) + CA (`/ca/`). Hreflang ya implementado vía
  og:locale — verificar que existan también etiquetas <link rel="alternate"
  hreflang> reales en <head>, no solo en OG.
- **Audiencia**: pymes, entidades (asociaciones, fundaciones, colegios,
  cooperativas) y administraciones públicas (AAPP).

### Estado actual del sitio (auditoría de partida)
YA RESUELTO (no rehacer):
- Meta title/description por página, diferenciados y con keywords correctas.
- OG completo (image, locale, type 'profile' en sobre-mike).
- Contenido único y profundo por landing. La de /ia-agentica es excepcional
  (análisis, precondiciones, workflow, ROI) — gran activo E-E-A-T.
- Stats reales en home: +20 años, 3.360 alumnos, 24.000 horas, 4,85/5.
- **JSON-LD YA IMPLEMENTADO** (corrige el estado antiguo "sin JSON-LD"):
  Organization en home; EducationalOrganization + Course×2 + BreadcrumbList en
  /power-bi/ (ES+CA); Course + BreadcrumbList en /ia-aplicada/ (ES+CA);
  BlogPosting en posts. Los Course de las 4 money pages incluyen `offers`
  (priceSpecification minPrice, IVA aparte) desde 2026-06-01.
- Hreflang real en <head> + sitemap + OG (ES/CA). robots.txt y llms.txt presentes.
- **Precios visibles** en las money pages desde 2026-06-01 (decisión de Mike):
  Power BI `desde 4.400€` / grupo hasta 10 / +440€ persona (22€/h);
  IA aplicada `desde 3.500€` / grupo hasta 5 / +700€ persona (35€/h). AAPP
  mantiene "por licitación".
- Blog: 4 posts ES ("Tres preguntas…" + cluster Power BI: que-es-power-bi,
  power-bi-vs-excel, es-gratis-power-bi). Plan PB Fases 1-2 hechas.

GAPS REALES A ATACAR (orden de prioridad):
1. **IA aplicada sin cluster de contenidos** y temario "pendiente" en su página
   — mayor hueco de los dos servicios prioritarios. Plan en
   `docs/seo/plan-ia-aplicada.md` (Fase B del plan SEO unificado).
2. **"Casos" enlaza a `#`** (footer global, enlace muerto). Los casos de éxito
   son el activo E-E-A-T pendiente más importante.
3. **Blog necesita volumen** — faltan clusters PB técnicos (C4-C7) y comercial
   (C8-C10), y todo el cluster IA. Versiones CA pendientes (Fase D).
4. **Nombre del fundador inconsistente** (Mike vs Miguel/Mike Pérez).

### Posicionamiento diferencial (núcleo del SEO)
Mercado nacional de formación TI genérica: saturado. La ventaja defendible de
Aimtech es la intersección de señales que casi nadie combina:
1. **Localización catalana** + catalán nativo (`/ca/`).
2. **Sector público real**: experiencia AAPP demostrable (E-E-A-T fuerte).
3. **Autoría con nombre**: Miguel "Mike" Pérez, docente universitario verificable
   (UOC, UPC, UIC, Cibernàrium), no marca anónima.
4. **Doble capa formación + implantación**: enseña Y construye y pone en
   producción. Competencia suele hacer solo una.
5. **Postura anti-humo / ROI medible**: diferenciador de tono y de método,
   especialmente potente en IA agéntica.

Competidor de referencia para benchmarking: Javadex (Claude Code, n8n, formación
"aprender construyendo"). Aimtech se diferencia por eje catalán + AAPP + docencia
universitaria acreditada + Power BI como puerta de entrada.

### Keywords objetivo por página (sin FUNDAE, sin Kit Digital)

**/ (home)**
- Primaria: "consultoría IA Cataluña", "formación IA y Power BI empresas"
- Secundarias: "agentes IA para empresas", "implantación IA pymes"

**/power-bi**
- Primaria: "formación Power BI empresas", "formación Power BI pymes",
  "formación Power BI Barcelona", "formación Power BI in-company"
- Secundarias: "curso Power BI empresas" (solo como variante SEO), "formación Power BI
  entidades", "formación Power BI avanzado empresas", "DAX modelado empresas"
- Long-tail baja competencia: "formación Power BI catalán", "formación Power BI
  a medida sector público", "itinerario Power BI cero a avanzado empresas"

**/ia-aplicada**
- Primaria: "formación IA aplicada empresas", "curso IA para equipos in-company"
- Secundarias: "formación prompting empresas", "curso IA generativa trabajadores",
  "formación IA práctica para empresas"

**/ia-agentica** (mayor margen, menor competencia — apostar fuerte)
- Primaria: "implantación agentes IA empresas", "consultoría agentes IA Cataluña"
- Secundarias: "automatización n8n empresas", "agencia n8n España", "agente IA
  WhatsApp Business", "sistemas multi-agente empresas", "implantación IA RAG"

**/desarrollo**
- Primaria: "desarrollo software a medida Cataluña", "desarrollo APIs empresas"
- Secundarias: "desarrollo apps a medida pymes", "integraciones software empresa"

**/sobre-mike**
- Primaria: "Mike Pérez IA", "Miguel Pérez ingeniero soluciones IA",
  "consultor IA Cataluña"
- Refuerzo de marca personal y E-E-A-T, no de conversión directa.

### Schema.org / JSON-LD (estado: base implementada, mantener y ampliar)
Referencia de lo que debe haber por página. ☑ = ya implementado.
- **Todas las páginas**: `Organization` (Aimtech Consulting SL) con `founder`
  (Miguel Pérez), `areaServed` (ES + Cataluña), `contactPoint`, `sameAs`
  (LinkedIn, GitHub, adventuriq.com si procede).
- **/ (home)**: ☑ `Organization`. Pendiente añadir `WebSite`.
- **/power-bi**: ☑ `Course` (x2 itinerarios, 20h, hasCourseInstance,
  provider, inLanguage es/ca, timeRequired PT20H) + `EducationalOrganization`
  + `BreadcrumbList` + ☑ `offers` (minPrice 4400 EUR, IVA aparte). ES+CA.
- **/ia-aplicada**: ☑ `Course` + `BreadcrumbList` + ☑ `offers` (minPrice 3500
  EUR). Pendiente: subir a `EducationalOrganization` con provider @id como
  Power BI (hoy provider inline) al cerrar el temario (Fase B).
- **/ia-agentica, /desarrollo**: `Service` con `serviceType`, `provider`,
  `areaServed`. Pendiente.
- **/sobre-mike**: `Person` con:
  - `name`: "Miguel Pérez"
  - `alternateName`: "Mike Pérez"
  - `jobTitle`: "Ingeniero de Soluciones de IA"
  - `knowsAbout`: Power BI, IA aplicada, IA agéntica, n8n, Claude, gamificación
  - `affiliation`: UOC, UPC, UIC, Cibernàrium (como docente)
  - `worksFor`: Aimtech Consulting SL
  Refuerzo E-E-A-T fuerte: el alternateName une "Miguel" (credenciales) con
  "Mike" (marca) en una sola entidad, en vez de dividirla.
- **/blog/<post>**: `BlogPosting`/`Article` con `author` → Person (Miguel Pérez),
  `datePublished`, `inLanguage`.
- **EVITAR**: `FAQ` (restringido a gov/health desde 2023) y `HowTo` (deprecado
  sept 2023). No generarlos aunque parezcan útiles.

### E-E-A-T — señales a reforzar
- **Experience**: publicar la sección "Casos" (hoy enlaza a `#`). Proyectos
  reales, capturas de entregables, resultados. Es la prioridad E-E-A-T.
- **Expertise**: bio de Mike Pérez con +20 años, +600/3.360 formados, docencia
  universitaria (ya está, muy bien).
- **Authoritativeness**: nombrar 2-3 referencias AAPP/cliente cuando haya
  autorización; logos; menciones en universidades.
- **Trustworthiness**: datos de la SL, aviso legal, privacidad, cookies (ya
  presentes). Email visible (ya está).

### GEO — optimización para búsqueda con IA (ChatGPT, Perplexity, AI Overviews)
Convención editorial: Preferir “formación” sobre “curso” en Power BI/IA para empresas y pymes. “Curso” queda como variante secundaria SEO; el posicionamiento principal debe comunicar sesiones en directo con profesor, no vídeos grabados.

Objetivo: ser citado por asistentes IA en consultas de formación Power BI /
consultoría IA en Cataluña-España. El contenido actual ya es muy "citable"
(definiciones claras, listas, datos). Acciones:
- Crear `llms.txt` en raíz: qué es Aimtech, servicios, para quién, geo.
- Mantener el estilo de respuestas directas y datos concretos (la investigación
  GEO de Princeton: citas + estadísticas + tono experto suben la citabilidad).
- El post de blog ya sigue buen patrón (pregunta → respuesta accionable).

### Backlog de contenido de blog (lo que traerá tráfico)
El blog tiene 1 post. Necesita volumen y constancia. Temas alineados con el
contenido y el tono ya existentes (sin FUNDAE, sin Kit Digital):
- "Qué es un agente de IA y cuándo le conviene a una pyme"
- "Power BI para administraciones públicas: por dónde empezar"
- "n8n vs Make vs Zapier: cuál elegir para automatizar tu empresa"
- "De Excel a Power BI: las 5 señales de que tu equipo ya tocó techo"
- "Human-in-the-loop: por qué un agente IA no debe decidirlo todo solo"
- "Qué es un ingeniero de soluciones de IA y cuándo lo necesitas"
(Companion: skill `claude-blog`, escribe según findings del auditor.)

### Comandos claude-seo recomendados (orden de arranque)
1. `/seo audit https://www.aimtech.es` — foto de partida, score 0-100
2. `/seo schema https://www.aimtech.es/power-bi/` — generar Course + Org (gap nº1)
3. `/seo schema https://www.aimtech.es/sobre-mike/` — Person (E-E-A-T)
4. `/seo hreflang https://www.aimtech.es` — confirmar hreflang real en <head>
5. `/seo geo https://www.aimtech.es` — optimizar para IA search + llms.txt
6. `/seo page https://www.aimtech.es/ia-agentica/` — pulir la joya de la corona
7. `/seo cluster "formación Power BI empresas"` — arquitectura de blog

### Hoja de ruta de contenidos
El plan completo de contenidos Power BI (pillar + 11 clusters, 6 fases,
versiones ES/CA) vive en `docs/seo/plan-powerbi.md`. Consultar ese archivo
antes de generar cualquier contenido de Power BI. Estado de avance al final
del propio plan.