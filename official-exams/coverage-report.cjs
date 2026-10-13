#!/usr/bin/env node
/* تقرير تغطية المحتوى: لكل مادة كم موضوعًا، وكم مسألة، وكم اختبار قصير، وكم موضوع بلا مسائل.
   يُستعمل لكشف المواد الناقصة قبل إكمال بنك الأسئلة (النقطة ١٠). */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

global.window = {};
const dir = path.join(ROOT, 'content');
/* h.js أولًا: يُعرِّف window.H ومساعدات الكتل (Q/TF/X/B/…) التي تستعملها بقية الملفات */
require(path.join(dir, 'h.js'));
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'h.js' && !f.startsWith('ministerial-') && !f.startsWith('guides'));
for (const f of files) {
  try { require(path.join(dir, f)); } catch (e) { console.error('LOAD FAIL', f, e.message); }
}
const H = global.window.CONTENT_PARTS || [];
const bySub = {};
let total = 0;

for (const entry of H) {
  const key = entry.key, ch = entry.chapter;
  if (!ch || !ch.topics) continue;
  const name = key.split(':').slice(2).join(':');
  for (const t of ch.topics) {
    const blocks = t.explain || [];
    const probs = t.problems || [];
    const quiz = (t.quiz || []).length;
    const blanks = (t.blanks || []).length;
    bySub[name] = bySub[name] || { topics: 0, blocks: 0, probs: 0, quiz: 0, blanks: 0, noProb: [], noQuiz: [] };
    const s = bySub[name];
    s.topics++; s.blocks += blocks.length; s.probs += probs.length; s.quiz += quiz; s.blanks += blanks;
    if (!probs.length) s.noProb.push(ch.id + '/' + t.id);
    if (!quiz.length) s.noQuiz.push(ch.id + '/' + t.id);
    total++;
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(pad('المادة', 20) + pad('مواضيع', 9) + pad('كتل', 8) + pad('مسائل', 9) + pad('اختبار', 9) + pad('بدون مسائل', 12) + 'بدون اختبار');
for (const name of Object.keys(bySub).sort()) {
  const s = bySub[name];
  console.log(pad(name, 20) + pad(s.topics, 9) + pad(s.blocks, 8) + pad(s.probs, 9) + pad(s.quiz, 9) + pad(s.noProb.length, 12) + s.noQuiz.length);
}
console.log('\nTOTAL topics', total);

if (process.argv[2] === '-v') {
  for (const name of Object.keys(bySub).sort()) {
    const s = bySub[name];
    console.log('\n== ' + name + ' — مواضيع بلا مسائل ==');
    s.noProb.forEach(x => console.log('  ' + x));
  }
}
