const CACHE = 'profeecep-3.0.5';
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./styles.css?v=3.0.5",
  "./progress-22.js?v=3.0.5",
  "./sync-303.js?v=3.0.5",
  "./data.js?v=3.0.5",
  "./content-22.js?v=3.0.5",
  "./content-23.js?v=3.0.5",
  "./bank-28.js?v=3.0.5",
  "./bank-281.js?v=3.0.5",
  "./classify-285.js?v=3.0.5",
  "./app.js?v=3.0.5",
  "./auth.js?v=3.0.5",
  "./analytics-13.js?v=3.0.5",
  "./adaptive-14.js?v=3.0.5",
  "./planner-15.js?v=3.0.5",
  "./study-16.js?v=3.0.5",
  "./tutor-17.js?v=3.0.5",
  "./errors-18.js?v=3.0.5",
  "./motivation-19.js?v=3.0.5",
  "./specialties-20.js?v=3.0.5",
  "./simulator-21.js?v=3.0.5",
  "./experience-22.js?v=3.0.5",
  "./experience-23.js?v=3.0.5",
  "./diagnosis-24.js?v=3.0.5",
  "./plan-25.js?v=3.0.5",
  "./tutor-26.js?v=3.0.5",
  "./mobile-27.js?v=3.0.5",
  "./complete-28.js?v=3.0.5",
  "./bank-review-282.js?v=3.0.5",
  "./exam-283.js?v=3.0.5",
  "./editorial-284.js?v=3.0.5",
  "./tutor-285.js?v=3.0.5",
  "./bank-287.js?v=3.0.5",
  "./feedback-data-304.js?v=3.0.5",
  "./feedback-304.js?v=3.0.5",
  "./access-report-286.js?v=3.0.5",
  "./release-30.js?v=3.0.5",
  "./interface-302.js?v=3.0.5",
  "./continuity-303.js?v=3.0.5",
  "./interface-302.css?v=3.0.5",
  "./prior-data-305.js?v=3.0.5",
  "./prior-305.js?v=3.0.5",
  "./prior-305.css?v=3.0.5",
  "./assets/prior-2023/cylinders.svg?v=3.0.5",
  "./assets/prior-2023/force-options.svg?v=3.0.5",
  "./assets/prior-2023/glasses-comic.svg?v=3.0.5",
  "./assets/prior-2023/line-intercepts.svg?v=3.0.5",
  "./assets/prior-2023/osmosis.svg?v=3.0.5",
  "./assets/prior-2023/poetry-bridge.svg?v=3.0.5",
  "./assets/prior-2023/rectangle-products.svg?v=3.0.5",
  "./assets/prior-2023/square-angles.svg?v=3.0.5",
  "./assets/prior-2023/thermal-contact.svg?v=3.0.5",
  "./assets/prior-2023/transform-boundary.svg?v=3.0.5",
  "./assets/prior-2023/trapezoid.svg?v=3.0.5",
  "./assets/prior-2023/vehicle-bars.svg?v=3.0.5",
  "./assets/prior-2023/water-density.svg?v=3.0.5"
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
  // Only the application document can fall back to cached HTML.
  const navigation = request.mode === 'navigate' && ['./', './index.html'].some(path => new URL(path, self.location.href).pathname === url.pathname);
  if (!navigation && !assetURLs.has(url.href)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (navigation) {
      try {
        const response = await fetch(request);
        if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
          const html = await response.clone().text();
          // Keep the offline document paired with this worker's cached assets.
          if (html.includes('name="profeecep-version" content="' + CACHE.slice('profeecep-'.length) + '"')) {
            await cache.put('./index.html', response.clone()).catch(() => {});
          }
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
