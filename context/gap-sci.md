# سياق محادثة ٢ — العلوم: مسائل كيمياء ٨ وأحياء ١/٢ (جولة ملء النواقص)

> **مهمتك الوحيدة**: `chemistry-12-c8.js` + `biology-12-c1.js` + `biology-12-c2.js`.
> لا تلمس أي ملف آخر (لا `index.html` ولا `sw.js` ولا مادة ولا فصل آخر).

## 🎯 الهدف (تعزيز مسائل موجودة قليلة)
- `chemistry-12-c8.js` (الكيمياء الحياتي): 6 مسائل فقط ← وسّع إلى ~20 مسألة + ~6 أمثلة محلولة
- `biology-12-c1.js` (الخلية): 8 مسائل فقط ← وسّع إلى ~18 مسألة + ~5 أمثلة محلولة
- `biology-12-c2.js` (الأنسجة): 12 مسألة ← وسّع إلى ~18 مسألة + ~5 أمثلة محلولة

وزّع المسائل على المواضيع المناسبة داخل كل فصل.

## 📚 المصادر (OCR من الكتاب)
```
/private/var/folders/23/s9zrw0nx06q94mk_2d6ckbgw0000gn/T/opencode/src/chem_ch8.txt      (كيمياء فصل 8)
/private/var/folders/23/s9zrw0nx06q94mk_2d6ckbgw0000gn/T/opencode/src/chem6_full.txt    (كيمياء كامل — احتياط)
/private/var/folders/23/s9zrw0nx06q94mk_2d6ckbgw0000gn/T/opencode/src/bio_c2.txt        (أحياء فصل 2)
/private/var/folders/23/s9zrw0nx06q94mk_2d6ckbgw0000gn/T/opencode/src/bio_ch234_ocr.txt (أحياء فصول 2–4)
/private/var/folders/23/s9zrw0nx06q94mk_2d6ckbgw0000gn/T/opencode/src/bio6_full.txt     (أحياء كامل — لفصل 1 الخلية)
```
استخرج المسائل والأمثلة المحلولة حرفيًا من الكتاب (مع رقم الصفحة).

## 🔧 كيف تعدّل ملفًا قائمًا
جد داخل `const topics = [ T({ id:'..', ... }) ]` مصفوفات `examples` و`problems` لكل موضوع، ثم:
- `examples: [ E('عنوان', 'صفحة', 'نص', [خطوات], 'جواب') ]`
- `problems: [ B('id','صX','sec','نص','جواب',[خطوات]), X(...) ]`
- أضف `Q`/`TF` بسب `why` إن كان `quiz` قليلًا.

**معرّفات فريدة**: كيمياء `k12c8-*` · أحياء `b12c1-*` / `b12c2-*` (مثل `k12c8t2-p1`). لا تُكرّر معرّفًا.

## 📐 نمط الأدوات (من `content/h.js`)
```js
B(id, ref, sec, text, ans, steps)  X(id, sec, text, ans, steps)  E(title, page, text, steps, ans)
Q(q, [choices], why)  TF(q, true, why)  K('مفتاح')  N('ملاحظة')
```
- الأرقام في النصوص **عربية-هندية**، داخل المعادلات **لاتينية**.
- لكل `Q`/`TF` سبب `why`. لا `\n` حرفي، لا TODO، لا `</longcat_think>`.

## ✅ التحقق
```bash
cd /Users/macbookair/Downloads/darb-main
node --check content/chemistry-12-c8.js
node --check content/biology-12-c1.js
node --check content/biology-12-c2.js
```

## ⚠️ القاعدة الذهبية (عمل متزامن)
1. لا تلمس `index.html`/`sw.js`/ملفات أخرى. 2. لا تشغّل `wire.mjs`. 3. Git محليًا فقط بلا push:
```bash
git add content/chemistry-12-c8.js content/biology-12-c1.js content/biology-12-c2.js
git commit -m "content: مسائل كيمياء 8 وأحياء 1/2"
```

## 📢 عند الانتهاء
أبلغ: «انتهيت من مسائل كيمياء c8 وأحياء c1/c2، حُفظ محليًا، بانتظار الدمج».
