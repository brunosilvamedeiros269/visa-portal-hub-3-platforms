import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshCw, Loader2, AlertTriangle, ChevronRight, ArrowLeft, Plus, Flag, FolderKanban, Building2, CalendarClock,
} from 'lucide-react';
import { fetchAll, createCliente, createProjeto, createTrack } from '../services/data';
import {
  Badge, fmtDate, stDot, inputCls, btnGold, linkGold, FRENTES, TRACK_STATUSES,
} from './trackingUi';
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
function trackStats(list) {
  return {
    total: list.length,
    abiertas: 0,
    enCurso: list.filter((t) => (t.status || '').startsWith('Em curso')).length,
    bloqueados: list.filter((t) => t.status === 'Bloqueado').length,
  };
}

function Kpi({ n, label, danger }) {
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl px-4 py-3.5">
      <div className={`text-2xl font-extrabold leading-none ${danger && n ? 'text-rose-300' : 'text-slate-100'}`}>{n}</div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400 mt-1.5">{label}</div>
    </div>
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
        onBack={() => setSelTrack(null)} onChange={load}
      />
    </div>;
  }

  // --- Detalhe do projeto ---
  if (selProjeto && m.projetosById[selProjeto]) {
    const proj = m.projetosById[selProjeto];
    const cli = m.clientesById[proj.cliente_id];
    const tracks = m.tracksByProjeto[proj.id] || [];
    const st = trackStats(tracks);
    return (
      <div>{header}
        <button onClick={() => setSelProjeto(null)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-4"><ArrowLeft className="w-4 h-4" /> Volver al portafolio</button>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2"><FolderKanban className="w-5 h-5 text-[#FAA61A]" /> {proj.nome}</h1>
        <div className="flex flex-wrap gap-2 mt-2 mb-5">
          <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-blue-300 bg-blue-500/15 border-blue-500/25">{cli?.nome}</span>
          <Badge v={proj.status} />
          {proj.gerente && <span className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300">Gerente: {proj.gerente}</span>}
          {proj.inicio && <span className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300">Inicio: {fmtDate(proj.inicio)}</span>}
        </div>
        {proj.descricao && <p className="text-sm text-slate-300 mb-5 max-w-3xl">{proj.descricao}</p>}
        <div className="grid grid-cols-3 gap-3 max-w-md mb-6">
          <Kpi n={st.total} label="Tracks" /><Kpi n={st.enCurso} label="En curso" /><Kpi n={st.bloqueados} label="Bloqueados" danger />
        </div>
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
  const allTracks = data.tracks;
  const abiertas = data.tareas.filter((t) => t.status !== 'fechado').length;
  const bloqueadas = data.tareas.filter((t) => t.status === 'bloqueada').length;
  return (
    <div>{header}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Kpi n={m.clientes.length} label="Clientes" />
        <Kpi n={data.projetos.length} label="Proyectos" />
        <Kpi n={allTracks.length} label="Tracks" />
        <Kpi n={abiertas} label="Tareas abiertas" />
        <Kpi n={bloqueadas} label="Bloqueadas" danger />
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
            {projetos.length ? projetos.map((proj) => {
              const tracks = m.tracksByProjeto[proj.id] || [];
              const st = trackStats(tracks);
              return (
                <div key={proj.id} className="bg-[#122131]/60 border border-[#273647] rounded-2xl p-4 mb-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2"><FolderKanban className="w-4 h-4 text-[#FAA61A]" /><span className="text-sm font-bold text-slate-100">{proj.nome}</span><Badge v={proj.status} /></div>
                      <p className="text-[11px] text-slate-400 mt-1 ml-6">{st.total} tracks · {st.enCurso} en curso{st.bloqueados ? ` · ${st.bloqueados} bloqueados` : ''}</p>
                    </div>
                    <button onClick={() => setSelProjeto(proj.id)} className="text-[12px] text-slate-300 hover:text-[#FAA61A] flex items-center gap-1 flex-none">Ver proyecto <ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <div className="divide-y divide-[#273647]/60">
                    {tracks.slice(0, 6).map((t) => <TrackRow key={t.id} track={t} onOpen={setSelTrack} />)}
                  </div>
                  {tracks.length > 6 && <button onClick={() => setSelProjeto(proj.id)} className="text-[12px] text-slate-400 hover:text-slate-200 mt-2 ml-3">+ {tracks.length - 6} tracks más</button>}
                </div>
              );
            }) : <p className="text-sm text-slate-500 px-1">Sin proyectos. Usá “Nuevo proyecto”.</p>}
          </div>
        );
      })}
    </div>
  );
}
