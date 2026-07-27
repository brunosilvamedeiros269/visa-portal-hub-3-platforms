import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { createTarea, updateTareaStatus } from '../services/data';
import { fmtDate, stLabel, inputCls, btnGold, linkGold, TAREA_ORDER, TAREA_CYCLE, ORIGENES, ORIGEN_LABEL } from './trackingUi';
import { isOverdue, todayISO } from '../lib/pmoLogic';

const EST_CLS = {
  aberto: 'bg-slate-500/15 text-slate-300', em_andamento: 'bg-blue-500/18 text-blue-300',
  bloqueada: 'bg-rose-500/18 text-rose-300', fechado: 'bg-emerald-500/16 text-emerald-300',
};

function NewTarea({ trackId, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ titulo: '', responsavel: '', previsao_entrega: '', origen: 'manual' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); if (!f.titulo.trim()) return; setSaving(true);
    try { await createTarea({ track_id: trackId, titulo: f.titulo.trim(), status: 'aberto', responsavel: f.responsavel || null, previsao_entrega: f.previsao_entrega || null, origen: f.origen }); setF({ titulo: '', responsavel: '', previsao_entrega: '', origen: 'manual' }); setOpen(false); onChange(); }
    finally { setSaving(false); }
  };
  if (!open) return <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Nueva tarea</button>;
  return (
    <form onSubmit={submit} className="bg-[#0b1626] border border-[#273647] rounded-xl p-3 space-y-2 mb-3">
      <input className={inputCls} placeholder="Tarea…" value={f.titulo} onChange={set('titulo')} autoFocus />
      <div className="grid grid-cols-3 gap-2">
        <input className={inputCls} placeholder="Responsable" value={f.responsavel} onChange={set('responsavel')} />
        <input type="date" className={inputCls} value={f.previsao_entrega} onChange={set('previsao_entrega')} />
        <select className={inputCls} value={f.origen} onChange={set('origen')}>{ORIGENES.map((o) => <option key={o} value={o}>{ORIGEN_LABEL[o]}</option>)}</select>
      </div>
      <div className="flex gap-2"><button disabled={saving} className={btnGold}>Guardar</button><button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 px-2">Cancelar</button></div>
    </form>
  );
}

export default function TareasTable({ trackId, tareas, onChange }) {
  const today = todayISO();
  const ordered = [...tareas].sort((a, b) => TAREA_ORDER.indexOf(a.status) - TAREA_ORDER.indexOf(b.status));
  const cycle = async (t) => { await updateTareaStatus(t.id, TAREA_CYCLE[t.status] || 'aberto'); onChange(); };
  return (
    <div>
      <div className="flex justify-end mb-2"><NewTarea trackId={trackId} onChange={onChange} /></div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="text-[9px] uppercase tracking-wide text-slate-500">
            {['Tarea', 'Estado', 'Responsable', 'Apertura', 'Cierre', 'Origen'].map((h) => <th key={h} className="text-left font-semibold px-2 py-1.5 border-b border-[#273647]">{h}</th>)}
          </tr></thead>
          <tbody>
            {ordered.length ? ordered.map((t) => {
              const venc = t.status !== 'fechado' && isOverdue(t.previsao_entrega, today);
              return (
                <tr key={t.id} className={`border-b border-[#1e2a44] ${t.status === 'fechado' ? 'opacity-60' : ''}`}>
                  <td className="px-2 py-2 text-slate-200">{t.titulo}</td>
                  <td className="px-2 py-2"><button onClick={() => cycle(t)} title="Cambiar estado" className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${EST_CLS[t.status] || ''}`}>{stLabel(t.status)}</button></td>
                  <td className="px-2 py-2 text-slate-300">{t.responsavel || '—'}</td>
                  <td className="px-2 py-2 text-slate-400">{fmtDate(t.data_criacao)}</td>
                  <td className={`px-2 py-2 ${venc ? 'text-rose-300' : 'text-slate-400'}`}>{t.data_fechamento ? fmtDate(t.data_fechamento) : venc ? 'venció' : '—'}</td>
                  <td className="px-2 py-2"><span className="text-[10px] px-2 py-0.5 rounded-full border border-[#273647] text-slate-400">{ORIGEN_LABEL[t.origen] || 'Manual'}</span></td>
                </tr>
              );
            }) : <tr><td colSpan={6} className="text-slate-400 px-2 py-3 text-sm">Sin tareas.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-[10.5px] text-slate-500 mt-2">Clic en el estado para avanzar · Cierre se completa al pasar a Cerrado · el estado no compromete fechas.</p>
    </div>
  );
}
