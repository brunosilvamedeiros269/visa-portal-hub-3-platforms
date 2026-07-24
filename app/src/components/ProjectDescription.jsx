import React from 'react';

/**
 * Auxiliar para renderizar negrito (**texto**) e texto normal sem exibir asteriscos brutos.
 */
function renderFormattedText(text) {
  if (!text) return null;
  let cleaned = text.replace(/^[\*\u2022]\s*/, '').replace(/\s*\*$/, '').trim();
  const parts = cleaned.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Parser de descrição robusto para extrair pares de Chave-Valor formatados em markdown.
 */
export function parseDescription(text) {
  if (!text) return { isStructured: false, items: [], raw: '' };

  const rawStr = text.trim();

  if (rawStr.includes('**')) {
    const items = [];
    
    // Busca todas as ocorrências de **Chave:** ou **Chave**
    const keyRegex = /\*\*(.*?)\*\*:?/g;
    let match;
    const matches = [];

    while ((match = keyRegex.exec(rawStr)) !== null) {
      matches.push({
        full: match[0],
        keyText: match[1],
        index: match.index,
        endIndex: match.index + match[0].length
      });
    }

    // Filtra apenas ocorrências que representam chaves de campos (possuem ':')
    const keyHeaders = matches.filter(m => {
      const hasColon = m.keyText.endsWith(':') || rawStr.slice(m.endIndex, m.endIndex + 1) === ':';
      return hasColon;
    });

    if (keyHeaders.length > 0) {
      for (let i = 0; i < keyHeaders.length; i++) {
        const curr = keyHeaders[i];
        const next = keyHeaders[i + 1];

        let keyName = curr.keyText.replace(/:$/, '').trim();
        let valRaw = next ? rawStr.slice(curr.endIndex, next.index) : rawStr.slice(curr.endIndex);

        // Remove dois pontos inicial se ficou fora do **
        if (valRaw.startsWith(':')) valRaw = valRaw.slice(1);
        valRaw = valRaw.trim();

        // Limpa marcadores de tópicos (* ou .) que separam os itens
        valRaw = valRaw.replace(/^[\*\u2022\s]+/, '').replace(/[\*\u2022\s]+$/, '').trim();
        valRaw = valRaw.replace(/\s*\.\s*\*$/, '').trim();

        if (keyName) {
          items.push({ key: keyName, value: valRaw });
        }
      }

      if (items.length > 0) {
        return { isStructured: true, items };
      }
    }
  }

  // Fallback: se houver tópicos marcados por asteriscos ou hífens
  if (rawStr.includes('\n') || rawStr.includes(' * ')) {
    const rawSegments = rawStr.includes(' * ') ? rawStr.split(/\s\*\s/) : rawStr.split('\n');
    const items = rawSegments
      .map(s => s.replace(/^[\*\-\u2022]\s*/, '').trim())
      .filter(Boolean);

    if (items.length > 1) {
      return { isStructured: false, isList: true, items };
    }
  }

  return { isStructured: false, isList: false, raw: rawStr };
}

export default function ProjectDescription({ description, className = '' }) {
  if (!description) return null;

  const parsed = parseDescription(description);

  // Se for texto estruturado com Chave-Valor
  if (parsed.isStructured) {
    return (
      <div className={`mt-2 ${className}`}>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {parsed.items.map((item, idx) => {
            const isHighlightKey = [
              'Cliente', 'País', 'PM Visa (líder)', 'PM Visa', 
              'Processador', 'Tracks', 'Rota crítica (débito)', 'Habilitador Click to Pay',
              'TSP / SDK (ITSP)', 'Certificador', 'Contatos — banco', 'Visa', 'Thales', 'Prisma'
            ].includes(item.key);

            return (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs transition-colors shadow-sm max-w-full flex-wrap"
              >
                <span className={`font-semibold shrink-0 ${isHighlightKey ? 'text-blue-400' : 'text-slate-400'}`}>
                  {item.key}:
                </span>
                <span className="text-slate-200 font-medium">
                  {renderFormattedText(item.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Se for uma lista simples
  if (parsed.isList) {
    return (
      <div className={`mt-2 ${className}`}>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
          {parsed.items.map((item, idx) => (
            <li key={idx}>{renderFormattedText(item)}</li>
          ))}
        </ul>
      </div>
    );
  }

  // Se for parágrafo de texto comum
  return (
    <p className={`text-xs text-slate-300 leading-relaxed mt-1 ${className}`}>
      {renderFormattedText(parsed.raw)}
    </p>
  );
}
