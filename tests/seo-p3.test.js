const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ORG='https://www.aimtech.es/#aimtech',MIKE='https://www.aimtech.es/#mike';
const walkFiles=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>['node_modules','partials','.git','.netlify','netlify','content'].includes(e.name)?[]:e.isDirectory()?walkFiles(path.join(d,e.name)):e.name.endsWith('.html')?[path.join(d,e.name)]:[]);
const files=walkFiles('.');const schemas=s=>[...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
const nodes=x=>Array.isArray(x)?x.flatMap(nodes):x&&typeof x==='object'?[x,...Object.values(x).flatMap(nodes)]:[];
const text=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
test('P3-01 organization identity/contact and bilingual footer stay aligned without fabricated street',()=>{
 for(const file of files){const s=fs.readFileSync(file,'utf8');for(const n of schemas(s).flatMap(nodes)){
  if(n['@type']&&['Organization','EducationalOrganization','ProfessionalService','LocalBusiness'].some(t=>[].concat(n['@type']).includes(t))&&/^Aimtech/.test(n.name||'')){
   assert.equal(n.name,'Aimtech Consulting S.L.',file);assert.equal(n.telephone,'+34661869181',file);assert.equal(n.email,'hola@aimtech.es',file);
  }
 }
 const footer=s.match(/<footer data-nosnippet[\s\S]*?<\/footer>/)?.[0];if(footer){assert.match(footer,/Aimtech Consulting S\.L\./);assert.match(footer,/tel:\+34661869181/);assert.match(footer,/mailto:hola@aimtech\.es/);assert.doesNotMatch(footer,/streetAddress|PENDIENTE/);}
 }
});
test('P3-02 verified sameAs only; P3-03 one person identity and no unverified academic credentials',()=>{
 for(const r of ['sobre-mike','ca/sobre-mike']){const s=fs.readFileSync(r+'/index.html','utf8');const p=schemas(s).find(n=>n['@type']==='Person');assert.equal(p['@id'],MIKE);assert.equal(p.name,'Mike Pérez');assert.deepEqual(p.alternateName,['Miquel Pérez','Mike Pérez']);assert.equal(p.worksFor['@id'],ORG);assert.equal(p.alumniOf,undefined);assert.equal(p.affiliation.length,1);assert.match(p.affiliation[0].url,/instructorId=21672/);assert.equal(p.jobTitle,r.startsWith('ca/')?'Enginyer de Solucions d’IA':'Ingeniero de Soluciones de IA');}
 for(const file of [...files,'partials/post-layout-es.html','partials/post-layout-ca.html']){
  const all=schemas(fs.readFileSync(file,'utf8').replace(/\{\{[A-Z_]+\}\}/g,'0')).flatMap(nodes);
  for(const org of all.filter(n=>n['@id']===ORG&&n.name)){
   assert.deepEqual(org.sameAs,['https://www.linkedin.com/company/aimtechsl'],file);
   assert.equal(org.founder['@id'],MIKE,file);
   const person=all.find(n=>n['@type']==='Person'&&n['@id']===MIKE&&n.sameAs);
   assert.ok(person,`${file}: linked Person`);assert.equal(person.worksFor['@id'],ORG,file);
   assert.ok(person.sameAs.includes('https://www.linkedin.com/in/miguelperezperez/'),file);
   assert.ok(person.sameAs.includes('https://cibernarium.barcelonactiva.cat/fitxa-instructor?instructorId=21672'),file);
  }
 }
});
test('P3-04 all 38 ES/CA service pages start with a 40–60-word direct answer',()=>{
 const services=files.filter(f=>!/(?:^|\/)(?:blog|casos|lm)\//.test(f)&&schemas(fs.readFileSync(f,'utf8')).some(n=>['Course','Service'].includes(n['@type'])));assert.equal(services.length,38);
 for(const f of services){const s=fs.readFileSync(f,'utf8'),main=s.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1],intro=main.match(/<p[^>]*data-direct-answer="true"[^>]*>(.*?)<\/p>/s);assert.ok(intro,f);const words=text(intro[1]).split(/\s+/).length;assert.ok(words>=40&&words<=60,`${f}: ${words}`);assert.match(intro[1],/Mike Pérez/);assert.ok(main.indexOf(intro[0])<main.search(/<h2/),f);if(!schemas(s).some(n=>n['@type']==='Course'))assert.doesNotMatch(intro[1],/imparte/);}
});
test('P3 global visible FAQ parity, first H1 and no public pending placeholders',()=>{
 for(const f of files){const s=fs.readFileSync(f,'utf8');assert.doesNotMatch(s,/\[PENDIENTE MIKE/);const main=s.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];if(main){const headings=[...main.matchAll(/<(h[1-6])\b/g)].map(m=>m[1]);assert.equal(headings[0],'h1',f);assert.equal(headings.filter(h=>h==='h1').length,1,f);}
 const visible=text(s.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/g,''));for(const faq of schemas(s).filter(n=>n['@type']==='FAQPage'))for(const q of faq.mainEntity){assert.ok(visible.includes(text(q.name)),`${f}: ${q.name}`);assert.ok(visible.includes(text(q.acceptedAnswer.text)),`${f}: ${q.name} answer`);}
 }
});
