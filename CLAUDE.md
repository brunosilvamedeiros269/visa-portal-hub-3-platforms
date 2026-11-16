# Visa — Base de Conhecimento Ativa

> Instruções mestras do projeto. Este arquivo é o **ponto único de contexto** para
> qualquer pessoa (ou IA) que trabalhe no repositório. Leia-o antes de tudo.
>
> **Última revisão: 16/11/2026.** Se algo aqui divergir do código, o código ganha —
> e conserte este arquivo no mesmo commit.

## 1. O que é este projeto

Um **repositório único** que produz **duas coisas publicadas** e serve a dois propósitos ligados:

1. **Acompanhar projetos** de implementação Visa junto a clientes (bancos/fintechs), na
   hierarquia **Cliente → Projeto → Track → tarefas**, com marcos, riscos (RAID) e reuniões.
2. **Consultar conhecimento** do mundo Visa: conceitos, siglas, processos, produtos, mandatos
   e dossiês por cliente.

Usuário-alvo: o **Gerente de Projetos Visa** (Visa Implementation Services) e a equipe. A dor
central é **carga cognitiva** — informação fragmentada em reuniões, PDFs, PPTX e e-mails.

## 2. Arquitetura — o que existe de verdade

> ⚠️ **Este projeto já teve uma fase Notion. Acabou.** Não existe `api/notion.js`, não existe
> `NOTION_TOKEN`, não existe `app/src/services/notionApi.js`. Se você leu isso em algum lugar,
> é documentação velha. **A fonte de dados de projeto é o Supabase.**

| Camada | Onde vive | Papel |
|---|---|---|
| **Dados de projeto** (fonte da verdade) | **Supabase** (projeto `iuwvwhofxuvmwnpbsnth`) | Clientes, projetos, tracks, tarefas, marcos, riscos, reuniões, documentos |
| **App / cockpit** | `app/` — React + Vite → **Vercel** | Lê **e escreve** no Supabase direto pelo cliente `anon` (RLS aberto). Ingere transcrições por IA |
| **Vault de conhecimento** | `vault-visa/` (português) e `vault-visa-es/` (espanhol) — markdown com wikilinks | Abertos como vaults no **Obsidian**. Conceitos, glossário, MOCs, técnico, troubleshooting e **dossiês por cliente** |
| **Wiki pública** | `wiki/` — **Quartz** → **Vercel** | Publica os dois vaults como site estático: português na raiz, espanhol em `/es/`, com seletor PT \| ES na barra |
| **Migrações de banco** | `db/*.sql` | Um arquivo datado por mudança. Idempotentes |
| **Ponte de IA** | `api/procesar-minuta.js` + `api/engines.js` | Serverless: recebe o texto da ata e devolve decisões, action items e riscos estruturados |

### As duas URLs publicadas
- **App / seguimento:** `https://visa-portal-hub-3-platforms.vercel.app/`
- **Wiki:** `https://visa-wiki.vercel.app/` (português) e `https://visa-wiki.vercel.app/es/` (espanhol) — build: `cd wiki && node build.mjs`

**Elas se alimentam de fontes diferentes.** Mudar o Supabase muda só o app. Mudar o
`vault-visa/` muda só a wiki — e **só depois de um deploy**. Atualizar um e esquecer o outro é
o erro mais comum neste repositório.

### Segurança
A **anon key do Supabase é pública por design** e está fixa em `app/src/lib/supabase.js` — o
acesso é controlado por **RLS**, que hoje está **aberto ao anon** (`using (true)`). Auth de
verdade ficou para depois. Não trate essa chave como segredo, mas também **não coloque nada
sensível em tabela sem RLS restritiva**.

As chaves de IA (`GEMINI_API_KEY`, `XAI_API_KEY`, `ANTHROPIC_API_KEY`) vivem **só** como env
vars no Vercel e são usadas apenas em `api/`. **Nunca** com prefixo `VITE_` — isso as exporia
ao navegador.

### Wiki em duas línguas — a regra que não se quebra

`vault-visa/` e `vault-visa-es/` são **espelhos**: mesmas pastas, **mesmos nomes de arquivo**, mesmos alvos de
wikilink. Só o conteúdo muda de língua. É isso que permite ao seletor PT | ES (em `wiki/inject.mjs`) levar à
mesma nota na outra língua.

- Nota nova, renomeada ou apagada: faça **nos dois vaults**, no mesmo caminho.
- Na versão em espanhol o título exibido vem de `title:` no frontmatter (o nome do arquivo fica em português).
- Alvo de wikilink nunca se traduz; para ler bem em espanhol use apelido: `[[Enrolamento massivo|enrolamiento masivo]]`.
- `Conocimiento/Índices/Índice — fuentes.md` é gerado: `python3 wiki/indice-fuentes.py` regenera os dois.

## 3. Modelo de dados (tabelas no Supabase)

```
clientes → projetos → tracks → tareas
                        ├─ marcos
                        ├─ documentos   (Storage: bucket track-docs)
                        └─ reunion_tracks ─ reunioes
riscos      → projeto_id XOR track_id   (RAID)
tareas      → projeto_id XOR track_id   (itens transversais de reunião)
contactos   → diretório global
```

**Colunas que importam** (o resto está nas migrações em `db/`):

- `clientes`: `nome`, `pais`, `segmento`, `contatos`
- `projetos`: `cliente_id`, `nome`, `status`, `gerente` (lista, ex. "Bruno / Jenny"), `csm`, `inicio`, `descricao`, `rag_override`
- `tracks`: `projeto_id`, `nome`, `frente`, `status`, `responsavel`, `technical_pm`, `waiver_hasta`, `proximo_paso`, `ruta_critica`, `avance`, `rag_override`
- `tareas`: `titulo`, `status`, `responsavel`, `previsao_entrega`, `data_fechamento`, `origen`
- `marcos`: `track_id`, `nome`, `fecha`, `concluido`, `orden`
- `riscos`: `descricao`, `tipo`, `severidade`, `dueno`, `status`, `mitigacion`
- `reunioes`: `cliente_id`, `projeto_id`, `titulo`, `tipo`, `data`, `participantes` (jsonb), `ata`, `resumo_ia`, `decisoes`

**Vocabulário fixo** (de `app/src/components/trackingUi.jsx` e `app/src/lib/raidConstants.js` —
use exatamente estes valores):

- `tracks.status`: `Em curso` · `Em curso - atrasado` · `Pendente` · `Sin iniciar` · `Bloqueado` · `Concluído`
- `tareas.status`: `aberto` · `em_andamento` · `bloqueada` · `fechado`
- `riscos.tipo`: `riesgo` · `issue` — `severidade`: `alta` · `media` · `baja` — `status`: `abierto` · `en_mitigacion` · `cerrado`
- `reunioes.tipo`: `steerco` · `semanal` · `adhoc`
- `origen` de tarefa: `manual` · `reunion` · `prerequisito` · `riesgo`
- `rag_override`: `verde` · `amarelo` · `rojo` · null

## 4. Mapa do repositório

```
app/                  Cockpit React + Vite. Lê/escreve Supabase. Deploy raiz do Vercel
api/                  Serverless: procesar-minuta.js (IA) e engines.js
db/*.sql              Migrações datadas e idempotentes
vault-visa/           Vault do Obsidian em português — conhecimento + dossiês por cliente
vault-visa-es/        Espelho em espanhol (mesmos caminhos e nomes de arquivo)
wiki/                 Quartz. Publica os dois vaults (build.mjs, inject.mjs, indice-fuentes.py)
01_Projetos/ 02_Reunioes/ 03_Produtos/ 04_Visa_Workflows/ 05_Dicionario_Termos/
                      Seed histórico em markdown. NÃO é fonte da verdade; ninguém alimenta mais
.claude/skills/       Skills que guiam o trabalho aqui
CLAUDE.md             Este arquivo
```

## 5. Onde colocar cada coisa (a decisão que mais se erra)

| O que você tem | Onde vai |
|---|---|
| Status, datas, % , pendências, riscos, marcos | **Supabase** — pelo app ou por migração em `db/` |
| Contexto, história, decisões, incidentes de um cliente | **`vault-visa/Proyectos/<Cliente>/<Cliente> — dossiê.md`** e o espelho em `vault-visa-es/` |
| Conceito, sigla, processo reutilizável | **`vault-visa/Conocimiento/`** (Glosario, Técnico, Troubleshooting, MOCs) |
| Transcrição bruta, PDF, PPTX | Fora do repo (OneDrive). No repo entra só o **destilado** |

**A regra:** o que muda toda semana vai para o banco; o que explica **por quê** vai para o vault.
O dossiê não repete o status — ele diz o que o status não conta.

## 6. Ingestão de reuniões — use o app, não faça na mão

O app **já tem** a tela de ingestão (`ReunionProcesar.jsx` → `api/procesar-minuta.js`): cola-se
o texto da ata/transcrição, escolhe-se o motor (Gemini, xAI ou Claude) e ele devolve
**participantes, resumo, decisões, action items e riscos** para revisão antes de gravar. Ao
confirmar, grava a reunião, liga às tracks (`reunion_tracks`), cria as tarefas com
`origen: 'reunion'` e os riscos no RAID.

**Esse é o caminho normal.** Só escreva SQL à mão para carga em lote ou correção — e então siga
o padrão de `db/`: arquivo datado, idempotente (`where not exists`), dentro de `begin/commit`.

Depois da ingestão, atualize **o dossiê do cliente no vault** com o que a reunião mudou de
entendimento. O banco registra o fato; o vault registra o significado.

## 7. Fluxo de entrega (git + deploy)

1. Trabalhe em **branch** (`claude/...` é o padrão do repo). Nunca direto em `main`.
2. **Se mexeu no app:** `cd app && npm run build` tem de passar.
3. **Se mexeu no vault:** `cd wiki && npm install && node build.mjs` tem de passar. Confira que as
   páginas novas saíram em `wiki/public/` **e** em `wiki/public/es/`.
4. **Se mexeu em links do vault:** rode um verificador de wikilinks quebrados antes de commitar.
5. **Se criou nota nova no vault:** atualize `vault-visa/index.md`, o **MOC** da categoria e
   regenere `Conocimiento/Índices/Índice — fuentes.md` (`python3 wiki/indice-fuentes.py`) — nos dois vaults.
6. **Se escreveu migração:** valide contra um Postgres local e rode **duas vezes** para provar
   idempotência.
7. Commit com mensagem clara (o quê + por quê), co-autoria Claude.
8. **Push → PR → merge em `main`.** O Vercel publica os dois sites a partir de `main`.
   **Branch sozinha gera preview, não produção.**

## 8. Armadilhas conhecidas de ambiente (leia antes de se frustrar)

- **O shell da máquina do usuário não tem rede.** Nada de `git push`, `npm install` ou chamada
  de API por ali. Use o container da nuvem para isso.
- **O host do Supabase pode estar fora da allowlist de egresso** do container da nuvem. Se
  `iuwvwhofxuvmwnpbsnth.supabase.co` der 403 "Host not in allowlist", o caminho é rodar o SQL no
  **SQL Editor** do Supabase ou liberar o host nas configurações de rede da sessão.
- **O push pode falhar com "not in this session's authorized repository set"** — é escopo de
  credencial, não ausência dela. O repo precisa ser adicionado às fontes da sessão.
- **O working tree mostra ~100 arquivos modificados que você não tocou.** É diferença de
  fim de linha (CRLF) do checkout no Windows. **Não commite isso** — faça `git add` só nos
  caminhos que você realmente alterou.
- **No mount da máquina do usuário o git não consegue apagar arquivos.** Locks (`.git/index.lock`,
  `HEAD.lock`) sobram e travam o próximo comando. Mova-os para uma pasta `_to_delete/` em vez de
  tentar `rm`.

## 9. Princípios

- **Não crie plataforma nova.** O projeto já foi resgatado de uma sprawl de 5 sistemas
  (OpenProject, BookStack, Notion, Supabase, markdown). Se sentir vontade de adicionar uma, algo
  já existe — procure primeiro.
- **Não fabrique dados.** Datas, percentuais e responsáveis vêm do documento. O que veio de
  transcrição automática e não foi validado entra marcado como `[a confirmar]` / `estado: parcial`.
- **Interface pública em espanhol**; o vault mistura PT/ES conforme a nota. Não traduza o dado,
  traduza a exibição.
- **Design system Visa:** navy `#0A142F`/`#051424`, superfície `#122131`/`#1C2B3C`, borda
  `#273647`, dourado `#FAA61A`, índigo `#1A1F71`. Cantos `rounded-xl`.
- Ao terminar, diga **o que você verificou** — build, deploy, migração — com honestidade.

## 10. Skills (`.claude/skills/`)

- **development-workflow** — arquitetura, dados, deploy. **Leia primeiro.**
- **knowledge-base-architect** — ingestão de reuniões e curadoria do vault.
- **product-owner** — visão de produto, personas e critérios de aceite.
- **ux-ui-designer** — design system e telas.
