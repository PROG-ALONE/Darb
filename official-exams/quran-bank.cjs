#!/usr/bin/env node
/* quran-bank.cjs — فحص الاقتباسات القرآنية في كل المحتوى
   مرحلتان: (1) بحث مرن لأفضل آية مرجعية  (2) مقارنة صارمة كلمة بكلمة تُظهر الفروق الحقيقية */
'use strict';
const fs=require('fs'),path=require('path');
const ROOT='/Users/macbookair/Downloads/darb-main';

/* ── المصحف ── */
function load(f){try{const j=JSON.parse(fs.readFileSync(f,'utf8'));const o=[];for(const s of j.data.surahs)for(const a of s.ayahs)o.push({s:s.number,a:a.numberInSurah,t:a.text});return o;}catch(e){return[]}}
const ED=[load('/tmp/quran.json'),load('/tmp/quran2.json')].filter(x=>x.length);

/* ── تطبيع كلمة واحدة: إزالة التشكيل وتوحيد صور الهمزة والألف ── */
const STRIP=/[\u0610-\u061A\u064B-\u065F\u06D6-\u06E4\u06E7-\u06ED\u0640\u08D3-\u08E1\u08E3-\u08FF]/g;
/* الألف الناقصة (ٰ) تُصيَّر ألفًا كاملة لتطابق الكتابة العصرية في المحتوى */
const DAGGER=/\u0670/g;
const SMALLY=/\u06E5(?=[\u0621-\u064A\u0671])/g, SMALLK=/\u06E6(?=[\u0621-\u064A\u0671])/g;
/* ۥ/ۦ في آخر الكلمة (بِهِۦ / يُحْىِۦ / عِنْدَهُۥٓ) تُمحى؛ وسط الكلمة تُصيَّر و/ي */
const TAILSM=/[\u06E5\u06E6]/g;
function normW(w){
  /* إزالة التشكيل أولًا حتى تظهر ۥ/ۦ في وسط الكلمة متبوعة بحرف حقيقي (فَأْوُۥٓا ← فأووا) */
  let s=String(w).replace(/\u0640[\u0653\u0654\u0655]/g,'\u0621') /* الهمزة على ألفٍ مُقدَّرة: ـٔ ← ء */
    .replace(/\u0648\u0670\u0627/g,'\u0627') /* الرِّبَوٰا۟ العثماني ← الرِّبا */
    .replace(DAGGER,'\u0627').replace(STRIP,'')
    .replace(SMALLY,'\u0648').replace(SMALLK,'\u064A').replace(TAILSM,'');
  s=s.replace(/\u0622/g,'\u0621\u0627')  /* آ ← ء ا  */
     .replace(/\u0623/g,'\u0621')        /* أ ← ء    */
     .replace(/\u0625/g,'\u0621')        /* إ ← ء    */
     .replace(/\u0671/g,'\u0627')        /* ٱ ← ا    */
     .replace(/\u0624/g,'')              /* ؤ ← إسقاط حامل الهمزة */
     .replace(/\u0626/g,'')              /* ئ ← إسقاط حامل الهمزة */
     .replace(/(?:\u0649\u0627)(?=$|[^\u0621-\u064A\u0671])/g,'\u0649') /* ىا في آخر الكلمة ← ى (الهدىٰ) */
     .replace(/\u0649\u0627/g,'\u0627')   /* ىا وسط الكلمة ← ا (فتياكم) */
     .replace(/\u0635\u0644\u0648\u0627?[\u0647\u0629]/g,'\u0635\u0644\u0627\u0647') /* صلوه/صلوة ← صلاه */
     .replace(/\u0648?\u0635\u0644\u0627[\u0647\u0629]/g,'\u0648\u0635\u0644\u0627\u0647') /* وصلة/وِصلَة ← وصلاه */
     .replace(/\u0632\u0643\u0648\u0627?[\u0647\u0629]/g,'\u0632\u0643\u0627\u0647') /* زكوه/زكوة ← زكاه */
     .replace(/\u0647\u0627\u0630/g,'\u0647\u0630') /* هاذا ← هذا (همزة الوصل المعلّمة) */
     .replace(/\u064A\u064A/g,'\u064A')  /* يي ← ي (تحيي/تحيى) */
     .replace(/\u0649/g,'\u064A')        /* ى ← ي    */
     .replace(/\u0629/g,'\u0647')        /* ة ← ه    */
     .replace(/\u0621/g,'')              /* إسقاط الهمزة المجرّدة */
     .replace(/\u200E|\u200F|\uFEFF/g,'')
     .toLowerCase();
  if(s==='\u0627\u0644\u0644\u0647')s='\u0644\u0644\u0647'; /* الله ← لله (توحيد) */
  return s;
}
const words=s=>String(s).replace(/\u0640[\u0653\u0654\u0655]/g,'\u0621').replace(/\u0648\u0670\u0627/g,'\u0627').replace(DAGGER,'\u0627').replace(STRIP,'')
  .replace(SMALLY,'\u0648').replace(SMALLK,'\u064A').replace(TAILSM,'')
  .replace(/[^\u0621-\u064A\u0671a-zA-Z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
/* مفتاح فحص الضجيج: بلا ألفات ولا همزات + تسوية واو العطف ولام الجر */
const lk=s=>normW(s).replace(/\u0627/g,'').replace(/^\u0648/,'').replace(/^\u0644\u0644/,'\u0644');

function lev(a,b){const n=a.length,m=b.length;
  if(Math.abs(n-m)>2)return 9;
  let prev=new Array(m+1);for(let j=0;j<=m;j++)prev[j]=j;
  for(let i=1;i<=n;i++){const cur=new Array(m+1);cur[0]=i;
    for(let j=1;j<=m;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    prev=cur;}
  return prev[m];}
/* مطابقة مرنة (للعثور على المرجع) */
function fuzzy(a,b){a=normW(a);b=normW(b);
  if(a===b)return true;
  const mn=Math.min(a.length,b.length);
  if(mn===0||a[0]!==b[0])return false;
  return lev(a,b)<=(mn<=5?1:2);}
/* مطابقة صارمة (للتحقق النهائي) */
const strict=(a,b)=>normW(a)===normW(b);

/* ── المراجع: آيات + آيتان متجاورتان ── */
const VERSES=[];const seenV=new Set();
for(const ed of ED)for(const v of ed){const k=v.s+':'+v.a;if(seenV.has(k))continue;seenV.add(k);
  VERSES.push({key:k,s:v.s,a:v.a,t:v.t,w:words(v.t),nw:words(v.t).map(normW)});}
const BY={};VERSES.forEach(v=>{(BY[v.s]=BY[v.s]||[]).push(v);});
const REFS=VERSES.slice();
for(const k in BY){const arr=BY[k].sort((a,b)=>a.a-b.a);
  for(let i=0;i<arr.length-1;i++)REFS.push({key:k+':'+arr[i].a+'+'+(arr[i+1].a),s:+k,a:arr[i].a,
    t:arr[i].t+' | '+arr[i+1].t,w:[...arr[i].w,...arr[i+1].w],nw:[...arr[i].nw,...arr[i+1].nw]});}
const WIDX=new Map();
/* مفاتيح مرنة: الكلمة وصورتها بحذف واو العطف المزحومة (وَفَوْقَ ← فوق) */
const keys=w=>{const k=[w];if(w.length>=4&&w[0]==='\u0648')k.push(w.slice(1));return k;};
REFS.forEach((r,ix)=>{new Set(r.nw.filter(w=>w.length>=3)).forEach(w=>keys(w).forEach(k=>{
  let a=WIDX.get(k);if(!a){a=[];WIDX.set(k,a);}a.push(ix);}));});

/* أطول تسلسل كلمات متصل (مرن) + مداه في المرجع */
function contigSpan(a,b,eq){const n=a.length,m=b.length;
  let best=0,bs=0,be=0;
  let prev=new Int32Array(m+1);
  for(let i=1;i<=n;i++){const cur=new Int32Array(m+1);
    for(let j=1;j<=m;j++)cur[j]=eq(a[i-1],b[j-1])?prev[j-1]+1:0;
    for(let j=0;j<=m;j++)if(cur[j]>best){best=cur[j];bs=j-cur[j];be=j;}
    prev=cur;}
  return {len:best,s:bs,e:be};}
function contigN(a,b,eq){return contigSpan(a,b,eq).len;}

/* محاذاة صارمة: تُرجع عمليات داخلية فقط */
function strictDiff(qw,rw){
  const n=qw.length,m=rw.length;
  const dp=Array.from({length:n+1},()=>new Int32Array(m+1));
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)
    dp[i][j]=strict(qw[i-1],rw[j-1])?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  let i=n,j=m;const ops=[];
  while(i>0&&j>0){
    if(strict(qw[i-1],rw[j-1])){ops.push({t:'eq'});i--;j--;}
    else if(dp[i-1][j]>=dp[i][j]){ops.push({t:'m',q:qw[i-1]});i--;}
    else {ops.push({t:'e',r:rw[j-1]});j--;}}
  while(i>0){ops.push({t:'m',q:qw[i-1]});i--;}
  while(j>0){ops.push({t:'e',r:rw[j-1]});j--;}
  ops.reverse();
  const first=ops.findIndex(o=>o.t==='eq');
  const last=ops.length-1-[...ops].reverse().findIndex(o=>o.t==='eq');
  if(first<0)return [{m:qw,e:rw}];
  const mid=ops.slice(first,last+1);
  /* تجميع تشغيلات متتالية م+ه → تشخيص */
  const runs=[];let cur=null;
  for(const o of mid){
    if(o.t==='eq'){if(cur){runs.push(cur);cur=null;}continue;}
    if(!cur)cur={m:[],e:[]};
    if(o.t==='m')cur.m.push(o.q); else cur.e.push(o.r);
  }
  if(cur)runs.push(cur);
  return runs.filter(r=>{
    /* ضجيج التقطيع/الألفات: النصوص متطابقة بعد الدمج والتسوية */
    const a=lk(r.m.join('')), b=lk(r.e.join(''));
    return !(a===b);
  });
}

/* ── استخراج الاقتباسات ── */
const SKIP=/^(math|physics|chemistry|english|biology|guides)/;
const files=fs.readdirSync(path.join(ROOT,'content')).filter(f=>f.endsWith('.js')&&!SKIP.test(f));
const found=[];
for(const f of files){
  const raw=fs.readFileSync(path.join(ROOT,'content',f),'utf8');
  raw.split('\n').forEach((ln,i)=>{
    let m;
    const push=(t,kind)=>{t=String(t||'').trim();
      if(!t||words(t).length<3)return;
      if(/[،؛:\u061F\[\']/.test(t))return;      /* نثر أو مثال إعرابي أو مصفوفة إجابات */
      if(/_{4,}/.test(t))return;                   /* سؤال فراغ إجاباته تُفحص يدويًا */
      found.push({f,line:i+1,t,kind});};
    const rp=/﴿([^﴾]{15,600})﴾/g; while((m=rp.exec(ln))) push(m[1],'قرآن');
    const rq=/\bAY\(\s*'([^']{15,600})'/g; while((m=rq.exec(ln))) push(m[1],'قرآن');
    const rc=/قال\s*(?:تعالى|الله)[:：]?\s*[("﴿]([^"﴿﴾)]{15,400})["﴾)]/g; while((m=rc.exec(ln))) push(m[1],'قرآن');
    const ra=/(?:الآية|آية[^:：]{0,40})[:：]\s*[("﴿]([^"﴿﴾)]{15,400})["﴾)]/g; while((m=ra.exec(ln))) push(m[1],'قرآن');
    const rd=/\(([^()]{20,400}?)\)/g; while((m=rd.exec(ln))){
      const sh=(m[1].match(/[ً-ْ]/g)||[]).length;
      if(sh>=6){
        let pre=ln.slice(Math.max(0,m.index-90),m.index);
        const cut=Math.max(pre.lastIndexOf(')'),pre.lastIndexOf('﴾'));
        if(cut>=0)pre=pre.slice(cut+1);   /* سياق ما قبل هذا القوس فقط */
        const hadith=/ﷺ|حديث|عائشة/.test(pre);
        const quranic=/قال\s*تعالى|قال\s*الله|آية|الآية|﴿|القرآن|نزل|سورة|قوله/.test(pre);
        push(m[1],hadith?'مرجع':(quranic?'قرآن':'مرجع'));
      }
    }
  });
}

/* ── التحقق ── */
const rows=[];const seen=new Set();
for(const q of found){
  const sig=q.f+'|'+normW(words(q.t).join(' ')).slice(0,60);
  if(seen.has(sig))continue; seen.add(sig);
  const hasElide=/\.{2,}|…|۝/.test(q.t);
  const segs=q.t.split(/(?:\.{2,}|…|۝)/).map(s=>s.trim()).filter(s=>words(s).length>=3);
  if(!segs.length)continue;
  const detail=[];
  for(const seg of segs){
    const qw=words(seg);
    /* ترشيح مرشحين */
    const votes=new Map();
    new Set(qw.map(normW).filter(w=>w.length>=3)).forEach(w=>{
      const hit=new Set();keys(w).forEach(k=>{const a=WIDX.get(k);if(a)a.forEach(ix=>hit.add(ix));});
      hit.forEach(ix=>votes.set(ix,(votes.get(ix)||0)+1));});
    let pool=[...votes.entries()].sort((x,y)=>y[1]-x[1]);
    const thr=Math.max(2,Math.ceil(qw.length*0.5));
    let cands=pool.filter(([,c])=>c>=thr).slice(0,200);
    if(!cands.length)cands=pool.slice(0,400);
    let best=null,bestSp=null;
    for(const [ix] of cands){
      const r=REFS[ix];
      const sp=contigSpan(qw,r.nw,fuzzy);
      const cov=sp.len/qw.length;
      if(!best||cov>best.cov||(cov===best.cov&&r.w.length<best.r.w.length)){best={r,cov};bestSp=sp;}
    }
    if(!best){detail.push({seg,best:null,runs:[{m:qw,e:[]}]});continue;}
    /* امتداد للآيات المتعددة */
    if(best.cov<0.999&&!best.r.key.includes('+')&&best.r.s){
      const arr=BY[best.r.s]||[];
      for(let start=best.r.a-3;start<=best.r.a+1;start++){
        const wv=arr.filter(v=>v.a>=start&&v.a<start+5).sort((x,y)=>x.a-y.a);
        if(wv.length<2)continue;
        const nw=[].concat(...wv.map(v=>v.nw)), w=[].concat(...wv.map(v=>v.w));
        const sp=contigSpan(qw,nw,fuzzy);
        const cov=sp.len/qw.length;
        if(cov>best.cov){best={r:{key:best.r.s+':'+wv[0].a+'-'+wv[wv.length-1].a,t:wv.map(v=>v.t).join(' | '),w,nw,s:best.r.s,a:wv[0].a},cov};bestSp=sp;}
      }
    }
    /* نافذة المقارنة: عند تغطية كاملة تُؤخذ النافذة المطابقة حرفيًا
       (وإلا تظهر فروق محاذاة زائفة من الكلمات المكرّرة) */
    let win=best.r.w;
    if(bestSp&&best.cov>=0.999){
      win=best.r.w.slice(bestSp.s,bestSp.s+qw.length);
      if(!win.length)win=best.r.w;
    }else if(bestSp&&best.cov>=0.5){
      const a0=Math.max(0,bestSp.s-1);
      win=best.r.w.slice(a0,a0+qw.length+5);
      if(!win.length)win=best.r.w;
    }
    const runs=strictDiff(qw,win);
    if(runs.length)detail.push({seg,best,runs});
  }
  rows.push({q,hasElide,detail,ok:!detail.length});
}
const bad=rows.filter(r=>!r.ok&&!r.hasElide);
const elided=rows.filter(r=>!r.ok&&r.hasElide);
const MUST=['قرآن'];
const mustQuran=r=>MUST.includes(r.q.kind);
const isHadith=r=>r.detail.every(d=>!d.best||d.best.cov<0.45);
const realBad=bad.filter(r=>mustQuran(r)||!isHadith(r));
const hadith=bad.filter(r=>!mustQuran(r)&&isHadith(r));
console.log('اقتباسات فريدة:',rows.length,'| ✅ مطابقة:',rows.filter(r=>r.ok).length,
  '| ⚠️ بحذف:',elided.length,'| ❌ فروق:',bad.length);
console.log('   → قرآن/مرجع قرآن بفروق:',realBad.length,' | أحاديث/نثر:',hadith.length);
console.log('');
console.log('═══════ ❌ فروق في نص قرآني ('+realBad.length+') ═══════');
console.log('');
for(const b of realBad){
  console.log('■ '+b.q.f+':'+b.q.line+'  ['+b.q.kind+']');
  console.log('  نصّنا : '+b.q.t.replace(/\s+/g,' ').slice(0,170));
  b.detail.forEach(d=>{
    console.log('  المرجع: '+(d.best?('س'+d.best.r.key+' تغطية '+(d.best.cov*100).toFixed(0)+'%'):'لا مرجع'));
    d.runs.forEach(r=>{
      console.log('    ✂ فرق : «'+r.m.join(' ')+'»  ⟷  «'+r.e.join(' ')+'»');
    });
  });
  console.log('');
}
console.log('════════ ⚠️ اقتباس فيه حذف (...) ('+elided.length+') ════════');
elided.forEach(b=>{console.log('  '+b.q.f+':'+b.q.line+' — '+b.q.t.replace(/\s+/g,' ').slice(0,110));});
console.log('');
console.log('════════ أحاديث/نثر — يُراجَع بالسند لا بالمصحف ('+hadith.length+') ════════');
hadith.slice(0,60).forEach(b=>{console.log('  '+b.q.f+':'+b.q.line+' — '+b.q.t.replace(/\s+/g,' ').slice(0,80));});
