---
tags: ["proyecto", "cliente/BancoEstado"]
fuente: Sesiones de presentación del proceso — BancoEstado (ago/2026); transcrições automáticas de reuniões set–nov/2026 (não validadas)
estado: parcial
---

# 🇨🇱 BancoEstado (Chile) — Apple Pay + SDK Visa

> [!success] Confirmado por Bruno em 16/11/2026
> O **kickoff de Implementations (projeto técnico) é em 25/11/2026**.


> [!info] Dossiê de projeto (contexto qualitativo)
> Projeto **ainda não aberto**. Aqui fica o registro das duas sessões de apresentação do processo, antes da abertura formal.

> [!important] Atualização de 16/11/2026
> O texto até a linha de separação mais abaixo é o registro de **agosto/2026** e foi mantido como estava. O que aconteceu de setembro a novembro — contrato, kickoff, os três pré-requisitos que seguraram a abertura e o estado atual — está em **«Atualização set–nov/2026»**, no fim desta nota. Onde os dois textos divergem, vale o bloco novo.

> [!note] Estado desta nota
> As duas transcrições disponíveis **não trazem data absoluta** — sabe-se apenas que são de dias consecutivos, com a segunda às 16:00. Datar antes de usar como referência histórica.

## Ficha
- **Cliente:** BancoEstado. **País:** Chile.
- **Produto:** **Apple Pay** com integração do **SDK da Visa** no app do banco. O SDK é **pré-requisito** do Apple Pay.
- **Estágio:** **pré-projeto** — *"es que no hay proyecto… todavía estamos en los temas contractuales"*. Sem projeto aberto não há PM técnico designado.
- **Fornecedor do banco:** **Veritran** — já certificada como [[TSP (Token Service Provider)|TSP]], mas falta o registro como **[[Third Party Agent|agente terceiro]]**.

**Contatos —** Visa: **Soledad Rúa** (diretora de Implementações Conosur), **Jenny Johansen** (PM funcional), **Bruno Da Silva** (PM funcional), **Lorena Retamales** ([[CSM (Customer Success Manager)|CSM]] dedicada), Gerardo (contratos/Digital Enablement), "Pancho"/Francisco (técnico). BancoEstado: Ángela (coordenação do projeto, com Rodrigo Miranda e Cynthia), Oscar (chefia de tecnologia), **Felipe Muñoz** (líder técnico), Claudio e Claudia (produto), Marcelo, Humberto (autorizações), Jorge Núñez (revisão contratual).

## Status atual
> [!warning] Superado — ver «Status em 16/11/2026» no fim da nota
> Este quadro retrata agosto. O contrato de acompanhamento foi assinado na primeira semana de setembro; o contrato com a **Apple**, dado aqui como assinado, só aparece assinado e carregado no [[Partner Hub]] na weekly de 14/10 (em setembro ainda era um dos três pré-requisitos abertos).

Travado no **contratual**. Três contratos estão em jogo e o terceiro é o que impede a abertura:

| Contrato | Situação |
|---|---|
| Com a **Apple** | ✅ **Assinado** — anexar ao caso na abertura |
| **SDK da Visa** | Em assinatura, "dentro destes dias" |
| **Serviço de acompanhamento / consultoria Visa** | ⚠️ **Não contratado** — é este que trava a abertura e a designação do PM |

**Desbloqueio decidido:** a Visa **libera o SDK antes da assinatura**, via [[VDP (Visa Developer Platform)|VDP]], assim que o banco enviar nome + e-mail dos usuários — para não travar o avanço técnico.

## O conflito central: prazo
| | |
|---|---|
| **Meta interna do banco** | **Produção idealmente em dezembro** |
| **Plano do banco** | 3 semanas de pré-requisitos + **18 semanas** de configuração/desenvolvimento (4 do banco + 14 atribuídas à Visa) |
| **Leitura da Visa** | 3 semanas de pré-requisitos é curto; o cronograma do banco lê como **~8 meses** |
| **Benchmark declarado** | *"No tenemos un caso en la región, incluyendo Chile, Argentina, Uruguay, que se haya hecho en menos de seis meses."* |
| **Resposta do banco** | *"No tiene por qué ser una limitante, porque podríamos ser el primero."* |

> [!warning] Mal-entendido de fundo que já foi corrigido em reunião
> O plano do banco atribuía **14 semanas à Visa**. **A Visa não desenvolve.** Entrega bibliotecas/SDK, guia técnica, apoio de consultoria, configuração do lado Visa e certificação — todo o desenvolvimento (front, back, wallet, portal, [[Wallet Extensions]], carga de certificados) é do banco. Vale registrar isso por escrito antes de o projeto abrir.

## Tempos apresentados ao cliente
- Pré-requisitos: **3 a 4 semanas** se o cliente estiver quase pronto; há casos reais de **3, 4 e até 6 meses**.
- Só a implementação de Apple: **4 a 6 meses**.
- Pacote SDK + Apple: **7 a 8 meses** até o go-live, com a **certificação (~1 a 1,5 mês) já dentro**.
- Acompanhamento produtivo pós-go-live: **~2 semanas**.

## Pré-requisitos
| Item | Situação |
|---|---|
| Caso via **BCH no [[PRM (Visa Access)|Visa Access]]** + formulário + **[[SOW Token Service|SOW]]** | A preencher com apoio da CSM |
| Contrato do SDK | Em assinatura |
| Contrato com a Apple | ✅ Assinado |
| Serviço de acompanhamento | ⚠️ Não contratado |
| Enrolamento no [[VDP (Visa Developer Platform)|VDP]] | Pendente. **Bloqueio:** o banco filtra links em e-mails externos; o TI precisa liberar |
| Terceiros como [[Third Party Agent|agente terceiro]] | Veritran é [[TSP (Token Service Provider)|TSP]] certificada; falta o registro como agente terceiro |
| APIs de [[Tokenização|tokenização]] | Já operam para Google Pay e carteira própria. **Ambiguidade aberta:** quais APIs são do core do banco, quais da Veritran e quais são as APIs Visa do TSP |
| [[BIN|BINs]] tokenizados | ✅ **Verificado — OK** |
| [[Tap to Add Card]] | Mandato ao qual o banco não aderiu antes |
| VRM | Já usam; criar as regras do projeto antes de produção |
| [[Step-up]] adicional | Hoje **só OTP SMS**. A Apple exige mais — provável **app-to-app** via Veritran, com certificação junto à Visa. **Esforço não dimensionado** |

**Critério de abertura:** os desenvolvimentos **não precisam estar prontos, mas avançados e com prazo dimensionado** — a Visa não mantém projetos abertos sem avanço.

## Pontos técnicos registrados
- **[[Tap to Add Card]] não exige desenvolvimento de leitura** — quem lê a antena NFC é a Wallet. Para o banco, o que muda é receber um **valor novo num campo já existente** de origem do provisionamento. Precisa ser validado com o time de **autorizações** para não quebrar a mensageria.
- **O CVV não chega ao emissor** nesse fluxo — a Visa valida com as próprias chaves. **Risco concreto:** *"algunos bancos erróneamente… lo desarrollaron de manera dura, que todo provisionamiento tenía que venir con CVV y si no venía lo declinaban"*.
- Os métodos de [[Step-up|step-up]] são desenvolvimento do banco, mas **certificados com a Visa**.
- **13 requisitos funcionais da Apple** citados como lista de referência.
- Documentação do SDK: **~500 páginas**, entregue poucos dias antes.

## Governança proposta
Kick-off com stakeholders · **reunião semanal** de avanço · espaços ad hoc (produto, CSM) · **SteerCo mensal ou bimestral** · **~2 semanas de monitoramento produtivo** pós go-live. Sessões de consultoria ad hoc (ex.: regras de VRM fora do padrão) são **pagas**.

## Pendências e riscos
- **Assinar o contrato do SDK** e **decidir a contratação do acompanhamento** — sem isso não há projeto.
- **TI do banco liberar e-mails com link** para acesso ao [[VDP (Visa Developer Platform)|VDP]].
- **Confirmar com autorizações** o suporte ao novo valor do campo de origem do provisionamento.
- **Verificar o registro da Veritran como [[Third Party Agent|agente terceiro]]**.
- **Enviar o checklist do que é exclusivo de Apple** (o que não é coberto pelo que já existe para Google Pay) e a documentação de APIs — prometido pela CSM.
- **Dimensionar o prazo dos desenvolvimentos do banco** (SDK, step-up adicional, front) — pré-condição para abrir.
- **Responder o conjunto de dúvidas técnicas** sobre o SDK.
- **Risco de relacionamento:** o banco pediu reuniões diárias e "modalidad de proyecto", criticando burocracia e fluidez da comunicação. O canal indireto (Oscar → Claudio → Visa) já causou perda comprovada de mensagens; foi autorizado canal direto.
- **Risco de expectativa:** meta de dezembro contra benchmark de 6+ meses. Registrar por escrito.

---

# Atualização set–nov/2026

> [!note] Origem e confiabilidade deste bloco
> Escrito em 16/11/2026 a partir de transcrições automáticas de ~25 reuniões (internas e com o cliente) entre fim de agosto e 16/11. Não foram validadas contra atas. Datas com `~` são inferidas; `[a confirmar]` marca dedução ou nome ouvido de forma incerta. O acompanhamento semanal (pendências, datas, responsáveis) está na ficha da base e na planilha do projeto — aqui fica a história e o porquê.

> [!warning] Correções ao registro de agosto
> - O PM funcional de apoio é **Bruno Medeiros** (a seção «Ficha» traz "Bruno Da Silva").
> - **Lina Torres** é liderança VCA; não é contato do cliente.
> - O contrato com a Apple **não** estava assinado em agosto: fechou em outubro.
> - A Veritran só foi registrada como [[Third Party Agent]] em novembro; se ela é o [[ITSP]] do banco continua em dúvida.
> - A meta de produção em dezembro/2026 saiu de cena: o objetivo do banco passou a ser **maio/2027**.

## Status em 16/11/2026

**Âmbar.** O projeto está no fim da preparação — o que a equipe chama de "mês 0" ou etapa zero — e a caminho da abertura do projeto técnico com [[CS Implementations]]. Os dez pré-requisitos de abertura estão funcionalmente cumpridos e a abertura foi solicitada. Na weekly com o cliente de 11/11 esperava-se o kickoff técnico para a semana de 16/11; a Weekly Tech interna de 16/11 registra o kickoff em **25/11**, porque o PM técnico previsto (Fernando Núñez) estava de férias, com a abertura oficial depois. É a informação mais recente. Não há, nos registros, o OK escrito da CSM.

A cor é âmbar e não verde por quatro motivos: a abertura estava planejada para 15/10; a [[FIME]] ainda não está contratada; o banco não tinha o [[Tap to Add Card|Tap to Add]] desenvolvido; e o desenvolvimento banco/Veritran (18 semanas, até fevereiro) não deixa folga para maio/2027.

## Como o projeto chegou até aqui

### Agosto–setembro: definir o que a Visa faz e o que não faz
Num projeto comum de Apple Pay o banco chega com os pré-requisitos cumpridos e a Visa entra só na configuração e certificação. Aqui há uma consultoria contratada: Jenny Johansen e Bruno Medeiros acompanham desde o SDK e os pré-requisitos, centralizam as dúvidas e as encaminham a produto e a CS. O [[TPM (Technical Project Manager)|PM técnico]] só é designado quando o projeto técnico abre. Daí os **dois kickoffs**: o geral (15/09) e o técnico (ainda por acontecer).

Boa parte do trabalho de setembro foi de linguagem. O deck de kickoff passou por várias versões para dizer, sem ambiguidade, que a Visa disponibiliza o SDK mas não o desenvolve nem o integra; que quem certifica é a FIME, contratada pelo banco; e que a Visa não gere a Veritran nem a Apple. Antes do kickoff houve três sessões com o banco: o Gantt técnico-padrão (4 a 6 meses a partir da abertura), os requisitos funcionais da Apple (guia versão 3.5) e as dúvidas de SDK com a Veritran.

Dessas sessões saíram as definições técnicas que valem até hoje: integração em modo **headless** (interface própria do banco), com [[Push - In-App Provisioning (fluxo verde)|Push Provisioning]] e [[Wallet Extensions|Wallet Extension]] pelo SDK; Tap to Add fora do SDK; mesmas artes dos cartões atuais; SDK na versão 5.9.

> [!tip] Decisão de método
> Em 11/09 decidiu-se **não pôr prazos de desenvolvimento do banco no Gantt da Visa**. A Visa mostra a linha de base de CS; os tempos do banco são do banco. O motivo foi a experiência de setembro: circularam versões de 4, 6, 7 e 8,5 meses, cada uma lida de um jeito.

### 15/09–15/10: sete de dez, e os três que faltavam
O kickoff de 15/09 fechou com 7 dos 10 pré-requisitos cumpridos. Os três abertos eram de natureza diferente, e isso explica por que levaram dois meses:

| Pré-requisito | Por que demorou | Quando fechou |
|---|---|---|
| Contrato com a Apple no Partner Hub | Banco público: a contratação direta de Apple e FIME (sem licitação) precisava de minuta aprovada pelo Comitê Executivo, o que ocorreu em 29/09 | antes de 14/10 |
| Registro da Veritran como Third Party Agent | Quem cuida disso no banco não conseguia entrar na plataforma; a recuperação de conta envia um link e o e-mail do banco remove links | carta de aprovação informada em 04/11 |
| Suporte a PAN Source 06 | O banco não sabia dizer se suportava; recebia o campo sem usar o valor. Adiou três vezes a sessão técnica | 05/11 |

No fim de setembro o seguimento saiu do deck e foi para uma **planilha única** (pendências gerais, SDK, requisitos Apple, matriz de riscos, resumo), e criou-se um **one-pager** para o Comitê Executivo do banco, pensado para ser apresentado a cada dois meses. A meta combinada com o banco era abrir o projeto técnico em 15/10.

### Segunda quinzena de outubro: o ponto mais tenso
A meta de 15/10 passou. Para abrir sem o PAN Source, CS pediu ao banco uma data de cumprimento. O banco respondeu **maio/2027** — a mesma data do objetivo de lançamento. Na mesma semana ficou evidente que o banco **não tinha os desenvolvimentos de Tap to Add**, embora o item constasse como pronto, e que o desenvolvimento total com a Veritran levaria 18 semanas, até fevereiro.

Dentro da Visa havia duas leituras. CS não recomendava abrir: o projeto travaria no segundo ou terceiro mês, a FIME exige 100% das funcionalidades e o contrato Visa–banco tem duração fixa (~6–7 meses), de modo que cada mês parado custa adenda. Produto achava pior manter tudo parado e propunha abrir com data-limite e escalar ao nível executivo. A interna de 29/10 fechou uma **postura única**:

- Tap to Add **flexibilizado para a abertura** — do lado Visa é um item de formulário e regras de VRM; o desenvolvimento é do banco e o [[Waiver|waiver]], se houvesse, só a Apple daria;
- PAN Source 06 com limite em meados de dezembro;
- Veritran ao menos registrada (a FIME não se registra);
- pedir ao banco o Gantt interno em alto nível e reportar com transparência toda semana.

### Novembro: o item que fechou em uma semana
A sessão técnica de 05/11 (banco, Veritran e Visa) terminou com o consenso de que o banco **já suporta** o PAN Source. O pré-requisito que tinha recebido data de maio/2027 foi dado por cumprido seis dias depois, e a data-limite de dezembro deixou de ser necessária. Em 11/11 a abertura estava solicitada.

Em paralelo, a FIME passou de NDA para primeira reunião e deu a referência de calendário: pedir o laboratório nos primeiros dias de janeiro para provar na segunda quinzena de fevereiro, 25 dias úteis no total, com os desenvolvimentos já em produção na pré-certificação. O banco avisou de um freeze de ~10/12 a ~2–3/01 e apareceu um alerta novo: a taxa de aprovisionamento do banco em Google Pay está entre 45% e 62%.

## O que explica o risco de prazo

A conta que sustenta o âmbar é simples e foi dita em reunião: 18 semanas de desenvolvimento terminam em fevereiro; a FIME ocupa 25 dias úteis a partir da segunda quinzena de fevereiro; a Apple só aprova saídas na 1ª e na 3ª terça-feira do mês; e o objetivo é ter usuários enrolando em maio/2027. Não sobra margem para uma reprovação no laboratório, e o que mais ameaça a certificação é justamente o que ainda não existe: Tap to Add e os desenhos que dependem de aceite da Apple (autenticação por SMS e call center sem [[Passkey - App-to-App|app-to-app]], segundo fator próprio do banco no push provisioning, ciclo de vida do token com um autorizador que decide por PAN). Em setembro o banco dizia ter aceites verbais; em outubro passou a dizer que não pretende pedir exceções.

Dois pontos de fundo seguem sem resposta: o **alcance Mastercard** (o SDK é multimarca, a assessoria é só Visa, e a Apple espera o lançamento completo) e a **vigência do contrato Visa**, que pode acabar antes do go-live.

## Decisões que valem daqui para frente
- Jenny e Bruno são o ponto focal único; todo e-mail do projeto leva os dois em cópia.
- Todo acordo com a Apple fica por escrito e passa pelos canais formais.
- Seguimento em planilha única; a minuta leva as notas no corpo do e-mail (o banco tende a não abrir o anexo e o e-mail dele remove links).
- Weekly às quartas, 12:00 de Chile, 45 min. Depois da abertura: duas reuniões semanais, a técnica com o PM técnico e a geral.
- Para CS o projeto é **um só** (Apple Pay + SDK).

## Linha do tempo (acréscimo)
- **~27–28/08** — Interna de papéis: sem contrato assinado não se inicia nada.
- **~04/09** — 1ª sessão de Gantt técnico com o banco; contrato assinado entre 04 e 09/09 `[data exata a confirmar]`.
- **09/09** — Requisitos funcionais Apple. **~11/09** — Dúvidas de SDK com a Veritran.
- **15/09** — Kickoff geral (7/10).
- **29/09** — Comitê Executivo do banco aprova a compra direta com Apple e FIME. **30/09** — reunião presencial da liderança Visa no banco; 1ª weekly em planilha.
- **antes de 14/10** — Contrato Apple no Partner Hub (8/10).
- **15/10** — Meta de abertura não cumprida; Comitê Executivo cancelado e remarcado para 02/11.
- **19/10** — Banco assina o NDA da FIME. **~20/10** — Veritran começa a integrar o SDK.
- **28–29/10** — Banco dá maio/2027 para o PAN Source; Visa fecha postura única.
- **04/11** — Veritran aprovada (9/10). **05/11** — Sessão PAN Source (10/10).
- **11/11** — Abertura solicitada; weekly conduzida por Bruno.
- **16/11** — Weekly Tech: kickoff técnico em 25/11.

## Lições deste período
- Separar três listas que o cliente confundia: pré-requisitos de abertura, requisitos funcionais da Apple e alcance do SDK.
- Capacitar antes de pedir datas — a data de maio/2027 foi dada sem a sessão técnica.
- Confirmar cada pré-requisito na fonte; "estamos revisando, sem dúvidas" não é avanço.
- Alinhar a postura interna antes de falar com o cliente.
- Bancos já no ar não servem de referência para as regras da Apple: lançaram com versão anterior do guia e com exceções.

## O que falta confirmar
- OK escrito de CS e data efetiva do kickoff técnico (16/11 × 25/11).
- Se o Comitê Executivo de 02/11 ocorreu.
- Papel exato da Veritran e escopo das 18 semanas.
- Alcance Mastercard.
- O kickoff de 15/09 e a weekly de 28/10 não têm transcrição utilizável.

---
[[Home]]
