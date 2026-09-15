// ProfeECEP 3.0.3 — locally recoverable simulations, scoped to owner and specialty.
(function () {
  'use strict';
  let runningKey = null;
  const key = () => 'pe_simulation_303_' + (localStorage.getItem('pe_owner') || 'guest') + '_' + PE_ACTIVE_SPECIALTY;
  const sessionId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  function persist() {
    if (!SIM12 || !quiz.length) return;
    if (runningKey && runningKey !== key()) return;
    runningKey = key();
    SIM12.sessionId ||= sessionId();
    SIM12.deadline ||= Date.now() + SIM12.seconds * 1000;
    try { localStorage.setItem(runningKey, JSON.stringify({schema: 1, specialty: PE_ACTIVE_SPECIALTY, questions: quiz.map(q => q.id), simulation: SIM12})); }
    catch (_) { const message = document.querySelector('.pe303-resume-status'); if (message) message.textContent = 'No hay espacio para recuperar esta sesión al cerrar. Puedes terminarla ahora.'; }
  }
  function draft() {
    try {
      const data = JSON.parse(localStorage.getItem(key()) || 'null');
      if (!data || data.schema !== 1 || data.specialty !== PE_ACTIVE_SPECIALTY || !Array.isArray(data.questions) || !data.questions.length || new Set(data.questions).size !== data.questions.length) return null;
      const sim = data.simulation, bank = new Map(Q.map(q => [q.id, q]));
      if (!sim || !Number.isFinite(sim.deadline) || !Number.isFinite(sim.maxSeconds) || sim.maxSeconds <= 0 || !Number.isInteger(sim.index) || sim.index < 0 || sim.index >= data.questions.length || !sim.sessionId || !sim.answers || !sim.marked) return null;
      if (data.questions.some(id => !bank.has(id))) return null;
      if (Object.entries(sim.answers).some(([id, option]) => !data.questions.some(qid => String(qid) === id) || !Number.isInteger(option) || option < 0 || option > 3)) return null;
      if (S.simulations.some(result => result.sessionId === sim.sessionId)) { localStorage.removeItem(key()); return null; }
      return data;
    } catch (_) { return null; }
  }
  function tick() {
    if (!SIM12) return;
    SIM12.seconds = Math.max(0, Math.min(SIM12.maxSeconds || 2700, Math.ceil((SIM12.deadline - Date.now()) / 1000)));
    const clock = document.getElementById('sim12time'); if (clock) clock.textContent = formatSim12Time(SIM12.seconds);
    if (SIM12.seconds <= 0) finishSimulation12(true);
  }
  function startClock() {
    clearInterval(SIM12_TIMER);
    if (!SIM12) return;
    SIM12.maxSeconds ||= 2700;
    SIM12.deadline ||= Date.now() + SIM12.seconds * 1000;
    persist();
    SIM12_TIMER = setInterval(tick, 1000);
  }
  function resume() {
    const data = draft(); if (!data) return;
    if (SIM12 && SIM12.sessionId !== data.simulation.sessionId) return;
    mode = 'simulation'; quiz = data.questions.map(id => Q.find(q => q.id === id));
    SIM12 = data.simulation; runningKey = key();
    SIM12.seconds = Math.max(0, Math.min(SIM12.maxSeconds, Math.ceil((SIM12.deadline - Date.now()) / 1000)));
    if (SIM12.seconds <= 0) { finishSimulation12(true); return; }
    renderSimulation12(); startClock();
  }
  function resetRuntime() { clearInterval(SIM12_TIMER); SIM12 = null; quiz = []; answers = []; pos = 0; sel = null; runningKey = null; }
  function discard() {
    if (!confirm('¿Descartar el simulacro pendiente? Las respuestas de esta sesión no se evaluarán.')) return;
    localStorage.removeItem(key()); resetRuntime(); render(); go('practice');
  }
  function beforeStart() {
    if (!draft()) return true;
    if (!confirm('Ya tienes un simulacro pendiente. ¿Reemplazarlo por uno nuevo?')) return false;
    localStorage.removeItem(key()); resetRuntime(); return true;
  }
  const previousRenderSimulation = window.renderSimulation12;
  window.renderSimulation12 = function () {
    const result = previousRenderSimulation.apply(this, arguments); persist();
    const target = document.getElementById('simulation');
    if (target && SIM12 && !target.querySelector('.pe303-resume-status')) {
      const note = document.createElement('p'); note.className = 'tiny pe303-resume-status';
      note.textContent = 'Sesión guardada en este dispositivo. El tiempo continúa si sales o recargas.'; target.appendChild(note);
    }
    return result;
  };
  const previousQuestion = window.showQ;
  window.showQ = function () {
    if (SIM12 && mode !== 'simulation') { clearInterval(SIM12_TIMER); SIM12 = null; runningKey = null; }
    return previousQuestion.apply(this, arguments);
  };
  const previousSummary = window.sim12ShowSummary;
  window.sim12ShowSummary = function () { const result = previousSummary.apply(this, arguments); persist(); return result; };
  const previousFinish = window.finishSimulation12;
  window.finishSimulation12 = function () {
    if (!SIM12) return;
    const savedKey = runningKey || key(), id = SIM12.sessionId;
    const result = previousFinish.apply(this, arguments);
    if (!SIM12 && (!id || S.simulations.some(s => s.sessionId === id))) localStorage.removeItem(savedKey);
    runningKey = null; return result;
  };
  function wrapStart(object, name) {
    const previous = object[name];
    object[name] = function () { if (!beforeStart()) return; const result = previous.apply(this, arguments); startClock(); return result; };
  }
  wrapStart(window, 'startSimulation'); wrapStart(PE21, 'start'); wrapStart(PE283, 'start'); wrapStart(PE28, 'startFull');
  function inject() {
    const data = draft();
    for (const id of ['home', 'practice']) {
      const target = document.getElementById(id); if (!target) continue;
      target.querySelector('.pe303-resume')?.remove();
      if (!data) continue;
      if (id === 'practice' && document.querySelector('.screen.on')?.id === 'practice' && mode === 'practice' && quiz.length && pos < quiz.length) continue;
      const card = document.createElement('section'); card.className = 'card pe303-resume';
      const remaining = Math.max(0, Math.ceil((data.simulation.deadline - Date.now()) / 1000));
      card.innerHTML = '<h2>Tu simulacro está guardado</h2><p>' + Object.keys(data.simulation.answers).length + ' de ' + data.questions.length + ' preguntas respondidas. ' + (remaining ? 'El tiempo sigue corriendo.' : 'El tiempo terminó; puedes recuperar el resultado.') + '</p><div class="pe303-actions"><button class="btn" onclick="PE303.resume()">' + (remaining ? 'Continuar simulacro' : 'Recuperar resultado') + '</button><button class="btn ghost" onclick="PE303.discard()">Descartar sesión</button></div>';
      if (id === 'home') { const dashboard = target.querySelector('.pe302-dashboard'); if (dashboard) dashboard.prepend(card); }
      else target.prepend(card);
    }
  }
  const previousRender = window.render;
  window.render = function () { const result = previousRender.apply(this, arguments); setTimeout(inject, 0); return result; };
  window.addEventListener('pagehide', persist);
  document.addEventListener('visibilitychange', () => { if (SIM12) { persist(); tick(); } });
  window.PE303 = {persist, draft, resume, discard, resetRuntime, startClock, tick, inject};
  setTimeout(inject, 0);
}());
