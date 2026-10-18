#!/usr/bin/env node
/**
 * crawl-answers.cjs — زاحف صور الأجوبة النموذجية من iraqedu.net
 *
 * الغرض: لكل صفحة امتحان وزارية في manifest.jsonl نستخرج روابط الصور المنشورة
 * عليها (صور الأسئلة + صور الأجوبة النموذجية/الكتيبات) ونبني فهرسًا يُستخدم
 * بعد ذلك لتنزيل الصور إلى official-exams/answers/
 *
 * ملاحظة تقنية: الخادم يرفض الطلبات المرمّزة percent-encoding لمسارات الصور
 * العربية (يعيد صفحة الرئيسية بدل الملف)، لذا يجب إرسال الرابط كما هو بترميز
 * UTF-8 خام. راجع نظام.md بند التجارب.
 *
 * الاستخدام:
 *   node official-exams/crawl-answers.cjs            # كل المواد
 *   node official-exams/crawl-answers.cjs إنكليزي إسلامية
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = __dirname;
const MANIFEST = path.join(ROOT, 'manifest.jsonl');
const OUT = path.join(ROOT, 'answers-index.json');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function get(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': UA,
          Accept: 'text/html,application/xhtml+xml,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'ar,en;q=0.9',
          Referer: 'https://iraqedu.net/',
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location && redirects > 0) {
          res.resume();
          const next = new URL(res.headers.location, url).toString();
          return resolve(get(next, redirects - 1));
        }
        if (status !== 200) {
          res.resume();
          return reject(new Error('HTTP ' + status + ' for ' + url));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }
    );
    req.setTimeout(45000, () => req.destroy(new Error('timeout ' + url)));
    req.on('error', reject);
  });
}

/** يحول مسار نسبي/مطلق إلى رابط خام (بلا ترميز percent) قابل للطلب */
function absolutize(u) {
  if (!u) return null;
  let s = u.trim();
  // أزل لاحقات التصغير والـ srcset المؤقتة إن وُجدت
  s = s.split(/\s+/)[0];
  if (s.startsWith('//')) s = 'https:' + s;
  else if (s.startsWith('/')) s = 'https://iraqedu.net' + s;
  else if (!/^https?:/i.test(s)) s = 'https://iraqedu.net/' + s;
  // فك الترميز إذا كان الرابط مرمّزًا بالكامل
  if (/%[0-9A-Fa-f]{2}/.test(s)) {
    try {
      const dec = decodeURIComponent(s);
      if (dec.startsWith('http')) s = dec;
    } catch (_) {
      /* أبقِ الأصل */
    }
  }
  return s;
}

/** استخراج روابط wp-content/uploads من HTML */
function extractImages(html) {
  const out = new Set();
  const re = /(?:src|data-src|data-lazy-src|href|content)="([^"]*\/wp-content\/uploads\/[^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const u = absolutize(m[1]);
    if (u) out.add(u);
  }
  // روابط داخل data-* أخرى وداخل نصوص srcset
  const re2 = /https?:\/\/[^\s"'<>]+\/wp-content\/uploads\/[^\s"'<>\\]+/g;
  while ((m = re2.exec(html)) !== null) {
    const u = absolutize(m[0]);
    if (u) out.add(u);
  }
  return [...out];
}

/** يحول رابط صورة إلى وحدته الأساسية بلا لاحقات الأحجام (-768x1086) */
function baseKey(url) {
  return url.replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp)(?:\.webp)?$)/i, '');
}

/** هل الرابط يمثل صورة أجوبة/حلول؟ */
function isAnswerish(url) {
  return /اجوبة|أجوبة|الاجوبة|الاجوبه|الحل|حلول|answer|solutions|نموذجية/i.test(url);
}

/** نفضّل الملف الأصلي كامل الحجم عند توفره */
function pickFullSize(urls) {
  const byBase = new Map();
  for (const u of urls) {
    const k = baseKey(u);
    if (!byBase.has(k)) byBase.set(k, []);
    byBase.get(k).push(u);
  }
  const picked = [];
  for (const [, list] of byBase) {
    // الملف "الأصلي" هو الذي بلا لاحقة أبعاد (-WxH)
    const original = list.find((u) => !/-\d+x\d+\./i.test(u));
    picked.push(original || list[0]);
  }
  return picked;
}

async function crawlOne(entry) {
  const url = 'https://iraqedu.net/' + entry.slug + '/';
  let html;
  try {
    const buf = await get(url);
    html = buf.toString('utf8');
  } catch (e) {
    return { ...entry, ok: false, error: String(e.message || e).slice(0, 90) };
  }
  const all = extractImages(html);
  const full = pickFullSize(all);
  const answers = full.filter(isAnswerish);
  const others = full.filter((u) => !isAnswerish(u));
  const title = (html.match(/<title>([^<]*)/) || [, ''])[1].trim();
  return {
    ...entry,
    ok: true,
    pageUrl: url,
    title: title.slice(0, 110),
    nImages: full.length,
    answers,
    questions: others,
  };
}

async function main() {
  const only = process.argv.slice(2);
  const lines = fs
    .readFileSync(MANIFEST, 'utf8')
    .trim()
    .split('\n')
    .map((l) => JSON.parse(l))
    .filter((l) => (only.length ? only.includes(l.subject) : true));

  console.log('زاحف الأجوبة — ' + lines.length + ' صفحة');

  const results = [];
  const CONC = 6;
  let i = 0;
  async function worker() {
    for (;;) {
      const idx = i++;
      if (idx >= lines.length) return;
      const r = await crawlOne(lines[idx]);
      results[idx] = r;
      const flag = r.ok ? (r.answers.length ? '★' : '·') : '✗';
      console.log(
        '[' + (idx + 1) + '/' + lines.length + '] ' + flag + ' ' +
          (r.subject || '') + ' ' + (r.year || '') + ' ' + (r.round || '') +
          ' | صور=' + (r.nImages || 0) + ' أجوبة=' + (r.answers ? r.answers.length : 0) +
          (r.error ? ' | ' + r.error : '')
      );
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'iraqedu.net — صور الأجوبة النموذجية المنشورة على صفحات الامتحانات',
    note:
      'الروابط خامّة (UTF-8) بلا ترميز percent؛ الخادم يعيد الرئيسية عند الترميز. ' +
      'الحقل answers = صور الأجوبة/الكتيبات، questions = صور أسئلة أخرى.',
    total: results.length,
    withAnswers: results.filter((r) => r && r.answers && r.answers.length).length,
    pages: results,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 1));

  const wa = results.filter((r) => r && r.answers && r.answers.length);
  console.log('');
  console.log('إجمالي الصفحات: ' + results.length);
  console.log('صفحات بها صور أجوبة: ' + wa.length);
  const bySub = {};
  for (const r of wa) bySub[r.subject] = (bySub[r.subject] || 0) + 1;
  console.log(JSON.stringify(bySub, null, 1));
  console.log('حُفظ الفهرس: ' + OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
