// ProfeECEP 3.0.1 — comprobaciones estructurales, no certificación editorial
(function () {
  'use strict';

  const fallbackRegistry = [
    {id: 'basica-matematica', name: 'Educación Básica Matemática', short: 'Matemática'},
    {id: 'basica-ciencias', name: 'Educación Básica Ciencias Naturales', short: 'Ciencias Naturales'},
    {id: 'basica-historia', name: 'Educación Básica Historia, Geografía y Ciencias Sociales', short: 'Historia y Geografía'},
    {id: 'basica-ingles', name: 'Educación Básica Inglés', short: 'Inglés'},
    {id: 'basica-lenguaje', name: 'Educación Básica Lenguaje y Comunicación', short: 'Lenguaje'},
    {id: 'media-lengua', name: 'Educación Media Lengua y Literatura', short: 'Lengua y Literatura'}
  ];

  const registry = () => {
    const rows = window.PE20 && Array.isArray(window.PE20.registry) ? window.PE20.registry : [];
    return rows.length ? rows : fallbackRegistry;
  };

  function questionList(specialtyId) {
    if (specialtyId === window.PE_ACTIVE_SPECIALTY && Array.isArray(window.QBANK)) return window.QBANK;
    const content = window.PE22_CONTENT && window.PE22_CONTENT[specialtyId];
    if (content && Array.isArray(content.questions)) return content.questions;
    // A partial expansion is not the full Mathematics bank when inactive.
    return null;
  }

  function inspectQuestions(rows) {
    const issues = [], ids = new Set(), texts = new Set();
    rows.forEach((question, index) => {
      const label = 'Pregunta ' + (index + 1);
      if (!question || typeof question.q !== 'string' || !question.q.trim()) issues.push(label + ': falta el enunciado');
      if (!question || !Array.isArray(question.o) || question.o.length !== 4) issues.push(label + ': debe tener cuatro alternativas');
      if (!question || !Number.isInteger(question.a) || question.a < 0 || !Array.isArray(question.o) || question.a >= question.o.length) issues.push(label + ': respuesta correcta inválida');
      if (!question || typeof question.e !== 'string' || !question.e.trim()) issues.push(label + ': falta la explicación');
      if (!question || !question.id) issues.push(label + ': falta el identificador');
      if (question && question.id) {
        const id = String(question.id).trim();
        if (ids.has(id)) issues.push(label + ': identificador duplicado (' + id + ')');
        ids.add(id);
      }
      if (question && typeof question.q === 'string' && question.q.trim()) {
        const normalized = question.q.trim().toLocaleLowerCase('es');
        if (texts.has(normalized)) issues.push(label + ': enunciado duplicado');
        texts.add(normalized);
      }
    });
    return {count: rows.length, issues, valid: rows.length > 0 && issues.length === 0};
  }

  function status() {
    const specialties = registry().map(item => {
      const rows = questionList(item.id), loaded = Array.isArray(rows);
      const result = loaded ? inspectQuestions(rows) : {count: null, issues: [], valid: false};
      return {...item, ...result, loaded};
    });
    const loaded = specialties.filter(item => item.loaded);
    const contentReady = loaded.length > 0 && loaded.every(item => item.valid);
    const checks = [
      {label: 'Seis especialidades registradas', ok: specialties.length === 6},
      {label: 'Estructura de los bancos cargados', ok: contentReady},
      {label: 'Funciones de guardado cargadas', ok: !!(window.PE_PROGRESS && typeof window.PE_PROGRESS.load === 'function' && typeof window.PE_PROGRESS.save === 'function')},
      {label: 'Manifiesto enlazado', ok: !!document.querySelector('link[rel="manifest"]')},
      {label: 'Navegador compatible con caché offline', ok: 'serviceWorker' in navigator},
      {label: 'Motor de navegación cargado', ok: typeof window.render === 'function'}
    ];
    return {
      version: '3.0.1',
      specialties,
      checks,
      totalQuestions: loaded.reduce((sum, item) => sum + item.count, 0),
      activeQuestions: questionList(window.PE_ACTIVE_SPECIALTY)?.length || 0,
      partial: loaded.length !== specialties.length,
      issueCount: specialties.reduce((sum, item) => sum + item.issues.length, 0),
      ready: checks.every(check => check.ok),
      online: navigator.onLine !== false
    };
  }

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function closeStatus() {
    document.querySelector('.pe30-backdrop')?.remove();
  }

  function openStatus() {
    closeStatus();
    const report = status();
    const backdrop = node('div', 'pe30-backdrop');
    const dialog = node('section', 'pe30-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'pe30-title');
    const header = node('header');
    const heading = node('div');
    const pill = node('span', 'release30badge' + (report.ready ? '' : ' warn'), report.ready ? 'Estructura comprobada' : 'Revisar estructura');
    const title = node('b', '', 'Estado de ProfeECEP 3.0.1');
    title.id = 'pe30-title';
    heading.append(pill, title);
    const close = node('button', 'pe30-close', '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Cerrar'); close.onclick = closeStatus;
    header.append(heading, close); dialog.append(header);

    report.specialties.forEach(item => {
      const row = node('div', 'pe30-row');
      row.append(node('span', item.valid ? 'pe30-ok' : 'pe30-warn', item.valid ? '✓' : '!'));
      const copy = node('div');
      copy.append(node('strong', '', item.name), node('small', '', !item.loaded ? 'Selecciona esta especialidad para comprobar su banco completo' : item.valid ? 'Estructura válida; revisión editorial independiente' : item.issues.length + ' observación(es)'));
      row.append(copy, node('span', 'pe30-count', item.loaded ? item.count + ' preguntas' : 'No cargado'));
      if (item.issues.length) {
        const list = node('ul', 'pe30-issues');
        item.issues.slice(0, 5).forEach(issue => list.append(node('li', '', issue)));
        if (item.issues.length > 5) list.append(node('li', '', 'Y ' + (item.issues.length - 5) + ' observaciones más.'));
        row.append(list);
      }
      dialog.append(row);
    });

    const checks = node('div', 'pe30-checks');
    report.checks.forEach(check => {
      const row = node('div', 'pe30-check');
      row.append(node('span', '', check.label), node('b', check.ok ? 'pe30-ok' : 'pe30-warn', check.ok ? 'Correcto' : 'Revisar'));
      checks.append(row);
    });
    dialog.append(checks);
    dialog.append(node('p', 'pe30-foot', 'Esta comprobación estructural no certifica la calidad pedagógica, la instalación ni el funcionamiento sin conexión. La revisión editorial y las microlecciones pendientes siguen identificadas. El contador de días permanece oculto.'));
    backdrop.append(dialog);
    backdrop.addEventListener('click', event => { if (event.target === backdrop) closeStatus(); });
    document.body.append(backdrop); close.focus();
  }

  function inject() {
    const home = document.getElementById('home');
    if (!home) return;
    const pill = home.querySelector('.hero .pill');
    if (pill) pill.textContent = 'ProfeECEP 3.0.1';
    if (home.querySelector('.release30home')) return;
    const report = status(), card = node('div', 'card release30home');
    const hero = node('div', 'release30hero'), copy = node('div');
    copy.append(node('h3', '', 'ProfeECEP 3.0.1'), node('p', 'muted', 'Simulacros sin preguntas repetidas y estudio vinculado al indicador elegido.'));
    hero.append(copy, node('span', 'release30badge' + (report.ready ? '' : ' warn'), report.ready ? 'Estructura válida' : 'Revisar'));
    const stats = node('div', 'release30stats');
    [[report.specialties.length, 'especialidades'], [report.activeQuestions, 'preguntas en tu especialidad'], [report.issueCount, 'observaciones estructurales']].forEach(value => {
      const box = node('span'); box.append(node('strong', '', String(value[0])), node('small', '', value[1])); stats.append(box);
    });
    const button = node('button', 'release30btn', 'Ver estado de la versión');
    button.type = 'button'; button.onclick = openStatus;
    card.append(hero, stats, button);
    const mainHero = home.querySelector('.hero');
    if (mainHero) mainHero.after(card); else home.prepend(card);
  }

  window.PE30 = {
    status,
    summary: () => {
      const report = status();
      return {version: report.version, ready: report.ready, specialties: report.specialties.length, questions: report.totalQuestions, activeQuestions: report.activeQuestions, partial: report.partial, issues: report.issueCount};
    },
    openStatus,
    closeStatus
  };

  const previousRender = window.render;
  if (typeof previousRender === 'function' && !window.__pe30Render) {
    window.render = function () {
      const result = previousRender.apply(this, arguments);
      setTimeout(inject, 0);
      return result;
    };
    window.__pe30Render = true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
  setTimeout(inject, 120);
  setTimeout(inject, 500);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeStatus(); });
}());
