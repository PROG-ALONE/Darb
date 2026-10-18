/* محاكاة طالب السادس العلمي — تُحقن في الصفحة؛ كل دالة تحاكي ما يفعله الطالب بالنقر */
window.SIM = (() => {
  let seed = 20261001;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const issues = [], seenIssue = new Set();
  const issue = (k, msg) => { const key = k + '|' + msg; if (seenIssue.has(key)) return; seenIssue.add(key); issues.push({ d: isoD(new Date()), k, msg }); };
  const clk = (sel, root) => { const e = (root || document).querySelector(sel); if (!e) return false; e.click(); return true; };
  const htmlCheck = where => {
    const h = document.getElementById('app').innerHTML;
    const txt = document.getElementById('app').innerText;
    if (/\bundefined\b/.test(txt)) issue('undefined', where);
    if (/\bNaN\b/.test(txt)) issue('NaN', where);
    if (/\[object /.test(txt)) issue('object', where);
    if (/&lt;\/?(bdi|span|b|sub|sup)\b/.test(h)) issue('raw-html', where);
    if (/Infinity/.test(txt)) issue('Infinity', where);
  };
  const adv = min => __addMs(min * 60000);
  function ability(dayN) { return Math.min(0.93, 0.62 + dayN * 0.0013); }
  function doQuiz(src, n, p) {
    startQuiz(src, n); let guard = 0;
    while (S.quiz && S.quiz.i < S.quiz.items.length && guard++ < 80) {
      const z = S.quiz, q = quizQ(z.items[z.i]);
      const want = rnd() < p ? q.c : (q.c + 1) % q.o.length;
      if (!clk('[data-act="quizPick"][data-o="' + want + '"]')) { issue('quiz', 'لا زر خيار ' + src); break; }
      adv(1);
      if (!clk('[data-act="quizNext"]')) { issue('quiz', 'لا زر التالي ' + src); break; }
    }
    htmlCheck('نتيجة اختبار ' + src);
    const last = (me().exams || []).slice(-1)[0];
    return last ? last.pct : null;
  }
  function studyTopic(tid, p) {
    const f = findTopic(tid); if (!f) { issue('plan', 'موضوع غير موجود ' + tid); return; }
    S.tseg = 'explain'; go('topic', { viewTopic: tid }); htmlCheck('موضوع ' + tid);
    SEGS.forEach(([k]) => { if (!segHas(f.t, k)) return; S.tseg = k; render(); adv(4); htmlCheck('تبويب ' + k + ' ' + tid); });
    /* المسائل: يبدأ الحل ثم يقيّم نفسه */
    (f.t.problems || []).forEach(pr => { startSolve(pr.id); adv(3); const v = solveOf(pr.id); v.self = rnd() < p ? 'ok' : (rnd() < .5 ? 'bad' : 'none'); });
    save();
    if ((f.t.quiz || []).length) doQuiz('t:' + tid, Math.min(10, f.t.quiz.length), p);
    if (topicPct(f.t) < 90 && (f.t.quiz || []).length) doQuiz('t:' + tid, Math.min(10, f.t.quiz.length), Math.min(.97, p + .15)); /* يعيد الاختبار إن لم يتقن */
    flushSave();
  }
  function reviews(p) {
    const due = revAll().filter(x => revOver(x.r)).slice(0, 6);
    tabTo('review'); htmlCheck('المراجعة');
    due.forEach(x => {
      const t = findTopic(x.tid); if (!t || !(t.t.quiz || []).length) return;
      const b = document.querySelector('[data-act="revQuiz"][data-id="' + x.tid + '"]');
      if (b) b.click(); else { issue('review', 'موضوع مستحق بلا زر مراجعة في التبويب'); startQuiz('t:' + x.tid, Math.min(10, t.t.quiz.length)); }
      let g = 0; while (S.quiz && S.quiz.i < S.quiz.items.length && g++ < 30) { const z = S.quiz, q = quizQ(z.items[z.i]); clk('[data-act="quizPick"][data-o="' + (rnd() < p ? q.c : (q.c + 1) % q.o.length) + '"]'); clk('[data-act="quizNext"]'); }
    });
    return due.length;
  }
  function chapterTests(p) {
    let n = 0;
    gradeContents(me().grade).forEach(y => y.c.chapters.forEach(ch => {
      const ts = ch.topics.filter(t => !isHidden(t.id));
      if (chTestUnlocked(ts, ch) !== null || (me().tests || {})['c:' + ch.id]) return; /* null = مفتوح */
      const pool = quizPool('c:' + ch.id).length; if (!pool) return;
      doQuiz('c:' + ch.id, Math.min(20, pool), p); n++;
    }));
    return n;
  }
  function runExam(kind, subject, n, p, full) {
    S.exam = null;
    if (full) { const pl = simPlan(subject); if (!pl.n) return null; S.examForcePick = pl.items.map(x => x.x); S.examForcePts = pl.items.map(x => x.pts); n = pl.n; }
    if (!startExam(kind, subject, n)) return null;
    let g = 0;
    while (S.exam && S.exam.phase === 'run' && g++ < 200) {
      const z = S.exam, it = z.items[z.i];
      const open = (!it.q.o || !it.q.o.length) && (it.q.c == null || it.q.c < 0);
      adv(2);
      if (open) { if (!clk('[data-act="examReveal"]')) { issue('exam', 'سؤال مفتوح بلا زر إظهار الحل'); break; }
        if (!clk('[data-act="examSelf"][data-v="' + (rnd() < p ? 'ok' : rnd() < .5 ? 'half' : 'bad') + '"]')) clk('[data-act="examNext"]'); else if (S.exam.phase === 'run' && S.exam.i === z.i) clk('[data-act="examNext"]'); }
      else {
        const want = rnd() < p ? it.q.c : (it.q.c + 1) % it.q.o.length;
        if (!clk('[data-act="examPick"][data-o="' + want + '"]')) { issue('exam', 'لا زر خيار في امتحان ' + kind); break; }
        if (kind !== 'ministerial' && S.exam.phase === 'run' && S.exam.i === z.i) clk('[data-act="examNext"]');
      }
    }
    htmlCheck('امتحان ' + kind + ' ' + subject);
    if (S.exam && S.exam.phase === 'pledge') { clk('[data-act="examPledge"]'); clk('[data-act="dlgOk"]'); }
    htmlCheck('بعد امتحان ' + kind);
    return S.exam ? S.exam.pct : null;
  }
  function tour() {
    ['today', 'path', 'tests', 'me', 'review', 'library', 'eval', 'figlib'].forEach(v => { tabTo(v); htmlCheck('تبويب ' + v); }); ['self', 'exams', 'bank', 'memo'].forEach(k => { S.tests2 = k; tabTo('tests'); htmlCheck('اختبارات ' + k); }); S.tests2 = 'self'; Object.keys(window.EXPLAINERS || {}).forEach(id => { openXplain(id); EXPLAINERS[id].steps.forEach((x, i) => { S.xp.step = i; render(); htmlCheck('شارح ' + id + ' ' + i); }); });
    showPopup('قيّمني', () => popupBody(vEval()), true); htmlCheck('قيّمني'); closePopup();
    showPopup('علامات تطورك الوزاري', () => popupBody(vMinrec()), true); htmlCheck('تطور وزاري'); closePopup();
    go('log'); htmlCheck('السجل'); 
    gradeContents(me().grade).forEach(y => { S.bankSubject = y.subject; go('bank'); htmlCheck('بنك ' + y.subject); S.logFor = 'tests'; S.logSubject = y.subject; go('log'); htmlCheck('سجل ' + y.subject); });
  }
  function day(dayN, opts) {
    const st = me(), dd = new Date(), dIso = isoD(dd);
    const rest = st.rest.includes(dd.getDay()) || inHoliday(dd, st.holidays);
    const out = { d: dIso, rest, studied: [], quizAvg: null, rev: 0, ch: 0, exams: [] };
    tabTo('today'); htmlCheck('اليوم');
    if (rest) return out;
    if (rnd() < 0.05) { out.skipped = true; return out; } /* يوم غياب */
    const p = ability(dayN);
    const plan = planToday();
    out.plan = plan.picks.map(x => x.subject);
    if (!plan.picks.length && plan.total) issue('plan', 'خطة اليوم فارغة والمنهج لم ينتهِ');
    plan.picks.filter(x => !x.done).forEach(x => { studyTopic(x.t.id, p); out.studied.push(x.subject); });
    out.rev = reviews(p);
    out.ch = chapterTests(p);
    return out;
  }
  return { day, runExam, tour, issues, rnd, htmlCheck, issue };
})();
