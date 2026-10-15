#!/usr/bin/env node
/**
 * verify-verses.cjs — فحص موثوق للنص القرآني في المحتوى مقابل المصحف
 * ────────────────────────────────────────────────────────────────
 * مصادر النص:
 *   1) ﴿...﴾ داخل أي ملف content/*.js
 *   2) AY('النص', 'السورة:الآية' | '(رقم)')
 *   3) memos آيات السور: 'النص (رقم)'
 *
 * الاستراتيجية (متدرجة حتى لا تُطلق إيجابيات خاطئة):
 *   أ) إن وُجد مرجع سورة:آية ← نقارن بالآية نفسها مباشرة (أدقّ اختبار).
 *   ب) وإلا نقسّم النص على (... و …. و ____ و ۝ و السطر الجديد) ونتحقق
 *      من كل مقطع مستقل (طوله ≥ 10) كجزء من آية واحدة.
 *   ج) المقاطع المُفلتة فقط تُعرض للمراجعة اليدوية، ويُميَّز:
 *        WRONG  = مقطع لا يوجد في أي آية (خطأ حقيقي محتمل)
 *        ELIDED = النصّ يحوي حذفًا (...) فلا يُدان به
 *        NONQUR = ليس قرآنًا أصلًا (مثال نحوي / نص عربي)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/macbookair/Downloads/darb-main';

/* ── المصحف (نسختان) ── */
function load(f) {
  try {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    const out = [];
    for (const s of (j.data && j.data.surahs) || [])
      for (const a of s.ayahs || []) out.push({ s: s.number, a: a.numberInSurah, t: a.text });
    return out;
  } catch (e) { return []; }
}
const M1 = load('/tmp/quran.json'), M2 = load('/tmp/quran2.json');
if (!M1.length && !M2.length) { console.error('لا يوجد مصحف مخزّن'); process.exit(2); }
const EDITIONS = [M1, M2].filter(m => m.length);

const TASHKEEL = /[ً-ْٰ۪ۖۗۘۙۚۛۜ۟۠ۡۢ۫۬ـ]/g;
const ZW = /[​-‏‪-‮⁠-⁯﻿]/g;
function norm(s) {
  return String(s).replace(TASHKEEL, '').replace(ZW, '')
    .replace(/[ٱأإآ]/g, 'ا').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/[^\u0621-\u064A\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
/* فهرس: لكل نسخة، آياتها مُطبَّعة + مفتاح «سورة:آية» */
const IDX = EDITIONS.map((m, i) => ({
  name: 'مصحف' + (i + 1),
  byKey: new Map(m.map(v => [v.s + ':' + v.a, norm(v.t)])),
  list: m.map(v => ({ k: v.s + ':' + v.a, n: norm(v.t) }))
}));

/* ── جمع الاقتباسات ── */
const files = fs.readdirSync(path.join(ROOT, 'content')).filter(f => f.endsWith('.js'));
const quotes = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, 'content', f), 'utf8');
  const lines = src.split('\n');
  lines.forEach((ln, i) => {
    const line = i + 1;
    let m;
    const rp = /﴿([^﴾]{12,})﴾/g;
    while ((m = rp.exec(ln))) quotes.push({ f, line, text: m[1], ref: guessRef(ln, m[1]) });
    const ra = /\bAY\(\s*'([^']{15,})'\s*,\s*'([^']*)'/g;
    while ((m = ra.exec(ln))) quotes.push({ f, line, text: m[1], ref: cleanRef(m[2]) });
    const rm = /'([^']{25,})\s*\((\d{1,3})\)'/g;
    while ((m = rm.exec(ln))) {
      if (/[ً-ْ]/.test(m[1]) && m[1].split(' ').length >= 4)
        quotes.push({ f, line, text: m[1], ref: '(' + m[2] + ')' });
    }
  });
}
function cleanRef(r) { const x = String(r).replace(/[()]/g, '').trim(); return x; }
function guessRef(ln, txt) {
  let m = ln.match(/,\s*'((?:\S+:\d{1,3})|\(\d{1,3}\))'\s*\)/);
  if (m) return cleanRef(m[1]);
  return '';
}
/* يحوّل «البقرة:74» أو «74» (بوجود سورة معلومة) إلى مفتاح */
function resolveKey(q) {
  const r = q.ref || '';
  let m = r.match(/(\d{1,3})\s*:\s*(\d{1,3})/);
  if (m) return m[1] + ':' + m[2];
  return null;
}

/* ── التحقق ── */
const MARK = /(\.{3,}|…|_{2,}|۝)/;
function fragments(t) {
  return String(t).split(new RegExp(MARK.source, 'g')).map(s => s.trim()).filter(Boolean);
}
function check(q) {
  const key = resolveKey(q);
  if (key) {
    /* اختبار دقيق بالمرجع */
    for (const idx of IDX) {
      const vt = idx.byKey.get(key);
      if (vt !== undefined) {
        const qt = norm(q.text);
        if (vt === qt || vt.includes(qt) || qt.includes(vt)) return { verdict: 'OK', via: 'ref', key };
        /* نقارن بالكلمات */
        const w = qt.split(' ').filter(x => x.length > 2);
        const hit = w.filter(x => vt.includes(x)).length;
        if (w.length && hit / w.length >= 0.9) return { verdict: 'OK', via: 'ref-words', key };
        return { verdict: 'WRONG', via: 'ref', key, correct: q.text && findAyah(key) };
      }
    }
  }
  const hasElide = MARK.test(q.text);
  const frags = fragments(q.text).filter(s => norm(s).length >= 10);
  const misses = [];
  for (const fr of frags) {
    const n = norm(fr);
    let found = false;
    for (const idx of IDX) {
      for (const v of idx.list) {
        if (v.n.includes(n) || n.includes(v.n)) { found = true; break; }
      }
      if (found) break;
    }
    if (!found) misses.push(fr.trim());
  }
  if (!misses.length) return { verdict: 'OK', via: hasElide ? 'fragments' : 'scan' };
  if (hasElide) return { verdict: 'ELIDED', miss: misses };
  return { verdict: 'WRONG', miss: misses };
}
function findAyah(key) {
  for (const idx of IDX) { const t = idx.byKey.get(key); if (t !== undefined) return t; }
  return null;
}

const res = { OK: [], WRONG: [], ELIDED: [] };
const seen = new Set();
for (const q of quotes) {
  const sig = q.f + '|' + norm(q.text).slice(0, 60);
  if (seen.has(sig)) continue;
  seen.add(sig);
  const r = check(q);
  (res[r.verdict] || res.WRONG).push({ ...q, ...r });
}

console.log('════════ فحص النص القرآني ════════');
console.log('اقتباسات فريدة: ' + seen.size);
console.log('  ✅ صحيح    : ' + res.OK.length);
console.log('  ⚠️  مُقتطع (…) : ' + res.ELIDED.length);
console.log('  ❌ خطأ محتمل: ' + res.WRONG.length);
console.log('');
if (res.WRONG.length) {
  console.log('──────── المطلوب مراجعته ────────');
  for (const w of res.WRONG) {
    console.log('■ ' + w.f + ':' + w.line + (w.ref ? ' [مرجع ' + w.ref + ']' : ''));
    console.log('  نصّنا: ' + w.text.slice(0, 140));
    if (w.correct) console.log('  الصحيح (سورة ' + (w.key || '') + '): ' + String(w.correct).slice(0, 140));
    else if (w.miss) w.miss.forEach(x => console.log('  غير موجود: ' + x.slice(0, 120)));
    console.log('');
  }
}
if (process.argv.includes('--elided') && res.ELIDED.length) {
  console.log('──────── نصوص مُقتطعة ────────');
  res.ELIDED.forEach(e => console.log('· ' + e.f + ':' + e.line + '  ' + e.text.slice(0, 90)));
}
process.exit(res.WRONG.length ? 1 : 0);
