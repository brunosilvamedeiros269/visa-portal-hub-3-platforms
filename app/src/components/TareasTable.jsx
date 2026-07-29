import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { createTarea, updateTarea, updateTareaStatus, deleteTarea } from '../services/data';
import { fmtDate, stLabel, inputCls, btnGold, linkGold, TAREA_ORDER, TAREA_CYCLE, ORIGENES, ORIGEN_LABEL } from './trackingUi';
import { isOverdue, todayISO } from '../lib/pmoLogic';

const EST_CLS = {
  aberto: 'bg-slate-500/15 text-slate-300', em_andamento: 'bg-blue-500/18 text-blue-300',
  bloqueada: 'bg-rose-500/18 text-rose-300', fechado: 'bg-emerald-500/16 text-emerald-300',
};
const inputSm = 'bg-[#0b1626] border border-[#273647] rounded px-1.5 py-1 text-[11px] text-slate-100 w-full outline-none focus:border-[#FAA61A]/50';

function NewTarea({ scope, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ titulo: '', responsavel: '', previsao_entrega: '', origen: 'manual' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); if (!f.titulo.trim()) return; setSaving(true);
    try { await createTarea({ ...scope, titulo: f.titulo.trim(), status: 'aberto', responsavel: f.responsavel || null, previsao_entrega: f.previsao_entrega || null, origen: f.origen }); setF({ titulo: '', responsavel: '', previsao_entrega: '', origen: 'manual' }); setOpen(false); onChange(); }
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

const COLS = ['Tarea', 'Estado', 'Responsable', 'Apertura', 'Previsión', 'Cierre', 'Origen', ''];

export default function TareasTable({ scope, tareas, onChange }) {
  const today = todayISO();
  const ordered = [...tareas].sort((a, b) => TAREA_ORDER.indexOf(a.status) - TAREA_ORDER.indexOf(b.status));
  const [editId, setEditId] = useState(null);
  const [f, setF] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const cycle = async (t) => { setErr(null); try { await updateTareaStatus(t.id, TAREA_CYCLE[t.status] || 'aberto'); onChange(); } catch (e) { setErr(e.message); } };
  const startEdit = (t) => { setErr(null); setEditId(t.id); setF({ titulo: t.titulo || '', status: t.status, responsavel: t.responsavel || '', previsao_entrega: (t.previsao_entrega || '').slice(0, 10), origen: t.origen || 'manual' }); };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async (t) => {
    if (!f.titulo.trim()) { setErr('El título no puede quedar vacío'); return; }
    setSaving(true); setErr(null);
    try {
      await updateTarea(t.id, {
        titulo: f.titulo.trim(),
        status: f.status,
        responsavel: f.responsavel.trim() || null,
        previsao_entrega: f.previsao_entrega || null,
        origen: f.origen,
        data_fechamento: f.status === 'fechado' ? (t.data_fechamento || today) : null,
      });
      setEditId(null); onChange();
    } catch (e) { setErr(e.message); } finally { setSaving(false); }
  };
  const del = async (t) => {
    if (typeof window !== 'undefined' && !window.confirm(`¿Eliminar la tarea "${t.titulo}"? Esta acción no se puede deshacer.`)) return;
    setErr(null);
    try { await deleteTarea(t.id); if (editId === t.id) setEditId(null); onChange(); } catch (e) { setErr(e.message); }
  };

  return (
    <div>
      <div className="flex justify-end mb-2"><NewTarea scope={scope} onChange={onChange} /></div>
      {err && <p className="text-[11px] text-rose-400 mb-2">{err}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="text-[9px] uppercase tracking-wide text-slate-500">
            {COLS.map((h, i) => <th key={i} className="text-left font-semibold px-2 py-1.5 border-b border-[#273647]">{h}</th>)}
          </tr></thead>
          <tbody>
            {ordered.length ? ordered.map((t) => {
              const venc = t.status !== 'fechado' && isOverdue(t.previsao_entrega, today);
              if (editId === t.id) {
                return (
                  <tr key={t.id} className="border-b border-[#1e2a44] bg-[#0b1626]/60">
                    <td className="px-2 py-1.5"><input className={inputSm} value={f.titulo} onChange={set('titulo')} autoFocus /></td>
                    <td className="px-2 py-1.5"><select className={inputSm} value={f.status} onChange={set('status')}>{TAREA_ORDER.map((s) => <option key={s} value={s}>{stLabel(s)}</option>)}</select></td>
                    <td className="px-2 py-1.5"><input className={inputSm} value={f.responsavel} onChange={set('responsavel')} placeholder="—" /></td>
                    <td className="px-2 py-1.5 text-slate-500 text-[11px] whitespace-nowrap">{fmtDate(t.data_criacao)}</td>
                    <td className="px-2 py-1.5"><input type="date" className={inputSm} value={f.previsao_entrega} onChange={set('previsao_entrega')} /></td>
                    <td className="px-2 py-1.5 text-slate-500 text-[11px] whitespace-nowrap">{f.status === 'fechado' ? fmtDate(t.data_fechamento || today) : '—'}</td>
                    <td className="px-2 py-1.5"><select className={inputSm} value={f.origen} onChange={set('origen')}>{ORIGENES.map((o) => <option key={o} value={o}>{ORIGEN_LABEL[o]}</option>)}</select></td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => save(t)} disabled={saving} title="Guardar" className="text-emerald-300 hover:text-emerald-200"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditId(null)} title="Cancelar" className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
                        <button onClick={() => del(t)} title="Eliminar" className="text-slate-500 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={t.id} className={`border-b border-[#1e2a44] group ${t.status === 'fechado' ? 'opacity-60' : ''}`}>
                  <td className="px-2 py-2 text-slate-200">{t.titulo}</td>
                  <td className="px-2 py-2"><button onClick={() => cycle(t)} title="Clic para avanzar el estado" className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${EST_CLS[t.status] || ''}`}>{stLabel(t.status)}</button></td>
                  <td className="px-2 py-2 text-slate-300">{t.responsavel || '—'}</td>
                  <td className="px-2 py-2 text-slate-400 whitespace-nowrap">{fmtDate(t.data_criacao)}</td>
                  <td className={`px-2 py-2 whitespace-nowrap ${venc ? 'text-rose-300' : 'text-slate-400'}`}>{t.previsao_entrega ? fmtDate(t.previsao_entrega) : '—'}{venc ? ' · venció' : ''}</td>
                  <td className="px-2 py-2 text-slate-400 whitespace-nowrap">{t.data_fechamento ? fmtDate(t.data_fechamento) : '—'}</td>
                  <td className="px-2 py-2"><span className="text-[10px] px-2 py-0.5 rounded-full border border-[#273647] text-slate-400">{ORIGEN_LABEL[t.origen] || 'Manual'}</span></td>
                  <td className="px-2 py-2"><button onClick={() => startEdit(t)} title="Editar tarea" className="text-slate-500 hover:text-[#FAA61A] opacity-60 group-hover:opacity-100"><Pencil className="w-3.5 h-3.5" /></button></td>
                </tr>
              );
            }) : <tr><td colSpan={COLS.length} className="text-slate-400 px-2 py-3 text-sm">Sin tareas.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-[10.5px] text-slate-500 mt-2">Clic en el estado para avanzar rápido · ✎ para editar todos los campos · el estado no compromete fechas (se validan con Implementaciones).</p>
    </div>
  );
}
