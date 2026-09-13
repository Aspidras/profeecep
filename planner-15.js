// ProfeECEP 1.5 — Planificador ECEP 2.0
window.PE15={};

PE15.dayKey=function(d){return d.toISOString().slice(0,10)};
PE15.startOfWeek=function(){
 const d=new Date();d.setHours(12,0,0,0);
 const day=(d.getDay()+6)%7;
 d.setDate(d.getDate()-day);
 return d;
};
PE15.activityDaysThisWeek=function(){
 const start=PE15.startOfWeek(), end=new Date(start);end.setDate(end.getDate()+7);
 const set=new Set((S.history||[]).map(x=>x.date).filter(x=>x&&new Date(x+"T12:00:00")>=start&&new Date(x+"T12:00:00")<end));
 return set;
};
PE15.rankDomains=function(){
 if(window.PE14&&PE14.rank){
   const scores={};
   PE14.rank().forEach(x=>{
     if(!scores[x.q.d])scores[x.q.d]={name:x.q.d,total:0,n:0};
     scores[x.q.d].total+=x.score;scores[x.q.d].n++;
   });
   return Object.values(scores).map(x=>({name:x.name,score:Math.round(x.total/x.n)})).sort((a,b)=>b.score-a.score);
 }
 return planRank().map(x=>({name:x.name,score:100-x.score}));
};
PE15.weekPlan=function(){
 const daysPerWeek=Math.max(1,Math.min(7,Number(S.plan.daysPerWeek)||5));
 const minutes=Math.max(10,Number(S.plan.minutes)||20);
 const activity=PE15.activityDaysThisWeek(), today=new Date(), monday=PE15.startOfWeek();
 const weekday=(today.getDay()+6)%7;
 const expectedByToday=Math.min(daysPerWeek,Math.floor((weekday+1)*daysPerWeek/7)+1);
 const completed=Math.min(activity.size,daysPerWeek);
 const remaining=Math.max(0,daysPerWeek-completed);
 const behind=Math.max(0,expectedByToday-completed);
 const ranked=PE15.rankDomains();
 const candidates=[];
 for(let i=0;i<7;i++){
   const d=new Date(monday);d.setDate(d.getDate()+i);
   const key=PE15.dayKey(d);
   candidates.push({date:d,key,past:d<new Date(new Date().setHours(0,0,0,0)),done:activity.has(key)});
 }
 const future=candidates.filter(x=>!x.past&&!x.done);
 const schedule=[];
 for(let i=0;i<Math.min(remaining,future.length);i++){
   const dom=ranked[i%Math.max(1,ranked.length)]||{name:"Números",score:50};
   schedule.push({...future[i],domain:dom.name,priority:dom.score,minutes});
 }
 return{daysPerWeek,minutes,completed,remaining,behind,activity,candidates,schedule,ranked};
};
PE15.statusText=function(p){
 if(p.remaining===0)return "Meta semanal completada";
 if(p.behind>0)return "Hay "+p.behind+" sesión(es) por recuperar; el plan ya fue reajustado";
 return "Vas al día con tu meta semanal";
};
PE15.session=function(domain){
 if(window.startAdaptive&&window.PE14)return startAdaptive();
 return startQuiz(domain||"all",5);
};
PE15.inject=function(){
 const home=el("home"),progress=el("progress"),p=PE15.weekPlan();
 if(home){
   const pill=home.querySelector(".hero .pill");if(pill)pill.textContent="ProfeECEP 1.5";
   const h1=home.querySelector(".hero h1");if(h1)h1.textContent="Tu plan se reajusta según lo que realmente estudias.";
   const desc=home.querySelector(".hero p");if(desc)desc.textContent="Calendario semanal, metas, atrasos y redistribución automática hasta tu fecha objetivo.";
   const old=home.querySelector(".plan07");if(old)old.remove();
   if(!home.querySelector(".planner15home")){
     const next=p.schedule[0];
     const c=document.createElement("div");c.className="card planner15home";
     c.innerHTML='<span class="pill">Planificador 2.0</span><h3>'+PE15.statusText(p)+'</h3><div class="plannerProgress"><b>'+p.completed+' / '+p.daysPerWeek+' sesiones</b><div class="bar"><i style="width:'+pct(p.completed,p.daysPerWeek)+'%"></i></div></div>'+(next?'<p><b>Próxima sesión:</b> '+next.domain+' · '+next.minutes+' min</p><button class="btn full" onclick="PE15.session(\''+next.domain+'\')">Comenzar sesión</button>':'<p class="muted">Ya completaste la meta de esta semana.</p>');
     const hero=home.querySelector(".hero");if(hero)hero.after(c);else home.prepend(c);
   }
 }
 if(progress){
   const old=progress.querySelector(".plan07detail");if(old)old.remove();
   if(!progress.querySelector(".planner15")){
     const box=document.createElement("div");box.className="planner15";
     const schedule=p.schedule.length?p.schedule.map(x=>'<div class="calendarRow"><div class="calendarDate"><b>'+x.date.toLocaleDateString("es-CL",{weekday:"short"})+'</b><span>'+x.date.toLocaleDateString("es-CL",{day:"2-digit",month:"2-digit"})+'</span></div><div class="calendarTask"><b>'+x.domain+'</b><span>'+x.minutes+' min · prioridad '+x.priority+'</span></div><button class="mini" onclick="PE15.session(\''+x.domain+'\')">Estudiar</button></div>').join(""):'<p class="muted">No quedan sesiones pendientes esta semana.</p>';
     box.innerHTML='<h2>Planificador ECEP 2.0</h2><p class="muted">'+PE15.statusText(p)+'</p><div class="grid2"><div class="card"><span class="muted">Meta semanal</span><strong class="big">'+p.daysPerWeek+'</strong><div class="tiny">sesiones de '+p.minutes+' min</div></div><div class="card"><span class="muted">Completadas</span><strong class="big">'+p.completed+'</strong><div class="tiny">'+p.remaining+' pendientes</div></div></div><div class="card"><h3>Configurar plan</h3><div class="planFields"><label>Fecha<input id="planDate" type="date" value="'+S.plan.examDate+'"></label><label>Minutos<input id="planMinutes" type="number" min="10" max="120" value="'+S.plan.minutes+'"></label><label>Días/semana<input id="planDays" type="number" min="1" max="7" value="'+S.plan.daysPerWeek+'"></label></div><button class="btn ghost full" onclick="savePlan()">Actualizar y reajustar</button></div><h3>Calendario de esta semana</h3><div class="card calendar15">'+schedule+'</div><h3>Prioridades actuales</h3>'+p.ranked.slice(0,3).map((x,i)=>'<div class="card"><div class="row"><b>'+(i+1)+'. '+x.name+'</b><span class="pill">'+x.score+'</span></div></div>').join("");
     const a=progress.querySelector(".analytics13");if(a)a.after(box);else progress.prepend(box);
   }
 }
};
window.PE15=PE15;
const pe15Render=render;render=function(){pe15Render();setTimeout(PE15.inject,0)};
setTimeout(PE15.inject,0);
import("./study-16.js");
