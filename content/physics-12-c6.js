/* الفيزياء — السادس العلمي — الفصل السادس: الفيزياء الحديثة (الكتاب ص175–198)
   المواضيع 6-1 إلى 6-12 */
window.CONTENT_PARTS = window.CONTENT_PARTS || [];
(function () {
  const { Q, TF, X, B, T, L, D, R, F, E, P, K, N, EQ, HD, LI, TH, TB } = window.H;
  const topics = [
    T({
      id: 'p12c6t1', sec: '6-1', page: '175', title: 'مقدمة', en: 'Introduction',
      why: 'تمهيد لدراسة الفيزياء الحديثة التي تشمل ميكانيك الكم والنظرية النسبية',
      explain: [
        P('في بداية القرن العشرين حدثت تغيرات جذرية في علم الفيزياء فقد أفضت العديد من التجارب العملية الجديدة الى نتائج لا تخضع لتفسيرات القوانين الكلاسيكية (التقليدية)، ومن هذه التجارب تجربة إشعاع الجسم الأسود والظاهرة الكهروضوئية.')
      ],
      defs: [],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [],
      problems: [],
      quiz: [
        Q('الفيزياء الحديثة تشمل:', ['ميكانيك الكم والنظرية النسبية', 'الميكانيك الكلاسيكي فقط', 'الديناميكا الحرارية فقط', 'الكهرومغناطيسية فقط'], 'بدأت الفيزياء الحديثة من ميكانيك الكم والنظرية النسبية، فهما اللذان فسّرا ظواهر كإشعاع الجسم الأسود والظاهرة الكهروضوئية التي لم تخضع لقوانين الفيزياء الكلاسيكية.'),
        Q('فرضية بلانك تنص على أن الطاقة:', ['مكماة (توجد على شكل حزم منفصلة)', 'مستمرة', 'تتناسب مع التردد فقط', 'تتناسب مع الطول الموجي فقط'], 'الطاقة تُبعث/تُمتص على شكل كمات E = hf.')
      ]
    }),
    T({
      id: 'p12c6t2', sec: '6-2', page: '177-178', title: 'نظرية الكم (إشعاع الجسم الأسود وفرضية بلانك)', en: 'Quantum theory (Blackbody radiation and Planck\'s hypothesis)',
      why: 'Understanding blackbody radiation and how Planck\'s hypothesis led to quantum mechanics',
      explain: [
        P('At the end of the 19th century it became clear that the classical theory of thermal radiation was inappropriate, but why? The main problem was in interpreting or understanding the wavelength distribution of radiation emitted from a blackbody.')
      ],
      defs: [
        D('Blackbody', 'An ideal system that absorbs all incident radiation (and is also a perfect emitter when it is a radiation source).', 'Can be represented practically by a narrow opening inside a gap (or hollow body).')
      ],
      laws: [
        L('E = hf', 'Energy quantum equation', 'Photon energy equals Planck\'s constant times frequency', [['E', 'Photon energy', 'J'], ['h', 'Planck\'s constant', 'J·s'], ['f', 'Frequency', 'Hz']], 'According to Planck\'s hypothesis', 'If f = 10¹⁴ Hz then E = 6.63×10⁻²⁰ J.')
      ],
      reasons: [
        R('Why classical physics failed to explain blackbody radiation:', 'Because classical physics assumed energy is continuous, it predicted unlimited increase in intensity at high frequencies (the ultraviolet catastrophe), while experiment shows a peak then decrease.')
      ],
      blanks: [
        F('The world who proposed energy quantization hypothesis in 1900 is ____.', ['Planck', 'Max Planck', 'Max Planck'])
      ],
      examples: [],
      problems: [],
      quiz: [
        Q('Modern physics includes:', ['Quantum mechanics and relativity', 'Only classical mechanics', 'Only thermodynamics', 'Only electromagnetism'], 'أركان الفيزياء الحديثة هما ميكانيك الكم والنظرية النسبية.')
      ]
    }),
    T({
      id: 'p12c6t3', sec: '6-3', page: '181', title: 'Photoelectric effect',
      why: 'Understanding the photoelectric effect as experimental evidence of the particle nature of light',
      explain: [
        P('The photoelectric effect is the emission of electrons from a metal surface when light of a certain frequency shines on it. This phenomenon was discovered by Hertz in 1887.')
      ],
      defs: [
        D('Photoelectric effect', 'Emission of electrons from a metal surface when light of a certain frequency shines on it.', 'Discovered by Hertz in 1887.')
      ],
      laws: [
        L('E_k = hf - W', 'Einstein\'s equation for photoelectric effect', 'Maximum kinetic energy of emitted electrons equals photon energy minus work function', [['E_k', 'Maximum kinetic energy', 'J'], ['h', 'Planck\'s constant', 'J·s'], ['f', 'Light frequency', 'Hz'], ['W', 'Work function', 'J']], 'According to Einstein\'s 1905 explanation')
      ],
      reasons: [
        R('Why classical theory failed to explain the photoelectric effect:', 'Because it predicted that kinetic energy depends on light intensity and there should be a delay for energy accumulation, while experiment shows dependence on frequency and immediate emission.')
      ],
      blanks: [
        F('The world who explained the photoelectric effect is ____.', ['Albert Einstein'])
      ],
      examples: [],
      problems: [],
      quiz: [
        Q('The phenomenon that proves the particle nature of light:', ['Photoelectric effect', 'Light interference', 'Light diffraction', 'Light polarization'], 'في هذه الظاهرة تُمتص طاقة الضوء على شكل فوتونات تطلق الإلكترونات لحظيًا، ففسّرها اينشتين سنة ١٩٠٥ بفرضية الفوتون، وهي الدليل القاطع على السلوك الجسيمى للضوء.')
      ]
    }),
    T({
      id: 'p12c6t4', sec: '6-4', page: '184', title: 'Photoelectric effect and Einstein\'s equation',
      why: 'Understanding Einstein\'s equation for the photoelectric effect and its quantitative interpretation of light',
      explain: [
        P('In 1905 Einstein published a paper offering an explanation of the photoelectric effect based on Planck\'s hypothesis. He assumed that light consists of separate particles called photons.')
      ],
      defs: [
        D('Photon', 'The particle that light consists of, with energy E = hf.', 'Shows particle behavior in the photoelectric effect and Compton scattering.')
      ],
      laws: [],
      reasons: [
        R('Why maximum kinetic energy does not depend on light intensity:', 'Because each electron receives energy from only one photon (E = hf), and cannot accumulate energy from multiple photons in a single collision.')
      ],
      blanks: [
        F('Einstein\'s equation is E_k = hf - ____.', ['W'])
      ],
      examples: [],
      problems: [],
      quiz: [
        Q('Einstein\'s equation for the photoelectric effect is:', ['E_k = hf - W', 'E_k = hf + W', 'E_k = W - hf', 'E_k = hf × W'], 'الطاقة الحركية العظمى للإلكترون المنبعث تساوي طاقة الفوتون الساقط ناقص دالة شغل المعدن، فتنقص W من مقدار hf.')
      ]
    }),
    T({
      id: 'p12c6t5', sec: '6-5', page: '187', title: 'Particle-wave duality',
      why: 'Understanding wave-particle duality as a fundamental principle of modern physics',
      explain: [
        P('Wave-particle duality is the principle that micro-particles (such as electrons and photons) show wave-like behavior in some experiments and particle-like behavior in others.')
      ],
      defs: [
        D('Wave-particle duality', 'The principle that micro-particles show both wave and particle properties together.', 'A fundamental concept in modern physics.')
      ],
      laws: [
        L('λ = h/p', 'de Broglie wavelength', 'Wavelength associated with a particle is inversely proportional to its momentum', [['λ', 'Wavelength', 'm'], ['h', 'Planck\'s constant', 'J·s'], ['p', 'Particle momentum', 'kg·m/s']], 'According to de Broglie\'s hypothesis')
      ],
      reasons: [
        R('Why electrons show wave properties:', 'Through electron diffraction experiments where interference patterns similar to light patterns are formed when passing through a crystalline network.')
      ],
      blanks: [
        F('de Broglie wavelength is calculated from the relation λ = ____.', ['h/p'])
      ],
      examples: [],
      problems: [],
      quiz: [
        Q('Duality means particles show:', ['Wave properties in some experiments and particle properties in other experiments', 'Only wave properties', 'Only particle properties', 'No specific properties'], 'السلوك الثنائي يعني أن الجسيم يظهر الخواص الموجية في تجربة والخواص الجسيمية في أخرى، فلا تظهر الصفتان معًا في التجربة نفسها.'),
        Q('Who provided the probabilistic interpretation of the de Broglie wave?', ['Max Born', 'Louis de Broglie', 'Erwin Schrödinger', 'Niels Bohr'], 'فسر بورن عام ١٩٢٧ دالة الموجة تفسيرًا احتماليًا: مربع مقدارها |Ψ|² يعطي كثافة احتمال إيجاد الجسيم، وهو ما يميز الميكانيك الكم عن الكلاسيكي الذي يؤكد النتائج بدل أن يعطي احتمالاتها.')
      ]
    }),
    T({
      id: 'p12c6t6', sec: '6-6', page: '190', title: 'Matter waves and de Broglie',
      why: 'de Broglie\'s hypothesis on matter waves and its experimental confirmation',
      explain: [
        P('In 1924 Louis de Broglie proposed a revolutionary hypothesis: if light which was considered a wave has particle properties, perhaps particles like electrons also have wave properties. He proposed that any particle with momentum p is associated with a wave of wavelength λ = h/p.')
      ],
      defs: [
        D('Matter waves', 'Waves associated with moving particles and wavelength λ = h/p.', 'Accompany movement of material particles.')
      ],
      laws: [
        L('λ = h/p = h/mv', 'de Broglie wavelength', 'Particle wavelength is inversely proportional to velocity', [['λ', 'Wavelength', 'm'], ['h', 'Planck\'s constant', 'J·s'], ['m', 'Particle mass', 'kg'], ['v', 'Particle velocity', 'm/s']])
      ],
      reasons: [
        R('How Davisson and Germer confirmed de Broglie\'s hypothesis:', 'Because the distances between atoms in a crystal (of order 10⁻¹⁰ m) are comparable to the wavelength of fast electrons, making the crystal a natural diffraction grating.')
      ],
      blanks: [
        F('Matter waves are not vibrations in ____.', ['Medium'])
      ],
      examples: [],
      problems: [
        B('p12c6t6-p1', 'Page 190', '6-6', 'Calculate the de Broglie wavelength for an electron of mass 9.11×10⁻³¹ kg moving at speed 3×10⁵ m/s.', 'λ = h/(mv) = (6.63×10⁻³⁴)/((9.11×10⁻³¹)(3×10⁵)) = 2.42×10⁻⁹ m', [['m', 'Electron mass', '9.11×10⁻³¹ kg'], ['v', 'Velocity', '3×10⁵ m/s'], ['λ', 'Wavelength', '2.42×10⁻⁹ m']]),
        B('p12c6t6-p2', 'Page 190', '6-6', 'Explain how Davisson and Germer confirmed de Broglie\'s hypothesis experimentally in 1927.', 'Through electron diffraction experiment on a nickel crystal', [['Confirmed by', 'electron diffraction on nickel crystal in 1927']])
      ],
      quiz: [
        Q('de Broglie wavelength for a particle is given by:', ['λ = h/p', 'λ = hp', 'λ = h/m', 'λ = mv/h'], 'بحسب فرضية دي برولي يرافق الجسيم ذا الزخم p موجة طولها الموجي ثابت بلانك مقسومًا على زخمه، أي أنه يتناسب عكسيًا مع الزخم.'),
        Q('Davisson and Germer confirmed de Broglie\'s hypothesis experimentally in:', ['1927', '1924', '1905', '1923'], 'أجرى دافيسون وغيرمر سنة ١٩٢٧ تجربة حيود إلكترونات على بلورة النيكل، فلاحظا نمط تداخل يشبه نمط حيود الضوء، فكان ذلك برهانًا تجريبيًا على فرضية دي برولي في الموجات المادية.')
      ]
    }),
    T({
      id: 'p12c6t7', sec: '6-7', page: '193', title: 'Introduction to quantum mechanics',
      why: 'Understanding the basic principles of quantum mechanics',
      explain: [
        P('Quantum mechanics is the theory that describes the behavior of matter and energy at the atomic and subatomic level. It differs fundamentally from classical mechanics in its concepts and applications.')
      ],
      defs: [
        D('Quantum mechanics', 'The theory that describes the behavior of matter and energy at the atomic and subatomic level.', 'Differs from classical mechanics in its concepts and applications.')
      ],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [],
      problems: [],
      quiz: [
        Q('Quantum mechanics describes:', ['The behavior of matter and energy at the atomic and subatomic level', 'The motion of macroscopic bodies under the action of forces', 'The transfer of heat between bodies in thermal equilibrium', 'The attraction and repulsion between magnetic poles'], 'الميكانيك الكم هو الفرع المخصص لدراسة حركة الأشياء التي تأتي بحزم صغيرة جدًّا (كمات)، ويجيب بالاحتمالات لا بالتأكيد كما يفعل الميكانيك الكلاسيكي؛ ولذلك يُعطى نصف قطر بور بوصفه القيمة الأكثر احتمالًا لا مدارًا ثابتًا.'),
        TF('In quantum mechanics, the outcome of a measurement cannot be predicted with absolute certainty.', true, 'لأن الميكانيك الكم يصف النتيجة واحتمالها، فلا يحدد موضع الجسيم بدقة مطلقة بل يعطي احتمال وجوده في المكان والزمان المعينين.')
      ]
    }),
    T({
      id: 'p12c6t8', sec: '6-8', page: '196', title: 'Wave function',
      why: 'Understanding the concept of the wave function and its role in describing quantum systems',
      explain: [
        P('The wave function Ψ(r,t) is a mathematical function that describes the quantum state of a physical system. This function contains all the information possible about the system.')
      ],
      defs: [
        D('Wave function', 'A mathematical function that describes the quantum state of a physical system, written Ψ(r,t).', 'Contains all the information possible about the system.')
      ],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [],
      problems: [],
      quiz: [
        Q('The wave function Ψ(r,t) describes:', ['The quantum state of a physical system', 'The temperature of a body per unit volume', 'The gravitational field between two masses', 'The resistance of a conductor to an electric current'], 'دالة الموجة هي الكمية التي تغيراتها تشكل الموجات المادية المرافقة للجسيم، فقيمتها في نقطة وزمن معينين تحدد احتمالية إيجاد الجسيم فيهما.'),
        Q('Square of the wave function magnitude |Ψ|² gives:', ['Probability density for finding the particle', 'The total energy carried by the particle', 'The work function of the illuminated metal', 'The wavelength of the matter wave accompanying the particle'], 'يرتبط مربع مقدار دالة الموجة |Ψ|² بكثافة احتمال إيجاد الجسيم في وحدة الحجم عند نقطة وزمن معينين، وقد قدّم هذا التفسير بورن سنة ١٩٢٧.')
      ]
    }),
    T({
      id: 'p12c6t9', sec: '6-9', page: '197', title: 'Heisenberg uncertainty principle',
      why: 'Understanding the uncertainty principle and its effect on the nature of measurement in quantum mechanics',
      explain: [
        P('The Heisenberg uncertainty principle is a fundamental principle in quantum mechanics which states that it is impossible to determine certain pairs of physical properties of a particle, such as position and momentum, with arbitrary precision.')
      ],
      defs: [
        D('Uncertainty principle', 'The principle which states that it is impossible to determine certain pairs of physical properties of a particle with arbitrary precision.', 'Fundamental property of nature, not due to imperfect measurement devices.')
      ],
      laws: [
        L('Δx Δp ≥ h/4π', 'Heisenberg uncertainty principle for position and momentum', 'It is impossible to determine position and momentum with arbitrary precision at the same time', [['Δx', 'Uncertainty in position', 'm'], ['Δp', 'Uncertainty in momentum', 'kg·m/s'], ['h', 'Planck\'s constant', 'J·s'], ['4π', '4 × pi']])
      ],
      reasons: [
        R('Why the uncertainty principle is not due to imperfect measurement devices:', 'Because it is a fundamental property of nature that cannot be overcome even with ideal devices.')
      ],
      blanks: [
        F('Heisenberg uncertainty principle was proposed by ____.', ['Heisenberg'])
      ],
      examples: [],
      problems: [],
      quiz: [
        Q('Heisenberg uncertainty principle was proposed by:', ['Heisenberg', 'Max Planck', 'Albert Einstein', 'Louis de Broglie'], 'قدّم هايزنبرك هذا المبدأ سنة ١٩٢٧، ونصّه على استحالة قياس موضع الجسيم وزخمه الخطي معًا وبدقة مطلقة: Δx × Δp ≥ h/4π، وهذه حدود تفرضها الطبيعة نفسها لا ضعف أجهزة القياس.'),
        TF('It is impossible to determine position and momentum with arbitrary precision at the same time.', true, 'هذا نص مبدأ اللادقة: كلما صغُرت اللادقة Δx في الموضع صارت اللادقة Δp في الزخم أكبر، فحاصل ضربهما لا ينزل عن h/4π.')
      ]
    }),
    T({
      id: 'p12c6t10', sec: '6-10', page: '192', title: 'Relativity theory',
      why: 'Understanding the basics of Einstein\'s relativity theory',
      explain: [
        P('Relativity is the theory which Einstein introduced to describe physics in reference frames moving at constant speeds. It is divided into special relativity (1905) and general relativity (1915).')
      ],
      defs: [
        D('Special relativity', 'The theory which describes physics in reference frames moving at constant speeds.', 'Based on two fundamental principles: laws of physics are the same in all inertial frames, and the speed of light in a vacuum is constant.')
      ],
      laws: [
        L('c = 3×10⁸ m/s', 'Speed of light in a vacuum', 'Constant in all reference frames'),
        L('E = mc²', 'Mass-energy equivalence', 'Mass is a form of energy', [['E', 'Energy', 'J'], ['m', 'Mass', 'kg'], ['c', 'Speed of light', 'm/s']])
      ],
      reasons: [
        R('Why no object with mass can reach the speed of light:', 'Because the energy required to accelerate the object increases without bound as its speed approaches the speed of light (E = γmc²).')
      ],
      blanks: [
        F('Speed of light in a vacuum is ____.', ['3×10⁸ m/s'])
      ],
      examples: [],
      problems: [],
      quiz: [
        Q('Special relativity is based on:', ['Two principles: the laws of physics are the same in all inertial frames, and the speed of light in a vacuum is constant', 'The ether theory of light', 'Absolute time in all reference frames', 'The classical laws of mechanics only'], 'تعتمد النظرية النسبية الخاصة على فرضيتين: أن قوانين الفيزياء واحدة في جميع أطر الإسناد القصورية، وأن سرعة الضوء في الفراغ ثابتة في جميع هذه الأطر، وقد دعمهما تجربة مايكلسون ومورلي سنة ١٨٨٧.'),
        Q('Speed of light in a vacuum:', ['Is constant and does not depend on the motion of the source or the observer', 'Increases when the source moves toward the observer', 'Depends on the refractive index of the medium it passes through', 'Is equal to the velocity of the source of light'], 'هذه فرضية اينشتين الثانية في النسبية الخاصة: c = 3×10⁸ m/s في جميع أطر الإسناد القصورية، وقد أثبت ثباتها تجربة مايكلسون ومورلي سنة ١٨٨٧ فأسقطت نظرية الأثير.')
      ]
    }),
    T({
      id: 'p12c6t11', sec: '6-11', page: '185', title: 'Lorentz transformations',
      why: 'Understanding Lorentz transformation equations to link measurements between moving reference frames',
      explain: [
        P('Lorentz transformations are mathematical equations that link space and time measurements between two reference frames moving at a constant velocity relative to each other. They are named after Hendrik Lorentz.')
      ],
      defs: [
        D('Lorentz transformations', 'Mathematical equations that link space and time measurements between reference frames moving at high speeds.', 'Named after Hendrik Lorentz.')
      ],
      laws: [
        L('γ = 1/√(1−v²/c²)', 'Lorentz factor', 'Determines the magnitude of relativistic effects', [['γ', 'Lorentz factor'], ['v', 'Velocity of the body'], ['c', 'Speed of light']]),
        L('x\' = γ(x − vt)', 'Lorentz transformation for position', 'Transforming position coordinates between reference frames', [['x', 'Position coordinate in original frame'], ['v', 'Speed of moving frame'], ['t', 'Time in original frame']]),
        L('t\' = γ(t − vx/c²)', 'Lorentz transformation for time', 'Transforming time coordinates between reference frames', [['t', 'Time in original frame'], ['x', 'Position coordinate'], ['v', 'Speed of moving frame']])
      ],
      reasons: [
        R('Why Galilean transformations fail at high speeds:', 'Because they assume time is absolute and velocities add linearly, which contradicts the constancy of the speed of light.')
      ],
      blanks: [
        F('Lorentz transformations are named after ____.', ['Hendrik Lorentz'])
      ],
      examples: [],
      problems: [],
      quiz: [
        Q('Lorentz factor γ = 1/√(1−v²/c²) determines:', ['The magnitude of relativistic effects between two inertial frames', 'The speed of light in a vacuum', 'The de Broglie wavelength accompanying a moving particle', 'The work function of the metal surface'], 'معامل لورنتز هو العامل التصحيحي الذي اعتمده لورنتز لربط إحداثيات إطارَي إسناد متحركين؛ وقيمته تقارب الواحد عند السرعات القليلة، ثم تمضي في الزيادة لتصبح ما لا نهاية عند الاقتراب من سرعة الضوء، بمقدار تأثيرات النسبية.'),
        Q('When velocities are low (v << c), Lorentz transformations approach:', ['Galilean transformations', 'Lorentz transformations remain exactly the same', 'The equations of the photoelectric effect', 'The laws of blackbody radiation'], 'لأن معامل لورنتز يقارب الواحد عند السرعات الصغيرة جدًّا، فتختفي الحدود النسبية في المعادلات وتتحول إلى تحويلات غاليلي.')
      ]
    }),
    T({
      id: 'p12c6t12', sec: '6-12', page: '192', title: 'Mass-energy equivalence',
      why: 'Understanding Einstein\'s famous equation E = mc² and its applications',
      explain: [
        P('Mass-energy equivalence is the principle that mass is a form of energy. The equation E = mc² expresses this equivalence where E is energy, m is mass, and c is the speed of light.')
      ],
      defs: [
        D('Mass-energy equivalence', 'The principle that mass is a form of energy expressed by the equation E = mc².', 'A fundamental principle of modern physics, basis of nuclear energy.')
      ],
      laws: [
        L('E = mc²', 'Einstein\'s equation', 'Equivalence between mass and energy', [['E', 'Energy', 'J'], ['m', 'Mass', 'kg'], ['c', 'Speed of light', 'm/s']]),
        L('E = γmc²', 'Relativistic energy', 'Total energy of a moving body', [['E', 'Total energy', 'J'], ['γ', 'Lorentz factor'], ['m', 'Rest mass', 'kg'], ['c', 'Speed of light', 'm/s']])
      ],
      reasons: [
        R('Why rest mass energy is huge:', 'Because the speed of light is very large (c² = 9 × 10¹⁶ m²/s²), so even a small mass multiplied by this large number gives huge energy.')
      ],
      blanks: [
        F('Einstein\'s equation is: E = ____.', ['mc²'])
      ],
      examples: [],
      problems: [],
      quiz: [
        Q('Einstein\'s equation is:', ['E = mc²', 'E = mc', 'E = m/c²', 'E = m²c²'], 'ينص تكافؤ الكتلة والطاقة على أن الطاقة الناتجة من كتلة معينة تساوي حاصل ضرب هذه الكتلة في مربع سرعة الضوء، وقد فُسّرت بها طاقة النجوم وعمرها الطويل، وهي مبدأ عمل المفاعلات النووية.'),
        Q('Mass-energy equivalence explains why:', ['The energy necessary to accelerate an object increases without bound as its speed approaches the speed of light', 'The length of a moving object increases with its speed', 'The mass of a heated object decreases steadily', 'The clock of a moving observer runs faster than a stationary one'], 'لأن كتلة الجسم المتحرك تزداد بزيادة سرعته وفق m = γm₀، فكلما اقترب الجسم من سرعة الضوء احتاج طاقة أكبر إلى ما لا نهاية، من غير أن يبلغها أبدًا.')
      ]
    })
  ];
  window.H.push('12:sci:الفيزياء', { id: 'p12c6', no: 6, title: 'الفصل السادس: الفيزياء الحديثة', en: 'Modern Physics', pages: '175-198', goals: [], terms: [], test: { title: 'اختبار الفصل السادس', useTopicQuiz: true }, topics });
})();