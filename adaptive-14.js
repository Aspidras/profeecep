// ProfeECEP 1.4 — Motor adaptativo 2.0
window.PE14={};

PE14.profile=function(){
 const h=S.history||[], now=Date.now(), byDomain={}, byQuestion={};
 h.forEach(x=>{
   if(!byDomain[x.domain])byDomain[x.domain]={r:0,n:0,sec:0,tn:0};
   const d=byDomain[x.domain];d.n++;if(x.ok)d.r++;if(x.seconds){d.sec+=x.seconds;d.tn++}
   if(!byQuestion[x.id])byQuestion[x.id]=[];
   byQuestion[x.id].push(x);
 });
 return{h,now,byDomain,byQuestion};
};

PE14.questionScore=function(q,p){
 const attempts=p.byQuestion[q.id]||[];
 const last=attempts[attempts.length-1];
 const domain=p.byDomain[q.d]||{r:0,n:0,sec:0,tn:0};
 const domainAcc=domain.n?pct(domain.r,domain.n):50;
 const qAcc=attempts.length?pct(attempts.filter(x=>x.ok).length,attempts.length):50;
 const avgSec=attempts.filter(x=>x.seconds).length?Math.round(attempts.filter(x=>x.seconds).reduce((s,x)=>s+x.seconds,0)/attempts.filter(x=>x.seconds).length):null;

 let score=0;
 const reasons=[];

 if(S.wrong.includes(q.id)){score+=35;reasons.push("error pendiente")}
 if(!attempts.length){score+=18;reasons.push("aún no practicada")}
 if(domainAcc<60){score+=20;reasons.push("dominio débil")}
 else if(domainAcc<75){score+=10;reasons.push("dominio en desarrollo")}
 if(qAcc<60&&attempts.length){score+=22;reasons.push("baja precisión")}
 if(qAcc>=85&&attempts.length>=3)score-=12;

 if(last){
   const day=86400000, lastDate=Date.parse((last.date||"")+"T12:00:00");
   const days=Math.max(0,Math.floor((now-lastDate)/day));
   const streak=(()=>{
     let n=0;
     for(let i=attempts.length-1;i>=0;i--){if(attempts[i].ok)n++;else break}
     return n;
   })();
   const interval=last.ok?[1,3,7,14,30][Math.min(Math.max(streak-1,0),4)]:0;
   if(days>=interval){score+=20;reasons.push("repaso vencido")}
   else score-=5;
 }

 if(avgSec!==null){
   if(avgSec>75){score+=10;reasons.push("respuesta lenta")}
   else if(avgSec<20&&qAcc<60){score+=8;reasons.push("error rápido")}
 }

 if(q.diff==="alta"&&domainAcc<55)score-=8;
 if(q.diff==="básica"&&domainAcc<55)score+=8;
 if(q.diff==="alta"&&domainAcc>=75)score+=8;

 return{q,score,reasons:[...new Set(reasons)],domainAcc,qAcc,avgSec};
};

PE14.rank=function(){
 const p=PE14.profile();
 return Q.map(q=>PE14.questionScore(q,p)).sort((a,b)=>b.score-a.score);
};

PE14.select=function(count=5){
 const ranked=PE14.rank(), chosen=[], usedSkill={};
 for(const item of ranked){
   const skill=item.q.skill||"general";
   if((usedSkill[skill]||0)>=2)continue;
   chosen.push(item.q);usedSkill[skill]=(usedSkill[skill]||0)+1;
   if(chosen.length===count)break;
 }
 return chosen;
};

PE14.summary=function(){
 const ranked=PE14.rank().slice(0,5);
 return ranked.map(x=>({id:x.q.id,title:x.q.i,score:x.score,reasons:x.reasons,diff:x.q.diff||"media"}));
};

startAdaptive=function(){
 mode="practice";
 quiz=PE14.select(5);
 pos=0;answers=[];showQ();
};

PE14.inject=function(){
 const home=el("home"),practice=el("practice");
 const top=PE14.summary();

 if(home){
   const pill=home.querySelector(".hero .pill");if(pill)pill.textContent="ProfeECEP 1.4";
   const h1=home.querySelector(".hero h1");if(h1)h1.textContent="Tu entrenamiento ahora decide qué necesitas practicar primero.";
   const p=home.querySelector(".hero p");if(p)p.textContent="Motor adaptativo 2.0 con dificultad, historial, repetición espaciada, errores y velocidad.";
   if(!home.querySelector(".adaptive14home")&&top.length){
     const c=document.createElement("div");c.className="card adaptive14home";
     c.innerHTML='<span class="pill">Adaptativo 2.0</span><h3>Próxima prioridad</h3><p><b>'+top[0].title+'</b></p><div class="muted">'+(top[0].reasons.length?top[0].reasons.join(" · "):"recomendación por historial")+' · nivel '+top[0].diff+'</div><button class="btn full" onclick="startAdaptive()">Empezar entrenamiento recomendado</button>';
     const hero=home.querySelector(".hero");if(hero)hero.after(c);else home.prepend(c);
   }
 }

 if(practice){
   const old=[...practice.querySelectorAll(".card")].find(c=>c.textContent.includes("Entrenamiento adaptativo"));
   if(old&&!old.classList.contains("adaptive14")){
     old.classList.add("adaptive14");
     old.innerHTML='<span class="pill">Motor adaptativo 2.0</span><h3>Entrenamiento recomendado</h3><p>Selecciona preguntas según errores, dificultad, repaso, precisión y velocidad.</p><div class="adaptiveReasons">'+top.slice(0,3).map(x=>'<div><b>'+x.title+'</b><span>'+((x.reasons||[]).slice(0,2).join(" · ")||"prioridad adaptativa")+'</span></div>').join("")+'</div><button class="btn full" onclick="startAdaptive()">Comenzar sesión adaptativa</button>';
   }
 }
};

const pe14Render=render;
render=function(){pe14Render();setTimeout(PE14.inject,0)};
setTimeout(PE14.inject,0);
