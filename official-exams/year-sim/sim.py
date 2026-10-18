from harness import *
import json, datetime, sys, time
p,b,pg,errs=launch(mobile=False, shim='2026-10-01T16:00:00')
pg.add_init_script(path=os.path.join(HERE,'sim.js'))
pg.reload(); pg.wait_for_timeout(1500)
pg.evaluate("""()=>{ const st=newStudent({name:'طالب المحاكاة',grade:12,branch:'sci',start:'2026-10-01',minutes:120,goal:95}); DB.students.push(st); DB.activeId=st.id; flushSave(); S.onb=null; S.view='today'; S.stack=[]; render(true); }""")
d=datetime.date(2026,10,1); end=datetime.date(2027,6,12)
log=[]; n=0; subs=pg.evaluate("gradeContents(me().grade).map(y=>y.subject)")
mi=0; lastMonth=None; t0=time.time()
while d<=end:
    pg.evaluate(f"__setNow('{d.isoformat()}T16:00:00')")
    try: r=pg.evaluate(f"SIM.day({n})")
    except Exception as e:
        print('CRASH',d,str(e)[:400],flush=True); r={'d':d.isoformat(),'rest':False,'crash':str(e)[:300]}
        pg.evaluate("tabTo('today')")
    r['exams']=[]
    if not r['rest'] and not r.get('skipped'):
        if d.month!=lastMonth and d>=datetime.date(2026,11,1):
            lastMonth=d.month
            for s in subs:
                pct=pg.evaluate(f"SIM.runExam('monthly',{json.dumps(s)},15,Math.min(.93,.62+{n}*.0013),false)")
                r['exams'].append(['monthly',s,pct])
        if d>=datetime.date(2027,2,7) and d.weekday()==5:
            s=subs[mi%len(subs)]; mi+=1
            pct=pg.evaluate(f"SIM.runExam('ministerial',{json.dumps(s)},6,Math.min(.93,.62+{n}*.0013),true)")
            r['exams'].append(['ministerial-full',s,pct])
        n+=1
    if d.weekday()==6: pg.evaluate("SIM.tour()")
    r['done']=pg.evaluate("studyLine().length")
    r['pred']=pg.evaluate("evalStats().predicted")
    log.append(r)
    if d.day==1: print(d, 'left',r['done'],'pred',r['pred'], round(time.time()-t0), flush=True)
    d+=datetime.timedelta(days=1)
final=pg.evaluate("""()=>{const st=me(); const E=evalStats(); return {left:studyLine().length, total:E.total, done:E.done, pred:E.predicted, exams:(st.exams||[]).length, ministerial:Object.fromEntries(Object.entries(st.ministerial||{}).map(([k,v])=>[k,v.map(x=>x.pct)])), logN:(st.log||[]).length, storage:JSON.stringify(DB).length, subs:E.subs.map(s=>[s.subject,s.done,s.tot,s.pred])}}""")
issues=pg.evaluate("SIM.issues")
json.dump({'log':log,'final':final,'issues':issues,'errs':[e for e in errs if 'TUNNEL' not in e][:200]},open(os.path.join(HERE,'sim_out.json'),'w'),ensure_ascii=False,indent=1)
print('FINAL',json.dumps(final,ensure_ascii=False)); print('ISSUES',len(issues)); print('ERRS',len([e for e in errs if 'TUNNEL' not in e]))
