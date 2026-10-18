#!/usr/bin/env node
/**
 * دمج نتائج الاستخراج من كل المجموعات في بنك أسئلة موحد
 * الإدخال: batches-md/group-N-output.md
 * الإخراج: bank-questions.json + بنك-الوزاريات.md
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'batches-md');
const OUT_JSON = path.join(__dirname, 'bank-questions.json');
const OUT_MD = path.join(__dirname, 'بنك-الوزاريات.md');

// تنظيف النص من مشاكل OCR والتنسيق
function clean(s) {
  if (!s) return '';
  let t = String(s);
  // إزالة علامات الخطأ
  t = t.replace(/\[لم يُوجد الحل في الملف\]/g, '');
  t = t.replace(/\[لم يوجد الحل\]/g, '');
  t = t.replace(/\[الملف تالف\]/g, '');
  t = t.replace(/\[الملف غير مقروء:.*?\]/g, '');
  t = t.replace(/\[الملف فارغ.*?\]/g, '');
  t = t.replace(/\[لم تُستخرج أسئلة.*?\]/g, '');
  t = t.replace(/\[خطأ في المعالجة:.*?\]/g, '');
  // تنظيف فراغات زائدة
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

// استخراج المادة والسنة والدور من عنوان القسم
function parseSection(header) {
  // ## المادة — السنة — الدور
  const m = header.match(/##\s*(.+?)\s*—\s*(\d{4}|غير محدد)\s*—\s*(.+)/);
  if (m) return { subject: m[1].trim(), year: m[2], role: m[3].trim() };
  return null;
}

// قراءة وتحليل ملف مجموعة
function parseGroup(file) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  const questions = [];
  let current = null;
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // عنوان قسم جديد
    if (line.startsWith('## ')) {
      currentSection = parseSection(line) || { subject: 'غير محدد', year: 'غير محدد', role: 'غير محدد' };
      continue;
    }

    // عنوان سؤال
    if (line.startsWith('### ')) {
      if (current) questions.push(current);
      const qText = clean(line.replace(/^###\s*/, ''));
      current = {
        ...currentSection,
        q: qText,
        a: '',
        id: `${currentSection?.subject || ''}-${currentSection?.year || ''}-${currentSection?.role || ''}-${questions.length + 1}`
      };
      continue;
    }

    // سطر الحل
    if (line.startsWith('**الحل:**')) {
      if (current) current.a = clean(line.replace(/^\*\*الحل:\*\*\s*/, ''));
      continue;
    }

    // سطر متابعة للسؤال أو الحل
    if (current && line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
      const cleaned = clean(line);
      if (cleaned && !current.a) {
        current.q += ' ' + cleaned;
      } else if (cleaned && current.a) {
        current.a += ' ' + cleaned;
      }
    }
  }
  if (current) questions.push(current);

  return questions;
}

function main() {
  const allQuestions = [];
  const stats = { bySubject: {}, byYear: {}, total: 0, withSolution: 0, withoutSolution: 0 };

  // قراءة كل ملفات المجموعات
  for (let g = 1; g <= 5; g++) {
    const file = path.join(DIR, `group-${g}-output.md`);
    if (!fs.existsSync(file)) continue;

    const questions = parseGroup(file);
    console.log(`📦 مجموعة ${g}: ${questions.length} سؤال`);

    for (const q of questions) {
      if (!q.q || q.q.length < 5) continue; // تجاهل الأسئلة الفارغة/القصيرة جدًا

      const hasSolution = q.a && q.a.length > 10;
      allQuestions.push({
        id: `q${allQuestions.length + 1}`,
        subject: q.subject,
        year: q.year,
        role: q.role,
        q: q.q,
        a: hasSolution ? q.a : '',
        source: `official-exams/group-${g}`
      });

      // إحصائيات
      stats.bySubject[q.subject] = (stats.bySubject[q.subject] || 0) + 1;
      stats.byYear[q.year] = (stats.byYear[q.year] || 0) + 1;
      if (hasSolution) stats.withSolution++;
      else stats.withoutSolution++;
    }
  }

  stats.total = allQuestions.length;

  // حفظ JSON
  const bank = {
    meta: {
      generated: new Date().toISOString(),
      source: 'official-exams OCR via Gemini',
      totalQuestions: stats.total,
      withSolution: stats.withSolution,
      withoutSolution: stats.withoutSolution
    },
    summary: stats,
    questions: allQuestions
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(bank, null, 2), 'utf-8');

  // حفظ Markdown
  let md = '# بنك الامتحانات الوزارية — السادس الإعدادي (الفرع العلمي)\n\n';
  md += `> مستخرج آليًا من 1230 ملف OCR عبر Gemini\n`;
  md += `> الإجمالي: ${stats.total} سؤال — منها ${stats.withSolution} بحل و${stats.withoutSolution} بدون حل\n\n`;

  // تجميع حسب المادة
  const bySubject = {};
  for (const q of allQuestions) {
    if (!bySubject[q.subject]) bySubject[q.subject] = [];
    bySubject[q.subject].push(q);
  }

  for (const [subject, qs] of Object.entries(bySubject)) {
    md += `\n## ${subject} (${qs.length} سؤال)\n\n`;
    for (const q of qs) {
      md += `### ${q.q}\n\n`;
      if (q.a) md += `**الحل:** ${q.a}\n\n`;
      else md += `*(بدون حل — السنة: ${q.year}، الدور: ${q.role})*\n\n`;
      md += `---\n\n`;
    }
  }

  fs.writeFileSync(OUT_MD, md, 'utf-8');

  console.log(`\n✅ اكتمل الدمج!`);
  console.log(`📊 الإجمالي: ${stats.total} سؤال`);
  console.log(`✅ بحل: ${stats.withSolution}`);
  echo_log(`⚠️ بدون حل: ${stats.withoutSolution}`);
  console.log(`\n📂 الملفات:`);
  console.log(`  - ${OUT_JSON} (${(fs.statSync(OUT_JSON).size / 1024).toFixed(0)}KB)`);
  console.log(`  - ${OUT_MD} (${(fs.statSync(OUT_MD).size / 1024).toFixed(0)}KB)`);
  console.log(`\n📈 حسب المادة:`);
  for (const [s, n] of Object.entries(stats.bySubject).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${s}: ${n} سؤال`);
  }
}

function echo_log(msg) { console.log(msg); }

main();
