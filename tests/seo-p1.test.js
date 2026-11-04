const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const read=r=>fs.readFileSync(r+'/index.html','utf8');
const text=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const schemas=s=>[...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
const training=['power-bi','curso-power-bi-empresas','curso-power-bi-barcelona','formacion-ia-empresas','ia-aplicada','curso-chatgpt-empresas','formacion-claude-empresas','ca/power-bi','ca/curs-power-bi-empreses','ca/curs-power-bi-barcelona','ca/formacio-ia-empreses','ca/ia-aplicada','ca/curs-chatgpt-empreses','ca/formacio-claude-empreses'];
for(const r of training)test(`P1 FUNDAE ${r}: reusable block before pricing and exact visible FAQ`,()=>{
 const s=read(r),f=s.indexOf('id="fundae"');assert.ok(f>0);assert.ok(f<s.search(/<section id="(?:precios|preus|contratacion|contractacio)"/));
 const visible=new Map([...s.matchAll(/<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gs)].map(m=>[text(m[1]),text(m[2])]));
 const faqs=schemas(s).filter(n=>n['@type']==='FAQPage').flatMap(n=>n.mainEntity);assert.equal(faqs.filter(q=>q.name.includes('FUNDAE')).length,1);
 for(const q of faqs){assert.ok(visible.has(q.name),q.name);assert.equal(q.acceptedAnswer.text.replace(/&/g,'&'),visible.get(q.name).replace(/&amp;/g,'&'));}
 assert.match(visible.get(faqs.find(q=>q.name.includes('FUNDAE')).name),/crédito|crèdit/);
});
test('P1-01: Barcelona onsite scope and full company proof stay separate',()=>{
 for(const r of ['curso-power-bi-barcelona','ca/curs-power-bi-barcelona']){const s=read(r);assert.match(s,/Sant Cugat/);assert.match(s,/Cornellà/);assert.match(s,/4\.400 €/);assert.equal((s.match(/<blockquote/g)||[]).length,0);assert.ok(schemas(s).some(n=>n['@type']==='EducationalOrganization'&&n.areaServed.name==='Barcelona'));}
 for(const r of ['curso-power-bi-empresas','ca/curs-power-bi-empreses']){const s=read(r);assert.match(s,/42 res/);assert.match(s,/4,61/);assert.match(s,/id="roi-formacion"/);}
});
test('P1-02: advanced course intent is not the umbrella',()=>{for(const r of ['ia-aplicada','ca/ia-aplicada']){const s=read(r),t=text(s.match(/<title>(.*?)<\/title>/s)[1]),h=text(s.match(/<h1[^>]*>(.*?)<\/h1>/s)[1]);assert.match(t,/20 h/);assert.doesNotMatch(t+' '+h,/Barcelona|formación IA para empresas/i);assert.match(s,/href="\/(?:ca\/formacio-ia-empreses|formacion-ia-empresas)\//);}});
test('P1-03: merged supplier source and output removed, direct 301s to extant owners',()=>{
 assert.ok(!fs.existsSync('blog/proveedor-formacion-ia-empresas-como-elegir/index.html'));
 assert.ok(!fs.readdirSync('content/blog/es').some(p=>p.includes('proveedor-formacion-ia-empresas-como-elegir')));
 assert.doesNotMatch(fs.readFileSync('sitemap.xml','utf8'),/proveedor-formacion-ia-empresas-como-elegir/);
 const config=fs.readFileSync('netlify.toml','utf8');for(const [a,b] of [['/blog/proveedor-formacion-ia-empresas-como-elegir/','/blog/formacion-ia-empresas-barcelona-como-elegir/'],['/ca/blog/proveidor-formacio-ia-empreses-com-triar/','/ca/blog/formacio-ia-empreses-barcelona-com-triar/']]){assert.ok(config.includes(`from = "${a}"\n  to = "${b}"\n  status = 301`));assert.ok(fs.existsSync(b.slice(1)+'index.html'));}
});
test('P1-04: six visible FAQs, scoped Service offer and roadmap',()=>{for(const r of ['consultoria-ia-empresas','ca/consultoria-ia-empreses']){const s=read(r),n=schemas(s);assert.equal(n.find(n=>n['@type']==='FAQPage').mainEntity.length,6);const service=n.find(n=>n['@type']==='Service');assert.equal(service.offers.priceSpecification.minPrice,950);assert.equal(service.areaServed.length,3);assert.match(s,/roadmap en 30 d/);assert.doesNotMatch(s,/id="fundae"/);}});
const count=s=>text(s.match(/<main\b[^>]*>(.*?)<\/main>/s)[1].replace(/<(?:svg|script|style)\b[\s\S]*?<\/(?:svg|script|style)>/g,'')).split(/\s+/).length;
for(const r of ['formacion-ia-empresas','consultoria-ia-empresas','ia-agentica','ca/formacio-ia-empreses','ca/consultoria-ia-empreses','ca/ia-agentica'])test(`P1-05 ${r}: 20–30% main copy reduction with scope and security`,()=>{
 const s=read(r),before=cp.execFileSync('git',['show',`c737653:${r}/index.html`],{encoding:'utf8'}),reduction=1-count(s)/count(before);assert.ok(reduction>=.20&&reduction<=.30,`${reduction}`);assert.match(s,/id="alcance-incluye"/);assert.match(s,/revisión humana|revisió humana/);assert.ok(schemas(s).some(n=>n['@type']==='FAQPage'));
});
