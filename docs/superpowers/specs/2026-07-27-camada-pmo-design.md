# Camada PMO — visualização + configuração (Bloco A)

**Data:** 2026-07-27
**Status:** Design aprovado (aguardando revisão do spec)
**Escopo:** Reformar as 3 telas do app (Portfólio, Detalhe do projeto, Cockpit do track) para o padrão PMO, e habilitar a configuração desses elementos por cliente/projeto/track. Fonte da verdade: **Supabase**.

> Bloco B (registrar reunião + **processar minuta com IA** via Claude API) é o **próximo ciclo**, com seu próprio spec. Aqui só preparamos o elo (`tareas.origen = reunión` e o formulário manual de reunião já existente).

---

## 1. Objetivo e dor

O painel é, ao mesmo tempo, **cockpit de gestão**, **vitrine para liderança/time**, **base de prep de reunião** e **ferramenta de cadastro**. Hoje ele lista clientes→projetos→tracks e tem um tablero de tarefas, mas **não** mostra saúde (RAG), avanço, marcos, riscos nem papéis de forma visível — o gerente não consegue, de relance, saber o que está em risco, atrasado ou bloqueado. Este bloco fecha essa lacuna, sem fabricar dados (regra do projeto: derivar de status reais).

## 2. Telas

### 2.1 Portfólio (tela principal) — layout "linhas" (Direção A aprovada)
- **Faixa de KPIs (6):** Clientes · Proyectos · Tracks · **En riesgo** · **Bloqueadas** · **Vencidas**. Os três últimos derivados (ver §4).
- **Agrupado por cliente** (como hoje). Por **projeto**, uma linha densa com:
  - Semáforo **RAG** (verde/amarelo/rojo).
  - **% avanço** (barra + número).
  - **Próximo marco** com dias restantes / atraso.
  - **CSM** e contadores (`n riesgos`, `n tareas abiertas`, bloqueios).
- Clique na linha → Detalhe do projeto. Ações de cadastro (Nuevo cliente/proyecto) preservadas.

### 2.2 Detalhe do projeto (intermediária)
- **Cabeçalho PMO:** RAG (com override), **% avanço agregado** (média dos tracks), **CSM editável**, status, próximo marco do projeto (o marco vigente mais próximo entre os tracks).
- **KPIs do projeto:** Tracks · En curso · Bloqueados · Vencidas.
- **RAID agregado:** riscos/issues do projeto **+** dos seus tracks, num só bloco (só leitura aqui; edição no cockpit ou no nível projeto).
- **Lista de tracks** já com semáforo RAG + % avanço. Cadastro de track preservado.

### 2.3 Cockpit do track — v2 (aprovado)
- **Cabeçalho:** RAG (pill + `✎ override`), barra de **% avanço** (`✎ override`), papéis **CSM / TPM (editável) / Responsable**, pills de contexto (frente, ruta crítica, waiver). Stats: Abiertas · Bloqueadas · **Vencidas**.
- **Próximo paso** destacado (editável) — como hoje.
- **Tareas** com toggle **▦ Tablero / ≣ Lista**:
  - *Tablero:* kanban por estado (aberto, em_andamento, bloqueada, fechado) — mantém o atual, marcando **vencidas**.
  - *Lista:* tabela com colunas **Tarea · Estado · Responsable · Apertura · Cierre · Origen**.
  - Nova tarefa com campos: título, responsable, previsão, **origen**.
- **Marcos / Hitos:** lista ordenada, **próximo em destaque** (dias/atraso), concluídos riscados. `+ Nuevo marco`.
- **Riesgos & Issues (RAID):** lista com barra de severidade, tipo, dono, status. `+ Nuevo`.
- **Documentos:** card com **upload** (Supabase Storage), listando arquivo · data · quem subiu.
- **Personas · Prerequisitos · Reuniones · Dependencias:** como hoje (Reuniones ganha `+ Registrar`, formulário manual).
- **Configuração inline:** cada `✎` edita o campo no lugar; cada `+` abre um mini-form colapsável (padrão `Collapsible` já existente).

## 3. Modelo de dados (Supabase)

**Novas tabelas**

```
marcos
  id · track_id (fk) · nome · fecha (date) · concluido (bool, default false) · orden (int)

riscos
  id · projeto_id (fk, nullable) · track_id (fk, nullable)   -- exatamente um preenchido
     · descricao · tipo ('riesgo'|'issue') · severidade ('alta'|'media'|'baja')
     · dueno · status ('abierto'|'en_mitigacion'|'cerrado') · mitigacion (text, nullable)
```

**Alterações em tabelas existentes**

```
tareas    + data_fechamento (date, nullable)   -- setado automaticamente ao virar 'fechado'
          + origen (text: 'reunion'|'prerequisito'|'riesgo'|'manual', default 'manual')
          (já existem: status, responsavel, previsao_entrega, data_criacao[=apertura])

tracks    + rag_override (text: 'verde'|'amarelo'|'rojo', nullable)
          (avance já existe → passa a ser o override manual do % derivado)

projetos  + csm (text, nullable)
          + rag_override (text, nullable)
          NOTA: verificar se 'gerente' já cumpre o papel de CSM. Se sim, reutilizar
          'gerente' e apenas rotular como "CSM" na UI, sem criar coluna nova.
```

**Documentos + Storage**

- Tabela `documentos` já existe no schema; garantir colunas `track_id (fk)`, `nome`, `url/path`, `subido_por`, `created_at` (adicionar as que faltarem).
- Criar bucket **privado** no Supabase Storage (ex.: `track-docs`). Upload via `supabase.storage`; a leitura usa URL assinada. RLS/políticas de storage abertas ao anon por ora (coerente com o resto — Auth fica para depois).

## 4. Lógica (derivada, sem fabricar)

- **% avanço (track):** se `avance` (override) preenchido → usa ele; senão `round(tareas fechadas / total * 100)`; sem tarefas → 0 e rótulo "sin datos".
- **% avanço (projeto):** média simples dos % dos tracks.
- **RAG (auto), por track:**
  - **Rojo** = existe tarefa `bloqueada` **ou** algum marco não concluído com `fecha < hoje`.
  - **Amarelo** = `waiver_hasta` dentro de ≤ **7 dias** (constante configurável) **ou** tarefa/marco vencendo em ≤ 7 dias, sem estar já rojo.
  - **Verde** = caso contrário.
  - `rag_override` (quando setado) **vence** a regra.
- **RAG (projeto):** pior RAG entre seus tracks; `projetos.rag_override` vence.
- **KPIs derivados:** *Vencidas* = tarefas não fechadas com `previsao_entrega < hoje`; *Bloqueadas* = tarefas `bloqueada`; *En riesgo* = projetos com RAG amarelo/rojo.
- Toda comparação de data usa "hoje" no fuso local, formato ISO `YYYY-MM-DD`.

## 5. Arquivos afetados (front)

- `app/src/services/data.js` — novos fetchers/mutations: `createMarco/updateMarco/deleteMarco`, `createRisco/updateRisco`, upload/list de documentos, update de `projetos.csm`, `tracks.rag_override`, `tareas.origen/data_fechamento`. Incluir `marcos` e `riscos` no `fetchAll` (e `documentos`).
- `app/src/components/trackingUi.jsx` — helpers de RAG (`ragOf`, `RagDot`), `%` (`avanceOf`), `ORIGEN`/severidade labels, `daysTo(fecha)`.
- `app/src/components/TrackingView.jsx` — portfólio "linhas" + detalhe do projeto PMO.
- `app/src/components/TrackCockpit.jsx` — cabeçalho PMO, toggle Tablero/Lista, Marcos, RAID, Documentos, edição inline.
- Possível extração: `RaidList.jsx`, `MarcosList.jsx`, `DocsUploader.jsx`, `TareasTable.jsx` para manter os arquivos focados (o cockpit já é grande).

## 6. Idioma e design

- **UI 100% espanhol** (rótulos, botões, mensagens, datas `dd/mm/aaaa`). Valores de status vêm do banco (PT) e são exibidos em ES via mapas existentes (`stLabel`).
- **Design Visa:** navy `#0A142F`/`#051424`, superfície `#122131`/`#1C2B3C`, borda `#273647`, dourado `#FAA61A`. `rounded-xl`. RAG: verde `#34d399`, amarelo `#fbbf24`, rojo `#fb7185`.

## 7. Fora de escopo (Bloco B)

- Processar minuta/transcrição com **IA** (Claude API + endpoint serverless `api/`, `ANTHROPIC_API_KEY` só no servidor).
- Login/Auth e RLS restritivo.

## 8. Testes / verificação

- `cd app && npm run build` passa.
- Migrações SQL aplicadas no Supabase (marcos, riscos, colunas novas, bucket).
- Fumaça manual: RAG muda ao bloquear tarefa / vencer marco; override sobrepõe; % bate com fechadas/total; upload de documento aparece na lista; nova tarefa com origen; KPIs (Vencidas/En riesgo) batem com os dados reais de BROU/Corrientes.
- Não fabricar números: track sem tarefas mostra "sin datos", não 0% enganoso.
