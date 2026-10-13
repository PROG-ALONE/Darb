#!/usr/bin/env node
/**
 * سكربت استخراج الأسئلة والحلول من OCR عبر Gemini API
 * الاستخدام: GEMINI_API_KEY=... node extract-gemini.cjs <group-number>
 */
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-pro';

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY غير موجود في متغيرات البيئة');
  process.exit(1);
}

const groupNum = process.argv[2] || '1';
const groupFile = path.join(__dirname, 'batches-md', `group-${groupNum}.txt`);
const outputFile = path.join(__dirname, 'batches-md', `group-${groupNum}-output.md`);

if (!fs.existsSync(groupFile)) {
  console.error('❌ الملف غير موجود:', groupFile);
  process.exit(1);
}

const relPaths = fs.readFileSync(groupFile, 'utf-8').trim().split('\n').filter(Boolean);
console.log(`📁 المجموعة ${groupNum}: ${relPaths.length} ملف`);

async function callGemini(text, subject, year, role) {
  const prompt = `أنت مصحّح امتحانات عراقي للصف السادس الإعدادي العلمي.

اقرأ النص التالي من ملف OCR لامتحان وزاري، واستخرج كل سؤال مع حله النموذجي.

## التعليمات:
1. استخرج كل سؤال برقمه (س١، س٢...)
2. لكل سؤال، استخرجه نصّه كاملًا
3. لكل سؤال، استخرج الحل النموذجي التفصيلي
4. لا تُخترع معلومات — فقط ما هو موجود في النص
5. إذا لم تجد الحل، اكتب: [لم يُوجد الحل في الملف]
6. إذا كان النص تالفًا أو غير قروء، اكتب: [الملف تالف]

## النص (المادة: ${subject}، السنة: ${year}، الدور: ${role}):

${text}

## أعد النتيجة بصيغة JSON فقط:
{"questions":[{"n":"س١","q":"نص السؤال","a":"الحل التفصيلي"}]}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  // بناء الطلب بدون response_mimeType لتجنب مشكلة JSON
  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err.slice(0, 300)}`);
  }

  const j = await res.json();
  const parts = ((((j.candidates || [])[0] || {}).content || {}).parts) || [];
  let txt = parts.map(p => p.text || '').join('');
  
  // استخراج JSON من النص
  txt = txt.replace(/```json|```/g, '').trim();
  const m = txt.match(/\{[\s\S]*\}/);
  if (m) txt = m[0];
  return JSON.parse(txt);
}

async function main() {
  let output = `# المجموعة ${groupNum} — استخراج الأسئلة والحلول\n\n`;
  let totalQ = 0, totalA = 0;

  for (let i = 0; i < relPaths.length; i++) {
    const rel = relPaths[i];
    const full = path.resolve(__dirname, rel);
    
    const subjectMap = { 'فيزياء': 'الفيزياء', 'كيمياء': 'الكيمياء', 'رياضيات': 'الرياضيات', 'أحياء': 'الأحياء', 'عربي': 'اللغة العربية', 'فرنسي': 'الفرنسية' };
    let subject = 'غير محدد';
    for (const [k, v] of Object.entries(subjectMap)) {
      if (rel.includes(k)) { subject = v; break; }
    }
    const ym = rel.match(/(20\d{2})/);
    const year = ym ? ym[1] : 'غير محدد';
    let role = 'غير محدد';
    if (rel.includes('تمهيدي')) role = 'تمهيدي';
    else if (rel.includes('الدور-الأول') || rel.includes('الدور_الاول')) role = 'الدور الأول';
    else if (rel.includes('الدور-الثاني') || rel.includes('الدور_الثاني')) role = 'الدور الثاني';
    else if (rel.includes('الدور-الثالث') || rel.includes('الدور_الثالث')) role = 'الدور الثالث';

    let text;
    try { text = fs.readFileSync(full, 'utf-8'); } catch (e) {
      output += `## ${subject} — ${year} — ${role}\n\n[الملف غير مقروء: ${rel}]\n\n`;
      continue;
    }

    if (text.trim().length < 50) {
      output += `## ${subject} — ${year} — ${role}\n\n[الملف فارغ أو قصير جدًا: ${rel}]\n\n`;
      continue;
    }

    process.stdout.write(`  [${i+1}/${relPaths.length}] ${rel.slice(-50)}... `);
    
    try {
      const result = await callGemini(text, subject, year, role);
      const qs = result.questions || [];
      
      output += `## ${subject} — ${year} — ${role}\n\n`;
      if (qs.length === 0) {
        output += `[لم تُستخرج أسئلة من الملف: ${rel}]\n\n`;
      }
      for (const q of qs) {
        output += `### ${q.n || 'س؟'}: ${q.q || ''}\n\n`;
        output += `**الحل:** ${q.a || '[لم يوجد الحل]'}\n\n`;
        totalQ++;
        if (q.a && q.a !== '[لم يوجد الحل]') totalA++;
      }
      output += `---\n\n`;
      console.log(`✅ ${qs.length} سؤال`);
    } catch (e) {
      output += `## ${subject} — ${year} — ${role}\n\n[خطأ في المعالجة: ${e.message}]\n\n---\n\n`;
      console.log(`❌ ${e.message.slice(0, 100)}`);
    }

    if ((i + 1) % 5 === 0) {
      fs.writeFileSync(outputFile, output, 'utf-8');
      console.log(`  💾 حفظ مؤقت (${i+1}/${relPaths.length})`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(outputFile, output, 'utf-8');
  console.log(`\n✅ اكتمل! ${totalQ} سؤال، ${totalA} حل — حُفظ في ${outputFile}`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
