const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1].split('?')[0]);
const specialties = {
  'basica-matematica': 257,
  'basica-ciencias': 138,
  'basica-historia': 130,
  'basica-ingles': 132,
  'basica-lenguaje': 110,
  'media-lengua': 97
};

// A deliberately small DOM facade for logic/integration tests, NOT a browser or
// visual/accessibility test. All storage, timers and network calls are isolated.
function element(id = '') {
  const classes = new Set();
  return {
    id, innerHTML: '', textContent: '', children: [], dataset: {},
    style: {setProperty() {}},
    classList: {
      add(...values) { values.forEach(value => classes.add(value)); },
      remove(...values) { values.forEach(value => classes.delete(value)); },
      contains(value) { return classes.has(value); },
      toggle(value, force) {
        const enabled = force ?? !classes.has(value);
        if (enabled) classes.add(value); else classes.delete(value);
        return enabled;
      }
    },
    append(...children) { this.children.push(...children); },
    appendChild(child) { this.append(child); return child; },
    prepend(...children) { this.children.unshift(...children); },
    querySelector() { return null; }, querySelectorAll() { return []; },
    setAttribute() {}, removeAttribute() {}, addEventListener() {},
    before() {}, after() {}, remove() {}, focus() {}
  };
}

function runtime(specialty = 'basica-matematica', options = {}) {
  const events = new Map(), timers = new Map(), intervals = new Map();
  let timerId = 0;
  const listen = (name, handler) => { if (!events.has(name)) events.set(name, []); events.get(name).push(handler); };
  const storage = options.storage || new Map();
  storage.set('pe_specialty_id', specialty);
  const elements = new Map([...html.matchAll(/id="([^"]+)"/g)].map(match => [match[1], element(match[1])]));
  const selectors = new Map();
  const document = {
    readyState: 'complete', body: element(), documentElement: element(),
    getElementById: id => elements.get(id) || null,
    createElement: () => element(), addEventListener: (name, handler) => listen('document:' + name, handler),
    querySelector: selector => selector === 'link[rel="manifest"]' ? element() :
      /^#[\w-]+$/.test(selector) ? elements.get(selector.slice(1)) || null : selectors.get(selector) || null,
    querySelectorAll: selector => selector === '.screen' ? [...elements.values()] : selectors.get(selector) || []
  };
  let seed = 301;
  const math = Object.create(Math);
  math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  const context = vm.createContext({
    console, URL, URLSearchParams, Blob, AbortController, crypto: require('node:crypto').webcrypto, Math: math, document,
    Date: options.clock ? class extends Date { constructor(...args) { super(...(args.length ? args : [options.clock.now])); } static now() { return options.clock.now; } } : Date,
    location: {origin: 'https://profeecep.test', href: 'https://profeecep.test/', reload() {}},
    navigator: {onLine: options.online ?? true, serviceWorker: {register: async () => ({})}},
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: key => storage.delete(key)
    },
    fetch: options.fetch || (async () => ({ok: true, json: async () => ({})})),
    setTimeout: (fn, delay) => { const id = ++timerId; timers.set(id, {fn, delay}); return id; },
    clearTimeout: id => timers.delete(id),
    setInterval: (fn, delay) => { const id = ++timerId; intervals.set(id, {fn, delay}); return id; },
    clearInterval: id => intervals.delete(id),
    addEventListener: listen, scrollTo() {}, alert: options.alert || (() => {}), confirm: options.confirm || (() => true)
  });
  context.window = context;
  const readSource = options.readSource || (file => fs.readFileSync(path.join(root, file), 'utf8'));
  for (const script of scripts) {
    vm.runInContext(readSource(script), context, {filename: script});
    options.afterScript?.(script, context);
  }
  return {context, document, elements, selectors, storage, timers, intervals,
    emit: (name, event = {}) => Promise.all((events.get(name) || []).map(fn => fn(event))),
    run: code => vm.runInContext(code, context)};
}

module.exports = {runtime, root, html, scripts, specialties, element};
