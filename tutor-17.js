// ProfeECEP 1.7 — Tutor contextual
window.PE17={current:null};

PE17.escape=function(s){
 return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
};

PE17.contextFromStudy=function(){
 const id=S.lastStudy, x=flat.find(v=>v.id===id);
 if(!x)return null;
 const guide=G[x.sub]||null;
 const qs=Q.filter(q=>q.i===x.sub||q.d===x.domain);
 return{type:"study",indicator:x,guide,questions:qs};
};

PE17.contextFromQuestion=function(q){
 if(!q)return null;
 const guide=G[q.i]||null;
 return{type:"question",question:q,guide,indicator:{domain:q.d,sub:q.i,t:q.i}};
};

PE17.simple=function(ctx){
 if(!ctx)return "Abre una microlección o responde una pregunta para que pueda ayudarte con ese contenido.";
 const g=ctx.guide;
 if(g&&g.learn)return g.learn;
 return "Este contenido forma parte del temario de ProfeECEP. Revisa el indicador y practica con las preguntas relacionadas para consolidarlo.";
};

PE17.whyCorrect=function(ctx){
 const q=ctx&&ctx.question;
 if(!q)return "Selecciona una pregunta para revisar su respuesta.";
 return q.e+" La alternativa correcta es "+String.fromCharCode(65+q.a)+". "+q.o[q.a]+".";
};

PE17.whyOthers=function(ctx){
 const q=ctx&&ctx.question;
 if(!q)return "Selecciona una pregunta para analizar sus alternativas.";
 const items=q.o.map((o,i)=>{
   if(i===q.a)return "<li><b>"+String.fromCharCode(65+i)+". "+PE17.escape(o)+"</b>: es la alternativa correcta según la explicación disponible.</li>";
   return "<li><b>"+String.fromCharCode(65+i)+". "+PE17.escape(o)+"</b>: ProfeECEP no tiene todavía una explicación específica almacenada para esta alternativa. Compárala con la solución correcta y el concepto de la microlección.</li>";
 }).join("");
 return "<ul>"+items+"</ul>";
};

PE17.remember=function(ctx){
 if(!ctx)return "Abre un contenido para generar un recordatorio.";
 const g=ctx.guide;
 const bits=[];
 if(g&&g.learn)bits.push(g.learn.split(".")[0]+".");
 if(g&&g.error)bits.push("Evita: "+g.error.split(".")[0].toLowerCase()+".");
 if(g&&g.pedagogy)bits.push("Mirada pedagógica: "+g.pedagogy.split(".")[0]+".");
 return bits.join(" ")||"Resume con tus propias palabras qué representa el procedimiento y qué error frecuente debes evitar.";
};

PE17.practice=function(ctx){
 const pool=(ctx&&ctx.questions)||((ctx&&ctx.question)?Q.filter(x=>x.i===ctx.question.i&&x.id!==ctx.question.id):[]);
 if(!pool.length)return "No hay otra pregunta relacionada disponible todavía.";
 const q=pool[Math.floor(Math.random()*pool.length)];
 return '<div class="tutorPractice"><div class="muted">'+PE17.escape(q.i)+'</div><b>'+PE17.escape(q.q)+'</b>'+q.o.map((o,i)=>'<div>'+String.fromCharCode(65+i)+'. '+PE17.escape(o)+'</div>').join("")+'<details><summary>Ver solución</summary><p><b>'+String.fromCharCode(65+q.a)+'. '+PE17.escape(q.o[q.a])+'</b></p><p>'+PE17.escape(q.e)+'</p></details></div>';
};

PE17.respond=function(kind,ctx){
 if(kind==="simple")return PE17.simple(ctx);
 if(kind==="correct")return PE17.whyCorrect(ctx);
 if(kind==="others")return PE17.whyOthers(ctx);
 if(kind==="remember")return PE17.remember(ctx);
 if(kind==="practice")return PE17.practice(ctx);
 return "Elige una opción del tutor.";
};

PE17.open=function(ctx){
 PE17.current=ctx||PE17.contextFromStudy();
 let old=document.querySelector(".tutorOverlay");if(old)old.remove();
 const overlay=document.createElement("div");overlay.className="tutorOverlay";
 overlay.innerHTML='<div class="tutorModal"><button class="close" onclick="PE17.close()">×</button><span class="pill">Tutor ProfeECEP 1.7</span><h2>¿Cómo quieres que te ayude?</h2><div class="tutorActions"><button onclick="PE17.ask(\'simple\')">Explícamelo más simple</button><button onclick="PE17.ask(\'correct\')">¿Por qué es correcta?</button><button onclick="PE17.ask(\'others\')">Revisar alternativas</button><button onclick="PE17.ask(\'remember\')">¿Qué debo recordar?</button><button onclick="PE17.ask(\'practice\')">Dame otra práctica</button></div><div id="tutorAnswer" class="tutorAnswer"><p class="muted">El tutor usa únicamente el contenido y las preguntas cargadas en ProfeECEP.</p></div></div>';
 document.body.appendChild(overlay);
};

PE17.close=function(){document.querySelector(".tutorOverlay")?.remove()};

PE17.ask=function(kind){
 const box=document.getElementById("tutorAnswer");if(!box)return;
 box.innerHTML=PE17.respond(kind,PE17.current);
};

PE17.studyButton=function(){
 const study=el("study");if(!study||study.querySelector(".tutor17btn"))return;
 const head=study.querySelector(".studyHead");if(!head)return;
 const b=document.createElement("button");b.className="btn ghost full tutor17btn";b.textContent="Preguntar al Tutor ProfeECEP";b.onclick=()=>PE17.open(PE17.contextFromStudy());
 head.after(b);
};

PE17.wrapFeedback=function(){
 const practice=el("practice");if(!practice)return;
 const feedback=[...practice.querySelectorAll(".card.good,.card.bad")].find(x=>x.querySelector(".answerKey"));
 if(!feedback||practice.querySelector(".tutor17feedback"))return;
 const id=answers.length?answers[answers.length-1].id:null,q=Q.find(x=>x.id===id);
 if(!q)return;
 const b=document.createElement("button");b.className="btn ghost full tutor17feedback";b.textContent="Pedir explicación al tutor";b.onclick=()=>PE17.open(PE17.contextFromQuestion(q));
 feedback.after(b);
};

PE17.inject=function(){
 const home=el("home");
 if(home){
   const p=home.querySelector(".hero .pill");if(p)p.textContent="ProfeECEP 1.7";
   const h=home.querySelector(".hero h1");if(h)h.textContent="Ahora tienes un tutor dentro de ProfeECEP.";
   const d=home.querySelector(".hero p");if(d)d.textContent="Explicaciones contextuales, revisión de respuestas y práctica guiada usando el contenido de la plataforma.";
 }
 PE17.studyButton();PE17.wrapFeedback();
};

const pe17Render=render;
render=function(){pe17Render();setTimeout(PE17.inject,0)};
const pe17OpenStudy=openStudy;
openStudy=function(id){const r=pe17OpenStudy(id);setTimeout(PE17.studyButton,0);return r};
const pe17Check=checkAnswer;
checkAnswer=function(){const r=pe17Check();setTimeout(PE17.wrapFeedback,0);return r};
setTimeout(PE17.inject,0);
import("./errors-18.js");
