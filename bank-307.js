// Originals enter practice; retired templates remain recoverable.
(function () {
  'use strict';
  const esc=PE304.esc, archived={}, originals={}, ids=new Set(PE307_ITEMS.map(q=>q.id));
  for(const [sid,retired] of Object.entries(PE307_ARCHIVE_IDS)){
    if(sid==='basica-matematica' && PE_ACTIVE_SPECIALTY!==sid) continue;
    const bank=sid===PE_ACTIVE_SPECIALTY?QBANK:PE22_CONTENT[sid]?.questions;
    if(!bank) throw new Error('Banco no disponible: '+sid);
    originals[sid]=bank.slice(); const retire=new Set(retired);
    archived[sid]=bank.filter(q=>retire.has(q.id));
    if(archived[sid].length!==retired.length) throw new Error('Archivo incompleto: '+sid);
    const syllabus=sid==='basica-matematica'?ECEP_DATA:PE_SYLLABUS_2026[sid];
    const additions=PE307_ITEMS.filter(q=>q.specialtyId===sid).map(q=>{
      const [d,s,i]=q.indicatorId.split('-').map(Number),domain=syllabus[d],sub=domain?.[1]?.[s],indicator=sub?.[1]?.[i];
      if(!indicator) throw new Error('Indicador inválido: '+q.id);
      return {...q,d:domain[0],i:sub[0],indicator};
    });
    bank.splice(0,bank.length,...bank.filter(q=>!retire.has(q.id)),...additions);
  }
  function fullBank(sid=PE_ACTIVE_SPECIALTY){
    const bank=sid===PE_ACTIVE_SPECIALTY?Q:PE22_CONTENT[sid]?.questions||[];
    return [...(originals[sid]||[]),...bank.filter(q=>ids.has(q.id))];
  }
  const assets=new Map(PE307_ITEMS.flatMap(q=>q.stimulus.filter(s=>['audio','figure'].includes(s.kind)).map(s=>[s.asset,s.kind])));
  function assetURL(name){
    const kind=assets.get(name); if(!kind||!/^[a-z0-9-]+\.(?:mp3|svg)$/.test(name)) return null;
    return 'assets/'+(kind==='audio'?'audio-307/':'original-307/')+name+'?v=3.0.11';
  }
  const previousStimulus=PE305.stimulus, previousSource=PE305.source;
  PE305.stimulus=function(q){
    if(!ids.has(q?.id)) return previousStimulus(q);
    return (q.stimulus||[]).map(s=>{
      if(s.kind==='audio'){
        const url=assetURL(s.asset);if(!url)return '';
        return '<section class="pe307-audio" aria-label="Comprensión auditiva"><h3 lang="en">'+esc(s.title)+'</h3><p>Escucha el audio y responde. Puedes repetirlo; la transcripción aparecerá al revisar la respuesta.</p><audio controls preload="metadata" aria-label="'+esc(s.title)+'" src="'+esc(url)+'">Tu navegador no reproduce este audio.</audio><p class="tiny">Audio original de práctica · voz sintética. Si no se reproduce, <a href="'+esc(url)+'" target="_blank" rel="noopener">abre el audio en otra pestaña</a>.</p></section>';
      }
      if(s.kind==='figure'){
        const url=assetURL(s.asset);if(!url)return '';
        return '<figure class="pe305-figure pe307-comic"><figcaption>'+esc(s.title)+'</figcaption><img src="'+esc(url)+'" alt="'+esc(s.alt)+'"><a href="'+esc(url)+'" target="_blank" rel="noopener">Ampliar imagen</a><details><summary>Descripción de la imagen</summary><p>'+esc(s.alt)+'</p></details></figure>';
      }
      return previousStimulus({stimulus:[s]});
    }).join('');
  };
  // Existing feedback calls source(); unanswered question views never do.
  PE305.source=function(q){
    if(!ids.has(q?.id))return previousSource(q);
    return q.stimulus.filter(s=>s.kind==='audio').map(s=>'<details class="pe307-transcript"><summary>Leer la transcripción del audio</summary><p lang="en">'+esc(s.transcript)+'</p></details>').join('')+'<p class="tiny pe307-origin">'+esc(q.sourceNote)+' '+esc(q.difficultyNote)+'</p>';
  };
  const formats=[['all','Todas las preguntas'],['classroom','Situaciones de aula'],['reading','Lecturas y cómics'],['audio','Comprensión auditiva']];
  const teaching={'basica-matematica':4,'basica-ciencias':6,'basica-historia':3,'basica-ingles':3,'basica-lenguaje':2,'media-lengua':2};
  function pool(format='all'){
    return Q.filter(q=>ids.has(q.replaces || q.id)&&(format==='all'||format==='classroom'&&q.indicatorId.startsWith(teaching[PE_ACTIVE_SPECIALTY]+'-')||format==='reading'&&q.stimulus.some(s=>['text','figure'].includes(s.kind))||format==='audio'&&q.stimulus.some(s=>s.kind==='audio')));
  }
  function choose(rows,count=5){
    const mixed=shuffle(rows),families=new Set(),selected=[];
    for(const q of mixed)if(!families.has(q.familyId)){families.add(q.familyId);selected.push(q);if(selected.length===count)return selected;}
    return selected.concat(mixed.filter(q=>!selected.includes(q))).slice(0,count);
  }
  function start(format='all',id=null){
    const rows=id?pool().filter(q=>q.id===id):choose(pool(format)); if(!rows.length)return false;
    mode='practice';quiz=rows;pos=0;answers=[];sel=null;showQ();return true;
  }
  const startFromForm=()=>start(document.getElementById('pe307-format')?.value||'all');
  const practiceQuestion=id=>start('all',id);
  function practiceCard(){
    const rows=pool();
    return '<span class="pill">Revisado · 3.0.8</span><h2>50 preguntas nuevas para tu especialidad</h2><p>Resuelve casos y problemas concretos. Al revisar, descubre por qué cada alternativa es correcta o incorrecta.</p><label for="pe307-format">Tipo de práctica</label><select id="pe307-format">'+formats.filter(([id])=>pool(id).length).map(([id,label])=>'<option value="'+id+'">'+label+' ('+pool(id).length+')</option>').join('')+'</select><button class="btn full" onclick="PE307.startFromForm()">Practicar preguntas nuevas</button><details class="pe305-catalog"><summary>Explorar las 50 preguntas nuevas</summary><ol>'+rows.map(q=>'<li><button class="pe305-question-link" data-question-id="'+esc(q.id)+'" onclick="PE307.practiceQuestion(this.dataset.questionId)"><small>'+esc(q.questionType)+'</small><span>'+esc(q.q)+'</span></button></li>').join('')+'</ol></details><p class="tiny">Preguntas originales de práctica ProfeECEP. Dificultad estimada; no son preguntas oficiales del examen.</p>';
  }
  function inject(){
    const target=el('practice'),inQuestion=document.querySelector('.screen.on')?.id==='practice'&&mode==='practice'&&quiz.length&&pos<quiz.length;
    if(target&&!inQuestion&&!target.querySelector('.pe307-practice')){const card=document.createElement('section');card.className='card pe307-practice';card.innerHTML=practiceCard();target.prepend(card);}
    const dashboard=el('home')?.querySelector('.pe302-dashboard');
    if(dashboard&&!dashboard.querySelector('.pe307-home')){
      const card=document.createElement('section');card.className='card pe307-home';
      const isEnglish=PE_ACTIVE_SPECIALTY==='basica-ingles';
      card.innerHTML='<span class="pill">Actualización · 3.0.11</span><h2>'+(isEnglish?'17 preguntas nuevas de comprensión auditiva':'Practica y reporta tus dudas')+'</h2><p>'+(isEnglish?'Escucha las siete pistas de Inglés 2023. Al responder, revisa la transcripción y entiende por qué cada alternativa es correcta o incorrecta. Tu banco suma 147 preguntas.':'Tu especialidad tiene '+Q.length+' ejercicios activos. Puedes guardar el motivo de un problema y descargar tus reportes.')+'</p><button class="btn full" onclick="'+(isEnglish?'PE305.start(\'audio\')':'PE302.navigate(\'practice\',\'.pe307-practice\')')+'">'+(isEnglish?'Practicar comprensión auditiva 2023':'Explorar preguntas de práctica')+'</button>';dashboard.prepend(card);
    }
  }
  window.PE307={fullBank,archived:(sid=PE_ACTIVE_SPECIALTY)=>[...(archived[sid]||[])],pool,choose,start,startFromForm,practiceQuestion,practiceCard,inject,assetURL};
  const previousRender=window.render;
  window.render=function(){const result=previousRender.apply(this,arguments);setTimeout(inject,0);return result;};
  render();setTimeout(inject,0);
}());
