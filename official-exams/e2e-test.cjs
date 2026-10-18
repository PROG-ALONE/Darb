#!/usr/bin/env node
/**
 * اختبار شامل للنظام (E2E) — يُشغَّل داخل متصفح عبر أداة تقييم
 * ────────────────────────────────────────────────────────────
 * يغطّي المسارات العشرة التي أُعيد بناؤها:
 *   1. تحميل بلا أخطاء في الـconsole
 *   2. البنك: التجميع بالفصل وبالدورة + الهينت + زر التدريب المنطوي
 *   3. الامتحان: رقم كل سؤال + نوعه + زمنه + مصدره
 *   4. تدفق الفصل: يُفتح بعد إتمامه ويحصر أسئلته وحدها
 *   5. الأهداف الأسبوعية: الحساب + التوزيع + العشوائي/اليدوي + البدء
 *   6. اختيار الفصول: تحديد الكل / إلغاء الكل بلا تكرار
 *   7. مفاتيح البنك فريدة (لا بنك يتكرر على آخره)
 *   8. صفر تجاوز أفقي عند عرضي نافذة وجوّال
 *   9. كل الشاشات تُرسم
 *  10. إتمام امتحان كامل بلا خطأ
 *
 * الناتج: قائمة ب ✅ / ✗ لكل بند مع تفصيل الفشل.
 */

const CHECKS = [
  {
    id: 'load',
    name: 'التحميل بلا أخطاء',
    run: () => {
      const errs = window.__e2eErrs || [];
      return { ok: errs.length === 0, got: errs.slice(0, 3) };
    }
  },
  {
    id: 'bank-ch',
    name: 'البنك: تجميع بالفصل',
    run: () => {
      S.bankSubject = 'الأحياء'; S.bankView = 'ch'; go('bank');
      const secs = [...document.querySelectorAll('main.page section.card')];
      const groups = secs.slice(1).map(s => (s.querySelector('h2') || {}).textContent || '');
      const det = document.querySelectorAll('details.fold');
      const linked = groups.filter(g => g !== 'غير مرتبط بفصل').length;
      return {
        ok: groups.length >= 5 && det.length > 300 && linked >= 4,
        got: `${groups.length} مجموعة · ${det.length} سؤال · ${linked} فصل موصول`
      };
    }
  },
  {
    id: 'bank-year',
    name: 'البنك: تجميع بالدورة',
    run: () => {
      S.bankView = 'year'; go('bank');
      const groups = [...document.querySelectorAll('main.page section.card')].slice(1)
        .map(s => (s.querySelector('h2') || {}).textContent || '');
      const years = groups.filter(g => g.startsWith('دورة'));
      return { ok: years.length >= 6, got: `${years.length} دورة: ${years.join(' · ')}` };
    }
  },
  {
    id: 'bank-hint',
    name: 'البنك: هينت لكل سؤال',
    run: () => {
      S.bankView = 'ch'; go('bank');
      const det = [...document.querySelectorAll('details.fold')];
      const withTitle = det.filter(d => (d.getAttribute('title') || '').length > 20);
      const sample = det.map(d => d.getAttribute('title') || '').find(t => t.includes('دورة')) || '';
      return {
        ok: withTitle.length === det.length && det.length > 0 && sample.includes('زمن مقترح'),
        got: `${withTitle.length}/${det.length} به هينت · نموذج: ${sample.slice(0, 70)}`
      };
    }
  },
  {
    id: 'bank-train',
    name: 'البنك: تدريب على مجموعة منطويا',
    run: () => {
      S.examScope = null;
      const btn = document.querySelector('[data-act="bankTrain"]');
      if (!btn) return { ok: false, got: 'لا زر تدريب' };
      const label = btn.textContent.match(/\((.*?)\)/);
      btn.click();
      const n = S.examScope ? S.examScope.keys.length : 0;
      const shown = examPool('ministerial', 'الأحياء').filter(x => S.examScope.keys.includes(x.key)).length;
      const started = startExam('ministerial', 'الأحياء', 4, 60);
      const inScope = S.exam.items.every(it => S.examScope.keys.includes(it.key));
      return {
        ok: n > 0 && n === shown && started && inScope,
        got: `زر يقول ${label ? label[1] : '?'} · النطاق ${n} · المعروض ${shown} · كل الأسئلة داخل النطاق: ${inScope}`
      };
    }
  },
  {
    id: 'exam-head',
    name: 'الامتحان: رقم + نوع + زمن + مصدر لكل سؤال',
    run: () => {
      S.examScope = null;
      examConfig('ministerial', 'الأحياء');
      startExam('ministerial', 'الأحياء', 5, 60);
      const z = S.exam, rows = [];
      for (let i = 0; i < z.items.length; i++) {
        z.i = i; render(true);
        rows.push({
          n: (document.querySelector('.muted.small.num') || {}).textContent || '',
          chip: (document.querySelector('.page .chip') || {}).textContent || '',
          clock: (document.getElementById('examClock') || {}).textContent || '',
          src: (document.querySelector('.page .small.muted:not(.num)') || {}).textContent || ''
        });
      }
      z.i = 0; render(true);
      const numsOk = rows.every((r, i) => r.n.includes(ar(i + 1)));
      const chipsOk = rows.every(r => r.chip.trim().length > 0);
      /* الساعة تُعرض بأرقام عربية (٠٢:٣٠) فلا تنطبق عليها \d ASCII */
      const clocksOk = rows.every(r => /^[0-9٠-٩]{2}:[0-9٠-٩]{2}$/.test(r.clock.trim()));
      const times = z.items.map(it => it.q.time).filter(Boolean);
      const distinct = new Set(times).size;
      const srcOk = rows.some(r => r.src.includes('دورة')) || rows.some(r => r.src.includes('إعداد المنهج'));
      return {
        ok: numsOk && chipsOk && clocksOk && distinct >= 2 && srcOk,
        got: `أرقام: ${numsOk} · رقاقات: ${chipsOk} · ساعات: ${clocksOk} · أزمنة مختلفة: ${distinct} · مصدر ظاهر: ${srcOk} — ` +
          rows.map(r => `${r.n.trim()} «${r.chip.trim()}» ${r.clock.trim()}`).join(' | ')
      };
    }
  },
  {
    id: 'exam-run',
    name: 'الامتحان: تشغيل كامل بالنقر الفعلي بلا خطأ',
    run: () => {
      const z0 = S.exam;
      if (!z0 || z0.phase !== 'run') return { ok: false, got: 'لا امتحان قيد التشغيل' };
      let guard = 0, clicks = 0, types = { mcq: 0, open: 0 };
      while (S.exam && S.exam.phase === 'run' && guard++ < 60) {
        const it = S.exam.items[S.exam.i];
        const open = (!it.q.o || !it.q.o.length) && (it.q.c == null || it.q.c < 0);
        if (open) {
          const rev = document.querySelector('[data-act="examReveal"]');
          if (!rev) return { ok: false, got: 'زر «أظهر الحل» غير موجود للسؤال ' + guard };
          rev.click(); clicks++; types.open++;
          const nx = document.querySelector('[data-act="examNext"]');
          if (nx) { nx.click(); clicks++; }
        } else {
          const opts = document.querySelectorAll('[data-act="examPick"]');
          if (!opts.length) return { ok: false, got: 'لا خيارات للسؤال ' + guard };
          opts[Math.min(it.q.c, opts.length - 1)].click(); clicks++; types.mcq++;
        }
      }
      const phase = S.exam ? S.exam.phase : 'زالت';
      const finished = phase !== 'run';
      return {
        ok: finished && clicks > 0,
        got: `${guard} سؤالًا · ${clicks} نقرة · اختيار من متعدد ${types.mcq} · مفتوح ${types.open} · المرحلة: ${phase}`
      };
    }
  },
  {
    id: 'bank-uniq',
    name: 'مفاتيح البنك فريدة (لا بنك يتكرر)',
    run: () => {
      const rows = ['الأحياء', 'اللغة العربية', 'الفيزياء', 'الرياضيات', 'الكيمياء'].map(s => {
        const p = ministerialPool(s);
        return { s, n: p.length, u: new Set(p.map(x => x.key)).size };
      });
      return {
        ok: rows.every(r => r.n === r.u),
        got: rows.map(r => `${r.s}: ${r.n}/${r.u}`).join(' · ')
      };
    }
  },
  {
    id: 'chapter-flow',
    name: 'تدفق الفصل: قسم وزاري + مطابقة 5/5',
    run: () => {
      const c = contentOf(12, 'الأحياء');
      const appChs = c.chapters.map(ch => ch.title);
      const part = (window.MINISTERIAL_BANK || []).find(x => (x.questions || []).some(q => q.ch));
      const bankChs = [...new Set(part.questions.map(q => q.ch).filter(Boolean))];
      const matched = bankChs.filter(b => appChs.includes(b)).length;
      const perCh = c.chapters.map(ch => bankOfChapter('الأحياء', ch.id).length);
      // شاشة الفصل — الحالة قد تكون محفوظة من جلسة سابقة، فالشرط اتساقها مع التقدّم لا ثباتها
      S.viewSubject = 'الأحياء'; S.viewChapter = 'b12c1'; go('chapter');
      const card = [...document.querySelectorAll('main.page section.card')]
        .find(cd => ((cd.querySelector('h2') || {}).textContent || '').includes('اختبار وزاري'));
      const btn = card && card.querySelector('button[data-act="chMinExam"]');
      const studied = chPct(findChapter('b12c1').ch) >= 60;
      const lockAgrees = btn && btn.disabled === !studied;
      return {
        ok: matched === bankChs.length && perCh.every(n => n > 0) && !!card && !!btn && lockAgrees,
        got: `مطابقة العناوين ${matched}/${bankChs.length} · أسئلة الفصول ${perCh.join('/')} · البطاقة: ${!!card} · ` +
          `الفصل ${Math.round(chPct(findChapter('b12c1').ch))}٪ فاليزر ${btn && btn.disabled ? 'معزول' : 'مفتوح'} (متّفق مع التقدّم: ${lockAgrees})`
      };
    }
  },
  {
    id: 'chapter-unlock',
    name: 'تدفق الفصل: يُفتح بعد الإتمام ويحصر أسئلته',
    run: () => {
      const f = findChapter('b12c1');
      f.ch.topics.forEach(t => {
        const p = progOf(t.id);
        SEGS.forEach(s => { if (segHas(t, s[0])) p.seen[s[0]] = 1; });
        p.quiz = { best: 95, n: 1 };
        t.problems.forEach(x => { const s = solveOf(x.id); if (s) s.self = 'ok'; });
      });
      flushSave();
      go('chapter');
      const btn = [...document.querySelectorAll('button[data-act="chMinExam"]')][0];
      if (!btn) return { ok: false, got: 'الزر لم يظهر بعد الإتمام' };
      btn.click();
      const n = S.examScope ? S.examScope.keys.length : 0;
      const chap = bankOfChapter('الأحياء', 'b12c1').map(x => x.key);
      const started = startExam('ministerial', 'الأحياء', 6, 60);
      const allIn = S.exam.items.every(it => chap.includes(it.key));
      return {
        ok: !btn.disabled && n > 0 && started && allIn,
        got: `النطاق ${n} سؤالًا · بدأ: ${started} · كل السؤال من الفصل: ${allIn}`
      };
    }
  },
  {
    id: 'weekly',
    name: 'أهداف الأسبوع: حساب + توزيع + عشوائي/يدوي',
    run: () => {
      const st = me();
      const g = weeklyGoals(st);
      const sum = g.subjects.reduce((a, s) => a + s.perWeek, 0);
      S.weekOrder = null; go('today');
      const card = [...document.querySelectorAll('main.page section.card')]
        .find(c => /^أهداف الأسبوع/.test((c.querySelector('h2') || {}).textContent || ''));
      if (!card) return { ok: false, got: 'لا بطاقة أهداف' };
      card.querySelector('[data-act="weekOrder"][data-m="random"]').click();
      const rand = [...document.querySelectorAll('main.page section.card')]
        .find(c => /^أهداف الأسبوع/.test((c.querySelector('h2') || {}).textContent || ''))
        .querySelectorAll('[data-act="topic"]').length;
      document.querySelector('[data-act="weekOrder"][data-m="manual"]').click();
      const man = [...document.querySelectorAll('main.page section.card')]
        .find(c => /^أهداف الأسبوع/.test((c.querySelector('h2') || {}).textContent || ''));
      const manN = man.querySelectorAll('[data-act="topic"]').length;
      const order = [...man.querySelectorAll('[data-act="topic"]')].map(b => b.dataset.id).join(',');
      man.querySelector('[data-act="weekStart"]').click();
      const opened = S.view === 'topic' && !!S.viewTopic;
      return {
        ok: g.perWeek > 0 && sum === g.perWeek && rand === g.perWeek && manN === g.perWeek && opened,
        got: `الهدف ${g.perWeek} · مجموع توزيع المواد ${sum} · عشوائي ${rand} · يدوي ${manN} · البدء يفتح موضوعًا: ${opened}`
      };
    }
  },
  {
    id: 'sel-all',
    name: 'اختيار الفصول: تحديد الكل / إلغاء الكل بلا تكرار',
    run: () => {
      S.examScope = null; examConfig('ministerial', 'الأحياء');
      const total = () => ([...document.querySelectorAll('.small.muted.num')]
        .map(e => e.textContent.trim()).find(t => t.includes('إجمالي')) || '');
      const before = total();
      document.querySelector('[data-act="examChAll"][data-on="0"]').click();
      const none = total();
      document.querySelector('[data-act="examChAll"][data-on="1"]').click();
      const all = total();
      const uniq = new Set(S.exam.selCh).size, len = S.exam.selCh.length;
      const rows = [...document.querySelectorAll('label.pitem')].slice(0, 4)
        .map(c => Math.round(c.getBoundingClientRect().height));
      return {
        ok: before.includes('٤٧٦') && none.includes('٠') && all.includes('٤٧٦') && uniq === len && rows.every(h => h < 110),
        got: `قبل ${before} · إلغاء ${none} · تحديد ${all} · selCh ${len}/${uniq} · ارتفاع الصفوف ${rows.join(',')}`
      };
    }
  },
  {
    id: 'topics-filter',
    name: 'اختيار المواضيع: الكل يبقى كله (لا 18 من 476)',
    run: () => {
      document.querySelector('[data-act="examTopicAll"][data-on="0"]').click();
      const none = ([...document.querySelectorAll('.small.muted.num')]
        .map(e => e.textContent.trim()).find(t => t.includes('إجمالي')) || '');
      document.querySelector('[data-act="examTopicAll"][data-on="1"]').click();
      const all = ([...document.querySelectorAll('.small.muted.num')]
        .map(e => e.textContent.trim()).find(t => t.includes('إجمالي')) || '');
      return { ok: all.includes('٤٧٦') && none.includes('٠'), got: `إلغاء ${none} · كل ${all}` };
    }
  },
  {
    id: 'views',
    name: 'كل الشاشات تُرسم بلا خطأ',
    run: () => {
      const VIEWS = ['today', 'path', 'grade', 'subject', 'chapter', 'intro', 'review', 'tests',
        'library', 'groups', 'search', 'settings', 'topic', 'problem', 'notebook',
        'quiz', 'export', 'exam', 'bank', 'log', 'subexams', 'minprep'];
      const failed = [];
      VIEWS.forEach(v => {
        try {
          S.viewSubject = 'الأحياء'; S.viewChapter = 'b12c1'; S.viewTopic = 'b12c1t1';
          S.viewGrade = 12; S.viewLevel = 'chapter'; S.bankSubject = 'الأحياء';
          S.examScope = null; S.exp = { subject: 'الأحياء', ch: 'b12c1', lvl: 'chapter', seg: 'explain' };
          if (v === 'exam') examConfig('ministerial', 'الأحياء'); else go(v);
          const main = document.querySelector('main.page');
          if (!main || main.innerHTML.trim().length < 40) failed.push(v + ' (فارغة)');
        } catch (e) { failed.push(v + ': ' + e.message); }
      });
      return { ok: failed.length === 0, got: failed.length ? failed.join(' | ') : `${VIEWS.length} شاشة` };
    }
  },
  {
    id: 'overflow',
    name: 'لا تجاوز أفقي',
    run: () => {
      const over = document.body.scrollWidth > window.innerWidth + 2;
      return { ok: !over, got: `body ${document.body.scrollWidth} vs ${window.innerWidth}` };
    }
  }
];

/* منفّذ الاختبار داخل الصفحة — يُسلَّم نصّ الدوال لأن أداة التقييم لا تمرّر دوالًا */
const RUNNER = `(function (checks) {
  const out = [];
  checks.forEach(c => {
    try {
      const r = (new Function('return (' + c.run + ')'))()();
      out.push({ id: c.id, name: c.name, ok: !!r.ok, got: String(r.got || '') });
    } catch (e) {
      out.push({ id: c.id, name: c.name, ok: false, got: 'خطأ: ' + e.message });
    }
  });
  window.__e2eResult = JSON.stringify(out);
})(${JSON.stringify(CHECKS.map(c => ({ id: c.id, name: c.name, run: c.run.toString() })))});`;

module.exports = { CHECKS, RUNNER };
