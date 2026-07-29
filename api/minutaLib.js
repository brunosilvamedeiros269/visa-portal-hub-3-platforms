// Lógica pura para procesar minutas. Sin red, sin claves. Reutilizada por el endpoint.
export const MAX_CHARS = 60000;

export const ENGINES = [
  { id: 'gemini', label: 'Gemini', envKey: 'GEMINI_API_KEY', modelEnv: 'GEMINI_MODEL', defaultModel: 'gemini-flash-latest' },
  { id: 'xai', label: 'xAI (Grok)', envKey: 'XAI_API_KEY', modelEnv: 'XAI_MODEL', defaultModel: 'grok-4' },
  { id: 'claude', label: 'Claude', envKey: 'ANTHROPIC_API_KEY', modelEnv: 'CLAUDE_MODEL', defaultModel: 'claude-sonnet-5' },
];

export function buildPrompt(texto, contexto = {}) {
  const tracks = Array.isArray(contexto.tracks) ? contexto.tracks.filter((t) => t && t.nombre) : [];
  const ctx = [
    contexto.cliente && `Cliente: ${contexto.cliente}`,
    contexto.proyecto && `Proyecto: ${contexto.proyecto}`,
    contexto.track && `Track: ${contexto.track}`,
  ].filter(Boolean).join(' · ');

  // Lista as tracks para que el modelo pueda enrutar cada item. Incluye el próximo
  // paso porque describe en qué anda cada track hoy — es lo que permite distinguirlas.
  const listaTracks = tracks.length ? [
    'TRACKS DEL PROYECTO (destinos posibles):',
    ...tracks.map((t) => `- "${t.nombre}"${t.frente ? ` (frente: ${t.frente})` : ''}${t.proximo_paso ? ` — ahora: ${t.proximo_paso}` : ''}`),
    '- "proyecto" — para items transversales (afectan a varias tracks o a ninguna en particular).',
  ].join('\n') : '';

  const reglaTrack = tracks.length
    ? 'En "track" usá EXACTAMENTE uno de los nombres listados arriba, o "proyecto". Si el item es transversal o no queda claro a qué track pertenece, usá "proyecto": NO adivines una track.'
    : '';

  // El campo "track" solo se pide en el schema cuando hay tracks para enrutar;
  // sin lista de tracks no hay a qué mapear, así que se omite para no invitar a inventar un nombre.
  const campoTrack = tracks.length ? ', "track": "string"' : '';

  return [
    'Eres un asistente de PMO de Visa Implementation Services.',
    'Analizá la siguiente transcripción/acta de reunión y extraé la información en ESPAÑOL.',
    ctx && `Contexto: ${ctx}.`,
    listaTracks,
    'Devolvé EXCLUSIVAMENTE un objeto JSON válido (sin texto adicional, sin markdown), con esta forma exacta:',
    '{',
    '  "resumen": "string, 2-4 frases",',
    '  "decisiones": ["string"],',
    `  "action_items": [{ "titulo": "string", "responsable": "string|null", "prazo": "YYYY-MM-DD|null"${campoTrack} }],`,
    `  "riesgos": [{ "descricao": "string", "tipo": "riesgo|issue", "severidade": "alta|media|baja", "dueno": "string|null"${campoTrack} }],`,
    '  "participantes": [{ "nombre": "string", "email": "string|null", "organizacion": "string|null" }]',
    '}',
    reglaTrack,
    'Si un bloque no aplica, devolvé una lista vacía. No inventes emails ni fechas: usá null cuando no aparezcan.',
    '',
    'TRANSCRIPCIÓN:',
    texto,
  ].filter(Boolean).join('\n');
}

const asArray = (v) => (Array.isArray(v) ? v : []);
const asStr = (v) => (typeof v === 'string' ? v : '');

export function parseModelJson(raw) {
  const text = String(raw || '');
  // Busca el primer '{' y el último '}' e intenta parsear el bloque.
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  let obj = null;
  if (start !== -1 && end !== -1 && end > start) {
    try { obj = JSON.parse(text.slice(start, end + 1)); } catch { obj = null; }
  }
  if (!obj || typeof obj !== 'object') throw new Error('JSON inválido del modelo');
  // `track` se conserva como string; el mapeo a IDs es del cliente (minutaRouting).
  const withTrack = (it) => ({ ...it, track: asStr(it && it.track) });
  return {
    resumen: asStr(obj.resumen),
    decisiones: asArray(obj.decisiones),
    action_items: asArray(obj.action_items).map(withTrack),
    riesgos: asArray(obj.riesgos).map(withTrack),
    participantes: asArray(obj.participantes),
  };
}
