const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const pages = ['power-bi', 'ca/power-bi', 'curso-power-bi-empresas', 'ca/curs-power-bi-empreses', 'curso-power-bi-barcelona', 'ca/curs-power-bi-barcelona'];
const read = p => fs.readFileSync(`${p}/index.html`, 'utf8');
const text = s => s.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const walk = (v, fn) => { if (Array.isArray(v)) v.forEach(x => walk(x, fn)); else if (v && typeof v === 'object') { fn(v); Object.values(v).forEach(x => walk(x, fn)); } };
for (const route of pages) {
  test(`${route}: truthful data, Barcelona delivery and valid CourseInstance modes`, () => {
    const html = read(route);
    assert.doesNotMatch(html, /datasets (?:de negocio |de negoci )?reales|datasets (?:de negoci )?reals|dataset de negoci real\b|Barcelona y Cataluña|Barcelona i Catalunya|Barcelona · Cataluña · online|Barcelona · Catalunya · online/);
    assert.match(html, /datasets ficti|datasets de negoci ficti|datasets de negocio ficti/);
    const h1 = text(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1]);
    assert.doesNotMatch(h1, /(?:datos|dades)\s+(?:reales|reals|de verdad|de veritat)/i);
    assert.doesNotMatch(html, /adaptar ritmo, ejemplos y ejercicios|adaptar (?:el )?ritme, exemples i exercicis|[Aa]daptamos la formación al tamaño del equipo y a los datos disponibles/i);
    assert.match(html, /(?:presencial\/in-company (?:en|a) Barcelona|in-company (?:en|a) Barcelona)/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    let courses = 0, modes = 0;
    schemas.forEach(s => walk(s, node => {
      if (node['@type'] === 'Course') { courses++; assert.ok(!('courseMode' in node)); assert.ok(node.hasCourseInstance); }
      if ('courseMode' in node) { modes++; assert.equal(node['@type'], 'CourseInstance'); }
      assert.notEqual(node['@type'], 'Review');
    }));
    assert.ok(courses > 0 && modes >= 2);
  });
}
for (const route of pages) {
  test(`${route}: every structured FAQ exactly matches its visible question and answer`, () => {
    const html = read(route);
    const visible = new Map([...html.matchAll(/<article\b[^>]*>\s*<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>\s*<\/article>/gs)]
      .map(m => [text(m[1]), text(m[2])]));
    for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      walk(JSON.parse(match[1]), node => {
        if (node['@type'] !== 'FAQPage') return;
        assert.ok(node.mainEntity.length > 0);
        for (const faq of node.mainEntity) {
          const question = text(faq.name);
          assert.ok(visible.has(question), `Structured question must be visible: ${question}`);
          assert.equal(text(faq.acceptedAnswer.text), visible.get(question), question);
        }
      });
    }
    // Pages without FAQPage (currently CA and local ES) must not gain invented schema.
    assert.ok(visible.size > 0 || !html.includes('"@type": "FAQPage"'));
  });
}
test('Power BI commercial ES/CA: clear scope, documented recordings and practice resource', () => {
  for (const route of ['curso-power-bi-empresas', 'ca/curs-power-bi-empreses']) {
    const html = read(route);
    assert.match(html, /id="alcance-formacion"/);
    assert.match(html, /(?:grabación de cada sesión|enregistrament de cada sessió)/);
    assert.match(html, /href="\/(?:ca\/)?blog\/(?:power-query-limpiar-datos|power-query-netejar-dades)\//);
    assert.match(html, /(?:no datos internos|no dades internes)/);
    assert.match(html, /(?:durante la sesión|durant la sessió)/);
  }
});
test('Power BI ES/CA: program and business purchase own distinct title/H1 intents', () => {
  for (const [program, commercial, syllabus, buyer] of [
    ['power-bi', 'curso-power-bi-empresas', 'Programa Power BI', 'Curso Power BI para empresas'],
    ['ca/power-bi', 'ca/curs-power-bi-empreses', 'Programa Power BI', 'Curs Power BI per a empreses']
  ]) {
    const p = read(program), c = read(commercial);
    for (const [html, phrase] of [[p, syllabus], [c, buyer]]) {
      assert.ok(text(html.match(/<title>(.*?)<\/title>/s)[1]).includes(phrase));
      assert.ok(text(html.match(/<h1>(.*?)<\/h1>/s)[1]).includes(phrase));
    }
    assert.match(p, /Power Query/); assert.match(p, /DAX/);
    assert.ok(p.includes(`href="/${commercial}/"`));
    assert.ok(c.includes(`href="/${program}/"`));
  }
});
