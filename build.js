// build.js — resuelve markers @region en HTML usando snippets de /partials.
// Sintaxis en cada HTML:
//
//   <!-- @region partials/footer-es.html -->
//   ...(contenido que sea: se reemplaza por el del partial)...
//   <!-- @endregion -->
//
// Uso: `node build.js` antes de cada commit/deploy. Idempotente.

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP_DIRS = new Set(['node_modules', 'partials', '.git', '.netlify', 'netlify']);

const REGION_RE = /(<!--\s*@region\s+([^\s>]+)\s*-->)[\s\S]*?(<!--\s*@endregion\s*-->)/g;

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  if (!original.includes('@region')) return false;

  let missing = false;
  const updated = original.replace(REGION_RE, (match, openTag, partialPath, closeTag) => {
    const absPartial = path.join(ROOT, partialPath);
    if (!fs.existsSync(absPartial)) {
      console.warn(`  ! partial no encontrado: ${partialPath} (en ${path.relative(ROOT, filePath)})`);
      missing = true;
      return match;
    }
    const body = fs.readFileSync(absPartial, 'utf8').replace(/\s+$/, '');
    return `${openTag}\n${body}\n${closeTag}`;
  });

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log(`  ✓ ${path.relative(ROOT, filePath)}`);
    return true;
  }
  return missing ? false : null; // null = sin cambios, false = error
}

function walk(dir) {
  let touched = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      touched += walk(full);
    } else if (entry.name.endsWith('.html')) {
      if (processFile(full)) touched++;
    }
  }
  return touched;
}

console.log('build.js — resolviendo @region markers...');
const n = walk(ROOT);
console.log(`hecho. ${n} archivo(s) actualizado(s).`);
