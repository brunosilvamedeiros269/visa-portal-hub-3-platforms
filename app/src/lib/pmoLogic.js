// Lógica PMO pura e testável. Sem React, sem Supabase. Não fabricar dados.
export const RAG_RANK = { verde: 0, amarelo: 1, rojo: 2 };
const RANK_RAG = ['verde', 'amarelo', 'rojo'];

export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysTo(iso, todayIso) {
  if (!iso) return null;
  const a = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  const b = new Date(`${todayIso}T00:00:00`);
  return Math.round((a - b) / 86400000);
}

export function isOverdue(iso, todayIso) {
  if (!iso) return false;
  return String(iso).slice(0, 10) < todayIso;
}

export function avanceTrack(track, tareas) {
  if (track && track.avance != null && track.avance !== '') {
    return { pct: Number(track.avance), hasData: true };
  }
  const total = tareas.length;
  if (!total) return { pct: 0, hasData: false };
  const done = tareas.filter((t) => t.status === 'fechado').length;
  return { pct: Math.round((done / total) * 100), hasData: true };
}

export function avanceProjeto(tracks, tareasByTrack) {
  if (!tracks.length) return 0;
  const sum = tracks.reduce((acc, tr) => acc + avanceTrack(tr, tareasByTrack[tr.id] || []).pct, 0);
  return Math.round(sum / tracks.length);
}

export function ragTrack(track, tareas, marcos, todayIso, amberDays = 7) {
  if (track && track.rag_override) return track.rag_override;
  const hasBlocked = tareas.some((t) => t.status === 'bloqueada');
  const marcoVencido = marcos.some((m) => !m.concluido && isOverdue(m.fecha, todayIso));
  if (hasBlocked || marcoVencido) return 'rojo';
  const within = (iso) => { const d = daysTo(iso, todayIso); return d != null && d >= 0 && d <= amberDays; };
  const waiverSoon = track && within(track.waiver_hasta);
  const tareaSoon = tareas.some((t) => t.status !== 'fechado' && within(t.previsao_entrega));
  const marcoSoon = marcos.some((m) => !m.concluido && within(m.fecha));
  if (waiverSoon || tareaSoon || marcoSoon) return 'amarelo';
  return 'verde';
}

export function ragProjeto(projeto, tracks, tareasByTrack, marcosByTrack, todayIso, amberDays = 7) {
  if (projeto && projeto.rag_override) return projeto.rag_override;
  let worst = 0;
  for (const tr of tracks) {
    const r = ragTrack(tr, tareasByTrack[tr.id] || [], marcosByTrack[tr.id] || [], todayIso, amberDays);
    worst = Math.max(worst, RAG_RANK[r]);
  }
  return RANK_RAG[worst];
}

export function nextMarco(marcos, todayIso) {
  const pend = marcos.filter((m) => !m.concluido && m.fecha).sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
  return pend[0] || null;
}

export function countVencidas(tareas, todayIso) {
  return tareas.filter((t) => t.status !== 'fechado' && isOverdue(t.previsao_entrega, todayIso)).length;
}

export function countBloqueadas(tareas) {
  return tareas.filter((t) => t.status === 'bloqueada').length;
}
