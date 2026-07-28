# Camada PMO (Bloco A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformar as 3 telas do app (Portfólio, Detalhe do projeto, Cockpit do track) para o padrão PMO — saúde RAG, % avanço, marcos, RAID, papéis e documentos — com configuração inline, lendo/gravando no Supabase.

**Architecture:** React + Vite (`app/`). Toda a lógica derivada (RAG, %, vencimentos) vive num módulo **puro e testado** (`app/src/lib/pmoLogic.js`). A camada de dados (`app/src/services/data.js`) ganha fetchers/mutations e sobe documentos via Supabase Storage. As telas consomem lógica+dados; componentes grandes são quebrados em unidades focadas.

**Tech Stack:** React 18, Vite 5, Tailwind 3, `@supabase/supabase-js` v2, lucide-react. Testes: **Vitest** (novo, dev-only) apenas para `pmoLogic.js`.

## Global Constraints

- **Fonte da verdade = Supabase.** Nada de Notion/Supabase paralelos. Toda leitura/escrita via `app/src/services/data.js` → `supabase`.
- **UI 100% espanhol.** Rótulos/botões/mensagens em ES; datas `dd/mm/aaaa` via `fmtDate`. Status do banco (PT) exibidos em ES via `stLabel`. Não traduzir o dado, traduzir a exibição.
- **Não fabricar dados.** % vem de tarefas reais; track sem tarefas mostra rótulo "sin datos", nunca 0% enganoso.
- **Design Visa:** navy `#0A142F`/`#051424`, superfície `#122131`/`#1C2B3C`, borda `#273647`, dourado `#FAA61A`. `rounded-xl`. RAG: verde `#34d399`, amarelo `#fbbf24`, rojo `#fb7185`.
- **RAG amarelo threshold:** 7 dias (constante `AMBER_DAYS = 7`).
- **Verificação de UI:** `cd app && npm run build` deve passar ao fim de cada task de UI.
- **Vocabulário fixo:** tarefas `aberto|em_andamento|bloqueada|fechado`; RAG override `verde|amarelo|rojo`; risco tipo `riesgo|issue`, severidade `alta|media|baja`, status `abierto|en_mitigacion|cerrado`; origen `reunion|prerequisito|riesgo|manual`.

---

### Task 1: Migrações Supabase (schema + storage)

Cria tabelas `marcos` e `riscos`, adiciona colunas em `tareas`/`tracks`/`projetos`, garante colunas de `documentos` e o bucket de storage. **Executada por humano** no SQL Editor do Supabase (a chave anon não roda DDL).

**Files:**
- Create: `db/2026-07-27-camada-pmo.sql` (script versionado no repo, para histórico)

**Interfaces:**
- Produces (colunas/tabelas que a app passará a ler/gravar): `marcos(id, track_id, nome, fecha, concluido, orden)`; `riscos(id, projeto_id, track_id, descricao, tipo, severidade, dueno, status, mitigacion)`; `tareas.data_fechamento`, `tareas.origen`; `tracks.rag_override`; `projetos.csm`, `projetos.rag_override`; `documentos(id, track_id, nome, path, subido_por, created_at)`; bucket `track-docs`.

- [ ] **Step 1: Verificar se `gerente` já cumpre o papel de CSM**

Antes de criar `projetos.csm`, confirmar o uso atual de `projetos.gerente`. Rodar no SQL Editor:

```sql
select id, nome, gerente from projetos;
```

Se `gerente` já contém o nome do CSM em todos os projetos, **pular a criação de `projetos.csm`** e, na UI (Tasks 5/6), rotular `gerente` como "CSM". Caso contrário, criar a coluna `csm` conforme o Step 2. Anotar a decisão no topo do arquivo SQL como comentário.

- [ ] **Step 2: Escrever o script SQL**

Criar `db/2026-07-27-camada-pmo.sql` com:

```sql
-- Camada PMO (Bloco A) — 2026-07-27
-- Decisão CSM: [preencher no Step 1] gerente-é-csm? SIM/NÃO

-- 1. marcos
create table if not exists marcos (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references tracks(id) on delete cascade,
  nome text not null,
  fecha date,
  concluido boolean not null default false,
  orden int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists marcos_track_idx on marcos(track_id);

-- 2. riscos (RAID) — ligável a projeto OU track
create table if not exists riscos (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid references projetos(id) on delete cascade,
  track_id uuid references tracks(id) on delete cascade,
  descricao text not null,
  tipo text not null default 'riesgo',        -- riesgo | issue
  severidade text not null default 'media',    -- alta | media | baja
  dueno text,
  status text not null default 'abierto',      -- abierto | en_mitigacion | cerrado
  mitigacion text,
  created_at timestamptz not null default now(),
  check (projeto_id is not null or track_id is not null)
);
create index if not exists riscos_projeto_idx on riscos(projeto_id);
create index if not exists riscos_track_idx on riscos(track_id);

-- 3. tareas: cierre + origen
alter table tareas add column if not exists data_fechamento date;
alter table tareas add column if not exists origen text not null default 'manual';

-- 4. tracks: rag override (avance já existe = override do %)
alter table tracks add column if not exists rag_override text;  -- verde | amarelo | rojo | null

-- 5. projetos: csm + rag override  (pular 'csm' se gerente já for o CSM)
alter table projetos add column if not exists csm text;
alter table projetos add column if not exists rag_override text;

-- 6. documentos: garantir colunas usadas pela app
create table if not exists documentos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table documentos add column if not exists track_id uuid references tracks(id) on delete cascade;
alter table documentos add column if not exists nome text;
alter table documentos add column if not exists path text;
alter table documentos add column if not exists subido_por text;
create index if not exists documentos_track_idx on documentos(track_id);

-- 7. RLS aberto ao anon (coerente com o resto; Auth fica para depois)
alter table marcos enable row level security;
alter table riscos enable row level security;
alter table documentos enable row level security;
do $$ begin
  create policy anon_all_marcos on marcos for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy anon_all_riscos on riscos for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy anon_all_documentos on documentos for all using (true) with check (true);
exception when duplicate_object then null; end $$;
```

- [ ] **Step 3: Rodar o script no Supabase**

Colar o conteúdo no **SQL Editor** do projeto `iuwvwhofxuvmwnpbsnth` e executar. Confirmar "Success".

- [ ] **Step 4: Criar o bucket de Storage**

No painel Storage do Supabase: **New bucket** → nome `track-docs`, **Private**. Em Policies do bucket, adicionar política permissiva ao papel `anon` para `select/insert` (objetos), coerente com o RLS aberto atual. (Sem isso, upload/list falham para a chave anon.)

- [ ] **Step 5: Verificar**

No SQL Editor:

```sql
select table_name, column_name from information_schema.columns
where table_name in ('marcos','riscos','tareas','tracks','projetos','documentos')
  and column_name in ('data_fechamento','origen','rag_override','csm','nome','path','fecha','severidade')
order by table_name, column_name;
```

Expected: linhas confirmando as novas colunas. Commitar o `.sql`:

```bash
git add db/2026-07-27-camada-pmo.sql
git commit -m "db(pmo): tabelas marcos/riscos + colunas PMO + bucket track-docs"
```

---

### Task 2: Módulo de lógica PMO (puro, TDD com Vitest)

Toda a matemática derivada — dias até data, vencido, % avanço, RAG, próximo marco, contadores de KPI — num módulo puro e testado. É o coração do "não fabricar dados".

**Files:**
- Create: `app/src/lib/pmoLogic.js`
- Create: `app/src/lib/pmoLogic.test.js`
- Modify: `app/package.json` (script `test` + devDep `vitest`)

**Interfaces:**
- Produces:
  - `todayISO(now?) -> 'YYYY-MM-DD'`
  - `daysTo(iso, todayIso) -> number` (negativo = passado; `null` se sem data)
  - `isOverdue(iso, todayIso) -> boolean`
  - `avanceTrack(track, tareas) -> { pct:number, hasData:boolean }`
  - `avanceProjeto(tracks, tareasByTrack) -> number`
  - `ragTrack(track, tareas, marcos, todayIso, amberDays=7) -> 'verde'|'amarelo'|'rojo'`
  - `ragProjeto(projeto, tracks, tareasByTrack, marcosByTrack, todayIso) -> 'verde'|'amarelo'|'rojo'`
  - `nextMarco(marcos, todayIso) -> marco | null` (não concluído com menor fecha)
  - `countVencidas(tareas, todayIso) -> number`
  - `countBloqueadas(tareas) -> number`
  - `RAG_RANK = { verde:0, amarelo:1, rojo:2 }`

- [ ] **Step 1: Instalar Vitest e adicionar script**

Run:

```bash
cd app && npm install -D vitest@^2
```

Editar `app/package.json` `scripts` para incluir:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: Escrever os testes que falham**

Criar `app/src/lib/pmoLogic.test.js`:

```js
import { describe, it, expect } from 'vitest';
import {
  daysTo, isOverdue, avanceTrack, avanceProjeto,
  ragTrack, ragProjeto, nextMarco, countVencidas, countBloqueadas,
} from './pmoLogic';

const TODAY = '2026-07-27';

describe('daysTo / isOverdue', () => {
  it('conta dias positivos no futuro', () => expect(daysTo('2026-07-30', TODAY)).toBe(3));
  it('conta dias negativos no passado', () => expect(daysTo('2026-07-25', TODAY)).toBe(-2));
  it('null sem data', () => expect(daysTo(null, TODAY)).toBe(null));
  it('vencido quando data < hoje', () => expect(isOverdue('2026-07-25', TODAY)).toBe(true));
  it('não vencido quando data = hoje', () => expect(isOverdue('2026-07-27', TODAY)).toBe(false));
});

describe('avanceTrack', () => {
  it('deriva de fechadas/total', () => {
    const t = avanceTrack({ avance: null }, [
      { status: 'fechado' }, { status: 'fechado' }, { status: 'aberto' }, { status: 'bloqueada' },
    ]);
    expect(t).toEqual({ pct: 50, hasData: true });
  });
  it('sem tarefas => hasData false, pct 0', () => {
    expect(avanceTrack({ avance: null }, [])).toEqual({ pct: 0, hasData: false });
  });
  it('override manual vence', () => {
    expect(avanceTrack({ avance: 80 }, [{ status: 'aberto' }])).toEqual({ pct: 80, hasData: true });
  });
});

describe('avanceProjeto', () => {
  it('média dos tracks', () => {
    const tracks = [{ id: 'a', avance: null }, { id: 'b', avance: null }];
    const byTrack = { a: [{ status: 'fechado' }, { status: 'aberto' }], b: [{ status: 'fechado' }] };
    expect(avanceProjeto(tracks, byTrack)).toBe(75); // (50 + 100)/2
  });
});

describe('ragTrack', () => {
  const clean = { id: 't', rag_override: null, waiver_hasta: null };
  it('rojo com tarefa bloqueada', () => {
    expect(ragTrack(clean, [{ status: 'bloqueada' }], [], TODAY)).toBe('rojo');
  });
  it('rojo com marco vencido não concluído', () => {
    expect(ragTrack(clean, [], [{ fecha: '2026-07-25', concluido: false }], TODAY)).toBe('rojo');
  });
  it('amarelo com waiver em <=7 dias', () => {
    expect(ragTrack({ ...clean, waiver_hasta: '2026-08-01' }, [], [], TODAY)).toBe('amarelo');
  });
  it('verde sem sinais', () => {
    expect(ragTrack(clean, [{ status: 'aberto' }], [], TODAY)).toBe('verde');
  });
  it('override vence a regra', () => {
    expect(ragTrack({ ...clean, rag_override: 'rojo' }, [], [], TODAY)).toBe('rojo');
  });
});

describe('ragProjeto', () => {
  it('pior RAG entre tracks', () => {
    const tracks = [{ id: 'a', rag_override: null, waiver_hasta: null }, { id: 'b', rag_override: null, waiver_hasta: null }];
    const byTrack = { a: [{ status: 'aberto' }], b: [{ status: 'bloqueada' }] };
    expect(ragProjeto({ rag_override: null }, tracks, byTrack, {}, TODAY)).toBe('rojo');
  });
  it('override do projeto vence', () => {
    expect(ragProjeto({ rag_override: 'amarelo' }, [], {}, {}, TODAY)).toBe('amarelo');
  });
});

describe('nextMarco / contadores', () => {
  it('próximo marco = menor fecha não concluída', () => {
    const m = nextMarco([
      { nome: 'A', fecha: '2026-09-30', concluido: false },
      { nome: 'B', fecha: '2026-08-08', concluido: false },
      { nome: 'C', fecha: '2026-07-01', concluido: true },
    ], TODAY);
    expect(m.nome).toBe('B');
  });
  it('countVencidas ignora fechadas', () => {
    expect(countVencidas([
      { status: 'aberto', previsao_entrega: '2026-07-25' },
      { status: 'fechado', previsao_entrega: '2026-07-25' },
      { status: 'aberto', previsao_entrega: '2026-08-10' },
    ], TODAY)).toBe(1);
  });
  it('countBloqueadas', () => {
    expect(countBloqueadas([{ status: 'bloqueada' }, { status: 'aberto' }])).toBe(1);
  });
});
```

- [ ] **Step 3: Rodar os testes e ver falhar**

Run: `cd app && npm test`
Expected: FAIL — `pmoLogic.js` não existe / exports indefinidos.

- [ ] **Step 4: Implementar `pmoLogic.js`**

Criar `app/src/lib/pmoLogic.js`:

```js
// Lógica PMO pura e testável. Sem React, sem Supabase. Não fabricar dados.
export const RAG_RANK = { verde: 0, amarelo: 1, rojo: 2 };
const RANK_RAG = ['verde', 'amarelo', 'rojo'];

export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysTo(iso, todayIso) {
  if (!iso) return null;
  const a = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  const b = new Date(`${todayIso}T00:00:00`);
  return Math.round((a - b) / 86400000);
}

export function isOverdue(iso, todayIso) {
  if (!iso) return false;
  return String(iso).slice(0, 10) < todayIso;
}

export function avanceTrack(track, tareas) {
  if (track && track.avance != null && track.avance !== '') {
    return { pct: Number(track.avance), hasData: true };
  }
  const total = tareas.length;
  if (!total) return { pct: 0, hasData: false };
  const done = tareas.filter((t) => t.status === 'fechado').length;
  return { pct: Math.round((done / total) * 100), hasData: true };
}

export function avanceProjeto(tracks, tareasByTrack) {
  if (!tracks.length) return 0;
  const sum = tracks.reduce((acc, tr) => acc + avanceTrack(tr, tareasByTrack[tr.id] || []).pct, 0);
  return Math.round(sum / tracks.length);
}

export function ragTrack(track, tareas, marcos, todayIso, amberDays = 7) {
  if (track && track.rag_override) return track.rag_override;
  const hasBlocked = tareas.some((t) => t.status === 'bloqueada');
  const marcoVencido = marcos.some((m) => !m.concluido && isOverdue(m.fecha, todayIso));
  if (hasBlocked || marcoVencido) return 'rojo';
  const within = (iso) => { const d = daysTo(iso, todayIso); return d != null && d >= 0 && d <= amberDays; };
  const waiverSoon = track && within(track.waiver_hasta);
  const tareaSoon = tareas.some((t) => t.status !== 'fechado' && within(t.previsao_entrega));
  const marcoSoon = marcos.some((m) => !m.concluido && within(m.fecha));
  if (waiverSoon || tareaSoon || marcoSoon) return 'amarelo';
  return 'verde';
}

export function ragProjeto(projeto, tracks, tareasByTrack, marcosByTrack, todayIso, amberDays = 7) {
  if (projeto && projeto.rag_override) return projeto.rag_override;
  let worst = 0;
  for (const tr of tracks) {
    const r = ragTrack(tr, tareasByTrack[tr.id] || [], marcosByTrack[tr.id] || [], todayIso, amberDays);
    worst = Math.max(worst, RAG_RANK[r]);
  }
  return RANK_RAG[worst];
}

export function nextMarco(marcos, todayIso) {
  const pend = marcos.filter((m) => !m.concluido && m.fecha).sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
  return pend[0] || null;
}

export function countVencidas(tareas, todayIso) {
  return tareas.filter((t) => t.status !== 'fechado' && isOverdue(t.previsao_entrega, todayIso)).length;
}

export function countBloqueadas(tareas) {
  return tareas.filter((t) => t.status === 'bloqueada').length;
}
```

- [ ] **Step 5: Rodar os testes e ver passar**

Run: `cd app && npm test`
Expected: PASS (todos os testes verdes).

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/pmoLogic.js app/src/lib/pmoLogic.test.js app/package.json app/package-lock.json
git commit -m "feat(pmo): módulo de lógica PMO (RAG, %, vencidas) + testes vitest"
```

---

### Task 3: Camada de dados (fetchers + mutations + storage)

Estender `data.js` para ler marcos/riscos/documentos e gravar tudo que a UI precisa, incluindo upload de arquivo.

**Files:**
- Modify: `app/src/services/data.js`

**Interfaces:**
- Consumes: `supabase` de `../lib/supabase`.
- Produces (usados pelas Tasks 5–9):
  - `fetchAll()` passa a retornar também `marcos`, `riscos`, `documentos`.
  - `createMarco(row)`, `updateMarco(id, fields)`, `deleteMarco(id)`
  - `createRisco(row)`, `updateRisco(id, fields)`, `deleteRisco(id)`
  - `updateProjeto(id, fields)` (para `csm`, `rag_override`, status)
  - `updateTareaStatus(id, status)` (seta `data_fechamento` ao fechar)
  - `uploadDocumento(trackId, file, subidoPor) -> row`, `documentoUrl(path) -> signedUrl`, `deleteDocumento(doc)`
  - `createReuniaoParaTrack(trackId, row) -> reuniao` (insere em `reunioes` + liga em `reunion_tracks`)

- [ ] **Step 1: Adicionar tabelas ao fetchAll e novas mutations**

Editar `app/src/services/data.js`. Em `TABLES`, adicionar `'marcos'`, `'riscos'`, `'documentos'`:

```js
const TABLES = [
  'clientes', 'projetos', 'tracks', 'tareas', 'personas', 'persona_tracks',
  'prerequisitos', 'reunioes', 'reunion_tracks', 'track_dependencias',
  'marcos', 'riscos', 'documentos',
];
```

Adicionar ao final do arquivo:

```js
// ---- projetos ----
export const updateProjeto = (id, fields) => run(supabase.from('projetos').update(fields).eq('id', id).select().single());

// ---- tareas: fechar seta data_fechamento ----
export const updateTareaStatus = (id, status) => {
  const fields = { status };
  fields.data_fechamento = status === 'fechado' ? new Date().toISOString().slice(0, 10) : null;
  return run(supabase.from('tareas').update(fields).eq('id', id).select().single());
};

// ---- marcos ----
export const createMarco = (row) => run(supabase.from('marcos').insert(row).select().single());
export const updateMarco = (id, fields) => run(supabase.from('marcos').update(fields).eq('id', id).select().single());
export const deleteMarco = (id) => run(supabase.from('marcos').delete().eq('id', id));

// ---- riscos (RAID) ----
export const createRisco = (row) => run(supabase.from('riscos').insert(row).select().single());
export const updateRisco = (id, fields) => run(supabase.from('riscos').update(fields).eq('id', id).select().single());
export const deleteRisco = (id) => run(supabase.from('riscos').delete().eq('id', id));

// ---- documentos (Supabase Storage: bucket 'track-docs') ----
const BUCKET = 'track-docs';
export async function uploadDocumento(trackId, file, subidoPor) {
  const path = `${trackId}/${Date.now()}-${file.name}`;
  const up = await supabase.storage.from(BUCKET).upload(path, file);
  if (up.error) throw new Error(up.error.message);
  return run(supabase.from('documentos').insert({ track_id: trackId, nome: file.name, path, subido_por: subidoPor || null }).select().single());
}
export async function documentoUrl(path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}
export const deleteDocumento = async (doc) => {
  await supabase.storage.from(BUCKET).remove([doc.path]);
  return run(supabase.from('documentos').delete().eq('id', doc.id));
};

// ---- reuniones (registro manual, ligada ao track) ----
export async function createReuniaoParaTrack(trackId, row) {
  const reu = await run(supabase.from('reunioes').insert(row).select().single());
  await run(supabase.from('reunion_tracks').insert({ reuniao_id: reu.id, track_id: trackId }));
  return reu;
}
```

- [ ] **Step 2: Verificar build**

Run: `cd app && npm run build`
Expected: build OK (sem erros de import).

- [ ] **Step 3: Commit**

```bash
git add app/src/services/data.js
git commit -m "feat(pmo): data layer para marcos, riscos, documentos e updates"
```

---

### Task 4: Helpers de apresentação (RAG, origen, severidade)

Pequenos helpers visuais reutilizados pelas 3 telas, no arquivo de UI já existente.

**Files:**
- Modify: `app/src/components/trackingUi.jsx`

**Interfaces:**
- Produces: `RAG_COLOR = { verde, amarelo, rojo }`; `RagDot({ rag, size })`; `ProgressBar({ pct })`; `ORIGEN_LABEL`; `SEVERIDAD_LABEL`; `RISK_STATUS_LABEL`; `ORIGENES`, `SEVERIDADES`, `RISK_TIPOS`, `RISK_STATUSES` (arrays para selects).

- [ ] **Step 1: Adicionar helpers ao final de `trackingUi.jsx`**

```jsx
export const RAG_COLOR = { verde: '#34d399', amarelo: '#fbbf24', rojo: '#fb7185' };

export function RagDot({ rag, size = 12 }) {
  return <span style={{ width: size, height: size, background: RAG_COLOR[rag] || '#94a3b8' }} className="inline-block rounded-full flex-none" />;
}

export function ProgressBar({ pct }) {
  return (
    <div className="h-1.5 rounded-full bg-[#1e2a44] overflow-hidden">
      <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: 'linear-gradient(90deg,#FAA61A,#f6c15a)' }} />
    </div>
  );
}

export const ORIGENES = ['manual', 'reunion', 'prerequisito', 'riesgo'];
export const ORIGEN_LABEL = { manual: 'Manual', reunion: 'Reunión', prerequisito: 'Prerequisito', riesgo: 'Riesgo' };
export const SEVERIDADES = ['alta', 'media', 'baja'];
export const SEVERIDAD_LABEL = { alta: 'Alta', media: 'Media', baja: 'Baja' };
export const SEVERIDAD_COLOR = { alta: '#fb7185', media: '#fbbf24', baja: '#94a3b8' };
export const RISK_TIPOS = ['riesgo', 'issue'];
export const RISK_TIPO_LABEL = { riesgo: 'Riesgo', issue: 'Issue' };
export const RISK_STATUSES = ['abierto', 'en_mitigacion', 'cerrado'];
export const RISK_STATUS_LABEL = { abierto: 'Abierto', en_mitigacion: 'En mitigación', cerrado: 'Cerrado' };
```

- [ ] **Step 2: Verificar build**

Run: `cd app && npm run build`
Expected: build OK.

- [ ] **Step 3: Commit**

```bash
git add app/src/components/trackingUi.jsx
git commit -m "feat(pmo): helpers de apresentação (RagDot, ProgressBar, labels RAID/origen)"
```

---

### Task 5: Portfólio PMO (tela principal, layout "linhas")

Reformar a visão de portfólio: KPIs derivados + linha densa por projeto com RAG, %, próximo marco, CSM, contadores. Adicionar os mapas `marcosByTrack`, `riscosByProjeto/Track`, `documentosByTrack` ao memo.

**Files:**
- Modify: `app/src/components/TrackingView.jsx`

**Interfaces:**
- Consumes: `pmoLogic` (`todayISO, ragProjeto, avanceProjeto, nextMarco, daysTo, countVencidas, countBloqueadas`), `trackingUi` (`RagDot, ProgressBar`), `data.fetchAll`.
- Produces: memo `m` com `marcosByTrack`, `riscosByProjeto`, `riscosByTrack`, `documentosByTrack`; usados nas Tasks 6/7.

- [ ] **Step 1: Ampliar imports e o memo `m`**

No topo de `TrackingView.jsx`, adicionar imports:

```jsx
import { todayISO, ragProjeto, avanceProjeto, nextMarco, daysTo, countVencidas, countBloqueadas, RAG_RANK } from '../lib/pmoLogic';
import { Badge, fmtDate, stDot, inputCls, btnGold, linkGold, FRENTES, TRACK_STATUSES, RagDot, ProgressBar } from './trackingUi';
```

Dentro do `useMemo`, após montar `depsByTrack`, adicionar:

```jsx
const marcosByTrack = by(data.marcos, 'track_id');
const riscosByTrack = by(data.riscos.filter((r) => r.track_id), 'track_id');
const riscosByProjeto = by(data.riscos.filter((r) => r.projeto_id), 'projeto_id');
const documentosByTrack = by(data.documentos, 'track_id');
```

e incluí-los no objeto retornado (`return { ...`): `marcosByTrack, riscosByTrack, riscosByProjeto, documentosByTrack`.

- [ ] **Step 2: Helper de resumo derivado por projeto**

Adicionar (fora do componente, junto de `trackStats`):

```jsx
function projetoResumo(m, proj, today) {
  const tracks = m.tracksByProjeto[proj.id] || [];
  const rag = ragProjeto(proj, tracks, m.tareasByTrack, m.marcosByTrack, today);
  const pct = avanceProjeto(tracks, m.tareasByTrack);
  // próximo marco entre todos os tracks do projeto
  const allMarcos = tracks.flatMap((t) => m.marcosByTrack[t.id] || []);
  const marco = nextMarco(allMarcos, today);
  const tareas = tracks.flatMap((t) => m.tareasByTrack[t.id] || []);
  const vencidas = countVencidas(tareas, today);
  const bloqueadas = countBloqueadas(tareas);
  const riesgos = (m.riscosByProjeto[proj.id] || []).length + tracks.reduce((a, t) => a + (m.riscosByTrack[t.id] || []).length, 0);
  return { tracks, rag, pct, marco, vencidas, bloqueadas, riesgos };
}
```

- [ ] **Step 3: KPIs do portfólio derivados**

Substituir o bloco de KPIs do portfólio (grid de 5 `Kpi`) por 6 KPIs derivados. No início do return do portfólio, calcular:

```jsx
const today = todayISO();
const allTareas = data.tareas;
const enRiesgo = data.projetos.filter((p) => RAG_RANK[projetoResumo(m, p, today).rag] >= 1).length;
```

e o grid:

```jsx
<div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
  <Kpi n={m.clientes.length} label="Clientes" />
  <Kpi n={data.projetos.length} label="Proyectos" />
  <Kpi n={data.tracks.length} label="Tracks" />
  <Kpi n={enRiesgo} label="En riesgo" danger />
  <Kpi n={countBloqueadas(allTareas)} label="Bloqueadas" danger />
  <Kpi n={countVencidas(allTareas, today)} label="Vencidas" danger />
</div>
```

- [ ] **Step 4: Linha densa por projeto**

Substituir o card de projeto do portfólio (o `div` com `bg-[#122131]/60 ... rounded-2xl p-4 mb-3`) por uma linha PMO. Novo componente (fora do container):

```jsx
function ProjetoRow({ m, proj, cli, today, onOpen }) {
  const r = projetoResumo(m, proj, today);
  const d = r.marco ? daysTo(r.marco.fecha, today) : null;
  return (
    <button onClick={() => onOpen(proj.id)} className="w-full text-left grid grid-cols-1 md:grid-cols-[16px_1.7fr_1fr_1.1fr_0.9fr] gap-3 items-center px-3 py-3 rounded-xl hover:bg-[#122131] border border-transparent hover:border-[#273647] transition-colors">
      <RagDot rag={r.rag} />
      <div className="min-w-0">
        <div className="text-sm font-bold text-slate-100 truncate flex items-center gap-2"><FolderKanban className="w-4 h-4 text-[#FAA61A] flex-none" />{proj.nome}<Badge v={proj.status} /></div>
        <div className="text-[11px] text-slate-400 mt-0.5">CSM: {proj.csm || proj.gerente || '—'} · {r.tracks.length} tracks{r.bloqueadas ? ` · ${r.bloqueadas} bloqueadas` : ''}</div>
      </div>
      <div><ProgressBar pct={r.pct} /><div className="text-[11px] text-slate-400 mt-1">{r.pct}% avance</div></div>
      <div className="text-[11px]">
        {r.marco ? (<><div className="text-slate-200 truncate">{r.marco.nome}</div><div className={d < 0 ? 'text-rose-300' : 'text-slate-400'}>{d < 0 ? `venció hace ${-d} d` : `en ${d} d`} · {fmtDate(r.marco.fecha)}</div></>) : <span className="text-slate-500">sin hitos</span>}
      </div>
      <div className="flex gap-1.5 flex-wrap md:justify-end">
        {r.riesgos > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full border border-rose-500/40 text-rose-300 bg-rose-500/10">{r.riesgos} riesgo{r.riesgos > 1 ? 's' : ''}</span>}
        {r.vencidas > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#273647] text-slate-300">{r.vencidas} vencidas</span>}
      </div>
    </button>
  );
}
```

Na iteração de clientes, trocar o `.map` de projetos para usar `ProjetoRow` dentro de um contêiner por cliente:

```jsx
<div className="bg-[#122131]/40 border border-[#273647] rounded-2xl p-2 divide-y divide-[#273647]/50">
  {projetos.length ? projetos.map((proj) => (
    <ProjetoRow key={proj.id} m={m} proj={proj} cli={cli} today={today} onOpen={setSelProjeto} />
  )) : <p className="text-sm text-slate-500 px-3 py-2">Sin proyectos. Usá “Nuevo proyecto”.</p>}
</div>
```

(Manter os botões `NewCliente`/`NewProjeto` como estão.)

- [ ] **Step 5: Verificar build + fumaça**

Run: `cd app && npm run build`
Expected: build OK.
Fumaça (opcional, `npm run dev`): portfólio mostra semáforo, %, próximo marco e KPIs "En riesgo/Vencidas" coerentes com BROU/Corrientes.

- [ ] **Step 6: Commit**

```bash
git add app/src/components/TrackingView.jsx
git commit -m "feat(pmo): portfólio en formato PMO (RAG, avance, próximo hito, KPIs)"
```

---

### Task 6: Detalhe do projeto PMO + RAID agregado

Cabeçalho PMO no detalhe do projeto, CSM editável, e bloco RAID agregando riscos do projeto + dos tracks.

**Files:**
- Modify: `app/src/components/TrackingView.jsx`

**Interfaces:**
- Consumes: `projetoResumo`, `pmoLogic`, `updateProjeto` de `data.js`.
- Produces: usa mapas do memo (Task 5).

- [ ] **Step 1: Importar updateProjeto**

Editar o import de `data`:

```jsx
import { fetchAll, createCliente, createProjeto, createTrack, updateProjeto } from '../services/data';
```

- [ ] **Step 2: Cabeçalho PMO + CSM editável no detalhe**

No ramo `if (selProjeto && ...)`, calcular resumo e substituir a faixa de badges/KPIs. Após `const tracks = ...`:

```jsx
const today = todayISO();
const r = projetoResumo(m, proj, today);
```

Trocar o `<h1>` + badges por:

```jsx
<div className="flex items-center gap-3">
  <RagDot rag={r.rag} size={14} />
  <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2"><FolderKanban className="w-5 h-5 text-[#FAA61A]" /> {proj.nome}</h1>
  <Badge v={proj.status} />
</div>
<div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
  <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-blue-300 bg-blue-500/15 border-blue-500/25">{cli?.nome}</span>
  <CsmEditable proj={proj} onSaved={load} />
  {proj.inicio && <span className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300">Inicio: {fmtDate(proj.inicio)}</span>}
</div>
<div className="max-w-md mb-5"><ProgressBar pct={r.pct} /><div className="text-[11px] text-slate-400 mt-1">{r.pct}% avance del proyecto</div></div>
```

Substituir o grid de 3 `Kpi` por 4:

```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mb-6">
  <Kpi n={r.tracks.length} label="Tracks" />
  <Kpi n={r.tracks.filter((t) => (t.status || '').startsWith('Em curso')).length} label="En curso" />
  <Kpi n={r.bloqueadas} label="Bloqueadas" danger />
  <Kpi n={r.vencidas} label="Vencidas" danger />
</div>
```

- [ ] **Step 3: Componente CsmEditable**

Adicionar (fora do container):

```jsx
function CsmEditable({ proj, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(proj.csm || proj.gerente || '');
  const [saving, setSaving] = useState(false);
  if (!editing) {
    return <button onClick={() => setEditing(true)} className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300 hover:border-[#FAA61A]/40">CSM: {proj.csm || proj.gerente || '—'} ✎</button>;
  }
  return (
    <span className="inline-flex items-center gap-1">
      <input className={inputCls + ' !w-40 !py-1'} value={val} onChange={(e) => setVal(e.target.value)} autoFocus />
      <button disabled={saving} onClick={async () => { setSaving(true); try { await updateProjeto(proj.id, { csm: val || null }); setEditing(false); onSaved(); } finally { setSaving(false); } }} className={btnGold}>OK</button>
    </span>
  );
}
```

- [ ] **Step 4: Bloco RAID agregado (só leitura)**

Antes da seção "Tracks" no detalhe, inserir:

```jsx
{(() => {
  const riesgos = [...(m.riscosByProjeto[proj.id] || []), ...r.tracks.flatMap((t) => (m.riscosByTrack[t.id] || []).map((x) => ({ ...x, _track: t.nome })))];
  if (!riesgos.length) return null;
  return (
    <div className="bg-[#122131]/60 border border-[#273647] rounded-2xl p-4 mb-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Riesgos &amp; Issues del proyecto</h3>
      {riesgos.map((x) => (
        <div key={x.id} className="flex gap-2 py-1.5 border-t border-[#273647]/60 first:border-0 text-[12.5px]">
          <span className="w-1 rounded self-stretch flex-none" style={{ background: SEVERIDAD_COLOR[x.severidade] || '#94a3b8' }} />
          <div><div className="text-slate-200">{x.descricao}</div><div className="text-[10px] text-slate-500">{RISK_TIPO_LABEL[x.tipo]} · {SEVERIDAD_LABEL[x.severidade]} · {x.dueno || '—'} · {RISK_STATUS_LABEL[x.status]}{x._track ? ` · ${x._track}` : ''}</div></div>
        </div>
      ))}
    </div>
  );
})()}
```

Adicionar aos imports de `trackingUi`: `SEVERIDAD_COLOR, SEVERIDAD_LABEL, RISK_TIPO_LABEL, RISK_STATUS_LABEL`.

- [ ] **Step 5: Verificar build**

Run: `cd app && npm run build`
Expected: build OK.

- [ ] **Step 6: Commit**

```bash
git add app/src/components/TrackingView.jsx
git commit -m "feat(pmo): detalle de proyecto PMO (RAG, avance, CSM editable, RAID agregado)"
```

---

### Task 7: Sub-componentes do cockpit — Marcos, RAID, Documentos

Três unidades focadas que o cockpit vai consumir. Ficam em arquivos próprios para o cockpit não crescer demais.

**Files:**
- Create: `app/src/components/MarcosList.jsx`
- Create: `app/src/components/RaidList.jsx`
- Create: `app/src/components/DocsUploader.jsx`

**Interfaces:**
- Consumes: `data.js` mutations; `pmoLogic` (`nextMarco, daysTo, isOverdue, todayISO`); `trackingUi`.
- Produces: `<MarcosList trackId marcos onChange />`, `<RaidList trackId riscos onChange />`, `<DocsUploader trackId docs onChange />`.

- [ ] **Step 1: MarcosList.jsx**

```jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { createMarco, updateMarco, deleteMarco } from '../services/data';
import { fmtDate, inputCls, btnGold, linkGold } from './trackingUi';
import { nextMarco, daysTo, isOverdue, todayISO } from '../lib/pmoLogic';

export default function MarcosList({ trackId, marcos, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ nome: '', fecha: '' });
  const [saving, setSaving] = useState(false);
  const today = todayISO();
  const prox = nextMarco(marcos, today);
  const ordered = [...marcos].sort((a, b) => (a.fecha || '9999') < (b.fecha || '9999') ? -1 : 1);
  const add = async (e) => {
    e.preventDefault(); if (!f.nome.trim()) return; setSaving(true);
    try { await createMarco({ track_id: trackId, nome: f.nome.trim(), fecha: f.fecha || null, orden: marcos.length }); setF({ nome: '', fecha: '' }); setOpen(false); onChange(); }
    finally { setSaving(false); }
  };
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-400">Marcos / Hitos</h4>
        {!open && <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Nuevo marco</button>}
      </div>
      {open && (
        <form onSubmit={add} className="space-y-2 mb-3">
          <input className={inputCls} placeholder="Nombre del hito" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} autoFocus />
          <div className="flex gap-2 items-center">
            <input type="date" className={inputCls} value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} />
            <button disabled={saving} className={btnGold}>OK</button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400">Cancelar</button>
          </div>
        </form>
      )}
      {ordered.length ? ordered.map((mrc) => {
        const d = daysTo(mrc.fecha, today);
        const venc = !mrc.concluido && isOverdue(mrc.fecha, today);
        return (
          <div key={mrc.id} className={`flex items-center gap-2 py-1.5 border-t border-[#273647]/50 first:border-0 text-[12.5px] ${mrc.concluido ? 'opacity-55' : ''}`}>
            <button title="Marcar concluido" onClick={async () => { await updateMarco(mrc.id, { concluido: !mrc.concluido }); onChange(); }} className={`w-4 h-4 rounded border grid place-items-center text-[9px] flex-none ${mrc.concluido ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300' : 'border-slate-500 text-transparent'}`}>✓</button>
            {prox && prox.id === mrc.id && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 flex-none">próximo</span>}
            <span className="flex-1 text-slate-200">{mrc.nome}</span>
            <span className={venc ? 'text-rose-300' : 'text-slate-400'}>{mrc.concluido ? `✓ ${fmtDate(mrc.fecha)}` : d == null ? '—' : d < 0 ? `venció hace ${-d} d` : `en ${d} d`}</span>
            <button onClick={async () => { await deleteMarco(mrc.id); onChange(); }} className="text-slate-600 hover:text-rose-400 text-xs flex-none">✕</button>
          </div>
        );
      }) : <p className="text-xs text-slate-400">Sin hitos.</p>}
    </div>
  );
}
```

- [ ] **Step 2: RaidList.jsx**

```jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { createRisco, updateRisco, deleteRisco } from '../services/data';
import { inputCls, btnGold, linkGold, SEVERIDADES, SEVERIDAD_LABEL, SEVERIDAD_COLOR, RISK_TIPOS, RISK_TIPO_LABEL, RISK_STATUSES, RISK_STATUS_LABEL } from './trackingUi';

export default function RaidList({ trackId, riscos, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ descricao: '', tipo: 'riesgo', severidade: 'media', dueno: '', status: 'abierto' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const add = async (e) => {
    e.preventDefault(); if (!f.descricao.trim()) return; setSaving(true);
    try { await createRisco({ track_id: trackId, ...f, descricao: f.descricao.trim() }); setF({ descricao: '', tipo: 'riesgo', severidade: 'media', dueno: '', status: 'abierto' }); setOpen(false); onChange(); }
    finally { setSaving(false); }
  };
  return (
    <div className="bg-[#122131] border border-[#273647] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-400">Riesgos &amp; Issues (RAID)</h4>
        {!open && <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Nuevo</button>}
      </div>
      {open && (
        <form onSubmit={add} className="space-y-2 mb-3">
          <input className={inputCls} placeholder="Descripción del riesgo/issue" value={f.descricao} onChange={set('descricao')} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <select className={inputCls} value={f.tipo} onChange={set('tipo')}>{RISK_TIPOS.map((x) => <option key={x} value={x}>{RISK_TIPO_LABEL[x]}</option>)}</select>
            <select className={inputCls} value={f.severidade} onChange={set('severidade')}>{SEVERIDADES.map((x) => <option key={x} value={x}>{SEVERIDAD_LABEL[x]}</option>)}</select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Dueño" value={f.dueno} onChange={set('dueno')} />
            <select className={inputCls} value={f.status} onChange={set('status')}>{RISK_STATUSES.map((x) => <option key={x} value={x}>{RISK_STATUS_LABEL[x]}</option>)}</select>
          </div>
          <div className="flex gap-2"><button disabled={saving} className={btnGold}>Guardar</button><button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 px-2">Cancelar</button></div>
        </form>
      )}
      {riscos.length ? riscos.map((x) => (
        <div key={x.id} className="flex gap-2 py-2 border-t border-[#273647]/60 first:border-0 text-[12.5px]">
          <span className="w-1 rounded self-stretch flex-none" style={{ background: SEVERIDAD_COLOR[x.severidade] || '#94a3b8' }} />
          <div className="flex-1">
            <div className="text-slate-200">{x.descricao}</div>
            <div className="text-[10px] text-slate-500">{RISK_TIPO_LABEL[x.tipo]} · {SEVERIDAD_LABEL[x.severidade]} · {x.dueno || '—'} ·
              <button onClick={async () => { const order = RISK_STATUSES; const next = order[(order.indexOf(x.status) + 1) % order.length]; await updateRisco(x.id, { status: next }); onChange(); }} className="ml-1 underline decoration-dotted hover:text-slate-300">{RISK_STATUS_LABEL[x.status]}</button>
            </div>
          </div>
          <button onClick={async () => { await deleteRisco(x.id); onChange(); }} className="text-slate-600 hover:text-rose-400 text-xs flex-none">✕</button>
        </div>
      )) : <p className="text-xs text-slate-400">Sin riesgos.</p>}
    </div>
  );
}
```

- [ ] **Step 3: DocsUploader.jsx**

```jsx
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
            <span className="flex items-center gap-2 flex-none text-slate-500 text-[10px]">{fmtDate(d.created_at)}{d.subido_por ? ` · ${d.subido_por}` : ''}<button onClick={async () => { await deleteDocumento(d); onChange(); }} className="hover:text-rose-400">✕</button></span>
          </div>
        )) : <p className="text-xs text-slate-400 mt-1">Sin documentos.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verificar build**

Run: `cd app && npm run build`
Expected: build OK (componentes ainda não usados; sem erro de sintaxe/import).

- [ ] **Step 5: Commit**

```bash
git add app/src/components/MarcosList.jsx app/src/components/RaidList.jsx app/src/components/DocsUploader.jsx
git commit -m "feat(pmo): sub-componentes del cockpit (MarcosList, RaidList, DocsUploader)"
```

---

### Task 8: Tabela de tarefas com Estado/Apertura/Cierre/Origen + toggle

Componente da vista **Lista** das tarefas e o formulário de nova tarefa com `origen`.

**Files:**
- Create: `app/src/components/TareasTable.jsx`

**Interfaces:**
- Consumes: `createTarea`, `updateTareaStatus` de `data.js`; `trackingUi` (`fmtDate, stLabel, ORIGENES, ORIGEN_LABEL, inputCls, btnGold, TAREA_ORDER`); `pmoLogic` (`isOverdue, todayISO`).
- Produces: `<TareasTable trackId tareas onChange />` (inclui o botão + form "Nueva tarea").

- [ ] **Step 1: TareasTable.jsx**

```jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { createTarea, updateTareaStatus } from '../services/data';
import { fmtDate, stLabel, stDot, inputCls, btnGold, linkGold, TAREA_ORDER, TAREA_CYCLE, ORIGENES, ORIGEN_LABEL } from './trackingUi';
import { isOverdue, todayISO } from '../lib/pmoLogic';

const EST_CLS = {
  aberto: 'bg-slate-500/15 text-slate-300', em_andamento: 'bg-blue-500/18 text-blue-300',
  bloqueada: 'bg-rose-500/18 text-rose-300', fechado: 'bg-emerald-500/16 text-emerald-300',
};

function NewTarea({ trackId, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ titulo: '', responsavel: '', previsao_entrega: '', origen: 'manual' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); if (!f.titulo.trim()) return; setSaving(true);
    try { await createTarea({ track_id: trackId, titulo: f.titulo.trim(), status: 'aberto', responsavel: f.responsavel || null, previsao_entrega: f.previsao_entrega || null, origen: f.origen }); setF({ titulo: '', responsavel: '', previsao_entrega: '', origen: 'manual' }); setOpen(false); onChange(); }
    finally { setSaving(false); }
  };
  if (!open) return <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Nueva tarea</button>;
  return (
    <form onSubmit={submit} className="bg-[#0b1626] border border-[#273647] rounded-xl p-3 space-y-2 mb-3">
      <input className={inputCls} placeholder="Tarea…" value={f.titulo} onChange={set('titulo')} autoFocus />
      <div className="grid grid-cols-3 gap-2">
        <input className={inputCls} placeholder="Responsable" value={f.responsavel} onChange={set('responsavel')} />
        <input type="date" className={inputCls} value={f.previsao_entrega} onChange={set('previsao_entrega')} />
        <select className={inputCls} value={f.origen} onChange={set('origen')}>{ORIGENES.map((o) => <option key={o} value={o}>{ORIGEN_LABEL[o]}</option>)}</select>
      </div>
      <div className="flex gap-2"><button disabled={saving} className={btnGold}>Guardar</button><button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 px-2">Cancelar</button></div>
    </form>
  );
}

export default function TareasTable({ trackId, tareas, onChange }) {
  const today = todayISO();
  const ordered = [...tareas].sort((a, b) => TAREA_ORDER.indexOf(a.status) - TAREA_ORDER.indexOf(b.status));
  const cycle = async (t) => { await updateTareaStatus(t.id, TAREA_CYCLE[t.status] || 'aberto'); onChange(); };
  return (
    <div>
      <div className="flex justify-end mb-2"><NewTarea trackId={trackId} onChange={onChange} /></div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="text-[9px] uppercase tracking-wide text-slate-500">
            {['Tarea', 'Estado', 'Responsable', 'Apertura', 'Cierre', 'Origen'].map((h) => <th key={h} className="text-left font-semibold px-2 py-1.5 border-b border-[#273647]">{h}</th>)}
          </tr></thead>
          <tbody>
            {ordered.length ? ordered.map((t) => {
              const venc = t.status !== 'fechado' && isOverdue(t.previsao_entrega, today);
              return (
                <tr key={t.id} className={`border-b border-[#1e2a44] ${t.status === 'fechado' ? 'opacity-60' : ''}`}>
                  <td className="px-2 py-2 text-slate-200">{t.titulo}</td>
                  <td className="px-2 py-2"><button onClick={() => cycle(t)} title="Cambiar estado" className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${EST_CLS[t.status] || ''}`}>{stLabel(t.status)}</button></td>
                  <td className="px-2 py-2 text-slate-300">{t.responsavel || '—'}</td>
                  <td className="px-2 py-2 text-slate-400">{fmtDate(t.data_criacao)}</td>
                  <td className={`px-2 py-2 ${venc ? 'text-rose-300' : 'text-slate-400'}`}>{t.data_fechamento ? fmtDate(t.data_fechamento) : venc ? 'venció' : '—'}</td>
                  <td className="px-2 py-2"><span className="text-[10px] px-2 py-0.5 rounded-full border border-[#273647] text-slate-400">{ORIGEN_LABEL[t.origen] || 'Manual'}</span></td>
                </tr>
              );
            }) : <tr><td colSpan={6} className="text-slate-400 px-2 py-3 text-sm">Sin tareas.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-[10.5px] text-slate-500 mt-2">Clic en el estado para avanzar · Cierre se completa al pasar a Cerrado · el estado no compromete fechas.</p>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

Run: `cd app && npm run build`
Expected: build OK.

- [ ] **Step 3: Commit**

```bash
git add app/src/components/TareasTable.jsx
git commit -m "feat(pmo): vista Lista de tareas (estado/apertura/cierre/origen)"
```

---

### Task 9: Montar o Cockpit v2 (header PMO + toggle + integrar sub-componentes)

Reescrever `TrackCockpit.jsx` para: header com RAG (override), % avanço (override), papéis; toggle Tablero/Lista; e usar `MarcosList`, `RaidList`, `DocsUploader`, `TareasTable`. Passar as novas props do container.

**Files:**
- Modify: `app/src/components/TrackCockpit.jsx`
- Modify: `app/src/components/TrackingView.jsx` (passar `marcos`, `riscos`, `documentos` ao cockpit)

**Interfaces:**
- Consumes: sub-componentes das Tasks 7/8; `pmoLogic` (`ragTrack, avanceTrack, todayISO, countVencidas, countBloqueadas`); `data` (`updateTrack`).
- Produces: cockpit final.

- [ ] **Step 1: Passar novas props no container**

Em `TrackingView.jsx`, no ramo do cockpit (`if (selTrack && ...)`), adicionar props ao `<TrackCockpit>`:

```jsx
marcos={m.marcosByTrack[tr.id] || []}
riscos={m.riscosByTrack[tr.id] || []}
documentos={m.documentosByTrack[tr.id] || []}
```

- [ ] **Step 2: Reescrever o header + stats do cockpit**

Em `TrackCockpit.jsx`, ampliar imports:

```jsx
import { updateTrack } from '../services/data';
import { ragTrack, avanceTrack, todayISO, countVencidas, countBloqueadas } from '../lib/pmoLogic';
import { RagDot, ProgressBar, RAG_COLOR } from './trackingUi';
import MarcosList from './MarcosList';
import RaidList from './RaidList';
import DocsUploader from './DocsUploader';
import TareasTable from './TareasTable';
```

Adicionar assinatura com as novas props: `export default function TrackCockpit({ track, cliente, personas, prereqs, reunioes, deps, tareas, marcos, riscos, documentos, onBack, onChange }) {`

No corpo, calcular:

```jsx
const today = todayISO();
const rag = ragTrack(track, tareas, marcos, today);
const av = avanceTrack(track, tareas);
const vencidas = countVencidas(tareas, today);
const [view, setView] = useState('tablero'); // 'tablero' | 'lista'
```

Substituir o header (o bloco "Cabecera") para incluir `RagDot rag={rag}`, um seletor de override RAG (3 pontos clicáveis + "auto"), a `ProgressBar pct={av.pct}` com override, e os papéis CSM/TPM/Responsable. Override helpers:

```jsx
const setRag = async (val) => { await updateTrack(track.id, { rag_override: val }); onChange(); };
const setAvance = async (val) => { await updateTrack(track.id, { avance: val }); onChange(); };
```

Header JSX (substitui o antigo header + stats):

```jsx
<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
  <div>
    <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
      <RagDot rag={rag} size={14} />{track.ruta_critica && <Flag className="w-4 h-4 text-[#FAA61A]" />}{track.nome}
    </h1>
    <div className="flex flex-wrap gap-2 mt-2 items-center">
      <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-blue-300 bg-blue-500/15 border-blue-500/25">{cliente?.nome?.split('—')[0]?.trim() || cliente?.nome}</span>
      {track.frente && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-[#FAA61A] bg-[#FAA61A]/12 border-[#FAA61A]/25">{track.frente}</span>}
      <Badge v={track.status} />
      {track.waiver_hasta && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold border text-rose-300 bg-rose-500/15 border-rose-500/25">Waiver: {fmtDate(track.waiver_hasta)}</span>}
      <span className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300">TPM: {track.technical_pm || '—'}</span>
      {track.responsavel && <span className="text-[11px] px-2.5 py-1 rounded-full border border-[#273647] text-slate-300">Responsable: {track.responsavel}</span>}
      {/* Override RAG */}
      <span className="flex items-center gap-1 text-[10px] text-slate-500 ml-1">Salud:
        {['verde', 'amarelo', 'rojo'].map((c) => <button key={c} onClick={() => setRag(c)} title={c} className="w-3 h-3 rounded-full" style={{ background: RAG_COLOR[c], outline: track.rag_override === c ? '2px solid #fff4' : 'none' }} />)}
        <button onClick={() => setRag(null)} className={`px-1 rounded ${!track.rag_override ? 'text-[#FAA61A]' : 'hover:text-slate-300'}`}>auto</button>
      </span>
    </div>
  </div>
  <div className="flex gap-2 flex-wrap items-start">
    <div className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2 min-w-[120px]">
      <div className="text-[10px] uppercase tracking-wide text-slate-400 flex justify-between">Avance
        <button onClick={() => { const v = prompt('Avance manual % (vacío = auto)', track.avance ?? ''); if (v !== null) setAvance(v === '' ? null : Number(v)); }} className="text-slate-500 hover:text-[#FAA61A]">✎</button>
      </div>
      <div className="text-[15px] font-bold text-[#FAA61A] mt-0.5">{av.hasData ? `${av.pct}%` : 'sin datos'}</div>
      <div className="mt-1"><ProgressBar pct={av.pct} /></div>
    </div>
    {[['Abiertas', tareas.filter((t) => t.status !== 'fechado').length], ['Bloqueadas', countBloqueadas(tareas)], ['Vencidas', vencidas]].map(([k, v]) => (
      <div key={k} className="bg-[#122131] border border-[#273647] rounded-xl px-3 py-2 min-w-[86px]">
        <div className="text-[10px] uppercase tracking-wide text-slate-400">{k}</div>
        <div className={`text-[15px] font-bold mt-0.5 ${(k !== 'Abiertas') && v ? 'text-rose-300' : 'text-slate-100'}`}>{v}</div>
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Substituir o corpo (tarefas + colunas) pelos novos blocos**

Manter o bloco "Próximo paso" como está. Trocar o grid principal por:

```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
  <div className="lg:col-span-2 space-y-4">
    <div className="bg-[#122131] border border-[#273647] rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tareas</h3>
        <div className="inline-flex border border-[#273647] rounded-lg overflow-hidden text-[10px]">
          <button onClick={() => setView('tablero')} className={`px-2.5 py-1 ${view === 'tablero' ? 'bg-[#1e2a44] text-slate-100' : 'text-slate-400'}`}>▦ Tablero</button>
          <button onClick={() => setView('lista')} className={`px-2.5 py-1 ${view === 'lista' ? 'bg-[#1e2a44] text-slate-100' : 'text-slate-400'}`}>≣ Lista</button>
        </div>
      </div>
      {view === 'lista'
        ? <TareasTable trackId={track.id} tareas={tareas} onChange={onChange} />
        : <TableroKanban tareas={tareas} onChange={onChange} today={today} />}
    </div>
    <MarcosList trackId={track.id} marcos={marcos} onChange={onChange} />
    <RaidList trackId={track.id} riscos={riscos} onChange={onChange} />
  </div>
  <div className="space-y-4">
    <DocsUploader trackId={track.id} docs={documentos} onChange={onChange} />
    {/* Personas / Prerequisitos / Reuniones / Depende de: manter os cards existentes aqui */}
  </div>
</div>
```

- [ ] **Step 4: Extrair o kanban atual para `TableroKanban`**

Mover o kanban existente (as 4 colunas `TAREA_ORDER.map`) para um componente local no mesmo arquivo, marcando vencidas:

```jsx
function TableroKanban({ tareas, onChange, today }) {
  const cycleTask = async (t) => { await updateTareaStatus(t.id, TAREA_CYCLE[t.status] || 'aberto'); onChange(); };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {TAREA_ORDER.map((col) => {
        const list = tareas.filter((t) => t.status === col);
        return (
          <div key={col} className="bg-[#0b1626] border border-[#273647] rounded-xl p-2.5">
            <div className="text-[10.5px] font-bold mb-2 flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full" style={{ background: stDot(col) }} />{stLabel(col)} <span className="text-slate-500">({list.length})</span></div>
            {list.map((t) => {
              const venc = t.status !== 'fechado' && isOverdue(t.previsao_entrega, today);
              return (
                <div key={t.id} className="bg-[#1C2B3C] border border-[#273647] rounded-lg p-2.5 mb-2">
                  <div className="text-[12px] text-slate-200 leading-snug">{t.titulo}</div>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="text-[10px] text-slate-400 truncate">{t.responsavel || '—'}</span>
                    <div className="flex items-center gap-2 flex-none">
                      {t.previsao_entrega && <span className={`text-[10px] ${venc ? 'text-rose-300' : 'text-[#FAA61A]'}`}>{fmtDate(t.previsao_entrega)}</span>}
                      <button onClick={() => cycleTask(t)} title="Cambiar estado" className="w-2.5 h-2.5 rounded-full hover:ring-2 hover:ring-white/20" style={{ background: stDot(t.status) }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
```

Atualizar imports de `TrackCockpit.jsx` para incluir `updateTareaStatus, TAREA_ORDER, TAREA_CYCLE, isOverdue` e remover o `updateTarea`/`TAREA_CYCLE` antigos que não forem mais usados. Mover os cards de **Personas / Prerequisitos / Depende de** exatamente como estão hoje para a coluna lateral, após `<DocsUploader>`. O card de **Reuniones** é substituído pela versão com registro (Step 5).

- [ ] **Step 5: Card de Reuniones com "+ Registrar" (formulário manual)**

Adicionar imports em `TrackCockpit.jsx`: `import { createReuniaoParaTrack } from '../services/data';` e `CalendarClock` de lucide (já importado). Criar componente local e usá-lo na coluna lateral no lugar do card de Reuniones atual:

```jsx
function ReunionesCard({ trackId, reuniones, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ titulo: '', tipo: 'semanal', data: '', participantes: '', ata: '' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); if (!f.titulo.trim()) return; setSaving(true);
    try { await createReuniaoParaTrack(trackId, { titulo: f.titulo.trim(), tipo: f.tipo, data: f.data || null, participantes: f.participantes || null, ata: f.ata || null }); setF({ titulo: '', tipo: 'semanal', data: '', participantes: '', ata: '' }); setOpen(false); onChange(); }
    finally { setSaving(false); }
  };
  return (
    <div className="bg-[#1C2B3C] border border-[#273647] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" />Reuniones</h4>
        {!open && <button onClick={() => setOpen(true)} className={linkGold}><Plus className="w-3.5 h-3.5" /> Registrar</button>}
      </div>
      {open && (
        <form onSubmit={submit} className="space-y-2 mb-3">
          <input className={inputCls} placeholder="Título" value={f.titulo} onChange={set('titulo')} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <select className={inputCls} value={f.tipo} onChange={set('tipo')}><option value="steerco">SteerCo (mensual)</option><option value="semanal">Semanal</option><option value="adhoc">Ad-hoc</option></select>
            <input type="date" className={inputCls} value={f.data} onChange={set('data')} />
          </div>
          <input className={inputCls} placeholder="Participantes" value={f.participantes} onChange={set('participantes')} />
          <textarea className={inputCls} rows={3} placeholder="Acta (decisiones, acuerdos…)" value={f.ata} onChange={set('ata')} />
          <div className="flex gap-2"><button disabled={saving} className={btnGold}>Guardar</button><button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 px-2">Cancelar</button></div>
        </form>
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

Usar na coluna lateral: `<ReunionesCard trackId={track.id} reuniones={reuniones} onChange={onChange} />`. (O elo IA — transcrição→tarefas — fica para o Bloco B; aqui é registro manual, com `ata` livre.)

- [ ] **Step 6: Verificar build + fumaça**

Run: `cd app && npm run build`
Expected: build OK.
Fumaça (`npm run dev`): abrir um track do BROU → header com semáforo/avanço/roles; toggle Tablero/Lista; adicionar marco (vira "próximo"); adicionar risco; registrar reunión (aparece na lista); subir um PDF e reabrir; RAG fica rojo ao criar tarefa bloqueada e volta com override "auto".

- [ ] **Step 7: Commit**

```bash
git add app/src/components/TrackCockpit.jsx app/src/components/TrackingView.jsx
git commit -m "feat(pmo): cockpit v2 (header RAG/avance/roles, toggle tablero/lista, marcos, RAID, docs, reuniones)"
```

---

### Task 10: Verificação final e deploy

- [ ] **Step 1: Build + testes limpos**

Run:

```bash
cd app && npm test && npm run build
```

Expected: testes PASS, build OK.

- [ ] **Step 2: Fumaça completa (dev)**

`cd app && npm run dev`. Percorrer: Portfólio (KPIs En riesgo/Vencidas, semáforos, %, próximo hito) → Detalle (RAG, avance, CSM editable, RAID agregado) → Cockpit (todos os blocos + upload). Conferir que track sem tarefas mostra "sin datos" (não 0% enganoso) e que datas em `dd/mm/aaaa`, UI em ES.

- [ ] **Step 3: Deploy**

Push para `main` (o Vercel publica). Se o modo de segurança bloquear, pedir ao usuário:

```bash
git push origin HEAD:main
```

- [ ] **Step 4: Validar no ar**

Abrir a URL de produção; confirmar Seguimiento carregando dados reais e as telas PMO. Rodar `SUA-URL/api/notion?resource=health` só se aplicável (a app usa Supabase direto; ignorar se não houver função).

---

## Notas de execução

- **Ordem obrigatória:** Task 1 (migrações) **antes** de qualquer task que grave/leia os novos campos, senão as queries falham. Tasks 2–4 são base; 5–9 são as telas; 10 fecha.
- **Se `gerente` já é o CSM** (decisão no Task 1/Step 1): não criar `projetos.csm`; nas Tasks 5/6, ler `proj.gerente` e rotular "CSM" (o código já faz fallback `proj.csm || proj.gerente`).
- **DRY/YAGNI:** RAID e Documentos ficam por track no cockpit; no projeto, RAID é só leitura agregada. Nada de IA aqui (Bloco B).
