const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {runtime, root, specialties, element} = require('./helpers/runtime.cjs');
const sourceKeys = require('./fixtures/prior-keys-2023.json');
const plain = value => JSON.parse(JSON.stringify(value));
const newSpecialties = ['basica-matematica', 'basica-ciencias', 'basica-lenguaje'];

for (const sid of Object.keys(specialties)) {
  test(`${sid}: nuevas preguntas conservan íntegramente los ítems previos y el progreso`, () => {
    let previous;
    const app = runtime(sid, {afterScript(file, context) {
      if (file === 'continuity-303.js') previous = plain(context.QBANK);
    }});
    const oldIds = new Set(previous.map(q => q.id));
    assert.deepEqual(plain(app.run('Q')).filter(q => oldIds.has(q.id)), previous);
    assert.equal(app.context.PE305.pool().length, newSpecialties.includes(sid) ? 30 : 0);
    assert.equal(app.run('S.total'), 0);
    assert.equal(app.run('S.history.length'), 0);
    assert.equal(app.context.PE30.status().ready, true);
  });
}

for (const sid of newSpecialties) {
  test(`${sid}: claves de PDF, clasificación y cuatro razones propias para los 30 ítems`, () => {
    const app = runtime(sid), rows = app.context.PE305.pool();
    assert.equal(rows.length, 30);
    const seen = new Set();
    for (const q of rows) {
      assert.equal(q.a, sourceKeys[q.source.file].keys[q.source.number].charCodeAt(0) - 65, q.id);
      assert.equal(q.source.key, sourceKeys[q.source.file].keys[q.source.number], q.id);
      assert.ok(q.source.page > 1 && q.source.adaptation.length > 20, q.id);
      assert.ok(!seen.has(q.id)); seen.add(q.id);
      const [di, si, ii] = q.indicatorId.split('-').map(Number);
      assert.equal(q.indicator, app.run('D')[di][1][si][1][ii]);
      assert.equal(app.context.PE304.complete(q), true, q.id);
      assert.equal(q.e, q.explanations[q.a]);
      assert.equal(q.explanations.length, 4, q.id);
    }
  });
  test(`${sid}: cada estímulo aparece en práctica, diagnóstico, examen, revisión y estudio`, () => {
    const app = runtime(sid);
    const box = element('tutor285Answer'); app.elements.set(box.id, box);
    for (const q of app.context.PE305.pool()) {
      if (!q.stimulus.length) continue;
      app.context.testQuestion = q;
      const expected = app.context.PE305.stimulus(q);
      for (const mode of ['practice', 'diagnosis']) {
        app.run(`quiz=[testQuestion];mode='${mode}';pos=0;answers=[];showQ()`);
        const html = app.elements.get(mode).innerHTML;
        assert.ok(html.includes(expected), mode + ' ' + q.id);
        assert.ok(!html.includes(q.source.adaptation), q.id + ': cambios editoriales ocultan soluciones');
        for (const reason of q.explanations) assert.ok(!html.includes(app.context.PE304.esc(reason)), q.id);
      }
      app.run("mode='simulation';quiz=[testQuestion];SIM12={index:0,answers:{},marked:{},seconds:900,maxSeconds:900};renderSimulation12()");
      const exam = app.elements.get('simulation').innerHTML;
      assert.ok(exam.includes(expected), q.id);
      assert.ok(!exam.includes('Respuesta correcta'), q.id);
      assert.ok(!exam.includes(app.context.PE304.esc(q.source.adaptation)), q.id);
      const feedback = app.context.PE304.feedback(q, (q.a+1)%4);
      assert.equal(feedback.split(expected).length - 1, 1, q.id + ': un solo estímulo en la explicación');
      assert.ok(feedback.includes(app.context.PE304.esc(q.source.adaptation)), q.id);
      assert.ok(app.context.PE304.review(q).includes(expected), q.id);
      assert.ok(app.context.PE16.exercise(q).includes(expected), q.id);
      assert.ok(app.context.PE17.practice({questions:[q]}).includes(expected), q.id);
      app.context.PE285_CURRENT=q;app.context.PE285.ask('solution');
      assert.ok(box.innerHTML.includes(expected), q.id);
    }
  });
}

test('selección por formato no mezcla especialidades y el catálogo permite practicar un ítem concreto', () => {
  const app = runtime('basica-matematica'), api=app.context.PE305;
  for (const format of ['all','visual','tables','classroom']) {
    assert.equal(api.start(format), true);
    assert.ok(app.run('quiz.length') > 0 && app.run('quiz.length') <= 5);
    const ids = new Set(api.pool(format).map(q=>q.id));
    assert.ok(app.run('quiz').every(q => ids.has(q.id)));
  }
  const id='basica-matematica-305-2023-40';
  assert.equal(api.practiceQuestion(id),true);
  assert.deepEqual(plain(app.run('quiz.map(q=>q.id)')),[id]);
  assert.equal(api.practiceQuestion('basica-ciencias-305-2023-40'),false);
  assert.equal(api.start('unknown'),false);
  assert.match(api.practiceCard(),/Explorar las 30 preguntas/);
  assert.match(api.practiceCard(),/data-question-id="basica-matematica-305-2023-40"/);
});

test('los recursos SVG son locales, accesibles y están incluidos en el precaché', () => {
  const app=runtime(), assets=new Set();
  const workerContext=vm.createContext({URL,self:{location:{href:'https://example.test/sw.js'},addEventListener(){}}});
  vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),workerContext);
  const cached=vm.runInContext('ASSETS',workerContext);
  for(const q of app.context.PE305_ITEMS) for(const s of q.stimulus) {
    if(s.kind==='figure') {
      assert.ok(s.alt.length>50,q.id);assets.add(s.asset);
      const url=app.context.PE305.assetURL(s.asset);
      assert.ok(cached.includes('./'+url),s.asset);
      const svg=fs.readFileSync(path.join(root,'assets/prior-2023',s.asset),'utf8');
      assert.match(svg,/<svg/);assert.doesNotMatch(svg,/<script|<foreignObject|(?:href|src)="https?:\/\//i);
    }
    if(s.kind==='table') assert.ok(s.rows.every(row=>row.length===s.columns.length),q.id);
  }
  assert.equal(assets.size,13);
  assert.equal(app.context.PE305.assetURL('../other.svg'),null);
});

test('texto, títulos, tablas y alternativas no insertan HTML ejecutable', () => {
  const app=runtime();
  const q={q:'¿x < 3?',stimulus:[{kind:'text',title:'<img src=x>',text:'<script>alert(1)</script>'},{kind:'table',title:'<b>tabla</b>',columns:['<img>'],rows:[['<iframe>']]}],o:['<img>','x < 3','3','4']};
  const html=app.context.PE305.stimulus(q);
  assert.doesNotMatch(html,/<img|<script|<iframe|<b>/);assert.match(html,/&lt;script&gt;/);
  app.context.testQuestion={...q,id:'security',d:'D',i:'I'};
  app.run("quiz=[testQuestion];mode='practice';pos=0;showQ()");
  assert.doesNotMatch(app.elements.get('practice').innerHTML,/<img/);
  assert.match(app.elements.get('practice').innerHTML,/x &lt; 3/);
});

test('oráculos independientes de cálculo y supuestos corregidos en Matemática', () => {
  const app=runtime(), get=n=>app.context.PE305.pool().find(q=>q.source.number===n);
  assert.equal(7*3-16,5);assert.match(get(17).o[get(17).a],/^5 L/);
  const term=n=>2*n*(n+3)/3;
  assert.ok(Math.abs(term(7)-term(5)-20)<1e-10);assert.equal(get(21).o[get(21).a],'20');
  assert.equal((80*12000+120*6000+40*15000)/240,9500);assert.equal(get(42).o[get(42).a],'9 500 km');
  assert.equal(7000*2/5,2800);assert.equal(get(44).o[get(44).a],'2 800');
  const frequency=get(46).stimulus[0].rows;
  for(const [n,k,f] of frequency) assert.equal(Number(k.replaceAll(' ',''))/Number(n.replaceAll(' ','')),Number(f.replace(',','.')));
  assert.equal(5*3*4*4*4*4,3840);assert.equal(get(48).o[get(48).a],'3 840');
  assert.match(get(48).q,/registro distinto/);assert.match(get(32).q,/segmento DE divide/);
  assert.match(get(46).e,/no garantiza/);
});

test('ambigüedades de las fuentes se resuelven en el enunciado, no solo en las explicaciones', () => {
  const app=runtime('basica-ciencias'),get=n=>app.context.PE305.pool().find(q=>q.source.number===n);
  assert.match(get(1).o[0],/igual energía/);
  assert.match(get(26).q,/gradiente electroquímico.*hidrólisis directa/);
  assert.match(get(42).q,/caja se desliza/);
  assert.match(get(44).q,/igual coeficiente de arrastre/);
  assert.match(get(48).q,/lámparas diseñadas para 3 V/);
  assert.equal(app.context.PE305.pool().some(q=>[25,31,32,51].includes(q.source.number)),false);
});

test('pautas abarcan 146 ítems; la selección publicada contiene 90, sin simular un cuadernillo oficial', () => {
  const app=runtime();
  assert.equal(Object.values(sourceKeys).reduce((n,s)=>n+s.count,0),146);
  assert.equal(app.context.PE305_ITEMS.length,90);
  assert.ok(app.context.PE305_ITEMS.every(q=>q.sourceNote.includes('no es una pregunta oficial')));
  assert.equal(new Set(app.context.PE305_ITEMS.map(q=>q.id)).size,90);
});
