#!/usr/bin/env node
/**
 * download-series.cjs — تنزيل سلاسل الصفحات المتعددة (PDF محوّل لصور) من iraqedu.net
 *
 * كثير من الملازم على الموقع مرفوعة كسلسلة صور: <نprefix>Page<N>.jpg
 * أداة crawl-answers.cjs تلتقط فقط ما نشَر فعليًّا على صفحات الامتحانات،
 * وهنا نقوم باستكشاف النطاق الكامل: نجرّب Page1..PageN وننزّل ما يرد 200.
 *
 * تنبيه: الرابط يُرسَل خامًّا بترميز UTF-8 — الخادم يعيد الصفحة الرئيسية
 * عند إرسال مسار عربي مرمّز percent-encoding. (موثّق في نظام.md)
 *
 * الاستخدام:
 *   node official-exams/download-series.cjs --prefix "https://.../الاجوبة_..._" --ext .jpg --max 40 --out answers/english
 *   node official-exams/download-series.cjs --file official-exams/series.json
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = __dirname;
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
          return resolve(null); // غير موجود — ليس خطأ
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

function isHtml(buf) {
  if (!buf || buf.length < 600) return true;
  return buf.slice(0, 40).toString('utf8').trim().toLowerCase().startsWith('<!doctype');
}

/**
 * يبني الرابط: إمّا نمط صريح {pattern} يحوي {n}/{n3}/{n4}، أو المتصل Page<N><ext>.
 * أمثلة أنماط حقيقية على iraqedu.net:
 *   "...وزاريات-الانكليزي-2_page-{n4}-scaled.jpg"
 *   "...Page{n}.jpg"
 */
function buildUrl(spec, i) {
  if (spec.pattern) {
    return spec.prefix + spec.pattern
      .replace('{n4}', String(i).padStart(4, '0'))
      .replace('{n3}', String(i).padStart(3, '0'))
      .replace('{n}', String(i));
  }
  return spec.prefix + 'Page' + i + (spec.ext || '.jpg');
}

async function fetchSeries(spec) {
  const { name, prefix, ext = '.jpg', max = 40, out, start = 1, gapLimit = 6 } = spec;
  const destDir = path.join(ROOT, out);
  fs.mkdirSync(destDir, { recursive: true });

  const found = [];
  let gaps = 0;
  for (let i = start; i <= max; i++) {
    const url = buildUrl(spec, i);
    const buf = await get(url);
    if (!buf || isHtml(buf)) {
      gaps++;
      if (gaps >= gapLimit && found.length) break;
      continue;
    }
    gaps = 0;
    const dest = path.join(destDir, 'page-' + String(i).padStart(3, '0') + ext);
    if (!(fs.existsSync(dest) && fs.statSync(dest).size > 5000)) fs.writeFileSync(dest, buf);
    found.push({ page: i, bytes: buf.length });
    if (i % 10 === 0) console.log('  ' + name + ': ' + i + ' (' + buf.length + ' bytes)');
  }
  console.log(
    '✔ ' + name + ': ' + found.length + ' صفحة' +
    (found.length ? ' [' + found[0].page + '–' + found[found.length - 1].page + ']' : '') +
    ' → ' + out
  );
  return { name, prefix, ext, out, count: found.length, pages: found.map((f) => f.page) };
}

async function main() {
  const a = process.argv.slice(2);
  let specs = [];

  if (a[0] === '--file') {
    specs = JSON.parse(fs.readFileSync(a[1], 'utf8'));
  } else {
    const g = (k, d) => {
      const i = a.indexOf('--' + k);
      return i >= 0 ? a[i + 1] : d;
    };
    specs = [{ name: g('name', 'series'), prefix: g('prefix'), ext: g('ext', '.jpg'), max: +g('max', 40), out: g('out', 'pages/_series'), start: +g('start', 1) }];
  }

  const results = [];
  for (const s of specs) {
    if (!s.prefix) continue;
    results.push(await fetchSeries(s));
  }

  const log = path.join(ROOT, 'series-manifest.json');
  let prev = {};
  if (fs.existsSync(log)) {
    try { prev = JSON.parse(fs.readFileSync(log, 'utf8')); } catch (_) {}
  }
  fs.writeFileSync(log, JSON.stringify({ generatedAt: new Date().toISOString(), series: [...(prev.series || []), ...results] }, null, 1));
  console.log('حُفظ: ' + log);
}

main().catch((e) => { console.error(e); process.exit(1); });
