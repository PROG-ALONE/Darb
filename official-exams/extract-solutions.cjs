#!/usr/bin/env node
/**
 * سكربت استخراج بنك الامتحانات الوزارية من ملفات OCR
 * يقرأ كل الملفات في official-exams/solutions/ و official-exams/ocr/solutions/
 * ينتج JSON منظم: مادة ← سنة ← دور ← نص كامل (أسئلة + حلول)
 */
const fs = require('fs');
const path = require('path');

const ROOTS = [
  path.resolve(__dirname, 'solutions'),
  path.resolve(__dirname, 'ocr', 'solutions')
];
const OUT = path.join(__dirname, 'bank-extracted.json');

function norm(s) {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .replace(/ \n/g, '\n')
    .replace(/\n /g, '\n')
    .trim();
}

function subjectFromPath(p) {
  const parts = p.split(path.sep);
  const map = { 'فيزياء': 'الفيزياء', 'كيمياء': 'الكيمياء', 'رياضيات': 'الرياضيات', 'أحياء': 'الأحياء', 'عربي': 'اللغة العربية', 'فرنسي': 'الفرنسية' };
  for (const part of parts) {
    for (const [k, v] of Object.entries(map)) {
      if (part.includes(k)) return v;
    }
  }
  return 'غير محدد';
}

function yearFromPath(p) {
  const m = p.match(/(20\d{2})/);
  return m ? parseInt(m[1]) : null;
}

function roleFromPath(p) {
  if (p.includes('تمهيدي')) return 'تمهيدي';
  if (p.includes('الدور-الأول') || p.includes('الدور الأول') || p.includes('الدور_الاول')) return 'الدور الأول';
  if (p.includes('الدور-الثاني') || p.includes('الدور الثاني') || p.includes('الدور_الثاني')) return 'الدور الثاني';
  if (p.includes('الدور-الثالث') || p.includes('الدور الثالث') || p.includes('الدور_الثالث')) return 'الدور الثالث';
  if (p.includes('التكميلي')) return 'التكميلي';
  return 'غير محدد';
}

function cleanHeader(s) {
  let t = norm(s);
  // إزالة رؤوس الصفحات والأسماء
  t = t.replace(/Bot:.*?(?=\n)/g, '');
  t = t.replace(/Telegram:.*?(?=\n)/g, '');
  t = t.replace(/Website:.*?(?=\n)/g, '');
  t = t.replace(/iraqedu\.net/g, '');
  t = t.replace(/EDIRQBot/g, '');
  t = t.replace(/SadsHelp/g, '');
  t = t.replace(/اللجنة الدائمة للامتحانات العامة/g, '');
  t = t.replace(/جمهورية العراق.*?(?=\n)/g, '');
  t = t.replace(/وزارة التربي[ةه]/g, '');
  t = t.replace(/الدراسة\s*:\s*\S+/g, '');
  t = t.replace(/المادة\s*:\s*\S+/g, '');
  t = t.replace(/الوقت\s*:\s*\S+/g, '');
  t = t.replace(/الرقم الامتحاني\s*:/g, '');
  t = t.replace(/الرقم الامتحالي\s*:/g, '');
  t = t.replace(/اسم الطالب\s*:/g, '');
  t = t.replace(/[=-]{3,}/g, '');
  t = t.replace(/[*#]{3,}/g, '');
  return t.trim();
}

function main() {
  const files = [];
  function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith('.txt')) files.push(full);
    }
  }
  ROOTS.forEach(walk);

  // إزالة التكرار
  const seen = new Set();
  const uniqueFiles = files.filter(f => {
    const key = path.basename(f) + '|' + path.basename(path.dirname(f));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log('📁 عدد الملفات الفريدة:', uniqueFiles.length);

  const bySubject = {};
  const byYear = {};
  const byRole = {};
  const result = [];

  for (const f of uniqueFiles) {
    const rel = path.relative(path.resolve(__dirname), f);
    const subject = subjectFromPath(rel);
    const year = yearFromPath(rel);
    const role = roleFromPath(rel);

    let raw;
    try { raw = fs.readFileSync(f, 'utf-8'); } catch (e) { continue; }

    const cleaned = cleanHeader(raw);

    if (!bySubject[subject]) bySubject[subject] = { files: 0, chars: 0, years: new Set() };
    bySubject[subject].files++;
    bySubject[subject].chars += cleaned.length;
    if (year) bySubject[subject].years.add(year);

    const yk = year || 0;
    if (!byYear[yk]) byYear[yk] = { files: 0, chars: 0 };
    byYear[yk].files++;
    byYear[yk].chars += cleaned.length;

    if (!byRole[role]) byRole[role] = { files: 0, chars: 0 };
    byRole[role].files++;
    byRole[role].chars += cleaned.length;

    result.push({
      file: path.basename(f),
      rel: rel,
      subject,
      year,
      role,
      text: cleaned
    });
  }

  console.log('\n📊 الإحصائيات:');
  for (const [s, v] of Object.entries(bySubject)) {
    console.log('  ' + s + ': ' + v.files + ' ملف، ' + Math.round(v.chars / 1024) + 'KB — السنوات: ' + [...v.years].sort().join('، '));
  }
  console.log('\n📅 حسب السنة:');
  for (const [y, v] of Object.entries(byYear).sort((a, b) => a[0] - b[0])) {
    console.log('  ' + y + ': ' + v.files + ' ملف، ' + Math.round(v.chars / 1024) + 'KB');
  }
  console.log('\n📋 حسب الدور:');
  for (const [r, v] of Object.entries(byRole)) {
    console.log('  ' + r + ': ' + v.files + ' ملف، ' + Math.round(v.chars / 1024) + 'KB');
  }

  const output = {
    meta: {
      generated: new Date().toISOString(),
      totalFiles: result.length,
      totalChars: result.reduce((a, r) => a + r.text.length, 0),
      bySubject: Object.fromEntries(Object.entries(bySubject).map(([k, v]) => [k, { files: v.files, chars: v.chars, years: [...v.years].sort() }])),
      byYear: Object.fromEntries(Object.entries(byYear).map(([k, v]) => [k, v])),
      byRole: Object.fromEntries(Object.entries(byRole).map(([k, v]) => [k, v]))
    },
    exams: result
  };

  fs.writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf-8');
  console.log('\n✅ حُفظ في: ' + OUT);
  console.log('   الحجم: ' + (fs.statSync(OUT).size / 1024 / 1024).toFixed(2) + ' MB');
}

main();
