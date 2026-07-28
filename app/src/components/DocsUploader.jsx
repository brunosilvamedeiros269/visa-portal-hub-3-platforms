import React, { useRef, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { uploadDocumento, documentoUrl, deleteDocumento } from '../services/data';
import { fmtDate } from './trackingUi';

export default function DocsUploader({ trackId, docs, onChange }) {
  const inputRef = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const pick = () => inputRef.current && inputRef.current.click();
  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    setBusy(true); setErr(null);
    try { await uploadDocumento(trackId, file, null); onChange(); }
    catch (x) { setErr(x.message); } finally { setBusy(false); if (inputRef.current) inputRef.current.value = ''; }
  };
  const openDoc = async (d) => { try { const url = await documentoUrl(d.path); window.open(url, '_blank', 'noopener'); } catch (x) { setErr(x.message); } };
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
      <h4 className="text-[11px] uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />Documentos</h4>
      <input ref={inputRef} type="file" className="hidden" onChange={onFile} accept=".pdf,.pptx,.ppt,.xlsx,.xls,.docx,.doc,.png,.jpg" />
      <button onClick={pick} disabled={busy} className="w-full border border-dashed border-[#33507a] rounded-lg py-3 text-[11px] text-slate-400 hover:text-slate-200 hover:border-[#FAA61A]/50 flex items-center justify-center gap-2">
        <Upload className="w-3.5 h-3.5" /> {busy ? 'Subiendo…' : 'Subir archivo (PDF, PPTX, XLSX…)'}
      </button>
      {err && <p className="text-[11px] text-rose-400 mt-2">{err}</p>}
      <div className="mt-2">
        {docs.length ? docs.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-2 py-1.5 border-t border-[#273647]/50 first:border-0 text-[11.5px]">
            <button onClick={() => openDoc(d)} className="text-slate-200 hover:text-[#FAA61A] truncate text-left">📄 {d.nome}</button>
            <span className="flex items-center gap-2 flex-none text-slate-500 text-[10px]">{fmtDate(d.created_at)}{d.subido_por ? ` · ${d.subido_por}` : ''}<button onClick={async () => { setErr(null); try { await deleteDocumento(d); onChange(); } catch (x) { setErr(x.message); } }} className="hover:text-rose-400">✕</button></span>
          </div>
        )) : <p className="text-xs text-slate-400 mt-1">Sin documentos.</p>}
      </div>
    </div>
  );
}
