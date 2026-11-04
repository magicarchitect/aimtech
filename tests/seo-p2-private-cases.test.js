const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const routes=['casos/formacion-ia-ingenieria-farmaceutica/','casos/formacion-power-bi-administracion-publica/','casos/diagnostico-ia-empresa-industrial/','ca/casos/formacio-ia-enginyeria-farmaceutica/','ca/casos/formacio-power-bi-administracio-publica/','ca/casos/diagnostic-ia-empresa-industrial/'];
function htmlFiles(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(e.name.startsWith('.')||['node_modules','content','tests'].includes(e.name))return [];const p=path.join(dir,e.name);return e.isDirectory()?htmlFiles(p):e.name.endsWith('.html')?[p]:[];});}
test('P2-05 private case templates never enter published tree or sitemap',()=>{
 const sitemap=fs.readFileSync('sitemap.xml','utf8');for(const r of routes){assert.equal(fs.existsSync(r+'index.html'),false);assert.equal(sitemap.includes('https://www.aimtech.es/'+r),false);}
 for(const p of htmlFiles('.')){const s=fs.readFileSync(p,'utf8');for(const r of routes)assert.equal(s.includes('href="/'+r),false,p);assert.doesNotMatch(s,/PENDIENTE MIKE|PLANTILLA PRIVADA/);}
 for(const dir of ['casos-pendientes','docs/casos-pendientes','content/casos-pendientes'])assert.equal(fs.existsSync(dir),false);
});
