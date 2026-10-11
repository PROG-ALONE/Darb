# تنسيق العمل المتزامن — «دَرْب»

> كل مادة لها ملف سياق خاص بها. كل محادثة (وكل وكيل) تأخذ **ملف مادة واحدة فقط** وتعمل عليه.
> الهدف: إنهاء المشروع بأقل كلفة (أقل tokens لكل محادثة) وبالتوازي.

## 📁 الملفات
- `context/physics.md` — الفيزياء (فصول ٦-٩ ناقصة)
- `context/math.md` — الرياضيات (فصول ٣، ٦ ناقصة)
- `context/biology.md` — الأحياء (فصل ٣ إعادة بناء)
- `context/chemistry.md` — الكيمياء (مكتمل — للتوسعة فقط)
- `context/app.md` — ميزات التطبيق (index.html) — **للوكيل الوحيد الذي يلمس index.html**

## ⚠️ القاعدة الذهبية للعمل المتزامن (تجنب التعارض)
1. **كل وكيل يلمس ملفات مادته فقط** — لا يفتح `index.html` ولا `sw.js` ولا ملفات مادة أخرى.
2. **لا يشغّل `wire.mjs`** أثناء العمل المتوازى (لأنه يعدّل `index.html` + `sw.js` → تعارض). 
   بدلًا من ذلك: بعد كتابة كل ملف محتوى → `node --check content/<file>.js` فقط.
3. **الـ Git عند التوازي** — المشكلة: `git push` متزامن = فشل (non-fast-forward). الحل:
   - كل وكيل: `git add content/<subject>-12-cN.js` + `git commit` **محليًا فقط** (لا push).
   - **وكيل واحد في النهاية** (أو أنت) يجمع: `node wire.mjs content/*.js` ثم `git add -A` + `git commit` + `git push`.
   - إذا أصرّ كل وكيل على الدفع: استخدم `git pull --rebase origin main` قبل `git push`، وانتظر حتى ينجح أحدهم ثم أعد المحاولة.
4. **تسلسل آمن**: اكتب المحتوى → `node --check` → commit محلي → أبلغ «انتظرت الدمج». الدفع النهائي من جلسة واحدة.

## 🎯 أوامر التحقق (لكل وكيل)
```bash
cd /Users/macbookair/Downloads/darb-main
node --check content/<ملف_المادة>.js   # يجب أن ينجح
```

## 📦 نمط المحتوى (مختصر — التفاصيل في ملف المادة)
```js
/* <المادة> — السادس العلمي — الفصل ... (الكتاب صX–Y). ... [ORPHANS & PENDING: ...] */
window.CONTENT_PARTS = window.CONTENT_PARTS || [];
(function () {
  const { Q, TF, X, B, T, L, D, R, F, E, P, K, N, EQ, HD, LI, TH, TB } = window.H;
  const topics = [ T({ id:'..', sec:'3-1', page:88, title:'..', why:'..', explain:[P('..'),K('..'),N('..'),EQ('..'),HD('..'),LI([...]),TH('..','..'),TB('..','..',[...])], defs:[D('..','..')], laws:[L(..)], reasons:[R('..','..')], blanks:[F('..','..')], examples:[E(..)], problems:[B(..), X(..)], quiz:[Q('..',[..],'..'), TF('..',true,'..')] }), ... ];
  window.H.push('12:sci:<المادة>', { id:'..', no:N, title:'الفصل ..', en:'..', pages:'X–Y', goals:[..], terms:[[عربي,English],..], test:{ title:'اختبار الفصل ..', useTopicQuiz:true }, topics });
})();
```
- أدوات `window.H`: `T(o)` موضوع، `P/K/N/EQ/HD/LI/TH/TB` داخل explain، `D` تعريف، `L` قانون، `R` تعليل، `F` املأ فراغ، `E` مثال محلول، `B` مسألة كتاب، `X` تدريب إضافي، `Q` اختيار، `TF` صح/خطأ.
- **قواعد ذهبية**: أرقام عربية-هندية في النص (لاتينية داخل المعادلات) · لكل `Q/TF` سبب `why` · لا `\n` حرفي · لا TODO · لا `</longcat_think>` · معرّفات فريدة.

## 📊 حالة الإنجاز (حدّث بعد كل فصل)
| المادة | المكتمل | الناقص |
|---|---|---|
| فيزياء | c1,c2,c2b,c2c,c3,c4,c5 | **c6,c7,c8,c9** |
| رياضيات | c1,c2,c4,c5 | **c3,c6** |
| أحياء | c1,c2,c4,c5 | **c3** (إعادة بناء) |
| كيمياء | c1–c8 (مكتمل) | — |
| عربي/إسلامي/إنكليزي | u1 | — |

---

# 🧩 جولة ٢ — ملء النواقص (٣ محادثات متوازية)

بعد مراجعة الاكتمال، تبيّن النقص التالي:
- **الفيزياء**: `c7`/`c9` بصفر مسائل، `c6` ضعيف ← محادثة1 (`gap-physics.md`)
- **الكيمياء** `c8` (6) · **الأحياء** `c1`/`c2` (8/12) ضعيفة ← محادثة2 (`gap-sci.md`)
- **اللغات والإسلامية**: كلها وحدة1 فقط من5–6 ← محادثة3 (`gap-languages.md`)

## 📁 ملفات السياق (جولة2)
- `context/gap-physics.md` — فيزياء مسائل c6/c7/c9
- `context/gap-sci.md` — كيمياء c8 + أحياء c1/c2 مسائل
- `context/gap-languages.md` — عربية u2–u6 + إنكليزية u2–u5 + إسلامية u2+ (ملفات جديدة)

## 📦 الدمج النهائي (من المحادثة الأخيرة / التطبيق فقط)
الملفات القديمة (فيزياء c6–c9، كيمياء c8، أحياء c1/c2) لها وسوم `<script>` موجودة — تعديلها لا يحتاج إعادة وصل.
الملفات **الجديدة** (وحدات اللغات والإسلامية) تحتاج `wire.mjs` لإضافة الوسوم و`sw.js`:
```bash
cd /Users/macbookair/Downloads/darb-main
# 1) تحقق صيغة كل الملفات الجديدة/المعدّلة أولًا (node --check)
# 2) اربط الملفات الجديدة فقط:
node wire.mjs content/arabic-12-u2.js content/arabic-12-u3.js content/arabic-12-u4.js content/arabic-12-u5.js content/arabic-12-u6.js content/english-12-u2.js content/english-12-u3.js content/english-12-u4.js content/english-12-u5.js content/islamic-12-u2.js
# 3) اختبار متصفح سريع (?t=Date.now() — كونسول نظيف)
# 4) الدفع النهائي:
git add -A && git commit -m "content: جولة2 ملء النواقص + ربط" && git push origin main
```

---

## 🧩 جولة ٢ — اللغات/الدين (تقسيم ٣ محادثات)

استبدال `gap-languages.md` بـ **٣ ملفات مستقلة**:

| المحادثة | ملف السياق | المهمة | الملفات الجديدة |
|---|---|---|---|
| **٣أ** | `context/gap-arabic.md` | عربية الوحدات ٢–٦ | `arabic-12-u2.js` .. `arabic-12-u6.js` |
| **٣ب** | `context/gap-english.md` | إنكليزية الوحدات ٢–٥ | `english-12-u2.js` .. `english-12-u5.js` |
| **٣ج** | `context/gap-islamic.md` | إسلامية الوحدات المتبقية | `islamic-12-u2.js` .. `islamic-12-uN.js` |

## 📦 الدمج النهائي (بعد انتهاء **المحادثات الست**: ١، ٢، ٣أ، ٣ب، ٣ج)
1. تحقق صيغة **كل الملفات** (`node --check`).
2. اربط **الملفات الجديدة فقط** (الوحدات اللغوية/الإسلامية — الفصول المعدّلة لا تحتاج وصلًا):
```bash
cd /Users/macbookair/Downloads/darb-main
node wire.mjs content/arabic-12-u2.js content/arabic-12-u3.js content/arabic-12-u4.js content/arabic-12-u5.js content/arabic-12-u6.js content/english-12-u2.js content/english-12-u3.js content/english-12-u4.js content/english-12-u5.js content/islamic-12-u2.js content/islamic-12-u3.js ...
```
3. اختبار متصفح سريع (`?t=Date.now()` — كونسول نظيف).
4. الدفع النهائي:
```bash
git add -A && git commit -m "content: جولة2 كاملة — لغات/دين + مسائل علوم" && git push origin main
```
