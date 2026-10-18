#!/usr/bin/env node
/**
 * فحص ساكن للنظام — يُشغَّل بلا متصفح
 * ────────────────────────────────────────────────────────────
 * الغرض: التقاط أخطاء الربط (wiring) قبل فتح المتصفح، وهي أكثر الأخطاء
 * شيوعًا عند إعادة كتابة شاشات كاملة:
 *
 *   1. كل data-act في الواجهة له case مقابل في معالج الأحداث.
 *   2. لا يوجد case يتيم (يفعّل شيئًا لا يمكن الضغط عليه).
 *   3. لا يوجد تعريف مكرّر لدالة في السكربت الرئيسي.
 *   4. كل دالة تُستدعى في السكربت الرئيسي معرّفة في مكان ما (أو معروفة).
 *
 * الاستعمال:  node official-exams/static-check.cjs
 * الناتج: ✅ / ❌ لكل بند، وخروج برقم غير صفر عند الفشل.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* نأخذ جسم السكربت الرئيسي وحده (بدون src) */
const SCRIPT = [...INDEX.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(m => m[1]).join('\n');

const CONTENT_DIR = path.join(ROOT, 'content');
const CONTENT = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.js'))
  .map(f => fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8'))
  .join('\n');

let failures = 0;
const ok = (n, msg) => console.log('  ✅ ' + n + (msg ? ' — ' + msg : ''));
const bad = (n, msg) => { failures++; console.log('  ❌ ' + n + ' — ' + msg); };

/* ── 1. تغطية data-act ── */
console.log('\n[1] تغطية أزرار data-act');

/* معالج الأحداث الرئيسي هو switch على el.dataset.act داخل document.addEventListener */
const cases = new Set([...SCRIPT.matchAll(/case\s+'([A-Za-z0-9_]+)'\s*:/g)].map(m => m[1]));

const allActs = new Set();
[INDEX, CONTENT].forEach(src => {
  [...src.matchAll(/data-act="([A-Za-z0-9_]+)"/g)].forEach(m => allActs.add(m[1]));
});
/* أفعال مبنية ديناميكيًا: data-act="' + x[0] + '" وأخواتها */
[INDEX, CONTENT].forEach(src => {
  [...src.matchAll(/data-act="' \+ ([A-Za-z0-9_]+)/g)].forEach(m => { /* نتجاهل: قيم متغيّرة */ });
});

const unhandled = [...allActs].filter(a => !cases.has(a));
if (unhandled.length) bad('data-act بلا معالج', unhandled.join('، '));
else ok('data-act', ar_(allActs.size) + ' فعلًا، كلها لها معالج');

/* ── 2. أفعال يتيمة ── */
console.log('\n[2] أفعال يتيمة (معالج لا يظهر في أي مكان)');
/* نحصر البحث على معالج الأحداث الرئيسي — switch (a) داخل document.addEventListener('click').
   case-الأنواع الأخرى (fig/table/poem…) ليست أفعالًا، بل أنواع مكوّنات محتوى. */
const HANDLER = (() => {
  const start = SCRIPT.indexOf('switch (a) {');
  if (start < 0) return '';
  let depth = 0, i = SCRIPT.indexOf('{', start);
  for (let j = i; j < SCRIPT.length; j++) {
    if (SCRIPT[j] === '{') depth++;
    else if (SCRIPT[j] === '}') { depth--; if (!depth) return SCRIPT.slice(start, j + 1); }
  }
  return SCRIPT.slice(start);
})();
const handlerCases = new Set([...HANDLER.matchAll(/case\s+'([A-Za-z0-9_]+)'\s*:/g)].map(m => m[1]));
/* بعض الأفعال تُبنى نصًّا ديناميكيًّا (data-act="' + (last ? 'onbDone' : ...) )
   فلا يظهر كـ data-act="..." صريح. نعتبر الاسم مستعملًا إن وُرد كنص مفرد أكثر من مرة
   (المرة الواحدة هي سطر الـ case نفسه، فتكون أفعالًا يتيمة حقيقية). */
const litCount = {};
[...SCRIPT.matchAll(/'([A-Za-z0-9_]{3,})'/g)].forEach(m => { litCount[m[1]] = (litCount[m[1]] || 0) + 1; });
const orphan = [...handlerCases].filter(c => !allActs.has(c) && (litCount[c] || 0) < 2);
/* نستثني الحالات التي يُبنى زرّها في سكربت خارجي أو يُستدعى برمجيًا */
const KNOWN_DYNAMIC = new Set(['closeDialog', 'tab', 'back', 'go', 'acc', 'rate']);
const realOrphan = orphan.filter(c => !KNOWN_DYNAMIC.has(c));
if (realOrphan.length) bad('case يتيم', realOrphan.join('، '));
else ok('لا case يتيم', 'كل case له زرّ في الواجهة');

/* ── 3. تعريفات مكرّرة في السكربت الرئيسي ── */
console.log('\n[3] تعريفات مكرّرة');
const defs = new Map();
[...SCRIPT.matchAll(/^function\s+([A-Za-z0-9_$]+)/gm)].forEach(m => {
  defs.set(m[1], (defs.get(m[1]) || 0) + 1);
});
const dupes = [...defs].filter(([, n]) => n > 1);
if (dupes.length) bad('دالة معرّفة مرتين', dupes.map(([n, c]) => n + '×' + c).join('، '));
else ok('التعريفات', ar_(defs.size) + ' دالة، بلا تكرار');

/* ── 4. استدعاء دالة غير معرّفة ──
   نقتصر على استدعاءات الدوال الحقيقية: ما قبله ليس قيمة ولا نقطة ولا نصًّا.
   الاستدعاءات المنسوبة (obj.fn) ليست دوالًا عامة فلا تُفحص. */
console.log('\n[4] استدعاء دوال غير معرّفة');
const GLOBALS = new Set(['window', 'document', 'Math', 'JSON', 'Object', 'Array', 'String',
  'Number', 'Boolean', 'Date', 'Map', 'Set', 'Promise', 'Intl', 'RegExp', 'Error', 'console',
  'localStorage', 'sessionStorage', 'navigator', 'location', 'history', 'fetch', 'setTimeout',
  'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame',
  'parseInt', 'parseFloat', 'isNaN', 'encodeURIComponent', 'decodeURIComponent', 'alert',
  'confirm', 'Blob', 'File', 'FileReader', 'URL', 'indexedDB', 'crypto', 'structuredClone', 'DataView',
  'FormData', 'Headers', 'Request', 'AbortController', 'Image', 'MutationObserver', 'Event',
  'CustomEvent', 'getComputedStyle', 'matchMedia', 'performance', 'atob', 'btoa',
  'TextEncoder', 'Uint8Array',
  'addEventListener', 'removeEventListener', 'scrollTo', 'scrollIntoView', 'isFinite',
  'queueMicrotask', 'isNaN', 'require', 'module', 'process', '__dirname', 'fetch']);
const defined = new Set(defs.keys());
/* أي تعريف في أي نطاق (const/let/var/function/params) فهو معرّف — فلا نصوّبه */
[...SCRIPT.matchAll(/\b(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=/g)].forEach(m => defined.add(m[1]));
[...SCRIPT.matchAll(/\bfunction\s+([A-Za-z0-9_$]+)\s*\(/g)].forEach(m => defined.add(m[1]));
/* أسماء معاملات الدوال */
[...SCRIPT.matchAll(/\bfunction\s+[A-Za-z0-9_$]*\s*\(([^)]*)\)/g)].forEach(m => m[1].split(',').forEach(p => {
  const n = p.replace(/[={].*$/, '').trim(); if (n) defined.add(n);
}));
/* معاملات الدوال السهمية والعادية: كل ما بين قوسين ويسبقه { أو => */
[...SCRIPT.matchAll(/\(([^()]*)\)\s*(?:=>|\{)/g)].forEach(m => m[1].split(',').forEach(p => {
  const n = p.replace(/^[a-z]+\s+/i, '').replace(/[={].*$/, '').trim();
  if (/^[A-Za-z_$][\w$]*$/.test(n)) defined.add(n);
}));
/* تعدد التعريفات في جملة const واحدة: const a = …, b = … */
[...SCRIPT.matchAll(/,\s*([A-Za-z_$][\w$]*)\s*=(?!=)/g)].forEach(m => defined.add(m[1]));
/* صيغة الـ methods في الكائنات: name(args) { … } — مثل FIGS.acgen (ومع async/await) */
[...SCRIPT.matchAll(/^\s*(?:async\s+|get\s+|set\s+)?([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\{/gm)].forEach(m => defined.add(m[1]));
/* دوال سهمية ومعاملات حلقات الدوال داخل الكائنات */
[...SCRIPT.matchAll(/(?:=>|\()\s*\{?\s*([A-Za-z0-9_$]+)\s*(?:,|\)|=>)/g)].forEach(m => defined.add(m[1]));
[...SCRIPT.matchAll(/window\.([A-Za-z0-9_$]+)\s*=/g)].forEach(m => defined.add(m[1]));

/* نلتقط استدعاء الدالة الحقيقية: أول حرف في اسم الدالة، وما قبله ليس قيمة ولا نقطة.
   النمط (foo( — لكن ليس obj.foo( ولا "foo"( ولا a+foo( بعد قيمة.
   الأهم: نُفرغ النصوص والتعليقات أولًا، وإلّا التُقطت بناءً CSS داخل نصوص JS
   (rgba( ، repeat( ، gradient() وكأنها استدعاءات حقيقية. */
const blank = src => {
  let out = '', i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') { out += ' '; i++; } continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) { out += src[i] === '\n' ? '\n' : ' '; i++; } i += 2; out += '  '; continue; }
    if (c === '"' || c === "'" || c === '`') {
      const q = c; out += ' '; i++;
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') { out += '  '; i += 2; continue; } out += src[i] === '\n' ? '\n' : ' '; i++; }
      out += ' '; i++; continue;
    }
    out += c; i++;
  }
  return out;
};
const CODE = blank(SCRIPT);
const called = new Set();
const CALL_RE = /(?:^|[^\w.$'"`)\],]|=>\s*|return\s+|;\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g;
let cm;
while ((cm = CALL_RE.exec(CODE)) !== null) called.add(cm[1]);
const KEYWORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'return', 'typeof', 'function',
  'new', 'do', 'else', 'await', 'throw', 'in', 'of', 'case', 'delete', 'void', 'yield', 'as', 'var',
  'async', 'get', 'set']);
const missing = [...called].filter(c => !defined.has(c) && !GLOBALS.has(c) && !KEYWORDS.has(c));
/* translate is CSS embedded in the pointer-drag template, not a JavaScript call. */
const knownFalsePositives = new Set(['translate']);
const actualMissing = missing.filter(c => !knownFalsePositives.has(c));
if (actualMissing.length) bad('استدعاء غير معرّف', actualMissing.slice(0, 25).join('، ') + (actualMissing.length > 25 ? ' …' : ''));
else ok('الاستدعاءات', 'كل دالة معرّفة');

console.log('\n' + '─'.repeat(52));
console.log(failures ? '  ❌ فشل بند واحد أو أكثر' : '  ✅ كل البنود الأربعة سليمة');
process.exit(failures ? 1 : 0);

/* أرقام عربية للعرض فقط */
function ar_(n) { return String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]); }
