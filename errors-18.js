// ProfeECEP 1.8 — Entrenador de errores
window.PE18={};

PE18.patterns=function(){
 const h=S.history||[], bySkill={}, bySub={}, repeated={};
 h.forEach(x=>{
   const q=Q.find(v=>v.id===x.id); if(!q)return;
   const skill=q.skill||"general", sub=q.i||q.d;
   if(!bySkill[skill])bySkill[skill]={name:skill,total:0,wrong:0,fastWrong:0};
   if(!bySub[sub])bySub[sub]={name:sub,total:0,wrong:0};
   bySkill[skill].total++;bySub[sub].total++;
   if(!x.ok){
     bySkill[skill].wrong++;bySub[sub].wrong++;
     if(x.seconds&&x.seconds<20)bySkill[skill].fastWrong++;
     repeated[q.id]=(repeated[q.id]||0)+1;
   }
 });
 const skills=Object.values(bySkill).map(x=>({...x,error:pct(x.wrong,x.total)})).filter(x=>x.total>=2&&x.wrong>0).sort((a,b)=>b.error-a.error);
 const subs=Object.values(bySub).map(x=>({...x,error:pct(x.wrong,x.total)})).filter(x=>x.total>=2&&x.wrong>0).sort((a,b)=>b.error-a.error);
 const repeat=Object.entries(repeated).filter(([,n])=>n>=2).map(([id,n])=>{const q=Q.find(x=>x.id===id);return q?{id,n,q}:null}).filter(Boolean).sort((a,b)=>b.n-a.n);
 const result=[];
 if(repeat[0])result.push({type:"repeated",title:"Error repetido",detail:repeat[0].q.i,score:repeat[0].n*20,questionId:repeat[0].id});
 if(skills[0])result.push({type:"skill",title:"Patrón de razonamiento",detail:skills[0].name,score:skills[0].error,skill:skills[0].name,fastWrong:skills[0].fastWrong});
 if(subs[0])result.push({type:"sub",title:"Contenido a reforzar",detail:subs[0].name,score:subs[0].error,sub:subs[0].name});
 const fast=skills.filter(x=>x.fastWrong>0).sort((a,b)=>b.fastWrong-a.fastWrong)[0];
 if(fast)result.push({type:"fast",title:"Errores rápidos",detail:fast.name,score:fast.fastWrong*15,skill:fast.name});
 return result.sort((a,b)=>b.score-a.score);
};

PE18.pool=function(pattern){
 if(!pattern)return Q;
 if(pattern.type==="repeated"){const q=Q.find(x=>x.id===pattern.questionId);return q?[q,...Q.filter(x=>x.i===q.i&&x.id!==q.id)]:Q}
 if(pattern.type==="skill"||pattern.type==="fast")return Q.filter(q=>(q.skill||"general")===pattern.skill);
 if(pattern.type==="sub")return Q.filter(q=>q.i===pattern.sub);
 return Q;
};

PE18.start=function(index=0){
 const p=PE18.patterns()[index]||PE18.patterns()[0];
 let pool=PE18.pool(p);
 if(pool.length<5){
   const extra=Q.filter(q=>!pool.some(x=>x.id===q.id)&&(p&&p.sub?q.d===Q.find(x=>x.i===p.sub)?.d:true));
   pool=[...pool,...extra];
 }
 mode="practice";quiz=shuffle(pool).slice(0,Math.min(5,pool.length));pos=0;answers=[];showQ();
};

PE18.explain=function(p){
 if(!p)return "Necesitas más respuestas para detectar un patrón estable.";
 if(p.type==="repeated")return "Has fallado la misma pregunta más de una vez. Conviene revisar el concepto antes de volver a automatizar el procedimiento.";
 if(p.type==="fast")return "Hay errores respondidos muy rápido en este tipo de razonamiento. Antes de elegir una alternativa, identifica qué pide exactamente el problema.";
 if(p.type==="skill")return "Este tipo de razonamiento concentra una proporción alta de errores. La sesión priorizará preguntas similares para practicar la estrategia, no solo el contenido.";
 if(p.type==="sub")return "Este contenido muestra una tasa de error alta. La sesión se enfocará en reconstruir el concepto con preguntas relacionadas.";
 return "";
};

PE18.inject=function(){
 const home=el("home"),progress=el("progress"),practice=el("practice"),ps=PE18.patterns();
 if(home){
   const pill=home.querySelector(".hero .pill");if(pill)pill.textContent="ProfeECEP 1.8";
   const h1=home.querySelector(".hero h1");if(h1)h1.textContent="Ahora ProfeECEP detecta patrones detrás de tus errores.";
   const d=home.querySelector(".hero p");if(d)d.textContent="Identifica errores repetidos, debilidades de razonamiento y respuestas impulsivas para crear sesiones de corrección.";
   if(!home.querySelector(".error18home")){
     const c=document.createElement("div");c.className="card error18home";
     c.innerHTML=ps.length?'<span class="pill">Entrenador 1.8</span><h3>'+ps[0].title+'</h3><p><b>'+ps[0].detail+'</b></p><p class="muted">'+PE18.explain(ps[0])+'</p><button class="btn full" onclick="PE18.start(0)">Corregir este patrón</button>':'<span class="pill">Entrenador 1.8</span><h3>Aún no hay un patrón claro</h3><p class="muted">Sigue practicando para que ProfeECEP pueda detectar errores recurrentes.</p>';
     const hero=home.querySelector(".hero");if(hero)hero.after(c);else home.prepend(c);
   }
 }
 if(progress&&!progress.querySelector(".errors18")){
   const box=document.createElement("div");box.className="errors18";
   box.innerHTML='<h2>Entrenador de errores</h2><p class="muted">Patrones detectados a partir de tu historial real.</p>'+(ps.length?ps.map((p,i)=>'<div class="card errorPattern"><div class="row"><div><span class="pill">'+p.title+'</span><h3>'+p.detail+'</h3></div><b>'+p.score+'</b></div><p class="muted">'+PE18.explain(p)+'</p><button class="btn ghost full" onclick="PE18.start('+i+')">Practicar este patrón</button></div>').join(""):'<div class="card"><p class="muted">Necesitas más práctica para detectar patrones confiables.</p></div>');
   const a=progress.querySelector(".analytics13");if(a)a.after(box);else progress.prepend(box);
 }
 if(practice&&!practice.querySelector(".error18practice")){
   const c=document.createElement("div");c.className="card error18practice";
   c.innerHTML='<span class="pill">Entrenador 1.8</span><h3>Sesión de corrección</h3><p>'+(ps[0]?'<b>'+ps[0].detail+'</b><br><span class="muted">'+PE18.explain(ps[0])+'</span>':'Aún no hay un patrón prioritario.')+'</p>'+(ps[0]?'<button class="btn full" onclick="PE18.start(0)">Iniciar corrección</button>':'');
   practice.prepend(c);
 }
};

const pe18Render=render;
render=function(){pe18Render();setTimeout(PE18.inject,0)};
setTimeout(PE18.inject,0);