// ProfeECEP 2.3 — expanded bank presentation
(function () {
  'use strict';
  const active = window.PE22_CONTENT && window.PE22_CONTENT[window.PE_ACTIVE_SPECIALTY];
  if (!active) return;
  function inject() {
    const home = document.querySelector('#home'), practice = document.querySelector('#practice');
    if (home && !home.querySelector('.phase23Home')) {
      const card = document.createElement('div'); card.className = 'card phase23Home';
      card.innerHTML = '<span class="pill">Banco 2.3</span><h3>Banco ampliado disponible</h3><p class="muted">' + active.questions.length + ' preguntas propias para esta especialidad, distribuidas por dominio e indicador.</p><div class="grid2"><div><b>' + new Set(active.questions.map(q => q.d)).size + '</b><div class="tiny">dominios</div></div><div><b>' + new Set(active.questions.map(q => q.indicatorId)).size + '</b><div class="tiny">indicadores</div></div></div>';
      const hero = home.querySelector('.hero'); if (hero) hero.after(card); else home.prepend(card);
    }
    if (practice) {
      const pill = practice.querySelector('.sim21 .pill'); if (pill) pill.textContent = 'Simulador 2.3';
      const bank = practice.querySelector('.bank11home h3'); if (bank) bank.textContent = active.questions.length + ' preguntas disponibles';
    }
  }
  const old = window.render;
  if (old && !window.__pe23Wrapped) { window.render = function () { const result = old(); setTimeout(inject, 0); return result; }; window.__pe23Wrapped = true; }
  window.PE23 = {active, inject}; setTimeout(inject, 0);
}());
