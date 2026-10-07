const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {runtime,root,specialties}=require('./helpers/runtime.cjs');
const audit=require('../docs/auditoria-2026-308.json'), manifest=require('../docs/correcciones-308.json');
const plain=x=>JSON.parse(JSON.stringify(x));
for(const [sid,count] of Object.entries(specialties)){
 test(sid+': cada hallazgo tiene una revisión activa y conserva íntegro el ítem anterior',()=>{
  let before;const a=runtime(sid,{afterScript(file,c){if(file==='bank-307.js')before=plain(c.QBANK)}});
  const rows=a.run('Q'), patches=a.context.PE308.pool(), expected=audit.findings.filter(q=>q.specialty===sid);
  assert.equal(rows.length,count);assert.equal(patches.length,expected.length);
  assert.deepEqual(plain(a.context.PE308.archived()),before.filter(q=>expected.some(e=>e.id===q.id)));
  const full=a.context.PE307.fullBank();assert.equal(new Set(full.map(q=>q.id)).size,full.length);
  for(const old of before)assert.deepEqual(plain(full.find(q=>q.id===old.id)),old,old.id);
  for(const finding of expected){
   assert.ok(!rows.some(q=>q.id===finding.id));const q=patches.find(q=>q.replaces===finding.id);assert.ok(q,finding.id);
   assert.equal(a.context.PE304.complete(q),true,q.id);assert.equal(q.e,q.explanations[q.a]);assert.equal(q.specialtyId,sid);
   assert.ok(q.explanations.every(e=>e.length>=30));assert.equal(new Set(q.explanations).size,4);assert.equal(new Set(q.o).size,4);
   if(q.source){assert.equal(q.source.practiceKey,'ABCD'[q.a]);assert.equal(q.source.key,before.find(x=>x.id===q.replaces).source.key);}
   if(finding.alignment==='ajustar'||finding.critical)assert.ok(manifest.items.find(x=>x.id===q.id).contentRewritten);
  }
  assert.equal(a.context.PE30.status().ready,true);
 });
 test(sid+': un simulacro guardado recupera las opciones y posiciones previas a 3.0.8',()=>{
  const a=runtime(sid),q=a.context.PE308.archived()[0];a.context.savedQuestion=q;
  a.run("quiz=[savedQuestion];mode='simulation';SIM12={index:0,answers:{},marked:{},timeSpent:{},enteredAt:Date.now(),seconds:900,maxSeconds:900,startedAt:new Date().toISOString()};PE303.startClock();sim12Choose(savedQuestion.a)");
  assert.ok(a.context.PE303.draft());const b=runtime(sid,{storage:a.storage});b.context.PE303.resume();
  assert.deepEqual(plain(b.run('quiz[0]')),plain(q));assert.equal(b.run('SIM12.answers[quiz[0].id]'),q.a);
  b.run('finishSimulation12()');assert.equal(b.run('S.simulations.at(-1).right'),1);
  for(let n=0;n<4;n++)assert.ok(b.context.PE283.build().every(x=>!a.context.PE308.archived().some(old=>old.id===x.id)));
 });
}
test('reported speech corrige el contenido de la clave y explica la inversión incorrecta',()=>{
 const a=runtime('basica-ingles'),old=a.context.PE307.fullBank().find(q=>q.id==='basica-ingles-306-2023-35'),q=a.context.PE308.current(old.id);
 assert.equal(old.a,0);assert.equal(q.o[q.a],'Leo asked his friend if he could borrow his dictionary.');
 const inverted=q.o.findIndex(t=>t.includes('if could he'));assert.notEqual(q.a,inverted);assert.match(q.explanations[inverted],/orden declarativo/);
 assert.equal(old.source.key,'A');assert.equal(q.source.key,'A');assert.equal(q.source.practiceKey,'ABCD'[q.a]);
});
test('los errores pendientes llevan a la revisión; acertarla no altera el historial previo',()=>{
 const a=runtime('basica-ingles'),id='basica-ingles-306-2023-35';a.context.legacyId=id;
 a.run("S.wrong=[legacyId];S.history=[{id:legacyId,ok:false,selected:3,domain:'old',date:'2026-09-20'}]");
 const before=plain(a.run('S.history'));a.context.PE285.startErrors();const q=a.run('quiz[0]');assert.equal(q.replaces,id);
 a.run('sel=quiz[0].a;checkAnswer()');assert.ok(!a.run('S.wrong').includes(id));assert.deepEqual(plain(a.run('S.history[0]')),before[0]);assert.equal(a.run('S.history.at(-1).id'),q.id);
});
test('todas las tareas auditivas activas ofrecen audio y reservan transcripción y razones para revisión',()=>{
 const a=runtime('basica-ingles'),rows=a.run('Q').filter(q=>q.indicatorId.startsWith('1-'));
 assert.equal(rows.length,40);
 for(const q of rows){const audio=q.stimulus.find(s=>s.kind==='audio');assert.ok(audio,q.id);const html=a.context.PE305.stimulus(q);assert.match(html,/<audio controls/);assert.ok(!html.includes(a.context.PE304.esc(audio.transcript)));assert.doesNotMatch(html,/autoplay/);const feedback=a.context.PE304.feedback(q,(q.a+1)%4);assert.ok(feedback.includes(a.context.PE304.esc(audio.transcript).replace(/\n/g,'<br>')));q.explanations.forEach(e=>assert.ok(feedback.includes(a.context.PE304.esc(e))));}
});
test('los 173 cambios y sus 16 diagramas nuevos están completos y disponibles en caché',()=>{
 const a=runtime(), patches=a.context.PE308_ITEMS;assert.equal(patches.length,173);assert.equal(manifest.count,173);assert.equal(manifest.contentRewritten,135);
 const ctx=vm.createContext({URL,self:{location:{href:'https://example.test/sw.js'},addEventListener(){}}});vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),ctx);const cache=vm.runInContext('ASSETS',ctx);
 const seen=new Set();for(const q of patches)for(const s of q.stimulus||[]){
  if(s.kind==='table')assert.ok(s.rows.every(row=>row.length===s.columns.length),q.id);
  if(!s.asset)continue;const url=a.context.PE308.assetURL(s.asset);assert.ok(url,s.asset);assert.ok(cache.includes('./'+url),url);const file=path.join(root,url.split('?')[0]);assert.ok(fs.statSync(file).size>100);if(s.asset.startsWith('308-')){seen.add(s.asset);const svg=fs.readFileSync(file,'utf8');assert.match(svg,/<title/);assert.match(svg,/<desc/);assert.doesNotMatch(svg,/<script|<foreignObject|(?:href|src)="https?:/);}
 }
 assert.equal(seen.size,16);for(const n of ['../secret.svg','308-missing.svg','https://test/a.svg'])assert.equal(a.context.PE308.assetURL(n),null);
});
test('oráculos independientes comprueban nuevas áreas, potencias y probabilidades',()=>{
 const a=runtime(),get=id=>a.context.PE308.current(id),m='basica-matematica';
 for(const [id,L,W,h,v] of [[m+'-307-28',10,8,2,3],['g10',12,9,2,3],[m+'-287-28',14,10,3,3]]){const q=get(id);assert.equal(q.o[q.a],((L-v)*(W-h))+' m².');}
 const pow=get(m+'-307-09');assert.equal((.5**3)*(.5**2)/(.5**4),.5);assert.equal(pow.o[pow.a],'0,5.');
 for(const [id,h,n] of [[m+'-307-37',18,80],['d12',57,100],[m+'-287-37',116,200]]){const q=get(id);assert.equal(q.o[q.a],String(h/n).replace('.',',')+'.');}
 const sample=get(m+'-307-35');assert.match(sample.o[sample.a],/600 escolares.*80 encuestados/);
 const coins=get(m+'-307-36');assert.match(coins.o[coins.a],/Ω = \{CC, CS, SC, SS\}; E = \{CS, SC\}/);
});
test('materiales exigidos por los hallazgos se presentan realmente para resolver la tarea',()=>{
 const all=runtime().context.PE308_ITEMS;
 for(const q of all){
  const finding=audit.findings.find(x=>x.id===q.replaces);
  if(/fuentes históricas|contrastar dos fuentes|fragmentos contextualizados/.test(finding.action))assert.ok(q.stimulus.filter(s=>s.kind==='text').length>=1,q.id);
 }
 for(const id of ['basica-historia-307-01','basica-historia-307-02','basica-historia-307-03','basica-historia-307-43','basica-lenguaje-23-02','media-lengua-28-16'])assert.ok(all.find(q=>q.replaces===id).stimulus.some(s=>s.kind==='figure'),id);
 for(const id of ['basica-lenguaje-307-10','basica-lenguaje-307-41','basica-lenguaje-28-03','basica-lenguaje-287-10'])assert.ok(all.find(q=>q.replaces===id).stimulus.some(s=>s.kind==='table'),id);
});
