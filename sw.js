const CACHE = 'profeecep-3.0.2';
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./styles.css?v=3.0.2",
  "./progress-22.js?v=3.0.2",
  "./data.js?v=3.0.2",
  "./content-22.js?v=3.0.2",
  "./content-23.js?v=3.0.2",
  "./bank-28.js?v=3.0.2",
  "./bank-281.js?v=3.0.2",
  "./classify-285.js?v=3.0.2",
  "./app.js?v=3.0.2",
  "./auth.js?v=3.0.2",
  "./analytics-13.js?v=3.0.2",
  "./adaptive-14.js?v=3.0.2",
  "./planner-15.js?v=3.0.2",
  "./study-16.js?v=3.0.2",
  "./tutor-17.js?v=3.0.2",
  "./errors-18.js?v=3.0.2",
  "./motivation-19.js?v=3.0.2",
  "./specialties-20.js?v=3.0.2",
  "./simulator-21.js?v=3.0.2",
  "./experience-22.js?v=3.0.2",
  "./experience-23.js?v=3.0.2",
  "./diagnosis-24.js?v=3.0.2",
  "./plan-25.js?v=3.0.2",
  "./tutor-26.js?v=3.0.2",
  "./mobile-27.js?v=3.0.2",
  "./complete-28.js?v=3.0.2",
  "./bank-review-282.js?v=3.0.2",
  "./exam-283.js?v=3.0.2",
  "./editorial-284.js?v=3.0.2",
  "./tutor-285.js?v=3.0.2",
  "./bank-287.js?v=3.0.2",
  "./access-report-286.js?v=3.0.2",
  "./release-30.js?v=3.0.2",
  "./interface-302.js?v=3.0.2",
  "./interface-302.css?v=3.0.2"
];
const assetURLs = new Set(ASSETS.map(path => new URL(path, self.location.href).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('profeecep-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Configuration, APIs and unknown resources are never cached or replaced by HTML.
  if (request.mode !== 'navigate' && !assetURLs.has(url.href)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
          await cache.put('./index.html', response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        return (await cache.match('./index.html')) || Response.error();
      }
    }
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone()).catch(() => {});
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
