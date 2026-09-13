// ProfeECEP 2.0 — Arquitectura multiespecialidad
window.PE20={};

PE20.registry=[
 {id:"basica-matematica",name:"Educación Básica Matemática",short:"Matemática",status:"active",year:"2026"},
 {id:"basica-ciencias",name:"Educación Básica Ciencias Naturales",short:"Ciencias Naturales",status:"active",year:"2026"},
 {id:"basica-historia",name:"Educación Básica Historia, Geografía y Ciencias Sociales",short:"Historia y Geografía",status:"active",year:"2026"},
 {id:"basica-ingles",name:"Educación Básica Inglés",short:"Inglés",status:"active",year:"2026"},
 {id:"basica-lenguaje",name:"Educación Básica Lenguaje y Comunicación",short:"Lenguaje",status:"active",year:"2026"},
 {id:"media-lengua",name:"Educación Media Lengua y Literatura",short:"Lengua y Literatura",status:"active",year:"2026"}
];

PE20.package={
 id:"basica-matematica",
 name:"Educación Básica Matemática",
 year:"2026",
 domains:window.ECEP_DATA,
 questions:window.QBANK,
 guides:window.STUDY_GUIDES
};

PE20.activeId=function(){
 return (S&&S.specialtyId)||localStorage.getItem("pe_specialty_id")||"basica-matematica";
};

PE20.active=function(){
 return PE20.registry.find(x=>x.id===PE20.activeId())||PE20.registry[0];
};

PE20.persist=function(id){
 S.specialtyId=id;
 localStorage.setItem("pe_specialty_id",id);
 saveState();
};

PE20.available=function(id){
 const x=PE20.registry.find(s=>s.id===id);
 return !!x&&x.status==="active";
};

PE20.switch=function(id){
 const s=PE20.registry.find(x=>x.id===id);if(!s)return;
 if(s.status!=="active"){
   PE20.notice("Esta especialidad aún no tiene temario ni banco cargados. La arquitectura ya está preparada, pero no voy a mostrar contenido inventado.");
   return;
 }
 PE20.persist(id);
 PE20.close();
 window.location.reload();
};

PE20.notice=function(text){
 const box=document.getElementById("pe20notice");if(box)box.textContent=text;
};

PE20.open=function(){
 PE20.close();
 const active=PE20.active();
 const o=document.createElement("div");o.className="specialtyOverlay";
 o.innerHTML='<div class="specialtyModal"><button class="close" onclick="PE20.close()">×</button><span class="pill">ProfeECEP 2.0</span><h2>Selecciona tu especialidad</h2><p class="muted">Cada especialidad tendrá su propio temario, banco, diagnóstico, analítica y plan de estudio.</p><div class="specialtyList">'+PE20.registry.map(s=>'<button class="specialtyOption '+(s.id===active.id?"selected":"")+' '+(s.status!=="active"?"disabled":"")+'" onclick="PE20.switch(\''+s.id+'\')"><div><b>'+s.name+'</b><span>'+(s.status==="active"?"Disponible · "+s.year:"Próximamente")+'</span></div><strong>'+(s.id===active.id?"✓":s.status==="active"?"Abrir":"—")+'</strong></button>').join("")+'</div><div id="pe20notice" class="specialtyNotice"></div></div>';
 document.body.appendChild(o);
};

PE20.close=function(){document.querySelector(".specialtyOverlay")?.remove()};

PE20.header=function(){
 const h=document.querySelector("header");if(!h)return;
 const active=PE20.active();
 const sub=h.querySelector("small");if(sub)sub.textContent=active.short+" · ECEP "+(active.year||"2026");
 let b=h.querySelector(".specialtyBtn");
 if(!b){
   b=document.createElement("button");b.className="specialtyBtn";b.onclick=PE20.open;
   const account=h.querySelector(".accountBtn");if(account)h.insertBefore(b,account);else h.appendChild(b);
 }
 b.innerHTML='<span>'+active.short+'</span><small>Cambiar especialidad</small>';
};

PE20.home=function(){
 const home=el("home");if(!home)return;
 const hero=home.querySelector(".hero");if(hero){
   const pill=hero.querySelector(".pill");if(pill)pill.textContent="ProfeECEP 2.0";
   const h1=hero.querySelector("h1");if(h1)h1.textContent="Una sola plataforma, preparada para múltiples ECEP.";
   const p=hero.querySelector("p");if(p)p.textContent="Tu progreso, diagnóstico y plan quedan asociados a la especialidad seleccionada.";
 }
 if(!home.querySelector(".specialty20home")){
   const a=PE20.active(),c=document.createElement("div");c.className="card specialty20home";
   c.innerHTML='<span class="pill">Especialidad activa</span><h3>'+a.name+'</h3><p class="muted">Temario 2026 · '+Q.length+' preguntas disponibles · '+D.length+' dominios</p><button class="btn ghost full" onclick="PE20.open()">Cambiar especialidad</button>';
   if(hero)hero.after(c);else home.prepend(c);
 }
};

PE20.architecture=function(){
 const progress=el("progress");if(!progress||progress.querySelector(".specialty20arch"))return;
 const c=document.createElement("div");c.className="card specialty20arch";
 c.innerHTML='<span class="pill">Arquitectura 2.0</span><h3>Paquete de especialidad</h3><p class="muted">Cada futura ECEP podrá cargar de forma independiente:</p><div class="specialtyModules"><span>Temario</span><span>Banco</span><span>Guías</span><span>Diagnóstico</span><span>Simulador</span><span>Analítica</span><span>Plan</span><span>Tutor</span></div><p class="tiny">Los temarios oficiales 2026 cargados se muestran según la especialidad seleccionada; los bancos y materiales de estudio se incorporan por separado.</p>';
 progress.prepend(c);
};

PE20.inject=function(){
 PE20.header();PE20.home();PE20.architecture();
};

const pe20Render=render;
render=function(){pe20Render();setTimeout(PE20.inject,0)};
setTimeout(PE20.inject,0);
import("./simulator-21.js");
