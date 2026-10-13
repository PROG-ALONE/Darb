#!/usr/bin/env node
/**
 * مُوزِّع أسئلة البنك على فصول المنهج ومواضيعه — بمستويين ودرجة ثقة
 *
 * المستوى ١: الفصل (موثوق — مفردات موحّدة لكل فصل)
 * المستوى ٢: الموضوع (يُقبل فقط إذا غلب موضوعًا آخر بوضوح)
 *
 * كل سؤال يحمل mapConf: high | chapter | none
 */
const fs = require('fs');
const path = require('path');

const ATOMIC = JSON.parse(fs.readFileSync(path.join(__dirname, 'bank-atomic.json'), 'utf-8'));
const STRUCT = JSON.parse(fs.readFileSync(path.join(__dirname, 'structure.json'), 'utf-8'));

const norm = s => s.replace(/[\u064B-\u0652\u0670\u0640]/g, '')
  .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627').replace(/\u0629/g, '\u0647')
  .replace(/\u0649/g, '\u064A').replace(/\u0624/g, '\u0648').replace(/\u0626/g, '\u064A').replace(/\u0621/g, '');

const STOP = new Set(('من في على إلى عن مع ثم أو ولا بل قد كان يكون كل بعض هذا هذه ذلك هناك هنا ما ' +
  'وان بين لدي غير كثير قليل امام وراء داخل خارج فوق تحت قبل بعد حين منذ خلال اذا لكن ' +
  'هو هي هم هن انا نحن انت انتم لي له لها لهم عند كما مهما متى اين اي ' +
  'اول ثاني ثالث رابع خامس سادس سابع تاسع عاشر حيث التي الذي quienes كذلك ايضا حول ' +
  'نوع انواع اشكال طريقة طرق وسيلة وسائل خاصية خصائص ميزة مميزات ' +
  'ما هي ماذا متى لماذا كيف هل من أي كم ' +
  'الذي التي مما يأتي الآتي الآتية الآتين التالية التالي ' +
  'علل عرّف عرف اذكر بيّن اشرح اختر املأ أكمل أجب أرسم أعرب استخرج قارن حدد صحّح رتب أوصل عدّد أعطِ ' +
  'سؤال أسئلة جواب أجوبة حلول الحل السؤال الفرع افرع أمثلة مثال شكل رقم صفحة ' +
  'الخلية خلايا النسيج نسيجات العضو أعضاء الجسم النبات الحيوان الإنسان ' +
  'يتم يمكن نجد نلاحظ نستنتج توجد يوجد فقط اثنين ثلاثة اربعة خمسة'.split(/\s+/)));

const qSet = text => {
  const m = new Map();
  for (const w of norm(text).split(/[^\u0621-\u064A]+/)) if (w.length >= 4 && !STOP.has(w)) m.set(w, (m.get(w) || 0) + 1);
  return m;
};

/* ── بناء الفهرس ── */
const CH_BY_SUBJ = {};   // subject → [{ id, title, titleWords, words:Set, topics:[...] }]
const TOPIC_LIST = [];   // كل المواضيع
const df = {};

for (const [subject, chapters] of Object.entries(STRUCT)) {
  for (const ch of chapters) {
    const topics = [];
    const words = new Set();
    for (const t of ch.topics) {
      const set = new Set(t.vocab || []);
      for (const w of set) { words.add(w); df[w] = (df[w] || 0) + 1; }
      topics.push({ id: t.id, title: t.title, set });
    }
    // كلمات عنوان الفصل لها وزن مضاعف
    const titleW = new Set([...norm(ch.title).split(/[^\u0621-\u064A]+/)].filter(w => w.length >= 4 && !STOP.has(w)));
    for (const w of titleW) { words.add(w); df[w] = (df[w] || 0) + 1; }
    const rec = { subject, id: ch.id, kind: ch.kind, title: ch.title, titleW, words, topics };
    (CH_BY_SUBJ[subject] = CH_BY_SUBJ[subject] || []).push(rec);
    for (const t of topics) TOPIC_LIST.push({ subject, chRec: rec, id: t.id, title: t.title, set: t.set });
  }
}
const NT = TOPIC_LIST.length;
const idf = w => Math.log((NT + 1) / ((df[w] || 0) + 1)) + 1;

for (const ch of Object.values(CH_BY_SUBJ).flat()) {
  ch.w = new Map([...ch.words].map(w => [w, idf(w)]));
  ch.titleBoost = new Map([...ch.titleW].map(w => [w, idf(w) * 1.8]));
}
for (const t of TOPIC_LIST) t.w = new Map([...t.set].map(w => [w, idf(w)]));
const TOPIC_BY_ID = new Map(TOPIC_LIST.map(t => [t.id, t]));

function score(qw, wMap) {
  let s = 0;
  for (const [w, c] of qw) { const tw = wMap.get(w); if (tw) s += tw * Math.min(c, 3); }
  return s;
}

function rank(list, qw) {
  return list.map(t => {
    let s = score(qw, t.w);
    if (t.titleBoost) s += score(qw, t.titleBoost);
    return { t, s };
  }).sort((a, b) => b.s - a.s);
}

/* ── التوزيع ── */
const perSubject = {};
let hi = 0, chOnly = 0, none = 0;
const ambiguous = [];

for (const q of ATOMIC.questions) {
  const qw = qSet(q.q);
  const s = perSubject[q.subject] = perSubject[q.subject] || { n: 0, hi: 0, ch: 0, chs: new Set() };
  s.n++;
  q.topic = ''; q.chapter = ''; q.topicTitle = ''; q.mapConf = 'none'; q.mapScore = 0;

  if (!qw.size) { none++; continue; }

  const chs = CH_BY_SUBJ[q.subject] || [];
  if (!chs.length) { none++; continue; }
  const rCh = rank(chs, qw);
  const top = rCh[0], second = rCh[1];
  if (top.s < 5) { none++; continue; }
  const chRatio = second && second.s > 0 ? top.s / second.s : 9;
  if (chRatio < 1.15) { none++; ambiguous.push(q); continue; }   // فصلان متكافئان ← غامض

  q.chapter = top.t.title;
  q.mapScore = Math.round(top.s * 10) / 10;
  s.chs.add(top.t.title);

  // المستوى ٢: الموضوع
  const chTopics = top.t.topics.map(t => TOPIC_BY_ID.get(t.id)).filter(Boolean);
  const rTp = rank(chTopics, qw);
  const t0 = rTp[0], t1 = rTp[1];
  if (t0 && t0.s >= 5 && (!t1 || t0.s / (t1.s || 1) >= 1.3)) {
    q.topic = t0.t.id; q.topicTitle = t0.t.title; q.mapConf = 'high'; hi++; s.hi++;
  } else {
    q.mapConf = 'chapter'; chOnly++; s.ch++;
  }
}

console.log('🗺️  توزيع الأسئلة — فصل موثوق ثم موضوع دقيق\n');
for (const [s, v] of Object.entries(perSubject)) {
  console.log(`  ${s}: دقيق ${v.hi} · فصل فقط ${v.ch} · بلا ${v.n - v.hi - v.ch} (من ${v.n}) — ${v.chs.size} فصلًا`);
}
console.log(`\n  الإجمالي: ${hi} دقيق · ${chOnly} فصل فقط · ${none} بلا ربط (من ${ATOMIC.questions.length})`);
console.log(`  الغامضة (فصلان متكافئان): ${ambiguous.length}`);

/* فحص الجودة: عيّنة يدوية */
console.log('\n=== عيّنة الربط الدقيق ===');
ATOMIC.questions.filter(q => q.mapConf === 'high' && q.subject === 'الأحياء').slice(0, 6)
  .forEach(q => console.log(`  [${q.topicTitle}] ${q.q.slice(0, 90)}`));
console.log('\n=== عيّنة ربط الفصل فقط ===');
ATOMIC.questions.filter(q => q.mapConf === 'chapter' && q.subject === 'الأحياء').slice(0, 6)
  .forEach(q => console.log(`  [${q.chapter}] ${q.q.slice(0, 90)}`));

fs.writeFileSync(path.join(__dirname, 'bank-atomic.json'), JSON.stringify(ATOMIC, null, 1), 'utf-8');
console.log('\n✅ حُفظ bank-atomic.json');
