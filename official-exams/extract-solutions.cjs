#!/usr/bin/env node
/**
 * سكربت استخراج بنك الامتحانات الوزارية من ملفات OCR
 * يقرأ كل الملفات في official-exams/solutions/ و official-exams/ocr/solutions/
 * ينتج Markdown منظم: مادة ← سنة ← دور ← أسئلة وحلول
 */
const fs = require('fs');
const path = require('path');

const ROOTS = [
  path.resolve(__dirname, 'solutions'),
  path.resolve(__dirname, 'ocr', 'solutions')
];
const OUTDIR = path.join(__dirname, 'batches-md');

function subjectFromPath(p) {
  const map = { 'فيزياء': 'الفيزياء', 'كيمياء': 'الكيمياء', 'رياضيات': 'الرياضيات', 'أحياء': 'الأحياء', 'عربي': 'اللغة العربية', 'فرنسي': 'الفرنسية' };
  for (const [k, v] of Object.entries(map)) {
    if (p.includes(k)) return v;
  }
  return 'غير محدد';
}

function yearFromPath(p) {
  const m = p.match(/(20\d{2})/);
  return m ? parseInt(m[1]) : 0;
}

function roleFromPath(p) {
  if (p.includes('تمهيدي')) return 'تمهيدي';
  if (p.includes('الدور-الثالث') || p.includes('الدور_الثالث')) return 'الدور الثالث';
  if (p.includes('الدور-الثاني') || p.includes('الدور_الثاني')) return 'الدور الثاني';
  if (p.includes('الدور-الأول') || p.includes('الدور_الاول')) return 'الدور الأول';
  if (p.includes('التكميلي')) return 'التكميلي';
  return 'غير محدد';
}

function cleanHeader(s) {
  let t = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // إزالة الزخرفة والعنوان
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
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

function extractContent(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const content = [];
  let inContent = false;

  for (const line of lines) {
    // بداية المحتوى: سؤال أو تعليمات أو نص عربي
    if (/^س\s*[٠-٩\d]/.test(line) || /^\d+\s*[-–—:)]/.test(line) || /^(?:أجب|علل|عرف|ارسم|قارن|املأ|اختر|بيّن|أثبت|اشرح|احسب|جد|أوجد)/.test(line) || /^[أ-ي]\s*[-–—:)]/.test(line)) {
      inContent = true;
    }
    // نهاية المحتوى: خطوط الزخرفة أو نهاية الصفحة
    if (/^(?:انتهى|نهاية|النهاية|إلى الصفحة)/.test(line)) {
      continue;
    }
    if (inContent) {
      content.push(line);
    }
  }

  // إذا لم نجد بداية واضحة، خذ كل النص
  if (content.length === 0) {
    return lines.join('\n');
  }
  return content.join('\n');
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

  // تجميع حسب المادة/السنة/الدور
  const groups = {};
  for (const f of uniqueFiles) {
    const rel = path.relative(path.resolve(__dirname), f);
    const subject = subjectFromPath(rel);
    const year = yearFromPath(rel);
    const role = roleFromPath(rel);
    const key = `${subject}|${year}|${role}`;
    if (!groups[key]) groups[key] = { subject, year, role, files: [] };
    groups[key].files.push({ rel, full: f });
  }

  // ترتيب المجموعات: المادة ← السنة ← الدور
  const roleOrder = { 'الدور الأول': 1, 'الدور الثاني': 2, 'الدور الثالث': 3, 'تمهيدي': 4, 'التكميلي': 5, 'غير محدد': 6 };
  const sortedGroups = Object.values(groups).sort((a, b) => {
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject, 'ar');
    if (a.year !== b.year) return a.year - b.year;
    return (roleOrder[a.role] || 6) - (roleOrder[b.role] || 6);
  });

  console.log('📋 عدد المجموعات (مادة/سنة/دور):', sortedGroups.length);

  // إنشاء مجلد الإخراج
  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

  let totalChars = 0;
  let groupCount = 0;

  for (const g of sortedGroups) {
    if (g.files.length === 0) continue;

    // اسم الملف: مادة-سنة-دور.md
    const subjectSafe = g.subject.replace(/\//g, '-');
    const yearStr = g.year || 'غير محدد';
    const roleStr = g.role.replace(/\s+/g, '-');
    const filename = `${subjectSafe}-${yearStr}-${roleStr}.md`;
    const filepath = path.join(OUTDIR, filename);

    let md = `# ${g.subject} — ${yearStr} — ${g.role}\n\n`;
    md += `> عدد الصفحات: ${g.files.length}\n\n`;
    md += `---\n\n`;

    for (const { rel, full } of g.files) {
      let raw;
      try { raw = fs.readFileSync(full, 'utf-8'); } catch (e) { continue; }

      const cleaned = cleanHeader(raw);
      const content = extractContent(cleaned);

      if (content.length < 20) continue;

      // استخراج رقم الصفحة من اسم الملف
      const pageMatch = path.basename(full).match(/p-(\d+)/i);
      const pageNum = pageMatch ? pageMatch[1] : '';

      md += `## صفحة ${pageNum || path.basename(full)}\n\n`;
      md += content + '\n\n';
      md += '---\n\n';
      totalChars += content.length;
    }

    if (totalChars > 0) {
      fs.writeFileSync(filepath, md, 'utf-8');
      groupCount++;
      console.log(`  ✅ ${filename} (${g.files.length} صفحة، ${Math.round(md.length / 1024)}KB)`);
    }
  }

  // ملخص إجمالي
  const summary = {
    totalFiles: uniqueFiles.length,
    totalGroups: groupCount,
    totalChars: totalChars,
    groups: sortedGroups.map(g => ({
      subject: g.subject,
      year: g.year,
      role: g.role,
      files: g.files.length
    }))
  };
  fs.writeFileSync(path.join(OUTDIR, 'summary.json'), JSON.stringify(summary, null, 2), 'utf-8');

  console.log(`\n✅ اكتمل! ${groupCount} مجموعة، ${Math.round(totalChars / 1024)}KB إجمالي`);
  console.log(`📂 المجلد: ${OUTDIR}`);
}

main();
