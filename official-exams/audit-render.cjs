#!/usr/bin/env node
/**
 * audit-render.cjs — فحص العرض الحيّ: تهريب مزدوج + ترقيم متصل
 * ────────────────────────────────────────────────────────────
 * يفتح التطبيق نفسه (نفس محاكاة DOM في check-fig-render/smoke-test) ويرسم
 * شاشة البنك لكل مادة بوضعي الترتيب (بالفصل/بالدورة)، ثم يرصد:
 *   1. وسوم HTML مُهرَّبة مرّتين (ظاهرية كـ &lt;bdi …) — سبب ظهور
 *      «<bdi dir="ltr">153–170</bdi>» خامًّا في الشاشة.
 *   2. ثغرات الترقيم: أرقام أسئلة المجموعة يجب أن تكون 1..N متصلة.
 *   3. undefined أو NaN في المخرجات.
 *
 * الاستعمال: node official-exams/audit-render.cjs
 * (يخرج 0 لو كل شيء سليم، 1 لو وُجدت مشكلة — ليبقى جاهزاً كبوابة.)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const SCRIPT = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');

/* ── مزوّدات DOM مبسّطة (منطق smoke-test) ── */
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
  setTimeout: () => 0, clearTimeout: () => 0, setInterval: () => 0, clearInterval: () => 0,
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

const CONTENT = [...html.matchAll(/<script src="(content\/[^"]+)"\s*><\/script>/g)].map(m => m[1]);
for (const rel of CONTENT) vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
vm.runInContext(SCRIPT, ctx, { filename: 'app.js' });
const run = (code) => vm.runInContext(code, ctx);

run(`
  if (!DB.students.length) { const s = newStudent({ name: 'فحص', grade: 12 }); s.branch = s.branch || 'sci'; DB.students.push(s); DB.activeId = s.id; }
  S.viewGrade = 12;
`);

/* ── أدوات ── */
const AR_DIG = '٠١٢٣٤٥٦٧٨٩';
const toInt = s => Number(String(s).replace(/[٠-٩]/g, d => AR_DIG.indexOf(d)).replace(/[^0-9]/g, ''));

/* رصد الوسوم المُهرَّبة: أي &lt; متبوع بحرف = تهريب مزدوج مؤكد */
const ESC_RE = /&lt;([a-zA-Z][a-zA-Z0-9-]*)/g;
function findEscapes(h) {
  const out = []; let m;
  ESC_RE.lastIndex = 0;
  while ((m = ESC_RE.exec(h))) {
    const i = m.index;
    out.push({ tag: m[1], ctx: h.slice(Math.max(0, i - 70), i + 90).replace(/\s+/g, ' ') });
  }
  return out;
}

/* أرقام الأسئلة داخل كل مجموعة: بعد <h2 …>العنوان</h2><span …>N سؤال</span> */
function checkNumbers(h, label) {
  const problems = [];
  /* حدود المجموعات: </h2><span class="muted small num">… سؤال</span> */
  const parts = h.split(/<\/h2><span class="muted small num">/);
  parts.forEach((part, idx) => {
    if (idx === 0) return; /* قبل أول مجموعة: شريط علوي */
    /* الأرقام فقط: علامات الفروع تظهر بحروف أبجد في نفس الصنف فلا تُعدّ */
    const nums = [...part.matchAll(/class="ol"[^>]*>([\u0660-\u0669]+)<\/span>/g)].map(m => toInt(m[1]));
    const totalM = part.match(/^·?\s*([٠-٩]+)\s*سؤال/);
    const total = totalM ? toInt(totalM[1]) : null;
    for (let i = 0; i < nums.length; i++) {
      const expect = i + 1;
      if (nums[i] !== expect) {
        problems.push(label + ' — رقم غير متوقع عند ترتيب ' + expect + ' (وُجد ' + nums[i] + ') · الأرقام: ' + nums.join(','));
        break;
      }
    }
    if (total != null && nums.length && nums.length !== total) {
      problems.push(label + ' — العدد المعلن ' + total + ' لكن عُرض ' + nums.length + ' سؤالًا');
    }
  });
  return problems;
}

/* ── التنفيذ ── */
const subjects = run(`gradeContents(12).map(y => y.subject)`);
const escIssues = [], numIssues = [], nanIssues = [];
let rendered = 0;

for (const subject of subjects) {
  for (const view of ['ch', 'year']) {
    let h;
    try {
      h = run(`(function () {
        S.bankSubject = ${JSON.stringify(subject)};
        S.bankView = ${JSON.stringify(view)};
        return String(VIEWS.bank());
      })()`);
    } catch (e) {
      escIssues.push(subject + ' [' + view + '] — خطأ تنفيذ: ' + e.message);
      continue;
    }
    rendered++;
    const tag = subject + ' [' + (view === 'ch' ? 'بالفصل' : 'بالدورة') + ']';
    const esc = findEscapes(h);
    if (esc.length) escIssues.push(tag + ' — ' + esc.length + ' وسم مُهرَّب، أولها: «' + esc[0].ctx + '»');
    if (/undefined|NaN/.test(h)) nanIssues.push(tag + ' — يحوي undefined أو NaN');
    if (view === 'ch') numIssues.push(...checkNumbers(h, tag));
  }
}

/* شاشات أخرى تستعمل عناوين المواضيع (تهريب محتمل) */
const otherViews = [
  ['minprep', 'S.bankSubject = "التربية الإسلامية"; S.view = "minprep"; return String(VIEWS.minprep());'],
  ['search', 'S.q = "البقرة"; return String(VIEWS.search());'],
  ['subexams', 'return String(VIEWS.subexams());'],
  ['library', 'return String(VIEWS.library());'],
  ['tests', 'return String(VIEWS.tests());'],
];
for (const [name, code] of otherViews) {
  try {
    const h = run('(function () {' + code + '})()');
    rendered++;
    const esc = findEscapes(h);
    if (esc.length) escIssues.push('شاشة ' + name + ' — ' + esc.length + ' وسم مُهرَّب، أولها: «' + esc[0].ctx + '»');
    if (/undefined|NaN/.test(h)) nanIssues.push('شاشة ' + name + ' — يحوي undefined أو NaN');
  } catch (e) {
    escIssues.push('شاشة ' + name + ' — خطأ تنفيذ: ' + e.message);
  }
}

/* التهيئة الوزارية لكل مادة: examConfigView تعرض عناوين المواضيع بـ ft() على
   ناتج ft() سابق (tLabel) — الموضع المرشح للتهريب المزدوج الثالث */
for (const subject of subjects) {
  try {
    const h = run(`(function () {
      S.examScope = null;
      examConfig('ministerial', ${JSON.stringify(subject)});
      return String(VIEWS.exam());
    })()`);
    rendered++;
    const esc = findEscapes(h);
    if (esc.length) escIssues.push('تهيئة وزارية [' + subject + '] — ' + esc.length + ' وسم مُهرَّب، أولها: «' + esc[0].ctx + '»');
    if (/undefined|NaN/.test(h)) nanIssues.push('تهيئة وزارية [' + subject + '] — يحوي undefined أو NaN');
  } catch (e) {
    escIssues.push('تهيئة وزارية [' + subject + '] — خطأ تنفيذ: ' + e.message);
  }
}

console.log('فحص العرض الحيّ: تهريب مزدوج + ترقيم + سلامة');
console.log('  شاشات مرسومة: ' + rendered + ' · مواد البنك: ' + subjects.length);
console.log('');

let bad = 0;
const report = (title, arr) => {
  if (!arr.length) { console.log('✅ ' + title + ': سليم'); return; }
  bad += arr.length;
  console.log('❌ ' + title + ': ' + arr.length);
  arr.slice(0, 12).forEach(x => console.log('   - ' + x));
  if (arr.length > 12) console.log('   … و' + (arr.length - 12) + ' آخر');
};
report('وسوم مُهرَّبة (تهريب مزدوج)', escIssues);
report('ثغرات ترقيم الأسئلة', numIssues);
report('undefined/NaN', nanIssues);

process.exit(bad ? 1 : 0);
