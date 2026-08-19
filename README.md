# Visa — Base de Conhecimento Ativa

Base de conhecimento **compartilhada da equipe** para (1) acompanhar projetos de
implementação Visa junto a clientes e (2) consultar rapidamente conceitos, siglas, processos,
produtos e mandatos do mundo Visa.

## Duas coisas publicadas, duas fontes diferentes

| Site | O que é | De onde vem |
|---|---|---|
| [visa-portal-hub-3-platforms.vercel.app](https://visa-portal-hub-3-platforms.vercel.app/) | **Cockpit** — clientes, projetos, tracks, tarefas, marcos, riscos e reuniões | **Supabase** — muda na hora, sem deploy |
| [visa-wiki.vercel.app](https://visa-wiki.vercel.app/) | **Wiki** — conhecimento e dossiês por cliente | **`vault-visa/`** — muda após merge em `main` |

> Atualizar um e esquecer o outro é o erro mais comum aqui. O que muda toda semana (status,
> datas, pendências) vai para o **banco**; o que explica **por quê** vai para o **vault**.

## Como está organizado

| Pasta | O que contém |
|---|---|
| `app/` | Cockpit React + Vite. Lê e escreve no Supabase |
| `api/` | Serverless: `procesar-minuta.js` (ingestão de atas por IA) e `engines.js` |
| `db/` | Migrações e cargas SQL, datadas e idempotentes |
| `vault-visa/` | Vault do Obsidian — `Conocimiento/` (conceitos, glossário, MOCs, técnico, troubleshooting) e `Proyectos/` (dossiê por cliente) |
| `wiki/` | Quartz — publica o `vault-visa/` como site estático |
| `0X_*/` | Seed histórico em markdown. **Não é fonte da verdade**; ninguém alimenta mais |

## Alimentação do dia a dia

**Reunião nova?** Use a tela de ingestão do app: cole a ata ou a transcrição, escolha o motor
de IA e revise o que ele extraiu (participantes, resumo, decisões, action items, riscos) antes
de gravar. Ele cria a reunião, liga às tracks, abre as tarefas e registra os riscos.

Depois, atualize o **dossiê do cliente** no `vault-visa/` com o que a reunião mudou de
entendimento. O banco registra o fato; o vault registra o significado.

### Abrir o vault no Obsidian
Abra a pasta `vault-visa/` como *vault*. O **Graph View** mostra a rede de ligações.

### Rodar localmente
```bash
cd app && npm install && npm run dev      # cockpit
cd wiki && npm install && npx quartz build -d ../vault-visa -o public   # wiki
```

## Deploy

Branch → PR → **merge em `main`**. O Vercel publica os dois sites a partir de `main`.
**Branch sozinha gera preview, não produção.**

## Trabalhando com IA (Claude Code / Cowork)

[`CLAUDE.md`](CLAUDE.md) é o contexto mestre — leia antes de tudo. Ele traz o modelo de dados,
o vocabulário fixo de status e as armadilhas de ambiente (rede, allowlist do Supabase, CRLF,
locks de git no mount). As skills em `.claude/skills/` guiam as tarefas comuns:

- **development-workflow** — arquitetura, dados e deploy. Leia primeiro.
- **knowledge-base-architect** — ingestão de reuniões e curadoria do vault.
- **product-owner** — decisões de produto e escopo.
- **ux-ui-designer** — design system e telas.

## Convenção principal

**1 app + 1 banco + 1 vault. Nada de sistemas paralelos.** O projeto foi reorganizado
justamente para eliminar a sprawl de sistemas redundantes (OpenProject, BookStack, Notion).
Se sentir vontade de adicionar uma plataforma, algo já existe — procure primeiro.
