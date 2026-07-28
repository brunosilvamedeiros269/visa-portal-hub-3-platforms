import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
// worker vía bundler (Vite): usa el worker empaquetado
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export async function extractText(file) {
  const type = file.type || '';
  const name = (file.name || '').toLowerCase();

  if (type === DOCX || name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return (value || '').trim();
  }

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let out = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      out += content.items.map((it) => (it.str || '')).join(' ') + '\n';
    }
    const trimmed = out.trim();
    if (!trimmed) throw new Error('El PDF no tiene texto seleccionable (¿escaneado?)');
    return trimmed;
  }

  throw new Error('Formato no soportado (usá .docx o PDF de texto)');
}
