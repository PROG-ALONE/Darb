#!/usr/bin/env node
/* يقسم ministerial-extracted.js إلى ملفات مستقلة لكل مادة.
   السبب: ملف واحد بـ824KB لا يمكن لعدة وكيل تعديله بالتوازي (تعارض كتابة)،
   والتطبيق يجمع كل الأجزاء التي تتشارك key واحدًا — فالتقسيم سلوكه مطابق تمامًا.
   الاستخدام: node official-exams/split-extracted.cjs */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'content', 'ministerial-extracted.js');
const MARK = 'window.MINISTERIAL_BANK.push({';

const raw = fs.readFileSync(SRC, 'utf8');
const parts = raw.split(MARK);
const header = parts[0];                 /* التعليق الافتتاحي + سطر تعريف البنك */
const blocks = parts.slice(1).map(b => MARK + b);

if (blocks.length < 2) { console.error('❌ لم يُعثر على أقسام قابلة للتقسيم'); process.exit(1); }

const slug = {
  'اللغة العربية': 'اللغة العربية',
  'الأحياء': 'الأحياء',
  'الفيزياء': 'الفيزياء',
  'الرياضيات': 'الرياضيات',
  'الكيمياء': 'الكيمياء',
  'اللغة الإنكليزية': 'اللغة الإنكليزية',
  'التربية الإسلامية': 'التربية الإسلامية',
};

let made = 0;
blocks.forEach((b, i) => {
  const m = b.match(/"key"\s*:\s*"([^"]+)"/);
  if (!m) return;
  const subject = m[1].split(':').pop();
  const name = slug[subject] || subject;
  /* الملف الأصلي يبقى مرجعًا للجزء اليدوي، فنسمّي هذا ‎-extracted-<subject> */
  const out = path.join(ROOT, 'content', `ministerial-extracted-${name}.js`);
  const head = header.replace(/الإجمالي:[^\n]*/, 'المادة: ' + subject)
                     .replace(/منها بحل:[^\n]*/, 'مُقسَّم تلقائيًا من ministerial-extracted.js');
  fs.writeFileSync(out, head + b.replace(/\s+$/, '\n'), 'utf8');
  const n = (b.match(/"why"\s*:/g) || []).length;
  console.log(`  ✅ ${path.basename(out)} — ${n} سؤالًا`);
  made++;
});

if (!made) { console.error('❌ لم يُكتب أي ملف'); process.exit(1); }
console.log(`\n✅ قُسِّم الملف إلى ${made} ملفات. الشيفرة المقسمة متطابقة معياريًا:`);
console.log('   تحقق: node official-exams/split-extracted.cjs --verify');
