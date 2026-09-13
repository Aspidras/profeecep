const CACHE='profeecep-2.8.7';
const ASSETS=['./','./index.html','./styles.css','./app.js','./data.js','./progress-22.js','./content-22.js','./content-23.js','./bank-28.js','./bank-281.js','./classify-285.js','./plan-25.js','./tutor-26.js','./mobile-27.js','./complete-28.js','./bank-review-282.js','./exam-283.js','./editorial-284.js','./tutor-285.js','./bank-287.js','./access-report-286.js','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match('./index.html'))))});
