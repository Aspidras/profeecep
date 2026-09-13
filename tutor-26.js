// ProfeECEP 2.6 — tutor guiado por objetivo
(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 function target(){
  const active=window.PE_ACTIVE_SPECIALTY||'basica-matematica';
  const ranked=window.PE25&&PE25.rank?PE25.rank():[];
  const domain=ranked[0]?.name||Q[0]?.d;
  const q=(S.wrong||[]).map(id=>Q.find(x=>x.id===id)).find(x=>x&&(!domain||x.d===domain))||Q.find(x=>x&&x.d===domain)||Q[0];
  return {active,domain,q};
 }
 function ask(kind){
  const t=target(); S.tutor26=S.tutor26||{sessions:0,last:null}; S.tutor26.sessions++; S.tutor26.last={date:new Date().toISOString(),kind,domain:t.domain}; saveState();
  if(window.PE17&&PE17.open){
   const ctx=t.q&&PE17.contextFromQuestion?PE17.contextFromQuestion(t.q):PE17.contextFromStudy(); PE17.open(ctx); setTimeout(()=>PE17.ask(kind),0);
  }
 }
 function inject(){
  const t=target(),home=el('home'),progress=el('progress');
  if(home){let c=home.querySelector('.tutor26home');if(!c){c=document.createElement('div');c.className='card tutor26home';const hero=home.querySelector('.hero');if(hero)hero.after(c);else home.prepend(c)} c.innerHTML='<span class="pill">Tutor guiado 2.6</span><h3>Ayuda enfocada en tu prioridad</h3><p class="muted">El tutor toma el dominio recomendado y tus errores pendientes para explicarte justo lo que necesitas reforzar.</p><div class="tutor26Target"><b>'+esc(t.domain||'Contenido general')+'</b><span>'+esc(t.q?.i||'Selecciona un contenido para comenzar')+'</span></div><div class="tutor26Actions"><button class="btn" onclick="PE26.ask(\'simple\')">Explícamelo</button><button class="btn ghost" onclick="PE26.ask(\'practice\')">Dame práctica</button></div>'}
  if(progress&&!progress.querySelector('.tutor26')){const c=document.createElement('div');c.className='card tutor26';const n=S.tutor26?.sessions||0;c.innerHTML='<span class="pill">Tutor 2.6</span><h3>Historial de acompañamiento</h3><p class="muted">Consultas realizadas: <b>'+n+'</b>. Cada consulta queda asociada a la prioridad de estudio del momento.</p><button class="btn ghost full" onclick="PE26.ask(\'remember\')">Recordarme la estrategia</button>';progress.prepend(c)}
 }
 window.PE26={inject,ask,target};
 const old=window.render;if(old&&!window.__pe26){window.render=function(){const r=old();setTimeout(inject,0);return r};window.__pe26=true}
 setTimeout(inject,0);
}());
