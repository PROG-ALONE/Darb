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
    if (!/cal-grid/.test(v)) return { __fail: 'الشاشة لا تعرض شبكة التقويم' };
    if (!/تفاصيل اليوم/.test(v)) return { __fail: 'الشاشة لا تعرض قسم تفاصيل اليوم' };
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

/* شاشة المراجعة الإحصائية (النقطة ٦) */
T('vReview/إحصائي', () => {
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
    ['صورتك الإحصائية', 'حسب المادة', 'حسب النوع', 'srows', 'strack', 'rev-log'].forEach(k => {
      if (h.indexOf(k) < 0) throw new Error('عنصر مفقود في شاشة المراجعة: ' + k);
    });
    if (!/٪/.test(h)) throw new Error('لا نِسَب في الشاشة');
    if (/<span class="muted small">بسبب اليوم<\\/span>/.test(h)) throw new Error('ما زالت الأرقام الخام هي العرض');
    return { n: s.items.length, avg: s.avg, over: s.over.length };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  if (!out || !out.n) return { __fail: 'لا بيانات' };
  return true;
});

/* ٧-و) النطاق الموحّد والزمن المشتقّ من الصعوبة (لا وقت سؤال ثابت) */
T('النطاق الموحّد + الزمن الذكي', () => {
  const out = run(`(function(){ try {
    const st = me();
    const y = gradeContents(st.grade).find(g => subjQuizPool(g.subject).length >= 6) || gradeContents(st.grade)[0];
    if (!y) return { __fail: 'لا مواد' };
    examConfig('monthly', y.subject);
    if (!S.exam || S.exam.phase !== 'config') return { __fail: 'لم تُفتح شاشة الضبط' };
    const h = examConfigView(S.exam, 'اختبار');
    if (h.indexOf('\u0627\u062e\u062a\u0631 \u0627\u0644\u0645\u0648\u0636\u0627\u0621') >= 0) return { __fail: '\u0628\u0642\u064a \u0627\u0644\u062a\u0628\u0648\u064a\u0628\u0627\u0646 \u0645\u0646\u0641\u0637\u0644\u064a\u0646' };
    if (h.indexOf('exam-scope-') < 0) return { __fail: 'لا مواضيع داخل الفصول' };
    if (h.indexOf('\u0632\u0645\u0646 \u0627\u0644\u0627\u0645\u062a\u062d\u0627\u0646') < 0) return { __fail: '\u0644\u0627 \u0642\u0633\u0645 \u0632\u0645\u0646 \u0627\u0644\u0627\u0645\u062a\u062d\u0627\u0646' };
    if (h.indexOf('\u0632\u0645\u0646 \u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0646\u0637\u0627\u0642') < 0) return { __fail: '\u0627\u0644\u0632\u0645\u0646 \u0644\u0627 \u064a\u062d\u0633\u0628 \u0645\u0646 \u0627\u0644\u0646\u0637\u0627\u0642' };
    if (h.indexOf('data-act="examPerQ"') >= 0) return { __fail: '\u0628\u0642\u064a \u0637\u0628\u0642 \u0648\u0642\u062a \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u062b\u0627\u0628\u062a' };
    /* qSec: وزاريه ٥ دقائق وكتاب ٣ دقائق، والاختيار من متعدد أقصر */
    const mcq = { o: ['أ','ب','ج','د'], c: 1 }, open = { o: [], c: -1 };
    const b1 = qSec(mcq, 'monthly'), b2 = qSec(open, 'monthly');
    const m1 = qSec(mcq, 'ministerial'), m2 = qSec(open, 'ministerial');
    if (m2 <= b2) return { __fail: 'السؤال الوزاري ليس أطول من سؤال الكتاب' };
    if (b1 >= b2) return { __fail: 'الاختيار من متعدد ليس أقصر من المفتوح' };
    if (b2 > 600) return { __fail: 'وقت سؤال الكتاب يتجاوز ١٠ دقائق' };
    if (m2 > 900) return { __fail: 'وقت السؤال الوزاري يتجاوز ١٥ دقيقة' };
    /* وقت الامتحان = مجموع أزمنة الأسئلة */
    const pool = examPool('monthly', y.subject);
    const tot = scopeTotalSec(S.exam, pool);
    if (!tot || tot !== pool.reduce((a, x) => a + qSec(x.q, 'monthly'), 0)) return { __fail: 'زمن الامتحان غير مشتقّ من النطاق' };
    /* الزمن الفعلي يُرجّح الأوقات إن وُجد */
    Object.keys(st.solves || {}).forEach(k => { st.solves[k].used = 300; });
    const p = studyPaceSec();
    if (p != null && qSec(open, 'monthly') <= b2 && p > 200) return { __fail: 'زمنك الفعلي لم يُرجّح وقت السؤال' };
    S.exam = null;
    return { pace: p, b2: b2, m2: m2, tot: tot };
  } catch(e){ return { error: e.message }; } })()`);
  if (out && out.error) return { __fail: out.error };
  if (out && out.__fail) return out;
  return true;
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
    S.memoSubj = null; S.acc = {};
    const list0 = memoTestListHTML();
    if (list0.indexOf('كل المواد') >= 0) throw new Error('لا زر رجوع في الشاشة الأولى وهو غير لازم');
    if (!/data-act="memoSubj"/.test(list0)) throw new Error('بطاقات المواد غير موجودة');
    const first = memoTopics()[0];
    if (!first) return { __fail: 'لا حفظ أصلاً' };
    S.memoSubj = first.subject; S.acc = {};
    const list1 = memoTestListHTML();
    ['كل المواد', 'data-act="back"', 'data-act="memoGo"', 'pbar', 'srows'].forEach(k => {
      if (list1.indexOf(k) < 0) throw new Error('عنصر مفقود في مسار الحفظ: ' + k);
    });
    if (list1.indexOf('اختبارات الحفظ | ' + first.subject) < 0) throw new Error('عنوان المادة المختارة غير ظاهر');
    S.memoSubj = null;
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
    ['الوزاري (الأخطر)', 'mincurve', 'المحاكاة الكاملة', 'معدلك المتوقّع', 'جلساتك الوزارية', 'srows'].forEach(k => {
      if (all.indexOf(k) < 0) throw new Error('عنصر مفقود في السجل الكلي: ' + k);
    });
    S.minRecTab = 'day';
    const day = String(VIEWS.minrec());
    if (day.indexOf('التقييم اليومي') < 0 || day.indexOf('aria-pressed="true"') < 0) throw new Error('تبويب اليوم لا يعمل');
    S.minRecTab = 'month';
    const mon = String(VIEWS.minrec());
    if (mon.indexOf('آخر ٣٠ يومًا') < 0) throw new Error('تبويب الشهر لا يعمل');
    S.minRecSubj = null;
    const list = String(VIEWS.minrec());
    if (list.indexOf('سجل وزاري لكل مادة') < 0) throw new Error('شاشة اختيار المادة غير موجودة');
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
    ['سجل التهيئة الشامل', '↩ كل المواد', 'المحاكاة الكاملة', 'جلسة بفصل محدد'].forEach(k => {
      if (v.indexOf(k) < 0) throw new Error('عنصر مفقود في شاشة التهيئة: ' + k);
    });
    S.minPrepSubj = null;
    const v0 = String(VIEWS.minprep());
    if (v0.indexOf('ماذا يفيدك كل زرّ؟') < 0) throw new Error('شرح فائدة الأزرار مفقود');
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
      if (!f.steps || f.steps.length < 3) throw new Error('رسم بأقل من ثلاث خطوات: ' + k);
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
    S.view = 'library';
    const lib = String(VIEWS.library()) + String(typeof figsLibBody === 'function' ? figsLibBody() : '');
    ['الرسوم التفاعلية', 'لماذا هذا القسم', 'fig-grp', 'data-act="figFull"'].forEach(k => {
      if (lib.indexOf(k) < 0) throw new Error('عنصر مفقود في مكتبة الرسوم: ' + k);
    });
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
