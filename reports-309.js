// Reports are personal progress records. Export is explicit; no editorial inbox is implied.
(function () {
  'use strict';
  const version = '3.0.9', esc = PE304.esc, pageSize = 20;
  const reasons = [
    ['ambigua', 'Puede haber más de una respuesta'],
    ['clave', 'La respuesta marcada como correcta parece equivocada'],
    ['explicacion', 'La explicación falta o no corresponde'],
    ['material', 'Problema con imagen, tabla, texto o audio'],
    ['temario', 'No parece corresponder al indicador'],
    ['redaccion', 'Error de redacción o datos'],
    ['otro', 'Otro problema']
  ];
  const reasonName = code => reasons.find(row => row[0] === code)?.[1] || 'Marca anterior: falta detallar el motivo';
  const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const text = value => typeof value === 'string' ? value : '';
  const date = value => Number.isFinite(Date.parse(value)) ? value : '';
  const specialty = () => window.PE_ACTIVE_SPECIALTY;
  const bank = () => window.PE307 ? PE307.fullBank() : Q;
  const question = id => bank().find(q => q.id === id) || null;
  const safeId = id => typeof id === 'string' && !['__proto__', 'prototype', 'constructor'].includes(id);

  function snapshot(q, fallback = {}) {
    const value = q || fallback;
    return {
      id: text(value.id), text: text(q ? q.q : value.text),
      options: (Array.isArray(q ? q.o : value.options) ? (q ? q.o : value.options) : []).map(text),
      indicatorId: text(value.indicatorId), indicator: text(value.indicator),
      domain: text(q ? q.d : value.domain), subdomain: text(q ? q.i : value.subdomain)
    };
  }

  function list(filter = 'all') {
    const reports = object(S.questionReports), flags = object(S.flaggedQuestions);
    const ids = new Set([...Object.keys(flags), ...Object.keys(reports)]);
    const byId = new Map(bank().map(q => [q.id, q]));
    const currentIds = new Set(Q.map(q => q.id));
    const replacements = new Map(Q.filter(q => q.replaces).map(q => [q.replaces, q.id]));
    return [...ids].filter(safeId).map(id => {
      const stored = object(reports[id]), flag = object(flags[id]), q = byId.get(id);
      return {
        questionId: id, specialtyId: specialty(),
        reason: reasons.some(row => row[0] === stored.reason) ? stored.reason : 'sin-detalle',
        details: text(stored.details).slice(0, 1200),
        status: stored.status === 'archived' ? 'archived' : 'open',
        createdAt: date(stored.createdAt) || date(flag.date),
        updatedAt: date(stored.updatedAt) || date(stored.createdAt) || date(flag.date),
        createdInVersion: text(stored.createdInVersion) || 'anterior',
        updatedInVersion: text(stored.updatedInVersion) || 'anterior',
        question: snapshot(q, object(stored.question)),
        currentQuestionId: replacements.get(id) || (currentIds.has(id) ? id : null)
      };
    }).filter(row => filter === 'all' || row.status === filter)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.questionId.localeCompare(b.questionId));
  }
  const get = id => list().find(row => row.questionId === id) || null;
  const isOpen = id => get(id)?.status === 'open';

  function persist(record) {
    const beforeReports = S.questionReports, beforeFlags = S.flaggedQuestions;
    S.questionReports = {...object(beforeReports), [record.questionId]: record};
    S.flaggedQuestions = {...object(beforeFlags)};
    if (record.status === 'open') S.flaggedQuestions[record.questionId] = {date: record.createdAt, specialty: specialty()};
    else delete S.flaggedQuestions[record.questionId];
    try { saveState(); return {ok: true, record}; }
    catch (_) {
      if (beforeReports === undefined) delete S.questionReports; else S.questionReports = beforeReports;
      if (beforeFlags === undefined) delete S.flaggedQuestions; else S.flaggedQuestions = beforeFlags;
      return {ok: false, error: 'No se pudo guardar. Conserva tu comentario y vuelve a intentarlo.'};
    }
  }

  function saveReport(id, reason, details, expectedSpecialty = specialty()) {
    if (expectedSpecialty !== specialty()) return {ok: false, error: 'La especialidad cambió. Abre nuevamente la pregunta.'};
    if (!safeId(id)) return {ok: false, error: 'Pregunta no disponible.'};
    const q = question(id), previous = get(id);
    if (!q && !previous) return {ok: false, error: 'Pregunta no disponible en esta especialidad.'};
    if (!reasons.some(row => row[0] === reason)) return {ok: false, error: 'Selecciona el motivo del reporte.'};
    details = text(details).trim();
    if (details.length > 1200) return {ok: false, error: 'El comentario admite hasta 1.200 caracteres.'};
    if (reason === 'otro' && !details) return {ok: false, error: 'Describe el problema para que pueda revisarse.'};
    const now = new Date().toISOString();
    return persist({
      questionId: id, specialtyId: specialty(), reason, details, status: 'open',
      createdAt: previous?.createdAt || now, updatedAt: now,
      createdInVersion: previous?.createdInVersion || version, updatedInVersion: version,
      question: snapshot(q, previous?.question)
    });
  }

  function setStatus(id, status) {
    const record = get(id);
    if (!record || !['open', 'archived'].includes(status)) return {ok: false, error: 'Reporte no disponible.'};
    return persist({...record, status, updatedAt: new Date().toISOString(), updatedInVersion: version});
  }

  function exportData(filter = 'all') {
    const active = window.PE20?.active();
    return {
      app: 'ProfeECEP', version, generatedAt: new Date().toISOString(),
      specialty: {id: specialty(), name: active?.name || specialty()},
      delivery: 'Informe descargable; no enviado automáticamente al equipo.',
      reports: list(filter)
    };
  }
  function exportText(filter = 'all') {
    const data = exportData(filter);
    return ['ProfeECEP ' + version + ' · Reportes de preguntas', data.specialty.name,
      'Generado: ' + data.generatedAt, data.delivery, '', ...data.reports.map((r, i) => [
        (i + 1) + '. ' + (r.question.text || 'Pregunta archivada'),
        'ID: ' + r.questionId,
        'Indicador: ' + (r.question.indicator || r.question.indicatorId || 'Sin referencia disponible'),
        ...r.question.options.map((o, n) => String.fromCharCode(65 + n) + '. ' + o),
        'Motivo: ' + reasonName(r.reason), 'Comentario: ' + (r.details || 'Sin comentario'),
        'Estado personal: ' + (r.status === 'open' ? 'Pendiente' : 'Archivado por mí'),
        'Creado: ' + (r.createdAt || 'Sin fecha registrada'), 'Actualizado: ' + (r.updatedAt || 'Sin fecha registrada'),
        r.currentQuestionId && r.currentQuestionId !== r.questionId ? 'Versión revisada disponible: ' + r.currentQuestionId : '', ''
      ].filter(Boolean).join('\n'))].join('\n\n');
  }
  function download(format = 'txt') {
    const json = format === 'json';
    const blob = new Blob([json ? JSON.stringify(exportData(), null, 2) : exportText()], {type: json ? 'application/json' : 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'profeecep-reportes-' + specialty() + '.' + (json ? 'json' : 'txt');
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function close() { document.querySelector('.pe309Overlay')?.remove(); }
  function modal(content) {
    close();
    const overlay = document.createElement('div'); overlay.className = 'qa282Overlay pe309Overlay';
    overlay.innerHTML = '<section class="qa282Modal pe309Modal" role="dialog" aria-modal="true" aria-labelledby="pe309-title"><button type="button" class="close" aria-label="Cerrar reportes" onclick="PE309.close()">×</button>' + content + '</section>';
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    document.body.append(overlay);
    return overlay;
  }
  function openForm(id) {
    const q = question(id), record = get(id);
    if (!q && !record) return;
    const sid = specialty(), note = record?.details || '';
    const overlay = modal('<span class="pill">Reportes · ' + version + '</span><h2 id="pe309-title">Reportar un problema</h2>' +
      '<p class="pe309-question">' + esc(q?.q || record.question.text || 'Pregunta archivada') + '</p>' +
      '<p class="muted">Se guardará con tu progreso. Puedes descargarlo para compartirlo; no se envía automáticamente al equipo.</p>' +
      '<form id="pe309-form"><label for="pe309-reason">¿Qué problema encontraste?</label><select id="pe309-reason" required><option value="">Selecciona un motivo</option>' +
      reasons.map(([code, label]) => '<option value="' + code + '"' + (record?.reason === code ? ' selected' : '') + '>' + esc(label) + '</option>').join('') + '</select>' +
      '<label for="pe309-details">Comentario (obligatorio si eliges «Otro problema»)</label><textarea id="pe309-details" rows="4" maxlength="1200" placeholder="Indica qué alternativa, explicación o dato habría que revisar.">' + esc(note) + '</textarea>' +
      '<p class="tiny">Hasta 1.200 caracteres.</p><p id="pe309-error" role="alert"></p><button type="submit" class="btn full">Guardar reporte</button></form>' +
      '<button type="button" class="btn ghost full" onclick="PE309.openList()">Ver mis reportes</button>');
    overlay.querySelector('#pe309-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const result = saveReport(id, overlay.querySelector('#pe309-reason').value, overlay.querySelector('#pe309-details').value, sid);
      if (!result.ok) { overlay.querySelector('#pe309-error').textContent = result.error; return; }
      inject(); openList('open', 0, 'Reporte guardado. Está pendiente en tu lista; todavía no se ha enviado.');
    });
  }
  function changeStatus(id, status, filter, page) {
    const result = setStatus(id, status);
    if (!result.ok) { const target = document.getElementById('pe309-notice'); if (target) target.textContent = result.error; return; }
    inject(); openList(filter, page, status === 'archived' ? 'Reporte archivado en tu lista. Esto no modifica la pregunta.' : 'Reporte reabierto.');
  }
  function openList(filter = 'open', page = 0, notice = '') {
    if (!['all', 'open', 'archived'].includes(filter)) filter = 'open';
    const rows = list(filter), all = list(), pages = Math.max(1, Math.ceil(rows.length / pageSize));
    page = Math.max(0, Math.min(Number.isInteger(page) ? page : 0, pages - 1));
    modal('<span class="pill">Reportes · ' + version + '</span><h2 id="pe309-title">Mis reportes de preguntas</h2>' +
      '<p class="muted">' + esc(window.PE20?.active()?.name || specialty()) + '. Guardados con tu progreso. Descarga el informe para compartirlo; no se envía automáticamente.</p>' +
      '<p id="pe309-notice" role="status">' + esc(notice) + '</p><div class="pe309-actions">' +
      [['open', 'Pendientes'], ['archived', 'Archivados'], ['all', 'Todos']].map(([value, label]) => '<button type="button" class="mini" aria-pressed="' + (filter === value) + '" onclick="PE309.openList(\'' + value + '\')">' + label + ' (' + (value === 'all' ? all.length : all.filter(r => r.status === value).length) + ')</button>').join('') + '</div>' +
      (rows.length ? rows.slice(page * pageSize, (page + 1) * pageSize).map(r => '<article class="qa282Row pe309-report"><b>' + esc(r.question.text || 'Pregunta archivada · ' + r.questionId) + '</b><p><strong>Motivo:</strong> ' + esc(reasonName(r.reason)) + '</p>' +
        '<p class="pe309-note">' + esc(r.details || 'Sin comentario') + '</p><small>' + esc(r.status === 'open' ? 'Pendiente en tu lista' : 'Archivado por ti') + '</small>' +
        (r.currentQuestionId && r.currentQuestionId !== r.questionId ? '<p class="tiny">Hay una versión revisada de esta pregunta. La observación conserva el enunciado anterior.</p>' : '') +
        '<div class="pe309-actions"><button type="button" class="mini" data-report-id="' + esc(r.questionId) + '" onclick="PE309.openForm(this.dataset.reportId)">Editar motivo</button><button type="button" class="mini" data-report-id="' + esc(r.questionId) + '" onclick="PE309.changeStatus(this.dataset.reportId,\'' + (r.status === 'open' ? 'archived' : 'open') + '\',\'' + filter + '\',' + page + ')">' + (r.status === 'open' ? 'Archivar en mi lista' : 'Reabrir reporte') + '</button></div></article>').join('') : '<p>No tienes reportes en esta lista.</p>') +
      (pages > 1 ? '<div class="pe309-actions"><button type="button" class="mini"' + (!page ? ' disabled' : '') + ' onclick="PE309.openList(\'' + filter + '\',' + (page - 1) + ')">Anterior</button><span>Página ' + (page + 1) + ' de ' + pages + '</span><button type="button" class="mini"' + (page === pages - 1 ? ' disabled' : '') + ' onclick="PE309.openList(\'' + filter + '\',' + (page + 1) + ')">Siguiente</button></div>' : '') +
      (all.length ? '<button type="button" class="btn full" onclick="PE309.download()">Descargar informe de todos mis reportes</button>' : ''));
  }
  function questionButton(q) {
    return '<button type="button" class="mini qa282tool" data-report-id="' + esc(q.id) + '" onclick="PE309.openForm(this.dataset.reportId)">' + (isOpen(q.id) ? 'Editar mi reporte' : 'Reportar un problema') + '</button>';
  }
  function inject() {
    const progress = el('progress'); if (!progress) return;
    let card = progress.querySelector('.pe309-reports');
    if (!card) { card = document.createElement('section'); card.className = 'card pe309-reports'; progress.prepend(card); }
    const pending = list('open').length, archived = list('archived').length;
    card.innerHTML = '<span class="pill">Reportes · ' + version + '</span><h3>Reportes de preguntas</h3><p>' + pending + ' pendientes · ' + archived + ' archivados en tu lista.</p><p class="muted">Revisa tus observaciones y descarga un informe para compartirlo. No se envían automáticamente.</p><button type="button" class="btn full" onclick="PE309.openList()">Ver mis reportes</button>';
    document.querySelectorAll('[data-report-id].qa282tool').forEach(button => { button.textContent = isOpen(button.dataset.reportId) ? 'Editar mi reporte' : 'Reportar un problema'; });
  }
  window.PE309 = {version, reasons, reasonName, list, get, isOpen, saveReport, setStatus, exportData, exportText, download, openForm, openList, close, changeStatus, questionButton, inject};
  const previousRender = window.render;
  window.render = function () { const result = previousRender.apply(this, arguments); setTimeout(inject, 0); return result; };
  setTimeout(inject, 0);
}());
