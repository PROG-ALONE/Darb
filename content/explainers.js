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
    title: 'كيف تُشحن المتسعة، ومِمَّ تتكوّن سعتها؟',
    vb: [95, 0, 190, 250],
    params: {
      V: { label: 'فرق جهد البطارية V', min: 2, max: 12, step: 1, val: 6, unit: 'فولت' },
      d: { label: 'البعد بين الصفيحتين d', min: 1, max: 5, step: 0.5, val: 3, unit: 'ملم' },
      S: { label: 'مساحة الصفيحة A', min: 1, max: 4, step: 0.5, val: 2, unit: '× ١٠٠ سم²' }
    },
    steps: [
      { say: 'المتسعة صفيحتان موصلتان متقابلتان بينهما عازل (هواء هنا). قبل التوصيل كل صفيحة متعادلة: شحناتها الموجبة والسالبة متساوية.', params: [] },
      { say: 'نغلق المفتاح: البطارية تسحب إلكترونات من الصفيحة المتصلة بقطبها الموجب وتدفعها إلى الصفيحة الأخرى. التيار يبدأ كبيرًا ثم يضعف.', params: [] },
      { say: 'تتراكم شحنة موجبة على صفيحة وسالبة مساوية لها على الأخرى، وينشأ بينهما مجال كهربائي منتظم (خطوط متوازية متساوية البعد) — فيه تُخزَّن الطاقة.', params: [] },
      { say: 'يتوقف الشحن حين يصبح فرق جهد المتسعة مساويًا لجهد البطارية. حرّك V: الشحنة تتضاعف بتضاعف الجهد، أي Q = C × V.', params: ['V'], task: 'ضاعف الجهد من ٦ إلى ١٢ فولت، وراقب عدد الشحنات وقيمة Q.' },
      { say: 'السعة C صفة للمتسعة نفسها: تكبر بتكبير مساحة الصفيحتين وتصغر بإبعادهما، C = ε₀ × A ÷ d.', params: ['S', 'd', 'V'], task: 'قرّب الصفيحتين إلى النصف: هل تتضاعف السعة؟' }
    ],
    calc(P) { const eps = 8.85e-12, Am = P.S * 0.01, dm = P.d * 1e-3; const C = eps * Am / dm; return { C, Q: C * P.V }; },
    read(P, s) { if (s < 3) return ''; const { C, Q } = this.calc(P); return '<span>C = ' + fmt(C * 1e12, 1) + ' بيكوفاراد</span><span>Q = ' + fmt(Q * 1e9, 2) + ' نانوكولوم</span><span>V = ' + A(P.V) + ' فولت</span>'; },
    draw(P, s, t) {
      const cx = 180, gap = 20 + (s >= 4 ? P.d : 3) * 12, h = 60 + (s >= 4 ? P.S : 2) * 22;
      const xl = cx - gap / 2 - 8, xr = cx + gap / 2, top = 100 - h / 2;
      const closed = s >= 1;
      const charge = s === 0 ? 0 : s === 1 ? 1 - Math.exp(-t / 1.6) : 1;
      const Vf = s >= 3 ? P.V / 12 : 0.5, Cf = s >= 4 ? (P.S / P.d) / (2 / 3) : 1;
      const nQ = Math.round(cl(charge * Vf * Cf, 0, 2.2) * 6);
      let g = '';
      /* أسلاك */
      g += '<path d="M' + (xl + 4) + ' ' + (top + h) + ' V 215 H 150 M 210 215 H ' + (xr + 4) + ' V ' + (top + h) + '" fill="none" stroke="var(--muted)" stroke-width="2.5"/>';
      /* بطارية: القطب الموجب (الخط الطويل) يسار */
      g += '<line x1="150" y1="200" x2="150" y2="230" stroke="var(--ink)" stroke-width="3"/><line x1="162" y1="207" x2="162" y2="223" stroke="var(--ink)" stroke-width="5"/>' +
        '<line x1="198" y1="200" x2="198" y2="230" stroke="var(--ink)" stroke-width="3"/><line x1="210" y1="207" x2="210" y2="223" stroke="var(--ink)" stroke-width="5"/>' +
        T(140, 205, '+', { fs: 14, w: 700, c: 'var(--bad)' }) + T(222, 205, '−', { fs: 14, w: 700, c: 'var(--acc)' }) + T(180, 246, 'البطارية', { fs: 11, c: 'var(--muted)' });
      /* مفتاح */
      g += closed ? '<line x1="240" y1="215" x2="262" y2="215" stroke="var(--ok)" stroke-width="3"/>' : '<line x1="240" y1="215" x2="258" y2="200" stroke="var(--bad)" stroke-width="3"/>';
      g += '<circle cx="240" cy="215" r="3" fill="var(--ink)"/><circle cx="262" cy="215" r="3" fill="var(--ink)"/>' + T(251, 236, closed ? 'مغلق' : 'مفتوح', { fs: 10, c: 'var(--muted)' });
      /* المجال */
      if (s >= 2) { const n = 5; for (let i = 0; i < n; i++) { const y = top + (i + 0.5) * h / n; g += '<line x1="' + (xl + 12) + '" y1="' + y + '" x2="' + (xr - 6) + '" y2="' + y + '" stroke="var(--gold)" stroke-width="1.8" marker-end="url(#xg)" opacity="' + (0.35 + 0.65 * charge) + '"/>'; } g += T(cx, top - 10, 'مجال منتظم E', { fs: 11, c: 'var(--gold)', w: 700 }); }
      /* الصفيحتان */
      g += '<rect x="' + xl + '" y="' + top + '" width="8" height="' + h + '" rx="2" fill="' + (nQ ? 'rgba(200,64,46,.25)' : 'var(--soft)') + '" stroke="' + (nQ ? 'var(--bad)' : 'var(--muted)') + '" stroke-width="1.5"/>';
      g += '<rect x="' + xr + '" y="' + top + '" width="8" height="' + h + '" rx="2" fill="' + (nQ ? 'rgba(69,82,216,.22)' : 'var(--soft)') + '" stroke="' + (nQ ? 'var(--acc)' : 'var(--muted)') + '" stroke-width="1.5"/>';
      /* الشحنات */
      if (!nQ) { for (let i = 0; i < 4; i++) { const y = top + 12 + i * (h - 24) / 3; g += T(xl - 10, y + 4, i % 2 ? '−' : '+', { fs: 11, c: 'var(--muted)' }) + T(xr + 18, y + 4, i % 2 ? '+' : '−', { fs: 11, c: 'var(--muted)' }); } }
      for (let i = 0; i < nQ; i++) { const y = top + 8 + (i + 0.5) * (h - 16) / nQ; g += T(xl - 9, y + 4, '+', { fs: 14, w: 800, c: 'var(--bad)' }) + T(xr + 18, y + 4, '−', { fs: 16, w: 800, c: 'var(--acc)' }); }
      /* إلكترونات تتحرك (التيار يضعف) */
      if (s === 1) {
        const I = Math.exp(-t / 1.6), k = Math.round(6 * I);
        const pathL = [[xl + 4, top + h], [xl + 4, 215], [150, 215]], pathR = [[210, 215], [xr + 4, 215], [xr + 4, top + h]];
        const along = (p, u) => { const L = []; let tot = 0; for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); L.push(d); tot += d; } let r = u * tot; for (let i = 0; i < L.length; i++) { if (r <= L[i]) { const q = r / L[i]; return [p[i][0] + (p[i + 1][0] - p[i][0]) * q, p[i][1] + (p[i + 1][1] - p[i][1]) * q]; } r -= L[i]; } return p[p.length - 1]; };
        for (let i = 0; i < k; i++) { const u = ((t * 0.6 + i / k) % 1); const a = along(pathL, u), b = along(pathR, u); g += '<circle cx="' + a[0] + '" cy="' + a[1] + '" r="3.2" fill="var(--acc)"/><circle cx="' + b[0] + '" cy="' + b[1] + '" r="3.2" fill="var(--acc)"/>'; }
        g += T(cx, 30, 'التيار: ' + (I > 0.6 ? 'كبير' : I > 0.2 ? 'يضعف' : 'يكاد يتوقف'), { fs: 12, w: 700, c: 'var(--acc)' });
        g += '<rect x="110" y="38" width="140" height="7" rx="3.5" fill="var(--soft)"/><rect x="110" y="38" width="' + (140 * I) + '" height="7" rx="3.5" fill="var(--acc)"/>';
      }
      if (s === 0) g += T(cx, 28, 'متعادلة: لا شحنة صافية', { fs: 12, c: 'var(--muted)', w: 700 });
      if (s >= 4) { g += '<line x1="' + (xl + 8) + '" y1="' + (top + h + 12) + '" x2="' + xr + '" y2="' + (top + h + 12) + '" stroke="var(--ink)" stroke-width="1"/>' + T(cx, top + h + 25, 'd', { fs: 12, w: 700, f: 'serif' }); }
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
