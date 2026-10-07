const test = require('node:test'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const {runtime, specialties, element} = require('./helpers/runtime.cjs');
const baseline = require('./fixtures/bank-308-preservation.json');
const plain = value => JSON.parse(JSON.stringify(value));
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

for (const sid of Object.keys(specialties)) {
  test(sid + ': las preguntas previas permanecen idénticas a 3.0.8 y un reporte sobrevive a la recarga', () => {
    const app = runtime(sid), q = app.run('Q[0]');
    const before = plain(app.run('({history:S.history,total:S.total,right:S.right,wrong:S.wrong,simulations:S.simulations})'));
    assert.equal(app.context.PE309.saveReport(q.id, 'explicacion', 'La razón de la alternativa B necesita más detalle.').ok, true);
    const reloaded = runtime(sid, {storage: app.storage}), report = reloaded.context.PE309.get(q.id);
    assert.equal(report.reason, 'explicacion'); assert.match(report.details, /alternativa B/);
    assert.equal(hash(reloaded.run('Q').filter(q => !['3.0.10','3.0.11'].includes(q.version))), baseline[sid].active);
    assert.equal(hash(reloaded.context.PE307.fullBank().filter(q => !['3.0.10','3.0.11'].includes(q.version))), baseline[sid].historical);
    assert.deepEqual(plain(reloaded.run('({history:S.history,total:S.total,right:S.right,wrong:S.wrong,simulations:S.simulations})')), before);
    assert.equal(reloaded.context.PE309.list().length, 1);
  });
}

test('tres intentos personales nunca certifican la dificultad o la calidad', () => {
  const app = runtime();
  app.run('S.history=[{id:Q[0].id,ok:true},{id:Q[0].id,ok:true},{id:Q[0].id,ok:false}]');
  const q = app.run('Q[0]');
  assert.equal(app.context.PE282.calibration(q).scope, 'personal');
  assert.equal(app.context.PE284.inspect(q).scope, 'personal');
  assert.doesNotMatch(app.context.PE282.calibration(q).label, /calibrad|validada|difícil|fácil/i);
  assert.equal(app.context.PE284.inspect(q).p, 67);
  app.run("S.questionReviews={[Q[0].id]:{status:'validada',date:'2026-09-20'}}");
  assert.equal(app.context.PE284.status(q), 'revisada');
  assert.equal(app.run('S.questionReviews[Q[0].id].status'), 'validada');
  assert.equal(app.context.PE284.setStatus(q.id, 'validada'), false);
});

test('marcas anteriores y preguntas sustituidas conservan la referencia histórica', () => {
  const app = runtime('basica-ingles'), id = 'basica-ingles-306-2023-35';
  app.context.oldId = id; app.run("S.flaggedQuestions={[oldId]:{date:'2026-09-20',specialty:'basica-ingles'}};saveState()");
  const report = app.context.PE309.get(id);
  assert.equal(report.reason, 'sin-detalle'); assert.equal(report.currentQuestionId, id + '-r308');
  assert.equal(report.question.id, id);
  assert.equal(app.context.PE309.saveReport(id, 'clave', 'Revisar la inversión de sujeto y verbo.').ok, true);
  assert.equal(app.context.PE309.list().length, 1); assert.equal(app.context.PE309.get(id).createdAt, '2026-09-20');
  assert.equal(app.context.PE309.setStatus(id, 'archived').ok, true);
  assert.equal(app.context.PE309.list('open').length, 0); assert.equal(app.context.PE309.list('archived').length, 1);
  assert.equal(app.run('Object.keys(S.flaggedQuestions).length'), 0);
  assert.equal(app.context.PE309.setStatus(id, 'open').ok, true);
  assert.equal(app.context.PE309.get(id).details, 'Revisar la inversión de sujeto y verbo.');
});

test('motivos válidos, límites, especialidad y guardado fallido no corrompen los reportes', () => {
  const app = runtime(), q = app.run('Q[0]');
  for (const [id, reason, note, sid] of [[q.id,'',''], [q.id,'inventado','texto'], [q.id,'otro',''], [q.id,'otro','x'.repeat(1201)], ['__proto__','clave',''], ['id-inexistente','clave',''], [q.id,'clave','','basica-ingles']]) {
    assert.equal(app.context.PE309.saveReport(id, reason, note, sid).ok, false);
  }
  assert.equal(app.context.PE309.list().length, 0);
  assert.equal(app.context.PE309.saveReport(q.id, 'otro', 'Observación').ok, true);
  const before = plain(app.context.PE309.get(q.id));
  app.context.PE_PROGRESS.save = () => { throw Error('disco lleno'); };
  assert.equal(app.context.PE309.saveReport(q.id, 'clave', 'nuevo texto').ok, false);
  assert.equal(app.context.PE309.setStatus(q.id, 'archived').ok, false);
  assert.deepEqual(plain(app.context.PE309.get(q.id)), before);
});

test('los reportes se aíslan por especialidad y por copia de cuenta', () => {
  const storage = new Map(), math = runtime('basica-matematica', {storage});
  math.context.PE309.saveReport(math.run('Q[0].id'), 'material', 'Revisar figura.');
  const english = runtime('basica-ingles', {storage}); assert.equal(english.context.PE309.list().length, 0);
  english.context.PE309.saveReport(english.run('Q[0].id'), 'redaccion', 'Revisar enunciado.');
  const mathAgain = runtime('basica-matematica', {storage}); assert.equal(mathAgain.context.PE309.list().length, 1);
  assert.equal(mathAgain.context.PE309.list()[0].reason, 'material');
  assert.equal(runtime('basica-matematica', {storage: new Map()}).context.PE309.list().length, 0);
});

test('el respaldo y reconciliación conservan los reportes y detectan cambios divergentes', () => {
  const app = runtime(), q = app.run('Q[0]');
  app.run('saveState()'); const base = plain(app.context.PE_PROGRESS.read());
  app.context.PE309.saveReport(q.id, 'material', 'No se ve la imagen.');
  const local = plain(app.context.PE_PROGRESS.read()), remote = plain(base);
  assert.equal(app.context.PE303_SYNC.validBackup(local), true);
  const merged = app.context.PE303_SYNC.reconcile(local, remote, base, '2026-10-03');
  assert.equal(merged.conflicts.length, 0); assert.equal(merged.state.questionReports[q.id].reason, 'material');
  remote.questionReports = {[q.id]: {...local.questionReports[q.id], details:'Otra observación desde otro dispositivo.'}};
  assert.deepEqual(plain(app.context.PE303_SYNC.reconcile(local, remote, base, '2026-10-03').conflicts), ['basica-matematica']);
});

test('el formulario no revela claves en un simulacro y conserva reloj y respuesta', () => {
  const app = runtime(); app.run('PE283.start()');
  const q = app.run('quiz[0]'), before = plain(app.run('SIM12'));
  app.context.PE309.openForm(q.id);
  const modal = app.document.body.children.at(-1).innerHTML;
  assert.match(modal, /Reportar un problema/); assert.doesNotMatch(modal, /Respuesta correcta:|answerKey|pe304-feedback/);
  assert.equal(modal.includes(q.e), false);
  assert.equal(app.context.PE309.saveReport(q.id, 'ambigua', 'Comparar A y B.').ok, true);
  assert.deepEqual(plain(app.run('SIM12')), before); assert.equal(app.run('S.history.length'), 0);
  const feedback = app.context.PE304.review(q, undefined); assert.match(feedback, /Editar mi reporte/);
});

test('contenido del usuario se muestra como texto y el informe excluye claves, tokens e historial', () => {
  const app = runtime(), q = app.run('Q[0]'), note = '<img src=x onerror=alert(1)> & "nota"';
  app.context.PE309.saveReport(q.id, 'otro', note); app.context.PE309.openList();
  const html = app.document.body.children.at(-1).innerHTML;
  assert.match(html, /&lt;img/); assert.doesNotMatch(html, /<img src=x/);
  const data = plain(app.context.PE309.exportData()), report = data.reports[0];
  assert.equal(report.details, note); assert.equal(report.question.id, q.id);
  assert.deepEqual(Object.keys(report.question).sort(), ['domain','id','indicator','indicatorId','options','subdomain','text']);
  for (const name of ['history','simulations','email','user','token','access_token']) assert.equal(data[name], undefined);
  assert.match(app.context.PE309.exportText(), /no enviado automáticamente/);
});

test('los informes descargados contienen todas las observaciones y la paginación no oculta reportes', async () => {
  const app = runtime();
  for (const q of app.run('Q').slice(0, 25)) app.context.PE309.saveReport(q.id, 'redaccion', 'Comentario para ' + q.id);
  app.context.PE309.openList('all', 1);
  assert.match(app.document.body.children.at(-1).innerHTML, /Página 2 de 2/);
  assert.equal((app.document.body.children.at(-1).innerHTML.match(/<article /g) || []).length, 5);
  let blob, clicked = false;
  app.context.URL = {createObjectURL(value) { blob = value; return 'blob:test'; }, revokeObjectURL() {}};
  const previous = app.document.createElement;
  app.document.createElement = tag => tag === 'a' ? {...element(), click() { clicked = true; }} : previous(tag);
  app.context.PE309.download(); assert.equal(clicked, true);
  const output = await blob.text(); for (const row of app.context.PE309.list()) assert.ok(output.includes(row.questionId));
  assert.equal(app.context.PE309.exportData().reports.length, 25);
});
