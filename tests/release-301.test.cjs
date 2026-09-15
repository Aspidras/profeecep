const test = require('node:test');
const assert = require('node:assert/strict');
const {runtime, specialties, element} = require('./helpers/runtime.cjs');
const plain = value => JSON.parse(JSON.stringify(value));

for (const [specialty, count] of Object.entries(specialties)) {
  test(`${specialty}: carga el banco completo sin mezclar especialidades`, () => {
    const app = runtime(specialty);
    assert.equal(app.run('Q.length'), count);
    assert.equal(app.run('new Set(Q.map(q => q.id)).size'), count);
    assert.equal(app.run("Q.every(q => q.specialtyId === PE_ACTIVE_SPECIALTY || (!q.specialtyId && PE_ACTIVE_SPECIALTY === 'basica-matematica'))"), true);
  });

  test(`${specialty}: el panel cuenta el banco activo y distingue los bancos no cargados`, () => {
    const app = runtime(specialty), report = app.context.PE30.status();
    assert.equal(report.version, '3.0.3');
    assert.equal(report.activeQuestions, count);
    assert.equal(report.partial, specialty !== 'basica-matematica');
    assert.equal(report.totalQuestions, specialty === 'basica-matematica' ? 714 : 487);
    if (report.partial) {
      const math = report.specialties.find(item => item.id === 'basica-matematica');
      assert.equal(math.count, null);
      assert.equal(math.loaded, false);
    }
  });

  test(`${specialty}: 100 simulacros con 60 preguntas únicas y equilibrio por dominio`, () => {
    const app = runtime(specialty);
    const before = app.run('JSON.stringify(Q)');
    for (let n = 0; n < 100; n++) {
      const questions = app.context.PE283.build();
      assert.equal(questions.length, 60);
      assert.equal(new Set(questions.map(q => q.id)).size, 60);
      for (const row of app.context.PE283.blueprint()) {
        if (row.available >= row.target) {
          assert.equal(questions.filter(q => q.d === row.domain).length, row.target);
        }
      }
    }
    assert.equal(app.run('JSON.stringify(Q)'), before, 'no cambia preguntas, respuestas ni IDs');
  });

  test(`${specialty}: puntaje, omisiones y persistencia del simulacro`, () => {
    const app = runtime(specialty);
    app.run(`
      S.done = ['0-0-0']; saveState(); PE283.start();
      quiz.forEach((q, i) => {
        if (i < 30) SIM12.answers[q.id] = q.a;
        else if (i < 50) SIM12.answers[q.id] = (q.a + 1) % q.o.length;
      });
      SIM12.seconds -= 135; finishSimulation12();
    `);
    const result = plain(app.run('S.simulations.at(-1)'));
    assert.equal(result.total, 60);
    assert.equal(result.right, 30);
    assert.equal(result.unanswered, 10);
    assert.equal(result.durationSeconds, 135);
    assert.equal(app.run('S.history.length'), 50);
    assert.equal(app.run('new Set(S.history.map(row => row.id)).size'), 50);
    assert.equal(app.run('S.wrong.length'), 20);
    const reloaded = runtime(specialty, {storage: app.storage});
    assert.deepEqual(plain(reloaded.run('S.simulations.at(-1)')), result);
    assert.deepEqual(plain(reloaded.run('S.done')), ['0-0-0']);
  });

  test(`${specialty}: práctica de microlección limitada al indicador elegido`, () => {
    const app = runtime(specialty);
    for (const indicator of app.run('flat')) {
      const related = app.context.PE16.related(indicator);
      assert.ok(related.length > 0);
      assert.ok(related.every(q => q.indicatorId === indicator.id));
      app.context.PE16.practice(indicator.id);
      assert.ok(app.run('quiz').every(q => q.indicatorId === indicator.id));
    }
  });

  if (specialty !== 'basica-matematica') {
    test(`${specialty}: conserva y recupera las guías específicas originales`, () => {
      let originals;
      const app = runtime(specialty, {afterScript(file, context) {
        if (file === 'content-22.js') originals = plain(context.PE22_CONTENT[specialty].guides);
      }});
      const pack = app.context.PE22_CONTENT[specialty];
      for (const [id, original] of Object.entries(originals)) {
        assert.equal(pack.guides[id].learn, original.learn);
      }
      for (const [id, guide] of Object.entries(pack.guides)) {
        if (guide.status === 'draft') {
          assert.equal(app.context.PE16.guide({id}), null);
          continue;
        }
        assert.equal(app.context.STUDY_GUIDES[id], guide);
        const indicator = app.run(`flat.find(x => x.id === ${JSON.stringify(id)})`);
        assert.equal(app.context.PE16.guide(indicator), guide);
        app.context.PE16.open(id);
        assert.ok(app.elements.get('study').innerHTML.includes(app.context.PE16.escape(guide.learn)));
        assert.equal(app.context.PE17.contextFromStudy().guide, guide);
        const question = pack.questions.find(q => q.indicatorId === id);
        assert.equal(app.context.PE17.contextFromQuestion(question).guide, guide);
      }
      const missing = app.run('flat').find(x => !app.context.PE16.guide(x));
      assert.ok(missing, 'incluye un indicador cuya microlección aún está pendiente');
      assert.equal(app.context.PE16.guide(missing), null);
      app.context.PE16.open(missing.id);
      assert.match(app.elements.get('study').innerHTML, /Microlección específica pendiente/);
      assert.equal(app.context.PE17.contextFromStudy().guide, null);
    });
  }
}

test('generador: banco vacío, corto, IDs repetidos y una sola dificultad', () => {
  const app = runtime();
  app.run('Q.splice(0)');
  assert.equal(app.context.PE283.build().length, 0);
  app.run(`Q.push(...Array.from({length: 7}, (_, n) => ({id: 'test-' + n, d: D[0][0], diff: 'media'}))); Q.push(Q[0], Q[1]);`);
  const short = app.context.PE283.build();
  assert.equal(short.length, 7);
  assert.equal(new Set(short.map(q => q.id)).size, 7);
  assert.equal(app.context.PE283.blueprint()[0].target, 7);
  app.run(`Q.splice(0); Q.push(...Array.from({length: 80}, (_, n) => ({id: 'test-' + n, d: D[0][0], diff: 'media'})));`);
  assert.equal(new Set(app.context.PE283.build().map(q => q.id)).size, 60);
});

test('generador: redistribuye cupos cuando un dominio tiene pocas preguntas', () => {
  const app = runtime();
  app.run(`Q.splice(0); Q.push({id: 'rare', d: D[0][0]}, ...Array.from({length: 70}, (_, n) => ({id: 'test-' + n, d: D[1][0]})));`);
  const questions = app.context.PE283.build();
  assert.equal(questions.length, 60);
  assert.equal(new Set(questions.map(q => q.id)).size, 60);
  assert.ok(questions.some(q => q.id === 'rare'));
});

test('simulacro configurable: registra el tiempo usado, no 45 minutos fijos', () => {
  const app = runtime();
  const count = element('sim21count'); count.value = '10';
  app.elements.set(count.id, count);
  app.selectors.set('.sim21domain:checked', app.run('D.map(d => ({value: d[0]}))'));
  app.run('PE21.start(); SIM12.seconds -= 10; finishSimulation12()');
  assert.equal(app.run('S.simulations.at(-1).durationSeconds'), 10);
});

test('Matemática conserva las guías históricas de subdominio con su alcance visible', () => {
  const app = runtime();
  const indicator = app.run('flat[0]');
  assert.equal(app.context.PE16.guide(indicator), app.context.STUDY_GUIDES[indicator.sub]);
  app.context.PE16.open(indicator.id);
  assert.match(app.elements.get('study').innerHTML, /Guía del subdominio/);
});

test('guardar un simulacro no modifica el progreso de otra especialidad', () => {
  const math = runtime();
  math.run("S.done = ['0-0-0']; S.right = 4; S.total = 7; saveState()");
  const science = runtime('basica-ciencias', {storage: math.storage});
  science.run('PE283.start(); finishSimulation12()');
  const restored = runtime('basica-matematica', {storage: math.storage});
  assert.equal(restored.run('S.right'), 4);
  assert.equal(restored.run('S.total'), 7);
  assert.deepEqual(plain(restored.run('S.done')), ['0-0-0']);
  assert.equal(restored.run('S.simulations.length'), 0);
});

test('simulacro de cobertura con banco reducido conserva la duración real', () => {
  const app = runtime();
  app.run('Q.splice(5); PE28.startFull(); SIM12.seconds -= 25; finishSimulation12()');
  assert.equal(app.run('S.simulations.at(-1).durationSeconds'), 25);
  assert.equal(app.run('S.simulations.at(-1).total'), 5);
});

test('simulacro: corregir una selección no duplica el registro de respuesta', () => {
  const app = runtime();
  app.run('PE283.start(); sim12Choose((quiz[0].a + 1) % 4); sim12Choose(quiz[0].a); sim12Go(1); sim12Mark(); sim12Go(0)');
  assert.equal(app.run('Object.keys(SIM12.answers).length'), 1);
  assert.equal(app.run('SIM12.marked[quiz[1].id]'), true);
  app.run('quiz.forEach(q => SIM12.answers[q.id] = q.a); finishSimulation12()');
  assert.equal(app.run('S.simulations.at(-1).right'), 60);
  assert.equal(app.run('S.history.length'), 60);
  app.run('finishSimulation12()');
  assert.equal(app.run('S.simulations.length'), 1);
});

test('microlección: varía la práctica entre todas las preguntas del indicador', () => {
  const app = runtime(), seen = new Set();
  app.run(`Q.splice(0); Q.push(...Array.from({length: 12}, (_, n) => ({id: 'practice-' + n, indicatorId: '0-0-0', d: D[0][0], i: flat[0].sub, q: 'Pregunta ' + n, o: ['a','b','c','d'], a: 0, e: 'Explicación'})));`);
  for (let n = 0; n < 30; n++) {
    app.context.PE16.practice('0-0-0');
    const questions = app.run('quiz');
    assert.equal(questions.length, 5);
    questions.forEach(q => seen.add(q.id));
  }
  assert.equal(seen.size, 12);
  const prior = app.run('JSON.stringify(quiz)');
  app.context.PE16.practice('invalid');
  assert.equal(app.run('JSON.stringify(quiz)'), prior);
});
