// ProfeECEP 2.8.5 — clasificación completa de preguntas
(function(){
 'use strict';
 const legacy={
  n1:[0,0,0,'conceptual','divisibilidad y números primos'],n2:[0,1,3,'aplicación','cálculo de porcentajes'],n3:[0,1,2,'aplicación','proporcionalidad directa'],
  a1:[1,0,1,'traducción','lenguaje natural y algebraico'],a2:[1,1,0,'modelación','ecuaciones lineales'],a3:[1,2,2,'conceptual','parámetros de función'],
  g1:[2,0,0,'aplicación','construcción de triángulos'],g2:[2,1,0,'cálculo','área de figuras planas'],g3:[2,2,1,'conceptual','rotaciones'],
  d1:[3,0,1,'cálculo','medidas de tendencia central'],d2:[3,1,3,'cálculo','modelo de Laplace'],d3:[3,1,2,'aplicación','principio multiplicativo'],
  p1:[4,0,1,'pedagógica','representaciones de contenidos'],p2:[4,1,1,'análisis de error','aprendizaje desde el error'],p3:[4,2,0,'evaluación','indicadores y desempeños'],
  n4:[0,0,0,'cálculo','divisibilidad y factores'],n5:[0,2,1,'cálculo','potencias decimales'],n6:[0,2,0,'cálculo','propiedades de potencias'],
  a4:[1,0,0,'generalización','secuencias numéricas'],a5:[1,1,2,'resolución','ecuaciones lineales'],a6:[1,2,1,'interpretación','variables dependientes e independientes'],
  g4:[2,0,1,'conceptual','clasificación de polígonos'],g5:[2,1,1,'cálculo','volumen de cuerpos'],g6:[2,2,1,'conceptual','traslaciones'],
  d4:[3,0,1,'interpretación','mediana y valores extremos'],d5:[3,0,3,'interpretación','población y muestra'],d6:[3,1,3,'cálculo','modelo de Laplace'],
  p4:[4,0,0,'pedagógica','estrategias y actividades'],p5:[4,1,1,'análisis de error','aprendizaje desde el error'],p6:[4,2,1,'evaluación','instrumentos de evaluación'],
  n7:[0,0,0,'cálculo','múltiplos y divisibilidad'],n8:[0,0,1,'comparación','orden de enteros y racionales'],n9:[0,1,2,'aplicación','proporcionalidad directa'],n10:[0,1,3,'aplicación','porcentaje de aumento'],n11:[0,2,0,'cálculo','potencias de exponente entero'],n12:[0,2,0,'interpretación','comportamiento de potencias'],
  a7:[1,0,1,'traducción','lenguaje natural y algebraico'],a8:[1,0,0,'generalización','término general de una secuencia'],a9:[1,1,2,'resolución','ecuaciones lineales'],a10:[1,1,0,'modelación','inecuaciones lineales'],a11:[1,2,2,'cálculo','parámetros de función'],a12:[1,2,3,'modelación','funciones lineales'],
  g7:[2,0,3,'conceptual','propiedades de polígonos'],g8:[2,0,4,'conceptual','propiedades de la circunferencia'],g9:[2,1,0,'cálculo','área de figuras planas'],g10:[2,1,3,'cálculo','áreas compuestas'],g11:[2,2,1,'aplicación','reflexiones'],g12:[2,2,0,'conceptual','congruencia e isometrías'],
  d7:[3,0,1,'conceptual','moda'],d8:[3,0,0,'interpretación','gráficos'],d9:[3,0,2,'interpretación','selección de medidas'],d10:[3,1,3,'cálculo','modelo de Laplace'],d11:[3,1,2,'aplicación','principio multiplicativo'],d12:[3,1,1,'cálculo','frecuencia relativa'],
  p7:[4,0,0,'pedagógica','estrategias y actividades'],p8:[4,0,3,'pedagógica','selección de recursos'],p9:[4,0,2,'pedagógica','intervenciones docentes'],p10:[4,1,0,'pedagógica','conocimientos previos'],p11:[4,1,1,'análisis de error','aprendizaje desde el error'],p12:[4,2,1,'evaluación','instrumentos de evaluación']
 };
 function apply(q,meta,domains){const [di,si,ii,type,skill]=meta,d=domains[di],s=d&&d[1][si],indicator=s&&s[1][ii];if(!indicator)return false;q.indicatorId=[di,si,ii].join('-');q.indicator=indicator;q.questionType=q.questionType||type;q.skill=skill;q.classificationStatus='clasificada';q.origin=q.origin||'Contenido propio ProfeECEP';q.version=q.version||'2.8.5';if(!Array.isArray(q.explanations)||q.explanations.length!==q.o.length)q.explanations=q.o.map((o,i)=>i===q.a?q.e:'Esta alternativa no responde a la evidencia solicitada o confunde el concepto central.');return true}
 const domains=window.ECEP_DATA||[];let classified=0;
 (window.QBANK||[]).forEach(q=>{if(legacy[q.id]&&apply(q,legacy[q.id],domains))classified++;else if(q.indicatorId){q.classificationStatus='clasificada';if(!q.questionType)q.questionType=q.d&&q.d.toLowerCase().includes('enseñanza')?'pedagógica':'aplicación';if(!Array.isArray(q.explanations)||q.explanations.length!==q.o.length)q.explanations=q.o.map((o,i)=>i===q.a?q.e:'Esta alternativa no responde a la evidencia solicitada o confunde el concepto central.')}});
 window.PE285_CLASSIFICATION={classified};
}());
