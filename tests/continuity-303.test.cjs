const test = require('node:test');
const assert = require('node:assert/strict');
const {runtime, specialties} = require('./helpers/runtime.cjs');
const plain = value => JSON.parse(JSON.stringify(value));
for (const specialty of Object.keys(specialties)) {
  test(specialty + ': recuperar simulacro conserva preguntas, respuestas, marcas y tiempo real', () => {
    const clock = {now: Date.parse('2026-09-15T10:00:00Z')}, app = runtime(specialty, {clock});
    app.run('PE283.start();sim12Choose(2);sim12Mark();sim12Go(4);sim12Choose(1)');
    const ids = plain(app.run('quiz.map(q=>q.id)')), saved = plain(app.run('SIM12'));
    clock.now += 65000;
    const next = runtime(specialty, {storage: app.storage, clock}); next.run('PE303.resume()');
    assert.deepEqual(plain(next.run('quiz.map(q=>q.id)')), ids);
    assert.deepEqual(plain(next.run('SIM12.answers')), saved.answers); assert.deepEqual(plain(next.run('SIM12.marked')), saved.marked);
    assert.equal(next.run('SIM12.index'), 4); assert.equal(next.run('SIM12.seconds'), 8935);
  });
}
test('un simulacro vencido al recargar se evalúa una sola vez', () => {
  const clock = {now: Date.parse('2026-09-15T10:00:00Z')}, app = runtime('basica-matematica', {clock});
  app.run('PE283.start();sim12Choose(quiz[0].a)'); clock.now += 9001000;
  const next = runtime('basica-matematica', {storage: app.storage, clock}); next.run('PE303.resume();PE303.resume()');
  assert.equal(next.run('S.simulations.length'), 1); assert.equal(next.run('S.simulations[0].right'), 1); assert.equal(next.run('S.simulations[0].durationSeconds'), 9000);
  assert.equal(next.run('PE303.draft()'), null);
});
test('una interrupción después de guardar el resultado no duplica la entrega', () => {
  const app = runtime(); app.run('PE283.start();sim12Choose(1)'); const draft = app.run('JSON.stringify(PE303.draft())');
  app.run('finishSimulation12()'); const key = [...app.storage.keys()].find(k => k.startsWith('pe_simulation_303_')) || 'pe_simulation_303_guest_basica-matematica'; app.storage.set(key, draft);
  const next = runtime('basica-matematica', {storage: app.storage}); next.run('PE303.resume()'); assert.equal(next.run('S.simulations.length'), 1);
});
test('el cronómetro usa el tiempo transcurrido aunque se suspendan sus intervalos', () => {
  const clock = {now: Date.parse('2026-09-15T10:00:00Z')}, app = runtime('basica-matematica', {clock}); app.run('PE283.start()');
  clock.now += 125000; for (const {fn} of app.intervals.values()) fn(); assert.equal(app.run('SIM12.seconds'), 8875);
});
test('practicar durante un simulacro guarda el borrador y detiene su evaluación sobre otra lista', () => {
  const app = runtime(); app.run('PE283.start();sim12Choose(1)'); const ids = plain(app.run('PE303.draft().questions'));
  app.run('startQuiz();pick(0,document.createElement("button"));checkAnswer()'); assert.equal(app.run('SIM12'), null); assert.equal(app.intervals.size, 0);
  assert.deepEqual(plain(app.run('PE303.draft().questions')), ids); assert.equal(app.run('S.total'), 1);
});
test('cancelar el reemplazo conserva el simulacro pendiente', () => {
  const app = runtime('basica-matematica', {confirm: () => false}); app.run('PE283.start();sim12Choose(1)'); const id = app.run('SIM12.sessionId');
  app.run('PE28.startFull()'); assert.equal(app.run('SIM12.sessionId'), id);
});
test('los borradores no aparecen en otra especialidad ni otra cuenta', () => {
  const app = runtime(); app.run('PE283.start();sim12Choose(1)');
  const science = runtime('basica-ciencias', {storage: app.storage}); assert.equal(science.run('PE303.draft()'), null);
  app.storage.set('pe_owner', 'other-account'); const other = runtime('basica-matematica', {storage: app.storage}); assert.equal(other.run('PE303.draft()'), null);
});
test('un doble toque en Responder no duplica la práctica ni el diagnóstico', () => {
  const app = runtime(); app.run('startQuiz();pick(0,document.createElement("button"));checkAnswer();checkAnswer()'); assert.equal(app.run('S.total'), 1); assert.equal(app.run('answers.length'), 1);
  app.run('startDiagnosis();pick(0,document.createElement("button"));checkAnswer();checkAnswer()'); assert.equal(app.run('answers.length'), 1);
});
test('diagnóstico completo persiste resultado y regresa a la especialidad correcta', () => {
  const app = runtime('basica-ciencias'); app.run('startDiagnosis();while(pos<quiz.length){pick(quiz[pos].a,document.createElement("button"));checkAnswer();nextQ()}');
  const next = runtime('basica-ciencias', {storage: app.storage}); assert.equal(next.run('S.diagnosis.right'), next.run('S.diagnosis.total')); assert.equal(next.run('S.diagnosis.specialtyId'), 'basica-ciencias');
});
test('respaldo de una especialidad conserva las demás y rechaza datos inválidos', () => {
  const app = runtime(); const sync = app.context.PE303_SYNC;
  const before = {done: ['0-0-0'], specialtyProgress: {'basica-ciencias': {done: ['1-0-0']}}};
  const imported = sync.importBackup(before, {done: ['0-0-2']});
  assert.deepEqual(plain(imported.done), ['0-0-2']); assert.deepEqual(plain(imported.specialtyProgress['basica-ciencias'].done), ['1-0-0']);
  for (const bad of [[], {}, {done:'wrong'}, {done:[],history:[null]}, {done:[],byDomain:{numbers:null}}, JSON.parse('{"done":[],"__proto__":{"polluted":true}}')]) assert.equal(sync.validBackup(bad), false);
});
