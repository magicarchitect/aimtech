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
  for (const quote of old.match(/<blockquote[\s\S]*?<\/blockquote>/g)||[]) assert.ok(html.includes(quote));
  const marker = /<!-- @region partials\/power-bi-testimonials[^>]*-->[\s\S]*?<!-- @endregion -->/g;
  assert.deepEqual(html.match(marker),old.match(marker));
  assert.ok(!/"@type":\s*"(?:Review|AggregateRating)"/.test(html));
});
test('sitemap: lastmod only changed for six actual Power BI landings', () => {
  const path='sitemap.xml', html=read(path), old=cp.execFileSync('git',['show',`dd4c0f464bb7b777af491048e6ab72a57007f660:${path}`],{encoding:'utf8'});
  const entries = s => new Map([...s.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>[m[1].match(/<loc>(.*?)<\/loc>/)[1],m[1]]));
  const a=entries(html),b=entries(old);assert.equal(a.size,b.size);
  let changed=0;for(const [url,value] of a) if(value!==b.get(url)){changed++;assert.ok(routes.some(r=>url===`https://www.aimtech.es/${r}/`));assert.ok(value.includes('<lastmod>2026-10-23</lastmod>'));}
  assert.equal(changed,6);
});
