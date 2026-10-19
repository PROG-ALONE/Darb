/* «الرسم الشارح» — رسوم حيّة تمثّل فكرة الموضوع نفسها (نماذج أولى، ٢٠٢٦-١٠-١٦).
   كل شارح: steps [{ say, params?, pick?, task? }]، params قابلة للتحريك، و
   draw(P, step, t, pick) يرسم المشهد عند الزمن t (ثوانٍ من بداية المرحلة).
   يُفتح من صفحة الموضوع بزر «الرسم الشارح». */
window.EXPLAINERS = window.EXPLAINERS || {};
(function () {
  const E = window.EXPLAINERS;
  const ease = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const cl = (x, a, b) => Math.max(a, Math.min(b, x));
  const A = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const T = (x, y, s, o) => { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.fs || 12) + '" fill="' + (o.c || 'var(--ink)') + '"' + (o.w ? ' font-weight="' + o.w + '"' : '') + (o.op != null ? ' opacity="' + o.op + '"' : '') + (o.ltr ? ' direction="ltr" unicode-bidi="plaintext"' : '') + (o.f ? ' font-family="' + o.f + '"' : '') + '>' + s + '</text>'; };
  const fmt = (v, d) => A(v.toFixed(d));

  /* ───────── ١) الفيزياء: المتسعة ذات الصفيحتين المتوازيتين ───────── */
  E.p12c1t2 = {
    title: 'المتسعة: أين تختزن الطاقة؟',
    vb: [0, 0, 360, 250],
    params: {
      V: { label: 'فرق جهد البطارية V', min: 2, max: 12, step: 1, val: 6, unit: 'فولت' },
      d: { label: 'البعد بين الصفيحتين d', min: 1, max: 5, step: 0.5, val: 3, unit: 'ملم' },
      S: { label: 'مساحة الصفيحة A', min: 1, max: 4, step: 0.5, val: 2, unit: '× ١٠٠ سم²' }
    },
    pick: { val: '', opts: [['field', 'في المجال بين الصفيحتين'], ['battery', 'داخل البطارية'], ['wire', 'في الأسلاك نفسها']] },
    steps: [
      { say: 'تخيّل تجربة بسيطة: ورقتا ألمنيوم وبينهما غلاف بلاستيكي رقيق، ثم يومض مصباح صغير بعد فصل البطارية. أين كانت الطاقة؟ توقّع قبل أن نكشف الفكرة.', params: [], pick: true },
      { say: 'هذا نموذج قريب من الواقع: رقاقتا الألمنيوم هما الصفيحتان الموصلتان، والغلاف البلاستيكي عازل يفصل بينهما. حرّك البعد والمساحة ولاحظ شكل المتسعة.', params: ['S', 'd'], pick: false },
      { say: 'عند غلق المفتاح، تسحب البطارية إلكترونات من إحدى الصفيحتين وتدفعها إلى الأخرى. راقب الإلكترونات وهي تتحرك؛ ثم غيّر جهد البطارية لترى أثره في الشحنة.', params: ['V'], pick: false },
      { say: 'تتراكم شحنتان متساويتان مقدارًا ومتعاكستان إشارةً. ينشأ بين الصفيحتين مجال كهربائي؛ حرّك الجهد أو البعد ولاحظ تغير شدة المجال.', params: ['V', 'd'], pick: false },
      { say: 'نفصل البطارية ونوصل المصباح: تتحرك الشحنات في الدائرة، فيضيء المصباح ثم يخفت. المتسعة لا تصنع الطاقة؛ إنها تخزنها في المجال وتعيدها عند التفريغ.', params: ['V'], pick: false },
      { say: 'السعة C تقيس مقدار الشحنة التي تخزنها المتسعة لكل فولت: C = Q ÷ V. هندسيًا تكبر بزيادة المساحة A، وتكبر بتقليل البعد d: C = ε₀A ÷ d.', params: ['V', 'S', 'd'], task: 'توقّع أولًا: إذا تضاعفت A ونصفنا d، كم مرة تكبر C؟ حرّك المتغيرين وتحقق.', pick: false }
    ],
    calc(P) { const eps = 8.85e-12, Am = P.S * 0.01, dm = P.d * 1e-3; const C = eps * Am / dm; return { C, Q: C * P.V }; },
    read(P, s, t, pick) {
      if (s === 0) {
        if (!pick) return '<span>سؤال البداية: أين تختزن المتسعة الطاقة؟</span>';
        const answer = pick === 'field';
        return '<span>' + (answer ? 'توقّعك صحيح.' : 'قريب، لكن ليس هذا موضع التخزين.') + '</span><span>الطاقة تختزن في المجال الكهربائي بين الصفيحتين، ثم تتحول إلى ضوء في المصباح.</span>';
      }
      if (s === 1) return '<span>الألمنيوم موصل يصنع الصفيحتين.</span><span>البلاستيك عازل يحفظ الفصل بينهما.</span>';
      if (s === 3) return '<span>شدة المجال تزداد بزيادة V.</span><span>وتقل بزيادة d: E ∝ V ÷ d</span>';
      if (s < 3) return '';
      const { C, Q } = this.calc(P);
      return '<span>C = ' + fmt(C * 1e12, 1) + ' بيكوفاراد</span><span>Q = ' + fmt(Q * 1e9, 2) + ' نانوكولوم</span><span>V = ' + A(P.V) + ' فولت</span>' +
        (s === 5 ? '<span>C = Q ÷ V = ε₀A ÷ d</span>' : '');
    },
    draw(P, s, t, pick) {
      const cx = 170, gap = 22 + (s === 5 ? P.d : 3) * 10, h = 74 + (s === 5 ? P.S : 2) * 18;
      const xl = cx - gap / 2 - 8, xr = cx + gap / 2, top = 105 - h / 2;
      const charge = s === 2 ? 1 - Math.exp(-t / 1.7) : s === 4 ? P.V / 6 * Math.exp(-t / 3.2) : s === 0 || s >= 3 ? 1 : 0;
      const Vf = s >= 2 ? P.V / 6 : 1, Cf = s === 5 ? (P.S / P.d) / (2 / 3) : 1;
      const nQ = Math.round(cl(charge * Vf * Cf, 0, 2) * 6);
      let g = '';
      if (s === 0 || s === 1) {
        const fw = 112 + P.S * 18, fx = 160 - fw / 2, foilH = 9, sep = s === 1 ? 5 + P.d * 2 : 12, y1 = 54, y2 = y1 + foilH + sep;
        const pulse = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2));
        g += T(cx, 27, s === 0 ? 'تجربة منزلية: ألمنيوم + بلاستيك' : 'من ماذا صُنعت المتسعة؟', { fs: 13, w: 700, c: 'var(--ink)' });
        g += '<rect x="' + fx + '" y="' + y1 + '" width="' + fw + '" height="' + foilH + '" rx="2" fill="var(--bad-soft)" stroke="var(--bad)" stroke-width="2"/>' +
          '<path d="M' + (fx + 8) + ' ' + (y1 + 3) + 'h' + (fw - 16) + '" stroke="var(--bad)" stroke-width="1" opacity=".5"/>' +
          '<rect x="' + (fx + 9) + '" y="' + (y1 + foilH) + '" width="' + (fw - 18) + '" height="' + sep + '" rx="2" fill="var(--acc-soft)" stroke="var(--acc)" stroke-dasharray="3 2" opacity=".9"/>' +
          '<rect x="' + fx + '" y="' + y2 + '" width="' + fw + '" height="' + foilH + '" rx="2" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2"/>' +
          '<path d="M' + (fx + 8) + ' ' + (y2 + 3) + 'h' + (fw - 16) + '" stroke="var(--acc)" stroke-width="1" opacity=".5"/>';
        g += T(fx + 15, y1 + 8, '+', { fs: 9, w: 800, c: 'var(--bad)' }) + T(fx + fw - 15, y2 + 8, '−', { fs: 10, w: 800, c: 'var(--acc)' });
        g += T(280, y1 + 8, 'رقاقة ألمنيوم', { fs: 9, c: 'var(--bad)' }) +
          T(280, y1 + foilH + sep / 2 + 3, 'بلاستيك عازل', { fs: 9, c: 'var(--acc)' }) +
          T(280, y2 + 8, 'رقاقة ألمنيوم', { fs: 9, c: 'var(--acc)' });
        g += '<path d="M' + fx + ' ' + (y1 + 4) + ' H 62 V 190 H 155 M ' + (fx + fw) + ' ' + (y2 + 4) + ' H 244 V 190 H 185" fill="none" stroke="var(--muted)" stroke-width="2.5"/>';
        if (s === 0) {
          const glow = 0.2 + 0.8 * Math.exp(-t / 2.8);
          g += '<circle cx="170" cy="190" r="14" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3" opacity="' + glow + '"/>' +
            '<path d="M164 190h12m-6-6v12M151 181l-5-4m43 4 5-4m-18-8v-6" stroke="var(--gold)" stroke-width="2" opacity="' + glow + '"/>' +
            T(170, 220, 'مصباح صغير', { fs: 10, c: 'var(--muted)' }) +
            T(cx, 244, 'رقاقتا ألمنيوم يفصل بينهما البلاستيك', { fs: 9, c: 'var(--muted)' });
          if (pick === 'field') g += '<circle cx="170" cy="190" r="19" fill="none" stroke="var(--gold)" stroke-width="1.5" opacity="' + pulse + '"/>';
        } else {
          g += '<path d="M' + (fx + 18) + ' ' + (y2 + 14) + ' H ' + (fx + fw - 18) + '" stroke="var(--gold)" stroke-width="2" stroke-dasharray="4 5" opacity="' + pulse + '"/>' +
            T(cx, 207, 'الصفيحتان لا تلمسان بعضهما', { fs: 10, w: 700, c: 'var(--ink)' }) +
            T(cx, 232, 'غيّر d لتلاحظ أثر المسافة بينهما', { fs: 9, c: 'var(--muted)' });
        }
        return g;
      }
      g += T(cx, 26, s === 4 ? 'تفريغ: الشحنة والتيار يتناقصان' : s === 2 ? 'شحن: التيار يبدأ ثم يضعف' : s === 5 ? 'غيّر A و d و V ولاحظ الأثر' : 'نموذج الصفيحتين المتوازيتين', { fs: 12, w: 700, c: 'var(--ink)' });
      g += '<rect x="' + (xl + 8) + '" y="' + (top + 4) + '" width="' + Math.max(2, xr - xl - 8) + '" height="' + (h - 8) + '" rx="2" fill="var(--soft)" stroke="var(--line)" stroke-dasharray="4 3" opacity=".8"/>';
      g += '<rect x="' + xl + '" y="' + top + '" width="8" height="' + h + '" rx="2" fill="var(--bad-soft)" stroke="var(--bad)" stroke-width="2"/>' +
        '<rect x="' + xr + '" y="' + top + '" width="8" height="' + h + '" rx="2" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2"/>';
      if (s >= 3) {
        const fieldLines = s === 3 ? Math.round(cl((P.V / P.d) * 2, 2, 7)) : 5;
        const fieldStrength = cl(P.V / P.d / 2, 0.25, 1);
        for (let i = 0; i < fieldLines; i++) {
          const y = top + (i + 0.5) * h / fieldLines;
          g += '<line x1="' + (xl + 12) + '" y1="' + y + '" x2="' + (xr - 6) + '" y2="' + y + '" stroke="var(--gold)" stroke-width="' + (1.2 + fieldStrength) + '" marker-end="url(#xg)" opacity="' + (0.35 + 0.65 * charge) + '"/>';
        }
      }
      for (let i = 0; i < nQ; i++) { const y = top + 8 + (i + 0.5) * (h - 16) / nQ; g += T(xl - 11, y + 4, '+', { fs: 14, w: 800, c: 'var(--bad)' }) + T(xr + 19, y + 4, '−', { fs: 15, w: 800, c: 'var(--acc)' }); }
      g += T(cx, top - 10, 'عازل بين الصفيحتين', { fs: 10, c: 'var(--muted)' });
      if (s === 2 || s === 3) {
        g += '<path d="M' + (xl + 4) + ' ' + (top + h) + ' V 208 H 116 M 224 208 H ' + (xr + 4) + ' V ' + (top + h) + '" fill="none" stroke="var(--muted)" stroke-width="2.5"/>' +
          '<line x1="116" y1="195" x2="116" y2="221" stroke="var(--ink)" stroke-width="3"/><line x1="127" y1="201" x2="127" y2="215" stroke="var(--ink)" stroke-width="5"/>' +
          '<line x1="213" y1="195" x2="213" y2="221" stroke="var(--ink)" stroke-width="3"/><line x1="224" y1="201" x2="224" y2="215" stroke="var(--ink)" stroke-width="5"/>' +
          T(105, 196, '+', { fs: 12, w: 700, c: 'var(--bad)' }) + T(237, 196, '−', { fs: 12, w: 700, c: 'var(--acc)' }) + T(cx, 238, 'بطارية', { fs: 10, c: 'var(--muted)' });
        if (s === 2) {
          const travel = Math.max(0, 208 - (top + h));
          for (let i = 0; i < 4; i++) {
            const f = ((t * 0.45 + i / 4) % 1), yLeft = top + h + f * travel, yRight = 208 - f * travel;
            g += '<circle cx="' + (xl + 4) + '" cy="' + yLeft + '" r="3.2" fill="var(--acc)"/><circle cx="' + (xr + 4) + '" cy="' + yRight + '" r="3.2" fill="var(--acc)"/>';
          }
          g += T(284, 105, 'I', { fs: 14, w: 700, c: 'var(--ok)' });
        }
      }
      if (s === 4) {
        const glow = 0.25 + 0.75 * charge;
        g += '<path d="M' + (xl + 4) + ' ' + (top + h) + ' V 198 H 155 M ' + (xr + 4) + ' ' + (top + h) + ' V 198 H 185" fill="none" stroke="var(--muted)" stroke-width="2.5"/>' +
          '<circle cx="170" cy="198" r="15" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3" opacity="' + glow + '"/>' +
          '<path d="M164 198h12m-6-6v12" stroke="var(--gold)" stroke-width="2" opacity="' + glow + '"/>' + T(170, 226, 'مصباح', { fs: 10, c: 'var(--muted)' }) +
          '<rect x="282" y="88" width="7" height="30" rx="3" fill="var(--soft)"/><rect x="282" y="' + (118 - 30 * charge) + '" width="7" height="' + (30 * charge) + '" rx="3" fill="var(--ok)"/>' + T(286, 133, 'Q', { fs: 10, c: 'var(--muted)' });
      }
      if (s === 5) g += '<line x1="' + (xl + 8) + '" y1="' + (top + h + 12) + '" x2="' + xr + '" y2="' + (top + h + 12) + '" stroke="var(--ink)" stroke-width="1"/>' + T(cx, top + h + 25, 'd', { fs: 12, w: 700, f: 'serif' }) + T(cx, 238, 'C ∝ A ÷ d  |  Q = C × V', { fs: 11, w: 700, c: 'var(--acc)', ltr: true });
      if (s === 2) { const I = Math.exp(-t / 1.7); g += '<rect x="102" y="42" width="136" height="6" rx="3" fill="var(--soft)"/><rect x="102" y="42" width="' + (136 * I) + '" height="6" rx="3" fill="var(--ok)"/>'; }
      return g;
    }
  };

  /* ───────── ٢) الكيمياء: التفاعل الانعكاسي وحالة الاتزان ───────── */
  E.k12c2t2 = {
    title: 'كيف يصل التفاعل الانعكاسي إلى الاتزان؟',
    vb: [360, 240],
    params: { K: { label: 'ثابت الاتزان Kc', min: 0.25, max: 4, step: 0.25, val: 1 } },
    steps: [
      { say: 'نبدأ بالمادة المتفاعلة A وحدها (أزرق) في إناء مغلق. التفاعل الأمامي (تحوّل A إلى B) سريع لأن جزيئات A كثيرة.', params: [] },
      { say: 'كلما تكوّن الناتج B (برتقالي) بدأ التفاعل العكسي يعيد بعضه إلى A. الأمامي يبطؤ والعكسي يتسارع.', params: [] },
      { say: 'تتساوى السرعتان: هذه حالة الاتزان. التراكيز ثابتة لا تتغير — لكن التفاعل لم يتوقف! انظر: الجزيئات ما زالت تتبدّل (اتزان ديناميكي).', params: [] },
      { say: 'موضع الاتزان يحدده ثابت الاتزان Kc، وهو تركيز B مقسومًا على تركيز A عند الاتزان. حرّك Kc: كلما كبر رجحت كفّة النواتج.', params: ['K'], task: 'اجعل Kc = ٤ ثم ١/٤: أين يستقر أغلب الجزيئات في كل حالة؟' }
    ],
    frac(P, s) { const K = s >= 3 ? P.K : 1; return K / (1 + K); },
    read(P, s, t) { const f = this.frac(P, s), tt = s === 0 ? t * 0.6 : s === 1 ? 2 + t * 0.8 : 10, x = f * (1 - Math.exp(-tt / 2.5)); return '<span>[A] = ' + fmt(1 - x, 2) + '</span><span>[B] = ' + fmt(x, 2) + '</span>' + (s >= 2 ? '<span>Kc = ' + fmt(x / Math.max(1e-6, 1 - x), 2) + '</span>' : ''); },
    draw(P, s, t) {
      const f = this.frac(P, s);
      const tt = s === 0 ? Math.min(t * 0.6, 2) : s === 1 ? Math.min(2 + t * 0.8, 9) : 10 + t;
      const x = f * (1 - Math.exp(-tt / 2.5));
      const N = 24, nB = Math.round(x * N);
      let g = '<rect x="12" y="20" width="160" height="190" rx="14" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/>' + T(92, 228, 'إناء مغلق', { fs: 11, c: 'var(--muted)' });
      /* تبديل ديناميكي: عند الاتزان تتبادل أزواج الأدوار باستمرار */
      const swap = s >= 2 ? Math.floor(t * 2) : -1;
      for (let i = 0; i < N; i++) {
        const c0 = i % 6, r0 = Math.floor(i / 6), px = 30 + c0 * 25 + ((r0 % 2) * 12) + 8 * Math.sin(t * 1.3 + i * 1.7), py = 46 + r0 * 42 + 9 * Math.cos(t * 1.1 + i * 2.3);
        let isB = i < nB;
        if (swap >= 0 && nB > 0 && nB < N) { const a = (swap * 7) % nB, b = nB + (swap * 5) % (N - nB); if (i === a) isB = false; if (i === b) isB = true; }
        g += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="7" fill="' + (isB ? '#E0912B' : '#3B6FE0') + '" opacity=".9"/>';
      }
      /* الرسم البياني */
      const gx = 196, gy = 30, gw = 150, gh = 150;
      g += '<line x1="' + gx + '" y1="' + (gy + gh) + '" x2="' + (gx + gw) + '" y2="' + (gy + gh) + '" stroke="var(--muted)"/><line x1="' + gx + '" y1="' + gy + '" x2="' + gx + '" y2="' + (gy + gh) + '" stroke="var(--muted)"/>';
      g += T(gx + gw / 2, gy + gh + 18, 'الزمن ←', { fs: 10, c: 'var(--muted)' }) + T(gx + 4, gy - 8, 'التركيز', { fs: 10, c: 'var(--muted)', a: 'start' });
      const tmax = 12, pts = (fn) => { let d = ''; for (let k = 0; k <= 60; k++) { const u = k / 60 * Math.min(tt, tmax), X = f * (1 - Math.exp(-u / 2.5)); d += (k ? 'L' : 'M') + (gx + u / tmax * gw).toFixed(1) + ' ' + (gy + gh - fn(X) * gh).toFixed(1); } return d; };
      g += '<path d="' + pts(X => 1 - X) + '" fill="none" stroke="#3B6FE0" stroke-width="2.5"/><path d="' + pts(X => X) + '" fill="none" stroke="#E0912B" stroke-width="2.5"/>';
      if (tt >= 8) { const xe = gx + Math.min(8, tmax) / tmax * gw; g += '<line x1="' + xe + '" y1="' + gy + '" x2="' + xe + '" y2="' + (gy + gh) + '" stroke="var(--ok)" stroke-dasharray="4 3"/>' + T(xe + 3, gy + 12, 'اتزان', { fs: 11, w: 700, c: 'var(--ok)', a: 'start' }); }
      g += T(gx + gw - 2, gy + gh - (1 - x) * gh - 6, '[A]', { fs: 11, w: 700, c: '#3B6FE0', a: 'end', ltr: true }) + T(gx + gw - 2, gy + gh - x * gh - 6, '[B]', { fs: 11, w: 700, c: '#E0912B', a: 'end', ltr: true });
      /* سهما السرعتين */
      const vf = (1 - x), vb = s >= 1 || tt > 0.3 ? x / Math.max(0.2, f / (1 - f)) * (f / (1 - f)) : 0;
      const kf = 1, kb = (1 - f) / f; const rf = kf * (1 - x), rb = kb * x;
      g += T(92, 14, 'الأمامي ' + (rf > rb * 1.15 ? 'أسرع' : rb > rf * 1.15 ? 'أبطأ' : '= العكسي'), { fs: 11, w: 700, c: rf > rb * 1.15 || rb > rf * 1.15 ? 'var(--ink)' : 'var(--ok)' });
      return g;
    }
  };

  /* ───────── ٣) الرياضيات: لماذا i² = −1؟ قوى i دورانٌ ربعَ دورة ───────── */
  E.m12c1t1 = {
    title: 'العدد i: دوران ربع دورة',
    vb: [360, 260],
    params: { n: { label: 'الأس n في iⁿ', min: 0, max: 12, step: 1, val: 5 } },
    steps: [
      { say: 'على خط الأعداد: الضرب في −1 يقلب العدد إلى الجهة المقابلة — أي دوران نصف دورة (١٨٠°).', params: [] },
      { say: 'فأيّ عدد إذا ضربنا فيه مرتين حصلنا على نصف دورة؟ عدد يُدير ربع دورة (٩٠°) — سمّيناه i. لذلك i × i = −1، أي i² = −1.', params: [] },
      { say: 'كل ضرب في i ربعُ دورة: 1 ← i ← −1 ← −i ← 1 … كل أربع خطوات نعود إلى البداية.', params: [] },
      { say: 'لحساب iⁿ لا تحتاج أن تضرب n مرة: اقسم n على ٤؛ الدورات الكاملة لا تغيّر شيئًا، والباقي r وحده يحدد الموضع على الدائرة — فقيمة i مرفوعًا للأس n تساوي قيمته مرفوعًا للباقي r.', params: ['n'], task: 'جرّب n = ٧ ثم ١١: لماذا يعطيان النتيجة نفسها؟' }
    ],
    val: r => ['1', 'i', '−1', '−i'][r],
    read(P, s) { if (s < 3) return ''; const r = P.n % 4; return '<span>n = ' + A(P.n) + ' = ٤ × ' + A(Math.floor(P.n / 4)) + ' + ' + A(r) + '</span><span dir="ltr">i<sup>' + P.n + '</sup> = i<sup>' + r + '</sup> = ' + this.val(r) + '</span>'; },
    draw(P, s, t) {
      const cx = 180, cy = 130, R = 85;
      let g = '<line x1="40" y1="' + cy + '" x2="320" y2="' + cy + '" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#xa)"/>';
      if (s >= 1) g += '<line x1="' + cx + '" y1="245" x2="' + cx + '" y2="20" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#xa)"/>' + T(cx + 8, 26, 'تخيلي', { fs: 10, c: 'var(--muted)', a: 'start' });
      g += T(318, cy + 18, 'حقيقي', { fs: 10, c: 'var(--muted)', a: 'end' });
      if (s >= 1) g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="var(--line)" stroke-dasharray="4 4"/>';
      const lab = [[cx + R + 14, cy + 5, '1'], [cx + 10, cy - R - 6, 'i'], [cx - R - 16, cy + 5, '−1'], [cx + 12, cy + R + 16, '−i']];
      lab.forEach((l, i) => { if (s >= 1 || i % 2 === 0) g += T(l[0], l[1], l[2], { fs: 15, w: 700, f: 'serif', ltr: true, c: i === 1 || i === 3 ? 'var(--acc)' : 'var(--ink)' }); });
      let ang;
      if (s === 0) ang = Math.PI * ease((t % 4) / 2);
      else if (s === 1) ang = (Math.PI / 2) * Math.min(2, Math.floor((t % 6) / 1.5) + ease(((t % 6) % 1.5) / 0.8));
      else if (s === 2) { const k = Math.floor(t / 1.4), u = ease((t % 1.4) / 0.7); ang = (Math.PI / 2) * (k + u); }
      else ang = (Math.PI / 2) * P.n;
      const ex = cx + R * Math.cos(ang), ey = cy - R * Math.sin(ang);
      g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) + '" stroke="var(--acc)" stroke-width="4" stroke-linecap="round"/><circle cx="' + ex.toFixed(1) + '" cy="' + ey.toFixed(1) + '" r="7" fill="var(--acc)"/>';
      const deg = Math.round(ang * 180 / Math.PI);
      if (s <= 2) g += '<path d="M ' + (cx + 26) + ' ' + cy + ' A 26 26 0 ' + ((ang % (2 * Math.PI)) > Math.PI ? 1 : 0) + ' 0 ' + (cx + 26 * Math.cos(ang)).toFixed(1) + ' ' + (cy - 26 * Math.sin(ang)).toFixed(1) + '" fill="none" stroke="var(--gold)" stroke-width="2"/>' + T(cx - 34, cy - 30, A(deg % 360) + '°', { fs: 12, w: 700, c: 'var(--gold)' });
      if (s === 1) g += T(cx, 250, 'ضرب في i مرة = ٩٠° | مرتين = ١٨٠° = الضرب في −١', { fs: 11.5, w: 700, c: 'var(--ink)' });
      if (s === 2) { const k = Math.floor(t / 1.4) % 4; g += T(cx, 250, 'i<tspan baseline-shift="super" font-size="10">' + (Math.floor(t / 1.4) + 1) + '</tspan> = ' + ['i', '−1', '−i', '1'][k], { fs: 15, w: 700, ltr: true, f: 'serif' }); }
      if (s === 3) { const r = P.n % 4; [0, 1, 2, 3].forEach(i => { const a = i * Math.PI / 2; g += '<circle cx="' + (cx + R * Math.cos(a)).toFixed(1) + '" cy="' + (cy - R * Math.sin(a)).toFixed(1) + '" r="' + (i === r ? 13 : 5) + '" fill="none" stroke="' + (i === r ? 'var(--ok)' : 'var(--line)') + '" stroke-width="2.5"/>'; }); }
      return g;
    }
  };

  E.m12c3t1 = {
    title: 'المعدلات المرتبطة: كيف يتغير ارتفاع الماء؟',
    visualMode: 'derivative',
    vb: [420, 260],
    params: {
      h: { label: 'ارتفاع الماء h', min: 1, max: 8, step: 1, val: 4, unit: 'م' },
      area: { label: 'مساحة مقطع الخزان A', min: 2, max: 6, step: 1, val: 4, unit: 'م²' },
      rate: { label: 'معدل تغير الحجم dV/dt', min: -1, max: 1, step: 0.1, val: -0.4, unit: 'م³/ث' }
    },
    steps: [
      { say: 'نموذج الخزان: مساحة مقطعه ثابتة A، وارتفاع الماء h. حرّك الارتفاع لترى أن الحجم يتناسب معه.', params: ['h', 'area'] },
      { say: 'الحجم V = A·h. بما أن A ثابتة، فإن اشتقاق العلاقة بالنسبة إلى الزمن يعطي dV/dt = A·dh/dt.', params: ['area', 'rate'] },
      { say: 'معدل الارتفاع لا يُقرأ بالتخمين: نقسم معدل الحجم على مساحة المقطع. الإشارة السالبة تعني أن الماء ينخفض.', params: ['h', 'area', 'rate'] },
      { say: 'مثال الكتاب: مساحة القاعدة ٤ م² والتسرّب ٠٫٤ م³/ث؛ إذن dh/dt = −٠٫٤ ÷ ٤ = −٠٫١ م/ث. غيّر القيم لترى أثر كل كمية.', params: ['h', 'area', 'rate'], task: 'ثبّت مساحة المقطع، ثم غيّر dV/dt: هل يتغير اتجاه السهم أم سرعته فقط؟' }
    ],
    read(P, s) {
      const dh = P.rate / P.area, A2 = n => A(Number(n).toFixed(2));
      if (s === 0) return '<span>V = A · h</span><span>حجم الماء = مساحة المقطع × الارتفاع</span>';
      if (s === 1) return '<span>dV/dt = A · dh/dt</span><span>نشتق العلاقة بالنسبة إلى الزمن t</span>';
      return '<span>dV/dt = ' + A2(P.rate) + ' م³/ث</span><span>A = ' + A2(P.area) + ' م²</span><span>dh/dt = ' + A2(dh) + ' م/ث</span>';
    },
    draw(P, s) {
      const tank = { x: 38, y: 54, w: 112, h: 146 }, fillH = tank.h * P.h / 8;
      const surface = tank.y + tank.h - fillH, rate = P.rate, dh = rate / P.area;
      const baseY = 190 - (P.h / 8) * 120, delta = Math.max(-46, Math.min(46, dh * 260));
      let g = '<text x="94" y="28" text-anchor="middle" fill="var(--ink)" font-size="14" font-weight="700">الخزان</text>' +
        '<rect x="' + tank.x + '" y="' + surface.toFixed(1) + '" width="' + tank.w + '" height="' + fillH.toFixed(1) + '" fill="var(--acc-soft)"/>' +
        '<path d="M' + tank.x + ' ' + tank.y + ' V' + (tank.y + tank.h) + ' H' + (tank.x + tank.w) + ' V' + tank.y + '" fill="none" stroke="var(--muted)" stroke-width="3"/>' +
        '<line x1="' + (tank.x + 5) + '" y1="' + surface.toFixed(1) + '" x2="' + (tank.x + tank.w - 5) + '" y2="' + surface.toFixed(1) + '" stroke="var(--acc)" stroke-width="3"/>' +
        '<line x1="166" y1="' + (surface + 5).toFixed(1) + '" x2="166" y2="' + (tank.y + tank.h).toFixed(1) + '" stroke="var(--gold)" stroke-width="2"/>' +
        T(174, (surface + tank.y + tank.h) / 2, 'h', { fs: 15, w: 700, f: 'serif', c: 'var(--gold)', a: 'start' }) +
        T(94, 222, 'dV/dt = A · dh/dt', { fs: 12, w: 700, ltr: true, c: 'var(--acc)' });
      const gx = 220, gy = 45, gw = 174, gh = 154;
      g += '<text x="' + (gx + gw / 2) + '" y="28" text-anchor="middle" fill="var(--ink)" font-size="14" font-weight="700">الارتفاع مع الزمن</text>' +
        '<line x1="' + gx + '" y1="' + (gy + gh / 2) + '" x2="' + (gx + gw) + '" y2="' + (gy + gh / 2) + '" stroke="var(--line)"/>' +
        '<line x1="' + gx + '" y1="' + gy + '" x2="' + gx + '" y2="' + (gy + gh) + '" stroke="var(--muted)" stroke-width="1.5"/>' +
        '<line x1="' + gx + '" y1="' + baseY.toFixed(1) + '" x2="' + (gx + gw) + '" y2="' + (baseY - delta).toFixed(1) + '" stroke="' + (rate < 0 ? 'var(--bad)' : 'var(--ok)') + '" stroke-width="3" stroke-linecap="round" marker-end="url(#xa)"/>' +
        '<circle cx="' + (gx + gw / 2) + '" cy="' + (baseY - delta / 2).toFixed(1) + '" r="5" fill="var(--gold)"/>' +
        T(gx + gw - 8, gy + gh + 19, 't', { fs: 12, w: 700, f: 'serif', c: 'var(--muted)', a: 'end' }) +
        T(gx + 9, gy + 15, 'h', { fs: 12, w: 700, f: 'serif', c: 'var(--muted)', a: 'start' }) +
        T(gx + gw / 2, 232, (rate < 0 ? 'الماء ينخفض' : rate > 0 ? 'الماء يرتفع' : 'الارتفاع ثابت'), { fs: 11, w: 700, c: rate < 0 ? 'var(--bad)' : 'var(--ok)' });
      return g;
    }
  };

  E.m12c4t3 = {
    title: 'التكامل المحدد: عدد تحصره المجاميع',
    visualMode: 'integral',
    vb: [360, 260],
    params: { n: { label: 'عدد الفترات الجزئية n', min: 2, max: 8, step: 1, val: 4 } },
    steps: [
      { say: 'نبدأ بمنحنى f(x)=4−x² على الفترة [−2، 2]. المنطقة بين المنحنى والمحور تمثل التكامل المحدد.', params: [] },
      { say: 'قسّم الفترة إلى أجزاء. المستطيلات الداخلية تعطي مجموعًا سفليًا، والمستطيلات الخارجية تعطي مجموعًا علويًا.', params: ['n'] },
      { say: 'كلما زاد عدد الأجزاء اقترب المجموعان، وحصرا العدد الوحيد ∫ من −٢ إلى ٢ (٤−x²) dx = ٣٢/٣.', params: ['n'], task: 'زد n ولاحظ كيف يضيق الفرق بين الحدّين حول قيمة التكامل.' }
    ],
    bounds(n) {
      const dx = 4 / n; let lower = 0, upper = 0;
      for (let i = 0; i < n; i++) {
        const a = -2 + i * dx, b = a + dx, vals = [4 - a * a, 4 - b * b];
        if (a <= 0 && b >= 0) vals.push(4);
        lower += Math.min(...vals) * dx; upper += Math.max(...vals) * dx;
      }
      return { lower, upper };
    },
    read(P, s) {
      if (!s) return '<span>f(x) = ٤ − x²</span><span>الفترة: [−٢، ٢]</span>';
      const { lower, upper } = this.bounds(P.n), f = v => A(v.toFixed(2));
      return '<span>Lₙ = ' + f(lower) + '</span><span>∫ = ٣٢/٣ ≈ ١٠٫٦٧</span><span>Uₙ = ' + f(upper) + '</span>';
    },
    draw(P, s) {
      const x0 = 42, x1 = 326, y0 = 208, y1 = 38, xmin = -2.3, xmax = 2.3, ymin = -1, ymax = 4.7;
      const px = x => x0 + (x - xmin) / (xmax - xmin) * (x1 - x0), py = y => y0 - (y - ymin) / (ymax - ymin) * (y0 - y1);
      const f = x => 4 - x * x, n = s ? P.n : 0, dx = 4 / Math.max(1, n);
      let g = '<line x1="' + x0 + '" y1="' + py(0) + '" x2="' + x1 + '" y2="' + py(0) + '" stroke="var(--muted)" stroke-width="1.5"/>' +
        '<line x1="' + px(0) + '" y1="' + y1 + '" x2="' + px(0) + '" y2="' + y0 + '" stroke="var(--muted)" stroke-width="1.5"/>';
      let curve = '<path d="';
      for (let i = 0; i <= 64; i++) {
        const x = -2 + 4 * i / 64;
        curve += (i ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(f(x)).toFixed(1);
      }
      curve += '" fill="none" stroke="var(--acc)" stroke-width="3" stroke-linecap="round"/>';
      if (n) for (let i = 0; i < n; i++) {
        const a = -2 + i * dx, b = a + dx, vals = [f(a), f(b)];
        if (a <= 0 && b >= 0) vals.push(4);
        const lo = Math.min(...vals), hi = Math.max(...vals), x = px(a), w = px(b) - x;
        g += '<rect x="' + x.toFixed(1) + '" y="' + py(lo).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (py(0) - py(lo)).toFixed(1) + '" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="1"/>' +
          '<rect x="' + x.toFixed(1) + '" y="' + py(hi).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (py(0) - py(hi)).toFixed(1) + '" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="4 3"/>';
      }
      g += curve;
      g += '<text x="' + px(-2) + '" y="' + (py(0) + 17) + '" text-anchor="middle" fill="var(--muted)" font-size="11">−٢</text>' +
        '<text x="' + px(2) + '" y="' + (py(0) + 17) + '" text-anchor="middle" fill="var(--muted)" font-size="11">٢</text>' +
        T(284, 26, 'f(x) = ٤ − x²', { fs: 12, w: 700, ltr: true, c: 'var(--acc)' });
      return g;
    }
  };

  E.m12c4t6 = {
    title: 'التكامل غير المحدد: عائلة دوال',
    visualMode: 'integral',
    vb: [360, 260],
    params: { C: { label: 'الثابت التكاملي C', min: -2, max: 2, step: 1, val: 0 } },
    steps: [
      { say: 'نبحث عن دالة مشتقتها x. إحدى الدوال المقابلة هي F(x)=x²/2؛ يظهر منحناها باللون البارز.', params: [] },
      { say: 'إضافة ثابت C ترفع المنحنى أو تخفضه ولا تغيّر ميله؛ لذلك توجد عائلة لا نهائية من الدوال المقابلة.', params: ['C'] },
      { say: 'التكامل غير المحدد يكتب ∫x dx = x²/2 + C. جرّب قيمًا مختلفة لـ C: تتبدل قيمة F، لكن مشتقتها تبقى x.', params: ['C'], task: 'اختر C=−٢ ثم C=٢: هل يتغير ميل المنحنى عند x=1؟' }
    ],
    read(P, s) {
      if (!s) return '<span>F(x) = x²/2</span><span>F′(x) = x</span>';
      return '<span>∫x dx = x²/2 + C</span><span>C = ' + A(P.C) + '</span><span>عند x=٢: F(٢) = ' + A(2 + P.C) + '</span><span>المشتقة F′(x)=x لا تعتمد على C</span>';
    },
    draw(P, s) {
      const left = 42, right = 330, top = 34, bottom = 214, X = x => left + (x + 3) / 6 * (right - left), Y = y => bottom - (y + 3) / 10 * (bottom - top);
      let g = '<line x1="' + left + '" y1="' + Y(0) + '" x2="' + right + '" y2="' + Y(0) + '" stroke="var(--muted)" stroke-width="1.5"/>' +
        '<line x1="' + X(0) + '" y1="' + top + '" x2="' + X(0) + '" y2="' + bottom + '" stroke="var(--muted)" stroke-width="1.5"/>';
      const offsets = s === 0 ? [P.C] : [-2, 0, 2], colors = ['var(--gold)', 'var(--acc)', 'var(--ok)'];
      offsets.forEach((c, ci) => {
        let d = '';
        for (let i = 0; i <= 60; i++) {
          const x = -3 + i / 10, y = x * x / 2 + c;
          d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1);
        }
        const selected = offsets.length === 1 || c === P.C;
        g += '<path d="' + d + '" fill="none" stroke="' + (selected ? 'var(--acc)' : colors[ci]) + '" stroke-width="' + (selected ? 3.5 : 2) + '" opacity="' + (selected ? 1 : 0.72) + '"/>';
        if (s > 0) g += T(X(2.35), Y(2.35 * 2.35 / 2 + c) - 4, 'C=' + A(c), { fs: 10, w: 700, c: colors[ci], a: 'end', ltr: true });
      });
      g += T(280, 24, 'F(x) = x²/2 + C', { fs: 12, w: 700, ltr: true, c: 'var(--ink)' });
      return g;
    }
  };

  /* ───────── ٤) الأحياء: الانقسام الخيطي ───────── */
  E.b12c1t8 = {
    title: 'الانقسام الخيطي: خلية واحدة ← خليتان متطابقتان',
    vb: [360, 240],
    steps: [
      { say: 'الطور البيني: الخلية تنمو وتضاعف مادتها الوراثية. الكروماتين خيوط رفيعة داخل النواة لا تُرى كروموسومات بعد.' },
      { say: 'الطور التمهيدي: تتكثف الخيوط فتظهر الكروموسومات، كل كروموسوم كروماتيدان متصلان بالقطعة المركزية، ويختفي غشاء النواة وتبدأ خيوط المغزل.' },
      { say: 'الطور الاستوائي: تصطف الكروموسومات على خط استواء الخلية، وتتصل خيوط المغزل بقطعها المركزية من القطبين.' },
      { say: 'الطور الانفصالي: تنشطر القطع المركزية، فيُسحب كل كروماتيد إلى قطب مقابل — نسخة كاملة إلى كل جهة.' },
      { say: 'الطور النهائي وانقسام السايتوبلازم: تتكوّن نواتان، وتنخصر الخلية من الوسط فتنتج خليتان، في كل منهما العدد نفسه من الكروموسومات.' }
    ],
    read(P, s) { return '<span>عدد الكروموسومات: ' + (s < 4 ? '٤ في الخلية الأم' : '٤ في كل خلية بنت') + '</span>'; },
    draw(P, s, t) {
      const u = ease(t / 1.8), cx = 180, cy = 118;
      const cols = ['#D9534F', '#D9534F', '#3B6FE0', '#3B6FE0'], lens = [26, 18, 26, 18];
      let g = '';
      /* الخلية */
      if (s < 4) g += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (120 + (s === 3 ? 18 * u : 0)) + '" ry="88" fill="rgba(18,160,122,.08)" stroke="#12A07A" stroke-width="2.5"/>';
      else { const pinch = 88 - 70 * u; g += '<path d="M ' + cx + ' ' + (cy - pinch) + ' C ' + (cx - 30) + ' ' + (cy - 88) + ' ' + (cx - 150) + ' ' + (cy - 92) + ' ' + (cx - 150) + ' ' + cy + ' C ' + (cx - 150) + ' ' + (cy + 92) + ' ' + (cx - 30) + ' ' + (cy + 88) + ' ' + cx + ' ' + (cy + pinch) + ' C ' + (cx + 30) + ' ' + (cy + 88) + ' ' + (cx + 150) + ' ' + (cy + 92) + ' ' + (cx + 150) + ' ' + cy + ' C ' + (cx + 150) + ' ' + (cy - 92) + ' ' + (cx + 30) + ' ' + (cy - 88) + ' ' + cx + ' ' + (cy - pinch) + 'Z" fill="rgba(18,160,122,.08)" stroke="#12A07A" stroke-width="2.5"/>'; }
      /* النواة */
      if (s === 0 || s === 1) g += '<circle cx="' + cx + '" cy="' + cy + '" r="52" fill="rgba(124,92,224,.08)" stroke="#7C5CE0" stroke-width="2" stroke-dasharray="' + (s === 1 ? (3 + 10 * u) + ' ' + (3 + 14 * u) : 'none') + '" opacity="' + (s === 1 ? 1 - 0.7 * u : 1) + '"/>';
      if (s === 4) [cx - 85, cx + 85].forEach(x => g += '<circle cx="' + x + '" cy="' + cy + '" r="' + (30 * u) + '" fill="rgba(124,92,224,.08)" stroke="#7C5CE0" stroke-width="2" opacity="' + u + '"/>');
      /* المغزل */
      if (s >= 1 && s <= 3) { const op = s === 1 ? u : 1, pl = cx - 112 - (s === 3 ? 18 * u : 0), pr = cx + 112 + (s === 3 ? 18 * u : 0); for (let i = -3; i <= 3; i++) { const y = cy + i * 20; g += '<path d="M ' + pl + ' ' + cy + ' Q ' + cx + ' ' + (y + (y - cy) * .4) + ' ' + pr + ' ' + cy + '" fill="none" stroke="var(--muted)" stroke-width="1" opacity="' + (0.5 * op) + '"/>'; } g += '<circle cx="' + pl + '" cy="' + cy + '" r="5" fill="var(--gold)"/><circle cx="' + pr + '" cy="' + cy + '" r="5" fill="var(--gold)"/>'; }
      /* الكروموسومات */
      const chromo = (x, y, L, c, sep, rot) => { const a = rot || 0; const kx = Math.cos(a), ky = Math.sin(a); const seg = (dx) => '<line x1="' + (x + dx * kx - 0).toFixed(1) + '" y1="' + (y - L / 2).toFixed(1) + '" x2="' + (x + dx * kx).toFixed(1) + '" y2="' + (y + L / 2).toFixed(1) + '" stroke="' + c + '" stroke-width="6" stroke-linecap="round"/>'; return seg(-sep) + seg(sep) + '<circle cx="' + x + '" cy="' + y + '" r="3.5" fill="var(--ink)"/>'; };
      if (s === 0) { for (let i = 0; i < 4; i++) { let d = ''; for (let k = 0; k < 14; k++) { const a = k * .9 + i * 1.6 + t * .3; d += (k ? 'L' : 'M') + (cx - 30 + i * 18 + 10 * Math.sin(a)).toFixed(1) + ' ' + (cy - 32 + k * 5 + 4 * Math.cos(a * 1.3)).toFixed(1); } g += '<path d="' + d + '" fill="none" stroke="' + cols[i] + '" stroke-width="1.6" opacity=".8"/>'; } }
      const home = [[cx - 26, cy - 22], [cx + 22, cy - 18], [cx - 18, cy + 22], [cx + 26, cy + 20]];
      const eq = [[cx, cy - 66], [cx, cy - 22], [cx, cy + 22], [cx, cy + 66]];
      if (s === 1) home.forEach((p, i) => g += '<g opacity="' + u + '">' + chromo(p[0], p[1], lens[i], cols[i], 4, 0) + '</g>');
      if (s === 2) home.forEach((p, i) => { const x = p[0] + (eq[i][0] - p[0]) * u, y = p[1] + (eq[i][1] - p[1]) * u; g += chromo(x, y, lens[i], cols[i], 4, 0); });
      if (s === 2 && u > .8) g += '<line x1="' + cx + '" y1="' + (cy - 92) + '" x2="' + cx + '" y2="' + (cy + 92) + '" stroke="var(--gold)" stroke-dasharray="5 4"/>' + T(cx, 228, 'خط الاستواء', { fs: 11, c: 'var(--gold)', w: 700 });
      if (s === 3) eq.forEach((p, i) => { const dx = 95 * u; [-1, 1].forEach(sd => { const x = p[0] + sd * (4 + dx); g += '<line x1="' + x + '" y1="' + (p[1] - lens[i] / 2) + '" x2="' + (x - sd * 6 * u) + '" y2="' + (p[1] + lens[i] / 2) + '" stroke="' + cols[i] + '" stroke-width="6" stroke-linecap="round"/><circle cx="' + x + '" cy="' + p[1] + '" r="3" fill="var(--ink)"/>'; }); });
      if (s === 4) [cx - 85, cx + 85].forEach(x0 => { for (let i = 0; i < 4; i++) { let d = ''; for (let k = 0; k < 9; k++) { const a = k + i * 2 + t * .3; d += (k ? 'L' : 'M') + (x0 - 14 + i * 9 + 4 * Math.sin(a)).toFixed(1) + ' ' + (cy - 18 + k * 4.5).toFixed(1); } g += '<path d="' + d + '" fill="none" stroke="' + cols[i] + '" stroke-width="1.5" opacity="' + u + '"/>'; } });
      const names = ['الطور البيني', 'التمهيدي', 'الاستوائي', 'الانفصالي', 'النهائي + انقسام السايتوبلازم'];
      g += T(cx, 16, names[s], { fs: 13, w: 800, c: '#12A07A' });
      return g;
    }
  };

  /* ───────── ٥) التربية الإسلامية: أحكام النون الساكنة والتنوين ───────── */
  const NUN = {
    'ء': ['izhar', 'مَنْ آمَنَ'], 'ح': ['izhar', 'مِنْ حَكِيمٍ'], 'خ': ['izhar', 'مِنْ خَيْرٍ'], 'ع': ['izhar', 'مَنْ عَمِلَ'],
    'ي': ['idgh', 'مَنْ يَقُولُ'], 'ن': ['idgh', 'مِنْ نِعْمَةٍ'], 'م': ['idgh', 'مِنْ مَالٍ'], 'و': ['idgh', 'مِنْ وَالٍ'],
    'ل': ['idgl', 'مِنْ لَدُنْهُ'], 'ر': ['idgl', 'مِنْ رَبِّهِمْ'],
    'ب': ['iqlab', 'مِنْ بَعْدِ'],
    'ت': ['ikhfa', 'مِنْ تَحْتِهَا'], 'ك': ['ikhfa', 'مِنْ كُلِّ'], 'ص': ['ikhfa', 'مِنْ صَلْصَالٍ'], 'ق': ['ikhfa', 'مِنْ قَبْلُ'], 'ف': ['ikhfa', 'مِنْ فَضْلِهِ']
  };
  const RULE = {
    izhar: ['الإظهار', '#4552D8', 'تُنطق النون واضحة بلا غنّة، لأن حرف الحلق بعيد مخرجه عن مخرج النون.', 0],
    idgh: ['الإدغام بغنّة', '#E0912B', 'تدخل النون في الحرف بعدها فيصيران حرفًا واحدًا مشدّدًا، مع غنّة بمقدار حركتين.', 2],
    idgl: ['الإدغام بلا غنّة', '#C8402E', 'تدخل النون في اللام أو الراء دخولًا كاملًا بلا غنّة.', 0],
    iqlab: ['الإقلاب', '#12A07A', 'تُقلب النون ميمًا مخفاة عند الباء، مع غنّة بمقدار حركتين.', 2],
    ikhfa: ['الإخفاء', '#7C5CE0', 'تُنطق النون بين الإظهار والإدغام، بلا تشديد، مع غنّة بمقدار حركتين.', 2]
  };
  E.i12u1t0 = {
    title: 'ما يحدث للنون الساكنة بحسب الحرف بعدها',
    vb: [360, 250],
    pick: { val: 'ب', opts: Object.keys(NUN).map(k => [k, k]) },
    steps: [
      { say: 'النون الساكنة (نْ) والتنوين لهما أربعة أحكام فقط، والذي يقرّر الحكم هو الحرف الذي يأتي بعدها مباشرة.', pick: false },
      { say: 'اختر حرفًا من الأسفل، وشاهد ماذا يحدث للنون: هل تبقى واضحة، أم تدخل في الحرف، أم تنقلب، أم تختفي؟', task: 'جرّب: ب، ثم ل، ثم ي، ثم ح — وقارن الغنّة في كل مرة.' },
      { say: 'الخلاصة: حروف الحلق ← إظهار، «يرملون» ← إدغام (بغنّة في ينمو، بلا غنّة في ل ر)، الباء ← إقلاب، والباقي ← إخفاء.', pick: false }
    ],
    read(P, s, t, pk) { if (s !== 1 || !pk) return ''; const r = RULE[NUN[pk][0]]; return '<span style="color:' + r[1] + '">' + r[0] + '</span><span>الغنّة: ' + (r[3] ? 'حركتان' : 'لا غنّة') + '</span>'; },
    draw(P, s, t, pk) {
      let g = '';
      if (s === 0) {
        g += T(180, 70, 'نْ', { fs: 54, w: 700, c: 'var(--acc)', f: 'serif' });
        const L = ['إظهار', 'إدغام', 'إقلاب', 'إخفاء'], C = ['#4552D8', '#E0912B', '#12A07A', '#7C5CE0'];
        L.forEach((l, i) => { const x = 50 + i * 87, k = ease((t - i * .4) / .6); g += '<path d="M180 90 Q ' + (180 + (x - 180) * .5) + ' 120 ' + x + ' ' + (140) + '" fill="none" stroke="' + C[i] + '" stroke-width="2.5" opacity="' + k + '"/>' + '<rect x="' + (x - 38) + '" y="145" width="76" height="40" rx="12" fill="' + C[i] + '" opacity="' + (0.15 * k) + '" stroke="' + C[i] + '"/>' + T(x, 171, l, { fs: 14, w: 700, c: C[i], op: k }); });
        g += T(180, 220, 'أي حكم؟ يحدده الحرف الذي بعد النون', { fs: 12, c: 'var(--muted)' });
        return g;
      }
      if (s === 2) {
        const rows = [['izhar', 'ء ه ع ح غ خ', 'حروف الحلق'], ['idgh', 'ي ن م و', 'ينمو'], ['idgl', 'ل ر', ''], ['iqlab', 'ب', ''], ['ikhfa', 'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك', '١٥ حرفًا']];
        rows.forEach((r, i) => { const R = RULE[r[0]], y = 22 + i * 43, k = ease((t - i * .3) / .5); g += '<rect x="14" y="' + y + '" width="332" height="36" rx="10" fill="' + R[1] + '" opacity="' + (0.12 * k) + '"/>' + T(336, y + 23, R[0], { fs: 13, w: 800, c: R[1], a: 'end', op: k }) + T(190, y + 23, r[1], { fs: r[1].length > 12 ? 11 : 15, w: 700, op: k }) + T(24, y + 23, r[2], { fs: 10, c: 'var(--muted)', a: 'start', op: k }); });
        return g;
      }
      const [rk, ex] = NUN[pk] || NUN['ب'], R = RULE[rk], k = ease(t / 1.2);
      g += T(180, 30, ex, { fs: 26, w: 700, f: 'serif' });
      /* النون والحرف التالي */
      const nx = 230, lx = 130, y = 115;
      let nunTxt = 'نْ', nunOp = 1, nunX = nx, nunCol = 'var(--acc)', letTxt = pk;
      if (rk === 'izhar') { nunCol = R[1]; }
      if (rk === 'idgh' || rk === 'idgl') { nunX = nx - (nx - lx) * k * 0.8; nunOp = 1 - k; letTxt = pk + 'ّ'; }
      if (rk === 'iqlab') { nunOp = 1 - k; }
      if (rk === 'ikhfa') { nunOp = 1 - 0.6 * k; }
      g += '<rect x="' + (nx - 40) + '" y="' + (y - 50) + '" width="80" height="80" rx="16" fill="var(--soft)"/>' + '<rect x="' + (lx - 40) + '" y="' + (y - 50) + '" width="80" height="80" rx="16" fill="var(--soft)"/>';
      g += T(nunX, y + 12, nunTxt, { fs: 46, w: 700, c: nunCol, op: nunOp.toFixed(2), f: 'serif' });
      if (rk === 'iqlab') g += T(nx, y + 12, 'مْ', { fs: 46, w: 700, c: R[1], op: k.toFixed(2), f: 'serif' });
      if (rk === 'ikhfa') g += '<ellipse cx="' + nx + '" cy="' + (y - 2) + '" rx="34" ry="30" fill="' + R[1] + '" opacity="' + (0.18 * k) + '"/>';
      g += T(lx, y + 12, (rk === 'idgh' || rk === 'idgl') && k > .5 ? letTxt : pk, { fs: 46, w: 700, f: 'serif' });
      g += T(nx, y + 52, 'النون', { fs: 11, c: 'var(--muted)' }) + T(lx, y + 52, 'الحرف بعدها', { fs: 11, c: 'var(--muted)' });
      /* شريط الغنّة */
      const gh = R[3], w = 200;
      g += T(330, 222, 'الغنّة', { fs: 11, c: 'var(--muted)', a: 'end' }) + '<rect x="70" y="212" width="' + w + '" height="12" rx="6" fill="var(--soft)"/>';
      if (gh) { const p = Math.min(1, (t % 3) / 1.5); g += '<rect x="70" y="212" width="' + (w * p) + '" height="12" rx="6" fill="' + R[1] + '"/>' + T(170, 243, 'تمتد بمقدار حركتين', { fs: 11, c: R[1], w: 700 }); }
      else g += T(170, 243, 'لا غنّة — نطق مباشر', { fs: 11, c: 'var(--muted)', w: 700 });
      g += '<rect x="14" y="176" width="332" height="26" rx="8" fill="' + R[1] + '" opacity=".14"/>' + T(180, 194, R[0] + ': ' + R[2].split('،')[0], { fs: 11.5, w: 700, c: R[1] });
      return g;
    }
  };

  /* ───────── ٦) الإنكليزية: past continuous يقطعه past simple ───────── */
  E.e12u1t2 = {
    title: 'حدثٌ طويل يقطعه حدثٌ قصير',
    vb: [360, 230],
    params: { at: { label: 'حرّك الزمن على الخط', min: 0, max: 10, step: 0.5, val: 3 } },
    steps: [
      { say: 'الماضي المستمر (was/were + ing) حدثٌ طويل كان جاريًا في وقت معيّن من الماضي — نرسمه شريطًا ممتدًّا.', params: [] },
      { say: 'الماضي البسيط (fell, hit, cut) حدثٌ قصير اكتمل في لحظة — نرسمه نقطة. حين تقع النقطة داخل الشريط فهي «تقاطع» الحدث الطويل.', params: [] },
      { say: 'لذلك نصوغ الجملة بطريقتين (انظر الرسم): بعد when يأتي الماضي البسيط (الحدث القصير)، وبعد while يأتي الماضي المستمر (الحدث الطويل).', params: [] },
      { say: 'حرّك الزمن: قبل السقوط ما زال التزلج «جاريًا»، وعند النقطة يقع الحدث القصير.', params: ['at'], task: 'متى نستعمل was skating ومتى fell؟ راقب الجملة أسفل الرسم.' }
    ],
    read(P, s) { if (s < 3) return ''; const x = P.at; return '<span dir="ltr">' + (x < 6 ? 'At this moment, I <b>was skating</b>.' : x < 6.6 ? 'Suddenly I <b>fell over</b>!' : 'I <b>was lying</b> on the ice.') + '</span>'; },
    draw(P, s, t) {
      const X0 = 30, X1 = 330, y = 120, ev = 6, px = v => X0 + (X1 - X0) * v / 10;
      let g = '<line x1="' + X0 + '" y1="' + y + '" x2="' + (X1 + 10) + '" y2="' + y + '" stroke="var(--muted)" stroke-width="2" marker-end="url(#xa)"/>' + T(X1 + 4, y + 22, 'now', { fs: 11, c: 'var(--muted)', ltr: true });
      g += T(X0, y + 22, 'past', { fs: 11, c: 'var(--muted)', ltr: true, a: 'start' });
      const grow = s === 0 ? ease(t / 2) : 1;
      g += '<rect x="' + px(1) + '" y="' + (y - 16) + '" width="' + ((px(9) - px(1)) * grow) + '" height="14" rx="7" fill="#3B6FE0" opacity=".85"/>' + T(px(3), y - 26, 'I was ice skating', { fs: 13, w: 700, c: '#3B6FE0', ltr: true, op: grow });
      if (s >= 1) { const k = ease(t / 0.8); const x = px(ev); g += '<path d="M ' + x + ' ' + (y - 46) + ' l -8 18 h 10 l -8 20" fill="none" stroke="var(--bad)" stroke-width="3" opacity="' + k + '"/><circle cx="' + x + '" cy="' + y + '" r="' + (7 * k) + '" fill="var(--bad)"/>' + T(x, y + 42, 'I fell over', { fs: 13, w: 700, c: 'var(--bad)', ltr: true, op: k }); }
      if (s === 2) { const k = ease((t - .5) / 1); g += T(180, 196, 'I was ice skating WHEN I fell over.', { fs: 12.5, w: 700, ltr: true, op: k }) + T(180, 216, 'WHILE I was ice skating, I fell over.', { fs: 12.5, w: 700, ltr: true, op: ease((t - 1.5) / 1), c: 'var(--acc)' }); }
      if (s === 3) { const x = px(P.at); g += '<line x1="' + x + '" y1="' + (y - 60) + '" x2="' + x + '" y2="' + (y + 60) + '" stroke="var(--gold)" stroke-width="2" stroke-dasharray="4 3"/>';
        /* متزلّج بسيط */
        const fell = P.at >= ev, sy = fell ? y - 70 : y - 82, ang = fell ? 70 : 0;
        g += '<g transform="translate(' + x + ' ' + (y - 60) + ') rotate(' + ang + ')"><circle cx="0" cy="-26" r="7" fill="var(--ink)"/><line x1="0" y1="-19" x2="0" y2="0" stroke="var(--ink)" stroke-width="3"/><line x1="0" y1="-12" x2="-10" y2="-4" stroke="var(--ink)" stroke-width="3"/><line x1="0" y1="-12" x2="10" y2="-6" stroke="var(--ink)" stroke-width="3"/><line x1="0" y1="0" x2="-8" y2="14" stroke="var(--ink)" stroke-width="3"/><line x1="0" y1="0" x2="8" y2="14" stroke="var(--ink)" stroke-width="3"/><line x1="-14" y1="16" x2="14" y2="16" stroke="var(--acc)" stroke-width="3"/></g>'; }
      return g;
    }
  };
})();
