---
name: knowledge-base-architect
description: Arquitetura de informação e ingestão para a Base de Conhecimento Visa — dados de projeto no Supabase e conhecimento no vault Obsidian (vault-visa/, publicado pela wiki Quartz). Use ao adicionar/organizar clientes, projetos, tracks, tarefas, reuniões, riscos, marcos ou termos, ao processar transcrições/atas/PPTX/PDFs, ou ao decidir onde uma informação deve morar.
---

# Knowledge Base & Information Architect

Você mantém a arquitetura de informação da **Visa — Base de Conhecimento Ativa**. Leia
`CLAUDE.md` e a skill `development-workflow` antes de agir.

> ⚠️ **Não é Notion.** Os dados de projeto vivem no **Supabase**; o conhecimento vive no
> **`vault-visa/`** (Obsidian), publicado pela wiki Quartz.

## 1. A decisão que mais se erra: onde isso mora?

| O que você tem | Onde vai | Muda o quê |
|---|---|---|
| Status, datas, %, pendências, riscos, marcos, quem é responsável | **Supabase** | o app, na hora |
| Contexto, história, decisões, incidentes, "por que estamos assim" | **`vault-visa/Proyectos/<Cliente>/<Cliente> — dossiê.md`** | a wiki, após merge |
| Conceito, sigla, processo, armadilha reutilizável entre clientes | **`vault-visa/Conocimiento/`** | a wiki, após merge |
| Transcrição bruta, PDF, PPTX, deck | **Fora do repo** (OneDrive). Entra só o destilado | nada |

**A regra:** o que muda toda semana vai para o banco; o que explica **por quê** vai para o vault.
O dossiê não repete o status — ele diz o que o status não conta.

Quase toda ingestão de reunião gera **as duas coisas**. Fazer só uma é o defeito recorrente.

## 2. Modelo de dados (Supabase)

```
clientes → projetos → tracks → tareas
                        ├─ marcos          (nome, fecha, concluido, orden)
                        ├─ documentos      (Storage: bucket track-docs)
                        └─ reunion_tracks ─ reunioes
riscos / tareas → projeto_id XOR track_id   (itens transversais de reunião)
contactos → diretório global
```

Vocabulário fixo em `CLAUDE.md` §3. **Use exatamente esses valores** — o app renderiza por mapa
e um valor fora da lista aparece sem badge e sem cor.

## 3. Ingestão de reunião — use o app

O app já tem a tela: cola-se o texto, escolhe-se o motor de IA e ele devolve **participantes,
resumo, decisões, action items e riscos** para revisão antes de gravar. Ao confirmar, grava a
reunião, liga às tracks, cria as tarefas com `origen: 'reunion'` e os riscos no RAID.

**Esse é o caminho normal.** SQL à mão só para carga em lote ou correção — e então siga o padrão
de `db/`: datado, idempotente, dentro de `begin/commit`, validado em Postgres local rodando duas
vezes.

Ao ingerir, extraia sempre **quatro** blocos:
1. **Decisões** — o quê e por quê.
2. **Action items** — o quê · responsável · prazo. Viram `tareas`.
3. **Riscos / bloqueios** — com tipo, severidade e dono. Viram `riscos`.
4. **Pendências que FECHARAM** — não descarte. É o que sustenta a defesa do valor do
   acompanhamento no SteerCo, e no dossiê vira a seção "Encerrado desde o último dossiê".

Depois: **atualize o dossiê do cliente** com o que a reunião mudou de entendimento, e o
**Status atual (base: <reunião, data>)** no topo.

## 4. Curadoria do vault

Estrutura:
```
vault-visa/
  index.md                      Home — porta de entrada, lista tudo
  Conocimiento/
    Conceptos/                  Leitura em ordem, numerada
    Glosario/                   1 nota por termo, siglas em `aliases`
    MOCs/                       Mapas por categoria
    Técnico/                    Aprofundamentos
    Troubleshooting/            Sintoma → diagnóstico → causa → ação
    Índices/Índice — fuentes.md De onde veio cada nota e seu estado
  Proyectos/<Cliente>/          Dossiê por cliente
```

**Frontmatter obrigatório.** Glossário: `aliases`, `tags: ["glosario/<categoria>"]`, `categoria`,
`fuente`, `estado`. Dossiê: `tags: ["proyecto", "cliente/<Nome>"]`, `fuente`, `estado`.

**`estado`** é `verificado` (veio de documentação ou foi confirmado) ou `parcial` (veio de ata de
reunião e não foi confirmado contra a spec). Nota `parcial` leva um callout
`> [!note] Estado desta nota` dizendo o que falta confirmar. **Transcrição automática nunca é
`verificado` por si só.**

**Ao criar uma nota nova, faça os quatro passos:**
1. Crie o arquivo com frontmatter completo.
2. Adicione ao **MOC** da categoria.
3. Adicione ao **`index.md`**.
4. Regenere **`Índice — fuentes.md`** (contagens e tabela por categoria).

Pular qualquer um deixa a nota órfã — ela existe, mas ninguém chega nela.

**Wikilinks:** ligue conceitos sempre que aparecerem (`[[Tokenização]]`, `[[Click to Pay]]`).
Antes de commitar, verifique que nenhum link aponta para nota inexistente.

## 5. Anatomia do dossiê de cliente

Ordem que funciona (siga a dos dossiês existentes de BROU e Banco de Corrientes):

1. **Ficha** — cliente, país, tracks, processador, ITSP, certificador, contatos, modelo comercial.
2. **Status atual (base: <reunião, data>)** — dois ou três parágrafos. Qual é o bloqueio **agora**.
3. **Frentes / tracks** — tabela curta com o ponto crítico de cada uma.
4. **Histórico (linha do tempo)** — datado, com o que aconteceu de fato.
5. **Seções por evento relevante** — SteerCo, incidente, ciclo de certificação.
6. **Decisões e pontos importantes.**
7. **Pendências e riscos**, com subseção **"Encerrado desde o último dossiê"**.

## 6. Regras

- **Nunca** crie pasta/serviço/banco paralelo — procure onde já vive.
- **Não fabrique dados.** Datas, percentuais e responsáveis vêm do documento. O que não foi
  validado entra marcado `[a confirmar]` e `estado: parcial`.
- **Nomes próprios e números literais** (SR, PCR, caso, BIN, código de erro) preservados como
  ditos. Transcrição automática erra grafia — registre a variante quando ajudar na busca.
- **Se o nome do arquivo-fonte contradiz o conteúdo, o conteúdo ganha** — e registre a correção.
  Já aconteceu: dois arquivos com prefixo `CORRIENTES` eram do BROU.
- Conteúdo do vault em PT ou ES conforme a nota; interface do app sempre em ES.
