/* English — Grade 6 Preparatory (sci & lit) — Student's Book Unit 2: Talking about rules and advice (SB pp 28–29).
   Texts are from the Student's Book; answers to open tasks are prepared by the app. */
(function () {
  const { Q, TF, X, B, T, L, D, R, F, E, P, K, N, EQ, HD, LI, TH, TB } = window.H;
  const topics = [
    T({ id: 'e12u2t1', sec: 'Lesson 1', page: 'SB 28–29', title: 'Talking about rules using have to, must and need to', en: 'Talking about rules using have to, must and need to',
      why: 'تراكيب have to, must و need to تظهر بشكل متكرر عند الحديث عن القوانين والواجبات المنزلية في المحادثات اليومية والوصف.',
      explain: [
        P('يستخدم have to للتعبير عن الواجب الخارجي أوالقانون، بينما expresses mustinner obligation or strong feeling. need to indicates something is necessary.'),
        TB('Types of modal verbs', ['Type', 'Example', 'Meaning'], [
          ['have to', 'You need to wear a seat belt', 'External obligation / law'],
          ['must', 'You mustn’t use your phone while driving', 'Strong personal prohibition'],
          ['need to', 'You need to focus on the road', 'Necessity']
        ]),
        HD('Negative forms'),
        LI(['You mustn’t use your phone while driving.', 'You don’t have to stop at a red light if directed otherwise.']),
        TH('Exercise: Complete the sentences with have to, must or need to.')
      ],
      examples: [],
      problems: [],
      quiz: [ Q('Choose the correct form: have to, must or need to (1).', ['You ___ wear a seat belt', 'It ___ be dangerous to text while driving', 'I ___ finish my homework by 10pm'], 'اختيار الصيغة الصحيحة'), TF('You mustn’t use your phone while driving.', true, 'وهو حظر قوي من السائق نفسه')] }),
    T({ id: 'e12u2t2', sec: 'Lesson 2', page: 'SB 28–29', title: 'Giving advice, and making polite requests, suggestions and offers', en: 'Giving advice and making requests',
      why: 'تراكيب إعطاء النصائح وصياغة الطلبات باللغة الإنجليزية تظهر في المواقف اليومية مثل طلب المساعدة واقتراح الحلول.',
      explain: [
        P('Giving advice can be done using should, ought to, or had better. Making polite requests uses would you mind, could you, or would like to.'),
        TB('Advice and Requests', ['Function', 'Example', 'Notes'], [
          ['giving advice', 'You should take an umbrella', 'Use should for mild advice'],
          ['polite request', 'Would you mind opening the window?', 'More polite than "Open it!"']
        ]),
        HD('Making Suggestions'),
        LI(['I\'ll pack our bags if you want.', 'Shall we take only hand luggage?']),
        TH('Exercise: Match the advice with the situation.')
      ],
      examples: [ E('Solved example', 'SB p28', 'You should take an umbrella if rain is expected.', ['rain expected'], 'خذ مظلة إذا توقع المطر') ],
      problems: [ B('e12u2t2-p1', 'SB p28', 'N-M', 'Make polite requests: Would you mind passing the salt? / Could you help me with this?', ['Pass the salt, please.', 'Yes, certainly.']) ],
      quiz: [ Q('Choose the correct function: advice or request (1).', ['You look tired. You ___ go to bed early.', '___ you mind telling me the way to the museum?'], 'اختيار الوظيفة الصحيحة') ] }),
    T({ id: 'e12u2t3', sec: 'Lesson 3', page: 'SB 29', title: 'Talking about expectations using should and shouldn\'t', en: 'Talking about expectations',
      why: 'تراكيب should و shouldn\'t تستخدم للحديث عن التوقعات والنصائح في المحادثات والوصف اليومي.',
      explain: [
        P('should و shouldn\'t المستخدمة للتعبير عن النصيحة أو التوقع بما يجب فعله أو تجنبه.'),
        TB('Should and Shouldn\'t', ['Structure', 'Use', 'Example'], [
          ['should', 'You should see a doctor', 'Advice / recommendation'],
          ["shouldn't", 'You shouldn\'t believe everything you read online', 'Warning / prohibition']
        ]),
        HD('Expectations'),
        LI(['I\'ll be back soon; it shouldn\'t take long.', 'This should be easy for you.']),
        TH('Exercise: Write sentences with should or shouldn\'t.')
      ],
      examples: [ E('Solved example', 'SB p29', 'You shouldn\'t believe everything you see on social media.', ['social media'], 'لا تصدق كل ما تراه على وسائل التواصل الاجتماعي') ],
      problems: [ B('e12u2t3-p1', 'SB p29', 'N-M', 'Complete the sentences with should or shouldn\'t (1).', 'You ___ eat too much fast food.', 'You ___ drive fast in residential areas.') ],
      quiz: [ Q('Choose the correct form: should or shouldn\'t (1).', ['You ___ respect your parents.', 'You ___ smoke in non-smoking areas.'], 'اختيار الصيغة الصحيحة') ] }),
    T({ id: 'e12u2t4', sec: 'Lesson 4', page: 'SB 29', title: 'Using phrases to talk about recommendations', en: 'Talking about recommendations',
      why: 'جمل التوصية والترشيح تظهر في المحادثات عند suggstion أمور مثل التخطيط للسفر والنصائح الغذائية.',
      explain: [
        P('Using phrases like Make sure you, It\'s always better to, and I recommend talking about recommendations.'),
        TB('Recommendation Phrases', ['Phrase', 'Use', 'Example'], [
          ['Make sure you', 'Signal you are going to turn', 'Important for safety'],
          ['It\'s always better to', 'Do a safety check on your car', 'Preventive advice'],
          ['I recommend', 'A healthy diet and exercise', 'Well-being']
        ]),
        HD('Giving Recommendations'),
        LI(['Make sure you signal that you are going to turn.', 'It\'s always better to do a safety check.']),
        TH('Exercise: Complete the sentences with the correct phrase.')
      ],
      examples: [ E('Solved example', 'SB p29', 'I recommend eating five portions of fruit and vegetables a day.', ['fruit and vegetables'], 'أنا أنصح بأكل خمسة أجزاء من الفواكه والخضروات يومياً') ],
      problems: [ B('e12u2t4-p1', 'SB p29', 'N-M', 'Complete the sentences: 1. Make sure you ______ before turning. 2. It\'s always better to ______ your car before a long trip.', ['signal', 'check your car']) ],
      quiz: [ Q('Choose the correct recommendation phrase (1).', ['Make sure you ______ in heavy rain.', 'It\'s always better to ______ when the road is icy.', 'I recommend ______ daily.'], 'اختيار العبارة الصحيحة', ['drive carefully', 'check your car', 'eat healthy']) ] })
  ];
  window.H.push(['12:sci:اللغة الإنكليزية', '12:lit:اللغة الإنكليزية'], { id: 'e12u2', no: 2, title: 'Unit 2: Talking about rules and advice', en: 'Unit 2: Rules and Advice', pages: 'SB 28–29', goals: [], terms: [], test: { title: 'Unit 2 Test', useTopicQuiz: true }, topics });
})();