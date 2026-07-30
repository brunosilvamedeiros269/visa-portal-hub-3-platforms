import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { PROYECTO, resumenRateo, tracksConItems } from '../lib/minutaRouting';
import { inputCls, btnGold, SEVERIDADES, SEVERIDAD_LABEL, RISK_TIPOS, RISK_TIPO_LABEL } from './trackingUi';

// Painel de revisão da minuta. Controlado pelo ReunionProcesar: aqui não há estado.
export default function ReunionRevision({
  result, tracks, trackIds, saving, err,
  onChangeResult, onChangeItem, onToggleTrack, onGuardar, onVolver,
}) {
  const rateo = resumenRateo([...result.action_items, ...result.riesgos], tracks);
  const sugeridas = tracksConItems(result.action_items, result.riesgos);

  return (
    <div className="space-y-4 bg-[#0b1626] border border-[#273647] rounded-xl p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">Revisá y ajustá antes de guardar</div>
      {err && <p className="text-[11px] text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{err}</p>}

      {rateo.length > 0 && (
        <div className="text-[11px] text-slate-300 bg-[#122131] border border-[#273647] rounded-lg px-2.5 py-1.5">
          <span className="text-slate-500 uppercase tracking-wide text-[10px] mr-2">Reparto</span>
          {rateo.map((r, i) => (
            <span key={r.label}>{i > 0 && <span className="text-slate-600"> · </span>}<span className="text-[#FAA61A] font-bold">{r.n}</span> → {r.label}</span>
          ))}
        </div>
      )}

      <label className="block text-[11px] text-slate-400">Resumen
        <textarea className={inputCls} rows={2} value={result.resumen} onChange={(e) => onChangeResult({ resumen: e.target.value })} />
      </label>

      <Section title="Decisiones">
        {result.decisiones.map((d, i) => (
          <Row key={i} incluir={d.incluir} onToggle={() => onChangeItem('decisiones', i, { incluir: !d.incluir })}>
            <input className={inputCls} value={d.texto} onChange={(e) => onChangeItem('decisiones', i, { texto: e.target.value })} />
          </Row>
        ))}
      </Section>

      <Section title="Action items → tareas">
        {result.action_items.map((a, i) => (
          <Row key={i} incluir={a.incluir} onToggle={() => onChangeItem('action_items', i, { incluir: !a.incluir })}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 w-full">
              <input className={inputCls} placeholder="Tarea" value={a.titulo} onChange={(e) => onChangeItem('action_items', i, { titulo: e.target.value })} />
              <input className={inputCls} placeholder="Responsable" value={a.responsable} onChange={(e) => onChangeItem('action_items', i, { responsable: e.target.value })} />
              <input type="date" className={inputCls} value={a.prazo} onChange={(e) => onChangeItem('action_items', i, { prazo: e.target.value })} />
              <DestinoSelect tracks={tracks} value={a.destino} onChange={(v) => onChangeItem('action_items', i, { destino: v })} />
            </div>
          </Row>
        ))}
      </Section>

      <Section title="Riesgos → RAID">
        {result.riesgos.map((x, i) => (
          <Row key={i} incluir={x.incluir} onToggle={() => onChangeItem('riesgos', i, { incluir: !x.incluir })}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-1.5 w-full">
              <input className={`${inputCls} md:col-span-2`} placeholder="Descripción" value={x.descricao} onChange={(e) => onChangeItem('riesgos', i, { descricao: e.target.value })} />
              <select className={inputCls} value={x.tipo} onChange={(e) => onChangeItem('riesgos', i, { tipo: e.target.value })}>{RISK_TIPOS.map((t) => <option key={t} value={t}>{RISK_TIPO_LABEL[t]}</option>)}</select>
              <select className={inputCls} value={x.severidade} onChange={(e) => onChangeItem('riesgos', i, { severidade: e.target.value })}>{SEVERIDADES.map((s) => <option key={s} value={s}>{SEVERIDAD_LABEL[s]}</option>)}</select>
              <DestinoSelect tracks={tracks} value={x.destino} onChange={(v) => onChangeItem('riesgos', i, { destino: v })} />
            </div>
          </Row>
        ))}
      </Section>

      <Section title="Participantes → directorio">
        {result.participantes.map((p, i) => (
          <Row key={i} incluir={p.incluir} onToggle={() => onChangeItem('participantes', i, { incluir: !p.incluir })}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 w-full items-center">
              <input className={inputCls} placeholder="Nombre" value={p.nombre} onChange={(e) => onChangeItem('participantes', i, { nombre: e.target.value })} />
              <input className={inputCls} placeholder="Email" value={p.email} onChange={(e) => onChangeItem('participantes', i, { email: e.target.value })} />
              <span className="text-[10px] text-slate-500">{p.existe ? 'ya en directorio' : 'nuevo'}</span>
            </div>
          </Row>
        ))}
      </Section>

      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Tracks de esta reunión</div>
        <div className="flex flex-wrap gap-1.5">
          {tracks.map((t) => {
            const on = trackIds.includes(t.id);
            return (
              <button key={t.id} onClick={() => onToggleTrack(t.id)}
                className={`text-[11px] px-2.5 py-1 rounded-full border ${on ? 'text-[#FAA61A] bg-[#FAA61A]/12 border-[#FAA61A]/40' : 'text-slate-400 border-[#273647] hover:border-slate-500'}`}>
                {on ? '✓ ' : ''}{t.nome}{sugeridas.includes(t.id) && !on ? ' ·' : ''}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Pre-marcadas las tracks que recibieron algún item. Marcá también las que se discutieron sin generar acciones.</p>
      </div>

      <div className="flex gap-2">
        <button disabled={saving} onClick={onGuardar} className={btnGold}>{saving ? 'Guardando…' : 'Guardar reunión'}</button>
        <button onClick={onVolver} className="text-xs text-slate-400 px-2">Volver</button>
      </div>
    </div>
  );
}

function DestinoSelect({ tracks, value, onChange }) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} title="Destino del item">
      <option value={PROYECTO}>▲ Proyecto</option>
      {tracks.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
    </select>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">{title}</div>
      <div className="space-y-1.5">{children}</div>
      {(!children || (Array.isArray(children) && !children.length)) && <div className="text-[11px] text-slate-500">— nada —</div>}
    </div>
  );
}

function Row({ incluir, onToggle, children }) {
  return (
    <div className="flex items-start gap-2">
      <button onClick={onToggle} title={incluir ? 'Incluir' : 'Omitir'} className={`mt-1.5 w-4 h-4 rounded border grid place-items-center flex-none ${incluir ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300' : 'border-slate-500 text-transparent'}`}>✓</button>
      <div className="flex-1">{children}</div>
    </div>
  );
}
