import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { createRisco, updateRisco, deleteRisco } from '../services/data';
import { inputCls, btnGold, linkGold, SEVERIDADES, SEVERIDAD_LABEL, SEVERIDAD_COLOR, RISK_TIPOS, RISK_TIPO_LABEL, RISK_STATUSES, RISK_STATUS_LABEL } from './trackingUi';

export default function RaidList({ trackId, riscos, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ descricao: '', tipo: 'riesgo', severidade: 'media', dueno: '', status: 'abierto' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const add = async (e) => {
    e.preventDefault(); if (!f.descricao.trim()) return; setSaving(true);
    try { await createRisco({ track_id: trackId, ...f, descricao: f.descricao.trim() }); setF({ descricao: '', tipo: 'riesgo', severidade: 'media', dueno: '', status: 'abierto' }); setOpen(false); onChange(); }
    finally { setSaving(false); }
  };
  return (
    <div className="bg-[#122131] border border-[#273647] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-400">Riesgos &amp; Issues (RAID)</h4>
        {!open && <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Nuevo</button>}
      </div>
      {open && (
        <form onSubmit={add} className="space-y-2 mb-3">
          <input className={inputCls} placeholder="Descripción del riesgo/issue" value={f.descricao} onChange={set('descricao')} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <select className={inputCls} value={f.tipo} onChange={set('tipo')}>{RISK_TIPOS.map((x) => <option key={x} value={x}>{RISK_TIPO_LABEL[x]}</option>)}</select>
            <select className={inputCls} value={f.severidade} onChange={set('severidade')}>{SEVERIDADES.map((x) => <option key={x} value={x}>{SEVERIDAD_LABEL[x]}</option>)}</select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Dueño" value={f.dueno} onChange={set('dueno')} />
            <select className={inputCls} value={f.status} onChange={set('status')}>{RISK_STATUSES.map((x) => <option key={x} value={x}>{RISK_STATUS_LABEL[x]}</option>)}</select>
          </div>
          <div className="flex gap-2"><button disabled={saving} className={btnGold}>Guardar</button><button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 px-2">Cancelar</button></div>
        </form>
      )}
      {riscos.length ? riscos.map((x) => (
        <div key={x.id} className="flex gap-2 py-2 border-t border-[#273647]/60 first:border-0 text-[12.5px]">
          <span className="w-1 rounded self-stretch flex-none" style={{ background: SEVERIDAD_COLOR[x.severidade] || '#94a3b8' }} />
          <div className="flex-1">
            <div className="text-slate-200">{x.descricao}</div>
            <div className="text-[10px] text-slate-500">{RISK_TIPO_LABEL[x.tipo]} · {SEVERIDAD_LABEL[x.severidade]} · {x.dueno || '—'} ·
              <button onClick={async () => { const order = RISK_STATUSES; const next = order[(order.indexOf(x.status) + 1) % order.length]; await updateRisco(x.id, { status: next }); onChange(); }} className="ml-1 underline decoration-dotted hover:text-slate-300">{RISK_STATUS_LABEL[x.status]}</button>
            </div>
          </div>
          <button onClick={async () => { await deleteRisco(x.id); onChange(); }} className="text-slate-600 hover:text-rose-400 text-xs flex-none">✕</button>
        </div>
      )) : <p className="text-xs text-slate-400">Sin riesgos.</p>}
    </div>
  );
}
