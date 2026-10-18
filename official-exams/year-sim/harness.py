import subprocess, time, os, json, sys
from playwright.sync_api import sync_playwright
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
HERE=os.path.dirname(os.path.abspath(__file__))
_srv=None
def server(port=8765):
    global _srv
    if _srv: return
    _srv=subprocess.Popen(['python3','-m','http.server',str(port)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(1)
def launch(mobile=False, fixed_time=None, shim=None):
    server()
    p=sync_playwright().start()
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844} if mobile else {'width':1280,'height':800}, device_scale_factor=2 if mobile else 1, locale='ar-IQ', service_workers='block')
    pg=ctx.new_page()
    errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
    def froute(route):
        u=route.request.url
        # بلا إنترنت: الخطوط تُرفض بهدوء (المحاكاة منطقية لا بصرية)
        if 'fonts.googleapis' in u or 'fonts.gstatic' in u:
            return route.fulfill(body='', content_type='text/css')
        return route.continue_()
    ctx.route('**/*', froute)
    if fixed_time: pg.clock.install(time=fixed_time)
    if shim:
        pg.add_init_script('''(()=>{const R=Date;let OFF=(new R(%r)).getTime()-R.now();
        class D extends R{constructor(...a){if(a.length)super(...a);else super(R.now()+OFF);} static now(){return R.now()+OFF;}}
        D.UTC=R.UTC;D.parse=R.parse;window.Date=D;window.__setNow=t=>{OFF=(new R(t)).getTime()-R.now();};window.__addMs=ms=>{OFF+=ms;};})();''' % shim)
    pg.goto('http://localhost:8765/index.html')
    pg.wait_for_timeout(800)
    return p,b,pg,errs
def onboard(pg, name='حيدر', branch='sci', goal=95):
    pg.evaluate("""([n,b,g])=>{ if(!S.onb) startOnb(); const st=newStudent({name:n,grade:12,branch:b,start:'2026-10-01',minutes:120,goal:g}); DB.students.push(st); DB.activeId=st.id; flushSave(); S.onb=null; S.view='today'; S.stack=[]; render(true);}""",[name,branch,goal])
    pg.wait_for_timeout(300)
