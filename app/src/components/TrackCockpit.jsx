import React, { useState } from 'react';
import {
  ArrowLeft, Flag, Plus, CalendarClock, Link2, AlertTriangle, Users,
} from 'lucide-react';
import {
  Badge, fmtDate, stDot, stLabel, inputCls, btnGold, linkGold,
  TAREA_ORDER, TAREA_CYCLE, RagDot, ProgressBar, RAG_COLOR,
} from './trackingUi';
import { updateTrack, updateTareaStatus, createReuniaoParaTrack, updatePrereq } from '../services/data';
import { ragTrack, avanceTrack, todayISO, countVencidas, countBloqueadas, isOverdue } from '../lib/pmoLogic';
import MarcosList from './MarcosList';
import RaidList from './RaidList';
import DocsUploader from './DocsUploader';
import TareasTable from './TareasTable';

const PREREQ_CYCLE = { OK: 'Pendiente', Pendiente: 'N/A', 'N/A': 'OK' };
const PREREQ_STYLE = {
  OK: 'bg-emerald-500/25 border-emerald-400 text-emerald-300',
  Pendiente: 'border-rose-400 text-rose-300',
  'N/A': 'border-slate-500 text-slate-400',
};

function TableroKanban({ tareas, onChange, today, onError }) {
  const cycleTask = async (t) => { try { await updateTareaStatus(t.id, TAREA_CYCLE[t.status] || 'aberto'); onChange(); } catch (e) { onError && onError(e.message); } };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {TAREA_ORDER.map((col) => {
        const list = tareas.filter((t) => t.status === col);
        return (
          <div key={col} className="bg-[#0b1626] border border-[#273647] rounded-xl p-2.5">
            <div className="text-[10.5px] font-bold mb-2 flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full" style={{ background: stDot(col) }} />{stLabel(col)} <span className="text-slate-500">({list.length})</span></div>
            {list.map((t) => {
              const venc = t.status !== 'fechado' && isOverdue(t.previsao_entrega, today);
              return (
                <div key={t.id} className="bg-[#1C2B3C] border border-[#273647] rounded-lg p-2.5 mb-2">
                  <div className="text-[12px] text-slate-200 leading-snug">{t.titulo}</div>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="text-[10px] text-slate-400 truncate">{t.responsavel || '—'}</span>
                    <div className="flex items-center gap-2 flex-none">
                      {t.previsao_entrega && <span className={`text-[10px] ${venc ? 'text-rose-300' : 'text-[#FAA61A]'}`}>{fmtDate(t.previsao_entrega)}</span>}
                      <button onClick={() => cycleTask(t)} title="Cambiar estado" className="w-2.5 h-2.5 rounded-full hover:ring-2 hover:ring-white/20" style={{ background: stDot(t.status) }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function ReunionesCard({ trackId, reuniones, onChange, onError }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ titulo: '', tipo: 'semanal', data: '', participantes: '', ata: '' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); if (!f.titulo.trim()) return; setSaving(true);
    try { await createReuniaoParaTrack(trackId, { titulo: f.titulo.trim(), tipo: f.tipo, data: f.data || null, participantes: f.participantes || null, ata: f.ata || null }); setF({ titulo: '', tipo: 'semanal', data: '', participantes: '', ata: '' }); setOpen(false); onChange(); }
    catch (x) { onError && onError(x.message); }
    finally { setSaving(false); }
  };
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" />Reuniones</h4>
        {!open && <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Registrar</button>}
      </div>
      {open && (
        <form onSubmit={submit} className="space-y-2 mb-3">
          <input className={inputCls} placeholder="Título" value={f.titulo} onChange={set('titulo')} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <select className={inputCls} value={f.tipo} onChange={set('tipo')}><option value="steerco">SteerCo (mensual)</option><option value="semanal">Semanal</option><option value="adhoc">Ad-hoc</option></select>
            <input type="date" className={inputCls} value={f.data} onChange={set('data')} />
          </div>
          <input className={inputCls} placeholder="Participantes" value={f.participantes} onChange={set('participantes')} />
          <textarea className={inputCls} rows={3} placeholder="Acta (decisiones, acuerdos…)" value={f.ata} onChange={set('ata')} />
          <div className="flex gap-2"><button disabled={saving} className={btnGold}>Guardar</button><button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 px-2">Cancelar</button></div>
        </form>
      )}
      {reuniones.length ? reuniones.map((r) => (
        <div key={r.id} className="flex gap-2 py-1.5 border-b border-[#273647] last:border-0">
          <span className="text-[10px] text-[#FAA61A] font-bold w-10 flex-none">{fmtDate(r.data).slice(0, 5)}</span>
          <div><div className="text-[12px] text-slate-200">{r.titulo}</div><div className="text-[10px] text-slate-500 uppercase">{r.tipo}</div></div>
        </div>
      )) : <p className="text-xs text-slate-400">Sin reuniones.</p>}
    </div>
  );
}

export default function TrackCockpit({ track, cliente, personas, prereqs, reunioes, deps, tareas, marcos, riscos, documentos, onBack, onChange }) {
  const [err, setErr] = useState(null);
  const [view, setView] = useState('tablero'); // 'tablero' | 'lista'

  const today = todayISO();
  const rag = ragTrack(track, tareas, marcos, today);
  const av = avanceTrack(track, tareas);
  const vencidas = countVencidas(tareas, today);

  const setRag = async (val) => { setErr(null); try { await updateTrack(track.id, { rag_override: val }); onChange(); } catch (e) { setErr(e.message); } };
  const setAvance = async (val) => { if (val !== null && Number.isNaN(val)) { setErr('Avance inválido'); return; } setErr(null); try { await updateTrack(track.id, { avance: val }); onChange(); } catch (e) { setErr(e.message); } };

  const togglePrereq = async (p) => {
    setErr(null);
    try { await updatePrereq(p.id, { estado: PREREQ_CYCLE[p.estado] || 'OK' }); onChange && onChange(); }
    catch (e) { setErr(e.message); }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      {/* Cabecera */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <RagDot rag={rag} size={14} />{track.ruta_critica && <Flag className="w-4 h-4 text-[#FAA61A]" />}{track.nome}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2 items-center">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-blue-300 bg-blue-500/15 border-blue-500/25">{cliente?.nome?.split('—')[0]?.trim() || cliente?.nome}</span>
            {track.frente && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-[#FAA61A] bg-[#FAA61A]/12 border-[#FAA61A]/25">{track.frente}</span>}
            <Badge v={track.status} />
            {track.waiver_hasta && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-rose-300 bg-rose-500/15 border-rose-500/25">Waiver: {fmtDate(track.waiver_hasta)}</span>}
            <span className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300">TPM: {track.technical_pm || '—'}</span>
            {track.responsavel && <span className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300">Responsable: {track.responsavel}</span>}
            {/* Override RAG */}
            <span className="flex items-center gap-1 text-[10px] text-slate-500 ml-1">Salud:
              {['verde', 'amarelo', 'rojo'].map((c) => <button key={c} onClick={() => setRag(c)} title={c} className="w-3 h-3 rounded-full" style={{ background: RAG_COLOR[c], outline: track.rag_override === c ? '2px solid #fff4' : 'none' }} />)}
              <button onClick={() => setRag(null)} className={`px-1 rounded ${!track.rag_override ? 'text-[#FAA61A]' : 'hover:text-slate-300'}`}>auto</button>
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-start">
          <div className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2 min-w-[120px]">
            <div className="text-[10px] uppercase tracking-wide text-slate-400 flex justify-between">Avance
              <button onClick={() => { const v = prompt('Avance manual % (vacío = auto)', track.avance ?? ''); if (v !== null) { if (v === '') { setAvance(null); } else { const n = Number(v); setAvance(Number.isNaN(n) ? NaN : Math.max(0, Math.min(100, n))); } } }} className="text-slate-500 hover:text-[#FAA61A]">✎</button>
            </div>
            <div className="text-[15px] font-bold text-[#FAA61A] mt-0.5">{av.hasData ? `${av.pct}%` : 'sin datos'}</div>
            {av.hasData && <div className="mt-1"><ProgressBar pct={av.pct} /></div>}
          </div>
          {[['Abiertas', tareas.filter((t) => t.status !== 'fechado').length], ['Bloqueadas', countBloqueadas(tareas)], ['Vencidas', vencidas]].map(([k, v]) => (
            <div key={k} className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2 min-w-[86px]">
              <div className="text-[10px] uppercase tracking-wide text-slate-400">{k}</div>
              <div className={`text-[15px] font-bold mt-0.5 ${(k !== 'Abiertas') && v ? 'text-rose-300' : 'text-slate-100'}`}>{v}</div>
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
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#122131] border border-[#273647] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tareas</h3>
              <div className="inline-flex border border-[#273647] rounded-lg overflow-hidden text-[10px]">
                <button onClick={() => setView('tablero')} className={`px-2.5 py-1 ${view === 'tablero' ? 'bg-[#1e2a44] text-slate-100' : 'text-slate-400'}`}>▦ Tablero</button>
                <button onClick={() => setView('lista')} className={`px-2.5 py-1 ${view === 'lista' ? 'bg-[#1e2a44] text-slate-100' : 'text-slate-400'}`}>≣ Lista</button>
              </div>
            </div>
            {view === 'lista'
              ? <TareasTable trackId={track.id} tareas={tareas} onChange={onChange} />
              : <TableroKanban tareas={tareas} onChange={onChange} today={today} onError={setErr} />}
          </div>
          <MarcosList trackId={track.id} marcos={marcos} onChange={onChange} />
          <RaidList trackId={track.id} riscos={riscos} onChange={onChange} />
        </div>

        <div className="space-y-4">
          <DocsUploader trackId={track.id} docs={documentos} onChange={onChange} />

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

          <ReunionesCard trackId={track.id} reuniones={reunioes} onChange={onChange} onError={setErr} />

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
