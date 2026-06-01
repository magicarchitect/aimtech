# Plan de contenidos — IA Aplicada (pillar + clusters)

> Gemelo de `plan-powerbi.md` para el segundo servicio prioritario. Creado
> 2026-06-01 dentro del plan SEO unificado Power BI + IA. Mismo método:
> pillar transaccional `/ia-aplicada` + clusters de blog informacionales/
> comerciales que enlazan al pillar con anchors transaccionales.
>
> EXCLUSIONES FIRMES (heredadas de CLAUDE.md): NO FUNDAE, NO Kit Digital, NO
> subvenciones. No mencionar ni para decir que no se ofrecen.
> ANTI-HUMO: el temario real del curso lo aporta Mike. Nada de inventar módulos,
> resultados ni claims. Donde falte dato real → placeholder visible.

## Pillar
- **Página:** `/ia-aplicada` (ES) y `/ca/ia-aplicada` (CA).
- **Intención:** transaccional / comercial — vende el curso, no enseña.
- **Estado:** publicada, con JSON-LD `Course` + `BreadcrumbList` + `offers`
  (minPrice 3500 EUR, desde 2026-06-01). Precio visible: desde 3.500€ / grupo
  hasta 5 / +700€ persona (35€/h). Cross-link a `/ia-agentica/` añadido.
- **GAP nº1 del pillar:** el cuerpo declara "temario pendiente / módulo por
  definir". Hasta cerrar el temario real con Mike, no se reescribe el detalle
  de módulos (anti-humo). Bloqueante de la Fase B.2.
- **Keywords pillar:** "formación IA aplicada empresas", "curso IA para equipos
  in-company", "formación IA práctica para empresas".

## Clusters de blog (Markdown en `content/blog/es/`, build genera HTML)
Orden por prioridad de retorno. Cada uno enlaza al pillar con anchor
transaccional y, cuando aplica, cross-link a `/ia-agentica/`.

- **IA-C1 — "Qué es la IA aplicada y en qué se diferencia de la IA generativa"**
  Informacional cabeza. KW: "qué es la IA aplicada", "IA aplicada vs IA
  generativa". Define con precisión (citable por IA search).
- **IA-C2 — "Formación de IA para equipos no técnicos: por dónde empezar"**
  Comercial. KW: "formación IA equipos no técnicos", "curso IA para empresas".
  Público: administración, ventas, marketing, RRHH, atención al cliente.
- **IA-C3 — "Prompt engineering para empresas: guía práctica"**
  KW: "formación prompting empresas", "curso prompt engineering". Estructura
  rol+contexto+tarea+formato, iteración. Patrón pregunta→respuesta accionable.
- **IA-C4 — "Cuánto cuesta formar a tu equipo en IA (y qué incluye)"**
  Long-tail precio → conversión. KW: "cuánto cuesta formación IA empresa",
  "precio formación IA in-company". Apoya la transparencia de la money page
  (desde 3.500€). Cifras reales de Mike, no inventadas.
- **IA-C5 — "IA para administraciones públicas y entidades: por dónde empezar"**
  Nicho AAPP/entidades (diferencial Aimtech, E-E-A-T). KW: "formación IA
  administraciones públicas", "IA para entidades".
- **IA-C6 (opcional) — "Copilot vs ChatGPT vs Claude para empresas"**
  Comparativa de alto volumen informacional, captación tope de embudo.

## Schema previsto
- Pillar: ☑ `Course` + `BreadcrumbList` + `offers`. Pendiente: subir provider a
  `EducationalOrganization` con `@id` (como Power BI) al cerrar el temario.
- Posts: `BlogPosting` con `author` → Person (Miguel Pérez), `datePublished`,
  `inLanguage`, `image` (lo genera el build desde frontmatter).
- EVITAR: `FAQ` y `HowTo` (restringidos/deprecados — regla CLAUDE.md).

## Fases de ejecución
| Fase | Descripción | Estado | Fecha |
|---|---|---|---|
| B.1 | Este plan | ☑ HECHO | 2026-06-01 |
| B.2 | Cerrar temario real del pillar (requiere input de Mike) | ☐ APARCADO (decisión de Mike) | — |
| B.3 | Cluster ES IA-C1…IA-C5 (posts Markdown) | ☑ HECHO | 2026-06-01 |
| B.4 | Subir schema pillar a EducationalOrganization + provider @id | ☐ PENDIENTE (va con B.2) | — |
| B.5 | Versiones CA del pillar reforzado + clusters (coordinar con Fase D) | ☐ PENDIENTE | — |

## Estado de avance
**(2026-06-01, B.1)** Plan creado. Money page de IA ya tiene precio visible
(desde 3.500€) y `offers` en schema (hecho en Fase A). El bloqueante real para
reforzar el pillar es el **temario del curso de IA aplicada**, que debe aportar
Mike (anti-humo: no se inventa el contenido formativo). Los posts del cluster
(B.3) pueden escribirse sin ese temario, pero IA-C4 (precio) e IA-C5 (AAPP)
deben usar cifras y referencias reales confirmadas.
