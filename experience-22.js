// ProfeECEP 2.2 — presentation and feedback layer
(function () {
  'use strict';
  const content = window.PE22_CONTENT && window.PE22_CONTENT[window.PE_ACTIVE_SPECIALTY];
  if (!content) return;
  const escape = s => String(s ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[m]));
  const question = () => { const r = window.PE22_RUNTIME ? window.PE22_RUNTIME() : {}; return r.quiz && r.quiz[r.pos]; };
  function enrichStudy() {
    const box = document.querySelector('#study .studyHead');
    if (!box || box.querySelector('.phase22Badge')) return;
    const x = flat && flat.find(v => v.id === S.lastStudy);
    if (!x) return;
    const guide = PE16.guide(x);
    if (!guide) return;
    const badge = document.createElement('span');
    badge.className = 'pill phase22Badge';
    badge.textContent = 'Centro 3.0.1 · contenido propio';
    box.appendChild(badge);
    const indicator = document.createElement('div');
    indicator.className = 'card phase22Indicator';
    indicator.innerHTML = '<b>Indicador trabajado</b><p class=\"muted\">' + escape(guide.indicator) + '</p><div class=\"tiny\">Microlección estimada: ' + guide.minutes + ' min</div>';
    box.after(indicator);
  }
  function enrichQuestion() {
    const x = question(), card = document.querySelector('#practice .card');
    if (!x || !card || card.querySelector('.phase22Origin')) return;
    const badge = document.createElement('div');
    badge.className = 'phase22Origin tiny';
    badge.textContent = 'Contenido propio ProfeECEP 2.2 · ' + (x.skill || 'razonamiento aplicado');
    card.insertBefore(badge, card.firstChild);
  }
  function inject() { enrichStudy(); enrichQuestion(); }
  const oldOpen = window.openStudy;
  if (oldOpen && !window.__pe22OpenWrapped) {
    window.openStudy = function (id) { const r = oldOpen(id); setTimeout(inject, 0); return r; };
    window.__pe22OpenWrapped = true;
  }
  const oldShow = window.showQ;
  if (oldShow && !window.__pe22ShowWrapped) {
    window.showQ = function () { const r = oldShow(); setTimeout(inject, 0); return r; };
    window.__pe22ShowWrapped = true;
  }
  const oldRender = window.render;
  if (oldRender && !window.__pe22RenderWrapped) {
    window.render = function () { const r = oldRender(); setTimeout(inject, 0); return r; };
    window.__pe22RenderWrapped = true;
  }
  window.PE22 = {content, inject};
  setTimeout(inject, 0);
}());
