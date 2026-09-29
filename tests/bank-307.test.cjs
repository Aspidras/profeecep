const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const {runtime,root,specialties,element}=require('./helpers/runtime.cjs'),audit=require('../docs/auditoria-307.json');
for(const [sid,count] of Object.entries(specialties)){
 test(sid+': 50 preguntas de la colección, cuatro razones y cobertura de los indicadores en el banco activo',()=>{
  const app=runtime(sid),rows=app.context.PE307.pool(),active=app.run('Q'),keys=[0,0,0,0];
  assert.equal(rows.length,50);assert.equal(active.length,count);assert.ok(active.every(q=>!q.id.includes('-281-')));
  for(const q of rows){keys[q.a]++;assert.equal(app.context.PE304.complete(q),true,q.id);assert.equal(q.e,q.explanations[q.a]);assert.equal(new Set(q.o).size,4);assert.ok(q.explanations.every(e=>e.length>=30));assert.ok(['básica','media','alta'].includes(q.diff));const [d,s,i]=q.indicatorId.split('-').map(Number);assert.equal(q.indicator,app.run('D')[d][1][s][1][i]);}
  assert.ok(keys.every(n=>n>0)); // Revisions use independent, deterministic permutations.
  for(const i of audit.specialties[sid].indicators)assert.ok(active.some(q=>q.indicatorId===i.id),i.id);
  assert.equal(app.context.PE30.status().ready,true);
 });
 test(sid+': archivo conserva las huellas originales y permite terminar un simulacro antiguo',()=>{
  const app=runtime(sid),full=app.context.PE307.fullBank();
  for(const old of audit.specialties[sid].baseline){const q=full.find(q=>q.id===old.id);assert.ok(q);assert.equal(crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex'),old.sha256,old.id);}
  assert.equal(app.context.PE307.archived().length,audit.specialties[sid].archive.length);
  app.context.oldQuestion=app.context.PE307.archived()[0];
  app.run("quiz=[oldQuestion];mode='simulation';SIM12={index:0,answers:{},marked:{},timeSpent:{},enteredAt:Date.now(),seconds:900,maxSeconds:900,startedAt:new Date().toISOString()};PE303.startClock();sim12Choose(oldQuestion.a)");assert.ok(app.context.PE303.draft());
  const next=runtime(sid,{storage:app.storage});next.context.PE303.resume();assert.equal(next.run('quiz[0].id'),app.context.oldQuestion.id);assert.equal(next.run('SIM12.answers[quiz[0].id]'),app.context.oldQuestion.a);next.run('finishSimulation12()');assert.equal(next.run('S.simulations.at(-1).right'),1);
  next.context.PE307.start();assert.ok(next.run('quiz').every(q=>['3.0.7','3.0.8'].includes(q.version)));for(let n=0;n<10;n++)assert.ok(next.context.PE283.build().every(q=>!q.id.includes('-281-')));
 });
}
test('300 preguntas, 1200 razones, 831 ejercicios activos y 25 vacíos cubiertos',()=>{
 const all=runtime().context.PE307_ITEMS;assert.equal(all.length,300);assert.equal(new Set(all.map(q=>q.id)).size,300);assert.equal(new Set(all.map(q=>q.q.toLowerCase())).size,300);assert.equal(Object.values(specialties).reduce((a,b)=>a+b,0),831);assert.equal(Object.values(audit.specialties).flatMap(s=>s.indicators.filter(i=>!i.beforeSpecific)).length,25);
});
test('16 ítems auditivos: transcript oculta antes de respuesta y disponible en revisión y tutor',()=>{
 const app=runtime('basica-ingles'),rows=app.context.PE307.pool('audio');assert.equal(rows.length,16);assert.equal(new Set(rows.map(q=>q.stimulus[0].asset)).size,4);
 const box=element('tutor285Answer');app.elements.set(box.id,box);
 for(const q of rows){app.context.currentAudio=q;const transcript=app.context.PE304.esc(q.stimulus[0].transcript),material=app.context.PE305.stimulus(q);assert.match(material,/<audio controls/);assert.ok(!material.includes(transcript));assert.doesNotMatch(material,/autoplay/);
  for(const mode of ['practice','diagnosis']){app.run("quiz=[currentAudio];mode='"+mode+"';pos=0;answers=[];showQ()");const html=app.elements.get(mode).innerHTML;assert.ok(html.includes('<audio controls'));assert.ok(!html.includes(transcript));assert.ok(q.explanations.every(e=>!html.includes(app.context.PE304.esc(e))));}
  app.run("mode='simulation';quiz=[currentAudio];SIM12={index:0,answers:{},marked:{},seconds:900,maxSeconds:900};renderSimulation12()");assert.ok(!app.elements.get('simulation').innerHTML.includes(transcript));assert.ok(app.elements.get('simulation').innerHTML.includes('<audio controls'));
  for(const selected of [q.a,(q.a+1)%4,undefined]){const html=app.context.PE304.feedback(q,selected);assert.ok(html.includes(transcript));q.explanations.forEach(e=>assert.ok(html.includes(app.context.PE304.esc(e))));}
  const practice=app.context.PE17.practice({questions:[q]});assert.ok(practice.indexOf('<summary>')<practice.indexOf(transcript));assert.doesNotMatch(practice.slice(0,practice.indexOf(transcript)),/<details[^>]* open/);
  app.context.PE285_CURRENT=q;app.context.PE285.ask('solution');assert.ok(box.innerHTML.includes(transcript));assert.ok(fs.statSync(path.join(root,'assets/audio-307',q.stimulus[0].asset)).size>200000);
 }
});
test('recursos locales autorizados y cómics accesibles sin código activo',()=>{
 const api=runtime().context.PE307;for(const name of ['../secret.svg','https://example.test/x.svg','missing.svg'])assert.equal(api.assetURL(name),null);
 for(const name of ['comic-agua.svg','comic-pantallas.svg']){assert.ok(api.assetURL(name).includes('/original-307/'));const svg=fs.readFileSync(path.join(root,'assets/original-307',name),'utf8');assert.match(svg,/<title/);assert.match(svg,/<desc/);assert.doesNotMatch(svg,/<script|<foreignObject|(?:href|src)="https?:/);}
});
test('selección y catálogo nuevos respetan especialidad y variedad de estímulos',()=>{
 const app=runtime('basica-ingles'),api=app.context.PE307;
 for(let n=0;n<20;n++){api.start();assert.equal(app.run('quiz.length'),5);assert.equal(new Set(app.run('quiz').map(q=>q.familyId)).size,5);}
 assert.equal(api.pool('classroom').length,12);api.start('audio');assert.ok(app.run('quiz').every(q=>q.stimulus[0].kind==='audio'));assert.equal(api.practiceQuestion('media-lengua-307-01'),false);const catalog=api.practiceCard();assert.match(catalog,/Explorar las 50 preguntas nuevas/);api.pool().forEach(q=>assert.ok(q.explanations.every(e=>!catalog.includes(app.context.PE304.esc(e)))));
});
test('cálculos independientes conservan clave al reordenar alternativas',()=>{
 const all=runtime().context.PE307_ITEMS,key=(sid,n)=>{const q=all.find(q=>q.id===sid+'-307-'+String(n).padStart(2,'0'));return q.o[q.a];},m='basica-matematica';
 assert.equal(key(m,3),'1/3 L');assert.ok(Math.abs((5/6-2/4)-1/3)<Number.EPSILON);assert.equal(key(m,7),'$38.400');assert.equal(40000*.8*1.2,38400);assert.equal(key(m,8),String((-2)**3*(-2)**-1));assert.equal(key(m,15),String((7+2)/(3/4)));assert.equal(key(m,28),(10*8-3*3)+' cm²');assert.equal(key(m,37),String(18/80).replace('.',','));assert.equal(key('basica-ciencias',27),(12/3)+' A');assert.equal(key('basica-historia',3),(4*200000/100000)+' km.');
});
