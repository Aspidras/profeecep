// ProfeECEP 2.1 — Generador inteligente de simulacros
window.PE21={};

PE21.domainOptions=function(){
 return D.filter(d=>Q.some(q=>q.d===d[0])).map(d=>d[0]);
};

PE21.availableQuestions=function(filters){
 let pool=[...Q];
 if(filters.domains&&filters.domains.length) pool=pool.filter(q=>filters.domains.includes(q.d));
 if(filters.difficulty&&filters.difficulty!=="all") pool=pool.filter(q=>(q.diff||"media")===filters.difficulty);
 if(filters.focus==="weak"&&window.PE14){
   const ranked=PE14.rank();
   const ids=new Set(ranked.slice(0,Math.max(10,Math.ceil(ranked.length/2))).map(x=>x.q.id));
   pool=pool.filter(q=>ids.has(q.id));
 }
 if(filters.focus==="errors") pool=pool.filter(q=>S.wrong.includes(q.id));
 return pool;
};

PE21.build=function(filters){
 const pool=PE21.availableQuestions(filters);
 const count=Math.min(filters.count,pool.length);
 if(!count)return[];
 const byDomain={};
 pool.forEach(q=>{if(!byDomain[q.d])byDomain[q.d]=[];byDomain[q.d].push(q)});
 const chosen=[];
 const domains=Object.keys(byDomain);
 if(filters.balance&&domains.length){
   let i=0;
   while(chosen.length<count){
     const d=domains[i%domains.length],arr=byDomain[d].filter(q=>!chosen.some(x=>x.id===q.id));
     if(arr.length)chosen.push(arr[Math.floor(Math.random()*arr.length)]);
     i++;
     if(i>count*domains.length*2)break;
   }
 }
 if(chosen.length<count){
   const rest=shuffle(pool.filter(q=>!chosen.some(x=>x.id===q.id)));
   chosen.push(...rest.slice(0,count-chosen.length));
 }
 return shuffle(chosen).slice(0,count);
};

PE21.start=function(){
 const count=Number(document.getElementById("sim21count")?.value||20);
 const difficulty=document.getElementById("sim21difficulty")?.value||"all";
 const focus=document.getElementById("sim21focus")?.value||"balanced";
 const balance=document.getElementById("sim21balance")?.checked!==false;
 const domains=[...document.querySelectorAll(".sim21domain:checked")].map(x=>x.value);
 if(!domains.length){PE21.message("Selecciona al menos un dominio.");return;}
 const filters={count,difficulty,focus,balance,domains};
 const built=PE21.build(filters);
 if(!built.length){
   PE21.message("No hay preguntas disponibles con estos filtros en esta especialidad.");
   return;
 }
 mode="simulation";
 quiz=built;
 SIM12={
   index:0,answers:{},marked:{},timeSpent:{},enteredAt:Date.now(),
   seconds:Math.max(90,built.length*90),
   startedAt:new Date().toISOString(),
   generatedBy:"2.2",
   filters
 };
 clearInterval(SIM12_TIMER);
 renderSimulation12();
 SIM12_TIMER=setInterval(()=>{
   if(!SIM12)return clearInterval(SIM12_TIMER);
   SIM12.seconds--;
   const t=document.getElementById("sim12time");if(t)t.textContent=formatSim12Time(SIM12.seconds);
   if(SIM12.seconds<=0){clearInterval(SIM12_TIMER);finishSimulation12(true)}
 },1000);
};

PE21.message=function(text){
 const box=document.getElementById("sim21msg");if(box)box.textContent=text;
};

PE21.panel=function(){
 const practice=el("practice");if(!practice||practice.querySelector(".sim21"))return;
 const c=document.createElement("div");c.className="card sim21";
 const hasQuestions=Q.length>0;
 c.innerHTML='<span class="pill">Simulador 2.2</span><h3>Generador inteligente</h3><p class="muted">Configura un simulacro según tu objetivo de práctica.</p>'+ 
 (hasQuestions?'<div class="sim21grid"><label>Cantidad<select id="sim21count">'+[10,15,20,30].map(n=>'<option value="'+n+'">'+n+' preguntas</option>').join("")+'</select></label><label>Dificultad<select id="sim21difficulty"><option value="all">Mixta</option><option value="básica">Básica</option><option value="media">Media</option><option value="alta">Alta</option></select></label><label>Enfoque<select id="sim21focus"><option value="balanced">Equilibrado</option><option value="weak">Debilidades</option><option value="errors">Errores pendientes</option></select></label></div><div class="sim21domains"><b>Dominios</b>'+PE21.domainOptions().map(d=>'<label><input class="sim21domain" type="checkbox" value="'+d+'" checked> '+d+'</label>').join("")+'</div><label class="sim21check"><input id="sim21balance" type="checkbox" checked> Distribuir preguntas entre los dominios seleccionados</label><div id="sim21msg" class="tiny"></div><button class="btn full" onclick="PE21.start()">Generar simulacro</button>':'<div class="card warning"><b>Banco aún no disponible</b><p class="muted">El temario oficial de esta especialidad ya está cargado, pero todavía no existe un banco de preguntas propio. No se reutilizarán preguntas de otra asignatura.</p></div>');
 const old=[...practice.querySelectorAll(".simulator12Card")][0];
 if(old)old.before(c);else practice.prepend(c);
};

PE21.inject=function(){
 const home=el("home");
 if(home){
   const p=home.querySelector(".hero .pill");if(p)p.textContent="ProfeECEP 2.1";
 }
 PE21.panel();
};

const pe21Render=render;
render=function(){pe21Render();setTimeout(PE21.inject,0)};
setTimeout(PE21.inject,0);
