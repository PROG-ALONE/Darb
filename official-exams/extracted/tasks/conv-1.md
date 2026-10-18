# محادثة 1 — قراءة صور الأسئلة (كل المواد)

> انسخ محتوى هذا الملف كاملًا في **محادثة واحدة** (LongCat 2.5) ثم أرسله.

## دورك
أنت وكيل قراءة (OCR) وتستطيع رؤية الصور عبر أداة `read`. مهمتك قراءة دفعات وإنتاج JSONL.

## الإجراء (لكل دفعة، دفعة واحدة في كل رسالة)
1. اقرأ ملف القائمة المذكور (سطر = مسار صورة).
2. لكل مسار: افتحه بـ`read`، انسخ **كل** النص العربي الظاهر حرفيًا، واستخرج العناصر.
3. اكتب سطر JSON واحد لكل ملف/صفحة (JSONL، UTF-8، كل سطر صالح، أسطر النص مهرّبة بـ`\n`) بالمخطط:
   ```json
   {"src":"<المسار>","subject":"<المادة>","year":<السنة>,"round":"<الدور>","kind":"question-paper","page":1,"text":"<النص الكامل حرفيًا>","questions":[{"n":1,"text":"<نص السؤال>","options":[".."],"marks":null,"topicHint":"<الفصل/الموضوع>"}],"notes":""}
   ```
4. اكتب الناتج إلى `/Users/macbookair/Downloads/darb-main/official-exams/extracted/out/<معرّف-الدفعة>.jsonl` بأداة `write`.
5. اطبع: `DONE <معرّف-الدفعة> lines=<عدد>`.
ثم في الرسالة التالية: "أكمل الدفعة التالية".

## دفعاتك

| المعرّف | عدد العناصر | ملف القائمة |
|---|---:|---|
| q-001 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-001.txt` |
| q-002 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-002.txt` |
| q-003 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-003.txt` |
| q-004 | 5 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-004.txt` |
| q-005 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-005.txt` |
| q-006 | 5 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-006.txt` |
| q-007 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-007.txt` |
| q-008 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-008.txt` |
| q-009 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-009.txt` |
| q-010 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-010.txt` |
| q-011 | 8 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-011.txt` |
| q-012 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-012.txt` |
| q-013 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-013.txt` |
| q-014 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-014.txt` |
| q-015 | 5 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-015.txt` |
| q-016 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-016.txt` |
| q-017 | 8 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-017.txt` |
| q-018 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-018.txt` |
| q-019 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-019.txt` |
| q-020 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-020.txt` |
| q-021 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-021.txt` |
| q-022 | 6 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-022.txt` |
| q-023 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-023.txt` |
| q-024 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-024.txt` |
| q-025 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-025.txt` |
| q-026 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-026.txt` |
| q-027 | 10 | `/Users/macbookair/Downloads/darb-main/official-exams/extracted/batches/q-027.txt` |

**الإجمالي: 27 دفعة / 247 عنصرًا.**

## محادثات أخرى (لا تلمسها)
- محادثة 2: صفحات حلول الأحياء/الفيزياء/الكيمياء
- محادثة 3: صفحات حلول العربي/الرياضيات/الفرنسي
