/* ══════════════════════════════════════════════════════════════════════
   الرسوم التفاعلية — التربية الإسلامية واللغة الإنكليزية ١٢ (figs-5.js)
   ──────────────────────────────────────────────────────────────────────
   ١٢ رسمًا: ٧ في التربية الإسلامية + ٥ في اللغة الإنكليزية، بنفس صيغة
   content/figs.js: svg (رسم vector) + parts (نقطة تشرح نفسها) +
   steps («كيف أرسمه؟» خطوة بخطوة).
   التعريفات لها معرّف figArrow5 لئلا تتعارض مع figArrow في figs.js.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  const DEFS = '<defs><marker id="figArrow5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink)"/></marker></defs>';
  /* سهم مرسوم برأس مثلث (علامة marker لا ترث لون الخط، فتظهر بالأسود) */
  const arrow = (x1, y1, x2, y2, c) => {
    const col = c || 'var(--acc)';
    const a = Math.atan2(y2 - y1, x2 - x1), W = 4.6, back = 8.5;
    const bx = x2 - Math.cos(a) * back, by = y2 - Math.sin(a) * back;
    const p2 = [bx - Math.sin(a) * W, by + Math.cos(a) * W];
    const p3 = [bx + Math.sin(a) * W, by - Math.cos(a) * W];
    const n = v => (Math.round(v * 10) / 10);
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + n(bx) + '" y2="' + n(by) + '" stroke="' + col + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<polygon points="' + n(x2) + ',' + n(y2) + ' ' + n(p2[0]) + ',' + n(p2[1]) + ' ' + n(p3[0]) + ',' + n(p3[1]) + '" fill="' + col + '"/>';
  };

  const FIGS = {

    /* ══ التربية الإسلامية (٧ رسوم) ══ */

    /* ── ١. أحكام النون الساكنة والتنوين ── */
    noonTanweenRules: {
      title: 'أحكام النون الساكنة والتنوين: الإظهار والإدغام والإقلاب والإخفاء',
      teaches: 'يُعلّم أن كل نون ساكنة أو تنوين في القرآن يخضع لأحد أربعة أحكام: الإظهار ثم الإدغام ثم الإقلاب ثم الإخفاء، وأن الحرف الواقع بعد النون هو الذي يقرّر الحكم؛ فإذا عرفت الحرف عرفت الحكم، فتضبط التلاوة وتقع من أسئلة الاختبار في موضعها الصحيح.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="الأربعة أحكام للنون الساكنة والتنوين في أربعة صناديق">' + DEFS +
        '<rect x="120" y="14" width="100" height="34" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="170" y="36" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">نون ساكنة أو تنوين</text>' +
        arrow(170, 50, 45, 76, 'var(--muted)') + arrow(170, 50, 129, 76, 'var(--muted)') + arrow(170, 50, 213, 76, 'var(--muted)') + arrow(170, 50, 296, 76, 'var(--muted)') +
        '<rect x="8" y="78" width="74" height="56" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="45" y="100" text-anchor="middle" font-size="12" fill="var(--acc)" font-weight="700">الإظهار</text>' +
        '<text x="45" y="122" text-anchor="middle" font-size="10.5" fill="var(--muted)">ء هـ ع ح غ خ</text>' +
        '<rect x="92" y="78" width="74" height="56" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="129" y="100" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">الإدغام</text>' +
        '<text x="129" y="122" text-anchor="middle" font-size="10.5" fill="var(--muted)">ي ر م ل و ن</text>' +
        '<rect x="176" y="78" width="74" height="56" rx="10" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/>' +
        '<text x="213" y="100" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">الإقلاب</text>' +
        '<text x="213" y="122" text-anchor="middle" font-size="10.5" fill="var(--muted)">الباء فقط</text>' +
        '<rect x="260" y="78" width="72" height="56" rx="10" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/>' +
        '<text x="296" y="100" text-anchor="middle" font-size="12" fill="var(--bad)" font-weight="700">الإخفاء</text>' +
        '<text x="296" y="122" text-anchor="middle" font-size="10.5" fill="var(--muted)">١٥ حرفًا</text>' +
        '<text x="45" y="152" text-anchor="middle" font-size="9.5" fill="var(--muted)">أخي هاك علمًا</text>' +
        '<text x="45" y="168" text-anchor="middle" font-size="9.5" fill="var(--muted)">حازه غير خاسر</text>' +
        '<text x="129" y="152" text-anchor="middle" font-size="9.5" fill="var(--muted)">من ينمي (يرملون)</text>' +
        '<text x="129" y="168" text-anchor="middle" font-size="9.5" fill="var(--muted)">ول ر بلا غنّة</text>' +
        '<text x="213" y="152" text-anchor="middle" font-size="9.5" fill="var(--muted)">ميمٌ مخفاة</text>' +
        '<text x="213" y="168" text-anchor="middle" font-size="9.5" fill="var(--muted)">مع بقاء الغنّة</text>' +
        '<text x="296" y="152" text-anchor="middle" font-size="9.5" fill="var(--muted)">صِفْ ذا ثَنا كَمْ</text>' +
        '<text x="296" y="168" text-anchor="middle" font-size="9.5" fill="var(--muted)">جادَ شخصٌ قد سما</text></svg>',
      parts: [
        { x: 45, y: 100, label: 'الإظهار (حلقي)', note: 'إخراج النون الساكنة والتنوين من مخرجهما من غير غنّة، إذا جاء بعدهما أحد حروف الحلق الستة: ء هـ ع ح غ خ المجموعة في (أخي هاك علمًا حازه غير خاسر). مثل: من خير، عذابٌ اليم.' },
        { x: 129, y: 100, label: 'الإدغام', note: 'قلب النون أو التنوين في آخر الكلمة الأولى إلى جنس أحد حروف (يرملون) ليصبحا حرفًا واحدًا مشدّدًا، وفي كلمتين فقط: بغنّة مع (ينمو) مثل من نشاء، وبلا غنّة مع (ل ر) مثل من ربّهم.' },
        { x: 213, y: 100, label: 'الإقلاب', note: 'قلب النون الساكنة أو التنوين ميمًا مخفاة مع بقاء الغنّة، إذا جاء بعدهما حرف الباء فقط: ينبط→يمبط، مِن بعد→مِمْ بعد، سميعًا بصيرًا، رؤوفٌ بالمؤمنين.' },
        { x: 296, y: 100, label: 'الإخفاء', note: 'النطق بالنون الساكنة والتنوين وسطًا بين الإظهار والإدغام مع الغنّة، إذا جاء بعدهما أحد حروفه الخمسة عشر المجموعة في (صِفْ ذا ثَنا كَمْ جادَ شخصٌ قد سما ... دُمْ طيّبًا زِدْ في تُقًى ضَعْ ظالما).' }
      ],
      steps: [
        '<rect x="120" y="14" width="100" height="34" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">١) ارسم صندوقًا وسطيًّا: النون الساكنة أو التنوين</text>',
        '<rect x="8" y="78" width="74" height="56" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="45" y="100" text-anchor="middle" font-size="12" fill="var(--acc)" font-weight="700">الإظهار</text><rect x="92" y="78" width="74" height="56" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="129" y="100" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">الإدغام</text><rect x="176" y="78" width="74" height="56" rx="10" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><text x="213" y="100" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">الإقلاب</text><rect x="260" y="78" width="72" height="56" rx="10" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/><text x="296" y="100" text-anchor="middle" font-size="12" fill="var(--bad)" font-weight="700">الإخفاء</text><text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">٢) ارسم أربعة صناديق: إظهار وإدغام وإقلاب وإخفاء</text>',
        arrow(170, 50, 45, 76, 'var(--muted)') + arrow(170, 50, 129, 76, 'var(--muted)') + arrow(170, 50, 213, 76, 'var(--muted)') + arrow(170, 50, 296, 76, 'var(--muted)') + '<text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">٣) اربط كل صندوق بالوسط بسهم: حكمٌ واحد لكل نون</text>',
        '<text x="45" y="152" text-anchor="middle" font-size="9.5" fill="var(--muted)">أخي هاك علمًا</text><text x="45" y="168" text-anchor="middle" font-size="9.5" fill="var(--muted)">حازه غير خاسر</text><text x="129" y="152" text-anchor="middle" font-size="9.5" fill="var(--muted)">من ينمي (يرملون)</text><text x="129" y="168" text-anchor="middle" font-size="9.5" fill="var(--muted)">ول ر بلا غنّة</text><text x="213" y="152" text-anchor="middle" font-size="9.5" fill="var(--muted)">ميمٌ مخفاة</text><text x="213" y="168" text-anchor="middle" font-size="9.5" fill="var(--muted)">مع بقاء الغنّة</text><text x="296" y="152" text-anchor="middle" font-size="9.5" fill="var(--muted)">صِفْ ذا ثَنا كَمْ</text><text x="296" y="168" text-anchor="middle" font-size="9.5" fill="var(--muted)">جادَ شخصٌ قد سما</text><text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">٤) اكتب حروف كل حكم وموضعه من العبارة</text>'
      ]
    },

    /* ── ٢. أصحاب الكهف ── */
    kahfStages: {
      title: 'أصحاب الكهف: من الإيمان إلى المسجد عبر رقود ٣٠٩ سنين',
      teaches: 'يُرتّب أحداث قصة أصحاب الكهف خمس محطات متتابعة: الإيمان والثبات ثم الهجرة إلى الكهف ثم الرقود ثلاثمائة وتسع سنين ثم الاستيقاظ والبعث ثم بناء المسجد — ومن هذا الترتيب يُفهم أن القصة برهان عملي على قدرة الله في البعث.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="مسار قصة أصحاب الكهف في خمس محطات">' + DEFS +
        '<path d="M310 60 C260 68 240 86 190 96 C140 106 90 128 32 150" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="8 5"/>' +
        '<circle cx="308" cy="62" r="15" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/><text x="308" y="67" text-anchor="middle" font-size="12" fill="var(--acc)" font-weight="700">١</text>' +
        '<circle cx="232" cy="90" r="15" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/><text x="232" y="95" text-anchor="middle" font-size="12" fill="var(--gold)" font-weight="700">٢</text>' +
        '<circle cx="160" cy="110" r="17" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="3"/><text x="160" y="115" text-anchor="middle" font-size="13" fill="var(--bad)" font-weight="700">٣</text>' +
        '<circle cx="88" cy="132" r="14" fill="var(--ok)" opacity=".22" stroke="var(--ok)" stroke-width="3"/><text x="88" y="137" text-anchor="middle" font-size="11" fill="var(--ok)" font-weight="700">٤</text>' +
        '<circle cx="32" cy="152" r="13" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><text x="32" y="157" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="700">٥</text>' +
        '<text x="336" y="88" text-anchor="end" font-size="9.5" fill="var(--acc)">الإيمان والثبات</text>' +
        '<text x="232" y="122" text-anchor="middle" font-size="10" fill="var(--gold)">الهجرة إلى الكهف</text>' +
        '<text x="160" y="144" text-anchor="middle" font-size="10" fill="var(--bad)">الرقود ٣٠٩ سنين</text>' +
        '<text x="88" y="162" text-anchor="middle" font-size="10" fill="var(--ok)">الاستيقاظ والبعث</text>' +
        '<text x="32" y="180" text-anchor="middle" font-size="9.5" fill="var(--muted)">بناء المسجد</text>' +
        '<text x="10" y="194" font-size="9.5" fill="var(--muted)">﴿وَلَبِثُوا فِي كَهْفِهِمْ ثَلَاثَ مِائَةٍ سِنِينَ وَازْدَادُوا تِسْعًا﴾</text></svg>',
      parts: [
        { x: 308, y: 62, label: 'الإيمان والثبات', note: 'فتية آمنوا بربّهم ﴿وَزِدْنَاهُمْ هُدًى﴾، وعاهدوا الله على عبادته وحده: ﴿رَبُّنَا رَبُّ السَّمَاوَاتِ وَالْأَرْضِ لَنْ نَدْعُوَ مِنْ دُونِهِ إِلَٰهًا﴾، ثم تعاهدوا على الثبات.' },
        { x: 232, y: 90, label: 'الهجرة إلى الكهف', note: 'لما استحكم الشرك وطلب الملك قتلهم، خرجوا إلى الكهف مستجدين رحمة ربّهم: ﴿فَأْوُوا إِلَى الْكَهْفِ يَنْشُرْ لَكُمْ رَبُّكُمْ مِنْ رَحْمَتِهِ﴾ — اعتزالٌ ولهوٌ بدينهم.' },
        { x: 160, y: 110, label: 'الرقود ٣٠٩ سنين', note: 'أنامهم الله في الكهف ثلاثمائة سنة وازدادوا تسعًا، وجعل الشمس تزاور عنهم ذات اليمين وتقرضهم ذات الشمال، وقلبهم ذات اليمين وذات الشمال حفظًا لأجسادهم.' },
        { x: 88, y: 132, label: 'الاستيقاظ والبعث', note: 'أيقظهم الله فتساءلوا عن مدة نومهم، وأرسلوا أصغرهم بورقهم إلى المدينة فتغيّرت معالمها وعرف الناسهم، فكان ذلك دليلًا على قدرة الله القادرة على إحياء الموتى يوم القيامة.' }
      ],
      steps: [
        '<path d="M310 60 C260 68 240 86 190 96 C140 106 90 128 32 150" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="8 5"/><text x="170" y="22" text-anchor="middle" font-size="12.5" fill="var(--muted)">١) ارسم مسارًا متعرّجًا من اليمين (الكهف) إلى اليسار</text>',
        '<circle cx="308" cy="62" r="15" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/><text x="308" y="67" text-anchor="middle" font-size="12" fill="var(--acc)" font-weight="700">١</text><circle cx="232" cy="90" r="15" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/><text x="232" y="95" text-anchor="middle" font-size="12" fill="var(--gold)" font-weight="700">٢</text><text x="336" y="88" text-anchor="end" font-size="9.5" fill="var(--acc)">الإيمان والثبات</text><text x="232" y="122" text-anchor="middle" font-size="10" fill="var(--gold)">الهجرة إلى الكهف</text><text x="170" y="22" text-anchor="middle" font-size="12.5" fill="var(--muted)">٢) ضع أول محطتين: الإيمان ثم الهجرة إلى الكهف</text>',
        '<circle cx="160" cy="110" r="17" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="3"/><text x="160" y="115" text-anchor="middle" font-size="13" fill="var(--bad)" font-weight="700">٣</text><circle cx="88" cy="132" r="14" fill="var(--ok)" opacity=".22" stroke="var(--ok)" stroke-width="3"/><text x="88" y="137" text-anchor="middle" font-size="11" fill="var(--ok)" font-weight="700">٤</text><circle cx="32" cy="152" r="13" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><text x="32" y="157" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="700">٥</text><text x="160" y="144" text-anchor="middle" font-size="10" fill="var(--bad)">الرقود ٣٠٩ سنين</text><text x="88" y="162" text-anchor="middle" font-size="10" fill="var(--ok)">الاستيقاظ والبعث</text><text x="32" y="180" text-anchor="middle" font-size="9.5" fill="var(--muted)">بناء المسجد</text><text x="170" y="22" text-anchor="middle" font-size="12.5" fill="var(--muted)">٣) أضف الرقود ثم الاستيقاظ ثم بناء المسجد</text>',
        '<text x="10" y="194" font-size="9.5" fill="var(--muted)">﴿وَلَبِثُوا فِي كَهْفِهِمْ ثَلَاثَ مِائَةٍ سِنِينَ وَازْدَادُوا تِسْعًا﴾</text><text x="170" y="22" text-anchor="middle" font-size="12.5" fill="var(--muted)">٤) اكتب مدة الرقود: ثلاثمائة سنة وازدادوا تسعًا</text>'
      ]
    },

    /* ── ٣. نظام الأسرة ── */
    familySystem: {
      title: 'نظام الأسرة: القوامة والحقوق المتبادلة',
      teaches: 'يُعلّم بناء الأسرة في الإسلام: زواجٌ يقوم على المحبة والرحمة، وقوامةٌ للأب بالإنفاق والرعاية لا بالاستبداد، وقدرٌ للأم في التقدير وحسن المعاشرة، وبرٌّ للأولاد يعود بالسكن والبركة — وكل ذي حقٍّ عليه حقّ.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="بيت الأسرة: قوامة الأب ورعاية الأم وبرّ الأبناء">' + DEFS +
        '<path d="M170 14 L326 74 L14 74 Z" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="170" y="50" text-anchor="middle" font-size="11" fill="var(--acc)">﴿وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ﴾</text>' +
        '<text x="170" y="68" text-anchor="middle" font-size="10" fill="var(--muted)">الحقوق والواجبات متوازنة</text>' +
        '<rect x="30" y="74" width="280" height="96" rx="10" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/>' +
        '<rect x="216" y="86" width="88" height="72" rx="8" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2"/>' +
        '<text x="260" y="106" text-anchor="middle" font-size="12.5" fill="var(--acc)" font-weight="700">الأب</text>' +
        '<text x="260" y="126" text-anchor="middle" font-size="9.5" fill="var(--ink)">قوامة بالإنفاق</text>' +
        '<text x="260" y="144" text-anchor="middle" font-size="9.5" fill="var(--ink)">والرعاية والعدل</text>' +
        '<rect x="126" y="86" width="88" height="72" rx="8" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2"/>' +
        '<text x="170" y="106" text-anchor="middle" font-size="12.5" fill="var(--ink)" font-weight="700">الأم</text>' +
        '<text x="170" y="126" text-anchor="middle" font-size="9.5" fill="var(--ink)">الرحمة والتربية</text>' +
        '<text x="170" y="144" text-anchor="middle" font-size="9.5" fill="var(--ink)">وحسن المعاشرة</text>' +
        '<rect x="36" y="86" width="88" height="72" rx="8" fill="var(--soft)" stroke="var(--muted)" stroke-width="2"/>' +
        '<text x="80" y="106" text-anchor="middle" font-size="12.5" fill="var(--ink)" font-weight="700">الأبناء</text>' +
        '<text x="80" y="126" text-anchor="middle" font-size="9.5" fill="var(--ink)">برّ وطاعة</text>' +
        '<text x="80" y="144" text-anchor="middle" font-size="9.5" fill="var(--ink)">وصلة الرحم</text>' +
        '<text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">القوامة بالإنفاق والرعاية — ﴿بِمَا أَنفَقُوا﴾</text></svg>',
      parts: [
        { x: 170, y: 45, label: 'سقف الأسرة (الزواج)', note: 'الأساس الذي يجمع الأسرة: زواجٌ صحيح ومحبةٌ ورحمة، وقاعدة его ﴿وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ﴾ — ومعاشرة الزوجة بالمعروف شرط لاستقرار البيت وحفظ الحقوق.' },
        { x: 260, y: 115, label: 'الأب: القوامة', note: 'الرجل قوّام على المرأة بما فضّل الله بعضهم على بعض وبما أنفقوا؛ فالقوامة بالإنفاق والرعاية والعدل والمهادة، لا بالقهر والاستبداد، وعليه نفقة الأهل وحسن تربيتهم.' },
        { x: 170, y: 115, label: 'الأم: الرحمة والتربية', note: 'الأم مصدر الرحمة وبداية التربية: ﴿وَالْوَالِدَاتُ يُرْضِعْنَ أَوْلَادَهُنَّ حَوْلَيْنِ كَامِلَيْنِ﴾، وفي حقها ﴿أَنْ تُعَايِرُوهُنَّ أَوْ تُضَاعِفُوهُنَّ﴾ فالإحسان إليها واجب.' },
        { x: 80, y: 115, label: 'الأبناء: البرّ', note: 'حقّ الأبناء أن يُحسن إليهم في الإنفاق والتربية والهداية، وحقّهم على والديهم البرّ وحسن التربية؛ وحين يكبر الأبناء يكون حقّهم على والديهم الإحسان وصلة الرحم — ﴿وَبِالْوَالِدَيْنِ إِحْسَانًا﴾.' }
      ],
      steps: [
        '<path d="M170 14 L326 74 L14 74 Z" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">١) ارسم سقفًا ثلاثيًّا فوق مساحة البيت</text>',
        '<rect x="30" y="74" width="280" height="96" rx="10" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/><text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">٢) ارسم جسم البيت المستطيل تحت السقف</text>',
        '<rect x="216" y="86" width="88" height="72" rx="8" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2"/><text x="260" y="106" text-anchor="middle" font-size="12.5" fill="var(--acc)" font-weight="700">الأب</text><rect x="126" y="86" width="88" height="72" rx="8" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2"/><text x="170" y="106" text-anchor="middle" font-size="12.5" fill="var(--ink)" font-weight="700">الأم</text><rect x="36" y="86" width="88" height="72" rx="8" fill="var(--soft)" stroke="var(--muted)" stroke-width="2"/><text x="80" y="106" text-anchor="middle" font-size="12.5" fill="var(--ink)" font-weight="700">الأبناء</text><text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">٣) اقسم البيت إلى ثلاثة أعمدة وسمِّ كلًّا منها</text>',
        '<text x="260" y="126" text-anchor="middle" font-size="9.5" fill="var(--ink)">قوامة بالإنفاق</text><text x="260" y="144" text-anchor="middle" font-size="9.5" fill="var(--ink)">والرعاية والعدل</text><text x="170" y="126" text-anchor="middle" font-size="9.5" fill="var(--ink)">الرحمة والتربية</text><text x="170" y="144" text-anchor="middle" font-size="9.5" fill="var(--ink)">وحسن المعاشرة</text><text x="80" y="126" text-anchor="middle" font-size="9.5" fill="var(--ink)">برّ وطاعة</text><text x="80" y="144" text-anchor="middle" font-size="9.5" fill="var(--ink)">وصلة الرحم</text><text x="170" y="190" text-anchor="middle" font-size="12.5" fill="var(--muted)">٤) اكتب واجب كل طرف: إنفاق، رعاية، برّ</text>'
      ]
    },

    /* ── ٤. موسى والعبد الصالح: المواقف الثلاثة ── */
    musaThreeActs: {
      title: 'موسى والعبد الصالح: المواقف الثلاثة وحكمتها الخفيّة',
      teaches: 'يُرتّب المواقف الثلاثة في قصة موسى والعبد الصالح — خرق السفينة وقتل الغلام وإقامة الجدار — مع ظاهر كل فعل ثم باطنه، فيتبين أن ما بدا ضررًا كان حكمةً ورحمة، وأن علم الله أوسع من ظنّ العباد وأن الظاهر قد يخالف الباطن.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="بطاقات المواقف الثلاثة في قصة موسى والعبد الصالح">' + DEFS +
        '<text x="170" y="24" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">أفعالٌ تبدو ضارّة… والحكمة فيها خفيّة</text>' +
        '<rect x="225" y="40" width="100" height="112" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="275" y="62" text-anchor="middle" font-size="12" fill="var(--acc)" font-weight="700">١) خرق السفينة</text>' +
        '<text x="275" y="84" text-anchor="middle" font-size="10" fill="var(--bad)">الظاهر: ضرر أصحابها</text>' +
        '<text x="275" y="104" text-anchor="middle" font-size="10" fill="var(--ok)">الباطن: حكمة ورحمة</text>' +
        '<text x="275" y="126" text-anchor="middle" font-size="9" fill="var(--muted)">لئلا يأخذها الملك</text>' +
        '<text x="275" y="144" text-anchor="middle" font-size="9" fill="var(--muted)">الظالم غصباً</text>' +
        '<rect x="115" y="40" width="100" height="112" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="165" y="62" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">٢) قتل الغلام</text>' +
        '<text x="165" y="84" text-anchor="middle" font-size="10" fill="var(--bad)">الظاهر: قتل بريء</text>' +
        '<text x="165" y="104" text-anchor="middle" font-size="10" fill="var(--ok)">الباطن: بديلٌ خير</text>' +
        '<text x="165" y="126" text-anchor="middle" font-size="9" fill="var(--muted)">كان سيُرهق أبويه</text>' +
        '<text x="165" y="144" text-anchor="middle" font-size="9" fill="var(--muted)">طغياناً وكفراً</text>' +
        '<rect x="5" y="40" width="100" height="112" rx="10" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/>' +
        '<text x="55" y="62" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">٣) إقامة الجدار</text>' +
        '<text x="55" y="84" text-anchor="middle" font-size="10" fill="var(--bad)">الظاهر: تركُ حقّ</text>' +
        '<text x="55" y="104" text-anchor="middle" font-size="10" fill="var(--ok)">الباطن: حفظُ كنز</text>' +
        '<text x="55" y="126" text-anchor="middle" font-size="9" fill="var(--muted)">تحته كنزٌ ليتيمين</text>' +
        '<text x="55" y="144" text-anchor="middle" font-size="9" fill="var(--muted)">وأبوهما صالح</text>' +
        '<text x="170" y="176" text-anchor="middle" font-size="10.5" fill="var(--ink)">﴿وَمَا فَعَلْتُهُ عَنْ أَمْرِي﴾ — الظاهر قد يخالف الباطن في حكمة الله</text>' +
        '<text x="170" y="194" text-anchor="middle" font-size="12.5" fill="var(--muted)">٤) اختم بالحكم العام: الظاهر يخالف الباطن</text></svg>',
      parts: [
        { x: 275, y: 62, label: 'السفينة (الموقف الأول)', note: 'خرقها ظاهرًا ضرر، لكن الله أراد أن يعيبها لئلا يأخذها الملك الظالم غصباً، فكانت حفظاً لمال المساكين: ﴿فَأَرَادَ أَنْ يُرِيحَهَا وَكَانَ فِيهِمْ مَسَاكِينُ﴾.' },
        { x: 165, y: 62, label: 'الغلام (الموقف الثاني)', note: 'قتلها ظاهرًا جناية، وكان سيُرهق أبويه طغياناً وكفراً، فأبدلهما الله خيراً منه زكاةً وأقرب رحماً — عالمٌ بما سيقع لا مخطئٌ لجهل.' },
        { x: 55, y: 62, label: 'الجدار (الموقف الثالث)', note: 'تركه تركُ حقٍّ ظاهر، وتحته كنزٌ ليتيمين وأبوهما كان صالحاً، فأراد الله أن يبلغا أشدهما ويستخرجا كنزهما رحمة بهما — تأخيرُ الحقّ حفظاً له.' },
        { x: 170, y: 176, label: 'الحكم العام للقصة', note: 'العلم الإلهي لا يُدرك بالمشاهدة، وموسى نبيٌّ واحتاج إلى الصبر على ما لا يفهم سببه؛ فمن فهم ذلك حسُن ظنّه بالله وصبر على قضاءه، وهو مدار أسئلة هذه القصة في الكتاب.' }
      ],
      steps: [
        '<rect x="225" y="40" width="100" height="112" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="275" y="62" text-anchor="middle" font-size="12" fill="var(--acc)" font-weight="700">١) خرق السفينة</text><text x="275" y="84" text-anchor="middle" font-size="10" fill="var(--bad)">الظاهر: ضرر أصحابها</text><text x="275" y="104" text-anchor="middle" font-size="10" fill="var(--ok)">الباطن: حكمة ورحمة</text><text x="170" y="194" text-anchor="middle" font-size="12.5" fill="var(--muted)">١) ارسم أول بطاقة: خرق السفينة</text>',
        '<rect x="115" y="40" width="100" height="112" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="165" y="62" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">٢) قتل الغلام</text><text x="165" y="84" text-anchor="middle" font-size="10" fill="var(--bad)">الظاهر: قتل بريء</text><text x="165" y="104" text-anchor="middle" font-size="10" fill="var(--ok)">الباطن: بديلٌ خير</text><text x="170" y="194" text-anchor="middle" font-size="12.5" fill="var(--muted)">٢) أضف بطاقة قتل الغلام في الوسط</text>',
        '<rect x="5" y="40" width="100" height="112" rx="10" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><text x="55" y="62" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">٣) إقامة الجدار</text><text x="55" y="84" text-anchor="middle" font-size="10" fill="var(--bad)">الظاهر: تركُ حقّ</text><text x="55" y="104" text-anchor="middle" font-size="10" fill="var(--ok)">الباطن: حفظُ كنز</text><text x="170" y="194" text-anchor="middle" font-size="12.5" fill="var(--muted)">٣) أضف بطاقة إقامة الجدار على اليسار</text>',
        '<text x="170" y="176" text-anchor="middle" font-size="10.5" fill="var(--ink)">﴿وَمَا فَعَلْتُهُ عَنْ أَمْرِي﴾ — الظاهر قد يخالف الباطن في حكمة الله</text><text x="170" y="194" text-anchor="middle" font-size="12.5" fill="var(--muted)">٤) اكتب تحت البطاقات حكم القصة كاملاً</text>'
      ]
    },

    /* ── ٥. محاسبة النفس ── */
    muhasabahSteps: {
      title: 'مراتب محاسبة النفس: قبل العمل وأثناءه وبعده',
      teaches: 'يُعلّم محاسبة النفس بثلاث مراتب مرتّبة زمنيًّا: محاسبة النية قبل العمل، ثم مراقبة القلب أثناء العمل، ثم مراجعة أعمال اليوم قبل النوم والتوبة من كل تقصير — وبهذه المراتب الثلاث يتحقّق حديث «حاسبوا أنفسكم قبل أن تحاسبوا».',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="ثلاث مراتب صاعدة لمحاسبة النفس">' + DEFS +
        '<text x="170" y="26" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">مراتبٌ ثلاث تصعد من النية إلى المراجعة</text>' +
        '<rect x="8" y="134" width="100" height="50" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="58" y="156" text-anchor="middle" font-size="11" fill="var(--acc)" font-weight="700">١) قبل العمل</text>' +
        '<text x="58" y="176" text-anchor="middle" font-size="10" fill="var(--ink)">محاسبة النية</text>' +
        arrow(106, 138, 121, 124, 'var(--gold)') +
        '<rect x="120" y="88" width="100" height="50" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="170" y="110" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">٢) أثناء العمل</text>' +
        '<text x="170" y="130" text-anchor="middle" font-size="10" fill="var(--ink)">مراقبة القلب</text>' +
        arrow(218, 92, 233, 78, 'var(--gold)') +
        '<rect x="232" y="42" width="100" height="50" rx="10" fill="var(--ok)" opacity=".16" stroke="var(--ok)" stroke-width="2.5"/>' +
        '<text x="282" y="64" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">٣) بعد العمل</text>' +
        '<text x="282" y="84" text-anchor="middle" font-size="10" fill="var(--ink)">المراجعة قبل النوم</text>' +
        '<text x="170" y="196" text-anchor="middle" font-size="11" fill="var(--muted)">«حاسِبوا أنفسكم قبل أن تحاسبوا»</text></svg>',
      parts: [
        { x: 58, y: 156, label: 'المرتبة الأولى: قبل العمل', note: 'محاسبة النية قبل الشروع: لله وحده لا لِرياء ولا لِسمعة. من نواه عملًا لغير الله فبدأ بالغلط، وقوله تعالى: ﴿مَا أَشْهَدتُهُمْ خَلْقَ السَّمَاوَاتِ﴾ يذكّر بنيّة الإخلاص.' },
        { x: 170, y: 110, label: 'المرتبة الثانية: أثناء العمل', note: 'مراقبة القلب في لحظة العمل: هل أُتقنه؟ هل أُبقي على حدود الله؟ فالمرابط هو الحاضر القلب في عمله، ومن سرّق في السرّ فهو عاجزٌ عن مراقبة ربّه.' },
        { x: 282, y: 64, label: 'المرتبة الثالثة: بعد العمل', note: 'مراجعة أعمال اليوم قبل النوم: الصلاة والصدقة والمعصية والتقصير، ثم التوبة الفورية والعزيمة على عدم العودة — «وَزِنُوا أَعْمَالَكُمْ قَبْلَ أَنْ تُوزَنُوا».' },
        { x: 170, y: 196, label: 'المرتبة المطلوبة في الحديث', note: 'المحاسبة استباقٌ للحساب: من حاسب نفسه في الدنيا خفُف عنه حساب الآخرة، وذهب العاجز من أتبع نفسه هواها وتمنى على الله الأماني دون عملٍ يستحقّه.' }
      ],
      steps: [
        '<rect x="8" y="134" width="100" height="50" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="58" y="156" text-anchor="middle" font-size="11" fill="var(--acc)" font-weight="700">١) قبل العمل</text><text x="58" y="176" text-anchor="middle" font-size="10" fill="var(--ink)">محاسبة النية</text><text x="170" y="26" text-anchor="middle" font-size="12.5" fill="var(--muted)">١) ارسم المربع الأول سفليًّا: محاسبة النية</text>',
        '<rect x="120" y="88" width="100" height="50" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="170" y="110" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">٢) أثناء العمل</text><text x="170" y="130" text-anchor="middle" font-size="10" fill="var(--ink)">مراقبة القلب</text>' + arrow(106, 138, 121, 124, 'var(--gold)') + '<text x="170" y="26" text-anchor="middle" font-size="12.5" fill="var(--muted)">٢) ارسم المربع الثاني أعلى وأسهمًا نحوه</text>',
        '<rect x="232" y="42" width="100" height="50" rx="10" fill="var(--ok)" opacity=".16" stroke="var(--ok)" stroke-width="2.5"/><text x="282" y="64" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">٣) بعد العمل</text><text x="282" y="84" text-anchor="middle" font-size="10" fill="var(--ink)">المراجعة قبل النوم</text>' + arrow(218, 92, 233, 78, 'var(--gold)') + '<text x="170" y="26" text-anchor="middle" font-size="12.5" fill="var(--muted)">٣) أضف المربع الثالث الأعلى: مراجعة أعمال اليوم</text>',
        '<text x="170" y="196" text-anchor="middle" font-size="11" fill="var(--muted)">«حاسِبوا أنفسكم قبل أن تحاسبوا»</text><text x="170" y="26" text-anchor="middle" font-size="12.5" fill="var(--muted)">٤) اكتب الحديث أسفلًا ورتّب المراتب الثلاث</text>'
      ]
    },

    /* ── ٦. دورة المال في الإسلام ── */
    moneyCycle: {
      title: 'دورة المال في الإسلام: الكسب ثم الزكاة ثم الإنفاق',
      teaches: 'يُعلّم دوران المال في الاقتصاد الإسلامي: كسبٌ حلال ثم زكاةٌ تُخرجه من وجهه ثم بيتُ مالٍ يوزّعه على مصارفه ثم إنفاقٌ ومشاريعٌ تعود بالبركة على الكاسب — وبهذا الدوران تتحقّق العدالة الاجتماعية بدل تراكم المال في أيدي قلة.',
      svg: '<svg viewBox="0 0 340 214" role="img" aria-label="حلقة دورة المال في الإسلام في أربع محطات">' + DEFS +
        '<rect x="118" y="14" width="104" height="36" rx="9" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="170" y="37" text-anchor="middle" font-size="11.5" fill="var(--acc)" font-weight="700">الكسب الحلال</text>' +
        '<rect x="231" y="87" width="104" height="36" rx="9" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="283" y="110" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">الزكاة (٢٫٥٪)</text>' +
        '<rect x="118" y="160" width="104" height="36" rx="9" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/>' +
        '<text x="170" y="183" text-anchor="middle" font-size="11.5" fill="var(--ink)" font-weight="700">بيت المال</text>' +
        '<rect x="5" y="87" width="104" height="36" rx="9" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/>' +
        '<text x="57" y="110" text-anchor="middle" font-size="10.5" fill="var(--ink)" font-weight="700">الإنفاق والوقف</text>' +
        '<text x="170" y="102" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">المال أمانة</text>' +
        '<text x="170" y="120" text-anchor="middle" font-size="10" fill="var(--muted)">تكتمل البركة بالدوران</text>' +
        arrow(226, 56, 254, 84, 'var(--muted)') + arrow(254, 126, 226, 154, 'var(--muted)') +
        arrow(114, 154, 86, 126, 'var(--muted)') + arrow(86, 84, 114, 56, 'var(--muted)') +
        '<text x="170" y="208" text-anchor="middle" font-size="12.5" fill="var(--muted)">السهم يعود إلى الكسب: الماء يزيد بالجريان</text></svg>',
      parts: [
        { x: 170, y: 37, label: 'الكسب الحلال', note: 'ال起点 الأولى للثروة: ﴿كُلُوا مِنْ ثَمَرِهِ إِذَا أَثْمَرَ وَآتُوا حَقَّهُ يَوْمَ حَصَادِهِ﴾ — المال المباح يُكتسب بالعمل والتجارة، ويُحلّ بالكدح لا بالربا ولا بالغش ولا بالاحتكار.' },
        { x: 283, y: 110, label: 'الزكاة (حقّ في المال)', note: 'ركنٌ رابع من أركان الإسلام: ٢٫٥٪ من المال النام إذا بلغ النصاب وحال عليه الحول، وتُصرف في الأصناف الثمانية — بها تتنقّى المال ويزيد البركة.' },
        { x: 170, y: 183, label: 'بيت المال', note: 'تُجمع فيه موارد الدولة: الزكاة والخراج والفيء والغنائم والجزية، ويُنفق منها على المصالح العامة وفق الوظيفة التوزيعية والإنتاجية والرقابية للدولة الإسلامية.' },
        { x: 57, y: 110, label: 'الإنفاق والوقف', note: 'الإنفاق في الحوائج والأمر بالمعروف، والوقف حبس الأصل وسبيل الثمرة: صدقةٌ جاريةٌ تجري بعد انقطاع اليد، ومنه تعود البركة على الكاسب وتمنع الحصر في الأيدي.' }
      ],
      steps: [
        '<rect x="118" y="14" width="104" height="36" rx="9" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="170" y="37" text-anchor="middle" font-size="11.5" fill="var(--acc)" font-weight="700">الكسب الحلال</text><text x="170" y="208" text-anchor="middle" font-size="12.5" fill="var(--muted)">١) ارسم الصندوق العلوي: الكسب الحلال</text>',
        '<rect x="231" y="87" width="104" height="36" rx="9" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="283" y="110" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">الزكاة (٢٫٥٪)</text><rect x="118" y="160" width="104" height="36" rx="9" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><text x="170" y="183" text-anchor="middle" font-size="11.5" fill="var(--ink)" font-weight="700">بيت المال</text><text x="170" y="208" text-anchor="middle" font-size="12.5" fill="var(--muted)">٢) أضف الزكاة يمينًا وبيت المال أسفل</text>',
        '<rect x="5" y="87" width="104" height="36" rx="9" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/><text x="57" y="110" text-anchor="middle" font-size="10.5" fill="var(--ink)" font-weight="700">الإنفاق والوقف</text><text x="170" y="102" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">المال أمانة</text><text x="170" y="120" text-anchor="middle" font-size="10" fill="var(--muted)">تكتمل البركة بالدوران</text><text x="170" y="208" text-anchor="middle" font-size="12.5" fill="var(--muted)">٣) أضف الإنفاق والوقف يسارًا واكتب في الوسط فائدته</text>',
        arrow(226, 56, 254, 84, 'var(--muted)') + arrow(254, 126, 226, 154, 'var(--muted)') + arrow(114, 154, 86, 126, 'var(--muted)') + arrow(86, 84, 114, 56, 'var(--muted)') + '<text x="170" y="208" text-anchor="middle" font-size="12.5" fill="var(--muted)">٤) اربط المحطات بأسهم مغلقة لتكتمل الدورة</text>'
      ]
    },

    /* ── ٧. نبأ الفاسق: التثبّت ── */
    verifyNews: {
      title: 'نبأ الفاسق: خطوات التثبّت قبل القبول أو الردّ',
      teaches: 'يُعلّم مراحل التثبّت من خبر الفاسق كما أمرت ﴿فَتَبَيَّنُوا﴾: فحصُ حال الراوي ثم مقارنةُ الروايات ثم الاستشارة، ثم الحكم بالقبول مع قرائن الصدق أو الردّ لفساد الراوي — وهي درسة عملية لدفع الشائعات عن المجتمع.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="خطوات التثبت من نبأ الفاسق">' + DEFS +
        '<text x="170" y="30" text-anchor="middle" font-size="12" fill="var(--bad)" font-weight="700">﴿إِنْ جَاءَكُمْ فَاسِقٌ بِنَبَأٍ فَتَبَيَّنُوا﴾</text>' +
        '<circle cx="34" cy="86" r="20" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/>' +
        '<text x="34" y="90" text-anchor="middle" font-size="11" fill="var(--bad)" font-weight="700">نبأ</text>' +
        '<text x="34" y="124" text-anchor="middle" font-size="9" fill="var(--muted)">جاءكم فاسق</text>' +
        arrow(58, 86, 68, 86, 'var(--muted)') +
        '<rect x="70" y="60" width="76" height="52" rx="9" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="108" y="82" text-anchor="middle" font-size="10.5" fill="var(--acc)" font-weight="700">١) تحقّق</text>' +
        '<text x="108" y="100" text-anchor="middle" font-size="9.5" fill="var(--ink)">من حال الراوي</text>' +
        arrow(150, 86, 158, 86, 'var(--muted)') +
        '<rect x="156" y="60" width="76" height="52" rx="9" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="194" y="82" text-anchor="middle" font-size="10.5" fill="var(--ink)" font-weight="700">٢) قارن</text>' +
        '<text x="194" y="100" text-anchor="middle" font-size="9.5" fill="var(--ink)">بين الروايات</text>' +
        arrow(236, 86, 244, 86, 'var(--muted)') +
        '<rect x="242" y="60" width="76" height="52" rx="9" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/>' +
        '<text x="280" y="82" text-anchor="middle" font-size="10.5" fill="var(--ink)" font-weight="700">٣) استشر</text>' +
        '<text x="280" y="100" text-anchor="middle" font-size="9.5" fill="var(--ink)">أهل العلم</text>' +
        arrow(280, 114, 280, 138, 'var(--muted)') +
        '<rect x="70" y="140" width="248" height="48" rx="10" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/>' +
        '<text x="194" y="162" text-anchor="middle" font-size="10.5" fill="var(--ok)">النتيجة أ: قبول الخبر مع قرائن الصدق</text>' +
        '<text x="194" y="180" text-anchor="middle" font-size="10.5" fill="var(--bad)">النتيجة ب: رده إذا فسد الراوي أو تفرّقت الروايات</text>' +
        '</svg>',
      parts: [
        { x: 34, y: 86, label: 'نبأ الفاسق', note: 'الخبر المطلوب تحقّقه جاء من فاسق، أي معلنٍ بالفسوق؛ والأصل في خبره الردّ إلا مع قرينة صدق، خشية أن تصيبوا قوماً بجهالة فتكونوا على ما فعلتم نادمين.' },
        { x: 108, y: 82, label: 'الخطوة ١: التحقّق من الراوي', note: 'اسأل عن حال الناقل: أثق به؟ هل هو عالم بالنقل؟ هل سمع الخبر بنفسه أم ساقه عن غيره؟ ثمّ سؤال أهل العلم وطلب الأصول الأصلية.' },
        { x: 194, y: 82, label: 'الخطوة ٢: مقارنة الروايات', note: 'قارن الخبر بقرآنٍ وسنةٍ وعقلٍ وسياق: إن اتفقت الروايات و لم تنقضْها قرينةُ كذبٍ قُبل، وإن تفرّقت أو خالفت النصوص رُدّ ولم يُعمل به.' },
        { x: 280, y: 162, label: 'النتيجة: قبول أو ردّ', note: 'بعد الخطوات الثلاث يُحكم: قبولٌ بقرائن الصدق (المكذوب عنده بريء والمُتّهم فيه تقييد)، أو ردٌّ تام. والغرض كله درءُ المفاسد: حفظ الأعراض ومنع الفتنة وسلامة المجتمع.' }
      ],
      steps: [
        '<circle cx="34" cy="86" r="20" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/><text x="34" y="90" text-anchor="middle" font-size="11" fill="var(--bad)" font-weight="700">نبأ</text><text x="34" y="124" text-anchor="middle" font-size="9" fill="var(--muted)">جاءكم فاسق</text><text x="170" y="30" text-anchor="middle" font-size="12.5" fill="var(--muted)">١) ارسم دائرة: خبر جاء من فاسق</text>',
        '<rect x="70" y="60" width="76" height="52" rx="9" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="108" y="82" text-anchor="middle" font-size="10.5" fill="var(--acc)" font-weight="700">١) تحقّق</text><text x="108" y="100" text-anchor="middle" font-size="9.5" fill="var(--ink)">من حال الراوي</text><rect x="156" y="60" width="76" height="52" rx="9" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="194" y="82" text-anchor="middle" font-size="10.5" fill="var(--ink)" font-weight="700">٢) قارن</text><text x="194" y="100" text-anchor="middle" font-size="9.5" fill="var(--ink)">بين الروايات</text>' + arrow(58, 86, 68, 86, 'var(--muted)') + arrow(150, 86, 158, 86, 'var(--muted)') + '<text x="170" y="30" text-anchor="middle" font-size="12.5" fill="var(--muted)">٢) أضف صندوقي التحقّق ومقارنة الروايات</text>',
        '<rect x="242" y="60" width="76" height="52" rx="9" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><text x="280" y="82" text-anchor="middle" font-size="10.5" fill="var(--ink)" font-weight="700">٣) استشر</text><text x="280" y="100" text-anchor="middle" font-size="9.5" fill="var(--ink)">أهل العلم</text>' + arrow(236, 86, 244, 86, 'var(--muted)') + '<text x="170" y="30" text-anchor="middle" font-size="12.5" fill="var(--muted)">٣) أضف صندوق الاستشارة واربطه بالسهم</text>',
        '<rect x="70" y="140" width="248" height="48" rx="10" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/><text x="194" y="162" text-anchor="middle" font-size="10.5" fill="var(--ok)">النتيجة أ: قبول الخبر مع قرائن الصدق</text><text x="194" y="180" text-anchor="middle" font-size="10.5" fill="var(--bad)">النتيجة ب: رده إذا فسد الراوي أو تفرّقت الروايات</text>' + arrow(280, 114, 280, 138, 'var(--muted)') + '<text x="170" y="30" text-anchor="middle" font-size="12.5" fill="var(--muted)">٤) اختم صندوق النتيجتين: قبولٌ أو ردٌّ</text>'
      ]
    },

    /* ══ اللغة الإنكليزية (٥ رسوم) ══ */

    /* ── ٨. مقارنة الأزمنة على خط الزمن ── */
    tenseCompare: {
      title: 'مقارنة الأزمنة على خط الزمن: past وpresent perfect وfuture',
      teaches: 'يُعلّم مقارنة الأزمنة على خطٍّ زمنيٍّ واحد: الماضي البسيط حدثٌ منتهٍ ومضى خلفنا، والمضارع التام يصل الماضي بالحاضر ولا ينقطع عن الآن، والمستقبل لم يبدأ بعد — وبذلك يصبح اختيار الزمن في الجملة الإنكليزية قرارًا بصريًّا لا مجرد حفظ.',
      svg: '<svg viewBox="0 0 340 190" role="img" aria-label="خط زمني يقارن الماضي البسيط والمضارع التام والمستقبل">' + DEFS +
        '<text x="170" y="26" text-anchor="middle" font-size="12" fill="var(--ink)" font-weight="700">الماضي ← الحاضر ← المستقبل</text>' +
        '<line x1="78" y1="96" x2="166" y2="96" stroke="var(--ok)" stroke-width="3"/>' + arrow(140, 96, 168, 96, 'var(--ok)') +
        '<line x1="78" y1="96" x2="78" y2="138" stroke="var(--ok)" stroke-width="2.4"/>' +
        '<line x1="168" y1="96" x2="168" y2="138" stroke="var(--ok)" stroke-width="2.4" stroke-dasharray="4 4"/>' +
        '<text x="120" y="84" text-anchor="middle" font-size="10.5" fill="var(--ok)" font-weight="700">PRESENT PERFECT: I have played</text>' +
        '<line x1="170" y1="52" x2="170" y2="160" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 5"/>' +
        '<line x1="20" y1="142" x2="318" y2="142" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#figArrow5)"/>' +
        '<circle cx="60" cy="142" r="8" fill="#3B82C4"/>' +
        '<circle cx="262" cy="142" r="8" fill="#D48A2A"/>' +
        '<text x="16" y="162" font-size="10.5" fill="#3B82C4" font-weight="700">PAST: I played</text>' +
        '<text x="16" y="178" font-size="9.5" fill="var(--muted)">I was playing (long)</text>' +
        '<text x="170" y="162" text-anchor="middle" font-size="10.5" fill="var(--ink)" font-weight="700">NOW / الآن</text>' +
        '<text x="324" y="162" text-anchor="end" font-size="10.5" fill="#D48A2A" font-weight="700">FUTURE: I will play</text>' +
        '<text x="324" y="178" text-anchor="end" font-size="9.5" fill="var(--muted)">I will have played</text></svg>',
      parts: [
        { x: 60, y: 142, label: 'The past simple (الماضي البسيط)', note: 'حدثٌ منتهٍ في زمنٍ ماضٍ له بداية ونهاية ولم يبق منه شيء: I played / I fell over. يُستعمل للحدث القصير الذي يقطع حدثًا أطول، مثل: I was ice skating when I fell over.' },
        { x: 120, y: 96, label: 'The present perfect (المضارع التام)', note: 'القوس الأخضر يبدأ في الماضي وينتهي عند NOW: have/has + V3 — مثل I have played. الفعل بدأ في الماضي وأثره باقٍ حتى الآن، ولذلك لا نذكر زمنًا ماضيًا معه (I have lived here since 2009).' },
        { x: 170, y: 142, label: 'NOW (نقطة الحاضر)', note: 'الخط المتقطّع هو لحظة الكلام نفسها: الماضي كلّه على يسره، والمستقبل كلّه على يمناه. كل جملة إنكليزية تُوضع على هذا الخط فتظهر من ناحيتها الزمنية.' },
        { x: 262, y: 142, label: 'The future (المستقبل)', note: 'ما لم يقع بعد: will + V مثل I will play، أو الأطول will be playing وwill have played. يقع كلّه بعد NOW على يمين الخط فلا يختلط بالماضي.' }
      ],
      steps: [
        '<line x1="20" y1="142" x2="318" y2="142" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#figArrow)"/><text x="170" y="26" text-anchor="middle" font-size="12.5" fill="var(--muted)">1) ارسم خطًّا أفقيًّا بسهم: خط الزمن</text>',
        '<line x1="170" y1="52" x2="170" y2="160" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 5"/><circle cx="60" cy="142" r="8" fill="#3B82C4"/><circle cx="262" cy="142" r="8" fill="#D48A2A"/><text x="170" y="26" text-anchor="middle" font-size="12.5" fill="var(--muted)">2) ضع خط NOW في المنتصف ونقطتين: الماضي والمستقبل</text>',
        '<line x1="78" y1="96" x2="166" y2="96" stroke="var(--ok)" stroke-width="3"/><line x1="78" y1="96" x2="78" y2="138" stroke="var(--ok)" stroke-width="2.4"/><text x="120" y="84" text-anchor="middle" font-size="10.5" fill="var(--ok)" font-weight="700">PRESENT PERFECT: I have played</text><text x="170" y="26" text-anchor="middle" font-size="12.5" fill="var(--muted)">3) ارسم قوسًا من الماضي ينتهي عند NOW = المضارع التام</text>',
        '<text x="16" y="162" font-size="10.5" fill="#3B82C4" font-weight="700">PAST: I played</text><text x="16" y="178" font-size="9.5" fill="var(--muted)">I was playing (long)</text><text x="170" y="162" text-anchor="middle" font-size="10.5" fill="var(--ink)" font-weight="700">NOW / الآن</text><text x="324" y="162" text-anchor="end" font-size="10.5" fill="#D48A2A" font-weight="700">FUTURE: I will play</text><text x="324" y="178" text-anchor="end" font-size="9.5" fill="var(--muted)">I will have played</text><text x="170" y="26" text-anchor="middle" font-size="12.5" fill="var(--muted)">4) اكتب تحت كل رمز صيغته</text>'
      ]
    },

    /* ── ٩. الأفعال الناقصة ── */
    modalObligation: {
      title: 'الأفعال الناقصة: obligation وno obligation وprohibition',
      teaches: 'يُعلّم الفرق الدقيق بين صيغ الأفعال الناقصة: must وhave to وneed to للوجوب، وdon’t have to وneedn’t لعدم الضرورة، وmustn’t للمنع — وهو أكثر ما يخطئ فيه الطالب في تمرينات معاني الأفعال، فالفارق بين (لا يجب عليك) و(ممنوع عليك) فارقٌ في المعنى لا في الصيغة.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="ثلاث درجات للأفعال الناقصة: وجوب وعدم وجوب ومنع">' + DEFS +
        '<text x="170" y="22" text-anchor="middle" font-size="11.5" fill="var(--ink)" font-weight="700">ثلاث درجات: وجوب، عدم وجوب، منع</text>' +
        '<rect x="232" y="36" width="100" height="104" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="282" y="58" text-anchor="middle" font-size="11" fill="var(--acc)" font-weight="700">وجوب — obligation</text>' +
        '<text x="282" y="84" text-anchor="middle" font-size="11" fill="var(--ink)">must</text>' +
        '<text x="282" y="106" text-anchor="middle" font-size="11" fill="var(--ink)">have to</text>' +
        '<text x="282" y="128" text-anchor="middle" font-size="11" fill="var(--ink)">need to</text>' +
        '<rect x="120" y="36" width="100" height="104" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="170" y="58" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">لا وجوب — no obligation</text>' +
        '<text x="170" y="90" text-anchor="middle" font-size="11" fill="var(--ink)">don’t have to</text>' +
        '<text x="170" y="116" text-anchor="middle" font-size="11" fill="var(--ink)">needn’t</text>' +
        '<rect x="8" y="36" width="100" height="104" rx="10" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/>' +
        '<text x="58" y="58" text-anchor="middle" font-size="11" fill="var(--bad)" font-weight="700">منع — prohibition</text>' +
        '<text x="58" y="90" text-anchor="middle" font-size="11" fill="var(--ink)">mustn’t</text>' +
        '<text x="58" y="116" text-anchor="middle" font-size="11" fill="var(--ink)">can’t</text>' +
        '<text x="170" y="158" text-anchor="middle" font-size="10.5" fill="var(--ink)">You must wear your seat belt — إلزامٌ حتمي</text>' +
        '<text x="170" y="176" text-anchor="middle" font-size="10.5" fill="var(--ink)">You don’t have to wait — لا ضرورة لك</text>' +
        '<text x="170" y="194" text-anchor="middle" font-size="10.5" fill="var(--bad)">You mustn’t use your phone — ممنوع عليك</text></svg>',
      parts: [
        { x: 282, y: 58, label: 'Obligation (الوجوب)', note: 'must وhave to وneed to تعني إلزامًا: فعلٌ لازم لا بدّ منه. الفرق بينها: must قوةٌ من المتكلّم أو القانون، وhave to ضرورةٌ خارجية، وneed to حاجةٌ موضوعية — والثلاثة بمعنى واحد في أسئلة الكتاب.' },
        { x: 170, y: 58, label: 'No obligation (لا وجوب)', note: 'don’t have to وneedn’t تعنيان أنه لا ضرورة للفعل، أي جاز فعله وتركه: You don’t have to come — الحضور متروك لك. وليستا بمعنى المنع، وهذا هو الخطأ الشائع في الاختبارات.' },
        { x: 58, y: 58, label: 'Prohibition (المنع)', note: 'mustn’t تعني المنع القاطع من الفعل: You mustn’t use your phone while driving. أي أن الفعل حرام/محظور لا مجرد غير لازم — والخلط بين mustn’t وdon’t have to من أكثر الأخطاء.' },
        { x: 170, y: 176, label: 'أمثلة مترجمة', note: 'الأمثلة تربط الصيغة بمعناها: إلزام حتمي (must)، عدم ضرورة (don’t have to)، ومنع (mustn’t). اقرأ المثال أولًا ثم سمِّ الدرجة، فتتشابه الكلمات وتختلف المعاني.' }
      ],
      steps: [
        '<rect x="232" y="36" width="100" height="104" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="282" y="58" text-anchor="middle" font-size="11" fill="var(--acc)" font-weight="700">وجوب — obligation</text><text x="282" y="84" text-anchor="middle" font-size="11" fill="var(--ink)">must</text><text x="282" y="106" text-anchor="middle" font-size="11" fill="var(--ink)">have to</text><text x="282" y="128" text-anchor="middle" font-size="11" fill="var(--ink)">need to</text><text x="170" y="22" text-anchor="middle" font-size="12" fill="var(--muted)">1) ارسم صندوق الوجوب: must / have to / need to</text>',
        '<rect x="120" y="36" width="100" height="104" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="170" y="58" text-anchor="middle" font-size="11" fill="var(--ink)" font-weight="700">لا وجوب — no obligation</text><text x="170" y="90" text-anchor="middle" font-size="11" fill="var(--ink)">don’t have to</text><text x="170" y="116" text-anchor="middle" font-size="11" fill="var(--ink)">needn’t</text><text x="170" y="22" text-anchor="middle" font-size="12" fill="var(--muted)">2) أضف صندوق عدم الوجوب: don’t have to / needn’t</text>',
        '<rect x="8" y="36" width="100" height="104" rx="10" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/><text x="58" y="58" text-anchor="middle" font-size="11" fill="var(--bad)" font-weight="700">منع — prohibition</text><text x="58" y="90" text-anchor="middle" font-size="11" fill="var(--ink)">mustn’t</text><text x="58" y="116" text-anchor="middle" font-size="11" fill="var(--ink)">can’t</text><text x="170" y="22" text-anchor="middle" font-size="12" fill="var(--muted)">3) أضف صندوق المنع: mustn’t / can’t</text>',
        '<text x="170" y="158" text-anchor="middle" font-size="10.5" fill="var(--ink)">You must wear your seat belt — إلزامٌ حتمي</text><text x="170" y="176" text-anchor="middle" font-size="10.5" fill="var(--ink)">You don’t have to wait — لا ضرورة لك</text><text x="170" y="194" text-anchor="middle" font-size="10.5" fill="var(--bad)">You mustn’t use your phone — ممنوع عليك</text><text x="170" y="22" text-anchor="middle" font-size="12" fill="var(--muted)">4) اكتب مثالًا مترجمًا لكل درجة من الدرجات</text>'
      ]
    },

    /* ── ١٠. المبني للمجهول ── */
    passiveVoice: {
      title: 'المبني للمجهول passive: من الفاعل إلى المفعول',
      teaches: 'يُعلّم بناء المبني للمجهول في الإنكليزية: يتحوّل المفعول إلى فاعل، ويأتي الفعل على صورة be + الجزء الثالث، ويُذكر الفاعل الأصلي بعد by اختياريًّا — مع جملة واحدة يُرى فيها التحوّل بعينه من الأعلى إلى الأسفل.',
      svg: '<svg viewBox="0 0 340 190" role="img" aria-label="تحوّل الجملة الفاعلية إلى مبني للمجهول">' + DEFS +
        '<rect x="30" y="12" width="280" height="48" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="170" y="32" text-anchor="middle" font-size="10.5" fill="var(--muted)">المبني للفاعل (active voice)</text>' +
        '<text x="170" y="52" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">The chef cooks the meal</text>' +
        arrow(70, 68, 70, 106, 'var(--gold)') +
        '<text x="205" y="94" text-anchor="middle" font-size="12" fill="var(--gold)" font-weight="700">be + V3 + by</text>' +
        '<rect x="30" y="122" width="280" height="48" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="170" y="142" text-anchor="middle" font-size="10.5" fill="var(--muted)">المبني للمجهول (passive voice)</text>' +
        '<text x="170" y="162" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">The meal is cooked by the chef</text>' +
        '<text x="170" y="186" text-anchor="middle" font-size="11" fill="var(--muted)">الفاعل الأصلي بعد by اختياريٌّ: The meal is cooked.</text></svg>',
      parts: [
        { x: 170, y: 40, label: 'الجملة الفاعلية (active)', note: 'الفاعل في صدر الجملة: The chef cooks the meal — الطاهي يطبخ الطبق. نبدأ بالفاعل لأنّه هو الذي يفعل، وهذا هو الأصل في الإنكليزية ونحوه.' },
        { x: 205, y: 94, label: 'الصيغة: be + V3', note: 'القاعدة كلّها في هذا السطر: فعل be على صيغة الزمن المناسب (is / are / was / were) ثم الجزء الثالث من الفعل (cooked, written, taken). بدون be لا يوجد مبنيٌّ للمجهول مطلقاً.' },
        { x: 70, y: 92, label: 'سهم التحوّل', note: 'التبدّل يتمّ من الأعلى إلى الأسفل: المفعول (the meal) يصعد إلى موضع الفاعل، والفاعل (the chef) ينزل بعد by — يتحوّل ترتيب الكلمات لا معنى الجملة.' },
        { x: 170, y: 162, label: 'الجملة المبنية للمجهول (passive)', note: 'The meal is cooked by the chef — الطبق هو موضع العناية الآن، لا الطاهي. نستعمل الصيغة حين يكون الفاعل مجهولًا أو غير مهمًّا: This bridge was built in 1920.' }
      ],
      steps: [
        '<rect x="30" y="12" width="280" height="48" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="170" y="32" text-anchor="middle" font-size="10.5" fill="var(--muted)">المبني للفاعل (active voice)</text><text x="170" y="52" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">The chef cooks the meal</text><text x="170" y="186" text-anchor="middle" font-size="11.5" fill="var(--muted)">1) ارسم صندوق الجملة الفاعلية: فاعل ثم فعل ثم مفعول</text>',
        arrow(70, 68, 70, 106, 'var(--gold)') + '<text x="205" y="94" text-anchor="middle" font-size="12" fill="var(--gold)" font-weight="700">be + V3 + by</text><text x="170" y="186" text-anchor="middle" font-size="11.5" fill="var(--muted)">2) ارسم سهمًا نازلًا واكتب بجانبه الصيغة: be + V3</text>',
        '<rect x="30" y="122" width="280" height="48" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="170" y="142" text-anchor="middle" font-size="10.5" fill="var(--muted)">المبني للمجهول (passive voice)</text><text x="170" y="162" text-anchor="middle" font-size="13" fill="var(--ink)" font-weight="700">The meal is cooked by the chef</text><text x="170" y="186" text-anchor="middle" font-size="11.5" fill="var(--muted)">3) أضف صندوق المبني للمجهول بترتيبٍ جديد للكلمات</text>',
        '<rect x="118" y="148" width="76" height="20" rx="6" fill="none" stroke="var(--bad)" stroke-width="2.5"/><text x="170" y="186" text-anchor="middle" font-size="11.5" fill="var(--muted)">4) حاصر is cooked: هذا هو be + الجزء الثالث</text>'
      ]
    },

    /* ── ١١. الأشرطة الشرطية ── */
    conditionalLadder: {
      title: 'الأشرطة الشرطية: zero وfirst وsecond وthird conditional',
      teaches: 'يُرتّب الأشرطة الشرطية الأربعة بترتيب درجة الواقع: الشريط الصفر لحقيقةٍ دائمة، والأول لنتيجةٍ محتملة، والثاني لموقفٍ غير واقعي في الحاضر، والثالث لماضٍ لم يقع — ومن هذا الترتيب تُجمع قواعدهم الأربعة في نظرة واحدة وتُميّز كلٍّ منها في الاختبار.',
      svg: '<svg viewBox="0 0 340 210" role="img" aria-label="سلّم الأشرطة الشرطية الأربعة">' + DEFS +
        '<text x="170" y="20" text-anchor="middle" font-size="11.5" fill="var(--ink)" font-weight="700">من الحقيقة الدائمة إلى الماضي غير المحقق</text>' +
        '<rect x="14" y="26" width="286" height="36" rx="9" fill="var(--soft)" stroke="var(--muted)" stroke-width="2"/>' +
        '<text x="157" y="49" text-anchor="middle" font-size="10.5" fill="var(--ink)">Zero: if + present, present — حقيقة دائمة</text>' +
        '<circle cx="316" cy="44" r="14" fill="var(--soft)" stroke="var(--muted)" stroke-width="2"/><text x="316" y="48" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="700">٠</text>' +
        '<rect x="14" y="70" width="286" height="36" rx="9" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="157" y="93" text-anchor="middle" font-size="10.5" fill="var(--ink)">First: if + present, will + V — نتيجة محتملة</text>' +
        '<circle cx="316" cy="88" r="14" fill="var(--acc)" stroke="var(--acc)" stroke-width="2"/><text x="316" y="92" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">١</text>' +
        '<rect x="14" y="114" width="286" height="36" rx="9" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="157" y="137" text-anchor="middle" font-size="10.5" fill="var(--ink)">Second: if + past, would + V — غير واقعي الآن</text>' +
        '<circle cx="316" cy="132" r="14" fill="var(--gold)" stroke="var(--gold)" stroke-width="2"/><text x="316" y="136" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">٢</text>' +
        '<rect x="14" y="158" width="286" height="36" rx="9" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/>' +
        '<text x="157" y="181" text-anchor="middle" font-size="10.5" fill="var(--ink)">Third: if + had + pp, would have + pp — ماضٍ لم يقع</text>' +
        '<circle cx="316" cy="176" r="14" fill="var(--bad)" stroke="var(--bad)" stroke-width="2"/><text x="316" y="180" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">٣</text>' +
        '<text x="170" y="206" text-anchor="middle" font-size="11.5" fill="var(--muted)">كل شريط يزيد بُعدًا عن الواقع: دائمة ← محتملة ← خيالية ← فائتة</text></svg>',
      parts: [
        { x: 157, y: 44, label: 'الشريط الصفر (zero conditional)', note: 'if + مضارع، مضارع — النتيجة ثابتة لا تتغيّر: Plants die if you don’t water them. / Water boils at 100°C. الحقيقة علمية دائمة، ولذلك لا يأتي will في الجملتين معاً.' },
        { x: 157, y: 88, label: 'الشريط الأول (first conditional)', note: 'if + مضارع، will + المصدر — نتيجة مستقبلية محتملة: If you come round tomorrow, I’ll help you. ملاحظة مهمة: الجملة الشرطية لا تأخذ will مطلقاً، والمصدر يأتي بعدها في الجملة الأخرى.' },
        { x: 157, y: 132, label: 'الشريط الثاني (second conditional)', note: 'if + ماضٍ، would + المصدر — موقف غير واقعي في الحاضر: If I were you, I’d train as a doctor. يُستعمل للتخيل والتمني والنصيحة، وقد يأتي could وmight بدل will.' },
        { x: 157, y: 176, label: 'الشريط الثالث (third conditional)', note: 'if + had + pp، would have + pp — حدثان وقعا في الماضي ولم يقع الثاني لأن الأول لم يقع: If we had trained harder, we would have won. وهذا هو نمط الندم والتأويل الماضي.' }
      ],
      steps: [
        '<rect x="14" y="26" width="286" height="36" rx="9" fill="var(--soft)" stroke="var(--muted)" stroke-width="2"/><text x="157" y="49" text-anchor="middle" font-size="10.5" fill="var(--ink)">Zero: if + present, present — حقيقة دائمة</text><circle cx="316" cy="44" r="14" fill="var(--soft)" stroke="var(--muted)" stroke-width="2"/><text x="316" y="48" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="700">٠</text><text x="170" y="206" text-anchor="middle" font-size="11.5" fill="var(--muted)">1) ارسم أول صندوق: الشريط الصفر (حقيقة دائمة)</text>',
        '<rect x="14" y="70" width="286" height="36" rx="9" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="157" y="93" text-anchor="middle" font-size="10.5" fill="var(--ink)">First: if + present, will + V — نتيجة محتملة</text><circle cx="316" cy="88" r="14" fill="var(--acc)" stroke="var(--acc)" stroke-width="2"/><text x="316" y="92" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">١</text><text x="170" y="206" text-anchor="middle" font-size="11.5" fill="var(--muted)">2) أضف الشريط الأول للنتيجة المستقبلية المحتملة</text>',
        '<rect x="14" y="114" width="286" height="36" rx="9" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="157" y="137" text-anchor="middle" font-size="10.5" fill="var(--ink)">Second: if + past, would + V — غير واقعي الآن</text><circle cx="316" cy="132" r="14" fill="var(--gold)" stroke="var(--gold)" stroke-width="2"/><text x="316" y="136" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">٢</text><rect x="14" y="158" width="286" height="36" rx="9" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="2.5"/><text x="157" y="181" text-anchor="middle" font-size="10.5" fill="var(--ink)">Third: if + had + pp, would have + pp — ماضٍ لم يقع</text><circle cx="316" cy="176" r="14" fill="var(--bad)" stroke="var(--bad)" stroke-width="2"/><text x="316" y="180" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">٣</text><text x="170" y="206" text-anchor="middle" font-size="11.5" fill="var(--muted)">3) أضف الشريطين الثاني والثالث للمواقف غير الواقعية</text>',
        '<text x="170" y="20" text-anchor="middle" font-size="11.5" fill="var(--ink)" font-weight="700">من الحقيقة الدائمة إلى الماضي غير المحقق</text><text x="170" y="206" text-anchor="middle" font-size="11.5" fill="var(--muted)">4) اكتب العنوان ورتّب الأشرطة من الأخفّ إلى الأثقل</text>'
      ]
    },

    /* ── ١٢. حروف الجرّ الزمانية ── */
    timePrepositions: {
      title: 'حروف الجرّ الزمانية: at وon وin وfor وsince',
      teaches: 'يُعلّم استعمال حروف الجرّ الزمانية بقاعدة واحدة لكل حرف: at للوقت المحدد، وon ليومٍ أو تاريخ، وin لشهرٍ أو سنةٍ أو فصل، وfor لمدة زمنية معلومة، وsince لنقطة بداية — وهي أكثر الحروف خلطًا في أسئلة هذه الوحدة بين for وsince.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="حروف الجر الزمانية: at وon وin وfor وsince">' + DEFS +
        '<text x="170" y="20" text-anchor="middle" font-size="11.5" fill="var(--ink)" font-weight="700">at ← on ← in ← for / since</text>' +
        '<rect x="232" y="34" width="100" height="86" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="282" y="56" text-anchor="middle" font-size="15" fill="var(--acc)" font-weight="700">at</text>' +
        '<text x="282" y="78" text-anchor="middle" font-size="9.5" fill="var(--ink)">وقتٌ محدد</text>' +
        '<text x="282" y="98" text-anchor="middle" font-size="9.5" fill="var(--muted)">at 7 o’clock</text>' +
        '<text x="282" y="114" text-anchor="middle" font-size="9.5" fill="var(--muted)">at night</text>' +
        '<rect x="120" y="34" width="100" height="86" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="170" y="56" text-anchor="middle" font-size="15" fill="var(--ink)" font-weight="700">on</text>' +
        '<text x="170" y="78" text-anchor="middle" font-size="9.5" fill="var(--ink)">يومٌ أو تاريخ</text>' +
        '<text x="170" y="98" text-anchor="middle" font-size="9.5" fill="var(--muted)">on Monday</text>' +
        '<text x="170" y="114" text-anchor="middle" font-size="9.5" fill="var(--muted)">on 5 May</text>' +
        '<rect x="8" y="34" width="100" height="86" rx="10" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/>' +
        '<text x="58" y="56" text-anchor="middle" font-size="15" fill="var(--ink)" font-weight="700">in</text>' +
        '<text x="58" y="78" text-anchor="middle" font-size="9.5" fill="var(--ink)">شهرٌ أو سنةٌ أو فصل</text>' +
        '<text x="58" y="98" text-anchor="middle" font-size="9.5" fill="var(--muted)">in July</text>' +
        '<text x="58" y="114" text-anchor="middle" font-size="9.5" fill="var(--muted)">in summer</text>' +
        '<rect x="8" y="134" width="324" height="52" rx="10" fill="rgba(214,69,69,.12)" stroke="var(--bad)" stroke-width="2.5"/>' +
        '<text x="170" y="154" text-anchor="middle" font-size="10.5" fill="var(--ink)">for + مدةٍ منتهية: for three years / for a week</text>' +
        '<text x="170" y="176" text-anchor="middle" font-size="10.5" fill="var(--ink)">since + نقطة بداية: since 2009 / since Monday</text></svg>',
      parts: [
        { x: 282, y: 56, label: 'at (وقتٌ محدّد)', note: 'at للساعة واللحظة المحدّدة بالضبط: at 7 o’clock، at noon، at night، at the moment. القاعدة الصغيرة: كلّ ما ينتهي بساعةٍ أو لحظةٍ تامة يأخذ at ولا يأخذ in أو on.' },
        { x: 170, y: 56, label: 'on (يومٌ أو تاريخ)', note: 'on ليومٍ محدّد أو تاريخ: on Monday، on my birthday، on 5 May. وإن قُرن بيومٍ وساعةٍ سبق on: The bus leaves on Monday at 7 o’clock.' },
        { x: 58, y: 56, label: 'in (شهرٌ أو سنةٌ أو فصل)', note: 'in للفترات الطويلة المفتوحة: in July، in 2026، in summer، in the morning. أي كلّ ما يمتدّ أكثر من يوم فهو in — وهو النقيض الأمثل لـ at.' },
        { x: 170, y: 154, label: 'for و since (المدة والبداية)', note: 'for تدلّ على مدةٍ منتهية: for ten years؛ وsince تدلّ على نقطة بداية تستمرّ حتى الآن: since 2003. ولا تُستعملان مع at/on/in، وهما مفتاح أسئلة (How long …?) في هذه الوحدة.' }
      ],
      steps: [
        '<rect x="232" y="34" width="100" height="86" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="282" y="56" text-anchor="middle" font-size="15" fill="var(--acc)" font-weight="700">at</text><text x="282" y="78" text-anchor="middle" font-size="9.5" fill="var(--ink)">وقتٌ محدد</text><text x="282" y="98" text-anchor="middle" font-size="9.5" fill="var(--muted)">at 7 o’clock</text><text x="170" y="20" text-anchor="middle" font-size="11.5" fill="var(--muted)">1) ارسم صندوق at للوقت المحدّد</text>',
        '<rect x="120" y="34" width="100" height="86" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="170" y="56" text-anchor="middle" font-size="15" fill="var(--ink)" font-weight="700">on</text><text x="170" y="78" text-anchor="middle" font-size="9.5" fill="var(--ink)">يومٌ أو تاريخ</text><text x="170" y="98" text-anchor="middle" font-size="9.5" fill="var(--muted)">on Monday</text><text x="170" y="20" text-anchor="middle" font-size="11.5" fill="var(--muted)">2) أضف صندوق on ليومٍ أو تاريخ</text>',
        '<rect x="8" y="34" width="100" height="86" rx="10" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><text x="58" y="56" text-anchor="middle" font-size="15" fill="var(--ink)" font-weight="700">in</text><text x="58" y="78" text-anchor="middle" font-size="9.5" fill="var(--ink)">شهرٌ أو سنةٌ أو فصل</text><text x="58" y="98" text-anchor="middle" font-size="9.5" fill="var(--muted)">in July</text><text x="170" y="20" text-anchor="middle" font-size="11.5" fill="var(--muted)">3) أضف صندوق in للشهر والسنة والفصل</text>',
        '<rect x="8" y="134" width="324" height="52" rx="10" fill="rgba(214,69,69,.12)" stroke="var(--bad)" stroke-width="2.5"/><text x="170" y="154" text-anchor="middle" font-size="10.5" fill="var(--ink)">for + مدةٍ منتهية: for three years / for a week</text><text x="170" y="176" text-anchor="middle" font-size="10.5" fill="var(--ink)">since + نقطة بداية: since 2009 / since Monday</text><text x="170" y="20" text-anchor="middle" font-size="11.5" fill="var(--muted)">4) اختم بالصندوق السفلي: for للمدة وsince للبداية</text>'
      ]
    }

  };

  /* مادة كل رسم — لتُعرض الرسوم مجمّعة بحسب المادة في مكتبة التطبيق */
  const SUBJ = {
    noonTanweenRules: 'التربية الإسلامية', kahfStages: 'التربية الإسلامية',
    familySystem: 'التربية الإسلامية', musaThreeActs: 'التربية الإسلامية',
    muhasabahSteps: 'التربية الإسلامية', moneyCycle: 'التربية الإسلامية',
    verifyNews: 'التربية الإسلامية',
    tenseCompare: 'اللغة الإنكليزية', modalObligation: 'اللغة الإنكليزية',
    passiveVoice: 'اللغة الإنكليزية', conditionalLadder: 'اللغة الإنكليزية',
    timePrepositions: 'اللغة الإنكليزية'
  };

  /* الدمج لا يعتمد على ترتيب التحميل: figs.js قد يُقرأ قبل هذا الملف أو بعده،
     فنجعل الخاصية نفسها تُرجع اتحاد الاثنين مهما تقدّم الآخر. */
  let baseF = window.FIGS || {};
  let baseS = window.FIG_SUBJ || {};
  const merge = (a, b) => Object.assign(Object.assign({}, a), b);
  Object.defineProperty(window, 'FIGS', {
    configurable: true, enumerable: true,
    get: () => merge(baseF, FIGS),
    set: v => { baseF = v || {}; }
  });
  Object.defineProperty(window, 'FIG_SUBJ', {
    configurable: true, enumerable: true,
    get: () => merge(baseS, SUBJ),
    set: v => { baseS = v || {}; }
  });
})();
