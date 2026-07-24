# Visa — Base de Conhecimento Ativa

Base de conhecimento **compartilhada da equipe** para (1) acompanhar projetos de
implementação de carteiras digitais Visa junto a clientes e (2) consultar rapidamente
conceitos, siglas, processos, produtos e mandatos do mundo Visa.

## Como está organizado

| Pasta | O que contém |
|---|---|
| `01_Projetos/` | Macro e micro-projetos, status, marcos, contatos |
| `02_Reunioes/` | Atas e transcrições processadas (decisões, ações, riscos) |
| `03_Produtos/` | Páginas de referência: Apple Pay, VTS, etc. |
| `04_Visa_Workflows/` | Mandatos e processos Visa |
| `05_Dicionario_Termos/` | Glossário de siglas e campos (EMV, ISO 8583…) |

Todo arquivo `.md` começa com um cabeçalho **YAML** (cliente, status, produtos, tags…)
que permite busca e ligação entre entidades.

## Ferramentas (1 app + 1 banco)

- **App React + Vite** (`app/`) — o dashboard: projetos, wiki, dicionário, reuniões.
- **Supabase** — banco de dados (fonte da verdade em produção).
- **Vercel** — publica o app e gera a URL compartilhada com a equipe.

As pastas markdown são o **seed inicial**; depois de popular o Supabase, a alimentação do
dia a dia acontece pelo app.

### Rodar localmente

```bash
cd app
npm install
npm run dev
```

## Trabalhando com IA (Claude Code)

O arquivo [`CLAUDE.md`](CLAUDE.md) é o contexto mestre do projeto. As skills em
`.claude/skills/` guiam tarefas comuns:

- **knowledge-base-architect** — organizar e ingerir conteúdo.
- **product-owner** — decisões de produto e escopo.
- **ux-ui-designer** — design system e telas.

## Convenção principal

**1 app + 1 banco. Nada de sistemas paralelos.** Não adicione uma nova plataforma — o
projeto foi reorganizado justamente para eliminar a sprawl de sistemas redundantes.
