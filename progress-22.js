// Keep the original Mathematics state at the root for compatibility with 2.1.
// Other specialties live in the same JSON document, so existing cloud rows still work.
(function () {
  'use strict';
  const key = 'profeecep', math = 'basica-matematica';
  const ids = [math, 'basica-ciencias', 'basica-historia', 'basica-ingles', 'basica-lenguaje', 'media-lengua'];
  const copy = value => JSON.parse(JSON.stringify(value));
  const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const metadata = ['specialtyProgress', 'specialtyUpdatedAt', 'schemaVersion'];
  const clean = value => Object.fromEntries(Object.entries(object(value)).filter(([k]) => !metadata.includes(k)));
  const time = value => Number.isFinite(Date.parse(value)) ? Date.parse(value) : 0;
  let active = localStorage.getItem('pe_specialty_id') || math;
  if (!ids.includes(active)) { active = math; localStorage.setItem('pe_specialty_id', math); }
  window.PE_ACTIVE_SPECIALTY = active;
  function read() {
    try { return object(JSON.parse(localStorage.getItem(key) || '{}')); } catch (_) { return {}; }
  }
  function backup() {
    const raw = localStorage.getItem(key);
    if (raw && !localStorage.getItem('profeecep_legacy_22')) localStorage.setItem('profeecep_legacy_22', raw);
  }
  function state(envelope, id = active) {
    return copy({...clean(id === math ? envelope : object(envelope.specialtyProgress)[id]), specialtyId: id});
  }
  function merge(local, remote, remoteTime) {
    local = object(local); remote = object(remote);
    const lt = object(local.specialtyUpdatedAt), rt = object(remote.specialtyUpdatedAt);
    const localFallback = localStorage.getItem('pe_local_updated_at');
    const localMathTime = lt[math] || localFallback;
    const remoteMathTime = rt[math] || remoteTime;
    const useRemoteMath = Object.keys(clean(remote)).length > 0 && time(remoteMathTime) >= time(localMathTime);
    const result = copy(clean(useRemoteMath ? remote : local));
    result.schemaVersion = '2.2';
    result.specialtyProgress = {};
    result.specialtyUpdatedAt = {[math]: (useRemoteMath ? remoteMathTime : localMathTime) || '1970-01-01T00:00:00.000Z'};
    const lp = object(local.specialtyProgress), rp = object(remote.specialtyProgress);
    for (const id of new Set([...Object.keys(lp), ...Object.keys(rp)])) {
      const useRemote = rp[id] && (!lp[id] || time(rt[id]) >= time(lt[id]));
      result.specialtyProgress[id] = copy(useRemote ? rp[id] : lp[id]);
      result.specialtyUpdatedAt[id] = (useRemote ? rt[id] : lt[id]) || '1970-01-01T00:00:00.000Z';
    }
    return result;
  }
  window.PE_PROGRESS = {
    ids, math, read, state, merge,
    load: () => state(read()),
    save(value) {
      backup();
      let envelope = read();
      const others = object(envelope.specialtyProgress);
      const stamps = {...object(envelope.specialtyUpdatedAt)};
      if (!stamps[math]) stamps[math] = localStorage.getItem('pe_local_updated_at') || '1970-01-01T00:00:00.000Z';
      if (active === math) envelope = clean(value);
      else others[active] = clean(value);
      stamps[active] = new Date().toISOString();
      envelope = {...envelope, schemaVersion: '2.2', specialtyProgress: others, specialtyUpdatedAt: stamps};
      localStorage.setItem(key, JSON.stringify(envelope));
      return envelope;
    },
    replace(envelope) { backup(); localStorage.setItem(key, JSON.stringify(object(envelope))); },
    reset() { localStorage.removeItem(key); localStorage.removeItem('pe_local_updated_at'); }
  };
}());
