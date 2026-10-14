#!/usr/bin/env node
/**
 * check-figs.cjs — فاحص الرسوم التفاعلية (content/figs*.js)
 *
 * لماذا؟ الرسم في هذا المشروع ليس صورة زينة: هو أداة تعلّم (نقاط تشرح نفسها
 * + خطوات «كيف أرسمه؟»). لذلك يُفحص أن لكل رسم:
 *   1. عنوانًا ووصفًا «ماذا يعلّمك» لا يقلّان عن ٤٠ حرفًا.
 *   2. svg صالحًا يحوي viewBox ويبدأ بـ <svg.
 *   3. parts: نقطتين على الأقل، لكل نقطة label وnote ≥ ٤٠ حرفًا،
 *      والإحداثيات داخل حدود الـviewBox.
 *   4. steps: خطوتين على الأقل، وكل خطوة هيئة SVG تحتوي علامة نص تشرحها.
 *   5. تسجيله في FIG_SUBJ بمادة معروفة، وإحالات صحيحة من ملفات المحتوى.
 *
 * الاستعمال: node official-exams/check-figs.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');
const TOPICS = JSON.parse(fs.readFileSync(path.join(ROOT, 'official-exams', 'topics-index-full.json'), 'utf8'));

const KNOWN_SUBJ = new Set([
  'الفيزياء', 'الكيمياء', 'الأحياء', 'الرياضيات',
  'اللغة العربية', 'اللغة الإنكليزية', 'التربية الإسلامية'
]);

const errors = [];
const warns = [];

/* ── تحميل كل ملفات الرسوم ── */
const figFiles = fs.readdirSync(CONTENT).filter((f) => /^figs.*\.js$/.test(f));
global.window = {};
for (const k of Object.keys(require.cache)) delete require.cache[k];
for (const f of figFiles) {
  try { require(path.join(CONTENT, f)); }
  catch (e) { errors.push(f + ': تعذّر التحميل — ' + e.message); }
}
const FIGS = global.window.FIGS || {};
const FIG_SUBJ = global.window.FIG_SUBJ || {};

const figKeys = Object.keys(FIGS);
if (!figKeys.length) errors.push('لا يوجد أي رسم في content/figs*.js');

const vbOf = (svg) => {
  const m = String(svg || '').match(/viewBox\s*=\s*"([^"]+)"/);
  if (!m) return null;
  const p = m[1].split(/[\s,]+/).map(Number);
  return p.length === 4 && p.every((n) => isFinite(n)) ? { x: p[0], y: p[1], w: p[2], h: p[3] } : null;
};
const arabicCount = (s) => (String(s || '').match(/[\u0600-\u06FF]/g) || []).length;

for (const k of figKeys) {
  const f = FIGS[k];
  const tag = 'figs › ' + k;
  if (!f || typeof f !== 'object') { errors.push(tag + ': القيمة ليست كائنًا'); continue; }
  if (!f.title || String(f.title).trim().length < 8) errors.push(tag + ': العنوان قصير أو مفقود');
  if (!f.teaches || String(f.teaches).trim().length < 40) errors.push(tag + ': «ماذا يعلّمك» مفقود أو أقصر من 40 حرفًا');
  if (arabicCount(f.teaches) < 20) errors.push(tag + ': «ماذا يعلّمك» ليس نصًّا عربيًّا');

  const svg = String(f.svg || '');
  if (!svg.includes('<svg')) errors.push(tag + ': svg غير موجود');
  const vb = vbOf(svg);
  if (!vb) errors.push(tag + ': viewBox مفقود أو غير صالح');
  if (svg.includes('</svg>') && svg.indexOf('</svg>') < svg.lastIndexOf('<svg')) warns.push(tag + ': أكثر من عنصر svg في الرسم');

  const parts = f.parts || [];
  if (!Array.isArray(parts) || parts.length < 2) errors.push(tag + ': parts أقل من جزأين (' + (parts || []).length + ')');
  parts.forEach((p, i) => {
    const at = tag + '.parts[' + i + ']';
    if (!p.label || String(p.label).trim().length < 3) errors.push(at + ': label مفقود');
    if (!p.note || String(p.note).trim().length < 40) errors.push(at + ': note أقل من 40 حرفًا');
    if (typeof p.x !== 'number' || typeof p.y !== 'number') errors.push(at + ': x/y ليست رقمًا');
    else if (vb && (p.x < vb.x || p.x > vb.x + vb.w || p.y < vb.y || p.y > vb.y + vb.h))
      errors.push(at + ': النقطة (' + p.x + ',' + p.y + ') خارج viewBox (' + vb.x + ',' + vb.y + ',' + vb.w + ',' + vb.h + ')');
  });

  const steps = f.steps || [];
  if (!Array.isArray(steps) || steps.length < 2) errors.push(tag + ': steps أقل من خطوتين (' + (steps || []).length + ')');
  steps.forEach((s, i) => {
    const at = tag + '.steps[' + i + ']';
    const t = String(s || '');
    if (t.length < 40) errors.push(at + ': الهيئة قصيرة جدًّا');
    if (!t.includes('<text')) warns.push(at + ': لا تحوي نصًّا يشرح الخطوة');
    if (vb) {
      const vb2 = vbOf(t);
      if (vb2 && (vb2.w !== vb.w || vb2.h !== vb.h)) warns.push(at + ': viewBox مختلف عن الرسم الأساسي');
    }
  });

  if (!FIG_SUBJ[k]) errors.push(tag + ': غير مسجّل في FIG_SUBJ (لن يظهر في مكتبة الرسوم)');
  else if (!KNOWN_SUBJ.has(FIG_SUBJ[k])) errors.push(tag + ': مادة غير معروفة "' + FIG_SUBJ[k] + '"');
}

/* ── إحالات المحتوى: كل { t:'fig', k } يجب أن يشير إلى رسم موجود ── */
let refs = 0;
const refRe = /\{\s*t\s*:\s*'fig'\s*,\s*k\s*:\s*'([^']+)'/g;
for (const f of fs.readdirSync(CONTENT).filter((x) => x.endsWith('.js') && !x.startsWith('figs'))) {
  const s = fs.readFileSync(path.join(CONTENT, f), 'utf8');
  let m;
  while ((m = refRe.exec(s))) {
    refs++;
    if (!FIGS[m[1]]) errors.push(f + ': إحالة إلى رسم غير موجود "' + m[1] + '"');
  }
}

/* ── تغطية المواد: هل لكل مادة أشكالها؟ ── */
const bySubj = {};
for (const k of figKeys) { const s = FIG_SUBJ[k]; if (s) (bySubj[s] = bySubj[s] || []).push(k); }
const grade12Subj = Object.keys(TOPICS).filter((k) => k.startsWith('12:'));
for (const k of grade12Subj) {
  const name = k.split(':').slice(2).join(':');
  if (!bySubj[name]) warns.push('مادة بلا أي رسم تفاعلي: ' + name);
}

console.log('فحص الرسوم التفاعلية');
console.log('  ملفات: ' + figFiles.join(' · '));
console.log('  رسوم: ' + figKeys.length + ' · إحالات من المحتوى: ' + refs);
for (const s of Object.keys(bySubj)) console.log('  ' + s + ': ' + bySubj[s].length + ' رسمًا');
console.log('');

if (warns.length) {
  console.log('تنبيهات (' + warns.length + '):');
  warns.slice(0, 20).forEach((w) => console.log('  ⚠ ' + w));
  if (warns.length > 20) console.log('  … و' + (warns.length - 20) + ' تنبيهًا آخر');
  console.log('');
}
if (errors.length) {
  console.log('أخطاء (' + errors.length + '):');
  errors.slice(0, 60).forEach((e) => console.log('  ❌ ' + e));
  if (errors.length > 60) console.log('  … و' + (errors.length - 60) + ' خطأ آخر');
  console.log('\n❌ فشل الفحص');
  process.exit(1);
}
console.log('✅ لا أخطاء — الرسوم التفاعلية سليمة');
