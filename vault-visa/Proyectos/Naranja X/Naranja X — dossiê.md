---
tags: ["proyecto", "cliente/Naranja-X"]
fuente: Transcrições automáticas de reuniões (set–nov/2026) — Naranja X, Weekly Tech e 1:1 internas
estado: parcial
---

# 🇦🇷 Naranja X (Argentina) — migração do pré-pago/débito para a Pismo

> [!success] Confirmado por Bruno em 16/11/2026
> A **PMO formal do projeto é a Jenny Johansen**; Bruno apoia.


> [!info] Dossiê de projeto (contexto qualitativo)
> O acompanhamento **vivo** (pendências, datas) está no app e na ficha `projetos/projeto-naranja-x-pismo.md`. Aqui ficam o contexto, a história, as decisões e o porquê.

> [!warning] Fonte não validada
> Tudo vem de transcrição automática, com falantes anonimizados e gravações cortadas. O que está marcado `[a confirmar]` não foi validado com ninguém. Data de corte: **16/11/2026**.

## Ficha
- **Cliente:** Naranja X, fintech associada ao Banco Galicia; Principal Member da Visa. **País:** Argentina.
- **O que é:** troca de [[Processador]] do pré-pago e do débito Visa — da Global Processing (GP) para a Pismo. Naranja executa; a Pismo habilita a plataforma; a Visa faz PMO e capacitações. Não é projeto de carteira digital nem de SDK.
- **Fora do escopo:** crédito, que está na [[Prisma]] — tema que não se discute com o cliente sem consulta interna.
- **Terceiros:** GP (processador atual); [[Thales]] ([[Tokenização|tokens]] e 3DS, mantidos na fase 1); BCRA (regulador).
- **Contrato Visa:** advisory de 6 meses — PMO da migração + capacitações + apoio de desenho funcional. Não inclui gap analysis.
- **Pessoas —** Naranja: Gabriela "Gaby" Conte (meios de pagamento), Marcos Mambrín (líder técnico inicial), Ariel (substitui Marcos), Cristian "Cris" (decisor), Federico Cánepa (contrato). Visa: Jenny Johansen (lidera o PMO), Bruno (apoio), Lina Torres (PM nomeada no início), Desi Ovejero (kickoff), Ale Rosa `[grafia a confirmar]` (dono do contrato), Mariana Bellino (capacitações), Melina "Meli" Albornoz ([[CS Implementations]]). Time Pismo: Fede (comercial) e Leonel "Leo" Cuevas (técnico). NTConsult: Bruno Oliveira e Yves Abreu `[grafia a confirmar]` (especialista Pismo, sob demanda).

## Status atual (base: Weekly Tech de 16/11/2026)
**Vermelho (sugestão).** O contrato Naranja–Pismo foi assinado (~05–11/11) e a Pismo designou um PM em 13/11, mas **não dá data de kickoff por falta de recursos**; sem isso, CS não abre o projeto na Visa. Ao mesmo tempo, o contrato de advisory de 6 meses "vai ficar curtíssimo" diante de um plano de 9 meses — há uma conversa de renovação a ter com o cliente.

Cinco dias antes, pela ótica das reuniões com o cliente (sessão técnica de 11/11), a leitura era âmbar tendendo a positivo: contrato destravado, dúvidas técnicas resolvidas, sandbox prometido em dias, roadmap preliminar em **junho** (o cliente quer **maio**; ano não dito, 2027 por dedução). As duas leituras ficam registradas; a mais recente manda.

## Frentes
| Frente | Situação |
|---|---|
| Contrato Naranja–Pismo e Solution Design | Contrato assinado; falta a adenda sobre o arquivo de [[Clearing]] sem tratamento (PCI). Solution Design na versão 4, assinatura formal não confirmada |
| Abertura do projeto Visa e kickoff | **Bloqueada**: Pismo sem recursos e sem data de kickoff |
| [[BIN]] novo de débito | BINs atribuídos e deliberadamente sem configurar; certificação completa (~90 dias) só depois do kickoff Visa |
| Migração Big Bang dos BINs atuais | Não iniciada; track separado, depois do BIN novo |
| Capacitações | 4 módulos virtuais incluídos no contrato, da semana de 16/11 ao início de dezembro |
| Governança e plano integrado | Weekly + planilha + minuta funcionando; plano consolidado Visa+Pismo atrasado desde ~22/10 |

## A história

### Um projeto vendido antes de ter dono (set/2026)
As conversas entre Naranja e a Visa/Pismo vinham de dezembro de 2025. Quando o advisory da Visa foi assinado, quem o tinha vendido já estava de saída para outra conta, e a PM nomeada acabava de voltar. O resultado foi um kickoff montado às pressas: o deck veio da NTConsult, foi adaptado ao padrão do kickoff do BancoEstado, e o escopo contratual só foi lido em detalhe no próprio dia do kickoff. Daí saiu a primeira lição: **reconstruir contrato e escopo antes de falar com o cliente**.

O kickoff (~30/09) correu mal na avaliação interna. O cliente questionou slides genéricos (embossing, que Naranja faz por conta própria), disse que as respostas à sua planilha de dúvidas não respondiam ao que perguntava e, pouco depois, descobriu-se que a Pismo já tinha uma frente em andamento com o cliente que o kickoff não cobria.

### A regra da mensagem única (02/10)
Na sexta seguinte, o time Pismo dentro da Visa pôs ordem na casa. Três regras que valem até hoje:
- Pergunta sobre a Pismo, processamento ou mensageria **não é respondida pelo PMO**: vai para Fede e Leo.
- As capacitações explicam "a relação com a Visa tendo a Pismo como processador" — a Pismo faz muito menos que a GP.
- Crédito não se toca.

> [!warning] Vocabulário
> O cliente e o deck chamam o projeto de "Switch Débito" e "autoprocesamiento"; as sessões técnicas de quarta levam "Autoprocesamiento" no título. **Nenhuma transcrição define o termo.** A Pismo pede para não usar nem "switch" nem "autoprocesamiento" — dizer que a Pismo é switch é "completamente incorrecto". A fórmula pedida: "se van a procesar con Pismo; Pismo zero balance, zero decision". Nos entregáveis, descrever em palavras e não inventar definição.

### Troca de PM na primeira semana (06/10)
Lina saiu de licença e Jenny assumiu, com Bruno de apoio. Fede aproveitou para redefinir o que espera do PMO: não ser especialista em Pismo, e sim **coordenar as três partes** (Pismo, Visa, cliente), cuidar de minutas e reuniões e manter uma mensagem só. E avisou: nenhum prazo é firme antes do Solution Design; tudo é referência "con asteriscos". Não há registro formal da passagem de PM, e as fontes divergem sobre quem é a titular — ver lacunas.

### Big Bang, e por quê (07–08/10)
O produto de Naranja tem **dois BINs no mesmo plástico** — banda de um, chip de outro, pré-pago e débito. A regra da marca é que um [[BIN]] inteiro pertence a um único processador, então a gradualidade mínima é um BIN por vez. Fasear por faixas exigiria abrir os BINs de 6 dígitos em BINs de 8 (~200 no total): não é automático e multiplica os BINs sujeitos a programas de penalidade por taxa de aprovação e de tokenização. Somando o custo de operar chargebacks e acompanhamento em dois processadores ao mesmo tempo, Cris deu o "no go" ao progressivo. Ficou **Big Bang**, mitigado com mais tempo de piloto interno ([[Friends and Family]]).

A mesma conversa matou a expectativa de um marco produtivo em 2026. A diretoria de Naranja queria algo para mostrar em dezembro; a resposta foi que, com o freeze da marca (12/12 até 6 de janeiro, valendo também para sandbox), produção em dezembro é impossível. O que se pode construir é uma **narrativa de avanços não produtivos**: BIN pedido, janelas de certificação marcadas, APIs integradas, sandbox configurado.

Daí a estratégia em dois tempos, ratificada pelo cliente em 08/10: **primeiro um BIN novo de débito** (o marco), **depois a migração** dos BINs atuais, em track separado. A carteira dual atual migra como está e morre por vencimento natural (horizonte citado: 2032 `[a confirmar]`).

### O alerta de CS que ninguém levou ao cliente
Desde a véspera do kickoff, Implementations avisava: a Pismo tem pré-pago e crédito em produção na Argentina, **não débito**. Consequências: certificação completa (~90 dias do kickoff Visa à produção) em vez de uma cópia de configuração; risco de a Pismo ter de desenvolver no meio do projeto; e a dúvida sobre o regulatório/fiscal local. A Pismo respondeu que, tendo adequado a plataforma para pré-pago, não precisa de ajustes para débito — "a validar na prática". O risco foi deliberadamente deixado fora do deck de kickoff.

Da mesma reunião interna saiu a orientação de Meli que hoje explica o bloqueio: **não abrir o projeto Visa antes de a integração Naranja–Pismo estar avançada**, senão ele fica parado e a certificação "cai".

### Seis semanas de contrato (08/10 → 11/11)
O contrato Naranja–Pismo foi o gargalo de outubro. Em 15/10 as cláusulas comerciais estavam fechadas (data efetiva 01/11) e restava uma cláusula de cumprimento regulatório do BCRA, exceção que a Pismo normalmente não inclui. Em 05/11 havia OK contratual; em 11/11 a Visa dizia ter recebido o contrato.

Em paralelo corria a discussão do arquivo de [[Clearing]]. O padrão da Pismo é entregar um relatório com o número do cartão trocado por um ID interno; Naranja queria o arquivo da Visa tal como vem. Como Naranja não é PCI, isso exigiu validação interna e uma adenda que exime a Pismo pelo manuseio do dado. Decisão registrada em 28/10: **a assinatura do contrato não fica presa a essa definição** — por isso o contrato fechou e a adenda segue pendente.

### O plano que não fechava (out–nov)
O plano consolidado foi prometido ao cliente para ~22/10 e escorregou até 12/11. O motivo apareceu em 03/11: o plano padrão da Pismo ("tempo comercial", ~8 meses até a migração, BIN novo no mês 5) e o plano de Implementations não casavam — produção defasada em ~2 meses, testes em ~3. Fede deu o critério: **três marcos têm de coincidir** entre os dois planos — certificação com a Visa, produção do BIN novo, produção da migração. E Leo deu o conselho de expectativa: melhor passar o prazo longo e encurtar depois.

### Capacitações: o que o contrato cobre
Com a saída da GP, Naranja passa a operar sozinha disputas, fraude, conciliação e relatórios. O pacote contratual virou 4 módulos virtuais de ~1h: Autorizações, Conciliações e pagamentos, Fraude e disputas, Compliance de marcas. Não cobrem o uso prático das ferramentas, porque Naranja ainda não tem acesso — isso fica para um treinamento pago perto da produção. A maior lacuna prevista é disputas.

## Como este tipo de projeto funciona (resumo)
- **Processador mínimo.** No modelo *zero balance*, a Pismo recebe a autorização da Visa, chama o webhook do [[Emissor]] e devolve à rede a resposta que o emissor der. Saldo e decisão ficam com o emissor. A mensagem [[ISO 8583]] completa chega por fila, para rastreio.
- **Um identificador por cliente.** A Pismo sobe um identificador de processador novo para cada cliente (ouvido "PCR" `[sigla a confirmar]`), e os BINs se associam a ele — só com contrato assinado.
- **BIN novo não se configura cedo.** Configurar é amarrar a um processador; no antigo, vira migração.
- **A Visa entra por último.** Contrato → integração do emissor com as APIs do processador → abertura do projeto com a marca → certificação → piloto → produção.
- **Dois sandboxes.** O do processador (sem Visa, dados fictícios) e o da Visa (com a marca).
- **Quem responde pelo quê.** Atualizações obrigatórias de processador ficam com a Pismo ([[Mandato]]); fees por desempenho, regras de fraude, disputas, conciliação e [[Settlement|liquidação]] são do emissor.
- **Tokens e chaves.** O [[TSP (Token Service Provider)|TSP]] pode ficar onde está; as chaves do emissor precisam ser cedidas pelo processador de saída.

## Decisões e o porquê
- **Big Bang em vez de progressivo** — custo e risco de dois processadores e ~200 BINs de 8.
- **BIN novo antes da migração** — é o que permite dar um marco ao cliente mais cedo, só com altas novas; a migração fica para depois.
- **Sem marco produtivo em dezembro** — freeze da marca.
- **Tokens e 3DS com a Thales na fase 1** — evita certificação e migração de tokens.
- **Histórico transacional não migra.**
- **Contrato sem esperar a definição dos arquivos** — para destravar o projeto.
- **PMO não responde pela Pismo** — mensagem única.

## Lições
> [!tip] O que levar para o próximo projeto com a Pismo
> 1. Checar com CS, antes de vender prazo, se o processador já tem o produto em produção no país.
> 2. Contrato assinado não é projeto aberto: sem recursos do processador não há kickoff nem abertura em CS.
> 3. Nenhuma data ao cliente antes do Solution Design; quando houver dois planos, ancorar em três marcos comuns.
> 4. Conferir a duração do advisory contra o roadmap do processador antes de assinar: aqui são 6 meses contratados e, já no kickoff, Lina e Bruno achavam pouco.
> 5. Separar o que é Visa-com-Visa antes de mandar planilha ao cliente.

## Em aberto que pede decisão
- **Data de kickoff da Pismo** — sem ela nada anda do lado Visa.
- **Renovação do contrato de advisory** — 6 meses contratados × plano de 9.
- **Data-alvo** — cliente quer maio, roadmap diz junho; não está claro se "junho" é a migração ou o fim do projeto.

## Lacunas
- Quem é a PM formal hoje (Lina nomeada em 28–29/09; Jenny lidera desde 06–13/10; Bruno apoio).
- "Global Payments" (um áudio interno) × "Global Processing" (reuniões de projeto) como nome do processador de origem.
- Significado de "autoprocesamiento"; nome correto do projeto nos entregáveis.
- Ano das datas-alvo; data exata de assinatura do contrato Naranja–Pismo; datas de início e fim do contrato Visa.
- Sem transcrição: weekly de 22/10, sessões técnicas de 14 e 21/10 e 04/11, e o que houve com o cliente depois de 11/11.
- Grafias e siglas ouvidas e não confirmadas: "PCR", "EP-747/EPM-747", "B-Roll" (ferramenta de disputas), sobrenomes de vários participantes.
