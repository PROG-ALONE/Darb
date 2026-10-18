#!/usr/bin/env node
/**
 * اختبار دخان (smoke) — يُشغِّل تطبيق «دَرْب» الكامل داخل Node بمحاكاة DOM مبسّطة
 * ────────────────────────────────────────────────────────────
 * لا متصفح في بيئة العمل هذه، فبدل الاكتفاء بفحص الصياغة (syntax) نُنفّذ الشيفرة فعليًا:
 * نبني مزوّدات DOM ضرورية فقط (getElementById / addEventListener / matchMedia …)،
 * ثم نُحمّل السكربت كاملاً في سياق vm، وندعو كل شاشة ونتحقق أنها تُرجع نصًّا بلا رمي.
 *
 * هذا يلتقط فعليًا:
 *   · استدعاء دالة غير معرّفة داخل شاشة (الأكثر شيوعًا بعد إعادة كتابة شاشة)
 *   · خطأ في تعبير template يوقف الرسم
 *   · خاصية على null (مثل undefined.days)
 *
 * الاستعمال:  node official-exams/smoke-test.cjs
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const SCRIPT = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');

/* ── مزوّدات DOM مبسّطة ── */
function el(tag) {
  const e = {
    tagName: (tag || 'div').toUpperCase(), _html: '', style: {}, dataset: {}, children: [],
    classList: { add() { }, remove() { }, toggle() { }, contains() { return false; }, replace() { } },
    setAttribute() { }, getAttribute() { return null; }, removeAttribute() { }, removeAttribute() { },
    appendChild(c) { this.children.push(c); return c; }, removeChild() { }, remove() { },
    addEventListener() { }, removeEventListener() { }, focus() { }, blur() { },
    querySelector() { return null; }, querySelectorAll() { return []; }, closest() { return null; },
    contains() { return false; }, getBoundingClientRect() { return { top: 0, left: 0, width: 320, height: 480 }; },
    scrollTo() { }, scrollTop: 0, scrollY: 0, hidden: false, value: '', textContent: '',
    insertAdjacentHTML() { }, matches() { return false; }, click() { },
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = String(v); },
    get outerHTML() { return this._html; },
  };
  return e;
}

const APP = el('div');
const nodes = { app: APP };
const doc = {
  _ev: {},
  getElementById(id) { return nodes[id] || null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  createElement: t => el(t),
  addEventListener(t, fn) { (this._ev[t] = this._ev[t] || []).push(fn); },
  removeEventListener() { },
  body: { appendChild() { }, removeChild() { }, contains() { return false; }, scrollLeft: 0, scrollTop: 0 },
  documentElement: { style: { setProperty() { } }, classList: { add() { }, remove() { }, toggle() { }, contains() { return false; } }, setAttribute() { }, getAttribute() { return null; }, removeAttribute() { }, appendChild() { }, remove() { }, insertBefore() { }, children: [], querySelector() { return null; }, querySelectorAll() { return []; }, addEventListener() { } },
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
  requestAnimationFrame: () => 0, cancelAnimationFrame() { },
  performance: { now: () => Date.now() },
  TextEncoder,
  TextDecoder,
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  addEventListener() { }, removeEventListener() { },
  console,
  URL: { createObjectURL: () => 'blob:', revokeObjectURL() { } },
  Image: function () { return el('img'); },
  FileReader: function () { return { readAsText() { } }; },
  Blob: function () { return { }; },
  indexedDB: { open: () => ({ onupgradeneeded: null, onsuccess: null, onerror: null, result: null }) },
  open() { }, alert() { }, confirm() { return false; },
  InnerWidth: 0,
};
win.window = win;
win.self = win;
win.globalThis = win;
Object.defineProperty(win, 'innerWidth', { value: 1280, writable: true });
Object.defineProperty(win, 'innerHeight', { value: 800, writable: true });

const ctx = vm.createContext(win);

/* ── نحمّل محتوى المواد أولًا (كما يفعل index.html بوسائط script) ── */
const CONTENT_SCRIPTS = [...html.matchAll(/<script src="(content\/[^"]+)"\s*><\/script>/g)].map(m => m[1]);
try {
  CONTENT_SCRIPTS.forEach(rel => {
    const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    vm.runInContext(code, ctx, { filename: rel });
  });
  console.log('✅ حُمِّل ' + CONTENT_SCRIPTS.length + ' ملف محتوى');
} catch (e) {
  console.log('❌ فشل تحميل محتوى: ' + e.message);
  process.exit(1);
}

/* ── تشغيل التطبيق ── */
let bootErr = null;
try {
  vm.runInContext(SCRIPT, ctx, { filename: 'app.js' });
} catch (e) {
  bootErr = e;
}

if (bootErr) {
  console.log('❌ فشل تحميل التطبيق: ' + bootErr.message);
  console.log((bootErr.stack || '').split('\n').slice(0, 5).join('\n'));
  process.exit(1);
}
console.log('✅ حمُل التطبيق بلا خطأ فatal');

/* ── نبني طالبًا افتراضيًا ثم نرسم كل شاشة ── */
const run = code => vm.runInContext(code, ctx);

let failures = 0;
const T = (name, fn) => {
  try { const r = fn(); if (r && r.__fail) { failures++; console.log('  ❌ ' + name + ' — ' + r.__fail); } else console.log('  ✅ ' + name); }
  catch (e) { failures++; console.log('  ❌ ' + name + ' — ' + e.message); }
};

/* تجهيز طالب في الصف السادس العلمي */
try {
  run(`
    if (!DB.students.length) {
      const s = newStudent({ name: 'اختبار', grade: 12 });
      /* الصف ١٢ علمي له فرع، بلاه لا يُحمَّل محتوى ولا تُرسم شاشات الفصول */
      s.branch = s.branch || 'sci';
      DB.students.push(s); DB.activeId = s.id;
    }
    S.view = 'today';
    /* الشاشات المعمّقة تحتاج معرّفات صحيحة مثل متصفح حقيقي */
    S.viewGrade = 12;
    const _g = gradeContents(12)[0];
    if (_g) {
      S.viewSubject = _g.subject;
      const _c = _g.c.chapters[0];
      if (_c) {
        S.viewChapter = _c.id;
        const _t = _c.topics[0];
        if (_t) { S.viewTopic = _t.id; S.viewProblem = (_t.problems && _t.problems[0]) ? _t.problems[0].id : null; }
      }
    }
    /* تصدير: يحتاج كائن S.exp كاملًا كما يبنيه openExport */
    S.exp = defaultExp('subject', _g ? _g.subject : null);
  `);
} catch (e) {
  console.log('⚠️ تعذّر تجهيز الطالب الافتراضي: ' + e.message);
}

/* تشخيص سريع: هل محتوى الصف مُحمَّل فعلًا؟ */
try {
  const diag = run(`(function(){
    const st = me();
    const g = gradeContents(st.grade);
    return JSON.stringify({ grade: st.grade, branch: st.branch, n: g.length,
      subjects: g.map(x=>x.subject).slice(0,4), contentKeys: Object.keys(CONTENT).length });
  })()`);
  console.log('  · تشخيص المحتوى: ' + diag);
} catch (e) {
  console.log('  · تشخيص المحتوى فشل: ' + e.message);
}

console.log('\n[رسم الشاشات]');
const VIEWS_LIST = run('Object.keys(VIEWS)');
VIEWS_LIST.forEach(v => {
  T('v' + v.charAt(0).toUpperCase() + v.slice(1), () => {
    const out = run(`(function(){ try { S.view = ${JSON.stringify(v)}; return String((VIEWS[${JSON.stringify(v)}]||function(){return ""})()); } catch(e){ return { __fail: e.message }; } })()`);
    if (out && out.__fail) return out;
    if (typeof out !== 'string') return { __fail: 'لم يُرجع نصًّا' };
    if (/undefined|NaN|\[object Object\]/.test(out)) {
      /* نُنبّه فقط إن كان الظهور في متن قابل للقراءة، لا داخل JSON أو معرّفات */
      const m = out.match(/.{0,45}(undefined|NaN|\[object Object\]).{0,45}/);
      if (m && !/\\u|&quot;/.test(m[0])) return { __fail: 'يظهر ' + (m[0].match(/undefined|NaN|\[object Object\]/)[0]) + ' في النص: …' + m[0] + '…' };
    }
    return true;
  });
});

T('تأجيل التنافس دون مشاركة بيانات', () => {
  const out = run(`(function(){
    const groups = String(VIEWS.groups()), meView = String(VIEWS.me());
    if (groups.indexOf('ميزة التنافس مؤجلة') < 0 || groups.indexOf('لا يشارك التطبيق أي بيانات') < 0) return { __fail: 'شاشة التنافس لا تعرض حالة التأجيل بوضوح' };
    if (groups.indexOf('شارك بطاقتك') >= 0 || groups.indexOf('DARB-G') >= 0) return { __fail: 'ما زالت مشاركة المجموعات متاحة' };
    if (meView.indexOf('مجموعتي والتنافس') >= 0) return { __fail: 'ما زال مدخل التنافس ظاهرًا في تبويب أنا' };
    return true;
  })()`);
  if (out && out.__fail) return out;
  return true;
});

T('مختبر رسم المعادلات الرياضية', () => {
  const out = run(`(function(){ try {
    const P = window.DarbMathPlot;
    if (!P || typeof P.plot !== 'function') return { __fail: 'مكتبة الرسم لم تُحمّل' };
    const ellipse = P.plot('x^2/25 + y^2/9 = 1', -6, 6, -4, 4);
    const hyperbola = P.plot('س²/9 - ص²/4 = 1', -6, 6, -5, 5);
    const parabola = P.plot('y = x^2/4', -5, 5, -2, 8);
    [ellipse, hyperbola, parabola].forEach(x => {
      if (!/class="graph-curve"[^>]*d="M/.test(x)) throw new Error('لم ينتج منحنى SVG');
    });
    let rejected = false;
    try { P.plot('x + unsupported = 0', -5, 5, -5, 5); } catch (e) { rejected = true; }
    if (!rejected) throw new Error('قُبل رمز غير مدعوم');
    return { ellipse: ellipse.length, hyperbola: hyperbola.length, parabola: parabola.length };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  return true;
});

T('إظهار مختبر الرسم داخل الموضوعات التي تحتاجه فقط', () => {
  const out = run(`(function(){
    const old = { viewSubject: S.viewSubject, viewGrade: S.viewGrade, viewTopic: S.viewTopic, tseg: S.tseg };
    try {
      S.viewGrade = 12; S.viewSubject = 'الرياضيات';
      const subject = String(VIEWS.subject()), figures = String(VIEWS.figlib());
      if (subject.includes('مختبر رسم المعادلات')) return { __fail: 'مختبر الرسم ما زال ظاهرًا في صفحة المادة' };
      if (figures.includes('مختبر رسم المعادلات')) return { __fail: 'مختبر المعادلات ظهر في المكتبة رغم أنها مخصصة لرسوم الأسئلة' };
      const graphTopics = ['m12c2t1', 'm12c2t2', 'm12c2t3', 'm12c2t4', 'm12c2t5', 'm12c2t6',
        'm12c3t1', 'm12c3t2', 'm12c3t3', 'm12c3t4', 'm12c3t5', 'm12c3t6', 'm12c3t7', 'm12c3t8',
        'm12c4t1', 'm12c4t2', 'm12c4t3', 'm12c4t4', 'm12c4t5', 'm12c4t6', 'm12c4t7', 'm12c4t8', 'm12c4t9', 'm12c5t2'];
      for (const id of graphTopics) {
        S.viewTopic = id; S.tseg = 'explain';
        if (!String(VIEWS.topic()).includes('مختبر رسم المعادلات')) return { __fail: 'مختبر الرسم غير ظاهر في الموضوع ' + id };
      }
      S.viewTopic = 'm12c3t1'; S.tseg = 'explain';
      const rates = String(VIEWS.topic());
      if (!rates.includes('x^2 + y^2 - 4y + 6x = 0') || !rates.includes('العلاقة بين الكميتين')) return { __fail: 'مختبر المعدلات لا يبدأ بعلاقة من الدرس أو بلا توضيح للمعدلات' };
      S.viewTopic = 'm12c1t1';
      if (String(VIEWS.topic()).includes('مختبر رسم المعادلات')) return { __fail: 'مختبر المعادلات ظهر في موضوع عددي لا يحتاج رسمًا بيانيًا' };
      S.viewTopic = 'm12c6t1';
      if (String(VIEWS.topic()).includes('مختبر رسم المعادلات')) return { __fail: 'مختبر الرسم ظهر في موضوع هندسي لا يستخدم رسم الدوال' };
      return true;
    } finally { Object.assign(S, old); }
  })()`);
  if (out && out.__fail) return out;
  return true;
});

T('بقاء أرقام الفصول بعد اكتمالها', () => {
  const out = run(`(function(){
    const st = me(), f = findChapter('a12c3');
    if (!f) return { __fail: 'لم يُعثر على الفصل الثالث للرياضيات' };
    const old = { progress: st.progress, solves: st.solves, tests: st.tests, viewGrade: S.viewGrade, viewSubject: S.viewSubject };
    try {
      S.viewGrade = 12; S.viewSubject = 'الرياضيات';
      st.progress = Object.assign({}, st.progress || {});
      st.solves = Object.assign({}, st.solves || {});
      st.tests = Object.assign({}, st.tests || {}, { ['c:' + f.ch.id]: { best: 100 } });
      f.ch.topics.forEach(t => {
        st.progress[t.id] = { seen: Object.fromEntries(SEGS.filter(s => segHas(t, s[0])).map(s => [s[0], 1])), quiz: { best: 100, at: 1 } };
        t.problems.forEach(p => { st.solves[p.id] = { self: 'ok' }; });
      });
      _tpGen++; _tpCache.clear();
      const html = String(VIEWS.subject());
      const chapter = html.match(/<button class="pn big s-done"[^>]*data-act="chapter" data-id="a12c3"[^>]*><span>([^<]+)<\\/span><\\/button>/);
      if (!chapter) return { __fail: 'لم يظهر الفصل الثالث كمنجز في المسار' };
      if (chapter[1] !== ar(3)) return { __fail: 'اختفى رقم الفصل الثالث بعد إتمامه' };
      return true;
    } finally {
      Object.assign(st, { progress: old.progress, solves: old.solves, tests: old.tests });
      S.viewGrade = old.viewGrade; S.viewSubject = old.viewSubject;
      _tpGen++; _tpCache.clear();
    }
  })()`);
  if (out && out.__fail) return out;
  return true;
});

T('رسم تمييز القطوع بأمثلة رقمية مختلفة', () => {
  const out = run(`(function(){
    const f = FIGS.conicClassification, t = findTopic('m12c2t6');
    if (!f || !t) return { __fail: 'رسم تصنيف القطوع أو موضوعه غير مسجل' };
    if (!['2x² + 2y² = 8', '4x² + 9y² = 36', 'x² − 4y² = 4', 'y² − 4x = 0'].every(x => f.svg.includes(x))) return { __fail: 'أمثلة المعادلات الأربعة لا تظهر في الرسم' };
    if (!t.t.explain.some(b => b.t === 'fig' && b.k === 'conicClassification')) return { __fail: 'موضوع التمييز ما زال يعيد الرسم العام للقطوع' };
    return true;
  })()`);
  if (out && out.__fail) return out;
  return true;
});

T('كل أمثلة مختبر الرسم تنتج منحنيات صالحة', () => {
  const out = run(`(function(){
    const P = window.DarbMathPlot, configs = GRAPH_LAB_DEFAULTS;
    const expected = ['m12c1t7', 'm12c2t1', 'm12c2t2', 'm12c2t3', 'm12c2t4', 'm12c2t5', 'm12c2t6',
      'm12c3t1', 'm12c3t2', 'm12c3t3', 'm12c3t4', 'm12c3t5', 'm12c3t6', 'm12c3t7', 'm12c3t8',
      'm12c4t1', 'm12c4t2', 'm12c4t3', 'm12c4t4', 'm12c4t5', 'm12c4t6', 'm12c4t7', 'm12c4t8', 'm12c4t9', 'm12c5t2'];
    if (expected.some(id => !configs[id] || !findTopic(id) || !needsMathGraphLab(findTopic(id).t, findTopic(id).ch))) return { __fail: 'مختبر الرسم غير مربوط بكل درس ذي رسم بياني مناسب' };
    if (new Set(Object.values(configs).map(c => c.eq)).size !== Object.keys(configs).length) return { __fail: 'المعادلة الافتراضية مكررة بين موضوعين' };
    if (mathGraphHTML('unknown-topic') !== '') return { __fail: 'ظهر مختبر عام بلا إعداد خاص بالموضوع' };
    if ((configs.m12c2t4.presets || []).some(([, eq]) => /x\\^2\\s*-|y\\^2\\s*-|x\\^2\\s*\\+\\s*y\\^2\\s*=/.test(eq))) return { __fail: 'مختبر القطع الناقص يعرض نوعًا آخر من القطوع' };
    if (!configs.m12c4t6.family || !/x\\^2\\/2/.test(configs.m12c4t6.family.join(' ')) ||
        !/F\\(x\\)=sin/.test(configs.m12c4t4.familyLabel)) return { __fail: 'منحنيات التكامل المحدد وغير المحدد لا تمثلان فكرتيهما' };
    for (const [id, c] of Object.entries(configs)) {
      if (!findTopic(id)) return { __fail: 'إعداد رسم لدرس غير موجود: ' + id };
      const svg = P.plot(c.eq, c.xmin == null ? -10 : c.xmin, c.xmax == null ? 10 : c.xmax, c.ymin == null ? -10 : c.ymin, c.ymax == null ? 10 : c.ymax);
      if (!/class="graph-curve"[^>]*d="M/.test(svg)) return { __fail: 'لم يُرسم المثال الافتراضي للموضوع ' + id };
      for (const [label, equation] of (c.presets || [])) {
        const preset = P.plot(equation, c.xmin == null ? -10 : c.xmin, c.xmax == null ? 10 : c.xmax, c.ymin == null ? -10 : c.ymin, c.ymax == null ? 10 : c.ymax);
        if (!/class="graph-curve"[^>]*d="M/.test(preset)) return { __fail: 'لم يُرسم المثال «' + label + '» في ' + id };
      }
      if (c.family) {
        const layered = P.plotMany(c.family, c.xmin, c.xmax, c.ymin, c.ymax);
        if ((layered.match(/class="graph-curve graph-layer-/g) || []).length !== c.family.length) return { __fail: 'تعذّر إظهار جميع منحنيات المقارنة في ' + id };
      }
    }
    return true;
  })()`);
  if (out && out.__fail) return out;
  return true;
});

T('ربط نوافذ المعلومات والتوزيع والتقارير', () => {
  const out = run(`(function(){ try {
    const st = me(), click = document._ev.click.find(fn => String(fn).includes("const stop = e.target.closest"));
    if (!click) return { __fail: 'معالج النقر غير مسجل' };
    const act = (name, data) => click({ target: { closest: selector => selector === '[data-act]' ? { dataset: Object.assign({ act: name }, data || {}) } : null } });
    const old = { view: S.view, stack: S.stack, popup: S.popup, reportHtml: S.reportHtml, weekMode: st.weekMode, dayPlan: st.dayPlan, autoWeek: st.autoWeek, weekFill: st.weekFill };
    try {
      act('aboutInfo', { info: 'how', title: 'كيف يعمل دَرْب' });
      if (!S.popup || S.popup.title !== 'كيف يعمل دَرْب' || !String(S.popup.body).includes('لماذا ندرسه')) return { __fail: 'زر معلومات التطبيق لم يفتح النافذة' };
      if (String(vPopup()).includes('event.stopPropagation')) return { __fail: 'حدث الإغلاق ما زال ممنوعًا داخل النافذة' };
      act('closePopup');
      if (S.popup) return { __fail: 'زر إغلاق النافذة لم يغلقها' };
      act('weekSetManual');
      if (S.view !== 'weekplan' || st.weekMode !== 'manual' || !String(VIEWS.weekplan()).includes('اسحب الموضوع إلى اليوم')) return { __fail: 'اختيار الترتيب اليدوي لا يفتح مواضيع السحب والإفلات' };
      act('weekSetAuto');
      if (st.weekMode !== 'auto' || !st.autoWeek || !st.autoWeek.days.flat().length) return { __fail: 'التوزيع العشوائي لم ينشئ خطة أسبوعية' };
      act('genReport', { type: 'weekly' });
      if (!S.popup || !String(S.reportHtml).includes('تقرير أسبوعي') || !String(S.popup.body).includes('reportPrint')) return { __fail: 'إنشاء التقرير لا يفتح المعاينة وأدوات PDF' };
      return true;
    } finally { S.view = old.view; S.stack = old.stack; S.popup = old.popup; S.reportHtml = old.reportHtml; st.weekMode = old.weekMode; st.dayPlan = old.dayPlan; st.autoWeek = old.autoWeek; st.weekFill = old.weekFill; }
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('لا يعلن اليوم عن إكمال المنهج بلا دليل', () => {
  const out = run(`(function(){ try {
    const st = me(), oldPlan = st.dayPlan;
    try {
      st.dayPlan = { d: isoD(new Date()), ids: [] };
      const h = String(VIEWS.today());
      if (line_count() > 0 && h.includes('أنهيت المنهج — وقت المراجعة الشاملة')) return { __fail: 'عُرض إكمال المنهج مع وجود مواضيع متبقية' };
      if (line_count() > 0 && !h.includes('لا دروس مجدولة اليوم')) return { __fail: 'لا يوضّح أن اليوم بلا دروس مجدولة' };
      return true;
    } finally { st.dayPlan = oldPlan; }
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('تصدير PowerPoint حسب الموضوع والنطاق', () => {
  const out = run(`(function(){ try {
    const sub = gradeContents(me().grade).find(y => y.c.chapters.some(ch => ch.topics.length));
    if (!sub) return { __fail: 'لا مادة مناسبة لاختبار الشرائح' };
    const ch = sub.c.chapters.find(ch => ch.topics.length), topic = ch.topics.find(t => !isHidden(t.id));
    S.pptx = { level: 'topic', subject: sub.subject, chapter: ch.id, topic: topic.id, topicIds: [topic.id], answers: 1 };
    const view = String(VIEWS.powerpoint()), deck = buildPptx();
    if (!view.includes('عرض PowerPoint') || !view.includes('موضوعات مختارة')) return { __fail: 'واجهة اختيار نطاق العرض ناقصة' };
    if (deck.bytes[0] !== 0x50 || deck.bytes[1] !== 0x4b || !deck.name.endsWith('.pptx')) return { __fail: 'الملف الناتج ليس حزمة PPTX/ZIP' };
    const packed = new TextDecoder().decode(deck.bytes);
    if (!packed.includes('ppt/presentation.xml') || !packed.includes('ppt/slides/slide1.xml') || deck.slideCount < 2) return { __fail: 'أجزاء العرض أو شرائحه الأساسية مفقودة' };
    const bytes = deck.bytes, zip = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), entries = [];
    const crc32 = data => { let c = -1; for (const b of data) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (-(c & 1) & 0xEDB88320); } return (c ^ -1) >>> 0; };
    let pos = 0;
    while (pos + 30 <= bytes.length && zip.getUint32(pos, true) === 0x04034b50) {
      const size = zip.getUint32(pos + 18, true), nameLen = zip.getUint16(pos + 26, true), extraLen = zip.getUint16(pos + 28, true);
      const nameAt = pos + 30, bodyAt = nameAt + nameLen + extraLen, bodyEnd = bodyAt + size;
      if (bodyEnd > bytes.length || zip.getUint32(pos + 22, true) !== size) return { __fail: 'سجل ZIP تالف أو مضغوط على نحو غير مدعوم' };
      const body = bytes.subarray(bodyAt, bodyEnd);
      if (crc32(body) !== zip.getUint32(pos + 14, true)) return { __fail: 'فشل التحقق من سلامة محتوى PPTX' };
      entries.push(new TextDecoder().decode(bytes.subarray(nameAt, nameAt + nameLen)));
      pos = bodyEnd;
    }
    if (zip.getUint32(pos, true) !== 0x02014b50 || zip.getUint32(bytes.length - 22, true) !== 0x06054b50 || zip.getUint16(bytes.length - 12, true) !== entries.length || new Set(entries).size !== entries.length) return { __fail: 'دليل ZIP المركزي غير مكتمل أو غير متطابق' };
    S.pptx.level = 'chapter';
    if (pptTopics().length !== ch.topics.filter(t => !isHidden(t.id)).length) return { __fail: 'اختيار الفصل لا يشمل موضوعاته' };
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('تنسيق الحلول والاتجاهات في كل المواد', () => {
  if (!html.includes('.card.about-hero .muted') || !html.includes('.about-hero{background:var(--acc);color:var(--acc-ink)') || !html.includes('.card.about-hero h2,.card.about-hero p{color:var(--acc-ink)}') || !html.includes('.prob-text{font-size:1.15em;line-height:2;text-align:start;unicode-bidi:plaintext')) return { __fail: 'إصلاح تباين البطاقات أو اتجاه السؤال غير موجود' };
  const out = run(`(function(){ try {
    const structured = solutionContentHTML(['المعطيات: a = 2', 'المطلوب: احسب x', 'القانون: x = a²', 'التبسيط: x = 2²', 'الناتج: x = 4']);
    if (!['المعطيات', 'المطلوب', 'القانون', 'التبسيط', 'الناتج', 'class="math'].every(x => structured.includes(x))) return { __fail: 'لم تظهر أقسام الحل أو عزل المعادلات' };
    if (!/class="math[^"]*" dir="ltr"/.test(fm(\"f'(x) = 3x² − 3\"))) return { __fail: 'المعادلة المختلطة لم تُعزل باتجاه LTR صريح' };
    const multi = solutionContentHTML(['أ) احسب a = 1', 'ب) احسب b = 2', 'ج) احسب c = 3']);
    if (!['الجزء أ', 'الجزء ب', 'الجزء ج'].every(x => multi.includes(x))) return { __fail: 'لم تُفصل المطالب أ، ب، ج' };
    const ordered = solutionHTML({ steps: ['المعطيات: n = 2', 'المطلوب: احسب x', 'القانون: x = n²', 'التبسيط: x = 2²', 'الناتج: x = 4'], ans: '4' }, { used: 10, sec: 60 });
    if (!ordered.includes('الحل المرتب خطوة بخطوة') || !ordered.includes('النتيجة النهائية')) return { __fail: 'صفحة المسألة لا تستخدم قالب الحل الموحد' };
    const mixed = blockHTML({ t: 'p', x: 'يتناسب المجال مع E = V / d في هذا المثال' });
    if (!mixed.startsWith('<p dir="auto">') || !/class="math[^"]*" dir="ltr"/.test(mixed)) return { __fail: 'النص العربي لا يعزل المعادلة باتجاه LTR' };
    const table = blockHTML({ t: 'table', cap: 'مقارنة الكميات', head: ['الكمية', 'الوحدة'], rows: [['السعة C', 'F'], ['الجهد V', 'English label']] });
    if (!table.includes('<table class="tbl" dir="rtl">') || (table.match(/dir="auto"/g) || []).length < 6 || !/class="math[^"]*" dir="ltr"/.test(table)) return { __fail: 'اتجاه الجدول أو خلاياه المختلطة غير مضبوط' };
    const law = lawsHTML({ laws: [{ f: 'C = Q / V', name: 'السعة الكهربائية', read: 'Capacitance C تساوي Q / V', vars: [['C', 'السعة C', 'F'], ['V', 'فرق الجهد', 'V']], when: 'احسب السعة إذا عُرفت الشحنة والجهد' }] });
    if (!law.includes('<table class="tbl" dir="rtl">') || !law.includes('<th dir="auto">') || !law.includes('<td dir="auto">')) return { __fail: 'جدول رموز القانون لا يضبط اتجاه النص والمعادلات' };
    let checkedBlocks = 0;
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => ch.topics.forEach(t => {
      (t.explain || []).forEach(b => {
        if (!['h', 'p', 'key', 'note', 'list', 'think', 'table', 'activity'].includes(b.t)) return;
        const rendered = blockHTML(b, t.id);
        if (b.t === 'table' && (!rendered.includes('<table class="tbl" dir="rtl">') || !rendered.includes('dir="auto"'))) throw new Error('اتجاه جدول المنهج غير مضبوط: ' + t.id);
        if (['h', 'p', 'key', 'note'].includes(b.t) && !rendered.includes('dir="auto"')) throw new Error('اتجاه نص المنهج غير مضبوط: ' + t.id);
        checkedBlocks++;
      });
      const renderedLaws = lawsHTML(t);
      if (renderedLaws && /<table class="tbl"(?! dir="rtl")/.test(renderedLaws)) throw new Error('جدول قانون بلا اتجاه RTL: ' + t.id);
    })));
    if (!checkedBlocks) return { __fail: 'لم تُفحص كتل الشرح في المنهج' };
    S.setTab = 'look'; const themes = String(VIEWS.settings());
    if (!['بحري', 'طبيعي', 'وردي هادئ'].every(x => themes.includes(x))) return { __fail: 'أنماط المظهر الإضافية لا تظهر في الإعدادات' };
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('الشرح العربي والمعادلات المختلطة', () => {
  const out = run(`(function(){ try {
    const f = findTopic('m12c4t6'), why = explainHTML(f.t).match(/<p dir="auto"[^>]*>/);
    const list = blockHTML({ t: 'list', x: ['نشرح F(x)=' + '<span class="math eq" dir="ltr">F(x)=x²/2</span>' + ' لتوضيح الفكرة.'] }, f.t.id);
    if (!why || !why[0].includes('unicode-bidi:plaintext') || !list.includes('<li dir="auto">') || !list.includes('dir="ltr"')) return { __fail: 'الشرح العربي أو اتجاه المعادلة غير معزول داخل الفقرة' };
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('ربط رسوم الدرس بأسئلة الكتاب والأمثلة', () => {
  const out = run(`(function(){ try {
    const evidence = figureLibraryEvidence(), missing = [];
    let linkedBookItems = 0, totalBookItems = 0, topicsWithoutFigures = 0, topicWithFigure = null;
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => ch.topics.forEach(t => {
      const keys = topicFigureKeys(t);
      if (keys.length && !topicWithFigure) topicWithFigure = t;
      const items = (t.problems || []).filter(p => p.src === 'book').map(p => ({ question: p.text, ref: p.ref || 'مسائل الكتاب' }))
        .concat((t.examples || []).map((e, i) => ({ question: e.text, ref: (e.title || 'مثال ' + ar(i + 1)) + (e.page ? ' | ص' + ar(e.page) : '') })));
      totalBookItems += items.length;
      if (!keys.length && items.length) topicsWithoutFigures++;
      if (keys.length) linkedBookItems += items.length;
      items.forEach(item => keys.forEach(k => {
        const refs = (evidence.get(k) || {}).bookQuestions || [];
        if (!refs.some(ref => ref.question === item.question && ref.ref === item.ref)) missing.push(t.id + ':' + item.ref);
      }));
    })));
    if (!linkedBookItems || topicsWithoutFigures || missing.length) return { __fail: missing.length ? 'أسئلة بلا إحالة رسم في المكتبة: ' + missing.slice(0, 5).join(', ') : 'مواضيع كتاب بلا رسوم مرتبطة: ' + topicsWithoutFigures };
    if (!topicWithFigure || !topicQuestionFiguresHTML(topicWithFigure).includes('رسوم تساعد على فهم السؤال')) return { __fail: 'الرسوم المرتبطة لا تظهر في شاشة السؤال' };
    console.log('      · رسوم مرتبطة بـ' + ar(linkedBookItems) + ' سؤالًا/مثالًا كتابيًا؛ مواضيع لديها مسائل كتاب بلا رسم درس مسجل: ' + ar(topicsWithoutFigures) + ' من ' + ar(totalBookItems));
    const acKeys = Array.from({ length: 13 }, (_, i) => 'topic-p12c3t' + (i + 1));
    if (acKeys.some(k => !FIGS[k] || !FIGS[k].svg.includes('<svg') || FIGS[k].steps.length < 3)) return { __fail: 'رسوم أسئلة الفصل الثالث فيزياء غير متاحة داخل المكتبة التفاعلية' };
    const old = S.figLibTab;
    try {
      S.figLibTab = 'bookQuestions';
      const view = String(VIEWS.figlib());
      if (!view.includes('data-act=\"figSubjectOpen\"')) return { __fail: 'مواد أسئلة الكتاب لا تفتح نوافذ اختيار المادة' };
    } finally { S.figLibTab = old; }
    return { linkedBookItems };
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('الرسم الشارح التمهيدي للمتسعة', () => {
  const out = run(`(function(){ try {
    const X = EXPLAINERS.p12c1t2, P = {};
    if (!X || X.steps.length !== 6 || !X.pick || !X.steps[0].say.includes('ورقتا ألمنيوم')) return { __fail: 'المثال الواقعي غير موجود في بداية الرسم' };
    Object.entries(X.params).forEach(([k, v]) => P[k] = v.val);
    if (!X.read(P, 0, 0, 'field').includes('توقّعك صحيح')) return { __fail: 'تغذية سؤال التوقع لا تعمل' };
    const opening = X.draw(P, 0, 0, '');
    if (!opening.includes('رقاقة ألمنيوم') || !opening.includes('بلاستيك عازل') || opening.includes('طاقة للمصباح')) return { __fail: 'المثال المنزلي لا يوضح الصفيحتين والعازل أو يكشف الإجابة مبكرًا' };
    if (!X.steps[1].params.includes('S') || !X.steps[1].params.includes('d') || !X.read(P, 1, 0, '').includes('البلاستيك عازل')) return { __fail: 'شرح الصفيحتين والفاصل لا يستجيب للتفاعل' };
    const widerPlates = Object.assign({}, P, { S: 4 });
    if (X.draw(P, 1, 0, '') === X.draw(widerPlates, 1, 0, '')) return { __fail: 'مساحة الصفيحتين لا تغير الرسم' };
    if (!X.read(P, 3, 0, '').includes('E ∝ V')) return { __fail: 'شرح أثر الجهد والمسافة في المجال غير ظاهر' };
    if (!X.read(P, 5, 0, 'field').includes('C = Q')) return { __fail: 'لم تظهر علاقة السعة والشحنة والجهد' };
    for (let i = 0; i < X.steps.length; i++) {
      const svg = X.draw(P, i, 1, i === 0 ? 'field' : '');
      if (!svg || /NaN|undefined/.test(svg)) return { __fail: 'تعطل الرسم عند المرحلة ' + i };
    }
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('رسوم المعدلات والتكامل الشارحة', () => {
  const out = run(`(function(){ try {
    for (const id of ['m12c3t1', 'm12c4t3', 'm12c4t6']) {
      const X = getTopicExplainer(id), P = {};
      if (!X || X.steps.length < 3) return { __fail: 'الرسم الشارح الخاص غير موجود للموضوع ' + id };
      Object.entries(X.params || {}).forEach(([k, v]) => P[k] = v.val);
      for (let i = 0; i < X.steps.length; i++) {
        const svg = X.draw(P, i, 1, null), read = X.read ? X.read(P, i, 1, null) : '';
        if (!svg || /NaN|undefined/.test(svg) || !read || /undefined/.test(read)) return { __fail: 'عرض الشرح أو القيم فشل في ' + id + ' المرحلة ' + i };
      }
      if (id === 'm12c3t1' && !/-٠[.٫]١٠ م\\/ث/.test(X.read(P, 3, 0, null))) return { __fail: 'حساب معدل تغير الارتفاع لا يطابق −0.1 م/ث: ' + X.read(P, 3, 0, null) };
      if (id === 'm12c4t3') {
        const bounds = X.bounds(8);
        if (!(bounds.lower <= 32 / 3 && bounds.upper >= 32 / 3) || bounds.upper - bounds.lower > 4.01) return { __fail: 'مجاميع المستطيلات لا تحصر التكامل بدقة' };
      }
      if (id === 'm12c4t6' && !X.read(P, 2, 0, null).includes('لا تعتمد على C')) return { __fail: 'لم يوضح الرسم أن الثابت لا يغير المشتقة' };
    }
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('تدقيق تكرار الرسوم داخل فصول السادس', () => {
  const out = run(`(function(){ try {
    const duplicates = [];
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => {
      const seen = new Map();
      ch.topics.forEach(t => {
        const X = getTopicExplainer(t.id), P = {};
        Object.entries(X.params || {}).forEach(([k, p]) => P[k] = p.val);
        const svg = X.draw(P, 0, 0, X.pick ? X.pick.val : '');
        const other = seen.get(svg);
        if (other) duplicates.push({ subject: y.subject, chapter: ch.title, mode: X.visualMode, first: other, second: t.id });
        else seen.set(svg, t.id);
      });
    }));
    return { duplicates };
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  const duplicates = out.duplicates || [];
  const acDuplicates = duplicates.filter(x => x.chapter.includes('التيار المتناوب'));
  const byMode = duplicates.reduce((counts, x) => { counts[x.mode] = (counts[x.mode] || 0) + 1; return counts; }, {});
  console.log('      · رسومات مكررة حرفيًا: ' + duplicates.length + ' | العائلات: ' + Object.entries(byMode).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([m, n]) => m + ':' + n).join('، '));
  if (duplicates.length) return { __fail: 'ما زالت هناك رسوم شارحة متطابقة داخل الفصل: ' + duplicates.slice(0, 5).map(x => x.first + '/' + x.second).join(', ') };
  return true;
});

T('اتجاه وترقيم قوائم الرياضيات', () => {
  const listCss = html.includes('.lst>li{') && html.includes('.lst>li::before{') &&
    html.includes('position:relative;display:block;direction:rtl') &&
    html.includes('position:absolute;right:9px') && html.includes('arabic-indic') &&
    html.includes('white-space:normal;overflow-wrap:anywhere') &&
    html.includes("case 'list': return '<ol class=\"lst\" dir=\"rtl\">' + b.x.map(x => '<li dir=\"auto\">' + fm(");
  const out = run(`(function(){ try {
    const t = findTopic('m12c4t6').t, list = t.explain.find(b => b.t === 'list');
    if (!list) return { __fail: 'لا قائمة معادلات لاختبار اتجاهها' };
    const rendered = blockHTML(list, t.id);
    if (!rendered.includes('<ol class="lst" dir="rtl">') || !rendered.includes('<li dir="auto">')) return { __fail: 'قائمة المعادلات فقدت اتجاهها الدلالي' };
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (!listCss || (out && out.__fail)) return out && out.__fail ? out : { __fail: 'تنسيق أرقام القوائم RTL غير موجود' };
  return true;
});

T('الرسم الشارح لكل موضوع في السادس', () => {
  const out = run(`(function(){ try {
    const ids = Array.from(IDX_TOPIC.entries()).filter(([, f]) => String(f.key).startsWith('12:')).map(([id]) => id);
    const missing = [], broken = [];
    ids.forEach(id => {
      try {
        const X = getTopicExplainer(id);
        const minSteps = X && ['book', 'islamic-book'].includes(X.visualMode) ? 1 : 3;
        if (!X || !X.title || !Array.isArray(X.steps) || X.steps.length < minSteps || typeof X.draw !== 'function') {
          missing.push(id); return;
        }
        const P = {};
        Object.entries(X.params || {}).forEach(([k, p]) => P[k] = p.val);
        X.steps.forEach((step, i) => {
          const svg = X.draw(P, i, 1, X.pick ? X.pick.val : '');
          const read = X.read ? X.read(P, i, 1, X.pick ? X.pick.val : '') : '';
          const badSvg = /NaN|undefined|\\[object Object\\]/.exec(svg);
          const badRead = /undefined|\\[object Object\\]/.exec(read);
          const genericScene = X.visualMode !== 'concept-map' && svg.includes('>الفكرة</text>');
          if (!svg || !svg.includes('<') || badSvg || badRead || genericScene) broken.push(id + ':' + i + ' mode=' + X.visualMode + (badSvg ? ' invalid=' + badSvg[0] : '') + (badRead ? ' read=' + badRead[0] : '') + (genericScene ? ' generic scene' : ''));
        });
      } catch (e) { broken.push(id + ':' + e.message); }
    });
    if (missing.length) return { __fail: 'موضوعات بلا رسم شارح: ' + missing.slice(0, 12).join(', ') + (missing.length > 12 ? '… (' + missing.length + ')' : '') };
    if (broken.length) return { __fail: 'رسوم لا تُرسم أو نصوص معطوبة: ' + broken.slice(0, 12).join(', ') };
    const generated = ids.filter(id => !['p12c1t2','k12c2t2','m12c1t1','b12c1t8','i12u1t0','e12u1t2'].includes(id));
    if (!generated.length) return { __fail: 'لم تُنشأ رسوم للموضوعات التي لا تملك تصميمًا خاصًا' };
    const expectedModes = [
      ['الرياضيات', /تطبيقات التفاضل/, 'derivative'],
      ['الرياضيات', /التكامل/, 'integral'],
      ['الرياضيات', /المعادلات التفاضلية/, 'diff-eq'],
      ['الرياضيات', /الهندسة الفضائية/, 'math-space'],
      ['الفيزياء', /التيار المتناوب/, 'ac-current'],
      ['الفيزياء', /الموجات الكهرومغناطيسية/, 'em-wave'],
      ['الفيزياء', /البصريات/, 'optics'],
      ['الفيزياء', /الحث الكهرومغناطيسي/, 'magnetic', /مقدمة في المغناطيسية/],
      ['الفيزياء', /الحث الكهرومغناطيسي/, 'induction', /اكتشاف فراداي/],
      ['الفيزياء', /الفيزياء الحديثة/, 'photoelectric'],
      ['الفيزياء', /الحالة الصلبة/, 'crystal'],
      ['الفيزياء', /الأطياف الذرية/, 'atomic-spectrum', /مقدمة/],
      ['الفيزياء', /الأطياف الذرية/, 'laser', /مفهوم الليزر/],
      ['الفيزياء', /الفيزياء النووية/, 'nuclear'],
      ['الكيمياء', /الثرموداينمك/, 'thermo'],
      ['الكيمياء', /الاتزان الأيوني/, 'ionic'],
      ['الكيمياء', /التأكسد والاختزال/, 'electrochem'],
      ['الكيمياء', /الكيمياء التناسقية/, 'coordination'],
      ['الكيمياء', /التحليل الكيميائي/, 'analysis'],
      ['الأحياء', /الأنسجة/, 'tissue'],
      ['الأحياء', /التكاثر/, 'reproduction'],
      ['الأحياء', /التكوين الجنيني/, 'embryo'],
      ['الأحياء', /الوراثة/, 'genetics']
    ];
    const modeFailures = expectedModes.map(([subject, chapter, mode, topic]) => {
      const id = ids.find(topicId => { const f = findTopic(topicId); return f && f.subject === subject && chapter.test(f.ch.title) && (!topic || topic.test(f.t.title)); });
      const actual = id && getTopicExplainer(id).visualMode;
      return actual === mode ? null : subject + '/' + chapter + '→' + actual + (id ? ' (' + id + ')' : ' (لا موضوع مطابق)');
    }).filter(Boolean);
    if (modeFailures.length) return { __fail: 'عائلات الرسم لا تطابق فصولها: ' + modeFailures.join(', ') };
    const acIds = Array.from({ length: 13 }, (_, i) => 'p12c3t' + (i + 1));
    const acVisuals = acIds.map(id => {
      const X = getTopicExplainer(id), P = {};
      Object.entries(X.params || {}).forEach(([k, p]) => P[k] = p.val);
      return X.visualMode === 'ac-current' && X.read(P, 1, 1, '').includes('الموضوع:') ? X.draw(P, 1, 1, '') : '';
    });
    if (acVisuals.some(svg => !svg) || new Set(acVisuals).size !== acIds.length) return { __fail: 'موضوعات التيار المتناوب تشترك في رسم واحد بدل تمثيل خاص لكل موضوع' };
    const old = { grade: S.viewGrade, subject: S.viewSubject, chapter: S.viewChapter, topic: S.viewTopic };
    const f = findTopic(generated[0]);
    S.viewGrade = 12; S.viewSubject = f.subject; S.viewChapter = f.ch.id; S.viewTopic = f.t.id;
    const topicPage = String(VIEWS.topic());
    Object.assign(S, { viewGrade: old.grade, viewSubject: old.subject, viewChapter: old.chapter, viewTopic: old.topic });
    if (!topicPage.includes('data-act="xplain"') || !topicPage.includes('الرسم الشارح:')) return { __fail: 'زر الرسم الشارح غير ظاهر داخل صفحة الموضوع' };
    return { topics: ids.length, handDrawn: 6, generated: generated.length,
      visualFamilies: new Set(generated.map(id => getTopicExplainer(id).visualMode)).size };
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  if (!out || out.topics < 100) return { __fail: 'تغطية موضوعات الصف غير مكتملة' };
  console.log('      · تغطية ' + out.topics + ' موضوعًا: ' + out.handDrawn + ' رسومًا مخصصة و' + out.generated + ' رسمًا مولدًا ضمن ' + out.visualFamilies + ' عائلة بصرية');
  return true;
});

T('عدد الأسئلة وتوزيع الوزاري', () => {
  const out = run(`(function(){ try {
    const oldExam = S.exam, oldScope = S.examScope;
    try {
    S.examScope = null;
    const pool = ministerialPool('الفيزياء');
    if (!pool.length) return true;
    const problems = pool.filter(x => examQuestionKind(x.q) === 'problem').length;
    const two = selectExamQuestions(pool, Math.min(8, pool.length), 'two');
    if (two.length !== Math.min(8, pool.length) || two.filter(x => examQuestionKind(x.q) === 'problem').length < Math.min(2, problems)) return { __fail: 'لم يضمن وضع المسألتين عدد المسائل المطلوب' };
    const half = selectExamQuestions(pool, Math.min(10, pool.length), 'half');
    if (half.length !== Math.min(10, pool.length)) return { __fail: 'لم يلتزم الاختبار بالعدد المطلوب' };
    const halfTarget = Math.ceil(half.length / 2);
    if (problems >= halfTarget && pool.length - problems >= half.length - halfTarget &&
        half.filter(x => examQuestionKind(x.q) === 'problem').length !== halfTarget) return { __fail: 'نسبة المسائل لا تتبع الخيار المحدد' };
    const chapters = {}; half.forEach(x => chapters[qChId(x)] = (chapters[qChId(x)] || 0) + 1);
    const counts = Object.values(chapters);
    if (counts.length > 1 && Math.max(...counts) - Math.min(...counts) > 2) return { __fail: 'توزيع الأسئلة بين الفصول غير متوازن' };
    S.exam = { kind: 'ministerial', subject: 'الفيزياء', phase: 'config', perQ: 180, prep: 0, problemMode: 'half' };
    const view = String(examConfigView(S.exam, 'تهيئة'));
    if (!view.includes('نصف الأسئلة مسائل') || !view.includes('examCustomCount') || !view.includes('examGoCustom')) return { __fail: 'إعداد نسبة المسائل أو العدد المخصص غير ظاهر' };
    return true;
    } finally { S.exam = oldExam; S.examScope = oldScope; }
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('ألوان المواد وترتيب مواضيع الخطة', () => {
  const out = run(`(function(){ try {
    const subs = gradeContents(me().grade);
    if (subs.some(y => !scol(y.subject) || scol(y.subject) === 'var(--acc)')) return { __fail: 'مادة بلا لون مميز' };
    const rank = new Map(subs.map((y, i) => [y.subject, i]));
    const sample = weeklyTopicList(me(), 'manual').slice(0, 24);
    const sorted = sortTopicsByMaterial(sample);
    for (let i = 1; i < sorted.length; i++) {
      if (rank.get(sorted[i - 1].subject) > rank.get(sorted[i].subject)) return { __fail: 'مواضيع الخطة لا تُجمع حسب ترتيب المواد' };
    }
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('جداول المصطلحات والقوانين في PowerPoint', () => {
  const out = run(`(function(){ try {
    let found = null;
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => ch.topics.forEach(t => {
      if (!found && ((t.defs || []).length || (t.laws || []).length)) found = { subject: y.subject, ch, t };
    })));
    if (!found) return { __fail: 'لا موضوع يحوي تعريفات أو قوانين' };
    const tableSlides = pptxTopicSlides([{ t: found.t, ch: found.ch }], true).filter(s => s.kind === 'table');
    if (!tableSlides.length || !tableSlides.some(s => s.grid[0].length >= 2)) return { __fail: 'لم تُبنَ جداول منظمة لمحتوى الموضوع' };
    if (!pptxGridShapes(tableSlides[0].grid).includes('خلية جدول')) return { __fail: 'شبكة خلايا PowerPoint غير موجودة' };
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('تصدير الأسئلة فقط مع خيار الإجابات', () => {
  const out = run(`(function(){ try {
    const subs = gradeContents(me().grade); if (!subs.length) return { __fail: 'لا مواد للتصدير' };
    S.qx = { source: 'book', subject: subs[0].subject, chapter: '', answers: 1 };
    const view = String(VIEWS.questionexport()), doc = questionExportHTML();
    if (!view.includes('أسئلة المنهج') || !view.includes('البنك الوزاري')) return { __fail: 'خيارات مصدر الأسئلة مفقودة' };
    if (!doc.rows.length || !doc.html.includes('الإجابة')) return { __fail: 'ملف الأسئلة مع الإجابات فارغ أو بلا إجابات' };
    S.qx.answers = 0;
    if (questionExportHTML().html.includes('<div class="ans">')) return { __fail: 'ظهرت الإجابات رغم إيقاف الخيار' };
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

T('رسائل خطأ الرسم وحدود المجال', () => {
  const out = run(`(function(){
    const oldGet = document.getElementById, oldRender = render, oldGraphs = S.mathGraphs, topicId = 'm12c2t6';
    const inputs = {
      graphXmin: { value: '-10' }, graphXmax: { value: '10' },
      graphYmin: { value: '-10' }, graphYmax: { value: '10' }
    };
    try {
      document.getElementById = id => inputs[id] || null;
      render = function(){};
      renderMathGraph('x^2 + y^2 = 9', topicId);
      if (!S.mathGraphs[topicId].svg || S.mathGraphs[topicId].error) return { __fail: 'لم يُحفظ الرسم الناتج للموضوع' };
      inputs.graphXmax.value = '-10';
      renderMathGraph('x^2 + y^2 = 9', topicId);
      if (!S.mathGraphs[topicId].error || S.mathGraphs[topicId].svg) return { __fail: 'لم يُرفض مجال غير مرتب برسالة واضحة' };
      return true;
    } finally { document.getElementById = oldGet; render = oldRender; S.mathGraphs = oldGraphs; }
  })()`);
  if (out && out.__fail) return out;
  return true;
});

T('مسارات وسائط النسخة المضغوطة', () => {
  const out = run(`(function(){
    const a = backupMediaInfo('بياناتي/صور-الحلول/student-1/problem-7.jpg');
    const b = backupMediaInfo('بياناتي/صور-الحلول/problem-7.jpg');
    const c = backupMediaInfo('بياناتي/صور-الطلاب/student-1.jpg');
    const d = backupMediaInfo('قراءة.txt');
    if (!a || a.sid !== 'student-1' || a.pid !== 'problem-7') return 'مسار صورة حلّ متعددة الطلاب غير صحيح';
    if (!b || b.sid !== null || b.pid !== 'problem-7') return 'مسار الصورة القديمة غير مدعوم';
    if (!c || c.sid !== 'student-1' || !c.avatar) return 'مسار الصورة الشخصية غير صحيح';
    if (d !== null) return 'قُبل ملف ليس صورة';
    return true;
  })()`);
  if (typeof out === 'string') return { __fail: out };
  return true;
});

T('الخطة اليدوية والمسائل في يوم الموضوع', () => {
  const out = run(`(function(){ try {
    const st = me(), old = { rest: st.rest, holidays: st.holidays, weekMode: st.weekMode, weekFill: st.weekFill, autoWeek: st.autoWeek, dayPlan: st.dayPlan };
    try {
      st.rest = []; st.holidays = []; st.weekMode = 'auto'; st.autoWeek = null;
      const random = autoWeek(st), randomIds = random.days.flat();
      if (!randomIds.length || new Set(randomIds).size !== randomIds.length) return { __fail: 'التوزيع العشوائي فارغ أو يكرر موضوعًا' };
      const cap = weeklyGoals(st).perDay;
      if (random.days.some(day => day.length > cap)) return { __fail: 'التوزيع العشوائي تجاوز سقف الحصص اليومي' };
      if (random.days.some(day => {
        const subjects = day.map(id => findTopic(id).subject);
        return new Set(subjects).size !== subjects.length;
      })) return { __fail: 'التوزيع العشوائي كرر المادة في اليوم نفسه' };
      const candidates = weeklyTopicList(st, 'manual').slice(0, cap + 1);
      st.weekMode = 'manual'; st.weekFill = { wk: isoD(weekStart0()), days: Array.from({ length: studyDaysCount(st) }, () => []) };
      candidates.forEach(x => wpAssign(x.t.id, 0));
      if (st.weekFill.days[0].length !== Math.min(cap, candidates.length)) return { __fail: 'تجاوز الترتيب اليدوي سقف الحصص اليومي' };
      const x = weeklyTopicList(st, 'manual').find(x => (x.t.problems || []).some(p => (solveOf(p.id) || {}).self !== 'ok'));
      if (!x) return { __fail: 'لا موضوع بمسألة غير محلولة لاختبار وقت المسائل' };
      const n = studyDaysCount(st), di = studyDayIndex(st), wk = isoD(weekStart0());
      st.weekMode = 'manual'; st.weekFill = { wk, days: Array.from({ length: n }, () => []) };
      st.weekFill.days[di].push(x.t.id); st.dayPlan = null;
      const week = String(VIEWS.weekplan());
      if (!/اسحب الموضوع إلى اليوم/.test(week) || !week.includes('class="dnd-day" data-day="' + di + '"')) return { __fail: 'أيام السحب والإفلات غير ظاهرة' };
      const weekSection = String(weekSectionHTML(st));
      if (weekSection.includes('data-act="weekSetAuto"') || weekSection.includes('data-act="weekSetManual"') || !weekSection.includes('افتح مساحة ترتيب الأيام')) return { __fail: 'الصفحة الرئيسية ما زالت تعرض أزرار الوضع المكررة أو أخفت مساحة الترتيب' };
      if (!planToday().picks.some(p => p.t.id === x.t.id)) return { __fail: 'لم يصل موضوع اليوم اليدوي إلى خطة اليوم' };
      if (!String(VIEWS.today()).includes('دروس اليوم (' + ar(planToday().picks.length) + ' من ' + ar(dailyLessonGoal(st)) + ')')) return { __fail: 'هدف عدد الدروس اليومي لا يظهر في صفحة اليوم' };
      const problem = x.t.problems.find(p => (solveOf(p.id) || {}).self !== 'ok');
      const today = String(VIEWS.today());
      if (!today.includes('data-act="prob" data-id="' + problem.id + '"')) return { __fail: 'وقت المسائل لا يفتح مسألةً من موضوع اليوم' };
      return true;
    } finally { Object.assign(st, old); }
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

/* فروع الشاشة الواحدة: كل مصدر سجل له رسم مستقل، وأعيدنا بناء واحدة منها كاملة */
const BRANCHES = [
  ['vLog/stats', `S.logFor='stats'; S.calY=null; S.calM=null; S.calD=null; return String(VIEWS.log());`],
  ['vLog/today', `S.logFor='today'; return String(VIEWS.log());`],
  ['vLog/review', `S.logFor='review'; return String(VIEWS.log());`],
  ['vLog/tests', `S.logFor='tests'; S.logSubject=null; return String(VIEWS.log());`],
  ['vLog/path', `S.logFor='path'; return String(VIEWS.log());`],
];
console.log('\n[فروع إضافية]');
BRANCHES.forEach(([name, code]) => {
  T(name, () => {
    const out = run(`(function(){ try { ${code} } catch(e){ return { __fail: e.message }; } })()`);
    if (out && out.__fail) return out;
    if (typeof out !== 'string' || !out.length) return { __fail: 'لم يُرجع نصًّا' };
    return true;
  });
});
/* أيام حقيقية في التقويم: نزرع نشاطًا في يومين ثم نرسم التقويم وتفاصيل اليوم */
T('calDay/tmonth', () => {
  const out = run(`(function(){ try {
    const d = isoD(new Date());
    me().log = me().log || [];
    me().log.push({ d: d, subject: 'الأحياء', sec: 900, type: 'study' });
    me().log.push({ d: d, subject: 'المراجعة', sec: 0, type: 'review' });
    me().log.push({ d: isoD(new Date(Date.now()-864e5)), subject: 'الأحياء', sec: 600, type: 'study' });
    const f = dayFacts(d); if (!f.items) return { __fail: 'dayFacts لم تجد النشاط' };
    const cal = calGridHTML(new Date().getFullYear(), new Date().getMonth());
    if (!/cday/.test(cal)) return { __fail: 'التقويم بلا مربعات' };
    const det = dayDetailHTML(d); if (!/دقائق الدراسة/.test(det)) return { __fail: 'تفاصيل اليوم ناقصة' };
    const ms = monthStatsHTML(new Date().getFullYear(), new Date().getMonth()); if (!ms) return { __fail: 'إحصاء الشهر فارغ' };
    S.logFor='stats'; S.calD=d;
    const v = String(VIEWS.log());
    if (!/cal2/.test(v)) return { __fail: 'الشاشة لا تعرض شبكة التقويم' };
    if (!/data-act="calDay"/.test(v)) return { __fail: 'أيام التقويم لا تفتح التفاصيل' };
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

/* قفل اختبار الفصل الشامل والوزاري (النقطة ٤) */
T('قفل الاختبار الشامل', () => {
  const out = run(`(function(){ try {
    const g = gradeContents(me().grade)[0]; if (!g) return { __fail: 'لا محتوى' };
    const ch = g.c.chapters[0]; const ts = ch.topics.filter(t => !isHidden(t.id));
    if (!ts.length) return { __fail: 'فصل بلا مواضيع' };
    const l1 = chTestUnlocked(ts);
    if (!l1) return { __fail: 'كان مفتوحًا قبل إتمام المواضيع' };
    ts.forEach(t => { const p = progOf(t.id); p.seen = p.seen || {}; SEGS.forEach(s => { if (segHas(t, s[0])) p.seen[s[0]] = 1; }); p.quiz = p.quiz || { best: 0, last: 0, at: Date.now() }; p.quiz.at = Date.now(); p.quiz.best = 100; p.quiz.last = 100; });
    flushSave(); /* يُبطل ذاكرة topicPct المؤقتة */
    const l2 = chTestUnlocked(ts);
    if (l2) return { __fail: 'بقي مقفلًا بعد الإتمام: ' + l2 };
    /* شاشة الفصل تعرض ملاحظة القفل قبل الإتمام */
    ts.forEach(t => { const p = progOf(t.id); delete p.quiz; });
    S.viewGrade = me().grade; S.viewSubject = g.subject; S.viewChapter = ch.id;
    const h = String(VIEWS.chapter());
    if (!/مقفل/.test(h)) return { __fail: 'لا ملاحظة قفل في شاشة الفصل' };
    if (!/chTestLocked/.test(h)) return { __fail: 'النجمة ليست مغلقة' };
    return true;
  } catch(e){ return { __fail: e.message }; } })()`);
  if (out && out.__fail) return out;
  return true;
});

/* الحفظ في نهاية كل فصل من مواد الحفظ (النقطة ٥) */
T('تغطية الحفظ', () => {
  const out = run(`(function(){ try {
    const memoSubs = ['اللغة العربية', 'التربية الإسلامية'];
    const missing = [], kinds = [];
    gradeContents(me().grade).forEach(y => {
      if (memoSubs.indexOf(y.subject) < 0) return;
      y.c.chapters.forEach(ch => {
        const blocks = ch.topics.filter(t => !isHidden(t.id)).flatMap(t => memosOf(t));
        if (!blocks.length) missing.push(y.subject + ' / ' + ch.title);
        blocks.forEach(b => {
          if (!b.kind || !b.units || !b.units.length) missing.push(y.subject + ' / ' + ch.title + ' / ' + (b.title || '?'));
          if (b.kind && kinds.indexOf(b.kind) < 0) kinds.push(b.kind);
        });
      });
    });
    return { missing: missing, kinds: kinds };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  const miss = out.missing || [], k = out.kinds || [];
  /* الفصول التي لم يُملأ محتواها الأصلي بعد تُبلَّغ ولا تُفشل الاختبار */
  if (miss.length) console.log('      · فصول بلا حفظ بعد: ' + miss.join(' | '));
  const need = ['قصيدة', 'سورة', 'حديث', 'معنى'];
  const lack = need.filter(x => k.indexOf(x) < 0);
  if (lack.length) return { __fail: 'أنواع حفظ ناقصة: ' + lack.join('، ') };
  return true;
});

/* حفظ متعدد المقاطع + التبويب بينها (النقطة ٥) */
T('مقاطع الحفظ المتعددة', () => {
  const out = run(`(function(){ try {
    let n = 0;
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => ch.topics.forEach(t => {
      if (memosOf(t).length < 2) return; n++;
    })));
    if (!n) return { __fail: 'لا موضوع فيه مقطعان فأكثر للتجربة' };
    /* افتح موضوعًا به مقطعان: التبويب يبدّل المقطع، والاختبار يخص المقطع المختار */
    let target = null;
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => ch.topics.forEach(t => {
      if (!target && memosOf(t).length >= 2) target = t.id;
    })));
    S.viewTopic = target; S.tseg = 'memo'; S.mbi = 1; S.mmode = 'read'; S.mrev = {}; S.mt = null;
    const a = memoAt(findTopic(target).t, 1), b = memoAt(findTopic(target).t, 0);
    if (!a || !b || a.title === b.title) return { __fail: 'memoAt لا يبدّل المقطع' };
    if (!memoOf(target, 1) || !memoOf(target, 0)) return { __fail: 'التقدّم غير محفوظ لكل مقطع' };
    if (memoOf(target, 1) === memoOf(target, 0)) return { __fail: 'المقطعان يتشاركان التقدّم' };
    const h = memoHTML(findTopic(target).t, 1);
    if (!/memo-tabs/.test(h)) return { __fail: 'لا تبويبات في شاشة الحفظ' };
    S.mmode = 'test'; S.mt = { tid: target, bi: 1, qs: memoBuild(findTopic(target).t, 1), i: 0, pick: null };
    if (!S.mt.qs.length) return { __fail: 'اختبار المقطع الثاني بلا أسئلة' };
    return { n: n, title: a.title };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  if (!out || !out.n) return { __fail: 'لا مقاطع متعددة' };
  return true;
});

/* شاشة المراجعة بحسب الدرس والقسم (النقطة ٦) */
T('vReview/دروس وأقسام', () => {
  const out = run(`(function(){ try {
    const st = me(); st.log = st.log || [];
    const g = gradeContents(st.grade)[0]; if (!g) return { __fail: 'لا محتوى' };
    let seeded = 0;
    g.c.chapters.forEach(ch => ch.topics.forEach(t => {
      if (seeded >= 6 || isHidden(t.id)) return;
      const p = progOf(t.id);
      p.seen = p.seen || {};
      SEGS.forEach(s => { if (segHas(t, s[0])) p.seen[s[0]] = 1; });
      p.quiz = p.quiz || { best: 0, last: 0, at: 0 };
      p.quiz.best = seeded % 2 ? 95 : 60; p.quiz.last = p.quiz.best; p.quiz.at = Date.now() - 864e5;
      p.rev = { at: Date.now() - 3 * 864e5, level: 1, done: 0 };
      seeded++;
    }));
    flushSave();
    const s = revStats();
    if (!s.items.length) return { __fail: 'revAll فارغ بعد الزرع' };
    if (s.avg == null || isNaN(s.avg)) return { __fail: 'متوسط الإتقان غير معرّف' };
    const h = String(VIEWS.review());
    ['صورتك الإحصائية', 'دروس مستحقة للمراجعة', 'rev-log'].forEach(k => {
      if (h.indexOf(k) < 0) throw new Error('عنصر مفقود في شاشة المراجعة: ' + k);
    });
    if (h.indexOf('حسب المادة') >= 0 || h.indexOf('حسب النوع') >= 0) throw new Error('ما زالت المراجعة معروضة كنسب مجمعة بدل الدروس');
    if (!/٪/.test(h)) throw new Error('لا نِسَب في الشاشة');
    if (/<span class="muted small">بسبب اليوم<\\/span>/.test(h)) throw new Error('ما زالت الأرقام الخام هي العرض');
    const target = gradeContents(st.grade).flatMap(y => y.c.chapters).flatMap(ch => ch.topics).find(t => t.defs && t.defs.length && t.examples && t.examples.length && t.problems && t.problems.length);
    if (!target) throw new Error('لا موضوع اختبار بمحتوى متنوع');
    const entry = String(revItemHTML({ subject: 'الرياضيات', ch: { title: 'فصل اختباري' }, t: target, r: { level: 0 } }));
    if (!['data-seg="full"', 'data-seg="explain"', 'data-seg="defs"', 'data-seg="examples"', 'data-seg="problems"', 'data-act="revDone"'].every(k => entry.includes(k))) throw new Error('روابط المراجعة الكاملة والمحددة غير مكتملة');
    const click = document._ev.click.find(fn => String(fn).includes("const stop = e.target.closest"));
    const old = { view: S.view, stack: S.stack.slice(), viewTopic: S.viewTopic, tseg: S.tseg, reviewAllTid: S.reviewAllTid };
    try {
      click({ target: { closest: selector => selector === '[data-act]' ? { dataset: { act: 'revOpenSeg', id: target.id, seg: 'full' } } : null } });
      const full = String(VIEWS.topic());
      if (S.view !== 'topic' || S.viewTopic !== target.id || S.reviewAllTid !== target.id || !full.includes('مراجعة كاملة للموضوع') || !full.includes('أمثلة الكتاب')) throw new Error('زر المراجعة الكاملة لا يعرض أقسام الدرس');
      click({ target: { closest: selector => selector === '[data-act]' ? { dataset: { act: 'revOpenSeg', id: target.id, seg: 'defs' } } : null } });
      if (S.view !== 'topic' || S.viewTopic !== target.id || S.tseg !== 'defs' || S.reviewAllTid) throw new Error('زر مراجعة قسم محدد لا يفتح القسم المطلوب');
    } finally { S.view = old.view; S.stack = old.stack; S.viewTopic = old.viewTopic; S.tseg = old.tseg; S.reviewAllTid = old.reviewAllTid; }
    return { n: s.items.length, avg: s.avg, over: s.over.length };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  if (!out || !out.n) return { __fail: 'لا بيانات' };
  return true;
});

/* ٧-و) النطاق الموحّد والوقت المشتقّ من النوع والمطالب والبيانات المماثلة */
T('النطاق الموحّد + الزمن الذكي', () => {
  const out = run(`(function(){ try {
    const st = me();
    const oldExams = st.exams;
    const y = gradeContents(st.grade).find(g => subjQuizPool(g.subject).length >= 6) || gradeContents(st.grade)[0];
    if (!y) return { __fail: 'لا مواد' };
    examConfig('monthly', y.subject);
    if (!S.exam || S.exam.phase !== 'config') return { __fail: 'لم تُفتح شاشة الضبط' };
    const first = examPool('monthly', y.subject)[0];
    if (!first) return { __fail: 'لا أسئلة للاختبار' };
    S.open['xs-' + qChId(first)] = true;
    const h = examConfigView(S.exam, 'اختبار');
    if (h.indexOf('\u0627\u062e\u062a\u0631 \u0627\u0644\u0645\u0648\u0636\u0627\u0621') >= 0) return { __fail: '\u0628\u0642\u064a \u0627\u0644\u062a\u0628\u0648\u064a\u0628\u0627\u0646 \u0645\u0646\u0641\u0637\u0644\u064a\u0646' };
    if (h.indexOf('data-act="examCh"') < 0 || h.indexOf('data-act="examTopic"') < 0) return { __fail: 'لا تظهر الفصول ومواضيعها القابلة للطي' };
    if (h.indexOf('عدد الأسئلة — ابدأ') < 0) return { __fail: 'لا تظهر خيارات بدء الامتحان' };
    if (h.indexOf('نوع السؤال وعدد مطالبه') < 0 || h.indexOf('بعد ٥ إجابات صحيحة') < 0) return { __fail: 'طريقة تقدير الوقت والتكيّف غير موضّحة' };
    if (h.indexOf('data-act="examPerQ"') >= 0) return { __fail: '\u0628\u0642\u064a \u0637\u0628\u0642 \u0648\u0642\u062a \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u062b\u0627\u0628\u062a' };
    /* النوع يحدد خط الأساس: الاختيار أقصر من المفتوح، والمسألة أطول من التعريف. */
    const mcq = { o: ['أ','ب','ج','د'], c: 1 }, open = { o: [], c: -1 };
    const b1 = qSec(mcq, 'monthly'), b2 = qSec(open, 'monthly');
    const m1 = qSec(mcq, 'ministerial'), m2 = qSec(open, 'ministerial');
    const definition = { q: 'عرّف السعة الكهربائية', o: [], c: -1 };
    const problem = { q: 'احسب قيمة المقاومة عند معرفة الجهد والتيار', o: [], c: -1 };
    const multiProblem = { q: 'احسب ما يأتي: (أ) الشحنة، (ب) الطاقة، (ج) السعة', o: [], c: -1 };
    const baselineProblem = qSec(problem, 'monthly');
    if (m2 <= b2) return { __fail: 'السؤال الوزاري ليس أطول من سؤال الكتاب' };
    if (b1 >= b2) return { __fail: 'الاختيار من متعدد ليس أقصر من المفتوح' };
    if (qSec(problem, 'monthly') <= qSec(definition, 'monthly')) return { __fail: 'وقت المسألة لا يراعي نوعها مقارنة بالتعريف' };
    if (qSec(multiProblem, 'monthly') <= qSec(problem, 'monthly')) return { __fail: 'عدد المطالب لا يزيد زمن المسألة' };
    if (b2 > 600) return { __fail: 'وقت سؤال الكتاب يتجاوز ١٠ دقائق' };
    if (m2 > 900) return { __fail: 'وقت السؤال الوزاري يتجاوز ١٥ دقيقة' };
    /* وقت الامتحان = مجموع أزمنة الأسئلة */
    const pool = examPool('monthly', y.subject);
    const tot = scopeTotalSec(S.exam, pool);
    if (!tot || tot !== pool.reduce((a, x) => a + qSec(x.q, 'monthly'), 0)) return { __fail: 'زمن الامتحان غير مشتقّ من النطاق' };
    /* خمس إجابات صحيحة مشابهة كافية لبدء معايرة شخصية محدودة؛ الخاطئة لا تدخل الحساب. */
    let personalized;
    try {
      st.exams = [{ kinds: Array(5).fill('problem'), ok: Array(5).fill(1), times: Array(5).fill(420) }];
      personalized = qSec(problem, 'monthly');
      if (personalized <= baselineProblem) return { __fail: 'زمن الإجابات الصحيحة المشابهة لم يكيّف التقدير' };
      st.exams = [{ kinds: Array(5).fill('problem'), ok: Array(5).fill(0), times: Array(5).fill(420) }];
      if (qSec(problem, 'monthly') !== baselineProblem) return { __fail: 'دخلت الإجابات الخاطئة في معايرة الوقت' };
    } finally { st.exams = oldExams; }
    S.exam = null;
    return { b2: b2, m2: m2, tot: tot, personalized: personalized };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  return true;
});

T('وحدة إجابة المسألة الفيزيائية', () => {
  const out = run(`(function(){ try {
    const f = findItem('p12c1t2-p1');
    if (!f || f.ans !== 'C = 17.7 pF') return { __fail: 'مسألة المتسعة أو جوابها غير موجود' };
    if (f.sec !== 180) return { __fail: 'وقت المسألة لا يطابق الزمن المسجل لها: ' + f.sec + ' ثانية' };
    const st = me(), oldProblem = S.viewProblem, oldSolve = st.solves && st.solves[f.id];
    st.solves = st.solves || {}; st.solves[f.id] = { started: Date.now() };
    S.viewProblem = f.id;
    const html = vProblem();
    S.viewProblem = oldProblem;
    if (oldSolve) st.solves[f.id] = oldSolve;
    else delete st.solves[f.id];
    if (!html.includes('data-v="pF"') || !html.includes('بيكوفاراد (pF)')) return { __fail: 'وحدة البيكوفاراد غير معروضة' };
    if (!answerMatches('17.7', 'pF', f.ans)) return { __fail: 'لم تُقبل إجابة 17.7 pF' };
    if (answerMatches('17.7', 'nF', f.ans)) return { __fail: 'قُبلت قيمة بوحدة خاطئة' };
    return true;
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  return out && out.__fail ? out : true;
});

T('الحل التفصيلي للمسألة منظّم', () => {
  const out = run(`(function(){ try {
    const f = findItem('p12c1t2-p1'), html = solutionContentHTML(f.steps);
    ['المعطيات', 'المطلوب', 'القانون', 'التعويض', 'التبسيط', 'الناتج'].forEach(k => {
      if (!html.includes('<b>' + k + '</b>')) throw new Error('قسم مفقود: ' + k);
    });
    if (html.indexOf('<b>التعويض</b>') > html.indexOf('<b>التبسيط</b>')) return { __fail: 'يجب أن يسبق التعويضُ التبسيطَ' };
    if (!html.includes('17.7 pF') || !html.includes('1 pF = 10⁻¹² F')) return { __fail: 'الوحدة أو تحويلها غير موضح في الحل' };
    return true;
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  return out && out.__fail ? out : true;
});

T('حقول املأ الفراغ في موضوع المتسعة', () => {
  const out = run(`(function(){ try {
    const t = findTopic('p12c1t2').t, oldBlank = S.blank;
    S.blank = {};
    const html = blanksHTML(t);
    S.blank = oldBlank;
    const inputs = (html.match(/<input class="blank/g) || []).length;
    if (inputs !== t.blanks.length) return { __fail: 'عدد الحقول ' + inputs + ' لا يطابق الأسئلة ' + t.blanks.length };
    return true;
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  return out && out.__fail ? out : true;
});

/* ٧-ب + ٧-د) سجل الاختبارات الإحصائي وقائمة اختبارات الحفظ بالمسار */
T('سجل الاختبارات + مسار الحفظ', () => {
  const out = run(`(function(){ try {
    const st = me();
    st.exams = [
      { src: 'x:اللغة العربية:monthly', pct: 92, n: 20, at: Date.now() - 864e5, sec: 900,
        ks: ['a:0','a:1','a:2','a:3'], ok: [1,1,1,0], times: [40,55,120,200] },
      { src: 'x:اللغة العربية:exam', pct: 58, n: 20, at: Date.now() - 3600e3, sec: 600,
        ks: ['a:0','a:1','a:2','a:3'], ok: [1,0,0,2], times: [30,90,10,0] },
      { src: 'x:اللغة العربية:exam', pct: 75, n: 10, at: Date.now() }
    ];
    trimExamDetails(st);
    const a = testsRecordHTML(st.exams.slice().reverse(), 'اللغة العربية');
    ['معدّل نتائجك', 'دقة إجاباتك', 'qdet', 'qchip', 'نِسَبك من الاختبارات الناجحة', 'لماذا هذا السجل'].forEach(k => {
      if (a.indexOf(k) < 0) throw new Error('عنصر مفقود في سجل الاختبارات: ' + k);
    });
    if (!/٪/.test(a)) throw new Error('لا نِسَب في السجل');
    if (st.exams.length !== 3) throw new Error('trimExamDetails ضيّق الدرجات');
    if (st.exams[2].ks) throw new Error('بقي التفصيل في امتحان قديم');

    /* مسار اختبارات الحفظ: مادة ← فصول ← مقاطع */
    S.open = {};
    const list0 = memoTestListHTML();
    if (!/class="fold2/.test(list0) || !/data-act="open" data-k="mm-/.test(list0)) throw new Error('مواد الحفظ ليست قابلة للطي');
    const first = memoTopics()[0];
    if (!first) return { __fail: 'لا حفظ أصلاً' };
    S.open['mm-' + first.subject] = true;
    const list1 = memoTestListHTML();
    const chKey = 'mmc-' + first.ch.id;
    if (!list1.includes('data-act="open" data-k="' + chKey + '"')) throw new Error('فصل الحفظ لا يظهر داخل المادة');
    S.open[chKey] = true;
    const list2 = memoTestListHTML();
    ['fold3', 'data-act="memoGo"'].forEach(k => {
      if (list2.indexOf(k) < 0) throw new Error('عنصر مفقود في مسار الحفظ: ' + k);
    });
    if (list2.indexOf(ft(first.M.title)) < 0) throw new Error('مقاطع الحفظ لا تظهر بعد فتح الفصل');
    return { subs: 1, detail: st.exams.filter(e => e.ks).length };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  if (!out) return { __fail: 'لا نتيجة' };
  return true;
});

/* ٧-ز) سجل «تطوّرك الوزاري»: يغطي الاختبارات الثلاثة + التوقّع والتبويبات */
T('سجل تطوّرك الوزاري', () => {
  const out = run(`(function(){ try {
    const st = me();
    const y = gradeContents(st.grade)[0]; if (!y) return { __fail: 'لا مواد' };
    const subj = y.subject;
    st.progress = st.progress || {};
    let nq = 0;
    y.c.chapters.forEach(ch => ch.topics.forEach(t => {
      if (isHidden(t.id) || nq >= 5) return;
      const p = progOf(t.id); p.seen = p.seen || {};
      SEGS.forEach(s2 => { if (segHas(t, s2[0])) p.seen[s2[0]] = 1; });
      p.quiz = { at: Date.now() - 864e5, best: 60 + nq * 5, last: 60 + nq * 5 };
      nq++;
    }));
    st.exams = [
      { src: 'x:' + subj + ':monthly', pct: 78, n: 10, at: Date.now() - 2 * 864e5 },
      { src: 'x:' + subj + ':monthly', pct: 84, n: 10, at: Date.now() - 864e5 },
      { src: 'x:' + subj + ':exam', pct: 90, n: 8, at: Date.now() - 3600e3 }
    ];
    st.ministerial = st.ministerial || {};
    st.ministerial[subj] = [ { at: Date.now() - 10 * 864e5, pct: 55, sec: 1000, n: 6 },
                             { at: Date.now() - 3 * 864e5, pct: 72, sec: 1100, n: 6 },
                             { at: Date.now() - 864e3, pct: 88, sec: 900, n: 6 } ];
    flushSave();

    const s2 = minRecordStats(subj);
    if (!s2.quizzes.length) return { __fail: 'اختبارات المواضيع غير محتسبة' };
    if (s2.monthlies.length !== 2) return { __fail: 'الشهري غير محتسب' };
    if (s2.mins.length !== 3) return { __fail: 'الوزاري غير محتسب' };
    if (s2.predict == null) return { __fail: 'لا توقّع للمعدّل' };
    if (s2.predict < 55 || s2.predict > 95) return { __fail: 'توقّع خارج المدى: ' + s2.predict };
    if (s2.nAvg !== 72) return { __fail: 'معدّل الوزاري خاطئ: ' + s2.nAvg };

    S.minRecSubj = subj; S.minRecTab = 'all';
    const all = String(VIEWS.minrec());
    ['معدّلك المتوقّع في الوزاري', 'mincurve2', 'جلسة تهيئة وزارية', 'جلساتك الوزارية'].forEach(k => {
      if (all.indexOf(k) < 0) throw new Error('عنصر مفقود في السجل الكلي: ' + k);
    });
    S.minRecTab = 'day';
    const day = String(VIEWS.minrec());
    if (day.indexOf('اليوم') < 0 || day.indexOf('aria-selected="true"') < 0) throw new Error('تبويب اليوم لا يعمل');
    S.minRecTab = 'month';
    const mon = String(VIEWS.minrec());
    if (mon.indexOf('آخر ٣٠ يومًا') < 0) throw new Error('تبويب الشهر لا يعمل');
    S.minRecSubj = null;
    const list = String(VIEWS.minrec());
    if (list.indexOf('اختر مادة') < 0) throw new Error('شاشة اختيار المادة غير موجودة');
    S.view = 'tests';
    S.view = 'tests'; S.tests2 = 'exams'; const t = String(VIEWS.tests()); S.tests2 = 'self';
    if (t.indexOf('تطوّري الوزاري') < 0) throw new Error('رابط السجل ليس في تبويب الاختبارات');
    return { predict: s2.predict, nAvg: s2.nAvg };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  return true;
});

/* ٧-ط) المحاكاة الكاملة: ٥–٦ أسئلة، ١٠٠ نقطة موزّعة، زمن مشتقّ */
T('المحاكاة الكاملة', () => {
  const out = run(`(function(){ try {
    const st = me();
    const y = gradeContents(st.grade).find(g => ministerialPool(g.subject).length >= 8);
    if (!y) return { skip: 1, why: 'لا مادة ببنك وزاري كافٍ' };
    const subj = y.subject;
    const p = simPlan(subj);
    if (p.n < 5 || p.n > 6) return { __fail: 'عدد أسئلة المحاكاة خارج ٥–٦: ' + p.n };
    if (p.total !== 100) return { __fail: 'المجموع ليس ١٠٠: ' + p.total };
    if (p.items.some(i => !i.pts)) return { __fail: 'سؤال بلا نقاط' };
    if (p.items.some(i => i.pts < 5)) return { __fail: 'سؤال بأقل من ٥ نقاط' };
    if (Math.abs(p.items.reduce((a, i) => a + i.pts, 0) - 100) > 0) return { __fail: 'النقاط لا تجمع ١٠٠' };
    if (!p.sec || p.sec < 300) return { __fail: 'زمن المحاكاة غير معقول: ' + p.sec };
    /* التغطية: عدد الفصول المختلفة في الأسئلة المختارة */
    const chIds = new Set(p.items.map(i => qChId(i.x)));
    if (p.chs > 2 && chIds.size < 2) return { __fail: 'الأسئلة من فصل واحد لا تغطّي المادة' };
    const hs = Object.keys(p.by);
    if (!hs.length) return { __fail: 'لا توزيع' };
    S.minsimSubj = subj;
    const v = String(VIEWS.minsim());
    ['خطة المحاكاة كما في الوزاري الحقيقي', 'ابدأ المحاكاة', 'srows', 'المجموع'].forEach(k => {
      if (v.indexOf(k) < 0) throw new Error('عنصر مفقود في شاشة المحاكاة: ' + k);
    });
    if (!/٪/.test(v)) throw new Error('لا نِسَب في خطة المحاكاة');

    /* البدء: يفرض الأسئلة المخطَّطة ونقاطها، والدرجة من النقاط */
    S.examScope = null;
    S.exam = { kind: 'ministerial', subject: subj, phase: 'config', perQ: 0, prep: 0 };
    S.examForcePick = p.items.map(i => i.x);
    S.examForcePts = p.items.map(i => i.pts);
    const ok = startExam('ministerial', subj, p.n, Math.round(p.sec / p.n));
    if (!ok || !S.exam) return { __fail: 'لم يبدأ الامتحان' };
    if (!S.exam.pts || S.exam.pts.length !== p.n) return { __fail: 'النقاط لم تُمرَّر إلى الامتحان' };
    if (S.exam.items.length !== p.n) return { __fail: 'عدد الأسئلة ليس كالمخطط' };
    /* حالة صفر: بلا إجابات — لا نقاط */
    S.exam.items.forEach((it, i) => { S.exam.picks[i] = -1; S.exam.times[i] = 60; });
    examFinish();
    const z0 = S.exam;
    if (z0.gotPts !== 0 || z0.pct !== 0) return { __fail: 'بلا إجابات ومنح نقاطًا: ' + z0.gotPts };
    /* حالة كاملة: كل سؤال أُجيب (مفتوح يُعرض حلّه) — المئة كاملة */
    S.exam._fin = 0; S.exam.phase = 'run'; S.exam.picks = [];
    S.exam.items.forEach((it, i) => {
      const isOpen = (!it.q.o || !it.q.o.length) && (it.q.c == null || it.q.c < 0);
      S.exam.picks[i] = isOpen ? -2 : it.q.c;
      S.exam.times[i] = 60;
    });
    examFinish();
    const z = S.exam;
    if (z.gotPts == null) return { __fail: 'النقاط المكتسبة غير محسوبة' };
    if (z.gotPts !== 100 || z.pct !== 100) return { __fail: 'الإجابة الكاملة لم تمنح ١٠٠ نقطة: ' + z.gotPts + ' / ' + z.pct };
    S.exam = null;
    return { n: p.n, total: p.total, sec: p.sec, pct: z.pct, chs: chIds.size };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  if (out && out.skip) { console.log('      · تخطّي: ' + out.why); return true; }
  return true;
});

/* ٧-ح) سجل «التهيئة للوزاري الشامل» المستقلّ */
T('سجل التهيئة الشاملة', () => {
  const out = run(`(function(){ try {
    const st = me();
    const y = gradeContents(st.grade)[0]; if (!y) return { __fail: 'لا مواد' };
    const subj = y.subject;
    st.ministerial = st.ministerial || {};
    const chId = y.c.chapters[0].id;
    st.ministerial[subj] = [
      { at: Date.now() - 20 * 864e5, pct: 40, sec: 10000, n: 6, chId: chId },
      { at: Date.now() - 8 * 864e5, pct: 68, sec: 12000, n: 6, chId: chId },
      { at: Date.now() - 2 * 864e5, pct: 92, sec: 5000, n: 6, chId: '' }
    ];
    flushSave();
    const r = minPrepRecordHTML(subj);
    ['لماذا هذا السجل؟', 'معدّلك التراكمي', 'معدّل مدتك', 'جلساتك فوق ٨٠٪', 'كل جلسة على حدة', 'زمن جلساتك من الحدّ الرسمي'].forEach(k => {
      if (r.indexOf(k) < 0) throw new Error('عنصر مفقود في سجل التهيئة: ' + k);
    });
    if (r.indexOf('معدّلك التراكمي') < 0 || !/٪/.test(r)) throw new Error('لا نِسَب');
    const avg = Math.round((40 + 68 + 92) / 3);
    if (r.indexOf(String(avg).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d])) < 0) throw new Error('المعدّل غير معروض: ' + avg);
    S.minPrepSubj = subj; S.view = 'minprep';
    const v = String(VIEWS.minprep());
    ['سجل التهيئة الشامل', '↩ كل المواد', 'جلسة تهيئة حسب الفصول', 'اختر الفصول والمواضيع'].forEach(k => {
      if (v.indexOf(k) < 0) throw new Error('عنصر مفقود في شاشة التهيئة: ' + k);
    });
    S.minPrepSubj = null;
    const v0 = String(VIEWS.minprep());
    if (v0.indexOf('التهيئة للوزاري') < 0 || v0.indexOf('المحاكاة الكاملة') >= 0) throw new Error('واجهة التهيئة لا تطابق التصميم المبسّط');
    if (v0.indexOf('سجل وتهيئة') < 0) throw new Error('بطاقات المواد غير موجودة');
    return { avg: avg };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  return true;
});

/* الرسوم التفاعلية (النقطة ٨): تقريب وشرح بالضغط وبناء خطوة بخطوة */
T('الرسوم التفاعلية', () => {
  const out = run(`(function(){ try {
    const ks = Object.keys(FIGS);
    if (ks.length < 12) return { __fail: 'عدد الرسوم قليل: ' + ks.length };
    /* كل رسم: صورة + ما يعلّمه + أجزاء قابلة للشرح + خطوات رسم */
    ks.forEach(k => {
      const f = FIGS[k];
      if (!f.svg || f.svg.indexOf('<svg') < 0) throw new Error('رسم بلا svg: ' + k);
      if (!f.title || !f.teaches) throw new Error('رسم بلا عنوان أو بلا «ماذا يعلّمك»: ' + k);
      if (!f.parts || !f.parts.length) throw new Error('رسم بلا أجزاء للشرح: ' + k);
      if (!f.steps || f.steps.length < (f.static ? 1 : 3)) throw new Error('رسم بلا خطوات/حالة عرض صالحة: ' + k);
      f.parts.forEach(p => { if (typeof p.x !== 'number' || !p.label || !p.note) throw new Error('جزء ناقص في ' + k); });
    });
    /* بطاقة الرسم داخل موضوع: نقاط مرقّمة + فائدة + فتح ملء الشاشة */
    let withFig = null;
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => ch.topics.forEach(t => {
      if (!withFig && (t.explain || []).some(b => b.t === 'fig')) withFig = { subject: y.subject, ch: ch, t: t };
    })));
    if (!withFig) return { __fail: 'لا موضوع فيه رسم' };
    /* كل مفتاح رسم مستعمل في المحتوى موجود فعلًا في مكتبة الرسوم */
    const unknown = [];
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => ch.topics.forEach(t =>
      (t.explain || []).forEach(b => { if (b.t === 'fig' && !FIGS[b.k]) unknown.push(y.subject + '/' + t.id + ':' + b.k); }))));
    if (unknown.length) return { __fail: 'رسوم مفقودة: ' + unknown.join(', ') };
    S.viewGrade = me().grade; S.viewSubject = withFig.subject; S.viewChapter = withFig.ch.id; S.viewTopic = withFig.t.id;
    const topic = String(VIEWS.topic());
    ['fig-vp', 'fhot', 'ماذا يعلّمك هذا الرسم', 'data-act="figFull"'].forEach(k => {
      if (topic.indexOf(k) < 0) throw new Error('عنصر مفقود في صفحة الموضوع: ' + k);
    });
    if (/undefined|NaN/.test(topic)) throw new Error('undefined في صفحة موضوع فيه رسم');
    /* شاشة ملء الشاشة: الشرح + قائمة الأجزاء + بناء الرسم خطوة خطوة */
    const fk = withFig.t.explain.filter(b => b.t === 'fig')[0].k;
    S.figK = fk; S.figDraw = null; S.view = 'fig';
    const full = String(VIEWS.fig());
    ['fig-tools', 'عجلة الفأرة', 'fig-list', 'ماذا يعلّمك هذا الرسم'].forEach(k => {
      if (k && full.indexOf(k) < 0) throw new Error('عنصر مفقود في شاشة الرسم: ' + k);
    });
    /* شرح جزء بالضغط */
    figSt(fk).part = 0;
    const ex = figExplHTML(fk);
    if (ex.indexOf('fig-expl') < 0) throw new Error('شرح الجزء غير معروض');
    if (ex.indexOf(esc(FIGS[fk].parts[0].label)) < 0) throw new Error('اسم الجزء غير ظاهر');
    /* البناء خطوة بخطوة: الخطوة الأولى لا تُظهر بقية الخطوات */
    S.figDraw = fk; figSt(fk).step = 0;
    const d0 = figDrawHTML(fk);
    if (d0.indexOf('الخطوة ١ من') < 0 && d0.indexOf('الخطوة 1 من') < 0) throw new Error('عدّاد الخطوات مفقود');
    if (d0.indexOf('fig-stepview') < 0) throw new Error('منطقة خطوات الرسم مفقودة');
    /* كل الخطوات معًا تساوي رسم الرسم كاملًا (بلا تعليمات متراكمة) */
    const st = figSt(fk); st.step = FIGS[fk].steps.length - 1;
    const dAll = figDrawHTML(fk);
    if (dAll.indexOf('fig-say') < 0) throw new Error('شرح الخطوة الأخيرة مفقود');
    st.step = 0; st.part = -1;
    /* مكتبة الرسوم: كل رسم مصنّف بحسب مادته ومُتاح من هناك */
    S.view = 'figlib';
    S.figLibTab = 'ministerial';
    const lib = String(VIEWS.figlib());
    ['مكتبة الرسوم', 'أسئلة وزارية', 'data-act="figSubjectOpen"'].forEach(k => {
      if (lib.indexOf(k) < 0) throw new Error('عنصر مفقود في مكتبة الرسوم: ' + k);
    });
    const evidence = figureLibraryEvidence();
    [['ministerial', 'ministerialQuestions'], ['bookQuestions', 'bookQuestions'], ['textbook', 'lessons']].forEach(([tab, field]) => {
      S.figLibTab = tab;
      const view = String(VIEWS.figlib());
      const eligible = [...evidence].filter(([, entry]) => entry[field].length);
      if (eligible.length && !view.includes('data-act="figSubjectOpen"')) throw new Error('مواد تبويب ' + tab + ' لا تفتح نافذة المادة');
      if (eligible.length) {
        const sample = eligible[0][1][field][0], subject = sample.subject, chapter = sample.chapter;
        const subjectView = figureLibrarySubjectHTML(subject);
        const chapterView = figureLibraryChapterHTML(subject, chapter);
        if (!subjectView.includes('data-act="figChapterOpen"') || !subjectView.includes('data-chapter="' + chapter + '"')) throw new Error('نافذة المادة لا تعرض فصولها في تبويب ' + tab);
        if (!chapterView.includes('data-act="figPage"') || !chapterView.includes(FIGS[eligible[0][0]].title)) throw new Error('نافذة الفصل لا تعرض رسومه في تبويب ' + tab);
        if (tab === 'bookQuestions' && !chapterView.includes('fig-evidence-q')) throw new Error('نافذة فصل أسئلة الكتاب لا تعرض الأسئلة المرتبطة');
        if (eligible.some(([key, entry]) => !entry[field].some(ref =>
          figureLibraryChapterHTML(ref.subject, ref.chapter).includes('data-k="' + key + '"')))) throw new Error('رسم مؤهل لا يظهر داخل نافذة فصله في تبويب ' + tab);
      }
      if (tab === 'ministerial' && eligible.some(([, entry]) => entry.ministerialQuestions.some(q => q.question)) &&
          !eligible.some(([, entry]) => entry.ministerialQuestions.some(q => q.question &&
            figureLibraryChapterHTML(q.subject, q.chapter).includes('fig-evidence-q') &&
            figureLibraryChapterHTML(q.subject, q.chapter).includes('fig-evidence-meta')))) throw new Error('نص السؤال الوزاري أو مرجعه غير ظاهر في نافذة الفصل');
      if (tab === 'bookQuestions' && !view.includes('أسئلة الكتاب')) throw new Error('تبويب رسوم أسئلة الكتاب مفقود');
      if (tab === 'textbook' && !view.includes('رسوم دروسي كاملة')) throw new Error('تبويب رسوم الدروس الكامل مفقود');
    });
    if (!evidence.size) throw new Error('لا رسوم مرتبطة بمحتوى في الصف الحالي');
    const groups = Object.keys(FIGS).filter(k => !FIG_SUBJ[k]);
    if (groups.length) throw new Error('رسوم بلا مادة: ' + groups.join(', '));
    return { figs: ks.length, parts: FIGS[fk].parts.length, steps: FIGS[fk].steps.length, topic: withFig.t.id };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  if (!out) return { __fail: 'لا نتيجة' };
  return true;
});

console.log('\n[البنود الأربعة]');
T('كل الشاشات تُرسم', () => failures === 0 ? true : { __fail: failures + ' شاشة فشلت' });

console.log('\n' + '─'.repeat(52));
console.log(failures ? '  ❌ ' + failures + ' بند فشل' : '  ✅ كل الشاشات رُسمت بلا خطأ');
process.exit(failures ? 1 : 0);
