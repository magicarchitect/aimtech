// Focused regression gate for the bilingual AI-training cluster. No dependencies.
// Run after npm run build: node scripts/test-ai-training-seo.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://www.aimtech.es';
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const jsonld = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => {
  const data = JSON.parse(m[1]);
  return Array.isArray(data) ? data : [data];
});
const alternates = html => Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2]]));
const pairs = [
  ['formacion-ia-empresas/', 'ca/formacio-ia-empreses/'],
  ['formacion-claude-empresas/', 'ca/formacio-claude-empreses/'],
  ['curso-chatgpt-empresas/', 'ca/curs-chatgpt-empreses/'],
  ['ia-aplicada/', 'ca/ia-aplicada/'],
];
let pages = 0;
for (const pair of pairs) {
  for (const route of pair) {
    const html = read(`${route}index.html`);
    assert(html.includes(`<link rel="canonical" href="${SITE}/${route}"`));
    assert.deepEqual(alternates(html), { es: `${SITE}/${pair[0]}`, ca: `${SITE}/${pair[1]}`, 'x-default': `${SITE}/${pair[0]}` });
    const nodes = jsonld(html);
    const course = nodes.find(n => n['@type'] === 'Course');
    assert(course, route);
    assert(!('courseMode' in course), route);
    assert(!('areaServed' in course), route);
    if (course.hasCourseInstance) {
      assert(course.hasCourseInstance.every(n => n['@type'] === 'CourseInstance'));
      for (const instance of course.hasCourseInstance) {
        if (instance.courseMode === 'Onsite') assert.equal(instance.location.name, 'Barcelona');
      }
    }
    const crumbs = nodes.find(n => n['@type'] === 'BreadcrumbList').itemListElement;
    assert.equal(crumbs.at(-1).item, `${SITE}/${route}`);
    assert.equal(new Set(crumbs.map(n => n.item)).size, crumbs.length);
    assert.deepEqual(crumbs.map(n => n.position), crumbs.map((_, i) => i + 1));
    if (route.includes('chatgpt')) assert.equal(crumbs[1].item, `${SITE}/${route.startsWith('ca/') ? 'ca/formacio-ia-empreses/' : 'formacion-ia-empresas/'}`);
    if (route.includes('formacion-ia-empresas') || route.includes('formacio-ia-empreses')) assert.equal(crumbs.length, 2);
    if (route.includes('claude') || route.includes('ia-aplicada')) {
      assert(/material sint[éeè]tic/.test(html), route);
      assert(/no incl(?:uye|ou) desp/.test(course.description), route);
    }
    pages++;
  }
}
assert(read('formacion-ia-empresas/index.html').includes('<title>Formación IA a medida para empresas | Aimtech</title>'));
for (const [route, id] of [['formacion-ia-empresas/', 'ejemplo-diseno-formacion'], ['ca/formacio-ia-empreses/', 'exemple-disseny-formacio']]) {
  const html = read(`${route}index.html`);
  assert(html.includes(`id="${id}"`));
  assert(/no (un caso de cliente ni resultados obtenidos|un cas de client ni resultats obtinguts)/.test(html));
}
const sitemap = read('sitemap.xml');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
let unpaired = 0;
for (const entry of entries) {
  const loc = /<loc>([^<]+)<\/loc>/.exec(entry)[1];
  const route = loc.slice(SITE.length);
  const file = path.join(ROOT, route, 'index.html');
  assert(fs.existsSync(file), route);
  const html = fs.readFileSync(file, 'utf8');
  if (route.includes('/blog/') && route !== '/blog/' && route !== '/ca/blog/') {
    const alts = alternates(html);
    const xmlAlts = Object.fromEntries([...entry.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2]]));
    assert.deepEqual(xmlAlts, alts, loc);
    for (const [lang, href] of Object.entries(alts)) {
      if (lang === 'x-default') continue;
      assert(!href.endsWith('/blog/'), loc);
      const other = alternates(read(`${href.slice(SITE.length + 1)}index.html`));
      assert(Object.values(other).includes(loc), `${loc} -> ${href}`);
    }
    if (!alts.ca) unpaired++;
  }
}
// Exercise the renderer's absent-translation behavior, including future CA-only posts.
const build = read('build.js');
const renderSource = build.slice(build.indexOf('function renderPost('), build.indexOf('// iconos temáticos'));
const context = { fs, escapeHtml: String, jsonStr: s => JSON.stringify(String(s)).slice(1, -1), SITE_URL: SITE };
vm.createContext(context);
vm.runInContext(renderSource + '\nthis.renderPost = renderPost;', context);
for (const lang of ['es', 'ca']) {
  const post = { lang, canonicalUrl: `${SITE}/${lang === 'es' ? '' : 'ca/'}blog/test/`, title: 'Test', description: 'Test', tags: [], htmlContent: '<p>Test</p>' };
  const rendered = context.renderPost(post, { [lang]: post.canonicalUrl }, { layoutPath: path.join(ROOT, `partials/post-layout-${lang}.html`) });
  const alts = alternates(rendered);
  assert.equal(alts[lang], post.canonicalUrl);
  assert.equal(alts['x-default'], post.canonicalUrl);
  assert(!alts[lang === 'es' ? 'ca' : 'es']);
}
console.log(JSON.stringify({ status: 'PASS', trainingPages: pages, sitemapUrls: entries.length, untranslatedArticles: unpaired, rendererFixtures: 2 }));
