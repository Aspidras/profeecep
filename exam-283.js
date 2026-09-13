// ProfeECEP 2.8.3 — simulador de 60 preguntas y matriz de especificaciones
(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 function blueprint(){
  const available=D.filter(d=>Q.some(q=>q.d===d[0]));
  const total=Math.min(60,Q.length),base=available.length?Math.floor(total/available.length):0,extra=available.length?total%available.length:0;
  return available.map((d,i)=>({domain:d[0],target:base+(i<extra?1:0),available:Q.filter(q=>q.d===d[0]).length}));
 }
 function build(){
  const bp=blueprint(),chosen=[],difficulty=['básica','media','media','alta','básica'];
  bp.forEach(row=>{const pool=shuffle(Q.filter(q=>q.d===row.domain&&!chosen.some(x=>x.id===q.id))),picked=[];for(let i=0;i<row.target;i++){const wanted=difficulty[i%difficulty.length],q=pool.find(x=>(x.diff||'media')===wanted)||pool.find(x=>!picked.includes(x));if(!q)break;picked.push(q);chosen.push(q)}});
  if(chosen.length<Math.min(60,Q.length))chosen.push(...shuffle(Q.filter(q=>!chosen.some(x=>x.id===q.id))).slice(0,Math.min(60,Q.length)-chosen.length));
  return shuffle(chosen);
 }
 function start(){
  const built=build();if(!built.length){alert('No hay preguntas disponibles para esta especialidad.');return}
  mode='simulation';clearInterval(SIM12_TIMER);quiz=built;const maxSeconds=150*60;SIM12={index:0,answers:{},marked:{},timeSpent:{},enteredAt:Date.now(),seconds:maxSeconds,maxSeconds,startedAt:new Date().toISOString(),generatedBy:'2.8.3',examTitle:'ECEP completo 2.8.3',examLabel:built.length+' preguntas · práctica alineada al formato ECEP'};renderSimulation12();SIM12_TIMER=setInterval(()=>{if(!SIM12)return clearInterval(SIM12_TIMER);SIM12.seconds--;const t=document.getElementById('sim12time');if(t)t.textContent=formatSim12Time(SIM12.seconds);if(SIM12.seconds<=0){clearInterval(SIM12_TIMER);finishSimulation12(true)}},1000);
 }
 function inject(){
  const bp=blueprint(),practice=el('practice'),progress=el('progress'),home=el('home');
  if(home){const p=home.querySelector('.hero .pill');if(p)p.textContent='ProfeECEP 2.8.3'}
  if(practice&&!practice.querySelector('.exam283')){const c=document.createElement('div');c.className='card exam283';c.innerHTML='<span class="pill">Simulador oficial de práctica 2.8.3</span><h3>Entrenamiento de 60 preguntas</h3><p class="muted">Simula la extensión y el tiempo de la ECEP. La distribución por dominio se calcula con la matriz activa y las preguntas son contenido propio.</p><button class="btn full" onclick="PE283.start()">Iniciar simulador de 60 preguntas</button>';const first=practice.querySelector('.complete28practice')||practice.querySelector('.sim21');if(first)first.before(c);else practice.prepend(c)}
  if(progress&&!progress.querySelector('.exam283')){const c=document.createElement('div');c.className='card exam283';c.innerHTML='<span class="pill">Matriz 2.8.3</span><h3>Distribución del simulador</h3><p class="muted">Esta matriz organiza el simulador activo. Los pesos oficiales se pueden ajustar cuando esté cargada la tabla de especificaciones de cada prueba.</p>'+bp.map(x=>'<div class="exam283Row"><div><b>'+esc(x.domain)+'</b><small>'+x.available+' disponibles</small></div><strong>'+x.target+'</strong></div>').join('')+'<button class="btn ghost full" onclick="PE283.start()">Practicar la matriz completa</button>';const a=progress.querySelector('.bank282');if(a)a.after(c);else progress.prepend(c)}}
 window.PE283={blueprint,build,start,inject};
 const old=window.render;if(old&&!window.__pe283){window.render=function(){const r=old();setTimeout(inject,0);return r};window.__pe283=true}setTimeout(inject,0);
}());
