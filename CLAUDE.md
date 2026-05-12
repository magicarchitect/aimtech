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
- Despliegue previsto: Cloudflare Pages o Netlify (decisión pendiente)

## Líneas de negocio a vender
1. Formación en Power BI e inteligencia de negocio (palanca caliente, bonificable FUNDAE)
2. Formación en IA Aplicada
3. Implantación de IA Agéntica (diferenciador clave: Claude API, n8n, RAG, Qdrant)
4. Desarrollo de software, apps y APIs

## Dirección de diseño
- Dark mode profundo (#0a0e14), NO negro puro
- Un único color acento: cyan eléctrico (#7df9ff)
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
- Formulario de contacto (Formspree, Resend, o mailto: simple — pendiente)
- Política de cookies + aviso legal (SL española, RGPD)
- Refactor del CSS inline de index.html a /css/{tokens,layout,components}.css