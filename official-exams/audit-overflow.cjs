#!/usr/bin/env node
/**
 * فاحص تجاوز النص عن البوكسات
 * ───────────────────────────
 * يزور كل شاشات التطبيق (٢٣ شاشة) عند عرضين: عرض النافذة الحالية، وعرض جوال ٣٧٥px
 * داخل إطار داخلي — لأن الإطار نفس الأصل فيتشارك localStorage ويُصفّي الـCSS بالضبط
 * كما على جوال حقيقي، ولا حاجة لأداة تغيير عرض النافذة.
 *
 * ثلاثة أنواع من الملاحظات:
 *   PAGE  الصفحة نفسها أوسع من النافذة
 *   CARD  بطاقة أو صندوق تجاوز عرض محتواه عرضه
 *   TEXT  نص مقصوص (scrollWidth > clientWidth) في عنصر لا يمرّر أفقًا
 *
 * الاستعمال: شغّل الخادم ثم افتح هذا الملف في جلسة فيها أداة متصفح،
 * أو استنسخ الدوال audit()/setup() أدناه في أي أداة تقييم.
 */
const VIEWS = ["today", "path", "grade", "subject", "chapter", "intro", "review", "tests",
  "library", "groups", "search", "settings", "topic", "problem", "notebook",
  "quiz", "export", "exam", "bank", "log", "subexams", "minprep"];

/* معاملات تكفي كل شاشة حتى لا تسقط بمعزل عن سياقها */
const SETUP = `function setup(){
  S.viewSubject='الأحياء'; S.viewChapter='b12c1'; S.viewTopic='b12c1t1'; S.viewGrade=12;
  S.viewLevel='chapter'; S.viewProblem=null; S.bankSubject='الأحياء'; S.bankView='ch';
  S.examScope=null; S.weekOrder='manual'; S.setTab='acc';
  S.exp={subject:'الأحياء', ch:'b12c1', lvl:'chapter', seg:'explain'};
}`;

/* نص الفحص — يُحقن داخل الصفحة أو داخل الإطار، لأنه يعتمد على ثوابت داخل التطبيق
   (me, S, go, examConfig) وهي ليست خصائص نافذة */
const AUDIT_CODE = `(function(VIEWS, SETUP){
  var out = [];
  function audit(name) {
    var winW = window.innerWidth, issues = [];
    if (document.body.scrollWidth > winW + 2) issues.push({k:'PAGE', d:'الصفحة ' + document.body.scrollWidth + '>' + winW});
    Array.prototype.forEach.call(document.querySelectorAll('main.page section.card,main.page section.map-card,main.page .strip,main.page .acc,.dialog'), function (c) {
      if (c.scrollWidth > c.clientWidth + 2) {
        var h = c.querySelector('h1,h2,h3,.acc-t');
        issues.push({k:'CARD', d:((h && h.textContent) || '').slice(0,26) + ' — ' + c.scrollWidth + '>' + c.clientWidth});
      }
    });
    var seen = {};
    Array.prototype.forEach.call(document.querySelectorAll('main.page *'), function (e) {
      var cs = getComputedStyle(e);
      if (cs.overflowX === 'auto' || cs.overflowX === 'scroll' || cs.display === 'inline') return;
      if (!e.textContent.trim() || e.children.length > 3 || e.clientWidth <= 20) return;
      if (e.scrollWidth > e.clientWidth + 2) {
        var key = (e.className || '') + '|' + e.textContent.slice(0, 24);
        if (seen[key]) return; seen[key] = 1;
        issues.push({k:'TEXT', d:((e.className || e.tagName) + ' «' + e.textContent.replace(/\\s+/g,' ').slice(0,36) + '» ' + e.scrollWidth + '>' + e.clientWidth)});
      }
    });
    return {view:name, n:issues.length, issues:issues.slice(0,5)};
  }
  SETUP();
  VIEWS.forEach(function (v) {
    try {
      setup();
      if (v === 'exam') examConfig('ministerial', 'الأحياء'); else go(v);
      out.push(audit(v));
      if (v === 'exam') { startExam('ministerial', 'الأحياء', 4, 60); out.push(audit('exam:run')); }
    } catch (e) { out.push({view:v, error:e.message}); }
  });
  window.__auditResult = JSON.stringify(out);
})(${JSON.stringify(VIEWS)}, function(){ ${SETUP} });`;

/* ملخّص القراءة: يعرض الشاشات التي بها ملاحظة فقط */
function summarize(raw) {
  let data;
  try { data = JSON.parse(raw); } catch (e) { return 'تعذّر القراءة'; }
  if (data.error) return 'إطار غير جاهز: ' + data.error;
  const bad = data.filter(x => (x.n || 0) > 0 || x.error);
  let s = data.length + ' شاشة، منها ' + bad.length + ' بها ملاحظة\n';
  if (!bad.length) return s + '  ✅ لا تجاوز في أي شاشة\n';
  bad.forEach(x => {
    s += '  ✗ ' + x.view + (x.error ? ' — ' + x.error : ' (' + x.n + ')') + '\n';
    (x.issues || []).forEach(i => { s += '      [' + i.k + '] ' + i.d + '\n'; });
  });
  return s;
}

module.exports = { VIEWS, SETUP, AUDIT_CODE, summarize };
