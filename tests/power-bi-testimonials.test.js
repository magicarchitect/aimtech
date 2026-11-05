const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const proof = require('./fixtures/power-bi-feedback-summary.json');
const texts = {
  marta: 'Un curs molt complet per iniciar-te al món del Power BI on no només hi ha teoria sinó que tens pràctiques que fas tu sol i es corregeix amb el professor. El Miquel ha sigut un gran professor perquè resolia tots el dubtes sense pensar a avançar temari, ha prioritzat que ens quedés clar què fèiem i com fer-ho.',
  oscar: 'Mi idea al inscribirme en el curso era adquirir conocimientos básico sobre Power BI y lo termino teniendo una idea de cómo empezar y sabiendo que  con práctica se podrán conseguir algunas cosas decentes.'
};
for (const locale of ['es', 'ca']) {
  test(`Power BI ${locale}: validated historical metrics and authorized original-language quotes`, () => {
    const html = fs.readFileSync(`partials/testimonials-power-bi-${locale}.html`, 'utf8');
    assert.equal((html.match(/<figure class="testimonial-card/g) || []).length, 8);
    for (const metric of Object.values(proof.metrics)) {
      const cents = Math.floor((2 * metric.sumHundredths + metric.n) / (2 * metric.n));
      assert.equal((cents / 100).toFixed(2).replace('.', ','), metric.display);
      assert.ok(html.includes(metric.display), metric.display);
      assert.equal(metric.n, proof.responses);
    }
    for (const marker of ['64', 'data-rating-fill="93.4%"', 'width:67%', 'Júlia Faura', 'Alfredo', '4,67/5', 'Lídia Barceló Soler', 'Laura Coma', 'Àngels Rodes', 'RosMari Serrano', 'LAGUPRES S.L.U.', 'Cibernàrium (Barcelona Activa)', 'Marta González Fidalgo', 'Óscar Mesejo']) assert.ok(html.includes(marker), marker);
    for (const [lang, quote] of [['ca', texts.marta], ['es', texts.oscar]]) assert.ok(html.includes(`<blockquote lang="${lang}">${quote}</blockquote>`));
    assert.equal((html.match(/<blockquote lang="(?:es|ca)">/g) || []).length, 8);
    assert.equal((html.match(new RegExp(locale === 'es' ? 'Participante · Curso básico Power BI en Barcelona Activa' : 'Participant · Curs bàsic Power BI a Barcelona Activa', 'g')) || []).length, 2);
    assert.ok(html.includes(locale === 'es' ? 'Media individual' : 'Mitjana individual'));
    assert.doesNotMatch(html, /[\w.+-]+@[\w.-]+\.[a-z]{2,}|PB-\d+|Generalitat de Catalunya|SARA ARES|26 respuestas|26 respostes|31 respuestas|31 respostes|42 respuestas|42 respostes/);
  });
}
