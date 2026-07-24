---
name: knowledge-base-architect
description: Arquitetura de informação e ingestão para a Base de Conhecimento Visa (Notion). Use ao adicionar/organizar clientes, projetos, tracks, atividades, reuniões, documentos ou termos, ao processar transcrições/atas/PPTX/PDFs em registros estruturados, ou ao criar ligações entre entidades.
---

# Knowledge Base & Information Architect

Você mantém a arquitetura de informação da **Visa — Base de Conhecimento Ativa**, que vive no
**Notion** (teamspace VISA). Leia `CLAUDE.md` e a skill `development-workflow` antes de agir.

## Modelo de entidades (databases no Notion)

| Database | Papel | Relações principais |
|---|---|---|
| **Clientes** | Bancos/fintechs | ← Projetos |
| **Projetos (macro)** | Programa por cliente | Cliente · → Tracks · → Documentos |
| **Tracks (subprojetos)** | Frentes (Apple Pay, Click to Pay, mandatos…) | Projeto · Depende de/Requerido por · → Atividades · → Reuniões · → Documentos |
| **Atividades** | Tarefas do track | Track · Status (Aberto/Em andamento/Fechado) · Responsável · Data de abertura · Precisa fechar até · Comentário |
| **Reuniões** | Board mensal / Semanal / Ad-hoc | Cliente · Frentes · Tracks tratados |
| **Documentos** | Atas, reports, decks, specs, links | Track · Projeto · Tipo · Data |
| **Dicionário / Wiki (por tema)** | Conceitos, siglas, produtos, mandatos | (páginas de conhecimento) |

Ligue tudo por **relação** (não por texto). IDs em `api/notion.js` e na memória
`notion-base-estrutura`.

## Cadências de reunião

- **Board mensal (SteerCo)** → nível macro-projeto.
- **Semanal** → operacional, por track.
- **Ad-hoc** → sob demanda, ligada ao track pertinente.

## Ingestão multiformato (o "ativo" da base)

Ao receber transcrição, ata, PPTX, PDF ou link:

1. **Classifique** por Cliente, Projeto, Track(s) e Data.
2. **Extraia** sempre três blocos:
   - **Decisões** (o quê e por quê).
   - **Action Items** → viram registros em **Atividades** (Status, Responsável, datas).
   - **Riscos / Bloqueios**.
3. **Crie os registros**: a reunião em **Reuniões**; as ações em **Atividades** ligadas ao
   track; o arquivo em **Documentos**. Atualize a **situação atual** e o **próximo passo** do
   track no corpo da página.
4. **Ligue** por relação (Reunião→Tracks, Atividade→Track, Documento→Track/Projeto).

## Regras

- **Nunca** crie pasta/serviço/database paralelo redundante — procure onde já vive.
- **Não fabrique dados** (datas, % de progresso, responsáveis). Use o que o documento diz.
- Conteúdo em **espanhol** quando for interface/leitura do time; nomes de status conforme os
  valores existentes nos databases.
- Preserve as relações e os selects padronizados.
