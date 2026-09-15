// ProfeECEP 3.0.3 — compare against the last acknowledged cloud snapshot.
(function () {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const defaults = {done: [], right: 0, total: 0, byDomain: {}, wrong: [], diagnosis: null, lastStudy: null, history: [], simulations: [], plan: {examDate: '2026-12-18', minutes: 20, daysPerWeek: 5}};
  function normalized(value) {
    const data = {...defaults, ...value, plan: {...defaults.plan, ...value?.plan}};
    for (const key of ['schemaVersion', 'specialtyId', 'specialtyProgress', 'specialtyUpdatedAt']) delete data[key];
    return data;
  }
  function stable(value) {
    if (Array.isArray(value)) return value.map(stable);
    return object(value) ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
  }
  const equal = (a, b) => JSON.stringify(stable(normalized(a))) === JSON.stringify(stable(normalized(b)));
  const meaningful = value => !equal(value, {});
  function reconcile(local, remote, base, remoteTime, preference) {
    local = local || {}; remote = remote || {};
    const result = {schemaVersion: '2.2', specialtyProgress: {}, specialtyUpdatedAt: {}}, conflicts = [];
    for (const id of PE_PROGRESS.ids) {
      const l = PE_PROGRESS.state(local, id), r = PE_PROGRESS.state(remote, id);
      const b = base === null || base === undefined ? null : PE_PROGRESS.state(base, id);
      const lc = b ? !equal(l, b) : meaningful(l), rc = b ? !equal(r, b) : meaningful(r);
      let source = lc ? local : remote;
      if (lc && rc && !equal(l, r)) {
        conflicts.push(id);
        source = preference === 'cloud' ? remote : local;
      }
      const selected = normalized(PE_PROGRESS.state(source, id));
      if (id === PE_PROGRESS.math) Object.assign(result, clone(selected));
      else result.specialtyProgress[id] = clone(selected);
      result.specialtyUpdatedAt[id] = source.specialtyUpdatedAt?.[id] || (source === remote ? remoteTime : localStorage.getItem('pe_local_updated_at')) || '1970-01-01T00:00:00.000Z';
    }
    return {state: result, conflicts};
  }
  function validBackup(data) {
    if (!object(data) || (!Array.isArray(data.done) && !object(data.specialtyProgress))) return false;
    function safe(value) {
      if (!value || typeof value !== 'object') return true;
      return Object.entries(value).every(([key, v]) => !['__proto__', 'prototype', 'constructor'].includes(key) && safe(v));
    }
    if (!safe(data)) return false;
    if (data.specialtyProgress && (!object(data.specialtyProgress) || Object.keys(data.specialtyProgress).some(id => !PE_PROGRESS.ids.includes(id)))) return false;
    return [data, ...Object.values(data.specialtyProgress || {})].every(state => {
      if (!object(state)) return false;
      for (const key of ['done', 'wrong', 'history', 'simulations']) if (state[key] !== undefined && !Array.isArray(state[key])) return false;
      for (const key of ['right', 'total']) if (state[key] !== undefined && (!Number.isFinite(state[key]) || state[key] < 0)) return false;
      if ((state.right || 0) > (state.total || 0)) return false;
      if (state.byDomain !== undefined && !object(state.byDomain)) return false;
      if (Object.values(state.byDomain || {}).some(s => !object(s) || !Number.isFinite(s.right) || !Number.isFinite(s.total) || s.right < 0 || s.right > s.total)) return false;
      if (state.plan !== undefined && !object(state.plan)) return false;
      if (state.diagnosis !== undefined && state.diagnosis !== null && (!object(state.diagnosis) || !object(state.diagnosis.byDomain))) return false;
      return (state.done || []).every(id => typeof id === 'string') && (state.wrong || []).every(id => ['string', 'number'].includes(typeof id)) && (state.history || []).every(h => object(h) && typeof h.ok === 'boolean' && typeof h.domain === 'string') && (state.simulations || []).every(s => object(s) && Number.isFinite(s.total) && Number.isFinite(s.right) && object(s.byDomain));
    });
  }
  function importBackup(current, data) {
    if (!validBackup(data)) throw new Error('Respaldo no válido');
    const now = new Date().toISOString(), result = clone(current || {});
    const progress = {...result.specialtyProgress, ...data.specialtyProgress};
    const stamps = {...result.specialtyUpdatedAt};
    if (Array.isArray(data.done)) {
      for (const key of Object.keys(result)) if (!['schemaVersion', 'specialtyProgress', 'specialtyUpdatedAt'].includes(key)) delete result[key];
      Object.assign(result, normalized(data)); stamps[PE_PROGRESS.math] = now;
    }
    for (const id of Object.keys(data.specialtyProgress || {})) stamps[id] = now;
    return {...result, schemaVersion: '2.2', specialtyProgress: progress, specialtyUpdatedAt: stamps};
  }
  window.PE303_SYNC = {reconcile, equal, meaningful, validBackup, importBackup};
}());
