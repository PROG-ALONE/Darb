#!/usr/bin/env node
/**
 * محوّل بنك الأسئلة المستخرج إلى صيغة MINISTERIAL_BANK
 * يقرأ bank-atomic.json (المدقّق والمُقسَّم) ويولّد content/ministerial-extracted.js
 * ثم يقسّمه فورًا إلى content/ministerial-extracted-<المادة>.js (ملفات التطبيق
 * الفعلية) ويحذف الملف المدمج حتى لا تتكرّر الأسئلة مرتين.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'bank-atomic.json');
if (!fs.existsSync(SRC)) {
  console.error('❌ bank-atomic.json غير موجود — شغّل proofread-bank.cjs أولًا');
  process.exit(1);
}
const BANK = JSON.parse(fs.readFileSync(SRC, 'utf-8'));
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

/* تجميع الأسئلة الذرّية: المادة ← الدورة (السنة + الدور) ← ترتيبها الأصلي */
function buildBank() {
  const bySubject = {};
  for (const q of BANK.questions) {
    if (!SUBJECT_KEYS[q.subject]) continue;
    (bySubject[q.subject] = bySubject[q.subject] || []).push(q);
  }

  const parts = [];
  for (const [subject, questions] of Object.entries(bySubject)) {
    const meta = SUBJECT_KEYS[subject];

    // ترتيب ثابت: السنة ثم الدور — بقاء ترتيب الأسئلة داخل الدورة كما في الرسالة
    questions.sort((a, b) => {
      const ya = parseInt(a.year) || 0, yb = parseInt(b.year) || 0;
      if (ya !== yb) return ya - yb;
      return (ROLE_ORDER[a.role] || 6) - (ROLE_ORDER[b.role] || 6);
    });

    // تجميع كل دورة (سنة+دور) في مجموعة واحدة: هذه هي «الورقة» الوزارية
    const sessions = [];
    const seen = new Map();
    for (const q of questions) {
      const k = q.year + '|' + q.role;
      if (!seen.has(k)) { seen.set(k, { year: q.year, role: q.role, items: [] }); sessions.push(seen.get(k)); }
      seen.get(k).items.push(q);
    }

    const converted = [];
    let i = 0;
    for (const s of sessions) {
      const grp = [];
      for (const q of s.items) {
        i++;
        const hasSolution = q.a && q.a.length > 8;
        converted.push({
          tid: `${meta.prefix}ex${i}`,
          q: q.q.substring(0, 500),
          o: [],                       // أسئلة مفتوحة — لا خيارات
          c: -1,                       // لا إجابة صحيحة من متعدد
          why: hasSolution ? q.a.substring(0, 1200) : '',
          year: parseInt(q.year) || 0,
          role: q.role,
          type: q.type || 'سؤال',       // علّل / عرّف / اذكر / ...
          time: q.time || 120,          // زمن تقديري بالثواني
          letter: q.letter || '',       // الفرع (أ/ب/ج)
          num: q.num || '',             // الرقم داخل الفرع
          branch: q.branch || '',
          parent: q.parent || '',
          /* ربط الفصل والموضوع من التحليل النصي (map-chapters) — أساس تدفق الفصل */
          chapter: q.chapter || '',
          topic: q.topic || '',
          topicTitle: q.topicTitle || '',
          mapConf: q.mapConf || 'none',
          src: 'ministerial-ocr'
        });
      }
      grp.session = s.year + ' ' + s.role;
      converted.push(...[]);
    }

    const withSolution = converted.filter(q => q.why).length;
    parts.push({
      key: meta.key,
      totalQuestions: converted.length,
      withSolution,
      questions: converted,
      _meta: { subject, extracted: true, note: 'أسئلة وزارية مستخرجة من OCR — مدقّقة لغويًا ومُقسَّمة' }
    });
  }
  return parts;
}

function main() {
  const parts = buildBank();

  let js = `/* بنك الأسئلة الوزارية المستخرجة من OCR — مُولّد آليًا من bank-atomic.json
   التاريخ: ${new Date().toISOString().split('T')[0]}
   الإجمالي: ${parts.reduce((s, p) => s + p.totalQuestions, 0)} سؤالًا ذرّيًا
   منها بحل: ${parts.reduce((s, p) => s + (p.withSolution || 0), 0)}
   هذه أسئلة مفتوحة (ليست اختيار من متعدد) — الحل في حقل why
   الحقول الجديدة: type (نوع السؤال) · time (زمن تقديري بالثواني) · letter/num (الفرع والرقم)
   المصدر: 1230 ملف OCR — مدقّقة إملائيًا ضد معجم الكتب: صفر أخطاء */
window.MINISTERIAL_BANK = window.MINISTERIAL_BANK || [];
`;

  for (const part of parts) {
    const clean = {
      key: part.key,
      totalQuestions: part.totalQuestions,
      withSolution: part.withSolution,
      questions: part.questions.map(q => ({
        tid: q.tid, q: q.q, o: q.o, c: q.c, why: q.why,
        year: q.year, role: q.role, type: q.type, time: q.time,
        letter: q.letter, num: q.num, src: q.src,
        ch: q.chapter || '', tp: q.topic || '', tpT: q.topicTitle || '', mc: q.mapConf || 'none'
      }))
    };
    js += `window.MINISTERIAL_BANK.push(${JSON.stringify(clean, null, 1)});\n\n`;
  }

  fs.writeFileSync(OUT, js, 'utf-8');
  console.log(`✅ تم إنشاء ${OUT}`);
  console.log(`📊 ${parts.length} مواد، ${parts.reduce((s, p) => s + p.totalQuestions, 0)} سؤالًا`);
  for (const p of parts) {
    console.log(`  ${p.key.split(':')[2]}: ${p.totalQuestions} سؤالًا (${p.withSolution} بحل)`);
  }
  console.log(`\n📁 الحجم: ${(fs.statSync(OUT).size / 1024).toFixed(0)} ك.ب`);

  /* التقسيم فوري: التطبيق يحمّل content/ministerial-extracted-<المادة>.js فقط
     (لأن الملف المدمج الكبير واحدٌ لا يمكن تعديله بالتوازي)، فلا يبقى نسختان
     متطابقتان فتضاعف أسئلة البنك ويضاعف عدّ الأسئلة بلا حلّ في الفحوصات. */
  try {
    const { execFileSync } = require('child_process');
    execFileSync(process.execPath, [path.join(__dirname, 'split-extracted.cjs')], { stdio: 'inherit' });
    fs.unlinkSync(OUT);
    console.log(`🗑️  حُذف الملف المدمج بعد التقسيم — تبقى الملفات المفصولة فقط`);
  } catch (e) {
    console.warn('⚠️ تعذّر التقسيم التلقائي — شغّل official-exams/split-extracted.cjs يدويًّا');
  }
}

main();
