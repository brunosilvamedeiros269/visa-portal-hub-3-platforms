import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, AlertTriangle, CalendarClock, Flag, Loader2, RefreshCw,
  Link2, ChevronRight, ExternalLink, ListChecks
} from 'lucide-react';
import { fetchTracks, fetchMeetings, fetchTrack } from '../services/notionApi';

// ---------- helpers ----------
// Chaves = valores de dado no Notion; rótulos exibidos em espanhol.
const STATUS_STYLE = {
  'Em curso': 'text-blue-300 bg-blue-500/15 border-blue-500/25',
  'Em curso - atrasado': 'text-orange-300 bg-orange-500/15 border-orange-500/25',
  'Pendente': 'text-yellow-300 bg-yellow-500/15 border-yellow-500/25',
  'Sin iniciar': 'text-slate-300 bg-slate-500/15 border-slate-500/25',
  'Bloqueado': 'text-rose-300 bg-rose-500/15 border-rose-500/25',
  'Concluído': 'text-emerald-300 bg-emerald-500/15 border-emerald-500/25',
};
const STATUS_LABEL = {
  'Em curso': 'En curso',
  'Em curso - atrasado': 'En curso · atrasado',
  'Pendente': 'Pendiente',
  'Sin iniciar': 'Sin iniciar',
  'Bloqueado': 'Bloqueado',
  'Concluído': 'Concluido',
};
const statusClass = (s) => STATUS_STYLE[s] || 'text-slate-300 bg-slate-500/15 border-slate-500/25';
const statusLabel = (s) => STATUS_LABEL[s] || s || 'Sin estado';

function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

function StatusBadge({ status }) {
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap ${statusClass(status)}`}>
      {statusLabel(status)}
    </span>
  );
}

// ---------- dashboard ----------
function Kpi({ n, label }) {
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl px-4 py-3.5">
      <div className="text-2xl font-extrabold text-slate-100 leading-none">{n}</div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400 mt-1.5">{label}</div>
    </div>
  );
}

function TrackRow({ track, onOpen }) {
  const p = track.props || {};
  return (
    <button
      onClick={() => onOpen(track.id)}
      className="w-full flex items-center justify-between gap-3 text-left px-3 py-2.5 rounded-lg hover:bg-[#122131] transition-colors group"
    >
      <span className="flex items-center gap-2.5 min-w-0">
        {p['Ruta crítica'] && <Flag className="w-3.5 h-3.5 text-[#FAA61A] flex-none" title="Ruta crítica" />}
        <span className="text-sm text-slate-200 truncate">{p['Track']}</span>
      </span>
      <span className="flex items-center gap-2 flex-none">
        <StatusBadge status={p['Status']} />
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
      </span>
    </button>
  );
}

function Dashboard({ tracks, meetings, onOpen }) {
  const clients = useMemo(() => {
    const map = {};
    for (const t of tracks) {
      const c = t.props?.['Cliente'] || 'Sin cliente';
      (map[c] = map[c] || []).push(t);
    }
    return map;
  }, [tracks]);

  const total = tracks.length;
  const enCurso = tracks.filter((t) => (t.props?.['Status'] || '').startsWith('Em curso')).length;
  const atrasados = tracks.filter((t) => (t.props?.['Status'] || '').includes('atrasado')).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi n={total} label="Tracks en total" />
        <Kpi n={enCurso} label="En curso" />
        <Kpi n={atrasados} label="Atrasados" />
        <Kpi n={meetings.length} label="Reuniones registradas" />
      </div>

      {Object.entries(clients).map(([cliente, list]) => (
        <div key={cliente} className="bg-[#122131]/60 border border-[#273647] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-bold text-slate-100">{cliente}</h3>
            <span className="text-[11px] text-slate-400">{list.length} tracks</span>
          </div>
          <div className="divide-y divide-[#273647]/60">
            {list.map((t) => <TrackRow key={t.id} track={t} onOpen={onOpen} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- detail ----------
function Block({ b }) {
  if (b.type === 'heading') return <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mt-5 mb-2">{b.text}</h4>;
  if (b.type === 'paragraph') return b.text ? <p className="text-sm text-slate-300 leading-relaxed mb-2">{b.text}</p> : null;
  if (b.type === 'bullet') return <li className="text-sm text-slate-300 leading-relaxed ml-4 list-disc marker:text-[#FAA61A]">{b.text}</li>;
  if (b.type === 'todo') return (
    <div className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed mb-1.5">
      <span className={`mt-0.5 w-3.5 h-3.5 rounded border flex-none ${b.checked ? 'bg-emerald-500/30 border-emerald-400' : 'border-slate-500'}`} />
      <span>{b.text}</span>
    </div>
  );
  if (b.type === 'quote' || b.type === 'callout') return (
    <div className="text-sm text-slate-200 bg-[#122131] border-l-2 border-[#FAA61A] rounded-r-lg px-3 py-2 my-2">{b.text}</div>
  );
  if (b.type === 'divider') return <hr className="border-[#273647] my-3" />;
  return null;
}

function RelList({ icon, title, ids, resolve }) {
  const items = (ids || []).map(resolve).filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
      <h4 className="text-[11px] uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5">{icon}{title}</h4>
      <div className="space-y-1.5">
        {items.map((it) => (
          <div key={it.id} className="text-[13px] text-slate-200 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FAA61A] flex-none" />
            <span className="truncate">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackDetail({ trackId, tracksById, meetingsById, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    fetchTrack(trackId)
      .then((d) => { if (active) setData(d); })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [trackId]);

  const resolveTrack = (id) => {
    const t = tracksById[id];
    return t ? { id, label: t.props?.['Track'] } : null;
  };
  const resolveMeeting = (id) => {
    const m = meetingsById[id];
    return m ? { id, label: `${m.props?.['Reunião']} · ${fmtDate(m.props?.['Data'])}` } : null;
  };

  const p = data?.props || {};

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-4">
        <ArrowLeft className="w-4 h-4" /> Volver al panel
      </button>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 text-sm py-20 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando track…
        </div>
      )}

      {error && !loading && (
        <div className="bg-[#1C2B3C] border border-rose-500/30 rounded-xl p-4 text-sm text-rose-300">
          Error al cargar: {error}
        </div>
      )}

      {data && !loading && (
        <>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
                {p['Ruta crítica'] && <Flag className="w-4 h-4 text-[#FAA61A]" />}
                {p['Track']}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-blue-300 bg-blue-500/15 border-blue-500/25">{p['Cliente']}</span>
                {p['Frente'] && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-[#FAA61A] bg-[#FAA61A]/12 border-[#FAA61A]/25">{p['Frente']}</span>}
                <StatusBadge status={p['Status']} />
              </div>
            </div>
            {p['Próximo passo'] && (
              <div className="bg-[#1C2B3C] border border-[#273647] border-l-[3px] border-l-[#FAA61A] rounded-xl p-3.5 md:max-w-sm">
                <div className="text-[10.5px] uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5" />Próximo paso</div>
                <div className="text-[13px] text-slate-200 leading-snug">{p['Próximo passo']}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
            <div className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2.5">
              <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Responsable</div>
              <div className="text-[13px] font-semibold text-slate-200 mt-1">{p['Responsável'] || '—'}</div>
            </div>
            <div className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2.5">
              <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Inicio</div>
              <div className="text-[13px] font-semibold text-slate-200 mt-1">{fmtDate(p['Início'])}</div>
            </div>
            <div className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2.5">
              <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Previsión / plazo</div>
              <div className="text-[13px] font-semibold text-[#FAA61A] mt-1">{fmtDate(p['Previsão fim'])}</div>
            </div>
            <div className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2.5">
              <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Ruta crítica</div>
              <div className="text-[13px] font-semibold text-slate-200 mt-1">{p['Ruta crítica'] ? 'Sí' : 'No'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-[#1C2B3C] border border-[#273647] rounded-2xl p-5">
              {(data.blocks || []).length === 0
                ? <p className="text-sm text-slate-400">Sin contenido detallado en esta página.</p>
                : data.blocks.map((b, i) => <Block key={i} b={b} />)}
              <a href={data.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#FAA61A] mt-5">
                <ExternalLink className="w-3.5 h-3.5" /> Editar en Notion
              </a>
            </div>

            <div className="space-y-4">
              <RelList icon={<Link2 className="w-3.5 h-3.5" />} title="Depende de" ids={p['Depende de']} resolve={resolveTrack} />
              <RelList icon={<Flag className="w-3.5 h-3.5" />} title="Requerido por" ids={p['Requerido por']} resolve={resolveTrack} />
              <RelList icon={<CalendarClock className="w-3.5 h-3.5" />} title="Reuniones relacionadas" ids={p['Reuniões']} resolve={resolveMeeting} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- container ----------
export default function TrackingView() {
  const [tracks, setTracks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    Promise.all([fetchTracks(), fetchMeetings()])
      .then(([t, m]) => { setTracks(t); setMeetings(m); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const tracksById = useMemo(() => Object.fromEntries(tracks.map((t) => [t.id, t])), [tracks]);
  const meetingsById = useMemo(() => Object.fromEntries(meetings.map((m) => [m.id, m])), [meetings]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Seguimiento de proyectos</h2>
          <p className="text-xs text-slate-400">Datos en vivo de la base Notion — tracks y reuniones por cliente.</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-[#273647] hover:border-[#FAA61A]/40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 text-sm py-20 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando datos de Notion…
        </div>
      )}

      {error && !loading && (
        <div className="bg-[#1C2B3C] border border-amber-500/30 rounded-xl p-5 text-sm">
          <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2">
            <AlertTriangle className="w-4 h-4" /> No fue posible leer la base Notion
          </div>
          <p className="text-slate-300 mb-2">{error}</p>
          <ul className="text-slate-400 text-[13px] list-disc ml-5 space-y-1">
            <li>Verificá que la variable <code className="text-slate-200">NOTION_TOKEN</code> esté en Vercel y que haya un nuevo deploy.</li>
            <li>Verificá que la conexión <code className="text-slate-200">Dashboard Vercel VISA</code> esté vinculada a la página <b>Proyectos</b> en Notion.</li>
          </ul>
        </div>
      )}

      {!loading && !error && (
        selected
          ? <TrackDetail trackId={selected} tracksById={tracksById} meetingsById={meetingsById} onBack={() => setSelected(null)} />
          : <Dashboard tracks={tracks} meetings={meetings} onOpen={setSelected} />
      )}
    </div>
  );
}
