const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const {runtime, root, element, specialties} = require('./helpers/runtime.cjs');
const audit = require('../docs/revision-fuentes-310.json');
const indicators = require('../content-308/indicators-2026.json')['media-lengua'];
// Transcripción independiente cotejada con la imagen de la pauta aportada.
const sourceKeys = ['B','D','D','A','C','C','D','A','C','C','C','C','C','A','B','D','D','B','A','B','C','D','C','D','A','D','D','B','D','D','B','B','A','C','B','A','D','A','B','D','B','A','C','D','C','C'];
const sourcePages = [2,3,4,5,6,7,8,9,10,11,12,13,14,14,15,16,17,17,18,19,20,21,22,23,24,25,26,27,28,29,30,30,31,32,33,33,34,35,35,36,37,38,38,39,40,40];
const plain = x => JSON.parse(JSON.stringify(x));

test('EM-L: 46 fuentes completas, claves históricas separadas y 184 explicaciones específicas', () => {
  const app=runtime('media-lengua'), rows=app.context.PE305.pool();
  assert.equal(rows.length,46); assert.equal(app.run('Q.length'),146);
  assert.equal(Object.values(specialties).reduce((n,x)=>n+x,0),877);
  assert.equal(audit.items.length,46); assert.equal(new Set(rows.map(q=>q.q)).size,46);
  assert.equal(rows.reduce((n,q)=>n+q.explanations.length,0),184);
  assert.equal(new Set(rows.map(q=>q.indicatorId)).size,30);
  const distribution=[0,0,0,0];
  for (let i=0;i<46;i++) {
    const q=rows[i], ref=audit.items[i]; distribution[q.a]++;
    assert.equal(q.source.number,i+1);assert.equal(q.source.key,sourceKeys[i]);assert.equal(q.source.page,sourcePages[i]);
    assert.equal(q.source.practiceKey,'ABCD'[q.a]);assert.equal(ref.practiceKey,q.source.practiceKey);
    assert.equal(q.e,q.explanations[q.a]);assert.equal(new Set(q.o).size,4);assert.equal(new Set(q.explanations).size,4);
    assert.ok(q.explanations.every(e=>e.length>=55)); assert.equal(app.context.PE304.complete(q),true);
    assert.ok(q.source.adaptation.length>60); assert.ok(ref.alignment.length>55);
    assert.ok(indicators.some(x=>x.id===q.indicatorId));
    const [d,s,k]=q.indicatorId.split('-').map(Number);assert.equal(q.indicator,app.run('D')[d][1][s][1][k]);
    assert.match(q.sourceNote,/No es una pregunta oficial de 2026/);
  }
  assert.ok(distribution.every(n=>n>=5));assert.equal(app.context.PE30.status().ready,true);
});

test('EM-L: la nueva colección entra en lecturas y aula; permanece aislada de las otras especialidades',()=>{
  const app=runtime('media-lengua');
  const reading=app.context.PE305.pool('reading'), classroom=app.context.PE305.pool('classroom');
  assert.ok(reading.length>=20);assert.equal(classroom.length,14);
  for(const q of classroom)assert.ok(q.indicatorId.startsWith('2-'));
  for(const q of reading)assert.ok(q.stimulus.length);
  assert.match(app.context.PE305.practiceCard(),/46 preguntas adaptadas/);
  for(const sid of Object.keys(specialties).filter(x=>x!=='media-lengua')){
    const other=runtime(sid);assert.ok(!other.run('Q').some(q=>q.version==='3.0.10'));
  }
});

test('los estímulos se muestran sin adelantar razones en práctica, diagnóstico y simulacro',()=>{
  const app=runtime('media-lengua');
  for(const q of app.context.PE305.pool()){
    app.context.target310=q;const material=app.context.PE305.stimulus(q);
    for(const mode of ['practice','diagnosis']){
      app.run(`quiz=[target310];mode='${mode}';pos=0;answers=[];showQ()`);
      const html=app.elements.get(mode).innerHTML; if(material)assert.ok(html.includes(material),q.id);
      assert.ok(!html.includes(app.context.PE304.esc(q.source.adaptation)),q.id);
      q.explanations.forEach(e=>assert.ok(!html.includes(app.context.PE304.esc(e)),q.id));
    }
    app.run("mode='simulation';quiz=[target310];SIM12={index:0,answers:{},marked:{},seconds:900,maxSeconds:900};renderSimulation12()");
    const html=app.elements.get('simulation').innerHTML;if(material)assert.ok(html.includes(material),q.id);
    q.explanations.forEach(e=>assert.ok(!html.includes(app.context.PE304.esc(e)),q.id));
  }
});

test('las cuatro razones y la procedencia se recuperan para errores, aciertos, omisiones y tutor',()=>{
  const app=runtime('media-lengua'), box=element('tutor285Answer');app.elements.set(box.id,box);
  for(const q of app.context.PE305.pool()){
    for(const selected of [q.a,(q.a+1)%4,undefined]){
      const html=app.context.PE304.feedback(q,selected);
      q.explanations.forEach(e=>assert.ok(html.includes(app.context.PE304.esc(e)),q.id));
      assert.ok(html.includes(app.context.PE304.esc(q.source.adaptation)),q.id);
      assert.match(html,/Reportar un problema/);
    }
    app.context.PE285_CURRENT=q;app.context.PE285.ask('eliminate');
    q.explanations.forEach(e=>assert.ok(box.innerHTML.includes(app.context.PE304.esc(e)),q.id));
    app.context.PE285.ask('solution');assert.ok(box.innerHTML.includes(app.context.PE304.esc(q.e)),q.id);
  }
});

test('los 6 recursos visuales son completos, accesibles, locales y están precargados sin conexión',()=>{
  const app=runtime('media-lengua'), sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  const figures=app.context.PE305.pool().flatMap(q=>q.stimulus.filter(s=>s.kind==='figure'));
  assert.equal(figures.length,6);
  for(const s of figures){
    const url=app.context.PE305.assetURL(s.asset);assert.ok(url);assert.ok(sw.includes('./'+url));
    const svg=fs.readFileSync(path.join(root,url.split('?')[0]),'utf8');
    assert.match(svg,/<title/);assert.match(svg,/<desc/);assert.ok(s.alt.length>140);
    assert.doesNotMatch(svg,/<script|<foreignObject|(?:href|src)="https?:/);
    assert.ok(app.context.PE305.stimulus({stimulus:[s]}).includes(app.context.PE304.esc(s.alt)));
  }
});

test('los ajustes conceptuales conservan evidencia suficiente sin obedecer mecánicamente a la pauta histórica',()=>{
  const app=runtime('media-lengua'), q=n=>app.context.PE305.pool().find(x=>x.source.number===n);
  assert.match(q(5).e,/no necesita desplegar explícitamente/);
  assert.match(q(18).o[q(18).a],/ambos personajes.*ninguno conoce/);
  assert.match(q(18).stimulus[0].text,/Ana temía.*Luis.*Ninguno sabía/);
  assert.match(q(18).source.adaptation,/una sola interioridad no basta/);
  assert.match(q(25).q,/sin atribuirla automáticamente al autor/);
  assert.match(q(42).e,/se-guí-a.*ve-ní-a/);
  assert.match(q(43).e,/pronombre reflexivo.*cuantifica/);
  assert.match(q(46).e,/preparación previa.*no exige.*unanimidad/);
});

test('un reporte y un simulacro de la nueva colección sobreviven a recarga sin mezclar claves',()=>{
  const app=runtime('media-lengua'), q=app.context.PE305.pool()[17]; app.context.target310=q;
  assert.equal(app.context.PE309.saveReport(q.id,'explicacion','Revisar el ejemplo de focalización.').ok,true);
  app.run("quiz=[target310];mode='simulation';SIM12={index:0,answers:{},marked:{},timeSpent:{},enteredAt:Date.now(),seconds:900,maxSeconds:900,startedAt:new Date().toISOString()};PE303.startClock();sim12Choose(target310.a)");
  const next=runtime('media-lengua',{storage:app.storage});next.context.PE303.resume();
  assert.deepEqual(plain(next.run('quiz[0]')),plain(q));assert.equal(next.context.PE309.get(q.id).details,'Revisar el ejemplo de focalización.');
  next.run('finishSimulation12()');assert.equal(next.run('S.simulations.at(-1).right'),1);
});
