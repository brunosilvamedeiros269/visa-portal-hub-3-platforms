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
2. Usuário preenche metadados (tipo, data, participantes), **cola a transcrição** e **escolhe o motor**.
3. **Procesar** → chama `/api/procesar-minuta` → IA devolve JSON estruturado.
4. Abre **painel de revisão editável**: resumen, decisiones, action items (título/responsable/prazo + incluir), riscos (descrição/tipo/severidade/dueño + incluir).
5. **Guardar** → grava a reunión e, dos itens marcados, cria tareas e riscos. Nada é gravado sem confirmação.

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
    "riesgos": [{ "descricao": "…", "tipo": "riesgo|issue", "severidade": "alta|media|baja", "dueno": "…|null" }]
  }
  ```
- Chama o provedor conforme `engine`:
  - **Gemini:** `POST generativelanguage.googleapis.com/v1beta/models/<model>:generateContent?key=GEMINI_API_KEY`, `response_mime_type: application/json`.
  - **xAI:** `POST api.x.ai/v1/chat/completions` (OpenAI-compat), `Authorization: Bearer XAI_API_KEY`.
  - **Claude:** `POST api.anthropic.com/v1/messages`, headers `x-api-key: ANTHROPIC_API_KEY`, `anthropic-version`.
- **Parser tolerante:** extrai o bloco JSON da resposta; se falhar, retorna erro `{ error, raw }` (a UI mostra e permite reprocessar).
- Responde `{ engine, model, resumen, decisiones, action_items, riesgos }`.

### `GET /api/engines`
- Retorna `[{ id, label, model, available }]` — `available` = a env var da chave existe. A UI só oferece os `available`.

## 5. Chaves e segurança

- Env vars **só no Vercel, server-side, sem `VITE_`:** `GEMINI_API_KEY` (agora), `XAI_API_KEY`, `ANTHROPIC_API_KEY` (depois). Opcionais: `GEMINI_MODEL`, `XAI_MODEL`, `CLAUDE_MODEL`.
- **Configuração é do usuário** (o assistente não tem acesso ao painel Vercel).
- O endpoint **nunca** retorna chaves; **não grava no banco** (só extrai) — a gravação é no cliente via Supabase **após revisão**. Cap de tamanho no texto. CORS/же mesma origem (Vercel).

## 6. Frontend

- **`app/src/services/ai.js`** — `enginesDisponibles()` (GET /api/engines) e `procesarMinuta(engine, texto, ctx)` (POST).
- **`app/src/components/ReunionProcesar.jsx`** (novo) — a seção "Procesar con IA": textarea, seletor de motor (só disponíveis), botão Procesar (loading/erro), e o **painel de revisão editável** dos 4 blocos com checkboxes de inclusão.
- **`ReunionesCard`** (em `TrackCockpit.jsx`) — passa a usar `ReunionProcesar` no fluxo de registro; ao **Guardar**, orquestra a gravação (§7).
- Idioma **espanhol**; design Visa; loading/erro visíveis; nada bloqueante.

## 7. Gravação (após revisão)

- **Reunión:** `createReuniaoParaTrack(trackId, { titulo, tipo, data, participantes, ata, resumo_ia, decisoes })`
  - `ata` = transcrição colada; `resumo_ia` = resumen; `decisoes` = decisiones (texto/JSON); `participantes` = **array** (corrigir: hoje o form manda texto; passar a `array` separando por vírgula).
- **Action items marcados → `createTarea`** por item: `{ track_id, titulo, responsavel, previsao_entrega: prazo, status:'aberto', origen:'reunion' }`.
- **Riscos marcados → `createRisco`** por item: `{ track_id, descricao, tipo, severidade, dueno }`.
- Tudo ligado ao track; a reunión some no card Reuniones e as tarefas/riscos aparecem nos respectivos blocos.

## 8. Modelo de dados

**Nenhuma tabela nova.** `reunioes` já tem `ata, resumo_ia, decisoes, riscos, participantes(array)`. `tareas`/`riscos` prontos (Bloco A). Sem migração — apenas o ajuste de tipo de `participantes` no cliente.

## 9. Fora de escopo

- Rodar os 3 motores em paralelo e comparar (escolha por documento foi a decisão).
- Login/Auth e RLS restritivo.
- Transcrição de áudio (entra texto já transcrito).

## 10. Testes / verificação

- `cd app && npm run build` passa.
- `GET /api/engines` retorna Gemini `available:true` (com `GEMINI_API_KEY` setada) e xai/claude `available:false` sem chave.
- Lógica pura testável (Vitest): o **parser de JSON tolerante** (extrair JSON de resposta com/sem cerca de código, com texto ao redor) e o **builder do prompt**.
- Fumaça: colar uma ata real → Procesar (Gemini) → revisar → Guardar → conferir reunión com resumen/decisiones + tareas (origen=reunión) + riscos no track.
- Erros tratados: sem chave, texto vazio, texto grande demais, JSON inválido do modelo, timeout do provedor.
- Não fabricar: itens só viram tarefa/risco se marcados na revisão.
