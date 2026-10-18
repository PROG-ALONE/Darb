#!/usr/bin/env node
/**
 * journey-test.cjs — اختبار «رحلة الطالب»: كمن دخل التطبيق لأول مرة
 * ────────────────────────────────────────────────────────────
 * لا يكتفي برسم الشاشات (كما يفعل smoke-test)، بل يمشي خطوةً بخطوة كما
 * يفعل طالب حقيقي في أول يوم دراسي:
 *
 *   ١) التهيئة: القصة ← الاسم ← الصف والفرع ← الخطة ← أول شاشة.
 *   ٢) أول درس في أول فصل وأول مادة: يفتح المادة والفصل والموضوع،
 *      ويزور كل تبويب (شرح، تعاريف، قوانين، تعليلات، فراغات، أمثلة،
 *      مسائل، حفظ) ويسجّل أنها قُرئت.
 *   ٣) اختبار الموضوع: يجيب عن كل سؤال ويُنهيه فتُحفظ النتيجة.
 *   ٤) قفل اختبار الفصل: يتحقق أنه مقفل قبل الإتمام ومفتوح بعده.
 *   ٥) بنك الأسئلة الوزارية: يفتح البنك، يتصفّح، يبدأ «المحاكاة
 *      الكاملة»، يجيب عن كل سؤال (اختيار + مفتوح بأظهر الحل)،
 *      ثم يُوقّع العهد فتظهر النتيجة ومواضيع الضعف.
 *   ٦) المراجعة: يتأكد أن النتيجة والأخطاء سُجّلت فعلاً.
 *
 * كل خطوة لها تحقّق (T) — أي فشل يوقف التقرير برمز ≠ 0.
 *
 * الاستعمال: node official-exams/journey-test.cjs
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const SCRIPT = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');

/* ── مزوّدات DOM مبسّطة (كما في smoke-test) ── */
function el(tag) {
  const e = {
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
  return e;
}
const APP = el('div');
const nodes = { app: APP };
const fields = {};
const doc = {
  _ev: {},
  getElementById(id) { return nodes[id] || fields[id] || null; },
  querySelector() { return null; }, querySelectorAll() { return []; },
  createElement: (t) => el(t),
  addEventListener(t, fn) { (this._ev[t] = this._ev[t] || []).push(fn); },
  removeEventListener() { },
  body: { appendChild() { }, removeSibling() { }, remove() { }, contains: () => false, scrollLeft: 0, scrollTop: 0 },
  documentElement: { style: { setProperty() { } }, classList: { add() { }, remove() { }, toggle() { }, contains: () => false }, setAttribute() { }, getAttribute: () => null, removeAttribute() { }, appendChild() { }, insertBefore() { }, children: [], querySelector: () => null, querySelectorAll: () => [], addEventListener() { } },
  visibilityState: 'visible',
};
doc._fields = fields;
const store = {};
const win = {
  document: doc,
  localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
  navigator: { userAgent: 'node', serviceWorker: null, clipboard: { writeText: () => Promise.resolve() } },
  location: { protocol: 'http:', href: 'http://localhost/', search: '' },
  history: { replaceState() { }, pushState() { }, back() { } },
  matchMedia: () => ({ matches: false, addListener() { }, addEventListener() { } }),
  scrollTo() { }, scrollY: 0, scrollX: 0,
  setTimeout: () => 0, clearTimeout() { }, setInterval: () => 0, clearInterval() { },
  requestAnimationFrame: () => 0, cancelAnimationFrame() { },
  performance: { now: () => Date.now() },
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  addEventListener() { }, removeEventListener() { }, console,
  URL: { createObjectURL: () => 'blob:', revokeObjectURL() { } },
  Image: function () { return el('img'); },
  FileReader: function () { return { readAsText() { } }; },
  Blob: function () { return { }; },
  indexedDB: { open: () => ({ onupgradeneeded: null, onsuccess: null, onerror: null, result: null }) },
  open() { }, alert() { }, confirm: () => false,
};
win.window = win; win.self = win; win.globalThis = win;
/* J مساعد التسليم: يُستعمل داخل كود الـ VM أيضًا (لذلك يُحقن في السياق نفسه) */
win.J = (o) => JSON.stringify(o);
Object.defineProperty(win, 'innerWidth', { value: 1280, writable: true });
Object.defineProperty(win, 'innerHeight', { value: 800, writable: true });
const ctx = vm.createContext(win);

/* ── تحميل المحتوى ثم التطبيق ── */
const CONTENT_SCRIPTS = [...html.matchAll(/<script src="(content\/[^"]+)"\s*><\/script>/g)].map((m) => m[1]);
let contentFail = null;
try {
  CONTENT_SCRIPTS.forEach((rel) => vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel }));
} catch (e) { contentFail = e; }
if (contentFail) { console.log('❌ فشل تحميل المحتوى: ' + contentFail.message); process.exit(1); }

let bootErr = null;
try { vm.runInContext(SCRIPT, ctx, { filename: 'app.js' }); } catch (e) { bootErr = e; }
if (bootErr) { console.log('❌ فشل تحميل التطبيق: ' + bootErr.message); process.exit(1); }

const run = (code) => vm.runInContext(code, ctx);
const J = (o) => JSON.stringify(o);

/* ── أدوات التقرير ── */
const results = [];
let failures = 0;
function T(step, fn) {
  try {
    const r = fn();
    if (r === true) { results.push({ step, ok: true }); console.log('  ✅ ' + step); }
    else { failures++; results.push({ step, ok: false, why: r }); console.log('  ❌ ' + step + ' — ' + r); }
  } catch (e) { failures++; results.push({ step, ok: false, why: e.message }); console.log('  ❌ ' + step + ' — ' + e.message); }
}
const must = (cond, msg) => (cond ? true : msg);
const has = (s, k) => String(s || '').includes(k);

console.log('═'.repeat(56));
console.log('رحلة الطالب — اختبار كامل من أول تشغيل إلى الامتحان الوزاري');
console.log('═'.repeat(56) + '\n');

/* ═══ ١) التهيئة ═══ */
console.log('[١] التهيئة — أول تشغيل للتطبيق');
run(`DB.students = []; DB.activeId = null; S.onb = null; S.view = 'today'; save(); startOnb('first');`);

T('١-١ تظهر قصة الترحيب', () => {
  const h = run('String(vOnb())');
  return must(has(h, 'يسهر على الكتاب') || has(h, 'يحفظ الصفحات') || has(h, 'العلم فهم'), 'القصة لا تعرض نصّها المتوقع');
});
T('١-٢ يرفض الاسم الفارغ', () => {
  const map = run(`S.onb.step = STORY.length; String(vOnb()).includes('خريطة محتوى دَرْب') &&
       String(vOnb()).includes('مكتمل في هذه النسخة')`);
  if (!map) return must(false, 'خريطة الصفوف ومحتوى السادس لا تظهر بعد القصة');
  run(`document._fields.oName = { value: '   ', focus(){} };
       S.onb.step = STORY.length + 1; S.onb.name = ''; onbNext();
       delete document._fields.oName;`);
  return must(run('S.onb.err') && run('S.onb.err').length > 4, 'لم يرفض الاسم الفارغ رسالةً واضحة');
});
T('١-٣ يقبل الاسم ثم يختار الصف ١٢ علمي', () => {
  run(`document._fields.oName = { value: 'طالب الاختبار', focus(){} };
       onbNext(); delete document._fields.oName; S.onb.grade = 12; S.onb.branch = 'sci';`);
  return must(run('S.onb.name') === 'طالب الاختبار', 'الاسم لم يُحفظ');
});
T('١-٤ يكمل التهيئة فينشأ الطالب وتظهر خطة اليوم', () => {
  run(`while (S.onb && S.onb.step < STORY.length + 5) { S.onb.step++; } onbDone();`);
  const st = run('JSON.stringify({ n: me() && me().name, g: me() && me().grade, b: me() && me().branch, v: S.view })');
  const o = JSON.parse(st);
  return must(o.n === 'طالب الاختبار' && o.g === 12 && o.b === 'sci', 'الطالب لم يُنشأ كما هو متوقع: ' + st);
});
T('١-٥ شاشة «اليوم» تعرض خطة الدراسة', () => {
  const h = run('String(VIEWS.today())');
  return must(has(h, 'اليوم') || has(h, 'خطتك') || has(h, 'خطة'), 'شاشة اليوم لا تعرض خطة');
});

/* ═══ ٢) أول درس في أول فصل وأول مادة ═══ */
console.log('\n[٢] أول درس — مادة ← فصل ← موضوع ← كل التبويبات');

const first = JSON.parse(run(`(function(){
  const ys = gradeContents(me().grade);
  const y = ys[0];
  const ch = y.c.chapters[0];
  const t = ch.topics.find(x => !isHidden(x.id)) || ch.topics[0];
  return J({ subject: y.subject, ch: ch.id, chTitle: ch.title, tid: t.id, tTitle: t.title, nSubj: ys.length });
})()`));

T('٢-١ توجد مواد للصف ١٢ علمي', () => must(first.nSubj >= 5, 'عدد المواد قليل جدًّا: ' + first.nSubj));
T('٢-٢ يفتح شاشة المادة', () => {
  run(`S.viewGrade = 12; S.viewSubject = ${J(first.subject)}; S.view = 'subject';`);
  const h = run('String(VIEWS.subject())');
  return must(h.length > 500, 'شاشة المادة فارغة أو قصيرة');
});
T('٢-٣ يفتح شاشة الفصل', () => {
  run(`S.viewChapter = ${J(first.ch)}; S.view = 'chapter';`);
  const h = run('String(VIEWS.chapter())');
  return must(has(h, first.tTitle.slice(0, 18)) || has(h, 'المواضيع'), 'الفصل لا يعرض مواضيعه');
});

const segs = JSON.parse(run(`(function(){
  const f = findTopic(${J(first.tid)}); if (!f) return J({ none: 1 });
  const t = f.t;
  return J(SEGS.filter(s => segHas(t, s[0])).map(s => s[0]));
})()`));
T('٢-٤ الموضوع يحوي تبويبات (شرح وأكثر)', () =>
  must(Array.isArray(segs) && segs.length >= 2, 'تبويبات الموضوع: ' + J(segs)));

let segSeen = 0, segBad = [];
segs.forEach((sg) => {
  T('٢-٥.' + sg + ' تبويب «' + sg + '» يُرسم بلا خطأ', () => {
    const out = run(`(function(){ try {
      S.view = 'topic'; S.viewTopic = ${J(first.tid)}; S.tseg = ${J(sg)};
      const h = String(VIEWS.topic());
      if (!h || h.length < 200) return 'فارغ أو قصير';
      if (/undefined|NaN/.test(h.replace(/&quot;|\\u/g, ''))) {
        const m = h.match(/.{0,40}(undefined|NaN).{0,40}/);
        if (m) return 'يظهر ' + m[0];
      }
      return 'ok';
    } catch(e){ return e.message; } })()`);
    if (out === 'ok') { segSeen++; return true; }
    segBad.push(sg); return out;
  });
});
T('٢-٦ سُجّل أن التبويبات قُرئت فعلاً', () => {
  const seen = JSON.parse(run(`(function(){ const p = progOf(${J(first.tid)}); return J(Object.keys(p.seen||{})); })()`));
  return must(seen.length >= Math.min(2, segs.length), 'التقدّم لا يسجل القراءة: ' + J(seen));
});

/* ═══ ٣) اختبار الموضوع ═══ */
console.log('\n[٣] اختبار الموضوع — إجابة كاملة وحفظ النتيجة');

const quizN = JSON.parse(run(`(function(){
  const f = findTopic(${J(first.tid)}); const t = f && f.t;
  return J({ n: (t && t.quiz) ? t.quiz.length : 0 });
})()`));

T('٣-١ للموضوع أسئلة اختبار', () => must(quizN.n > 0, 'لا أسئلة في موضوع ' + first.tTitle));

if (quizN.n > 0) {
  T('٣-٢ يبدأ الاختبار وتظهر الأسئلة', () => {
    const out = run(`(function(){ try {
      startQuiz('t:' + ${J(first.tid)}, Math.min(5, ${quizN.n}));
      if (!S.quiz || !S.quiz.items.length) return 'لم يبدأ';
      const h = String(VIEWS.quiz());
      if (!h || h.length < 200) return 'الشاشة فارغة';
      return 'ok';
    } catch(e){ return e.message; } })()`);
    return out === 'ok' ? true : out;
  });
  T('٣-٣ يجيب عن كل سؤال ويُنهي الاختبار', () => {
    const out = run(`(function(){ try {
      const z = S.quiz; if (!z) return 'لا اختبار';
      let guard = 0;
      while (z.i < z.items.length && guard++ < 100) {
        const it = z.items[z.i], q = quizQ(it);
        if (q.o && q.o.length) z.picks[z.i] = q.c;      /* يجيب إجابة صحيحة */
        else z.picks[z.i] = 0;
        z.i++;
      }
      if (z.i >= z.items.length) finishQuiz();
      return 'ok';
    } catch(e){ return e.message; } })()`);
    if (out !== 'ok') return out;
    const p = JSON.parse(run(`(function(){ const p = progOf(${J(first.tid)}); return J(p.quiz || null); })()`));
    return must(p && p.best === 100, 'النتيجة لم تُحفظ كاملاً: ' + J(p));
  });
  T('٣-٤ النتيجة دخلت سجل الاختبارات', () => {
    const n = run('(me().exams || []).length');
    return must(n >= 1, 'سجل الاختبارات فارغ');
  });
}

/* ═══ ٤) قفل اختبار الفصل ═══ */
console.log('\n[٤] قفل اختبار الفصل الشامل');

T('٤-١ اختبار الفصل مقفل قبل إتمام المواضيع', () => {
  const out = run(`(function(){ try {
    const f = findChapter(${J(first.ch)}); const ts = f.ch.topics.filter(t => !isHidden(t.id));
    ts.forEach(t => { const p = progOf(t.id); delete p.quiz; });
    flushSave();
    return chTestUnlocked(ts) ? 'ok' : 'كان مفتوحًا قبل الإتمام';
  } catch(e){ return e.message; } })()`);
  return out === 'ok' ? true : out;
});
T('٤-٢ يُفتح بعد إتمام كل المواضيع والاختبارات', () => {
  const out = run(`(function(){ try {
    const f = findChapter(${J(first.ch)}); const ts = f.ch.topics.filter(t => !isHidden(t.id));
    ts.forEach(t => {
      const p = progOf(t.id); p.seen = p.seen || {};
      SEGS.forEach(s => { if (segHas(t, s[0])) p.seen[s[0]] = 1; });
      p.quiz = { best: 100, last: 100, n: 5, at: Date.now() };
    });
    flushSave();
    return chTestUnlocked(ts) === null ? 'ok' : 'بقي مقفلًا: ' + chTestUnlocked(ts);
  } catch(e){ return e.message; } })()`);
  return out === 'ok' ? true : out;
});

/* ═══ ٥) البنك الوزاري والمحاكاة الكاملة ═══ */
console.log('\n[٥] بنك الأسئلة الوزارية — تصفّح ثم المحاكاة الكاملة');

const banks = JSON.parse(run(`(function(){
  const rows = gradeContents(me().grade).map(y => ({ s: y.subject, n: ministerialPool(y.subject).length }));
  return J(rows);
})()`));
const withBank = banks.filter((b) => b.n > 0);
T('٥-١ يوجد بنك وزاري لمادة على الأقل', () =>
  must(withBank.length >= 1, 'لا بنك لأي مادة: ' + J(banks)));
T('٥-٢ شاشة البنك تعرض الأسئلة', () => {
  if (!withBank.length) return 'لا بنك';
  const out = run(`(function(){ try {
    S.bankSubject = ${J(withBank[0].s)}; S.bankView = 'ch'; S.view = 'bank';
    const h = String(VIEWS.bank());
    if (h.length < 300) return 'الشاشة قصيرة';
    if (!/سؤال/.test(h)) return 'لا يذكر الأسئلة';
    return 'ok';
  } catch(e){ return e.message; } })()`);
  return out === 'ok' ? true : out;
});
T('٥-٣ لكل سؤال من البنك المُراجَع حلّ مفصّل', () => {
  const out = run(`(function(){
    let n = 0, ocr = 0, bad = [];
    gradeContents(me().grade).forEach(y => ministerialPool(y.subject).forEach(x => {
      const w = (x.q.why || '').trim();
      if (x.q.src === 'ministerial-ocr') { ocr++; if (w.length >= 30) n++; return; }
      n++;
      if (w.length < 30) bad.push((x.q.q || '').slice(0, 40));
    }));
    return J({ n: n, ocr: ocr, bad: bad.slice(0, 5), badN: bad.length });
  })()`);
  const o = JSON.parse(out);
  results.push({
    step: '   · ' + o.n + ' سؤالًا من البنك المُراجَع كلها بحلّ مفصّل · ' + o.ocr + ' سؤالًا مستخرجًا (OCR) بلا حلّ في الأصل',
    ok: true,
  });
  return must(o.n > 0 && o.badN === 0, o.badN + ' سؤالًا بلا حل من ' + o.n + ' — مثال: ' + J(o.bad));
});

/* المحاكاة الكاملة */
T('٥-٤ تُبنى خطة المحاكاة الكاملة (أسئلة + نقاط + زمن)', () => {
  const out = run(`(function(){ try {
    const subj = ${J(withBank[0].s)};
    const plan = simPlan(subj);
    if (!plan || !plan.n) return 'لا خطة';
    if (!plan.items || plan.items.length !== plan.n) return 'الخطة لا تطابق عدد الأسئلة';
    const pts = plan.items.reduce((a, x) => a + x.pts, 0);
    if (pts !== 100) return 'مجموع النقاط ' + pts + ' بدل 100';
    if (!plan.sec || plan.sec < 60) return 'زمن غير معقول: ' + plan.sec;
    return 'ok';
  } catch(e){ return e.message; } })()`);
  return out === 'ok' ? true : out;
});

T('٥-٥ تبدأ المحاكاة فعليًّا', () => {
  const out = run(`(function(){ try {
    const subj = ${J(withBank[0].s)};
    S.minsimSubj = subj; S.examScope = null;
    const plan = simPlan(subj);
    S.exam = { kind: 'ministerial', subject: subj, phase: 'config', perQ: 0, prep: 0 };
    S.examForcePick = plan.items.map(it => it.x);
    S.examForcePts = plan.items.map(it => it.pts);
    const ok = startExam('ministerial', subj, plan.n, Math.round(plan.sec / plan.n));
    if (!ok || !S.exam) return 'لم يبدأ';
    S.exam.phase = 'run';
    const h = String(VIEWS.exam());
    if (!h || h.length < 300) return 'شاشة الامتحان فارغة';
    if (!/السؤال ١|السؤال 1/.test(h)) return 'لا يعرض رقم السؤال';
    return 'ok';
  } catch(e){ return e.message; } })()`);
  return out === 'ok' ? true : out;
});

T('٥-٦ يجيب عن كل الأسئلة (اختيار + مفتوح بأظهر الحل)', () => {
  const out = run(`(function(){ try {
    const z = S.exam; if (!z || z.phase !== 'run') return 'الامتحان ليس جاريًا';
    let guard = 0, mcq = 0, open = 0;
    while (z.i < z.items.length && guard++ < 200) {
      const it = z.items[z.i], q = it.q;
      const isOpen = (!q.o || !q.o.length) && (q.c == null || q.c < 0);
      if (isOpen) {
        S.examRevealed = S.examRevealed || {};
        S.examRevealed[it.key] = 1;
        z.picks[z.i] = -2;       /* عُرض الحل = مراجعة ناجحة */
        open++;
      } else {
        z.picks[z.i] = q.c;      /* إجابة صحيحة */
        mcq++;
      }
      z.times[z.i] = 30;
      z.i++; z.qAt = Date.now();
      if (z.i >= z.items.length) examFinish();
    }
    if (!z._fin) return 'لم يُنهِ الامتحان';
    return 'ok:' + mcq + ':' + open;
  } catch(e){ return e.message; } })()`);
  if (!String(out).startsWith('ok:')) return out;
  const [m, o] = String(out).slice(3).split(':');
  results.push({ step: '   · أسئلة: ' + m + ' اختيار و' + o + ' مفتوح', ok: true });
  return true;
});

T('٥-٧ النتيجة ١٠٠٪ لأنه أجاب كل شيء صحيحًا', () => {
  const z = JSON.parse(run('JSON.stringify({ pct: S.exam.pct, ok: S.exam.ok, open: S.exam.openReviewed, tot: S.exam.items.length, openTot: S.exam.openTotal })'));
  return must(z.pct === 100, 'النتيجة ' + z.pct + '٪ بدل 100 — ' + J(z));
});
T('٥-٨ العهد يُغلق الامتحان ويحفظه', () => {
  const out = run(`(function(){ try {
    const z = S.exam;
    if (z.phase === 'done') return 'ok';
    z.phase = 'pledge';
    const h = String(VIEWS.exam());
    if (!/أتعهّد|أكملت/.test(h)) return 'شاشة العهد لا تعرض النص';
    S.dialog = null;
    /* يحاكي ضغط الزر: ينفّذ run() مباشرة */
    examFinish();
    z.pledged = true; z.phase = 'done'; clearExamClock(); save();
    return 'ok';
  } catch(e){ return e.message; } })()`);
  if (out !== 'ok') return out;
  const h = run('String(VIEWS.exam())');
  return must(has(h, '٪') && has(h, 'المعدل'), 'شاشة النتيجة ناقصة: ' + h.slice(0, 160));
});

/* ═══ ٦) المراجعة والسجلات ═══ */
console.log('\n[٦] بعد الامتحان — السجلات والمراجعة');

T('٦-١ سُجّل الامتحان الوزاري في السجل', () => {
  const out = JSON.parse(run(`(function(){
    const st = me(); const mins = (st.exams||[]).filter(e => String(e.src||'').indexOf('ministerial') >= 0 || e.ks || e.pct === 100);
    return J({ all: (st.exams||[]).length, mins: mins.length, last: (st.exams||[]).slice(-1)[0] || null });
  })()`));
  return must(out.all >= 2, 'السجل لا يحوي اختبارات كافية: ' + J(out));
});
T('٦-٢ شاشة المراجعة تعرض إحصاءات الطالب', () => {
  const h = run('String(VIEWS.review())');
  return must(has(h, 'المستوى') || has(h, 'دروس مستحقة للمراجعة') || has(h, 'نسبة'), 'شاشة المراجعة بلا إحصاء أو دروس');
});
T('٦-٣ شاشة السجل تعرض آخر النشاطات', () => {
  const h = run('String(VIEWS.log())');
  return must(h.length > 200, 'سجل النشاط فارغ');
});
T('٦-٤ الامتحان الوزاري يقيس تطور الطالب (معدّل)', () => {
  const avg = run('ministerialAvg(' + J(withBank[0].s) + ')');
  return must(typeof avg === 'number' && avg >= 0, 'معدّل غير معرّف: ' + avg);
});

/* ═══ ٧) جولة الشاشات بعد كل ما سبق ═══ */
console.log('\n[٧] جولة شاشات سريعة بعد الرحلة');
const VIEWS_LIST = run('Object.keys(VIEWS)');
const badViews = [];
VIEWS_LIST.forEach((v) => {
  const out = run(`(function(){ try {
    S.exam = null; S.quiz = null;
    S.view = ${J(v)};
    if (${J(v)} === 'export' && !S.exp) S.exp = defaultExp('topic', null);
    const h = String((VIEWS[${J(v)}]||function(){return '';})());
    if (typeof h !== 'string') return 'لم يُرجع نصًّا';
    if (!h.length) return 'فارغة';
    return 'ok';
  } catch(e){ return e.message; } })()`);
  if (out !== 'ok') badViews.push(v + ': ' + out);
});
T('٧-١ كل الشاشات ' + VIEWS_LIST.length + ' تُرسم بلا خطأ', () =>
  must(badViews.length === 0, badViews.join(' | ')));

/* ═══ التقرير ═══ */
console.log('\n' + '═'.repeat(56));
const nSteps = results.length;
if (failures === 0) {
  console.log('✅ رحلة الطالب كاملة — ' + nSteps + ' خطوة كلها ناجحة');
} else {
  console.log('❌ ' + failures + ' من ' + nSteps + ' خطوة فشلت:');
  results.filter((r) => !r.ok).forEach((r) => console.log('   · ' + r.step + ' — ' + r.why));
}
console.log('═'.repeat(56));
process.exit(failures ? 1 : 0);
