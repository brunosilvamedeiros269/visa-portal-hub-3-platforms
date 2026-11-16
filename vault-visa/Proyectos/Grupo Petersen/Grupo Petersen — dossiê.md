---
tags: ["proyecto", "cliente/Grupo-Petersen"]
fuente: Transcrições automáticas de set–nov/2026 (kickoff 12/11, Tesouraria 12/11, alinhamento interno 12/11, demo VDMU 16/11, Weekly Tech)
estado: parcial
---

# 🇦🇷 Grupo Petersen (Argentina) — Proyecto Fusión

> [!info] Dossiê de projeto (contexto qualitativo)
> O acompanhamento **vivo** está no app. Aqui fica o contexto, a história e o porquê das decisões.

> [!warning] Fonte não validada
> Tudo aqui vem de transcrições automáticas, com falantes anonimizados e nomes corrompidos. O que leva `[a confirmar]` não foi validado com as pessoas.

## Ficha
- **Cliente:** Grupo Petersen. **País:** Argentina.
- **Projeto:** PMO da integração bancária ("Proyecto Fusión"). Não é projeto de carteira nem de produto: é orquestração.
- **Papel da Visa:** PMO — Bruno (PM) e Desiree "Desi" Ovejero (client facing). Só VCA, sem CS.
- **Duração dita:** 9 meses, de nov/2026 a jul/2027.
- **[[Processador]]:** [[Prisma]], para todos os bancos, antes e depois da fusão.
- **Contatos —** Grupo: Carolina "Caro" (lidera), Ricardo "Richard", "Macu", Mariana (APIs), "Ale", Adrián, Mario `[sobrenomes e cargos a confirmar]`. Visa: Gabriela "Gaby" e Damián "Dami" (tocavam o tema antes da PMO) `[cargos a confirmar]`, Cindy (Tesouraria), Alexis (produtos digitais Cone Sul), Débora (Benefits), Ale Rosa e Agustín Cánovas (BD). [[Prisma]]: Diego Echevarría `[grafia a confirmar]`.

## Status atual (base: demo de 16/nov/2026)
**Âmbar (sugestão).** O projeto está no primeiro mês, em fase de mapeamento: kickoff feito, duas sessões temáticas realizadas (Tesouraria e arte digital), nenhuma frente com plano fechado. Não há atraso. O âmbar vem de quatro pontas soltas que dependem de terceiros ou de áreas internas: confirmação escrita de Google e Apple, resposta sobre mandatos, levantamento de Tesouraria e a entrada da [[Prisma]] na conversa com a Visa.

## Como o projeto nasceu
A conta entrou na pipe como **Issuer Wallet**. Em 28/set a proposta estava pronta, mas o cliente achou caro e o time alertou que seriam 4 bancos. No dia seguinte a conversa mudou: se três dos quatro bancos vão unificar, não faz sentido certificar uma carteira por banco. Soledad pediu uma linha nova na pipe, "Integración Bancos", para um PM que orquestrasse a integração. Em 05/out a recomendação do BD e de Damián foi retomar o Issuer Wallet só depois da fusão; em 19/out ele foi cancelado internamente.

A proposta de PMO foi carregada, o cliente "teoricamente disse sim" (02/nov) e em 05/nov o contrato foi anunciado com Bruno como responsável. Dois pontos de contexto ditos na Weekly Tech de 11/nov ajudam a calibrar a postura: o projeto do cliente já corria há mais de seis meses quando a PMO entrou, e o cliente aceitou a PMO com reservas. O objetivo declarado é ser visto como sócio estratégico. Por isso o kickoff foi desenhado simples: dentro da semanal que já existia, com poucos slides, adaptados do deck da PMO de Macro.

## O que é a fusão (corrigido pela cliente)
> [!important] Não nasce um banco novo
> No kickoff, a cliente corrigiu o slide da Visa. Banco Entre Ríos (BERSA) e Banco San Juan **integram-se ao Banco Santa Fe**. O Santa Fe mantém o CUIT, muda de nome (ainda indefinido) e de imagem, e tem upgrade tecnológico. O Banco Santa Cruz fica separado.

- Para a Visa, 4 emissores passam a 2.
- São dois momentos: nova marca do Santa Fe em **21/jun/2027** `[dia a confirmar]` e integração de Entre Ríos e San Juan em **9/jul/2027**. De fevereiro até a migração o cliente está em testes.
- O grupo quer uma integração "copy-paste" para dentro do Santa Fe. Damián resumiu o princípio: replicar no [[Emissor|emissor]] resultante o que existe hoje e simplificar depois.
- A mesma operação tem dois nomes conforme quem olha: para a [[Prisma]] é uma reclassificação (mesmas contas, [[BIN|BINs]] reatribuídos); para a Visa são bancos independentes e trata-se de transferência.
- Nenhum dos bancos é principal member. Garantias e operativa de liquidação passam pela [[Prisma]]; o banco só recebe a fatura.

## Histórico (linha do tempo)
- **28/set/2026** — Issuer Wallet: proposta pronta; cliente achou caro.
- **29/set** — Nasce a linha "Integración Bancos" na pipe.
- **05/out** — Issuer Wallet fica para depois da fusão. Reunião "Following Grupo Petersen PMO Proyecto 1" (sem transcrição).
- **19/out** — Issuer Wallet cancelado internamente.
- **22/out** — Minuta com 8 frentes (contratos Google/Apple, tokenização/Click to Pay, BINs, plásticos, mandatos, denominação, acessos, plataformas).
- **02/nov** — Proposta de PMO carregada; cliente disse sim.
- **05/nov** — Contrato anunciado; Bruno designado.
- **12/nov** — **Kickoff da PMO**; à tarde, sessão com Tesouraria; depois, alinhamento interno.
- **13/nov** — Reunião interna Visa sobre os códigos de tesouraria.
- **16/nov** — **Demo VDMU**. A sessão com a [[Prisma]] prevista para as 14h não aconteceu.
- **18/nov** — Reunião interna com Cindy, que fica fora até 27/nov.
- **19/nov** — Próxima semanal com o cliente.

## Kickoff (12/nov/2026)
A PMO apresentou cinco funções: governança (papéis e semanal), planejamento e seguimento, coordenação entre áreas e bancos, gestão de riscos e documentação num arquivo único. A parte mais útil veio do cliente, em três pedidos claros:

- **Nada pode ser bloqueante para a migração.** Daí a pergunta sobre [[Mandato|mandatos]]: se algum exige [[Waiver|waiver]], o grupo quer saber já.
- **Confirmações por escrito.** Google e Apple responderam verbalmente que a fusão não exige nada nos contratos. A Visa quer isso escrito e ainda não conseguiu. O mesmo vale para a [[Tokenização|tokenização]] e para a dúvida de o cliente final ter de voltar a enrolar o cartão nas carteiras.
- **A [[Prisma]] na mesma mesa.** Ficou acordado trazê-la ao espaço Visa–Grupo, porque o espaço que o grupo já tem com ela trata de outras marcas e outros temas.

## Sessão de Tesouraria (12/nov/2026)
O tema é [[Settlement|liquidação]]: como os fundos apurados pela Visa chegam à conta certa depois da fusão. Entram aqui as contas de liquidação internacional e doméstica, as hierarquias de liquidação, as licenças, os nomes legais e os relatórios.

A peça central são os **"numéricos de tesouraria"**: identificadores que a Visa atribui e partilha com o [[Processador|processador]], cada um ligado a uma conta de liquidação. Ao ceder os [[BIN|BINs]] de San Juan e BERSA ao Santa Fe, é preciso decidir que numérico aponta para onde. O grupo não conhece esses códigos, porque quem os opera é a [[Prisma]].

A sessão deixou duas mensagens Visa diferentes. Cindy pediu um levantamento completo antes de falar com a [[Prisma]] ([[BID|BIDs]] das quatro instituições, hierarquias, contas, nomes legais) e tratou-o como requisito para atribuir um implementador. Damián disse que há tempo de sobra. A cliente saiu a pedir que o tema não vire bloqueante.

> [!note] O que o time tirou da sessão
> Foi técnica demais para a audiência e não havia ninguém de tesouraria do banco. Regra adotada: reunião interna com cada equipe Visa **antes** de cada sessão com o cliente. A próxima de Tesouraria deve ter a tesouraria do banco e, de preferência, a [[Prisma]].

## VDMU — arte digital do parque tokenizado (16/nov/2026)
O problema do grupo: na fusão, todos os cartões de Santa Fe, San Juan e BERSA mudam de arte e de nome de emissor, incluindo os que já estão em carteiras digitais.

O **Visa Dynamic Metadata Updater** resolve a parte Visa sem desenvolvimento. O emissor altera a arte no portal de metadata ([[VCMM]] `[grafia do portal a confirmar]`, acessado pelo [[PRM (Visa Access)|Visa Access]]) e a Visa notifica os token requesters em nome dele ([[OBO (On-Behalf-Of)|OBO]]), que vão buscar a novidade ao [[VTS (Visa Token Service)|VTS]]. Sem o VDMU, mudar a arte no portal só vale para novos aprovisionamentos.

- **Limites:** só credenciais Visa; só por account range (o grupo já usa essa configuração).
- **Datas:** todos os emissores LAC ficam enrolados a partir de fev/2027, com opt-out. Como a fusão é em junho, não é preciso pedir ativação antecipada.
- **Preço:** cobrança desde 01/fev/2027, por notificação bem-sucedida a um device token. E-commerce / card-on-file não é cobrado inicialmente.

> [!warning] Preço ambíguo
> O valor foi dito como "0,01 centavos de dólar". Pode ser US$ 0,01 ou 0,01 centavo: 100 vezes de diferença. O grupo tem ~2 milhões de clientes com enrolamento automático no MODO, mais Apple e Google, logo até 3 notificações por credencial. **Confirmar no comunicado Visa antes de qualquer conta.**

Os cartões Mastercard do grupo ficam fora: o grupo tem de ver com a outra bandeira.

## Decisões e porquê
| Decisão | Porquê |
|---|---|
| Issuer Wallet só depois da fusão | Certificar 4 bancos quando 3 vão unificar não faz sentido |
| PMO só com VCA | Projeto de orquestração, sem implementação de produto por CS |
| [[Prisma]] vem ao espaço Visa–Grupo | O outro espaço do grupo com a Prisma mistura marcas e temas |
| Tesouraria: interno Visa → cliente → Prisma | Evitar acionar o processador sem a Visa ter a fotografia completa |
| VDMU em vez da API de metadata | Evita integrar, certificar e manter uma API para um uso único |

## Riscos de fundo
- **Dependência da [[Prisma]].** Executa quase tudo e reúne-se com o cliente às segundas sem a Visa. Proposta de Desi: duas cadências semanais, uma banco+Visa e outra tripartite, como na PMO de Macro.
- **Palavra sem papel.** Contratos de carteiras e re-enrolamento estão resolvidos só verbalmente.
- **Tesouraria.** Cindy ausente de 18 a 27/nov, com devolução ao cliente prometida para 19/nov.
- **Perceção de valor.** A PMO entrou tarde num projeto do cliente; cada sessão mal preparada pesa mais.

## Em aberto
- Dia exato da nova marca do Santa Fe e nome novo do banco.
- Frentes "acessos" e "plataformas" e o tema [[Click to Pay]]: não tratados até 16/nov.
- Benefits: sessão com o grupo por marcar.
- Cargos de Gabriela e Damián; quem é a "Gaby" antes citada como PM.
- Duração contratual: "9 meses" × anotação "3 meses" na Weekly Tech de 11/nov.
