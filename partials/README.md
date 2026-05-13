# Partials — fragmentos HTML reutilizables

Aquí viven los snippets compartidos por varias páginas. El más obvio: el footer,
que aparece igual en 16 archivos.

## Cómo funciona

En cada HTML que quiera incluir un partial:

```html
<!-- @region partials/footer-es.html -->
...lo que sea (será reemplazado)...
<!-- @endregion -->
```

Después se corre `npm run build` (o `node build.js`) y el contenido entre los
markers se sustituye por el del partial. Idempotente: si ya está al día, no
toca nada.

## Flujo de trabajo

1. Editas un partial (p.ej. añades un enlace al footer).
2. Corres `npm run build` antes de commitear.
3. Commit incluye tanto el cambio del partial como el HTML resuelto.

Netlify también corre `node build.js` en cada deploy (configurado en
`netlify.toml`), así que aunque te olvides en local, el sitio publicado siempre
tendrá los partials resueltos.

## Por qué no Eleventy / Astro / 11ty

Porque para resolver un footer no hace falta un framework. `build.js` son
50 líneas, cero dependencias, y el HTML resultante es exactamente lo que se
sirve — sin fase opaca de generación. Si llega a hacer falta más (layouts
completos, datos por idioma, colecciones), se reconsidera.

## Partials existentes

- `footer-es.html` — footer ES con paths absolutos
- `footer-ca.html` — footer CA con paths absolutos
