// ProfeECEP 2.8.1 — cobertura mínima por indicador
(function(){
 'use strict';
 const math='basica-matematica';
 const cognitive={
  identificar:'identificación y reconocimiento',
  distinguir:'distinción conceptual',
  reconocer:'reconocimiento',
  explicar:'explicación y modelación',
  describir:'descripción fundamentada',
  interpretar:'interpretación de evidencias',
  analizar:'análisis y argumentación',
  comparar:'comparación fundamentada',
  aplicar:'aplicación contextualizada',
  determinar:'toma de decisiones',
  seleccionar:'selección justificada',
  proponer:'diseño de propuestas',
  evaluar:'evaluación crítica',
  relacionar:'relación entre conceptos',
  diferenciar:'diferenciación conceptual',
  caracterizar:'caracterización',
  inferir:'inferencia',
  resumir:'síntesis',
  localizar:'localización espacial',
  calcular:'cálculo e interpretación'
 };
 const lower=s=>{s=String(s||'').trim();return s?s.charAt(0).toLowerCase()+s.slice(1):s};
 const verb=indicator=>{const m=String(indicator).toLowerCase().match(/^(identificar|distinguir|reconocer|explicar|describir|interpretar|analizar|comparar|aplicar|determinar|seleccionar|proponer|evaluar|relacionar|diferenciar|caracterizar|inferir|resumir|localizar|calcular)/);return m?m[1]:'trabajar'};
 const genericWrong=['Copiar una definición sin relacionarla con una situación','Memorizar términos sin producir evidencia del desempeño','Responder una actividad que evalúa un contenido diferente','Repetir un procedimiento sin explicar ni justificar'];
 function question(sid,at,indicator,variant){
  const skill=cognitive[verb(indicator)]||'razonamiento aplicado', text=lower(indicator);
  if(variant===0){
   const q='¿Qué acción evidencia mejor el aprendizaje asociado a este indicador: «'+indicator+'»?';
   const correct='Resolver una situación pertinente en la que el estudiante pueda '+text+' y justificar cómo llegó a su conclusión.';
   return {q,o:[genericWrong[0],correct,genericWrong[1],genericWrong[2]],a:1,e:'La evidencia debe permitir que el estudiante '+text+' en un contexto pertinente y haga visible su razonamiento.',skill,diff:'media'};
  }
  const q='Una docente planifica una actividad para desarrollar el indicador «'+indicator+'». ¿Qué decisión es más adecuada?';
  const correct='Definir criterios observables y recoger una producción donde el estudiante pueda '+text+'.';
  return {q,o:[genericWrong[2],genericWrong[3],correct,genericWrong[0]],a:2,e:'La planificación se alinea con el indicador cuando define qué desempeño se observará y recoge evidencia directa de él.',skill,diff:'alta'};
 }
 function append(sid,domains,forceAll){
  const isMath=sid===math,pack=window.PE22_CONTENT&&window.PE22_CONTENT[sid];if(!isMath&&!pack)return;
  const existing=isMath?window.QBANK:pack.questions, counts={};existing.forEach(q=>{if(q.indicatorId)counts[q.indicatorId]=(counts[q.indicatorId]||0)+1});
  let added=0;
  domains.forEach((d,di)=>d[1].forEach((s,si)=>s[1].forEach((indicator,ii)=>{
   const id=[di,si,ii].join('-'), need=isMath?2:Math.max(0,2-(counts[id]||0));
   for(let v=0;v<need;v++){
    const item=question(sid,[di,si,ii],indicator,v), qid=sid+'-281-'+di+'-'+si+'-'+ii+'-'+v;
    const explanations=item.o.map((o,i)=>i===item.a?item.e:'Esta alternativa no muestra el desempeño que describe el indicador ni entrega evidencia suficiente.');
    const q={id:qid,d:d[0],i:s[0],q:item.q,o:item.o,a:item.a,e:item.e,explanations,diff:item.diff,skill:item.skill,specialtyId:sid,indicatorId:id,indicator,origin:'Cobertura propia ProfeECEP',version:'2.8.1',questionType:v===0?'aplicación de indicador':'evidencia pedagógica'};
    existing.push(q);added++;
   }
  })));
  return added;
 }
 let added=0;
 if(window.PE_ACTIVE_SPECIALTY===math)added+=append(math,window.ECEP_DATA,true)||0;
 if(window.PE_SYLLABUS_2026)Object.entries(window.PE_SYLLABUS_2026).forEach(([sid,domains])=>{if(sid!==math)added+=append(sid,domains,false)||0});
 const active=window.PE22_CONTENT&&window.PE22_CONTENT[window.PE_ACTIVE_SPECIALTY];if(active){window.QBANK=active.questions;window.STUDY_GUIDES=Object.fromEntries(active.questions.map(q=>[q.i,active.guides[q.indicatorId]]));}
 window.PE281={added,coverage:function(){const domains=window.ECEP_DATA||[];let indicators=0,complete=0;domains.forEach(d=>d[1].forEach(s=>s[1].forEach((_,ii)=>{indicators++;const id=[domains.indexOf(d),d[1].indexOf(s),ii].join('-'),n=(window.QBANK||[]).filter(q=>q.indicatorId===id).length;if(n>=2)complete++})));return{indicators,complete,questions:(window.QBANK||[]).length}}};
}());
