#!/usr/bin/env node
/* fig-overlap.cjs — يفحص كل الأشكال التفاعلية: هل النقاط تقع فوق نصوص SVG؟ */
'use strict';
const fs=require('fs'),path=require('path');
const ROOT='/Users/macbookair/Downloads/darb-main';
const files=fs.readdirSync(path.join(ROOT,'content')).filter(f=>/^figs(-\d)?\.js$/.test(f));
const F={};
for(const f of files){
  const src=fs.readFileSync(path.join(ROOT,'content',f),'utf8');
  const vm=require('vm');
  const sandbox={window:{},console};
  vm.createContext(sandbox);
  try{ vm.runInContext(src,sandbox,{timeout:8000}); }catch(e){ console.log('!! تعذّر تنفيذ '+f+': '+e.message); continue; }
  const FIGS=sandbox.window.FIGS||{};
  for(const [k,fig] of Object.entries(FIGS)) F[k]={...fig,file:f};
}
console.log('أشكال مُحمّلة:', Object.keys(F).length);
const bad=[];
for(const [k,fig] of Object.entries(F)){
  const svg=fig.svg||''; const parts=fig.parts||[];
  if(!parts.length) { bad.push({k,issue:'بلا نقاط تفاعلية',file:fig.file}); continue; }
  // استخراج نصوص svg مع إحداثياتها
  const texts=[];
  let m; const re=/<text[^>]*?x="([\d.]+)"[^>]*?y="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
  while((m=re.exec(svg))){ texts.push({x:+m[1],y:+m[2],t:m[3].replace(/<[^>]+>/g,'').trim().slice(0,40)}); }
  const re2=/<text[^>]*?y="([\d.]+)"[^>]*?x="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
  while((m=re2.exec(svg))){ if(!texts.some(t=>t.x==+m[2]&&t.y==+m[1])) texts.push({x:+m[2],y:+m[1],t:m[3].replace(/<[^>]+>/g,'').trim().slice(0,40)}); }
  // نصف قطر الزر بالوحدات: افتراض viewBox 340 عرضًا، زر 28px على عرض ~340px ⇒ ~28 وحدة
  const vb=(svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)||[]);
  const vw=+vb[1]||340, vh=+vb[2]||200;
  const R=28*vw/340; // نصف القطر المكافئ (14*scale*2)
  for(const p of parts){
    if(typeof p.x!=='number'||typeof p.y!=='number') continue;
    for(const t of texts){
      const d=Math.hypot(p.x-t.x,p.y-t.y);
      if(d<R && t.t) { bad.push({k,issue:'نقطة ('+p.x+','+p.y+') فوق نص «'+t.t+'» على بعد '+d.toFixed(0)+' وحدة',file:fig.file}); break; }
    }
  }
}
const byIssue={};
bad.forEach(b=>{ (byIssue[b.k]=byIssue[b.k]||[]).push(b.issue); });
console.log('أشكال بها تداخل:', Object.keys(byIssue).length);
for(const [k,v] of Object.entries(byIssue)){ console.log('■ '+k+'  ['+F[k].file+']'); v.forEach(x=>console.log('    - '+x)); }
