// ProfeECEP 3.0.1 — simulacros sin repetición y distribución de práctica
(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 function uniqueQuestions(){
  const ids=new Set(),domains=new Set(D.map(d=>d[0]));
  return Q.filter(q=>{
   if(!q||!q.id||ids.has(q.id)||!domains.has(q.d))return false;
   ids.add(q.id);return true;
  });
 }
 function blueprint(questions=uniqueQuestions()){
  const rows=D.map(d=>({domain:d[0],target:0,available:questions.filter(q=>q.d===d[0]).length})).filter(row=>row.available);
  const total=Math.min(60,rows.reduce((sum,row)=>sum+row.available,0));let assigned=0;
  // Redistribute scarce-domain slots without exceeding the available bank.
  while(assigned<total){
   for(const row of rows){
    if(row.target<row.available&&assigned<total){row.target++;assigned++}
   }
  }
  return rows;
 }
 function build(){
  const questions=uniqueQuestions(),bp=blueprint(questions),chosen=[],difficulty=['básica','media','media','alta','básica'];
  bp.forEach(row=>{
   const pool=shuffle(questions.filter(q=>q.d===row.domain));
   for(let i=0;i<row.target&&pool.length;i++){
    const wanted=difficulty[i%difficulty.length];
    const index=pool.findIndex(q=>(q.diff||'media')===wanted);
    // Removing the selected item prevents repeats even with one difficulty.
    chosen.push(pool.splice(index<0?0:index,1)[0]);
   }
  });
  return shuffle(chosen);
 }
 function start(){
  const built=build();if(!built.length){alert('No hay preguntas disponibles para esta especialidad.');return}
  mode='simulation';clearInterval(SIM12_TIMER);quiz=built;const maxSeconds=150*60;SIM12={index:0,answers:{},marked:{},timeSpent:{},enteredAt:Date.now(),seconds:maxSeconds,maxSeconds,startedAt:new Date().toISOString(),generatedBy:'3.0.1',examTitle:'Simulacro de práctica 3.0.1',examLabel:built.length+' preguntas únicas · contenido propio ProfeECEP'};renderSimulation12();SIM12_TIMER=setInterval(()=>{if(!SIM12)return clearInterval(SIM12_TIMER);SIM12.seconds--;const t=document.getElementById('sim12time');if(t)t.textContent=formatSim12Time(SIM12.seconds);if(SIM12.seconds<=0){clearInterval(SIM12_TIMER);finishSimulation12(true)}},1000);
 }
 function inject(){
  const bp=blueprint(),practice=el('practice'),progress=el('progress'),home=el('home');
  if(home){const p=home.querySelector('.hero .pill');if(p)p.textContent='ProfeECEP 3.0.1'}
  if(practice&&!practice.querySelector('.exam283')){const c=document.createElement('div');c.className='card exam283';const count=bp.reduce((sum,row)=>sum+row.target,0);c.innerHTML='<span class="pill">Simulacro de práctica 3.0.1</span><h3>Entrenamiento de '+count+' preguntas únicas</h3><p class="muted">Práctica de 150 minutos con contenido propio. La distribución equilibra los dominios según el banco disponible; no representa ponderaciones oficiales.</p><button class="btn full" onclick="PE283.start()">Iniciar simulacro de '+count+' preguntas</button>';const first=practice.querySelector('.complete28practice')||practice.querySelector('.sim21');if(first)first.before(c);else practice.prepend(c)}
  if(progress&&!progress.querySelector('.exam283')){const c=document.createElement('div');c.className='card exam283';c.innerHTML='<span class="pill">Matriz 2.8.3</span><h3>Distribución del simulador</h3><p class="muted">Esta matriz organiza el simulador activo. Los pesos oficiales se pueden ajustar cuando esté cargada la tabla de especificaciones de cada prueba.</p>'+bp.map(x=>'<div class="exam283Row"><div><b>'+esc(x.domain)+'</b><small>'+x.available+' disponibles</small></div><strong>'+x.target+'</strong></div>').join('')+'<button class="btn ghost full" onclick="PE283.start()">Practicar la matriz completa</button>';const a=progress.querySelector('.bank282');if(a)a.after(c);else progress.prepend(c)}}
 window.PE283={blueprint,build,start,inject};
 const old=window.render;if(old&&!window.__pe283){window.render=function(){const r=old();setTimeout(inject,0);return r};window.__pe283=true}setTimeout(inject,0);
}());
