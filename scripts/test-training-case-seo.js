// Focused honesty and bilingual SEO regression for the illustrative training case.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pairs = [
  ['es', '/casos/formacion-ia-equipos-no-tecnicos/', '/formacion-ia-empresas/', 'Cómo abordaríamos la formación en IA de un equipo no técnico', 'Ejemplo ilustrativo · No es un caso real', '/sobre-mike/', '/ia-aplicada/', '/contacto/'],
  ['ca', '/ca/casos/formacio-ia-equips-no-tecnics/', '/ca/formacio-ia-empreses/', 'Com abordaríem la formació en IA d’un equip no tècnic', 'Exemple il·lustratiu · No és un cas real', '/ca/sobre-mike/', '/ca/ia-aplicada/', '/ca/contacte/']
];
for (const [lang, route, landing, h1, disclosure, bio, hub, contact] of pairs) {
  const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
  const main = html.match(/<main>([\s\S]*?)<\/main>/)[1];
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.ok(main.includes(h1));
  assert.ok(main.includes(disclosure));
  assert.ok(html.includes(`<html lang="${lang}">`));
  assert.ok(html.includes(`rel="canonical" href="https://www.aimtech.es${route}"`));
  for (const [otherLang, otherRoute] of pairs) {
    assert.ok(html.includes(`hreflang="${otherLang}" href="https://www.aimtech.es${otherRoute}"`));
  }
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const nodes = blocks.flatMap(m => JSON.parse(m[1]));
  const article = nodes.find(n => n['@type'] === 'Article');
  assert.equal(article.headline, h1);
  assert.equal(article.inLanguage, lang);
  assert.equal(article.author.url, `https://www.aimtech.es${bio}`);
  assert.equal(article.dateModified, '2026-10-05');
  assert.ok(nodes.some(n => n['@type'] === 'BreadcrumbList'));
  assert.ok(!nodes.some(n => ['Review', 'AggregateRating', 'FAQPage', 'HowTo'].includes(n['@type'])));
  for (const target of [landing, bio, hub, contact]) assert.ok(main.includes(`href="${target}"`));
  const landingHtml = fs.readFileSync(path.join(root, landing, 'index.html'), 'utf8');
  assert.ok(landingHtml.match(/<main>([\s\S]*?)<\/main>/)[1].includes(`href="${route}"`));
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const url = new URL(m[1], 'https://www.aimtech.es');
    if (url.hostname !== 'www.aimtech.es' || !['http:', 'https:'].includes(url.protocol)) continue;
    const local = path.join(root, url.pathname, url.pathname.endsWith('/') ? 'index.html' : '');
    assert.ok(fs.existsSync(local), `Missing local target: ${local}`);
  }
}
console.log(JSON.stringify({status: 'PASS', pages: pairs.length, checks: 'honesty markers, H1, metadata, schema, reciprocal hreflang/landing links, local assets and links'}));
