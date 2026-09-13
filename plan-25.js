// ProfeECEP 2.5 — plan adaptativo por evidencia
(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 const today=()=>{const d=new Date();return d.toISOString().slice(0,10)};
 const active=()=>window.PE_ACTIVE_SPECIALTY||'basica-matematica';
 function domains(){return [...new Set((Q||[]).map(q=>q.d))];}
 function rank(){
  const recent=(S.history||[]).slice(-30), diag=S.diagnosis&&S.diagnosis.specialtyId===active()?S.diagnosis.byDomain||{}:{};
  return domains().map(name=>{
   const hs=recent.filter(x=>x.domain===name), all=(S.byDomain||{})[name]||{}, d=diag[name]||{};
   const recentP=hs.length?pct(hs.filter(x=>x.ok).length,hs.length):null, allP=all.total?pct(all.right,all.total):null, diagP=d.total?pct(d.right,d.total):null;
   const errors=(S.wrong||[]).filter(id=>{const q=Q.find(x=>x.id===id);return q&&q.d===name}).length;
   const evidence=[recentP,allP,diagP].filter(x=>x!==null), accuracy=evidence.length?Math.round(evidence.reduce((a,b)=>a+b,0)/evidence.length):50;
   const priority=Math.max(0,100-accuracy)+errors*8+(hs.length?0:12);
   const reason=errors?'errores pendientes':diagP!==null&&diagP<70?'diagnóstico':recentP!==null&&recentP<70?'rendimiento reciente':'contenido por practicar';
   return {name,priority,accuracy,errors,reason};
  }).sort((a,b)=>b.priority-a.priority);
 }
 function mark(){
  S.plan25Sessions=S.plan25Sessions||{};const k=today();S.plan25Sessions[k]={specialty:active(),domain:rank()[0]?.name||'',minutes:Number(S.plan?.minutes)||20};saveState();inject();
 }
 function start(name){if(window.startQuiz)startQuiz(name,5)}
 function inject(){
  const rs=rank(), top=rs[0]||{name:'Temario general',reason:'contenido por practicar',priority:50}, minutes=Math.max(10,Number(S.plan?.minutes)||20), done=!!(S.plan25Sessions&&S.plan25Sessions[today()]&&S.plan25Sessions[today()].specialty===active());
  const home=document.querySelector('#home'), progress=document.querySelector('#progress');
  if(home){let c=home.querySelector('.plan25home');if(!c){c=document.createElement('div');c.className='card plan25home';const hero=home.querySelector('.hero');if(hero)hero.after(c);else home.prepend(c)} c.innerHTML='<span class="pill">Plan adaptativo 2.5</span><h3>'+ (done?'Sesión de hoy registrada':'Tu siguiente sesión')+'</h3><p><b>'+esc(top.name)+'</b> · '+minutes+' min</p><div class="plan25Reason">Prioridad por '+esc(top.reason)+(top.errors?' · '+top.errors+' error(es) pendiente(s)':'')+'</div><div class="plan25Actions"><button class="btn" onclick="PE25.start(\''+esc(top.name)+'\')">Practicar ahora</button><button class="btn ghost" onclick="PE25.mark()">'+(done?'Actualizar sesión':'Marcar completada')+'</button></div>'}
  if(progress){let c=progress.querySelector('.plan25');if(!c){c=document.createElement('div');c.className='card plan25';progress.prepend(c)} const days=Math.max(1,Math.min(7,Number(S.plan?.daysPerWeek)||5));let rows=rs.slice(0,Math.min(5,days)).map((x,i)=>'<div class="plan25Row"><span class="rank">'+(i+1)+'</span><div><b>'+esc(x.name)+'</b><small>'+esc(x.reason)+' · '+x.accuracy+'% base</small></div><button class="mini" onclick="PE25.start(\''+esc(x.name)+'\')">Estudiar</button></div>').join(''); c.innerHTML='<span class="pill">2.5 · Reajuste automático</span><h3>Prioridades de tu plan</h3><p class="muted">Cada sesión combina diagnóstico, errores y respuestas recientes de '+esc((window.PE20&&PE20.active&&PE20.active().short)||'la especialidad activa')+'.</p>'+rows+'<button class="btn ghost full" onclick="PE25.mark()">Marcar sesión de hoy como completada</button>'}
 }
 window.PE25={rank,inject,mark,start};
 const old=window.render;if(old&&!window.__pe25){window.render=function(){const r=old();setTimeout(inject,0);return r};window.__pe25=true}
 setTimeout(inject,0);
}());
