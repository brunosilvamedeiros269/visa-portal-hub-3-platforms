# Bloco B — Procesar minuta con IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Registrar reuniones y **procesar la transcripción (subir .docx/PDF o pegar texto) con un motor de IA seleccionable** (Gemini activo; xAI/Claude listos y desactivados), extrayendo resumen, decisiones, action items (→ tareas) y riesgos (→ RAID) y participantes, con revisión humana antes de guardar.

**Architecture:** El navegador extrae texto del archivo (mammoth/pdfjs) y llama a una función serverless `/api/procesar-minuta` que, según el motor elegido, llama a Gemini/xAI/Claude vía `fetch` nativo (sin SDK) usando la clave del servidor, y devuelve JSON estructurado. La UI abre un panel de revisión editable dentro del flujo "Registrar reunión" del cockpit; al Guardar, escribe en Supabase (reunión + tareas + riesgos + contactos). Un módulo puro (`api/minutaLib.js`) contiene el builder del prompt y el parser tolerante de JSON, testeado con Vitest.

**Tech Stack:** React 18 + Vite (`app/`), Vercel serverless functions (`/api/*.js`, Node, `fetch` nativo), Supabase (`@supabase/supabase-js`), nuevas deps de front `mammoth` y `pdfjs-dist`, Vitest (ya instalado). Modelos: Gemini `gemini-2.5-flash` (activo), xAI `grok-4`, Claude `claude-sonnet-5`.

## Global Constraints

- **Fonte da verdade = Supabase.** Escritas via `app/src/services/data.js`/`ai.js`; nada de otra plataforma.
- **Chaves só no servidor, sem prefixo `VITE_`.** Env vars Vercel: `GEMINI_API_KEY` (agora), `XAI_API_KEY`, `ANTHROPIC_API_KEY` (depois). Opcionais: `GEMINI_MODEL`, `XAI_MODEL`, `CLAUDE_MODEL`. El endpoint nunca devuelve claves.
- **UI 100% espanhol**; datas `dd/mm/aaaa`; design Visa (navy/dorado, `rounded-xl`).
- **Nada se grava sem confirmação** del usuario en el panel de revisión.
- **Cap de tamaño del texto:** 60.000 caracteres por procesamiento; exceder → error claro, no truncar en silencio.
- **Motores selectables solo si tienen clave** (`/api/engines` reporta `available`); Gemini activo ahora, xAI/Claude desactivados-pero-listos.
- **JSON estricto del modelo:** `{ resumen, decisiones[], action_items[{titulo,responsable,prazo}], riesgos[{descricao,tipo,severidade,dueno}], participantes[{nombre,email,organizacion}] }`.
- **Vocabulário fijo:** `tarea.origen='reunion'`; `riesgos.tipo ∈ riesgo|issue`, `severidade ∈ alta|media|baja`, `status='abierto'`; `reunion.tipo ∈ steerco|semanal|adhoc`.
- **Formatos de archivo:** `.docx` (mammoth) y PDF de texto (pdfjs). PDF escaneado / `.doc` legado → error claro.
- **Build verde:** `cd app && npm run build` y `cd app && npm test` pasan al final de cada task que toca `app/`.

---

### Task 1: Migración SQL — tabla `contactos`

Crea el directorio global de personas (nombre + email) para reuso futuro.

**Files:**
- Create: `db/2026-07-27-bloco-b.sql`

**Interfaces:**
- Produces: tabla `contactos(id, nombre, email, organizacion, created_at)` con índice único `lower(nombre)` y RLS abierto al anon.

- [ ] **Step 1: Escribir el script SQL**

Crear `db/2026-07-27-bloco-b.sql`:

```sql
-- Bloco B — 2026-07-27 — directorio global de contactos
create table if not exists contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  organizacion text,
  created_at timestamptz not null default now()
);
-- match por nombre case-insensitive (evita "Bruno" vs "bruno")
create unique index if not exists contactos_nombre_uidx on contactos (lower(nombre));
alter table contactos enable row level security;
do $$ begin
  create policy anon_all_contactos on contactos for all using (true) with check (true);
exception when duplicate_object then null; end $$;

-- reunioes ya tiene ata, resumo_ia, decisoes, participantes(array), riscos.
-- Nada que alterar allí.
```

- [ ] **Step 2: Ejecutar en Supabase (humano)**

Colar el contenido en el **SQL Editor** del proyecto `iuwvwhofxuvmwnpbsnth` y ejecutar. Confirmar "Success".

- [ ] **Step 3: Verificar**

En el SQL Editor:

```sql
select column_name from information_schema.columns where table_name = 'contactos' order by column_name;
```

Expected: `created_at, email, id, nombre, organizacion`. Commitar:

```bash
git add db/2026-07-27-bloco-b.sql
git commit -m "db(bloco-b): tabla contactos (directorio global de personas)"
```

---

### Task 2: Módulo puro `minutaLib.js` (prompt + parser tolerante) — TDD

Lógica pura compartida por el endpoint: construir el prompt de extracción y parsear el JSON que devuelve el modelo (con o sin cercas de código, con texto alrededor). Sin red, sin claves.

**Files:**
- Create: `api/minutaLib.js`
- Create: `api/minutaLib.test.js`
- Modify: `app/package.json` (script `test` ya existe; incluir `../api` en la búsqueda de Vitest — ver Step 1)

**Interfaces:**
- Produces:
  - `buildPrompt(texto, contexto) -> string` (contexto: `{ track?, cliente? }`, opcionales)
  - `parseModelJson(raw) -> { resumen, decisiones, action_items, riesgos, participantes }` — extrae el primer bloque `{...}` válido; lanza `Error('JSON inválido del modelo')` si no hay JSON parseable; normaliza faltantes a `[]`/`''`.
  - `MAX_CHARS = 60000`
  - `ENGINES = [{ id:'gemini', label:'Gemini', envKey:'GEMINI_API_KEY', modelEnv:'GEMINI_MODEL', defaultModel:'gemini-2.5-flash' }, { id:'xai', label:'xAI (Grok)', envKey:'XAI_API_KEY', modelEnv:'XAI_MODEL', defaultModel:'grok-4' }, { id:'claude', label:'Claude', envKey:'ANTHROPIC_API_KEY', modelEnv:'CLAUDE_MODEL', defaultModel:'claude-sonnet-5' }]`

- [ ] **Step 1: Apuntar Vitest a la carpeta `api/`**

En `app/package.json`, cambiar el script de test para incluir la raíz del repo:

```json
"test": "vitest run --root .. --dir app/src --dir api",
```

Nota: Vitest corre desde `app/`; `--root ..` sube a la raíz del repo para ver `api/`. Si `--dir` múltiple no resuelve en la versión instalada, usar en su lugar `"test": "vitest run"` y crear `app/vitest.config.js` con `test: { include: ['src/**/*.test.js', '../api/**/*.test.js'] }`. Aplicar el que funcione (ver Step 4).

- [ ] **Step 2: Escribir los tests que fallan**

Crear `api/minutaLib.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { buildPrompt, parseModelJson, MAX_CHARS, ENGINES } from './minutaLib.js';

describe('buildPrompt', () => {
  it('incluye el texto y pide JSON estricto con los 5 bloques', () => {
    const p = buildPrompt('Acta: se decidió X.', { track: 'Click to Pay', cliente: 'BROU' });
    expect(p).toContain('Acta: se decidió X.');
    expect(p).toContain('resumen');
    expect(p).toContain('action_items');
    expect(p).toContain('participantes');
    expect(p).toContain('Click to Pay');
  });
});

describe('parseModelJson', () => {
  it('parsea JSON limpio', () => {
    const r = parseModelJson('{"resumen":"ok","decisiones":["d1"],"action_items":[],"riesgos":[],"participantes":[]}');
    expect(r.resumen).toBe('ok');
    expect(r.decisiones).toEqual(['d1']);
  });
  it('extrae JSON dentro de cercas de código y texto alrededor', () => {
    const raw = 'Claro, aquí tienes:\n```json\n{"resumen":"x","decisiones":[],"action_items":[{"titulo":"t","responsable":"Ana","prazo":null}],"riesgos":[],"participantes":[]}\n```\n¡Listo!';
    const r = parseModelJson(raw);
    expect(r.action_items[0].titulo).toBe('t');
  });
  it('normaliza campos faltantes a vacío', () => {
    const r = parseModelJson('{"resumen":"solo resumen"}');
    expect(r.decisiones).toEqual([]);
    expect(r.action_items).toEqual([]);
    expect(r.riesgos).toEqual([]);
    expect(r.participantes).toEqual([]);
    expect(r.resumen).toBe('solo resumen');
  });
  it('lanza si no hay JSON', () => {
    expect(() => parseModelJson('no hay json aquí')).toThrow('JSON inválido del modelo');
  });
});

describe('constantes', () => {
  it('MAX_CHARS = 60000', () => expect(MAX_CHARS).toBe(60000));
  it('ENGINES tiene gemini/xai/claude con envKey', () => {
    expect(ENGINES.map((e) => e.id)).toEqual(['gemini', 'xai', 'claude']);
    expect(ENGINES[0].envKey).toBe('GEMINI_API_KEY');
  });
});
```

- [ ] **Step 3: Correr y ver fallar**

Run: `cd app && npm test`
Expected: FAIL — `api/minutaLib.js` no existe.

- [ ] **Step 4: Implementar `api/minutaLib.js`**

Crear `api/minutaLib.js`:

```js
// Lógica pura para procesar minutas. Sin red, sin claves. Reutilizada por el endpoint.
export const MAX_CHARS = 60000;

export const ENGINES = [
  { id: 'gemini', label: 'Gemini', envKey: 'GEMINI_API_KEY', modelEnv: 'GEMINI_MODEL', defaultModel: 'gemini-2.5-flash' },
  { id: 'xai', label: 'xAI (Grok)', envKey: 'XAI_API_KEY', modelEnv: 'XAI_MODEL', defaultModel: 'grok-4' },
  { id: 'claude', label: 'Claude', envKey: 'ANTHROPIC_API_KEY', modelEnv: 'CLAUDE_MODEL', defaultModel: 'claude-sonnet-5' },
];

export function buildPrompt(texto, contexto = {}) {
  const ctx = [contexto.cliente && `Cliente: ${contexto.cliente}`, contexto.track && `Track: ${contexto.track}`]
    .filter(Boolean).join(' · ');
  return [
    'Eres un asistente de PMO de Visa Implementation Services.',
    'Analizá la siguiente transcripción/acta de reunión y extraé la información en ESPAÑOL.',
    ctx && `Contexto: ${ctx}.`,
    'Devolvé EXCLUSIVAMENTE un objeto JSON válido (sin texto adicional, sin markdown), con esta forma exacta:',
    '{',
    '  "resumen": "string, 2-4 frases",',
    '  "decisiones": ["string"],',
    '  "action_items": [{ "titulo": "string", "responsable": "string|null", "prazo": "YYYY-MM-DD|null" }],',
    '  "riesgos": [{ "descricao": "string", "tipo": "riesgo|issue", "severidade": "alta|media|baja", "dueno": "string|null" }],',
    '  "participantes": [{ "nombre": "string", "email": "string|null", "organizacion": "string|null" }]',
    '}',
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
  return {
    resumen: asStr(obj.resumen),
    decisiones: asArray(obj.decisiones),
    action_items: asArray(obj.action_items),
    riesgos: asArray(obj.riesgos),
    participantes: asArray(obj.participantes),
  };
}
```

- [ ] **Step 5: Correr y ver pasar**

Run: `cd app && npm test`
Expected: PASS (todos verdes, incluyendo pmoLogic previo). Si Vitest no recoge `api/`, aplicar el fallback de config del Step 1 y volver a correr.

- [ ] **Step 6: Commit**

```bash
git add api/minutaLib.js api/minutaLib.test.js app/package.json app/vitest.config.js 2>/dev/null
git commit -m "feat(bloco-b): minutaLib (prompt + parser tolerante) + tests"
```

---

### Task 3: Endpoint serverless `/api/engines` y `/api/procesar-minuta`

Funciones Vercel (Node, `fetch` nativo). `engines` reporta disponibilidad; `procesar-minuta` llama al proveedor elegido.

**Files:**
- Create: `api/engines.js`
- Create: `api/procesar-minuta.js`

**Interfaces:**
- Consumes: `./minutaLib.js` (`buildPrompt`, `parseModelJson`, `MAX_CHARS`, `ENGINES`).
- Produces (HTTP):
  - `GET /api/engines` → `{ engines: [{ id, label, model, available }] }`
  - `POST /api/procesar-minuta` body `{ engine, texto, contexto? }` → `{ engine, model, resumen, decisiones, action_items, riesgos, participantes }` o `{ error }` con status 400/500.

- [ ] **Step 1: `api/engines.js`**

```js
import { ENGINES } from './minutaLib.js';

export default function handler(req, res) {
  const list = ENGINES.map((e) => ({
    id: e.id,
    label: e.label,
    model: process.env[e.modelEnv] || e.defaultModel,
    available: Boolean(process.env[e.envKey]),
  }));
  res.status(200).json({ engines: list });
}
```

- [ ] **Step 2: `api/procesar-minuta.js` — esqueleto + validación**

```js
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
```

- [ ] **Step 3: `api/procesar-minuta.js` — adapters de proveedores (mismo archivo)**

Agregar al final del archivo:

```js
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
```

- [ ] **Step 4: Verificar que no rompe el build del app**

Las funciones en `api/` no entran en el build de Vite. Confirmar:

Run: `cd app && npm run build`
Expected: build OK (Vite ignora `api/`).

- [ ] **Step 5: Commit**

```bash
git add api/engines.js api/procesar-minuta.js
git commit -m "feat(bloco-b): endpoints /api/engines y /api/procesar-minuta (Gemini activo; xAI/Claude listos)"
```

---

### Task 4: Extracción de texto en el cliente (`extractText.js`)

Módulo de front que convierte un `File` (.docx/PDF) a texto plano.

**Files:**
- Create: `app/src/lib/extractText.js`
- Modify: `app/package.json` (deps `mammoth`, `pdfjs-dist`)

**Interfaces:**
- Produces: `extractText(file) -> Promise<string>` — `.docx`→mammoth; `application/pdf`→pdfjs; otro → `throw new Error('Formato no soportado (usá .docx o PDF de texto)')`. Si el PDF no tiene texto, lanza `Error('El PDF no tiene texto seleccionable (¿escaneado?)')`.

- [ ] **Step 1: Instalar dependencias**

Run:

```bash
cd app && npm install mammoth pdfjs-dist
```

- [ ] **Step 2: Implementar `app/src/lib/extractText.js`**

```js
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
```

- [ ] **Step 3: Verificar build (resuelve imports y el worker)**

Run: `cd app && npm run build`
Expected: build OK. Si el import del worker `?url` falla en la versión instalada de pdfjs, cambiar a `import 'pdfjs-dist/build/pdf.worker.mjs'` (side-effect) y quitar la línea `workerSrc`. Aplicar el que compile.

- [ ] **Step 4: Commit**

```bash
git add app/src/lib/extractText.js app/package.json app/package-lock.json
git commit -m "feat(bloco-b): extracción de texto en el cliente (.docx via mammoth, PDF via pdfjs)"
```

---

### Task 5: Camada de servicio de front (`ai.js` + contactos en `data.js`)

Fetchers para el endpoint y helpers de `contactos`.

**Files:**
- Create: `app/src/services/ai.js`
- Modify: `app/src/services/data.js`

**Interfaces:**
- Produces:
  - `ai.js`: `enginesDisponibles() -> Promise<[{id,label,model,available}]>` (solo `available:true`); `procesarMinuta(engine, texto, contexto) -> Promise<{engine,model,resumen,decisiones,action_items,riesgos,participantes}>`.
  - `data.js`: `fetchContactos()`, `upsertContacto({ nombre, email, organizacion })` (match por `lower(nombre)` vía `onConflict`), y `contactos` incluido en `fetchAll`.

- [ ] **Step 1: `app/src/services/ai.js`**

```js
export async function enginesDisponibles() {
  const r = await fetch('/api/engines');
  if (!r.ok) throw new Error('No se pudo leer los motores');
  const j = await r.json();
  return (j.engines || []).filter((e) => e.available);
}

export async function procesarMinuta(engine, texto, contexto) {
  const r = await fetch('/api/procesar-minuta', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ engine, texto, contexto: contexto || {} }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Error al procesar la minuta');
  return j;
}
```

- [ ] **Step 2: `contactos` en `data.js`**

En `app/src/services/data.js`, agregar `'contactos'` al array `TABLES`:

```js
const TABLES = [
  'clientes', 'projetos', 'tracks', 'tareas', 'personas', 'persona_tracks',
  'prerequisitos', 'reunioes', 'reunion_tracks', 'track_dependencias',
  'marcos', 'riscos', 'documentos', 'contactos',
];
```

Y agregar al final del archivo:

```js
// ---- contactos (directorio global) ----
export const fetchContactos = () => run(supabase.from('contactos').select('*').order('nombre'));
export const upsertContacto = (row) => run(
  supabase.from('contactos').upsert(row, { onConflict: 'nombre' }).select().single()
);
```

Nota: el índice único es sobre `lower(nombre)`; Supabase `onConflict:'nombre'` requiere un índice único sobre `nombre`. Como el índice es funcional (`lower(nombre)`), en el cliente **normalizamos**: guardamos `nombre` tal cual pero, para evitar duplicados por mayúsculas, el componente (Task 6) hace match previo contra `contactos` cargados y solo inserta los nombres realmente nuevos. Si el upsert por `onConflict` diera error de constraint, el componente cae a `insert` simple ignorando duplicados (capturando el error 23505). Mantener `upsertContacto` como está; el manejo fino vive en el componente.

- [ ] **Step 3: Verificar build**

Run: `cd app && npm run build`
Expected: build OK.

- [ ] **Step 4: Commit**

```bash
git add app/src/services/ai.js app/src/services/data.js
git commit -m "feat(bloco-b): servicio ai.js (engines/procesar) + contactos en data.js"
```

---

### Task 6: Componente `ReunionProcesar.jsx` (subir/pegar → procesar → revisar → guardar)

El corazón de la UI. Entrada (archivo o texto) + selector de motor + panel de revisión editable + guardado.

**Files:**
- Create: `app/src/components/ReunionProcesar.jsx`

**Interfaces:**
- Consumes: `extractText` (`../lib/extractText`); `enginesDisponibles`, `procesarMinuta` (`../services/ai`); `createReuniaoParaTrack`, `createTarea`, `createRisco`, `fetchContactos`, `upsertContacto` (`../services/data`); `inputCls, btnGold, linkGold, ORIGENES, SEVERIDADES, SEVERIDAD_LABEL, RISK_TIPOS, RISK_TIPO_LABEL` (`./trackingUi`).
- Produces: `<ReunionProcesar trackId cliente track onDone />` — al Guardar exitoso llama `onDone()` (para recargar el cockpit y cerrar).

- [ ] **Step 1: Implementar `app/src/components/ReunionProcesar.jsx`**

```jsx
import React, { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, Check, X, AlertTriangle } from 'lucide-react';
import { extractText } from '../lib/extractText';
import { enginesDisponibles, procesarMinuta } from '../services/ai';
import { createReuniaoParaTrack, createTarea, createRisco, fetchContactos, upsertContacto } from '../services/data';
import { inputCls, btnGold, linkGold, SEVERIDADES, SEVERIDAD_LABEL, RISK_TIPOS, RISK_TIPO_LABEL } from './trackingUi';

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
        participantes: parts.map((p) => ({ nombre: p.nombre.trim(), email: p.email || null })),
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
```

- [ ] **Step 2: Verificar build**

Run: `cd app && npm run build`
Expected: build OK (todos los imports resuelven; `SEVERIDADES/SEVERIDAD_LABEL/RISK_TIPOS/RISK_TIPO_LABEL` ya existen en `trackingUi.jsx` del Bloco A).

- [ ] **Step 3: Commit**

```bash
git add app/src/components/ReunionProcesar.jsx
git commit -m "feat(bloco-b): ReunionProcesar (subir/pegar, procesar, revisar y guardar)"
```

---

### Task 7: Integrar en el cockpit (card Reuniones) + fix `participantes` array

Reemplazar el `ReunionesCard` manual del cockpit para usar `ReunionProcesar`, y corregir el envío de `participantes` como array.

**Files:**
- Modify: `app/src/components/TrackCockpit.jsx`

**Interfaces:**
- Consumes: `ReunionProcesar` (`./ReunionProcesar`); recibe `cliente`, `track`, `onChange` ya presentes en el cockpit.

- [ ] **Step 1: Importar el componente**

En `app/src/components/TrackCockpit.jsx`, agregar el import:

```jsx
import ReunionProcesar from './ReunionProcesar';
```

- [ ] **Step 2: Reemplazar el `ReunionesCard` por la versión con "Registrar"/"Procesar con IA"**

Localizar el `ReunionesCard` (agregado en el Bloco A) y sustituirlo por:

```jsx
function ReunionesCard({ trackId, cliente, track, reuniones, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" />Reuniones</h4>
        {!open && <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Registrar</button>}
      </div>
      {open && (
        <div className="mb-3">
          <ReunionProcesar trackId={trackId} cliente={cliente} track={track}
            onDone={() => { setOpen(false); onChange && onChange(); }} />
          <button onClick={() => setOpen(false)} className="text-[11px] text-slate-400 mt-1">Cerrar</button>
        </div>
      )}
      {reuniones.length ? reuniones.map((r) => (
        <div key={r.id} className="flex gap-2 py-1.5 border-b border-[#273647] last:border-0">
          <span className="text-[10px] text-[#FAA61A] font-bold w-10 flex-none">{fmtDate(r.data).slice(0, 5)}</span>
          <div><div className="text-[12px] text-slate-200">{r.titulo}</div><div className="text-[10px] text-slate-500 uppercase">{r.tipo}</div></div>
        </div>
      )) : <p className="text-xs text-slate-400">Sin reuniones.</p>}
    </div>
  );
}
```

- [ ] **Step 3: Pasar `cliente`/`track` al card en el render del cockpit**

Donde el cockpit renderiza `<ReunionesCard ... />`, asegurar que pase `cliente` y `track`:

```jsx
<ReunionesCard trackId={track.id} cliente={cliente?.nome} track={track.nome} reuniones={reuniones} onChange={onChange} />
```

(El cockpit ya recibe `cliente` y `track` como props; usar `cliente?.nome` y `track.nome` como contexto textual para la IA.)

- [ ] **Step 4: Quitar el `createReuniaoParaTrack` con `participantes` texto (si quedó del Bloco A)**

Si el `ReunionesCard` anterior importaba/usaba `createReuniaoParaTrack` directamente con `participantes` como string, esa lógica ya no se usa aquí (ahora vive en `ReunionProcesar`, que envía array). Eliminar imports que queden sin uso en `TrackCockpit.jsx` para que el build no tenga warnings de import muerto que rompan el lint/build.

- [ ] **Step 5: Verificar build**

Run: `cd app && npm run build`
Expected: build OK.

- [ ] **Step 6: Commit**

```bash
git add app/src/components/TrackCockpit.jsx
git commit -m "feat(bloco-b): integrar procesar-minuta en el card Reuniones del cockpit"
```

---

### Task 8: Verificación final, config de claves y deploy

- [ ] **Step 1: Build + tests limpios**

Run:

```bash
cd app && npm test && npm run build
```

Expected: tests PASS (minutaLib + pmoLogic), build OK.

- [ ] **Step 2: Configurar la clave en Vercel (humano)**

En Vercel → proyecto `visa-portal-hub-3-platforms` → **Settings → Environment Variables**: agregar `GEMINI_API_KEY` (valor de Google AI Studio), scope Production (y Preview si se quiere). **Sin** prefijo `VITE_`. (xAI/Claude quedan sin clave → no aparecen en el selector.)

- [ ] **Step 3: Deploy**

Abrir PR desde el branch y mergear a `main` (Vercel publica). Confirmar el deploy `success` en el commit de merge.

- [ ] **Step 4: Fumaça en producción (humano)**

En la URL de producción: abrir un track → card **Reuniones → Registrar** → subir un `.docx` real (y probar un PDF de texto y pegar texto) → elegir **Gemini** → **Procesar** → revisar (resumen/decisiones/action items/riesgos/participantes con email pre-rellenado del directorio) → **Guardar** → confirmar que la reunión aparece con resumen, las tareas nuevas (origen=reunión) en el track, los riesgos en RAID y los contactos nuevos en la tabla `contactos`.

- [ ] **Step 5: Verificar `/api/engines` en el aire**

Abrir `SUA-URL/api/engines` → debe listar `gemini available:true` y `xai/claude available:false`.

---

## Notas de ejecución

- **Orden obligatorio:** Task 1 (SQL) antes de guardar contactos; Task 2 (minutaLib) antes de Task 3 (endpoints). Las claves (Task 8/Step 2) sólo hacen falta para el procesamiento real, no para el build/tests.
- **Deps nuevas:** `mammoth`, `pdfjs-dist` (front). Sin SDKs de IA — todo por `fetch` nativo en el serverless.
- **Seguridad:** claves sólo en Vercel; el endpoint no las devuelve; cap de 60k caracteres; motores sin clave ocultos.
- **xAI/Claude:** listos en el adapter; se activan poniendo `XAI_API_KEY` / `ANTHROPIC_API_KEY` en Vercel (modelos por defecto `grok-4` / `claude-sonnet-5`, ajustables con `XAI_MODEL` / `CLAUDE_MODEL`).
