import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { createMarco, updateMarco, deleteMarco } from '../services/data';
import { fmtDate, inputCls, btnGold, linkGold } from './trackingUi';
import { nextMarco, daysTo, isOverdue, todayISO } from '../lib/pmoLogic';

export default function MarcosList({ trackId, marcos, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ nome: '', fecha: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const today = todayISO();
  const prox = nextMarco(marcos, today);
  const ordered = [...marcos].sort((a, b) => (a.fecha || '9999') < (b.fecha || '9999') ? -1 : 1);
  const add = async (e) => {
    e.preventDefault(); if (!f.nome.trim()) return; setSaving(true); setError(null);
    try { await createMarco({ track_id: trackId, nome: f.nome.trim(), fecha: f.fecha || null, orden: marcos.length }); setF({ nome: '', fecha: '' }); setOpen(false); onChange(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-400">Marcos / Hitos</h4>
        {!open && <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Nuevo marco</button>}
      </div>
      {open && (
        <form onSubmit={add} className="space-y-2 mb-3">
          <input className={inputCls} placeholder="Nombre del hito" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} autoFocus />
          <div className="flex gap-2 items-center">
            <input type="date" className={inputCls} value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} />
            <button disabled={saving} className={btnGold}>OK</button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400">Cancelar</button>
          </div>
        </form>
      )}
      {ordered.length ? ordered.map((mrc) => {
        const d = daysTo(mrc.fecha, today);
        const venc = !mrc.concluido && isOverdue(mrc.fecha, today);
        return (
          <div key={mrc.id} className={`flex items-center gap-2 py-1.5 border-t border-[#273647]/50 first:border-0 text-[12.5px] ${mrc.concluido ? 'opacity-55' : ''}`}>
            <button title="Marcar concluido" onClick={async () => { setError(null); try { await updateMarco(mrc.id, { concluido: !mrc.concluido }); onChange(); } catch (e) { setError(e.message); } }} className={`w-4 h-4 rounded border grid place-items-center text-[9px] flex-none ${mrc.concluido ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300' : 'border-slate-500 text-transparent'}`}>✓</button>
            {prox && prox.id === mrc.id && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 flex-none">próximo</span>}
            <span className="flex-1 text-slate-200">{mrc.nome}</span>
            <span className={venc ? 'text-rose-300' : 'text-slate-400'}>{mrc.concluido ? `✓ ${fmtDate(mrc.fecha)}` : d == null ? '—' : d < 0 ? `venció hace ${-d} d` : `en ${d} d`}</span>
            <button onClick={async () => { setError(null); try { await deleteMarco(mrc.id); onChange(); } catch (e) { setError(e.message); } }} className="text-slate-600 hover:text-rose-400 text-xs flex-none">✕</button>
          </div>
        );
      }) : <p className="text-xs text-slate-400">Sin hitos.</p>}
      {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
}
