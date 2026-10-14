#!/usr/bin/env node
/**
 * check-arabic.cjs — فاحص النقاء اللغوي (النحو والخلط اللغوي)
 *
 * لماذا؟ الخطأ الأشيع في بنوك الأسئلة المولّدة آليًّا هو «خرَفَن النص»:
 * جمل إنجليزية أو صينية متسرّبة داخل حقل عربي، أو تكرار لفظ متتابع،
 * أو أقواس/علامات منكسرة تُفسد القراءة أمام الطالب. الفاحص العادي
 * (check-ministerial) يقيس الطول وصحة المعرّفات، لكنه لا يفحص سلامة اللغة.
 *
 * ما يفحصه (في كل content/ministerial-*.js غير extracted):
 *   1. النصوص العربية لا تحوي كلمات لاتينية «متفرّقة» (فقط رموز مسموحة).
 *   2. لا محارف تحكّم ولا مربّعات □ ولا مسافات مكرّرة.
 *   3. لا تكرار لفظي متتابع («في في»، «من من»...).
 *   4. اتزان الأقواس والأQuote في نص السؤال والجواب.
 *   5. الجواب يجيب فعلًا عن السؤال (يحتوي كلمة مفتاحية من السؤال).
 *   6. في المحتوى التعليمي (content/*.js): النصوص العربية لا تحتوي
 *      جُملًا إنجليزية/صينية متسرّبة.
 *
 * الاستعمال: node official-exams/check-arabic.cjs [--content]
 *   بدون وسائط: يفحص بنوك الأسئلة الوزارية.
 *   --content: يفحص ملفات المحتوى التعليمي أيضًا (أبطأ، تحذيري).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'content');
const args = process.argv.slice(2);
const WITH_CONTENT = args.includes('--content');
const prefixes = args.filter((a) => a !== '--content');

/* رموز لاتينية مسموحة داخل النص العربي: وحدات ورموز علمية وسنة ومعرّف مادة */
const ALLOWED_LATIN = /^(?:[A-Za-z]\d*|[0-9]+(?:\.[0-9]+)?|pH|pOH|DNA|RNA|CO2|O2|H2O|NaCl|eV|keV|MeV|GeV|kg|km|cm|mm|mg|ml|mV|kV|Hz|kHz|MHz|GHz|mA|kA|W|kW|J|kJ|mol|K|Ω|F|H|T|N|Pa|kPa|atm|°C|°F|Fig|etc|vs|i\.e|e\.g|Dr|Mr|Ms|v|V|A|t|y|x|z|d|s|u|n|m|c|b|a)$/;

const errors = [];
const warns = [];

const arCount = (s) => (String(s).match(/[\u0600-\u06FF]/g) || []).length;
const hasCJK = (s) => /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/.test(String(s));
const hasCtl = (s) => /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(String(s));
const hasBox = (s) => /[□�]|�/.test(String(s));

/* كلمات إنجليزية شائعة تدلّ على جملة مسرّبة (ليست رموزًا علمية) */
const EN_STOP = new Set(('to of the and is are was were in on for with that this these those ' +
  'except according thermodynamic state functions taken th orie tieger joules related by from ' +
  'as or not but with which what when where how why all any some each other than then there here ' +
  'be been being have has had do does did can could should would will shall may might must ' +
  'about after before between during through under over above below both many much most least ' +
  'one two three four five first second third also just only very such into out up down ' +
  'law of hess thalpy thalpies enthalpy energy heat work volume pressure temperature').split(' '));

/* اكتشاف «الخلط اللغوي الحقيقي» لا الرموز العلمية:
   · عبارة من 3 كلمات لاتينية أو أكثر متتالية = جملة إنجليزية مسرّبة (خطأ).
   · كلمتان لاتينيتان متتاليتان إحداهما من كلمات الوصل (to/of/the/and...) = خطأ.
   · لاصق عربي بلاتيني (مثل «إنthalpy» أو «ت joules») = خطأ.
   · رمز علمي واحد (dx, ln, cos, Ceq, rms...) = مقبول. */
function strayLatin(s) {
  const t = String(s);
  const out = [];
  /* لاصق عربي-латيني حقيقي: حرف عربي ملتصق بحروف لاتينية (مثل «إنthalpy»)
     — نُخرج علامات الترقيم العربية أولًا حتى لا تُحسب لاصقًا (مثل «3cm،»). */
  const cleaned = t.replace(/[\u061F\u060C\u061B\u061A\u0640:؛؟!،.]+/g, ' ');
  const glue = cleaned.match(/[\u0600-\u06FF][A-Za-z]{2,}|[A-Za-z]{2,}[\u0600-\u06FF]/g);
  if (glue) out.push(...glue.slice(0, 4).map((g) => '«' + g + '» لاصق'));
  /* عبارات لاتينية متتالية = جملة إنجليزية مسرّبة، بشرط أن تحوي كلمتين
     طويلاً (≥3 حروف) على الأقل — وإلا فهي رموز رياضية مثل «tan y dy». */
  const runs = t.match(/(?:[A-Za-z][A-Za-z'-]*\s+){2,}[A-Za-z][A-Za-z'-]*/g);
  const longRuns = (runs || []).filter((r) => (r.match(/[A-Za-z]{3,}/g) || []).length >= 2);
  if (longRuns.length) out.push(...longRuns.slice(0, 3).map((r) => 'عبارة: ' + r.trim().slice(0, 40)));
  /* كلمتان متتاليتان إحداهما وصلة */
  const pairs = t.match(/[A-Za-z][A-Za-z'-]*\s+[A-Za-z][A-Za-z'-]*/g) || [];
  for (const p of pairs.slice(0, 6)) {
    const [a, b] = p.toLowerCase().split(/\s+/);
    if (EN_STOP.has(a) || EN_STOP.has(b)) { out.push('عبارة: ' + p); break; }
  }
  /* كلمة إنجليزية واحدة معروفة وغير رمز */
  const single = t.match(/[A-Za-z]{3,}/g) || [];
  const bad = single.filter((w) => !ALLOWED_LATIN.test(w) && EN_STOP.has(w.toLowerCase()));
  if (bad.length) out.push(...bad.slice(0, 4));
  return out;
}

const DUP_WORDS = /([\u0600-\u06FF]{2,})\s+\1\b/g;
const MULTI_SPACE = / {3,}/;

function checkText(where, label, s) {
  const t = String(s || '');
  if (!t.trim()) return;
  if (hasCtl(t)) errors.push(where + ' · ' + label + ': محارف تحكّم');
  if (hasCJK(t)) errors.push(where + ' · ' + label + ': نص شرق آسيوي متسرّب — "' + t.slice(0, 70) + '"');
  if (hasBox(t)) errors.push(where + ' · ' + label + ': مربّعات/رموز مكسورة — "' + t.slice(0, 70) + '"');
  if (MULTI_SPACE.test(t)) warns.push(where + ' · ' + label + ': مسافات مكرّرة');
  if (arCount(t) >= 20) {
    const stray = strayLatin(t);
    if (stray.length) errors.push(where + ' · ' + label + ': كلمات لاتينية داخل نص عربي — "' + stray.slice(0, 6).join('، ') + '" — "' + t.slice(0, 60) + '"');
  }
  let dm;
  DUP_WORDS.lastIndex = 0;
  while ((dm = DUP_WORDS.exec(t))) {
    /* «لا لا» و«إلى إلى»... كل تكرار مشبوه */
    warns.push(where + ' · ' + label + ': تكرار لفظي "' + dm[1] + '" في "' + t.slice(0, 60) + '"');
  }
  const open = (t.match(/[(（]/g) || []).length, close = (t.match(/[)）]/g) || []).length;
  if (open !== close) warns.push(where + ' · ' + label + ': أقواس غير متوازنة (' + open + ' فتح مقابل ' + close + ' إغلاق)');
  const q1 = (t.match(/«/g) || []).length, q2 = (t.match(/»/g) || []).length;
  if (q1 !== q2) warns.push(where + ' · ' + label + ': علامات تنصيص غير متوازنة');
}

/* ── بنوك الأسئلة الوزارية ── */
const bankFiles = fs.readdirSync(DIR)
  .filter((f) => f.startsWith('ministerial-') && !f.startsWith('ministerial-extracted') && f.endsWith('.js'))
  .filter((f) => !prefixes.length || prefixes.some((p) => f.includes(p)));

let nQ = 0;
for (const f of bankFiles) {
  global.window = {};
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  try { require(path.join(DIR, f)); }
  catch (e) { errors.push(f + ': تعذّر التحميل — ' + e.message); continue; }
  const parts = (global.window.MINISTERIAL_BANK || []).filter((p) => p && p.questions);
  const key = (parts[0] || {}).key || '';
  const isEnglish = key.includes('الإنكليزية');
  for (const part of parts) {
    (part.questions || []).forEach((q, i) => {
      nQ++;
      const at = f + '#' + i;
      if (isEnglish) {
        /* مادة الإنكليزي: نتحقق من النحو الإنكليزي البسيط بدل العربية */
        const s = String(q.q || '');
        if (hasCJK(s)) errors.push(at + ': نص شرق آسيوي متسرّب');
        if (/\s{3,}|[.,]{3,}/.test(s)) warns.push(at + ': فراغات/نقاط متكررة');
        const why = String(q.why || '');
        if (why.length >= 30 && !/[.!?]$/.test(why.trim())) warns.push(at + ': الجواب لا ينتهي بنقطة');
        return;
      }
      checkText(at, 'السؤال', q.q);
      checkText(at, 'الجواب', q.why);
      if (Array.isArray(q.o)) q.o.forEach((o, j) => checkText(at, 'الخيار ' + (j + 1), o));
      /* الجواب يجيب عن السؤال: تداخل كلمة مفتاحية */
      const qWords = new Set(String(q.q || '').match(/[\u0600-\u06FF]{4,}/g) || []);
      const whyAr = String(q.why || '');
      if (qWords.size >= 3 && whyAr.length >= 60) {
        let hit = 0;
        for (const w of qWords) if (whyAr.includes(w)) hit++;
        if (hit === 0) warns.push(at + ': لا توجد أي كلمة من السؤال في الجواب (ربما الجواب عن سؤال آخر)');
      }
    });
  }
}

/* ── المحتوى التعليمي (اختياري) ── */
let nFiles = 0;
if (WITH_CONTENT) {
  const contentFiles = fs.readdirSync(DIR)
    .filter((f) => f.endsWith('.js') && !f.startsWith('ministerial') && !f.startsWith('figs') && f !== 'h.js' && !f.startsWith('guides'));
  for (const f of contentFiles) {
    nFiles++;
    const s = fs.readFileSync(path.join(DIR, f), 'utf8');
    /* نبحث عن نصوص عربية داخل علامات اقتباس قد تحوي خلطًا */
    const re = /'([^']{40,})'|"([^"]{40,})"/g;
    let m;
    while ((m = re.exec(s))) {
      const t = m[1] || m[2] || '';
      if (arCount(t) < 20) continue;
      if (hasCJK(t)) errors.push(f + ': نص شرق آسيوي — "' + t.slice(0, 70) + '"');
      const stray = strayLatin(t);
      if (stray.length > 3) warns.push(f + ': كلمات لاتينية كثيرة في نص عربي — "' + stray.slice(0, 5).join('، ') + '"');
    }
  }
}

console.log('فحص النقاء اللغوي');
console.log('  بنوك الأسئلة: ' + bankFiles.length + ' ملف · ' + nQ + ' سؤالًا');
if (WITH_CONTENT) console.log('  المحتوى التعليمي: ' + nFiles + ' ملف');
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
console.log('✅ لا أخطاء — النصوص لغوية سليمة');
