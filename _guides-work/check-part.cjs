/* مدقّق حزمة أدلة: node _guides-work/check-part.cjs part-01 [part-02 ...]
   أو node _guides-work/check-part.cjs --all */
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/macbookair/Downloads/darb-main';
const WORK = path.join(ROOT, '_guides-work');
const OUT = path.join(ROOT, 'content', 'guides-parts');

const args = process.argv.slice(2);
const names = args.includes('--all')
  ? fs.readdirSync(WORK).filter(f => /^part-\d+\.json$/.test(f)).map(f => f.replace('.json', ''))
  : args;

if (!names.length) { console.error('استعمل: node _guides-work/check-part.cjs part-01 [...]'); process.exit(2); }

globalThis.window = globalThis;
window.SOLUTION_GUIDES = window.SOLUTION_GUIDES || {};
let fails = 0;

for (const name of names) {
  const wf = path.join(WORK, name + '.json');
  const of = path.join(OUT, name + '.js');
  const problems = [];
  if (!fs.existsSync(wf)) { problems.push('ملف العمل مفقود: ' + wf); }
  if (!fs.existsSync(of)) { problems.push('ملف الأدلة مفقود: ' + of); }
  if (problems.length) { console.log('✗ ' + name + ': ' + problems.join(' | ')); fails++; continue; }

  const part = JSON.parse(fs.readFileSync(wf, 'utf8'));
  const want = part.items.map(x => x.id);

  // تحميل ملف الحزمة فقط
  delete require.cache[require.resolve(of)];
  globalThis.window.SOLUTION_GUIDES = {};
  let raw = '';
  try { raw = fs.readFileSync(of, 'utf8'); require(of); }
  catch (e) { console.log('✗ ' + name + ': خطأ تحميل — ' + e.message); fails++; continue; }

  const has = new Set();
  const dup = [];
  for (const id of want) {
    const g = window.SOLUTION_GUIDES[id];
    if (!g) { problems.push('دليل مفقود: ' + id); continue; }
    has.add(id);
    const chk = (k, cond, msg) => { if (!cond) problems.push(id + ': ' + msg); };
    chk('setup', Array.isArray(g.setup) && g.setup.length, 'setup مفقود/فارغ');
    chk('find', typeof g.find === 'string' && g.find.trim(), 'find مفقود');
    chk('law', typeof g.law === 'string' && g.law.trim(), 'law مفقود');
    chk('work', Array.isArray(g.work) && g.work.length, 'work مفقود/فارغ');
    chk('result', typeof g.result === 'string' && g.result.trim(), 'result مفقود');
    chk('photo', Array.isArray(g.photo) && g.photo.length, 'photo مفقود');
    chk('checks', Array.isArray(g.checks) && g.checks.length, 'checks مفقود');
    const all = [].concat(g.setup, [g.find, g.law, g.result], g.work, g.watch || [], g.photo, g.checks).join(' ');
    if (/<[a-zA-Z/][^>]*>/.test(all)) problems.push(id + ': فيه وسم HTML');
    if (all.indexOf('\uFFFD') >= 0) problems.push(id + ': فيه حرف تالف U+FFFD');
    if (!(g.checks || []).length) problems.push(id + ': checks فارغ');
  }
  const extra = Object.keys(window.SOLUTION_GUIDES).filter(id => !want.includes(id));

  if (problems.length) { console.log('✗ ' + name + ' (' + problems.length + ' مشكلة)'); problems.slice(0, 25).forEach(p => console.log('   - ' + p)); if (problems.length > 25) console.log('   ... و' + (problems.length - 25) + ' غيرها'); fails++; }
  else { console.log('✓ ' + name + ': ' + want.length + ' دليلًا مكتملًا' + (extra.length ? ' (+' + extra.length + ' معرّف إضافي)' : '')); }
}
process.exit(fails ? 1 : 0);
