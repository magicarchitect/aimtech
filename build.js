// build.js — pipeline de build estático para Aimtech.
//
// Pasos:
//   1) Genera el blog (posts e índices) desde /content/blog/{es,ca}/*.md
//   2) Actualiza el bloque BLOG-AUTO en sitemap.xml con las URLs del blog
//   3) Resuelve markers <!-- @region partials/X.html --> en todo *.html
//
// Uso: `node build.js` antes de cada commit/deploy. Idempotente.

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const ROOT = __dirname;
const SITE_URL = 'https://www.aimtech.es';
const SKIP_DIRS = new Set(['node_modules', 'partials', '.git', '.netlify', 'netlify', 'content']);

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

// ─────────────────────────────────────────────────────
// 1) BLOG
// ─────────────────────────────────────────────────────

const BLOG_CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const LANG_CONFIG = {
  es: {
    locale: 'es-ES',
    blogBase: '/blog/',
    layoutPath: path.join(ROOT, 'partials', 'post-layout-es.html'),
    indexLayoutPath: path.join(ROOT, 'partials', 'blog-index-es.html'),
    outBlogDir: path.join(ROOT, 'blog'),
    readingTimeUnit: 'min de lectura',
    emptyText: 'Próximamente — los primeros artículos están en cocina.',
    monthsLong: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    formatDate: (d, months) => `${d.getUTCDate()} de ${months[d.getUTCMonth()]} de ${d.getUTCFullYear()}`,
  },
  ca: {
    locale: 'ca-ES',
    blogBase: '/ca/blog/',
    layoutPath: path.join(ROOT, 'partials', 'post-layout-ca.html'),
    indexLayoutPath: path.join(ROOT, 'partials', 'blog-index-ca.html'),
    outBlogDir: path.join(ROOT, 'ca', 'blog'),
    readingTimeUnit: 'min de lectura',
    emptyText: 'Pròximament — els primers articles estan a la cuina.',
    monthsLong: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
    formatDate: (d, months) => `${d.getUTCDate()} de ${months[d.getUTCMonth()]} de ${d.getUTCFullYear()}`,
  },
};

function readPostsForLang(lang) {
  const dir = path.join(BLOG_CONTENT_DIR, lang);
  if (!fs.existsSync(dir)) return [];

  const config = LANG_CONFIG[lang];
  const posts = [];

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);

    if (data.draft === true) continue;

    // slug: explícito en frontmatter, si no, nombre del archivo sin fecha ni extensión
    const slug = data.slug
      || file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');

    const dateObj = data.date instanceof Date ? data.date : new Date(data.date);
    const dateISO = dateObj.toISOString().slice(0, 10);

    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    const url = `${config.blogBase}${slug}/`;
    const canonicalUrl = `${SITE_URL}${url}`;
    const htmlContent = md.render(content);

    posts.push({
      lang,
      slug,
      url,
      canonicalUrl,
      title: data.title || '(sin título)',
      description: data.description || '',
      author: data.author || 'Mike Pérez',
      tags: Array.isArray(data.tags) ? data.tags : [],
      icon: data.icon || 'doc',
      ogImage: data.ogImage || `${SITE_URL}/assets/og/default.png`,
      translationKey: data.translationKey || slug,
      dateObj,
      dateISO,
      dateDisplay: config.formatDate(dateObj, config.monthsLong),
      readingTime,
      htmlContent,
      sourceFile: filePath,
    });
  }

  // orden cronológico descendente
  posts.sort((a, b) => b.dateObj - a.dateObj);
  return posts;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// para insertar dentro de un string JSON (sin las comillas envolventes)
function jsonStr(s) {
  return JSON.stringify(String(s)).slice(1, -1);
}

function renderPost(post, hreflangPair, config) {
  const template = fs.readFileSync(config.layoutPath, 'utf8');

  const tagsHtml = post.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('');
  const tagsJson = JSON.stringify(post.tags);

  const hrefEs = hreflangPair.es || `${SITE_URL}/blog/`;
  const hrefCa = hreflangPair.ca || `${SITE_URL}/ca/blog/`;

  const replacements = {
    '{{TITLE}}': escapeHtml(post.title),
    '{{TITLE_JSON}}': jsonStr(post.title),
    '{{DESCRIPTION}}': escapeHtml(post.description),
    '{{DESCRIPTION_JSON}}': jsonStr(post.description),
    '{{CANONICAL_URL}}': post.canonicalUrl,
    '{{HREFLANG_ES}}': hrefEs,
    '{{HREFLANG_CA}}': hrefCa,
    '{{OG_IMAGE}}': post.ogImage,
    '{{DATE_ISO}}': post.dateISO,
    '{{DATE_DISPLAY}}': post.dateDisplay,
    '{{AUTHOR}}': escapeHtml(post.author),
    '{{AUTHOR_JSON}}': jsonStr(post.author),
    '{{TAGS_HTML}}': tagsHtml,
    '{{TAGS_JSON}}': tagsJson,
    '{{READING_TIME}}': String(post.readingTime),
    '{{CONTENT_HTML}}': post.htmlContent,
  };

  let html = template;
  for (const [k, v] of Object.entries(replacements)) {
    html = html.split(k).join(v);
  }
  return html;
}

// iconos temáticos para las cards del listado (lenguaje del hero: trazo azul)
const CARD_ICONS = {
  chart: `<svg viewBox="0 0 48 48" aria-hidden="true"><path class="ico" d="M9 9 V39 H39"/><rect class="ico-fill" x="15" y="26" width="6" height="13" rx="1.5" opacity="0.55"/><rect class="ico-fill" x="24" y="19" width="6" height="20" rx="1.5" opacity="0.8"/><rect class="ico-fill" x="33" y="23" width="6" height="16" rx="1.5"/><path class="ico" d="M14 22 L23 16 L32 19 L40 11"/></svg>`,
  compare: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect class="ico" x="7" y="14" width="15" height="20" rx="2"/><path class="ico" d="M7 21 H22 M7 27.5 H22 M14.5 14 V34"/><path class="ico" d="M36 20 L31 30 M36 20 L41 30"/><circle class="ico-fill" cx="36" cy="18" r="2.4"/><circle class="ico-fill" cx="31" cy="32" r="2.4"/><circle class="ico-fill" cx="41" cy="32" r="2.4"/></svg>`,
  price: `<svg viewBox="0 0 48 48" aria-hidden="true"><path class="ico" d="M26 9 H39 V22 L22 39 L9 26 Z"/><circle class="ico-fill" cx="32.5" cy="15.5" r="2.6"/></svg>`,
  agent: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="ico" cx="24" cy="24" r="6"/><path class="ico" d="M24 18 V12 M20 29 L13 34 M28 29 L35 34"/><circle class="ico-fill" cx="24" cy="9" r="3"/><circle class="ico-fill" cx="10" cy="37" r="3"/><circle class="ico-fill" cx="38" cy="37" r="3"/></svg>`,
  doc: `<svg viewBox="0 0 48 48" aria-hidden="true"><path class="ico" d="M14 8 H28 L36 16 V40 H14 Z"/><path class="ico" d="M28 8 V16 H36"/><path class="ico" d="M19 25 H31 M19 31 H31 M19 19 H24"/></svg>`,
};
function cardIcon(name) {
  return CARD_ICONS[name] || CARD_ICONS.doc;
}

function renderPostCard(post, lang) {
  const tagsHtml = post.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('');
  const metaLabel = 'min de lectura';
  return `
        <a href="${post.url}" class="post-card">
          <div class="post-card-thumb">${cardIcon(post.icon)}</div>
          <div class="post-card-body">
            <div class="post-card-meta">
              <time datetime="${post.dateISO}">${post.dateDisplay}</time>
              <span class="sep">·</span>
              <span>${post.readingTime} ${metaLabel}</span>
            </div>
            <h2>${escapeHtml(post.title)}</h2>
            <p class="post-card-excerpt">${escapeHtml(post.description)}</p>
            <div class="post-card-tags">${tagsHtml}</div>
          </div>
        </a>`;
}

function renderBlogIndex(posts, lang) {
  const config = LANG_CONFIG[lang];
  const template = fs.readFileSync(config.indexLayoutPath, 'utf8');

  const postsHtml = posts.length === 0
    ? `<div class="blog-list-empty">${config.emptyText}</div>`
    : posts.map(p => renderPostCard(p, lang)).join('\n');

  return template.split('{{POSTS_HTML}}').join(postsHtml);
}

function buildBlog() {
  console.log('\n→ Generando blog...');

  const allPosts = { es: readPostsForLang('es'), ca: readPostsForLang('ca') };

  // construir mapa de hreflang por translationKey
  const pairs = {};
  for (const lang of ['es', 'ca']) {
    for (const post of allPosts[lang]) {
      if (!pairs[post.translationKey]) pairs[post.translationKey] = {};
      pairs[post.translationKey][lang] = post.canonicalUrl;
    }
  }

  // generar posts individuales
  for (const lang of ['es', 'ca']) {
    const config = LANG_CONFIG[lang];
    for (const post of allPosts[lang]) {
      const hreflangPair = pairs[post.translationKey] || {};
      const html = renderPost(post, hreflangPair, config);

      const outDir = path.join(config.outBlogDir, post.slug);
      fs.mkdirSync(outDir, { recursive: true });
      const outFile = path.join(outDir, 'index.html');
      fs.writeFileSync(outFile, html);
      console.log(`  ✓ ${path.relative(ROOT, outFile)}`);
    }
  }

  // generar índices del blog
  for (const lang of ['es', 'ca']) {
    const config = LANG_CONFIG[lang];
    const html = renderBlogIndex(allPosts[lang], lang);
    fs.mkdirSync(config.outBlogDir, { recursive: true });
    const outFile = path.join(config.outBlogDir, 'index.html');
    fs.writeFileSync(outFile, html);
    console.log(`  ✓ ${path.relative(ROOT, outFile)}`);
  }

  return allPosts;
}

// ─────────────────────────────────────────────────────
// 2) SITEMAP — bloque BLOG-AUTO
// ─────────────────────────────────────────────────────

const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const BLOG_MARKER_START = '<!-- BLOG-AUTO-START -->';
const BLOG_MARKER_END = '<!-- BLOG-AUTO-END -->';

function sitemapEntry({ loc, hrefEs, hrefCa, lastmod, changefreq, priority }) {
  return `
  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${hrefEs}"/>
    <xhtml:link rel="alternate" hreflang="ca" href="${hrefCa}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${hrefEs}"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function updateSitemap(allPosts) {
  console.log('\n→ Actualizando sitemap.xml (bloque BLOG-AUTO)...');

  let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');

  // construir bloque de entradas
  const entries = [];

  // índices
  entries.push(sitemapEntry({
    loc: `${SITE_URL}/blog/`,
    hrefEs: `${SITE_URL}/blog/`,
    hrefCa: `${SITE_URL}/ca/blog/`,
    lastmod: todayISO(),
    changefreq: 'weekly',
    priority: '0.8',
  }));
  entries.push(sitemapEntry({
    loc: `${SITE_URL}/ca/blog/`,
    hrefEs: `${SITE_URL}/blog/`,
    hrefCa: `${SITE_URL}/ca/blog/`,
    lastmod: todayISO(),
    changefreq: 'weekly',
    priority: '0.8',
  }));

  // posts por translationKey
  const pairs = {};
  for (const lang of ['es', 'ca']) {
    for (const post of allPosts[lang]) {
      if (!pairs[post.translationKey]) pairs[post.translationKey] = {};
      pairs[post.translationKey][lang] = post;
    }
  }
  for (const key of Object.keys(pairs)) {
    const pair = pairs[key];
    const esUrl = pair.es ? pair.es.canonicalUrl : `${SITE_URL}/blog/`;
    const caUrl = pair.ca ? pair.ca.canonicalUrl : `${SITE_URL}/ca/blog/`;
    if (pair.es) {
      entries.push(sitemapEntry({
        loc: pair.es.canonicalUrl,
        hrefEs: esUrl,
        hrefCa: caUrl,
        lastmod: pair.es.dateISO,
        changefreq: 'monthly',
        priority: '0.7',
      }));
    }
    if (pair.ca) {
      entries.push(sitemapEntry({
        loc: pair.ca.canonicalUrl,
        hrefEs: esUrl,
        hrefCa: caUrl,
        lastmod: pair.ca.dateISO,
        changefreq: 'monthly',
        priority: '0.7',
      }));
    }
  }

  const block = `${BLOG_MARKER_START}${entries.join('')}\n  ${BLOG_MARKER_END}`;

  if (sitemap.includes(BLOG_MARKER_START) && sitemap.includes(BLOG_MARKER_END)) {
    const re = new RegExp(`${BLOG_MARKER_START}[\\s\\S]*?${BLOG_MARKER_END}`);
    sitemap = sitemap.replace(re, block);
  } else {
    // inserta el bloque justo antes de </urlset>
    sitemap = sitemap.replace('</urlset>', `  ${block}\n\n</urlset>`);
  }

  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log(`  ✓ sitemap.xml (${entries.length} entradas de blog)`);
}

// ─────────────────────────────────────────────────────
// 3) @region markers — resuelve partials en HTML
// ─────────────────────────────────────────────────────

const REGION_RE = /(<!--\s*@region\s+([^\s>]+)\s*-->)[\s\S]*?(<!--\s*@endregion\s*-->)/g;

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  if (!original.includes('@region')) return false;

  let missing = false;
  const updated = original.replace(REGION_RE, (match, openTag, partialPath, closeTag) => {
    const absPartial = path.join(ROOT, partialPath);
    if (!fs.existsSync(absPartial)) {
      console.warn(`  ! partial no encontrado: ${partialPath} (en ${path.relative(ROOT, filePath)})`);
      missing = true;
      return match;
    }
    const body = fs.readFileSync(absPartial, 'utf8').replace(/\s+$/, '');
    return `${openTag}\n${body}\n${closeTag}`;
  });

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log(`  ✓ ${path.relative(ROOT, filePath)}`);
    return true;
  }
  return missing ? false : null;
}

function walk(dir) {
  let touched = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      touched += walk(full);
    } else if (entry.name.endsWith('.html')) {
      if (processFile(full)) touched++;
    }
  }
  return touched;
}

// ─────────────────────────────────────────────────────
// Pipeline
// ─────────────────────────────────────────────────────

console.log('build.js — pipeline de build');

const allPosts = buildBlog();
updateSitemap(allPosts);

console.log('\n→ Resolviendo @region markers...');
const n = walk(ROOT);
console.log(`  hecho. ${n} archivo(s) HTML actualizado(s).`);

console.log('\n✓ Build completo.');
