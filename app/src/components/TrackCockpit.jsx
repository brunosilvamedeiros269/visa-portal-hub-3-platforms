import React, { useState } from 'react';
import {
  ArrowLeft, Flag, Plus, CalendarClock, Link2, FileText, AlertTriangle, Users,
} from 'lucide-react';
import {
  Badge, fmtDate, stDot, stLabel, inputCls, btnGold, linkGold,
  TAREA_ORDER, TAREA_CYCLE,
} from './trackingUi';
import { createTarea, updateTarea, createPrereq, updatePrereq } from '../services/data';

const PREREQ_CYCLE = { OK: 'Pendiente', Pendiente: 'N/A', 'N/A': 'OK' };
const PREREQ_STYLE = {
  OK: 'bg-emerald-500/25 border-emerald-400 text-emerald-300',
  Pendiente: 'border-rose-400 text-rose-300',
  'N/A': 'border-slate-500 text-slate-400',
};

function NewTarea({ trackId, onChange }) {
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [prazo, setPrazo] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    setSaving(true); setError(null);
    try {
      await createTarea({ track_id: trackId, titulo: titulo.trim(), status: 'aberto', responsavel: responsavel.trim() || null, previsao_entrega: prazo || null });
      setTitulo(''); setResponsavel(''); setPrazo(''); setOpen(false);
      onChange && onChange();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  if (!open) return <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Nueva tarea</button>;
  return (
    <form onSubmit={submit} className="bg-[#0b1626] border border-[#273647] rounded-xl p-3 space-y-2 mb-3">
      <input className={inputCls} placeholder="Tarea…" value={titulo} onChange={(e) => setTitulo(e.target.value)} autoFocus />
      <div className="grid grid-cols-2 gap-2">
        <input className={inputCls} placeholder="Responsable" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />
        <input type="date" className={inputCls} value={prazo} onChange={(e) => setPrazo(e.target.value)} />
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={btnGold}>{saving ? 'Guardando…' : 'Guardar'}</button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 px-2">Cancelar</button>
      </div>
    </form>
  );
}

function TaskCard({ t, onCycle }) {
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-lg p-2.5 mb-2">
      <div className="text-[12px] text-slate-200 leading-snug">{t.titulo}</div>
      <div className="flex items-center justify-between mt-2 gap-2">
        <span className="text-[10px] text-slate-400 truncate">{t.responsavel || '—'}</span>
        <div className="flex items-center gap-2 flex-none">
          {t.previsao_entrega && <span className="text-[10px] text-[#FAA61A]">{fmtDate(t.previsao_entrega)}</span>}
          <button onClick={() => onCycle(t)} title="Cambiar estado"
            className="w-2.5 h-2.5 rounded-full hover:ring-2 hover:ring-white/20" style={{ background: stDot(t.status) }} />
        </div>
      </div>
    </div>
  );
}

export default function TrackCockpit({ track, cliente, personas, prereqs, reunioes, deps, tareas, onBack, onChange }) {
  const [err, setErr] = useState(null);

  const cycleTask = async (t) => {
    setErr(null);
    try { await updateTarea(t.id, { status: TAREA_CYCLE[t.status] || 'aberto' }); onChange && onChange(); }
    catch (e) { setErr(e.message); }
  };
  const togglePrereq = async (p) => {
    setErr(null);
    try { await updatePrereq(p.id, { estado: PREREQ_CYCLE[p.estado] || 'OK' }); onChange && onChange(); }
    catch (e) { setErr(e.message); }
  };

  const abiertas = tareas.filter((t) => t.status !== 'fechado').length;
  const bloqueadas = tareas.filter((t) => t.status === 'bloqueada').length;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      {/* Cabecera */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            {track.ruta_critica && <Flag className="w-4 h-4 text-[#FAA61A]" />}{track.nome}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-blue-300 bg-blue-500/15 border-blue-500/25">{cliente?.nome?.split('—')[0]?.trim() || cliente?.nome}</span>
            {track.frente && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-[#FAA61A] bg-[#FAA61A]/12 border-[#FAA61A]/25">{track.frente}</span>}
            <Badge v={track.status} />
            {track.waiver_hasta && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-rose-300 bg-rose-500/15 border-rose-500/25">Waiver: {fmtDate(track.waiver_hasta)}</span>}
            {track.ruta_critica && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-[#FAA61A] bg-[#FAA61A]/12 border-[#FAA61A]/25">Ruta crítica</span>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[['Abiertas', abiertas], ['Bloqueadas', bloqueadas], ['Technical PM', track.technical_pm || '—']].map(([k, v]) => (
            <div key={k} className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2 min-w-[92px]">
              <div className="text-[10px] uppercase tracking-wide text-slate-400">{k}</div>
              <div className={`text-[15px] font-bold mt-0.5 ${k === 'Bloqueadas' && v ? 'text-rose-300' : 'text-slate-100'}`}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {track.proximo_paso && (
        <div className="bg-[#1C2B3C] border border-[#273647] border-l-[3px] border-l-[#FAA61A] rounded-xl p-3 mb-5">
          <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Próximo paso</div>
          <div className="text-[13px] text-slate-200">{track.proximo_paso}</div>
        </div>
      )}

      {err && <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 mb-3 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> {err}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tablero de tareas */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tablero de tareas</h3>
            <NewTarea trackId={track.id} onChange={onChange} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {TAREA_ORDER.map((col) => {
              const list = tareas.filter((t) => t.status === col);
              return (
                <div key={col} className="bg-[#122131] border border-[#273647] rounded-xl p-2.5">
                  <div className="text-[10.5px] font-bold mb-2 flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ background: stDot(col) }} />{stLabel(col)} <span className="text-slate-500">({list.length})</span>
                  </div>
                  {list.map((t) => <TaskCard key={t.id} t={t} onCycle={cycleTask} />)}
                </div>
              );
            })}
          </div>
          <p className="text-[10.5px] text-slate-500 mt-2">Clic en el punto de estado para mover la tarea · el estado no compromete fechas (se validan con Implementaciones).</p>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
            <h4 className="text-[11px] uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Personas involucradas</h4>
            {personas.length ? personas.map((p) => (
              <div key={p.id} className="flex items-center gap-2 py-1 text-[12.5px] text-slate-200">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-[#273647] text-slate-400 flex-none">{p.rol || '—'}</span>
                <span className="truncate">{p.nome}{p.organizacao ? <span className="text-slate-500"> · {p.organizacao}</span> : null}</span>
              </div>
            )) : <p className="text-xs text-slate-400">Sin personas.</p>}
          </div>

          <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
            <h4 className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">Prerequisitos</h4>
            {prereqs.length ? prereqs.map((p) => (
              <button key={p.id} onClick={() => togglePrereq(p)} className="w-full flex items-center gap-2 py-1 text-left text-[12.5px] text-slate-200 hover:opacity-80">
                <span className={`w-4 h-4 rounded border grid place-items-center text-[9px] flex-none ${PREREQ_STYLE[p.estado] || ''}`}>{p.estado === 'OK' ? '✓' : p.estado === 'N/A' ? '–' : '!'}</span>
                <span>{p.descricao}</span>
              </button>
            )) : <p className="text-xs text-slate-400">Sin prerequisitos.</p>}
          </div>

          <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
            <h4 className="text-[11px] uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" />Reuniones</h4>
            {reunioes.length ? reunioes.map((r) => (
              <div key={r.id} className="flex gap-2 py-1.5 border-b border-[#273647] last:border-0">
                <span className="text-[10px] text-[#FAA61A] font-bold w-10 flex-none">{fmtDate(r.data).slice(0, 5)}</span>
                <div><div className="text-[12px] text-slate-200">{r.titulo}</div><div className="text-[10px] text-slate-500 uppercase">{r.tipo}</div></div>
              </div>
            )) : <p className="text-xs text-slate-400">Sin reuniones.</p>}
          </div>

          {deps.length > 0 && (
            <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
              <h4 className="text-[11px] uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" />Depende de</h4>
              {deps.map((d) => (
                <div key={d.id} className="flex items-center gap-2 py-1 text-[12.5px] text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: stDot(d.status) }} />{d.nome}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
