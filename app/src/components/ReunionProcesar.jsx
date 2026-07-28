import React, { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import { extractText } from '../lib/extractText';
import { enginesDisponibles, procesarMinuta } from '../services/ai';
import { createReuniaoParaTrack, createTarea, createRisco, fetchContactos, upsertContacto } from '../services/data';
import { inputCls, btnGold, SEVERIDADES, SEVERIDAD_LABEL, RISK_TIPOS, RISK_TIPO_LABEL } from './trackingUi';

const norm = (s) => (s || '').trim().toLowerCase();

export default function ReunionProcesar({ trackId, cliente, track, onDone }) {
  const [engines, setEngines] = useState([]);
  const [engine, setEngine] = useState('');
  const [meta, setMeta] = useState({ titulo: '', tipo: 'semanal', data: '' });
  const [texto, setTexto] = useState('');
  const [fileName, setFileName] = useState('');
  const [phase, setPhase] = useState('input'); // input | loading | review
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const [contactos, setContactos] = useState([]);
  const [result, setResult] = useState(null); // { resumen, decisiones, action_items[], riesgos[], participantes[] } editable
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
      const r = await procesarMinuta(engine, texto, { track, cliente });
      // Pre-rellena email de participantes desde el directorio + marca "incluir" en todo
      const byName = Object.fromEntries(contactos.map((c) => [norm(c.nombre), c]));
      const participantes = (r.participantes || []).map((p) => {
        const hit = byName[norm(p.nombre)];
        return { nombre: p.nombre || '', email: p.email || hit?.email || '', organizacion: p.organizacion || hit?.organizacion || '', incluir: true, existe: Boolean(hit) };
      });
      setResult({
        resumen: r.resumen || '',
        decisiones: (r.decisiones || []).map((d) => ({ texto: typeof d === 'string' ? d : (d.texto || ''), incluir: true })),
        action_items: (r.action_items || []).map((a) => ({ titulo: a.titulo || '', responsable: a.responsable || '', prazo: (a.prazo || '').slice(0, 10), incluir: true })),
        riesgos: (r.riesgos || []).map((x) => ({ descricao: x.descricao || '', tipo: RISK_TIPOS.includes(x.tipo) ? x.tipo : 'riesgo', severidade: SEVERIDADES.includes(x.severidade) ? x.severidade : 'media', dueno: x.dueno || '', incluir: true })),
        participantes,
      });
      setPhase('review');
    } catch (x) { setErr(x.message); setPhase('input'); }
  };

  const guardar = async () => {
    setSaving(true); setErr(null);
    try {
      const parts = result.participantes.filter((p) => p.nombre.trim());
      // upsert contactos nuevos/actualizados
      for (const p of parts.filter((p) => p.incluir)) {
        try { await upsertContacto({ nombre: p.nombre.trim(), email: p.email || null, organizacion: p.organizacion || null }); }
        catch { /* duplicado (23505) u otro: seguimos */ }
      }
      const decisoesTxt = result.decisiones.filter((d) => d.incluir && d.texto.trim()).map((d) => `• ${d.texto.trim()}`).join('\n');
      await createReuniaoParaTrack(trackId, {
        titulo: meta.titulo.trim() || `Reunión ${meta.tipo}`,
        tipo: meta.tipo,
        data: meta.data || null,
        participantes: parts.filter((p) => p.incluir).map((p) => ({ nombre: p.nombre.trim(), email: p.email || null })),
        ata: texto,
        resumo_ia: result.resumen || null,
        decisoes: decisoesTxt || null,
      });
      for (const a of result.action_items.filter((a) => a.incluir && a.titulo.trim())) {
        await createTarea({ track_id: trackId, titulo: a.titulo.trim(), status: 'aberto', responsavel: a.responsable || null, previsao_entrega: a.prazo || null, origen: 'reunion' });
      }
      for (const x of result.riesgos.filter((x) => x.incluir && x.descricao.trim())) {
        await createRisco({ track_id: trackId, descricao: x.descricao.trim(), tipo: x.tipo, severidade: x.severidade, dueno: x.dueno || null, status: 'abierto' });
      }
      onDone && onDone();
    } catch (x) { setErr(x.message); } finally { setSaving(false); }
  };

  const setR = (patch) => setResult((r) => ({ ...r, ...patch }));
  const setItem = (key, i, patch) => setResult((r) => ({ ...r, [key]: r[key].map((it, j) => (j === i ? { ...it, ...patch } : it)) }));

  // ---------- render ----------
  if (phase === 'loading') {
    return <div className="flex items-center gap-2 text-sm text-slate-300 py-6"><Loader2 className="w-4 h-4 animate-spin" /> Procesando con {engines.find((e) => e.id === engine)?.label}…</div>;
  }

  if (phase === 'review' && result) {
    return (
      <div className="space-y-4 bg-[#0b1626] border border-[#273647] rounded-xl p-3">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">Revisá y ajustá antes de guardar</div>
        {err && <p className="text-[11px] text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{err}</p>}

        <label className="block text-[11px] text-slate-400">Resumen
          <textarea className={inputCls} rows={2} value={result.resumen} onChange={(e) => setR({ resumen: e.target.value })} />
        </label>

        <Section title="Decisiones">
          {result.decisiones.map((d, i) => (
            <Row key={i} incluir={d.incluir} onToggle={() => setItem('decisiones', i, { incluir: !d.incluir })}>
              <input className={inputCls} value={d.texto} onChange={(e) => setItem('decisiones', i, { texto: e.target.value })} />
            </Row>
          ))}
        </Section>

        <Section title="Action items → tareas">
          {result.action_items.map((a, i) => (
            <Row key={i} incluir={a.incluir} onToggle={() => setItem('action_items', i, { incluir: !a.incluir })}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 w-full">
                <input className={inputCls} placeholder="Tarea" value={a.titulo} onChange={(e) => setItem('action_items', i, { titulo: e.target.value })} />
                <input className={inputCls} placeholder="Responsable" value={a.responsable} onChange={(e) => setItem('action_items', i, { responsable: e.target.value })} />
                <input type="date" className={inputCls} value={a.prazo} onChange={(e) => setItem('action_items', i, { prazo: e.target.value })} />
              </div>
            </Row>
          ))}
        </Section>

        <Section title="Riesgos → RAID">
          {result.riesgos.map((x, i) => (
            <Row key={i} incluir={x.incluir} onToggle={() => setItem('riesgos', i, { incluir: !x.incluir })}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 w-full">
                <input className={`${inputCls} md:col-span-2`} placeholder="Descripción" value={x.descricao} onChange={(e) => setItem('riesgos', i, { descricao: e.target.value })} />
                <select className={inputCls} value={x.tipo} onChange={(e) => setItem('riesgos', i, { tipo: e.target.value })}>{RISK_TIPOS.map((t) => <option key={t} value={t}>{RISK_TIPO_LABEL[t]}</option>)}</select>
                <select className={inputCls} value={x.severidade} onChange={(e) => setItem('riesgos', i, { severidade: e.target.value })}>{SEVERIDADES.map((s) => <option key={s} value={s}>{SEVERIDAD_LABEL[s]}</option>)}</select>
              </div>
            </Row>
          ))}
        </Section>

        <Section title="Participantes → directorio">
          {result.participantes.map((p, i) => (
            <Row key={i} incluir={p.incluir} onToggle={() => setItem('participantes', i, { incluir: !p.incluir })}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 w-full items-center">
                <input className={inputCls} placeholder="Nombre" value={p.nombre} onChange={(e) => setItem('participantes', i, { nombre: e.target.value })} />
                <input className={inputCls} placeholder="Email" value={p.email} onChange={(e) => setItem('participantes', i, { email: e.target.value })} />
                <span className="text-[10px] text-slate-500">{p.existe ? 'ya en directorio' : 'nuevo'}</span>
              </div>
            </Row>
          ))}
        </Section>

        <div className="flex gap-2">
          <button disabled={saving} onClick={guardar} className={btnGold}>{saving ? 'Guardando…' : 'Guardar reunión'}</button>
          <button onClick={() => setPhase('input')} className="text-xs text-slate-400 px-2">Volver</button>
        </div>
      </div>
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
      {!engines.length && <p className="text-[10px] text-amber-300">Configurá una API key (ej.: GEMINI_API_KEY) en Vercel para habilitar el procesamiento.</p>}
    </div>
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
