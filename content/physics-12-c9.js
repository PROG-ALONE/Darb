/* الفيزياء — السادس العلمي — الفصل التاسع: الفيزياء النووية (الكتاب ص255–282)
   المواضيع 9-1 إلى 9-10 */
window.CONTENT_PARTS = window.CONTENT_PARTS || [];
(function () {
  const { Q, TF, X, B, T, L, D, R, F, E, P, K, N, EQ, HD, LI, TH, TB } = window.H;
  const topics = [
    T({
      id: 'p12c9t1', sec: '9-1', page: '255', title: 'مقدمة',
      why: 'مدخل للفيزياء النووية وأهميتها',
      explain: [
        P('الفيزياء النووية هي فرع من الفيزياء يدرس نواة الذرة وتفاعلاتها.')
      ],
      defs: [
        D('الفيزياء النووية', 'فرع من الفيزياء يدرس نواة الذرة وتفاعلاتها.')
      ],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [
        E('Introduction to Nuclear Physics', '255', 'Introduce the branch of physics that studies the nucleus and its interactions.', ['Studies nucleus', 'Covers nuclear interactions', 'Important for energy applications'], 'Nuclear physics is the branch of physics that deals with the study of the atomic nucleus and its constituent particles and interactions.')
      ],
      problems: [
        B('p12c9t1-p1', 'Page 255', '9-1', 'Why is nuclear physics important?', 'Nuclear physics is essential for understanding nuclear energy, nuclear medicine, and the fundamental structure of matter. It enables the development of nuclear power reactors and radioactive diagnostic techniques.', ['Nuclear energy production', 'Nuclear medicine and diagnostics', 'Fundamental structure of matter'])
      ],
      quiz: [
        Q('الفيزياء النووية تدرس:', ['نواة الذرة', 'تفاعلات النواة'])
      ]
    }),
    T({
      id: 'p12c9t2', sec: '9-2', page: '257', title: 'التركيب النووي',
      why: 'فهم تركيب نواة الذرة',
      explain: [
        P('تتكون نواة الذرة من بروتونات ونيوترونات تعرف بالنوكليونات.')
      ],
      defs: [
        D('النواة', 'الجزء المركزي من الذرة الذي يحتوي على البروتونات والنيوترونات.')
      ],
      laws: [
        L('Z = عدد البروتونات', 'العدد الذري', ' خاصية النواة', [['Z', 'العدد الذري']]),
        L('A = Z + N', 'العدد الكتلي', ' خاصية النواة', [['A', 'العدد الكتلي'], ['Z', 'العدد الذري'], ['N', 'عدد النيوترونات']])
      ],
      reasons: [],
      blanks: [
        F('تتكون نواة الذرة من بروتونات و', 'نيوترونات')
      ],
      examples: [
        E('Nuclear Composition', '257', 'Explain the composition of the atomic nucleus.', ['Protons and neutrons', 'Nucleons', 'Defines element identity'], 'The atomic nucleus consists of protons and neutrons, collectively called nucleons. The number of protons defines the element.')
      ],
      problems: [
        B('p12c9t2-p1', 'Page 257', '9-2', 'If a nucleus has 26 protons and 30 neutrons, what is its mass number and element?', 'A = Z + N = 26 + 30 = 56, Element: Iron (Fe)', ['Z = 26', 'N = 30', 'A = 56', 'Iron (Fe)']),
        B('p12c9t2-p2', 'Page 257', '9-2', 'Compare the number of protons and neutrons in a stable nucleus for light elements.', 'For light elements, the number of neutrons is approximately equal to the number of protons (N ≈ Z). The ratio N/Z increases for heavier stable nuclei.', ['N ≈ Z for light elements', 'N/Z increases for heavier nuclei', 'Ratio reaches ~1.5 for heavy stable nuclei'])
      ],
      quiz: [
        Q('تتكون النواة من:', ['بروتونات ونيوترونات'])
      ]
    }),
    T({
      id: 'p12c9t3', sec: '9-3', page: '259', title: 'العدد الذري والعدد الكتلي',
      why: 'فهم العدد الذري والعدد الكتلي وأهميتهما',
      explain: [
        P('العدد الذري هو عدد البروتونات في نواة الذرة ويرمز له بـ Z.')
      ],
      defs: [
        D('العدد الذري', 'عدد البروتونات في نواة الذرة ويرمز له بـ Z.')
      ],
      laws: [
        L('Z = عدد البروتونات', 'العدد الذري', ' خاصية nucléus', [['Z', 'العدد الذري']])
      ],
      reasons: [],
      blanks: [
        F('العدد الذري هو عدد', 'البروتونات')
      ],
      examples: [
        E('Atomic Number', '259', 'Explain the concept of atomic number and its significance.', ['Z = number of protons', 'Identifies the element', 'Determines chemical properties'], 'The atomic number Z equals the number of protons in the nucleus, which uniquely identifies the chemical element and determines its chemical properties.')
      ],
      problems: [
        B('p12c9t3-p1', 'Page 259', '9-3', 'How many protons are in the nucleus of a carbon-14 atom?', 'Carbon has Z = 6, so a carbon-14 atom has 6 protons. The mass number 14 includes 6 protons and 8 neutrons.', ['Z = 6 for carbon', 'Carbon-14 has 6 protons and 8 neutrons', 'N = 14 - 6 = 8']),
        B('p12c9t3-p2', 'Page 259', '9-3', 'If an element has atomic number 92, how many protons and electrons does a neutral atom have?', 'A neutral atom has equal numbers of protons and electrons. Therefore, 92 protons and 92 electrons.', ['Z = 92', 'Protons = 92', 'Electrons = 92 in neutral atom'])
      ],
      quiz: [
        Q('العدد الذري هو:', ['عدد البروتونات في النواة'])
      ]
    }),
    T({
      id: 'p12c9t4', sec: '9-4', page: '261', title: 'النظائر',
      why: 'فهم النظائر وأهميتها',
      explain: [
        P('النظائر هي ذرات لنفس العنصر لها نفس العدد الذري ولكن أعداد كتلية مختلفة.')
      ],
      defs: [
        D('النظير', 'ذرة لنفس العنصر لها نفس العدد الذري ولكن عدد كتلي مختلف.')
      ],
      laws: [],
      reasons: [],
      blanks: [
        F('النظائر هي ذرات لنفس العنصر لها نفس', 'العدد الذري')
      ],
      examples: [
        E('Isotopes', '261', 'Explain the concept of isotopes and their significance.', ['Same Z, different A', 'Same element, different mass', 'Different physical properties'], 'Isotopes are atoms of the same element (same number of protons) but with different numbers of neutrons, resulting in different mass numbers. They have nearly identical chemical properties but different physical properties.')
      ],
      problems: [
        B('p12c9t4-p1', 'Page 261', '9-4', 'Uranium has atomic number 92. Name two isotopes of uranium and their mass numbers.', 'Uranium-235 and Uranium-238, both have Z = 92 but A = 235 and A = 238 respectively.', ['U-235: Z=92, A=235', 'U-238: Z=92, A=238', 'Same protons, different neutrons']),
        B('p12c9t4-p2', 'Page 261', '9-4', 'If an element has 35 protons and 44 neutrons, and another isotope of the same element has 35 protons and 48 neutrons, compare their mass numbers.', 'First isotope: A = 35 + 44 = 79. Second isotope: A = 35 + 48 = 83. The second has a larger mass number.', ['A₁ = 79', 'A₂ = 83', 'ΔA = 4', 'Same Z, different N'])
      ],
      quiz: [
        Q('النظائر لها:', ['نفس العدد الذري وأعداد كتلية مختلفة'])
      ]
    }),
    T({
      id: 'p12c9t5', sec: '9-5', page: '263', title: 'طاقة الربط النووية',
      why: 'فهم طاقة الربط النووية وأهميتها',
      explain: [
        P('طاقة الربط النووية هي الطاقة اللازمة لتفكيك النواة إلى مكوناتها الأساسية.')
      ],
      defs: [
        D('طاقة الربط النووية', 'الطاقة اللازمة لتفكيك النواة إلى مكوناتها الأساسية.')
      ],
      laws: [
        L('E = Δm × c²', 'معادلة أينشتين', ' طاقة الربط النووية من نقص massa', [['E', 'طاقة الربط'], ['Δm', 'نقص massa'], ['c', 'سرعة الضوء']])
      ],
      reasons: [],
      blanks: [
        F('طاقة الربط النووية هي الطاقة اللازمة لـ', 'تفكيك النواة')
      ],
      examples: [
        E('Nuclear Binding Energy', '263', 'Calculate the binding energy given the mass defect.', ['E = Δm × c²', 'Mass defect → energy', 'MeV to joules conversion'], 'The nuclear binding energy is calculated using Einstein\'s equation E = Δm × c², where Δm is the mass defect (difference between the mass of individual nucleons and the actual nucleus mass).')
      ],
      problems: [
        B('p12c9t5-p1', 'Page 263', '9-5', 'Calculate the binding energy per nucleon for a nucleus with mass defect Δm = 0.008 u.', 'E = Δm × c² = 0.008 × (931.5 MeV/u) = 7.452 MeV per nucleon', ['Δm = 0.008 u', '1 u = 931.5 MeV/c²', 'E = 0.008 × 931.5 = 7.452 MeV']),
        B('p12c9t5-p2', 'Page 263', '9-5', 'If the total binding energy of a nucleus is 1800 MeV and it has 60 nucleons, what is the binding energy per nucleon?', 'E/A = 1800/60 = 30 MeV per nucleon', ['Total E = 1800 MeV', 'A = 60 nucleons', 'E/A = 1800/60 = 30 MeV/nucleon'])
      ],
      quiz: [
        Q('طاقة الربط النووية هي:', ['الطاقة اللازمة لتفكيك النواة'])
      ]
    }),
    T({
      id: 'p12c9t6', sec: '9-6', page: '265', title: 'النشاط الإشعاعي',
      why: 'فهم النشاط الإشعاعي وأنواعه',
      explain: [
        P('النشاط الإشعاعي هو تحلل نووي تلقائي ينتج عنه انبعاث إشعاعات.')
      ],
      defs: [
        D('النشاط الإشعاعي', 'تحلل نووي تلقائي ينتج عنه انبعاث إشعاعات.')
      ],
      laws: [
        L('Δx Δp ≥ h/4π', 'مبدأ عدم القدرة على التحديد', '原则 أساسي في ميكانيك الكم', [['Δx', 'عدم القدرة على التحديد في الموضع'], ['Δp', 'عدم القدرة على التحديد في الزخم'], ['h', 'ثابت بلانك'], ['π', 'باي']])
      ],
      reasons: [],
      blanks: [],
      examples: [
        E('Radioactive Activity', '265', 'Explain the concept of radioactive activity and its measurement.', ['Spontaneous decay', 'Emits radiation', 'Measured in Becquerel'], 'Radioactive activity is the spontaneous nuclear decay that emits radiation. It is measured in becquerel (Bq), where 1 Bq = 1 decay per second.')
      ],
      problems: [
        B('p12c9t6-p1', 'Page 265', '9-6', 'If a source has an activity of 500 Bq, how many decays occur in 10 seconds?', 'Decays = activity × time = 500 × 10 = 5000 decays', ['A = 500 Bq', 't = 10 s', 'Decays = 500 × 10 = 5000']),
        B('p12c9t6-p2', 'Page 265', '9-6', 'Explain the difference between alpha, beta, and gamma radiation.', 'Alpha: 2 protons + 2 neutrons, low penetration. Beta: high-energy electron/positron, moderate penetration. Gamma: high-energy photon, high penetration.', ['Alpha: heavy, short range', 'Beta: light, medium range', 'Gamma: photon, long range'])
      ],
      quiz: []
    }),
    T({
      id: 'p12c9t7', sec: '9-7', page: '269', title: 'التفاعلات النووية',
      why: 'فهم التفاعلات النووية',
      explain: [
        P('لاحظنا سابقاً أن تركيب النواة يتغير وذلك عندما تعاني النواة انحلالاً اشعاعياً بوساطة انحلال الفا أو انحلال بيتا.')
      ],
      defs: [],
      laws: [
        L('a + X → Y + b', 'تفاعل نووي', ' تغير في خصائص النواة الهدف', [['a', 'جسيم ساقط'], ['X', 'نواة الهدف'], ['Y', 'نواة resultant'], ['b', 'جسيم resultant']])
      ],
      reasons: [],
      blanks: [],
      examples: [
        E('Nuclear Reaction', '269', 'Explain a nuclear reaction with an example.', ['Reactants → Products', 'Conservation of mass number and charge', 'Example: alpha decay'], 'A nuclear reaction involves changes in the nucleus composition, where the number of nucleons and charge are conserved. Example: alpha decay where a nucleus emits an alpha particle.')
      ],
      problems: [
        B('p12c9t7-p1', 'Page 269', '9-7', 'Complete the nuclear reaction: ^{238}_{92}U + ^{1}_{0}n → ^{239}_{92}U → ?', '^{239}_{92}U → ^{235}_{90}Th + ^{4}_{2}He (alpha decay)', ['^{238}_{92}U captures neutron', '^{239}_{92}U', 'Alpha decay to ^{235}_{90}Th + alpha particle']),
        B('p12c9t7-p2', 'Page 269', '9-7', 'Write the nuclear reaction for beta decay of ^{14}_{6}C.', '^{14}_{6}C → ^{14}_{7}N + e^{-} + anti-neutrino', ['^{14}_{6}C', '^{14}_{7}N', 'beta particle (e⁻)'])
      ],
      quiz: []
    }),
    T({
      id: 'p12c9t8', sec: '9-8', page: '271', title: 'انشطار نووي',
      why: 'فهم الانشطار النووي',
      explain: [
        P('الانشطار النووي هو تفاعل نووي تقسم فيه نواة ثقيلة (مثل نواة اليورانيوم 235) إلى نواتين متوسطتين بالكتلة وذلك عن طريق قصف هذه النواة الثقيلة بوساطة نيوترون بطيء.')
      ],
      defs: [
        D('الانشطار النووي', 'تقسم فيه نواة ثقيلة إلى نواتين متوسطتين.')
      ],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [
        E('Nuclear Fission', '271', 'Explain the nuclear fission process.', ['Heavy nucleus + neutron → fission products + neutrons + energy', 'U-235 example'], 'Nuclear fission is the process where a heavy nucleus (like U-235) splits into two medium-mass nuclei when bombarded by a slow neutron, releasing additional neutrons and large amounts of energy.')
      ],
      problems: [
        B('p12c9t8-p1', 'Page 271', '9-8', 'If a U-235 nucleus captures a neutron and fissions into Ba-141 and Kr-92, how many neutrons are released?', 'U-236 → Ba-141 + Kr-92 + 3n, so 3 neutrons are released', ['^{236}_{92}U', '^{141}_{56}Ba', '^{92}_{36}Kr', '3 neutrons released', '236 = 141 + 92 + 3 × 1']),
        B('p12c9t8-p2', 'Page 271', '9-8', 'Calculate the energy released in the fission of 1 kg of U-235, given that each fission releases about 200 MeV.', 'Number of U-235 atoms in 1 kg = (1000 g)/(235 g/mol) × Avogadro\'s number ≈ 2.56×10^{24}. Total energy = 2.56×10^{24} × 200 MeV ≈ 5.12×10^{26} MeV ≈ 8.2×10^{13} J', ['1 fission = 200 MeV', 'Atoms in 1 kg ≈ 2.56×10^{24}', 'Total ≈ 8.2×10^{13} J'])
      ],
      quiz: []
    }),
    T({
      id: 'p12c9t9', sec: '9-9', page: '273', title: 'اندماج نووي',
      why: 'فهم الاندماج النووي',
      explain: [
        P('الاندماج النووي هو تفاعل نووي تدمج فيه نواتان صغيرتان (خفيفتين بالكتلة) لتكوين نواة أثقل.')
      ],
      defs: [
        D('الاندماج النووي', 'تدمج فيه نواتان صغيرتان لتكوين نواة أثقل.')
      ],
      laws: [],
      reasons: [],
      blanks: [],
      examples: [
        E('Nuclear Fusion', '273', 'Explain the nuclear fusion process.', ['Light nuclei → heavier nucleus + energy', 'Sun example: proton-proton chain'], 'Nuclear fusion is the process where two light nuclei combine to form a heavier nucleus, releasing large amounts of energy. This is the process that powers the Sun (proton-proton chain reaction).')
      ],
      problems: [
        B('p12c9t9-p1', 'Page 273', '9-9', 'In the Sun\'s proton-proton chain, four protons fuse to form helium-2. If 10^38 fusions occur per second, what is the total energy released per second?', 'Energy per fusion ≈ 26.7 MeV. Total power = 10^38 × 26.7 MeV/s ≈ 4.27×10^{39} MeV/s ≈ 6.8×10^{26} W', ['10^38 fusions/s', '≈26.7 MeV per fusion', '≈6.8×10^{26} W (solar luminosity)']),
        B('p12c9t9-p2', 'Page 273', '9-9', 'Compare the energy released per unit mass in fission vs fusion.', 'Fusion of light elements releases significantly more energy per unit mass than fission of heavy elements (about 3-4 times more).', ['Fusion ~3-4× energy per mass of fission', 'Mass difference per nucleon is larger for light nuclei'])
      ],
      quiz: []
    }),
    T({
      id: 'p12c9t10', sec: '9-10', page: '275', title: 'مخاطر وفوائد الإشعاع النووي',
      why: 'فهم مخاطر وفوائد الإشعاع النووي',
      explain: [
        P('نحن جميعاً نتعرض إلى الأشعاعات النووية في كل لحظة من حياتنا، ولكن من أين تأتي هذه الأشعاعات النووية التي نتعرض لها؟')
      ],
      defs: [],
      laws: [],
      blanks: [],
      examples: [
        E('Radiation Hazards and Benefits', '275', 'Explain the dual nature of nuclear radiation.', ['Benefits: medicine, energy', 'Risks: cancer, environmental damage'], 'Nuclear radiation has dual nature: significant benefits in medicine (diagnosis and treatment), energy production, and industry, but also risks including increased cancer risk, genetic damage, and environmental contamination if not properly managed.')
      ],
      problems: [
        B('p12c9t10-p1', 'Page 275', '9-10', 'What are the main sources of natural background radiation?', 'Main sources: cosmic radiation from space, terrestrial radiation from soil and rocks (especially radon), and internal radiation from potassium-40 in the body.', ['Cosmic radiation', 'Radon gas from soil', 'Potassium-40 in body', 'Internal radiation']),
        B('p12c9t10-p2', 'Page 275', '9-10', 'Explain the ALARA principle for radiation protection.', 'ALARA = As Low As Reasonably Achievable. The principle states that radiation exposure should be kept as low as reasonably achievable, using time, distance, and shielding to minimize dose.', ['ALARA principle', 'Time: minimize exposure time', 'Distance: maximize distance from source', 'Shielding: use protective materials'])
      ],
      quiz: []
    })
  ];
  window.H.push('12:sci:الفيزياء', { id: 'p12c9', no: 9, title: 'الفصل التاسع: الفيزياء النووية', en: 'Nuclear Physics', pages: '255-282', goals: [], terms: [], test: { title: 'اختبار الفصل التاسع', useTopicQuiz: true }, topics });
})();