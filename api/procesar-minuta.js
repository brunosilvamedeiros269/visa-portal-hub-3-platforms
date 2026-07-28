import { ENGINES, buildPrompt, parseModelJson, MAX_CHARS } from './minutaLib.js';

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const { engine, texto, contexto } = await readBody(req);
  const def = ENGINES.find((e) => e.id === engine);
  if (!def) return res.status(400).json({ error: 'Motor desconocido' });
  const key = process.env[def.envKey];
  if (!key) return res.status(400).json({ error: `El motor ${def.label} no está configurado` });
  if (!texto || !String(texto).trim()) return res.status(400).json({ error: 'Texto vacío' });
  if (String(texto).length > MAX_CHARS) return res.status(400).json({ error: `El texto supera ${MAX_CHARS} caracteres` });

  const model = process.env[def.modelEnv] || def.defaultModel;
  const prompt = buildPrompt(String(texto), contexto || {});
  try {
    const rawText = await callProvider(def.id, model, key, prompt);
    const parsed = parseModelJson(rawText);
    return res.status(200).json({ engine: def.id, model, ...parsed });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Error al procesar la minuta' });
  }
}

async function callProvider(id, model, key, prompt) {
  if (id === 'gemini') return callGemini(model, key, prompt);
  if (id === 'xai') return callXai(model, key, prompt);
  if (id === 'claude') return callClaude(model, key, prompt);
  throw new Error('Motor desconocido');
}

// Gemini (activo)
async function callGemini(model, key, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: 'application/json', temperature: 0.2 },
    }),
  });
  if (!r.ok) throw new Error(`Gemini: ${r.status} ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const text = j?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  if (!text) throw new Error('Gemini no devolvió texto');
  return text;
}

// xAI (OpenAI-compatible) — desactivado hasta poner XAI_API_KEY
async function callXai(model, key, prompt) {
  const r = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`xAI: ${r.status} ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const text = j?.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('xAI no devolvió texto');
  return text;
}

// Claude (Anthropic Messages API) — desactivado hasta poner ANTHROPIC_API_KEY
async function callClaude(model, key, prompt) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`Claude: ${r.status} ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const text = (j?.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('') || '';
  if (!text) throw new Error('Claude no devolvió texto');
  return text;
}
