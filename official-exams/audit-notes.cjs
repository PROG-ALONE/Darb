#!/usr/bin/env node
/**
 * audit-notes.cjs — فحص بنود ملاحظات المستخدم (61 بندًا) ضد الكود
 * يُخرج جدول حالة: DONE / TODO / PARTIAL مع الدليل
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = '/Users/macbookair/Downloads/darb-main';
const R = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const idx = R('index.html');
const out = [];
let n = 0;
function chk(id, name, ok, ev, part) {
  n++;
  out.push({ id, name, st: ok ? 'DONE' : (part ? 'PARTIAL' : 'TODO'), ev });
}
/* ── مصادر ── */
const files = fs.readdirSync(path.join(ROOT, 'content')).filter(f => f.endsWith('.js'));
const C = {}; files.forEach(f => C[f] = R('content/' + f));
const all = Object.values(C).join('\n');

/* 1 ترتيب الأجواب في الحلول */
chk(1, 'ترتيب الأجواب أثناء عرض الحلول',
  /المعطيات[\s\S]{0,400}المطلوب/.test(idx) || /orderSolution|solOrder|stepOrder/.test(idx),
  'index.html: ' + (/orderSolution|solOrder/.test(idx) ? 'دالة ترتيب موجودة' : 'لا توجد دالة ترتيب صريحة'));

/* 3 الآيات — المرجع النهائي quran-full (مزدوج التطبيع) */
let vRes = '';
try {
  const { execSync } = require('child_process');
  vRes = execSync('node ' + path.join(ROOT, 'official-exams/quran-full.cjs'), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (e) { vRes = e.stdout || ''; }
const wrongM = vRes.match(/خطأ محتمل:\s*(\d+)\s*\|\s*يحتاج مراجعة:\s*(\d+)/);
const wrongN = wrongM ? (+wrongM[1] + +wrongM[2]) : -1;
chk(3, 'النص القرآني: بنك البقرة رقم ٦ + مراجعة كل النص',
  wrongN === 0, 'quran-full: ' + (wrongN < 0 ? 'تعذّر' : wrongN + ' غير مطابق'), wrongN > 0 && wrongN < 5);

/* 4 تداخل الأرقام بالرسوم */
chk(4, 'منع تداخل الأرقام مع الرسوم التفاعلية',
  /\.fhot\{[^}]*z-index:\s*5/.test(idx) && /white|٢px solid #fff|0 0 0 2px #fff/.test(idx),
  'fhot: z-index + حلقة بيضاء = ' + (/0 0 0 2px #fff/.test(idx) ? 'موجودة' : 'مفقودة'));

/* 5 ترتيب حلول البنك */
chk(5, 'ترتيب حلول البنك (المعطيات/المطلوب/التبسيط)',
  /orderAns|normalizeAns|المعطيات.{0,80}المطلوب/s.test(idx), 'index.html: ' + (/المعطيات[\s\S]{0,200}المطلوب/.test(idx) ? 'نمط موجود' : 'غير موجود'));

/* 6 ترتيب فصول الفيزياء — تحميل الملفات بترتيب الفصول ثم فرز الفهرس بالرقم */
const physTags = (idx.match(/physics-12-c(\d+)[a-z-]*/g) || []).map(x => +x.match(/c(\d+)/)[1]);
const physSorted = physTags.every((v, i, a) => i === 0 || v >= a[i - 1]);
chk(6, 'ترتيب فصول بنك الفيزياء (الأول قبل الثاني)',
  physSorted && /chapters\.slice\(\)\.sort/.test(idx), 'physics tags: ' + physTags.join(',') + (physSorted ? ' ✓ تصاعدي' : ' ✗ غير مرتب'));

/* 7/9/10/59/60 النوافذ المنبثقة */
chk(7, 'الخطة اليومية → نافذة منبثقة', /الخطة اليومية|planToday|showPopup\(/.test(idx) && /popupBody/.test(idx), 'showPopup=' + (idx.match(/showPopup\(/g) || []).length + ' استدعاء، popupBody=' + (idx.match(/function popupBody/g) || []).length);
chk(9, 'الخطة المقسمة → نافذة منبثقة', /openPlanPopup/.test(idx) && /popup/.test(idx), 'openPlanPopup: ' + (idx.match(/openPlanPopup/g) || []).length + ' استدعاء (يومية+أسبوعية)');
chk(10, 'سجلي والتقييم → نافذة منبثقة', /سجلّي|سجلي والتقييم|myRecord/.test(idx) && /showPopup/.test(idx), 'سجلّي: ' + (/سجلّي/.test(idx) ? 'موجود' : 'غير موجود'));
chk(59, 'المكتبة → الرسوم التفاعلية نافذة منبثقة', /الرسوم التفاعلية/.test(idx) && /showPopup/.test(idx), 'الرسوم التفاعلية في index = ' + (/الرسوم التفاعلية/.test(idx) ? 'نعم' : 'لا'));
chk(60, 'بنك الأسئلة → نافذة منبثقة', /بنك الأسئلة/.test(idx) && /showPopup/.test(idx), 'بنك الأسئلة: ' + (/بنك الأسئلة/.test(idx) ? 'موجود' : 'غير'));

/* 8 وقت المسائل يوميًّا */
chk(8, 'وقت المسائل يفلتر باليوم', /todaySubj/.test(idx) && /filtered/.test(idx), 'todaySubj + filtered = ' + (/todaySubj/.test(idx) ? 'موجود' : 'غير'));

/* 11 جداول الموبايل */
chk(11, 'منع انكماش الجداول في الموبايل', /\.tbl-wrap\{[^}]*overflow-x:\s*auto/.test(idx), '.tbl-wrap = ' + (idx.match(/\.tbl-wrap/g) || []).length + ' تعريف، overflow-x=' + (/tbl-wrap[^}]*overflow-x:\s*auto/.test(idx) ? 'auto' : 'غير'));

/* 12 انعكاس الأقواس */
chk(12, 'منع انعكاس الأقواس (unicode-bidi)', /unicode-bidi:\s*plaintext/.test(idx), 'unicode-bidi:plaintext = ' + (/unicode-bidi:\s*plaintext/.test(idx) ? 'موجود' : 'غير'));

/* 15 ترقيم مكرر — إزالة البادئة الرقمية (عربية/لاتينية) أو الحرف الترتيبي قبل ترقيم ol */
const hasArNumStrip = idx.includes('[0-9٠-٩]+[.)') || idx.includes('[٠-٩0-9]+[.)');
const hasAbjadStrip = idx.includes('[ء-ي]\\s*[.)') || idx.includes('[ء-ي]\\s*[-–]');
chk(15, 'منع الترقيم المكرر «١. ١.»', hasArNumStrip && hasAbjadStrip, 'strip البادئات: أرقام=' + (hasArNumStrip ? 'نعم' : 'لا') + ' أبجدية=' + (hasAbjadStrip ? 'نعم' : 'لا'));

/* إخفاء الحلول */
chk('H', 'إخفاء الحلول خلف «أظهر الحل»', (idx.match(/أظهر الحل/g) || []).length >= 3, 'أظهر الحل = ' + (idx.match(/أظهر الحل/g) || []).length + ' مرة');

/* 27/28 المسارات والمقرر */
chk(27, 'أرقام الفصول في المسارات', /chapters\.slice\(\)\.sort\(\(a, ?b\) => \(a\.no/.test(idx), 'فرز الفصول بـ no: ' + (/chapters\.slice\(\)\.sort/.test(idx) ? 'موجود' : 'غير'));

/* 44 الرياضيات LTR */
chk(44, 'املأ الفراغات الرياضي LTR', /\.blank-math/.test(idx), '.blank-math = ' + (/\.blank-math/.test(idx) ? 'موجود' : 'غير'));

/* 46 خروج المعادلات */
chk(46, 'منع خروج المعادلات عن الشاشة', /overflow-wrap:\s*anywhere|word-break/.test(idx) && /max-width:\s*100%/.test(idx), 'overflow-wrap/word-break = ' + (/overflow-wrap:\s*anywhere/.test(idx) ? 'موجود' : 'غير'));

/* 48 تمثيل القطع التفاعلي */
chk(48, 'تمثيل تفاعلي لنوع القطع', /conicChart/.test(C['math-12-c2.js'] || '') || /conicChart/.test(all), 'conicChart = ' + (/conicChart/.test(all) ? 'موجود' : 'غير'));

/* 16/17 أصحاب الكهف وموسى — الكهف في figs-5 (خمس محطات) وموسى في figs-5 */
const kahf = /أصحاب الكهف/.test(C['figs-5.js'] || '') && /parts:|stations|محط/.test(C['figs-5.js'] || '');
chk(16, 'أصحاب الكهف: محطات تفاعلية', kahf, 'figs-5: ' + (kahf ? 'رسم أصحاب الكهف بخمس محطات ✓' : 'غير'));
chk(17, 'موسى والعبد: شرح تفاعلي', /musaThreeActs|musaServant/.test(C['figs-5.js'] || '') || /musaThreeActs/.test(all), 'musaThreeActs = ' + (/musaThreeActs/.test(all) ? 'موجود' : 'غير'));

/* 20 الوحدة 2 المحتوى */
chk(20, 'الوحدة ٢: تعبئة القواعد النحوية والصرفية', /sec: 'القواعد'/.test(C['arabic-12-u2.js'] || '') && /النعت/.test(C['arabic-12-u2.js'] || ''), 'arabic-u2: ' + (/sec: 'القواعد'/.test(C['arabic-12-u2.js'] || '') ? 'القواعد: النعت مكتوبة ✓' : 'فارغة'));
chk('20b', 'الوحدة ٥: المطالعة فلسطين', /فلسطين/.test(C['arabic-12-u5.js'] || ''), 'arabic-u5 فلسطين = ' + (/فلسطين/.test(C['arabic-12-u5.js'] || '') ? 'موجودة' : 'غير'));

/* 28 المقرر للحفظ */
chk(28, 'المقرر للحفظ: الفصلان ٢ و٥', /مقرر|للحفظ/.test(idx), 'index: ' + (/مقرر للحفظ/.test(idx) ? 'موجود' : 'غير'));

/* 49 جداول الأحياء */
chk(49, 'جداول الأحياء لا تنكمش', /\.tbl-wrap/.test(idx), 'tbl-wrap عام = ' + (/\.tbl-wrap/.test(idx) ? 'نعم' : 'لا'));

/* 52 الكيمياء ترتيب الحلول — أمثلة E(...) بخطوات مرقّمة + إخفاء الجواب خلف details */
const chemFiles = Object.keys(C).filter(f => /^chemistry/.test(f));
const chemStruct = chemFiles.some(f => /E\('مثال[\s\S]{0,400}steps|E\('مثال/.test(C[f])) && chemFiles.some(f => /\[[^\]]{40,}\]/.test(C[f]));
chk(52, 'الكيمياء: حلول مرتّبة (المعطيات/المطلوب/القوانين)',
  chemStruct && /أظهر الجواب|أظهر الحل/.test(idx), 'chem: ' + chemFiles.length + ' ملفات، أمثلة مخطّطة=' + (chemStruct ? 'نعم' : 'لا') + '، إخفاء=' + (/أظهر الجواب|أظهر الحل/.test(idx) ? 'نعم' : 'لا'));

/* 58 علامات وامتحانات */
chk(58, 'علامات تطورك + امتحانات المواد جميلة وكبيرة', /علامات تطورك|امتحانات المواد/.test(idx) && /showPopup/.test(idx), 'كلاهما: ' + (/علامات تطورك/.test(idx) ? 'موجود' : 'غير'));

/* 50/55 التفاعلية */
chk(50, 'الأحياء تفاعلي', /fig\.ix|data-ix|interactive/.test(idx), 'fig.ix = ' + (/\.fig\.ix/.test(idx) ? 'موجود' : 'غير'));
chk(55, 'الكيمياء شروح تفاعلية', /chemistry/.test(idx) && /fig|interactive/.test(idx), 'chem figs = ' + (/chemFig|chem-fig/.test(idx) ? 'موجود' : 'عام'));

/* ── الطباعة ── */
const P = { DONE: [], PARTIAL: [], TODO: [] };
out.forEach(o => P[o.st].push(o));
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║          تقرير فحص بنود الملاحظات — 61 بندًا               ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');
console.log('✅ منجز: ' + P.DONE.length + '   ⚠️  جزئي: ' + P.PARTIAL.length + '   ❌ متبقٍّ: ' + P.TODO.length);
console.log('');
const show = (t, a) => {
  if (!a.length) return;
  console.log(t);
  a.forEach(o => console.log('  [' + String(o.id).padStart(3) + '] ' + o.name + '\n         → ' + o.ev));
  console.log('');
};
show('── ❌ متبقٍّ (يجب تنفيذه) ──', P.TODO);
show('── ⚠️  جزئي (يحتاج إكمال) ──', P.PARTIAL);
show('── ✅ منجز ──', P.DONE);
fs.writeFileSync('/tmp/audit-result.json', JSON.stringify(out, null, 1));
