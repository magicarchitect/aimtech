const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
for (const locale of ['es', 'ca']) {
  test(`Power BI ${locale}: curated proof, precise scores and privacy`, () => {
    const html = fs.readFileSync(`partials/testimonials-power-bi-${locale}.html`, 'utf8');
    assert.equal((html.match(/<figure class="testimonial-card/g) || []).length, 8);
    for (const marker of ['4,61', '4,71/5', '4,52/5', '4,60/5', '42', 'width:92.2%', 'Júlia Faura', 'Alfredo', '4,67/5', 'width:93.4%', 'Lídia Barceló Soler', 'Ferran Anglès', 'Victor', 'Laura Coma', 'Àngels Rodes', 'RosMari Serrano', 'LAGUPRES S.L.U.', 'Cibernàrium (Barcelona Activa)']) assert.ok(html.includes(marker), marker);
    assert.equal((html.match(/<blockquote lang="(?:es|ca)">/g) || []).length, 8);
    assert.ok(html.includes(locale === 'es' ? 'Media individual' : 'Mitjana individual'));
    assert.doesNotMatch(html, /[\w.+-]+@[\w.-]+\.[a-z]{2,}|PB-\d+|Generalitat de Catalunya|Sheila|Natalia|26 respuestas|26 respostes|31 respuestas|31 respostes/);
  });
}
