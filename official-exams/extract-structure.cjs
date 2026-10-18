#!/usr/bin/env node
/**
 * مستخرج هيكل المنهج: الفصول والمواضيع من ملفات content/*.js
 *
 * الفصل يُشتقّ من معرّف الموضوع نفسه (b12c1t3 ← فصل b12c1) — لأن بعض الملفات
 * (مثل physics-12-c2b.js) تضيف مواضيع إلى فصل مُعلن في ملف آخر.
 * عنوان الفصل يُؤخذ من أول إعلان له في أي ملف، وإلا من ترويسة الملف.
 *
 * المخرجات: structure.json — المادة ← الفصل ← الموضوع (معرّف + عنوان + مفردات)
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'content');
const FILE_SUBJECT = {
  biology: 'الأحياء', chemistry: 'الكيمياء', physics: 'الفيزياء',
  math: 'الرياضيات', arabic: 'اللغة العربية', english: 'اللغة الإنجليزية',
  islamic: 'التربية الإسلامية', french: 'الفرنسية'
};

/* كلمات بلا وزن عند بناء المفردات */
const STOP = new Set(('من في على إلى عن مع ثم أو ولا بل قد كان يكون كل بعض هذا هذه ذلك هناك هنا ما ' +
  'وان بين لدي غير كثير قليل امام وراء داخل خارج فوق تحت قبل بعد حين منذ خلال اذا لكن ' +
  'هو هي هم هن انا نحن انت انتم لي له لها لهم عند كما مهما متى اين اي ' +
  'اول ثاني ثالث رابع خامس سادس سابع تاسع عاشر حيث التي الذي quienes كذلك ايضا حول ' +
  'نوع انواع اشكال طريقة طرق وسيلة وسائل خاصية خصائص ميزة مميزات ' +
  'ما هي ماذا متى لماذا كيف هل من أي كم ' +
  'الذي التي مما يأتي الآتي الآتية الآتين التالية التالي ' +
  'علل عرّف عرف اذكر بيّن اشرح اختر املأ أكمل أجب أرسم أعرب استخرج قارن حدد صحّح رتب أوصل ' +
  'سؤال أسئلة جواب أجوبة حلول الحل السؤال الفرع افرع أمثلة مثال شكل رقم صفحة ' +
  'يتم يمكن نجد نلاحظ نستنتج توجد يوجد').split(/\s+/));

const normS = s => s.replace(/[\u064B-\u0652\u0670\u0640]/g, '')
  .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627').replace(/\u0629/g, '\u0647')
  .replace(/\u0649/g, '\u064A').replace(/\u0624/g, '\u0648').replace(/\u0626/g, '\u064A').replace(/\u0621/g, '');

function vocabOf(text) {
  const words = new Map();
  for (const w of normS(text).split(/[^\u0621-\u064A]+/)) {
    if (w.length < 4 || STOP.has(w)) continue;
    words.set(w, (words.get(w) || 0) + 1);
  }
  /* الكلمات النادرة الطويلة هي الأدقّ دلالةً (قنوات فولكمان، الهستامين) فلا نقصّها بالتكرار */
  const all = [...words.entries()];
  const long = all.filter(([w]) => w.length >= 6);
  const rest = all.filter(([w]) => w.length < 6).sort((a, b) => b[1] - a[1]).slice(0, 300);
  return [...new Set([...long.map(([w]) => w), ...rest.map(([w]) => w)])].slice(0, 1200);
}

/* بعض الملفات تكتب tt بدل t في معرّف الموضوع — نقبل الاثنين */
const TOPIC_RE = /id:\s*'([a-z]+\d+[cu]\d+t+\d+)'/g;
const CHAP_RE = /id:\s*'([a-z]+\d+[cu]\d+)(?![0-9a-z])/g;

/* عنوان الفصل من ترويسة الملف حين لا يُعلنه داخله (الرياضيات، الإنجليزية، الإسلامية) */
function headerTitle(txt) {
  const ar = txt.match(/(الفصل|الوحدة)\s+(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|[٠-٩]+|[0-9]+)\s*[:：]\s*([^\n(（]{3,50})/);
  if (ar) return ar[1] + ' ' + ar[2] + ': ' + ar[3].trim();
  const en = txt.match(/Unit\s*(\d+)\s*:\s*([A-Za-z][^\n(]{2,40})/i);
  if (en) return 'الوحدة ' + en[1] + ': ' + en[2].trim();
  /* صيغة «مقدمة التجويد + الوحدة الأولى (الكتاب ص...)» */
  const rev = txt.match(/([^\n(（+)—]{2,40})\s*\+\s*(الوحدة|الفصل)\s+(الأول|الثاني|الثالث|الرابع|الخامس)\b/);
  if (rev) return rev[2] + ' ' + rev[3] + ': ' + rev[1].trim();
  /* صيغة «الفصل الأول: الأعداد المركبة (الكتاب ص5–47)» بلا مسافة بعد النقطتين */
  const bare = txt.match(/(الفصل|الوحدة)\s+(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر)\s*[:：]\s*([^+\n(（]{2,40})/);
  if (bare) return bare[1] + ' ' + bare[2] + ': ' + bare[3].trim();
  return '';
}

/* ── المرحلة ١: جمع كل الإعلانات ── */
const chTitle = {};
const fromHeader = {};
const topicsByCh = {};
const files = fs.readdirSync(DIR).filter(f => /^([a-z]+)-12-.*\.js$/.test(f));

for (const f of files.sort()) {
  const fm = f.match(/^([a-z]+)-12-/);
  const subject = FILE_SUBJECT[fm[1]];
  if (!subject) continue;
  const txt = fs.readFileSync(path.join(DIR, f), 'utf-8');

  const chHits = [];
  let m;
  CHAP_RE.lastIndex = 0;
  while ((m = CHAP_RE.exec(txt))) chHits.push({ id: m[1], at: m.index });

  const hTitle = headerTitle(txt);
  for (const h of chHits) {
    const tail = txt.slice(h.at, h.at + 900);
    const tm = tail.match(/title:\s*'((?:الفصل|الوحدة)[^']*)'/);
    if (tm && !chTitle[h.id]) chTitle[h.id] = tm[1].replace(/\s*[（(][^)）]*[)）]\s*$/, '').trim();
    if (hTitle && !fromHeader[h.id] && !chTitle[h.id]) fromHeader[h.id] = hTitle;
  }

  const tHits = [];
  TOPIC_RE.lastIndex = 0;
  while ((m = TOPIC_RE.exec(txt))) {
    if (tHits.some(h => h.id === m[1])) continue;
    tHits.push({ id: m[1], at: m.index });
  }
  for (let i = 0; i < tHits.length; i++) {
    const { id, at } = tHits[i];
    const end = i + 1 < tHits.length ? tHits[i + 1].at : txt.length;
    const body = txt.slice(at, Math.min(end, at + 15000));
    const tm = body.match(/title:\s*'((?:[^'\\]|\\.)*)'/);
    if (!tm) continue;
    const chId = id.replace(/t+\d+$/, '');
    (topicsByCh[chId] = topicsByCh[chId] || []);
    if (topicsByCh[chId].some(t => t.id === id)) continue;
    topicsByCh[chId].push({ id, title: tm[1], body, subject });
  }

  /* إن لم يُعلَن الفصل في هذا الملف، نشتقّه من معرّف أول موضوع ونربطه بعنوان الترويسة */
  if (hTitle && tHits.length) {
    const cid = tHits[0].id.replace(/t+\d+$/, '');
    if (cid && !chTitle[cid] && !fromHeader[cid]) fromHeader[cid] = hTitle;
  }
}

/* ── المرحلة ٢: تجميع حسب المادة ── */
const ORD = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر'];
const out = {};
/* عناوين لا يبلغها المحلّل — مُعلنة صراحةً حتى لا تبقى «الوحدة الأول» */
const OVERRIDE = { 'i12u1': 'الوحدة الأولى: مقدمة التجويد' };
let nTopics = 0, nChapters = 0, nTitled = 0;

for (const [chId, topics] of Object.entries(topicsByCh)) {
  const subject = topics[0].subject;
  const m = chId.match(/^([a-z]+\d+[cu])(\d+)$/);
  const no = parseInt(m[2]);
  const kind = m[1].includes('c') ? 'chapter' : 'unit';
  const kindAr = kind === 'chapter' ? 'الفصل' : 'الوحدة';
  let title = OVERRIDE[chId] || chTitle[chId] || fromHeader[chId] || (kindAr + ' ' + (ORD[no - 1] || no));
  if (OVERRIDE[chId] || chTitle[chId] || fromHeader[chId]) nTitled++;

  const enriched = topics.map(t => ({ id: t.id, title: t.title, vocab: vocabOf(t.title + ' ' + t.body) }));
  (out[subject] = out[subject] || []).push({ id: chId, title, topics: enriched, no, kind });
  nTopics += enriched.length;
  nChapters++;
}

for (const chs of Object.values(out)) chs.sort((a, b) => a.no - b.no);

fs.writeFileSync(path.join(__dirname, 'structure.json'), JSON.stringify(out, null, 1), 'utf-8');

console.log('🏛️  هيكل المنهج — السادس الإعدادي\n');
for (const [s, chs] of Object.entries(out)) {
  console.log('  ' + s + ': ' + chs.length + ' ' + (chs[0].kind === 'chapter' ? 'فصلًا' : 'وحدة') +
    ' · ' + chs.reduce((a, c) => a + c.topics.length, 0) + ' موضوع');
}
console.log('\n  الإجمالي: ' + Object.keys(out).length + ' مادة · ' + nChapters + ' فصلًا/وحدة · ' + nTopics + ' موضوعًا');
console.log('  عناوين حقيقية: ' + nTitled + ' من ' + nChapters);
console.log('  → structure.json');
