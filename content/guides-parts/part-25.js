/* أدلة الحزمة part-25 — الفيزياء: الفصل السابع (إلكترونيات الحالة الصلبة) + الفصل الثامن (الأطياف الذرية والليزر) */
window.SOLUTION_GUIDES = window.SOLUTION_GUIDES || {};

/* p12c7t4:e0 — طاقة الرابطة الأيونية بالقانون الكولومبي */
window.SOLUTION_GUIDES['p12c7t4:e0'] = {
  setup: ['q₁ = charge of the positive ion (C)', 'q₂ = charge of the negative ion (C)', 'r = separation between the two ions (m)', 'k = 9 × 10⁹ N·m²/C²'],
  find: 'E (energy of the ionic bond) = ?',
  law: 'E = k q₁ q₂ ÷ r',
  work: ['E = k q₁ q₂ ÷ r', '(1) q₁ and q₂ are the charges of the two ions (C).', '(2) r is the distance between the ion centres (m).', '(3) k = 9 × 10⁹ N·m²/C² is the Coulomb constant.', 'E = (9 × 10⁹ × q₁ × q₂) ÷ r  → answer in joules'],
  result: 'E = k q₁ q₂ ÷ r (in joules); the bond energy grows with the ion charges and shrinks as r grows.',
  watch: ['استعمال E = k q₁ q₂ ÷ r² بدل r.', 'نسيان أن الشحنتين مختلفتان في الإشارة فيحصل جمع بدل الضرب.', 'كتابة الناتج بوحدة eV دون تحويلها إلى J.', 'تجاهل وحدة المسافة r في الناتج.'],
  photo: ['اكتب q₁ و q₂ و r و k بوحداتها في سطر المعطيات.', 'اكتب القانون E = k q₁ q₂ ÷ r في سطر مستقل.', 'أظهر سطر التعويض النهائي بوضوح.', 'ضع الناتج مع وحدته (J) في مستطيل وصوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['قانون كولومب E = k q₁ q₂ ÷ r', 'ذكر وحدتي الشحنة C والمسافة m', 'التعويض عن k = 9 × 10⁹', 'الوحدة: الجول في الناتج']
};

/* p12c7t5-p1 — طاقة الارتباط بين بروتونين متباعدين 1 fm */
window.SOLUTION_GUIDES['p12c7t5-p1'] = {
  setup: ['k = 9 × 10⁹ N·m²/C²', 'q₁ = q₂ = 1.6 × 10⁻¹⁹ C (proton charge)', 'r = 1 fm = 1 × 10⁻¹⁵ m'],
  find: 'E (binding energy between the two protons) = ?',
  law: 'E = k q₁ q₂ ÷ r',
  work: ['E = k q₁ q₂ ÷ r', 'E = (9 × 10⁹) × (1.6 × 10⁻¹⁹)² ÷ (1 × 10⁻¹⁵)', '(1.6 × 10⁻¹⁹)² = 2.56 × 10⁻³⁸ C²', 'E = (9 × 10⁹ × 2.56 × 10⁻³⁸) ÷ (1 × 10⁻¹⁵)', 'E = 2.3 × 10⁻¹⁴ J'],
  result: 'E = 2.3 × 10⁻¹⁴ J',
  watch: ['خطأ في جمع الأسس: 10⁹ × 10⁻³⁸ = 10⁻²⁹ لا 10²⁹.', 'نسيان مربع الشحنة (استخدام q بدل q²).', 'كتابة 1 fm دون تحويلها إلى 1 × 10⁻¹⁵ m.', 'إهمال وحدة الجول في الناتج.'],
  photo: ['اكتب k و q و r في سطر المعطيات بوحداتها.', 'أظهر سطر تحويل 1 fm إلى 10⁻¹⁵ m بوضوح.', 'اكتب سطر تربيع الشحنة (1.6 × 10⁻¹⁹)² بوضوح.', 'ضع الناتج E في مستطيل مع وحدته J.'],
  checks: ['قانون E = k q₁ q₂ ÷ r', 'تحويل 1 fm إلى 10⁻¹⁵ m', 'تربيع الشحنة', 'تبسيط الأسس', 'الناتج 2.3 × 10⁻¹⁴ J']
};

/* p12c7t5-p2 — أثر مضاعفة المسافة ثلاث مرات على طاقة الارتباط */
window.SOLUTION_GUIDES['p12c7t5-p2'] = {
  setup: ['r₁ = original separation (m)', 'r₂ = 3 r₁ (the distance is tripled)', 'q₁ , q₂ , k unchanged', 'E₁ = k q₁ q₂ ÷ r₁'],
  find: 'New binding energy E₂ compared with E₁ = ?',
  law: 'E ∝ 1 ÷ r',
  work: ['E = k q₁ q₂ ÷ r  →  E ∝ 1 ÷ r', 'r₂ = 3 r₁ while q₁ and q₂ stay the same', 'E₂ = k q₁ q₂ ÷ (3 r₁)', 'E₂ = (1 ÷ 3) × (k q₁ q₂ ÷ r₁)', 'E₂ = E₁ ÷ 3'],
  result: 'E₂ = E₁ ÷ 3 (one third of the original value).',
  watch: ['كتابة E₂ = 3 E₁ لأن المسافة تضاعفت ثلاث مرات.', 'الخلط بين المقلوب: تناقص الطاقة مع زيادة المسافة.', 'نسيان أن الشحنتين و k ثابتة فلا تتغير.', 'القول إن الطاقة تصبح صفرًا عند مضاعفة المسافة.'],
  photo: ['اكتب r₁ ورابط r₂ = 3 r₁ في سطر المعطيات.', 'أظهر سطر E ∝ 1 ÷ r ثم سطر التعويض.', 'اكتب النسبة E₂ = E₁ ÷ 3 في مستطيل.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['استنتاج التغير العكسي E ∝ 1/r', 'تعويض r = 3 r₁', 'ظهور المقام 3 في الناتج', 'استنتاج E₂ = E₁ ÷ 3']
};

/* p12c7t5:e0 — طاقة الارتباط بين شحنتين (مفهوم) */
window.SOLUTION_GUIDES['p12c7t5:e0'] = {
  setup: ['q₁ , q₂ = the two charges (C)', 'r = distance between them (m)', 'k = 9 × 10⁹ N·m²/C²', 'unit of the answer: joule (J)'],
  find: 'How is the binding energy found and what does it depend on = ?',
  law: 'E = k q₁ q₂ ÷ r',
  work: ['1) E = k q₁ q₂ ÷ r', '2) charges: E ∝ q₁ q₂ (bigger charges → bigger E).', '3) distance: E ∝ 1 ÷ r (bigger r → smaller E).', '4) E = k q₁ q₂ ÷ r  → answer in joules'],
  result: 'Answer: E = k q₁ q₂ ÷ r in joules — it depends on the magnitude of the charges and inversely on the distance.',
  watch: ['استعمال r² بدل r في القسمة.', 'الاعتقاد بأن زيادة المسافة تزيد طاقة الارتباط.', 'نسيان أن وحدة الناتج هي الجول.', 'عدم ذكر ك = 9 × 10⁹ في التعويض.'],
  photo: ['اكتب الشحنتين والمسافة وثابت كولومب بوحداتها في سطر المعطيات.', 'اكتب القانون في سطر مستقل بخط واضح.', 'اكتب بجوار كل معامل ما الذي يعتمد عليه.', 'ضع الناتج في مستطيل وصوّر الورقة كاملةً عموديًا.'],
  checks: ['قانون E = k q₁ q₂ ÷ r', 'ذكر وحدة الشحنة C والمسافة m', 'التناسب مع q₁q₂', 'التناسب العكسي مع r', 'وحدة الجول في الناتج']
};

/* p12c7t6-p1 — فجوة الطاقة بين النطاقين */
window.SOLUTION_GUIDES['p12c7t6-p1'] = {
  setup: ['E_c = 1.1 eV (bottom of the conduction band)', 'E_v = −0.5 eV (top of the valence band)'],
  find: 'E_g (band gap energy) = ?',
  law: 'E_g = E_c − E_v',
  work: ['E_g = E_c − E_v', 'E_g = 1.1 − (−0.5)', 'E_g = 1.1 + 0.5', 'E_g = 1.6 eV'],
  result: 'E_g = 1.6 eV',
  watch: ['كتابة E_g = 1.1 − 0.5 = 0.6 eV (إهمال إشارة السالب).', 'الخلط بين E_g و E_c أو E_v.', 'طرح القيمتين والموجب في المقام.', 'كتابة الناتج بوحدة الجول بدل eV.'],
  photo: ['اكتب E_c و E_v بوحدتهما eV في سطر المعطيات.', 'أظهر سطر E_g = 1.1 − (−0.5) بالقوس بوضوح.', 'اكتب الخطوة التالية E_g = 1.1 + 0.5.', 'ضع الناتج في مستطيل مع وحدة eV.'],
  checks: ['قانون فجوة الطاقة E_g = E_c − E_v', 'التعويض عن E_c = 1.1 eV', 'مراعاة إشارة E_v السالبة', 'الناتج 1.6 eV']
};

/* p12c7t6-p2 — نوع المادة من قيمة فجوة الطاقة */
window.SOLUTION_GUIDES['p12c7t6-p2'] = {
  setup: ['E_g = 3.5 eV (band gap of the material)', 'Rule: E_g > 3 eV → insulator , 0 < E_g < 3 eV → semiconductor'],
  find: 'Type of the material = ?',
  law: 'Rule: 0 < E_g < 3 eV → semiconductor ; E_g > 3 eV → insulator',
  work: ['E_g = 3.5 eV', '3.5 eV > 3 eV', 'so it is outside the semiconductor range (0 < E_g < 3 eV)', 'E_g > 3 eV  →  insulator'],
  result: 'Insulator (عازل) — لأن E_g = 3.5 eV > 3 eV.',
  watch: ['الاكتفاء بكتابة «شبه موصل» لأن الرقم صغير دون مقارنته بحدود التصنيف.', 'اعتبار أن كل فجوة موجبة تعني شبه موصل.', 'الخلط بين نصف الموصل والعازل.', 'عدم ذكر حدود 3 eV المستعملة في التصنيف.'],
  photo: ['اكتب E_g = 3.5 eV في سطر المعطيات.', 'اكتب شرط التصنيف (0 < E_g < 3 eV) في سطر.', 'أظهر سطر المقارنة 3.5 eV > 3 eV.', 'ضع اسم نوع المادة في مستطيل وصوّر الورقة كاملةً.'],
  checks: ['كتابة قيمة الفجوة 3.5 eV', 'ذكر حدود التصنيف 3 eV', 'مقارنة 3.5 > 3', 'الناتج: عازل']
};

/* p12c7t6:e0 — حساب فجوة الطاقة وماذا تحدد (مفهوم) */
window.SOLUTION_GUIDES['p12c7t6:e0'] = {
  setup: ['E_c = energy of the conduction band minimum (eV)', 'E_v = energy of the valence band maximum (eV)', 'Typical values of E_g: 0.1 – 15 eV'],
  find: 'How the band gap is calculated and what it decides = ?',
  law: 'E_g = E_c − E_v',
  work: ['1) E_g = E_c − E_v', '2) E_g = (conduction band minimum) − (valence band maximum).', '3) E_g < 3 eV → semiconductor ; E_g > 3 eV → insulator.', '4) E_g = E_c − E_v (in eV) decides the type of the material.'],
  result: 'Answer: E_g = E_c − E_v in eV; it decides whether the material is a conductor, a semiconductor or an insulator.',
  watch: ['الطرح بترتيب معكوس فيظهر الناتج سالبًا.', 'الخلط بين E_c و E_v وتعريف كل منهما.', 'الاكتفاء بالحساب دون ذكر نوع المادة.', 'كتابة الفجوة بالسم بدل الـ eV.'],
  photo: ['اكتب E_c و E_v بوحدتيهما في سطر المعطيات.', 'اكتب القانون E_g = E_c − E_v في سطر مستقل.', 'اكتب بجواره تفسير نوع المادة.', 'ضع الخلاصة في مستطيل وصوّر الورقة كاملةً عموديًا.'],
  checks: ['قانون E_g = E_c − E_v', 'تعريف E_c و E_v', 'ذكر حدود التصنيف', 'خلاصة نوع المادة']
};

/* p12c7t7-p1 — أثر التسخين في ناقلية أشباه الموصلات */
window.SOLUTION_GUIDES['p12c7t7-p1'] = {
  setup: ['T = temperature (rises on heating)', 'E_g = energy gap between the two bands (eV)', 'A conduction electron needs at least E_g to cross the gap'],
  find: 'What happens to the conductivity when the semiconductor is heated = ?',
  law: 'More thermal energy → more electrons cross the gap → conductivity increases',
  work: ['1) T ↑ → the thermal energy of the lattice atoms increases.', '2) More valence electrons gain E_g and jump to the conduction band.', '3) The number of free carriers n increases.', '4) σ increases → the semiconductor conducts better when hot.'],
  result: 'The conductivity increases, because more electrons gain enough energy to jump from the valence band to the conduction band.',
  watch: ['القول إن الناقلية تنقص مع الحرارة كما في الفلزات.', 'الاكتفاء بزيادة سرعة الناقلين مع إهمال زيادة عددهم.', 'الخلط بين أشباه الموصلات والفلزات في أثر الحرارة.', 'نسيان أن مصدر الناقلين هو نطاق التكافؤ.'],
  photo: ['اكتب T و E_g في سطر المعطيات.', 'اكتب السبب (القفز من التكافؤ إلى التوصيل) في سطر.', 'اربط ذلك بزيادة الناقلين ثم بزيادة الناقلية.', 'اكتب الاستنتاج في سطر مستقل داخل مستطيل.'],
  checks: ['ذكر زيادة الطاقة الحرارية', 'فهم القفز بين النطاقين', 'زيادة عدد الناقلين', 'الناتج: زيادة الناقلية']
};

/* p12c7t7-p2 — الفرق بين أشباه الموصلات الجوهرية والخارجية */
window.SOLUTION_GUIDES['p12c7t7-p2'] = {
  setup: ['Intrinsic: a pure Si or Ge crystal with no impurities', 'Intrinsic: equal numbers of electrons (n) and holes (p)', 'Extrinsic: doped with donor (pentavalent) or acceptor (trivalent) impurities'],
  find: 'Difference between intrinsic and extrinsic semiconductors = ?',
  law: 'Intrinsic = pure ; Extrinsic = doped to raise conductivity',
  work: ['1) Intrinsic: pure crystal , no impurities added.', '2) Its conductivity is small and depends on temperature only.', '3) Extrinsic: a small amount of impurity is added (doping).', '4) Impurities give free carriers → conductivity is much higher.'],
  result: 'Intrinsic: pure semiconductor. Extrinsic: doped semiconductor with impurities added to enhance conductivity.',
  watch: ['الخلط بين مادة شبه موصلة خالصة ومادة شبه موصلة مطعّمة.', 'القول إن التطهير يرفع الناقلية لأن الذرات صارت أكبر.', 'نسيان أن الجوهرية تعتمد على الحرارة فقط.', 'تكرار الوصف نفسه في الحالتين دون فرق.'],
  photo: ['اكتب عنوان «شبه موصلة جوهرية» و«شبه موصلة خارجية» في سطرين.', 'تحت كل عنوان اكتب: المصدر + الناقلة + أثرها على الناقلية.', 'اكتب الفرق في جملة واحدة.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['تعريف الجوهرية (نقيّة)', 'تعريف الخارجية (مطعّمة)', 'ذكر نوعي الشوائب (خماسية وثنائية)', 'ذكر أثر التطهير على الناقلية']
};

/* p12c7t7:e0 — مدى ناقلية أشباه الموصلات (مفهوم) */
window.SOLUTION_GUIDES['p12c7t7:e0'] = {
  setup: ['Conductors (metals): the highest conductivity', 'Semiconductors: an intermediate value', 'Insulators: the lowest conductivity'],
  find: 'Where does the semiconductor conductivity lie and what changes it = ?',
  law: 'Order: conductor > semiconductor > insulator',
  work: ['1) σ(metal) > σ(semiconductor) > σ(insulator).', '2) The semiconductor value lies in between.', '3) It can be raised by doping (impurities).', '4) It also depends on temperature (it rises when heated).'],
  result: 'Answer: the conductivity of a semiconductor is between conductors and insulators; it can be modified by doping and depends on temperature.',
  watch: ['القول إن أشباه الموصلات توصل كالمعادن.', 'إهمال أثر التطهير في تعديل الناقلية.', 'الخلط بين ناقلية أشباه الموصلات وناقلية الفلزات.', 'نسيان أن التطهير يغيّر مقدار الناقلية ويعتمد نوع الشائبة.'],
  photo: ['اكتب ترتيب الناقلية σ(metal) > σ(semi) > σ(insulator) في سطر.', 'أظهر سطرين لأثر التطهير وأثر الحرارة.', 'اكتب الخلاصة في سطر مستقل.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['ترتيب الناقلية الثلاث', 'نسبة أشباه الموصلات بينهما', 'ذكر أثر التطهير', 'ذكر أثر الحرارة', 'الخلاصة']
};

/* p12c7t8-p1 — منطقة الاستنزاف عند الوصلة */
window.SOLUTION_GUIDES['p12c7t8-p1'] = {
  setup: ['P-side: holes are the majority carriers', 'N-side: electrons are the majority carriers', 'Majority carriers diffuse across the junction after contact'],
  find: 'What is the depletion region and what forms in it = ?',
  law: 'Depletion region: a region without mobile carriers, with fixed ions creating an internal field',
  work: ['1) Holes diffuse P → N and electrons diffuse N → P.', '2) Near the junction the mobile carriers are removed.', '3) Fixed ions stay behind → an internal electric field E appears.', '4) That field stops the diffusion → the depletion layer forms.'],
  result: 'The depletion region is the area around the junction in which mobile carriers have been eliminated, creating an electric field that stops further diffusion.',
  watch: ['وصفها بأنها منطقة فيها ناقلة حرة.', 'الخلط بينها وبين طبقة الانجراف أو طبقة التآكل.', 'نسيان أن الحقل الداخلي هو ما يوقف الانتشار.', 'القول إنها تتكون بتشرّد الذرات لا بذهاب الناقلات.'],
  photo: ['اكتب المتحرّكات على جانبَي الوصلة في سطرين.', 'اكتب خطأ سبب تكوّن المنطقة خطوة بخطوة.', 'أظهر سطر نشوء الحقل الداخلي.', 'اكتب التعريف النهائي في مستطيل وصوّر الورقة كاملةً.'],
  checks: ['ذكر انتقال الناقلة حتى الوصلة', 'ذهاب الناقلات المتحركة', 'بقاء الأيونات الثابتة', 'نشوء الحقل الكهربائي', 'دور الحقل في إيقاف الانتشار']
};

/* p12c7t8-p2 — شرط الانحياز الأمامي للوصلة */
window.SOLUTION_GUIDES['p12c7t8-p2'] = {
  setup: ['P-side is connected to the (+) terminal of the supply', 'N-side is connected to the (−) terminal of the supply', 'V = the potential barrier at the junction (V)'],
  find: 'Forward bias condition and its effect on the junction = ?',
  law: 'Forward bias: P → (+) and N → (−) ; the barrier drops and a current flows',
  work: ['1) P-side → positive terminal (+) , N-side → negative terminal (−).', '2) This is exactly the forward bias condition.', '3) The applied field opposes the internal barrier field.', '4) Barrier drops → majority carriers cross → current flows P → N.'],
  result: 'Forward bias: P-side positive and N-side negative; the barrier is reduced and a current flows through the junction.',
  watch: ['عكس الأقطاب (P سالب و N موجب) وهو الانحياز العكسي.', 'القول إن الحاجز يزداد في الانحياز الأمامي.', 'نسيان اتجاه التيار من P إلى N.', 'الخلط بين الانحياز الأمامي والعكسي في الأثر.'],
  photo: ['اكتب توصيل P و N بالقطبين في سطر واحد.', 'اكتب أثر الانحياز على الحاجز في سطر.', 'أظهر سطر مرور الناقلة واتجاه التيار.', 'اكتب التعريف في مستطيل وصوّر الورقة كاملةً عموديًا.'],
  checks: ['P موجب و N سالب', 'تعريف الانحياز الأمامي', 'انخفاض الحاجز', 'مرور التيار من P إلى N']
};

/* p12c7t8:e0 — كيف تتكون وصلة P-N */
window.SOLUTION_GUIDES['p12c7t8:e0'] = {
  setup: ['Pure crystal: silicon (Si) or germanium (Ge)', 'Trivalent impurity (boron, In, Ga) → P-type region', 'Pentavalent impurity (antimony, P, Bi) → N-type region', 'The two regions are joined at one boundary'],
  find: 'How the p-n junction is formed and its basic properties = ?',
  law: 'Doping a pure crystal with trivalent and pentavalent impurities creates P and N regions',
  work: ['1) Start with a pure Si (or Ge) crystal.', '2) Dope one side with a trivalent impurity → P-type region.', '3) Dope the other side with a pentavalent impurity → N-type region.', '4) At the boundary the carriers diffuse → a depletion layer with an internal field appears.'],
  result: 'A p-n junction is made by doping one side of a pure Si/Ge crystal with a trivalent impurity (P-type) and the other with a pentavalent impurity (N-type).',
  watch: ['عكس نوعي الشوائب: الخماسي يعطي N والثنائي يعطي P.', 'القول إن التطهير يحوّل نوع البلورة كله.', 'نسيان تكوّن طبقة الاستنزاف عند الواجهة.', 'الاكتفاء بالتعريف دون ذكر وظيفة الوصلة.'],
  photo: ['اكتب البلورة النقية ثم نوعي الشوائب بجوارها.', 'ارسم خطًا يفصل منطقة P عن منطقة N.', 'اكتب تكوّن طبقة الاستنزاف عند الخط.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['ذكر البلورة النقية Si/Ge', 'الخماسي → N والثنائي → P', 'تكوّن طبقة الاستنزاف', 'وصف وظيفية الوصلة']
};

/* p12c7t9-p1 — أنواع الديودات الثلاثة واستخداماتها */
window.SOLUTION_GUIDES['p12c7t9-p1'] = {
  setup: ['Three diode types are required', 'For each one: its name and its application'],
  find: 'Three types of diodes and their applications = ?',
  law: 'Match each diode to the job it does in the circuit',
  work: ['1) PN junction diode → rectification (turning AC into DC).', '2) Zener diode → voltage regulation (constant voltage).', '3) LED → light emission (displays and illumination).'],
  result: '1) PN junction diode: rectification.  2) Zener diode: voltage regulation.  3) LED: light emission.',
  watch: ['تكرار نوع واحد ثلاث مرات بأسماء مختلفة.', 'نسبة وظيفة تقويم الديود العادي إلى الزينر', 'الخلط بين الزينر والديود العادي في الوظيفة.', 'نسيان ذكر الاستخدام بجانب كل نوع.'],
  photo: ['اكتب الأنواع الثلاثة في عمود والاستخدامات في عمود مقابل.', 'اكتب اسم كل ديود بجواره مباشرة.', 'اكتب القائمة النهائية في مستطيل.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['ذكر الأنواع الثلاثة كاملة', 'PN → تقويم', 'Zener → تنظيم الجهد', 'LED → إضاءة']
};

/* p12c7t9-p2 — ثبات الجهد بالديود الزينر */
window.SOLUTION_GUIDES['p12c7t9-p2'] = {
  setup: ['The Zener diode is connected in reverse bias', 'At the Zener voltage V_z the current rises sharply', 'The current through the diode may change while the supply is fixed'],
  find: 'How the Zener diode keeps the voltage constant = ?',
  law: 'Reverse breakdown: the current changes while the voltage stays at V_z',
  work: ['1) The Zener diode works in the reverse breakdown region.', '2) A change of the circuit current changes only the diode current.', '3) The voltage across it stays at the Zener voltage V_z.', '4) So the output voltage remains constant.'],
  result: 'Operated in reverse breakdown, the Zener diode keeps a constant voltage V_z across its terminals whatever the current is.',
  watch: ['شرح الثبات في الانحياز الأمامي.', 'القول إن التيار يبقى ثابتًا بدل الجهد.', 'نسيان شرط انحيازه العكسي.', 'الخلط بين الزينر والديود العادي.'],
  photo: ['اكتب شرط العمل (الانحياز العكسي) في سطر.', 'اكتب أثر تغير التيار على الجهد في سطرين.', 'أظهر سطر استنتاج ثبات الجهد.', 'اكتب الخلاصة في مستطيل وصوّر الورقة كاملةً.'],
  checks: ['ذكر الانحياز العكسي', 'وصف انهيار الزينر', 'ثبات الجهد رغم تغير التيار', 'الخلاصة الصحيحة']
};

/* p12c7t9:e0 — أنواع الديودات في الأجهزة الإلكترونية (مفهوم) */
window.SOLUTION_GUIDES['p12c7t9:e0'] = {
  setup: ['Three diode types: PN junction , Zener , LED', 'Each type has one job inside the circuit'],
  find: 'Which types of diodes are used in electronic devices and what each does = ?',
  law: 'Name the diode type → state the function it performs',
  work: ['1) PN junction diode → rectification in power supplies.', '2) Zener diode → voltage regulation (constant voltage).', '3) LED → changes current into light for displays.', '4) The junction structure decides the function of each type.'],
  result: 'Answer: the PN junction diode (rectification), the Zener diode (voltage regulation) and the LED (light emission).',
  watch: ['اكتفاء بذكر النوع دون وظيفته.', 'تكرار وظيفة واحدة لثلاثة أنواع.', 'الخلط بين وظيفة الزينر ومهمة الديود العادي.', 'نسيان أن كل نوع يعمل في وضع تشغيل مختلف.'],
  photo: ['اكتب الأنواع الثلاثة في قائمة مرقمة.', 'اكتب وظيفة كل نوع في السطر المقابل له.', 'اكتب القائمة النهائية في مستطيل.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['ذكر الأنواع الثلاثة', 'ربط كل نوع بوظيفته', 'استخدام المصطلحات الصحيحة', 'الخلاصة']
};

/* p12c7t10-p1 — مناطق الترانزستور الثلاث ووظائفها */
window.SOLUTION_GUIDES['p12c7t10-p1'] = {
  setup: ['A transistor has three semiconductor regions', 'E = emitter , B = base , C = collector', 'Amplification means a small base current controls a large collector current'],
  find: 'The three regions of a transistor and the function of each = ?',
  law: 'Emitter injects , base controls , collector collects',
  work: ['1) Emitter (E): emits (injects) the charge carriers.', '2) Base (B): a very thin region that controls the flow.', '3) Collector (C): collects the carriers passing through.', '4) A small base current controls a large collector current → amplification.'],
  result: 'Emitter: emits carriers. Base: controls the flow. Collector: collects carriers — giving current amplification.',
  watch: ['الخلط بين وظائف المناطق الثلاث.', 'وصف القاعدة بأنها تطلق الناقلات (وظيفة الباعث).', 'نسيان تعريف التضخيم.', 'الخلط بين نوع الترانزستور NPN وبين بنية الترانزستور عمومًا.'],
  photo: ['اكتب الرموز E و B و C على رسم البنية.', 'اكتب وظيفة كل منطقة بجوار رمزها.', 'اكتب شرط التضخيم في سطر مستقل.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['ذكر المناطق الثلاث', 'الباعث: إطلاق الناقلات', 'القاعدة: التحكم', 'المجمع: التجميع', 'مفهوم التضخيم']
};

/* p12c7t10-p2 — الفرق بين ترانزستور NPN و PNP */
window.SOLUTION_GUIDES['p12c7t10-p2'] = {
  setup: ['NPN: N-type emitter , P-type base , N-type collector', 'PNP: P-type emitter , N-type base , P-type collector', 'N-type majority carriers = electrons ; P-type majority carriers = holes'],
  find: 'Difference between NPN and PNP transistors = ?',
  law: 'The letters give the order emitter–base–collector of the layer types',
  work: ['1) NPN → the majority carriers are electrons.', '2) PNP → the majority carriers are holes.', '3) In both the base is the layer opposite to emitter and collector.', '4) Hence the current directions are opposite in the two types.'],
  result: 'NPN carries current with electrons and PNP with holes, so the current directions in the two types are opposite.',
  watch: ['الخلط بين ترتيب حروف NPN و PNP.', 'القول إن ناقلة PNP إلكترونات.', 'نسيان أن الحرف الأوسط (B) دائمًا هو النوع المقابل للطرفين.', 'الخلط بين نوع الترانزستور ونوع المادة عمومًا.'],
  photo: ['اكتب NPN في سطر و PNP في سطر مقابل.', 'اكتب نوع الناقلة بجوار كل اسم.', 'أظهر سطر اشتقاق عكس اتجاه التيار.', 'اكتب الخلاصة في مستطيل وصوّر الورقة كاملةً.'],
  checks: ['NPN ↔ إلكترونات', 'PNP ↔ فجوات', 'مقارنة البنية في الحالتين', 'خلاصة عكس اتجاه التيار']
};

/* p12c7t10-e0 — بنية الترانزستور ثنائي القطبية وعمله */
window.SOLUTION_GUIDES['p12c7t10:e0'] = {
  setup: ['Material: silicon or germanium', 'Three regions: emitter (E) , base (B) , collector (C)', 'Two junctions: emitter-base and base-collector'],
  find: 'Structure and operation of a bipolar junction transistor = ?',
  law: 'Forward bias on E-B and reverse bias on B-C → amplification',
  work: ['1) Three regions (E , B , C) separated by two junctions.', '2) The E-B junction is forward biased → it injects carriers into the base.', '3) The B-C junction is reverse biased → it sweeps them into the collector.', '4) A small base current controls a large collector current → amplifier and switch.'],
  result: 'A transistor is a silicon/germanium device of three regions (E, B, C) separated by two junctions; it works as an amplifier and as a switch.',
  watch: ['الخلط بين الوصلتين: وصلة الباعث-القاعدة أمامية ووصلة القاعدة-المجمع عكسية.', 'القول إن الوصلتين أماميتان معًا.', 'نسيان لماذا القاعدة رقيقة.', 'إهمال ذكر وظيفتي التضخيم والتبديل.'],
  photo: ['ارسم البنية بثلاث مناطق متجاورة مفصولة بوصلة.', 'اكتب انحياز كل وصلة بجوارها.', 'اكتب مسار الناقلة من الباعث إلى المجمع.', 'اكتب الخلاصة في مستطيل وصوّر الورقة كاملةً.'],
  checks: ['ذكر المناطق الثلاث', 'ذكر الوصلتين', 'انحياز E-B أمامي و B-C عكسي', 'وظيفة التضخيم']
};

/* p12c8-p1 — طول موجة خط انتقال من n = 4 إلى n = 2 */
window.SOLUTION_GUIDES['p12c8-p1'] = {
  setup: ['n₁ = 4 (the upper level)', 'n₂ = 2 (the lower level)', 'R = 1.097 × 10⁷ m⁻¹'],
  find: 'λ (wavelength of the spectral line) = ?',
  law: '1 ÷ λ = R (1 ÷ n₂² − 1 ÷ n₁²)',
  work: ['1 ÷ λ = 1.097 × 10⁷ × (1 ÷ 2² − 1 ÷ 4²)', '1 ÷ λ = 1.097 × 10⁷ × (0.25 − 0.0625)', '1 ÷ λ = 1.097 × 10⁷ × 0.1875 = 2.06 × 10⁶ m⁻¹', 'λ = 1 ÷ (2.06 × 10⁶) = 4.86 × 10⁻⁷ m', 'λ = 486 nm'],
  result: 'λ = 486 nm',
  watch: ['الخلط بين n₁ و n₂ فيعطي خط باشين (656 nm).', 'طرح الحد الأعلى من الأدنى فيظهر طول موجة سالبًا.', 'إهمال تحويل 4.86 × 10⁻⁷ m إلى نانومتر.', 'كتابة الناتج بالسم بدل النانومتر.'],
  photo: ['اكتب n₁ و n₂ و R في سطر المعطيات.', 'أظهر سطر التعويض داخل الأقواس بوضوح.', 'اكتب سطر حساب 1 ÷ λ بالنتيجة.', 'ضع الناتج في مستطيل بوحدة nm.'],
  checks: ['قانون ريدبرغ 1/λ = R(1/n₂² − 1/n₁²)', 'التعويض عن n₁ = 4 و n₂ = 2', 'تبسيط داخل الأقواس', 'الناتج 486 nm']
};

/* p12c8t1:e0 — طول موجة خط انتقال من n = 3 إلى n = 2 */
window.SOLUTION_GUIDES['p12c8t1:e0'] = {
  setup: ['n₁ = 3 (the upper level)', 'n₂ = 2 (the lower level)', 'R = 1.097 × 10⁷ m⁻¹'],
  find: 'λ = ?',
  law: '1 ÷ λ = R (1 ÷ n₂² − 1 ÷ n₁²)',
  work: ['1 ÷ λ = 1.097 × 10⁷ × (1 ÷ 2² − 1 ÷ 3²)', '1 ÷ λ = 1.097 × 10⁷ × (0.25 − 0.111)', '1 ÷ λ = 1.097 × 10⁷ × 0.139 = 1.52 × 10⁶ m⁻¹', 'λ = 1 ÷ (1.52 × 10⁶) = 6.56 × 10⁻⁷ m', 'λ = 656 nm'],
  result: 'λ = 656 nm',
  watch: ['طرح 1 ÷ 3² من 1 ÷ 2² فيظهر الناتج سالبًا.', 'الخلط مع خط بالمر (486 nm).', 'التقريب إلى 0.11 بدل 0.111 فيتغير الناتج قليلًا.', 'نسيان تحويل المتر إلى نانومتر.'],
  photo: ['اكتب n₁ = 3 و n₂ = 2 و R في سطر المعطيات.', 'أظهر سطر تبسيط داخل الأقواس (0.25 − 0.111).', 'اكتب سطر المقلوب 1 ÷ (1.52 × 10⁶) بوضوح.', 'ضع الناتج في مستطيل بوحدة nm.'],
  checks: ['قانون ريدبرغ', 'ترتيب طرح الحدود', 'حساب 1 ÷ λ = 1.52 × 10⁶ m⁻¹', 'الناتج 656 nm']
};

/* p12c8-p2 — طول موجة خط باشين الأول */
window.SOLUTION_GUIDES['p12c8-p2'] = {
  setup: ['n₁ = 4 (upper) , n₂ = 3 (lower)', 'R = 1.097 × 10⁷ m⁻¹', 'The line ends on n = 3 → Paschen series'],
  find: 'λ = ?',
  law: '1 ÷ λ = R (1 ÷ n₂² − 1 ÷ n₁²)',
  work: ['1 ÷ λ = 1.097 × 10⁷ × (1 ÷ 3² − 1 ÷ 4²)', '1 ÷ λ = 1.097 × 10⁷ × (0.111 − 0.0625)', '1 ÷ λ = 1.097 × 10⁷ × 0.0486 = 5.33 × 10⁵ m⁻¹', 'λ = 1 ÷ (5.33 × 10⁵) = 1.875 × 10⁻⁶ m', 'λ = 1875 nm'],
  result: 'λ = 1875 nm (خط باشين الأول).',
  watch: ['الخلط مع خط بالمر (486 nm) لأن n₂ مختلفة.', 'اختيار n = 2 بوصفه المدار الأدنى في الباشين.', 'الكتابة بالميكرون دون حساب التحويل إلى نانومتر.', 'نسيان أن R بوحدة m⁻¹ فياوجب القسمة على الناتج لا الضرب.'],
  photo: ['اكتب n₁ و n₂ و R في سطر المعطيات.', 'اكتب اسم السلسلة (باشين) بجوار الانتقال.', 'أظهر سطر تبسيط 0.111 − 0.0625.', 'ضع الناتج في مستطيل بوحدة nm.'],
  checks: ['قانون ريدبرغ', 'التعويض عن n = 4 → 3', 'حساب 1 ÷ λ = 5.33 × 10⁵ m⁻¹', 'الناتج 1875 nm']
};

/* p12c8t2:e0 — طول موجة خط ليمان الأول */
window.SOLUTION_GUIDES['p12c8t2:e0'] = {
  setup: ['n₁ = 2 (upper) , n₂ = 1 (lower)', 'R = 1.097 × 10⁷ m⁻¹', 'The line ends on n = 1 → Lyman series'],
  find: 'λ = ?',
  law: '1 ÷ λ = R (1 ÷ n₂² − 1 ÷ n₁²)',
  work: ['1 ÷ λ = 1.097 × 10⁷ × (1 ÷ 1² − 1 ÷ 2²)', '1 ÷ λ = 1.097 × 10⁷ × (1 − 0.25) = 1.097 × 10⁷ × 0.75', '1 ÷ λ = 8.23 × 10⁶ m⁻¹', 'λ = 1 ÷ (8.23 × 10⁶) = 1.215 × 10⁻⁷ m', 'λ = 121.5 nm'],
  result: 'λ = 121.5 nm (خط ليمان الأول).',
  watch: ['الخلط بينه وبين خط باشين (1875 nm).', 'إهمال أن 1 ÷ 1² = 1 فيصبح الناتج أصغر.', 'الكتابة 1.2 × 10⁻⁷ m فقط دون نانومتر.', 'نسيان اسم السلسلة (ليمان) بجوار النتيجة.'],
  photo: ['اكتب n₁ و n₂ و R في سطر المعطيات.', 'أظهر سطر (1 − 0.25) = 0.75 بوضوح.', 'اكتب سطر المقلوب 1 ÷ 8.23 × 10⁶.', 'ضع الناتج في مستطيل بوحدة nm.'],
  checks: ['قانون ريدبرغ', 'التعويض عن n = 2 → 1', 'حساب 1 ÷ λ = 8.23 × 10⁶ m⁻¹', 'الناتج 121.5 nm']
};

/* p12c8-p3 — طاقة المدار الثاني في ذرة الهيدروجين */
window.SOLUTION_GUIDES['p12c8-p3'] = {
  setup: ['E_n = −13.6 ÷ n² eV (energy levels of hydrogen)', 'n = 2'],
  find: 'E₂ = ?',
  law: 'E_n = −13.6 ÷ n² (eV)',
  work: ['E₂ = −13.6 ÷ 2²', 'E₂ = −13.6 ÷ 4', 'E₂ = −3.4 eV'],
  result: 'E₂ = −3.4 eV',
  watch: ['نسيان إشارة السالب في طاقات الهيدروجين.', 'الخلط بين n = 2 و n² = 2.', 'كتابة الناتج موجبًا (3.4 eV).', 'الاعتقاد أن 13.6 eV هي طاقة المدار الثاني.'],
  photo: ['اكتب قانون E_n في سطر مستقل.', 'اكتب n = 2 ثم التعويض في سطر تالٍ.', 'أظهر سطر التبسيط −13.6 ÷ 4.', 'ضع الناتج في مستطيل بوحدة eV.'],
  checks: ['قانون E_n = −13.6/n²', 'التعويض عن n = 2', 'مراعاة الإشارة السالبة', 'الناتج −3.4 eV']
};

/* p12c8t3:e0 — طاقة المدار الأول في ذرة الهيدروجين */
window.SOLUTION_GUIDES['p12c8t3:e0'] = {
  setup: ['E_n = −13.6 ÷ n² eV', 'n = 1', 'E₁ is taken as the zero of the energy scale'],
  find: 'E₁ = ?',
  law: 'E_n = −13.6 ÷ n² (eV)',
  work: ['E₁ = −13.6 ÷ 1²', 'E₁ = −13.6 ÷ 1', 'E₁ = −13.6 eV'],
  result: 'E₁ = −13.6 eV',
  watch: ['كتابة الناتج موجبًا 13.6 eV.', 'الخلط بين طاقة المدار الأول وطاقة التأين.', 'الاعتقاد أن المدار الأول طاقته صفر.', 'نسيان الوحدة eV في الناتج.'],
  photo: ['اكتب القانون E_n = −13.6 ÷ n² في سطر.', 'اكتب n = 1 ثم التعويض في سطر.', 'أظهر سطر التبسيط −13.6 ÷ 1.', 'ضع الناتج في مستطيل بوحدة eV.'],
  checks: ['قانون E_n = −13.6/n²', 'التعويض عن n = 1', 'مراعاة الإشارة السالبة', 'الناتج −13.6 eV']
};

/* p12c8-p4 — طاقة الفوتون المنبعث من انتقال n = 4 إلى n = 2 */
window.SOLUTION_GUIDES['p12c8-p4'] = {
  setup: ['n₁ = 4 , n₂ = 2', 'E₄ = −13.6 ÷ 4² = −0.85 eV', 'E₂ = −13.6 ÷ 2² = −3.4 eV'],
  find: 'E (energy of the emitted photon) = ?',
  law: 'E = E_n₁ − E_n₂',
  work: ['E₄ = −13.6 ÷ 16 = −0.85 eV', 'E₂ = −13.6 ÷ 4 = −3.4 eV', 'E = E₄ − E₂ = (−0.85) − (−3.4)', 'E = −0.85 + 3.4 = 2.55 eV'],
  result: 'E = 2.55 eV',
  watch: ['الطرح بترتيب معكوس فيظهر الناتج سالبًا.', 'نسيان قوسَي العدد السالب أثناء الطرح.', 'الخلط بين طاقة الفوتون وطاقة المدار.', 'كتابة الناتج بوحدة الجول دون التحويل.'],
  photo: ['اكتب طاقتي المدارين في سطرين مع قيمتيهما.', 'أظهر سطر الطرح بالقوس بوضوح.', 'اكتب سطر تحويل السالب إلى جمع.', 'ضع الناتج في مستطيل بوحدة eV.'],
  checks: ['حساب E₄ = −0.85 eV', 'حساب E₂ = −3.4 eV', 'قانون E = E₄ − E₂', 'الناتج 2.55 eV']
};

/* p12c8t4:e0 — طاقة الفوتون المنبعث من انتقال n = 3 إلى n = 2 */
window.SOLUTION_GUIDES['p12c8t4:e0'] = {
  setup: ['n₁ = 3 , n₂ = 2', 'E₃ = −13.6 ÷ 9 = −1.5 eV', 'E₂ = −13.6 ÷ 4 = −3.4 eV'],
  find: 'E = ?',
  law: 'E = E_n₁ − E_n₂',
  work: ['E₃ = −13.6 ÷ 3² = −13.6 ÷ 9 = −1.5 eV', 'E₂ = −13.6 ÷ 2² = −3.4 eV', 'E = E₃ − E₂ = (−1.5) − (−3.4)', 'E = 1.9 eV'],
  result: 'E = 1.9 eV',
  watch: ['الطرح بطرح E₃ من E₂ خطأً فيظهر سالبًا.', 'الخلط مع انتقال 4 → 2 (2.55 eV).', 'نسيان أن 3² = 9 لا 6.', 'إهمال إشارة السالب في كلا المدارين.'],
  photo: ['اكتب E₃ و E₂ في سطرين مع قيمة كل منهما.', 'أظهر سطر الطرح ( −1.5 ) − ( −3.4 ).', 'اكتب سطر المجموع 1.9 eV.', 'ضع الناتج في مستطيل وصوّر الورقة كاملةً.'],
  checks: ['حساب E₃ = −1.5 eV', 'حساب E₂ = −3.4 eV', 'قانون الفرق بين المدارين', 'الناتج 1.9 eV']
};

/* p12c8-p5 — تردد الفوتون المنبعث من انتقال n = 4 إلى n = 2 */
window.SOLUTION_GUIDES['p12c8-p5'] = {
  setup: ['E = 2.55 eV (energy of the photon from 4 → 2)', '1 eV = 1.6 × 10⁻¹⁹ J', 'h = 6.626 × 10⁻³⁴ J·s'],
  find: 'ν (frequency of the photon) = ?',
  law: 'E = h ν ⟹ ν = E ÷ h',
  work: ['ν = E ÷ h', 'E = 2.55 × 1.6 × 10⁻¹⁹ J = 4.08 × 10⁻¹⁹ J', 'ν = (4.08 × 10⁻¹⁹) ÷ (6.626 × 10⁻³⁴)', 'ν = 0.616 × 10¹⁵ = 6.16 × 10¹⁴ Hz'],
  result: 'ν = 6.16 × 10¹⁴ Hz',
  watch: ['تعويض 2.55 eV في المقام مباشرة دون تحويلها إلى جول.', 'الخلط بين ν و ω أو λ.', 'خطأ في طرح الأسس عند القسمة.', 'كتابة النتيجة بوحدة eV أو الجول بدل الهرتز.'],
  photo: ['اكتب E و h و قيمة 1 eV في سطر المعطيات.', 'أظهر سطر تحويل 2.55 eV إلى 4.08 × 10⁻¹⁹ J.', 'أظهر سطر القسمة على 6.626 × 10⁻³⁴.', 'ضع الناتج في مستطيل بوحدة Hz.'],
  checks: ['قانون E = hν', 'تحويل 2.55 eV إلى J', 'قيمة h = 6.626 × 10⁻³⁴ J·s', 'الناتج 6.16 × 10¹⁴ Hz']
};

/* p12c8t5:e0 — تردد الفوتون المنبعث من انتقال n = 3 إلى n = 2 */
window.SOLUTION_GUIDES['p12c8t5:e0'] = {
  setup: ['E = 1.9 eV (energy of the photon from 3 → 2)', '1 eV = 1.6 × 10⁻¹⁹ J', 'h = 6.626 × 10⁻³⁴ J·s'],
  find: 'ν = ?',
  law: 'E = h ν ⟹ ν = E ÷ h',
  work: ['E = 1.9 × 1.6 × 10⁻¹⁹ J = 3.04 × 10⁻¹⁹ J', 'ν = (3.04 × 10⁻¹⁹) ÷ (6.626 × 10⁻³⁴)', '3.04 ÷ 6.626 = 0.459', 'ν = 0.459 × 10¹⁵ = 4.59 × 10¹⁴ Hz'],
  result: 'ν = 4.59 × 10¹⁴ Hz',
  watch: ['استخدام 2.55 eV (انتقال 4 → 2) بدل 1.9 eV.', 'نسيان تحويل الطاقة من eV إلى J.', 'الخلط بين التردد ν وزاوية السرعة ω.', 'كتابة الناتج 0.459 × 10¹⁵ دون تبسيط الأس.'],
  photo: ['اكتب E و h في سطر المعطيات.', 'أظهر سطر تحويل 1.9 eV إلى 3.04 × 10⁻¹⁹ J.', 'أظهر سطر القسمة 3.04 ÷ 6.626.', 'ضع الناتج في مستطيل بوحدة Hz.'],
  checks: ['قانون E = hν', 'تحويل 1.9 eV إلى J', 'استعمال h = 6.626 × 10⁻³⁴ J·s', 'الناتج 4.59 × 10¹⁴ Hz']
};

/* p12c8-p6 — طول موجة خط براكيت الأول */
window.SOLUTION_GUIDES['p12c8-p6'] = {
  setup: ['n₁ = 5 , n₂ = 4', 'R = 1.097 × 10⁷ m⁻¹', 'The line ends on n = 4 → Brackett series'],
  find: 'λ = ?',
  law: '1 ÷ λ = R (1 ÷ n₂² − 1 ÷ n₁²)',
  work: ['1 ÷ λ = 1.097 × 10⁷ × (1 ÷ 4² − 1 ÷ 5²)', '1 ÷ λ = 1.097 × 10⁷ × (0.0625 − 0.04)', '1 ÷ λ = 1.097 × 10⁷ × 0.0225 = 2.47 × 10⁵ m⁻¹', 'λ = 1 ÷ (2.47 × 10⁵) = 4.05 × 10⁻⁶ m', 'λ = 4050 nm'],
  result: 'λ = 4050 nm (خط براكيت الأول).',
  watch: ['الخلط بينه وبين خط باشين الأول (1875 nm).', 'اختيار n = 5 → 6 بدل 5 → 4.', 'الكتابة 4.05 × 10⁻⁶ m دون تحويل إلى نانومتر.', 'تقريب الناتج إلى 4.05 nm.'],
  photo: ['اكتب n₁ = 5 و n₂ = 4 و R في سطر المعطيات.', 'اكتب اسم السلسلة (براكيت) بجوار الانتقال.', 'أظهر سطر تبسيط 0.0625 − 0.04.', 'ضع الناتج في مستطيل بوحدة nm.'],
  checks: ['قانون ريدبرغ', 'التعويض عن n = 5 → 4', 'حساب 1 ÷ λ = 2.47 × 10⁵ m⁻¹', 'الناتج 4050 nm']
};

/* p12c8t6:e0 — طول موجة خط بالمر الثاني */
window.SOLUTION_GUIDES['p12c8t6:e0'] = {
  setup: ['n₁ = 4 , n₂ = 2', 'R = 1.097 × 10⁷ m⁻¹', 'The line ends on n = 2 → Balmer series'],
  find: 'λ = ?',
  law: '1 ÷ λ = R (1 ÷ n₂² − 1 ÷ n₁²)',
  work: ['1 ÷ λ = 1.097 × 10⁷ × (1 ÷ 2² − 1 ÷ 4²)', '1 ÷ λ = 1.097 × 10⁷ × (0.25 − 0.0625)', '1 ÷ λ = 1.097 × 10⁷ × 0.1875 = 2.06 × 10⁶ m⁻¹', 'λ = 1 ÷ (2.06 × 10⁶) = 4.86 × 10⁻⁷ m', 'λ = 486 nm'],
  result: 'λ = 486 nm (خط بالمر الثاني).',
  watch: ['الخلط مع خط باشين الأول (1875 nm).', 'استخدام 1 ÷ 3² بدل 1 ÷ 2² داخل الأقواس.', 'نسيان أن خط بالمر الثاني هو 4 → 2 أيضًا.', 'إهمال تحويل المتر إلى نانومتر.'],
  photo: ['اكتب n₁ و n₂ و R في سطر المعطيات.', 'اكتب اسم السلسلة (بالمر) بجوار الانتقال.', 'أظهر سطر تبسيط 0.25 − 0.0625 = 0.1875.', 'ضع الناتج في مستطيل بوحدة nm.'],
  checks: ['قانون ريدبرغ', 'التعويض عن n = 4 → 2', 'حساب 1 ÷ λ = 2.06 × 10⁶ m⁻¹', 'الناتج 486 nm']
};

/* p12c8-p7 — تردد الأشعة السينية لذرة عددها الذري 47 */
window.SOLUTION_GUIDES['p12c8-p7'] = {
  setup: ['Z = 47 (atomic number)', 'a = 5 × 10⁷ Hz^(1/2)', 'b = 1 (screening constant)'],
  find: 'ν = ?',
  law: '√ν = a (Z − b)',
  work: ['√ν = 5 × 10⁷ × (47 − 1)', '√ν = 5 × 10⁷ × 46 = 2.3 × 10⁹', 'ν = (2.3 × 10⁹)² = 5.29 × 10¹⁸', 'ν = 5.29 × 10¹⁸ Hz'],
  result: 'ν = 5.29 × 10¹⁸ Hz',
  watch: ['نسيان التربيع بعد حساب √ν والاكتفاء بالنتيجة 2.3 × 10⁹.', 'الخلط بين ν و √ν في الناتج.', 'نسيان طرح b = 1 من Z.', 'كتابة الناتج بوحدة Hz^(1/2).'],
  photo: ['اكتب Z و a و b في سطر المعطيات.', 'اكتب القانون √ν = a (Z − b) في سطر مستقل.', 'أظهر سطر التربيع النهائي بوضوح.', 'ضع الناتج في مستطيل بوحدة Hz.'],
  checks: ['قانون √ν = a (Z − b)', 'التعويض عن Z = 47 و b = 1', 'حساب √ν = 2.3 × 10⁹', 'تربيع الناتج', 'الناتج 5.29 × 10¹⁸ Hz']
};

/* p12c8t7:e0 — تردد الأشعة السينية لذرة عددها الذري 29 */
window.SOLUTION_GUIDES['p12c8t7:e0'] = {
  setup: ['Z = 29 (atomic number)', 'a = 5 × 10⁷ Hz^(1/2)', 'b = 1 (screening constant)'],
  find: 'ν = ?',
  law: '√ν = a (Z − b)',
  work: ['√ν = 5 × 10⁷ × (29 − 1)', '√ν = 5 × 10⁷ × 28 = 1.4 × 10⁹', 'ν = (1.4 × 10⁹)² = 1.96 × 10¹⁸', 'ν = 1.96 × 10¹⁸ Hz'],
  result: 'ν = 1.96 × 10¹⁸ Hz',
  watch: ['الاكتفاء بـ 1.4 × 10⁹ دون تربيعها.', 'استخدام a = 5 × 10⁹ بدل 10⁷.', 'نسيان طرح b = 1.', 'الخلط بين التردد وطول الموجة.'],
  photo: ['اكتب Z = 29 و a و b في سطر المعطيات.', 'اكتب القانون √ν = a (Z − b).', 'أظهر سطر التربيع (1.4 × 10⁹)².', 'ضع الناتج في مستطيل بوحدة Hz.'],
  checks: ['قانون √ν = a (Z − b)', 'التعويض عن Z = 29', 'طرح 1 ثم الضرب في 5 × 10⁷', 'الناتج 1.96 × 10¹⁸ Hz']
};

/* p12c8-p8 — مكونات الليزر ووظيفة كل منها */
window.SOLUTION_GUIDES['p12c8-p8'] = {
  setup: ['الوسط النشط: ذراته هي التي تُصدر الانبعاث', 'مصدر الضخ: يمدّ ذرات الوسط بالطاقة', 'مرآتان: واحدة عاكسة والأخرى نصف شفافة'],
  find: 'اذكر أهم مكونات الليزر ووظيفة كل منها ؟',
  law: 'قاعدة: الليزر = وسط نشط + مصدر ضخ + مرآتان (عاكسة ونصف شفافة).',
  work: ['١) الوسط النشط: ذراته هي التي تُصدر الضوء بالعودة إلى مستوى أدنى.', '٢) مصدر الضخ: يزوّد الذرات بالطاقة فيكثر عدد الذرات المستثارة.', '٣) المرآة العاكسة تعكس الفوتونات إلى الوسط من جديد فتزيد الانبعاث.', '٤) المرآة نصف الشفافة: يمرّ جزء من الشعاع فيخرج شعاع الليزر.', '٥) بتكرار الانعكاس تتضاعف الفوتونات ويصبح الضوء متماثلاً متماسكاً.'],
  result: 'الوسط النشط ينتج الانبعاث , ومصدر الضخ يثير الذرات , والمرآتان تعكسان الفوتونات وتخرجان الشعاع.',
  watch: ['الخلط بين وظيفة مصدر الضخ والوسط النشط.', 'عدم تمييز المرآة العاكسة عن المرآة نصف الشفافة.', 'نسيان دور الانعكاس في تضخيم الشعاع.', 'الاكتفاء بذكر «مرآتان» دون وظيفة لكل منهما.'],
  photo: ['اكتب المكوّنات الثلاثة مرقّمة (١ ٢ ٣).', 'اكتب وظيفة كل مكوّن في سطر مقابل له.', 'أظهر سطر تكرار الانعكاس وتضخيم الشعاع.', 'اكتب الخلاصة في مستطيل وصوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['ذكر الوسط النشط', 'ذكر مصدر الضخ', 'ذكر المرآتين (عاكسة ونصف شفافة)', 'وظيفة كل مكوّن', 'الخلاصة']
};

/* p12c8t8:e0 — مكونات الليزر */
window.SOLUTION_GUIDES['p12c8t8:e0'] = {
  setup: ['الوسط النشط: ينتج الانبعاث', 'مصدر الضخ: يثير الذرات', 'مرآتان: إحداهما عاكسة والأخرى نصف شفافة'],
  find: 'اذكر مكونات الليزر ؟',
  law: 'قاعدة: كل ليزر = وسط نشط + مصدر ضخ + مرآتان.',
  work: ['١) وسط نشط: ينتج الانبعاث المحفز.', '٢) مصدر ضخ: يثير ذرات الوسط النشط.', '٣) مرآتان: إحداهما عاكسة تماماً والأخرى نصف شفافة.', '٤) الانعكاس المتكرر يضخّم الشعاع فيخرج جزء منه.'],
  result: 'وسط نشط + مصدر ضخ + مرآتان (عاكسة ونصف شفافة).',
  watch: ['نسيان مصدر الضخ والاكتفاء بالوسط والمرايا.', 'الخلط بين المرآتين كأنهما من نوع واحد.', 'ذكر المرآة الواحدة فقط.', 'عدم ربط كل مكوّن بوظيفته.'],
  photo: ['اكتب المكوّنات الثلاثة في قائمة مرقّمة.', 'اكتب وظيفة كل مكوّن في السطر المقابل.', 'اكتب نوع المرآتين بدقة.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['ذكر الوسط النشط', 'ذكر مصدر الضخ', 'ذكر المرآتين', 'وظيفة كل مكوّن']
};

/* p12c8-p9 — الفرق بين الانبعاث التلقائي والانبعاث المحفز */
window.SOLUTION_GUIDES['p12c8-p9'] = {
  setup: ['الانتقال التلقائي: ذرة مثارة تُصدر فوتونًا دون مؤثر', 'الانتقال المحفز: فوتون واصل يحثّ ذرة مثارة', 'في الحالتين تنتقل الذرة من مستوى أعلى إلى أدنى'],
  find: 'اذكر أهم الاختلافات بين الانبعاث التلقائي والانبعاث المحفز ؟',
  law: 'قاعدة: الفوتون المُحفَّز يطابق الفوتون الواصل في التردد والطور والاتجاه.',
  work: ['١) التلقائي: ذرة مثارة تنزل تلقائيًا وتصدر فوتونًا في اتجاه ووقت عشوائيين.', '٢) المحفز: فوتون واصل يحثّ الذرة المثارة فتصدر فوتونًا جديدًا في اتجاهه.', '٣) الفوتون الجديد له تردد الفوتون الواصل نفسه ونفس الطور.', '٤) لذلك تكون فوتونات الانبعاث المحفز متماسكة متماثلة.'],
  result: 'الانبعاث التلقائي عشوائي في الاتجاه والزمن , أما المحفز فيُصدر فوتونات متماسكة متماثلة في التردد والطور والاتجاه.',
  watch: ['الخلط بين الزمن الذي تبقى فيه الذرة مثارة في الحالتين.', 'القول إن الفوتون المحفز يغيّر تردد الفوتون الساقط.', 'نسيان أن الفرق الجوهري هو تماسك الفوتونات.', 'وصف الانبعاث التلقائي بأنه متماسك ومنظم.'],
  photo: ['اكتب عنوان المقارنة ثم عمودين للتلقائي والمحفز.', 'اكتب صفة واحدة لكل نوع (عشوائي / محفز).', 'اكتب سطر التردد والطور والاتجاه بوضوح.', 'اكتب الخلاصة في مستطيل وصوّر الورقة كاملةً عموديًا.'],
  checks: ['وصف الانبعاث التلقائي بال عشوائية', 'وصف الانبعاث المحفز بالفوتون الواصل', 'ذكر تطابق التردد والطور', 'ذكر تماسك الفوتونات', 'الخلاصة']
};

/* p12c8t9:e0 — مقارنة بين الانبعاثين (مختصر) */
window.SOLUTION_GUIDES['p12c8t9:e0'] = {
  setup: ['الحالة الأولى: انتقال تلقائي لذرة مثارة', 'الحالة الثانية: انتقال محفز بفوتون واصل', 'نفس فرق الطاقة بين المدارين في الحالتين'],
  find: 'قارن بين النوعين ؟',
  law: 'قاعدة: الفوتون في الانبعاث المحفز مطابق للساقط في التردد والطور والاتجاه.',
  work: ['١) التلقائي: الإصدار عشوائي في الاتجاه والزمن.', '٢) المحفز: الإصدار مباشرة بالفوتون الواصل.', '٣) المحفز يعطي فوتونات متماثلة في التردد والطور.', '٤) إذن المحفز ينتج ضوءًا أكثر تماسكًا واتساقًا.'],
  result: 'الانبعاث التلقائي عشوائي , أما المحفز فينتج فوتونات متماسكة متماثلة التردد والطور والاتجاه.',
  watch: ['الاكتفاء بذكر نوع واحد دون المقارنة.', 'القول إن الفوتون المحفز يغيّر تردد الفوتون الساقط.', 'نسيان ذكر التماسك وهو جوهر الفرق.', 'خلط المفهوم مع نوع الليزر المستخدم.'],
  photo: ['اكتب عمودين: تلقائي / محفز.', 'اكتب فرقًا واحدًا في كل صف.', 'أظهر سطر تطابق التردد والطور والاتجاه.', 'صوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['وصف الانبعاث التلقائي', 'وصف الانبعاث المحفز', 'ذكر التماسك والتماثل', 'الخلاصة']
};

/* p12c8-p10 — شدة شعاع ليزر قدرته 2 mW ومساحة مقطعه 1 mm² */
window.SOLUTION_GUIDES['p12c8-p10'] = {
  setup: ['P = 2 mW = 2 × 10⁻³ W', 'A = 1 mm² = 1 × 10⁻⁶ m²'],
  find: 'I (intensity of the beam) = ?',
  law: 'I = P ÷ A',
  work: ['I = P ÷ A', 'I = (2 × 10⁻³) ÷ (1 × 10⁻⁶)', '10⁻³ ÷ 10⁻⁶ = 10^(−3 + 6) = 10³', 'I = 2 × 10³ W/m² = 2000 W/m²'],
  result: 'I = 2000 W/m²',
  watch: ['تعويض A = 1 بدل 1 × 10⁻⁶ m².', 'إهمال أن المسافة تربيعية فيتحول mm² إلى 10⁻³ لا 10⁻⁶.', 'الخلط بين I و P.', 'كتابة الناتج بوحدة W بدل W/m².'],
  photo: ['اكتب P و A بوحدتيهما في سطر المعطيات.', 'أظهر سطر تحويل 1 mm² إلى 10⁻⁶ m².', 'اكتب سطر طرح الأسس ( −3 ) − ( −6 ) بوضوح.', 'ضع الناتج في مستطيل بوحدة W/m².'],
  checks: ['قانون الشدة I = P/A', 'تحويل 2 mW إلى 10⁻³ W', 'تحويل 1 mm² إلى 10⁻⁶ m²', 'طرح الأسس', 'الناتج 2000 W/m²']
};

/* p12c8t10:e0 — شدة شعاع ليزر قدرته 1 mW ومساحة مقطعه 1 mm² */
window.SOLUTION_GUIDES['p12c8t10:e0'] = {
  setup: ['P = 1 mW = 1 × 10⁻³ W', 'A = 1 mm² = 1 × 10⁻⁶ m²'],
  find: 'I = ?',
  law: 'I = P ÷ A',
  work: ['I = P ÷ A', 'I = (1 × 10⁻³) ÷ (1 × 10⁻⁶)', '10⁻³ ÷ 10⁻⁶ = 10^(−3 + 6) = 10¹', 'I = 1 × 10³ = 1000 W/m²'],
  result: 'I = 1000 W/m²',
  watch: ['كتابة الناتج 10 W/m² بخطأ في طرح الأسس.', 'إهمال تحويل المساحة من mm² إلى m².', 'الخلط بين شدة الشعاع وقدرته.', 'نسيان الوحدة في الناتج.'],
  photo: ['اكتب P و A بوحدتيهما في سطر المعطيات.', 'أظهر سطر التحويلين (mW و mm²).', 'اكتب سطر طرح الأسس بوضوح.', 'ضع الناتج في مستطيل بوحدة W/m².'],
  checks: ['قانون I = P/A', 'تحويل 1 mW إلى 10⁻³ W', 'تحويل 1 mm² إلى 10⁻⁶ m²', 'الناتج 1000 W/m²']
};

/* p12c8-p11 — تطبيقات الليزر في الصناعة */
window.SOLUTION_GUIDES['p12c8-p11'] = {
  setup: ['شعاع الليزر: مركّز وعالي الطاقة', 'التطبيقات المطلوبة هي الصناعية فقط'],
  find: 'اذكر أهم تطبيقات الليزر في الصناعة ؟',
  law: 'قاعدة: تركيز طاقة الليزر في بقعة صغيرة يُستعمل في القطع واللحام والنقش.',
  work: ['١) القطع: شعاع مركّز يقطع الصفائح المعدنية.', '٢) اللحام: ينصهر طرفا المعدن فيتّصلان بقوة.', '٣) النقش: يحفر علامات دقيقة على سطح المعدن.', '٤) دقّة البقعة الضوئية تجعله أداة صناعية دقيقة.'],
  result: 'القطع واللحام والنقش.',
  watch: ['ذكر تطبيقات طبية أو منزلية بدل الصناعية.', 'الاكتفاء بالقطع دون بقية التطبيقات المطلوبة.', 'الخلط بين الليزر الجراحي وليزر الصناعة.', 'عدم ذكر أن الشعاع مركّز وعالي الطاقة.'],
  photo: ['اكتب عنوان «تطبيقات الليزر في الصناعة».', 'اكتب كل تطبيق في سطر مستقل (قطع / لحام / نقش).', 'أضف بجوار كل تطبيق وظيفته في سطر واحد.', 'اكتب الخلاصة في مستطيل وصوّر الورقة كاملةً عموديًا بإضاءة جيدة.'],
  checks: ['ذكر القطع', 'ذكر اللحام', 'ذكر النقش', 'ربط كل تطبيق بالغرض الصناعي']
};