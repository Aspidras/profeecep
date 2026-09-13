// ProfeECEP 1.9 — Motivación y constancia
window.PE19={};

PE19.uniqueDays=function(){
 return [...new Set((S.history||[]).map(x=>x.date).filter(Boolean))].sort();
};

PE19.streak=function(){
 const days=PE19.uniqueDays(); if(!days.length)return 0;
 let n=1, cur=new Date(days[days.length-1]+"T12:00:00");
 const today=new Date();today.setHours(12,0,0,0);
 const gap=Math.round((today-cur)/86400000);
 if(gap>1)return 0;
 for(let i=days.length-2;i>=0;i--){
   const prev=new Date(days[i]+"T12:00:00"),diff=Math.round((cur-prev)/86400000);
   if(diff===1){n++;cur=prev}else break;
 }
 return n;
};

PE19.readiness=function(){
 const coverage=pct(S.done.length,flat.length);
 const practice=S.total?pct(S.right,S.total):0;
 const recent=(S.history||[]).slice(-20);
 const recentP=recent.length?pct(recent.filter(x=>x.ok).length,recent.length):0;
 const sims=(S.simulations||[]).slice(-3);
 const simP=sims.length?Math.round(sims.reduce((a,x)=>a+pct(x.right,x.total),0)/sims.length):0;
 const weekly=window.PE15?PE15.weekPlan():null;
 const consistency=weekly?pct(weekly.completed,weekly.daysPerWeek):0;
 const components=[
   {name:"Cobertura",value:coverage,weight:25},
   {name:"Precisión",value:practice,weight:25},
   {name:"Rendimiento reciente",value:recentP,weight:20},
   {name:"Simulacros",value:simP,weight:20},
   {name:"Constancia",value:consistency,weight:10}
 ];
 const active=components.filter(x=>x.value>0||x.name==="Cobertura"||x.name==="Constancia");
 const totalWeight=active.reduce((s,x)=>s+x.weight,0)||1;
 const score=Math.round(active.reduce((s,x)=>s+x.value*x.weight,0)/totalWeight);
 return{score,components,coverage,practice,recentP,simP,consistency};
};

PE19.milestones=function(){
 const days=PE19.uniqueDays().length,st=PE19.streak(),sims=(S.simulations||[]).length,done=S.done.length,total=S.history?.length||0;
 return[
   {id:"first",title:"Primer paso",done:total>=1,detail:"Responder tu primera pregunta"},
   {id:"fiveDays",title:"Constancia inicial",done:days>=5,detail:"Estudiar en 5 días distintos"},
   {id:"streak3",title:"Ritmo de estudio",done:st>=3,detail:"Mantener una racha de 3 días"},
   {id:"study10",title:"Temario en marcha",done:done>=10,detail:"Revisar 10 indicadores"},
   {id:"sim1",title:"Primera simulación",done:sims>=1,detail:"Completar un simulacro"},
   {id:"sim3",title:"Seguimiento real",done:sims>=3,detail:"Completar 3 simulacros"}
 ];
};

PE19.nextMilestone=function(){
 return PE19.milestones().find(x=>!x.done)||null;
};

PE19.inject=function(){
 const home=el("home"),progress=el("progress"),r=PE19.readiness(),st=PE19.streak(),ms=PE19.milestones(),next=PE19.nextMilestone();
 const weekly=window.PE15?PE15.weekPlan():null;

 if(home){
   const pill=home.querySelector(".hero .pill");if(pill)pill.textContent="ProfeECEP 1.9";
   const h1=home.querySelector(".hero h1");if(h1)h1.textContent="Tu preparación ahora también muestra constancia y avance real.";
   const d=home.querySelector(".hero p");if(d)d.textContent="Racha, metas semanales, hitos y un índice orientativo de preparación.";
   if(!home.querySelector(".motivation19home")){
     const c=document.createElement("div");c.className="card motivation19home";
     c.innerHTML='<span class="pill">Constancia 1.9</span><div class="motivationGrid"><div><span class="muted">Preparación estimada</span><strong class="score">'+r.score+'%</strong><div class="tiny">Índice interno ProfeECEP, no puntaje oficial</div></div><div><span class="muted">Racha actual</span><strong class="score">'+st+'</strong><div class="tiny">'+(st===1?'día':"días")+' de estudio</div></div></div>'+(weekly?'<div class="bar"><i style="width:'+pct(weekly.completed,weekly.daysPerWeek)+'%"></i></div><p class="muted">'+weekly.completed+' de '+weekly.daysPerWeek+' sesiones esta semana</p>':'')+(next?'<div class="nextMilestone"><b>Próximo hito:</b> '+next.title+' · '+next.detail+'</div>':'<div class="nextMilestone"><b>Todos los hitos iniciales completados.</b></div>');
     const hero=home.querySelector(".hero");if(hero)hero.after(c);else home.prepend(c);
   }
 }

 if(progress&&!progress.querySelector(".motivation19")){
   const box=document.createElement("div");box.className="motivation19";
   box.innerHTML='<h2>Motivación y constancia</h2><p class="muted">Indicadores de progreso para ayudarte a sostener el estudio.</p><div class="grid2"><div class="card"><span class="muted">Preparación estimada</span><strong class="score">'+r.score+'%</strong><div class="bar"><i style="width:'+r.score+'%"></i></div><div class="tiny">Índice interno ProfeECEP</div></div><div class="card"><span class="muted">Racha actual</span><strong class="score">'+st+'</strong><div class="tiny">día(s) consecutivos</div></div></div><h3>Cómo se calcula tu preparación</h3>'+r.components.map(x=>'<div class="card prepComponent"><div class="row"><span>'+x.name+'</span><b>'+x.value+'%</b></div><div class="bar"><i style="width:'+x.value+'%"></i></div></div>').join("")+'<h3>Hitos</h3><div class="milestones19">'+ms.map(x=>'<div class="card milestone '+(x.done?"done":"")+'"><span class="milestoneIcon">'+(x.done?"✓":"○")+'</span><div><b>'+x.title+'</b><div class="tiny">'+x.detail+'</div></div></div>').join("")+'</div>';
   const a=progress.querySelector(".analytics13");if(a)a.before(box);else progress.prepend(box);
 }
};

const pe19Render=render;
render=function(){pe19Render();setTimeout(PE19.inject,0)};
setTimeout(PE19.inject,0);