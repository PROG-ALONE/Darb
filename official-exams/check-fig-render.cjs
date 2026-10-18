#!/usr/bin/env node
/**
 * check-fig-render.cjs — فاحص عرض الرسوم فعليًّا داخل التطبيق
 * ────────────────────────────────────────────────────────────
 * لماذا؟ check-figs يتحقق أن الإحالة تشير إلى رسم موجود في المكتبة،
 * وهذا لا يكفي: قد يكون البلوك `{ t:'fig', k }` موضوعًا في مكان لا يقرؤه
 * العارض (كما حدث مع الخاصية الميتة `fig:` التي كُتبت في المواضيع ولا
 * يقرأها أحد). لذلك يفتح هذا الفاحص كل موضوع فيه رسم في التطبيق نفسه
 * (نفس محاكاة DOM التي يستعملها smoke-test) وينتظر أن يظهر الرسم صحيحًا.
 *
 * يتحقق لكل إحالة من:
 *   1. تحميل محتوى الملفات وتشغيل التطبيق بلا خطأ.
 *   2. وجود الموضوع في بنية gradeContents للمادة والفصل.
 *   3. رسم شاشة الموضوع أن تحوي بطاقة الرسم واسم الرسم الصحيح.
 *   4. رسم شاشة ملء الشاشة للرسم أن تحوي أدواته وشرحه.
 *   5. عدم ورود undefined أو NaN في أي منهما.
 *
 * الاستعمال: node official-exams/check-fig-render.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const SCRIPT = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');

/* ── مزوّدات DOM مبسّطة (نفس منطق smoke-test) ── */
function el(tag) {
  return {
    tagName: (tag || 'div').toUpperCase(), _html: '', style: {}, dataset: {}, children: [],
    classList: { add() { }, remove() { }, toggle() { }, contains() { return false; }, replace() { } },
    setAttribute() { }, getAttribute() { return null; }, removeAttribute() { },
    appendChild(c) { this.children.push(c); return c; }, removeChild() { }, remove() { },
    addEventListener() { }, removeEventListener() { }, focus() { }, blur() { },
    querySelector() { return null; }, querySelectorAll() { return []; }, closest() { return null; },
    contains() { return false; }, getBoundingClientRect() { return { top: 0, left: 0, width: 320, height: 480 }; },
    scrollTo() { }, scrollTop: 0, scrollY: 0, hidden: false, value: '', textContent: '',
    insertAdjacentHTML() { }, matches() { return false; }, click() { },
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = String(v); },
    get outerHTML() { return this._html; },
  };
}

const nodes = { app: el('div') };
const doc = {
  getElementById(id) { return nodes[id] || null; },
  querySelector() { return null; }, querySelectorAll() { return []; },
  createElement: t => el(t),
  addEventListener() { }, removeEventListener() { },
  body: { appendChild() { }, removeChild() { }, contains() { return false; }, scrollLeft: 0, scrollTop: 0 },
  documentElement: {
    style: { setProperty() { } }, classList: { add() { }, remove() { }, toggle() { }, contains() { return false; } },
    setAttribute() { }, getAttribute() { return null; }, removeAttribute() { }, appendChild() { }, remove() { },
    insertBefore() { }, children: [], querySelector() { return null; }, querySelectorAll() { return []; }, addEventListener() { },
  },
  visibilityState: 'visible',
};

const store = {};
const win = {
  document: doc,
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
  navigator: { userAgent: 'node', serviceWorker: null, clipboard: { writeText: () => Promise.resolve() } },
  location: { protocol: 'http:', href: 'http://localhost/', search: '' },
  history: { replaceState() { }, pushState() { }, back() { } },
  matchMedia: () => ({ matches: false, addListener() { }, addEventListener() { } }),
  scrollTo() { }, scrollY: 0, scrollX: 0,
  setTimeout: () => 0, clearTimeout() { }, setInterval: () => 0, clearInterval() { },
  requestAnimationFrame: () => 0, cancelAnimationFrame: () => 0,
  performance: { now: () => Date.now() },
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  addEventListener() { }, removeEventListener() { },
  console,
  URL: { createObjectURL: () => 'blob:', revokeObjectURL() { } },
  Image: function () { return el('img'); },
  FileReader: function () { return { readAsText() { } }; },
  Blob: function () { return { }; },
  indexedDB: { open: () => ({ onupgradeneeded: null, onsuccess: null, onerror: null, result: null }) },
  open() { }, alert() { }, confirm() { return false; },
};
win.window = win; win.self = win; win.globalThis = win;
Object.defineProperty(win, 'innerWidth', { value: 1280, writable: true });
Object.defineProperty(win, 'innerHeight', { value: 800, writable: true });
const ctx = vm.createContext(win);

/* ── تحميل المحتوى ثم التطبيق ── */
const CONTENT = [...html.matchAll(/<script src="(content\/[^"]+)"\s*><\/script>/g)].map(m => m[1]);
for (const rel of CONTENT) vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
vm.runInContext(SCRIPT, ctx, { filename: 'app.js' });
const run = (code) => vm.runInContext(code, ctx);

run(`
  if (!DB.students.length) { const s = newStudent({ name: 'فحص', grade: 12 }); s.branch = s.branch || 'sci'; DB.students.push(s); DB.activeId = s.id; }
  S.viewGrade = 12;
`);

/* ── جمع كل الإحالات من بنية المحتوى ── */
const refs = run(`(function () {
  const out = [];
  gradeContents(12).forEach(y => y.c.chapters.forEach(ch => ch.topics.forEach(t =>
    (t.explain || []).forEach(b => { if (b.t === 'fig') out.push({ subject: y.subject, ch: ch.id, topic: t.id, k: b.k }); }))));
  return out;
})()`);

const errors = [];
let rendered = 0;
const bySubject = {};

for (const r of refs) {
  const tag = r.subject + ' / ' + r.topic + ' → ' + r.k;
  try {
    const res = run(`(function () {
      const k = ${JSON.stringify(r.k)};
      const f = FIGS[k];
      if (!f) return { __fail: 'رسم غير موجود في المكتبة: ' + k };
      S.viewGrade = 12; S.viewSubject = ${JSON.stringify(r.subject)};
      S.viewChapter = ${JSON.stringify(r.ch)}; S.viewTopic = ${JSON.stringify(r.topic)};
      const topic = String(VIEWS.topic());
      if (topic.indexOf('data-act="figFull"') < 0) return { __fail: 'بطاقة الرسم غير معروضة في شاشة الموضوع' };
      if (topic.indexOf(f.title) < 0) return { __fail: 'عنوان الرسم غير ظاهر في شاشة الموضوع: ' + f.title };
      if (/undefined|NaN/.test(topic)) return { __fail: 'undefined أو NaN في شاشة الموضوع' };
      /* شاشة ملء الشاشة للرسم نفسه */
      S.figK = k; S.figDraw = null; S.view = 'fig';
      const full = String(VIEWS.fig());
      if (full.indexOf('fig-tools') < 0) return { __fail: 'أدوات الرسم غير معروضة في ملء الشاشة' };
      if (full.indexOf(f.title) < 0) return { __fail: 'عنوان الرسم غير ظاهر في ملء الشاشة' };
      if (f.parts && f.parts.length && full.indexOf(f.parts[0].label) < 0) return { __fail: 'أول أجزاء الرسم غير ظاهر' };
      if (/undefined|NaN/.test(full)) return { __fail: 'undefined أو NaN في شاشة ملء الشاشة' };
      S.view = 'topic';
      return { ok: true };
    })()`);
    if (res && res.__fail) errors.push(tag + ' — ' + res.__fail);
    else { rendered++; bySubject[r.subject] = (bySubject[r.subject] || 0) + 1; }
  } catch (e) {
    errors.push(tag + ' — خطأ تنفيذ: ' + e.message);
  }
}

console.log('فحص عرض الرسوم داخل التطبيق');
console.log('  إحالات مفحوصة: ' + refs.length + ' · عُرضت بنجاح: ' + rendered);
Object.keys(bySubject).forEach((s) => console.log('  ' + s + ': ' + bySubject[s]));
console.log('');

if (errors.length) {
  console.log('أخطاء (' + errors.length + '):');
  errors.slice(0, 20).forEach((e) => console.log('  ❌ ' + e));
  if (errors.length > 20) console.log('  … و' + (errors.length - 20) + ' آخر');
  process.exit(1);
}
if (!rendered) { console.log('❌ لا توجد أي إحالة رسم للعرض'); process.exit(1); }
console.log('✅ لا أخطاء — كل الرسوم المرتبطة تُعرض فعلًا داخل التطبيق');
