// ProfeECEP 2.8.6 — accesibilidad, calendario y reportes
(function () {
  'use strict';

  const prefKey = 'profeecep_accessibility';
  const defaults = {size: 'normal', contrast: false, dark: false, reduced: false};
  const state = () => (typeof S !== 'undefined' && S) ? S : {};
  const questions = () => (typeof Q !== 'undefined' && Array.isArray(Q)) ? Q : [];
  const domains = () => (typeof D !== 'undefined' && Array.isArray(D)) ? D : [];
  const percent = (right, total) => typeof pct === 'function'
    ? pct(right, total)
    : (total ? Math.round((right / total) * 100) : 0);

  function prefs() {
    try {
      return Object.assign({}, defaults, JSON.parse(localStorage.getItem(prefKey) || '{}'));
    } catch (_) {
      return Object.assign({}, defaults);
    }
  }

  function apply() {
    const p = prefs();
    const root = document.documentElement;
    root.classList.toggle('pe286-large', p.size === 'large');
    root.classList.toggle('pe286-xlarge', p.size === 'xlarge');
    root.classList.toggle('pe286-contrast', !!p.contrast);
    root.classList.toggle('pe286-dark', !!p.dark);
    root.classList.toggle('pe286-reduced', !!p.reduced);
  }

  function set(key, value) {
    const p = prefs();
    p[key] = value;
    localStorage.setItem(prefKey, JSON.stringify(p));
    apply();
    inject();
  }

  function countdown(date) {
    const target = new Date(String(date) + 'T12:00:00');
    return Math.max(0, Math.ceil((target - new Date()) / 86400000));
  }

  function reportData() {
    const current = state();
    const active = window.PE20 && typeof window.PE20.active === 'function'
      ? window.PE20.active()
      : {id: window.PE_ACTIVE_SPECIALTY || 'basica-matematica', short: 'Matemática'};
    const history = Array.isArray(current.history) ? current.history : [];
    const right = history.filter(item => item && item.ok).length;
    const byDomain = {};
    domains().forEach(domain => {
      const name = domain[0];
      const stats = (current.byDomain || {})[name] || {right: 0, total: 0};
      byDomain[name] = {
        right: stats.right || 0,
        total: stats.total || 0,
        precision: percent(stats.right || 0, stats.total || 0)
      };
    });
    const simulations = Array.isArray(current.simulations) ? current.simulations : [];
    return {
      generatedAt: new Date().toISOString(),
      specialty: active,
      questions: questions().length,
      answered: history.length,
      right,
      precision: percent(right, history.length),
      byDomain,
      coverage: window.PE281 && typeof window.PE281.coverage === 'function'
        ? window.PE281.coverage()
        : null,
      lastSimulation: simulations.length ? simulations[simulations.length - 1] : null,
      flagged: Object.keys(current.flaggedQuestions || {}).length,
      examDate: (current.plan && current.plan.examDate) || '2026-12-18'
    };
  }

  function download(format) {
    const data = reportData();
    let content;
    let type;
    let name;
    if (format === 'csv') {
      const rows = [
        ['Especialidad', data.specialty.short],
        ['Preguntas disponibles', data.questions],
        ['Respuestas registradas', data.answered],
        ['Precisión general', data.precision + '%'],
        ['Dominio', 'Correctas', 'Total', 'Precisión']
      ];
      Object.entries(data.byDomain).forEach(([domain, value]) => {
        rows.push([domain, value.right, value.total, value.precision + '%']);
      });
      content = rows.map(row => row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(',')).join('\n');
      type = 'text/csv;charset=utf-8';
      name = 'profeecep-informe.csv';
    } else {
      content = JSON.stringify(data, null, 2);
      type = 'application/json';
      name = 'profeecep-informe.json';
    }
    const blob = new Blob([content], {type});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 500);
  }

  function print() {
    const data = reportData();
    const popup = window.open('', '_blank');
    if (!popup) {
      alert('Permite ventanas emergentes para imprimir el informe.');
      return;
    }
    const rows = Object.entries(data.byDomain).map(([name, value]) =>
      '<tr><td>' + escapeHtml(name) + '</td><td>' + value.right + '</td><td>' +
      value.total + '</td><td>' + value.precision + '%</td></tr>'
    ).join('');
    popup.document.write(
      '<!doctype html><html lang="es"><head><title>Informe ProfeECEP</title>' +
      '<style>body{font-family:Arial,sans-serif;margin:32px;color:#14263a}' +
      'table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccd6e0;padding:8px;text-align:left}</style>' +
      '</head><body><h1>Informe ProfeECEP</h1><p><b>Especialidad:</b> ' +
      escapeHtml(data.specialty.name || data.specialty.short) + '</p><p><b>Precisión:</b> ' +
      data.precision + '% · <b>Respuestas:</b> ' + data.answered +
      '</p><table><tr><th>Dominio</th><th>Correctas</th><th>Total</th><th>Precisión</th></tr>' +
      rows + '</table><p>Generado el ' + new Date(data.generatedAt).toLocaleString('es-CL') +
      '</p></body></html>'
    );
    popup.document.close();
    popup.focus();
    popup.print();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
  }

  function inject() {
    apply();
    const current = state();
    const home = document.getElementById('home');
    const progress = document.getElementById('progress');

    if (home && !home.querySelector('.calendar286')) {
      const card = document.createElement('div');
      const date = (current.plan && current.plan.examDate) || '2026-12-18';
      card.className = 'card calendar286';
      card.innerHTML =
        '<span class="pill">Calendario ECEP 2.8.6</span><h3>Cuenta regresiva: ' +
        countdown(date) + ' día(s)</h3><p class="muted">Sesiones previstas: 18 y 19 de diciembre de 2026. ' +
        'Fecha configurada: ' + new Date(date + 'T12:00:00').toLocaleDateString('es-CL') +
        '.</p><div class="calendar286Links"><a href="https://www.evaluacionconocimientos.cl/" ' +
        'target="_blank" rel="noopener">Plataforma oficial ECEP</a><a href="https://www.cpeip.cl/sistema-reconocimiento/" ' +
        'target="_blank" rel="noopener">Información CPEIP</a></div>';
      const hero = home.querySelector('.hero');
      if (hero) hero.after(card);
      else home.prepend(card);
    }

    if (progress && !progress.querySelector('.access286')) {
      const card = document.createElement('div');
      const p = prefs();
      card.className = 'card access286';
      card.innerHTML =
        '<span class="pill">Accesibilidad 2.8.6</span><h3>Adapta la lectura</h3>' +
        '<p class="muted">Estas preferencias se guardan en este dispositivo.</p>' +
        '<div class="access286Grid">' +
        '<button class="mini" onclick="PE286.set(\'size\',\'normal\')">Tamaño normal</button>' +
        '<button class="mini" onclick="PE286.set(\'size\',\'large\')">Texto grande</button>' +
        '<button class="mini" onclick="PE286.set(\'size\',\'xlarge\')">Texto muy grande</button>' +
        '<button class="mini" onclick="PE286.set(\'contrast\',!PE286.prefs().contrast)">' +
        (p.contrast ? '✓ Alto contraste' : 'Alto contraste') + '</button>' +
        '<button class="mini" onclick="PE286.set(\'dark\',!PE286.prefs().dark)">' +
        (p.dark ? '✓ Modo claro' : 'Modo oscuro') + '</button>' +
        '<button class="mini" onclick="PE286.set(\'reduced\',!PE286.prefs().reduced)">' +
        (p.reduced ? '✓ Movimiento reducido' : 'Reducir movimiento') + '</button></div>';
      progress.prepend(card);
    }

    if (progress && !progress.querySelector('.report286')) {
      const data = reportData();
      const card = document.createElement('div');
      card.className = 'card report286';
      card.innerHTML =
        '<span class="pill">Informe 2.8.6</span><h3>Exporta tu avance</h3>' +
        '<p class="muted">Incluye respuestas, precisión, rendimiento por dominio, cobertura y último simulacro.</p>' +
        '<div class="report286Actions"><button class="btn" onclick="PE286.download(\'json\')">Descargar JSON</button>' +
        '<button class="btn ghost" onclick="PE286.download(\'csv\')">Descargar CSV</button>' +
        '<button class="btn ghost" onclick="PE286.print()">Imprimir informe</button></div>' +
        '<div class="tiny">' + data.answered + ' respuestas registradas · ' + data.precision +
        '% de precisión</div>';
      const anchor = progress.querySelector('.editorial284') || progress.querySelector('.bank282');
      if (anchor) anchor.after(card);
      else progress.prepend(card);
    }
  }

  apply();
  window.PE286 = {prefs, set, download, print, reportData, inject};
  const oldRender = window.render;
  if (oldRender && !window.__pe286) {
    window.render = function () {
      const result = oldRender();
      setTimeout(inject, 0);
      return result;
    };
    window.__pe286 = true;
  }
  setTimeout(inject, 0);
}());
