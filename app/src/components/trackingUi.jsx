import React from 'react';

// [label ES, classes badge, cor do ponto]
export const TRACK_STATUS = {
  'Em curso': ['En curso', 'text-blue-300 bg-blue-500/15 border-blue-500/25', '#3B82F6'],
  'Em curso - atrasado': ['En curso · atrasado', 'text-orange-300 bg-orange-500/15 border-orange-500/25', '#fb923c'],
  'Pendente': ['Pendiente', 'text-yellow-300 bg-yellow-500/15 border-yellow-500/25', '#eab308'],
  'Sin iniciar': ['Sin iniciar', 'text-slate-300 bg-slate-500/15 border-slate-500/25', '#94a3b8'],
  'Bloqueado': ['Bloqueado', 'text-rose-300 bg-rose-500/15 border-rose-500/25', '#f43f5e'],
  'Concluído': ['Concluido', 'text-emerald-300 bg-emerald-500/15 border-emerald-500/25', '#34d399'],
};
export const TAREA_STATUS = {
  aberto: ['Abierto', 'text-blue-300 bg-blue-500/15 border-blue-500/25', '#3B82F6'],
  em_andamento: ['En curso', 'text-amber-300 bg-amber-500/15 border-amber-500/25', '#f59e0b'],
  bloqueada: ['Bloqueada', 'text-rose-300 bg-rose-500/15 border-rose-500/25', '#f43f5e'],
  fechado: ['Cerrado', 'text-emerald-300 bg-emerald-500/15 border-emerald-500/25', '#34d399'],
};
const ALL = { ...TRACK_STATUS, ...TAREA_STATUS };
export const stLabel = (v) => (ALL[v] ? ALL[v][0] : v || '—');
export const stClass = (v) => (ALL[v] ? ALL[v][1] : 'text-slate-300 bg-slate-500/15 border-slate-500/25');
export const stDot = (v) => (ALL[v] ? ALL[v][2] : '#94a3b8');

export const TRACK_STATUSES = Object.keys(TRACK_STATUS);
export const TAREA_ORDER = ['aberto', 'em_andamento', 'bloqueada', 'fechado'];
export const TAREA_CYCLE = { aberto: 'em_andamento', em_andamento: 'bloqueada', bloqueada: 'fechado', fechado: 'aberto' };
export const FRENTES = ['PCR 1913', 'Tokenização TD', 'Google Pay', 'Apple Pay', 'Garmin Pay', 'Click to Pay', 'Mandato OCT-AFT', 'Mandato ANI'];

export function Badge({ v, className = '' }) {
  return <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap ${stClass(v)} ${className}`}>{stLabel(v)}</span>;
}

export function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return d ? `${d}/${m}/${y}` : iso;
}

export const inputCls = 'w-full bg-[#0b1626] border border-[#273647] rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#FAA61A]/50 outline-none';
export const btnGold = 'text-xs font-semibold bg-[#FAA61A] text-[#0A142F] px-3 py-1.5 rounded-lg disabled:opacity-60';
export const linkGold = 'flex items-center gap-1.5 text-xs font-semibold text-[#FAA61A] hover:text-[#ffca6a]';
