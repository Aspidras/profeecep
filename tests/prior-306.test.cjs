const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {runtime, specialties, root, element} = require('./helpers/runtime.cjs');
const keys = require('./fixtures/prior-keys-2023-306.json');
const baseline = require('./fixtures/bank-305-preservation.json');
const plain = value => JSON.parse(JSON.stringify(value));
const selected = {
  'basica-historia': [1,3,4,5,6,8,10,12,16,17,19,21,22,24,25,26,27,28,29,30,32,33,34,36,37,39,46,47,48,50],
  'basica-ingles': [20,21,22,23,24,28,29,31,32,33,34,35,36,37,38,39,40,41,43,44,45,46,47,48,49,50,51,52,56,58]
};

for (const sid of Object.keys(specialties)) {
  test(sid+': conserva exactamente las preguntas de 3.0.5 según su huella y mantiene el progreso', () => {
    const app = runtime(sid);
    const ids = new Set(baseline[sid].ids);
    const old = app.run('Q').filter(q => ids.has(q.id));
    assert.equal(old.length, baseline[sid].count);
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'), baseline[sid].sha256);
    assert.equal(app.run('Q.length'), specialties[sid]);
    assert.equal(app.run('S.total'), 0);
    assert.equal(app.context.PE30.status().ready, true);
  });
}

for (const sid of Object.keys(selected)) {
  test(sid+': 30 preguntas con clave contrastada, indicador válido y cuatro explicaciones completas', () => {
    const app = runtime(sid), rows = app.context.PE305.pool();
    assert.deepEqual(plain(rows.map(q => q.source.number)), selected[sid]);
    for (const q of rows) {
      assert.equal(q.a, keys[q.source.file].keys[q.source.number].charCodeAt(0)-65, q.id);
      assert.equal(q.source.key, keys[q.source.file].keys[q.source.number], q.id);
      assert.ok(q.source.page > 1 && q.source.page <= 35);
      const [d,s,i] = q.indicatorId.split('-').map(Number);
      assert.equal(q.indicator, app.run('D')[d][1][s][1][i], q.id);
      assert.equal(app.context.PE304.complete(q), true, q.id);
      assert.equal(q.e, q.explanations[q.a], q.id);
      assert.ok(q.explanations.every(e => e.length > 65), q.id);
      assert.equal(new Set(q.explanations).size, 4, q.id);
      assert.ok(q.source.adaptation.length > 50, q.id);
    }
  });

  test(sid+': estímulos y razones funcionan en práctica, simulacro, revisión, estudio y tutor', () => {
    const app=runtime(sid);
    const box=element('tutor285Answer'); app.elements.set(box.id,box);
    for(const q of app.context.PE305.pool()){
      app.context.testQuestion=q;
      const material=app.context.PE305.stimulus(q);
      for(const mode of ['practice','diagnosis']){
        app.run("quiz=[testQuestion];mode='"+mode+"';pos=0;answers=[];showQ()");
        const html=app.elements.get(mode).innerHTML;
        if(material) assert.ok(html.includes(material),q.id);
        assert.ok(!html.includes(app.context.PE304.esc(q.source.adaptation)),q.id);
        for(const reason of q.explanations) assert.ok(!html.includes(app.context.PE304.esc(reason)),q.id);
      }
      app.run("mode='simulation';quiz=[testQuestion];SIM12={index:0,answers:{},marked:{},seconds:900,maxSeconds:900};renderSimulation12()");
      const exam=app.elements.get('simulation').innerHTML;
      if(material) assert.ok(exam.includes(material),q.id);
      assert.ok(!exam.includes(app.context.PE304.esc(q.source.adaptation)),q.id);
      const feedback=app.context.PE304.feedback(q,(q.a+1)%4);
      for(const reason of q.explanations) assert.ok(feedback.includes(app.context.PE304.esc(reason)),q.id);
      if(material) {
        assert.equal(feedback.split(material).length-1,1,q.id);
        assert.ok(app.context.PE304.review(q).includes(material),q.id);
        assert.ok(app.context.PE16.exercise(q).includes(material),q.id);
        assert.ok(app.context.PE17.practice({questions:[q]}).includes(material),q.id);
        app.context.PE285_CURRENT=q;app.context.PE285.ask('solution');
        assert.ok(box.innerHTML.includes(material),q.id);
      }
    }
  });
}

test('los filtros incluyen los textos en inglés y los dominios docentes de ambas especialidades', () => {
  for(const sid of Object.keys(selected)){
    const app=runtime(sid), api=app.context.PE305;
    const expected=api.pool().filter(q=>q.indicatorId.startsWith('3-'));
    assert.deepEqual(plain(api.pool('classroom').map(q=>q.id)),plain(expected.map(q=>q.id)));
    assert.ok(expected.length>0);
    assert.equal(api.start('classroom'),true);
    assert.ok(app.run('quiz').every(q=>expected.some(e=>e.id===q.id)));
    assert.match(api.practiceCard(),/Explorar las 30 preguntas/);
    assert.equal(api.practiceQuestion('basica-matematica-305-2023-01'),false);
  }
  const english=runtime('basica-ingles').context.PE305;
  assert.equal(english.pool('reading').length,11);
  assert.ok(english.pool('reading').every(q=>q.indicatorId.startsWith('0-')));
  assert.match(english.stimulus(english.pool('reading')[0]),/lang="en"/);
  const history=runtime('basica-historia').context.PE305;
  assert.deepEqual(plain(history.pool('visual').map(q=>q.source.number)),[3,16,22]);
  assert.equal(history.pool('tables').length,1);
});

test('las 17 preguntas de audio permanecen pendientes y las 110 fuentes tienen disposición registrada', () => {
  const app=runtime('basica-ingles');
  assert.equal(Object.values(keys).reduce((sum,k)=>sum+k.count,0),110);
  assert.equal(app.context.PE306_ITEMS.length,60);
  assert.ok(app.context.PE305.pool().every(q=>q.source.number>17));
  assert.ok(app.context.PE305.pool().every(q=>!q.indicatorId.startsWith('1-')));
  const audit=JSON.parse(fs.readFileSync(path.join(root,'docs/revision-fuentes-306.json'),'utf8'));
  assert.equal(audit.items.length,110);
  assert.equal(audit.items.filter(q=>q.status==='publicada').length,60);
  const missing= audit.items.filter(q=>q.status==='requiere-audio');
  assert.deepEqual(missing.map(q=>q.number),Array.from({length:17},(_,i)=>i+1));
  assert.equal(audit.audioTracks.length,7);
  assert.equal(audit.items.filter(q=>q.status==='reserva').length,33);
});

test('los ajustes editoriales resuelven errores del original en el enunciado y en la respuesta', () => {
  const hist=runtime('basica-historia').context.PE305.pool();
  const h=n=>hist.find(q=>q.source.number===n);
  assert.match(h(8).o[h(8).a],/pregunta de investigación/);
  assert.match(h(19).q,/sin atribuirles causas/);
  assert.match(h(19).explanations[2],/No mide.*desertificación/);
  assert.match(h(24).q,/debe mudarse/);
  assert.match(h(33).e,/no.*constitución federal promulgada/i);
  assert.match(h(46).q,/14 de julio de 1789/);
  assert.match(h(48).q,/ordena.*cambiar/);
  const ing=runtime('basica-ingles').context.PE305.pool();
  const e=n=>ing.find(q=>q.source.number===n);
  assert.match(e(34).o[e(34).a],/not be required to pay/);
  assert.match(e(38).o[e(38).a],/mandative subjunctive/);
  assert.match(e(41).q,/correlative pair/);
  assert.match(e(58).q,/not an identified supply/);
  assert.match(e(58).e,/puede ser correcto/);
});

test('las representaciones nuevas coinciden con sus datos y usan archivos locales sin código activo', () => {
  const app=runtime('basica-historia'), figures=app.context.PE305.pool().flatMap(q=>q.stimulus.filter(s=>s.kind==='figure'));
  assert.equal(figures.length,3);
  for(const s of figures){
    const svg=fs.readFileSync(path.join(root,'assets/prior-2023',s.asset),'utf8');
    assert.match(svg,/<title/);assert.match(svg,/<desc/);
    assert.doesNotMatch(svg,/<script|<foreignObject|(?:href|src)="https?:\/\//i);
    assert.ok(s.alt.length>200);
    assert.match(app.context.PE305.assetURL(s.asset),/\?v=3\.0\.6$/);
  }
  const land=fs.readFileSync(path.join(root,'assets/prior-2023/historia-coberturas.svg'),'utf8');
  // Each map has 100 labelled cells, plus a single legend cell per category.
  assert.equal((land.match(/>N<\/text>/g)||[]).length,60+35+1);
  assert.equal((land.match(/>P<\/text>/g)||[]).length,10+40+1);
  assert.equal((land.match(/>A<\/text>/g)||[]).length,20+15+1);
  assert.equal((land.match(/>U<\/text>/g)||[]).length,10+10+1);
});
