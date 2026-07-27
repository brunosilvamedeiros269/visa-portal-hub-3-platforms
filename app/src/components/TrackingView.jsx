import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshCw, Loader2, AlertTriangle, ChevronRight, ArrowLeft, Plus, Flag, FolderKanban, Building2, CalendarClock,
} from 'lucide-react';
import { fetchAll, createCliente, createProjeto, createTrack, updateProjeto } from '../services/data';
import {
  Badge, fmtDate, stDot, inputCls, btnGold, linkGold, FRENTES, TRACK_STATUSES, RagDot, ProgressBar,
  SEVERIDAD_COLOR, SEVERIDAD_LABEL, RISK_TIPO_LABEL, RISK_STATUS_LABEL,
} from './trackingUi';
import { todayISO, ragProjeto, avanceProjeto, nextMarco, daysTo, countVencidas, countBloqueadas, RAG_RANK } from '../lib/pmoLogic';
import TrackCockpit from './TrackCockpit';

// ---------- formulários ----------
function Collapsible({ label, children }) {
  const [open, setOpen] = useState(false);
  if (!open) return <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> {label}</button>;
  return <div className="bg-[#0b1626] border border-[#273647] rounded-xl p-3 mb-3 max-w-lg">{children(() => setOpen(false))}</div>;
}

function Actions({ saving, onCancel, label }) {
  return (
    <div className="flex gap-2 mt-1">
      <button type="submit" disabled={saving} className={btnGold}>{saving ? 'Guardando…' : label}</button>
      <button type="button" onClick={onCancel} className="text-xs text-slate-400 px-2">Cancelar</button>
    </div>
  );
}

function NewCliente({ onDone }) {
  const [f, setF] = useState({ nome: '', pais: '', segmento: 'Banco', contatos: '' });
  const [saving, setSaving] = useState(false); const [error, setError] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Collapsible label="Nuevo cliente">
      {(close) => (
        <form className="space-y-2" onSubmit={async (e) => { e.preventDefault(); if (!f.nome.trim()) return; setSaving(true); setError(null); try { await createCliente({ ...f, nome: f.nome.trim() }); close(); onDone(); } catch (err) { setError(err.message); } finally { setSaving(false); } }}>
          <input className={inputCls} placeholder="Nombre del cliente" value={f.nome} onChange={set('nome')} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="País" value={f.pais} onChange={set('pais')} />
            <input className={inputCls} placeholder="Segmento" value={f.segmento} onChange={set('segmento')} />
          </div>
          <input className={inputCls} placeholder="Contactos" value={f.contatos} onChange={set('contatos')} />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <Actions saving={saving} onCancel={close} label="Guardar cliente" />
        </form>
      )}
    </Collapsible>
  );
}

function NewProjeto({ clienteId, onDone }) {
  const [f, setF] = useState({ nome: '', status: 'Em andamento', gerente: '', inicio: '', descricao: '' });
  const [saving, setSaving] = useState(false); const [error, setError] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Collapsible label="Nuevo proyecto">
      {(close) => (
        <form className="space-y-2" onSubmit={async (e) => { e.preventDefault(); if (!f.nome.trim()) return; setSaving(true); setError(null); try { await createProjeto({ cliente_id: clienteId, nome: f.nome.trim(), status: f.status, gerente: f.gerente || null, inicio: f.inicio || null, descricao: f.descricao || null }); close(); onDone(); } catch (err) { setError(err.message); } finally { setSaving(false); } }}>
          <input className={inputCls} placeholder="Nombre del proyecto" value={f.nome} onChange={set('nome')} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Gerente" value={f.gerente} onChange={set('gerente')} />
            <input type="date" className={inputCls} value={f.inicio} onChange={set('inicio')} />
          </div>
          <input className={inputCls} placeholder="Descripción" value={f.descricao} onChange={set('descricao')} />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <Actions saving={saving} onCancel={close} label="Guardar proyecto" />
        </form>
      )}
    </Collapsible>
  );
}

function NewTrack({ projetoId, onDone }) {
  const [f, setF] = useState({ nome: '', frente: '', status: 'Sin iniciar', responsavel: '', technical_pm: '', waiver_hasta: '', proximo_paso: '', ruta_critica: false });
  const [saving, setSaving] = useState(false); const [error, setError] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Collapsible label="Nueva track">
      {(close) => (
        <form className="space-y-2" onSubmit={async (e) => { e.preventDefault(); if (!f.nome.trim()) return; setSaving(true); setError(null); try { await createTrack({ projeto_id: projetoId, nome: f.nome.trim(), frente: f.frente || null, status: f.status, responsavel: f.responsavel || null, technical_pm: f.technical_pm || null, waiver_hasta: f.waiver_hasta || null, proximo_paso: f.proximo_paso || null, ruta_critica: f.ruta_critica }); close(); onDone(); } catch (err) { setError(err.message); } finally { setSaving(false); } }}>
          <input className={inputCls} placeholder="Nombre de la track" value={f.nome} onChange={set('nome')} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <select className={inputCls} value={f.frente} onChange={set('frente')}><option value="">Frente…</option>{FRENTES.map((x) => <option key={x} value={x}>{x}</option>)}</select>
            <select className={inputCls} value={f.status} onChange={set('status')}>{TRACK_STATUSES.map((x) => <option key={x} value={x}>{x}</option>)}</select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Responsable" value={f.responsavel} onChange={set('responsavel')} />
            <input className={inputCls} placeholder="Technical PM" value={f.technical_pm} onChange={set('technical_pm')} />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-xs text-slate-400 flex items-center gap-2">Waiver hasta <input type="date" className={inputCls} value={f.waiver_hasta} onChange={set('waiver_hasta')} /></label>
            <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={f.ruta_critica} onChange={(e) => setF({ ...f, ruta_critica: e.target.checked })} /> Ruta crítica</label>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <Actions saving={saving} onCancel={close} label="Guardar track" />
        </form>
      )}
    </Collapsible>
  );
}

// ---------- helpers de resumo ----------
function projetoResumo(m, proj, today) {
  const tracks = m.tracksByProjeto[proj.id] || [];
  const rag = ragProjeto(proj, tracks, m.tareasByTrack, m.marcosByTrack, today);
  const pct = avanceProjeto(tracks, m.tareasByTrack);
  // próximo marco entre todos os tracks do projeto
  const allMarcos = tracks.flatMap((t) => m.marcosByTrack[t.id] || []);
  const marco = nextMarco(allMarcos, today);
  const tareas = tracks.flatMap((t) => m.tareasByTrack[t.id] || []);
  const vencidas = countVencidas(tareas, today);
  const bloqueadas = countBloqueadas(tareas);
  const riesgos = (m.riscosByProjeto[proj.id] || []).length + tracks.reduce((a, t) => a + (m.riscosByTrack[t.id] || []).length, 0);
  return { tracks, rag, pct, marco, vencidas, bloqueadas, riesgos };
}

function Kpi({ n, label, danger }) {
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl px-4 py-3.5">
      <div className={`text-2xl font-extrabold leading-none ${danger && n ? 'text-rose-300' : 'text-slate-100'}`}>{n}</div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400 mt-1.5">{label}</div>
    </div>
  );
}

function CsmEditable({ proj, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(proj.csm || proj.gerente || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  if (!editing) {
    return <button onClick={() => setEditing(true)} className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300 hover:border-[#FAA61A]/40">CSM: {proj.csm || proj.gerente || '—'} ✎</button>;
  }
  return (
    <span className="inline-flex items-center gap-1">
      <input className={inputCls + ' !w-40 !py-1'} value={val} onChange={(e) => setVal(e.target.value)} autoFocus />
      <button disabled={saving} onClick={async () => { setSaving(true); setError(null); try { await updateProjeto(proj.id, { csm: val || null }); setEditing(false); onSaved(); } catch (e) { setError(e.message); } finally { setSaving(false); } }} className={btnGold}>OK</button>
      {error && <span className="text-[10px] text-rose-400">{error}</span>}
    </span>
  );
}

function TrackRow({ track, onOpen }) {
  return (
    <button onClick={() => onOpen(track.id)} className="w-full flex items-center justify-between gap-3 text-left px-3 py-2.5 rounded-lg hover:bg-[#122131] transition-colors group">
      <span className="flex items-center gap-2.5 min-w-0">
        {track.ruta_critica && <Flag className="w-3.5 h-3.5 text-[#FAA61A] flex-none" />}
        <span className="text-sm text-slate-200 truncate">{track.nome}</span>
        {track.frente && <span className="text-[10px] text-slate-500 hidden md:inline">{track.frente}</span>}
      </span>
      <span className="flex items-center gap-2 flex-none">
        {track.waiver_hasta && <span className="text-[10px] text-rose-300 hidden sm:inline">⏳ {fmtDate(track.waiver_hasta)}</span>}
        <Badge v={track.status} />
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
      </span>
    </button>
  );
}

function ProjetoRow({ m, proj, cli, today, onOpen }) {
  const r = projetoResumo(m, proj, today);
  const d = r.marco ? daysTo(r.marco.fecha, today) : null;
  return (
    <button onClick={() => onOpen(proj.id)} className="w-full text-left grid grid-cols-1 md:grid-cols-[16px_1.7fr_1fr_1.1fr_0.9fr] gap-3 items-center px-3 py-3 rounded-xl hover:bg-[#122131] border border-transparent hover:border-[#273647] transition-colors">
      <RagDot rag={r.rag} />
      <div className="min-w-0">
        <div className="text-sm font-bold text-slate-100 truncate flex items-center gap-2"><FolderKanban className="w-4 h-4 text-[#FAA61A] flex-none" />{proj.nome}<Badge v={proj.status} /></div>
        <div className="text-[11px] text-slate-400 mt-0.5">CSM: {proj.csm || proj.gerente || '—'} · {r.tracks.length} tracks{r.bloqueadas ? ` · ${r.bloqueadas} bloqueadas` : ''}</div>
      </div>
      <div><ProgressBar pct={r.pct} /><div className="text-[11px] text-slate-400 mt-1">{r.pct}% avance</div></div>
      <div className="text-[11px]">
        {r.marco ? (<><div className="text-slate-200 truncate">{r.marco.nome}</div><div className={d < 0 ? 'text-rose-300' : 'text-slate-400'}>{d < 0 ? `venció hace ${-d} d` : `en ${d} d`} · {fmtDate(r.marco.fecha)}</div></>) : <span className="text-slate-500">sin hitos</span>}
      </div>
      <div className="flex gap-1.5 flex-wrap md:justify-end">
        {r.riesgos > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full border border-rose-500/40 text-rose-300 bg-rose-500/10">{r.riesgos} riesgo{r.riesgos > 1 ? 's' : ''}</span>}
        {r.vencidas > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#273647] text-slate-300">{r.vencidas} vencidas</span>}
      </div>
    </button>
  );
}

// ---------- container ----------
export default function TrackingView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selProjeto, setSelProjeto] = useState(null);
  const [selTrack, setSelTrack] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    fetchAll().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const m = useMemo(() => {
    if (!data) return null;
    const by = (arr, k) => arr.reduce((o, r) => { (o[r[k]] = o[r[k]] || []).push(r); return o; }, {});
    const idMap = (arr) => Object.fromEntries(arr.map((r) => [r.id, r]));
    const tracksById = idMap(data.tracks);
    const reunioesById = idMap(data.reunioes);
    const reunioesByTrack = {};
    for (const rt of data.reunion_tracks) { (reunioesByTrack[rt.track_id] = reunioesByTrack[rt.track_id] || []).push(reunioesById[rt.reuniao_id]); }
    const depsByTrack = {};
    for (const d of data.track_dependencias) { (depsByTrack[d.track_id] = depsByTrack[d.track_id] || []).push(tracksById[d.depende_de_id]); }
    const marcosByTrack = by(data.marcos, 'track_id');
    const riscosByTrack = by(data.riscos.filter((r) => r.track_id), 'track_id');
    const riscosByProjeto = by(data.riscos.filter((r) => r.projeto_id), 'projeto_id');
    const documentosByTrack = by(data.documentos, 'track_id');
    return {
      clientes: data.clientes,
      clientesById: idMap(data.clientes),
      projetosById: idMap(data.projetos),
      tracksById,
      projetosByCliente: by(data.projetos, 'cliente_id'),
      tracksByProjeto: by(data.tracks, 'projeto_id'),
      tareasByTrack: by(data.tareas, 'track_id'),
      prereqsByTrack: by(data.prerequisitos, 'track_id'),
      personasByCliente: by(data.personas, 'cliente_id'),
      reunioesByTrack,
      depsByTrack,
      marcosByTrack,
      riscosByTrack,
      riscosByProjeto,
      documentosByTrack,
    };
  }, [data]);

  const header = (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Seguimiento de proyectos</h2>
        <p className="text-xs text-slate-400">Cliente → Proyecto → Track · datos en vivo (Supabase).</p>
      </div>
      <button onClick={load} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-[#273647] hover:border-[#FAA61A]/40">
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualizar
      </button>
    </div>
  );

  if (loading) return <div>{header}<div className="flex items-center gap-2 text-slate-400 text-sm py-20 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Cargando…</div></div>;
  if (error) return <div>{header}<div className="bg-[#1C2B3C] border border-amber-500/30 rounded-xl p-5 text-sm"><div className="flex items-center gap-2 text-amber-300 font-semibold mb-1"><AlertTriangle className="w-4 h-4" /> Error al leer Supabase</div><p className="text-slate-300">{error}</p></div></div>;

  // --- Cockpit ---
  if (selTrack && m.tracksById[selTrack]) {
    const tr = m.tracksById[selTrack];
    const proj = m.projetosById[tr.projeto_id];
    const cli = proj ? m.clientesById[proj.cliente_id] : null;
    return <div>{header}
      <TrackCockpit
        track={tr} cliente={cli}
        personas={cli ? (m.personasByCliente[cli.id] || []) : []}
        prereqs={m.prereqsByTrack[tr.id] || []}
        reunioes={(m.reunioesByTrack[tr.id] || []).filter(Boolean)}
        deps={(m.depsByTrack[tr.id] || []).filter(Boolean)}
        tareas={m.tareasByTrack[tr.id] || []}
        marcos={m.marcosByTrack[tr.id] || []}
        riscos={m.riscosByTrack[tr.id] || []}
        documentos={m.documentosByTrack[tr.id] || []}
        onBack={() => setSelTrack(null)} onChange={load}
      />
    </div>;
  }

  // --- Detalhe do projeto ---
  if (selProjeto && m.projetosById[selProjeto]) {
    const proj = m.projetosById[selProjeto];
    const cli = m.clientesById[proj.cliente_id];
    const tracks = m.tracksByProjeto[proj.id] || [];
    const today = todayISO();
    const r = projetoResumo(m, proj, today);
    return (
      <div>{header}
        <button onClick={() => setSelProjeto(null)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-4"><ArrowLeft className="w-4 h-4" /> Volver al portafolio</button>
        <div className="flex items-center gap-3">
          <RagDot rag={r.rag} size={14} />
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2"><FolderKanban className="w-5 h-5 text-[#FAA61A]" /> {proj.nome}</h1>
          <Badge v={proj.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
          <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-blue-300 bg-blue-500/15 border-blue-500/25">{cli?.nome}</span>
          <CsmEditable proj={proj} onSaved={load} />
          {proj.inicio && <span className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300">Inicio: {fmtDate(proj.inicio)}</span>}
        </div>
        <div className="max-w-md mb-5"><ProgressBar pct={r.pct} /><div className="text-[11px] text-slate-400 mt-1">{r.pct}% avance del proyecto</div></div>
        {proj.descricao && <p className="text-sm text-slate-300 mb-5 max-w-3xl">{proj.descricao}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mb-6">
          <Kpi n={r.tracks.length} label="Tracks" />
          <Kpi n={r.tracks.filter((t) => (t.status || '').startsWith('Em curso')).length} label="En curso" />
          <Kpi n={r.bloqueadas} label="Bloqueadas" danger />
          <Kpi n={r.vencidas} label="Vencidas" danger />
        </div>
        {(() => {
          const riesgos = [...(m.riscosByProjeto[proj.id] || []), ...r.tracks.flatMap((t) => (m.riscosByTrack[t.id] || []).map((x) => ({ ...x, _track: t.nome })))];
          if (!riesgos.length) return null;
          return (
            <div className="bg-[#122131]/60 border border-[#273647] rounded-2xl p-4 mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Riesgos &amp; Issues del proyecto</h3>
              {riesgos.map((x) => (
                <div key={x.id} className="flex gap-2 py-1.5 border-t border-[#273647]/60 first:border-0 text-[12.5px]">
                  <span className="w-1 rounded self-stretch flex-none" style={{ background: SEVERIDAD_COLOR[x.severidade] || '#94a3b8' }} />
                  <div><div className="text-slate-200">{x.descricao}</div><div className="text-[10px] text-slate-500">{RISK_TIPO_LABEL[x.tipo]} · {SEVERIDAD_LABEL[x.severidade]} · {x.dueno || '—'} · {RISK_STATUS_LABEL[x.status]}{x._track ? ` · ${x._track}` : ''}</div></div>
                </div>
              ))}
            </div>
          );
        })()}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tracks</h3>
          <NewTrack projetoId={proj.id} onDone={load} />
        </div>
        <div className="bg-[#122131]/60 border border-[#273647] rounded-2xl p-2 divide-y divide-[#273647]/60">
          {tracks.length ? tracks.map((t) => <TrackRow key={t.id} track={t} onOpen={setSelTrack} />) : <p className="text-sm text-slate-400 p-3">Sin tracks todavía.</p>}
        </div>
      </div>
    );
  }

  // --- Portfólio ---
  const today = todayISO();
  const allTareas = data.tareas;
  const enRiesgo = data.projetos.filter((p) => RAG_RANK[projetoResumo(m, p, today).rag] >= 1).length;
  return (
    <div>{header}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <Kpi n={m.clientes.length} label="Clientes" />
        <Kpi n={data.projetos.length} label="Proyectos" />
        <Kpi n={data.tracks.length} label="Tracks" />
        <Kpi n={enRiesgo} label="En riesgo" danger />
        <Kpi n={countBloqueadas(allTareas)} label="Bloqueadas" danger />
        <Kpi n={countVencidas(allTareas, today)} label="Vencidas" danger />
      </div>

      <div className="flex justify-end mb-3"><NewCliente onDone={load} /></div>

      {m.clientes.map((cli) => {
        const projetos = m.projetosByCliente[cli.id] || [];
        return (
          <div key={cli.id} className="mb-6">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2"><Building2 className="w-4 h-4 text-[#FAA61A]" /> {cli.nome} {cli.pais && <span className="text-[11px] text-slate-400 font-normal">· {cli.pais}</span>}</h3>
              <NewProjeto clienteId={cli.id} onDone={load} />
            </div>
            <div className="bg-[#122131]/40 border border-[#273647] rounded-2xl p-2 divide-y divide-[#273647]/50">
              {projetos.length ? projetos.map((proj) => (
                <ProjetoRow key={proj.id} m={m} proj={proj} cli={cli} today={today} onOpen={setSelProjeto} />
              )) : <p className="text-sm text-slate-500 px-3 py-2">Sin proyectos. Usá “Nuevo proyecto”.</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
