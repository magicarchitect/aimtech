const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const cp = require('node:child_process');
const routes = ['power-bi','ca/power-bi','curso-power-bi-empresas','ca/curs-power-bi-empreses','curso-power-bi-barcelona','ca/curs-power-bi-barcelona'];
const read = p => fs.readFileSync(p, 'utf8');
for (const route of routes) test(`${route}: metadata fields and preserved proof`, () => {
  const path = `${route}/index.html`, html = read(path);
  const old = cp.execFileSync('git', ['show', `dd4c0f464bb7b777af491048e6ab72a57007f660:${path}`], {encoding:'utf8'});
  const title = html.match(/<title>(.*?)<\/title>/s)[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.ok(title.length <= 75 && desc.length <= 180);
  for (const key of ['og:title','twitter:title']) assert.ok(html.includes(`${key}\" content=\"${title}\"`));
  assert.equal((html.match(/<h1[ >]/g)||[]).length, 1);
  const canonical = /<link rel="canonical"[^>]*>/g;
  const alternates = /<link rel="alternate"[^>]*>/g;
  assert.deepEqual(html.match(canonical),old.match(canonical));
  assert.deepEqual(html.match(alternates),old.match(alternates));
  // November curation replaces exactly two general-company quotes; no blanket snapshot bypass.
  const replaced = [
    '<blockquote lang="ca">Bon professor. Sessions molt ben estructurades i documentades. En Miquel molta voluntat i paciència per entendre els dubtes, necessitats i validar que havien estat ateses.</blockquote>',
    '<blockquote lang="ca">La formació no només és molt valuosa en l’àmbit de Power BI, sinó que també obre la porta a coneixements útils en molts altres entorns professionals. T’ajuda a entendre i optimitzar eines que fas servir cada dia. Una experiència absolutament recomanable i un gran encert per a qualsevol persona que vulgui fer un pas endavant.</blockquote>'
  ];
  if (!route.endsWith('barcelona')) { for (const quote of old.match(/<blockquote[\s\S]*?<\/blockquote>/g)||[]) {
    if (route.includes('empres') && replaced.includes(quote)) continue;
    assert.ok(html.includes(quote));
  } } else { assert.equal((html.match(/<blockquote/g)||[]).length, 0, 'No local modality evidence; never republish general testimonials as local proof'); }
  const marker = /<!-- @region partials\/power-bi-testimonials[^>]*-->[\s\S]*?<!-- @endregion -->/g;
  assert.deepEqual(html.match(marker),old.match(marker));
  assert.ok(!/"@type":\s*"(?:Review|AggregateRating)"/.test(html));
});
test('sitemap: approved URL union, real targets and monotonic content-backed lastmod', () => {
  const baseline='dd4c0f464bb7b777af491048e6ab72a57007f660', origin='https://www.aimtech.es';
  const entries=s=>new Map([...s.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>[m[1].match(/<loc>(.*?)<\/loc>/)[1],m[1]]));
  const a=entries(read('sitemap.xml')), b=entries(cp.execFileSync('git',['show',`${baseline}:sitemap.xml`],{encoding:'utf8'}));
  // Subsequent approved SEO work legitimately adds pages and changes shared partials.
  // Explicit union prevents this regression test from accepting arbitrary new URLs.
  const added=['/blog/formacion-ia-bonificada-fundae/','/ca/blog/casos-us-ia-departaments/','/ca/blog/curs-ia-in-company-barcelona/','/ca/blog/curs-intelligencia-artificial-empreses-que-incloure/','/ca/blog/formacio-ia-bonificada-fundae/','/ca/curs-power-bi-avancat/','/ca/formacio-ai-act-empreses/','/ca/formacio-copilot-empreses/','/curso-power-bi-avanzado/','/formacion-ai-act-empresas/','/formacion-copilot-empresas/'];
  const removed=origin+'/blog/proveedor-formacion-ia-empresas-como-elegir/';
  assert.deepEqual([...a.keys()].sort(),[...new Set([...b.keys()].filter(u=>u!==removed).concat(added.map(r=>origin+r)))].sort());
  for(const [url,entry] of a){
    const file=url.slice(origin.length+1)+'index.html';assert.ok(fs.existsSync(file),url);
    const date=entry.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];assert.match(date,/^\d{4}-\d{2}-\d{2}$/);assert.equal(new Date(date).toISOString().slice(0,10),date);
    const page=read(file);assert.ok(page.includes(`rel="canonical" href="${url}"`));assert.doesNotMatch(page,/<meta[^>]+content="[^"]*noindex/);
    if(b.has(url)){
      const oldDate=b.get(url).match(/<lastmod>(.*?)<\/lastmod>/)[1];assert.ok(date>=oldDate,`${url}: date regressed`);
      if(date!==oldDate){const before=cp.execFileSync('git',['show',`${baseline}:${file}`],{encoding:'utf8'});assert.notEqual(page,before,`${url}: date changed without rendered content changing`);}
    }
  }
  for(const r of routes)assert.ok(a.has(`${origin}/${r}/`));
});
