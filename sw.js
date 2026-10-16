/* يحفظ ملفات التطبيق ليعمل بلا إنترنت. غيّر رقم الإصدار عند كل تحديث لتصل النسخة الجديدة. */
const CACHE = 'darb-v53';
const CORE = ['./', './index.html', 'content/guides-all-1.js', 'content/guides-all-2.js', 'content/guides-all-3.js', 'content/guides-all-4.js', 'content/guides-all-5.js', 'content/guides-all-6.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './content/h.js', './content/figs.js', './content/figs-3.js', './content/figs-2.js', './content/figs-4.js', './content/figs-5.js', './content/physics-12-c1.js', './content/physics-12-c1-more.js', './content/physics-12-c2.js', './content/physics-12-c2b.js', './content/physics-12-c2c.js', './content/physics-12-c2d.js', './content/chemistry-12-c1.js', './content/chemistry-12-c2.js', './content/chemistry-12-c3.js', './content/chemistry-12-c4.js', './content/chemistry-12-c5.js', './content/math-12-c1.js', './content/math-12-c2.js', './content/biology-12-c1.js', './content/arabic-12-u1.js', './content/islamic-12-u1.js', './content/english-12-u1.js', './content/english-12-u2.js', './content/chemistry-12-c6.js', './content/chemistry-12-c7.js', './content/chemistry-12-c8.js', './content/physics-12-c3.js', './content/physics-12-c4.js', './content/physics-12-c5.js', './content/math-12-c4.js', './content/math-12-c5.js', './content/biology-12-c2.js', './content/biology-12-c4.js', './content/biology-12-c5.js', './content/physics-12-c6.js', './content/physics-12-c7.js', './content/physics-12-c8.js', './content/physics-12-c9.js', './content/math-12-c3.js', './content/math-12-c6.js', './content/biology-12-c3.js', './content/arabic-12-u2.js', './content/arabic-12-u3.js', './content/arabic-12-u4.js', './content/arabic-12-u5.js', './content/arabic-12-u6.js', './content/english-12-u3.js', './content/english-12-u4.js', './content/english-12-u5.js', './content/islamic-12-u2.js', './content/islamic-12-u3.js', './content/islamic-12-u4.js', './content/islamic-12-u5.js', './content/ministerial-الفيزياء.js', './content/ministerial-الكيمياء.js', './content/ministerial-الأحياء.js', './content/ministerial-الرياضيات.js', './content/ministerial-اللغة الإنكليزية.js', './content/ministerial-التربية الإسلامية.js', './content/ministerial-الكيمياء-2.js', './content/ministerial-اللغة الإنكليزية-2.js', './content/ministerial-الرياضيات-2.js', './content/ministerial-الأحياء-2.js', './content/ministerial-الفيزياء-2.js', './content/ministerial-extracted-اللغة العربية.js', './content/ministerial-extracted-الأحياء.js', './content/ministerial-extracted-الرياضيات.js', './content/ministerial-extracted-الفيزياء.js', './content/guides-all-1.js', './content/guides-all-2.js', './content/guides-all-3.js', './content/guides-all-4.js', './content/guides-all-5.js', './content/guides-all-6.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && (k.startsWith('darb-') || k.startsWith('study-app-'))).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  /* الخطوط: من الذاكرة أولًا ثم الشبكة */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  /* ملفات التطبيق: الشبكة أولًا ليصل التحديث، والذاكرة عند انقطاع الإنترنت */
  e.respondWith(fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy));
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});
