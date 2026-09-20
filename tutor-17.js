// Tutor contextual — explicaciones de la pregunta activa (3.0.4)
window.PE17={current:null};

PE17.escape=function(s){
 return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
};

PE17.contextFromStudy=function(){
 const id=S.lastStudy, x=flat.find(v=>v.id===id);
 if(!x)return null;
 const guide=PE16.guide(x);
 const qs=PE16.related(x);
 return{type:"study",indicator:x,guide,questions:qs};
};

PE17.contextFromQuestion=function(q){
 if(!q)return null;
 const indicator=flat.find(x=>x.id===q.indicatorId)||{domain:q.d,sub:q.i,t:q.i};
 const guide=PE16.guide(indicator);
 const questions=PE16.related(indicator,Q.length).filter(x=>x.id!==q.id);
 return{type:"question",question:q,guide,indicator,questions,selected:window.PE304?.selected(q)};
};

PE17.simple=function(ctx){
 if(!ctx)return 'Abre una microlección o responde una pregunta para consultar su explicación.';
 if(ctx.question)return '<b>La idea de esta pregunta</b><p>'+PE17.escape(PE304.reason(ctx.question,ctx.question.a))+'</p>';
 if(ctx.guide?.learn)return PE17.escape(ctx.guide.learn);
 const q=ctx.questions?.[0];
 if(q)return '<b>Veamos una pregunta de este indicador</b><p>'+PE17.escape(q.q)+'</p><p>'+PE17.escape(PE304.reason(q,q.a))+'</p>';
 return 'La microlección de este indicador todavía está pendiente.';
};
PE17.whyCorrect=function(ctx){
 const q=ctx?.question;if(!q)return 'Selecciona una pregunta para revisar su respuesta.';
 return '<b>'+PE17.escape(String.fromCharCode(65+q.a)+'. '+q.o[q.a])+'</b><p>'+PE17.escape(PE304.reason(q,q.a))+'</p>';
};
PE17.whyOthers=function(ctx){
 const q=ctx?.question;if(!q)return 'Selecciona una pregunta para analizar sus alternativas.';
 return PE304.alternatives(q,ctx.selected);
};
PE17.remember=function(ctx){
 if(!ctx)return 'Abre un contenido para consultar su recordatorio.';
 if(ctx.question)return '<b>Para recordar en esta pregunta</b><p>'+PE17.escape(ctx.question.feedbackApproach||PE304.reason(ctx.question,ctx.question.a))+'</p>';
 const g=ctx.guide;
 if(g)return PE17.escape(g.summary||g.learn||'')+(g.error?'<p><b>Error que conviene evitar:</b> '+PE17.escape(g.error)+'</p>':'');
 return PE17.simple(ctx);
};
PE17.practice=function(ctx){
 const pool=ctx?.questions||[];
 if(!pool.length)return 'No hay otra pregunta relacionada disponible todavía.';
 const q=pool[Math.floor(Math.random()*pool.length)];
 return '<div class="tutorPractice"><div class="muted">'+PE17.escape(q.i)+'</div><b>'+PE17.escape(q.q)+'</b>'+q.o.map((o,i)=>'<div>'+String.fromCharCode(65+i)+'. '+PE17.escape(o)+'</div>').join('')+'<details><summary>Ver solución y alternativas</summary>'+PE304.feedback(q)+'</details></div>';
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
 overlay.innerHTML='<div class="tutorModal"><div class="pe304-tutor-head"><button class="close" aria-label="Cerrar tutor" onclick="PE17.close()">×</button><span class="pill">Tutor ProfeECEP</span><h2>Entiende el razonamiento</h2></div>'+(PE17.current?.question?'<p class="pe304-question">'+PE17.escape(PE17.current.question.q)+'</p>':'')+'<div class="tutorActions"><button onclick="PE17.ask(\'simple\')">Explícamelo más simple</button><button onclick="PE17.ask(\'correct\')">¿Por qué es correcta?</button><button onclick="PE17.ask(\'others\')">Revisar alternativas</button><button onclick="PE17.ask(\'remember\')">¿Qué debo recordar?</button><button onclick="PE17.ask(\'practice\')">Dame otra práctica</button></div><div id="tutorAnswer" class="tutorAnswer" tabindex="-1" aria-live="polite"><p class="muted">Elige qué parte quieres comprender.</p></div></div>';
 document.body.appendChild(overlay);
};

PE17.close=function(){document.querySelector(".tutorOverlay")?.remove()};

PE17.ask=function(kind){
 const box=document.getElementById("tutorAnswer");if(!box)return;
 box.innerHTML=PE17.respond(kind,PE17.current);
 box.focus?.({preventScroll:true});box.scrollIntoView?.({block:"nearest"});
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
