// ProfeECEP 3.0.9 — personal review is separate from editorial validation.
(function () {
  'use strict';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const statuses = ['pendiente', 'revisada', 'comprendida'];
  const labels = {pendiente: 'Por repasar', revisada: 'Repasada por mí', comprendida: 'Comprendida por mí'};
  function status(q) {
    const saved = S.questionReviews?.[q.id]?.status;
    // Preserve the old record, but never interpret a learner's mark as expert validation.
    return saved === 'validada' ? 'revisada' : statuses.includes(saved) ? saved : 'pendiente';
  }
  function inspect(q) {
    const h = (S.history || []).filter(x => x.id === q.id && typeof x.ok === 'boolean');
    const n = h.length, p = n ? pct(h.filter(x => x.ok).length, n) : null, selected = {};
    h.forEach(x => { if (Number.isInteger(x.selected) && x.selected >= 0 && x.selected < q.o.length) selected[x.selected] = (selected[x.selected] || 0) + 1; });
    const signal = !n ? 'Sin intentos personales' : n < 5 ? 'Pocos intentos personales' : p < 45 ? 'Te conviene repasar' : p > 90 ? 'Aciertos frecuentes en tus intentos' : 'Resultados variados en tus intentos';
    return {n, p, selected, signal, scope: 'personal'};
  }
  function report() {
    const rows = Q.map(q => {
      const i = inspect(q);
      return {q, i, status: status(q), alert: i.n >= 5 && i.p < 45 || !!S.flaggedQuestions?.[q.id]};
    });
    return {rows, understood: rows.filter(x => x.status === 'comprendida').length, reviewed: rows.filter(x => x.status === 'revisada').length,
      pending: rows.filter(x => x.status === 'pendiente').length, alerts: rows.filter(x => x.alert).length, observed: rows.filter(x => x.i.n > 0).length};
  }
  function setStatus(id, value, mode = 'all', page = 0) {
    if (!Q.some(q => q.id === id) || !statuses.includes(value)) return false;
    const before = S.questionReviews;
    S.questionReviews = {...S.questionReviews, [id]: {status: value, date: new Date().toISOString(), scope: 'personal'}};
    try { saveState(); }
    catch (_) { if (before === undefined) delete S.questionReviews; else S.questionReviews = before; alert('No se pudo guardar tu marca de repaso. Inténtalo nuevamente.'); return false; }
    document.querySelector('.editorial284')?.remove(); inject(); open(mode, page); return true;
  }
  function open(mode = 'alerts', page = 0) {
    if (!['alerts', 'pending', 'observed', 'all'].includes(mode)) mode = 'all';
    const r = report(), rows = r.rows.filter(x => mode === 'alerts' ? x.alert : mode === 'pending' ? x.status === 'pendiente' : mode === 'observed' ? x.i.n > 0 : true);
    const pages = Math.max(1, Math.ceil(rows.length / 20));
    page = Math.max(0, Math.min(Number.isInteger(page) ? page : 0, pages - 1));
    close();
    const overlay = document.createElement('div'); overlay.className = 'editorial284Overlay';
    overlay.innerHTML = '<section class="editorial284Modal"><button type="button" class="close" aria-label="Cerrar mi repaso" onclick="PE284.close()">×</button><span class="pill">Repaso personal</span><h2>Mi repaso de preguntas</h2><p class="muted">Las marcas y porcentajes describen tus propios intentos guardados, que pueden incluir repeticiones. No validan la pregunta ni establecen su dificultad para otros docentes.</p><div class="editorial284Filters">' +
      [['alerts', 'Por revisar', r.alerts], ['pending', 'Por repasar', r.pending], ['observed', 'Practicadas', r.observed], ['all', 'Todas', r.rows.length]].map(([key, label, count]) => '<button type="button" class="mini" aria-pressed="' + (mode === key) + '" onclick="PE284.open(\'' + key + '\')">' + label + ' ' + count + '</button>').join('') + '</div>' +
      (rows.length ? rows.slice(page * 20, (page + 1) * 20).map(x => '<article class="editorial284Row"><div class="row"><b>' + esc(x.q.i || x.q.id) + '</b><span class="pill">' + labels[x.status] + '</span></div><p>' + esc(x.q.q) + '</p><div class="editorial284Meta">' + (x.i.n ? x.i.p + '% de acierto en tus ' + x.i.n + ' intentos guardados · ' + x.i.signal : x.i.signal) + '</div><div class="editorial284Buttons">' +
        statuses.map(value => '<button type="button" class="mini" aria-pressed="' + (x.status === value) + '" data-question-id="' + esc(x.q.id) + '" onclick="PE284.setStatus(this.dataset.questionId,\'' + value + '\',\'' + mode + '\',' + page + ')">' + labels[value] + '</button>').join('') + '</div>' + (window.PE309 ? PE309.questionButton(x.q) : '') + '</article>').join('') : '<p>No hay preguntas en este filtro.</p>') +
      (pages > 1 ? '<div class="editorial284Filters"><button type="button" class="mini"' + (!page ? ' disabled' : '') + ' onclick="PE284.open(\'' + mode + '\',' + (page - 1) + ')">Anterior</button><span>Página ' + (page + 1) + ' de ' + pages + '</span><button type="button" class="mini"' + (page === pages - 1 ? ' disabled' : '') + ' onclick="PE284.open(\'' + mode + '\',' + (page + 1) + ')">Siguiente</button></div>' : '') + '<button type="button" class="btn ghost full" onclick="PE284.close()">Cerrar</button></section>';
    document.body.appendChild(overlay);
  }
  function close() { document.querySelector('.editorial284Overlay')?.remove(); }
  function inject() {
    const progress = el('progress'); if (!progress || progress.querySelector('.editorial284')) return;
    const r = report(), card = document.createElement('div'); card.className = 'card editorial284';
    card.innerHTML = '<span class="pill">Repaso personal</span><h3>Mi repaso de preguntas</h3><p class="muted">Organiza lo que ya repasaste y lo que quieres volver a estudiar. Las marcas son personales.</p><div class="editorial284Stats"><span><b>' + r.understood + '</b> comprendidas por mí</span><span><b>' + r.reviewed + '</b> repasadas por mí</span><span><b>' + r.pending + '</b> por repasar</span></div><button type="button" class="btn ghost full" onclick="PE284.open(\'all\')">Organizar mi repaso</button>';
    const anchor = progress.querySelector('.bank282'); if (anchor) anchor.after(card); else progress.prepend(card);
  }
  window.PE284 = {report, inspect, status, setStatus, open, close, inject};
  const previous = window.render;
  if (previous && !window.__pe284) { window.render = function () { const result = previous.apply(this, arguments); setTimeout(inject, 0); return result; }; window.__pe284 = true; }
  setTimeout(inject, 0);
}());
