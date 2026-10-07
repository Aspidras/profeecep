// Las transcripciones y los pasajes de apoyo se muestran únicamente al revisar.
(function(){
 'use strict';
 const esc=PE304.esc,ids=new Set(PE311_ITEMS.map(q=>q.id));
 const assets=new Set(PE311_ITEMS.flatMap(q=>q.stimulus.map(s=>s.asset)));
 const audioURL=name=>assets.has(name)&&/^ingles-2023-0[1-7]\.mp3$/.test(name)?'assets/audio-311/'+name+'?v=3.0.11':null;
 const stamp=n=>Math.floor(n/60)+':'+String(Math.floor(n%60)).padStart(2,'0');
 const previousStimulus=PE305.stimulus,previousSource=PE305.source;
 PE305.audioURL=audioURL;
 PE305.stimulus=function(q){
  if(!ids.has(q?.id))return previousStimulus(q);
  return q.stimulus.map(s=>{
   const url=audioURL(s.asset);if(!url)return '';
   return '<section class="pe307-audio" aria-label="Comprensión auditiva"><h3 lang="en">'+esc(s.title)+'</h3><p>Escucha la pista y responde. Puedes repetirla; al revisar tendrás la transcripción de apoyo y las explicaciones.</p><audio controls preload="metadata" aria-label="'+esc(s.title)+'" src="'+esc(url)+'">Tu navegador no reproduce este audio.</audio><p class="tiny">Pista '+s.track+' · material de Inglés 2023. Las cifras y referencias temporales pertenecen a esa grabación. Si no se reproduce, <a href="'+esc(url)+'" target="_blank" rel="noopener">abre el audio en otra pestaña</a>.</p></section>';
  }).join('');
 };
 PE305.source=function(q){
  if(!ids.has(q?.id))return previousSource(q);
  const evidence='<p class="pe311-evidence"><b>Vuelve al pasaje '+stamp(q.evidence.start)+'–'+stamp(q.evidence.end)+'.</b> Compáralo con las razones de cada alternativa.</p>';
  return evidence+q.stimulus.map(s=>'<details class="pe307-transcript"><summary>Leer la transcripción del audio</summary><p class="tiny">'+esc(s.transcriptNote)+'</p><p lang="en">'+esc(s.transcript).replace(/\n/g,'<br>')+'</p></details>').join('')+previousSource(q);
 };
}());
