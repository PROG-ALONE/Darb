#!/usr/bin/env node
/**
 * apply-ocr-solutions.cjs — دمج حلول جديدة في بنك الأسئلة المستخرَج (OCR)
 *
 * لماذا؟ أسئلة الوزارة المستخرَجة ضوئيًّا مخزّنة في مصدر واحد هو
 * official-exams/bank-atomic.json (حقل a)، ومنه يولّد convert-bank.cjs
 * ملفات content/ministerial-extracted-<المادة>.js التي يحمّل التطبيق.
 * لذلك أي حلٍّ يُكتب في الملفات الناتجة مباشرة يُفقد عند إعادة التوليد.
 *
 * الطريقة الصحيحة: يُكتب الحلّ في ملف طبقة (overlay) باسم
 * official-exams/ocr-solutions-<something>.json على الصيغة:
 *     { "solutions": [ { "id": "aq630", "a": "نص الحلّ..." }, ... ] }
 * ثم يُشغَّل هذا السكربت فيدمجها في bank-atomic.json ويعيد التوليد والتقسيم.
 *
 * الاستخدام:
 *   node official-exams/apply-ocr-solutions.cjs            # دمج كل الطبقات
 *   node official-exams/apply-ocr-solutions.cjs --dry-run  # عرض دون كتابة
 *
 * شروط القبول: المعرّف موجود · النص ≥ ٣٠ حرفًا · لا محارف آسيوية/لاتينية
 * متغلّطة (يُنبَّه عليها ولا تُدمج).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ATOMIC = path.join(__dirname, 'bank-atomic.json');
const OVERLAY_RE = /^ocr-solutions-.*\.json$/;
const MIN_LEN = 30;
const DRY = process.argv.includes('--dry-run');

const CJK = /[぀-ヿ㐀-䶿一-鿿가-힯豈-﫿＀-￯＋]/;
const LATIN_RUN = /[a-zA-Z]{2,}\s+[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/;

const bank = JSON.parse(fs.readFileSync(ATOMIC, 'utf8'));
const byId = new Map(bank.questions.map((q) => [q.id, q]));

const files = fs.readdirSync(__dirname).filter((f) => OVERLAY_RE.test(f));
if (!files.length) {
  console.error('❌ لا يوجد أي ملف طبقة في official-exams/ocr-solutions-*.json');
  process.exit(1);
}

let applied = 0, filled = 0, overwritten = 0;
const problems = [];

for (const f of files) {
  const ov = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  const list = Array.isArray(ov) ? ov : (ov.solutions || []);
  let fileOk = 0;
  for (const s of list) {
    const tag = f + '#' + (s.id || '?');
    const a = String(s.a || '').trim();
    const q = byId.get(s.id);
    if (!q) { problems.push(tag + ': معرّف غير موجود في bank-atomic'); continue; }
    if (a.length < MIN_LEN) { problems.push(tag + ': الحلّ أقصر من ' + MIN_LEN + ' حرفًا'); continue; }
    if (CJK.test(a)) { problems.push(tag + ': يحوي محارف آسيوية/عرضية'); continue; }
    if (LATIN_RUN.test(a)) { problems.push(tag + ': يحوي عبارة لاتينية متغلّطة'); continue; }
    applied++;
    if ((q.a || '').trim()) overwritten++; else filled++;
    q.a = a.substring(0, 1200);
    fileOk++;
  }
  console.log('  ' + f + ': ' + fileOk + ' حلًّا مقبولًا');
}

if (problems.length) {
  console.log('\nتنبيهات مرفوضة (' + problems.length + '):');
  problems.slice(0, 12).forEach((p) => console.log('  ⚠ ' + p));
  if (problems.length > 12) console.log('  … و' + (problems.length - 12) + ' آخر');
}

const totalSolved = bank.questions.filter((q) => (q.a || '').trim().length > 8).length;
console.log('\nدمج: ' + applied + ' (' + filled + ' جديدة · ' + overwritten + ' مُحدَّثة)');
console.log('الإجمالي بعد الدمج: ' + totalSolved + ' / ' + bank.questions.length + ' بحلّ');

if (DRY) { console.log('\n🔎 وضع المعاينة — لم تُكتب أي ملفات'); process.exit(0); }
if (!applied) { console.log('\nلا شيء جديد للدمج — لم يتغيّر شيء'); process.exit(0); }

fs.writeFileSync(ATOMIC, JSON.stringify(bank, null, 1), 'utf8');
console.log('\n✅ حُفظ bank-atomic.json — أُعيد التوليد والتقسيم:');
try {
  execFileSync(process.execPath, [path.join(__dirname, 'convert-bank.cjs')], { stdio: 'inherit' });
  console.log('\n✅ اكتمل التوليد — تحقّق الآن من الفحوص:');
  console.log('   node official-exams/check-arabic.cjs');
  console.log('   node official-exams/check-ministerial.cjs');
} catch (e) {
  console.error('❌ فشل التوليد:', e.message);
  process.exit(1);
}
