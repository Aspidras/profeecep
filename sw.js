const CACHE = 'profeecep-3.0.10';
const ASSETS = [
  "./reports-309.js?v=3.0.10",
  "./reports-309.css?v=3.0.10",
  "./bank-data-308.js?v=3.0.10",
  "./bank-308.js?v=3.0.10",
  "./assets/revision-308/308-categorias.svg?v=3.0.10",
  "./assets/revision-308/308-coord33.svg?v=3.0.10",
  "./assets/revision-308/308-coord35.svg?v=3.0.10",
  "./assets/revision-308/308-escala3.svg?v=3.0.10",
  "./assets/revision-308/308-escala4.svg?v=3.0.10",
  "./assets/revision-308/308-funcion-0.svg?v=3.0.10",
  "./assets/revision-308/308-funcion-1.svg?v=3.0.10",
  "./assets/revision-308/308-funcion-2.svg?v=3.0.10",
  "./assets/revision-308/308-funcion-3.svg?v=3.0.10",
  "./assets/revision-308/308-funcion-4.svg?v=3.0.10",
  "./assets/revision-308/308-funcion-5.svg?v=3.0.10",
  "./assets/revision-308/308-leyendas.svg?v=3.0.10",
  "./assets/revision-308/308-plano.svg?v=3.0.10",
  "./assets/revision-308/308-prestamos.svg?v=3.0.10",
  "./assets/revision-308/308-regiones.svg?v=3.0.10",
  "./assets/revision-308/308-tiposmapa.svg?v=3.0.10",

  "./bank-data-307.js?v=3.0.10",
  "./bank-307.js?v=3.0.10",
  "./bank-307.css?v=3.0.10",
  "./assets/audio-307/garden.mp3?v=3.0.10",
  "./assets/audio-307/station.mp3?v=3.0.10",
  "./assets/audio-307/cycling.mp3?v=3.0.10",
  "./assets/audio-307/museum.mp3?v=3.0.10",
  "./assets/original-307/comic-agua.svg?v=3.0.10",
  "./assets/original-307/comic-pantallas.svg?v=3.0.10",

  "./",
  "./index.html",
  "./manifest.json",
  "./styles.css?v=3.0.10",
  "./progress-22.js?v=3.0.10",
  "./sync-303.js?v=3.0.10",
  "./data.js?v=3.0.10",
  "./content-22.js?v=3.0.10",
  "./content-23.js?v=3.0.10",
  "./bank-28.js?v=3.0.10",
  "./bank-281.js?v=3.0.10",
  "./classify-285.js?v=3.0.10",
  "./app.js?v=3.0.10",
  "./auth.js?v=3.0.10",
  "./analytics-13.js?v=3.0.10",
  "./adaptive-14.js?v=3.0.10",
  "./planner-15.js?v=3.0.10",
  "./study-16.js?v=3.0.10",
  "./tutor-17.js?v=3.0.10",
  "./errors-18.js?v=3.0.10",
  "./motivation-19.js?v=3.0.10",
  "./specialties-20.js?v=3.0.10",
  "./simulator-21.js?v=3.0.10",
  "./experience-22.js?v=3.0.10",
  "./experience-23.js?v=3.0.10",
  "./diagnosis-24.js?v=3.0.10",
  "./plan-25.js?v=3.0.10",
  "./tutor-26.js?v=3.0.10",
  "./mobile-27.js?v=3.0.10",
  "./complete-28.js?v=3.0.10",
  "./bank-review-282.js?v=3.0.10",
  "./exam-283.js?v=3.0.10",
  "./editorial-284.js?v=3.0.10",
  "./tutor-285.js?v=3.0.10",
  "./bank-287.js?v=3.0.10",
  "./feedback-data-304.js?v=3.0.10",
  "./feedback-304.js?v=3.0.10",
  "./access-report-286.js?v=3.0.10",
  "./release-30.js?v=3.0.10",
  "./interface-302.js?v=3.0.10",
  "./continuity-303.js?v=3.0.10",
  "./interface-302.css?v=3.0.10",
  "./prior-data-305.js?v=3.0.10",
  "./prior-305.js?v=3.0.10",
  "./prior-data-306.js?v=3.0.10",
  "./prior-data-310.js?v=3.0.10",
  "./assets/prior-2023/media-310-campeonato.svg?v=3.0.10",
  "./assets/prior-2023/media-310-despedida.svg?v=3.0.10",
  "./assets/prior-2023/media-310-jornada.svg?v=3.0.10",
  "./assets/prior-2023/media-310-lapiz.svg?v=3.0.10",
  "./assets/prior-2023/media-310-regalos.svg?v=3.0.10",
  "./assets/prior-2023/media-310-sombra.svg?v=3.0.10",
  "./assets/prior-2023/historia-climograma.svg?v=3.0.10",
  "./assets/prior-2023/historia-perfil.svg?v=3.0.10",
  "./assets/prior-2023/historia-coberturas.svg?v=3.0.10",
  "./prior-305.css?v=3.0.10",
  "./assets/prior-2023/cylinders.svg?v=3.0.10",
  "./assets/prior-2023/force-options.svg?v=3.0.10",
  "./assets/prior-2023/glasses-comic.svg?v=3.0.10",
  "./assets/prior-2023/line-intercepts.svg?v=3.0.10",
  "./assets/prior-2023/osmosis.svg?v=3.0.10",
  "./assets/prior-2023/poetry-bridge.svg?v=3.0.10",
  "./assets/prior-2023/rectangle-products.svg?v=3.0.10",
  "./assets/prior-2023/square-angles.svg?v=3.0.10",
  "./assets/prior-2023/thermal-contact.svg?v=3.0.10",
  "./assets/prior-2023/transform-boundary.svg?v=3.0.10",
  "./assets/prior-2023/trapezoid.svg?v=3.0.10",
  "./assets/prior-2023/vehicle-bars.svg?v=3.0.10",
  "./assets/prior-2023/water-density.svg?v=3.0.10"
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
    if (cached) {
      const range = request.headers?.get('range');
      if (range && url.pathname.endsWith('.mp3')) {
        const bytes = await cached.arrayBuffer(), length = bytes.byteLength;
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (!match || (!match[1] && !match[2])) return new Response(null, {status:416,headers:{'Content-Range':'bytes */'+length}});
        const start = match[1] ? Number(match[1]) : Math.max(0,length-Number(match[2]));
        const end = match[1] && match[2] ? Math.min(Number(match[2]),length-1) : length-1;
        if (start > end || start >= length) return new Response(null, {status:416,headers:{'Content-Range':'bytes */'+length}});
        return new Response(bytes.slice(start,end+1), {status:206,headers:{'Content-Type':'audio/mpeg','Accept-Ranges':'bytes','Content-Length':String(end-start+1),'Content-Range':'bytes '+start+'-'+end+'/'+length}});
      }
      return cached;
    }
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone()).catch(() => {});
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
