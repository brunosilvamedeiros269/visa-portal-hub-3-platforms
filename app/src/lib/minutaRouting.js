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
  // `tracks` acá son filas crudas de la base: la columna es `nome` (portugués).
  return (tracks || []).find((t) => normalizeName(t.nome) === n) || null;
}

export function destinoInicial(item, tracks) {
  const raw = (item && item.track) || '';
  if (normalizeName(raw) === PROYECTO) return PROYECTO;
  const hit = matchTrack(raw, tracks);
  return hit ? hit.id : PROYECTO;
}

// Arma el payload `contexto` que se envía a procesarMinuta (api/minutaLib.js).
// Acá pasa la traducción crítica: `tracks` viene de la base con la columna
// `nome` (portugués) y el contrato de la API espera `nombre` (español). Esta
// es exactamente la línea que causó el bug silencioso — leer `t.nombre` de la
// fila cruda devolvía siempre undefined y la IA nunca recibía los nombres de
// las tracks — por eso está separada y bajo test.
export function buildContexto(cliente, proyecto, tracks) {
  return {
    cliente,
    proyecto: proyecto && proyecto.nome,
    tracks: (tracks || []).map((t) => ({ nombre: t.nome, frente: t.frente, proximo_paso: t.proximo_paso })),
  };
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
    if (cuenta.has(t.id)) out.push({ label: t.nome, n: cuenta.get(t.id) });
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

// Concilia "Tracks de esta reunión" cuando el usuario corrige a mano el destino
// de un item hacia una track (o lo vuelve a incluir): esa track se suma a
// trackIds, salvo que el usuario ya la haya desmarcado explícitamente — el
// desmarque manual siempre gana — o que el item esté excluido (`incluir: false`),
// porque un item excluido no genera tarea ni riesgo y no debería arrastrar su
// track a la reunión.
export function reconcileTrackIds(trackIds, uncheckedIds, destino, incluir = true) {
  if (incluir === false) return trackIds;
  if (!destino || destino === PROYECTO) return trackIds;
  if (trackIds.includes(destino) || (uncheckedIds || []).includes(destino)) return trackIds;
  return [...trackIds, destino];
}

// Alterna una track a mano en el panel de revisión (checkbox "Tracks de esta
// reunión"), llevando también el registro de desmarques manuales que
// reconcileTrackIds respeta. Re-marcar limpia el desmarque.
export function toggleTrackId(trackIds, uncheckedIds, id) {
  const unchecked = uncheckedIds || [];
  if (trackIds.includes(id)) {
    return {
      trackIds: trackIds.filter((x) => x !== id),
      uncheckedIds: unchecked.includes(id) ? unchecked : [...unchecked, id],
    };
  }
  return {
    trackIds: [...trackIds, id],
    uncheckedIds: unchecked.filter((x) => x !== id),
  };
}
