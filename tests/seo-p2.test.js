const test=require('node:test'), assert=require('node:assert/strict'),fs=require('node:fs');
const pairs=[['formacion-ai-act-empresas','ca/formacio-ai-act-empreses'],['curso-power-bi-avanzado','ca/curs-power-bi-avancat'],['formacion-copilot-empresas','ca/formacio-copilot-empreses'],['blog/formacion-ia-bonificada-fundae','ca/blog/formacio-ia-bonificada-fundae']];
const selected=process.env.P2_TASK?pairs.slice(+process.env.P2_TASK-1,+process.env.P2_TASK):pairs;
const json=s=>[...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
const text=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
for(const pair of selected)for(const route of pair)test(`P2 ${route}: bilingual SEO, visible FAQ and safe schema`,()=>{
 assert.ok(fs.existsSync(route+'/index.html'),'new route must exist');const s=fs.readFileSync(route+'/index.html','utf8'),nodes=json(s),canonical='https://www.aimtech.es/'+route+'/';
 assert.ok(s.includes(`rel="canonical" href="${canonical}"`));for(const r of pair)assert.ok(s.includes('href="https://www.aimtech.es/'+r+'/"'));
 assert.match(s,/hreflang="x-default"/);assert.equal((s.match(/<h1\b/g)||[]).length,1);assert.match(s.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1],/^[\s\S]*?<h1[\s\S]*?<h2/);
 const faq=nodes.find(n=>n['@type']==='FAQPage');assert.ok(faq);const visible=new Map([...s.matchAll(/<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gs)].map(m=>[text(m[1]),text(m[2])]));for(const q of faq.mainEntity)assert.equal(visible.get(q.name),q.acceptedAnswer.text);
 const course=nodes.find(n=>n['@type']==='Course');assert.ok(course||nodes.some(n=>n['@type']==='BlogPosting'));if(course){assert.ok(course.provider);assert.ok(course.inLanguage);assert.ok(!('courseWorkload' in course));for(const i of course.hasCourseInstance||[])assert.equal(i['@type'],'CourseInstance');}
 assert.doesNotMatch(s,/PENDIENTE MIKE|100\s*% gratis|sin carga administrativa|cumple el artículo 4|compleix l.article 4/i);
 assert.ok(fs.readFileSync('sitemap.xml','utf8').includes(canonical));assert.match(s,/@region partials\/nav-/);assert.match(s,/@region partials\/footer-/);assert.match(s,/href="\/(?:ca\/)?contact[oe]\//);
 if(course){assert.match(s,/@region partials\/fundae-/);assert.ok(faq.mainEntity.some(q=>q.name.includes('FUNDAE')));}
 const image=s.match(/property="og:image" content="https:\/\/www.aimtech.es(.*?)"/)[1],buf=fs.readFileSync('.'+image);assert.equal(buf.readUInt32BE(16),1200);assert.equal(buf.readUInt32BE(20),630);
 if(route.includes('copilot')){assert.ok(!course.offers);assert.ok(!course.timeRequired);assert.match(s,/licenc/i);assert.match(s,/sint[eèé]ti/i);}
 if(route.includes('ai-act')){assert.ok(!course.offers);assert.match(s,/2025/);assert.match(s,/2026/);assert.match(s,/jur[ií]dic/);}
 if(route.includes('avanza')||route.includes('avancat')){assert.equal(course.timeRequired,'PT20H');assert.equal(course.offers.priceSpecification.minPrice,4400);assert.equal((s.match(/<blockquote/g)||[]).length,3);assert.match(s,/Windows/);const hours=[...s.matchAll(/data-module-hours="([\d.]+)"/g)].map(m=>+m[1]);assert.equal(hours.reduce((a,b)=>a+b,0),20);}
});
