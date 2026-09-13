let PE_SUPABASE=null,PE_USER=null,PE_SYNC_TIMER=null;
const PE_ACCESS="pe_access_token",PE_REFRESH="pe_refresh_token",PE_LOCAL_UPDATED="pe_local_updated_at",PE_OWNER="pe_owner";

async function peConfig(){
  if(PE_SUPABASE)return PE_SUPABASE;
  const r=await fetch("/api/config");
  if(!r.ok)throw new Error("No se pudo cargar la configuración de nube.");
  PE_SUPABASE=await r.json();
  return PE_SUPABASE;
}
function peAuthHeaders(token){
  const h={"Content-Type":"application/json","apikey":PE_SUPABASE.key};
  if(token)h.Authorization="Bearer "+token;
  return h;
}
async function peApi(path,options={}){
  await peConfig();
  const token=options.token===false?null:localStorage.getItem(PE_ACCESS);
  const r=await fetch(PE_SUPABASE.url+path,{...options,headers:{...peAuthHeaders(token),...(options.headers||{})}});
  const txt=await r.text();let data={};try{data=txt?JSON.parse(txt):{}}catch(e){data={message:txt}}
  if(!r.ok)throw new Error(data.msg||data.message||data.error_description||"Error de conexión");
  return data;
}
async function peRefreshSession(){
  const refresh=localStorage.getItem(PE_REFRESH);if(!refresh)return false;
  try{
    const d=await peApi("/auth/v1/token?grant_type=refresh_token",{method:"POST",token:false,body:JSON.stringify({refresh_token:refresh})});
    localStorage.setItem(PE_ACCESS,d.access_token);
    if(d.refresh_token)localStorage.setItem(PE_REFRESH,d.refresh_token);
    return true;
  }catch(e){return false}
}
async function peGetUser(){
  if(!localStorage.getItem(PE_ACCESS))return null;
  try{return await peApi("/auth/v1/user")}
  catch(e){if(await peRefreshSession()){try{return await peApi("/auth/v1/user")}catch(_){} }return null}
}
function peBlankState(){
  return {done:[],right:0,total:0,byDomain:{},wrong:[],diagnosis:null,lastStudy:null,history:[],simulations:[],plan:{examDate:"2026-12-18",minutes:20,daysPerWeek:5}};
}
function peHasMeaningfulLocal(){
  const all=PE_PROGRESS.read();
  return [all,...Object.values(all.specialtyProgress||{})].some(s=>(s.done&&s.done.length)||(s.total||0)||(s.history&&s.history.length)||(s.simulations&&s.simulations.length)||s.diagnosis);
}
function peRestoreActive(){S=Object.assign(peBlankState(),PE_PROGRESS.load());}
async function peCloudRow(){
  if(!PE_USER)return null;
  const rows=await peApi("/rest/v1/user_progress?user_id=eq."+encodeURIComponent(PE_USER.id)+"&select=state,updated_at");
  return Array.isArray(rows)&&rows.length?rows[0]:null;
}
async function pePushCloud(knownRow){
  if(!PE_USER)return;
  const userId=PE_USER.id;
  const row=knownRow===undefined?await peCloudRow():knownRow;
  if(!PE_USER||PE_USER.id!==userId)return;
  const state=PE_PROGRESS.merge(PE_PROGRESS.read(),row&&row.state,row&&row.updated_at);
  PE_PROGRESS.replace(state);peRestoreActive();
  const now=new Date().toISOString();
  await peApi("/rest/v1/user_progress?on_conflict=user_id",{
    method:"POST",
    headers:{"Prefer":"resolution=merge-duplicates,return=representation"},
    body:JSON.stringify({user_id:userId,state,updated_at:now})
  });
  if(!PE_USER||PE_USER.id!==userId)return;
  localStorage.setItem(PE_LOCAL_UPDATED,now);
  peSetAccountButton("Sincronizado");
}
async function peSyncOnLogin(){
  const userId=PE_USER&&PE_USER.id;if(!userId)return;
  const row=await peCloudRow();
  if(!PE_USER||PE_USER.id!==userId)return;
  const owner=localStorage.getItem(PE_OWNER);
  // A different account must never receive another account's local progress.
  if(owner!==userId&&(owner||row)){
    if(peHasMeaningfulLocal())localStorage.setItem("profeecep_backup_"+(owner||"guest"),JSON.stringify(PE_PROGRESS.read()));
    PE_PROGRESS.reset();
    if(row){
      PE_PROGRESS.replace(row.state||{});
      localStorage.setItem(PE_LOCAL_UPDATED,row.updated_at||new Date().toISOString());
    }
  }
  localStorage.setItem(PE_OWNER,userId);
  await pePushCloud(row);
  peRestoreActive();
  render();peSetAccountButton("Sincronizado");
}
function peScheduleSync(){
  if(!PE_USER)return;
  clearTimeout(PE_SYNC_TIMER);
  PE_SYNC_TIMER=setTimeout(()=>pePushCloud().catch(()=>peSetAccountButton("Sin conexión")),900);
}
const peOriginalSaveState=saveState;
saveState=function(){
  peOriginalSaveState();
  localStorage.setItem(PE_LOCAL_UPDATED,new Date().toISOString());
  peScheduleSync();
};

function peEnsureAccountButton(){
  if(document.querySelector(".accountBtn"))return;
  const h=document.querySelector("header");if(!h)return;
  const b=document.createElement("button");b.className="accountBtn";b.onclick=peOpenAuth;h.appendChild(b);peSetAccountButton();
}
function peSetAccountButton(status){
  const b=document.querySelector(".accountBtn");if(!b)return;
  b.textContent=PE_USER?(PE_USER.email||"Cuenta").split("@")[0]:"Cuenta";
  b.title=status||((PE_USER&&"Cuenta sincronizada")||"Iniciar sesión");
}
function peCloseAuth(){document.querySelector(".authOverlay")?.remove()}
function peOpenAuth(){
  peCloseAuth();
  const o=document.createElement("div");o.className="authOverlay";
  o.innerHTML='<div class="authModal"><button class="close" onclick="peCloseAuth()">×</button><h2>Cuenta ProfeECEP</h2><div id="peAuthBody"></div></div>';
  document.body.appendChild(o);peRenderAuth();
}
function peRenderAuth(mode="login"){
  const body=document.getElementById("peAuthBody");if(!body)return;
  if(PE_USER){
    body.innerHTML='<span class="syncBadge">Sincronización activa</span><div class="accountCard"><b>'+PE_USER.email+'</b><p class="muted">Tu progreso se guarda en la nube y puede recuperarse en otro dispositivo.</p><button class="btn full" onclick="peManualSync()">Sincronizar ahora</button><button class="btn ghost full" style="margin-top:8px" onclick="peLogout()">Cerrar sesión</button></div>';
    return;
  }
  body.innerHTML='<div class="authTabs"><button class="'+(mode==="login"?"active":"")+'" onclick="peRenderAuth(\'login\')">Entrar</button><button class="'+(mode==="register"?"active":"")+'" onclick="peRenderAuth(\'register\')">Crear cuenta</button></div>'+(mode==="register"?'<div class="authField"><label>Nombre</label><input id="peName" placeholder="Tu nombre"></div>':'')+'<div class="authField"><label>Correo</label><input id="peEmail" type="email" autocomplete="email"></div><div class="authField"><label>Contraseña</label><input id="pePassword" type="password" minlength="6" autocomplete="'+(mode==="login"?"current-password":"new-password")+'"></div><div id="peAuthMsg" class="authMsg muted"></div><button class="btn full" onclick="'+(mode==="login"?"peLogin()":"peRegister()")+'">'+(mode==="login"?"Iniciar sesión":"Crear cuenta")+'</button>';
}
function peMsg(t,bad=false){const x=document.getElementById("peAuthMsg");if(x){x.textContent=t;x.style.color=bad?"#a33":"#26714c"}}
async function peLogin(){
  const email=document.getElementById("peEmail").value.trim(),password=document.getElementById("pePassword").value;
  if(!email||!password)return peMsg("Completa correo y contraseña.",true);
  peMsg("Ingresando…");
  try{
    const d=await peApi("/auth/v1/token?grant_type=password",{method:"POST",token:false,body:JSON.stringify({email,password})});
    localStorage.setItem(PE_ACCESS,d.access_token);localStorage.setItem(PE_REFRESH,d.refresh_token);PE_USER=d.user;
    await peSyncOnLogin();peRenderAuth();
  }catch(e){peMsg(e.message,true)}
}
async function peRegister(){
  const email=document.getElementById("peEmail").value.trim(),password=document.getElementById("pePassword").value,name=(document.getElementById("peName")?.value||"").trim();
  if(!email||password.length<6)return peMsg("Usa un correo válido y una contraseña de al menos 6 caracteres.",true);
  peMsg("Creando cuenta…");
  try{
    const d=await peApi("/auth/v1/signup",{method:"POST",token:false,body:JSON.stringify({email,password,data:{display_name:name,specialty:"Educación Básica Matemática"}})});
    if(d.access_token){
      localStorage.setItem(PE_ACCESS,d.access_token);localStorage.setItem(PE_REFRESH,d.refresh_token);PE_USER=d.user;await peSyncOnLogin();peRenderAuth();
    }else peMsg("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
  }catch(e){peMsg(e.message,true)}
}
async function peManualSync(){try{await pePushCloud();render();peRenderAuth()}catch(e){alert("No se pudo sincronizar: "+e.message)}}
async function peLogout(){
  clearTimeout(PE_SYNC_TIMER);
  if(PE_USER)localStorage.setItem("profeecep_backup_"+PE_USER.id,JSON.stringify(PE_PROGRESS.read()));
  localStorage.removeItem(PE_ACCESS);localStorage.removeItem(PE_REFRESH);localStorage.removeItem(PE_OWNER);
  PE_USER=null;PE_PROGRESS.reset();peRestoreActive();render();peSetAccountButton();peRenderAuth();
}
async function peBoot(){
  peEnsureAccountButton();
  try{await peConfig();const u=await peGetUser();if(u){PE_USER=u;await peSyncOnLogin()}}catch(e){peSetAccountButton("Nube no disponible")}
}
window.peOpenAuth=peOpenAuth;window.peCloseAuth=peCloseAuth;window.peRenderAuth=peRenderAuth;window.peLogin=peLogin;window.peRegister=peRegister;window.peLogout=peLogout;window.peManualSync=peManualSync;
peBoot();
