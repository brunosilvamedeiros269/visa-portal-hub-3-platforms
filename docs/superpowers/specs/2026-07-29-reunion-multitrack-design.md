# Bloco C — Reunión multi-track (ingestão no nível do proyecto)

**Data:** 2026-07-29
**Status:** Design aprovado (aguardando revisão do spec)
**Escopo:** Permitir que **uma** reunião cubra **várias tracks** de um proyecto — subir a transcrição uma vez e distribuir os action items e riscos entre as tracks certas (ou o proyecto). Estende o [[2026-07-27-bloco-b-procesar-minuta-design]].

## 1. Objetivo e dor

As reuniões reais não respeitam a fronteira das tracks. A semanal do Banco de Corrientes de 29/07 cobriu Click to Pay **e** Apple Pay; o BROU tem 8 tracks e uma weekly costuma tocar várias. Hoje o `ReunionProcesar` recebe **um** `trackId`, o prompt não sabe que existem outras tracks, e toda tarea/risco nasce presa àquela track. O resultado prático é que o gerente precisa escolher arbitrariamente uma track para "pendurar" a reunião, e depois mover os itens à mão — ou não registrar nada.

Este bloco move o ponto de registro para o **nível do proyecto** e faz a IA **propor o destino de cada item**, com correção humana antes de gravar.

## 2. Decisões de desenho

| Decisão | Escolha | Por quê |
|---|---|---|
| Ponto de entrada | Tela do **proyecto** | A semanal é do proyecto, não de uma track. Um fluxo só, em vez de dois. |
| Roteamento dos itens | **IA sugere, humano corrige** | A transcrição real do BROU tem itens genuinamente ambíguos (o DEF de configuraciones productivas, a sessão de scoping). Nem automação cega nem classificação 100% manual. |
| Itens transversais | Podem ter destino **Proyecto** | Riscos já suportam (`riscos.projeto_id`). Tareas passam a suportar — é a maior parte do trabalho deste bloco. |
| Tracks ligadas à reunião | As que o usuário confirmar no painel de revisão | Pré-marcadas com as que receberam item; editável, para registrar "o tema foi discutido e nada avançou". |
| Registro dentro da track | Vira **read-only** | Uma reunião de uma track só se registra pelo proyecto marcando uma track. Menos código. |

## 3. Modelo de dados

Migração `db/2026-07-29-reunion-multitrack.sql`, idempotente como as anteriores.

**`reunioes` não muda** — já tem `cliente_id` e `projeto_id` (verificado no banco em 29/07). **`reunion_tracks` não muda** — já é N:N e é o que sustenta a reunião multi-track. **`riscos` não muda** — já aceita `projeto_id` **ou** `track_id` com check de exclusividade.

A única mudança é em `tareas`, que hoje é só por track:

```sql
-- tareas: passa a aceitar alvo track OU proyecto
alter table tareas alter column track_id drop not null;
alter table tareas add column if not exists projeto_id uuid references projetos(id) on delete cascade;
create index if not exists tareas_projeto_idx on tareas(projeto_id);

-- exatamente um dos dois (mesmo padrão do check de `riscos`)
do $$ begin
  alter table tareas add constraint tareas_scope_chk
    check ((projeto_id is null) <> (track_id is null));
exception when duplicate_object then null; end $$;
```

As linhas existentes têm `track_id` preenchido e `projeto_id` nulo, então satisfazem o check — a constraint entra válida, sem `not valid`.

## 4. Fluxo

1. Na tela do proyecto, card **Reuniones del proyecto** → **Registrar**.
2. **Entrada:** título, tipo (SteerCo/semanal/ad-hoc), data, motor de IA. Sobe `.docx`/PDF ou cola o texto. **Não há seleção prévia de tracks** — o que evita 8 checkboxes marcados no BROU para uma reunião de uma track.
3. **Procesar:** o prompt recebe **todas** as tracks do proyecto como contexto (nome + frente + `proximo_paso`, que descreve o que cada track está fazendo agora) e devolve cada **action item** e cada **risco** com um campo `track`.
4. **Revisão:**
   - Cada action item e cada risco tem um `<select>` **Destino**: `Proyecto` + uma opção por track do proyecto, pré-selecionado com a sugestão da IA.
   - Linha de conferência do rateio: `4 → Tokenización TD · 2 → Click to Pay · 3 → Proyecto`.
   - Bloco **Tracks de esta reunión**: checkboxes pré-marcados com as tracks que receberam ao menos um item, editáveis.
   - `resumen`, `decisiones` e `participantes` seguem no nível da reunião, sem roteamento — pertencem à reunião, não a uma track.
5. **Guardar:** nada é gravado antes disso (princípio herdado do Bloco B).

## 5. Endpoint e prompt

`POST /api/procesar-minuta` ganha `contexto.tracks`:

```js
{ engine, texto, contexto: { cliente, proyecto, tracks: [{ nombre, frente, proximo_paso }] } }
```

`buildPrompt` lista as tracks e exige o campo `track` em cada item:

```json
{
  "resumen": "…",
  "decisiones": ["…"],
  "action_items": [{ "titulo": "…", "responsable": "…|null", "prazo": "YYYY-MM-DD|null", "track": "<nombre exacto de una track>|proyecto" }],
  "riesgos":     [{ "descricao": "…", "tipo": "riesgo|issue", "severidade": "alta|media|baja", "dueno": "…|null", "track": "<nombre exacto de una track>|proyecto" }],
  "participantes": [{ "nombre": "…", "email": "…|null", "organizacion": "…|null" }]
}
```

A instrução é explícita: usar `"proyecto"` quando o item for transversal ou a track não estiver clara — **não** chutar uma track.

O `parseModelJson` preserva `track` como string; a validação e o mapeamento para IDs acontecem no cliente.

## 6. Roteamento (lógica pura)

`app/src/lib/minutaRouting.js`, sem rede e sem React, testável:

- `matchTrack(nombre, tracks)` — casa por comparação normalizada (minúsculas, sem acentos, espaços colapsados). Se não casar, retorna `null`.
- `destinoDe(item, tracks)` — `{ track_id }` se casou; `{ projeto_id }` se o modelo disse `"proyecto"`, se veio nulo/vazio, **ou se não casou nada**. Nunca escolhe uma track por aproximação: item ambíguo cai no proyecto e fica visível no dropdown para o humano corrigir.
- `resumenRateo(items, tracks)` — contagem por destino, para a linha de conferência.
- `tracksConItems(items)` — IDs das tracks que receberam ao menos um item, para pré-marcar os checkboxes.

Nomes de track se repetem entre clientes — BROU e Corrientes têm, cada um, uma track `Click to Pay`, e ambos têm `Apple Pay`. O casamento é sempre **dentro do proyecto** aberto, então não há ambiguidade entre clientes.

## 7. Gravação

Ordem, toda no cliente após a revisão (mesmo padrão do Bloco B):

1. **Contactos:** upsert dos participantes marcados (comportamento atual, inalterado).
2. **Reunión:** insert em `reunioes` com `cliente_id`, `projeto_id`, `tipo`, `data`, `titulo`, `ata` (transcrição), `resumo_ia`, `decisoes`, `participantes` (jsonb).
3. **`reunion_tracks`:** um insert por track confirmada no painel.
4. **Tareas:** para cada action item marcado, `createTarea({ ...destino, titulo, responsavel, previsao_entrega, status: 'aberto', origen: 'reunion' })` — onde `destino` é `{ track_id }` ou `{ projeto_id }`.
5. **Riscos:** idem com `createRisco`, `status: 'abierto'`.

Não há transação (Supabase REST via cliente anon). Falha no meio deixa registros parciais; o erro é exibido e o painel de revisão continua aberto, permitindo reenviar. Aceitável para uma equipe pequena com RLS aberta — evitar duplicata em reenvio é problema conhecido e **fora de escopo** aqui.

## 8. Frontend

| Arquivo | Mudança |
|---|---|
| `api/minutaLib.js` | `buildPrompt` recebe `contexto.tracks[]` e pede `track` por item; `parseModelJson` preserva o campo |
| `app/src/lib/minutaRouting.js` | **novo, puro** — casamento, destino, rateio, tracks com itens |
| `app/src/components/ReunionProcesar.jsx` | props `{ proyecto, cliente, tracks, onDone }`; fica com entrada + orquestração da gravação |
| `app/src/components/ReunionRevision.jsx` | **novo** — o painel de revisão (o `ReunionProcesar` já tem 220 linhas e dobraria) |
| `app/src/components/TareasTable.jsx` | prop `trackId` → `scope` (`{ track_id }` ou `{ projeto_id }`), repassada ao `createTarea` |
| `app/src/components/TrackingView.jsx` | detalhe do proyecto ganha os cards **Reuniones del proyecto** e **Tareas del proyecto**; mapas `reunioesByProjeto` e `tareasByProjeto` |
| `app/src/components/TrackCockpit.jsx` | `ReunionesCard` perde o botão Registrar e vira lista read-only |
| `app/src/services/data.js` | `createReunionMultiTrack(row, trackIds)`; `createTarea` aceita `projeto_id` |

Idioma espanhol na UI, design Visa (navy + dourado), loading/erro visíveis.

## 9. Fora de escopo

- Rotear `decisiones` por track (são da reunião; roteá-las não dá uso a ninguém hoje).
- Mover uma tarea/risco de destino depois de gravada — é edição de tarea, outro bloco.
- Reunião abrangendo tracks de proyectos diferentes.
- Idempotência/deduplicação em reenvio após falha parcial.
- Override de avance no nível do proyecto (surgiu na weekly BROU de 29/07: o "56%" reportado é do programa e não tem onde morar; `projetos` não tem coluna de avance). Registrado aqui como pendência conhecida.

## 10. Testes / verificação

Unitários (Vitest, lógica pura):

- `buildPrompt` inclui a lista de tracks e a instrução de usar `"proyecto"` quando ambíguo.
- `parseModelJson` preserva `track` em `action_items` e `riesgos`; item sem `track` não quebra o parse.
- `matchTrack`: casa com variação de caixa, acento e espaço extra; não casa com nome de track de outro proyecto.
- `destinoDe`: `"proyecto"` → `{ projeto_id }`; nome desconhecido → `{ projeto_id }` (nunca track por aproximação); nome válido → `{ track_id }`.
- `resumenRateo` e `tracksConItems` com lista vazia e com itens repetidos na mesma track.

Build e fumaça:

- `cd app && npm run build` passa.
- Migração aplicada; `insert into tareas` com os dois alvos nulos falha, e com os dois preenchidos falha (o check funciona).
- Fumaça com a transcrição real da semanal do **Banco de Corrientes** de 29/07 (Click to Pay + Apple Pay): processar no proyecto, conferir que o rateio propõe itens nas duas tracks, corrigir ao menos um destino à mão, gravar, e verificar que a reunión aparece no card das duas tracks e que as tareas caíram nas tracks certas.
- Fumaça de regressão com a transcrição da weekly **BROU** de 29/07 (uma track só): o rateio deve concentrar em Tokenización Tarjeta Débito e mandar ao proyecto os itens transversais (DEF de configuraciones productivas, certificados de producción).
- Nada é gravado sem confirmação; itens desmarcados não viram tarea nem risco.
