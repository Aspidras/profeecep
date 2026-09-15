const test = require('node:test');
const assert = require('node:assert/strict');
const {runtime, element} = require('./helpers/runtime.cjs');
const copy = value => JSON.parse(JSON.stringify(value));
const response = (data, status = 200) => new Response(JSON.stringify(data), {status, headers: {'Content-Type': 'application/json'}});
function cloud() {
  const rows = new Map(), sessions = new Map(), refreshes = new Map(), expired = new Set(), calls = [];
  let version = 0, refreshCount = 0;
  const issue = id => { const token = 'access-' + id + '-' + (++version), refresh = 'refresh-' + id + '-' + version; sessions.set(token, id); refreshes.set(refresh, id); return {access_token: token, refresh_token: refresh, user: {id, email: id + '@example.test'}}; };
  const server = {rows, sessions, refreshes, expired, calls, issue, beforeWrite: null, afterWrite: null, failWrite: false, refreshCount: () => refreshCount};
  server.fetch = async (url, options = {}) => {
    const parsed = new URL(url, 'https://profeecep.test'), path = parsed.pathname, body = options.body ? JSON.parse(options.body) : null;
    calls.push({path, method: options.method || 'GET', body, headers: options.headers});
    if (path === '/api/config') return response({url: 'https://cloud.test', key: 'publishable-test-key'});
    if (path === '/auth/v1/token') {
      if (parsed.searchParams.get('grant_type') === 'refresh_token') {
        refreshCount++; const id = refreshes.get(body.refresh_token); return id ? response(issue(id)) : response({message: 'Invalid refresh token'}, 400);
      }
      if (body.password !== 'example-password') return response({message: 'Credenciales incorrectas'}, 400);
      return response(issue(body.email.split('@')[0]));
    }
    const token = options.headers?.Authorization?.replace('Bearer ', ''), id = sessions.get(token);
    if (!id || expired.has(token)) return response({message: 'JWT expired'}, 401);
    if (path === '/auth/v1/user') return response({id, email: id + '@example.test'});
    if (path === '/auth/v1/logout') { sessions.delete(token); return response({}); }
    if (path !== '/rest/v1/user_progress') return response({}, 404);
    if (!options.method || options.method === 'GET') return response(rows.has(id) ? [rows.get(id)] : []);
    if (server.failWrite) throw Error('network unavailable');
    if (server.beforeWrite) { const action = server.beforeWrite; server.beforeWrite = null; await action(id); }
    const row = rows.get(id);
    if (options.method === 'PATCH' && row?.updated_at !== parsed.searchParams.get('updated_at').slice(3)) return response([]);
    if (options.method === 'POST' && row && options.headers.Prefer.includes('ignore-duplicates')) return response([]);
    if (body.user_id && body.user_id !== id) return response({message: 'RLS'}, 403);
    const updated = {state: copy(body.state), updated_at: body.updated_at}; rows.set(id, updated);
    if (server.afterWrite) { const action = server.afterWrite; server.afterWrite = null; await action(id); }
    return response([updated]);
  };
  return server;
}
function device(server, storage, options = {}) {
  let app;
  app = runtime('basica-matematica', {storage, ...options, fetch: (...args) => { if (app && !app.context.navigator.onLine) throw Error('offline'); return server.fetch(...args); }});
  for (const id of ['peEmail', 'pePassword', 'peAuthMsg', 'peAuthBody']) app.elements.set(id, element(id));
  app.login = async (id = 'alice') => { app.elements.get('peEmail').value = id + '@example.test'; app.elements.get('pePassword').value = 'example-password'; await app.run('peLogin()'); };
  return app;
}
async function offline(app) { app.context.navigator.onLine = false; await app.emit('offline'); }
async function online(app) { app.context.navigator.onLine = true; await app.emit('online'); await app.run('PE_BOOT_FLIGHT'); }

test('login + cambio de dispositivo recupera el progreso de nube', async () => {
  const server = cloud(), first = device(server); await first.login();
  first.run("S.done=['0-0-0'];saveState()"); await first.run('pePushCloud()');
  const second = device(server); await second.login();
  assert.deepEqual(copy(second.run('S.done')), ['0-0-0']); assert.equal(second.run('PE_SYNC_PHASE'), 'synced');
});
test('recargar sin conexión conserva la cuenta y reintenta al volver internet', async () => {
  const server = cloud(), first = device(server); await first.login(); await offline(first);
  first.run("S.done=['0-0-1'];saveState()");
  const stored = first.storage, next = device(server, stored, {online: false}); await next.run('PE_BOOT_FLIGHT'); assert.equal(next.run('PE_USER.id'), 'alice'); assert.equal(next.run('PE_SYNC_PHASE'), 'offline');
  next.run("S.done.push('0-0-2');saveState()"); await online(next);
  assert.deepEqual(server.rows.get('alice').state.done, ['0-0-1', '0-0-2']);
  assert.equal(next.storage.has('pe_pending_303'), false);
});
test('cerrar sesión sin conexión recupera su copia pendiente en el siguiente login', async () => {
  const server = cloud(), app = device(server); await app.login(); await offline(app);
  app.run("S.done=['0-0-2'];saveState()"); await app.run('peLogout()');
  assert.equal(app.run('S.done.length'), 0); app.context.navigator.onLine = true; await app.login();
  assert.deepEqual(copy(app.run('S.done')), ['0-0-2']); assert.deepEqual(server.rows.get('alice').state.done, ['0-0-2']);
});
test('un token vencido se renueva durante la sincronización y se reintenta una vez', async () => {
  const server = cloud(), app = device(server); await app.login();
  server.expired.add(app.storage.get('pe_access_token'));
  app.run("S.done=['0-0-3'];saveState()"); await app.run('pePushCloud()');
  assert.equal(server.refreshCount(), 1); assert.deepEqual(server.rows.get('alice').state.done, ['0-0-3']);
});
test('peticiones paralelas comparten una sola renovación de sesión', async () => {
  const server = cloud(), app = device(server); await app.login(); server.expired.add(app.storage.get('pe_access_token'));
  const users = await app.run("Promise.all([peApi('/auth/v1/user'),peApi('/auth/v1/user')])");
  assert.equal(users.length, 2); assert.equal(server.refreshCount(), 1);
});
test('error de red conserva tokens y diferencia los cambios pendientes', async () => {
  const server = cloud(), app = device(server); await app.login(); server.failWrite = true;
  app.run("S.done=['0-0-4'];saveState()"); await assert.rejects(app.run('pePushCloud()'));
  assert.ok(app.storage.get('pe_refresh_token')); assert.equal(app.run('PE_SYNC_PHASE'), 'offline');
  server.failWrite = false; await online(app); assert.deepEqual(server.rows.get('alice').state.done, ['0-0-4']);
});
test('un guardado local mientras se sube otro no se marca como sincronizado prematuramente', async () => {
  const server = cloud(), app = device(server); await app.login(); app.run("S.done=['0-0-0'];saveState()");
  server.afterWrite = () => app.run("S.done.push('0-0-1');saveState()");
  await app.run('pePushCloud()');
  assert.deepEqual(server.rows.get('alice').state.done, ['0-0-0', '0-0-1']); assert.equal(app.run('PE_SYNC_PHASE'), 'synced');
});
test('dos dispositivos editan especialidades distintas sin eliminar el otro avance', async () => {
  const server = cloud(), a = device(server), b = device(server); await a.login(); await b.login();
  a.run("S.done=['0-0-0'];saveState()"); await a.run('pePushCloud()');
  b.run("const envelope=PE_PROGRESS.read();envelope.specialtyProgress['basica-ciencias']={done:['1-0-0']};PE_PROGRESS.replace(envelope)");
  await b.run('pePushCloud()');
  assert.deepEqual(server.rows.get('alice').state.done, ['0-0-0']); assert.deepEqual(server.rows.get('alice').state.specialtyProgress['basica-ciencias'].done, ['1-0-0']);
});
test('conflicto en la misma especialidad preserva ambas versiones hasta una elección', async () => {
  const server = cloud(), a = device(server), b = device(server); await a.login(); await b.login();
  a.run("S.done=['0-0-0'];saveState()"); await a.run('pePushCloud()'); b.run("S.done=['0-0-1'];saveState()");
  assert.equal(await b.run('pePushCloud()'), false); assert.equal(b.run('PE_SYNC_PHASE'), 'conflict');
  assert.deepEqual(server.rows.get('alice').state.done, ['0-0-0']); assert.deepEqual(copy(b.run('S.done')), ['0-0-1']);
  await b.run("peResolveConflict('cloud')"); assert.deepEqual(copy(b.run('S.done')), ['0-0-0']);
});
test('una elección antigua no sobrescribe cambios de nube posteriores', async () => {
  const server = cloud(), a = device(server), b = device(server); await a.login(); await b.login();
  a.run("S.done=['0-0-0'];saveState()"); await a.run('pePushCloud()'); b.run("S.done=['0-0-1'];saveState()"); await b.run('pePushCloud()');
  a.run("S.done.push('0-0-2');saveState()"); await a.run('pePushCloud()'); await b.run("peResolveConflict('local')");
  assert.equal(b.run('PE_SYNC_PHASE'), 'conflict'); assert.deepEqual(server.rows.get('alice').state.done, ['0-0-0', '0-0-2']);
});
test('la actualización condicional detecta una carrera entre la lectura y el guardado', async () => {
  const server = cloud(), app = device(server); await app.login(); app.run("S.done=['0-0-1'];saveState()");
  server.beforeWrite = id => { const row = copy(server.rows.get(id)); row.state.done = ['0-0-2']; row.updated_at = new Date(Date.parse(row.updated_at) + 1000).toISOString(); server.rows.set(id, row); };
  await app.run('pePushCloud()'); assert.equal(app.run('PE_SYNC_PHASE'), 'conflict'); assert.deepEqual(server.rows.get('alice').state.done, ['0-0-2']);
});
test('cambiar de cuenta nunca envía el progreso de la anterior', async () => {
  const server = cloud(), app = device(server); await app.login(); await offline(app); app.run("S.done=['0-0-1'];saveState()");
  app.context.navigator.onLine = true; await app.login('bob');
  assert.deepEqual(server.rows.get('bob').state.done, []); assert.deepEqual(JSON.parse(app.storage.get('profeecep_backup_alice')).done, ['0-0-1']);
});
test('la sesión queda abierta y explica el fallo si la nube falla después del login', async () => {
  const server = cloud(), app = device(server); server.failWrite = true; await app.login();
  assert.equal(app.run('PE_USER.id'), 'alice'); assert.match(app.elements.get('peAuthBody').innerHTML, /interrumpida/);
});
test('login inválido no crea una cuenta local ni cambia el avance', async () => {
  const server = cloud(), app = device(server); app.run("S.done=['0-0-1'];saveState()");
  app.elements.get('peEmail').value = 'alice@example.test'; app.elements.get('pePassword').value = 'incorrect-password'; await app.run('peLogin()');
  assert.equal(app.run('PE_USER'), null); assert.deepEqual(copy(app.run('S.done')), ['0-0-1']);
});
test('cerrar sesión en línea revoca la sesión de este dispositivo', async () => {
  const server = cloud(), app = device(server); await app.login(); const token = app.storage.get('pe_access_token'); await app.run('peLogout()');
  assert.equal(server.sessions.has(token), false); assert.equal(app.storage.has('pe_access_token'), false);
});
module.exports = {cloud, device};


test('cambiar de cuenta durante un guardado pendiente sincroniza la nueva cuenta por separado', async () => {
  const server = cloud(), app = device(server); await app.login(); app.run("S.done=['0-0-1'];saveState()");
  let release, entered; const reached = new Promise(resolve => entered = resolve);
  server.beforeWrite = async () => { entered(); await new Promise(resolve => release = resolve); };
  const old = app.run('pePushCloud()'); await reached;
  const changed = app.login('bob');
  for (let i=0; i<10; i++) await Promise.resolve();
  release(); await Promise.all([old, changed]);
  assert.equal(app.run('PE_USER.id'), 'bob'); assert.deepEqual(copy(app.run('S.done')), []); assert.deepEqual(server.rows.get('bob').state.done, []);
});
test('sesión revocada pide volver a entrar y conserva el avance local', async () => {
  const server = cloud(), app = device(server); await app.login(); app.run("S.done=['0-0-4'];saveState()");
  server.expired.add(app.storage.get('pe_access_token')); server.refreshes.clear(); await app.run('peReconnect()');
  assert.equal(app.run('PE_SYNC_PHASE'), 'expired'); assert.equal(app.run('PE_USER'), null); assert.deepEqual(copy(app.run('S.done')), ['0-0-4']);
});
