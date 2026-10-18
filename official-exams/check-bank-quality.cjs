#!/usr/bin/env node
/* فاحص جودة بنك الأسئلة المضاف يدويًّا (النقطة ١٠).
   يمنع الأخطاء الشائعة: معرّفات مكرّرة، أسئلة اختيار من متعدد، حل فارغ، خطوات فارغة. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const dir = path.join(ROOT, 'content');

const errs = [], warns = [];
const seen = new Map();          // id -> أول ملف استعمله
const seenCh = new Set();        // فصل يُعرض مرتين (علمي/أدبي) يُفحص مرة واحدة
let total = 0, bySrc = { book: 0, extra: 0 };

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'h.js' && !f.startsWith('ministerial-') && !f.startsWith('guides'))) {
  global.window = {};
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  require(path.join(dir, 'h.js'));
  try { require(path.join(dir, f)); } catch (e) { errs.push('تعذّر تحميل ' + f + ': ' + e.message); continue; }
  for (const p of (global.window.CONTENT_PARTS || [])) {
    const ch = p.chapter;
    /* الفصل الواحد قد يُسجَّل لفرعين (علمي/أدبي) — نفحصه مرة واحدة */
    if (!ch || seenCh.has(ch.id)) continue;
    seenCh.add(ch.id);
    for (const t of (ch.topics || [])) {
        for (const pr of (t.problems || [])) {
          total++;
          bySrc[pr.src] = (bySrc[pr.src] || 0) + 1;
          const at = f + ' › ' + t.id;

          /* 1) المعرّف فريد في كل بنية المحتوى */
          if (!pr.id) errs.push('معرّف مفقود في ' + at);
          else if (seen.has(pr.id)) errs.push('معرّف مكرّر ' + pr.id + ' في ' + at + ' (الأول في ' + seen.get(pr.id) + ')');
          else seen.set(pr.id, at);

          /* 2) سؤال مفتوح: لا خيارات ولا إجابة صحيحة جاهزة */
          if (pr.o !== undefined) errs.push('سؤال اختيار من متعدد في ' + at + ' — المطلوب مفتوح');
          if (pr.c !== undefined) errs.push('إجابة جاهزة (c) في ' + at + ' — المطلوب حلًّا مفصّلًا في ans');

          /* 3) النص والحل والخطوات — مع كشف الحشائش الحرفية (نص التمرين/الجواب/خطوة) */
          const STUB = /^(نص التمرين|الجواب|خطوة|شرح|إجابة|مثال|نص|\.\.\.|…|-)$/i;
          if (!pr.text || String(pr.text).trim().length < 12) errs.push('نص السؤال قصير جدًّا في ' + at);
          else if (STUB.test(String(pr.text).trim())) errs.push('حشو حرفي في نص السؤال في ' + at + ': ' + JSON.stringify(pr.text));
          if (!pr.ans || String(pr.ans).trim().length < 1) errs.push('الحل فارغ في ' + at);
          else if (STUB.test(String(pr.ans).trim())) errs.push('حشو حرفي في الحل في ' + at + ': ' + JSON.stringify(pr.ans));
          else if (String(pr.ans).trim().length < 4 && !/[0-9٠-٩ωiπ±√∫∑∏Δ∇∂√∞∈∉⊂⊃∪∩∀∃∇⇒⇔∴∵∑∏∮∯∰∱∲∳]/.test(pr.ans)) {
            /* حلول قصيرة مسموح بها فقط إذا كانت خطواتها ≥ 2 وتثبت الإجابة بالكامل */
            const stepsOk = Array.isArray(pr.steps) && pr.steps.length >= 2 && pr.steps.every(s => String(s).trim().length >= 4);
            if (!stepsOk) errs.push('الحل قصير جدًّا في ' + at + ' — اكتب الإجابة كاملة');
          }
          if (!Array.isArray(pr.steps) || !pr.steps.length) errs.push('لا خطوات حل في ' + at);
          else {
            if (pr.steps.some(s => !s || String(s).trim().length < 3 || STUB.test(String(s).trim()))) errs.push('خطوة فارغة/حشو في ' + at);
            if (pr.steps.length === 1) warns.push('خطوة واحدة فقط في ' + at + ' — الحلّ يكون أوضح بخطوتين فأكثر');
          }

          /* 4) sec غير مستعمل فعلًا (الزمن يُشتقّ من عدد الخطوات بـ suggestSec) — نرصد تعارض الدلالة فقط */
          if (typeof pr.sec === 'string' && !/^[0-9-]{1,6}$/.test(pr.sec)) warns.push('sec غير معروف في ' + at + ': ' + pr.sec);
          if (pr.sec > 600 && typeof pr.sec === 'number') warns.push('sec كبير جدًّا في ' + at + ': ' + pr.sec + ' — قسّمه سؤالين');

          /* 5) المصدر يقتضي مرجعًا لأسئلة الكتاب */
          if (pr.src === 'book' && !pr.ref) warns.push('أسئلة كتاب بلا ref في ' + at);
          /* 6) لا نصوص إنجليزية وحدها في المواد العربية */
          if (/[A-Za-z]{5,}/.test(pr.text) && !/[؀-ۿ]/.test(pr.text) && /الكيمياء|الفيزياء|الرياضيات|اللغة العربية|التربية الإسلامية/.test(p.key)) {
            warns.push('نص إنجليزي وحده في ' + at + ' — تأكّد أنه مصطلح علمي لا سؤال كامل');
          }
        }
      }
    }
}

console.log('فحص ' + total + ' مسألة · book=' + (bySrc.book || 0) + ' extra=' + (bySrc.extra || 0));
if (warns.length) { console.log('\n⚠ تحذيرات (' + warns.length + '):'); warns.slice(0, 30).forEach(w => console.log('  ' + w)); }
if (errs.length) { console.log('\n❌ أخطاء (' + errs.length + '):'); errs.slice(0, 40).forEach(e => console.log('  ' + e)); process.exit(1); }
console.log('\n✅ لا أخطاء');
