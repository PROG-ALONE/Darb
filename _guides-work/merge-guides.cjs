/* يدمج أدلة content/guides-12.js + content/guides-parts/*.js في ملفات content/guides-all-<n>.js
   بازالة التكرار (المعرّف الفائز هو الأحدث)، ثم يطبع تقريرًا.
   الاستعمال: node _guides-work/merge-guides.cjs [--split 6] */
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/macbookair/Downloads/darb-main';
const PARTS = path.join(ROOT, 'content', 'guides-parts');
const split = Number((process.argv[2] || '6').replace(/^-+/, '')) || 6;

globalThis.window = globalThis;
window.SOLUTION_GUIDES = window.SOLUTION_GUIDES || {};
const order = [];
const base = path.join(ROOT, 'content', 'guides-12.js');
if (fs.existsSync(base)) { require(base); order.push(['guides-12.js', Object.keys(window.SOLUTION_GUIDES)]); }
const files = fs.readdirSync(PARTS).filter(f => f.endsWith('.js')).sort();
const merged = new Map();          /* id → نص الكائن كما هو */
const meta = new Map();            /* id → {src, ch} */
let dup = 0, bad = [];

function harvest(src) {
  window.SOLUTION_GUIDES = {};
  delete require.cache[require.resolve(src)];
  try { require(src); } catch (e) { bad.push(src + ': ' + e.message); return; }
  const g = window.SOLUTION_GUIDES;
  for (const id of Object.keys(g)) {
    if (merged.has(id)) dup++;
    merged.set(id, g[id]);
    const ch = (id.match(/^([a-z0-9]+?)c\d/) || [])[1] || '';
    meta.set(id, { src: path.basename(src), ch });
  }
}
harvest(base);
files.forEach(f => harvest(path.join(PARTS, f)));

/* قراءة النص الخام لكل دليل لإعادة البناء بنص مُنسّق ثابت */
function fmt(id, g, srcName) {
  const q = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  const arr = k => (Array.isArray(g[k]) && g[k].length) ? '[' + g[k].map(q).join(', ') + ']' : null;
  const lines = ['window.SOLUTION_GUIDES[' + q(id) + '] = {'];
  if (arr('setup')) lines.push('  setup: ' + arr('setup') + ',');
  if (g.find) lines.push('  find: ' + q(g.find) + ',');
  if (g.law) lines.push('  law: ' + q(g.law) + ',');
  if (arr('work')) lines.push('  work: ' + arr('work') + ',');
  if (g.result) lines.push('  result: ' + q(g.result) + ',');
  if (arr('watch')) lines.push('  watch: ' + arr('watch') + ',');
  if (arr('photo')) lines.push('  photo: ' + arr('photo') + ',');
  if (arr('checks')) lines.push('  checks: ' + arr('checks'));
  lines.push('};');
  return lines.join('\n');
}

const ids = [...merged.keys()].sort();
const chunks = [];
const per = Math.ceil(ids.length / split);
for (let i = 0; i < ids.length; i += per) chunks.push(ids.slice(i, i + per));

const written = [];
chunks.forEach((chunk, i) => {
  const name = 'guides-all-' + (i + 1) + '.js';
  const head = '/* أدلة الحل المدمجة (' + (i + 1) + '/' + chunks.length + ') — ' + chunk.length + ' دليلًا. مولَّدة آليًا: لا تُحرّر يدويًا. */\nwindow.SOLUTION_GUIDES = window.SOLUTION_GUIDES || {};\n\n';
  const body = chunk.map(id => '/* ' + id + ' — ' + (meta.get(id).src) + ' */\n' + fmt(id, merged.get(id))).join('\n\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'content', name), head + body);
  written.push(name + ':' + chunk.length);
});

console.log('الأدلة المدمجة: ' + ids.length + ' | ملفات: ' + written.join(' , '));
console.log('تكرار (معرّف مكرر بين الملفات): ' + dup);
if (bad.length) console.log('أخطاء تحميل:\n  ' + bad.join('\n  '));