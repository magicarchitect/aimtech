const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const pages=[['consultoria-ia-empresas','Implantación de IA para empresas | Aimtech Barcelona','Implantación de IA para empresas: del diagnóstico a producción.'],['ca/consultoria-ia-empreses','Implantació d’IA per a empreses | Aimtech Barcelona','Implantació d’IA per a empreses: del diagnòstic a producció.']];
const read=p=>fs.readFileSync(p+'/index.html','utf8');
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const schemas=s=>[...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
for(const [p,title,h1] of pages)test(`implementation owner and separate diagnostic contract: ${p}`,()=>{
 const s=read(p),nodes=schemas(s),services=nodes.filter(n=>n['@type']==='Service');
 assert.equal(s.match(/<title>(.*?)<\/title>/s)[1],title);
 assert.equal(plain(s.match(/<h1[^>]*>(.*?)<\/h1>/s)[1]),h1);
 for(const key of ['og:title','twitter:title'])assert.ok(s.includes(`${key === 'og:title' ? 'property' : 'name'}="${key}" content="${title}"`));
 assert.equal(services.length,2);assert.equal(services[0].offers,undefined);
 assert.equal(services[1].offers.priceSpecification.minPrice,950);
 assert.equal(services[1].offers.itemOffered['@id'],services[1]['@id']);
 assert.match(services[1].name,/Diagnóstico|Diagnòstic/);
 const scope=s.match(/<section id="alcance-incluye"[\s\S]*?<\/section>/)[0];
 for(const term of [/piloto|pilot/,/integraci/,/permis/,/aceptación|acceptació/,/humana/,/producci/,/continuidad|continuïtat/])assert.match(scope,term);
 assert.doesNotMatch(s,/Primer quick win en producci|Escala [yi] ROI|remoto en toda España|remot a tot Espanya/);
 const visible=new Map([...s.matchAll(/<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gs)].map(m=>[plain(m[1]),plain(m[2])]));
 for(const q of nodes.find(n=>n['@type']==='FAQPage').mainEntity)assert.equal(visible.get(q.name),q.acceptedAnswer.text);
});
for(const [p] of pages)test(`Barcelona implementation coordination within existing owner: ${p}`,()=>{
 const s=read(p),block=s.match(/<section id="barcelona">[\s\S]*?<\/section>/)[0];
 assert.match(plain(block),/Implantación de IA para empresas en Barcelona|Implantació d’IA per a empreses a Barcelona/);
 for(const term of [/requisitos|requisits/,/interlocutor/,/accesos|accessos/,/reuniones|reunions/,/validaci/,/remot/,/acord|acuerd/])assert.match(block,term);
 assert.doesNotMatch(block,/toda España|tot Espanya/);
});
for(const [course,owner] of [['ia-aplicada','/consultoria-ia-empresas/'],['ca/ia-aplicada','/ca/consultoria-ia-empreses/']])test(`advanced training has contextual implementation bridge: ${course}`,()=>{
 const s=read(course),main=s.match(/<main\b[^>]*>(.*?)<\/main>/s)[1];
 const block=main.match(/<section id="proyecto-implantacion"[\s\S]*?<\/section>/)?.[0];assert.ok(block,'visible main section, not navigation/footer');
 assert.ok(block.includes(`href="${owner}"`));assert.match(block,/presupuesto separado|pressupost separat/);assert.match(block,/no incluye|no inclou/);
 assert.match(s.match(/<title>(.*?)<\/title>/s)[1],/20 h/);
});

const changedPages=['consultoria-ia-empresas','ca/consultoria-ia-empreses','ia-aplicada','ca/ia-aplicada'];
test('changed commercial pages carry the actual modification date',()=>{
 const sitemap=fs.readFileSync('sitemap.xml','utf8');
 for(const p of changedPages){const url=`https://www.aimtech.es/${p}/`;const entry=[...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find(m=>m[1].includes(`<loc>${url}</loc>`));assert.ok(entry,url);assert.ok(entry[1].includes('<lastmod>2026-11-23</lastmod>'),url);}
});
for(const p of changedPages)test(`rendered document and local contextual destinations: ${p}`,()=>{
 const s=read(p);assert.equal((s.match(/<h1\b/g)||[]).length,1);
 assert.ok(s.includes(`<link rel="canonical" href="https://www.aimtech.es/${p}/"`));
 const main=s.match(/<main\b[^>]*>(.*?)<\/main>/s)[1];
 for(const m of main.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
  const url=new URL(m[1],`https://www.aimtech.es/${p}/`);if(url.origin!=='https://www.aimtech.es')continue;
  const target=url.pathname.endsWith('/')?url.pathname.slice(1)+'index.html':url.pathname.slice(1);assert.ok(fs.existsSync(target),m[1]);
  if(url.hash){const html=fs.readFileSync(target,'utf8');assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),m[1]);}
 }
});
