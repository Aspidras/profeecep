// ProfeECEP 3.0.5 — historical practice, with self-contained accessible stimuli.
(function () {
  'use strict';
  const esc = PE304.esc;
  const math = 'basica-matematica';
  const assetNames = new Set((window.PE305_ITEMS || []).flatMap(q => q.stimulus.filter(s => s.kind === 'figure').map(s => s.asset)));
  const assetURL = name => assetNames.has(name) && /^[a-z0-9-]+\.svg$/.test(name) ? 'assets/prior-2023/' + name + '?v=3.0.5' : null;
  const inserted = new Set();
  for (const item of window.PE305_ITEMS || []) {
    if (item.specialtyId === math && PE_ACTIVE_SPECIALTY !== math) continue;
    const syllabus = item.specialtyId === math ? ECEP_DATA : PE_SYLLABUS_2026[item.specialtyId];
    const [di, si, ii] = item.indicatorId.split('-').map(Number);
    const domain = syllabus?.[di], subdomain = domain?.[1]?.[si], indicator = subdomain?.[1]?.[ii];
    const target = item.specialtyId === math ? QBANK : PE22_CONTENT[item.specialtyId]?.questions;
    if (!indicator || !target) throw new Error('Clasificación inválida: ' + item.id);
    if (target.some(q => q.id === item.id)) continue;
    target.push({...item, d: domain[0], i: subdomain[0], indicator});
    inserted.add(item.id);
  }
  function stimulus(q) {
    if (!q?.stimulus?.length) return '';
    return '<div class="pe305-stimuli" aria-label="Material para responder">' + q.stimulus.map(s => {
      if (s.kind === 'text') return '<section class="pe305-reading"><h3>' + esc(s.title) + '</h3><p>' + esc(s.text).replace(/\n/g, '<br>') + '</p></section>';
      if (s.kind === 'table') return '<div class="pe305-table" role="region" aria-label="' + esc(s.title) + '" tabindex="0"><table><caption>' + esc(s.title) + '</caption><thead><tr>' + s.columns.map(c => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + s.rows.map(row => '<tr>' + row.map((cell, i) => i ? '<td>' + esc(cell) + '</td>' : '<th scope="row">' + esc(cell) + '</th>').join('') + '</tr>').join('') + '</tbody></table></div>';
      const url = s.kind === 'figure' && assetURL(s.asset);
      if (!url) return '';
      return '<figure class="pe305-figure"><figcaption>' + esc(s.title) + '</figcaption><img src="' + esc(url) + '" alt="' + esc(s.alt) + '" loading="eager"><a href="' + esc(url) + '" target="_blank" rel="noopener">Ampliar imagen<span class="pe305-sr-only">: ' + esc(s.title) + ' (se abre en otra pestaña)</span></a><details><summary>Descripción de la imagen</summary><p>' + esc(s.alt) + '</p></details></figure>';
    }).join('') + '</div>';
  }
  // Adaptation notes can contain a solution. Display ONLY with feedback, never
  // with the unanswered stimulus, question catalog or active simulation.
  function source(q) {
    const s = q?.source;
    if (!s) return '';
    return '<details class="pe305-source"><summary>Origen y adaptación de esta pregunta</summary><p>' + esc(s.file) + ' · ' + s.year + ' · pregunta ' + s.number + ' · página ' + s.page + '.</p><p>' + esc(s.adaptation) + '</p><p>Adaptación de práctica ProfeECEP, vinculada al temario 2026 cargado. No es una pregunta oficial de 2026. Dificultad estimada para estudio.</p></details>';
  }
  const formats = [
    ['all', 'Todos los formatos'], ['tables', 'Tablas'], ['visual', 'Gráficos y diagramas'],
    ['reading', 'Textos y viñetas'], ['classroom', 'Situaciones de aula']
  ];
  function matches(q, format) {
    if (format === 'all') return true;
    if (format === 'tables') return q.stimulus.some(s => s.kind === 'table');
    if (format === 'visual') return q.stimulus.some(s => s.kind === 'figure') && !['cómic', 'infografía'].includes(q.questionType);
    if (format === 'reading') return q.specialtyId === 'basica-lenguaje' && q.stimulus.length > 0;
    if (format === 'classroom') return q.indicatorId.startsWith((q.specialtyId === math ? '4' : q.specialtyId === 'basica-ciencias' ? '6' : '2') + '-');
    return false;
  }
  const pool = (format = 'all') => Q.filter(q => q.version === '3.0.5' && q.source?.year === 2023 && matches(q, format));
  function start(format = 'all', id = null) {
    const selected = id ? pool().filter(q => q.id === id) : shuffle(pool(format)).slice(0, 5);
    if (!selected.length) return false;
    mode = 'practice'; quiz = selected; pos = 0; answers = []; sel = null;
    showQ(); return true;
  }
  function startFromForm() { return start(document.getElementById('pe305-format')?.value || 'all'); }
  function practiceQuestion(id) { return start('all', id); }
  function practiceCard() {
    const rows = pool();
    if (!rows.length) return '';
    return '<span class="pill">Pruebas anteriores · 2023</span><h3>Practica con nuevos formatos</h3><p>' + rows.length + ' preguntas adaptadas para tu especialidad, con explicación de cada alternativa.</p><label for="pe305-format">Tipo de práctica</label><select id="pe305-format">' + formats.filter(([id]) => pool(id).length).map(([id, label]) => '<option value="' + id + '">' + label + ' (' + pool(id).length + ')</option>').join('') + '</select><button class="btn full" onclick="PE305.startFromForm()">Practicar pruebas anteriores</button><details class="pe305-catalog"><summary>Explorar las ' + rows.length + ' preguntas</summary><ol>' + rows.map(q => '<li><button class="pe305-question-link" data-question-id="' + esc(q.id) + '" onclick="PE305.practiceQuestion(this.dataset.questionId)"><small>' + esc(q.questionType) + ' · referencia ' + q.source.number + '</small><span>' + esc(q.q) + '</span></button></li>').join('') + '</ol></details><p class="tiny">Selección de cuadernillos aportados para estudio. Son adaptaciones ProfeECEP; no anticipan preguntas oficiales de 2026.</p>';
  }
  function inject() {
    const rows = pool();
    if (!rows.length) return;
    const practice = el('practice');
    const inQuestion = document.querySelector('.screen.on')?.id === 'practice' && mode === 'practice' && quiz.length && pos < quiz.length;
    if (practice && !inQuestion && !practice.querySelector('.pe305-practice')) {
      const card = document.createElement('section'); card.className = 'card pe305-practice'; card.innerHTML = practiceCard(); practice.prepend(card);
    }
    const dashboard = el('home')?.querySelector('.pe302-dashboard');
    if (dashboard && !dashboard.querySelector('.pe305-home')) {
      const card = document.createElement('section'); card.className = 'card pe305-home';
      card.innerHTML = '<span class="pill">Nuevo · Pruebas anteriores</span><h2>' + rows.length + ' preguntas para entrenar</h2><p>Casos, representaciones y explicaciones de las cuatro alternativas.</p><button class="btn ghost full" onclick="PE302.navigate(\'practice\',\'.pe305-practice\')">Explorar preguntas de 2023</button>';
      const anchor = dashboard.querySelector('.pe302-groups'); if (anchor) anchor.before(card); else dashboard.append(card);
    }
  }
  window.PE305 = {stimulus, source, pool, start, startFromForm, practiceQuestion, practiceCard, inject, assetURL, inserted};
  const previousRender = window.render;
  window.render = function () { const result = previousRender.apply(this, arguments); setTimeout(inject, 0); return result; };
  setTimeout(inject, 0);
}());
