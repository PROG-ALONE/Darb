#!/usr/bin/env node
/**
 * download-pages.cjs — تنزيل صور صفحات الامتحانات من iraqedu.net
 *
 * المدخل: official-exams/answers-index.json (مخرجات crawl-answers.cjs)
 * المخرج: official-exams/pages/<مادة>/<سنة>/<دور>/… (صور الأسئلة والأجوبة)
 *
 * تنبيه مهم موثّق في نظام.md: الرابط يُرسل خامًّا بترميز UTF-8، لأن الخادم
 * يعيد الصفحة الرئيسية عند إرسال مسار عربي مرمّز percent-encoding.
 *
 * الاستخدام:
 *   node official-exams/download-pages.cjs                # كل ما هو في الفهرس
 *   node official-exams/download-pages.cjs إنكليزي إسلامية
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = __dirname;
const INDEX = path.join(ROOT, 'answers-index.json');
const OUT_ROOT = path.join(ROOT, 'pages');

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
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'ar,en;q=0.9',
          Referer: 'https://iraqedu.net/',
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location && redirects > 0) {
          res.resume();
          return resolve(get(new URL(res.headers.location, url).toString(), redirects - 1));
        }
        if (status !== 200) {
          res.resume();
          return reject(new Error('HTTP ' + status));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }
    );
    req.setTimeout(60000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

/** اسم ملف محلّي سليم من رابط */
function fname(u, i) {
  let n;
  try {
    n = decodeURIComponent(new URL(u).pathname.split('/').pop());
  } catch (_) {
    n = 'img' + i + '.jpg';
  }
  n = n.replace(/[\\/:*?"<>|]+/g, '_').slice(-140);
  if (!/\.(jpe?g|png|webp|gif)$/i.test(n)) n += '.img';
  return String(i).padStart(3, '0') + '_' + n;
}

function sanitizeDir(s) {
  return String(s || '').replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, '-');
}

async function main() {
  const only = process.argv.slice(2);
  if (!fs.existsSync(INDEX)) {
    console.error('الفهرس غير موجود — شغّل crawl-answers.cjs أولًا');
    process.exit(1);
  }
  const idx = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  const pages = idx.pages.filter((p) => p && p.ok && (!only.length || only.includes(p.subject)));

  let total = 0, saved = 0, skipped = 0, failed = 0;
  const jobs = [];
  for (const p of pages) {
    const dir = path.join(OUT_ROOT, sanitizeDir(p.subject), sanitizeDir(p.year), sanitizeDir(p.round));
    const list = [
      ...(p.answers || []).map((u, i) => ({ u, i, kind: 'answer' })),
      ...(p.questions || []).map((u, i) => ({ u, i: 100 + i, kind: 'question' })),
    ];
    for (const j of list) jobs.push({ ...j, dir, slug: p.slug, subject: p.subject });
  }
  total = jobs.length;
  console.log('تنزيل ' + total + ' صورة من ' + pages.length + ' صفحة');

  let n = 0;
  async function worker() {
    for (;;) {
      const job = jobs[n++];
      if (!job) return;
      const dest = path.join(job.dir, fname(job.u, job.i));
      if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) { skipped++; continue; }
      try {
        const buf = await get(job.u);
        if (buf.length < 5000 || buf.slice(0, 15).toString('utf8').startsWith('<!doctype')) {
          failed++;
          continue;
        }
        fs.mkdirSync(job.dir, { recursive: true });
        fs.writeFileSync(dest, buf);
        saved++;
      } catch (e) {
        failed++;
      }
      const done = saved + failed + skipped;
      if (done % 25 === 0) console.log('  … ' + done + '/' + total);
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));

  console.log('');
  console.log('حُفظ: ' + saved + ' · مسبقة: ' + skipped + ' · فشلت: ' + failed + ' / ' + total);
  const tree = [];
  for (const s of new Set(jobs.map((j) => j.subject))) {
    const d = path.join(OUT_ROOT, sanitizeDir(s));
    const c = fs.existsSync(d) ? countFiles(d) : 0;
    tree.push(c + '  ' + s);
  }
  console.log(tree.sort().join('\n'));
}

function countFiles(dir) {
  let c = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) c += countFiles(path.join(dir, e.name));
    else c++;
  }
  return c;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
