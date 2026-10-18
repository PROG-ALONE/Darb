#!/usr/bin/env node
// wire.mjs — يربط ملفات محتوى جديدة بالتطبيق: index.html + sw.js (CORE + رفع إصدار CACHE) بشكل idempotent.
// usage: node wire.mjs <fileName1> <fileName2> ...
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.env.WIRE_ROOT || '/Users/macbookair/Downloads/darb-main';
const files = process.argv.slice(2).map(f => f.replace(/^content\//, ''));
if (!files.length) { console.error('usage: wire.mjs <fileName...>'); process.exit(1); }

// ---- index.html ----
const idxPath = path.join(ROOT, 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');
const tagRe = /^[ \t]*<script src="content\/([^"]+)"><\/script>[ \t]*$/gm;
const present = new Set();
let lastTag = null, m;
while ((m = tagRe.exec(idx))) { present.add(m[1]); lastTag = m; }
const toAdd = files.filter(f => !present.has(f));
if (toAdd.length && lastTag) {
  const insertAt = lastTag.index + lastTag[0].length;
  const block = '\n' + toAdd.map(f => `<script src="content/${f}"></script>`).join('\n');
  idx = idx.slice(0, insertAt) + block + idx.slice(insertAt);
  fs.writeFileSync(idxPath, idx);
}
console.log('index.html: added', toAdd.length, toAdd.length ? toAdd.join(', ') : '(none)');

// ---- sw.js ----
const swPath = path.join(ROOT, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
const swAdded = [];
const newRefs = [];
for (const f of files) {
  const ref = `./content/${f}`;
  if (!sw.includes(`'${ref}'`)) { newRefs.push(`'${ref}', `); swAdded.push(f); }
}
if (newRefs.length) {
  sw = sw.replace(/'\.\/manifest\.webmanifest'/, newRefs.join('') + "'./manifest.webmanifest'");
}
// رفع إصدار الكاش فقط عند وجود تغيير فعلي
const changed = toAdd.length + swAdded.length > 0;
const v = sw.match(/const CACHE = 'darb-v(\d+)'/);
if (changed && v) sw = sw.replace(/const CACHE = 'darb-v\d+'/, `const CACHE = 'darb-v${+v[1] + 1}'`);
fs.writeFileSync(swPath, sw);
console.log('sw.js: CORE added', swAdded.length, '| CACHE ->', v ? 'darb-v' + (+v[1] + (changed ? 1 : 0)) : '?? (not found)');
