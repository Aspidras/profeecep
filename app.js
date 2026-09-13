const D=window.ECEP_DATA||[],Q=window.QBANK||[],K="profeecep";
let S;try{S=JSON.parse(localStorage.getItem(K)||"{}")}catch(e){S={}}
S=Object.assign({done:[],right:0,total:0,byDomain:{},wrong:[],diagnosis:null},S);
S.done=Array.isArray(S.done)?S.done:[];S.byDomain=S.byDomain||{};S.wrong=Array.isArray(S.wrong)?S.wrong:[];
let quiz=[],pos=0,sel=null,answers=[],mode="practice";
const flat=[];
D.forEach((d,di)=>d[1].forEach((s,si)=>s[1].forEach((t,ii)=>flat.push({id:di+"-"+si+"-"+ii,t,di,si}))));
const el=id=>document.getElementById(id);
const pct=(a,b)=>b?Math.round(a/b*100):0;
const domainStats=name=>S.byDomain[name]||{right:0,total:0};
function saveState(){localStorage.setItem(K,JSON.stringify(S))}
function go(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("on"));const t=el(id);if(t)t.classList.add("on");window.scrollTo(0,0)}
function priorityDomains(){
 if(!S.diagnosis||!S.diagnosis.byDomain)return[];
 return Object.entries(S.diagnosis.byDomain).map(([name,v])=>({name,p:pct(v.right,v.total)})).sort((a,b)=>a.p-b.p);
}
function render(){
 const homeEl=el("home"),mapEl=el("map"),practiceEl=el("practice"),progressEl=el("progress");
 if(!homeEl||!mapEl||!practiceEl||!progressEl)return;
 const studyPct=pct(S.done.length,flat.length), priorities=priorityDomains();
 const diagCard=S.diagnosis
  ? '<div class="card"><div class="row"><div><span class="pill">Diagnóstico completado</span><h3>Tu prioridad actual</h3><div class="muted">'+(priorities[0]?priorities[0].name:"—")+'</div></div><button class="btn ghost" onclick="showDiagnosisResult()">Ver resultado</button></div></div>'
  : '<div class="card emphasis"><span class="pill">Nuevo en 0.3</span><h3>Haz tu diagnóstico inicial</h3><p>10 preguntas equilibradas entre los cinco dominios para detectar tus primeras prioridades de estudio.</p><button class="btn full" onclick="startDiagnosis()">Comenzar diagnóstico</button></div>';
 homeEl.innerHTML='<div class="hero"><span class="pill">ProfeECEP 0.3</span><h1>Ahora ProfeECEP te dice por dónde empezar.</h1><p>Diagnóstico inicial, práctica y recomendaciones según tu desempeño.</p></div>'+diagCard+
 '<div class="grid2"><div class="card"><span class="muted">Temario estudiado</span><strong class="big">'+studyPct+'%</strong><div class="bar"><i style="width:'+studyPct+'%"></i></div></div><div class="card"><span class="muted">Precisión práctica</span><strong class="big">'+pct(S.right,S.total)+'%</strong><div class="bar"><i style="width:'+pct(S.right,S.total)+'%"></i></div></div></div>'+
 (priorities.length?'<h3>Recomendación de estudio</h3>'+priorities.slice(0,3).map((x,i)=>'<div class="card priority"><div class="row"><div><span class="rank">'+(i+1)+'</span><b>'+x.name+'</b></div><b>'+x.p+'%</b></div><p class="muted">'+(i===0?"Comienza por este dominio.":"Refuérzalo después de tu primera prioridad.")+'</p><button class="btn ghost" onclick="startQuiz(\''+x.name+'\',5)">Practicar ahora</button></div>').join(""):"")+
 '<div class="card"><div class="row"><div><b>Práctica rápida</b><div class="muted">5 preguntas mezcladas</div></div><button class="btn" onclick="startQuiz(\'all\',5)">Comenzar</button></div></div>';

 mapEl.innerHTML='<h2>Mapa ECEP 2026</h2><p class="muted">Marca lo estudiado y practica por dominio.</p>'+D.map((d,di)=>'<div class="domain"><div class="row"><h3>'+d[0]+'</h3><button class="btn ghost" onclick="startQuiz(\''+d[0]+'\',5)">Practicar</button></div>'+d[1].map((s,si)=>'<div class="sub"><b>'+s[0]+'</b>'+s[1].map((t,ii)=>{let id=di+"-"+si+"-"+ii;return '<div class="indicator row"><span>'+t+'</span><button class="mini '+(S.done.includes(id)?"done":"")+'" onclick="toggle(\''+id+'\')">'+(S.done.includes(id)?"✓":"○")+'</button></div>'}).join("")+'</div>').join("")+'</div>').join("");

 progressEl.innerHTML='<h2>Mi progreso</h2><div class="grid2"><div class="card"><span class="muted">Indicadores</span><strong class="big">'+S.done.length+'/'+flat.length+'</strong></div><div class="card"><span class="muted">Preguntas</span><strong class="big">'+S.right+'/'+S.total+'</strong></div></div>'+
 (S.diagnosis?'<div class="card"><div class="row"><div><b>Diagnóstico inicial</b><div class="muted">'+S.diagnosis.right+' de '+S.diagnosis.total+' correctas</div></div><button class="btn ghost" onclick="showDiagnosisResult()">Ver</button></div></div>':'')+
 '<h3>Rendimiento por dominio</h3>'+D.map(d=>{let st=domainStats(d[0]);return '<div class="card"><div class="row"><b>'+d[0]+'</b><b>'+pct(st.right,st.total)+'%</b></div><div class="bar"><i style="width:'+pct(st.right,st.total)+'%"></i></div><div class="tiny">'+st.total+' respuestas registradas</div></div>'}).join("")+
 (S.wrong.length?'<h3>Para revisar</h3>'+S.wrong.slice(-5).reverse().map(id=>{let x=Q.find(q=>q.id===id);return x?'<div class="card bad"><b>'+x.i+'</b><p>'+x.q+'</p></div>':""}).join(""):'<div class="card"><p class="muted">Aún no hay errores guardados.</p></div>');

 practiceEl.innerHTML='<h2>Practicar</h2><p class="muted">Elige cómo entrenar.</p><div class="card"><h3>Sesión rápida</h3><p>5 preguntas mezcladas de distintos dominios.</p><button class="btn" onclick="startQuiz(\'all\',5)">Comenzar</button></div><h3>Por dominio</h3>'+D.map(d=>'<div class="card"><div class="row"><div><b>'+d[0]+'</b><div class="muted">'+Q.filter(q=>q.d===d[0]).length+' preguntas disponibles</div></div><button class="btn ghost" onclick="startQuiz(\''+d[0]+'\',5)">Practicar</button></div></div>').join("");
}
function toggle(id){S.done=S.done.includes(id)?S.done.filter(x=>x!==id):S.done.concat(id);saveState();render();go("map")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function diagnosticPool(){
 const out=[];D.forEach(d=>{const qs=Q.filter(q=>q.d===d[0]);out.push(...qs.slice(0,2))});return out;
}
function startDiagnosis(){mode="diagnosis";quiz=diagnosticPool();pos=0;answers=[];showQ()}
function startQuiz(domain="all",count=5){mode="practice";const pool=domain==="all"?Q:Q.filter(q=>q.d===domain);quiz=shuffle(pool).slice(0,Math.min(count,pool.length));pos=0;answers=[];showQ()}
function showQ(){
 if(pos>=quiz.length)return mode==="diagnosis"?finishDiagnosis():finishPractice();
 sel=null;const x=quiz[pos],target=mode==="diagnosis"?el("diagnosis"):el("practice");
 target.innerHTML='<div class="row"><span class="pill">'+(mode==="diagnosis"?"Diagnóstico · ":"")+x.d+'</span><b>'+(pos+1)+' / '+quiz.length+'</b></div><div class="bar stepbar"><i style="width:'+Math.round(pos/quiz.length*100)+'%"></i></div><div class="card"><div class="muted">'+x.i+'</div><h2>'+x.q+'</h2>'+x.o.map((o,i)=>'<button class="opt" onclick="pick('+i+',this)">'+String.fromCharCode(65+i)+'. '+o+'</button>').join("")+'<button class="btn full" onclick="checkAnswer()">Responder</button></div>';
 go(mode==="diagnosis"?"diagnosis":"practice");
}
function pick(i,b){sel=i;document.querySelectorAll(".opt").forEach(x=>x.classList.remove("sel"));b.classList.add("sel")}
function checkAnswer(){
 if(sel===null)return;
 const x=quiz[pos],ok=sel===x.a;answers.push({id:x.id,d:x.d,ok});
 if(mode==="practice"){S.total++;if(ok)S.right++;if(!S.byDomain[x.d])S.byDomain[x.d]={right:0,total:0};S.byDomain[x.d].total++;if(ok)S.byDomain[x.d].right++;if(!ok&&!S.wrong.includes(x.id))S.wrong.push(x.id);if(ok)S.wrong=S.wrong.filter(id=>id!==x.id);saveState()}
 const target=mode==="diagnosis"?el("diagnosis"):el("practice");
 target.innerHTML='<div class="card '+(ok?"good":"bad")+'"><span class="pill">'+(ok?"Correcta":"Revisar")+'</span><h2>'+(ok?"¡Bien!":"No era esa")+'</h2><p>'+x.e+'</p><div class="answerKey">Respuesta correcta: <b>'+String.fromCharCode(65+x.a)+'. '+x.o[x.a]+'</b></div></div><button class="btn full" onclick="nextQ()">Siguiente</button>';
}
function nextQ(){pos++;showQ()}
function finishPractice(){
 const r=answers.filter(a=>a.ok).length,p=pct(r,answers.length);
 el("practice").innerHTML='<h2>Sesión terminada</h2><div class="card"><span class="muted">Resultado</span><strong class="score">'+r+' / '+answers.length+'</strong><div class="bar"><i style="width:'+p+'%"></i></div><p>'+p+'% de respuestas correctas</p></div><h3>Revisión</h3>'+answers.map(a=>{let x=Q.find(q=>q.id===a.id);return '<div class="card '+(a.ok?"good":"bad")+'"><b>'+(a.ok?"✓ Correcta":"✕ Revisar")+'</b><p>'+x.q+'</p><div class="muted">'+x.i+'</div></div>'}).join("")+'<button class="btn full" onclick="render();go(\'practice\')">Volver a practicar</button>';saveState();
}
function finishDiagnosis(){
 const byDomain={};answers.forEach(a=>{if(!byDomain[a.d])byDomain[a.d]={right:0,total:0};byDomain[a.d].total++;if(a.ok)byDomain[a.d].right++});
 S.diagnosis={date:new Date().toISOString(),right:answers.filter(a=>a.ok).length,total:answers.length,byDomain};saveState();render();showDiagnosisResult();
}
function showDiagnosisResult(){
 if(!S.diagnosis){startDiagnosis();return}
 const sorted=priorityDomains(),p=pct(S.diagnosis.right,S.diagnosis.total);
 el("diagnosis").innerHTML='<span class="pill">Diagnóstico 0.3</span><h2>Tu punto de partida</h2><div class="card"><span class="muted">Resultado general</span><strong class="score">'+S.diagnosis.right+' / '+S.diagnosis.total+'</strong><div class="bar"><i style="width:'+p+'%"></i></div><p>'+p+'% de respuestas correctas</p></div><h3>Prioridad recomendada</h3>'+sorted.map((x,i)=>'<div class="card '+(i===0?"priority":"")+'"><div class="row"><div><span class="rank">'+(i+1)+'</span><b>'+x.name+'</b></div><b>'+x.p+'%</b></div><div class="bar"><i style="width:'+x.p+'%"></i></div>'+(i===0?'<p class="muted">Te recomendamos comenzar aquí.</p><button class="btn full" onclick="startQuiz(\''+x.name+'\',5)">Practicar este dominio</button>':"")+'</div>').join("")+'<button class="btn ghost full" onclick="startDiagnosis()">Repetir diagnóstico</button>';go("diagnosis");
}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>{render();go(b.dataset.go)}));
render();go("home");