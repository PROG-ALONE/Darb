#!/usr/bin/env node
/* quran-audit.cjs — فحص دقيق للآيات: يستبعد ملفات غير القرآنية ويتحقق من المرجع */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = '/Users/macbookair/Downloads/darb-main';
function load(f){try{const j=JSON.parse(fs.readFileSync(f,'utf8'));const o=[];for(const s of(j.data&&j.data.surahs)||[])for(const a of s.ayahs||[])o.push({s:s.number,a:a.numberInSurah,t:a.text});return o;}catch(e){return[]}}
const EDS=[{n:'q1',v:load('/tmp/quran.json')},{n:'q2',v:load('/tmp/quran2.json')}].filter(x=>x.v.length);
const T=/[ً-ْٰ۪ۖۗۘۙۚۛۜ۟۠ۡۢ۫۬ـ]/g, Z=/[​-‏‪-‮⁠-⁯﻿]/g;
const norm=s=>String(s).replace(T,'').replace(Z,'').replace(/[ٱأإآ]/g,'ا').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g,' ').replace(/\s+/g,' ').trim();
const SUR={1:'الفاتحة',2:'البقرة',3:'آل عمران',4:'النساء',5:'المائدة',6:'الأنعام',7:'الأعراف',8:'الأنفال',9:'التوبة',10:'يونس',11:'هود',12:'يوسف',13:'الرعد',14:'إبراهيم',15:'الحجر',16:'النحل',17:'الإسراء',18:'الكهف',19:'مريم',20:'طه',21:'الأنبياء',22:'الحج',23:'المؤمنون',24:'النور',25:'الفرقان',26:'الشعراء',27:'النمل',28:'القصص',29:'العنكبوت',30:'الروم',31:'لقمان',32:'السجدة',33:'الأحزاب',34:'سبأ',35:'فاطر',36:'يس',37:'الصافات',38:'ص',39:'الزمر',40:'غافر',41:'فصلت',42:'الشورى',43:'الزخرف',44:'الدخان',45:'الجاثية',46:'الأحقاف',47:'محمد',48:'الفتح',49:'الحجرات',50:'ق',51:'الذاريات',52:'الطور',53:'النجم',54:'القمر',55:'الرحمن',56:'الواقعة',57:'الحديد',58:'المجادلة',59:'الحشر',60:'الممتحنة',61:'الصف',62:'الجمعة',63:'المنافقون',64:'التغابن',65:'الطلاق',66:'التحريم',67:'الملك',68:'القلم',69:'الحاقة',70:'المعارج',71:'نوح',72:'الجن',73:'المزمل',74:'المدثر',75:'القيامة',76:'الإنسان',77:'المرسلات',78:'النبأ',79:'النازعات',80:'عبس',81:'التكوير',82:'الانفطار',83:'المطففين',84:'الانشقاق',85:'البروج',86:'الطارق',87:'الأعلى',88:'الغاشية',89:'الفجر',90:'البلد',91:'الشمس',92:'الليل',93:'الضحى',94:'الشرح',95:'التين',96:'العلق',97:'القدر',98:'البينة',99:'الزلزلة',100:'العاديات',101:'القارعة',102:'التكاثر',103:'العصر',104:'الهمزة',105:'الفيل',106:'قريش',107:'الماعون',108:'الكوثر',109:'الكافرون',110:'النصر',111:'المسد',112:'الإخلاص',113:'الفلق',114:'الناس'};
const SRC=['islamic-12','arabic-12','figs']; // ملفات قد تحوي قرآنًا
const files=fs.readdirSync(path.join(ROOT,'content')).filter(f=>f.endsWith('.js')&&SRC.some(p=>f.startsWith(p)));
const out=[];
for(const f of files){
  const lines=fs.readFileSync(path.join(ROOT,'content',f),'utf8').split('\n');
  lines.forEach((ln,i)=>{
    const push=(text,ref)=>out.push({f,line:i+1,text:String(text),ref:ref||''});
    let m; const rp=/﴿([^﴾]{12,})﴾/g;
    while((m=rp.exec(ln))) push(m[1], (ln.match(/'((?:\S+:\d{1,3})|\(\d{1,3}\))'/)||[])[1]||'');
    const ra=/\bAY\(\s*'([^']{15,})'\s*,\s*'([^']*)'/g;
    while((m=ra.exec(ln))) push(m[1], m[2]);
    const rm=/kind:\s*'سورة'/;
    if(rm.test(ln)){ const ru=/'([^']{25,})\s*\((\d{1,3})\)'/g; while((m=ru.exec(ln))) push(m[1],'('+m[2]+')'); }
    else { const ru=/'([^']{30,}\s\(\d{1,3}\))'/g; while((m=ru.exec(ln))) if(/[ً-ْ]/.test(m[1])&&m[1].includes(' ﴿')) push(m[1],''); }
  });
}
// تحقق
const res=[];
for(const q of out){
  const key=(q.ref.match(/(\d{1,3})\s*[:：]\s*(\d{1,3})/)||[]).slice(1).join(':') || null;
  const frag=q.ref.match(/^\((\d{1,3})\)$/);
  const qn=norm(q.text);
  let verdict='?', why='', correct=null;
  if(key){
    let vt=null;
    for(const ed of EDS){const x=ed.v.find(v=>v.s==key.split(':')[0]&&v.a==key.split(':')[1]); if(x){vt=norm(x.t); correct=x.t; break;}}
    if(vt!==null){
      if(vt===qn||vt.includes(qn)||qn.includes(vt)) verdict='OK';
      else {
        const w=qn.split(' ').filter(x=>x.length>2), hit=w.filter(x=>vt.includes(x)).length;
        if(w.length&&hit/w.length>=0.9){verdict='OK';why='تذبذب تشكيل';}
        else {verdict='WRONG'; why='يطابق الآية المذكورة '+hit+'/'+w.length;}
      }
    } else verdict='NOREF';
  } else {
    let best=null;
    for(const ed of EDS) for(const v of ed.v){
      const vn=norm(v.t);
      if(vn.includes(qn)||qn.includes(vn)){best={v,full:true};break;}
      const w=qn.split(' ').filter(x=>x.length>2);
      const seq=(()=>{let h=0,c=0;for(const x of w){if(vn.includes(x)){c++;h=Math.max(h,c);}else c=0;}return h;})();
      const cov=w.filter(x=>vn.includes(x)).length/(w.length||1);
      if(w.length>=4&&cov>=0.85&&(!best||cov>best.cov)) best={v,cov,seq,w:w.length};
    }
    if(!best) verdict='NOTQURAN';
    else if(best.full) verdict='OK';
    else if(best.cov===1||(best.seq&&best.seq>=best.w-1)) verdict='OK';
    else {verdict='CHECK'; why='تطابق '+(best.seq||0)+'/'+best.w+' متسلسل، سورة '+best.v.s+':'+best.v.a; correct=best.v.t;}
  }
  if(verdict!=='OK') res.push({...q,verdict,why,key,correct});
}
const g={};res.forEach(r=>g[r.verdict]=(g[r.verdict]||0)+1);
console.log('ملفات مفحوصة:', files.length, '| اقتباسات:', out.length);
console.log('غير OK:', JSON.stringify(g));
console.log('');
for(const r of res){
  console.log('['+r.verdict+'] '+r.f+':'+r.line+(r.ref?' (مرجع '+r.ref+')':''));
  console.log('   نصّنا: '+r.text.slice(0,120));
  if(r.correct) console.log('   المصحف: '+String(r.correct).slice(0,120));
  if(r.why) console.log('   '+r.why);
  console.log('');
}
