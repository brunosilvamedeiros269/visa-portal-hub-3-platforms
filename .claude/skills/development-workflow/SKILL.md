---
name: development-workflow
description: O padrão de desenvolvimento da Base de Conhecimento Visa — onde os dados vivem, como o app lê/escreve, o design, o idioma e o fluxo de deploy. Use SEMPRE antes de mexer no código ou nos dados do projeto.
---

# Fluxo de Desenvolvimento — Visa Base de Conhecimento Ativa

Este é o padrão único do projeto. Leia também o `CLAUDE.md` da raiz.

## 1. Arquitetura (não reintroduzir sistemas paralelos)

- **Fonte da verdade = Notion** (teamspace VISA). Todo dado de projeto vive lá.
- **App = vitrine + edição** — React + Vite (`app/`), publicado no **Vercel**.
- **Ponte = `api/notion.js`** (serverless no Vercel). Guarda o `NOTION_TOKEN`. O browser
  **nunca** fala com o Notion direto. Toda leitura/escrita passa por `/api/notion`.
- Regra de ouro: **Notion + 1 app**. Nada de OpenProject, BookStack, Supabase ou pastas
  markdown como fonte. Se pensar em adicionar plataforma, pare — algo já existe.

## 2. Modelo de dados (hierarquia)

```
Clientes → Projetos (macro) → Tracks → Atividades
                                  ├─ Reuniões (SteerCo mensal / Semanal / Ad-hoc)
                                  └─ Documentos
```

Databases e IDs ficam em `api/notion.js` (const `DB`) e na memória `notion-base-estrutura`.
Ao criar entidade nova, ligue-a por **relação** (não texto): Track→Projeto, Atividade→Track,
Documento→Track/Projeto, Reunião→Track.

## 3. Idioma e design (regras fixas)

- **Interface pública 100% em espanhol.** Sem seletor de idioma. Rótulos, botões, mensagens
  e datas em ES. Valores de status vêm do Notion (podem estar em PT) e são exibidos em ES via
  mapa `STATUS_LABEL` no app — não traduza o dado, traduza a exibição.
- **Design system Visa:** navy `#0A142F`/`#051424`, superfície `#122131`/`#1C2B3C`, borda
  `#273647`, dourado `#FAA61A`, índigo `#1A1F71`. Cantos `rounded-xl`. Consistência acima de
  ornamento. Ver skill `ux-ui-designer`.

## 4. Como adicionar/mudar coisas

- **Nova leitura no app:** adicione um `resource` em `api/notion.js` + um fetcher em
  `app/src/services/notionApi.js`; consuma no componente.
- **Escrita no app:** só funciona se a conexão Notion tiver as capacidades **Inserir** e
  **Atualizar conteúdo** habilitadas. Escrita também passa por `/api/notion` (POST/PATCH).
- **Ingestão de reunião/documento:** ver skill `knowledge-base-architect` — produza Decisões,
  Action Items (viram Atividades) e Riscos, e ligue às entidades certas.
- **Novo cliente/projeto:** replique o padrão do BROU (cliente → projeto → tracks →
  atividades), usando dados reais dos dossiês/documentos, sem inventar números.

## 5. Fluxo de entrega (git + deploy)

1. Trabalhe no branch (nunca commitar direto sem necessidade).
2. **Verifique o build:** `cd app && npm run build` deve passar antes de commitar.
3. Commit com mensagem clara (o que + porquê); co-autoria Claude.
4. Deploy = **push para `main`** → o Vercel publica produção automaticamente.
   Se o push for bloqueado pelo modo de segurança, peça ao usuário para rodar
   `git push origin HEAD:main`.
5. **Valide no ar:** `SUA-URL/api/notion?resource=health` e a aba **Seguimiento**.

## 6. Princípios

- Não fabricar dados (ex.: % de progresso). Derive de status reais; se não houver, mostre o
  que existe.
- Enxuto: menos telas e menos dependências, bem-feitas, em vez de muitas pela metade.
- Ao terminar, diga o que foi verificado (build, deploy) com honestidade.
