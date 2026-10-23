const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p, 'index.html'), 'utf8');
const locales = [
  { lang: 'es', pages: ['consultoria-ia-empresas', 'ia-agentica'], case: 'casos/automatizacion-facturas-pdfs-ia', contact: '/contacto/', internal: /experiencia operativa interna/, notClient: /no un caso de cliente ni un ejercicio de formación/, supplier: /sin alta automática en FacturaScripts/, chronology: /secuencia cronológica/, customer: /facturas de clientes online de AdventuriQ/, noROI: /No acredita ahorros, ROI/, review: /revisión humana/ },
  { lang: 'ca', pages: ['ca/consultoria-ia-empreses', 'ca/ia-agentica'], case: 'ca/casos/automatitzacio-factures-pdf-ia', contact: '/ca/contacte/', internal: /experiència operativa interna/, notClient: /no un cas de client ni un exercici de formació/, supplier: /sense alta automàtica a FacturaScripts/, chronology: /seqüència cronològica/, customer: /factures de clients online d’AdventuriQ/, noROI: /No acredita estalvis, ROI/, review: /revisió humana/ },
];
for (const locale of locales) {
  for (const page of locale.pages) {
    test(`${page}: operational proof is honest, bounded and contextual`, () => {
      const html = read(page);
      const proof = html.match(/<section id="experiencia-interna"[\s\S]*?<\/section>/)?.[0];
      assert.ok(proof, 'missing internal operational proof');
      for (const rule of [locale.internal, locale.notClient, locale.supplier, locale.chronology, locale.customer, locale.noROI, locale.review]) assert.match(proof, rule);
      for (const term of ['Gmail', 'PDFs', 'Drive', 'duplica']) assert.ok(proof.includes(term));
      assert.equal((proof.match(new RegExp(`href="/${locale.case}/"`, 'g')) || []).length, 1);
      assert.ok(proof.includes(`href="${locale.contact}"`));
      assert.doesNotMatch(proof, /\b\d+\s*(%|horas|hores|€)|cliente satisfecho|client satisfet/);
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
      assert.equal((html.match(/id="experiencia-interna"/g) || []).length, 1);
      const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1]));
      assert.ok(nodes.some(n => n['@type'] === 'Service'));
      assert.ok(html.includes(`href="https://www.aimtech.es/${page}/"`));
    });
  }
  test(`${locale.lang}: case no longer promises automatic supplier accounting`, () => {
    const html = read(locale.case);
    assert.match(html, locale.supplier);
    assert.match(html, locale.chronology);
    assert.match(html, /AdventuriQ/);
    assert.doesNotMatch(html, /Solo pasan al alta automática|Només passen a l'alta automàtica|Simula y crea solo si cumple|Simula i crea només si compleix|facturas elegibles|factures elegibles/);
  });
  test(`${locale.lang}: existing case links back contextually, not just via navigation`, () => {
    const body = read(locale.case).match(/<article class="case-body">([\s\S]*?)<\/article>/)[1];
    for (const page of locale.pages) assert.equal((body.match(new RegExp(`href="/${page}/"`, 'g')) || []).length, 1);
  });
}
