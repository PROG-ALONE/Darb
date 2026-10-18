#!/usr/bin/env node
/**
 * check-ministerial.cjs — فاحص بنك الأسئلة الوزارية (content/ministerial-*.js)
 *
 * لماذا فاحص منفصل؟ لأن check-bank-quality.cjs يتجاهل ملفات ministerial-*
 * عمديًّا (كانت تُبنى آليًّا)، بينما الملفات المضافة يدويًّا من الامتحانات
 * الرسمية تحتاج ضمانات أدق: إجابة مفصّلة منطقية، وربط صحيح بموضوع الكتاب.
 *
 * ما يفحصه:
 *   1. الملف يُحمَّل كـ JS صالح ويحوي جزءًا واحدًا على الأقل.
 *   2. المفتاح بصيغة <grade>:<branch>:<subject>.
 *   3. لكل سؤال: نص سؤال مفيد، وإجابة تفصيلية (why) لا تقل عن 30 حرفًا.
 *   4. الربط بموضوع الكتاب (tid) موجود فعليًّا في محتوى index.html المحمّل.
 *   5. تناسق الاختيار من متعدد: خيارات 2–5 ومؤشّر c داخل المدى.
 *   6. الأسئلة المفتوحة بلا خيارات: يجب أن يكون c = null/-1/غير موجود.
 *   7. totalQuestions و byChapter يطابقان المحتوى الفعلي.
 *
 * الاستعمال: node official-exams/check-ministerial.cjs [جزء من اسم الملف]...
 * الناتج: أخطاء (❌) وتنبيهات (⚠️)، وخروج رقمي ≠ 0 عند وجود أخطاء.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'content');
const INDEX = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const contentScripts = [...INDEX.matchAll(/<script src="(content\/[^"]+\.js)"\s*><\/script>/g)].map((m) => m[1]);
global.window = {};
require(path.join(DIR, 'h.js'));
for (const rel of contentScripts) {
  const file = path.basename(rel);
  if (file === 'h.js' || /^figs|^ministerial-|^guides|^explainers/.test(file)) continue;
  try { require(path.join(ROOT, rel)); }
  catch (e) { throw new Error(file + ': تعذّر تحميل فهرس المحتوى — ' + e.message); }
}
const TOPICS = {};
(global.window.CONTENT_PARTS || []).forEach((part) => {
  if (!part || !part.key || !part.chapter || !Array.isArray(part.chapter.topics)) return;
  (TOPICS[part.key] = TOPICS[part.key] || []).push({ ch: part.chapter.id, topics: part.chapter.topics });
});

const args = process.argv.slice(2);
const ALL = args.includes('--all');
const prefixes = args.filter((a) => a !== '--all');

const files = fs
  .readdirSync(DIR)
  .filter((f) => f.startsWith('ministerial-') && f.endsWith('.js'))
  /* ministerial-extracted*.js مصنوعة آليًّا من OCR ويرث نقصًا تاريخيًّا
     (why فارغ + معرّفات p12bioexN غير مربوطة بالمنهج)، فلا تُحسب ضمن
     الفحص الصارم ما لم يُطلَب --all. الملفات المكتوبة من الامتحانات
     الرسمية يجب أن تمرّ كاملة. */
  .filter((f) => ALL || !f.startsWith('ministerial-extracted'))
  .filter((f) => !prefixes.length || prefixes.some((p) => f.includes(p)));

const errors = [];
const warns = [];
const stats = [];

/* تجميع معرّفات المواضيع + فصولها لكل مفتاح */
function topicMap(key) {
  const arr = TOPICS[key] || [];
  const map = new Map();
  for (const ch of arr) for (const t of ch.topics || []) map.set(t.id, ch.ch);
  return map;
}

for (const f of files) {
  global.window = {};
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  try {
    require(path.join(DIR, 'h.js'));
    require(path.join(DIR, f));
  } catch (e) {
    errors.push(f + ': تعذّر التحميل — ' + e.message);
    continue;
  }
  const parts = (global.window.MINISTERIAL_BANK || []).filter((p) => p && p.questions);
  if (!parts.length) { errors.push(f + ': لا يحوي أي جزء'); continue; }

  for (const part of parts) {
    const key = part.key || '';
    const tag = f + '[' + (key || '?') + ']';
    if (!/^\d+:(sci|lit|-):/.test(key)) errors.push(tag + ': المفتاح غير صالح');

    const tmap = topicMap(key);
    if (!tmap.size) warns.push(tag + ': المفتاح غير موجود في محتوى المنهج الحالي (لن تظهر الإحالات)');

    const qs = part.questions;
    if (part.totalQuestions !== qs.length) errors.push(tag + ': totalQuestions=' + part.totalQuestions + ' بينما العدد الفعلي ' + qs.length);

    const realCh = {};
    let nOpen = 0, nMcq = 0;

    qs.forEach((q, i) => {
      const at = tag + '#' + i;
      const text = (q.q || '').trim();
      if (text.length < 12) errors.push(at + ': نص السؤال قصير جدًّا أو مفقود');
      if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(text)) errors.push(at + ': نص السؤال يحوي محارف تحكّم');

      const why = (q.why || '').trim();
      if (why.length < 30) errors.push(at + ': الإجابة غير مفصّلة بما يكفي (why=' + why.length + ' حرفًا، والحد 30)');
      else if (why.length < 60) warns.push(at + ': إجابة قصيرة نسبيًّا (' + why.length + ' حرفًا)');

      if (!q.tid) errors.push(at + ': لا يحوي tid');
      else if (tmap.size && !tmap.has(q.tid)) errors.push(at + ': tid="' + q.tid + '" غير موجود في محتوى المنهج الحالي');
      else if (tmap.has(q.tid)) {
        const ch = tmap.get(q.tid);
        realCh[ch] = (realCh[ch] || 0) + 1;
      }

      const hasO = Array.isArray(q.o) && q.o.length > 0;
      if (hasO) {
        nMcq++;
        if (q.o.length < 2 || q.o.length > 5) errors.push(at + ': عدد الخيارات ' + q.o.length + ' (المسموح 2–5)');
        if (q.o.some((o) => typeof o !== 'string' || !o.trim())) errors.push(at + ': خيار فارغ أو ليس نصًّا');
        if (new Set(q.o.map((s) => s.trim())).size !== q.o.length) warns.push(at + ': خيارات مكرّرة');
        if (!Number.isInteger(q.c) || q.c < 0 || q.c >= q.o.length) errors.push(at + ': مؤشّر الإجابة c=' + JSON.stringify(q.c) + ' خارج المدى');
      } else {
        nOpen++;
        if (q.c != null && q.c !== -1) errors.push(at + ': سؤال بلا خيارات لكن c=' + JSON.stringify(q.c) + ' — يجب أن يكون null/-1');
      }
    });

    const declared = part.byChapter || {};
    const chKeys = new Set([...Object.keys(declared), ...Object.keys(realCh)]);
    for (const k of chKeys) {
      if ((declared[k] || 0) !== (realCh[k] || 0)) errors.push(tag + ': byChapter.' + k + '=' + declared[k] + ' بينما الفعلي ' + (realCh[k] || 0));
    }

    stats.push({ file: f, key, n: qs.length, open: nOpen, mcq: nMcq, chapters: Object.keys(realCh).length });
  }
}

/* ── فحص اكتمال الحلول في ملفات OCR الإرثية ─────────────────────────────
   هذه الملفات مصنوعة آليًّا من bank-atomic.json، ويرثت tid إرثيًّا
   (p12bioexN) لا يطابق فهرس المواضيع. لذلك لا تُفحص صِلتها بالموضوع
   هنا، بل يُفحص ما يهمّ المستخدم فعلًا: أن لكل سؤال حلًّا مفصّلًا.
   الحدّ: 30 حرفًا خطًّا أحمر (خطأ)، و60 حرفًا هدفًا (تحذير). */
const LEGACY = fs
  .readdirSync(DIR)
  .filter((f) => f.startsWith('ministerial-extracted') && f.endsWith('.js'));

let legN = 0, legEmpty = [], legShort = 0;
for (const f of LEGACY) {
  global.window = {};
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  try { require(path.join(DIR, f)); } catch (e) { errors.push(f + ': تعذّر التحميل — ' + e.message); continue; }
  const parts = (global.window.MINISTERIAL_BANK || []).filter((p) => p && p.questions);
  parts.forEach((part) => (part.questions || []).forEach((q, i) => {
    legN++;
    const why = (q.why || '').trim();
    if (why.length < 30) legEmpty.push(f + '#' + i + ' (' + why.length + ' حرفًا) — ' + (q.q || '').slice(0, 48));
    else if (why.length < 60) legShort++;
  }));
}
if (LEGACY.length) {
  stats.push({ file: LEGACY.join(' · '), key: 'OCR إرثي (فحص الحلول)', n: legN, open: legN, mcq: 0, chapters: 0 });
  if (legEmpty.length) {
    /* هذه ملفات مصنوعة آليًّا من OCR: غياب الحلّ فيها هدف مستقبلي موثّق،
       لا عائق على صحة البنك المكتوب يدويًّا. تُعرض تنبيهات خطًّا أحمر
       إلا مع --all فتصبح أخطاء (فحوص الإرث الشامل). */
    const line = (msg) => (ALL ? errors : warns).push(msg);
    line('اكتمال الحلول: ' + legEmpty.length + ' سؤالًا بلا حلّ مفصّل في ملفات OCR الإرثية');
    legEmpty.slice(0, 15).forEach((e) => line('  ↳ ' + e));
    if (legEmpty.length > 15) line('  … و' + (legEmpty.length - 15) + ' سؤالًا آخر بلا حل');
  }
}

console.log('فحص ملفات ministerial-*.js  (' + files.length + ' ملف)\n');
for (const s of stats) console.log('  ' + s.key + ' · ' + s.n + ' سؤالًا · مفتوح ' + s.open + ' · اختيار ' + s.mcq + ' · ' + s.chapters + ' فصل');
console.log('');

if (warns.length) {
  console.log('تنبيهات (' + warns.length + '):');
  warns.slice(0, 25).forEach((w) => console.log('  ⚠ ' + w));
  if (warns.length > 25) console.log('  … و' + (warns.length - 25) + ' تنبيهًا آخر');
  console.log('');
}
if (errors.length) {
  console.log('أخطاء (' + errors.length + '):');
  errors.slice(0, 60).forEach((e) => console.log('  ❌ ' + e));
  if (errors.length > 60) console.log('  … و' + (errors.length - 60) + ' خطأ آخر');
  console.log('\n❌ فشل الفحص');
  process.exit(1);
}
console.log('✅ لا أخطاء — البنك الوزاري سليم');
