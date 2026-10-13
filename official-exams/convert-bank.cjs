#!/usr/bin/env node
/**
 * محوّل بنك الأسئلة المستخرج إلى صيغة MINISTERIAL_BANK
 * يقرأ bank-questions.json ويولّد content/ministerial-extracted.js
 */
const fs = require('fs');
const path = require('path');

const BANK = JSON.parse(fs.readFileSync(path.join(__dirname, 'bank-questions.json'), 'utf-8'));
const OUT = path.join(__dirname, '..', 'content', 'ministerial-extracted.js');

// تعيين المادة إلى مفتاح النظام
const SUBJECT_KEYS = {
  'اللغة العربية': { key: '12:sci:اللغة العربية', prefix: 'p12ar' },
  'الأحياء': { key: '12:sci:الأحياء', prefix: 'p12bio' },
  'الفيزياء': { key: '12:sci:الفيزياء', prefix: 'p12phy' },
  'الكيمياء': { key: '12:sci:الكيمياء', prefix: 'p12chem' },
  'الرياضيات': { key: '12:sci:الرياضيات', prefix: 'p12math' },
  'الفرنسية': { key: '12:sci:الفرنسية', prefix: 'p12fre' }
};

// تعيين الدور إلى رقم للترتيب
const ROLE_ORDER = { 'الدور الأول': 1, 'الدور الثاني': 2, 'الدور الثالث': 3, 'تمهيدي': 4, 'التكميلي': 5, 'غير محدد': 6 };

function buildBank() {
  // تجميع حسب المادة
  const bySubject = {};
  for (const q of BANK.questions) {
    if (!bySubject[q.subject]) bySubject[q.subject] = [];
    bySubject[q.subject].push(q);
  }

  const parts = [];

  for (const [subject, questions] of Object.entries(bySubject)) {
    const meta = SUBJECT_KEYS[subject];
    if (!meta) continue;

    // ترتيب حسب السنة ثم الدور
    questions.sort((a, b) => {
      const ya = parseInt(a.year) || 0;
      const yb = parseInt(b.year) || 0;
      if (ya !== yb) return ya - yb;
      return (ROLE_ORDER[a.role] || 6) - (ROLE_ORDER[b.role] || 6);
    });

    // تحويل لصيغة النظام
    const converted = questions.map((q, i) => {
      const hasSolution = q.a && q.a.length > 10;
      return {
        tid: `${meta.prefix}ex${i + 1}`,
        q: q.q.substring(0, 500), // حد أقصى لطول السؤال
        o: [], // أسئلة مفتوحة — لا خيارات
        c: -1, // لا إجابة صحيحة من متعدد
        why: hasSolution ? q.a.substring(0, 1000) : '',
        year: parseInt(q.year) || 0,
        role: q.role,
        src: 'ministerial-ocr'
      };
    });

    // إحصائيات
    const byChapter = {};
    let withSolution = 0;
    for (const q of converted) {
      if (q.why) withSolution++;
    }
    byChapter[meta.prefix + 'ex'] = converted.length;

    parts.push({
      key: meta.key,
      totalQuestions: converted.length,
      withSolution,
      byChapter,
      questions: converted,
      _meta: { subject, extracted: true, note: 'أسئلة وزارية مستخرجة من OCR' }
    });
  }

  return parts;
}

function main() {
  const parts = buildBank();

  let js = `/* بنك الأسئلة الوزارية المستخرجة من OCR — مُولّد آليًا من bank-questions.json
   التاريخ: ${new Date().toISOString().split('T')[0]}
   الإجمالي: ${parts.reduce((s, p) => s + p.totalQuestions, 0)} سؤال
   منها بحل: ${parts.reduce((s, p) => s + (p.withSolution || 0), 0)}
   هذه أسئلة مفتوحة (ليست اختيار من متعدد) — الحل في حقل why */
window.MINISTERIAL_BANK = window.MINISTERIAL_BANK || [];
`;

  for (const part of parts) {
    const clean = {
      key: part.key,
      totalQuestions: part.totalQuestions,
      withSolution: part.withSolution,
      byChapter: part.byChapter,
      questions: part.questions.map(q => ({
        tid: q.tid,
        q: q.q,
        o: q.o,
        c: q.c,
        why: q.why,
        year: q.year,
        role: q.role,
        src: q.src
      }))
    };
    js += `window.MINISTERIAL_BANK.push(${JSON.stringify(clean, null, 2)});\n\n`;
  }

  fs.writeFileSync(OUT, js, 'utf-8');
  console.log(`✅ تم إنشاء ${OUT}`);
  console.log(`📊 ${parts.length} مواد، ${parts.reduce((s, p) => s + p.totalQuestions, 0)} سؤال`);
  for (const p of parts) {
    console.log(`  ${p.key.split(':')[2]}: ${p.totalQuestions} سؤال (${p.withSolution} بحل)`);
  }
}

main();
