const D=ECEP_DATA,Q=QBANK,K="profeecep";
let S=JSON.parse(localStorage.getItem(K)||'{"done":[],"right":0,"total":0,"byDomain":{},"wrong":[]}');
S.done=S.done||[];S.byDomain=S.byDomain||{};S.wrong=S.wrong||[];
let quiz=[],pos=0,sel=null,answers=[];
const flat=[];
D.forEach((d,di)=>d[1].forEach((s,si)=>s[1].forEach((t,ii)=>flat.push({id:di+"-"+si+"-"+ii,t,di,si}))));

function save(){localStorage.setItem(K,JSON.stringify(S));render()}
function go(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("on"));document.getElementById(id).classList.add("on");scrollTo(0,0)}
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{render();go(b.dataset.go)});

function pct(a,b){return b?Math.round(a/b*100):0}
function domainStats(name){return S.byDomain[name]||{right:0,total:0}}
function render(){
 const studyPct=pct(S.done.length,flat.length);
 home.innerHTML='<div class="hero"><span class="pill">ProfeECEP 0.2</span><h1>Estudia, practica y descubre dónde reforzar.</h1><p>Banco inicial de preguntas alineado al temario ECEP 2026.</p></div>'+
 '<div class="grid2"><div class="card"><span class="muted">Temario estudiado</span><strong class="big">'+studyPct+'%</strong><div class="bar"><i style="width:'+studyPct+'%"></i></div></div><div class="card"><span class="muted">Precisión global</span><strong class="big">'+pct(S.right,S.total)+'%</strong><div class="bar"><i style="width:'+pct(S.right,S.total)+'%"></i></div></div></div>'+
 '<div class="card"><div class="row"><div><b>Práctica rápida</b><div class="muted">5 preguntas mezcladas</div></div><button class="btn" onclick="startQuiz('all',5)">Comenzar</button></div></div>'+
 '<h3>Precisión por dominio</h3>'+D.map(d=>{let st=domainStats(d[0]);return '<div class="card"><div class="row"><b>'+d[0]+'</b><b>'+pct(st.right,st.total)+'%</b></div><div class="bar"><i style="width:'+pct(st.right,st.total)+'%"></i></div><div class="tiny">'+st.right+' correctas de '+st.total+'</div></div>'}).join('');

 map.innerHTML='<h2>Mapa ECEP 2026</h2><p class="muted">Marca lo estudiado y luego practica por dominio.</p>'+D.map((d,di)=>'<div class="domain"><div class="row"><h3>'+d[0]+'</h3><button class="btn ghost" onclick="startQuiz(\''+d[0]+'\',5)">Practicar</button></div>'+d[1].map((s,si)=>'<div class="sub"><b>'+s[0]+'</b>'+s[1].map((t,ii)=>{let id=di+"-"+si+"-"+ii;return '<div class="indicator row"><span>'+t+'</span><button class="mini '+(S.done.includes(id)?'done':'')+'" onclick="toggle(\''+id+'\')">'+(S.done.includes(id)?'✓':'○')+'</button></div>'}).join('')+'</div>').join('')+'</div>').join('');

 progress.innerHTML='<h2>Mi progreso</h2><div class="grid2"><div class="card"><span class="muted">Indicadores</span><strong class="big">'+S.done.length+'/'+flat.length+'</strong></div><div class="card"><span class="muted">Preguntas</span><strong class="big">'+S.right+'/'+S.total+'</strong></div></div>'+
 '<h3>Rendimiento por dominio</h3>'+D.map(d=>{let st=domainStats(d[0]);return '<div class="card"><div class="row"><b>'+d[0]+'</b><b>'+pct(st.right,st.total)+'%</b></div><div class="bar"><i style="width:'+pct(st.right,st.total)+'%"></i></div><div class="tiny">'+st.total+' respuestas registradas</div></div>'}).join('')+
 (S.wrong.length?'<h3>Para revisar</h3>'+S.wrong.slice(-5).reverse().map(id=>{let x=Q.find(q=>q.id===id);return x?'<div class="card bad"><b>'+x.i+'</b><p>'+x.q+'</p></div>':''}).join(''):'<div class="card"><p class="muted">Aún no hay errores guardados.</p></div>');

 practice.innerHTML='<h2>Practicar</h2><p class="muted">Elige cómo entrenar.</p><div class="card"><h3>Sesión rápida</h3><p>5 preguntas mezcladas de distintos dominios.</p><button class="btn" onclick="startQuiz('all',5)">Comenzar</button></div><h3>Por dominio</h3>'+D.map(d=>'<div class="card"><div class="row"><div><b>'+d[0]+'</b><div class="muted">'+Q.filter(q=>q.d===d[0]).length+' preguntas disponibles</div></div><button class="btn ghost" onclick="startQuiz(\''+d[0]+'\',5)">Practicar</button></div></div>').join('');
}

function toggle(id){S.done=S.done.includes(id)?S.done.filter(x=>x!==id):S.done.concat(id);save();go("map")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function startQuiz(domain="all",count=5){
 const pool=domain==="all"?Q:Q.filter(q=>q.d===domain);
 quiz=shuffle(pool).slice(0,Math.min(count,pool.length));
 pos=0;answers=[];showQ();
}
function showQ(){
 if(pos>=quiz.length)return finish();
 sel=null;let x=quiz[pos];
 practice.innerHTML='<div class="row"><span class="pill">'+x.d+'</span><b>'+(pos+1)+' / '+quiz.length+'</b></div><div class="card"><div class="muted">'+x.i+'</div><h2>'+x.q+'</h2>'+x.o.map((o,i)=>'<button class="opt" onclick="pick('+i+',this)">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('')+'<button class="btn full" onclick="check()">Responder</button></div>';
 go("practice");
}
function pick(i,b){sel=i;document.querySelectorAll(".opt").forEach(x=>x.classList.remove("sel"));b.classList.add("sel")}
function check(){
 if(sel===null)return;
 let x=quiz[pos],ok=sel===x.a;
 S.total++;if(ok)S.right++;
 if(!S.byDomain[x.d])S.byDomain[x.d]={right:0,total:0};
 S.byDomain[x.d].total++;if(ok)S.byDomain[x.d].right++;
 if(!ok&&!S.wrong.includes(x.id))S.wrong.push(x.id);
 if(ok)S.wrong=S.wrong.filter(id=>id!==x.id);
 answers.push({id:x.id,ok});
 localStorage.setItem(K,JSON.stringify(S));
 practice.innerHTML='<div class="card '+(ok?'good':'bad')+'"><span class="pill">'+(ok?'Correcta':'Revisar')+'</span><h2>'+(ok?'¡Bien!':'No era esa')+'</h2><p>'+x.e+'</p><div class="answerKey">Respuesta correcta: <b>'+String.fromCharCode(65+x.a)+'. '+x.o[x.a]+'</b></div></div><button class="btn full" onclick="nextQ()">Siguiente</button>';
}
function nextQ(){pos++;showQ()}
function finish(){
 const r=answers.filter(a=>a.ok).length,p=pct(r,answers.length);
 practice.innerHTML='<h2>Sesión terminada</h2><div class="card"><span class="muted">Resultado</span><strong class="score">'+r+' / '+answers.length+'</strong><div class="bar"><i style="width:'+p+'%"></i></div><p>'+p+'% de respuestas correctas</p></div><h3>Revisión</h3>'+answers.map(a=>{let x=Q.find(q=>q.id===a.id);return '<div class="card '+(a.ok?'good':'bad')+'"><b>'+(a.ok?'✓ Correcta':'✕ Revisar')+'</b><p>'+x.q+'</p><div class="muted">'+x.i+'</div></div>'}).join('')+'<button class="btn full" onclick="render();go(\'practice\')">Volver a practicar</button>';
 localStorage.setItem(K,JSON.stringify(S));
}
render();go("home");