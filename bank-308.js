// ECEP 2026 editorial revisions. Historical IDs retain their original answers.
(function () {
  'use strict';
  const esc=PE304.esc, previousFull=PE307.fullBank, historical={}, retired={}, revised={};
  const replacements=new Map(PE308_ITEMS.map(q=>[q.replaces,q]));
  for(const sid of new Set(PE308_ITEMS.map(q=>q.specialtyId))){
    if(sid==='basica-matematica' && sid!==PE_ACTIVE_SPECIALTY)continue;
    const bank=sid===PE_ACTIVE_SPECIALTY?QBANK:PE22_CONTENT[sid]?.questions;
    if(!bank)throw new Error('Banco no disponible: '+sid);
    historical[sid]=previousFull(sid);
    retired[sid]=bank.filter(q=>replacements.has(q.id));
    const syllabus=sid==='basica-matematica'?ECEP_DATA:PE_SYLLABUS_2026[sid];
    revised[sid]=[];
    const next=bank.map(original=>{
      const patch=replacements.get(original.id);if(!patch)return original;
      const [d,s,i]=patch.indicatorId.split('-').map(Number),domain=syllabus[d],sub=domain?.[1]?.[s],indicator=sub?.[1]?.[i];
      if(!indicator || patch.specialtyId!==sid)throw new Error('Revisión inválida: '+patch.id);
      const q={...patch,d:domain[0],i:sub[0],indicator};revised[sid].push(q);return q;
    });
    if(revised[sid].length!==PE308_ITEMS.filter(q=>q.specialtyId===sid).length)throw new Error('Revisión incompleta: '+sid);
    bank.splice(0,bank.length,...next);
  }
  PE307.fullBank=(sid=PE_ACTIVE_SPECIALTY)=>[...(historical[sid]||[]),...(revised[sid]||[])];
  const ids=new Set(PE308_ITEMS.map(q=>q.id));
  const assets=new Set(PE308_ITEMS.flatMap(q=>(q.stimulus||[]).filter(s=>s.asset).map(s=>s.asset)));
  function assetURL(name){
    if(!assets.has(name)||!/^[a-z0-9-]+\.(?:svg|mp3)$/.test(name))return null;
    if(name.startsWith('308-')&&name.endsWith('.svg'))return 'assets/revision-308/'+name+'?v=3.0.8';
    return PE307.assetURL(name)||PE305.assetURL(name);
  }
  const previousStimulus=PE305.stimulus, previousSource=PE305.source;
  PE305.stimulus=function(q){
    if(!ids.has(q?.id))return previousStimulus(q);
    return (q.stimulus||[]).map(s=>{
      if(s.kind==='audio'){
        const url=assetURL(s.asset);if(!url)return '';
        return '<section class="pe307-audio" aria-label="Comprensión auditiva"><h3 lang="en">'+esc(s.title)+'</h3><p>Escucha el audio y responde. Puedes repetirlo; la transcripción aparecerá al revisar la respuesta.</p><audio controls preload="metadata" aria-label="'+esc(s.title)+'" src="'+esc(url)+'">Tu navegador no reproduce este audio.</audio><p class="tiny">Audio original de práctica · voz sintética. Si no se reproduce, <a href="'+esc(url)+'" target="_blank" rel="noopener">abre el audio en otra pestaña</a>.</p></section>';
      }
      if(s.kind==='figure'){
        const url=assetURL(s.asset);if(!url)return '';
        return '<figure class="pe305-figure"><figcaption>'+esc(s.title)+'</figcaption><img src="'+esc(url)+'" alt="'+esc(s.alt)+'" loading="eager"><a href="'+esc(url)+'" target="_blank" rel="noopener">Ampliar imagen</a><details><summary>Descripción de la imagen</summary><p>'+esc(s.alt)+'</p></details></figure>';
      }
      return previousStimulus({stimulus:[s]});
    }).join('');
  };
  PE305.source=function(q){
    if(!ids.has(q?.id))return previousSource(q);
    return (q.stimulus||[]).filter(s=>s.kind==='audio').map(s=>'<details class="pe307-transcript"><summary>Leer la transcripción del audio</summary><p lang="en">'+esc(s.transcript)+'</p></details>').join('')+
      previousSource(q)+'<p class="tiny pe308-revision">Pregunta revisada · 3.0.8 · Temario 2026. '+esc(q.sourceNote||'Actividad de práctica ProfeECEP.')+'</p>';
  };
  // Error practice follows the revised question; saved answers keep their IDs.
  function current(id){return Q.find(q=>q.id===id||q.replaces===id)||null;}
  window.PE308={version:'3.0.8',pool:()=>Q.filter(q=>ids.has(q.id)),archived:(sid=PE_ACTIVE_SPECIALTY)=>[...(retired[sid]||[])],current,assetURL};
  const previousCheck=window.checkAnswer;
  window.checkAnswer=function(){
    const question=quiz[pos], answeredBefore=answers.some(a=>a.id===question?.id);
    const result=previousCheck.apply(this,arguments);
    if(mode==='practice'&&!answeredBefore&&question?.replaces&&answers.some(a=>a.id===question.id&&a.ok)&&S.wrong.includes(question.replaces)){
      S.wrong=S.wrong.filter(id=>id!==question.replaces);saveState();
    }
    return result;
  };
  render();
}());
