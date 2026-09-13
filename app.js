const D=window.ECEP_DATA||[],Q=window.QBANK||[],G=window.STUDY_GUIDES||{},K="profeecep";
let S=window.PE_PROGRESS.load();
S=Object.assign({done:[],right:0,total:0,byDomain:{},wrong:[],diagnosis:null,lastStudy:null,history:[],simulations:[],plan:{examDate:"2026-12-18",minutes:20,daysPerWeek:5}},S);
S.done=Array.isArray(S.done)?S.done:[];S.byDomain=S.byDomain||{};S.wrong=Array.isArray(S.wrong)?S.wrong:[];S.history=Array.isArray(S.history)?S.history:[];S.simulations=Array.isArray(S.simulations)?S.simulations:[];S.plan=Object.assign({examDate:"2026-12-18",minutes:20,daysPerWeek:5},S.plan||{});
let quiz=[],pos=0,sel=null,answers=[],mode="practice";
window.PE22_RUNTIME=()=>({quiz,pos,mode});
const flat=[];
D.forEach((d,di)=>d[1].forEach((s,si)=>s[1].forEach((t,ii)=>flat.push({id:di+"-"+si+"-"+ii,t,di,si,domain:d[0],sub:s[0]}))));
const el=id=>document.getElementById(id);
const pct=(a,b)=>b?Math.round(a/b*100):0;
const domainStats=name=>S.byDomain[name]||{right:0,total:0};
function saveState(){window.PE_PROGRESS.save(S)}
function go(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("on"));const t=el(id);if(t)t.classList.add("on");window.scrollTo(0,0)}
function priorityDomains(){if(!S.diagnosis||!S.diagnosis.byDomain)return[];return Object.entries(S.diagnosis.byDomain).map(([name,v])=>({name,p:pct(v.right,v.total)})).sort((a,b)=>a.p-b.p)}
function recentStats(){const h=S.history.slice(-10),r=h.filter(x=>x.ok).length;return{n:h.length,r,p:pct(r,h.length)}}
function streak(){const days=[...new Set(S.history.map(x=>x.date))].sort().reverse();if(!days.length)return 0;let n=1,cur=new Date(days[0]+"T12:00:00");for(let i=1;i<days.length;i++){let prev=new Date(days[i]+"T12:00:00"),diff=Math.round((cur-prev)/86400000);if(diff===1){n++;cur=prev}else break}return n}
function insight(){const rows=D.map(d=>{let s=domainStats(d[0]);return{name:d[0],p:pct(s.right,s.total),n:s.total}}).filter(x=>x.n);if(!rows.length)return null;let strong=[...rows].sort((a,b)=>b.p-a.p)[0],weak=[...rows].sort((a,b)=>a.p-b.p)[0];return{strong,weak}}
function render(){
 const homeEl=el("home"),mapEl=el("map"),practiceEl=el("practice"),progressEl=el("progress"),simulationEl=el("simulation");
 if(!homeEl||!mapEl||!practiceEl||!progressEl||!simulationEl)return;
 const studyPct=pct(S.done.length,flat.length),priorities=priorityDomains();
 const diagCard=S.diagnosis?'<div class="card"><div class="row"><div><span class="pill">Diagnóstico completado</span><h3>Tu prioridad actual</h3><div class="muted">'+(priorities[0]?priorities[0].name:"—")+'</div></div><button class="btn ghost" onclick="showDiagnosisResult()">Ver resultado</button></div></div>':'<div class="card emphasis"><span class="pill">Diagnóstico</span><h3>Descubre por dónde empezar</h3><p>10 preguntas equilibradas entre los cinco dominios.</p><button class="btn full" onclick="startDiagnosis()">Comenzar diagnóstico</button></div>';
 const continueStudy=S.lastStudy?'<div class="card emphasis"><span class="pill">Centro de estudio</span><h3>Continuar estudiando</h3><p>'+((flat.find(x=>x.id===S.lastStudy)||{}).t||"")+'</p><button class="btn full" onclick="openStudy(\''+S.lastStudy+'\')">Continuar</button></div>':'';
 homeEl.innerHTML='<div class="hero"><span class="pill">ProfeECEP 1.2</span><h1>Ahora puedes entrenar en un simulador completo.</h1><p>Simulador de 30 preguntas con tiempo, navegación, marcado para revisión y análisis final.</p></div>'+diagCard+continueStudy+'<div class="grid2"><div class="card"><span class="muted">Temario estudiado</span><strong class="big">'+studyPct+'%</strong><div class="bar"><i style="width:'+studyPct+'%"></i></div></div><div class="card"><span class="muted">Precisión práctica</span><strong class="big">'+pct(S.right,S.total)+'%</strong><div class="bar"><i style="width:'+pct(S.right,S.total)+'%"></i></div></div></div>'+(priorities.length?'<h3>Recomendación de estudio</h3>'+priorities.slice(0,3).map((x,i)=>'<div class="card priority"><div class="row"><div><span class="rank">'+(i+1)+'</span><b>'+x.name+'</b></div><b>'+x.p+'%</b></div><p class="muted">'+(i===0?"Comienza por este dominio.":"Refuérzalo después.")+'</p></div>').join(""):"");

 mapEl.innerHTML='<h2>Mapa ECEP 2026</h2><p class="muted">Abre un indicador para estudiarlo o márcalo como revisado.</p>'+D.map((d,di)=>'<div class="domain"><div class="row"><h3>'+d[0]+'</h3><button class="btn ghost" onclick="startQuiz(\''+d[0]+'\',5)">Practicar</button></div>'+d[1].map((s,si)=>'<div class="sub"><b>'+s[0]+'</b>'+s[1].map((t,ii)=>{let id=di+"-"+si+"-"+ii;return '<div class="indicator"><div class="indicatorText" onclick="openStudy(\''+id+'\')"><span class="studyIcon">📚</span><span>'+t+'</span></div><div class="indicatorActions"><button class="mini ghost2" onclick="openStudy(\''+id+'\')">Estudiar</button><button class="mini '+(S.done.includes(id)?"done":"")+'" onclick="toggle(\''+id+'\')">'+(S.done.includes(id)?"✓":"○")+'</button></div></div>'}).join("")+'</div>').join("")+'</div>').join("");

 progressEl.innerHTML='<h2>Mi progreso</h2><div class="grid2"><div class="card"><span class="muted">Indicadores</span><strong class="big">'+S.done.length+'/'+flat.length+'</strong></div><div class="card"><span class="muted">Preguntas</span><strong class="big">'+S.right+'/'+S.total+'</strong></div></div>'+(S.simulations.length?(()=>{const sim=S.simulations[S.simulations.length-1];return '<div class="card emphasis"><span class="pill">Último simulacro</span><div class="row"><div><b>'+sim.right+' / '+sim.total+' correctas</b><div class="muted">'+new Date(sim.date).toLocaleDateString("es-CL")+'</div></div><strong>'+pct(sim.right,sim.total)+'%</strong></div></div>'})():'')+(S.diagnosis?'<div class="card"><div class="row"><div><b>Diagnóstico inicial</b><div class="muted">'+S.diagnosis.right+' de '+S.diagnosis.total+' correctas</div></div><button class="btn ghost" onclick="showDiagnosisResult()">Ver</button></div></div>':'')+(()=>{const rs=recentStats(),ins=insight();return '<h3>Resumen de aprendizaje</h3><div class="grid2"><div class="card"><span class="muted">Precisión reciente</span><strong class="big">'+rs.p+'%</strong><div class="tiny">Últimas '+rs.n+' respuestas</div></div><div class="card"><span class="muted">Racha de estudio</span><strong class="big">'+streak()+' día(s)</strong><div class="tiny">Según actividad registrada</div></div></div>'+(ins?'<div class="card insight"><span class="pill">Lectura de progreso</span><p><b>Fortaleza:</b> '+ins.strong.name+' ('+ins.strong.p+'%).</p><p><b>Prioridad:</b> '+ins.weak.name+' ('+ins.weak.p+'%).</p><button class="btn full" onclick="startQuiz(\''+ins.weak.name+'\',5)">Reforzar prioridad</button></div>':'<div class="card"><p class="muted">Responde preguntas para activar tus estadísticas de aprendizaje.</p></div>')+'<h3>Rendimiento por dominio</h3>'+D.map(d=>{let st=domainStats(d[0]);return '<div class="card"><div class="row"><b>'+d[0]+'</b><b>'+pct(st.right,st.total)+'%</b></div><div class="bar"><i style="width:'+pct(st.right,st.total)+'%"></i></div><div class="tiny">'+st.total+' respuestas registradas</div></div>'}).join("")})()+(S.wrong.length?'<h3>Para revisar</h3>'+S.wrong.slice(-5).reverse().map(id=>{let x=Q.find(q=>q.id===id);return x?'<div class="card bad"><b>'+x.i+'</b><p>'+x.q+'</p></div>':""}).join(""):'<div class="card"><p class="muted">Aún no hay errores guardados.</p></div>');

 practiceEl.innerHTML='<h2>Practicar</h2><p class="muted">Elige cómo entrenar.</p><div class="card adaptive08"><span class="pill">Nuevo 0.8</span><h3>Entrenamiento adaptativo</h3><p>Prioriza errores recientes y dominios con menor rendimiento.</p><button class="btn full" onclick="startAdaptive()">Comenzar entrenamiento recomendado</button></div><div class="grid2"><div class="card"><h3>Sesión rápida</h3><p>5 preguntas mezcladas.</p><button class="btn full" onclick="startQuiz(\'all\',5)">Comenzar</button></div><div class="card emphasis"><span class="pill">Nuevo 0.6</span><h3>Simulacro breve</h3><p>20 preguntas, sin corrección inmediata y con análisis final.</p><button class="btn full" onclick="startSimulation()">Iniciar simulacro</button></div></div><h3>Por dominio</h3>'+D.map(d=>'<div class="card"><div class="row"><div><b>'+d[0]+'</b><div class="muted">'+Q.filter(q=>q.d===d[0]).length+' preguntas disponibles</div></div><button class="btn ghost" onclick="startQuiz(\''+d[0]+'\',5)">Practicar</button></div></div>').join("");
}
function openStudy(id){
 const x=flat.find(v=>v.id===id);if(!x)return;
 S.lastStudy=id;saveState();
 const guide=G[x.sub]||{learn:"Este indicador forma parte del temario oficial. Su desarrollo detallado se ampliará en próximas versiones.",example:"Revisa una situación que exija aplicar el indicador en contexto.",error:"Identifica procedimientos que parecen correctos pero no respetan el significado matemático.",pedagogy:"Relaciona el contenido con representaciones y decisiones de enseñanza."};
 const qs=Q.filter(q=>q.i===x.sub||q.d===x.domain).slice(0,3);
 el("study").innerHTML='<button class="btn ghost back" onclick="go(\'map\')">← Volver al temario</button><div class="studyHead"><span class="pill">Indicador oficial 2026</span><h2>'+x.t+'</h2><p class="muted">'+x.domain+' · '+x.sub+'</p></div><div class="studyCard learn"><div class="studyLabel">📚 Aprende</div><p>'+guide.learn+'</p></div><div class="studyCard"><div class="studyLabel">🧩 Ejemplo</div><p>'+guide.example+'</p></div><div class="studyCard warning"><div class="studyLabel">⚠️ Error frecuente</div><p>'+guide.error+'</p></div><div class="studyCard pedagogy"><div class="studyLabel">👨‍🏫 Mirada pedagógica</div><p>'+guide.pedagogy+'</p></div><div class="card"><div class="row"><div><b>Estado de estudio</b><div class="muted">'+(S.done.includes(id)?"Marcado como revisado":"Aún pendiente")+'</div></div><button class="btn '+(S.done.includes(id)?"ghost":"")+'" onclick="toggleFromStudy(\''+id+'\')">'+(S.done.includes(id)?"Marcar pendiente":"Marcar estudiado")+'</button></div></div>'+(qs.length?'<h3>Practica este contenido</h3><div class="card"><p>'+qs.length+' pregunta(s) relacionadas disponibles.</p><button class="btn full" onclick="startStudyQuiz(\''+x.sub+'\',\''+x.domain+'\')">Practicar ahora</button></div>':'');
 go("study");
}
function toggle(id){S.done=S.done.includes(id)?S.done.filter(x=>x!==id):S.done.concat(id);saveState();render();go("map")}
function toggleFromStudy(id){S.done=S.done.includes(id)?S.done.filter(x=>x!==id):S.done.concat(id);saveState();render();openStudy(id)}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function diagnosticPool(){const out=[];D.forEach(d=>{const qs=Q.filter(q=>q.d===d[0]);out.push(...qs.slice(0,2))});return out}
function startDiagnosis(){mode="diagnosis";quiz=diagnosticPool();pos=0;answers=[];showQ()}
function startQuiz(domain="all",count=5){mode="practice";const pool=domain==="all"?Q:Q.filter(q=>q.d===domain);quiz=shuffle(pool).slice(0,Math.min(count,pool.length));pos=0;answers=[];showQ()}
function startStudyQuiz(sub,domain){mode="practice";let pool=Q.filter(q=>q.i===sub);if(!pool.length)pool=Q.filter(q=>q.d===domain);quiz=shuffle(pool).slice(0,Math.min(5,pool.length));pos=0;answers=[];showQ()}
function startSimulation(){mode="simulation";const byDomain=[];D.forEach(d=>{byDomain.push(...shuffle(Q.filter(q=>q.d===d[0])).slice(0,4))});quiz=shuffle(byDomain).slice(0,20);pos=0;answers=[];sel=null;showQ()}
function showQ(){if(pos>=quiz.length)return mode==="diagnosis"?finishDiagnosis():(mode==="simulation"?finishSimulation():finishPractice());sel=null;const x=quiz[pos],target=mode==="diagnosis"?el("diagnosis"):(mode==="simulation"?el("simulation"):el("practice"));target.innerHTML='<div class="row"><span class="pill">'+(mode==="diagnosis"?"Diagnóstico · ":"")+x.d+'</span><b>'+(pos+1)+' / '+quiz.length+'</b></div><div class="bar stepbar"><i style="width:'+Math.round(pos/quiz.length*100)+'%"></i></div><div class="card"><div class="muted">'+x.i+'</div><h2>'+x.q+'</h2>'+x.o.map((o,i)=>'<button class="opt" onclick="pick('+i+',this)">'+String.fromCharCode(65+i)+'. '+o+'</button>').join("")+'<button class="btn full" onclick="checkAnswer()">Responder</button></div>';go(mode==="diagnosis"?"diagnosis":(mode==="simulation"?"simulation":"practice"))}
function pick(i,b){sel=i;document.querySelectorAll(".opt").forEach(x=>x.classList.remove("sel"));b.classList.add("sel")}
function checkAnswer(){if(sel===null)return;const x=quiz[pos],ok=sel===x.a;answers.push({id:x.id,d:x.d,ok,selected:sel});if(mode==="simulation"){pos++;showQ();return}if(mode==="practice"){S.total++;if(ok)S.right++;S.history.push({date:new Date().toISOString().slice(0,10),domain:x.d,id:x.id,ok});if(S.history.length>300)S.history=S.history.slice(-300);if(!S.byDomain[x.d])S.byDomain[x.d]={right:0,total:0};S.byDomain[x.d].total++;if(ok)S.byDomain[x.d].right++;if(!ok&&!S.wrong.includes(x.id))S.wrong.push(x.id);if(ok)S.wrong=S.wrong.filter(id=>id!==x.id);saveState()}const target=mode==="diagnosis"?el("diagnosis"):el("practice");target.innerHTML='<div class="card '+(ok?"good":"bad")+'"><span class="pill">'+(ok?"Correcta":"Revisar")+'</span><h2>'+(ok?"¡Bien!":"No era esa")+'</h2><p>'+x.e+'</p><div class="answerKey">Respuesta correcta: <b>'+String.fromCharCode(65+x.a)+'. '+x.o[x.a]+'</b></div></div><button class="btn full" onclick="nextQ()">Siguiente</button>'}
function nextQ(){pos++;showQ()}
function finishPractice(){const r=answers.filter(a=>a.ok).length,p=pct(r,answers.length);el("practice").innerHTML='<h2>Sesión terminada</h2><div class="card"><span class="muted">Resultado</span><strong class="score">'+r+' / '+answers.length+'</strong><div class="bar"><i style="width:'+p+'%"></i></div><p>'+p+'% de respuestas correctas</p></div><h3>Revisión</h3>'+answers.map(a=>{let x=Q.find(q=>q.id===a.id);return '<div class="card '+(a.ok?"good":"bad")+'"><b>'+(a.ok?"✓ Correcta":"✕ Revisar")+'</b><p>'+x.q+'</p><div class="muted">'+x.i+'</div></div>'}).join("")+'<button class="btn full" onclick="render();go(\'practice\')">Volver a practicar</button>';saveState()}
function finishSimulation(){const r=answers.filter(a=>a.ok).length,p=pct(r,answers.length),by={};answers.forEach(a=>{if(!by[a.d])by[a.d]={right:0,total:0};by[a.d].total++;if(a.ok)by[a.d].right++});S.simulations.push({date:new Date().toISOString(),right:r,total:answers.length,byDomain:by});if(S.simulations.length>20)S.simulations=S.simulations.slice(-20);saveState();el("simulation").innerHTML='<span class="pill">Simulacro breve 0.6</span><h2>Resultado del simulacro</h2><div class="card"><span class="muted">Puntaje</span><strong class="score">'+r+' / '+answers.length+'</strong><div class="bar"><i style="width:'+p+'%"></i></div><p>'+p+'% de respuestas correctas</p></div><h3>Rendimiento por dominio</h3>'+Object.entries(by).map(([name,v])=>'<div class="card"><div class="row"><b>'+name+'</b><b>'+pct(v.right,v.total)+'%</b></div><div class="bar"><i style="width:'+pct(v.right,v.total)+'%"></i></div><div class="tiny">'+v.right+' de '+v.total+' correctas</div></div>').join("")+'<h3>Preguntas para revisar</h3>'+answers.filter(a=>!a.ok).map(a=>{const x=Q.find(q=>q.id===a.id);return '<div class="card bad"><b>'+x.i+'</b><p>'+x.q+'</p><div class="muted">Respuesta correcta: '+String.fromCharCode(65+x.a)+'. '+x.o[x.a]+'</div></div>'}).join("")+'<button class="btn full" onclick="render();go(\'practice\')">Volver a práctica</button>';go("simulation")}
function finishDiagnosis(){const byDomain={};answers.forEach(a=>{if(!byDomain[a.d])byDomain[a.d]={right:0,total:0};byDomain[a.d].total++;if(a.ok)byDomain[a.d].right++});S.diagnosis={date:new Date().toISOString(),right:answers.filter(a=>a.ok).length,total:answers.length,byDomain,specialtyId:window.PE_ACTIVE_SPECIALTY||"basica-matematica",version:"2.4"};saveState();render();showDiagnosisResult()}
function showDiagnosisResult(){if(!S.diagnosis){startDiagnosis();return}const sorted=priorityDomains(),p=pct(S.diagnosis.right,S.diagnosis.total);el("diagnosis").innerHTML='<span class="pill">Diagnóstico 0.3</span><h2>Tu punto de partida</h2><div class="card"><span class="muted">Resultado general</span><strong class="score">'+S.diagnosis.right+' / '+S.diagnosis.total+'</strong><div class="bar"><i style="width:'+p+'%"></i></div><p>'+p+'% de respuestas correctas</p></div><h3>Prioridad recomendada</h3>'+sorted.map((x,i)=>'<div class="card '+(i===0?"priority":"")+'"><div class="row"><div><span class="rank">'+(i+1)+'</span><b>'+x.name+'</b></div><b>'+x.p+'%</b></div><div class="bar"><i style="width:'+x.p+'%"></i></div>'+(i===0?'<p class="muted">Te recomendamos comenzar aquí.</p><button class="btn full" onclick="startQuiz(\''+x.name+'\',5)">Practicar este dominio</button>':"")+'</div>').join("")+'<button class="btn ghost full" onclick="startDiagnosis()">Repetir diagnóstico</button>';go("diagnosis")}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>{render();go(b.dataset.go)}));
render();go("home");
function planDays(){return Math.max(0,Math.ceil((new Date(S.plan.examDate+"T12:00:00")-new Date())/86400000))}
function planRank(){
 const diag=priorityDomains();
 return D.map(d=>{
  const st=domainStats(d[0]),practice=st.total?pct(st.right,st.total):null,dg=diag.find(x=>x.name===d[0]),base=dg?dg.p:null;
  const score=practice!==null&&base!==null?Math.round(practice*.6+base*.4):(practice!==null?practice:(base!==null?base:50));
  return{name:d[0],score};
 }).sort((a,b)=>a.score-b.score);
}
function savePlan(){
 const m=el("planMinutes"),d=el("planDays"),date=el("planDate");
 if(m)S.plan.minutes=Math.max(10,Math.min(120,Number(m.value)||20));
 if(d)S.plan.daysPerWeek=Math.max(1,Math.min(7,Number(d.value)||5));
 if(date&&date.value)S.plan.examDate=date.value;
 saveState();render();go("progress");
}
function injectPlan(){
 const ranked=planRank(),one=ranked[0]||{name:"Números"},two=ranked[1]||one,three=ranked[2]||two;
 const home=el("home"),progress=el("progress");
 if(home&&!home.querySelector(".plan07")){
  const c=document.createElement("div");c.className="card emphasis plan07";
  c.innerHTML='<span class="pill">Plan 0.7</span><h3>Tu objetivo de hoy</h3><p><b>'+one.name+'</b> · '+S.plan.minutes+' min</p><div class="muted">Quedan '+planDays()+' días para tu fecha objetivo.</div><div class="planSteps"><div>1. Revisa un indicador de '+one.name+'.</div><div>2. Responde 5 preguntas de ese dominio.</div><div>3. Revisa un error anterior.</div></div><button class="btn full" onclick="startQuiz(\''+one.name+'\',5)">Comenzar sesión</button>';
  const hero=home.querySelector(".hero");if(hero)hero.after(c);else home.prepend(c);
 }
 if(progress&&!progress.querySelector(".plan07detail")){
  const c=document.createElement("div");c.className="plan07detail";
  c.innerHTML='<h3>Plan de estudio personalizado</h3><div class="card"><div class="row"><div><b>Fecha objetivo</b><div class="muted">'+new Date(S.plan.examDate+"T12:00:00").toLocaleDateString("es-CL")+'</div></div><b>'+planDays()+' días</b></div><div class="planFields"><label>Fecha<input id="planDate" type="date" value="'+S.plan.examDate+'"></label><label>Minutos por sesión<input id="planMinutes" type="number" min="10" max="120" value="'+S.plan.minutes+'"></label><label>Días por semana<input id="planDays" type="number" min="1" max="7" value="'+S.plan.daysPerWeek+'"></label></div><button class="btn ghost full" onclick="savePlan()">Actualizar plan</button><div class="weekly"><p><b>Prioridad 1:</b> '+one.name+'</p><p><b>Prioridad 2:</b> '+two.name+'</p><p><b>Prioridad 3:</b> '+three.name+'</p></div></div>';
  progress.prepend(c);
 }
}
const render07=render;render=function(){render07();setTimeout(injectPlan,0)};
injectPlan();

function adaptiveRank(){
 const recent=S.history.slice(-40),diag=priorityDomains();
 return D.map(d=>{
  const all=domainStats(d[0]),rh=recent.filter(x=>x.domain===d[0]),rp=rh.length?pct(rh.filter(x=>x.ok).length,rh.length):null,ap=all.total?pct(all.right,all.total):null,dg=diag.find(x=>x.name===d[0]),dp=dg?dg.p:null;
  const vals=[[rp,5],[ap,3],[dp,2]].filter(x=>x[0]!==null),score=vals.length?Math.round(vals.reduce((s,x)=>s+x[0]*x[1],0)/vals.reduce((s,x)=>s+x[1],0)):50;
  return{name:d[0],score};
 }).sort((a,b)=>a.score-b.score);
}
function startAdaptive(){
 mode="practice";const weak=adaptiveRank().slice(0,2).map(x=>x.name),wrong=new Set(S.wrong),pool=[];
 Q.forEach(q=>{let w=1+(weak.includes(q.d)?3:0)+(wrong.has(q.id)?5:0)+(S.history.some(h=>h.id===q.id)?0:2);while(w--)pool.push(q)});
 quiz=[];const used=new Set();for(const q of shuffle(pool)){if(!used.has(q.id)){used.add(q.id);quiz.push(q)}if(quiz.length===5)break}pos=0;answers=[];showQ();
}

function reviewMeta(q){
 const h=S.history.filter(x=>x.id===q.id);
 if(!h.length)return{q,attempts:0,correct:0,mastery:0,streak:0,due:true,dueText:"Nueva"};
 const correct=h.filter(x=>x.ok).length;
 let streak=0;
 for(let i=h.length-1;i>=0;i--){if(h[i].ok)streak++;else break}
 const last=h[h.length-1],interval=last.ok?[1,3,7,14,30][Math.min(streak-1,4)]:0;
 const dueDate=new Date(last.date+"T12:00:00");dueDate.setDate(dueDate.getDate()+interval);
 const today=new Date();today.setHours(0,0,0,0);
 const due=dueDate<=today;
 const mastery=Math.min(100,Math.round((correct/h.length)*70+Math.min(streak,4)*7.5));
 const days=Math.max(0,Math.ceil((dueDate-today)/86400000));
 return{q,attempts:h.length,correct,mastery,streak,due,dueText:due?"Hoy":"En "+days+" día(s)"};
}
function reviewQueue(){
 return Q.map(reviewMeta).sort((a,b)=>(a.due===b.due?a.mastery-b.mastery:(a.due?-1:1)));
}
function subMastery(){
 const names=[...new Set(Q.map(q=>q.i))];
 return names.map(name=>{
  const rows=Q.filter(q=>q.i===name).map(reviewMeta);
  const practiced=rows.filter(x=>x.attempts);
  const mastery=practiced.length?Math.round(practiced.reduce((s,x)=>s+x.mastery,0)/practiced.length):0;
  const due=rows.filter(x=>x.due).length;
  return{name,mastery,due,questions:rows.length,practiced:practiced.length};
 }).sort((a,b)=>a.mastery-b.mastery);
}
function startSmartReview(){
 mode="practice";
 const queue=reviewQueue(),selected=[],used=new Set();
 for(const x of queue){if((x.due||x.mastery<65)&&!used.has(x.q.id)){selected.push(x.q);used.add(x.q.id)}if(selected.length===5)break}
 if(selected.length<5){for(const x of queue){if(!used.has(x.q.id)){selected.push(x.q);used.add(x.q.id)}if(selected.length===5)break}}
 quiz=selected;pos=0;answers=[];showQ();
}
function injectReview09(){
 const practice=el("practice"),progress=el("progress"),home=el("home");
 const queue=reviewQueue(),due=queue.filter(x=>x.due),subs=subMastery(),weak=subs[0],strong=[...subs].sort((a,b)=>b.mastery-a.mastery)[0];

 if(home&&!home.querySelector(".reviewHome09")){
  const c=document.createElement("div");c.className="card reviewHome09";
  c.innerHTML='<span class="pill">Revisión 0.9</span><h3>'+due.length+' contenido(s) para revisar</h3><p>'+(weak?'<b>Prioridad:</b> '+weak.name+' · '+weak.mastery+'% estimado':'Empieza a practicar para generar tu cola de revisión.')+'</p><button class="btn full" onclick="startSmartReview()">Revisar ahora</button>';
  const a=home.querySelector(".adaptiveHome08")||home.querySelector(".plan07");if(a)a.after(c);else home.appendChild(c);
 }

 if(practice&&!practice.querySelector(".review09")){
  const c=document.createElement("div");c.className="card review09";
  c.innerHTML='<span class="pill">Repetición espaciada 0.9</span><h3>Cola inteligente de repaso</h3><p>'+due.length+' de '+Q.length+' preguntas están disponibles para repasar hoy.</p><button class="btn full" onclick="startSmartReview()">Comenzar revisión</button>';
  practice.prepend(c);
 }

 if(progress&&!progress.querySelector(".mastery09")){
  const box=document.createElement("div");box.className="mastery09";
  box.innerHTML='<h3>Dominio por contenido</h3>'+(weak?'<div class="grid2"><div class="card bad"><span class="muted">Necesita refuerzo</span><b class="masteryTitle">'+weak.name+'</b><strong class="big">'+weak.mastery+'%</strong></div><div class="card good"><span class="muted">Mejor desempeño</span><b class="masteryTitle">'+strong.name+'</b><strong class="big">'+strong.mastery+'%</strong></div></div>':'')+subs.slice(0,8).map(x=>'<div class="card masteryRow"><div class="row"><div><b>'+x.name+'</b><div class="tiny">'+x.practiced+'/'+x.questions+' preguntas practicadas · '+x.due+' para revisar</div></div><b>'+x.mastery+'%</b></div><div class="bar"><i style="width:'+x.mastery+'%"></i></div></div>').join("");
  const anchor=progress.querySelector(".plan07detail");if(anchor)anchor.after(box);else progress.prepend(box);
 }
}
const render09=render;
render=function(){render09();setTimeout(injectReview09,0)};
injectReview09();

function startLevel(level,count=5){
  mode="practice";
  const pool=Q.filter(q=>q.diff===level);
  quiz=shuffle(pool).slice(0,Math.min(count,pool.length));
  pos=0;answers=[];showQ();
}
function injectBank11(){
  const practice=el("practice"),home=el("home");
  if(home&&!home.querySelector(".bank11home")){
    const c=document.createElement("div");
    c.className="card bank11home";
    c.innerHTML='<span class="pill">Banco 1.1</span><h3>'+Q.length+' preguntas disponibles</h3><p class="muted">Clasificadas por dominio, subdominio, dificultad y tipo de razonamiento.</p>';
    const hero=home.querySelector(".hero");if(hero)hero.after(c);else home.prepend(c);
  }
  if(practice&&!practice.querySelector(".bank11levels")){
    const levels=["básica","media","alta"];
    const c=document.createElement("div");
    c.className="bank11levels";
    c.innerHTML='<h3>Practicar por dificultad</h3><div class="grid2">'+levels.map(l=>'<div class="card"><span class="pill">'+l+'</span><h3>'+Q.filter(q=>q.diff===l).length+' preguntas</h3><p class="muted">Entrena un nivel específico.</p><button class="btn full" onclick="startLevel(\''+l+'\',5)">Practicar '+l+'</button></div>').join("")+'</div>';
    const first=practice.querySelector(".card");if(first)first.before(c);else practice.appendChild(c);
  }
}
window.startLevel=startLevel;
const render11=render;
render=function(){render11();setTimeout(injectBank11,0)};
injectBank11();

let SIM12=null,SIM12_TIMER=null;

function buildSimulation12(){
 const selected=[];
 D.forEach(d=>{
   selected.push(...shuffle(Q.filter(q=>q.d===d[0])).slice(0,6));
 });
 return shuffle(selected).slice(0,30);
}
startSimulation=function(){
 mode="simulation";
 clearInterval(SIM12_TIMER);
 quiz=buildSimulation12();
 SIM12={
   index:0,
   answers:{},
   marked:{},
   seconds:45*60,
   startedAt:new Date().toISOString()
 };
 renderSimulation12();
 SIM12_TIMER=setInterval(()=>{
   if(!SIM12)return clearInterval(SIM12_TIMER);
   SIM12.seconds--;
   const t=document.getElementById("sim12time");
   if(t)t.textContent=formatSim12Time(SIM12.seconds);
   if(SIM12.seconds<=0){clearInterval(SIM12_TIMER);finishSimulation12(true)}
 },1000);
};
function formatSim12Time(s){
 const m=Math.max(0,Math.floor(s/60)),sec=Math.max(0,s%60);
 return String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");
}
function renderSimulation12(){
 if(!SIM12)return;
 const x=quiz[SIM12.index],selected=SIM12.answers[x.id];
 const answered=Object.keys(SIM12.answers).length,marked=Object.keys(SIM12.marked).filter(k=>SIM12.marked[k]).length;
 const target=el("simulation");
 target.innerHTML=
 '<div class="sim12Top"><div><span class="pill">'+(SIM12.examTitle||"Simulador 1.2")+'</span><div class="muted">'+(SIM12.examLabel||quiz.length+' preguntas · simulación propia ProfeECEP')+'</div></div><div class="sim12Clock"><span>Tiempo</span><b id="sim12time">'+formatSim12Time(SIM12.seconds)+'</b></div></div>'+ 
 '<div class="sim12Stats"><span>'+answered+' respondidas</span><span>'+marked+' marcadas</span><span>'+(SIM12.index+1)+' / '+quiz.length+'</span></div>'+
 '<div class="card sim12Question"><div class="muted">'+x.d+' · '+x.i+'</div><h2>'+x.q+'</h2>'+
 x.o.map((o,i)=>'<button class="opt '+(selected===i?"sel":"")+'" onclick="sim12Choose('+i+')">'+String.fromCharCode(65+i)+'. '+o+'</button>').join("")+
 '<div class="sim12Actions"><button class="btn ghost" onclick="sim12Mark()">'+(SIM12.marked[x.id]?"★ Marcada":"☆ Marcar para revisar")+'</button><button class="btn" onclick="sim12Next()">'+(SIM12.index===quiz.length-1?"Ir al resumen":"Siguiente")+'</button></div></div>'+
 '<div class="card"><div class="row"><b>Navegación</b><button class="mini ghost2" onclick="sim12ShowSummary()">Resumen</button></div><div class="sim12Grid">'+
 quiz.map((q,i)=>'<button class="sim12Nav '+(i===SIM12.index?"current":"")+' '+(SIM12.answers[q.id]!==undefined?"answered":"")+' '+(SIM12.marked[q.id]?"marked":"")+'" onclick="sim12Go('+i+')">'+(i+1)+'</button>').join("")+
 '</div></div>';
 go("simulation");
}
function sim12Choose(i){
 const q=quiz[SIM12.index];SIM12.answers[q.id]=i;renderSimulation12();
}
function sim12Mark(){
 const q=quiz[SIM12.index];SIM12.marked[q.id]=!SIM12.marked[q.id];renderSimulation12();
}
function sim12Go(i){SIM12.index=Math.max(0,Math.min(quiz.length-1,i));renderSimulation12()}
function sim12Next(){
 if(SIM12.index<quiz.length-1){SIM12.index++;renderSimulation12()}
 else sim12ShowSummary();
}
function sim12ShowSummary(){
 const answered=Object.keys(SIM12.answers).length;
 const marked=Object.keys(SIM12.marked).filter(k=>SIM12.marked[k]).length;
 el("simulation").innerHTML=
 '<span class="pill">Resumen antes de entregar</span><h2>Revisa tu simulacro</h2>'+
 '<div class="grid2"><div class="card"><span class="muted">Respondidas</span><strong class="big">'+answered+' / '+quiz.length+'</strong></div><div class="card"><span class="muted">Marcadas</span><strong class="big">'+marked+'</strong></div></div>'+
 '<div class="card"><div class="sim12Grid">'+quiz.map((q,i)=>'<button class="sim12Nav '+(SIM12.answers[q.id]!==undefined?"answered":"")+' '+(SIM12.marked[q.id]?"marked":"")+'" onclick="sim12Go('+i+')">'+(i+1)+'</button>').join("")+'</div></div>'+
 (answered<quiz.length?'<div class="card warning"><b>Te faltan '+(quiz.length-answered)+' pregunta(s).</b><p class="muted">Puedes volver y responderlas antes de entregar.</p></div>':"")+
 '<button class="btn ghost full" onclick="sim12Go('+SIM12.index+')">Volver a preguntas</button>'+
 '<button class="btn full sim12Finish" onclick="sim12ConfirmFinish()">Finalizar simulacro</button>';
 go("simulation");
}
function sim12ConfirmFinish(){
 const unanswered=quiz.length-Object.keys(SIM12.answers).length;
 if(unanswered&& !confirm("Aún tienes "+unanswered+" pregunta(s) sin responder. ¿Finalizar de todas formas?"))return;
 finishSimulation12(false);
}
function finishSimulation12(auto=false){
 if(!SIM12)return;
 clearInterval(SIM12_TIMER);
 const maxSeconds=SIM12.maxSeconds||45*60;
 const rows=quiz.map(q=>{
   const selected=SIM12.answers[q.id];
   return{id:q.id,d:q.d,ok:selected===q.a,selected,unanswered:selected===undefined,marked:!!SIM12.marked[q.id]};
 });
 const correct=rows.filter(x=>x.ok).length,unanswered=rows.filter(x=>x.unanswered).length,p=pct(correct,quiz.length),by={};
 rows.forEach(a=>{
   if(!by[a.d])by[a.d]={right:0,total:0};
   by[a.d].total++;if(a.ok)by[a.d].right++;
   if(!a.unanswered){
     S.history.push({date:new Date().toISOString().slice(0,10),domain:a.d,id:a.id,ok:a.ok});
     if(!a.ok&&!S.wrong.includes(a.id))S.wrong.push(a.id);
     if(a.ok)S.wrong=S.wrong.filter(id=>id!==a.id);
   }
 });
 if(S.history.length>300)S.history=S.history.slice(-300);
 S.simulations.push({date:new Date().toISOString(),right:correct,total:quiz.length,byDomain:by,durationSeconds:maxSeconds-SIM12.seconds,unanswered,version:SIM12.generatedBy||"1.2"});
 if(S.simulations.length>20)S.simulations=S.simulations.slice(-20);
 saveState();
 el("simulation").innerHTML=
 '<span class="pill">'+(SIM12.examTitle||"Simulador 1.2")+' completado</span><h2>'+(auto?"Tiempo finalizado":"Resultado del simulacro")+'</h2>'+
 '<div class="grid2"><div class="card"><span class="muted">Resultado</span><strong class="score">'+correct+' / '+quiz.length+'</strong><div class="bar"><i style="width:'+p+'%"></i></div><p>'+p+'% correctas</p></div><div class="card"><span class="muted">Sin responder</span><strong class="score">'+unanswered+'</strong><p>Tiempo usado: '+formatSim12Time(maxSeconds-SIM12.seconds)+'</p></div></div>'+
 '<h3>Rendimiento por dominio</h3>'+Object.entries(by).map(([name,v])=>'<div class="card"><div class="row"><b>'+name+'</b><b>'+pct(v.right,v.total)+'%</b></div><div class="bar"><i style="width:'+pct(v.right,v.total)+'%"></i></div><div class="tiny">'+v.right+' de '+v.total+' correctas</div></div>').join("")+
 '<h3>Revisión de respuestas</h3>'+rows.filter(a=>!a.ok).map(a=>{const q=Q.find(x=>x.id===a.id);return '<div class="card bad"><b>'+q.i+'</b><p>'+q.q+'</p><div class="muted">'+(a.unanswered?"Sin respuesta. ":"Tu respuesta: "+String.fromCharCode(65+a.selected)+". "+q.o[a.selected]+". ")+'Correcta: '+String.fromCharCode(65+q.a)+'. '+q.o[q.a]+'</div></div>'}).join("")+
 '<button class="btn full" onclick="SIM12=null;render();go(\'practice\')">Volver a práctica</button>';
 SIM12=null;render();
}
function injectSimulator12(){
 const practice=el("practice");if(!practice)return;
 const cards=[...practice.querySelectorAll(".card")];
 const old=cards.find(c=>c.textContent.includes("Simulacro breve"));
 if(old){
   old.classList.add("simulator12Card");
   old.innerHTML='<span class="pill">Simulador 1.2</span><h3>Simulador completo</h3><p>30 preguntas, 45 minutos, navegación libre, marcado para revisión y análisis final.</p><button class="btn full" onclick="startSimulation()">Iniciar simulador</button>';
 }
}
const render12=render;
render=function(){render12();setTimeout(injectSimulator12,0)};
injectSimulator12();
