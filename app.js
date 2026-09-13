const D=ECEP_DATA,Q=QBANK,K="profeecep";
let S=JSON.parse(localStorage.getItem(K)||'{"done":[],"right":0,"total":0}');
let quiz=[],pos=0,sel=null;
const flat=[];
D.forEach((d,di)=>d[1].forEach((s,si)=>s[1].forEach((t,ii)=>flat.push({id:di+"-"+si+"-"+ii,t,di,si}))));

function save(){localStorage.setItem(K,JSON.stringify(S));render()}
function go(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("on"));document.getElementById(id).classList.add("on");scrollTo(0,0)}
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{render();go(b.dataset.go)});

function render(){
  const p=Math.round(S.done.length/flat.length*100);
  home.innerHTML='<div class="hero"><span class="pill">Proyecto persistente</span><h1>Prepárate para tu ECEP con un camino claro.</h1><p>Temario, progreso y práctica en un mismo lugar.</p></div><div class="card"><div class="row"><b>Progreso general</b><b>'+p+'%</b></div><div class="bar"><i style="width:'+p+'%"></i></div></div>'+D.map((d,di)=>{let z=flat.filter(x=>x.di===di),n=z.filter(x=>S.done.includes(x.id)).length,q=Math.round(n/z.length*100);return '<div class="card"><div class="row"><b>'+d[0]+'</b><b>'+q+'%</b></div><div class="bar"><i style="width:'+q+'%"></i></div></div>'}).join('');

  map.innerHTML='<h2>Mapa ECEP 2026</h2><p class="muted">Estructura de Educación Básica Matemática.</p>'+D.map((d,di)=>'<div class="domain"><h3>'+d[0]+'</h3>'+d[1].map((s,si)=>'<div class="sub"><b>'+s[0]+'</b>'+s[1].map((t,ii)=>{let id=di+"-"+si+"-"+ii;return '<div class="indicator row"><span>'+t+'</span><button class="btn" onclick="toggle(\''+id+'\')">'+(S.done.includes(id)?'✓':'Marcar')+'</button></div>'}).join('')+'</div>').join('')+'</div>').join('');

  progress.innerHTML='<h2>Mi progreso</h2><div class="card"><div class="row"><span>Indicadores estudiados</span><b>'+S.done.length+' / '+flat.length+'</b></div><div class="row"><span>Preguntas correctas</span><b>'+S.right+' / '+S.total+'</b></div></div>';

  practice.innerHTML='<h2>Práctica</h2><div class="card"><span class="pill">0.2</span><h3>Sesión rápida</h3><p>5 preguntas propias alineadas al temario.</p><button class="btn" onclick="startQuiz()">Comenzar</button></div>';
}

function toggle(id){S.done=S.done.includes(id)?S.done.filter(x=>x!==id):S.done.concat(id);save();go("map")}
function startQuiz(){quiz=[...Q];pos=0;showQ()}
function showQ(){
  if(pos>=quiz.length)return finish();
  sel=null;
  let x=quiz[pos];
  practice.innerHTML='<div class="row"><span class="pill">'+x.d+'</span><b>'+(pos+1)+' / '+quiz.length+'</b></div><div class="card"><div class="muted">'+x.i+'</div><h2>'+x.q+'</h2>'+x.o.map((o,i)=>'<button class="opt" onclick="pick('+i+',this)">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('')+'<button class="btn" onclick="check()">Responder</button></div>';
  go("practice");
}
function pick(i,b){sel=i;document.querySelectorAll(".opt").forEach(x=>x.classList.remove("sel"));b.classList.add("sel")}
function check(){
  if(sel===null)return;
  let x=quiz[pos],ok=sel===x.a;
  S.total++; if(ok)S.right++;
  localStorage.setItem(K,JSON.stringify(S));
  practice.innerHTML='<div class="card '+(ok?'good':'bad')+'"><h2>'+(ok?'Correcta':'Revisar')+'</h2><p>'+x.e+'</p><p class="muted">Respuesta: '+String.fromCharCode(65+x.a)+'. '+x.o[x.a]+'</p></div><button class="btn" onclick="nextQ()">Siguiente</button>';
}
function nextQ(){pos++;showQ()}
function finish(){practice.innerHTML='<h2>Sesión completada</h2><div class="card"><p>Tu progreso de práctica quedó guardado.</p><button class="btn" onclick="startQuiz()">Practicar otra vez</button></div>';localStorage.setItem(K,JSON.stringify(S))}
render();go("home");