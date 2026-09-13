// ProfeECEP 2.4 — diagnóstico independiente por especialidad
(function () {
  'use strict';
  const specialty = window.PE22_CONTENT && window.PE22_CONTENT[window.PE_ACTIVE_SPECIALTY];
  if (!specialty) return;
  const escape = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  function inject() {
    const home = document.querySelector('#home'), diagnosis = document.querySelector('#diagnosis');
    if (home && !home.querySelector('.diagnosis24Home')) {
      const c = document.createElement('div'); c.className = 'card diagnosis24Home';
      const domains = [...new Set(specialty.questions.map(q => q.d))];
      c.innerHTML = '<span class="pill">Diagnóstico 2.4</span><h3>Punto de partida para ' + escape((window.PE20 && PE20.active().short) || 'esta especialidad') + '</h3><p class="muted">El diagnóstico usa ' + specialty.questions.length + ' preguntas propias y entrega resultados por dominio.</p><div class="tiny">' + domains.length + ' dominios · ' + specialty.questions.length + ' preguntas · dificultad variada</div>';
      const hero = home.querySelector('.hero'); if (hero) hero.after(c); else home.prepend(c);
    }
    if (diagnosis && diagnosis.querySelector('h2') && !diagnosis.querySelector('.diagnosis24Badge')) {
      const badge = document.createElement('span'); badge.className = 'pill diagnosis24Badge'; badge.textContent = 'Resultado por especialidad · 2.4'; diagnosis.querySelector('h2').before(badge);
    }
  }
  const oldStart = window.startDiagnosis;
  if (oldStart && !window.__pe24StartWrapped) { window.startDiagnosis = function () { const result = oldStart(); setTimeout(inject, 0); return result; }; window.__pe24StartWrapped = true; }
  const oldResult = window.showDiagnosisResult;
  if (oldResult && !window.__pe24ResultWrapped) { window.showDiagnosisResult = function () { const result = oldResult(); setTimeout(inject, 0); return result; }; window.__pe24ResultWrapped = true; }
  const oldRender = window.render;
  if (oldRender && !window.__pe24RenderWrapped) { window.render = function () { const result = oldRender(); setTimeout(inject, 0); return result; }; window.__pe24RenderWrapped = true; }
  window.PE24 = {specialty, inject}; setTimeout(inject, 0);
}());
