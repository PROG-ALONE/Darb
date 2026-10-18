#!/usr/bin/env node
/* يعرض المواضيع التي لا مسائل لها (problems) مرتبة بحسب ملف المحتوى،
   مع معرّف الموضوع وعنوانه — ليستعمله مؤلّفو بنك الأسئلة (النقطة ١٠). */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const dir = path.join(ROOT, 'content');

const only = process.argv[2] || null;   // فلترة اختيارية باسم المادة
const out = {};

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'h.js' && !f.startsWith('ministerial-') && !f.startsWith('guides'))) {
  global.window = {};
  /* require يخزّن الوحدة، فلا يُعاد تنفيذها على نافذة جديدة — نمسح الكاش لكل ملف */
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  require(path.join(dir, 'h.js'));
  try { require(path.join(dir, f)); } catch (e) { continue; }
  for (const p of (global.window.CONTENT_PARTS || [])) {
    const subj = p.key.split(':').slice(2).join(':');
    if (only && subj !== only) continue;
    const ch = p.chapter;
    const missing = (ch.topics || []).filter(t => !(t.problems || []).length);
    if (!missing.length) continue;
    const k = f + '  ·  ' + subj + '  ·  ' + ch.id + ' ' + ch.title;
    out[k] = missing.map(t => ({ id: t.id, sec: t.sec, title: t.title, en: t.en, why: (t.why || '').slice(0, 120) }));
  }
}

let total = 0;
for (const k of Object.keys(out)) {
  console.log('\n### ' + k + '  — ' + out[k].length + ' موضوعًا بلا مسائل');
  out[k].forEach(t => { total++; console.log('  ' + t.id + '  «' + t.title + '»  (sec ' + t.sec + ')'); });
}
console.log('\nTOTAL topics needing problems: ' + total);
