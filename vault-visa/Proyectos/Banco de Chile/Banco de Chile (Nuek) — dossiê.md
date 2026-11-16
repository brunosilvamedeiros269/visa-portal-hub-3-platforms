---
tags: ["proyecto", "cliente/Banco-de-Chile"]
fuente: Dailies de estabilização — Banco de Chile × Nuek; transcrições automáticas de ago–nov/2026 (não validadas)
estado: parcial
---

# 🇨🇱 Banco de Chile × Nuek — migração de processador

> [!info] Dossiê de projeto (contexto qualitativo)
> Única frente da base que **não é implementação de produto** e sim **estabilização pós-migração**. A cadência é diária, o insumo é a fila de tickets e o papel do PM é governança sobre a fila, não sobre um cronograma de marcos.

## Ficha
- **Cliente:** Banco de Chile. **País:** Chile.
- **Escopo:** migração da plataforma de processamento de cartões para a **Nuek**, com estabilização pós-produção.
- **PM Visa:** Lina Torres — substituída por **Bruno Medeiros** durante a licença (ago/2026). Consultoria **CYBS** citada no contexto do projeto *(não aparece nas transcrições — confirmar)*.
- **Fase:** **estabilização** — sistema em produção, fila ativa de incidentes.

**Contatos —** Nuek *(atribuições a confirmar)*: Sebastián ("Seba", conduz a daily), José / José Luis (parametrização), Waldo, Pedro, Sebastián Tobar. Banco de Chile: Claudia (liderança operacional), Paola ("Pau"), Joyce, Tatiana ("Tati"), John, Claudio, Jorge Borque, Luis, Gonzalo, Erika, Carlos, Francisco, Mayra. Há um **analista baseado na Espanha** envolvido em temas específicos.

## Governança
- **Daily "Estabilización Migración"** entre banco, Nuek e Visa — revisão de tickets resolvidos e pendentes com planilha compartilhada.
- **A partir de ~19/ago/2026: daily fixa às 08h00 por 2 semanas** (com Luis e Gonzalo), com as reuniões da tarde suspensas até o retorno da Erika (~1/set).
- Reuniões internas (ex.: 10h30) e ad hoc por tema.
- Tickets com numeração de 6 dígitos (séries 45xxxx / 46xxxx).

## Domínios afetados
Emissão e reemissão de cartões (bloqueio, reposição, embossing, reimpressão, renovação) · cartões virtuais · cartão empresa / estrutura *business* · autorizações e transacionalidade (avance, reversas/anulações, taxa zero, montantes menores, cota controlada) · base de clientes · relatórios e estatísticas (**LCN**) · canais (app, banco em linha, caixa, banca telefônica, agência).

**Sistemas citados:** LCN, MSF, IRD, EPCF/BCF, SAC, SAT, DEM; legado **Nexus** *(a confirmar)*. Bandeiras Visa e Mastercard.

## Status atual (base: Weekly Tech interna de 16/nov/2026)
> [!warning] Atualização a partir de transcrições automáticas — não validada
> Entre 4/set e 27/out não há reunião com o banco nos arquivos; o estado recente vem de relatos internos da Visa.

**A migração terminou e o projeto está em fechamento.** Foram **4 migrações**, com todos os BINs migrados, [[Friends and Family|F&F]], capacitação e gestão da mudança concluídos e **772 tickets fechados** (dado de 27/out). Em 16/nov a migração é descrita como "va bien". O engajamento atual vai **até dezembro**; as dailies pararam antes de 19/out. O vídeo de fechamento está pronto desde 28/out. A conversa agora é comercial: uma **etapa 2 com a CYBS** para funcionalidades nativas da Nuek (~USD 900 mil, ~9 meses, 10 funcionalidades — aguardando OK formal do banco) e, mais adiante, **Featurespace** (o banco indicou Q2 FY27).

## Status atual (base: daily de 18/ago/2026)
> [!note] Registro de 18/ago, mantido como histórico — o status vigente é o bloco acima.
Fila ativa, com alguns temas já dados por fechados (incidente "incoming Visa", BCF) e outros que são **regressões ou funcionalidades perdidas na migração** — categoria que merece atenção especial porque não aparece como bug, aparece como "o sistema não faz mais isso".

## Temas abertos
| Tema | Descrição | Prazo |
|---|---|---|
| **Ticket do Francisco** (+ ~2 correlatos) | Compromisso reafirmado ao banco | **20/ago (máximo)** |
| **Erro de reversa no canal caixa** | O serviço recebe a informação em `0`, tenta converter para data, não encontra e devolve resposta negativa ao canal. Todo o fluxo prévio funciona. Pedido: enviar data (ano+dia) e hora nos valores da reversa, como já ocorre no pagamento | — |
| **Estrutura *business* / cartão empresa** | 295 contas regularizadas e enviadas. Aberto: quem executa a mudança de conta de controle → conta de empregado. Cartão empresa criado por **DEM** saiu como **pessoa natural** — e com giro de pessoa natural não dá para associar estrutura empresa | confirmação 18/ago |
| **Renovação antecipada** | Existia no legado e **não funciona na Nuek**: o processo emite uma reimpressão, sem cartão ativo e sem alterar a validade. O **IRD** não distingue renovação normal de antecipada. Existe parâmetro "meses antes do vencimento", hoje em **5 meses** — alterá-lo é **global** e impacta plásticos e processos | reunião dedicada a marcar |
| **LCN — inversão de moeda** | **Desde 15/jul/2026** a proporção virou: ~80% dólar / 20% peso (antes o inverso). A LCN é base de estatísticas e consulta de transações para várias áreas | ticket a abrir |
| **Cartão virtual** | Transações aprovadas operando bem em ambos os BINs com mensagens **1100**; chamou atenção a chegada de mensagens **1120** (advice da bandeira). Novo caso de **rejeição por CVV** | ticket a abrir |
| **Erro 5906 — "Excedido operaciones diarias"** | Rejeição de **anulação** (código de transação 17). Tese do banco: anulação/devolução deveria **subtrair** do contador, não somar. Caso conexo: avance aprovado no processador e revertido nos canais (possível *timeout*), deixando **cota tomada** | sem replicação |
| **Ticket de cota controlada** | — | **31/ago** |
| **Bloqueio com reemissão** *(outra daily)* | Ao bloquear o cartão pelo app ou banco em linha, **o cartão bloqueia mas o novo não é gerado**. Regressão: antes funcionava. Fluxo esperado: bloqueia → novo gerado sem número novo, com PIN, na carteira digital; físico com embossing na hora em qualquer agência. **Nem todas as agências conseguem embossar sem número novo.** Contorno conhecido: eliminar cookies e cartões em processo | — |

## Decisões (18/ago/2026)
1. **Abrir ticket específico para a LCN**, separado do "ticket gigante", por rastreabilidade.
2. **Abrir ticket para o cartão virtual rejeitado por CVV**, consolidando os casos reportados.
3. **Não forçar manualmente** uma renovação antecipada para o cliente pontual — tratar via parâmetro, em reunião específica com os especialistas (incluindo plásticos).
4. Reunião dedicada ao ticket **456675** (reposição × embossing).
5. **Daily fixa às 08h00 por 2 semanas**; reunião da tarde reagendada para depois do retorno da Erika.
6. Caso do cartão empresa criado como pessoa natural: enviar antecedentes por e-mail para análise.

## Riscos
1. **Funcionalidade perdida na migração** — a renovação antecipada existia no legado e não existe na Nuek. A alternativa (mexer no parâmetro de 5 meses) é **global**, com efeito colateral amplo. *"Puede cambiar un solo parametrito, puede gatillar quizás cuántas cosas."*
2. **Distorção da LCN** — a base de estatísticas do banco não é confiável desde 15/jul.
3. **Cartão virtual** com segundo caso de rejeição por CVV e mensagens 1120 inesperadas — não é problema isolado.
4. **Cota tomada indevidamente** em *avances* — adiantamentos em dinheiro (divergência processador × canais) — impacto direto e recorrente no cliente.
5. **Volume e emaranhamento de tickets** — risco explicitado pelo próprio banco de perder rastreabilidade dentro de um ticket gigante.
6. **Transição de PM em pleno período de instabilidade.**
7. Dependência de analista externo com restrição de fuso.

## Linha do tempo (ago–nov/2026)
- **26/ago/2026** — 1:1 de contexto com o banco: **142 tickets abertos, 34 prioritários**; 65 em Nuek sem data-objetivo. Bruno assume o caso do bloqueio por fraude que não chega à marca.
- **27/ago/2026** — A diretoria do banco aprova pagamentos e ajustes por *data-valor*. Do lado comercial, o sponsor de meios de pagamento sai em 31/ago.
- **~28/ago/2026** — Daily: recusas que o atendimento não consegue ver; a Visa já havia respondido o caso de fraude.
- **4/set/2026** — Daily: erro criptográfico do [[BIN]] 415282 com correção no dia; Bruno acionado num segundo caso com a marca (fallback manual).
- **5/out/2026** — Lina dá o contexto ao time: CYBS com 9 pessoas, contrato até dez/2026, funcionalidades que a Nuek não entrega.
- **19/out/2026** — As dailies pararam; no time ninguém sabe se o contrato segue.
- **26–28/out/2026** — Pedido, roteiro e entrega do **vídeo de fechamento**.
- **2/nov/2026** — Proposta de renovação (2 funcionalidades, USD 385 mil, 4 meses) enviada; Featurespace indicado para Q2 FY27.
- **10/nov/2026** — Reunião com o decisor do banco sobre a renovação: "positiva".
- **16/nov/2026** — Oportunidade montada para 10 funcionalidades, ~USD 900 mil, ~9 meses; aguardando OK formal.

## O papel da Visa na estabilização
O dossiê acima descreve a fila; faltava registrar **de que lugar** a Visa olhava para ela. No 1:1 de 26/ago o próprio banco resumiu: até então a Visa escutava as reuniões e recebia as apresentações, e só tinha participação ativa em casos em que podia acelerar algo com a marca. Internamente o desenho é o mesmo: a Visa atua como PMO, a integração é conduzida pelo time da CYBS, e **dúvidas técnicas do cliente não têm dono na Visa** quando não há frente técnica contratada.

Dois casos puxaram a Visa para dentro:

- **Bloqueio por fraude que não chega à marca.** Com a Nexus, um bloqueio por fraude ou roubo aparecia de imediato na Visa; depois da migração, o bloqueio é feito mas não se reflete. A Nuek abriu ticket nas duas bandeiras sem solução, e o caso ficou parado na Visa por troca de responsável. A resposta da Visa (registrada em ~28/ago): **não havia problema de conectividade — o conteúdo da mensagem estava errado**. A correção ficou do lado da Nuek, com data 7/set *(desfecho não consta)*.
- **Fallback manual.** Em 4/set o banco relatou ter aberto caso na Visa sobre transações com codificação manual recusadas pela Nuek e pediu apoio para uma reunião. O trecho do áudio é contraditório sobre a posição da Visa *(a confirmar no e-mail do banco)*.

> [!tip] Aprendizado
> Caso com a marca precisa de **dono nomeado** e passagem formal em férias e saídas. Foi o ponto em que o cliente mais sentiu a ausência da Visa.

## A dor central: recusas que o atendimento não vê
Além das regressões já listadas, a estabilização teve um problema transversal de **visibilidade**. Uma recusa do motor antifraude (Monitor) aparecia no SAT como "aprovada + anulação aceita" e na LCN como recusa; a Nuek respondia um código e a bandeira mostrava outro. As linhas de atendimento só veem o SAT, não sabiam que deviam marcar o cliente como VIP para liberar, e escalar ao segundo nível penaliza as métricas delas. Clientes de alto valor ficaram sem conseguir comprar e sem explicação.

Por decisão do banco, esses tickets **não foram marcados como "proyecto"**, para não inflar o estoque da estabilização — o que ajuda a ler os números, mas esconde a dor. A Nuek levou o tema a uma mesa de "glosas e fluxo" *(estado posterior desconhecido)*.

Outros temas de fundo do mesmo período: reversa que conta no limite diário de operações (solução levada a produto, sem data); *data-valor* com devolução de impostos, possível em duas fases; erro criptográfico ligado à parametrização de CVV depois da abertura de intervalos de BIN para cartão virtual.

## Fechamento e vídeo de encerramento (out/2026)
O fechamento foi contado a partir do deck que a CYBS completou em 27/out:

- **Objetivo:** assegurar continuidade, estabilidade e controle durante execução, go-live e estabilização.
- **Entregue:** 4 migrações, todos os F&F, capacitação e gestão da mudança; estabilização em etapa de fechamento.
- **Equipe:** não só PMO — suporte à certificação com as bandeiras, contabilidade e regulação, especialistas técnicos, suporte à migração. Coordenação central da Visa ([[VIS (Visa Implementation Services)|VIS]] + CYBS) entre banco, processador novo, bandeiras e processador anterior.
- **Indicador:** 772 tickets fechados. Decidiu-se usar **apenas indicadores com número comprovável**.
- **Valor técnico:** a validação financeiro-contábil pós-migração (competência, juros, diferenças), feita quase caso a caso.
- **Legado:** modelo de seguimento instalado e marco de validações pós-migração; os pendentes principais ficam para **2027**, sem linha de tempo.

O vídeo, pedido pela direção, ficou pronto em 28/out (~3 minutos, roteiro por cenas, feito com Claude). A alternativa Copilot + Clipchamp foi apresentada ao time no mesmo dia; um aprendizado útil: anexar a PPT faz o Copilot narrar o deck inteiro, incluindo o aviso de confidencialidade.

> [!note] "Fechado" não é "terminado"
> O material é de fechamento, mas em 27/out o engajamento ainda tinha dois meses pela frente — para priorizar os pendentes e montar o roadmap de 2027.

## O que vem depois: etapa 2 e Featurespace
**Etapa 2 com a CYBS — funcionalidades nativas da Nuek.** A migração deixou funcionalidades que a Nuek não entrega como a Nexus entregava; a renovação é a proposta de construí-las. A cotação evoluiu em três semanas: 2 funcionalidades / USD 385 mil / 4 meses (2/nov) → três tamanhos (5/nov) → 10 funcionalidades / ~USD 900 mil / ~9 meses (16/nov). São cenários da mesma cotação (2, 5 e 10). A reunião de 10/nov com o decisor do banco foi positiva; falta o OK formal.

**Featurespace.** Oportunidade separada, que não deve ser misturada com a migração. O banco quer internalizar a gestão de fraude hoje feita pelo processador, e a Nuek não tem integração com Featurespace. Seria a primeira implementação prevista com as transações indo direto da [[VisaNet]] para a Featurespace. Abordagem aprovada pelo cliente: primeiro assessment (as-is, arquitetura futura, roadmap), depois implementação. Depende de um novo acordo de incentivos e da disponibilidade dessa interface; o banco indicou Q2 FY27.

## Lacunas desta atualização
- Quantos tickets seguem abertos e o que entrou nos "pendentes de 2027".
- Desfecho dos dois casos com a marca.
- Se o contrato atual termina em dezembro ou é absorvido pela etapa 2; quem responde pela governança com as dailies paradas.
- Quais são as 10 funcionalidades da etapa 2.
- Relação societária entre Minsait, Nuek e Nexus — dita de formas diferentes em 5/out e 27/out; não usar em material sem verificar.
- A CYBS está confirmada nas transcrições de set–nov como o time que conduz a integração *(a nota "confirmar" da ficha acima fica superada quanto à presença; o papel exato segue a confirmar)*.

---
[[Home]]
