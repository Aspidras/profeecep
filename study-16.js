// ProfeECEP 3.0.1 — estudio y práctica vinculados al indicador exacto
window.PE16={};

PE16.escape=function(s){
 return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
};

PE16.guide=function(x){
 if(!x)return null;
 const pack=window.PE22_CONTENT&&window.PE22_CONTENT[window.PE_ACTIVE_SPECIALTY];
 if(pack){const guide=pack.guides[x.id];return guide&&guide.status!=='draft'?guide:null}
 // Mathematics still has legacy subdomain guides; label their broader scope.
 return G[x.id]||G[x.sub]||null;
};

PE16.related=function(x,limit=5){
 if(!x||!x.id)return[];
 const ids=new Set();
 return Q.filter(q=>{
  if(q.indicatorId!==x.id||ids.has(q.id))return false;
  ids.add(q.id);return true;
 }).sort((a,b)=>Number(a.version==='2.8.1')-Number(b.version==='2.8.1')).slice(0,limit);
};

PE16.practice=function(id){
 const x=flat.find(v=>v.id===id),pool=PE16.related(x,Q.length);
 if(!pool.length)return;
 mode='practice';quiz=shuffle(pool).slice(0,5);pos=0;answers=[];sel=null;showQ();
};

PE16.summary=function(x,g){
 const parts=[];
 if(g&&g.summary)return g.summary;
 if(g&&g.learn)parts.push(g.learn.split(".")[0]+".");
 if(g&&g.error)parts.push("Evita: "+g.error.split(".")[0].toLowerCase()+".");
 return parts.join(" ");
};

PE16.exercise=function(q){
 if(!q)return '<div class="studyCard exercise"><div class="studyLabel">Práctica pendiente</div><p>Aún no hay una pregunta clasificada para este indicador.</p></div>';
 const esc=PE16.escape;
 return '<div class="studyCard exercise"><div class="studyLabel">✍️ Ejercicio del indicador</div><p><b>'+esc(q.q)+'</b></p><details><summary>Ver alternativas y solución</summary><div class="guidedOptions">'+q.o.map((o,i)=>'<div>'+String.fromCharCode(65+i)+'. '+esc(o)+'</div>').join("")+'</div><p><b>Respuesta:</b> '+String.fromCharCode(65+q.a)+'. '+esc(q.o[q.a])+'</p><p class="muted">'+esc(q.e)+'</p></details></div>';
};

PE16.open=function(id){
 const x=flat.find(v=>v.id===id);if(!x)return;
 S.lastStudy=id;saveState();
 const g=PE16.guide(x),esc=PE16.escape;
 const isSubdomain=!!g&&!g.indicatorId;
 const qs=PE16.related(x),first=qs[0];
 const studied=S.done.includes(id);
 el("study").innerHTML=
 '<button class="btn ghost back" onclick="go(\'map\')">← Volver al temario</button>'+
 '<div class="studyHead"><span class="pill">Centro de estudio 3.0.1</span><h2>'+esc(x.t)+'</h2><p class="muted">'+esc(x.domain)+' · '+esc(x.sub)+'</p></div>'+
 (g?(isSubdomain?'<div class="card"><b>Guía del subdominio</b><p class="muted">Esta guía aborda el subdominio completo. El ejercicio y la práctica de abajo corresponden al indicador que elegiste.</p></div>':'')+
 '<div class="studyPath"><span>1 Aprende</span><span>2 Observa</span><span>3 Detecta</span><span>4 Practica</span><span>5 Resume</span></div>'+
 '<div class="studyCard learn"><div class="studyLabel">📚 Qué debes comprender</div><p>'+esc(g.learn)+'</p></div>'+
 '<div class="studyCard example16"><div class="studyLabel">🧩 Ejemplo trabajado</div><p>'+esc(g.example)+'</p></div>'+
 '<div class="studyCard warning"><div class="studyLabel">⚠️ Error frecuente</div><p>'+esc(g.error)+'</p><p class="tiny">Pregúntate qué razonamiento produciría ese error y qué representación ayudaría a corregirlo.</p></div>'+
 '<div class="studyCard pedagogy"><div class="studyLabel">👨‍🏫 Mirada pedagógica</div><p>'+esc(g.pedagogy)+'</p></div>':
 '<div class="studyCard warning"><b>Microlección específica pendiente</b><p>Este indicador aún no tiene una explicación desarrollada. Puedes trabajar las preguntas clasificadas a continuación; no se mostrará una guía de otro indicador.</p></div>')+
 PE16.exercise(first)+
 (g?'<div class="studyCard summary16"><div class="studyLabel">🧠 Resumen rápido</div><p>'+esc(PE16.summary(x,g))+'</p><div class="summaryTags"><span>'+esc(x.domain)+'</span><span>'+esc(x.sub)+'</span></div></div>':'')+
 '<div class="card"><div class="row"><div><b>Estado de estudio</b><div class="muted">'+(studied?"Marcado como revisado":"Aún pendiente")+'</div></div><button class="btn '+(studied?"ghost":"")+'" onclick="toggleFromStudy(\''+id+'\')">'+(studied?"Marcar pendiente":"Marcar estudiado")+'</button></div></div>'+
 (qs.length?'<h3>Practica este indicador</h3><div class="card"><p>'+qs.length+' pregunta(s) del indicador en esta sesión.</p><button class="btn full" onclick="PE16.practice(\''+id+'\')">Practicar este indicador</button></div>':'');
 go("study");
};

openStudy=function(id){return PE16.open(id)};

PE16.inject=function(){
 const home=el("home");
 if(home){
   const pill=home.querySelector(".hero .pill");if(pill)pill.textContent="ProfeECEP 1.6";
   const h1=home.querySelector(".hero h1");if(h1)h1.textContent="Estudia y practica por indicador.";
   const p=home.querySelector(".hero p");if(p)p.textContent="Guías disponibles, ejercicios del indicador y contenidos pendientes identificados.";
 }
 const map=el("map");
 if(map&&!map.querySelector(".study16note")){
   const n=document.createElement("div");n.className="card study16note";
   n.innerHTML='<span class="pill">Centro de estudio 3.0.1</span><p>Abre un indicador para consultar su guía disponible y practicar preguntas de ese indicador. Las microlecciones aún no desarrolladas se identifican como pendientes.</p>';
   const h=map.querySelector("h2");if(h)h.after(n);else map.prepend(n);
 }
};

const pe16Render=render;
render=function(){pe16Render();setTimeout(PE16.inject,0)};
setTimeout(PE16.inject,0);
