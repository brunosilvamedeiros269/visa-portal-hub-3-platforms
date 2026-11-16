---
name: development-workflow
description: O padrão de desenvolvimento da Base de Conhecimento Visa — onde os dados vivem (Supabase + vault Obsidian), como o app lê/escreve, o design, o idioma e o fluxo de deploy dos dois sites. Use SEMPRE antes de mexer no código ou nos dados do projeto.
---

# Fluxo de Desenvolvimento — Visa Base de Conhecimento Ativa

Padrão único do projeto. Leia também o `CLAUDE.md` da raiz.

## 1. Arquitetura

> ⚠️ **A fase Notion acabou.** Não existe `api/notion.js`, `NOTION_TOKEN` nem
> `services/notionApi.js`. Se alguma doc disser isso, está velha — conserte-a.

- **Fonte da verdade dos dados de projeto = Supabase** (projeto `iuwvwhofxuvmwnpbsnth`).
- **App = cockpit** — React + Vite (`app/`), publicado no Vercel. Lê **e escreve** no Supabase
  direto pelo cliente `anon` (`app/src/lib/supabase.js`), com RLS aberto. Camada de acesso em
  `app/src/services/data.js`.
- **Vault = `vault-visa/`** — markdown com wikilinks, aberto no Obsidian.
- **Wiki = `wiki/`** — Quartz, publica o vault como site estático no Vercel.
- **IA de ingestão = `api/procesar-minuta.js`** — motores Gemini, xAI e Claude; as chaves vivem
  só como env var no Vercel, **nunca** com prefixo `VITE_`.

**Duas URLs, duas fontes:**
| Site | Fonte | Muda quando |
|---|---|---|
| `visa-portal-hub-3-platforms.vercel.app` | Supabase | você grava no banco — **na hora**, sem deploy |
| `visa-wiki.vercel.app` | `vault-visa/` | você comita no vault **e** faz merge em `main` |

Atualizar um e esquecer o outro é o erro mais comum aqui.

## 2. Modelo de dados

```
clientes → projetos → tracks → tareas
                        ├─ marcos
                        ├─ documentos  (Storage: bucket track-docs)
                        └─ reunion_tracks ─ reunioes
riscos / tareas → projeto_id XOR track_id
```

Vocabulário fixo (não invente valor novo): ver seção 3 do `CLAUDE.md`. As fontes são
`app/src/components/trackingUi.jsx` e `app/src/lib/raidConstants.js`.

## 3. Idioma e design

- **Interface pública 100% em espanhol.** Sem seletor de idioma. Os valores de status ficam
  como estão no banco (podem estar em PT) e são exibidos em ES pelos mapas de `trackingUi.jsx`
  — **não traduza o dado, traduza a exibição.**
- **Design system Visa:** navy `#0A142F`/`#051424`, superfície `#122131`/`#1C2B3C`, borda
  `#273647`, dourado `#FAA61A`, índigo `#1A1F71`. Cantos `rounded-xl`. Ver skill `ux-ui-designer`.

## 4. Como adicionar/mudar coisas

- **Nova leitura/escrita no app:** adicione a função em `app/src/services/data.js` (padrão
  `run(supabase.from(...))`) e consuma no componente. `fetchAll()` traz tudo de uma vez.
- **Mudança de schema:** arquivo novo em `db/`, nomeado `AAAA-MM-DD-descricao.sql`,
  **idempotente** (`if not exists`, `where not exists`), rodado no SQL Editor do Supabase.
  Se criar tabela, lembre de `enable row level security` + policy anon, como nas migrações
  existentes.
- **Carga de dados em lote:** mesma convenção, dentro de `begin/commit`. Valide contra um
  Postgres local e **rode duas vezes** para provar que não duplica.
- **Ingestão de reunião:** use a tela do app. Ver skill `knowledge-base-architect`.
- **Novo cliente/projeto:** cliente → projeto → tracks, com dados reais dos dossiês. Depois
  crie o dossiê correspondente em `vault-visa/Proyectos/`.

## 5. Fluxo de entrega (git + deploy)

1. Trabalhe em **branch** (`claude/...`). Nunca direto em `main`.
2. Mexeu no app → `cd app && npm run build` tem de passar.
3. Mexeu no vault → `cd wiki && npm install && npx quartz build -d ../vault-visa -o public`
   tem de passar; confira as páginas novas em `wiki/public/`.
4. Mexeu em links do vault → verifique wikilinks quebrados antes de commitar.
5. Criou nota nova → atualize `vault-visa/index.md`, o MOC da categoria e regenere
   `Conocimiento/Índices/Índice — fuentes.md`.
6. Commit com mensagem clara (o quê + por quê), co-autoria Claude.
7. **Push → PR → merge em `main`.** O Vercel publica os dois sites a partir de `main`.
   **Branch sozinha gera preview, não produção.**

## 6. Armadilhas de ambiente

- O **shell da máquina do usuário não tem rede** — nada de push, npm install ou chamada de API.
- O **host do Supabase pode estar fora da allowlist de egresso** do container. Se der 403
  "Host not in allowlist", rode o SQL no **SQL Editor** ou peça a liberação do host.
- Push com **"not in this session's authorized repository set"** é escopo de credencial: o repo
  precisa entrar nas fontes da sessão.
- O working tree mostra **~100 arquivos modificados por CRLF**. Não commite isso — `git add`
  apenas nos caminhos que você alterou de fato.
- No mount da máquina do usuário o git **não apaga arquivos**; locks sobram. Mova-os para
  `_to_delete/`.

## 7. Princípios

- **Não reintroduza plataforma paralela.** O projeto já foi resgatado de OpenProject, BookStack
  e Notion. Se pensar em adicionar uma, algo já existe — procure.
- **Não fabrique dados** (% de progresso, datas, responsáveis). Derive do que existe; o que não
  foi validado entra marcado como `[a confirmar]`.
- Enxuto: menos telas e menos dependências, bem-feitas.
- Ao terminar, diga **o que foi verificado** (build, migração, deploy) com honestidade — e o que
  não deu para verificar.
