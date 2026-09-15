// ProfeECEP 2.7 — continuidad móvil y respaldo local
(function(){
 'use strict';
 let deferred=null;
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 function download(){const blob=new Blob([JSON.stringify(PE_PROGRESS.read(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='profeecep-respaldo-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
 function importFile(input){
  const file=input.files&&input.files[0];if(!file)return;
  if(file.size>5*1024*1024){alert('El respaldo es demasiado grande. Usa un archivo de hasta 5 MB.');input.value='';return;}
  const owner=localStorage.getItem('pe_owner'),reader=new FileReader();
  reader.onload=()=>{try{
   const data=JSON.parse(reader.result);
   if(!PE303_SYNC.validBackup(data))throw Error('invalid');
   if(owner!==localStorage.getItem('pe_owner')){alert('La cuenta cambió. Selecciona el respaldo de nuevo.');return;}
   if(!confirm('¿Restaurar este respaldo? Reemplazará el avance local de las especialidades incluidas.'))return;
   localStorage.setItem('profeecep_before_import_303',JSON.stringify(PE_PROGRESS.read()));
   PE_PROGRESS.replace(PE303_SYNC.importBackup(PE_PROGRESS.read(),data));window.PE303?.resetRuntime();peRestoreActive();saveState();render();alert('Respaldo restaurado correctamente.');
  }catch(e){alert('El archivo no es un respaldo válido de ProfeECEP. Tu avance no se ha reemplazado.');}finally{input.value='';}};
  reader.onerror=()=>{alert('No se pudo leer el respaldo. Tu avance sigue guardado.');input.value='';};reader.readAsText(file);
 }

 function install(){if(deferred){deferred.prompt();deferred.userChoice.finally(()=>{deferred=null})}else alert('Para instalarla: abre el menú del navegador y elige “Agregar a pantalla de inicio”.')}
 function inject(){peSetAccountButton();const home=el('home'),progress=el('progress');if(home&&!home.querySelector('.mobile27home')){const c=document.createElement('div');c.className='card mobile27home';const offline=!navigator.onLine;c.innerHTML='<span class="pill">Móvil 2.7</span><h3>Tu preparación te acompaña</h3><p class="muted">Instálala en la pantalla de inicio y sigue estudiando aunque pierdas conexión.</p><div class="mobile27Status">'+(offline?'Sin conexión · datos locales activos':'Conexión disponible · datos guardados localmente')+'</div><button class="btn full" onclick="PE27.install()">Instalar en mi teléfono</button>';const hero=home.querySelector('.hero');if(hero)hero.after(c);else home.prepend(c)}if(progress&&!progress.querySelector('.mobile27')){const c=document.createElement('div');c.className='card mobile27';c.innerHTML='<span class="pill">Respaldo 2.7</span><h3>Protege tu progreso</h3><p class="muted">Guarda una copia del avance en tu teléfono o restáurala cuando cambies de dispositivo.</p><div class="mobile27Actions"><button class="btn" onclick="PE27.download()">Descargar respaldo</button><label class="btn ghost">Restaurar respaldo<input type="file" accept="application/json" onchange="PE27.importFile(this)"></label></div>';progress.prepend(c)}}
 window.PE27={inject,download,importFile,install};
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;inject()});window.addEventListener('online',inject);window.addEventListener('offline',inject);
 if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
 const old=window.render;if(old&&!window.__pe27){window.render=function(){const r=old();setTimeout(inject,0);return r};window.__pe27=true}setTimeout(inject,0);
}());
