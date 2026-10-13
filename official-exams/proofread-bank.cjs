#!/usr/bin/env node
/**
 * مدقّق لغوي + مقسّم أسئلة للبنك الوزاري
 * ١) يقسم النصوص المركّبة (س١: أ) ... ب) ... ١) ...) إلى أسئلة ذرّية مرقّمة
 * ٢) يكشف نوع كل سؤال (علّل/عرّف/اذكر/...) ويمنحه وقتًا مناسبًا
 * ٣) يدقّق الإملاء مقابل معجم محتوى النظام (content/*.js)
 *
 * المخرجات: bank-atomic.json + report.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BANK = JSON.parse(fs.readFileSync(path.join(__dirname, 'bank-questions.json'), 'utf-8'));

/* ────────────────────────── معجم المحتوى ────────────────────────── */
function norm(s) {
  return s
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')   // تشكيل وتطويل
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627') // آأإا → ا
    .replace(/\u0629/g, '\u0647')                  // ة → ه
    .replace(/\u0649/g, '\u064A')                  // ى → ي
    .replace(/\u0624/g, '\u0648')                  // ؤ → و
    .replace(/\u0626/g, '\u064A')                  // ئ → ي
    .replace(/\u0621/g, '')                        // ء
    .replace(/\s+/g, ' ')
    .trim();
}

/* تقسيم نص إلى كلمات نظيفة: تُنزع الرموز الوقفية والقوسين والأرقام */
function tokens(s) {
  return norm(s)
    .split(/[\s\u060C،؛؟!:.،؛()\[\]{}"'«»<>/\\|*+#=~`،؛؟ـ—–\-_]+/)
    .map(w => w.replace(/^[^\u0621-\u064A]+|[^\u0621-\u064A]+$/g, ''))
    .filter(w => w.length >= 3 && /^[\u0621-\u064A]+$/.test(w));
}

/* بنك الكلمات: أساسي من محتوى الكتب، وثانوي من كل نصوص المستودع (OCR وملفات العمل)
   لا يُعلَّم إلا ما لا يرد في أيّ منهما — فهو مرشّح بقوة لخطأ في الـ OCR */
function loadCorpus() {
  const stop = new Set(('من في على إلى عن مع ثم أو ولا بل قد كان يكون كل بعض هذا هذه ذلك تلك هناك هنا ما ' +
    'وان بين لدي غير كثير قليل جد امام وراء داخل خارج فوق تحت قبل بعد حين منذ خلال اذا لكن ' +
    'هو هي هم هن انا نحن انت انتم لي له لها لهم عند كما مهما متى اين اي كلما ابدا دائما احيانا ' +
    'اول ثاني ثالث رابع خامس سادس سابع تاسع عاشر ثالثا حيث حيت وانه وانها التي الذي الذين ' +
    'كذلك ايضا شيئا بعضها جميعا حول تحت فوق امام خلف يمين شمال جنوب شرق غرب ' +
    // أدوات وحروف الجر والضمائر وأهم الأفعال الشائعة
    'عليها عليه عليهم عليها بها به لهم بها فيها فيه منها منه اليها اليه اليهم بها بها ' +
    'كان كانت كانوا كانت يكون تكون كانت قد لما لان ليس ليست انها انهم بينها بينهم ' +
    'كما كي لم لن ماذا متى لماذا كيف كم اي ان ام اذو لكن ولكن بل ولا حتى اذا اذ ' +
    'به بهما بها بهم فيها فيه فيهما عليهم عليه عليهما وعليه وعليها وان ليسا ' +
    'الان يوم اثنين ثلاثة أربعة خمسة ستة سبعة ثمانية تسعة عشر مئة ألف ' +
    'نوع انواع اشكال طريقة طرق وسيلة وسائل خاصية خصائص ميزة مميزات ' +
    'الاول الثاني الثالث الرابع الخامس الاول الاول الاول الاول').split(/\s+/));
  const primary = new Set(), secondary = new Set();
  let nPrimary = 0, nSecondary = 0;

  const eat = (s, set) => { for (const w of tokens(s)) if (!stop.has(w)) set.add(w); };

  // ── الأساسي: محتوى الكتب + بنوك الوزارة المكتوبة يدويًا
  const cdir = path.join(ROOT, 'content');
  for (const f of fs.readdirSync(cdir)) {
    if (!f.endsWith('.js') || f === 'ministerial-extracted.js' || f === 'h.js') continue;
    const code = fs.readFileSync(path.join(cdir, f), 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
    nPrimary++;
    for (const lit of (code.match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g) || [])) eat(lit.slice(1, -1), primary);
    eat(code.replace(/['"`]/g, ' '), primary);           // النص الحر أيضًا
  }

  // ── الثانوي: كل مستندات المستودع (نصوص OCR وملفات العمل) — تُخفض رتبتها
  const walk = (d, depth) => {
    if (depth > 3) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.name === 'node_modules' || e.name === '.git') continue;
      if (e.isDirectory()) { walk(p, depth + 1); continue; }
      if (!/\.(md|json|jsonl|txt|cjs|mjs|html)$/.test(e.name)) continue;
      if (p.includes('bank-atomic') || p.includes('bank-questions')) continue; // مخرجاتنا
      try { nSecondary++; eat(fs.readFileSync(p, 'utf-8').replace(/['"`]/g, ' '), secondary); } catch (_) {}
    }
  };
  walk(ROOT, 0);

  return { primary, secondary, stop, nPrimary, nSecondary };
}

/* ────────────────────────── تقسيم الأسئلة ────────────────────────── */
const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'ه', 'و'];
const AR_DIG = { '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4, '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9 };

/* أنماط الأسئلة: الكلمة المفتاحية ← نوع السؤال + زمن تقديري بالثواني */
const TYPES = [
  [/علّ?ل|علِّل|لماذا\s+(?:كان|يكون|نستعمل|يستعمل)/u, 'علّل', 180],
  [/عرّ?ف|تعريف|ما\s+المقصود|ما\s+معنى|اشرح\s+مصطلح/u, 'عرّف', 120],
  [/اشرح|شرح|بيّ?ن\s+الفكرة|وجّه|فسّر/u, 'اشرح', 180],
  [/اذكر|اذكري|ما\s+هي\s+(?:أنواع|أشكال|طرق|وسائل|خصائص|مضاعفات|نتائج)|عدد/u, 'اذكر', 120],
  [/بيّ?ن|نبّ?ه|وضّ?ح|استنتج|دلّ?/u, 'بيّن', 150],
  [/اختر|العبارات\s+الآتية|الأرجح|أنسب/u, 'اختر', 60],
  [/املأ|أكمل|في\s+الفراغ|الفراغات/u, 'املأ', 120],
  [/أوصل|وصّ?ل|صل بين/u, 'أوصل', 90],
  [/ارسم|ارسمي|أرسم|رسم|أشر|شكل/u, 'ارسم', 150],
  [/أعرب|اعرب|أعرب\s+ما|إعراب/u, 'أعرب', 180],
  [/استخرج|أكد|أشير\s+إلى|حدّ?د|حددي/u, 'حدّد', 90],
  [/احسب|احسبي|ناتج|المقدار|بالجرام|ممول|مليتر/u, 'احسب', 180],
  [/رتّ?ب|رتب|أ排序|تسلسل/u, 'رتّب', 90],
  [/صحّ?ح|صوّ?ب|ضع\s+علامة|صحح/u, 'صحّح', 90],
  [/قارن|قارني|الفرق\s+بين|الفرق\s+عن/u, 'قارن', 150],
  [/اقرأ|اقرائي|النص\s+(?:الكريم|الشاعري|الادبي)|البيت\s+الشاعري|قال\s+تعالى|قال\s+الشاعر/u, 'نصوص', 180],
  [/أجب|أجيب|أجب\s+عمّا|اجب|اشرح\s+أو\s+علّل/u, 'أجب', 120],
  [/صح\s+أم\s+خطأ|صواب\s+وخطأ/u, 'صواب/خطأ', 60],
  [/أوصل|أفسر|افسر/u, 'اشرح', 150]
];

function detectType(text) {
  const t = text.trim();
  for (const [re, name, time] of TYPES) if (re.test(t)) return { type: name, time };
  return { type: 'سؤال', time: Math.min(240, Math.max(60, Math.round(t.length / 2.5 / 30) * 30)) };
}

/* تقسيم على أ) ب) ج) د) هـ) — ولا نعدّ «و» علامة فرع لأنها حرف عطف يُفسد التقسيم */
function splitLetters(s) {
  const re = /(^|[\s\u060C(\u00AB])((?:هـ|هـ?|أ|إ|آ|ب|ج|د))\s*\)/g;
  const marks = [];
  let m;
  while ((m = re.exec(s))) marks.push({ idx: m.index + m[1].length, letter: m[2] });
  if (marks.length < 2) return null;
  const out = [];
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].idx;
    const end = i + 1 < marks.length ? marks[i + 1].idx : s.length;
    const chunk = s.slice(start, end).replace(/^(?:هـ|أ|إ|آ|ب|ج|د)\s*\)\s*/, '').trim();
    if (chunk.length >= 10) out.push({ letter: marks[i].letter === 'هـ' ? 'هـ' : marks[i].letter, text: chunk });
  }
  return out.length >= 2 ? out : null;
}

/* تقسيم على ١) ٢) ... أو 1) 2) ... */
function splitNumbered(s) {
  const out = [];
  const re = /(^|[\s\u060C(])([٠-٩]|[1-9])\s*\)/g;
  const marks = [];
  let m;
  while ((m = re.exec(s))) marks.push({ idx: m.index + m[1].length, d: m[2] });
  if (marks.length < 2) return null;
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].idx;
    const end = i + 1 < marks.length ? marks[i + 1].idx : s.length;
    const chunk = s.slice(start, end).replace(/^(?:[٠-٩]|[1-9])\s*\)\s*/, '').trim();
    if (chunk.length > 3) out.push({ num: marks[i].d, text: chunk });
  }
  return out.length >= 2 ? out : null;
}

/* هل القطعة سؤال بذاته؟ (يُقسَّم) أم مجرد مفردة من قائمة إجابة؟ (يُترك كما هو) */
const Q_VERB = /(?:اذكر|اذكري|عرّ?ف|تعريف|علّ?ل|بيّ?ن|وضّ?ح|اشرح|احسب|ارسم|أرسم|اعرب|أعرب|استخرج|قارن|اختر|املأ|أكمل|حدّ?د|حددي|صحّ?ح|رتّ?ب|أوصل|وصّ?ل|دلّ?|نبّ?ه|فسّر|عيّ?ن|استنتج|اقرأ|أجب|أعرض|اذكر)/u;
const Q_WH = /^(?:ما|ماذا|متى|أين|إلى أين|لماذا|كيف|هل|من|أيّ|أي|كم|أوصف|بيّن|اذكر|عرّف|علّل|قارن|اختر|احسب|أعرب|ارسم|استخرج|وضّح|اشرح|صحّح|رتّب|أوصل|حدد|املأ|أكمل|دلّ|فسّر|عيّن|استنتج|اقرأ|أجب)/u;

function isQuestionLike(chunk) {
  const t = chunk.trim();
  if (/[؟?]\s*$/.test(t)) return true;
  if (Q_WH.test(t)) return true;
  if (Q_VERB.test(t) && t.length >= 15) return true;
  return false;
}

/* هل الأرقام قائمة أسئلة أم قائمة مفردات إجابة؟ */
function numbersAreQuestions(nums) {
  const good = nums.filter(n => isQuestionLike(n.text)).length;
  return good / nums.length >= 0.7;
}

/* هل الجزء يحوي تعليمات تقسيم (أجب عمّا يأتي / املأ)؟ */
const SPLIT_HINT = /أجب\s*عمّا\s*يأتي|أجب\s+عمّا|أكمل\s+الآتي|أكمل\s+ما\s+يلي|املأ|أجب\s+عن\s+الآتي|الآتي\s*:|التالي\s*:/u;

/* تنظيف بادئات شاذة */
const PLACEHOLDER = /\[\s*(?:لم\s*يُوجد|لم\s*يُعد|غير\s*متوفر|نص\s*تالف|N\s*\/\s*A)[^\]]*\]/i;
const DIRECTIVE_ONLY = /^(?:فرع|الفرع|أفرع|أجيب|أجب\s+عن\s+أفرع|أجب\s+عن|الأسئلة|سؤال|السؤال|حل\s+المسألة|ملاحظة)\b|^:\s*$|^\(?[أ-و]\)?\s*$/;

function cleanChunk(t) {
  return t
    .replace(PLACEHOLDER, ' ')
    .replace(/\(\s*فرع\s*[^)]*\)\s*/gi, ' ')
    .replace(/\(\s*المطلوب[^)]*\)/gi, ' ')
    .replace(/\(\s*للجميع[^)]*\)/gi, ' ')
    .replace(/\(\s*اختر[^)]*\)/gi, ' ')
    .replace(/^\s*[\u060C،؛:.،\-–—*]+\s*/, '')      // رموز في البداية
    .replace(/[\s\u060C،؛:.]+$/, '')
    .replace(/\.{3,}/g, '……')                        // حشو الفراغات ← علامة واحدة
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/* جزء مجرد من تعليمات (مثل «فرع (أ):» أو «أجب عن أفرع أ، ب») يُلتحم بما بعده */
function isDirectiveOnly(s) {
  const t = cleanChunk(s);
  return t.length < 45 && DIRECTIVE_ONLY.test(t) && !/[؟?]/.test(t) && !Q_VERB.test(t);
}

/* توزيع الإجابات أ- ب- ج- على الأجزاء */
function splitAnswer(a) {
  if (!a) return {};
  const re = /(^|[\s\u060C(])([أ-و])\s*[-–.—]\s*/g;
  const marks = []; let m;
  while ((m = re.exec(a))) marks.push({ idx: m.index + m[1].length, letter: m[2] });
  if (marks.length < 2) return { _whole: a.trim() };
  const map = {};
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].idx;
    const end = i + 1 < marks.length ? marks[i + 1].idx : a.length;
    map[marks[i].letter] = a.slice(start, end).trim();
  }
  return map;
}

/* ────────────────────────── المعالجة ────────────────────────── */
const corpus = loadCorpus();
console.log(`📚 معجم أساسي: ${corpus.primary.size.toLocaleString('en')} كلمة (${corpus.nPrimary} ملف) · ثانوي: ${corpus.secondary.size.toLocaleString('en')} (${corpus.nSecondary} ملف)`);

const atomic = [];
const problems = [];

let idx = 0;
for (const q of BANK.questions) {
  let text = (q.q || '').trim();
  if (!text) continue;

  // إزالة بادئة «س١:» والفرع
  let branch = '';
  const bm = text.match(/(?:فرع|الفرع)\s*[:\-]?\s*([\u0621-\u064A]{1,4})/);
  if (bm) branch = bm[1];
  text = text.replace(/^س\s*[0-9٠-٩]+\s*[:：]?\s*/, '');
  text = text.replace(/^\s*\((?:فرع|الفرع)[^)]*\)\s*/, '').trim();
  if (!text) continue;

  const parts = [];
  const letters = splitLetters(text);
  if (letters && letters.length >= 2) {
    for (const p of letters) {
      // هل هذا الجزء بدوره يحوي أرقامًا وهي أسئلة كاملة (لا مجرد مفردات إجابة)؟
      if (SPLIT_HINT.test(p.text)) {
        const nums = splitNumbered(p.text);
        if (nums && numbersAreQuestions(nums)) {
          const head = p.text.split(/(?:١|[1-9])\s*\)/)[0].replace(/[:\u060C\s]+$/, '').trim();
          for (const n of nums) parts.push({ letter: p.letter, num: n.num, text: (head ? head + ' ' : '') + n.text });
          continue;
        }
      }
      parts.push({ letter: p.letter, num: '', text: p.text });
    }
  } else {
    const nums = splitNumbered(text);
    if (nums && numbersAreQuestions(nums)) {
      const head = text.split(/(?:١|[1-9])\s*\)/)[0].replace(/[:\u060C\s]+$/, '').trim();
      for (const n of nums) parts.push({ letter: '', num: n.num, text: (head ? head + ' ' : '') + n.text });
    } else {
      parts.push({ letter: '', num: '', text });
    }
  }

  const amap = splitAnswer(q.a);

  // دمج الأجزاء المجردة من تعليمات فيما يليها
  for (let i = parts.length - 1; i >= 0; i--) {
    if (isDirectiveOnly(parts[i].text) && i + 1 < parts.length) {
      parts[i + 1].text = parts[i].text + ' ' + parts[i + 1].text;
      parts.splice(i, 1);
    }
  }

  for (const p of parts) {
    const t = cleanChunk(p.text);
    if (t.length < 5) continue;
    if (PLACEHOLDER.test(t) || t.replace(/[\[\]]/g, '').trim().length < 8) continue;  // نص تالف
    const { type, time } = detectType(t);
    let ans = '';
    if (p.letter && amap[p.letter]) ans = amap[p.letter];
    else if (!p.letter && amap._whole) ans = amap._whole;
    else if (Object.keys(amap).length === 1 && amap._whole) ans = amap._whole;

    idx++;
    atomic.push({
      id: 'aq' + idx,
      subject: q.subject,
      year: q.year,
      role: q.role,
      q: t,
      a: (ans || '').substring(0, 1200),
      type,
      time,
      parent: q.id,
      letter: p.letter,
      num: p.num,
      branch,
      source: q.source
    });
  }
}

/* ────────────────────────── التدقيق الإملائي ────────────────────────── */
const flagCount = {};
for (const item of atomic) {
  const unknown = [], primaryHit = [];
  for (const w of tokens(item.q)) {
    if (/[A-Za-z]/.test(w)) continue;              // أجنبية
    if (corpus.stop.has(w)) continue;               // أداة شائعة
    if (corpus.primary.has(w)) continue;            // ورد في كتاب المقرر ← سليم
    if (corpus.secondary.has(w)) continue;          // ورد في نصوص المستودع ← مقبول
    unknown.push(w);
  }
  item._unknown = unknown;
  for (const w of unknown) flagCount[w] = (flagCount[w] || 0) + 1;
}

const flagged = Object.entries(flagCount).sort((a, b) => b[1] - a[1]);

/* تطبيق الفحص النحوي على الأسئلة الذرّية وأوليائها */
for (const item of atomic) item._grammar = grammarIssues(item.q);
for (const q of BANK.questions) q._grammar = grammarIssues((q.q || ''));
const withGrammar = atomic.filter(a => a._grammar.length);
const parentGrammar = BANK.questions.filter(q => q._grammar.length);
const grammarKinds = {};
for (const a of withGrammar) for (const g of a._grammar) {
  const k = g.split('(')[0].split('«')[0].trim();
  grammarKinds[k] = (grammarKinds[k] || 0) + 1;
}

/* ────────────────────────── التدقيق النحوي/الإنشائي ────────────────────────── */
/* أخطاء لا يكشفها المعجم: تكرار، أقواس غير مغلقة، جمل مبتورة، رموز شاذة */
function grammarIssues(text) {
  const out = [];
  const t = text.trim();

  // ١) تكرار كلمة متتالية (OCR أو خطأ كتابة)
  const ws = t.split(/\s+/);
  for (let i = 1; i < ws.length; i++) {
    if (ws[i].length > 2 && ws[i] === ws[i - 1] && !/^(تم|نعم|أجل|كلا|مرّة|سنة|سنة)$/.test(ws[i])) {
      out.push('تكرار: «' + ws[i] + '»');
      break;
    }
  }

  // ٢) أقواس/علامات اقتباس غير مغلقة — مع إهماء أقواس الترقيم (١) ٢) وأ) ب))
  const bare = t.replace(/(?:[٠-٩]|[1-9])\s*\)/g, ' ').replace(/(?:^|[\s\u060C(])(?:هـ|أ|إ|آ|ب|ج|د|و)\s*\)/g, ' ');
  const pairs = [['(', ')'], ['[', ']'], ['«', '»'], ['{', '}']];
  for (const [o, c] of pairs) {
    const no = bare.split(o).length - 1, nc = bare.split(c).length - 1;
    if (no !== nc) { out.push('أقواس غير متوازنة ' + o + c + ' (' + no + '/' + nc + ')'); break; }
  }

  // ٣) جملة مبتورة: تنتهي بحرف أو واو أو أداة جر
  if (/[،,]\s*$/.test(t)) out.push('تنتهي بفاصلة (نص مبتور)');
  if (/(?:^|\s)(?:في|من|الى|إلى|عن|مع|على|و|ف|ب|ل|ك)\s*$/.test(t)) out.push('تنتهي بأداة (نص مبتور)');

  // ٤) رموز شاذة أو مبقّعات من الـ OCR (بلا احتساب التشكيل)
  const ALLOWED = /[^\u0621-\u064A\u064B-\u0652\u0670\u0671\u0640\u0660-\u0669a-zA-Z0-9α-ωΑ-Ω\s\u060C\u061F\u061B.:،؛؟!()%×÷=√∞∈∑∏±≈<>≤≥⁺²³°_\-–—\/«»()[\]،؛.*"'`|\\{}#&@$^~!?;,•·…]/;
  const bad = t.match(ALLOWED);
  if (bad) out.push('رمز شاذ: ' + [...new Set(bad)].join(' '));

  // ٥) نقاط حشو طويلة (فراغات مقاسة في الأصل المطبوع)
  if (/\.{4,}|\.{3,}\s*\.{3,}/.test(t)) out.push('حشو نقاط (فراغ في الأصل)');

  // ٦) جملة مبتورة فعلًا: قصيرة جدًا، بلا علامة، ولا تنتهي بوقف، ولا هي إشارة إلى شكل
  if (t.length < 22 && !/[؟?:.؛!]/.test(t) && !Q_VERB.test(t) && !/شكل|رقم|الشكل|مخطط|جدول|ص\d|كرد|المرجع/i.test(t)) {
    out.push('قصيرة بلا وقف (نص مبتور محتمل)');
  }

  // ٧) مسافات زائدة أو حروف منفصلة (مثال: «ا ل ب ي ا ن»)
  if (/(?:^|\s)[ا-ي]\s[ا-ي]\s[ا-ي]\s[ا-ي](?:\s|$)/.test(t)) out.push('حروف منفصلة (انكسار كلمة)');

  // ٨) سؤال مكرر داخل نصه
  const dupQ = t.match(/(س\s*[0-9١-٩]+\s*[:：])/g);
  if (dupQ && dupQ.length > 1) out.push('يحتوي أكثر من رأس سؤال (دمج نصوص)');

  return out;
}

/* ────────────────────────── التقارير ────────────────────────── */
const bySubject = {};
for (const a of atomic) (bySubject[a.subject] = bySubject[a.subject] || []).push(a);

let report = `# تقرير المراجعة اللغوية وتقسيم الأسئلة\n\n`;
report += `| البعد | العدد |\n|---|---|\n`;
report += `| أسئلة قبل التقسيم | ${BANK.questions.length} |\n`;
report += `| أسئلة ذرّية بعد التقسيم | ${atomic.length} |\n`;
report += `| أسئلة مفصولة إلى فروع (أ/ب/ج) | ${atomic.filter(a => a.letter).length} |\n`;
report += `| أسئلة مفصولة إلى أرقام (١/٢/٣) | ${atomic.filter(a => a.num).length} |\n`;
report += `| حلول مرفقة | ${atomic.filter(a => a.a).length} |\n\n`;

report += `## التوزيع حسب المادة\n\n| المادة | ذرّية | بحل |\n|---|---|---|\n`;
for (const [s, arr] of Object.entries(bySubject)) {
  report += `| ${s} | ${arr.length} | ${arr.filter(a => a.a).length} |\n`;
}

report += `## التوزيع حسب النوع\n\n| النوع | العدد | الزمن |\n|---|---|---|\n`;
const byType = {};
for (const a of atomic) (byType[a.type] = byType[a.type] || { n: 0, t: a.time }).n++;
for (const [t, v] of Object.entries(byType).sort((a, b) => b[1].n - a[1].n)) {
  report += `| ${t} | ${v.n} | ${v.t}ث |\n`;
}

report += `\n## نتيجة المراجعة اللغوية\n\n`;
report += `- **الإملاء**: ${flagged.length === 0 ? '✅ لا يوجد خطأ إملائي — كل كلمات البنك وردت في معجم الكتب أو نصوص المستودع بعد التطبيع (ة/ه، أ/ا، ئ/ي)' : '⚠️ ' + flagged.length + ' كلمة مرشّحة'}\n`;
report += `- **الإنشاء/النحو**: ${withGrammar.length === 0 ? '✅ لا مشكلة' : '⚠️ ' + withGrammar.length + ' سؤالًا بها مشكلة إنشائية'} (من ' + parentGrammar.length + ' نصًا أصليًا)\n\n`;
if (Object.keys(grammarKinds).length) {
  report += `| نوع المشكلة | العدد |\n|---|---|\n`;
  for (const [k, c] of Object.entries(grammarKinds).sort((a, b) => b[1] - a[1])) report += `| ${k} | ${c} |\n`;
  report += `\n### أمثلة تحتاج تدخّلًا يدويًا\n\n`;
  for (const a of withGrammar.slice(0, 25)) {
    report += `- **${a.subject} ${a.year} ${a.role}** — ${a._grammar.join(' · ')}\n  > ${a.q.substring(0, 180)}\n\n`;
  }
}

report += `\n## كلمات مرشّحة للمراجعة (٣ مرات فأكثر ولا ترد في معجم المحتوى)\n\n| الكلمة | المرات |\n|---|---|\n`;
report += flagged.slice(0, 120).map(([w, c]) => `| ${w} | ${c} |`).join('\n') + '\n';

fs.writeFileSync(path.join(__dirname, 'report.md'), report, 'utf-8');
fs.writeFileSync(path.join(__dirname, 'bank-atomic.json'), JSON.stringify({
  meta: { generated: new Date().toISOString(), from: BANK.questions.length, to: atomic.length },
  questions: atomic
}, null, 1), 'utf-8');

console.log(`\n✅ ${BANK.questions.length} سؤالًا → ${atomic.length} سؤالًا ذرّيًا`);
console.log(`   مفصولون بحروف: ${atomic.filter(a => a.letter).length} · برقم: ${atomic.filter(a => a.num).length}`);
console.log(`   بحل: ${atomic.filter(a => a.a).length}`);
console.log(`\n🔎 المراجعة اللغوية:`);
console.log(`   الإملاء: ${flagged.length === 0 ? '✅ سليم — لا خطأ' : '⚠️ ' + flagged.length + ' كلمة'}`);
console.log(`   الإنشاء: ${withGrammar.length === 0 ? '✅ سليم' : '⚠️ ' + withGrammar.length + ' سؤالًا (من ' + parentGrammar.length + ' نصًا أصليًا)'}`);
for (const [k, c] of Object.entries(grammarKinds).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
  console.log(`      ${c}× ${k}`);
}
console.log(`\n📄 official-exams/report.md و bank-atomic.json`);
if (flagged.length) {
  console.log(`\nأعلى الكلمات المشبوهة:`);
  flagged.slice(0, 25).forEach(([w, c]) => console.log(`   ${c}× ${w}`));
}
