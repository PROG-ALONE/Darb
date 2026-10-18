#!/usr/bin/env node
/**
 * سكربت استخراج بنك الامتحانات الوزارية من ملفات OCR
 * يقرأ كل الملفات في official-exams/solutions/ و official-exams/ocr/solutions/
 * ينتج Markdown منظم: مادة ← سنة ← دور ← أسئلة وحلول منفصلة
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

// فصل الأسئلة عن الحلول — أنماط محسّنة
function separateQandA(text) {
  const lines = text.split('\n');
  const questions = [];
  const solutions = [];
  let currentQ = null;
  let currentA = null;
  let currentSection = null;

  // أنماط بداية سؤال
  const qPatterns = [
    /^\s*س\s*[٠-٩\d]{1,2}\s*[-–—:)]\s*/,
    /^\s*سؤال\s*[٠-٩\d]{1,2}\s*[-–—:)]\s*/,
    /^\s*[٠-٩\d]{1,2}\s*[-–—:)]\s+/,
    /^\s*[أ-ي]\s*[-–—:)]\s+/,
  ];

  // أنماط بداية حل (محسّنة)
  const aPatterns = [
    /^\s*الحل\s*[:：-]?\s*/,
    /^\s*الإجابة\s*[:：-]?\s*/,
    /^\s*الجواب\s*[:：-]?\s*/,
    /^\s*نموذج\s+(?:الحل|الإجابة)/,
    /^\s*الحلول\s+النموذجية/,
    /^\s*الاجوبة\s+النموذجية/,
    /^\s*الأجوبة\s+النموذجية/,
    /^\s*الجوب\s+النموذجي/,
    /^\s*اجوب\s+النموذجي/,
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let isQuestion = false;
    for (const p of qPatterns) {
      if (p.test(trimmed)) { isQuestion = true; break; }
    }

    let isSolution = false;
    for (const p of aPatterns) {
      if (p.test(trimmed)) { isSolution = true; break; }
    }

    if (isQuestion) {
      if (currentQ) questions.push(currentQ);
      currentQ = { text: trimmed };
      currentSection = 'q';
    } else if (isSolution) {
      if (currentA) solutions.push(currentA);
      currentA = { text: trimmed };
      currentSection = 'a';
    } else if (currentSection === 'q' && currentQ) {
      currentQ.text += '\n' + trimmed;
    } else if (currentSection === 'a' && currentA) {
      currentA.text += '\n' + trimmed;
    }
  }

  if (currentQ) questions.push(currentQ);
  if (currentA) solutions.push(currentA);

  return { questions, solutions };
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

  const seen = new Set();
  const uniqueFiles = files.filter(f => {
    const key = path.basename(f) + '|' + path.basename(path.dirname(f));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log('📁 عدد الملفات الفريدة:', uniqueFiles.length);

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

  const roleOrder = { 'الدور الأول': 1, 'الدور الثاني': 2, 'الدور الثالث': 3, 'تمهيدي': 4, 'التكميلي': 5, 'غير محدد': 6 };
  const sortedGroups = Object.values(groups).sort((a, b) => {
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject, 'ar');
    if (a.year !== b.year) return a.year - b.year;
    return (roleOrder[a.role] || 6) - (roleOrder[b.role] || 6);
  });

  console.log('📋 عدد المجموعات:', sortedGroups.length);

  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

  let grandTotalChars = 0;
  let grandTotalQuestions = 0;
  let grandTotalSolutions = 0;
  let groupCount = 0;

  for (const g of sortedGroups) {
    if (g.files.length === 0) continue;

    const subjectSafe = g.subject.replace(/\//g, '-');
    const yearStr = g.year || 'غير محدد';
    const roleStr = g.role.replace(/\s+/g, '-');
    const filename = `${subjectSafe}-${yearStr}-${roleStr}.md`;
    const filepath = path.join(OUTDIR, filename);

    let md = `# ${g.subject} — ${yearStr} — ${g.role}\n\n`;
    md += `> عدد الصفحات: ${g.files.length}\n\n`;
    md += `---\n\n`;

    let groupChars = 0;
    let groupQuestions = 0;
    let groupSolutions = 0;

    for (const { rel, full } of g.files) {
      let raw;
      try { raw = fs.readFileSync(full, 'utf-8'); } catch (e) { continue; }

      const cleaned = cleanHeader(raw);
      if (cleaned.length < 20) continue;

      const pageMatch = path.basename(full).match(/p-(\d+)/i);
      const pageNum = pageMatch ? pageMatch[1] : '';

      const { questions, solutions } = separateQandA(cleaned);

      if (questions.length === 0 && solutions.length === 0) {
        const content = cleaned.split('\n').filter(Boolean).join('\n');
        if (content.length < 20) continue;
        md += `## صفحة ${pageNum || path.basename(full)}\n\n`;
        md += content + '\n\n---\n\n';
        groupChars += content.length;
        continue;
      }

      if (questions.length > 0) {
        md += `## صفحة ${pageNum || path.basename(full)} — الأسئلة\n\n`;
        for (const q of questions) {
          md += `### ${q.text.split('\n')[0]}\n\n`;
          if (q.text.includes('\n')) {
            md += q.text.split('\n').slice(1).join('\n') + '\n\n';
          }
          groupQuestions++;
        }
      }

      if (solutions.length > 0) {
        md += `## صفحة ${pageNum || path.basename(full)} — الحلول\n\n`;
        for (const a of solutions) {
          md += `### ${a.text.split('\n')[0]}\n\n`;
          if (a.text.includes('\n')) {
            md += a.text.split('\n').slice(1).join('\n') + '\n\n';
          }
          groupSolutions++;
        }
      }

      md += '---\n\n';
      groupChars += cleaned.length;
    }

    if (groupChars > 0) {
      fs.writeFileSync(filepath, md, 'utf-8');
      groupCount++;
      grandTotalChars += groupChars;
      grandTotalQuestions += groupQuestions;
      grandTotalSolutions += groupSolutions;
      console.log(`  ✅ ${filename} (${g.files.length} صفحة، ${Math.round(md.length / 1024)}KB, ${groupQuestions} سؤال, ${groupSolutions} حل)`);
    }
  }

  const summary = {
    totalFiles: uniqueFiles.length,
    totalGroups: groupCount,
    totalChars: grandTotalChars,
    totalQuestions: grandTotalQuestions,
    totalSolutions: grandTotalSolutions,
    groups: sortedGroups.map(g => ({
      subject: g.subject,
      year: g.year,
      role: g.role,
      files: g.files.length
    }))
  };
  fs.writeFileSync(path.join(OUTDIR, 'summary.json'), JSON.stringify(summary, null, 2), 'utf-8');

  console.log(`\n✅ اكتمل! ${groupCount} مجموعة، ${grandTotalQuestions} سؤال، ${grandTotalSolutions} حل`);
  console.log(`📂 المجلد: ${OUTDIR}`);
}

main();
