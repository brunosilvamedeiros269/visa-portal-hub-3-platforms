# Visa — Base de Conhecimento Ativa

> Instruções mestras do projeto. Este arquivo é o **ponto único de contexto** para
> qualquer pessoa (ou IA) que trabalhe no repositório. Leia-o antes de tudo.

## 1. O que é este projeto

Um **dashboard web compartilhado pela equipe** que serve a dois propósitos ligados:

1. **Acompanhar projetos** de implementação de carteiras digitais Visa junto a clientes
   (bancos/fintechs), na hierarquia **Cliente → Macro-projeto → Micro-projeto (track) → atividades**.
2. **Consultar conhecimento** do mundo Visa em segundos: conceitos, siglas, processos,
   produtos (Apple Pay, Google Pay, Garmin Pay, VTS…), mandatos e dicionário de dados.

Usuário-alvo: **Gerente de Projetos Visa** (Client Onboarding & Implementation) e a equipe,
que acessam por URL para ver andamento e status de cada projeto de cada cliente. A dor
central é **carga cognitiva** — informação fragmentada em reuniões, PDFs, PPTX e e-mails.
A solução é um **Single Source of Truth** consultável e alimentável por IA.

## 2. Arquitetura — decisão vigente

**Regra de ouro: Notion é a fonte da verdade; o app é uma vitrine read-only. Nada de
sistemas paralelos.** O projeto herdou de uma IA anterior a ambição de 5 sistemas
(OpenProject, BookStack, Supabase, app React, markdown). A decisão final:

| Camada | Ferramenta | Papel |
|---|---|---|
| Base interna / fonte da verdade | **Notion** (teamspace VISA) | Time **edita** aqui: projetos, tracks, atividades, reuniões, wiki, dicionário |
| Vitrine / dashboard | **App React + Vite** (`app/`) no **Vercel** | **Read-only** para os gerentes; lê o Notion e mostra o status com a cara da Visa |
| Ponte de leitura | **Vercel serverless** `api/notion.js` | Guarda o `NOTION_TOKEN` (nunca no browser) e consulta os databases Tracks/Reuniões |
| Seed / histórico | **Markdown** (`0X_*/`) | Material inicial; a alimentação do dia a dia é no Notion |

Databases no Notion (teamspace VISA, sob a página "Projetos"): **Tracks (subprojetos)** e
**Reuniões**, mais os já existentes (Dicionário, wiki por tema). IDs em `api/notion.js` e na
memória `notion-base-estrutura`.

### O que foi APOSENTADO (não construir em cima, remover na limpeza)
- **OpenProject** e **BookStack** — nunca entraram no fluxo real; não rodam no Vercel.
  Arquivos a remover: `docker-compose.yml`, `render.yaml`, `seed_openproject.js`,
  `seed_openproject.py`, `sync_openproject_to_supabase.js`.
- **Supabase** — substituído pelo Notion como fonte de dados. Remover `app/src/supabaseClient.js`
  e as chamadas relacionadas quando as demais telas migrarem para o Notion. As abas antigas
  (Projetos/Estantes/Dicionário via mock/Supabase) ainda existem no app até a migração terminar;
  a aba **Tracking** já lê o Notion e é a referência.

### Segurança (obrigatório)
- O `NOTION_TOKEN` vive **apenas** como env var no Vercel e é usado só na função `api/notion.js`.
  **Nunca** nomear com prefixo `VITE_` (isso o exporia ao navegador).
- A conexão interna do Notion (`Dashboard Vercel VISA`) precisa estar **ligada à página
  "Projetos"** para enxergar Tracks e Reuniões. Sem isso a API retorna vazio/erro.
- Dá só permissão de **leitura** à conexão. O dashboard é read-only por design.

## 3. Modelo de dados (databases no Notion)

```
Clientes → Projetos (macro) → Tracks → Atividades
                                 ├─ Reuniões (SteerCo mensal / Semanal / Ad-hoc)
                                 └─ Documentos
Wiki por tema + Dicionário de termos   (páginas/bases de conhecimento)
```

Tudo ligado por **relação** no Notion. IDs em `api/notion.js` (const `DB`) e na memória
`notion-base-estrutura`. O antigo bloco abaixo (tabelas Supabase) está **descontinuado** e
mantido só como referência histórica até a limpeza:

```
[legado] projects_macro · shelves · data_terms  (Supabase — a remover na limpeza)
```

## 4. Mapa do repositório

```
app/                  O dashboard (React + Vite) — vitrine + edição, lê/escreve o Notion
api/notion.js         Ponte serverless (Vercel) com o Notion; guarda o NOTION_TOKEN
0X_*/                 Material markdown herdado (seed histórico; não é fonte da verdade)
.claude/skills/       Skills que guiam o trabalho neste projeto
CLAUDE.md             Este arquivo
```

A **fonte da verdade é o Notion** (teamspace VISA). O markdown `0X_*/` é só material inicial.
A alimentação do dia a dia é no Notion ou pelo app (ambos gravam no Notion).

## 5. Padrão de metadados (para o conteúdo markdown / seed)

Toda entidade `.md` começa com **YAML frontmatter**. Exemplo (projeto):

```yaml
---
id: proj-alfa-01
cliente: Banco Alfa
titulo: Implementação Apple Pay & VTS
status: Em Certificação          # ver estados válidos abaixo
fase: Certificacao de Testes
gerente_visa: Bruno
data_inicio: 2026-07-01
proximo_marco: Testes de Campo (30/07/2026)
produtos: [Apple Pay, Visa Token Service (VTS)]
tags: [banco-alfa, apple-pay, vts, certificacao]
---
```

**Estados de status válidos:** `Em Andamento` · `Aguardando Cliente` · `Em Certificação` ·
`Mandato Pendente` · `Concluído`.

## 6. Reuniões e ingestão de transcrições (o "ativo" da base)

Três cadências, todas alimentáveis por transcrição:
- **Board mensal** (com o board do cliente) → nível macro-projeto.
- **Semanal** (por projeto/track do cliente) → nível micro-projeto.
- **Ad-hoc** (sob demanda) → ligada ao projeto/track pertinente.

Ao ingerir uma transcrição, produza sempre três blocos — **Decisões**, **Action Items**
(responsável + prazo) e **Riscos/Bloqueios** — e ligue à entidade correta (skill
`knowledge-base-architect`).

## 7. Como trabalhar aqui (para IA e humanos)

- **Antes de agir**, leia este arquivo e a skill relevante em `.claude/skills/`.
- **Não crie nova ferramenta/serviço/pasta paralela.** Se sentir essa necessidade, algo já
  existe — procure primeiro. A meta é permanecer em **1 app + 1 banco**.
- Escreva em **português**, tom objetivo, coerente com o conteúdo existente.
- Preserve o design system Visa (navy + dourado) e a consistência visual.

## 8. Skills disponíveis (`.claude/skills/`)

- **development-workflow** — o padrão do projeto (arquitetura, dados, deploy). **Leia primeiro.**
- **knowledge-base-architect** — modelo Notion, ingestão de reuniões/docs e ligação por relação.
- **product-owner** — visão de produto, personas e critérios de aceite.
- **ux-ui-designer** — design system Visa, idioma espanhol e telas do dashboard.
