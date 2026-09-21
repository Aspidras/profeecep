// ProfeECEP 3.0.5 — presentation only; progress and question storage stay in their existing modules.
(function () {
  'use strict';

  const overlaySelector = '.authOverlay,.specialtyOverlay,.tutorOverlay,.qa282Overlay,.editorial284Overlay,.tutor285Overlay,.pe30-backdrop,.pe302-overlay';
  const focusSelector = 'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';
  const groups = [
    {id: 'plan', title: 'Mi plan y constancia', description: 'Sesiones, prioridades y hábitos', classes: ['plan25home', 'planner15home', 'motivation19home']},
    {id: 'tools', title: 'Herramientas de estudio', description: 'Repaso, errores y tutores', classes: ['adaptive14home', 'reviewHome09', 'error18home', 'tutor26home', 'tutor285home', 'complete28home']},
    {id: 'info', title: 'Información y aplicación', description: 'Fechas, instalación y estado de la versión', classes: ['calendar286', 'mobile27home', 'bank287home', 'release30home', 'specialty20home', 'phase23Home', 'bank11home']}
  ];
  const openGroups = new Set();
  const modalStack = [];
  let lastTrigger = null, modalScroll = 0, refreshPending = false, dialogId = 0;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}[char]));

  function homeModel() {
    const specialty = PE20.active();
    const last = flat.find(item => item.id === S.lastStudy);
    const studied = flat.filter(item => S.done.includes(item.id)).length;
    return {
      specialty, studied, indicators: flat.length, questions: Q.length,
      precision: S.total ? pct(S.right, S.total) + '%' : '—',
      action: last ? 'continue' : S.diagnosis || S.history.length ? 'adaptive' : 'diagnosis',
      title: last ? 'Retoma donde quedaste' : S.diagnosis || S.history.length ? 'Una sesión para seguir avanzando' : 'Encuentra tu punto de partida',
      detail: last ? last.t : S.diagnosis || S.history.length ? 'Practica según tus respuestas y los contenidos que necesitas reforzar.' : 'Responde un diagnóstico breve para orientar tu estudio.',
      button: last ? 'Continuar estudiando' : S.diagnosis || S.history.length ? 'Comenzar mi sesión' : 'Comenzar diagnóstico',
      lastId: last?.id
    };
  }

  function primary() {
    const next = homeModel();
    if (next.action === 'continue') openStudy(next.lastId);
    else if (next.action === 'adaptive') startAdaptive();
    else startDiagnosis();
  }

  function focusHeading(root) {
    const heading = root?.querySelector('h1,h2,h3');
    if (heading) { heading.tabIndex = -1; heading.focus({preventScroll: true}); }
  }

  function navigate(id, selector) {
    render(); go(id);
    if (selector) setTimeout(() => {
      const target = document.getElementById(id)?.querySelector(selector);
      if (target) { target.scrollIntoView({block: 'start'}); focusHeading(target); }
    }, 0);
  }

  function composeHome() {
    const home = document.getElementById('home');
    if (!home) return;
    let dashboard = home.querySelector('.pe302-dashboard');
    if (!dashboard) {
      const next = homeModel();
      dashboard = document.createElement('div');
      dashboard.className = 'pe302-dashboard';
      dashboard.innerHTML =
        '<div class="pe302-welcome"><span class="pe302-eyebrow">TU PREPARACIÓN ECEP</span><h1>Un paso más en tu preparación.</h1><p>' + escape(next.specialty.name) + '</p></div>' +
        '<section class="pe302-next" aria-labelledby="pe302-next-title"><span class="pe302-eyebrow">PARA TI, HOY</span><h2 id="pe302-next-title">' + escape(next.title) + '</h2><p>' + escape(next.detail) + '</p><button class="btn full" data-pe302-action="primary">' + escape(next.button) + '<span aria-hidden="true"> →</span></button></section>' +
        '<section class="pe302-shortcuts" aria-label="Accesos de estudio">' +
        '<button data-pe302-go="map"><span class="pe302-shortcut-icon" aria-hidden="true">01</span><b>Estudiar</b><small>Explora el temario</small></button>' +
        '<button data-pe302-go="practice"><span class="pe302-shortcut-icon" aria-hidden="true">02</span><b>Practicar</b><small>Entrena a tu ritmo</small></button>' +
        '<button data-pe302-action="simulation"><span class="pe302-shortcut-icon" aria-hidden="true">03</span><b>Simulacros</b><small>Elige tu sesión</small></button></section>' +
        '<section class="pe302-progress" aria-labelledby="pe302-progress-title"><div class="pe302-section-title"><h2 id="pe302-progress-title">Tu avance</h2><button class="mini" data-pe302-go="progress">Ver progreso</button></div><dl>' +
        '<div><dt>Indicadores estudiados</dt><dd>' + next.studied + '<span> / ' + next.indicators + '</span></dd></div>' +
        '<div><dt>Precisión en práctica</dt><dd>' + next.precision + '</dd></div>' +
        '<div><dt>Preguntas disponibles</dt><dd>' + next.questions + '</dd></div></dl></section>' +
        '<div class="pe302-groups">' + groups.map(group => '<details class="pe302-group" data-pe302-group="' + group.id + '"' + (openGroups.has(group.id) ? ' open' : '') + '><summary><span><b>' + group.title + '</b><small>' + group.description + '</small></span><span class="pe302-chevron" aria-hidden="true">⌄</span></summary><div class="pe302-group-body"></div></details>').join('') + '</div>' +
        '<footer class="pe302-footer"><span>ProfeECEP 3.0.5</span><button class="mini ghost2" data-pe302-action="access">Lectura y accesibilidad</button></footer>';
      dashboard.querySelectorAll('details').forEach(details => details.addEventListener('toggle', () => {
        if (details.open) openGroups.add(details.dataset.pe302Group); else openGroups.delete(details.dataset.pe302Group);
      }));
      dashboard.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.dataset.pe302Go) navigate(button.dataset.pe302Go);
        else if (button.dataset.pe302Action === 'primary') primary();
        else if (button.dataset.pe302Action === 'simulation') navigate('practice', '.exam283');
        else if (button.dataset.pe302Action === 'access') openReading();
      });
      home.append(dashboard);
    }
    // Retain the existing tool nodes and handlers inside optional sections.
    // Old summary/hero nodes remain outside the dashboard, excluded from layout and focus by CSS.
    for (const group of groups) {
      const body = dashboard.querySelector('[data-pe302-group="' + group.id + '"] .pe302-group-body');
      for (const name of group.classes) {
        const card = home.querySelector('.' + name);
        if (card && card.parentElement !== body) body.append(card);
      }
    }
  }

  function updateNavigation() {
    const active = document.querySelector('.screen.on')?.id || 'home';
    const destination = active === 'study' ? 'map' : ['diagnosis', 'simulation'].includes(active) ? 'practice' : active;
    document.querySelectorAll('.app > nav [data-go]').forEach(button => {
      if (button.dataset.go === destination) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  function updatePreferenceButtons() {
    const p = PE286.prefs();
    const choices = [['size', 'normal', 'Tamaño normal'], ['size', 'large', 'Texto grande'], ['size', 'xlarge', 'Texto muy grande'], ['contrast', true, 'Alto contraste'], ['dark', true, 'Modo oscuro'], ['reduced', true, 'Reducir movimiento']];
    document.querySelectorAll('.access286Grid button').forEach((button, index) => {
      const choice = choices[index];
      if (!choice) return;
      button.setAttribute('aria-pressed', String(p[choice[0]] === choice[1]));
      if (button.textContent !== choice[2]) button.textContent = choice[2];
    });
  }

  function openReading() {
    document.querySelector('.pe302-overlay')?.remove();
    const p = PE286.prefs(), overlay = document.createElement('div');
    overlay.className = 'pe302-overlay';
    overlay.innerHTML = '<section class="pe302-reading"><button class="close" aria-label="Cerrar ajustes de lectura">×</button><h2>Lectura y accesibilidad</h2><p class="muted">Adapta la pantalla a tu comodidad. Se guarda en este dispositivo.</p><fieldset><legend>Tamaño del texto</legend><div class="pe302-size-options">' +
      [['normal', 'Normal'], ['large', 'Grande'], ['xlarge', 'Muy grande']].map(([value, label]) => '<label><input type="radio" name="pe302-size" value="' + value + '"' + (p.size === value ? ' checked' : '') + '><span>' + label + '</span></label>').join('') + '</div></fieldset>' +
      [['dark', 'Modo oscuro', 'Un fondo oscuro para leer.'], ['contrast', 'Alto contraste', 'Bordes y texto más definidos.'], ['reduced', 'Reducir movimiento', 'Menos animaciones y transiciones.']].map(([key, label, help]) => '<label class="pe302-switch"><span><b>' + label + '</b><small>' + help + '</small></span><input type="checkbox" data-pe302-pref="' + key + '"' + (p[key] ? ' checked' : '') + '></label>').join('') + '<button class="btn full" data-pe302-close>Listo</button></section>';
    overlay.querySelectorAll('.close,[data-pe302-close]').forEach(button => button.addEventListener('click', () => overlay.remove()));
    overlay.addEventListener('click', event => { if (event.target === overlay) overlay.remove(); });
    overlay.addEventListener('change', event => {
      const input = event.target;
      if (input.name === 'pe302-size') PE286.set('size', input.value);
      else if (input.dataset.pe302Pref) PE286.set(input.dataset.pe302Pref, input.checked);
    });
    document.body.append(overlay);
  }

  function decorate(root) {
    if (!root?.querySelectorAll) return;
    root.querySelectorAll('.close,.pe30-close').forEach(button => {
      if (!button.hasAttribute('aria-label')) button.setAttribute('aria-label', 'Cerrar ventana');
      button.type = 'button';
    });
    root.querySelectorAll('.authField').forEach(field => {
      const input = field.querySelector('input'), label = field.querySelector('label');
      if (input && label) label.htmlFor = input.id;
    });
    root.querySelectorAll('.indicator').forEach(indicator => {
      const text = indicator.querySelector('.indicatorText')?.textContent.trim();
      const mark = indicator.querySelector('.indicatorActions button:last-child');
      if (mark) {
        const done = mark.classList.contains('done');
        mark.setAttribute('aria-label', (done ? 'Marcar como pendiente: ' : 'Marcar como estudiado: ') + text);
        mark.setAttribute('aria-pressed', String(done));
      }
    });
    root.querySelectorAll('.opt').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('sel'))));
    root.querySelectorAll('.sim12Nav').forEach(button => {
      const number = button.textContent.trim();
      button.setAttribute('aria-label', 'Pregunta ' + number + (button.classList.contains('answered') ? ', respondida' : ', sin responder') + (button.classList.contains('marked') ? ', marcada para revisar' : ''));
      if (button.classList.contains('current')) button.setAttribute('aria-current', 'step');
    });
    root.querySelectorAll('.specialtyOption').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('selected'))));
    root.querySelectorAll('#peAuthMsg,.specialtyNotice').forEach(message => { message.setAttribute('role', 'status'); message.setAttribute('aria-live', 'polite'); });
  }

  function syncModals() {
    const app = document.querySelector('.app');
    let restore = null;
    for (let i = modalStack.length - 1; i >= 0; i--) {
      if (!modalStack[i].overlay.isConnected) { restore = modalStack[i].trigger; modalStack.splice(i, 1); }
    }
    document.querySelectorAll(overlaySelector).forEach(overlay => {
      if (modalStack.some(item => item.overlay === overlay)) return;
      if (!modalStack.length) {
        modalScroll = window.scrollY;
        document.body.style.top = -modalScroll + 'px';
        document.body.classList.add('pe302-modal-open');
      }
      const panel = overlay.firstElementChild;
      if (!panel) return;
      const heading = panel.querySelector('h1,h2,h3,header b');
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.tabIndex = -1;
      if (heading) {
        if (!heading.id) heading.id = 'pe302-dialog-' + (++dialogId);
        panel.setAttribute('aria-labelledby', heading.id);
      } else panel.setAttribute('aria-label', 'Ventana de ProfeECEP');
      modalStack.push({overlay, panel, trigger: lastTrigger || document.activeElement});
      overlay.style.zIndex = String(300 + modalStack.length);
      panel.focus({preventScroll: true});
    });
    const current = modalStack.at(-1);
    if (app) app.inert = !!current;
    modalStack.forEach(item => { item.overlay.inert = item !== current; });
    if (!current && document.body.classList.contains('pe302-modal-open')) {
      document.body.classList.remove('pe302-modal-open'); document.body.style.top = '';
      window.scrollTo(0, modalScroll);
    }
    if (restore?.isConnected && !restore.closest('[inert]')) restore.focus({preventScroll: true});
  }

  function keyboard(event) {
    const current = modalStack.at(-1);
    if (!current) return;
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopImmediatePropagation();
      const close = current.panel.querySelector('.close,.pe30-close,[data-pe302-close]');
      if (close) close.click();
    } else if (event.key === 'Tab') {
      const targets = [...current.panel.querySelectorAll(focusSelector)].filter(node => node.getClientRects().length && !node.closest('[inert]'));
      const first = targets[0], last = targets.at(-1), active = document.activeElement;
      if (!first) { event.preventDefault(); current.panel.focus(); }
      else if (event.shiftKey && (active === first || !targets.includes(active))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (active === last || !targets.includes(active))) { event.preventDefault(); first.focus(); }
    }
  }

  function refresh() {
    refreshPending = false;
    if (!document.querySelector('.app')) return;
    composeHome(); window.PE305?.inject(); updateNavigation(); updatePreferenceButtons(); decorate(document);
  }

  function scheduleRefresh() {
    if (refreshPending) return;
    refreshPending = true; setTimeout(refresh, 0);
  }

  function boot() {
    if (!document.querySelector('.app')) return;
    document.documentElement.classList.add('pe302');
    const header = document.querySelector('.app > header');
    if (header && !header.querySelector('.pe302-access')) {
      const button = document.createElement('button');
      button.className = 'pe302-access'; button.type = 'button'; button.textContent = 'Aa';
      button.setAttribute('aria-label', 'Lectura y accesibilidad'); button.onclick = openReading;
      header.append(button);
    }
    const viewport = () => document.documentElement.style.setProperty('--pe302-viewport', (window.visualViewport?.height || window.innerHeight) + 'px');
    viewport(); window.visualViewport?.addEventListener('resize', viewport); window.addEventListener('resize', viewport);
    const nav = document.querySelector('.app > nav');
    if (nav && typeof ResizeObserver === 'function') new ResizeObserver(() => {
      document.documentElement.style.setProperty('--pe302-nav-height', nav.getBoundingClientRect().height + 'px');
    }).observe(nav);
    document.addEventListener('click', event => { lastTrigger = event.target.closest('button,a,input,summary') || document.activeElement; }, true);
    document.addEventListener('keydown', keyboard, true);
    if (typeof MutationObserver === 'function') new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) if (node.nodeType === 1) decorate(node);
        if (record.target.id === 'home' && [...record.addedNodes].some(node => node.nodeType === 1 && !node.classList.contains('pe302-dashboard'))) scheduleRefresh();
      }
      syncModals();
    }).observe(document.body, {childList: true, subtree: true});
    refresh(); syncModals();
  }

  const previousRender = window.render;
  window.render = function () { const result = previousRender.apply(this, arguments); scheduleRefresh(); return result; };
  const previousGo = window.go;
  window.go = function (id) {
    const result = previousGo.apply(this, arguments);
    if (modalStack.length) modalScroll = 0;
    updateNavigation(); setTimeout(() => focusHeading(document.getElementById(id)), 0);
    return result;
  };
  const previousPick = window.pick;
  window.pick = function () { const result = previousPick.apply(this, arguments); decorate(document.querySelector('.screen.on')); return result; };
  const previousAnswer = window.checkAnswer;
  window.checkAnswer = function () {
    const result = previousAnswer.apply(this, arguments);
    if (document.activeElement === document.body) setTimeout(() => focusHeading(document.querySelector('.screen.on')), 0);
    return result;
  };
  const previousSet = PE286.set;
  PE286.set = function () { const result = previousSet.apply(this, arguments); updatePreferenceButtons(); return result; };
  window.PE302 = {homeModel, openReading, navigate};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 0);
}());
