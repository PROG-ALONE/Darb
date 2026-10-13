# محادثة 3 — قراءة صفحات حلول: العربي + الرياضيات + الفرنسي

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
| s-053 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-053.txt` |
| s-054 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-054.txt` |
| s-055 | 2 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-055.txt` |
| s-056 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-056.txt` |
| s-057 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-057.txt` |
| s-058 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-058.txt` |
| s-059 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-059.txt` |
| s-060 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-060.txt` |
| s-061 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-061.txt` |
| s-062 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-062.txt` |
| s-063 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-063.txt` |
| s-064 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-064.txt` |
| s-065 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-065.txt` |
| s-066 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-066.txt` |
| s-067 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-067.txt` |
| s-068 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-068.txt` |
| s-069 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-069.txt` |
| s-070 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-070.txt` |
| s-071 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-071.txt` |
| s-072 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-072.txt` |
| s-073 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-073.txt` |
| s-074 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-074.txt` |
| s-075 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-075.txt` |
| s-076 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-076.txt` |
| s-077 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-077.txt` |
| s-078 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-078.txt` |
| s-079 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-079.txt` |
| s-080 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-080.txt` |
| s-081 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-081.txt` |
| s-082 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-082.txt` |
| s-083 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-083.txt` |
| s-084 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-084.txt` |
| s-085 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-085.txt` |
| s-086 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-086.txt` |
| s-087 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-087.txt` |
| s-088 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-088.txt` |
| s-089 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-089.txt` |
| s-090 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-090.txt` |
| s-091 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-091.txt` |
| s-092 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-092.txt` |
| s-093 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-093.txt` |
| s-094 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-094.txt` |
| s-095 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-095.txt` |
| s-096 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-096.txt` |
| s-097 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-097.txt` |
| s-098 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-098.txt` |
| s-099 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-099.txt` |
| s-100 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-100.txt` |
| s-101 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-101.txt` |
| s-102 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-102.txt` |
| s-103 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-103.txt` |
| s-104 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-104.txt` |
| s-105 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-105.txt` |
| s-106 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-106.txt` |
| s-107 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-107.txt` |
| s-108 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-108.txt` |
| s-109 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-109.txt` |
| s-110 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-110.txt` |
| s-111 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-111.txt` |
| s-112 | 6 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-112.txt` |
| s-113 | 4 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/s-113.txt` |

**الإجمالي: 61 دفعة / 592 عنصرًا.**

## محادثات أخرى (لا تلمسها)
- محادثة 1: صور الأسئلة
- محادثة 2: صفحات حلول الأحياء/الفيزياء/الكيمياء
