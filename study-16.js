// ProfeECEP 1.6 — Centro de estudio completo por indicador
window.PE16={};

PE16.related=function(x){
 const exact=Q.filter(q=>q.i===x.sub);
 const domain=Q.filter(q=>q.d===x.domain&&!exact.some(e=>e.id===q.id));
 return [...exact,...domain].slice(0,5);
};

PE16.summary=function(x,g){
 const parts=[];
 if(g&&g.learn)parts.push(g.learn.split(".")[0]+".");
 if(g&&g.error)parts.push("Evita: "+g.error.split(".")[0].toLowerCase()+".");
 return parts.join(" ");
};

PE16.exercise=function(q){
 if(!q)return '<div class="studyCard exercise"><div class="studyLabel">✍️ Ejercicio guiado</div><p>Formula un ejemplo propio que aplique este indicador y explica qué propiedad o estrategia utilizaste.</p></div>';
 return '<div class="studyCard exercise"><div class="studyLabel">✍️ Ejercicio guiado</div><p><b>'+q.q+'</b></p><details><summary>Ver alternativas y solución</summary><div class="guidedOptions">'+q.o.map((o,i)=>'<div>'+String.fromCharCode(65+i)+'. '+o+'</div>').join("")+'</div><p><b>Respuesta:</b> '+String.fromCharCode(65+q.a)+'. '+q.o[q.a]+'</p><p class="muted">'+q.e+'</p></details></div>';
};

PE16.open=function(id){
 const x=flat.find(v=>v.id===id);if(!x)return;
 S.lastStudy=id;saveState();
 const g=G[x.sub]||{learn:"Este indicador forma parte del temario oficial y requiere aplicar el contenido en situaciones pertinentes.",example:"Analiza una situación donde debas aplicar el indicador paso a paso.",error:"Evita resolver de forma mecánica sin interpretar el significado de los procedimientos.",pedagogy:"Relaciona el contenido con distintas representaciones y con evidencia del razonamiento del estudiante."};
 const qs=PE16.related(x),first=qs[0];
 const studied=S.done.includes(id);
 el("study").innerHTML=
 '<button class="btn ghost back" onclick="go(\'map\')">← Volver al temario</button>'+
 '<div class="studyHead"><span class="pill">Microlección 1.6</span><h2>'+x.t+'</h2><p class="muted">'+x.domain+' · '+x.sub+'</p></div>'+
 '<div class="studyPath"><span>1 Aprende</span><span>2 Observa</span><span>3 Detecta</span><span>4 Practica</span><span>5 Resume</span></div>'+
 '<div class="studyCard learn"><div class="studyLabel">📚 Qué debes comprender</div><p>'+g.learn+'</p></div>'+
 '<div class="studyCard example16"><div class="studyLabel">🧩 Ejemplo trabajado</div><p>'+g.example+'</p></div>'+
 '<div class="studyCard warning"><div class="studyLabel">⚠️ Error frecuente</div><p>'+g.error+'</p><p class="tiny">Pregúntate qué razonamiento produciría ese error y qué representación ayudaría a corregirlo.</p></div>'+
 '<div class="studyCard pedagogy"><div class="studyLabel">👨‍🏫 Mirada pedagógica</div><p>'+g.pedagogy+'</p></div>'+
 PE16.exercise(first)+
 '<div class="studyCard summary16"><div class="studyLabel">🧠 Resumen rápido</div><p>'+PE16.summary(x,g)+'</p><div class="summaryTags"><span>'+x.domain+'</span><span>'+x.sub+'</span></div></div>'+
 '<div class="card"><div class="row"><div><b>Estado de estudio</b><div class="muted">'+(studied?"Marcado como revisado":"Aún pendiente")+'</div></div><button class="btn '+(studied?"ghost":"")+'" onclick="toggleFromStudy(\''+id+'\')">'+(studied?"Marcar pendiente":"Marcar estudiado")+'</button></div></div>'+
 (qs.length?'<h3>Practica este contenido</h3><div class="card"><p>'+qs.length+' pregunta(s) relacionadas disponibles.</p><button class="btn full" onclick="startStudyQuiz(\''+x.sub+'\',\''+x.domain+'\')">Practicar ahora</button></div>':'');
 go("study");
};

openStudy=function(id){return PE16.open(id)};

PE16.inject=function(){
 const home=el("home");
 if(home){
   const pill=home.querySelector(".hero .pill");if(pill)pill.textContent="ProfeECEP 1.6";
   const h1=home.querySelector(".hero h1");if(h1)h1.textContent="Cada indicador ahora se estudia como una microlección.";
   const p=home.querySelector(".hero p");if(p)p.textContent="Explicación, ejemplo, error frecuente, mirada pedagógica, ejercicio guiado y resumen.";
 }
 const map=el("map");
 if(map&&!map.querySelector(".study16note")){
   const n=document.createElement("div");n.className="card study16note";
   n.innerHTML='<span class="pill">Centro de estudio 1.6</span><p>Abre cualquier indicador para estudiar una microlección completa antes de practicar.</p>';
   const h=map.querySelector("h2");if(h)h.after(n);else map.prepend(n);
 }
};

const pe16Render=render;
render=function(){pe16Render();setTimeout(PE16.inject,0)};
setTimeout(PE16.inject,0);
import("./tutor-17.js");
