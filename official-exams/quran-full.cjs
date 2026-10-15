#!/usr/bin/env node
/* quran-full.cjs — فحص آيات شامل ودقيق (التشطيب: كل العلامات الهامزية + التشكيل + التطويل) */
'use strict';
const fs=require('fs'),path=require('path');
const ROOT='/Users/macbookair/Downloads/darb-main';
function load(f){try{const j=JSON.parse(fs.readFileSync(f,'utf8'));const o=[];for(const s of j.data.surahs)for(const a of s.ayahs)o.push({s:s.number,a:a.numberInSurah,t:a.text});return o;}catch(e){return[]}}
const ED=[load('/tmp/quran.json'),load('/tmp/quran2.json')].filter(x=>x.length);
/* تطبيع مزدوج:
   S (شائع): ألف خنجرية تُحذف (مَتَىٰ→متي، هَٰذِهِ→هذه، وَقَضَىٰ→وقضي) — يطابق الكتابة العصرية بلا ألف زائدة.
   A (ألفية): ألف خنجرية تصبح ألفًا (ءَايَٰت→ايات، يَٰٓأَيُّهَا→ياايهها) — يطابق الكتابة العصرية التي تكتب الألف.
   كلاهما: التطويل الهامزي → ألف واحد، (ء+ا)/(ئ+ا) تنهاران إلى ألف واحد، وطاقة (اا)→ا لمواءمة الهمزات.
   المطابقة تنجح إذا نجح أيّ التطبيعين على النصّ والمراجع معًا. */
function norm(s,A){
  return String(s)
    /* التطويل الهامزي (يَٰٓـَٔادَم / بِـَٔايَٰت / شَيْـًٔا): ـ + علامات* + همزة [+ ألف] → ألف واحد */
    .replace(/\u0640[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]*[\u0653\u0654\u0655]\u0627?/g,'\u0627')
    /* وٰا → ا واحد (ٱلرِّبَوٰا → الربا) */
    .replace(/\u0648\u0670\u0627/g,'\u0627')
    /* الألف الخنجرية: تصبح ألفًا في النسخة A، وتُحذف في النسخة S */
    .replace(/\u0670/g, A?'\u0627':'')
    /* إزالة بقية العلامات */
    .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0640]/g,'')
    /* الهمزات كلها → ألف (آ أ إ ء ئ ٱ ...), و(ؤ) → واو */
    .replace(/[\u0622\u0623\u0625\u0671\u0672\u0673\u0675\u0621\u0626]/g,'\u0627')
    .replace(/\u0624/g,'\u0648')
    .replace(/\u0649/g,'\u064A').replace(/\u0629/g,'\u0647')
    /* طاقة الألف المزدوجة: (اا)→ا مرتين (يَا أَيُّهَا ≡ يَٰٓأَيُّهَا) */
    .replace(/\u0627\u0627/g,'\u0627').replace(/\u0627\u0627/g,'\u0627')
    .replace(/[^\u0621-\u064Aa-zA-Z0-9\s]/g,' ')
    .replace(/\s+/g,' ').trim();
}
const IDX=[];
for(const ed of ED) for(const v of ed){const ns=norm(v.t,false),nA=norm(v.t,true);
  IDX.push({s:v.s,a:v.a,t:v.t,ns,nA,fs:ns.replace(/\s/g,''),fA:nA.replace(/\s/g,'')});}
/* سلاسل السور كاملة: أي اقتباس يمتدّ عبر أي عدد من الآيات المتتالية داخل السورة */
const RUNS=[];
for(const ed of ED){const bys={};for(const v of ed)(bys[v.s]=bys[v.s]||[]).push(v);
  for(const k of Object.keys(bys)){const ns=bys[k].map(v=>norm(v.t,false)).join(' '),
    nA=bys[k].map(v=>norm(v.t,true)).join(' ');
    RUNS.push({ns,nA,fs:ns.replace(/\s/g,''),fA:nA.replace(/\s/g,'')});}}
const SUR={1:'الفاتحة',2:'البقرة',3:'آل عمران',4:'النساء',5:'المائدة',6:'الأنعام',7:'الأعراف',8:'الأنفال',9:'التوبة',10:'يونس',11:'هود',12:'يوسف',13:'الرعد',14:'إبراهيم',15:'الحجر',16:'النحل',17:'الإسراء',18:'الكهف',19:'مريم',20:'طه',21:'الأنبياء',22:'الحج',23:'المؤمنون',24:'النور',25:'الفرقان',26:'الشعراء',27:'النمل',28:'القصص',29:'العنكبوت',30:'الروم',31:'لقمان',32:'السجدة',33:'الأحزاب',34:'سبأ',35:'فاطر',36:'يس',37:'الصافات',38:'ص',39:'الزمر',40:'غافر',41:'فصلت',42:'الشورى',43:'الزخرف',44:'الدخان',45:'الجاثية',46:'الأحقاف',47:'محمد',48:'الفتح',49:'الحجرات',50:'ق',51:'الذاريات',52:'الطور',53:'النجم',54:'القمر',55:'الرحمن',56:'الواقعة',57:'الحديد',58:'المجادلة',59:'الحشر',60:'الممتحنة',61:'الصف',62:'الجمعة',63:'المنافقون',64:'التغابن',65:'الطلاق',66:'التحريم',67:'الملك',68:'القلم',69:'الحاقة',70:'المعارج',71:'نوح',72:'الجن',73:'المزمل',74:'المدثر',75:'القيامة',76:'الإنسان',77:'المرسلات',78:'النبأ',79:'النازعات',80:'عبس',81:'التكوير',82:'الانفطار',83:'المطففين',84:'الانشقاق',85:'البروج',86:'الطارق',87:'الأعلى',88:'الغاشية',89:'الفجر',90:'البلد',91:'الشمس',92:'الليل',93:'الضحى',94:'الشرح',95:'التين',96:'العلق',97:'القدر',98:'البينة',99:'الزلزلة',100:'العاديات',101:'القارعة',102:'التكاثر',103:'العصر',104:'الهمزة',105:'الفيل',106:'قريش',107:'الماعون',108:'الكوثر',109:'الكافرون',110:'النصر',111:'المسد',112:'الإخلاص',113:'الفلق',114:'الناس'};
/* الملفات التي قد تحوي قرآنًا: كل ما عدا الرياضيات/الفيزياء/الكيمياء/الإنكليزي/الدلائل */
const SKIP=/^(math|physics|chemistry|english|guides|biology)/;
const files=fs.readdirSync(path.join(ROOT,'content')).filter(f=>f.endsWith('.js')&&!SKIP.test(f));
const quotes=[];
for(const f of files){
  const lines=fs.readFileSync(path.join(ROOT,'content',f),'utf8').split('\n');
  lines.forEach((ln,i)=>{
    const ref=(ln.match(/'([^']{0,40}?:\s*\d{1,3})'/)||[])[1]||'';
    let m;
    const rp=/﴿([^﴾]{12,})﴾/g; while((m=rp.exec(ln))) quotes.push({f,line:i+1,t:m[1],ref});
    const ra=/\bAY\(\s*'([^']{15,})'\s*,\s*'([^']*)'/g; while((m=ra.exec(ln))) quotes.push({f,line:i+1,t:m[1],ref:m[2]});
    const rm=/kind:\s*'سورة'/; 
    if(rm.test(ln)){const ru=/'([^']{25,})\s*\((\d{1,3})\)'/g;while((m=ru.exec(ln)))quotes.push({f,line:i+1,t:m[1],ref:'('+m[2]+')'});}
  });
}
const SEG=/(?:\.{2,}|…|_{2,}|۝|\n)/;
const out={OK:[],PART:[],WRONG:[],NQ:[]};
const seen=new Set();
for(const q of quotes){
  const sig=q.f+'|'+norm(q.t).slice(0,50); if(seen.has(sig))continue; seen.add(sig);
  const segs=q.t.split(new RegExp(SEG.source,'g')).map(s=>s.trim()).filter(s=>norm(s).length>=10);
  if(!segs.length) continue;
  const misses=[];
  for(const s of segs){
    const ns=norm(s,false),nA=norm(s,true);
    const fs=ns.replace(/\s/g,''),fA=nA.replace(/\s/g,'');
    let found=false;
    for(const v of IDX){ if(v.ns.includes(ns)||v.nA.includes(nA)||v.fs.includes(fs)||v.fA.includes(fA)) {found=true;break;} }
    if(!found){ /* امتداد عبر آيات متتالية داخل السورة */
      for(const p of RUNS){ if(p.ns.includes(ns)||p.nA.includes(nA)||p.fs.includes(fs)||p.fA.includes(fA)) {found=true;break;} }
    }
    if(!found){
      /* بحث بأطول جزء: 4 كلمات متتالية */
      const w=ns.split(' ').filter(x=>x.length>2);
      let best=null;
      for(let L=Math.min(6,w.length);L>=3;L--){
        for(let i=0;i+L<=w.length;i++){
          const gram=w.slice(i,i+L).join(' ').replace(/\s/g,'');
          const hit=IDX.find(v=>v.fs.includes(gram)||v.fA.includes(gram));
          if(hit){best={hit,L,at:i};break;}
        }
        if(best)break;
      }
      misses.push({s,best});
    }
  }
  if(!misses.length) out.OK.push(q);
  else if(/…|\.{2,}|_/.test(q.t)||/۝/.test(q.t)) out.PART.push({...q,misses});
  else if(misses.every(m=>m.best&&m.best.L>=4)) out.WRONG.push({...q,misses});
  else out.NQ.push({...q,misses});
}
console.log('ملفات:',files.length,'| اقتباسات فريدة:',seen.size);
console.log('✅ صحيح:',out.OK.length,' | مُقتطع:',out.PART.length,' | ❌ خطأ محتمل:',out.WRONG.length,' | يحتاج مراجعة:',out.NQ.length);
console.log('');
const dump=(t,arr)=>{ if(!arr.length)return; console.log('──── '+t+' ────');
for(const q of arr){
  console.log('■ '+q.f+':'+q.line+(q.ref?'  ['+q.ref+']':''));
  console.log('  نصّنا: '+q.t.replace(/\s+/g,' ').slice(0,130));
  q.misses.forEach(m=>{
    console.log('  ✗ غير موجود: '+m.s.slice(0,100));
    if(m.best){const h=m.best.hit;console.log('      أقرب: س'+h.s+':'+h.a+' ('+SUR[h.s]+') جزء '+m.best.L+' كلمات — '+h.t.slice(0,130));}
  });
  console.log('');
}};
dump('❌ خطأ محتمل (نص غير قرآني)',out.WRONG);
dump('⚠️ يحتاج مراجعة',out.NQ);
if(process.argv.includes('-v')) dump('مُقتطع',out.PART);
