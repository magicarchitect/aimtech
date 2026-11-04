const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
test('R4 Power BI sources and outputs distinguish authors, eligible viewers, PPU and refresh',()=>{
 for(const p of ['content/blog/es/2026-05-28-es-gratis-power-bi.md','content/blog/ca/2026-06-01-power-bi-es-gratuit.md','blog/es-gratis-power-bi/index.html','ca/blog/power-bi-es-gratuit/index.html']){
  const s=read(p);assert.doesNotMatch(s,/Se paga por capacidad, no por usuario|Es paga per capacitat, no per usuari/);
  assert.match(s,/Viewer/);assert.match(s,/F64/);assert.match(s,/autores.*Pro o PPU|autors.*Pro o PPU/);
  assert.match(s,/workspace PPU exige PPU|workspace PPU exigeix PPU/);
  assert.match(s,/actualización programada tiene requisitos propios|actualització programada té requisits propis/);
 }
});
test('R1 diagnostic offer excludes implementation; execution is separate and conditional ES/CA',()=>{
 for(const p of ['consultoria-ia-empresas/index.html','ca/consultoria-ia-empreses/index.html']){
  const s=read(p),phase=n=>s.match(new RegExp('fase_0'+n+'[\\s\\S]*?<p>(.*?)</p>'))[1];
  assert.doesNotMatch(phase(1),/implantamos|implantem|ejecutamos|executem/);
  assert.match(phase(1),/roadmap/);assert.match(phase(2),/presupuesto separado|pressupost separat/);assert.match(phase(2),/complejidad|complexitat/);
  const service=[...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])).find(n=>n['@type']==='Service');
  assert.match(service.offers.name,/Diagnóstico y roadmap|Diagnòstic i roadmap/);assert.match(service.description,/separad|separat/);
 }
});
