/* ══════════════════════════════════════════════════════════════════════
   الرسوم التفاعلية (النقطة ٨)
   ──────────────────────────────────────────────────────────────────────
   كل رسم هنا ثلاث قطع:
     · svg    : الرسم نفسه (SVG بخط متجه فلا يضبِط عند التكبير).
     · parts  : أجزاءه: كل جزء نقطة (x,y) على نفس مقياس الرسم،
                ولها اسم وشرح يظهر عند الضغط عليه — «اضغط لتتعلّم».
     · steps  : «كيف أرسمه؟» خطوة بخطوة: كل خطوة هيئة SVG جديدة
                تُضاف على ما قبلها، فيتبين للطالب كيف يُبنى الرسم.
   الرسم لا يُعرض صورةً جامدة: يُكبَّر ويُصغَّر ويُسحب، ويعمل على
   الشاشة واللمس، ويفتح ملء الشاشة، وكل جزء فيه يشرح نفسه.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  /* مساعد لبناء رسم: العنوان، الوصف، الأجزاء، الخطوات */
  function F(o) { return o; }
  /* علامة سهم داخل الرسم — نرسم رأس السهم كمثلث بلونه نفسه،
     لأن علامات SVG (marker) لا ترث لون الخطّ الذي تعلّقه، فتظهر بالأسود. */
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
  const DEFS = '<defs><marker id="figArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink)"/></marker></defs>';

  const FIGS = {
    /* ── الفيزياء: الكهرباء الساكنة ── */
    spark: F({
      title: 'التفريغ في الهواء: الموصل الكروي المشحون',
      teaches: 'يُعلّم أن الشحنة تتراكم حيث انحنى الموصل، وأن مجال الشحنة يقوى بانحنائها حتى ينكسر الهواء العازل فيحدث شرارة. من هنا تُفهَم «الجهد التفريقي» ومبدأ «التضاريس الشحنية».',
      svg: '<svg viewBox="0 0 320 170" role="img" aria-label="موصل كروي مشحون تخرج منه شرارة في الهواء">' + DEFS +
        '<circle cx="110" cy="90" r="52" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return '<text x="' + (110 + 34 * Math.cos(a)) + '" y="' + (96 + 34 * Math.sin(a)) + '" text-anchor="middle" font-size="18" fill="var(--bad)" font-weight="700">+</text>'; }).join('') +
        '<path class="zap" d="M162 82 L198 70 L190 92 L232 78 L222 100 L268 86" fill="none" stroke="var(--gold)" stroke-width="4" stroke-linejoin="round"/>' +
        '<text x="250" y="132" text-anchor="middle" font-size="14" fill="var(--muted)">تفريغ في الهواء</text></svg>',
      parts: [
        { x: 110, y: 90, label: 'الموصل المشحون', note: 'جسم كروي معدني شحنته كلها موجبة. الشحنة لا توزَّع بالتساوي بل تزداد كثافتها حيث يكون انحناء السطح أشدّ.' },
        { x: 145, y: 62, label: 'الشحنة عند الانحناء', note: 'الكثافة الشحنية الأكبر تكون عند الانحناء الحادّ (الطرف)، ولهذا تبدأ الشرارة من هناك لا من الجهة الملساء.' },
        { x: 226, y: 88, label: 'شرارة التفريغ', note: 'حين يقوى المجال حتى يساوي حدّ تفكّك الهواء، يُفكَّك الهواء العازل ويمرّ التيار بين الموصلين — هذه الشرارة هي التفريغ الكهربائي.' }
      ],
      steps: [
        '<circle cx="110" cy="90" r="52" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/><text x="110" y="160" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم دائرة = الموصل الكروي</text>',
        [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return '<text x="' + (110 + 34 * Math.cos(a)) + '" y="' + (96 + 34 * Math.sin(a)) + '" text-anchor="middle" font-size="18" fill="var(--bad)" font-weight="700">+</text>'; }).join('') + '<text x="110" y="160" text-anchor="middle" font-size="13" fill="var(--muted)">٢) وزّع الشحنات الموجبة على السطح</text>',
        '<path class="zap" d="M162 82 L198 70 L190 92 L232 78 L222 100 L268 86" fill="none" stroke="var(--gold)" stroke-width="4" stroke-linejoin="round"/><text x="150" y="160" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ارسم شرارة متكسّرة نحو الخارج</text>'
      ]
    }),
    twoConductors: F({
      title: 'موصلان موجبان وسالبان: بينهما قوى تنافر وتجاذب',
      teaches: 'يُعلّم قانون كولوم بصريًّا: الشحنتان المتشابهتان تتنافران، والمختلفتان تتجاذبان، والقوة تتناسب مع حساب الشحنتين وتعكس المسافة بينهما.',
      svg: '<svg viewBox="0 0 320 140" role="img" aria-label="موصل موجب وموصل سالب متقابلان">' + DEFS +
        '<rect x="40" y="100" width="90" height="10" rx="3" fill="var(--ok)"/><rect x="190" y="100" width="90" height="10" rx="3" fill="var(--ok)"/>' +
        '<circle cx="85" cy="62" r="34" fill="#E46B55"/><text x="85" y="72" text-anchor="middle" font-size="30" fill="#fff" font-weight="700">+</text>' +
        '<circle cx="235" cy="62" r="34" fill="#3B82C4"/><text x="235" y="72" text-anchor="middle" font-size="30" fill="#fff" font-weight="700">−</text>' +
        arrow(120, 62, 178, 62, '#E46B55') + arrow(200, 62, 142, 62, '#3B82C4') +
        '<text x="160" y="52" text-anchor="middle" font-size="13" fill="var(--muted)">تجاذب</text>' +
        '<text x="85" y="132" text-anchor="middle" font-size="13" fill="var(--muted)">شحنة موجبة</text><text x="235" y="132" text-anchor="middle" font-size="13" fill="var(--muted)">شحنة سالبة</text></svg>',
      parts: [
        { x: 85, y: 62, label: 'الشحنة الموجبة', note: 'إشارة الموجب (+) — الشحنة المتنافرة مع الموجب. كثافتها أكبر عند حافة الجسم.' },
        { x: 235, y: 62, label: 'الشحنة السالبة', note: 'إشارة السالب (−) — تتجاذب مع الموجب. الفرق بينها وبين الموجب هو الجهد التفريقي.' },
        { x: 160, y: 62, label: 'القوة بين الشحنتين', note: 'السهم من كل شحنة نحو الأخرى: قوى تنافر وتجاذب متساوية المقدار ومتعاكسة الاتجاه — قانون نيوتن الثالث، وقوّتها F = k·q₁q₂/d².' }
      ],
      steps: [
        '<circle cx="85" cy="62" r="34" fill="#E46B55"/><text x="85" y="72" text-anchor="middle" font-size="30" fill="#fff" font-weight="700">+</text><text x="110" y="130" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم دائرة ووضع فيها (+)</text>',
        '<circle cx="235" cy="62" r="34" fill="#3B82C4"/><text x="235" y="72" text-anchor="middle" font-size="30" fill="#fff" font-weight="700">−</text><text x="110" y="130" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ارسم على مقربة دائرة ووضع فيها (−)</text>',
        arrow(120, 62, 178, 62, '#E46B55') + arrow(200, 62, 142, 62, '#3B82C4') + '<text x="160" y="130" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ارسم سهمين متقابلين = التجاذب</text>'
      ]
    }),
    plates: F({
      title: 'الصفيحتان المتوازيتان: مجال كهربائي منتظم',
      teaches: 'يُعلّم أن المجال بين صفيحتين متوازيتين متساويتي الجهد يكون منتظمًا: خطوطه موازية ومتساوية التباعد، وأن E = V/d، وأن هذا المجال لا يعتمد على شكل الصفيحتين بل على بعدهما.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="صفيحتان متوازيتان بينهما مجال كهربائي منتظم">' + DEFS +
        '<rect x="60" y="30" width="220" height="12" rx="3" fill="#C9473A"/><rect x="60" y="158" width="220" height="12" rx="3" fill="#2F6FB0"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => '<text x="' + (72 + i * 22) + '" y="26" text-anchor="middle" font-size="15" fill="#C9473A" font-weight="700">+</text><text x="' + (72 + i * 22) + '" y="190" text-anchor="middle" font-size="17" fill="#2F6FB0" font-weight="700">−</text>').join('') +
        [0, 1, 2, 3, 4, 5, 6, 7].map(i => '<line class="fl" x1="' + (84 + i * 25) + '" y1="46" x2="' + (84 + i * 25) + '" y2="150" stroke="var(--ok)" stroke-width="2.4" marker-end="url(#figArrow)"/>').join('') +
        '<path d="M60 46 Q36 100 60 154 M280 46 Q304 100 280 154" fill="none" stroke="var(--ok)" stroke-width="2" stroke-dasharray="4 4" opacity=".7"/>' +
        '<text x="302" y="104" font-size="18" fill="var(--ink)" font-style="italic">d</text><text x="36" y="104" font-size="17" fill="var(--ink)" font-style="italic">E</text></svg>',
      parts: [
        { x: 170, y: 36, label: 'الصفيحة الموجبة', note: 'الصفيحة العلوية مشحونة إيجابيًا. شحنتها موزّعة بالتساوي على سطحها لأن السطح أملس.' },
        { x: 170, y: 164, label: 'الصفيحة السالبة', note: 'الصفيحة السفلية مشحونة سلبًا، وبينها وبين العلوية فرق جهد V.' },
        { x: 122, y: 100, label: 'خطوط المجال المنتظم', note: 'خطوط موازية متساوية التباعد — علامة المجال المنتظم. تخرج من الموجب وتنتهي عند السالب، وقوّتها E = V/d.' },
        { x: 302, y: 104, label: 'المسافة d', note: 'كلما زادت d قلّ المجال E لثبات V. وهذا أساس مكثّف الصفيحتين: C = εA/d.' }
      ],
      steps: [
        '<rect x="60" y="30" width="220" height="12" rx="3" fill="#C9473A"/><text x="170" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم صفيحة علوية موجبة</text>',
        '<rect x="60" y="158" width="220" height="12" rx="3" fill="#2F6FB0"/><text x="170" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ارسم تحتها صفيحة سالبة متساوية</text>',
        [0, 1, 2, 3, 4, 5, 6, 7].map(i => '<line class="fl" x1="' + (84 + i * 25) + '" y1="46" x2="' + (84 + i * 25) + '" y2="150" stroke="var(--ok)" stroke-width="2.4" marker-end="url(#figArrow)"/>').join('') + '<text x="170" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ارسم خطوطًا عمودية موازية متساوية = المجال</text>',
        '<text x="302" y="104" font-size="18" fill="var(--ink)" font-style="italic">d</text><text x="170" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">٤) سمِّ بُعد الخطين (d)</text>'
      ]
    }),
    waxRoll: F({
      title: 'الرول الشمعي: موصلان ملفوفان بعازل',
      teaches: 'يُعلّم بناء المكثّف البسيط: موصلان معدنيان يفصل بينهما عازل (الورق المغلف بالشمع)، وهذا تجسيد عملي لمكثّف الصفيحتين ولتعليل قانونه C = εA/d.',
      svg: '<svg viewBox="0 0 320 150" role="img" aria-label="شريطان موصلان بينهما ورق عازل ملفوفان">' + DEFS +
        '<g transform="translate(10,20)"><ellipse cx="70" cy="55" rx="40" ry="50" fill="var(--soft)" stroke="var(--muted)"/><ellipse cx="70" cy="55" rx="28" ry="36" fill="none" stroke="#9AA4AC" stroke-width="6"/><ellipse cx="70" cy="55" rx="16" ry="21" fill="none" stroke="#E0BE7A" stroke-width="6"/><path d="M70 5 L270 5 L270 30 L70 30" fill="#9AA4AC"/><path d="M70 36 L270 36 L270 50 L70 50" fill="#E0BE7A"/><path d="M70 56 L270 56 L270 80 L70 80" fill="#9AA4AC"/><text x="285" y="22" font-size="12" fill="var(--muted)">موصل</text><text x="285" y="47" font-size="12" fill="var(--muted)">عازل</text><text x="285" y="72" font-size="12" fill="var(--muted)">موصل</text></g></svg>',
      parts: [
        { x: 80, y: 75, label: 'الملفّف (المقطع العرضي)', note: 'الأقطار الثلاثة المتعاقبة من الخارج للداخل: موصل، عازل، موصل — كلما قلّ سمك العازل زادت سعة المكثّف.' },
        { x: 200, y: 30, label: 'الشريط الموصل الأول', note: 'شريط رقيق من النحاس أو الألمنيوم — لوحة المكثّف الأولى.' },
        { x: 200, y: 55, label: 'العازل (الورق المغلف بالشمع)', note: 'يفصل الشريطين ويمنع مرور التيار بينهما. نوعه يحدّد ثابتة العزل ε، وهي أقوى عامل في سعة المكثّف.' }
      ],
      steps: [
        '<ellipse cx="80" cy="75" rx="40" ry="50" fill="var(--soft)" stroke="var(--muted)"/><text x="160" y="140" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم دائرة أفقية المقطع = ملفّف الورق</text>',
        '<ellipse cx="80" cy="75" rx="28" ry="36" fill="none" stroke="#9AA4AC" stroke-width="6"/><text x="160" y="140" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ارسم دائرة داخلية أضيق = الشريط الأول</text>',
        '<ellipse cx="80" cy="75" rx="16" ry="21" fill="none" stroke="#E0BE7A" stroke-width="6"/><text x="160" y="140" text-anchor="middle" font-size="13" fill="var(--muted)">٣) أضف دائرة أصغر = العازل</text>',
        '<path d="M80 20 L280 20 L280 100 L80 100" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 4"/><text x="160" y="140" text-anchor="middle" font-size="13" fill="var(--muted)">٤) سحِب الأشرطة الثلاثة لليمين = لوحتا المكثّف</text>'
      ]
    }),

    /* ── الأحياء: الخلايا ── */
    plantCell: F({
      title: 'الخلية النباتية: أجزاءها ووظائفها',
      teaches: 'يُعلّم بناء الخلية النباتية: الجدار الخلوي ثم الغشاء ثم السيتوبلازم، وأعضاء النواة والبلاستيدات والفجوة العصارية — ومنها يُفهم اختلاف النبات عن الحيوان (جدار، بلاستيدات، فجوة كبيرة).',
      svg: '<svg viewBox="0 0 340 210" role="img" aria-label="رسم مبسّط للخلية النباتية">' + DEFS +
        '<rect x="20" y="15" width="300" height="180" rx="18" fill="#EAF3E4" stroke="#5B8C3E" stroke-width="5"/>' +
        '<rect x="30" y="25" width="280" height="160" rx="14" fill="#F6FAF2" stroke="#8FB96B" stroke-width="2.5"/>' +
        '<ellipse cx="215" cy="132" rx="86" ry="52" fill="#DCEAF7" stroke="#7FA8D6" stroke-width="2"/>' +
        '<circle cx="120" cy="80" r="30" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/>' +
        '<circle cx="120" cy="80" r="11" fill="var(--gold)"/>' +
        '<ellipse cx="70" cy="140" rx="22" ry="12" fill="#9CCB6B" stroke="#5B8C3E" stroke-width="2"/>' +
        '<ellipse cx="255" cy="62" rx="20" ry="11" fill="#9CCB6B" stroke="#5B8C3E" stroke-width="2"/>' +
        '<ellipse cx="160" cy="160" rx="18" ry="9" fill="#E8B04B" stroke="#B9822A" stroke-width="2"/>' +
        arrow(120, 30, 120, 15, 'var(--muted)') +
        '<text x="170" y="12" text-anchor="middle" font-size="11" fill="var(--muted)">الجدار الخلوي</text></svg>',
      parts: [
        { x: 22, y: 100, label: 'الجدار الخلوي', note: 'الطبقة الخارجية الصلبة من السليولوز. يعطي الخلية شكلها الثابت ويحميها — ولا يوجد في الخلية الحيوانية، ومن هنا اختلاف النبات.' },
        { x: 34, y: 100, label: 'الغشاء البلازمي', note: 'غشاء رقيق تحت الجدار، ينظّم دخول المواد إلى الخلية وخروجها (خاصية انتقائية النفاذية).' },
        { x: 120, y: 80, label: 'النواة', note: 'مركز السيطرة: تحتوي الوراثة (DNA) وتنسّق كل أنشطة الخلية. تحيط بها غلاف نووي به ثقوب.' },
        { x: 120, y: 80, label: 'النويّة', note: 'نواة صغيرة داخل النواة، تصنع الرايبوسومات.' },
        { x: 70, y: 140, label: 'البلاستيدة الخضراء', note: 'تحتوي الكلوروفيل وتصنع الغذاء بالبناء الضوئي. وجودها يميّز الخلية النباتية عن الحيوانية.' },
        { x: 215, y: 132, label: 'الفجوة العصارية', note: 'خزّان العصائر والمواد الغذائية. في النبات الناضج تكون كبيرة فتدفع النواة إلى الحافة.' },
        { x: 160, y: 160, label: 'الميتوكندريا', note: 'بيت الطاقة: تحرّر الطاقة من الغذاء بالتنفس الخلوي (ATP).' },
        { x: 170, y: 100, label: 'السيتوبلازم', note: 'سائل هلامي تسبح فيه كل الأعضاء وتحدث فيه معظم التفاعلات الحيوية.' }
      ],
      steps: [
        '<rect x="20" y="15" width="300" height="180" rx="18" fill="#EAF3E4" stroke="#5B8C3E" stroke-width="5"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم مستطيلًا مستدير الأركان = الجدار الخلوي</text>',
        '<rect x="30" y="25" width="280" height="160" rx="14" fill="#F6FAF2" stroke="#8FB96B" stroke-width="2.5"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٢) أضف مستطيلًا أصغر داخليًا = الغشاء البلازمي</text>',
        '<ellipse cx="215" cy="132" rx="86" ry="52" fill="#DCEAF7" stroke="#7FA8D6" stroke-width="2"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ارسم بيضاويًا كبيرًا في الأسفل = الفجوة العصارية</text>',
        '<circle cx="120" cy="80" r="30" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/><circle cx="120" cy="80" r="11" fill="var(--gold)"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٤) ارسم دائرة بنواة صغيرة داخلها = النواة والنويّة</text>',
        '<ellipse cx="70" cy="140" rx="22" ry="12" fill="#9CCB6B" stroke="#5B8C3E" stroke-width="2"/><ellipse cx="255" cy="62" rx="20" ry="11" fill="#9CCB6B" stroke="#5B8C3E" stroke-width="2"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٥) أضف بيضاويات خضراء = البلاستيدات</text>',
        '<ellipse cx="160" cy="160" rx="18" ry="9" fill="#E8B04B" stroke="#B9822A" stroke-width="2"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٦) أضف بيضاويًا برتقاليًّا = الميتوكندريا</text>'
      ]
    }),
    photosynthesis: F({
      title: 'البناء الضوئي: من أين يدخل ماذا وإلى أين',
      teaches: 'يُعلّم معادلة البناء الضوئي مادّةً لا حفظًا: دخول الماء من الجذور وثاني أكسيد الكربون من الثغور، ودور الضوء والكلوروفيل، وخروج الغلوكوز والأكسجين — وكل سهم هنا سؤال في الامتحان.',
      svg: '<svg viewBox="0 0 340 220" role="img" aria-label="رسم توضيحي للبناء الضوئي في ورقة نبات">' + DEFS +
        '<circle cx="45" cy="35" r="20" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return '<line x1="' + (45 + 22 * Math.cos(a)) + '" y1="' + (35 + 22 * Math.sin(a)) + '" x2="' + (45 + 33 * Math.cos(a)) + '" y2="' + (35 + 33 * Math.sin(a)) + '" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>'; }).join('') +
        arrow(80, 55, 140, 95, 'var(--gold)') +
        '<text x="98" y="70" font-size="12" fill="var(--gold)">ضوء</text>' +
        '<path d="M150 90 Q230 40 300 90 Q230 145 150 90 Z" fill="#9CCB6B" stroke="#5B8C3E" stroke-width="3"/>' +
        '<path d="M150 90 L300 90" stroke="#5B8C3E" stroke-width="2"/>' +
        '<path d="M195 90 L175 60 M220 90 L245 62 M245 90 L262 118 M205 90 L188 118" stroke="#5B8C3E" stroke-width="1.6" fill="none"/>' +
        arrow(215, 205, 215, 155, '#3B82C4') + '<text x="215" y="216" text-anchor="middle" font-size="12" fill="#3B82C4">ماء من الجذور</text>' +
        arrow(315, 40, 275, 78, '#6B7A85') + '<text x="300" y="24" text-anchor="middle" font-size="11" fill="#6B7A85">CO₂ من الثغور</text>' +
        arrow(240, 90, 310, 130, '#5B8C3E') + '<text x="290" y="150" text-anchor="middle" font-size="12" fill="#5B8C3E">غلوكوز</text>' +
        arrow(180, 90, 110, 130, '#7FA8D6') + '<text x="98" y="150" text-anchor="middle" font-size="12" fill="#7FA8D6">O₂</text>' +
        '<path d="M215 90 L215 205" stroke="#8A6A3B" stroke-width="6" stroke-linecap="round"/></svg>',
      parts: [
        { x: 45, y: 35, label: 'الضوء الشمس', note: 'مصدر الطاقة الذي يُحوَّل إلى طاقة كيميائية في الغذاء. بدونه يتوقّف البناء الضوئي ولو توفر كل شيء آخر.' },
        { x: 215, y: 90, label: 'الورقة والكلوروفيل', note: 'البلاستيدة الخضراء تحتوي الكلوروفيل الذي يمتصّ الضوء الأحمر والبنفسجي ويعكس الأخضر — لهذا الورقة خضراء.' },
        { x: 215, y: 180, label: 'الساق والجذور', note: 'الجذور تمتصّ الماء والمملاح، والساق يحملهما إلى الورقة.' },
        { x: 275, y: 78, label: 'ثاني أكسيد الكربون', note: 'يدخل من الثغور (المسامات) في أسفل الورقة. هو مصدر الكربون في الغذاء.' },
        { x: 310, y: 130, label: 'الغلوكوز', note: 'الناتج الغذائي: C₆H₁₂O₆. يُخزَّن نشاً في النبات أو يُستعمل في التنفس.' },
        { x: 110, y: 130, label: 'الأكسجين', note: 'ناتج ثانوي يخرج من الثغور — وهو الأكسجين الذي نتنفّسه نحن وكل الكائنات.' },
        { x: 215, y: 205, label: 'الماء', note: 'يُمتصّ من التربة بالجذور ويصعد بالخاصية القطبية (الرفع بالتجاذب والنتح).' }
      ],
      steps: [
        '<circle cx="45" cy="35" r="20" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/><text x="170" y="212" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم الشمس أعلى اليسار</text>',
        '<path d="M150 90 Q230 40 300 90 Q230 145 150 90 Z" fill="#9CCB6B" stroke="#5B8C3E" stroke-width="3"/><text x="170" y="212" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ارسم الورقة (بيضاوي به قلب)</text>',
        '<path d="M215 90 L215 205" stroke="#8A6A3B" stroke-width="6" stroke-linecap="round"/><text x="170" y="212" text-anchor="middle" font-size="13" fill="var(--muted)">٣) أضف الساق والجذور</text>',
        arrow(80, 55, 140, 95, 'var(--gold)') + arrow(215, 205, 215, 155, '#3B82C4') + '<text x="170" y="212" text-anchor="middle" font-size="13" fill="var(--muted)">٤) ارسم سهم الضوء والماء الصاعد</text>',
        arrow(315, 40, 275, 78, '#6B7A85') + arrow(240, 90, 310, 130, '#5B8C3E') + arrow(180, 90, 110, 130, '#7FA8D6') + '<text x="170" y="212" text-anchor="middle" font-size="13" fill="var(--muted)">٥) ارسم سهم CO₂ الداخل وسهمَي O₂ والغلوكوز الخارجيين</text>'
      ]
    }),
    animalCell: F({
      title: 'الخلية الحيوانية: ما يختلف عن النباتية',
      teaches: 'يُعلّم الفرق بين الخلية الحيوانية والنباتية بمقارنة بصرية: لا جدار، ولا بلاستيدات خضراء، ولا فجوة كبيرة، وتحتها أجزاء صغيرة تسمّى الليسوسومات.',
      svg: '<svg viewBox="0 0 340 200" role="img" aria-label="رسم مبسّط للخلية الحيوانية">' + DEFS +
        '<path d="M60 100 C60 40 120 25 175 30 C240 35 290 60 288 105 C286 155 235 178 170 175 C105 172 60 150 60 100 Z" fill="#FBF0F0" stroke="#C9473A" stroke-width="4"/>' +
        '<circle cx="150" cy="95" r="34" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/><circle cx="150" cy="95" r="12" fill="var(--gold)"/>' +
        '<ellipse cx="235" cy="80" rx="22" ry="11" fill="#E8B04B" stroke="#B9822A" stroke-width="2"/>' +
        '<ellipse cx="110" cy="145" rx="16" ry="9" fill="#E8B04B" stroke="#B9822A" stroke-width="2"/>' +
        '<circle cx="225" cy="140" r="12" fill="#C9A0C9" stroke="#8E5C8E" stroke-width="2"/>' +
        '<circle cx="95" cy="70" r="8" fill="#C9A0C9" stroke="#8E5C8E" stroke-width="2"/>' +
        '<text x="170" y="194" text-anchor="middle" font-size="11" fill="var(--muted)">لا جدار · لا بلاستيدات · لا فجوة كبيرة</text></svg>',
      parts: [
        { x: 62, y: 100, label: 'الغشاء البلازمي', note: 'حدّ الخلية الوحيد هنا — لا جدار خلوي، لهذا تأخذ الخلية الحيوانية أشكالًا متعدّدة وليست ثابتة الشكل.' },
        { x: 150, y: 95, label: 'النواة', note: 'كما في النباتية تمامًا: مركز السيطرة والوراثة.' },
        { x: 235, y: 80, label: 'الميتوكندريا', note: 'موجودة في الحيوانية والنباتية معًا: تحرّر الطاقة بالتنفس الخلوي.' },
        { x: 225, y: 140, label: 'الليسوسوم', note: 'عضية خاصة بالحيوانات تقريبًا: كيس به إنزيمات هاضمة تنحلّ المواد والأجزاء التالفة داخل الخلية.' },
        { x: 170, y: 180, label: 'ثلاثة أشياء مفقودة', note: 'الحيوانية بلا: جدار خلوي، بلا بلاستيدة خضراء، وبلا فجوة عصارية كبيرة — هذه أقصر طريقة للتفريق بينهما في الامتحان.' }
      ],
      steps: [
        '<path d="M60 100 C60 40 120 25 175 30 C240 35 290 60 288 105 C286 155 235 178 170 175 C105 172 60 150 60 100 Z" fill="#FBF0F0" stroke="#C9473A" stroke-width="4"/><text x="170" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم شكلًا غير منتظم = الغشاء (لا جدار)</text>',
        '<circle cx="150" cy="95" r="34" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/><circle cx="150" cy="95" r="12" fill="var(--gold)"/><text x="170" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ارسم النواة في المنتصف</text>',
        '<ellipse cx="235" cy="80" rx="22" ry="11" fill="#E8B04B" stroke="#B9822A" stroke-width="2"/><ellipse cx="110" cy="145" rx="16" ry="9" fill="#E8B04B" stroke="#B9822A" stroke-width="2"/><text x="170" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">٣) أضف الميتوكندريا (بيضاويات برتقالية)</text>',
        '<circle cx="225" cy="140" r="12" fill="#C9A0C9" stroke="#8E5C8E" stroke-width="2"/><circle cx="95" cy="70" r="8" fill="#C9A0C9" stroke="#8E5C8E" stroke-width="2"/><text x="170" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">٤) أضف دوائر بنفسجية صغيرة = الليسوسومات</text>'
      ]
    }),

    /* ── الكيمياء ── */
    atomBohr: F({
      title: 'ذرة بور: المدارات والإلكترونات',
      teaches: 'يُعلّم بناء الذرة: نواة موجبة في المركز وإلكترونات سالبة تدور في مدارات محدّدة، وعدد مدارات الملفّ الأول ٢ ثم ٨ — ومن هنا تُفهم خواصّ العناصر في الجدول الدوري.',
      svg: '<svg viewBox="0 0 300 220" role="img" aria-label="نموذج ذرة بور">' + DEFS +
        '<circle cx="150" cy="110" r="82" fill="none" stroke="var(--line)" stroke-width="2"/>' +
        '<circle cx="150" cy="110" r="50" fill="none" stroke="var(--line)" stroke-width="2"/>' +
        '<circle cx="150" cy="110" r="16" fill="var(--bad)" stroke="#8E2A22" stroke-width="3"/>' +
        '<text x="150" y="116" text-anchor="middle" font-size="14" fill="#fff" font-weight="700">+</text>' +
        '<circle cx="150" cy="28" r="9" fill="#3B82C4"/><text x="150" y="33" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">−</text>' +
        '<circle cx="232" cy="110" r="9" fill="#3B82C4"/><text x="232" y="115" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">−</text>' +
        '<circle cx="150" cy="60" r="8" fill="#3B82C4"/><text x="150" y="65" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">−</text>' +
        '<circle cx="100" cy="110" r="8" fill="#3B82C4"/><text x="100" y="115" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">−</text>' +
        '<text x="245" y="35" font-size="12" fill="var(--muted)">المدار ٢</text><text x="198" y="78" font-size="12" fill="var(--muted)">المدار ١</text></svg>',
      parts: [
        { x: 150, y: 110, label: 'النواة', note: 'في مركز الذرة: فيها البروتونات (موجبة) والنيوترونات (محايدة). كتلتها أغلب كتلة الذرة كلها رغم صغر حجمها.' },
        { x: 150, y: 60, label: 'المدار الأول', note: 'أقرب المدارات إلى النواة، ويسعى إلكترونين فقط (٢). كلما امتلأ المدار ثبّتت الذرة.' },
        { x: 150, y: 28, label: 'المدار الثاني', note: 'يُسعى فيه ثمانية إلكترونات (٨). عدد مدارات الملف الأول ٢ ثم ٨ ثم ١٨ بحسب القاعدة ٢ن².' },
        { x: 150, y: 119, label: 'الشحنة الكليّة', note: 'الذرة محايدة كهربائيًّا: عدد البروتونات الموجبة يساوي عدد الإلكترونات السالبة.' }
      ],
      steps: [
        '<circle cx="150" cy="110" r="16" fill="var(--bad)" stroke="#8E2A22" stroke-width="3"/><text x="150" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم دائرة حمراء صغيرة = النواة</text>',
        '<circle cx="150" cy="110" r="50" fill="none" stroke="var(--line)" stroke-width="2"/><text x="150" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ارسم دائرة أكبر حولها = المدار الأول</text>',
        '<circle cx="150" cy="60" r="8" fill="#3B82C4"/><circle cx="100" cy="110" r="8" fill="#3B82C4"/><text x="150" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ضع إلكترونين على المدار الأول</text>',
        '<circle cx="150" cy="110" r="82" fill="none" stroke="var(--line)" stroke-width="2"/><circle cx="150" cy="28" r="9" fill="#3B82C4"/><circle cx="232" cy="110" r="9" fill="#3B82C4"/><text x="150" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٤) ارسم المدار الثاني وأضف إلكترونات</text>'
      ]
    }),
    labFunnel: F({
      title: 'جهاز الترشيح: القمع والماصات والدورق',
      teaches: 'يُعلّم خطوات الترشيح الفعلي: وضع المصعّر في القمع، وطية المصعّر ثلاث طيّات ليلاصق الجدار، ثم صبّ الخليط بعصارة ماء على جدار القمع — أخطاء شائعة تسأل عنها.',
      svg: '<svg viewBox="0 0 300 220" role="img" aria-label="جهاز الترشيح: قمع وماصات ودورق">' + DEFS +
        '<path d="M70 25 L230 25 L160 110 L160 150 L140 150 L140 110 Z" fill="#EAF3F7" stroke="#5B8C3E" stroke-width="3"/>' +
        '<path d="M90 33 L160 95 L160 105 L145 105 L145 95 Z" fill="#F2F7E9" stroke="#9CCB6B" stroke-width="2"/>' +
        '<circle cx="160" cy="120" r="7" fill="#7FA8D6"/>' +
        '<path d="M120 165 L200 165 L192 210 L128 210 Z" fill="#EAF3F7" stroke="#5B8C3E" stroke-width="3"/>' +
        '<circle cx="160" cy="192" r="14" fill="#DCEAF7" stroke="#7FA8D6" stroke-width="2"/>' +
        arrow(120, 60, 150, 88, 'var(--gold)') +
        '<text x="248" y="45" font-size="12" fill="var(--muted)">القمع</text><text x="248" y="92" font-size="12" fill="var(--muted)">المصعّر</text><text x="248" y="140" font-size="12" fill="var(--muted)">قطرة نقيّة</text><text x="248" y="195" font-size="12" fill="var(--muted)">الدورق</text></svg>',
      parts: [
        { x: 150, y: 25, label: 'القمع الزجاجي', note: 'يُثبَّت على حامل بالحلقة. فتحته تُسدّ بالقطنة أو المصعّر قبل الصبّ.' },
        { x: 150, y: 70, label: 'المصعّر (الورق الترشيح)', note: 'يُطوى ثلاث طيّات: يُطوى نصفين ثم يُفتح بطرفين مختلفين ليلاصق جدار القمع. طيّة واحدة تجعل السائل يندفع من الحافة لا من خلال الورق.' },
        { x: 160, y: 120, label: 'قطرة الماء النقيّة', note: 'السائل الخارج صافٍ: الذرات الجامدة كبيرة فلا تمرّ عبر مسام المصعّر — هذا هو مبدأ الترشيح الفيزيائي (لا كيميائي).' },
        { x: 160, y: 192, label: 'الدورق المستلم', note: 'يجمع السائل المترشّح. إن كان الخليط ساخنًا يُترك ليبرد أولًا قبل الترشيح لتجنّب تمزّق الزجاج.' }
      ],
      steps: [
        '<path d="M70 25 L230 25 L160 110 L160 150 L140 150 L140 110 Z" fill="#EAF3F7" stroke="#5B8C3E" stroke-width="3"/><text x="150" y="215" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم القمع (مثلث مقلوب عليه ساق)</text>',
        '<path d="M90 33 L160 95 L160 105 L145 105 L145 95 Z" fill="#F2F7E9" stroke="#9CCB6B" stroke-width="2"/><text x="150" y="215" text-anchor="middle" font-size="13" fill="var(--muted)">٢) أضف المصعّر ملاصقًا للجدار</text>',
        '<path d="M120 165 L200 165 L192 210 L128 210 Z" fill="#EAF3F7" stroke="#5B8C3E" stroke-width="3"/><text x="150" y="215" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ارسم الدورق تحت الساق</text>',
        arrow(120, 60, 150, 88, 'var(--gold)') + '<text x="150" y="215" text-anchor="middle" font-size="13" fill="var(--muted)">٤) ارسم سهم الصبّ على جدار القمع لا في منتصفه</text>'
      ]
    }),

    /* ── الرياضيات ── */
    circleParts: F({
      title: 'أجزاء الدائرة: نصها وقطرها ومحيطها',
      teaches: 'يُفرّق بصريًّا بين النصف قطر والقطر والمماس والوتر، ويُعلّم أن القطر = ٢ × النصف قطر، وأن المماس يعامس القطر بزاوية قائمة — وهي أصل قانون طول القوس ومساحة القطاع.',
      svg: '<svg viewBox="0 0 300 220" role="img" aria-label="أجزاء الدائرة">' + DEFS +
        '<circle cx="145" cy="110" r="78" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/>' +
        '<circle cx="145" cy="110" r="4" fill="var(--ink)"/>' +
        '<line x1="145" y1="110" x2="215" y2="60" stroke="var(--bad)" stroke-width="3"/><text x="192" y="78" font-size="13" fill="var(--bad)">r</text>' +
        '<line x1="67" y1="110" x2="223" y2="110" stroke="var(--gold)" stroke-width="3" stroke-dasharray="6 4"/><text x="145" y="103" text-anchor="middle" font-size="13" fill="var(--gold)">d</text>' +
        '<line x1="223" y1="30" x2="223" y2="190" stroke="var(--ok)" stroke-width="3"/>' +
        '<path d="M223 110 L180 110" stroke="var(--ok)" stroke-width="2"/><path d="M215 110 L223 110 L223 118" fill="none" stroke="var(--ok)" stroke-width="2"/>' +
        '<text x="248" y="118" font-size="13" fill="var(--ok)">مماس</text>' +
        '<line x1="90" y1="55" x2="200" y2="165" stroke="#8E5C8E" stroke-width="3"/><text x="140" y="105" font-size="12" fill="#8E5C8E" transform="rotate(45 140 105)">وتر</text></svg>',
      parts: [
        { x: 145, y: 110, label: 'المركز ونصّ القطر r', note: 'نصّ القطر يبدأ من المركز وينتهي على المحيط. هو أساس كل قانون في الدائرة: الطول = ٢πr، والمحيط = ٢πr، والمساحة = πr².' },
        { x: 145, y: 110, label: 'القطر d', note: 'يمرّ بالمركز وينتهي نقطتين على المحيط. d = 2r بالضبط، وطوله ٢πr ÷ π أي ٢r.' },
        { x: 223, y: 110, label: 'المماس', note: 'مستقيم يلامس الدائرة عند نقطة واحدة فقط، ويصنع مع نصف القطر عند تلك النقطة زاوية قائمة — وهذا سرّ قانون طول المماس √(d² − r²).' },
        { x: 145, y: 110, label: 'الوتر', note: 'يربط نقطتين على المحيط ولا يمرّ بالمركز بالضرورة. أطول وتر في الدائرة هو القطر نفسه.' }
      ],
      steps: [
        '<circle cx="145" cy="110" r="78" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/><text x="150" y="210" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم الدائرة بفرجارك أو بقالب</text>',
        '<circle cx="145" cy="110" r="4" fill="var(--ink)"/><line x1="145" y1="110" x2="215" y2="60" stroke="var(--bad)" stroke-width="3"/><text x="150" y="210" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ضع نقطة المركز وارسم نصف قطرًا</text>',
        '<line x1="67" y1="110" x2="223" y2="110" stroke="var(--gold)" stroke-width="3" stroke-dasharray="6 4"/><text x="150" y="210" text-anchor="middle" font-size="13" fill="var(--muted)">٣) مُدّ النصف قطرًا عكس الاتجاه حتى المحيط = القطر</text>',
        '<line x1="223" y1="30" x2="223" y2="190" stroke="var(--ok)" stroke-width="3"/><path d="M215 110 L223 110 L223 118" fill="none" stroke="var(--ok)" stroke-width="2"/><text x="150" y="210" text-anchor="middle" font-size="13" fill="var(--muted)">٤) ارسم عموديًّا على نصف القطر عند نقطة المماس = زاوية قائمة</text>'
      ]
    }),
    pythagoras: F({
      title: 'نظرية فيثاغورس: المربّع على كل ضلع',
      teaches: 'يُعلّم النظرية كحقيقة بصرية لا قانونًا محفوظًا: مساحة مربّع الضلع القائم تساوي مجموع مربّعي الضلعين الآخرين، ومنها تُشتقّ المسافة بين نقطتين في المستوى.',
      svg: '<svg viewBox="0 0 300 230" role="img" aria-label="مثلث قائم والمربعات المبنية على أضلاعه">' + DEFS +
        '<polygon points="110,150 210,150 110,60" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/>' +
        '<rect x="110" y="150" width="100" height="0" fill="none"/>' +
        '<rect x="110" y="150" width="100" height="55" fill="rgba(16,163,127,.16)" stroke="var(--ok)" stroke-width="2.5"/>' +
        '<rect x="30" y="60" width="80" height="90" fill="rgba(59,130,196,.16)" stroke="#3B82C4" stroke-width="2.5"/>' +
        '<polygon points="110,60 210,150 145,20 110,20" fill="rgba(212,138,42,.18)" stroke="#D48A2A" stroke-width="2.5" transform="rotate(-90 110 60)"/>' +
        '<path d="M110 138 L122 138 L122 150" fill="none" stroke="var(--ink)" stroke-width="2"/>' +
        '<text x="160" y="182" text-anchor="middle" font-size="15" fill="var(--ok)" font-weight="700">b²</text>' +
        '<text x="70" y="112" text-anchor="middle" font-size="15" fill="#3B82C4" font-weight="700">a²</text>' +
        '<text x="212" y="98" font-size="15" fill="#D48A2A" font-weight="700">c²</text>' +
        '<text x="160" y="145" text-anchor="middle" font-size="13" fill="var(--muted)">90°</text></svg>',
      parts: [
        { x: 145, y: 120, label: 'المثلث القائم', note: 'الزاوية القائمة عند رأس المثلث. الضلعان القائمان a وb، والوتر c هو أطول ضلع ويقابل الزاوية القائمة.' },
        { x: 160, y: 178, label: 'مربّع الضلع b', note: 'مساحته b² — مربّع مبني على أحد الضلعين القائمين.' },
        { x: 70, y: 112, label: 'مربّع الضلع a', note: 'مساحته a² — المربّع الثاني على الضلع القائم الآخر.' },
        { x: 205, y: 100, label: 'مربّع الوتر c', note: 'مساحته c²، وتساوي مجموع مربّعي a وb: c² = a² + b². هذه هي نظرية فيثاغورس.' }
      ],
      steps: [
        '<polygon points="110,150 210,150 110,60" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/><text x="150" y="222" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم مثلثًا قائمًا (واحد قائم)</text>',
        '<rect x="110" y="150" width="100" height="55" fill="rgba(16,163,127,.16)" stroke="var(--ok)" stroke-width="2.5"/><text x="150" y="222" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ارسم مربّعًا على الضلع السفلي = b²</text>',
        '<rect x="30" y="60" width="80" height="90" fill="rgba(59,130,196,.16)" stroke="#3B82C4" stroke-width="2.5"/><text x="150" y="222" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ارسم مربّعًا على الضلع القائم = a²</text>',
        '<polygon points="110,60 210,150 145,20 110,20" fill="rgba(212,138,42,.18)" stroke="#D48A2A" stroke-width="2.5" transform="rotate(-90 110 60)"/><text x="150" y="222" text-anchor="middle" font-size="13" fill="var(--muted)">٤) ارسم المربّع الأكبر على الوتر = c²</text>'
      ]
    }),
    functionGraph: F({
      title: 'منحنى الدالة: القراءة على المحورين',
      teaches: 'يُعلّم قراءة المنحنى: قيمة س على المحور الأفقي وقيمة ص على الرأسي، ومنطقة تناقص الدالة ومنطقتها الثابتة، وأين تعبر المحورين — وهي مهارة الاشتقاق والتكامل البصري.',
      svg: '<svg viewBox="0 0 300 210" role="img" aria-label="منحنى دالة على محورين">' + DEFS +
        '<line x1="30" y1="170" x2="285" y2="170" stroke="var(--ink)" stroke-width="2" marker-end="url(#figArrow)"/>' +
        '<line x1="45" y1="195" x2="45" y2="18" stroke="var(--ink)" stroke-width="2" marker-end="url(#figArrow)"/>' +
        '<path d="M55 165 C95 165 100 40 145 45 C190 50 200 150 270 160" fill="none" stroke="var(--acc)" stroke-width="3.5"/>' +
        '<circle cx="145" cy="45" r="5" fill="var(--bad)"/><circle cx="55" cy="165" r="4" fill="var(--ok)"/>' +
        '<line x1="145" y1="45" x2="145" y2="170" stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 4"/>' +
        '<line x1="45" y1="45" x2="145" y2="45" stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 4"/>' +
        '<text x="272" y="163" font-size="14" fill="var(--ink)">س</text><text x="30" y="28" font-size="14" fill="var(--ink)">ص</text>' +
        '<text x="145" y="188" text-anchor="middle" font-size="12" fill="var(--gold)">س₀</text><text x="36" y="50" text-anchor="end" font-size="12" fill="var(--gold)">ص₀</text>' +
        '<text x="105" y="110" font-size="12" fill="var(--muted)">تناقص</text><text x="205" y="110" font-size="12" fill="var(--muted)">زيادة</text></svg>',
      parts: [
        { x: 160, y: 170, label: 'محور س (الأفقي)', note: 'قيمة المتغيّر المستقلّ. كل نقطة على المنحنى تقرأ أولًا من هنا.' },
        { x: 45, y: 95, label: 'محور ص (الرأسي)', note: 'قيمة الدالة. قراءة النقطة = نزل عموديًّا إلى س ثم أفقيًّا إلى ص.' },
        { x: 145, y: 45, label: 'نقطة على المنحنى', note: 'هنا (س₀، ص₀) — أعلى نقطة في الجزء المتناقص، وتُقرأ بالخطين المنقطين الذهبيين.' },
        { x: 105, y: 110, label: 'منطقة التناقص', note: 'المنحنى ينزل من اليسار لليمين: مشتقّته سالبة، أي أن ص تقلّ كلما زادت س.' },
        { x: 205, y: 110, label: 'منطقة الزيادة', note: 'المنحنى يرتفع: مشتقّته موجبة. نقطة تغيّر الاتجاه بينهما هي الدورّة (الموضع الأدنى/الأعلى).' }
      ],
      steps: [
        '<line x1="30" y1="170" x2="285" y2="170" stroke="var(--ink)" stroke-width="2" marker-end="url(#figArrow)"/><line x1="45" y1="195" x2="45" y2="18" stroke="var(--ink)" stroke-width="2" marker-end="url(#figArrow)"/><text x="150" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم محورين متعامدين = س أفقيًا وص رأسيًّا</text>',
        '<path d="M55 165 C95 165 100 40 145 45 C190 50 200 150 270 160" fill="none" stroke="var(--acc)" stroke-width="3.5"/><text x="150" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ارسم المنحنى: ينزل ثم يرتفع (دورّة واحدة)</text>',
        '<circle cx="145" cy="45" r="5" fill="var(--bad)"/><line x1="145" y1="45" x2="145" y2="170" stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 4"/><line x1="45" y1="45" x2="145" y2="45" stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 4"/><text x="150" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ضع نقطة الدورّة وارسم خطين إلى المحورين = قراءة (س₀، ص₀)</text>'
      ]
    }),

    /* ── اللغة العربية: البلاغة والنحو ── */
    qalbMajaz: F({
      title: 'المجاز المرسل: من المعنى الحقيقي إلى المقصود',
      teaches: 'يُعلّم المجاز المرسل تطبيقيًّا: الكلمة تُستعمل في غير معناها الأصلي لعلاقة لفظية (السببية مثلًا)، فالقصة تُطلق على المظروف — وهذا أصل أسئلة «استخرج مجازًا مرسلًا وعلّل».',
      svg: '<svg viewBox="0 0 320 190" role="img" aria-label="خطوات تكوين المجاز المرسل">' + DEFS +
        '<rect x="18" y="60" width="92" height="56" rx="12" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="64" y="86" text-anchor="middle" font-size="14" fill="var(--gold)" font-weight="700">القصة</text>' +
        '<text x="64" y="104" text-anchor="middle" font-size="11" fill="var(--muted)">المظروف</text>' +
        arrow(116, 88, 150, 88, 'var(--muted)') +
        '<rect x="154" y="60" width="92" height="56" rx="12" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="200" y="86" text-anchor="middle" font-size="14" fill="var(--acc)" font-weight="700">المظروف</text>' +
        '<text x="200" y="104" text-anchor="middle" font-size="11" fill="var(--muted)">محلّ النصب</text>' +
        arrow(150, 140, 210, 140, 'var(--bad)') +
        '<text x="180" y="160" text-anchor="middle" font-size="12" fill="var(--bad)">علاقة السببية</text>' +
        '<rect x="60" y="132" width="180" height="40" rx="10" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/>' +
        '<text x="150" y="157" text-anchor="middle" font-size="13" fill="var(--ink)">«شربتُ القصيدةَ» = شربتُ ما فيها</text></svg>',
      parts: [
        { x: 64, y: 88, label: 'اللفظ الحقيقي', note: '«القصة» في معناها الأصلي: إناء يُسكب فيه الشيء. هذا هو المعنى اللغوي المرجعي.' },
        { x: 200, y: 88, label: 'محلّ النصب (المجاز)', note: 'صار يُقصد به المضمون: ما كُتب في القصة. اللفظ باقٍ والمعنى هو الذي تبدّل — وهذا هو المجاز.' },
        { x: 180, y: 140, label: 'علاقة السببية', note: 'لماذا صحّ؟ لأن المظروف سبب لوصول المظروف. هذه علاقته المجازية: علاقة ضرورية تلازم شيئين، لا علاقة مشابهة (فالمجاز المرسل لا تشبيه فيه).' },
        { x: 150, y: 157, label: 'الصورة النهائية', note: '«شربتُ القصيدة» — تحقّق معنى «شربتُ ما في القصة» بحذف الظرف وإطلاق اللفظ على سببه. هذا ما يُطلب في «استخرج مجازًا وعلّل».', x2: 150 }
      ],
      steps: [
        '<rect x="18" y="60" width="92" height="56" rx="12" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="150" y="185" text-anchor="middle" font-size="13" fill="var(--muted)">١) ضع اللفظ في معناه الحقيقي (القصة = المظروف)</text>',
        '<rect x="154" y="60" width="92" height="56" rx="12" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="150" y="185" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ضع ما يُقصد به (المضمون داخلها)</text>',
        arrow(116, 88, 150, 88, 'var(--muted)') + '<text x="150" y="185" text-anchor="middle" font-size="13" fill="var(--muted)">٣) اربطهما بعلاقة: هنا السببية (المظروف سبب للمظروف)</text>',
        '<rect x="60" y="132" width="180" height="40" rx="10" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/><text x="150" y="157" text-anchor="middle" font-size="13" fill="var(--ink)">«شربتُ القصيدةَ»</text><text x="150" y="185" text-anchor="middle" font-size="13" fill="var(--muted)">٤) اكتب العبارة المجازية الناتجة</text>'
      ]
    }),
    istifhamTypes: F({
      title: 'أنواع الاستفهام: التصديقي والتصوّري',
      teaches: 'يُفرّق بين الاستفهامين بخطّين بسيطين: التصديقي جوابه نعم/لا (يهل، هل)، والتصوّري جوابه تصوّرًا (ما، مَن، متى)، ويُبيّن أثر (أم) في تحويل الثاني إلى الأول.',
      svg: '<svg viewBox="0 0 330 210" role="img" aria-label="مقارنة الاستفهام التصديقي بالتصوّري">' + DEFS +
        '<rect x="14" y="20" width="145" height="70" rx="12" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/>' +
        '<text x="86" y="46" text-anchor="middle" font-size="14" fill="var(--acc)" font-weight="700">تصديقي</text>' +
        '<text x="86" y="68" text-anchor="middle" font-size="12" fill="var(--muted)">يهل · الهمزة</text>' +
        '<rect x="172" y="20" width="145" height="70" rx="12" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/>' +
        '<text x="244" y="46" text-anchor="middle" font-size="14" fill="var(--gold)" font-weight="700">تصوّري</text>' +
        '<text x="244" y="68" text-anchor="middle" font-size="12" fill="var(--muted)">ما · مَن · متى · أين</text>' +
        arrow(86, 96, 86, 128, 'var(--acc)') + arrow(244, 96, 244, 128, 'var(--gold)') +
        '<rect x="14" y="132" width="145" height="52" rx="12" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/>' +
        '<text x="86" y="155" text-anchor="middle" font-size="12" fill="var(--ink)">جوابه: نعم / لا</text>' +
        '<text x="86" y="174" text-anchor="middle" font-size="11" fill="var(--muted)">تصديق القضية</text>' +
        '<rect x="172" y="132" width="145" height="52" rx="12" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/>' +
        '<text x="244" y="155" text-anchor="middle" font-size="12" fill="var(--ink)">جوابه: تصوّر المطلوب</text>' +
        '<text x="244" y="174" text-anchor="middle" font-size="11" fill="var(--muted)">«من أتى؟» — الاسم</text>' +
        '<text x="165" y="107" text-anchor="middle" font-size="12" fill="var(--bad)">أم المعادلة تنقل التصوّري → تصديقي</text></svg>',
      parts: [
        { x: 86, y: 46, label: 'الاستفهام التصديقي', note: 'يُسأل به عن تصديق القضية: أجاب المخاطب بالإثبات أو النفي. أدواته: الهمزة و«هل»، وكلاهما لا محلّ له من الإعراب.' },
        { x: 244, y: 46, label: 'الاستفهام التصوّري', note: 'يُسأل به عن تصوّر المطلوب: يريد اسمًا أو زمانًا أو مكانًا لا نعمًا. أدواته: ما، مَن، متى، أين، كيف، أيّان… (و«أيّ» وحدها معربة).' },
        { x: 165, y: 107, label: 'أثر (أم) المعادلة', note: 'لو قلت: «هل أقام محمد أم عليّ؟» فقد نقلتَ الاستفهام من التصديقي إلى التصوّري؛ لأنك تريد اسمًا لا إثباتًا. وهذا سبب ورود الهمزة مع «أم» في الاستفهام التصوّري.' },
        { x: 86, y: 155, label: 'الجواب', note: '«هل قمتَ؟» ← نعم/لا. «متى قمتَ؟» ← الصبح مثلاً. فارق الجواب هو الفارق بين النوعين، ومنه تُعرف الإجابة الصحيحة في الاختبار.' }
      ],
      steps: [
        '<rect x="14" y="20" width="145" height="70" rx="12" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="165" y="200" text-anchor="middle" font-size="13" fill="var(--muted)">١) ضمّن صندوقًا للاستفهام التصديقي (يهل)</text>',
        '<rect x="172" y="20" width="145" height="70" rx="12" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="165" y="200" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ضمّن صندوقًا للتصوّري (ما، مَن، متى)</text>',
        arrow(86, 96, 86, 128, 'var(--acc)') + arrow(244, 96, 244, 128, 'var(--gold)') + '<text x="165" y="200" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ارسم سهمين نازلين إلى صندوقي الجواب</text>',
        '<text x="165" y="107" text-anchor="middle" font-size="12" fill="var(--bad)">أم المعادلة تنقل التصوّري ← تصديقي</text><text x="165" y="200" text-anchor="middle" font-size="13" fill="var(--muted)">٤) اكتب على الوسط أثر (أم) المعادلة</text>'
      ]
    }),

    /* ── التربية الإسلامية ── */
    hajjStations: F({
      title: 'مناسك الحج: المشعر ← منى ← عرفة ← الجمرات',
      teaches: 'يُرتّب المناسك مكانًا وزمانًا بدل حفظها متناثرة: المشعر ثم منى ليالي التروية، ثم عرفة يوم التاسع، ثم المزدلفة ليلة العاشر، ثم الجمرات والنحر — ومن الترتيب تُفهم فضائلها وأحكامها.',
      svg: '<svg viewBox="0 0 340 210" role="img" aria-label="خريطة مناسك الحج مبسطة">' + DEFS +
        '<path d="M20 160 C70 150 90 120 140 118 C200 116 240 90 320 80" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="8 5"/>' +
        '<circle cx="35" cy="158" r="16" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/><text x="35" y="163" text-anchor="middle" font-size="12" fill="var(--acc)" font-weight="700">١</text>' +
        '<circle cx="130" cy="120" r="16" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/><text x="130" y="125" text-anchor="middle" font-size="12" fill="var(--gold)" font-weight="700">٢</text>' +
        '<circle cx="215" cy="100" r="19" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="3"/><text x="215" y="105" text-anchor="middle" font-size="13" fill="var(--bad)" font-weight="700">٣</text>' +
        '<circle cx="280" cy="86" r="14" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><text x="280" y="91" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="700">٤</text>' +
        '<circle cx="318" cy="78" r="13" fill="var(--ok)" opacity=".22" stroke="var(--ok)" stroke-width="2.5"/><text x="318" y="83" text-anchor="middle" font-size="11" fill="var(--ok)" font-weight="700">٥</text>' +
        '<text x="35" y="192" text-anchor="middle" font-size="11" fill="var(--muted)">المشعر</text><text x="130" y="150" text-anchor="middle" font-size="11" fill="var(--muted)">منى</text>' +
        '<text x="215" y="140" text-anchor="middle" font-size="11" fill="var(--bad)">عرفة</text><text x="280" y="115" text-anchor="middle" font-size="11" fill="var(--muted)">المزدلفة</text>' +
        '<text x="310" y="55" text-anchor="middle" font-size="11" fill="var(--ok)">الجمرات والنحر</text></svg>',
      parts: [
        { x: 35, y: 158, label: 'المشعر الحرام (المبيت)', note: 'المكان الذي يُحلّ فيه الحج من الإحرام — «فمن أراد بالحج ثمامة»، ومنه يبدأ التوجّه إلى منى.' },
        { x: 130, y: 120, label: 'منى (ليلة التروية)', note: 'يلبي بها الحجاج يوم الثامن من ذي الحجة، ويبيتون فيها ليلتين. بها الجمرات الثلاث.' },
        { x: 215, y: 100, label: 'عرفة (يوم التاسع)', note: '«حجُّ من وقف بعرفة» — الوقوف بها ركن الحج الأعظم، ولا يصحّ الحج بدونه. تُغادر قبل الغروب.' },
        { x: 280, y: 86, label: 'المزدلفة (ليلة العاشر)', note: 'المبيت بها ليلة العاشر وجمع الحصى من هناك، ثم الانطلاق فجرًا إلى منى.' },
        { x: 318, y: 78, label: 'الجمرات ثم النحر ثم الحلق', note: 'رمي الجمرات الثلاث، ثم ذبح الهدي، ثم الحلق أو التقصير — وبذلك يتحلّل الحج المفرد تحلّلًا ناقصًا ويكتمل التحلل الأكبر.' }
      ],
      steps: [
        '<path d="M20 160 C70 150 90 120 140 118 C200 116 240 90 320 80" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="8 5"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم مسارًا متعرّجًا من اليمين (المشعر) إلى اليسار</text>',
        '<circle cx="35" cy="158" r="16" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="3"/><circle cx="130" cy="120" r="16" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="3"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٢) ضع أول محطتين: المشعر ثم منى</text>',
        '<circle cx="215" cy="100" r="19" fill="rgba(214,69,69,.14)" stroke="var(--bad)" stroke-width="3"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٣) ضع دائرة أكبر بلون قوي = عرفة (الركن الأعظم)</text>',
        '<circle cx="280" cy="86" r="14" fill="var(--soft)" stroke="var(--muted)" stroke-width="2.5"/><circle cx="318" cy="78" r="13" fill="var(--ok)" opacity=".22" stroke="var(--ok)" stroke-width="2.5"/><text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٤) أضف المزدلفة ثم الجمرات والنحر</text>',
        '<text x="170" y="205" text-anchor="middle" font-size="13" fill="var(--muted)">٥) اكتب اسم كل محطة تحتها بترتيب الأيام</text>'
      ]
    }),
    salahOrder: F({
      title: 'أركان الصلاة بالترتيب',
      teaches: 'يُرتّب أركان الصلاة بصريًّا حتى لا يُخلّ بها: القيام ثم قراءة الفاتحة ثم الركوع ثم السجود ثم التشهد ثم الصلاة على النبي ثم السلام — ومن الترتيب تُفهم مسألة «ما يجبر المنسي».',
      svg: '<svg viewBox="0 0 340 210" role="img" aria-label="أركان الصلاة بالترتيب">' + DEFS +
        ['القيام', 'الفاتحة', 'الركوع', 'السجود', 'التشهد', 'السلام'].map((t, i) => {
          const x = 18 + (i % 6) * 54, y = 46;
          return '<rect x="' + x + '" y="' + y + '" width="48" height="62" rx="10" fill="' + (i % 2 ? 'var(--acc-soft)' : 'var(--gold-soft)') + '" stroke="' + (i % 2 ? 'var(--acc)' : 'var(--gold)') + '" stroke-width="2.5"/>' +
            '<text x="' + (x + 24) + '" y="' + (y + 26) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">' + (i + 1) + '</text>' +
            '<text x="' + (x + 24) + '" y="' + (y + 46) + '" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + t + '</text>';
        }).join('') +
        [0, 1, 2, 3, 4].map(i => arrow(70 + i * 54, 77, 74 + i * 54, 77, 'var(--muted)')).join('') +
        '<rect x="18" y="126" width="304" height="56" rx="12" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/>' +
        '<text x="170" y="148" text-anchor="middle" font-size="12" fill="var(--ink)">ركن تركه عمدًا: تبطل صلاته وعليه الإعادة</text>' +
        '<text x="170" y="168" text-anchor="middle" font-size="12" fill="var(--muted)">ركن سهو عنه: يُجبره سجود السهو ولا تبطل</text></svg>',
      parts: [
        { x: 42, y: 70, label: 'القيام', note: 'أول الأركان: الجلوس في الصلاة لا يقوم مقامه إلا لعذر. من قام من ركوعه فقد بدأ ركناً جديدًا.' },
        { x: 96, y: 70, label: 'قراءة الفاتحة', note: 'ركن في كل ركعة، ولا صلاة لمن لم يقرأ بها. تُقرأ في الأولى والثانية.' },
        { x: 150, y: 70, label: 'الركوع', note: 'إنصات الظهر والسجود — وفيه «سبحان ربي العظيم».' },
        { x: 204, y: 70, label: 'السجود', note: 'أقرب ما يكون العبد من ربّه وهو ساجد. سجدتان في كل ركعة، وأركانهما سبعة.' },
        { x: 258, y: 70, label: 'التشهد', note: 'التشهد الأخير ركن يقوم مقامه الجلوس إن سُها فيه، بخلاف الأول.' },
        { x: 312, y: 70, label: 'الصلاة على النبي ثم السلام', note: 'الصلاة على النبي في الأخيرتين ركن، و«السلام» ختم الصلاة — من سلم من تشهدٍ لم يجتزئ بما قبله.' },
        { x: 170, y: 150, label: 'الفرق بين الركن والواجب', note: 'هذا هو الفارق الذي تُبنى عليه أسئلة «ما تجب فيه الإعادة»: الركن يبطل بتركه عمدًا، والواجب يُجبر بسجود السهو.' }
      ],
      steps: [
        ['القيام', 'الفاتحة', 'الركوع'].map((t, i) => '<rect x="' + (18 + i * 54) + '" y="46" width="48" height="62" rx="10" fill="var(--acc-soft)" stroke="var(--acc)" stroke-width="2.5"/><text x="' + (42 + i * 54) + '" y="82" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + t + '</text><text x="170" y="150" text-anchor="middle" font-size="13" fill="var(--muted)">١) ارسم أول ثلاث مربعات: القيام ثم الفاتحة ثم الركوع</text>').join(''),
        ['السجود', 'التشهد', 'السلام'].map((t, i) => '<rect x="' + (180 + i * 54) + '" y="46" width="48" height="62" rx="10" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2.5"/><text x="' + (204 + i * 54) + '" y="82" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + t + '</text><text x="170" y="150" text-anchor="middle" font-size="13" fill="var(--muted)">٢) أضف السجود ثم التشهد ثم السلام</text>').join(''),
        [0, 1, 2, 3, 4].map(i => arrow(70 + i * 54, 77, 74 + i * 54, 77, 'var(--muted)')).join('') + '<text x="170" y="150" text-anchor="middle" font-size="13" fill="var(--muted)">٣) اربط المربعات بأسهم الترتيب</text>',
        '<rect x="18" y="126" width="304" height="56" rx="12" fill="var(--soft)" stroke="var(--line)" stroke-width="2"/><text x="170" y="148" text-anchor="middle" font-size="12" fill="var(--ink)">ركن تركه عمدًا: تبطل الصلاة</text><text x="170" y="184" text-anchor="middle" font-size="13" fill="var(--muted)">٤) اكتب أسفلًا الفرق بين الركن والواجب</text>'
      ]
    }),

    /* ── الإنكليزية ── */
    tenseTimeline: F({
      title: 'Timeline of tenses: when does each happen?',
      teaches: 'يُعلّم الأزمنة بالخطّ الزمني لا بالتعريب: الماضي على اليسار، والحاضر في النقطة، والمستقبل على اليمين، وكل زمن يُقرأ بمكانه وشكل فعله.',
      svg: '<svg viewBox="0 0 340 180" role="img" aria-label="خط زمني للأزمنة">' + DEFS +
        '<line x1="20" y1="110" x2="320" y2="110" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#figArrow)"/>' +
        '<circle cx="80" cy="110" r="9" fill="#3B82C4"/><circle cx="170" cy="110" r="9" fill="var(--ok)"/><circle cx="265" cy="110" r="9" fill="#D48A2A"/>' +
        '<text x="80" y="86" text-anchor="middle" font-size="13" fill="#3B82C4" font-weight="700">PAST</text>' +
        '<text x="170" y="86" text-anchor="middle" font-size="13" fill="var(--ok)" font-weight="700">PRESENT</text>' +
        '<text x="265" y="86" text-anchor="middle" font-size="13" fill="#D48A2A" font-weight="700">FUTURE</text>' +
        '<text x="80" y="136" text-anchor="middle" font-size="10.5" fill="var(--muted)">I played</text>' +
        '<text x="80" y="152" text-anchor="middle" font-size="10.5" fill="var(--muted)">I was playing</text>' +
        '<text x="80" y="168" text-anchor="middle" font-size="10.5" fill="var(--muted)">I had played</text>' +
        '<text x="170" y="136" text-anchor="middle" font-size="10.5" fill="var(--muted)">I play</text>' +
        '<text x="170" y="152" text-anchor="middle" font-size="10.5" fill="var(--muted)">I am playing</text>' +
        '<text x="170" y="168" text-anchor="middle" font-size="10.5" fill="var(--muted)">I have played</text>' +
        '<text x="265" y="136" text-anchor="middle" font-size="10.5" fill="var(--muted)">I will play</text>' +
        '<text x="265" y="152" text-anchor="middle" font-size="10.5" fill="var(--muted)">I will be playing</text></svg>',
      parts: [
        { x: 80, y: 110, label: 'The past', note: 'Anything finished and gone: I played / I was playing / I had played. The action is not here now.' },
        { x: 170, y: 110, label: 'The present', note: 'Happening now or as a habit: I play (habit) / I am playing (now) / I have played (until now).' },
        { x: 265, y: 110, label: 'The future', note: 'Not started yet: I will play / I will be playing / I will have played.' },
        { x: 320, y: 110, label: 'The arrow of time', note: 'Time moves left to right — the same way English writes. Put a sentence on this line and its tense becomes obvious.' }
      ],
      steps: [
        '<line x1="20" y1="110" x2="320" y2="110" stroke="var(--ink)" stroke-width="2.5" marker-end="url(#figArrow)"/><text x="170" y="176" text-anchor="middle" font-size="13" fill="var(--muted)">1) Draw one arrow = the line of time</text>',
        '<circle cx="80" cy="110" r="9" fill="#3B82C4"/><circle cx="170" cy="110" r="9" fill="var(--ok)"/><circle cx="265" cy="110" r="9" fill="#D48A2A"/><text x="170" y="176" text-anchor="middle" font-size="13" fill="var(--muted)">2) Mark three points: past, present, future</text>',
        '<text x="170" y="176" text-anchor="middle" font-size="13" fill="var(--muted)">3) Write under each point its tense forms</text>'
      ]
    }),

  };

  /* نُصدّر أيضًا المُعرِّفات ومساعد السهم، لأن «خطوات الرسم» أجزاء داخل نفس
     الـsvg فتحتاج تعريفات العلامات نفسها (وإلا اختفى رأس السهم). */
  /* مادة كل رسم — لتُعرض الرسوم في مكتبة التطبيق مجمّعة بحسب مادتها */
  window.FIG_SUBJ = {
    spark: 'الفيزياء', twoConductors: 'الفيزياء', plates: 'الفيزياء', waxRoll: 'الفيزياء',
    plantCell: 'الأحياء', photosynthesis: 'الأحياء', animalCell: 'الأحياء',
    atomBohr: 'الكيمياء', labFunnel: 'الكيمياء',
    circleParts: 'الرياضيات', pythagoras: 'الرياضيات', functionGraph: 'الرياضيات',
    qalbMajaz: 'اللغة العربية', istifhamTypes: 'اللغة العربية',
    tenseTimeline: 'اللغة الإنكليزية',
    salahOrder: 'التربية الإسلامية', hajjStations: 'التربية الإسلامية'
  };
  window.FIGS = FIGS;
  window.FIG_DEFS = DEFS;
})();
