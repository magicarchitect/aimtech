const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const locales = [
  {page:'formacion-ia-empresas', lang:'es', title:'Formación IA a medida para empresas | Aimtech', rules:[/misma tarea/, /complejidad comparable/, /mismos criterios de aceptación/, /sintético, anonimizado o expresamente autorizado/, /preparación y revisión/, /correcciones/, /privacidad/, /costes recurrentes/, /no acredita ahorro, ROI ni rendimiento en producción/], blank:'Por registrar'},
  {page:'ca/formacio-ia-empreses', lang:'ca', title:'Formació IA a mida per a empreses | Aimtech', rules:[/mateixa tasca/, /complexitat comparable/, /mateixos criteris d’acceptació/, /sintètic, anonimitzat o expressament autoritzat/, /preparació i revisió/, /correccions/, /privacitat/, /costos recurrents/, /no acredita estalvi, ROI ni rendiment en producció/], blank:'Per registrar'},
];
for(const l of locales) test(`${l.lang}: comparable measurement template without invented results`, () => {
  const html=fs.readFileSync(path.join(root,l.page,'index.html'),'utf8');
  const block=html.match(/<section id="medicion-formacion"[\s\S]*?<\/section>/)?.[0];
  assert.ok(block, 'missing measurement section');
  for(const rule of l.rules) assert.match(block,new RegExp(rule.source,'i'));
  assert.match(block,/<caption id="measurement-caption">/);
  assert.match(block,/tabindex="0" role="region" aria-labelledby="measurement-caption"/);
  assert.equal((block.match(/scope="row"/g)||[]).length,5);
  assert.equal((block.match(new RegExp(`<td>${l.blank}</td>`,'g'))||[]).length,10);
  assert.doesNotMatch(block,/\d+\s*(%|minutos|minuts|€)/);
  assert.ok(html.includes(`<title>${l.title}</title>`));
  const before = cp.execFileSync('git', ['show', `b5e92c5773ca2956c04fcbae2fc759d71c9761e2:${l.page}/index.html`], {encoding:'utf8', cwd:root});
  for (const pattern of [/<h1[\s\S]*?<\/h1>/g, /<link rel="canonical"[^>]*>/g, /<link rel="alternate"[^>]*>/g, /<script type="application\/ld\+json">[\s\S]*?<\/script>/g]) assert.deepEqual(html.match(pattern), before.match(pattern));
  for (const href of [...html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)]) assert.ok(fs.existsSync(path.join(root, href[1], href[1].endsWith('/') ? 'index.html' : '')), `broken route ${href[1]}`);
  const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
  assert.ok(schema.some(n=>n['@type']==='Course'&&n.offers.priceSpecification.minPrice===2500));
  assert.ok(!schema.some(n=>n['@type']==='FAQPage'));
});
for(const l of locales) test(`${l.lang}: training vs automation stays controlled with locale CTA`, () => {
  const html=fs.readFileSync(path.join(root,l.page,'index.html'),'utf8');
  const block=html.match(/<section id="formacion-o-automatizacion"[\s\S]*?<\/section>/)?.[0];
  assert.ok(block,'missing decision guide');
  const ca=l.lang==='ca';
  for(const rule of ca ? [/pràctica/, /criteri/, /estable, mesurable i autoritzat/, /revisió humana/, /abast separat/] : [/práctica/, /criterio/, /estable, medible y autorizado/, /revisión humana/, /alcance separado/]) assert.match(block,rule);
  for(const route of ca ? ['/ca/automatitzacio-processos-ia/','/ca/contacte/'] : ['/automatizacion-procesos-ia/','/contacto/']) assert.ok(block.includes(`href="${route}"`));
  assert.ok(block.includes(ca ? 'Expliqueu-nos quina tasca voleu millorar i quantes persones sou →' : 'Cuéntanos qué tarea queréis mejorar y cuántas personas sois →'));
  const main=html.match(/<main>([\s\S]*?)<\/main>/)[1];
  assert.ok(main.includes(`href="${ca?'/ca/sobre-mike/':'/sobre-mike/'}"`));
  for(const route of ca?['/ca/ia-aplicada/','/ca/automatitzacio-processos-ia/']:['/ia-aplicada/','/automatizacion-procesos-ia/']) {
    const links=[...main.matchAll(new RegExp(`href="${route}"`,'g'))];
    assert.ok(links.length<=2,`redundant links to ${route}`);
  }
});
for(const l of locales) test(`${l.lang}: self-guided 30-day review is not a contracted follow-up`, () => {
  const html=fs.readFileSync(path.join(root,l.page,'index.html'),'utf8');
  const block=html.match(/<section id="revision-30-dias"[\s\S]*?<\/section>/)?.[0];
  assert.ok(block,'missing self-review guide');
  for(const rule of l.lang==='es' ? [/30 días/, /guía de autoevaluación/, /plantillas/, /tareas/, /errores recurrentes/, /no incluye seguimiento/, /contrata o acuerda expresamente/] : [/30 dies/, /guia d’autoavaluació/, /plantilles/, /tasques/, /errors recurrents/, /no inclou seguiment/, /contracta o s’acorda expressament/]) assert.match(block,rule);
  assert.doesNotMatch(block,/\d+\s*(%|€)|garantiz|garanteix/);
});
