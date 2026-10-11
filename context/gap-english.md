# سياق محادثة ٣ب — اللغة الإنكليزية: الوحدات ٢–٥ (جولة ملء النواقص)

> **مهمتك الوحيدة**: إنشاء ملفات وحدات الإنكليزية المفقودة `english-12-u2.js` .. `english-12-u5.js`.
> لا تلمس أي ملف آخر (لا `index.html` ولا `sw.js` ولا مادة أخرى).

## 🎯 الهدف
الكتاب **5 وحدات (Unit 1–5)**، التطبيق حاليًا **Unit 1 فقط** (`english-12-u1.js` موجودة وسليمة).
أنشئ **٤ ملفات جديدة** بالترتيب: `u2` ثم `u3` ثم `u4` ثم `u5`.

## 📚 المصادر (OCR)
```
/private/var/folders/23/s9zrw0nx06q94mk_2d6ckbgw0000gn/T/opencode/src/eng6_student.txt   (Student's Book — النصوص والتمارين)
/private/var/folders/23/s9zrw0nx06q94mk_2d6ckbgw0000gn/T/opencode/src/eng6_act.txt       (Activity Book — إجابات التمارين)
```
كل وحدة في Student's Book تشمل: Reading/Dialogue → Vocabulary → Grammar → Listening/Speaking → Writing. انقلها حرفيًا مع الصفحة. استخدم Activity Book للأجوبة المفتوحة.

## 🔧 قالب ملف وحدة جديدة (مطابق لـ `english-12-u1.js`)
```js
/* English — Grade 6 Preparatory (sci & lit) — Student's Book Unit N: <Title> (SB pp X–Y).
   Texts are from the Student's Book; answers to open tasks are prepared by the app. */
(function () {
  const { Q, TF, X, B, T, L, D, R, F, E, P, K, N, EQ, HD, LI, TH, TB } = window.H;
  const topics = [
    T({ id: 'e12uNt1', sec: 'Lesson 1', page: 'X', title: '<Title from book>', en: '<en>',
      why: 'كلمات/تراكيب هذه الدرس تتكرر في المحادثة والقطعة والإنشاء.',
      explain: [ P('نص الدرس/المحادثة...'), TB('Vocabulary', ['#','Sentence','المعنى'], [['1','..','..']]), HD('Grammar'), LI(['نموذج 1','نموذج 2']), TH('تمرين: ..', '..') ],
      examples: [], problems: [],
      quiz: [ Q('..', ['..','..','..','..'], '..'), TF('..', true, '..') ] }),
    T({ id: 'e12uNt2', sec: 'Lesson 2', page: 'X', title: '<Title>', en: '<en>',
      why: '..',
      explain: [ P('..'), TB('Vocabulary', ['#','Sentence','المعنى'], [['1','..','..']]), HD('Grammar'), LI(['..']), TH('..', '..') ],
      examples: [ E('Solved example', 'SB pX', 'Text', ['step'], 'Answer') ],
      problems: [ B('e12uNt2-p1', 'SB pX', 'N-M', 'Exercise text', 'Answer', ['step']) ],
      quiz: [ Q('..', ['..','..','..','..'], '..') ] }),
    // ... الدروس المتبقية في الوحدة (3–4 دروس عادة)
  ];
  window.H.push(['12:sci:اللغة الإنكليزية', '12:lit:اللغة الإنكليزية'], { id: 'e12uN', no: N, title: 'Unit N: <Title>', en: '<Title>', pages: 'SB X–Y', goals: [], terms: [], test: { title: 'Unit N Test', useTopicQuiz: true }, topics });
})();
```

**معرّفاتك:**
- فصل: `id: 'e12uN'` حيث N=2..5
- موضوعات: `e12uNt1`, `e12uNt2`, ...
- مسائل/تمارين: `e12uNtM-pK` (مثل `e12u3t2-p1`)

## ✅ التحقق (بعد كل ملف)
```bash
cd /Users/macbookair/Downloads/darb-main
node --check content/english-12-u2.js
# ..كرر u3..u5
```

## ⚠️ القاعدة الذهبية (٣ محادثات متوازية للغات)
1. لا تلمس `index.html`/`sw.js`/ملفات أخرى.
2. لا تشغّل `wire.mjs` — الملفات الجديدة تحتاج وصلًا لاحقًا.
3. Git **محليًا فقط**، **-commit بعد كل وحدة**، بلا push:
```bash
git add content/english-12-u2.js
git commit -m "content: إنكليزية الوحدة 2"
# ..كرر u3..u5
```

## 📢 عند الانتهاء
أبلغ: «أنجزت وحدات الإنكليزية u2–u5، حُفظت محليًا، بانتظار الدمج».