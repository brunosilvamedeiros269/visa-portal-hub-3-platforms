import React, { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import { extractText } from '../lib/extractText';
import { enginesDisponibles, procesarMinuta } from '../services/ai';
import { createReunionMultiTrack, createTarea, createRisco, fetchContactos, insertContacto, updateContacto } from '../services/data';
import { destinoInicial, destinoFields, tracksConItems, reconcileTrackIds, toggleTrackId } from '../lib/minutaRouting';
import { inputCls, btnGold, SEVERIDADES, RISK_TIPOS } from './trackingUi';
import ReunionRevision from './ReunionRevision';

const norm = (s) => (s || '').trim().toLowerCase();

export default function ReunionProcesar({ proyecto, cliente, tracks, onDone }) {
  const [engines, setEngines] = useState([]);
  const [engine, setEngine] = useState('');
  const [meta, setMeta] = useState({ titulo: '', tipo: 'semanal', data: '' });
  const [texto, setTexto] = useState('');
  const [fileName, setFileName] = useState('');
  const [phase, setPhase] = useState('input'); // input | loading | review
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const [contactos, setContactos] = useState([]);
  const [result, setResult] = useState(null);
  const [trackIds, setTrackIds] = useState([]);
  // Tracks que el usuario desmarcó a mano: reconcileTrackIds no las reingresa
  // aunque un item se corrija después hacia ellas (el desmarque manual gana).
  const [uncheckedTrackIds, setUncheckedTrackIds] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    enginesDisponibles().then((list) => { setEngines(list); if (list[0]) setEngine(list[0].id); }).catch(() => setEngines([]));
    fetchContactos().then(setContactos).catch(() => setContactos([]));
  }, []);

  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    setErr(null); setFileName(file.name);
    try { const t = await extractText(file); setTexto(t); }
    catch (x) { setErr(x.message); setFileName(''); }
    finally { if (inputRef.current) inputRef.current.value = ''; }
  };

  const procesar = async () => {
    if (!engine) { setErr('No hay motor configurado'); return; }
    if (!texto.trim()) { setErr('Subí un archivo o pegá la transcripción'); return; }
    setErr(null); setPhase('loading');
    try {
      const ctx = {
        cliente,
        proyecto: proyecto.nome,
        // `tracks` viene de la base (columna `nome`, portugués); acá se traduce
        // al contrato en español que espera api/minutaLib.js.
        tracks: tracks.map((t) => ({ nombre: t.nome, frente: t.frente, proximo_paso: t.proximo_paso })),
      };
      const r = await procesarMinuta(engine, texto, ctx);
      // Pre-rellena email de participantes desde el directorio + marca "incluir" en todo
      const byName = Object.fromEntries(contactos.map((c) => [norm(c.nombre), c]));
      const participantes = (r.participantes || []).map((p) => {
        const hit = byName[norm(p.nombre)];
        return { nombre: p.nombre || '', email: p.email || hit?.email || '', organizacion: p.organizacion || hit?.organizacion || '', incluir: true, existe: Boolean(hit) };
      });
      const action_items = (r.action_items || []).map((a) => ({
        titulo: a.titulo || '', responsable: a.responsable || '', prazo: (a.prazo || '').slice(0, 10),
        destino: destinoInicial(a, tracks), incluir: true,
      }));
      const riesgos = (r.riesgos || []).map((x) => ({
        descricao: x.descricao || '',
        tipo: RISK_TIPOS.includes(x.tipo) ? x.tipo : 'riesgo',
        severidade: SEVERIDADES.includes(x.severidade) ? x.severidade : 'media',
        dueno: x.dueno || '',
        destino: destinoInicial(x, tracks), incluir: true,
      }));
      setResult({
        resumen: r.resumen || '',
        decisiones: (r.decisiones || []).map((d) => ({ texto: typeof d === 'string' ? d : (d.texto || ''), incluir: true })),
        action_items, riesgos, participantes,
      });
      // Pré-marca as tracks que receberam algum item; o usuário ajusta na revisão.
      setTrackIds(tracksConItems(action_items, riesgos));
      setUncheckedTrackIds([]);
      setPhase('review');
    } catch (x) { setErr(x.message); setPhase('input'); }
  };

  const guardar = async () => {
    setSaving(true); setErr(null);
    try {
      const parts = result.participantes.filter((p) => p.nombre.trim());
      // upsert contactos nuevos/actualizados
      for (const p of parts.filter((p) => p.incluir)) {
        const nombre = p.nombre.trim();
        const hit = contactos.find((c) => norm(c.nombre) === norm(nombre));
        try {
          if (!hit) {
            await insertContacto({ nombre, email: p.email || null, organizacion: p.organizacion || null });
          } else if ((p.email && p.email !== hit.email) || (p.organizacion && p.organizacion !== hit.organizacion)) {
            await updateContacto(hit.id, { email: p.email || hit.email || null, organizacion: p.organizacion || hit.organizacion || null });
          }
        } catch (e) {
          // 23505 = duplicado por carrera (índice lower(nombre)); ignorar. Otros: avisar.
          const msg = String(e?.message || '');
          if (!msg.includes('23505') && !/duplicate|unique/i.test(msg)) console.warn('contacto:', msg);
        }
      }
      const decisoesTxt = result.decisiones.filter((d) => d.incluir && d.texto.trim()).map((d) => `• ${d.texto.trim()}`).join('\n');
      await createReunionMultiTrack({
        cliente_id: proyecto.cliente_id,
        projeto_id: proyecto.id,
        titulo: meta.titulo.trim() || `Reunión ${meta.tipo}`,
        tipo: meta.tipo,
        data: meta.data || null,
        participantes: parts.filter((p) => p.incluir).map((p) => ({ nombre: p.nombre.trim(), email: p.email || null })),
        ata: texto,
        resumo_ia: result.resumen || null,
        decisoes: decisoesTxt || null,
      }, trackIds);

      for (const a of result.action_items.filter((a) => a.incluir && a.titulo.trim())) {
        await createTarea({
          ...destinoFields(a.destino, proyecto.id),
          titulo: a.titulo.trim(), status: 'aberto',
          responsavel: a.responsable || null, previsao_entrega: a.prazo || null, origen: 'reunion',
        });
      }
      for (const x of result.riesgos.filter((x) => x.incluir && x.descricao.trim())) {
        await createRisco({
          ...destinoFields(x.destino, proyecto.id),
          descricao: x.descricao.trim(), tipo: x.tipo, severidade: x.severidade,
          dueno: x.dueno || null, status: 'abierto',
        });
      }
      onDone && onDone();
    } catch (x) { setErr(x.message); } finally { setSaving(false); }
  };

  const setR = (patch) => setResult((r) => ({ ...r, ...patch }));
  const setItem = (key, i, patch) => {
    setResult((r) => ({ ...r, [key]: r[key].map((it, j) => (j === i ? { ...it, ...patch } : it)) }));
    // Si el usuario corrigió el destino de un action item o riesgo hacia una
    // track, esa track se suma a "Tracks de esta reunión" (salvo desmarque manual).
    if ((key === 'action_items' || key === 'riesgos') && patch.destino) {
      setTrackIds((ids) => reconcileTrackIds(ids, uncheckedTrackIds, patch.destino));
    }
  };
  const toggleTrack = (id) => {
    const next = toggleTrackId(trackIds, uncheckedTrackIds, id);
    setTrackIds(next.trackIds);
    setUncheckedTrackIds(next.uncheckedIds);
  };

  // ---------- render ----------
  if (phase === 'loading') {
    return <div className="flex items-center gap-2 text-sm text-slate-300 py-6"><Loader2 className="w-4 h-4 animate-spin" /> Procesando con {engines.find((e) => e.id === engine)?.label}…</div>;
  }

  if (phase === 'review' && result) {
    return (
      <ReunionRevision
        result={result} tracks={tracks} trackIds={trackIds} saving={saving} err={err}
        onChangeResult={setR} onChangeItem={setItem} onToggleTrack={toggleTrack}
        onGuardar={guardar} onVolver={() => setPhase('input')}
      />
    );
  }

  // input
  return (
    <div className="space-y-2 bg-[#0b1626] border border-[#273647] rounded-xl p-3">
      {err && <p className="text-[11px] text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{err}</p>}
      <div className="grid grid-cols-2 gap-2">
        <input className={inputCls} placeholder="Título" value={meta.titulo} onChange={(e) => setMeta({ ...meta, titulo: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <select className={inputCls} value={meta.tipo} onChange={(e) => setMeta({ ...meta, tipo: e.target.value })}>
            <option value="steerco">SteerCo (mensual)</option><option value="semanal">Semanal</option><option value="adhoc">Ad-hoc</option>
          </select>
          <input type="date" className={inputCls} value={meta.data} onChange={(e) => setMeta({ ...meta, data: e.target.value })} />
        </div>
      </div>

      <input ref={inputRef} type="file" className="hidden" accept=".docx,application/pdf" onChange={onFile} />
      <button onClick={() => inputRef.current && inputRef.current.click()} className="w-full border border-dashed border-[#33507a] rounded-lg py-2.5 text-[11px] text-slate-400 hover:text-slate-200 hover:border-[#FAA61A]/50 flex items-center justify-center gap-2">
        <Upload className="w-3.5 h-3.5" /> {fileName ? `Archivo: ${fileName}` : 'Subir .docx o PDF de texto'}
      </button>
      <div className="text-[10px] text-slate-500 text-center">o pegá la transcripción abajo</div>
      <textarea className={inputCls} rows={5} placeholder="Pegá aquí la transcripción…" value={texto} onChange={(e) => setTexto(e.target.value)} />

      <div className="flex items-center gap-2">
        <label className="text-[11px] text-slate-400">Motor
          <select className={`${inputCls} !w-auto ml-1`} value={engine} onChange={(e) => setEngine(e.target.value)} disabled={!engines.length}>
            {engines.length ? engines.map((e) => <option key={e.id} value={e.id}>{e.label}</option>) : <option>— sin motor configurado —</option>}
          </select>
        </label>
        <button onClick={procesar} disabled={!engines.length} className={btnGold}>Procesar con IA</button>
      </div>
      <p className="text-[10px] text-slate-500">La IA propone a qué track va cada item; vos lo corregís antes de guardar.</p>
      {!engines.length && <p className="text-[10px] text-amber-300">Configurá una API key (ej.: GEMINI_API_KEY) en Vercel para habilitar el procesamiento.</p>}
    </div>
  );
}
