window.PE13={};
PE13.stats=function(){
 const h=S.history||[],m={},recent=h.slice(-20),prev=h.slice(-40,-20);
 h.forEach(x=>{const q=Q.find(v=>v.id===x.id);if(!q)return;if(!m[q.i])m[q.i]={name:q.i,right:0,total:0};m[q.i].total++;if(x.ok)m[q.i].right++});
 return{recent:recent.length?pct(recent.filter(x=>x.ok).length,recent.length):0,prev:prev.length?pct(prev.filter(x=>x.ok).length,prev.length):null,ind:Object.values(m).map(x=>({...x,p:pct(x.right,x.total)})).sort((a,b)=>a.p-b.p),sims:(S.simulations||[]).slice(-6)};
};
PE13.show=function(){
 const home=el("home");if(home){const v=home.querySelector(".hero .pill");if(v)v.textContent="ProfeECEP 1.3"}
 const p=el("progress");if(!p||p.querySelector(".analytics13"))return;
 const a=PE13.stats(),delta=a.prev===null?null:a.recent-a.prev,w=a.ind[0],s=a.ind.length?[...a.ind].sort((x,y)=>y.p-x.p)[0]:null;
 const box=document.createElement("div");box.className="analytics13";
 box.innerHTML='<h2>Analítica avanzada</h2><div class="analyticsKpis"><div class="card"><span class="muted">Últimas 20</span><strong class="big">'+a.recent+'%</strong><div class="tiny">'+(delta===null?'Sin comparación':delta>0?'▲ +'+delta+' pts':delta<0?'▼ '+delta+' pts':'Sin cambio')+'</div></div><div class="card"><span class="muted">Indicadores</span><strong class="big">'+a.ind.length+'</strong></div></div>'+(w&&s?'<div class="grid2"><div class="card bad"><span class="muted">Prioridad</span><b>'+w.name+'</b><strong class="big">'+w.p+'%</strong></div><div class="card good"><span class="muted">Fortaleza</span><b>'+s.name+'</b><strong class="big">'+s.p+'%</strong></div></div>':'')+'<h3>Comparación de simulacros</h3>'+(a.sims.length?'<div class="card">'+a.sims.map((x,i)=>'<div class="simCompareRow"><span>Simulacro '+((S.simulations||[]).length-a.sims.length+i+1)+'</span><b>'+pct(x.right,x.total)+'%</b></div>').join('')+'</div>':'<div class="card"><p class="muted">Aún no hay simulacros para comparar.</p></div>')+'<h3>Rendimiento por indicador</h3>'+(a.ind.length?a.ind.slice(0,12).map(x=>'<div class="card"><div class="row"><b>'+x.name+'</b><b>'+x.p+'%</b></div><div class="bar"><i style="width:'+x.p+'%"></i></div><div class="tiny">'+x.right+' de '+x.total+' correctas</div></div>').join(''):'<div class="card"><p class="muted">Responde más preguntas para medir indicadores.</p></div>');
 p.prepend(box);
};
const pe13render=render;render=function(){pe13render();setTimeout(PE13.show,0)};setTimeout(PE13.show,0);