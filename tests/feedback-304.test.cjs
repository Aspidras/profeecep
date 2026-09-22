const test = require('node:test');
const assert = require('node:assert/strict');
const {runtime, specialties, element} = require('./helpers/runtime.cjs');
const plain = value => JSON.parse(JSON.stringify(value));

for (const [sid, count] of Object.entries(specialties)) {
  test(`${sid}: cada opción tiene una razón propia y conserva ID, clave y progreso`, () => {
    let before;
    const app = runtime(sid, {afterScript(file, context) {
      if (file === 'bank-287.js') before = plain(context.QBANK.map(q => ({id:q.id,a:q.a,count:q.o.length})));
    }});
    assert.equal(app.run('Q.length'), count);
    const originalIds = new Set(before.map(q => q.id));
    assert.deepEqual(plain(app.run('Q')).filter(q => originalIds.has(q.id)).map(q => ({id:q.id,a:q.a,count:q.o.length})), before);
    for (const q of app.run('Q')) {
      assert.equal(app.context.PE304.complete(q), true, q.id);
      assert.equal(q.e, q.explanations[q.a], q.id);
      assert.equal(new Set(q.o).size, 4, q.id);
      assert.equal(q.explanations.some(x=>/no tiene todavía|según la explicación disponible|no se ajusta a la evidencia/.test(x)), false, q.id);
      const ctx=app.context.PE17.contextFromQuestion(q);
      assert.ok(app.context.PE17.simple(ctx).includes(app.context.PE17.escape(q.e)), q.id);
      const html=app.context.PE17.whyOthers(ctx);
      q.explanations.forEach(reason=>assert.ok(html.includes(app.context.PE17.escape(reason)), q.id));
    }
    assert.equal(app.run('S.total'),0);
    assert.equal(app.run('S.history.length'),0);
  });
}

test('captura reportada: punto de vista, sin microlección, explica A, B, C y D', () => {
  const app=runtime('basica-ingles');
  const q=app.run("Q.find(q=>q.id==='basica-ingles-281-0-0-8-1')");
  const ctx=app.context.PE17.contextFromQuestion(q);
  assert.equal(ctx.guide,null);
  assert.match(app.context.PE17.simple(ctx),/qué sostiene o valora el emisor/);
  assert.match(q.explanations[0],/otro contenido/);
  assert.match(q.explanations[1],/ejecución mecánica/);
  assert.match(q.explanations[2],/palabras o fragmentos/);
  assert.match(q.explanations[3],/reproducir una definición/);
  assert.equal(new Set(q.explanations).size,4);
});

test('tutor usa la pregunta elegida aunque exista una guía más amplia', () => {
  const app=runtime();
  const q=app.run("Q.find(q=>q.id==='n2')"),ctx=app.context.PE17.contextFromQuestion(q);
  ctx.guide={learn:'ESTA GUÍA NO EXPLICA EL DESCUENTO',error:'OTRO ERROR'};
  assert.match(app.context.PE17.simple(ctx),/10.000/);
  assert.doesNotMatch(app.context.PE17.simple(ctx),/ESTA GUÍA/);
  assert.match(app.context.PE17.remember(ctx),/30.000/);
  assert.match(app.context.PE17.whyOthers(ctx),/monto del descuento/);
});

test('práctica: explica el distractor elegido, permite revisar todas y no duplica estadísticas', () => {
  const app=runtime();
  app.run("quiz=[Q.find(q=>q.id==='n2')];mode='practice';pos=0;answers=[];sel=0;checkAnswer();checkAnswer()");
  const html=app.elements.get('practice').innerHTML;
  assert.match(html,/Por qué tu respuesta no corresponde/);
  assert.match(html,/monto del descuento, no lo que se paga/);
  assert.match(html,/Entender las cuatro alternativas/);
  assert.equal(app.run('S.total'),1);
  app.run('nextQ()');
  assert.match(app.elements.get('practice').innerHTML,/monto del descuento/);
});

test('diagnóstico: retroalimentación de la respuesta sin sumarla como práctica', () => {
  const app=runtime('basica-ciencias');
  app.run("quiz=[Q.find(q=>q.id==='basica-ciencias-28-07')];mode='diagnosis';pos=0;answers=[];sel=0;checkAnswer()");
  assert.match(app.elements.get('diagnosis').innerHTML,/El protón tiene carga positiva/);
  assert.equal(app.run('S.total'),0);
});

test('simulacro: revisión final explica respuestas correctas, incorrectas y omitidas', () => {
  const app=runtime();
  app.run('PE283.start();SIM12.answers[quiz[0].id]=quiz[0].a;SIM12.answers[quiz[1].id]=(quiz[1].a+1)%4;finishSimulation12()');
  const html=app.elements.get('simulation').innerHTML;
  assert.equal((html.match(/class="card pe304-review"/g)||[]).length,60);
  assert.match(html,/Sin responder/);
  assert.match(html,/Por qué tu respuesta no corresponde/);
  assert.equal(app.run('S.simulations.at(-1).right'),1);
  assert.equal(app.run('S.simulations.at(-1).unanswered'),58);
});

test('ambos tutores y la microlección comparten las razones de las alternativas', () => {
  const app=runtime('basica-lenguaje'),q=app.run("Q.find(q=>q.id==='basica-lenguaje-23-03')");
  const box=element('tutor285Answer');app.elements.set(box.id,box);
  app.context.PE285_CURRENT=q;app.context.PE285.ask('eliminate');
  assert.match(box.innerHTML,/es esdrújula, no aguda/);
  assert.match(app.context.PE16.exercise(q),/es esdrújula, no aguda/);
});

test('texto y opciones se escapan, sin confundir comparaciones matemáticas con HTML', () => {
  const app=runtime();
  const q={id:'escape',q:'¿x < 12?',o:['<img src=x onerror=alert(1)>','x < 12','3','4'],a:1,e:'x < 12',explanations:['No se debe insertar HTML.','x < 12 expresa menor que 12.','No expresa la comparación.','Es un número, no una inecuación.']};
  for(const html of [app.context.PE304.feedback(q,0),app.context.PE17.whyCorrect({question:q}),app.context.PE17.simple({question:q})]) {
    assert.doesNotMatch(html,/<img/);
    assert.match(html,/&lt;/);
  }
});

test('la revisión estructural rechaza huecos y textos de relleno para futuras preguntas', () => {
  const app=runtime();app.run("Q[0].explanations[0]='Esta alternativa no se ajusta a la evidencia o confunde el concepto central.'");
  assert.equal(app.context.PE30.status().ready,false);
  app.run("Q[0].explanations[0]=''");
  assert.equal(app.context.PE304.complete(app.run('Q[0]')),false);
});

test('correcciones editoriales conservan claves y distinguen cálculos y conceptos', () => {
  const app=runtime();
  assert.match(app.run("Q.find(q=>q.id==='basica-matematica-287-22').e"),/tres ejes.*vértices opuestos.*tres.*puntos medios/);
  assert.match(app.run("Q.find(q=>q.id==='basica-matematica-287-11').q"),/luego se duplica el resultado/);
  const language=runtime('basica-lenguaje');
  assert.match(language.run("Q.find(q=>q.id==='basica-lenguaje-287-19').e"),/impersonal.*singular/);
  const history=runtime('basica-historia');
  assert.match(history.run("Q.find(q=>q.id==='basica-historia-287-14').q"),/leyes federales de 1826/);
});
