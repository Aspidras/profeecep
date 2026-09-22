const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {root, html, scripts} = require('./helpers/runtime.cjs');

function worker() {
  const origin = 'https://profeecep.test', events = {}, stores = new Map();
  const state = {htmlVersion: null, offline: false, networkCalls: 0, claimed: false, installed: false};
  const key = request => new URL(typeof request === 'string' ? request : request.url, origin + '/sw.js').href;
  const network = async request => {
    state.networkCalls++;
    if (state.offline) throw new Error('offline (test)');
    const url = new URL(key(request));
    const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const type = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : file.endsWith('.svg') ? 'image/svg+xml' : 'text/plain';
    let body = fs.readFileSync(path.join(root, file), 'utf8');
    if (type === 'text/html' && state.htmlVersion) body = body.replaceAll('3.0.6', state.htmlVersion);
    return new Response(body, {headers: {'content-type': type}});
  };
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async addAll(urls) { for (const url of urls) store.set(key(url), await network(url)); },
        async match(request) { return store.get(key(request))?.clone(); },
        async put(request, response) { store.set(key(request), response.clone()); }
      };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); }
  };
  const context = vm.createContext({
    URL, Response, caches, fetch: network,
    self: {
      location: {origin, href: origin + '/sw.js'},
      addEventListener: (name, handler) => events[name] = handler,
      skipWaiting: async () => state.installed = true,
      clients: {claim: async () => state.claimed = true}
    }
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), context);
  const lifecycle = async name => {
    let promise;
    events[name]({waitUntil(value) { promise = value; }});
    await promise;
  };
  const request = (url, options = {}) => {
    let response;
    events.fetch({request: {url: key(url), method: 'GET', mode: 'same-origin', ...options}, respondWith(value) { response = value; }});
    return response;
  };
  return {state, stores, caches, request, lifecycle, key, run: code => vm.runInContext(code, context)};
}

test('3.0.6: precaché coincide exactamente con los scripts y estilos versionados', async () => {
  const sw = worker();
  await sw.lifecycle('install');
  assert.equal(sw.state.installed, true);
  const assets = new Set(sw.run('ASSETS').map(sw.key));
  for (const [, url] of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]+)?)"/g)) {
    assert.ok(assets.has(sw.key(url)), url + ' debe estar disponible sin conexión');
  }
  assert.equal(sw.run('CACHE'), 'profeecep-3.0.6');
  assert.match(html, /name="profeecep-version" content="3.0.6"/);
});

test('3.0.6: todos los scripts cargan desde caché sin devolver HTML', async () => {
  const sw = worker();
  await sw.lifecycle('install');
  sw.state.offline = true;
  const calls = sw.state.networkCalls;
  for (const file of scripts) {
    const response = await sw.request(file + '?v=3.0.6');
    assert.match(response.headers.get('content-type'), /javascript/);
    assert.equal(await response.text(), fs.readFileSync(path.join(root, file), 'utf8'));
  }
  assert.equal(sw.state.networkCalls, calls);
});

test('3.0.6: HTML offline se limita a navegaciones; no intercepta API ni recursos desconocidos', async () => {
  const sw = worker();
  await sw.lifecycle('install');
  sw.state.offline = true;
  assert.match(await (await sw.request('/', {mode: 'navigate'})).text(), /profeecep-version/);
  assert.equal(sw.request('/api/config'), undefined);
  assert.equal(sw.request('/api/config', {method: 'POST'}), undefined);
  assert.equal(sw.request('/missing.js'), undefined);
  assert.equal(sw.request('https://another.test/data.js?v=3.0.6'), undefined);
  sw.stores.get(sw.run('CACHE')).delete(sw.key('release-30.js?v=3.0.6'));
  assert.equal((await sw.request('release-30.js?v=3.0.6')).type, 'error');
});

test('3.0.6: activa su caché y conserva recursos de otras aplicaciones', async () => {
  const sw = worker();
  await sw.caches.open('profeecep-3.0');
  await sw.caches.open('another-app');
  await sw.lifecycle('install');
  await sw.lifecycle('activate');
  assert.deepEqual(await sw.caches.keys(), ['another-app', 'profeecep-3.0.6']);
  assert.equal(sw.state.claimed, true);
});

test('3.0.6: todos los scripts clásicos tienen sintaxis válida', () => {
  for (const file of [...scripts, 'sw.js']) {
    assert.doesNotThrow(() => new vm.Script(fs.readFileSync(path.join(root, file), 'utf8'), {filename: file}));
  }
});


test('actualización interrumpida conserva HTML compatible con sus recursos offline', async () => {
  const sw = worker(); await sw.lifecycle('install'); sw.state.htmlVersion = '3.0.7';
  assert.match(await (await sw.request('/', {mode: 'navigate'})).text(), /content="3.0.7"/);
  sw.state.offline = true;
  assert.match(await (await sw.request('/', {mode: 'navigate'})).text(), /content="3.0.6"/);
  assert.equal(sw.request('/api/config', {mode: 'navigate'}), undefined);
  assert.equal(sw.request('/not-an-app-page', {mode: 'navigate'}), undefined);
});


test('3.0.6: los dieciséis recursos visuales cargan sin conexión con su contenido SVG', async () => {
  const sw=worker();await sw.lifecycle('install');sw.state.offline=true;
  const calls=sw.state.networkCalls;
  const figures=sw.run('ASSETS').filter(asset=>asset.includes('/prior-2023/'));
  assert.equal(figures.length,16);
  for(const asset of figures){
    const response=await sw.request(asset);
    assert.equal(response.headers.get('content-type'),'image/svg+xml');
    assert.match(await response.text(),/<svg/);
  }
  assert.equal(sw.state.networkCalls,calls);
});
