# محادثة 2 — قراءة صفحات حلول: الأحياء + الفيزياء + الكيمياء

> انسخ محتوى هذا الملف كاملًا في **محادثة واحدة** (LongCat 2.5) ثم أرسله.

## دورك
أنت وكيل قراءة (OCR) وتستطيع رؤية الصور عبر أداة `read`. مهمتك قراءة دفعات وإنتاج JSONL.

## الإجراء (لكل دفعة، دفعة واحدة في كل رسالة)
1. اقرأ ملف القائمة المذكور (سطر = مسار صورة).
2. لكل مسار: افتحه بـ`read`، انسخ **كل** النص العربي الظاهر حرفيًا، واستخرج العناصر.
3. اكتب سطر JSON واحد لكل ملف/صفحة (JSONL، UTF-8، كل سطر صالح، أسطر النص مهرّبة بـ`\n`) بالمخطط:
   ```json
   {"src":"<المسار>","page":<رقم الصفحة>,"subject":"<المادة>","year":<السنة>,"round":"<الدور>","kind":"solution","text":"<النص الكامل حرفيًا>","answers":[{"n":1,"answer":"<الحل النموذجي>","steps":["خطوة"],"laws":["قانون"],"final":"<الناتج>"}],"notes":""}
   ```
4. اكتب الناتج إلى `/Users/macbookair/Downloads/darb-main/official-exams/extracted/out/<معرّف-الدفعة>.jsonl` بأداة `write`.
5. اطبع: `DONE <معرّف-الدفعة> lines=<عدد>`.
ثم في الرسالة التالية: "أكمل الدفعة التالية".

## دفعاتك

| المعرّف | عدد العناصر | ملف القائمة |
|---|---:|---|
| s-001 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-001.txt` |
| s-002 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-002.txt` |
| s-003 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-003.txt` |
| s-004 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-004.txt` |
| s-005 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-005.txt` |
| s-006 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-006.txt` |
| s-007 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-007.txt` |
| s-008 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-008.txt` |
| s-009 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-009.txt` |
| s-010 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-010.txt` |
| s-011 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-011.txt` |
| s-012 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-012.txt` |
| s-013 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-013.txt` |
| s-014 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-014.txt` |
| s-015 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-015.txt` |
| s-016 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-016.txt` |
| s-017 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-017.txt` |
| s-018 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-018.txt` |
| s-019 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-019.txt` |
| s-020 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-020.txt` |
| s-021 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-021.txt` |
| s-022 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-022.txt` |
| s-023 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-023.txt` |
| s-024 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-024.txt` |
| s-025 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-025.txt` |
| s-026 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-026.txt` |
| s-027 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-027.txt` |
| s-028 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-028.txt` |
| s-029 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-029.txt` |
| s-030 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-030.txt` |
| s-031 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-031.txt` |
| s-032 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-032.txt` |
| s-033 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-033.txt` |
| s-034 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-034.txt` |
| s-035 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-035.txt` |
| s-036 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-036.txt` |
| s-037 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-037.txt` |
| s-038 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-038.txt` |
| s-039 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-039.txt` |
| s-040 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-040.txt` |
| s-041 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-041.txt` |
| s-042 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-042.txt` |
| s-043 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-043.txt` |
| s-044 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-044.txt` |
| s-045 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-045.txt` |
| s-046 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-046.txt` |
| s-047 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-047.txt` |
| s-048 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-048.txt` |
| s-049 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-049.txt` |
| s-050 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-050.txt` |
| s-051 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-051.txt` |
| s-052 | 5 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-052.txt` |
| s-114 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-114.txt` |
| s-115 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-115.txt` |
| s-116 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-116.txt` |
| s-117 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-117.txt` |
| s-118 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-118.txt` |
| s-119 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-119.txt` |
| s-120 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-120.txt` |
| s-121 | 5 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-121.txt` |
| s-122 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-122.txt` |
| s-123 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-123.txt` |
| s-124 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-124.txt` |
| s-125 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-125.txt` |
| s-126 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-126.txt` |
| s-127 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-127.txt` |
| s-128 | 1 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-128.txt` |

**الإجمالي: 67 دفعة / 651 عنصرًا.**

## محادثات أخرى (لا تلمسها)
- محادثة 1: صور الأسئلة
- محادثة 3: صفحات حلول العربي/الرياضيات/الفرنسي
