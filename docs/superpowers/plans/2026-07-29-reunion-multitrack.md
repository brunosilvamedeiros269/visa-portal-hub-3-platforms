# Bloco C — Reunión multi-track: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Uma reunião registrada no nível do proyecto distribui seus action items e riscos entre as tracks certas (ou o proyecto), com a IA propondo o destino de cada item e o humano corrigindo antes de gravar.

**Architecture:** O ponto de registro sai do cockpit da track e vai para a tela do proyecto. O prompt recebe todas as tracks do proyecto como contexto e devolve um campo `track` por item; o cliente casa esse nome com os IDs reais (lógica pura, testada) e mostra um `<select>` de destino por linha no painel de revisão. Na gravação, cada tarea/risco nasce com `track_id` **ou** `projeto_id`, e a reunião liga-se às tracks confirmadas via `reunion_tracks` (já N:N).

**Tech Stack:** React 18 + Vite, Tailwind (classes inline, design Visa), Supabase JS (cliente anon, RLS aberta), Vitest, funções serverless Node no Vercel (`api/*.js`, `fetch` nativo, sem SDK).

**Spec:** [2026-07-29-reunion-multitrack-design.md](../specs/2026-07-29-reunion-multitrack-design.md)

## Global Constraints

- **Idioma da UI: espanhol.** Comentários e mensagens de commit em português. Nunca misturar na mesma superfície.
- **Design Visa:** navy `#0b1626` / `#122131` / `#1C2B3C`, bordas `#273647`, dourado `#FAA61A`. Reutilizar as classes de `app/src/components/trackingUi.jsx` (`inputCls`, `btnGold`, `linkGold`) — não inventar tokens novos.
- **Nada é gravado sem confirmação humana.** O endpoint de IA só extrai; a gravação acontece no cliente após a revisão.
- **Chaves de IA só server-side**, sem prefixo `VITE_`. Não tocar em `api/engines.js` nem nas env vars.
- **Constantes de domínio** vêm de `trackingUi.jsx`: `TAREA_ORDER = ['aberto','em_andamento','bloqueada','fechado']`, `ORIGENES` inclui `'reunion'`, `SEVERIDADES = ['alta','media','baja']`, `RISK_TIPOS = ['riesgo','issue']`, status de risco `'abierto'`.
- **IDs reais para verificação manual** (banco `iuwvwhofxuvmwnpbsnth`): proyecto BROU — Journey Digital `96d9132e-3a2c-4bd7-a3f1-bc6ceee47266`; track Tokenización Tarjeta Débito `607ccdb7-f996-40c0-9035-6354024bd2e1`; proyecto Corrientes `1ba62b6a-c118-40cb-8982-f2928c8570b0`; tracks Click to Pay `f131fe05-79aa-43bd-8dd0-812bcd13d726` e Apple Pay `17fbc35e-1640-4886-a063-5e65bd18ce98`.
- **Não regredir o Bloco B:** upsert de `contactos`, extração de `.docx`/PDF e seletor de motor continuam funcionando como estão.

---

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `db/2026-07-29-reunion-multitrack.sql` | **Criar.** Migração: `tareas` aceita `projeto_id` |
| `api/minutaLib.js` | **Modificar.** `buildPrompt` com lista de tracks; `parseModelJson` preserva `track` |
| `api/minutaLib.test.js` | **Modificar.** Casos novos de prompt e parser |
| `app/src/lib/minutaRouting.js` | **Criar.** Lógica pura de roteamento (casamento, destino, rateio) |
| `app/src/lib/minutaRouting.test.js` | **Criar.** Testes da lógica pura |
| `app/src/services/data.js` | **Modificar.** `createReunionMultiTrack`; `createTarea` aceita `projeto_id` |
| `app/src/components/TareasTable.jsx` | **Modificar.** `trackId` → `scope` |
| `app/src/components/ReunionRevision.jsx` | **Criar.** Painel de revisão com destino por item |
| `app/src/components/ReunionProcesar.jsx` | **Modificar.** Nível proyecto + orquestração da gravação |
| `app/src/components/TrackingView.jsx` | **Modificar.** Cards do proyecto + mapas `tareasByProjeto`/`reunioesByProjeto` |
| `app/src/components/TrackCockpit.jsx` | **Modificar.** `ReunionesCard` read-only |

---

### Task 1: Migração — `tareas` aceita alvo proyecto

**Files:**
- Create: `db/2026-07-29-reunion-multitrack.sql`

**Interfaces:**
- Consumes: nada.
- Produces: coluna `tareas.projeto_id uuid null`, `tareas.track_id` nullable, constraint `tareas_scope_chk` garantindo exatamente um dos dois.

- [ ] **Step 1: Escrever a migração**

Criar `db/2026-07-29-reunion-multitrack.sql`:

```sql
-- Bloco C — reunión multi-track — 2026-07-29
-- `reunioes` já tem cliente_id/projeto_id e `reunion_tracks` já é N:N: nada a fazer ali.
-- `riscos` já aceita projeto_id OU track_id. A única mudança é em `tareas`.
-- Idempotente. Rodar no SQL Editor do projeto iuwvwhofxuvmwnpbsnth.

-- 1. tareas: passa a aceitar alvo track OU proyecto (itens transversais de reunión)
alter table tareas alter column track_id drop not null;
alter table tareas add column if not exists projeto_id uuid references projetos(id) on delete cascade;
create index if not exists tareas_projeto_idx on tareas(projeto_id);

-- 2. exatamente um dos dois (mesmo padrão do check de `riscos`).
-- As linhas existentes têm track_id preenchido e projeto_id nulo, então já satisfazem.
do $$ begin
  alter table tareas add constraint tareas_scope_chk
    check ((projeto_id is null) <> (track_id is null));
exception when duplicate_object then null; end $$;
```

- [ ] **Step 2: Aplicar a migração**

Rodar o conteúdo do arquivo no SQL Editor do Supabase (projeto `iuwvwhofxuvmwnpbsnth`). É uma etapa manual: o repositório não tem credencial de service role.

- [ ] **Step 3: Verificar que a constraint funciona**

Os três comandos abaixo usam a chave anon que já está fixada em `app/src/lib/supabase.js`. Exportar primeiro:

```bash
export K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3Z3aG9meHV2bXducGJzbnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzA3OTMsImV4cCI6MjEwMDQwNjc5M30.0kvXT5Dgr68nyOJGRoSlKx25kUlu4XCK-zB9yXCX9Dk'; export U='https://iuwvwhofxuvmwnpbsnth.supabase.co/rest/v1'
```

a) Os dois alvos nulos → deve **falhar** com violação de `tareas_scope_chk`:

```bash
curl -s -X POST "$U/tareas" -H "apikey: $K" -H "Authorization: Bearer $K" -H 'Content-Type: application/json' -d '{"titulo":"chk-ambos-nulos","status":"aberto"}'
```

b) Os dois alvos preenchidos → deve **falhar** igual:

```bash
curl -s -X POST "$U/tareas" -H "apikey: $K" -H "Authorization: Bearer $K" -H 'Content-Type: application/json' -d '{"titulo":"chk-ambos","status":"aberto","track_id":"607ccdb7-f996-40c0-9035-6354024bd2e1","projeto_id":"96d9132e-3a2c-4bd7-a3f1-bc6ceee47266"}'
```

c) Só `projeto_id` → deve **passar**. Guardar o `id` retornado e apagar em seguida:

```bash
curl -s -X POST "$U/tareas" -H "apikey: $K" -H "Authorization: Bearer $K" -H 'Content-Type: application/json' -H 'Prefer: return=representation' -d '{"titulo":"chk-solo-proyecto","status":"aberto","projeto_id":"96d9132e-3a2c-4bd7-a3f1-bc6ceee47266"}'
```

```bash
curl -s -X DELETE "$U/tareas?titulo=eq.chk-solo-proyecto" -H "apikey: $K" -H "Authorization: Bearer $K"
```

Esperado: (a) e (b) retornam erro com `tareas_scope_chk`; (c) retorna a linha criada e o DELETE a remove. Se (a) ou (b) passar, a constraint não entrou — revisar o Step 2 antes de seguir.

- [ ] **Step 4: Commit**

```bash
git add db/2026-07-29-reunion-multitrack.sql
git commit -m "feat(bloco-c): migração — tareas aceita alvo proyecto"
```

---

### Task 2: Prompt e parser cientes das tracks

**Files:**
- Modify: `api/minutaLib.js:10-30` (`buildPrompt`), `api/minutaLib.js:35-52` (`parseModelJson`)
- Test: `api/minutaLib.test.js`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `buildPrompt(texto: string, contexto?: { cliente?: string, proyecto?: string, tracks?: Array<{ nombre: string, frente?: string, proximo_paso?: string }> }) => string`
  - `parseModelJson(raw: string) => { resumen: string, decisiones: any[], action_items: Array<{ titulo, responsable, prazo, track }>, riesgos: Array<{ descricao, tipo, severidade, dueno, track }>, participantes: any[] }` — `track` é sempre string (`''` quando ausente).

- [ ] **Step 1: Escrever os testes que falham**

Acrescentar ao final de `api/minutaLib.test.js`:

```js
describe('buildPrompt multi-track', () => {
  const tracks = [
    { nombre: 'Tokenización Tarjeta Débito', frente: 'Tokenização TD', proximo_paso: 'Certificación de host.' },
    { nombre: 'Click to Pay', frente: 'Click to Pay', proximo_paso: 'Enrolamiento masivo.' },
  ];

  it('lista las tracks del proyecto con su contexto', () => {
    const p = buildPrompt('acta', { cliente: 'BROU', proyecto: 'Journey Digital', tracks });
    expect(p).toContain('Tokenización Tarjeta Débito');
    expect(p).toContain('Certificación de host.');
    expect(p).toContain('Click to Pay');
    expect(p).toContain('Journey Digital');
  });

  it('pide el campo track en action_items y riesgos', () => {
    const p = buildPrompt('acta', { tracks });
    expect(p).toContain('"track"');
    expect(p).toMatch(/action_items[\s\S]*"track"/);
    expect(p).toMatch(/riesgos[\s\S]*"track"/);
  });

  it('instruye usar "proyecto" cuando el item es transversal o dudoso', () => {
    const p = buildPrompt('acta', { tracks });
    expect(p).toContain('proyecto');
    expect(p.toLowerCase()).toContain('no adivines');
  });

  it('sin tracks no rompe y no pide routing', () => {
    const p = buildPrompt('acta', { cliente: 'BROU' });
    expect(p).toContain('acta');
    expect(p).not.toContain('TRACKS DEL PROYECTO');
  });
});

describe('parseModelJson conserva track', () => {
  it('mantiene track en action_items y riesgos', () => {
    const raw = '{"resumen":"r","decisiones":[],"action_items":[{"titulo":"t","responsable":null,"prazo":null,"track":"Click to Pay"}],"riesgos":[{"descricao":"d","tipo":"issue","severidade":"alta","dueno":null,"track":"proyecto"}],"participantes":[]}';
    const r = parseModelJson(raw);
    expect(r.action_items[0].track).toBe('Click to Pay');
    expect(r.riesgos[0].track).toBe('proyecto');
  });

  it('item sin track no rompe: queda string vacía', () => {
    const raw = '{"resumen":"r","action_items":[{"titulo":"t"}],"riesgos":[{"descricao":"d"}]}';
    const r = parseModelJson(raw);
    expect(r.action_items[0].track).toBe('');
    expect(r.riesgos[0].track).toBe('');
  });

  it('track no-string se normaliza a string vacía', () => {
    const raw = '{"action_items":[{"titulo":"t","track":42}],"riesgos":[]}';
    const r = parseModelJson(raw);
    expect(r.action_items[0].track).toBe('');
  });
});
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

```bash
cd app && npx vitest run ../api/minutaLib.test.js
```

Esperado: FAIL. `buildPrompt` não menciona tracks nem `"track"`; `parseModelJson` devolve os itens sem o campo normalizado (`r.action_items[0].track` é `undefined`, não `''`).

- [ ] **Step 3: Implementar**

Substituir `buildPrompt` e `parseModelJson` em `api/minutaLib.js` por:

```js
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

  return [
    'Eres un asistente de PMO de Visa Implementation Services.',
    'Analizá la siguiente transcripción/acta de reunión y extraé la información en ESPAÑOL.',
    ctx && `Contexto: ${ctx}.`,
    listaTracks,
    'Devolvé EXCLUSIVAMENTE un objeto JSON válido (sin texto adicional, sin markdown), con esta forma exacta:',
    '{',
    '  "resumen": "string, 2-4 frases",',
    '  "decisiones": ["string"],',
    '  "action_items": [{ "titulo": "string", "responsable": "string|null", "prazo": "YYYY-MM-DD|null", "track": "string" }],',
    '  "riesgos": [{ "descricao": "string", "tipo": "riesgo|issue", "severidade": "alta|media|baja", "dueno": "string|null", "track": "string" }],',
    '  "participantes": [{ "nombre": "string", "email": "string|null", "organizacion": "string|null" }]',
    '}',
    reglaTrack,
    'Si un bloque no aplica, devolvé una lista vacía. No inventes emails ni fechas: usá null cuando no aparezcan.',
    '',
    'TRANSCRIPCIÓN:',
    texto,
  ].filter(Boolean).join('\n');
}
```

E, no mesmo arquivo, trocar as duas linhas de `action_items` e `riesgos` dentro do `return` de `parseModelJson` para normalizar `track`:

```js
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
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

```bash
cd app && npx vitest run ../api/minutaLib.test.js
```

Esperado: PASS, incluindo o teste antigo `incluye el texto y pide JSON estricto con los 5 bloques` (que passa `{ track, cliente }` — o `contexto.track` continua suportado).

- [ ] **Step 5: Commit**

```bash
git add api/minutaLib.js api/minutaLib.test.js
git commit -m "feat(bloco-c): prompt lista as tracks do proyecto e pede destino por item"
```

---

### Task 3: Lógica pura de roteamento

**Files:**
- Create: `app/src/lib/minutaRouting.js`
- Test: `app/src/lib/minutaRouting.test.js`

**Interfaces:**
- Consumes: nada (módulo puro, sem rede e sem React).
- Produces:
  - `PROYECTO = 'proyecto'` — sentinela de destino transversal.
  - `normalizeName(s: string) => string`
  - `matchTrack(nombre: string, tracks: Array<{ id, nombre }>) => track | null`
  - `destinoInicial(item: { track?: string }, tracks) => string` — id de track ou `'proyecto'`.
  - `destinoFields(destino: string, projetoId: string) => { track_id: string|null, projeto_id: string|null }`
  - `resumenRateo(items: Array<{ destino, incluir? }>, tracks) => Array<{ label: string, n: number }>`
  - `tracksConItems(...listas: Array<Array<{ destino, incluir? }>>) => string[]` — ids de track, sem repetição.

- [ ] **Step 1: Escrever os testes que falham**

Criar `app/src/lib/minutaRouting.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { PROYECTO, normalizeName, matchTrack, destinoInicial, destinoFields, resumenRateo, tracksConItems } from './minutaRouting';

const TRACKS = [
  { id: 't-tok', nombre: 'Tokenización Tarjeta Débito' },
  { id: 't-ctp', nombre: 'Click to Pay' },
  { id: 't-ap', nombre: 'Apple Pay' },
];
const PROJ = 'p-1';

describe('normalizeName', () => {
  it('baja caja, saca acentos y colapsa espacios', () => {
    expect(normalizeName('  Tokenización   Tarjeta  Débito ')).toBe('tokenizacion tarjeta debito');
  });
  it('tolera no-strings', () => {
    expect(normalizeName(null)).toBe('');
    expect(normalizeName(undefined)).toBe('');
  });
});

describe('matchTrack', () => {
  it('casa exacto', () => expect(matchTrack('Click to Pay', TRACKS).id).toBe('t-ctp'));
  it('casa con variación de caja, acento y espacios', () => {
    expect(matchTrack('tokenizacion   TARJETA debito', TRACKS).id).toBe('t-tok');
  });
  it('no casa un nombre desconocido', () => expect(matchTrack('Garmin Pay', TRACKS)).toBe(null));
  it('no casa vacío ni null', () => {
    expect(matchTrack('', TRACKS)).toBe(null);
    expect(matchTrack(null, TRACKS)).toBe(null);
  });
});

describe('destinoInicial', () => {
  it('track reconocida → id de la track', () => {
    expect(destinoInicial({ track: 'Apple Pay' }, TRACKS)).toBe('t-ap');
  });
  it('"proyecto" → proyecto', () => {
    expect(destinoInicial({ track: 'proyecto' }, TRACKS)).toBe(PROYECTO);
    expect(destinoInicial({ track: 'Proyecto' }, TRACKS)).toBe(PROYECTO);
  });
  it('nombre desconocido → proyecto, nunca una track por aproximación', () => {
    expect(destinoInicial({ track: 'Garmin Pay' }, TRACKS)).toBe(PROYECTO);
    expect(destinoInicial({ track: 'Click' }, TRACKS)).toBe(PROYECTO);
  });
  it('sin track → proyecto', () => {
    expect(destinoInicial({}, TRACKS)).toBe(PROYECTO);
    expect(destinoInicial({ track: '' }, TRACKS)).toBe(PROYECTO);
  });
});

describe('destinoFields', () => {
  it('track → track_id, projeto_id null', () => {
    expect(destinoFields('t-ctp', PROJ)).toEqual({ track_id: 't-ctp', projeto_id: null });
  });
  it('proyecto → projeto_id, track_id null', () => {
    expect(destinoFields(PROYECTO, PROJ)).toEqual({ track_id: null, projeto_id: PROJ });
  });
});

describe('resumenRateo', () => {
  it('cuenta por destino y omite destinos sin items', () => {
    const items = [
      { destino: 't-ctp', incluir: true },
      { destino: 't-ctp', incluir: true },
      { destino: PROYECTO, incluir: true },
    ];
    expect(resumenRateo(items, TRACKS)).toEqual([
      { label: 'Click to Pay', n: 2 },
      { label: 'Proyecto', n: 1 },
    ]);
  });
  it('ignora items desmarcados', () => {
    const items = [{ destino: 't-ap', incluir: false }, { destino: 't-ap', incluir: true }];
    expect(resumenRateo(items, TRACKS)).toEqual([{ label: 'Apple Pay', n: 1 }]);
  });
  it('lista vacía → []', () => expect(resumenRateo([], TRACKS)).toEqual([]));
});

describe('tracksConItems', () => {
  it('junta varias listas sin repetir y sin el sentinela proyecto', () => {
    const a = [{ destino: 't-ctp', incluir: true }, { destino: PROYECTO, incluir: true }];
    const b = [{ destino: 't-ctp', incluir: true }, { destino: 't-ap', incluir: true }];
    expect(tracksConItems(a, b)).toEqual(['t-ctp', 't-ap']);
  });
  it('ignora desmarcados', () => {
    expect(tracksConItems([{ destino: 't-ap', incluir: false }])).toEqual([]);
  });
  it('sin listas → []', () => expect(tracksConItems()).toEqual([]));
});
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

```bash
cd app && npx vitest run src/lib/minutaRouting.test.js
```

Esperado: FAIL — `Failed to resolve import "./minutaRouting"`.

- [ ] **Step 3: Implementar**

Criar `app/src/lib/minutaRouting.js`:

```js
// Roteamento dos itens de uma minuta entre as tracks do proyecto. Lógica pura:
// sem rede, sem React, sem Supabase. O modelo devolve NOMES de track; aqui eles
// viram IDs. Regra de ouro: nome que não casa cai no proyecto, nunca numa track
// por aproximação — errar para o lado neutro é mais barato que enterrar uma
// tarefa na track errada.

export const PROYECTO = 'proyecto';

export function normalizeName(s) {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // saca acentos
    .toLowerCase().trim().replace(/\s+/g, ' ');
}

export function matchTrack(nombre, tracks) {
  const n = normalizeName(nombre);
  if (!n) return null;
  return (tracks || []).find((t) => normalizeName(t.nombre) === n) || null;
}

export function destinoInicial(item, tracks) {
  const raw = (item && item.track) || '';
  if (normalizeName(raw) === PROYECTO) return PROYECTO;
  const hit = matchTrack(raw, tracks);
  return hit ? hit.id : PROYECTO;
}

export function destinoFields(destino, projetoId) {
  return destino === PROYECTO
    ? { track_id: null, projeto_id: projetoId }
    : { track_id: destino, projeto_id: null };
}

const marcados = (items) => (items || []).filter((it) => it && it.incluir !== false);

export function resumenRateo(items, tracks) {
  const cuenta = new Map();
  for (const it of marcados(items)) {
    cuenta.set(it.destino, (cuenta.get(it.destino) || 0) + 1);
  }
  // Ordem estável: as tracks na ordem do proyecto, e o proyecto no final.
  const out = [];
  for (const t of tracks || []) {
    if (cuenta.has(t.id)) out.push({ label: t.nombre, n: cuenta.get(t.id) });
  }
  if (cuenta.has(PROYECTO)) out.push({ label: 'Proyecto', n: cuenta.get(PROYECTO) });
  return out;
}

export function tracksConItems(...listas) {
  const ids = [];
  for (const lista of listas) {
    for (const it of marcados(lista)) {
      if (it.destino && it.destino !== PROYECTO && !ids.includes(it.destino)) ids.push(it.destino);
    }
  }
  return ids;
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

```bash
cd app && npx vitest run src/lib/minutaRouting.test.js
```

Esperado: PASS, 16 testes.

- [ ] **Step 5: Commit**

```bash
git add app/src/lib/minutaRouting.js app/src/lib/minutaRouting.test.js
git commit -m "feat(bloco-c): lógica pura de roteamento de itens entre tracks"
```

---

### Task 4: Camada de dados e `TareasTable` com escopo

**Files:**
- Modify: `app/src/services/data.js:31` (`createTarea`), `app/src/services/data.js:77-82` (reuniones)
- Modify: `app/src/components/TareasTable.jsx:13-35` (`NewTarea`), `:39` e `:73` (`TareasTable`)

**Interfaces:**
- Consumes: nada.
- Produces:
  - `createReunionMultiTrack(row: object, trackIds: string[]) => Promise<reunion>` — insere a reunión e um `reunion_tracks` por id; devolve a reunión criada.
  - `createTarea(row)` inalterado na assinatura, mas o `row` agora pode trazer `projeto_id` em vez de `track_id`.
  - `<TareasTable scope={{ track_id }} | { projeto_id }} tareas onChange />` — a prop `trackId` deixa de existir.

- [ ] **Step 1: Adicionar `createReunionMultiTrack` em `data.js`**

Em `app/src/services/data.js`, **acrescentar** depois do bloco `// ---- reuniones (registro manual, ligada ao track) ----` (que termina na linha 82):

```js
// Uma reunión pode cobrir várias tracks: `reunion_tracks` é N:N. Sem transação
// (REST anon); se a ligação falhar, a reunión já existe e o erro sobe para a UI.
export async function createReunionMultiTrack(row, trackIds = []) {
  const reu = await run(supabase.from('reunioes').insert(row).select().single());
  const ids = [...new Set(trackIds.filter(Boolean))];
  if (ids.length) {
    await run(supabase.from('reunion_tracks').insert(ids.map((track_id) => ({ reuniao_id: reu.id, track_id }))));
  }
  return reu;
}
```

**Não remover `createReuniaoParaTrack` agora:** o `ReunionProcesar` atual ainda a importa, e apagá-la aqui quebraria o build (`"createReuniaoParaTrack" is not exported`). Ela sai na Task 6, junto com o componente que a usa.

`createTarea` não muda: já repassa o `row` inteiro, então aceita `projeto_id` sem alteração.

- [ ] **Step 2: Trocar `trackId` por `scope` em `TareasTable.jsx`**

Em `NewTarea`, trocar a assinatura e o insert (linhas 13 e 20):

```js
function NewTarea({ scope, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ titulo: '', responsavel: '', previsao_entrega: '', origen: 'manual' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); if (!f.titulo.trim()) return; setSaving(true);
    try { await createTarea({ ...scope, titulo: f.titulo.trim(), status: 'aberto', responsavel: f.responsavel || null, previsao_entrega: f.previsao_entrega || null, origen: f.origen }); setF({ titulo: '', responsavel: '', previsao_entrega: '', origen: 'manual' }); setOpen(false); onChange(); }
    finally { setSaving(false); }
  };
```

Na assinatura do componente exportado (linha 39) e na chamada de `NewTarea` (linha 73):

```js
export default function TareasTable({ scope, tareas, onChange }) {
```

```jsx
      <div className="flex justify-end mb-2"><NewTarea scope={scope} onChange={onChange} /></div>
```

- [ ] **Step 3: Atualizar o único chamador atual**

Em `app/src/components/TrackCockpit.jsx:165`, trocar:

```jsx
              ? <TareasTable scope={{ track_id: track.id }} tareas={tareas} onChange={onChange} />
```

- [ ] **Step 4: Verificar que o build passa e nenhum `trackId` sobrou**

```bash
cd app && npm run build
```

Esperado: build sem erros.

```bash
cd app && grep -rn "TareasTable\|trackId=" src/components/ | grep -v "ReunionProcesar"
```

Esperado: só a definição em `TareasTable.jsx` e a chamada com `scope` em `TrackCockpit.jsx`. Nenhum `trackId=` remanescente apontando para `TareasTable`.

- [ ] **Step 5: Commit**

```bash
git add app/src/services/data.js app/src/components/TareasTable.jsx app/src/components/TrackCockpit.jsx
git commit -m "feat(bloco-c): reunión multi-track em data.js e TareasTable com escopo track|proyecto"
```

---

### Task 5: Painel de revisão com destino por item

**Files:**
- Create: `app/src/components/ReunionRevision.jsx`

**Interfaces:**
- Consumes: `PROYECTO`, `resumenRateo`, `tracksConItems` de `../lib/minutaRouting`; `inputCls`, `btnGold`, `SEVERIDADES`, `SEVERIDAD_LABEL`, `RISK_TIPOS`, `RISK_TIPO_LABEL` de `./trackingUi`.
- Produces: componente default
  ```
  <ReunionRevision
    result={{ resumen, decisiones[], action_items[], riesgos[], participantes[] }}
    tracks={[{ id, nombre }]}
    trackIds={string[]}          // tracks marcadas para a reunión
    saving={boolean}
    err={string|null}
    onChangeResult={(patch) => void}
    onChangeItem={(key, index, patch) => void}
    onChangeTrackIds={(ids) => void}
    onGuardar={() => void}
    onVolver={() => void}
  />
  ```
  Componente **controlado**: não guarda estado próprio. Cada item de `action_items` e `riesgos` traz `destino` (id de track ou `PROYECTO`) e `incluir`.

- [ ] **Step 1: Criar o componente**

Criar `app/src/components/ReunionRevision.jsx`:

```jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { PROYECTO, resumenRateo, tracksConItems } from '../lib/minutaRouting';
import { inputCls, btnGold, SEVERIDADES, SEVERIDAD_LABEL, RISK_TIPOS, RISK_TIPO_LABEL } from './trackingUi';

// Painel de revisão da minuta. Controlado pelo ReunionProcesar: aqui não há estado.
export default function ReunionRevision({
  result, tracks, trackIds, saving, err,
  onChangeResult, onChangeItem, onChangeTrackIds, onGuardar, onVolver,
}) {
  const rateo = resumenRateo([...result.action_items, ...result.riesgos], tracks);
  const sugeridas = tracksConItems(result.action_items, result.riesgos);

  const toggleTrack = (id) => {
    onChangeTrackIds(trackIds.includes(id) ? trackIds.filter((x) => x !== id) : [...trackIds, id]);
  };

  return (
    <div className="space-y-4 bg-[#0b1626] border border-[#273647] rounded-xl p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">Revisá y ajustá antes de guardar</div>
      {err && <p className="text-[11px] text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{err}</p>}

      {rateo.length > 0 && (
        <div className="text-[11px] text-slate-300 bg-[#122131] border border-[#273647] rounded-lg px-2.5 py-1.5">
          <span className="text-slate-500 uppercase tracking-wide text-[10px] mr-2">Reparto</span>
          {rateo.map((r, i) => (
            <span key={r.label}>{i > 0 && <span className="text-slate-600"> · </span>}<span className="text-[#FAA61A] font-bold">{r.n}</span> → {r.label}</span>
          ))}
        </div>
      )}

      <label className="block text-[11px] text-slate-400">Resumen
        <textarea className={inputCls} rows={2} value={result.resumen} onChange={(e) => onChangeResult({ resumen: e.target.value })} />
      </label>

      <Section title="Decisiones">
        {result.decisiones.map((d, i) => (
          <Row key={i} incluir={d.incluir} onToggle={() => onChangeItem('decisiones', i, { incluir: !d.incluir })}>
            <input className={inputCls} value={d.texto} onChange={(e) => onChangeItem('decisiones', i, { texto: e.target.value })} />
          </Row>
        ))}
      </Section>

      <Section title="Action items → tareas">
        {result.action_items.map((a, i) => (
          <Row key={i} incluir={a.incluir} onToggle={() => onChangeItem('action_items', i, { incluir: !a.incluir })}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 w-full">
              <input className={inputCls} placeholder="Tarea" value={a.titulo} onChange={(e) => onChangeItem('action_items', i, { titulo: e.target.value })} />
              <input className={inputCls} placeholder="Responsable" value={a.responsable} onChange={(e) => onChangeItem('action_items', i, { responsable: e.target.value })} />
              <input type="date" className={inputCls} value={a.prazo} onChange={(e) => onChangeItem('action_items', i, { prazo: e.target.value })} />
              <DestinoSelect tracks={tracks} value={a.destino} onChange={(v) => onChangeItem('action_items', i, { destino: v })} />
            </div>
          </Row>
        ))}
      </Section>

      <Section title="Riesgos → RAID">
        {result.riesgos.map((x, i) => (
          <Row key={i} incluir={x.incluir} onToggle={() => onChangeItem('riesgos', i, { incluir: !x.incluir })}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-1.5 w-full">
              <input className={`${inputCls} md:col-span-2`} placeholder="Descripción" value={x.descricao} onChange={(e) => onChangeItem('riesgos', i, { descricao: e.target.value })} />
              <select className={inputCls} value={x.tipo} onChange={(e) => onChangeItem('riesgos', i, { tipo: e.target.value })}>{RISK_TIPOS.map((t) => <option key={t} value={t}>{RISK_TIPO_LABEL[t]}</option>)}</select>
              <select className={inputCls} value={x.severidade} onChange={(e) => onChangeItem('riesgos', i, { severidade: e.target.value })}>{SEVERIDADES.map((s) => <option key={s} value={s}>{SEVERIDAD_LABEL[s]}</option>)}</select>
              <DestinoSelect tracks={tracks} value={x.destino} onChange={(v) => onChangeItem('riesgos', i, { destino: v })} />
            </div>
          </Row>
        ))}
      </Section>

      <Section title="Participantes → directorio">
        {result.participantes.map((p, i) => (
          <Row key={i} incluir={p.incluir} onToggle={() => onChangeItem('participantes', i, { incluir: !p.incluir })}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 w-full items-center">
              <input className={inputCls} placeholder="Nombre" value={p.nombre} onChange={(e) => onChangeItem('participantes', i, { nombre: e.target.value })} />
              <input className={inputCls} placeholder="Email" value={p.email} onChange={(e) => onChangeItem('participantes', i, { email: e.target.value })} />
              <span className="text-[10px] text-slate-500">{p.existe ? 'ya en directorio' : 'nuevo'}</span>
            </div>
          </Row>
        ))}
      </Section>

      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Tracks de esta reunión</div>
        <div className="flex flex-wrap gap-1.5">
          {tracks.map((t) => {
            const on = trackIds.includes(t.id);
            return (
              <button key={t.id} onClick={() => toggleTrack(t.id)}
                className={`text-[11px] px-2.5 py-1 rounded-full border ${on ? 'text-[#FAA61A] bg-[#FAA61A]/12 border-[#FAA61A]/40' : 'text-slate-400 border-[#273647] hover:border-slate-500'}`}>
                {on ? '✓ ' : ''}{t.nombre}{sugeridas.includes(t.id) && !on ? ' ·' : ''}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Pre-marcadas las tracks que recibieron algún item. Marcá también las que se discutieron sin generar acciones.</p>
      </div>

      <div className="flex gap-2">
        <button disabled={saving} onClick={onGuardar} className={btnGold}>{saving ? 'Guardando…' : 'Guardar reunión'}</button>
        <button onClick={onVolver} className="text-xs text-slate-400 px-2">Volver</button>
      </div>
    </div>
  );
}

function DestinoSelect({ tracks, value, onChange }) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} title="Destino del item">
      <option value={PROYECTO}>▲ Proyecto</option>
      {tracks.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
    </select>
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

- [ ] **Step 2: Verificar que compila**

```bash
cd app && npm run build
```

Esperado: build sem erros. O componente ainda não é usado por ninguém — isso é esperado nesta task.

- [ ] **Step 3: Commit**

```bash
git add app/src/components/ReunionRevision.jsx
git commit -m "feat(bloco-c): painel de revisão com destino por item e rateio"
```

---

### Task 6: `ReunionProcesar` no nível do proyecto e cockpit sem registro

**Files:**
- Modify: `app/src/components/ReunionProcesar.jsx` (arquivo inteiro)
- Modify: `app/src/services/data.js` (remover `createReuniaoParaTrack`)
- Modify: `app/src/components/TrackCockpit.jsx:55-78` (`ReunionesCard`), `:195` (chamada)

**Interfaces:**
- Consumes: `createReunionMultiTrack`, `createTarea`, `createRisco`, `fetchContactos`, `insertContacto`, `updateContacto` de `../services/data`; `PROYECTO`, `destinoInicial`, `destinoFields`, `tracksConItems` de `../lib/minutaRouting`; `ReunionRevision` de `./ReunionRevision`; `extractText`, `enginesDisponibles`, `procesarMinuta` (inalterados).
- Produces: `<ReunionProcesar proyecto={{ id, nome, cliente_id }} cliente={string} tracks={[{ id, nombre, frente, proximo_paso }]} onDone={() => void} />`.

- [ ] **Step 1: Reescrever o componente**

Substituir todo o conteúdo de `app/src/components/ReunionProcesar.jsx` por:

```jsx
import React, { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import { extractText } from '../lib/extractText';
import { enginesDisponibles, procesarMinuta } from '../services/ai';
import { createReunionMultiTrack, createTarea, createRisco, fetchContactos, insertContacto, updateContacto } from '../services/data';
import { PROYECTO, destinoInicial, destinoFields, tracksConItems } from '../lib/minutaRouting';
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
        tracks: tracks.map((t) => ({ nombre: t.nombre, frente: t.frente, proximo_paso: t.proximo_paso })),
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
  const setItem = (key, i, patch) => setResult((r) => ({ ...r, [key]: r[key].map((it, j) => (j === i ? { ...it, ...patch } : it)) }));

  // ---------- render ----------
  if (phase === 'loading') {
    return <div className="flex items-center gap-2 text-sm text-slate-300 py-6"><Loader2 className="w-4 h-4 animate-spin" /> Procesando con {engines.find((e) => e.id === engine)?.label}…</div>;
  }

  if (phase === 'review' && result) {
    return (
      <ReunionRevision
        result={result} tracks={tracks} trackIds={trackIds} saving={saving} err={err}
        onChangeResult={setR} onChangeItem={setItem} onChangeTrackIds={setTrackIds}
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
```

- [ ] **Step 2: Remover `createReuniaoParaTrack` de `data.js`**

Agora que o único chamador desapareceu, apagar de `app/src/services/data.js` o bloco:

```js
// ---- reuniones (registro manual, ligada ao track) ----
export async function createReuniaoParaTrack(trackId, row) {
  const reu = await run(supabase.from('reunioes').insert(row).select().single());
  await run(supabase.from('reunion_tracks').insert({ reuniao_id: reu.id, track_id: trackId }));
  return reu;
}
```

Manter o comentário `// ---- reuniones ----` acima de `createReunionMultiTrack`.

- [ ] **Step 3: Tornar o `ReunionesCard` do cockpit read-only**

O cockpit ainda passa `trackId`/`track` para o `ReunionProcesar`, que agora espera `proyecto`/`tracks` — sem esta etapa o card quebra em tempo de execução. Em `app/src/components/TrackCockpit.jsx`, substituir a função `ReunionesCard` inteira (linhas 55-78) por:

```jsx
// Read-only: o registro de reuniones acontece no nível del proyecto (una reunión
// puede cubrir varias tracks). Aquí solo se listan las que tocan esta track.
function ReunionesCard({ reuniones }) {
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
      <h4 className="text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-1.5 mb-2"><CalendarClock className="w-3.5 h-3.5" />Reuniones</h4>
      {reuniones.length ? reuniones.map((r) => (
        <div key={r.id} className="flex gap-2 py-1.5 border-b border-[#273647] last:border-0">
          <span className="text-[10px] text-[#FAA61A] font-bold w-10 flex-none">{r.data ? fmtDate(r.data).slice(0, 5) : '—'}</span>
          <div><div className="text-[12px] text-slate-200">{r.titulo}</div><div className="text-[10px] text-slate-500 uppercase">{r.tipo}</div></div>
        </div>
      )) : <p className="text-xs text-slate-400">Sin reuniones. Se registran en el proyecto.</p>}
    </div>
  );
}
```

Trocar a chamada (linha 195) por:

```jsx
          <ReunionesCard reuniones={reunioes} />
```

Remover de `TrackCockpit.jsx` os imports que ficaram sem uso: `Plus` e `linkGold` (da lista de `lucide-react` e de `./trackingUi`), e a linha `import ReunionProcesar from './ReunionProcesar';`. Manter `CalendarClock` e `fmtDate` (seguem em uso no card) e `useState` (segue em uso pelo `view`).

- [ ] **Step 4: Verificar que compila e que a função antiga sumiu**

```bash
cd app && npm run build
```

Esperado: PASS.

```bash
cd app && grep -rn "createReuniaoParaTrack" src/ ; grep -rn "ReunionProcesar" src/components/
```

Esperado: `createReuniaoParaTrack` sem nenhum resultado. `ReunionProcesar` só na sua própria definição (o `TrackingView` passa a usá-lo na Task 7).

- [ ] **Step 5: Commit**

```bash
git add app/src/components/ReunionProcesar.jsx app/src/services/data.js app/src/components/TrackCockpit.jsx
git commit -m "feat(bloco-c): ReunionProcesar no nível do proyecto; cockpit read-only"
```

---

### Task 7: Tela do proyecto — cards de reuniones e tareas

**Files:**
- Modify: `app/src/components/TrackingView.jsx:218-249` (bloco `useMemo`), `:204` (novos componentes), `:288-339` (detalhe do proyecto)

**Interfaces:**
- Consumes: `<ReunionProcesar proyecto cliente tracks onDone />` (Task 6); `<TareasTable scope tareas onChange />` (Task 4).
- Produces: mapas `tareasByProjeto` e `reunioesByProjeto` no objeto `m` do `TrackingView`.

- [ ] **Step 1: Ajustar os mapas no `useMemo`**

Em `app/src/components/TrackingView.jsx`, dentro do `useMemo`, trocar a linha de `reunioesByTrack` e a de `tareasByTrack`, e adicionar os dois mapas por proyecto. O bloco de mapas fica assim:

```js
    const tracksById = idMap(data.tracks);
    const reunioesById = idMap(data.reunioes);
    const reunioesByTrack = {};
    for (const rt of data.reunion_tracks) { (reunioesByTrack[rt.track_id] = reunioesByTrack[rt.track_id] || []).push(reunioesById[rt.reuniao_id]); }
    // Reuniones del proyecto: `reunioes.projeto_id` es la fuente; las tracks salen de reunion_tracks.
    const reunioesByProjeto = by(data.reunioes.filter((r) => r.projeto_id), 'projeto_id');
    const depsByTrack = {};
    for (const d of data.track_dependencias) { (depsByTrack[d.track_id] = depsByTrack[d.track_id] || []).push(tracksById[d.depende_de_id]); }
    const marcosByTrack = by(data.marcos, 'track_id');
    const riscosByTrack = by(data.riscos.filter((r) => r.track_id), 'track_id');
    const riscosByProjeto = by(data.riscos.filter((r) => r.projeto_id), 'projeto_id');
    const documentosByTrack = by(data.documentos, 'track_id');
```

E no objeto retornado, trocar a linha de `tareasByTrack` e acrescentar as duas novas (mesmo padrão de `riscos`, filtrando por escopo para que as tareas de proyecto não caiam num bucket `"null"`):

```js
      tareasByTrack: by(data.tareas.filter((t) => t.track_id), 'track_id'),
      tareasByProjeto: by(data.tareas.filter((t) => t.projeto_id), 'projeto_id'),
      reunioesByProjeto,
```

- [ ] **Step 2: Adicionar os dois imports que faltam no `TrackingView.jsx`**

No topo do arquivo, ao lado de `import TrackCockpit from './TrackCockpit';` (linha 12), acrescentar:

```js
import ReunionProcesar from './ReunionProcesar';
import TareasTable from './TareasTable';
```

Os ícones `CalendarClock` e `Plus` e os helpers `linkGold` e `fmtDate` **já estão importados** neste arquivo (linhas 2-9) — não duplicar.

- [ ] **Step 3: Criar os dois cards do proyecto**

Em `app/src/components/TrackingView.jsx`, acima de `// ---------- container ----------` (linha 204), adicionar:

```jsx
function ReunionesProyectoCard({ proyecto, cliente, tracks, reuniones, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#122131]/60 border border-[#273647] rounded-2xl p-4 mb-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" />Reuniones del proyecto</h3>
        {!open && <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Registrar</button>}
      </div>
      {open && (
        <div className="mb-3">
          <ReunionProcesar proyecto={proyecto} cliente={cliente} tracks={tracks}
            onDone={() => { setOpen(false); onChange(); }} />
          <button onClick={() => setOpen(false)} className="text-[11px] text-slate-400 mt-1">Cerrar</button>
        </div>
      )}
      {reuniones.length ? [...reuniones].sort((a, b) => String(b.data || '').localeCompare(String(a.data || ''))).map((r) => (
        <div key={r.id} className="flex gap-2 py-1.5 border-t border-[#273647]/60 first:border-0">
          <span className="text-[10px] text-[#FAA61A] font-bold w-12 flex-none pt-0.5">{r.data ? fmtDate(r.data).slice(0, 5) : '—'}</span>
          <div className="min-w-0">
            <div className="text-[12.5px] text-slate-200">{r.titulo}</div>
            <div className="text-[10px] text-slate-500 uppercase">{r.tipo}</div>
          </div>
        </div>
      )) : <p className="text-xs text-slate-400">Sin reuniones registradas.</p>}
    </div>
  );
}

function TareasProyectoCard({ proyecto, tareas, onChange }) {
  return (
    <div className="bg-[#122131]/60 border border-[#273647] rounded-2xl p-4 mb-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Tareas del proyecto (transversales)</h3>
      <TareasTable scope={{ projeto_id: proyecto.id }} tareas={tareas} onChange={onChange} />
    </div>
  );
}
```

- [ ] **Step 4: Montar os cards no detalhe do proyecto**

Em `app/src/components/TrackingView.jsx`, no bloco `// --- Detalhe do projeto ---`, inserir os dois cards **logo antes** do `<div className="flex items-center justify-between mb-2 flex-wrap gap-2">` que abre a seção "Tracks" (linha 330):

```jsx
        <ReunionesProyectoCard
          proyecto={proj} cliente={cli?.nome} tracks={tracks}
          reuniones={m.reunioesByProjeto[proj.id] || []} onChange={load}
        />
        <TareasProyectoCard proyecto={proj} tareas={m.tareasByProjeto[proj.id] || []} onChange={load} />
```

- [ ] **Step 5: Verificar que o build passa**

```bash
cd app && npm run build
```

Esperado: PASS.

- [ ] **Step 6: Rodar a suíte inteira**

```bash
cd app && npx vitest run
```

Esperado: PASS em `pmoLogic.test.js`, `minutaRouting.test.js` e `minutaLib.test.js`.

- [ ] **Step 7: Commit**

```bash
git add app/src/components/TrackingView.jsx
git commit -m "feat(bloco-c): cards de reuniones e tareas del proyecto"
```

---

### Task 8: Verificação de fumaça com as transcrições reais

**Files:** nenhum (verificação manual no app rodando).

**Interfaces:**
- Consumes: tudo das tasks 1-7.
- Produces: confirmação de que o fluxo end-to-end funciona nos dois casos (multi-track e track única).

- [ ] **Step 1: Subir o app**

Usar a ferramenta de preview (`preview_start`), não `npm run dev` via shell. Se `.claude/launch.json` não existir, criar com:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "visa-app", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev", "--prefix", "app"], "port": 5173 }
  ]
}
```

Requer `GEMINI_API_KEY` disponível para a função `api/procesar-minuta`. Rodando só o Vite, `/api/*` não existe — usar `vercel dev` na raiz, ou fazer a verificação no deploy de preview do Vercel. Se nenhuma das duas estiver acessível, **parar e avisar o usuário**: os passos 2-4 não podem ser simulados.

- [ ] **Step 2: Caso multi-track (Corrientes)**

Abrir Portafolio → **Banco de Corrientes — Wallets & Click to Pay** → card **Reuniones del proyecto** → Registrar. Tipo `Semanal`, data `2026-07-29`, colar a transcrição de `C:\Users\bruno\Downloads\VISA-CORRIENTES-Weekly-29_07 _transcript.txt` e Procesar.

Verificar no painel de revisão:
- A linha **Reparto** aparece com contagens.
- Os `<select>` de destino oferecem `▲ Proyecto`, `Click to Pay` e `Apple Pay`.
- As tracks pré-marcadas em "Tracks de esta reunión" são as que receberam item.

Trocar **à mão** o destino de ao menos um action item para outra track, marcar uma track extra, e Guardar.

- [ ] **Step 3: Conferir a gravação do caso multi-track**

```bash
export K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3Z3aG9meHV2bXducGJzbnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzA3OTMsImV4cCI6MjEwMDQwNjc5M30.0kvXT5Dgr68nyOJGRoSlKx25kUlu4XCK-zB9yXCX9Dk'; export U='https://iuwvwhofxuvmwnpbsnth.supabase.co/rest/v1'
curl -s "$U/reunioes?projeto_id=eq.1ba62b6a-c118-40cb-8982-f2928c8570b0&select=id,titulo,data,reunion_tracks(track_id)" -H "apikey: $K" -H "Authorization: Bearer $K"
```

Esperado: a reunión nova com **mais de um** `reunion_tracks`.

```bash
curl -s "$U/tareas?origen=eq.reunion&or=(track_id.eq.f131fe05-79aa-43bd-8dd0-812bcd13d726,track_id.eq.17fbc35e-1640-4886-a063-5e65bd18ce98,projeto_id.eq.1ba62b6a-c118-40cb-8982-f2928c8570b0)&select=titulo,track_id,projeto_id" -H "apikey: $K" -H "Authorization: Bearer $K"
```

Esperado: tareas distribuídas — algumas com `track_id` de Click to Pay, outras de Apple Pay, e as transversais com `projeto_id` e `track_id: null`. Cada linha tem **exatamente um** dos dois preenchido.

- [ ] **Step 4: Caso de regressão, track única (BROU)**

Repetir no proyecto **BROU — Journey Digital** com a transcrição da weekly BROU do dia 29/07 — está gravada no campo `ata` da reunión `aea5ea5e-34b8-4380-bb9f-9bfbafd62099`:

```bash
curl -s "$U/reunioes?id=eq.aea5ea5e-34b8-4380-bb9f-9bfbafd62099&select=ata" -H "apikey: $K" -H "Authorization: Bearer $K"
```

Esperado no painel de revisão: o **Reparto** concentra em `Tokenización Tarjeta Débito`, e os itens transversais (DEF de configuraciones productivas, certificados de producción) caem em `Proyecto`. Nenhum item deve ir para `Garmin Pay`, `Mandato ANI` ou outra track não discutida — se for, o prompt está adivinhando e a Task 2 precisa de ajuste na instrução.

**Não guardar** este segundo caso: a reunión de 29/07 do BROU já está ingerida e gravá-la de novo duplicaria tareas e riscos. É verificação só do painel; sair com **Volver**.

- [ ] **Step 5: Conferir os cards na tela**

Na tela do proyecto Corrientes: as tareas transversais aparecem em **Tareas del proyecto**, e a reunión em **Reuniones del proyecto**. Abrindo o cockpit de **Click to Pay** e de **Apple Pay**: a mesma reunión aparece no card Reuniones dos dois (read-only, sem botão Registrar), e cada um vê só as suas tareas.

- [ ] **Step 6: Screenshot e commit final**

Tirar screenshot da tela do proyecto com os cards novos e do painel de revisão com a linha de Reparto, para anexar ao PR.

```bash
git add -A && git commit -m "chore(bloco-c): verificação de fumaça multi-track" --allow-empty
```

---

## Notas de execução

- **`api/procesar-minuta.js` e `app/src/services/ai.js` não mudam.** Ambos repassam `contexto` verbatim (`buildPrompt(String(texto), contexto || {})` na linha 21 do endpoint), então o campo `tracks` chega ao prompt sem nenhuma alteração no transporte. Não abrir esses arquivos.
- **Pendência conhecida, fora de escopo:** override de avance no nível do proyecto (o "56%" reportado na weekly BROU não tem onde morar). Não abrir escopo para isso aqui.
- **Sem transação na gravação:** falha no meio deixa registros parciais. O painel de revisão continua aberto e o erro aparece; reenviar duplica o que já entrou. Documentado como fora de escopo no spec (§7).
- **Task 1 depende de ação manual** no SQL Editor do Supabase. Sem ela, as tasks 4-8 gravam com erro de constraint. Não seguir para a Task 4 antes do Step 3 da Task 1 passar.
