// Roteamento dos itens de uma minuta entre as tracks do proyecto. Lógica pura:
// sem rede, sem React, sem Supabase. O modelo devolve NOMES de track; aqui eles
// viram IDs. Regra de ouro: nome que não casa cai no proyecto, nunca numa track
// por aproximação — errar para o lado neutro é mais barato que enterrar uma
// tarefa na track errada.

export const PROYECTO = 'proyecto';

export function normalizeName(s) {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // saca acentos
    .toLowerCase().trim().replace(/\s+/g, ' ');
}

export function matchTrack(nombre, tracks) {
  const n = normalizeName(nombre);
  if (!n) return null;
  return (tracks || []).find((t) => normalizeName(t.nombre) === n) || null;
}

export function destinoInicial(item, tracks) {
  const raw = (item && item.track) || '';
  if (normalizeName(raw) === PROYECTO) return PROYECTO;
  const hit = matchTrack(raw, tracks);
  return hit ? hit.id : PROYECTO;
}

export function destinoFields(destino, projetoId) {
  return destino === PROYECTO
    ? { track_id: null, projeto_id: projetoId }
    : { track_id: destino, projeto_id: null };
}

const marcados = (items) => (items || []).filter((it) => it && it.incluir !== false);

export function resumenRateo(items, tracks) {
  const cuenta = new Map();
  for (const it of marcados(items)) {
    cuenta.set(it.destino, (cuenta.get(it.destino) || 0) + 1);
  }
  // Ordem estável: as tracks na ordem do proyecto, e o proyecto no final.
  const out = [];
  for (const t of tracks || []) {
    if (cuenta.has(t.id)) out.push({ label: t.nombre, n: cuenta.get(t.id) });
  }
  if (cuenta.has(PROYECTO)) out.push({ label: 'Proyecto', n: cuenta.get(PROYECTO) });
  return out;
}

export function tracksConItems(...listas) {
  const ids = [];
  for (const lista of listas) {
    for (const it of marcados(lista)) {
      if (it.destino && it.destino !== PROYECTO && !ids.includes(it.destino)) ids.push(it.destino);
    }
  }
  return ids;
}
