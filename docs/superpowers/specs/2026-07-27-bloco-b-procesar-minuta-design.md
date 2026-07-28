# Bloco B — Procesar minuta con IA (multi-motor)

**Data:** 2026-07-27
**Status:** Design aprovado (aguardando revisão do spec)
**Escopo:** Registrar reunião e **processar a transcrição/ata com IA**, extraindo resumen, decisiones, action items (→ tareas) e riscos (→ RAID), com **motor de IA selecionável**. Fonte da verdade: Supabase. Segue [[2026-07-27-camada-pmo-design]] (Bloco A).

## 1. Objetivo e dor

O "ativo" da base são as reuniões (SteerCo mensal / semanal / ad-hoc). Hoje o registro é manual. Este bloco permite **colar a transcrição, escolher o motor de IA e extrair** automaticamente os três blocos do padrão PMO — Decisões, Action Items (responsável+prazo) e Riscos — mais um resumen, com **revisão humana antes de gravar**. Reduz carga cognitiva e transforma reunião em tarefas/riscos ligados ao track.

## 2. Motores (multi-motor, seletável)

- Arquitetura suporta **gemini · xai · claude** (adapters no endpoint). **Só aparecem na UI os motores com chave configurada.**
- **Ativo agora:** **Gemini** (free tier). xAI e Claude ficam prontos no código, **desativados** — habilitar depois = adicionar a env var da chave.
- **Modelos padrão** (configuráveis por env `*_MODEL`):
  - Gemini: `gemini-2.5-flash` (free tier; confirmar limites atuais)
  - Claude: `claude-sonnet-5` (quando habilitado, pago)
  - xAI: `grok-4` (quando habilitado, pago)

## 3. Fluxo (colar → processar → revisar → salvar)

1. No card **Reuniones** do track → **Registrar** ganha a seção **"Procesar con IA"**.
2. Usuário indica **tipo** (mensal/semanal/ad-hoc) e data, e fornece a transcrição por **uma de três vias**: **subir .docx**, **subir PDF de texto**, ou **colar texto**. Escolhe o **motor**.
3. **Procesar** → (se arquivo) extrai o texto **no navegador** → chama `/api/procesar-minuta` → IA devolve JSON estruturado (inclui **participantes**).
4. Abre **painel de revisão editável**: resumen, decisiones, action items (título/responsable/prazo + incluir), riscos (descrição/tipo/severidade/dueño + incluir), e **participantes** (nome + email, com email pré-preenchido do diretório `contactos` quando o nome bate; nomes novos marcáveis para entrar no diretório).
5. **Guardar** → grava a reunión e, dos itens marcados, cria tareas e riscos; faz **upsert** dos participantes novos/atualizados em `contactos`. Nada é gravado sem confirmação.

### Entrada de arquivo (extração no cliente)
- **.docx** → `mammoth` (docx→texto). **PDF de texto** → `pdfjs-dist` (extrai text content das páginas). **Colar** → direto.
- Ressalvas: **PDF escaneado/imagem** (sem texto) não é suportado (precisaria OCR) — avisar o usuário; **.doc legado** não suportado (pedir .docx/PDF). Cap de tamanho aplicado ao texto extraído.

## 4. Endpoint serverless (Vercel)

O `vercel.json` já exclui `/api/` do rewrite SPA (`/((?!api/).*)`). Funções em `/api/*.js` (Node, `fetch` nativo, sem SDK).

### `POST /api/procesar-minuta`
- Body: `{ engine, texto, contexto?: { track?, cliente? } }`.
- Valida: `engine` conhecido e com chave; `texto` não vazio; **limite de tamanho** (ex.: 60k chars) → erro claro se exceder.
- Monta **prompt único de extração** exigindo **JSON estrito** (sem markdown):
  ```json
  {
    "resumen": "…",
    "decisiones": ["…"],
    "action_items": [{ "titulo": "…", "responsable": "…", "prazo": "YYYY-MM-DD|null" }],
    "riesgos": [{ "descricao": "…", "tipo": "riesgo|issue", "severidade": "alta|media|baja", "dueno": "…|null" }],
    "participantes": [{ "nombre": "…", "email": "…|null", "organizacion": "…|null" }]
  }
  ```
- Chama o provedor conforme `engine`:
  - **Gemini:** `POST generativelanguage.googleapis.com/v1beta/models/<model>:generateContent?key=GEMINI_API_KEY`, `response_mime_type: application/json`.
  - **xAI:** `POST api.x.ai/v1/chat/completions` (OpenAI-compat), `Authorization: Bearer XAI_API_KEY`.
  - **Claude:** `POST api.anthropic.com/v1/messages`, headers `x-api-key: ANTHROPIC_API_KEY`, `anthropic-version`.
- **Parser tolerante:** extrai o bloco JSON da resposta; se falhar, retorna erro `{ error, raw }` (a UI mostra e permite reprocessar).
- Responde `{ engine, model, resumen, decisiones, action_items, riesgos, participantes }`.

### `GET /api/engines`
- Retorna `[{ id, label, model, available }]` — `available` = a env var da chave existe. A UI só oferece os `available`.

## 5. Chaves e segurança

- Env vars **só no Vercel, server-side, sem `VITE_`:** `GEMINI_API_KEY` (agora), `XAI_API_KEY`, `ANTHROPIC_API_KEY` (depois). Opcionais: `GEMINI_MODEL`, `XAI_MODEL`, `CLAUDE_MODEL`.
- **Configuração é do usuário** (o assistente não tem acesso ao painel Vercel).
- O endpoint **nunca** retorna chaves; **não grava no banco** (só extrai) — a gravação é no cliente via Supabase **após revisão**. Cap de tamanho no texto. CORS/же mesma origem (Vercel).

## 6. Frontend

- **`app/src/lib/extractText.js`** (novo, puro) — `extractText(file) -> Promise<string>`: `.docx`→`mammoth`, `application/pdf`→`pdfjs-dist`, senão erro claro. Deps novas: `mammoth`, `pdfjs-dist`.
- **`app/src/services/ai.js`** — `enginesDisponibles()` (GET /api/engines) e `procesarMinuta(engine, texto, ctx)` (POST).
- **`app/src/components/ReunionProcesar.jsx`** (novo) — a seção "Procesar con IA": entrada por **subir arquivo (.docx/PDF) ou colar texto**, seletor de motor (só disponíveis), botão Procesar (loading/erro), e o **painel de revisão editável** dos 5 blocos (resumen, decisiones, action items, riscos, **participantes**) com checkboxes de inclusão. Participantes casam com `contactos` por nome (email pré-preenchido); novos são marcáveis.
- **`ReunionesCard`** (em `TrackCockpit.jsx`) — passa a usar `ReunionProcesar` no fluxo de registro; ao **Guardar**, orquestra a gravação (§7).
- Idioma **espanhol**; design Visa; loading/erro visíveis; nada bloqueante.

## 7. Gravação (após revisão)

- **Contactos (diretório):** para cada participante revisado, `upsertContacto({ nombre, email, organizacion })` — casa por `nombre` (case-insensitive); se existe e havia email vazio, atualiza; se novo, insere. Guarda o `id` para referência.
- **Reunión:** `createReuniaoParaTrack(trackId, { titulo, tipo, data, participantes, ata, resumo_ia, decisoes })`
  - `ata` = texto da transcrição (colado ou extraído do arquivo); `resumo_ia` = resumen; `decisoes` = decisiones (texto/JSON); `participantes` = **array jsonb** de `{ nombre, email }` (corrigir: hoje o form manda texto — passar a array).
- **Action items marcados → `createTarea`** por item: `{ track_id, titulo, responsavel, previsao_entrega: prazo, status:'aberto', origen:'reunion' }`.
- **Riscos marcados → `createRisco`** por item: `{ track_id, descricao, tipo, severidade, dueno }`.
- Tudo ligado ao track; a reunión aparece no card Reuniones e as tarefas/riscos nos respectivos blocos.

## 8. Modelo de dados

**Uma tabela nova: `contactos`** (diretório global de pessoas). Migração `db/2026-07-27-bloco-b.sql`:

```sql
create table if not exists contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  organizacion text,
  created_at timestamptz not null default now()
);
-- match por nome case-insensitive (evita duplicar "Bruno" vs "bruno")
create unique index if not exists contactos_nombre_uidx on contactos (lower(nombre));
alter table contactos enable row level security;
do $$ begin
  create policy anon_all_contactos on contactos for all using (true) with check (true);
exception when duplicate_object then null; end $$;
```

`reunioes` já tem `ata, resumo_ia, decisoes, riscos, participantes(array)`. `tareas`/`riscos` prontos (Bloco A). O único ajuste extra é o tipo de `participantes` gravado pelo cliente (array de `{nombre,email}`).

## 9. Fora de escopo

- Rodar os 3 motores em paralelo e comparar (escolha por documento foi a decisão).
- Login/Auth e RLS restritivo.
- Transcrição de áudio (entra texto já transcrito).

## 10. Testes / verificação

- `cd app && npm run build` passa.
- `GET /api/engines` retorna Gemini `available:true` (com `GEMINI_API_KEY` setada) e xai/claude `available:false` sem chave.
- Lógica pura testável (Vitest): o **parser de JSON tolerante** (extrair JSON de resposta com/sem cerca de código, com texto ao redor), o **builder do prompt**, e o **match de contactos por nome** (case-insensitive, preenche email, detecta novos).
- Migração `contactos` aplicada (índice único `lower(nombre)`, RLS aberto).
- Fumaça: **subir um .docx e um PDF de texto** (e colar) → Procesar (Gemini) → revisar (incl. participantes casados com o diretório) → Guardar → conferir reunión (resumen/decisiones/participantes) + tareas (origen=reunión) + riscos no track + novos `contactos` inseridos.
- Erros tratados: sem chave, texto vazio, texto grande demais, JSON inválido do modelo, timeout do provedor, **PDF sem texto (escaneado) / formato não suportado**.
- Não fabricar: itens só viram tarefa/risco se marcados na revisão.
