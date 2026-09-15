// ProfeECEP 3.0.3 — resilient sessions and acknowledged, owner-scoped sync.
let PE_SUPABASE = null, PE_USER = null, PE_SYNC_TIMER = null;
const PE_ACCESS = 'pe_access_token', PE_REFRESH = 'pe_refresh_token', PE_LOCAL_UPDATED = 'pe_local_updated_at', PE_OWNER = 'pe_owner';
const PE_PROFILE = 'pe_profile_303', PE_PENDING = 'pe_pending_303';
let PE_EPOCH = 0, PE_REFRESH_FLIGHT = null, PE_SYNC_FLIGHT = null, PE_BOOT_FLIGHT = null;
let PE_SYNC_OWNER = null;
let PE_SYNC_AGAIN = false, PE_AUTH_BUSY = false, PE_SYNC_PHASE = 'local', PE_CONFLICT = null;
const peEsc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}[c]));
function peStored(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; } }
function peBaseKey(id) { return 'pe_cloud_base_303_' + id; }
function peBackup(id, state = PE_PROGRESS.read()) { localStorage.setItem('profeecep_backup_' + (id || 'guest'), JSON.stringify(state)); }
function peCurrent(id, epoch) { return PE_EPOCH === epoch && PE_USER?.id === id && localStorage.getItem(PE_OWNER) === id; }
function peCancelled() { const e = new Error('La cuenta cambió.'); e.cancelled = true; return e; }
async function peFetch(url, options = {}) {
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 12000);
  try { return await fetch(url, {...options, signal: controller.signal}); }
  catch (e) { const error = new Error(e.name === 'AbortError' ? 'La conexión tardó demasiado. Tu avance sigue en este dispositivo.' : 'No se pudo conectar. Tu avance sigue en este dispositivo.'); error.network = true; throw error; }
  finally { clearTimeout(timer); }
}
async function peConfig() {
  if (PE_SUPABASE) return PE_SUPABASE;
  const r = await peFetch('/api/config', {cache: 'no-store'});
  if (!r.ok) throw new Error('La nube no está disponible. Puedes continuar estudiando.');
  const config = await r.json();
  if (typeof config.url !== 'string' || !config.url.startsWith('https://') || !config.key) throw new Error('La configuración de nube no es válida.');
  PE_SUPABASE = config; return config;
}
function peAuthHeaders(token) {
  return {'Content-Type': 'application/json', apikey: PE_SUPABASE.key, ...(token ? {Authorization: 'Bearer ' + token} : {})};
}
async function peApi(path, options = {}) {
  const {token: useToken = true, retry = true, expectedOwner, ...request} = options;
  const epoch = PE_EPOCH;
  await peConfig();
  if (PE_EPOCH !== epoch || (expectedOwner && !peCurrent(expectedOwner, epoch))) throw peCancelled();
  const token = useToken === false ? null : localStorage.getItem(PE_ACCESS);
  const r = await peFetch(PE_SUPABASE.url + path, {...request, headers: {...peAuthHeaders(token), ...request.headers}});
  if (r.status === 401 && token && retry && !path.startsWith('/auth/v1/token')) {
    if (await peRefreshSession()) return peApi(path, {...options, retry: false});
  }
  const raw = await r.text(); let data;
  try { data = raw ? JSON.parse(raw) : {}; } catch (_) { throw new Error('La nube devolvió una respuesta no válida.'); }
  if (!r.ok) { const e = new Error(data.msg || data.message || data.error_description || 'No se pudo completar la solicitud.'); e.status = r.status; throw e; }
  return data;
}
async function peRefreshSession() {
  if (PE_REFRESH_FLIGHT) return PE_REFRESH_FLIGHT;
  const epoch = PE_EPOCH, original = localStorage.getItem(PE_REFRESH);
  if (!original) return false;
  const refresh = async () => {
    if (epoch !== PE_EPOCH) throw peCancelled();
    if (localStorage.getItem(PE_REFRESH) !== original) return !!localStorage.getItem(PE_ACCESS);
    try {
      const d = await peApi('/auth/v1/token?grant_type=refresh_token', {method: 'POST', token: false, retry: false, body: JSON.stringify({refresh_token: original})});
      if (epoch !== PE_EPOCH || localStorage.getItem(PE_REFRESH) !== original) throw peCancelled();
      if (!d.access_token || !d.refresh_token) return false;
      localStorage.setItem(PE_ACCESS, d.access_token); localStorage.setItem(PE_REFRESH, d.refresh_token);
      return true;
    } catch (e) { if (e.status === 400 || e.status === 401) return false; throw e; }
  };
  PE_REFRESH_FLIGHT = (navigator.locks ? navigator.locks.request('profeecep-refresh', refresh) : refresh());
  try { return await PE_REFRESH_FLIGHT; } finally { PE_REFRESH_FLIGHT = null; }
}
async function peGetUser() {
  if (!localStorage.getItem(PE_ACCESS) && !(await peRefreshSession())) return null;
  return peApi('/auth/v1/user');
}
function peBlankState() { return {done: [], right: 0, total: 0, byDomain: {}, wrong: [], diagnosis: null, lastStudy: null, history: [], simulations: [], plan: {examDate: '2026-12-18', minutes: 20, daysPerWeek: 5}}; }
function peRestoreActive() { S = Object.assign(peBlankState(), PE_PROGRESS.load()); }
function peHasMeaningfulLocal() { const all = PE_PROGRESS.read(); return PE_PROGRESS.ids.some(id => PE303_SYNC.meaningful(PE_PROGRESS.state(all, id))); }
function peAdoptUser(user) {
  const previous = localStorage.getItem(PE_OWNER);
  if (previous !== user.id) {
    const local = PE_PROGRESS.read(), backup = peStored('profeecep_backup_' + user.id);
    peBackup(previous, local);
    PE_PROGRESS.reset();
    if (backup) PE_PROGRESS.replace(backup);
    else if (!previous) PE_PROGRESS.replace(local); // first guest session; conflicts are checked before upload
    PE_EPOCH++; PE_CONFLICT = null; window.PE303?.resetRuntime();
  }
  PE_USER = {id: user.id, email: user.email || ''};
  localStorage.setItem(PE_OWNER, user.id); localStorage.setItem(PE_PROFILE, JSON.stringify(PE_USER));
  peRestoreActive();
}
function peSyncText() {
  if (!navigator.onLine) return 'Sin conexión · avance guardado en este dispositivo';
  return ({local: 'Avance guardado en este dispositivo', pending: 'Cambios pendientes de sincronizar', syncing: 'Sincronizando…', synced: 'Progreso sincronizado', offline: 'Conexión interrumpida · avance guardado aquí', error: 'No se pudo sincronizar · reintenta desde Cuenta', expired: 'Vuelve a entrar para sincronizar · tu avance está guardado', conflict: 'Hay avances distintos · revísalos en Cuenta'})[PE_SYNC_PHASE];
}
function peSetAccountButton(phase) {
  if (phase) PE_SYNC_PHASE = phase;
  const text = peSyncText(), button = document.querySelector('.accountBtn');
  if (button) { button.textContent = PE_USER ? (PE_USER.email || 'Cuenta').split('@')[0] : 'Cuenta'; button.title = text; }
  document.querySelectorAll('.peSyncStatus,.mobile27Status').forEach(node => { node.textContent = text; });
  const banner = document.getElementById('peConnectionStatus');
  if (banner) { banner.textContent = text; banner.hidden = navigator.onLine && ['local', 'synced'].includes(PE_SYNC_PHASE); }
}
function peSyncFailure(e) {
  if (e.cancelled) return;
  if (e.status === 401) {
    PE_USER = null; localStorage.removeItem(PE_ACCESS); localStorage.removeItem(PE_REFRESH);
    peSetAccountButton('expired');
  } else peSetAccountButton(e.network || !navigator.onLine ? 'offline' : 'error');
}
async function peCloudRow(id = PE_USER?.id) {
  if (!id) return null;
  const rows = await peApi('/rest/v1/user_progress?user_id=eq.' + encodeURIComponent(id) + '&select=state,updated_at', {expectedOwner: id});
  if (!Array.isArray(rows)) throw new Error('No se pudo leer el progreso de nube.');
  return rows[0] || null;
}
function peRefreshScreens() {
  const id = document.querySelector('.screen.on')?.id;
  if (['home', 'map', 'progress'].includes(id)) render(); // never replace a question or its feedback during background sync
}
async function pePerformSync(preference) {
  const id = PE_USER?.id, epoch = PE_EPOCH;
  if (!id || localStorage.getItem(PE_OWNER) !== id) return false;
  if (!navigator.onLine) { peSetAccountButton('offline'); return false; }
  peSetAccountButton('syncing');
  for (let attempt = 0; attempt < 4; attempt++) {
    PE_SYNC_AGAIN = false;
    const row = await peCloudRow(id);
    if (!peCurrent(id, epoch)) return false;
    const local = PE_PROGRESS.read(), base = peStored(peBaseKey(id));
    const choice = preference && preference.version === row?.updated_at && preference.local === JSON.stringify(local) ? preference.source : null;
    const merged = PE303_SYNC.reconcile(local, row?.state, base, row?.updated_at, choice);
    if (merged.conflicts.length && !choice) {
      PE_CONFLICT = {id, local, remote: row.state, version: row.updated_at, specialties: merged.conflicts};
      peBackup(id, local); peSetAccountButton('conflict'); peRenderAuth(); return false;
    }
    const now = new Date(Math.max(Date.now(), (Date.parse(row?.updated_at) || 0) + 1)).toISOString();
    const state = merged.state;
    let rows;
    if (row) {
      rows = await peApi('/rest/v1/user_progress?user_id=eq.' + encodeURIComponent(id) + '&updated_at=eq.' + encodeURIComponent(row.updated_at), {method: 'PATCH', expectedOwner: id, headers: {Prefer: 'return=representation'}, body: JSON.stringify({state, updated_at: now})});
    } else {
      rows = await peApi('/rest/v1/user_progress?on_conflict=user_id', {method: 'POST', expectedOwner: id, headers: {Prefer: 'resolution=ignore-duplicates,return=representation'}, body: JSON.stringify({user_id: id, state, updated_at: now})});
    }
    if (!peCurrent(id, epoch)) return false;
    if (!Array.isArray(rows)) throw new Error('No se confirmó el guardado en la nube.');
    if (!rows.length) continue; // another device won the write; read it again instead of overwriting it
    // A local edit made while the request was running must remain pending.
    if (JSON.stringify(PE_PROGRESS.read()) !== JSON.stringify(local)) {
      localStorage.setItem(peBaseKey(id), JSON.stringify(local)); PE_SYNC_AGAIN = true; continue;
    }
    PE_PROGRESS.replace(state); peRestoreActive();
    localStorage.setItem(peBaseKey(id), JSON.stringify(state));
    localStorage.setItem(PE_LOCAL_UPDATED, now); localStorage.removeItem(PE_PENDING);
    PE_CONFLICT = null; peSetAccountButton('synced'); peRefreshScreens(); return true;
  }
  peSetAccountButton('pending'); return false;
}
async function pePushCloud(preference) {
  if (PE_SYNC_FLIGHT) {
    const owner = PE_SYNC_OWNER; PE_SYNC_AGAIN = true;
    const result = await PE_SYNC_FLIGHT.catch(() => false);
    if (PE_USER && owner !== PE_USER.id) return pePushCloud(preference);
    return result;
  }
  PE_SYNC_OWNER = PE_USER?.id;
  PE_SYNC_FLIGHT = pePerformSync(preference);
  try { return await PE_SYNC_FLIGHT; }
  catch (e) { peSyncFailure(e); throw e; }
  finally { PE_SYNC_FLIGHT = null; PE_SYNC_OWNER = null; if (PE_SYNC_AGAIN && !PE_CONFLICT && PE_USER && navigator.onLine) peScheduleSync(); }
}
async function peSyncOnLogin() { return pePushCloud(); }
function peScheduleSync() {
  clearTimeout(PE_SYNC_TIMER);
  if (!PE_USER || PE_AUTH_BUSY || PE_CONFLICT) return;
  PE_SYNC_TIMER = setTimeout(() => pePushCloud().catch(() => {}), 900);
}
const peOriginalSaveState = saveState;
saveState = function () {
  peOriginalSaveState(); localStorage.setItem(PE_LOCAL_UPDATED, new Date().toISOString());
  if (localStorage.getItem(PE_OWNER)) {
    localStorage.setItem(PE_PENDING, '1'); PE_SYNC_AGAIN = !!PE_SYNC_FLIGHT;
    peSetAccountButton(PE_CONFLICT ? 'conflict' : 'pending'); peScheduleSync();
  }
};
function peEnsureAccountButton() {
  const header = document.querySelector('header');
  if (header && !document.querySelector('.accountBtn')) { const button = document.createElement('button'); button.className = 'accountBtn'; button.onclick = peOpenAuth; header.appendChild(button); }
  const main = document.getElementById('main-content');
  if (main && !document.getElementById('peConnectionStatus')) { const banner = document.createElement('div'); banner.id = 'peConnectionStatus'; banner.className = 'pe303-connection'; banner.setAttribute('role', 'status'); main.prepend(banner); }
  peSetAccountButton();
}
function peCloseAuth() { document.querySelector('.authOverlay')?.remove(); }
function peOpenAuth() {
  peCloseAuth(); const overlay = document.createElement('div'); overlay.className = 'authOverlay';
  overlay.innerHTML = '<div class="authModal"><button class="close" onclick="peCloseAuth()">×</button><h2>Cuenta ProfeECEP</h2><div id="peAuthBody"></div></div>';
  document.body.appendChild(overlay); peRenderAuth();
}
function peConflictHTML() {
  if (!PE_CONFLICT) return '';
  const names = PE_CONFLICT.specialties.map(id => window.PE20?.registry.find(s => s.id === id)?.short || id).map(peEsc).join(', ');
  return '<div class="card warning"><h3>Revisa los avances distintos</h3><p>' + names + '</p><p>Esta especialidad cambió aquí y en otro dispositivo. Descarga las copias antes de elegir cuál conservar para las especialidades indicadas.</p><div class="pe303-actions"><button class="btn ghost" onclick="peDownloadConflict(\'local\')">Descargar copia de este dispositivo</button><button class="btn ghost" onclick="peDownloadConflict(\'cloud\')">Descargar copia de la nube</button><button class="btn" onclick="peResolveConflict(\'local\')">Conservar este dispositivo</button><button class="btn" onclick="peResolveConflict(\'cloud\')">Conservar la nube</button></div></div>';
}
function peRenderAuth(mode = 'login') {
  const body = document.getElementById('peAuthBody'); if (!body) return;
  if (PE_USER) {
    body.innerHTML = '<div class="peSyncStatus syncBadge" role="status">' + peEsc(peSyncText()) + '</div><div class="accountCard"><b>' + peEsc(PE_USER.email) + '</b><p class="muted">Puedes seguir estudiando sin conexión. Los cambios pendientes se enviarán al recuperar internet.</p>' + peConflictHTML() + '<div class="pe303-actions"><button class="btn full" onclick="peManualSync()">Sincronizar ahora</button><button class="btn ghost full" onclick="peLogout()">Cerrar sesión</button></div></div>';
    return;
  }
  body.innerHTML = '<div class="authTabs"><button type="button" aria-pressed="' + (mode === 'login') + '" onclick="peRenderAuth(\'login\')">Entrar</button><button type="button" aria-pressed="' + (mode === 'register') + '" onclick="peRenderAuth(\'register\')">Crear cuenta</button></div><form onsubmit="event.preventDefault();' + (mode === 'login' ? 'peLogin()' : 'peRegister()') + '">' + (mode === 'register' ? '<div class="authField"><label for="peName">Nombre</label><input id="peName" autocomplete="name" maxlength="100"></div>' : '') + '<div class="authField"><label for="peEmail">Correo</label><input id="peEmail" type="email" autocomplete="email" required></div><div class="authField"><label for="pePassword">Contraseña</label><input id="pePassword" type="password" required minlength="6" autocomplete="' + (mode === 'login' ? 'current-password' : 'new-password') + '"></div><div id="peAuthMsg" class="authMsg muted" role="status">' + (PE_SYNC_PHASE === 'expired' ? peEsc(peSyncText()) : '') + '</div><button class="btn full" type="submit">' + (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta') + '</button></form>';
}
function peMsg(text, bad = false) { const node = document.getElementById('peAuthMsg'); if (node) { node.textContent = text; node.classList.toggle('pe303-error', bad); } }
function peAuthBusy(busy) { PE_AUTH_BUSY = busy; document.querySelectorAll('#peAuthBody button').forEach(button => { button.disabled = busy; }); }
async function peAuthenticate(register) {
  if (PE_AUTH_BUSY) return;
  const email = document.getElementById('peEmail').value.trim(), password = document.getElementById('pePassword').value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) return peMsg('Usa un correo válido y una contraseña de al menos 6 caracteres.', true);
  const epoch = PE_EPOCH; peAuthBusy(true); peMsg(register ? 'Creando cuenta…' : 'Ingresando…');
  try {
    const body = {email, password};
    if (register) body.data = {display_name: (document.getElementById('peName')?.value || '').trim(), specialty: window.PE20?.active().name || 'Educación Básica Matemática'};
    const data = await peApi(register ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password', {method: 'POST', token: false, body: JSON.stringify(body)});
    if (epoch !== PE_EPOCH) return;
    if (!data.access_token) { peMsg('Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.'); return; }
    if (!data.user?.id || !data.refresh_token) throw new Error('No se pudo validar la sesión.');
    peAdoptUser(data.user);
    localStorage.setItem(PE_ACCESS, data.access_token); localStorage.setItem(PE_REFRESH, data.refresh_token);
    try { await peSyncOnLogin(); } catch (_) { /* signed in, with locally preserved pending data */ }
    peRenderAuth(); peRefreshScreens();
  } catch (e) { if (!e.cancelled) peMsg(e.message, true); }
  finally { peAuthBusy(false); }
}
function peLogin() { return peAuthenticate(false); }
function peRegister() { return peAuthenticate(true); }
async function peManualSync() {
  if (PE_AUTH_BUSY) return;
  peAuthBusy(true);
  try { await pePushCloud(); } catch (_) {} finally { peAuthBusy(false); peRenderAuth(); }
}
function peDownloadConflict(source) {
  if (!PE_CONFLICT) return;
  const data = source === 'cloud' ? PE_CONFLICT.remote : PE_CONFLICT.local;
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}));
  link.download = 'profeecep-' + source + '-' + new Date().toISOString().slice(0, 10) + '.json'; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 500);
}
async function peResolveConflict(source) {
  if (!PE_CONFLICT || PE_AUTH_BUSY || !['local', 'cloud'].includes(source)) return;
  const choice = {source, version: PE_CONFLICT.version, local: JSON.stringify(PE_CONFLICT.local)};
  peAuthBusy(true);
  try { await pePushCloud(choice); } catch (_) {} finally { peAuthBusy(false); peRenderAuth(); }
}
async function peLogout() {
  if (PE_AUTH_BUSY) return;
  peAuthBusy(true); clearTimeout(PE_SYNC_TIMER);
  try {
    if (PE_USER && navigator.onLine && !PE_CONFLICT) { try { await pePushCloud(); } catch (_) {} }
    const id = localStorage.getItem(PE_OWNER), token = localStorage.getItem(PE_ACCESS), config = PE_SUPABASE;
    peBackup(id); PE_EPOCH++; PE_USER = null; PE_CONFLICT = null; PE_SYNC_AGAIN = false;
    localStorage.removeItem(PE_ACCESS); localStorage.removeItem(PE_REFRESH); localStorage.removeItem(PE_OWNER); localStorage.removeItem(PE_PROFILE); localStorage.removeItem(PE_PENDING);
    window.PE303?.resetRuntime(); PE_PROGRESS.reset(); peRestoreActive(); render(); go('home'); peSetAccountButton('local'); peRenderAuth();
    if (token && config && navigator.onLine) { try { await peFetch(config.url + '/auth/v1/logout?scope=local', {method: 'POST', headers: peAuthHeaders(token)}); } catch (_) {} }
  } finally { peAuthBusy(false); }
}
async function peReconnect() {
  if (PE_BOOT_FLIGHT || PE_AUTH_BUSY) return PE_BOOT_FLIGHT;
  if (!navigator.onLine) { peSetAccountButton('offline'); return; }
  if (!localStorage.getItem(PE_ACCESS) && !localStorage.getItem(PE_REFRESH)) { peSetAccountButton(localStorage.getItem(PE_OWNER) ? 'expired' : 'local'); return; }
  const epoch = PE_EPOCH;
  PE_BOOT_FLIGHT = (async () => {
    try {
      const user = await peGetUser();
      if (epoch !== PE_EPOCH) return;
      if (!user?.id) { peSetAccountButton('expired'); return; }
      peAdoptUser(user); await pePushCloud();
    } catch (e) { peSyncFailure(e); }
    finally { PE_BOOT_FLIGHT = null; }
  })();
  return PE_BOOT_FLIGHT;
}
function peBoot() {
  const profile = peStored(PE_PROFILE);
  if (profile?.id === localStorage.getItem(PE_OWNER) && localStorage.getItem(PE_ACCESS)) PE_USER = profile;
  peEnsureAccountButton(); if (PE_USER) peSetAccountButton('pending');
  return peReconnect();
}
window.addEventListener('online', () => { peSetAccountButton('pending'); peReconnect(); });
window.addEventListener('offline', () => peSetAccountButton('offline'));
window.addEventListener('focus', () => { if (!PE_CONFLICT) peReconnect(); });
window.addEventListener('storage', event => {
  if (![PE_OWNER, PE_ACCESS].includes(event.key)) return;
  const profile = peStored(PE_PROFILE), owner = localStorage.getItem(PE_OWNER);
  if (owner !== PE_USER?.id) {
    PE_EPOCH++; PE_CONFLICT = null; PE_SYNC_AGAIN = false; clearTimeout(PE_SYNC_TIMER);
    PE_USER = profile?.id === owner ? profile : null;
    window.PE303?.resetRuntime(); peRestoreActive(); render(); go('home'); peSetAccountButton(PE_USER ? 'pending' : 'local'); peRenderAuth();
  }
});
peBoot();
