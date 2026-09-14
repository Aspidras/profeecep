// ProfeECEP 2.8 — cobertura completa de la experiencia ECEP
(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 function inventory(){
  const subs=[];let indicators=0,covered=0;D.forEach((d,di)=>d[1].forEach((s,si)=>{subs.push({domain:d[0],name:s[0],count:s[1].length,questions:Q.filter(q=>q.i===s[0]).length});s[1].forEach((_,ii)=>{indicators++;if(Q.filter(q=>q.indicatorId===di+'-'+si+'-'+ii).length>=2)covered++})}));
  const domains=[...new Set(D.map(d=>d[0]))];return{domains,subs,indicators,covered,questions:Q.length};
 }
 function startFull(){
  const count=Math.min(30,Q.length);if(!count){alert('No hay preguntas disponibles para esta especialidad.');return}
  const built=window.PE21&&PE21.build?PE21.build({count,difficulty:'all',focus:'balanced',balance:true,domains:D.map(d=>d[0])}):shuffle(Q).slice(0,count);
  mode='simulation';clearInterval(SIM12_TIMER);quiz=built;const maxSeconds=Math.max(900,built.length*90);SIM12={index:0,answers:{},marked:{},timeSpent:{},enteredAt:Date.now(),seconds:maxSeconds,maxSeconds,startedAt:new Date().toISOString(),generatedBy:'3.0.1',filters:{count,focus:'balanced',balance:true,domains:D.map(d=>d[0])}};renderSimulation12();const label=document.querySelector('.sim12Top .muted');if(label)label.textContent=built.length+' preguntas · cobertura completa de la especialidad';SIM12_TIMER=setInterval(()=>{if(!SIM12)return clearInterval(SIM12_TIMER);SIM12.seconds--;const t=document.getElementById('sim12time');if(t)t.textContent=formatSim12Time(SIM12.seconds);if(SIM12.seconds<=0){clearInterval(SIM12_TIMER);finishSimulation12(true)}},1000);
 }
 function inject(){
  const inv=inventory(),home=el('home'),practice=el('practice'),progress=el('progress');
  if(home&&!home.querySelector('.complete28home')){const c=document.createElement('div');c.className='card complete28home';const hero=home.querySelector('.hero');if(hero)hero.after(c);else home.prepend(c);c.innerHTML='<span class="pill">ECEP completo 2.8</span><h3>Todo el temario en una sola ruta</h3><p class="muted">La especialidad activa reúne sus dominios, subdominios, indicadores, banco de práctica, diagnóstico, tutor y plan adaptativo.</p><div class="complete28Stats"><span><b>'+inv.domains.length+'</b> dominios</span><span><b>'+inv.indicators+'</b> indicadores</span><span><b>'+inv.questions+'</b> preguntas</span><span><b>'+inv.covered+'/'+inv.indicators+'</b> indicadores cubiertos</span></div><button class="btn full" onclick="PE28.startFull()">Iniciar simulacro ECEP completo</button>'}
  if(practice&&!practice.querySelector('.complete28practice')){const c=document.createElement('div');c.className='card complete28practice';c.innerHTML='<span class="pill">Ruta final 2.8</span><h3>Simulacro de cobertura completa</h3><p class="muted">Recorre hasta 30 preguntas equilibradas entre todos los dominios disponibles.</p><button class="btn full" onclick="PE28.startFull()">Comenzar simulacro completo</button>';const first=practice.querySelector('.sim21');if(first)first.before(c);else practice.prepend(c)}
  if(progress&&!progress.querySelector('.complete28')){const c=document.createElement('div');c.className='card complete28';c.innerHTML='<span class="pill">Cobertura 2.8</span><h3>Mapa de la especialidad</h3><p class="muted">Indicadores del temario oficial y preguntas propias disponibles para practicar.</p>'+inv.subs.map(s=>'<div class="complete28Row"><div><b>'+esc(s.name)+'</b><small>'+esc(s.domain)+' · '+s.count+' indicadores</small></div><span>'+s.questions+' preguntas</span></div>').join('');const first=progress.querySelector('.analytics13');if(first)first.after(c);else progress.prepend(c)}
  }
 window.PE28={inventory,startFull,inject};
 const old=window.render;if(old&&!window.__pe28){window.render=function(){const r=old();setTimeout(inject,0);return r};window.__pe28=true}setTimeout(inject,0);
}());
