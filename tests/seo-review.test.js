const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
test('R1 diagnostic offer excludes implementation; execution is separate and conditional ES/CA',()=>{
 for(const p of ['consultoria-ia-empresas/index.html','ca/consultoria-ia-empreses/index.html']){
  const s=read(p),phase=n=>s.match(new RegExp('fase_0'+n+'[\\s\\S]*?<p>(.*?)</p>'))[1];
  assert.doesNotMatch(phase(1),/implantamos|implantem|ejecutamos|executem/);
  assert.match(phase(1),/roadmap/);assert.match(phase(2),/presupuesto separado|pressupost separat/);assert.match(phase(2),/complejidad|complexitat/);
  const service=[...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])).find(n=>n['@type']==='Service');
  assert.match(service.offers.name,/Diagnóstico y roadmap|Diagnòstic i roadmap/);assert.match(service.description,/separad|separat/);
 }
});
