/* الفيزياء — السادس العلمي — الفصل السابع: إلكترونيات الحالة الصلبة (الكتاب ص199–226)
   المواضيع 7-1 إلى 7-10 */
window.CONTENT_PARTS = window.CONTENT_PARTS || [];
(function () {
  const { Q, TF, X, B, T, L, D, R, F, E, P, K, N, EQ, HD, LI, TH, TB } = window.H;
  const topics = [
    T({
      id: 'p12c7t1', sec: '7-1', page: '199', title: 'مقدمة',
      why: 'مدخل لفيزياء الحالة الصلبة وأهميتها في التكنولوجيا الحديثة',
      explain: [
        P('فيزياء الحالة الصلبة هي فرع من الفيزياء يدرس خصائص المواد الصلبة وترتيبها الذري، وتحاول تفسير الخواص الكهربائية والحرارية للمادة الصلبة بالرجوع إلى ترتيب ذراتها وبنية حزم الطاقة فيها.'),
        HD('لماذا ندرس فيزياء الحالة الصلبة؟'),
        P('تختلف المواد الصلبة في قدرتها على نقل التيار الكهربائي تباينًا واسعًا؛ فبعضها يوصل التيار بسهولة مثل النحاس والذهب، وبعضها يعطله تمامًا مثل الزجاج والسيراميك، وبينهما مادة تكون توصيلتها متوسطة وتزداد بارتفاع درجة حرارتها مثل السيليكون والجرمانيوم.'),
        P('وعلى وفق هذا التمييز تُصنَّف المواد إلى موصلات وشبه موصلات وعوازل، وهو التصنيف الذي تقوم عليه أجهزة الترانزستور والثنائيات والمحولات الكهربائية والخلايا الشمسية، ومن هنا تبرز أهمية دراسة الحالة الصلبة في التكنولوجيا الحديثة.'),
        P('والخطوة الأولى في هذه الدراسة هي معرفة ترتيب الذرات في المادة الصلبة وأشكاله (البلورية والزجاجية)، ثم النظر في بنية حزم الطاقة الناتجة عن تداخل ذرات البلورة، لنفهم لماذا تتصل حزمة التكافؤ بحزمة التوصيل في المعدن وتنفصلان في العازل، فيتوفّر بينهما فرق صغير في شبه الموصل.'),
        P('ولهذا يبدأ هذا الفصل بدراسة البنية البلورية والشبكة البلورية وطرق الربط بين الذرات، ثم ينتقل إلى حزم الطاقة وأشباه الموصلات والثنائي pn والترانزستور.'),
        K('خلاصة: خواص المادة الصلبة الكهربائية تُفسَّر بترتيب ذراتها وبنية حزم طاقتها، ومن هذا الأساس تُصنَّف المواد إلى موصلات وشبه موصلات وعوازل.')
      ],
      defs: [
        D('فيزياء الحالة الصلبة', 'فرع من الفيزياء يدرس خصائص المواد الصلبة وترتيبها الذري، ويحاول تفسير خواصها الكهربائية والحرارية بهذا الترتيب.')
      ],
      laws: [
        L('R = ρ L / A', 'قانون المقاومة الكهربائية', 'المقاومة تتناسب طرديًا مع طول الموصل ومع المقاومية النوعية، وعكسية مع مساحة مقطعه', [['R', 'المقاومة الكهربائية', 'Ω (أوم)'], ['ρ', 'المقاومية النوعية', 'Ω·m'], ['L', 'طول الموصل', 'm'], ['A', 'مساحة المقطع', 'm²']], 'لتصنيف المواد بحسب قدرتها على نقل التيار الكهربائي.', 'كلما زادت ρ زادت R وقلّت توصيلية المادة، ولذلك تُصنَّف المواد إلى موصلات وشبه موصلات وعوازل.'),
        L('σ = 1 / ρ', 'التوصيلية الكهربائية', 'التوصيلية تساوي المقلوب الطردي للمقاومية النوعية', [['σ', 'التوصيلية الكهربائية', 'S/m'], ['ρ', 'المقاومية النوعية', 'Ω·m']], 'للمقارنة بين قدرة المواد على نقل التيار.', 'التوصيلية الكبيرة دليل على مادة موصلة جيدة، والصغيرة دليل على مادة عازلة.')
      ],
      reasons: [
        R('علل: تُصنَّف المواد الصلبة بحسب توصيلتها الكهربائية إلى موصلات وشبه موصلات وعوازل.', 'لمقدار المقاومية ρ المختلف من مادة إلى أخرى؛ ففي المعدن تكون ρ صغيرة وتوصيلته عالية، وفي العازل تكون ρ كبيرة وتوصيلته شبه معدومة، وفي شبه الموصل تكون بينهما وتزداد توصيلته بارتفاع الحرارة.'),
        R('علل: يوصل المعدن التيار الكهربائي بسهولة ولا يوصله العازل.', 'لأن حزمة التوصيل تتصل بحزمة التكافؤ في المعدن فتتوفر إلكترونات حرة عابرة بين الذرات، بينما تنفصل الحزمتان بفجوة كبيرة في العازل فلا تستطيع الإلكترونات عبورها.'),
        R('علل: تزداد توصيلية شبه الموصل بارتفاع درجة حرارته.', 'لأن الطاقة الحرارية تكتسب إلكترونات التكافؤ بما يكفي لكسر أواصر التساهمية فتنشأ أزواج (إلكترون – فجوة) تزيد عدد حاملات الشحنة الحرة.')
      ],
      blanks: [],
      examples: [
        E('Introduction to Solid-State Physics', '199', 'Introduce the branch of physics that studies properties of solid materials and their atomic arrangement.', ['Physics of solids studies properties of materials', 'Examines atomic arrangement in solids', 'Important in modern technology'], 'Solid-state physics is the branch of physics that deals with properties of solid materials and their atomic arrangement, crucial for modern technology.')
      ],
      problems: [
        B('p12c7t1-p1', 'Page 199', '7-1', 'Explain why solid-state physics is important in modern technology, giving two examples.', 'Solid-state physics is crucial for modern technology as it enables the understanding and development of semiconductors, transistors, and other electronic devices that form the basis of computers and communication systems.', ['Enables development of semiconductors', 'Foundation for transistors and integrated circuits', 'Essential for computers and communication systems']),
        B('p12c7t1-p2', 'Page 199', '7-1', 'What is the scope of solid-state physics?', 'Solid-state physics studies the properties of solid materials and their atomic arrangement, including electrical, thermal, mechanical, and optical properties.', ['Electrical properties', 'Thermal properties', 'Mechanical properties', 'Optical properties'])
      ],
      quiz: [
        Q('فيزياء الحالة الصلبة تدرس:', ['خواص المواد الصلبة وترتيب ذراتها', 'ظواهر الانقسام النووي وتفاعل الجسيمات دون الذرية', 'قوانين جريان الموائع في الأنابيب والمضخات', 'حركة الأجرام السماوية في المجموعة الشمسية'], 'يهدف هذا الفرع إلى تفسير الخواص الكهربائية والحرارة للمادة الصلبة بالرجوع إلى ترتيب ذراتها وبنية حزم الطاقة فيها، ومنه نفهم لماذا تتصل حزمة التكافؤ بحزمة التوصيل في المعدن وتنفصلان في العازل.')
      ]
    }),
    T({
      id: 'p12c7t2', sec: '7-2', page: '201', title: 'البنية البلورية',
      why: 'فهم ترتيب الذرات في المواد الصلبة البلورية',
      explain: [
        P('البنية البلورية هي ترتيب منتظم للذرات في المادة الصلبة يتكرر في جميع الاتجاهات.')
      ],
      defs: [
        D('البنية البلورية', 'ترتيب منتظم للذرات في المادة الصلبة يتكرر في جميع الاتجاهات.')
      ],
      laws: [
        L('nλ = 2d sin θ', 'قانون براج', 'خاصية البلورات من حيث حيود الأشعة السينية', [['n', 'عدد entier', '—'], ['λ', 'طول الموجة', 'm'], ['d', 'مسافة المستويات', 'm'], ['θ', 'زاوية الحيود', '°']])
      ],
      reasons: [],
      blanks: [
        F('البنية البلورية هي ترتيب', 'منتظم للذرات')
      ],
      examples: [
        E('Crystal Structure', '201', 'Explain the regular arrangement of atoms in crystalline solids.', ['Atoms arranged regularly in all directions', 'Crystals have repeating structure', 'Defines crystal lattice'], 'Crystalline solids have atoms arranged in a regular, repeating pattern in all directions, forming a crystal lattice.')
      ],
      problems: [
        B('p12c7t2-p1', 'Page 201', '7-2', 'Calculate the distance between crystal planes given n=1, λ=1.54 Å, and θ=15° using Bragg\'s law.', 'd = nλ/(2 sin θ) = 1×1.54/(2 sin 15°) = 1×1.54/(2×0.259) = 2.97 Å', ['n=1', 'λ=1.54 Å', 'θ=15°', 'd = 2.97 Å']),
        B('p12c7t2-p2', 'Page 201', '7-2', 'What is the relationship between the number of crystal networks and symmetry?', 'The 14 Bravais lattices represent all possible symmetry arrangements of points in 3D space, classified by their symmetry properties.', ['14 Bravais lattices', 'Cubic', 'Tetragonal', 'Hexagonal', 'Each has different symmetry'])
      ],
      quiz: [
        Q('ما المقصود بالبنية البلورية؟', ['ترتيب منتظم للذرات', 'ترتيب عشوائي للذرات داخل المادة الصلبة', 'ترتيب خطي للذرات في اتجاه واحد فقط', 'تجمع ذرات في سلاسل منفصلة لا رابط بين ذراتها'], 'تترتب الذرات في البلورة على مواقع ثابتة يتكرر هذا الترتيب بدور منتظم في جميع الاتجاهات، فتتفاعل الذرات المتجاورة وتنقسم مستويات طاقتها المتقاربة إلى حزم، ولهذا تخضع البلورة لقانون براج في الحيود وتتميز بخواص متجانسة في جميع الاتجاهات.')
      ]
    }),
    T({
      id: 'p12c7t3', sec: '7-3', page: '203', title: 'الشبكة البلورية',
      why: 'فهم مفهوم الشبكة البلورية وأنواعها',
      explain: [
        P('الشبكة البلورية هي ترتيب هندسي للنقاط في الفضاء represents مواقع الذرات في البلورة.')
      ],
      defs: [
        D('الشبكة البلورية', 'ترتيب هندسي للنقاط في الفضاء represents مواقع الذرات في البلورة.')
      ],
      laws: [
        L('1/d² = (h² + k² + l²)/a²', 'معادلة المسافة بين المستويات', 'خاصية الشبكات البلورية المكعبة', [['h', 'k', 'l', 'أعداد صحيحه'], ['a', 'ثابت الشبكة', 'm']])
      ],
      reasons: [],
      blanks: [
        F('تُصنف الشبكات البلورية إلى', '14 نوعًا')
      ],
      examples: [
        E('Crystal Lattice', '203', 'Explain the geometric arrangement of points in space representing atomic positions in a crystal.', ['Crystal lattice is a geometric arrangement of points in space', 'Represents atomic positions in the crystal', 'Types of cubic networks'], 'A crystal lattice is a geometric arrangement of points in space that represents the positions of atoms in the crystal, classified into 14 types of cubic networks.')
      ],
      problems: [
        B('p12c7t3-p1', 'Page 203', '7-3', 'How many types of cubic crystal networks are there?', 'There are 3 types of cubic networks: simple cubic, body-centered cubic (BCC), and face-centered cubic (FCC).', ['Simple cubic', 'Body-centered cubic', 'Face-centered cubic']),
        B('p12c7t3-p2', 'Page 203', '7-3', 'Given a cubic lattice with a = 0.5 nm, calculate the distance between (100) planes.', '1/d² = (h² + k² + l²)/a² = (1+0+0)/0.5² = 1/0.25 = 4, so d = 0.5 nm', ['h=1, k=0, l=0', 'a=0.5 nm', '1/d² = 4', 'd = 0.5 nm'])
      ],
      quiz: [
        Q('كم عدد أنواع الشبكات البلورية؟', ['14', '7', '21', '28'], 'تُصنَّف الشبكات البلورية إلى ١٤ نوعًا بحسب زوايا البلورة وأطوال أضلاعها: سبع شبكات ثلاثية الأبعاد (منها المكعبة وال سداسية والمثلثية) وسبع شبكات ثنائية الأبعاد.')
      ]
    }),
    T({
      id: 'p12c7t4', sec: '7-4', page: '205', title: 'الرابطة الأيونية والتساهمية والمعدنية',
      why: 'فهم أنواع الروابط الكيميائية في المواد الصلبة',
      explain: [
        P('الرابطة الأيونية هي رابطة تنشأ بين ذرات مختلفة الكهروسالبية بانتقال الإلكترونات.')
      ],
      defs: [
        D('الرابطة الأيونية', 'رابطة تنشأ بين ذرات مختلفة الكهروسالبية بانتقال الإلكترونات.')
      ],
      laws: [
        L('E = kq₁q₂/r', 'طاقة الرابطة', ' الطاقة اللازمة لكسر رابطة كيميائية', [['E', 'طاقة الرابطة', 'J'], ['k', 'constant', 'N·m²/C²'], ['q₁', 'شحنة الذرة 1'], ['q₂', 'شحنة الذرة 2'], ['r', 'المسافة بين الذرات', 'm']])
      ],
      reasons: [],
      blanks: [],
      examples: [
        E('Ionic Bond Energy', '205', 'Calculate the energy of an ionic bond using Coulomb\'s law.', ['Energy depends on charges and distance', 'E = kq₁q₂/r', 'Units: joules'], 'The energy of an ionic bond is given by E = kq₁q₂/r, where it depends on the charges of the atoms and the distance between them.')
      ],
      problems: [
        B('p12c7t4-p1', 'Page 205', '7-4', 'Calculate the ionic bond energy given q₁ = 1.6×10⁻¹⁹ C, q₂ = -1.6×10⁻¹⁹ C, r = 0.5 nm, and k = 9×10⁹ N·m²/C².', 'E = kq₁q₂/r = (9×10⁹)(1.6×10⁻¹⁹)(-1.6×10⁻¹⁹)/(0.5×10⁻⁹) = -4.61×10⁻¹⁹ J', ['k=9×10⁹', 'q₁=1.6×10⁻¹⁹ C', 'q₂=-1.6×10⁻¹⁹ C', 'r=0.5 nm', 'E = -4.61×10⁻¹⁹ J']),
        B('p12c7t4-p2', 'Page 205', '7-4', 'What happens to bond energy when the distance between ions doubles?', 'Since E ∝ 1/r, if r doubles, E halves. The bond energy decreases inversely with distance.', ['E ∝ 1/r', 'If r → 2r, then E → E/2'])
      ],
      quiz: [
        Q('ما المقصود بالرابطة الأيونية؟', ['رابطة تنشأ بانتقال الإلكترونات من ذرة إلى ذرة', 'رابطة تنشأ بتشارك زوج من الإلكترونات بين ذرتين متكافئتين', 'رابطة تنشأ بوجود بحر من الإلكترونات الحرة حول أيونات موجبة', 'رابطة تنشأ بقوى التجاذب الضعيفة بين جزيئات غير مشحونة'], 'حين تفقد الذرة إلكترونات تكافؤها تصير أيونًا موجبًا، وحين تكتسبها ذرة أخرى تصير أيونًا سالبًا، فيتجاذبان كهربائيًا؛ ويظهر ذلك في أشباه الموصلات المطعّمة حين تتبرع الذرة المانحة مثل الأنتيمون إلكترونها أو تقبله الذرة القابلة مثل البورون.')
      ]
    }),
    T({
      id: 'p12c7t5', sec: '7-5', page: '207', title: 'طاقة الرابطة',
      why: 'فهم طاقة الرابطة وعلاقتها بخصائص المواد',
      explain: [
        P('طاقة الرابطة هي الطاقة اللازمة لكسر رابطة كيميائية بين ذرتين.')
      ],
      defs: [
        D('طاقة الرابطة', 'الطاقة اللازمة لكسر رابطة كيميائية بين ذرتين.')
      ],
      laws: [
        L('E = kq₁q₂/r', 'طاقة الرابطة', ' العلاقة بين طاقة الرابطة والشحنة والمسافة', [['E', 'طاقة الرابطة', 'J'], ['k', 'constant', 'N·m²/C²'], ['q₁', 'شحنة الذرة 1'], ['q₂', 'شحنة الذرة 2'], ['r', 'المسافة', 'm']])
      ],
      reasons: [],
      blanks: [
        F('طاقة الرابطة هي الطاقة اللازمة لـ', 'كسر رابطة كيميائية')
      ],
      examples: [
        E('Binding Energy Calculation', '207', 'Calculate the binding energy between two charged particles.', ['E = kq₁q₂/r', 'Depends on charge and distance', 'Units: joules'], 'Binding energy between two charges is calculated using Coulomb\'s law E = kq₁q₂/r, showing it depends on the magnitude of charges and inversely on the distance between them.')
      ],
      problems: [
        B('p12c7t5-p1', 'Page 207', '7-5', 'Calculate the binding energy between two protons separated by 1 fm (1×10⁻¹⁵ m) using Coulomb\'s law.', 'E = kqq/r = (9×10⁹)(1.6×10⁻¹⁹)²/(1×10⁻¹⁵) = 2.3×10⁻¹⁴ J', ['k=9×10⁹', 'q=1.6×10⁻¹⁹ C', 'r=1 fm=1×10⁻¹⁵ m', 'E = 2.3×10⁻¹⁴ J']),
        B('p12c7t5-p2', 'Page 207', '7-5', 'How does binding energy change if the distance between atoms triples?', 'Since E ∝ 1/r, if r triples, E becomes one-third. The binding energy decreases by factor of 3.', ['E ∝ 1/r', 'If r → 3r, then E → E/3'])
      ],
      quiz: [
        Q('ما المقصود بطاقة الرابطة؟', ['الطاقة اللازمة لكسر رابطة كيميائية بين ذرتين', 'الطاقة الحركية المتوسطة لذرات البلورة عند درجة حرارة الغرفة', 'طاقة دالة شغل سطح المعدن اللازمة لتحرير إلكترون منه', 'مقدار الفجوة الطاقية بين الحزمة التكافوية وحزمة التوصيل'], 'طاقة الرابطة هي الشغل الذي يلزم لكسر الرابطة بين ذرتين، وتتناسب طرديًا مع حاصل شحنتَي الأيونات وعكسيًا مع المسافة بينهما وفق E = kq₁q₂/r، لذلك تنقص بتباعد الذرات وتزداد بتقاربهن.')
      ]
    }),
    T({
      id: 'p12c7t6', sec: '7-6', page: '209', title: 'الحزمة التكافؤية والحزمة الناقلة',
      why: 'فهم بنية الطاقة في المواد الصلبة',
      explain: [
        P('الحزمة التكافؤية هي أعلى حزمة طاقة ممتلئة بالإلكترونات في المادة الصلبة.')
      ],
      defs: [
        D('الحزمة التكافؤية', 'أعلى حزمة طاقة ممتلئة بالإلكترونات في المادة الصلبة.')
      ],
      laws: [
        L('E_g = E_c - E_v', 'الفجوة الطاقية', ' الفرق بين الحزمة الناقلة والحزمة التكافؤية', [['E_g', 'الفجوة الطاقية', 'eV'], ['E_c', 'طاقة الحزمة الناقلة'], ['E_v', 'طاقة الحزمة التكافؤية']])
      ],
      reasons: [],
      blanks: [
        F('الحزمة التكافؤية هي', 'أعلى حزمة طاقة ممتلئة بالإلكترونات')
      ],
      examples: [
        E('Band Gap Calculation', '209', 'Calculate the band gap energy given conduction and valence band energies.', ['E_g = E_c - E_v', 'Typical values: 0.1-15 eV', 'Determines material properties'], 'The band gap energy is calculated as E_g = E_c - E_v, where E_c is the conduction band minimum and E_v is the valence band maximum. It determines whether a material is a conductor, semiconductor, or insulator.')
      ],
      problems: [
        B('p12c7t6-p1', 'Page 209', '7-6', 'Calculate the band gap energy given E_c = 1.1 eV and E_v = -0.5 eV.', 'E_g = E_c - E_v = 1.1 - (-0.5) = 1.6 eV', ['E_c = 1.1 eV', 'E_v = -0.5 eV', 'E_g = 1.6 eV']),
        B('p12c7t6-p2', 'Page 209', '7-6', 'If the band gap of a material is 3.5 eV, what type of material is it?', 'A material with E_g > 3 eV is typically an insulator, while 0 < E_g < 3 eV is a semiconductor. 3.5 eV indicates an insulator.', ['E_g = 3.5 eV', 'Material type: insulator'])
      ],
      quiz: [
        Q('ما المقصود بالحزمة التكافؤية؟', ['أعلى حزمة طاقة ممتلئة بالإلكترونات', 'الحزمة التي تنتقل منها الإلكترونات إلى حزمة التوصيل مباشرة دون طاقة', 'أدنى حزمة طاقة في الذرة المنفردة قبل تداخل الذرات معًا', 'الفاصل المحظور بين الحزمتين الذي لا يسمح بوجود مستويات طاقة فيه'], 'إلكترونات التكافؤ مرتبطة بالنواة ارتباطًا وثيقًا فلا تنتقل بين الذرات المتجاورة، فتشغل أعلى مستويات الطاقة المسموح بها في المادة وهي الحزمة التكافوية؛ فلا يعبر إلكترون منها إلى حزمة التوصيل إلا إذا كسب طاقة لا تقل عن مقدار ثغرة الطاقة المحظورة.')
      ]
    }),
    T({
      id: 'p12c7t7', sec: '7-7', page: '211', title: 'أشباه الموصلات',
      why: 'فهم خصائص أشباه الموصلات وتطبيقاتها',
      explain: [
        P('أشباه الموصلات هي مواد لها توصيلية كهربائية بين الموصلات والعوازل.')
      ],
      defs: [
        D('أشباه الموصلات', 'مواد لها توصيلية كهربائية بين الموصلات والعوازل.')
      ],
      laws: [],
      reasons: [],
      blanks: [
        F('أشباه الموصلات هي مواد لها', 'توصيلية بين الموصلات والعوازل')
      ],
      examples: [
        E('Semiconductor Properties', '211', 'Explain the conductivity range of semiconductors compared to conductors and insulators.', ['Conductivity between conductors and insulators', 'Can be modified by doping', 'Temperature dependent'], 'Semiconductors have electrical conductivity between that of conductors and insulators, and their conductivity can be modified by doping and is temperature dependent.')
      ],
      problems: [
        B('p12c7t7-p1', 'Page 211', '7-7', 'What happens to the conductivity of a semiconductor when it is heated?', 'Conductivity increases with temperature because more electrons gain enough energy to jump from the valence band to the conduction band.', ['Temperature increases', 'More electrons excitable', 'Conductivity increases']),
        B('p12c7t7-p2', 'Page 211', '7-7', 'Differentiate between intrinsic and extrinsic semiconductors.', 'Intrinsic: pure semiconductor. Extrinsic: doped semiconductor with added impurities to enhance conductivity.', ['Intrinsic: pure', 'Extrinsic: doped with impurities'])
      ],
      quiz: [
        Q('ما هي أشباه الموصلات؟', ['مواد لها توصيلية كهربائية بين الموصلات والعوازل', 'مواد معدنية تسمح بانسياب التيار الكهربائي دون مقاومة تُذكر', 'مواد لا تسمح بانسياب التيار الكهربائي تحت أي ظرف من الظروف', 'مواد توصيليتها لا تتغير إلا بتغير التوتر الكهربائي المسلط عليها'], 'تقع المقاومة النوعية لأشباه الموصلات بين المقاومة النوعية للموصلات والعوازل، وتنقص بارتفاع حرارتها لأن الطاقة الحرارية تكسر أواصر تساهمية فتنشأ أزواج إلكترون–فجوة، وتجعل التطعيم بالشوائب توصيليتها أعلى بزيادة عدد حاملات الشحنة.')
      ]
    }),
    T({
      id: 'p12c7t8', sec: '7-8', page: '211', title: 'الثنائي pn',
      why: 'فهم خصائص الثنائي البلوري pn',
      explain: [
        P('يتم الحصول على الثنائي البلوري pn بان تأخذ بلورة Semi موصل نقية (سيليكون أو جرمانيوم)، تطعم بنوعين من الشوائب أحدهما ثلاثية التكافؤ (البورون مثلاً) فنحصل على منطقة شبه موصل نوع P والشوائب الأخرى خماسية التكافؤ (الانتيمون) فنحصل على منطقة شبه موصل نوع N.')
      ],
      defs: [
        D('الثنائي pn', 'ينتج بانخذ بلورة Semi موصل نقية، تطعم بنوعين من الشوائب')
      ],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [
        E('PN Junction', '211', 'Explain how a p-n junction is formed and its basic properties.', ['Doping silicon with impurities', 'P-type and N-type regions', 'Depletion layer formation'], 'A p-n junction is obtained by doping a pure semiconductor crystal (silicon or germanium) with trivalent impurities (like boron) to get a P-type region, and with pentavalent impurities (like antimony) to get an N-type region.')
      ],
      problems: [
        B('p12c7t8-p1', 'Page 211', '7-8', 'What is the depletion region in a p-n junction?', 'The depletion region is an area around the p-n junction where mobile charge carriers have been eliminated, creating an electric field that prevents further diffusion.', ['Electric field', 'No mobile carriers', 'Forms at junction']),
        B('p12c7t8-p2', 'Page 211', '7-8', 'Explain the forward bias condition for a p-n junction.', 'In forward bias, the p-side is connected to positive voltage and n-side to negative, reducing the barrier and allowing current flow.', ['P-side positive', 'N-side negative', 'Barrier reduced', 'Current flows'])
      ],
      quiz: [
        Q('الثنائي pn ينتج من', ['تلاصق بلورتين من شبه الموصل من نوعي p و n', 'تطعيم بلورة شبه موصل نقية بشوائب خماسية التكافؤ وحدها', 'تطعيم بلورة شبه موصل نقية بشوائب ثلاثية التكافؤ وحدها', 'وصل معدنين مختلفين بموصل كهربائي بينهما'], 'تنتشر الإلكترونات من منطقة n إلى منطقة p والفجوات الموجبة من p إلى n، فيتكون بين المنطقتين ملتقى تفصلهما منطقة رقيقة خالية من حاملات الشحنة اسمها منطقة الاستنزاف، ويتولد فيها حاجز جهد يوقف الانتشار عند حالة التوازن.')
      ]
    }),
    T({
      id: 'p12c7t9', sec: '7-9', page: '214', title: 'بعض أنواع الثنائيات',
      why: 'فهم أنواع الثنائيات المستعملة في الأجهزة الإلكترونية',
      explain: [
        P('سبق أن عرفنا أن مصدر الطاقة اللازمة لتوليد الأزواج (الكترون-فجوة) في أشباه الموصلات هو طاقة حرارية، في أغلب الأحيان فإن تلك الطاقة هي التي تزودها حرارة الغرفة.')
      ],
      defs: [],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [
        E('Diode Types', '214', 'Explain the different types of diodes used in electronic devices.', ['PN junction diode', 'Zener diode', 'Light-emitting diode', 'Applications in circuits'], 'We previously learned that the energy source needed to generate electron-hole pairs in semiconductors is thermal energy, and in most cases this energy is supplied by room heat.')
      ],
      problems: [
        B('p12c7t9-p1', 'Page 214', '7-9', 'Name three types of diodes and their applications.', '1. PN junction diode: general rectification. 2. Zener diode: voltage regulation. 3. LED: light emission.', ['PN junction', 'Zener', 'LED', 'Rectification, regulation, illumination']),
        B('p12c7t9-p2', 'Page 214', '7-9', 'How does a Zener diode maintain constant voltage?', 'A Zener diode operated in reverse breakdown maintains a constant voltage across its terminals despite current changes.', ['Reverse breakdown', 'Constant voltage', 'Current changes'])
      ],
      quiz: []
    }),
    T({
      id: 'p12c7t10', sec: '7-10', page: '217', title: 'الترانزستور',
      why: 'فهمtrinistor',
      explain: [
        P('الترانزستور نبيطة (جهاز device) تتكون من ثلاث مناطق Manufactured from Semi موصل (سيليكون أو جرمانيوم)، يفصل بينها ملتقيان، المناطق الثلاث تسمى، (الباعث Emitter ويرمز له E، القاعدة Base ويرمز لها B، والجامع Collector ويرمز له C).')
      ],
      defs: [
        D('الترانزستور', 'device تتكون من ثلاث Regions Semi موصل Manufactured')
      ],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [
        E('Transistor', '217', 'Explain the structure and operation of a bipolar junction transistor.', ['Three regions: emitter, base, collector', 'Two junctions: emitter-base and base-collector', 'Amplification and switching functions'], 'A transistor is a device consisting of three regions manufactured from semiconductor material (silicon or germanium), separated by two junctions. The three regions are: emitter (E), base (B), and collector (C).')
      ],
      problems: [
        B('p12c7t10-p1', 'Page 217', '7-10', 'What are the three regions of a transistor and their functions?', 'Emitter (E): emits charge carriers. Base (B): thin region that controls flow. Collector (C): collects carriers. Amplification occurs when small base current controls large collector current.', ['Emitter', 'Base', 'Collector', 'Current amplification']),
        B('p12c7t10-p2', 'Page 217', '7-10', 'Explain the difference between NPN and PNP transistors.', 'NPN has electron majority carriers; PNP has hole majority carriers. Current directions are opposite in the two types.', ['NPN: electrons', 'PNP: holes', 'Opposite current directions'])
      ],
      quiz: [
        Q('الترانزستور يتكوّن من', ['ثلاث مناطق شبه موصلة: الباعث والقاعدة والجامع', 'منطقتين شبه موصلتين تفصلهما طبقة عازلة رقيقة', 'أربع مناطق شبه موصلية متتابعة يفصل بينها ثلاثة ملتقيات', 'منطقة واحدة سميكة من شبه الموصل دون تقسيم إلى مناطق'], 'يفصل بين المناطق الثلاث ملتقيان، وتُطعَّم منطقة الباعث بنسبة عالية من الشوائب والقاعدة بنسبة قليلة والجامع بنسبة متوسطة؛ للباعث أن يجهّز حاملات الشحنة فيُحيَّز انحيازًا أماميًا، ولجامع أن يجذبها فيُحيَّز انحيازًا عكسيًا، فيكفي تيار صغير في القاعدة لتسيير تيار كبير في الجامع وهي وظيفة التضخيم.')
      ]
    })
  ];
  window.H.push('12:sci:الفيزياء', { id: 'p12c7', no: 7, title: 'الفصل السابع: إلكترونيات الحالة الصلبة', en: 'Solid-State Electronics', pages: '199-226', goals: [], terms: [], test: { title: 'اختبار الفصل السابع', useTopicQuiz: true }, topics });
})();