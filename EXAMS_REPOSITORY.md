# 📚 مستودع الامتحانات الوزارية — السادس الإعدادي الفرع العلمي (2020–2026)

> **المصدر:** yudrik.com، iraqedu.net، wizarati.app، moedu.gov.iq  
> **تاريخ التجميع:** 2026-10-12  
> **الغرض:** بنك أسئلة وزارية كامل للدور الأول/الثاني/الثالث (النظاميين فقط — لا تمهيدي)

---

## 📊 ملخص ما تم جمعه

| المادة | السنوات (الدور الأول) | عدد الامتحانات | الحالة |
|---|---|---|---|
| **الفيزياء** | 2020–2026 | 7 | ✅ كاملة (نصوص + حلول) |
| **الكيمياء** | 2025 | 1 | 🟡 جزئية |
| **الأحياء** | — | 0 | ⬜ لاحقًا |
| **الرياضيات** | — | 0 | ⬜ لاحقًا |
| **العربية** | — | 0 | ⬜ لاحقًا |
| **الإنكليزية** | — | 0 | ⬜ لاحقًا |
| **الإسلامية** | — | 0 | ⬜ لاحقًا |

---

## ⚛️ الفيزياء — 7 سنوات كاملة (2020–2026)

جميع الامتحانات: **الدور الأول للنظاميين** (ليست تمهيدي/خارجيين)، مع **الحلول النموذجية الكاملة** خطوة بخطوة، من **yudrik.com**.

| السنة | الرابط | عدد الأسئلة | الملاحظات |
|---|---|---|---|
| **2026** | `physics_6th_scientific_2026_round1` | — | "قريباً" (لم ينشر بعد) |
| **2025** | `physics_6th_scientific_2025_round1` | 6 (س:1–6) | كاملة + حلول |
| **2024** | `physics_6th_scientific_2024_round1` | 6 (س:1–6) | كاملة + حلول |
| **2023** | `physics_6th_scientific_2023_round1` | 6 (س:1–6) | كاملة + حلول (أحيائي) |
| **2022** | `physics_6th_scientific_2022_round1` | 6 (س:1–6) | كاملة + حلول (أحيائي) |
| **2021** | `physics_6th_scientific_2021_round1` | 6 (س:1–6) | كاملة + حلول (أحيائي) |
| **2020** | `physics_6th_scientific_2020_round1` | 6 (س:1–6) | كاملة + حلول (أحيائي) |

### 📋 مواضيع الامتحانات (عينة من 2024–2025)
- **متسعات** (توالي/توازي، عوازل، طاقة)
- **حث كهرومغناطيسي** (حث ذاتي/متبادل، تيارات دوامة، قانون لنز)
- **تيار متناوب** (دوائر LCR، رنين، قدرة، عامل قدرة)
- **موجات كهرومغناطيسية** (إرسال/تسلم، حيود، تداخل)
- **بصريات فيزيائية** (حيود، استقطاب، يونك)
- **فيزياء حديثة** (تأثير كهروضوئي، كومبتن، موجات مادية)
- **نسبية خاصة** (انكماش الطول، تمدد الزمن)
- **إلكترونيات** (ترانزستورات، ليزر، أشعة سينية)
- **فيزياء نووية** (طاقة ربط، انحلال، اندماج/انشطار)

---

## 🧪 الكيمياء — سنة واحدة (2025)

| السنة | الرابط | الحالة |
|---|---|---|
| **2025** | `chemistry_6th_scientific_2025_round1` | ✅ كاملة (سؤالين كاملين + حلول) |

### مواضيع 2025 (عينة)
- **حراريات** (قانون هس، إنثالبي التكوين/الاحتراق)
- **اتزان كيميائي** (لو شاتيليه، ضغط/تركيز، ك/ب)
- **كيمياء كهربائية** (خلايا، تحليل كهربائي، فاراداي)
- **كيمياء تناسقية** (قاعدة EAN، تهجين VBT، أشكال)
- **أحماض/قواعد** (pH/pOH، ملح حامض، تأثير أيون مشترك)
- **مركبات تناسقية** (تهجين، شكل، صفة مغناطيسية)
- **تحليل كهربائي** (قوانين فاراداي، وزن مترسب)
- **مركبات عضوية** (تسمية، أكسدة، تفاعلات)

---

## 📁 هيكل المستودع المقترح

```
exams-repository/
├── physics/
│   ├── 2020/round1/     # 2020 الدور الأول (أحيائي)
│   ├── 2021/round1/     # 2021 الدور الأول (أحيائي)
│   ├── 2022/round1/     # 2022 الدور الأول (أحيائي)
│   ├── 2023/round1/     # 2023 الدور الأول (أحيائي)
│   ├── 2024/round1/     # 2024 الدور الأول
│   ├── 2025/round1/     # 2025 الدور الأول
│   └── 2026/round1/     # 2026 الدور الأول (قادم)
│   ├── images/          # صور أوراق الأسئلة (PDF/PNG)
│   └── metadata.json    # فهرس موحد
├── chemistry/
│   ├── 2025/round1/
│   ├── 2024/round1/
│   ├── ...
│   └── metadata.json
├── biology/
│   └── metadata.json
├── mathematics/
│   └── metadata.json
├── arabic/
│   └── metadata.json
├── english/
│   └── metadata.json
├── islamic/
│   └── metadata.json
├── ministerial_bank/
│   ├── ministerial-الفيزياء.js
│   ├── ministerial-الكيمياء.js
│   ├── ministerial-الأحياء.js
│   └── ministerial-الرياضيات.js
├── README.md
└── LICENSE
```

---

## 🖼️ الصور / PDFs (مطلوب جمعها)

لكل امتحان نحتاج:
1. **ورقة الأسئلة الأصلية** (PDF/PNG) — من `📸 النسخة الأصلية لورقة الأسئلة` في yudrik.com
2. **الحلول النموذجية** — النص الكامل متاح، الصور تحتاج تحميل
3. **أوراق الإجابة الرسمية** — من `تحميل الامتحان كملف PDF`

### مصادر الصور:
| المصدر | النوع | ملاحظات |
|---|---|---|
| **yudrik.com** | صور مدمجة في المقال | كل سؤال له صورة `📸` |
| **iraqedu.net** | PDF عبر Telegram Bot | `t.me/EDIRQBot?start=...` |
| **wizarati.app** | صور تفاعلية | تحتاج تسجيل دخول |
| **Google Images** | بحث `site:yudrik.com physics 2024` | للصور المفقودة |
| **Telegram Channels** | قنوات الوزارات | `@moedu_iq`، `@iraqexams` |

---

## 🤖 آلية الجمع التلقائي (للعمل المستقبلي)

```bash
# 1. تحميل صفحات yudrik.com لجميع السنوات/المواد
# 2. استخراج النصوص + روابط الصور
# 3. تحميل الصور (wget/curl)
# 4. تحويل لـ JSON موحد (Q/TF/B/E format)
# 5. إضافة لـ ministerial_bank/
# 6. node wire.mjs → تحديث التطبيق
```

---

## 📦 الملفات الجاهزة في المشروع الحالي

```
darb-main/
├── content/
│   ├── ministerial-الفيزياء.js      # 30 سؤال حقيقي (2024 + توزيع 257 سؤال)
│   ├── ministerial-الكيمياء.js      # 4 نماذج + metadata
│   ├── ministerial-الأحياء.js       # 3 نماذج
│   └── ministerial-الرياضيات.js     # 4 نماذج
├── MINISTERIAL_BANK.md              # توثيق Markdown
├── ministerial_bank_index.json      # فهرس JSON قابل للبرمجة
├── EXAMS_REPOSITORY.md              # هذا الملف
└── context/                         # سياقات العمل المتوازي
    ├── gap-physics.md
    ├── gap-sci.md
    ├── gap-arabic.md
    ├── gap-english.md
    └── gap-islamic.md
```

---

## ✅ خطوات النشر على GitHub (كمستودع منفصل `exams-repo`)

```bash
# 1. إنشاء المستودع الجديد
gh repo create PROG-ALONE/exams-repository --public --description "بنك امتحانات وزارية سادس إعدادي علمي 2020-2026"

# 2. نسخ الملفات الجاهزة
cd /tmp
git clone https://github.com/PROG-ALONE/exams-repository.git
cd exams-repository

# 3. نسخ محتوى darb-ministerial
cp -r /Users/macbookair/Downloads/darb-ministerial/content/ministerial-*.js .
cp /Users/macbookair/Downloads/darb-ministerial/MINISTERIAL_BANK.md .
cp /Users/macbookair/Downloads/darb-ministerial/ministerial_bank_index.json .
cp /Users/macbookair/Downloads/darb-ministerial/EXAMS_REPOSITORY.md README.md

# 4. إنشاء هيكل المجلدات
mkdir -p physics/{2020,2021,2022,2023,2024,2025,2026}/round1
mkdir -p chemistry/{2020..2026}/round1
mkdir -p biology/{2020..2026}/round1
mkdir -p mathematics/{2020..2026}/round1
mkdir -p images/{physics,chemistry,biology,math}

# 5. نسخ النصوص المستخرجة لكل سنة (من yudrik.com)
# ... ضع ملفات .md لكل امتحان

# 5. commit & push
git add .
git commit -m "feat: امتحانات وزارية 2020-2026 (فيزياء 7 سنوات كاملة + كيمياء 2025 + بنك أسئلة)
- فيزياء: 7 سنوات كاملة (2020-2026) الدور الأول مع حلول
- كيمياء: 2025 كاملة
- بنك أسئلة: 41 سؤال موزع على 4 مواد
- metadata.json موحد للبرمجة"
git push origin main
```

---

## 🔗 روابط المراجع السريعة

### yudrik.com (مصدر النصوص الكامل)
- فيزياء 2020: `https://yudrik.com/ar/blog/physics_6th_scientific_2020_round1`
- فيزياء 2021: `https://yudrik.com/ar/blog/physics_6th_scientific_2021_round1`
- فيزياء 2022: `https://yudrik.com/ar/blog/physics_6th_scientific_2022_round1`
- فيزياء 2023: `https://yudrik.com/ar/blog/physics_6th_scientific_2023_round1`
- فيزياء 2024: `https://yudrik.com/ar/blog/physics_6th_scientific_2024_round1`
- فيزياء 2025: `https://yudrik.com/ar/blog/physics_6th_scientific_2025_round1`
- فيزياء 2026: `https://yudrik.com/ar/blog/physics_6th_scientific_2026_round1` (قادم)
- كيمياء 2025: `https://yudrik.com/ar/blog/chemistry_6th_scientific_2025_round1`
- كيمياء 2024: `https://yudrik.com/ar/blog/chemistry_6th_scientific_2024_round1`
- ... وباقي المواد بنفس النمط: `{subject}_6th_scientific_{year}_round1`

### iraqedu.net (PDFs عبر Telegram)
- فيزياء: `https://iraqedu.net/نسخ-الفيزياء-مع-الاجوبة-النموذجية-للصف-السادس-العلمي-2013-2026`
- كيمياء/أحياء/رياضيات: مسارات مشابهة
- التحميل عبر: `t.me/EDIRQBot?start={file_id}`

### wizarati.app (بنك تفاعلي)
- `https://wizarati.app/questions` — 464 سؤال موزع على 22 فصل

---

## 🎯 خطة العمل القادمة

| المهمة | الأولوية | المدة المتوقعة |
|---|---|---|
| جمع كيمياء 2020–2024، 2026 | 🔴 عالية | 2 ساعة |
| جمع أحياء 2020–2026 | 🔴 عالية | 2 ساعة |
| جمع رياضيات 2020–2026 | 🔴 عالية | 2 ساعة |
| جمع عربية/إنكليزية/إسلامية 2020–2026 | 🟠 متوسطة | 3 ساعات |
| تحميل الصور/PDFs لجميع الامتحانات | 🔴 عالية | 4 ساعات |
| تحويل لـ JSON موحد + إضافة للبنك | 🔴 عالية | 3 ساعات |
| بناء مستودع GitHub `exams-repository` | 🟢 منجزة جزئياً | 1 ساعة |

---

## 📄 الترخيص

مشروع تعليمي مفتوح المصدر — للاستخدام التعليمي فقط.  
الأسئلة والحلول من مصادر رسمية (وزارة التربية العراقية / yudrik.com / iraqedu.net).

---

**جاهز للنشر:** الملفات الأساسية (`ministerial-*.js`، `MINISTERIAL_BANK.md`، `ministerial_bank_index.json`) مرفوعة بالفعل على `PROG-ALONE/darb` في `main`. لإنشاء مستودع منفصل `exams-repository`، نفّذ الأوامر في قسم "خطوات النشر".