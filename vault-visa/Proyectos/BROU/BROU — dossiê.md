---
tags: ["proyecto", "cliente/BROU"]
fuente: Reports e atas — BROU; transcrições automáticas de ago–nov/2026 (não validadas)
estado: parcial
---

# 🇺🇾 BROU — Banco de la República (Uruguai)

> [!info] Dossiê de projeto (contexto qualitativo)
> O acompanhamento **vivo** (tracks, tarefas, status) está no app. Aqui fica o contexto, a história e as decisões. Conceitos citados linkam para [[Home|o conhecimento geral]].

## Ficha
- **Cliente:** Banco de la República Oriental del Uruguay (BROU) — banco público.
- **País:** Uruguai. **PM Visa (líder):** Jenny (Lina / Bruno).
- **Engajamento:** PMs por ~6 meses, desde **14/abr/2026** ("até onde chegarem"). Track de tokenização iniciado em **21/abr/2026**; contrato VCA vence **21/set/2026**.
- **[[Processador]]:** [[Sistarbank]] — **PCR 1913**. **Habilitador [[Click to Pay]] / [[ITSP]]:** [[HST - HCT|HST]] / HCT.
- **Rota crítica (débito):** [[Tokenização]] → billeteras e [[Click to Pay]] de débito.
- **Modelo comercial:** **sem VIK / sem incentivos** — o banco pagou com recursos próprios, com desconto negociado. Escopo vendido em **6 meses** quando o time estimava **9**.

**Contatos —** Banco: Jimena ("Jime", coordenação técnica/funcional), Alfredo (switch/integração), Eduardo (canais digitais), Gonzalo (simulador/BTS), Pablo, Luis, Rosa, Ariel; **UPLA** (Unidad de Prevención de Lavado de Activos) define a postura de [[OCT - AFT|OCT/AFT]]. Visa: Jenny, Lina Torres, Bruno Medeiros, **Emiliano ("Emi", [[CSM (Customer Success Manager)|CSM]])**, Melina Albornoz (stakeholder técnica), **Fernando** (Implementation Manager da tokenização), Juliana (engenheira de provas), Klaus (mandatos OCT/AFT), Mauro (Produto — ANI e OCT/AFT), Alexis (Produto — [[Click to Pay]]), Joyce (suporte técnico Google Pay), Vanessa, Soledad Rua. [[Sistarbank]]: Ivana, Juan Pablo, Adiel (Smart Vista). HCT: Carlos, José, Juan Pablo.

## Status atual (base: Weekly Tech interna de 16/nov/2026)
> [!warning] Atualização a partir de transcrições automáticas — não validada
> Tudo o que vem de set–nov/2026 saiu de relatos **internos** da Visa (Weekly Tech, 1:1). Não há transcrição de reunião com o banco depois de 19/ago. Itens marcados *(a confirmar)* não devem ser levados ao cliente sem checagem.

**O programa atravessou a renovação e mudou de gargalo outra vez.** O contrato VCA foi **renovado e assinado antes de 19/out**; cinco tracks voltaram a *implementing*. O ponto de atenção agora é o **Apple Pay, em warning**: o banco perdeu as datas de laboratório [[FIME]] e o lançamento que queria para **1/dez não ocorre**. O [[Click to Pay]] segue em [[Enrolamento massivo|enrolamento massivo]]; o Google Pay tem o BIN de débito configurado; o Garmin foi dado como concluído. Os dois mandatos continuam sem execução: [[OCT - AFT|OCT/AFT]] foi retirado da pipeline (recuperável) e o [[ANI]] não tem projeto aberto em CS.

| Frente | Situação em 16/nov |
|---|---|
| [[Tokenização]] — COF / e-Commerce | Em 19/ago: configuração produtiva para 27/ago e go-live estimado para 3/set. **Resultado não consta**; as carteiras passaram a ser tratadas como destravadas *(dedução — a confirmar)* |
| [[Click to Pay]] | Projeto aberto em CS; fase 1 configurada; em enrolamento massivo. Fornecedor próprio, sem SDK Visa. Situação do [[Waiver|waiver]] de 30/set não dita |
| Google Pay | Em curso; BIN de débito configurado "dia 22" *(~22/out, a confirmar)* |
| Apple Pay | Projeto aberto em CS (antes de 10/nov). **Warning** — datas FIME perdidas; 1/dez não ocorre |
| Garmin Pay | *Completed* (2/nov) — descrito como inclusão de BIN |
| Mandato [[OCT - AFT|OCT/AFT]] | *Withdrawn* na pipeline — pode voltar |
| Mandato [[ANI]] | Em implementing na pipeline VCA, sem projeto em CS; dúvida sobre quem abre |

## Status atual (base: seguimento de tokenização, 12/ago/2026)
> [!note] Registro de 12/ago, mantido como histórico — o status vigente é o bloco acima.
**A tokenização deixou de ser o bloqueio.** A certificação de host foi concluída em **11/ago** com a carta obtida, e o ticket de configuração produtiva foi criado em **12/ago**. O marco que destrava as billeteras é o **BIN produtivo (~31/ago)** — não o fim do projeto. A partir daí o gargalo do programa passa a ser **contratual**: o contrato VCA vence **21/set** e a decisão de extensão, pedida pelo banco no SteerCo de 29/jul, segue em aberto.

## Frentes / tracks
| Frente | Situação |
|---|---|
| [[Tokenização]] — COF / e-Commerce ([[VTS (Visa Token Service)|VTS]]) | **Certificado.** Carta obtida 11/ago. Configuração produtiva em curso (10 dias úteis) |
| [[Click to Pay]] | Em curso. [[Waiver]] até **30/set**; meta de subida massiva **1/out**. Base de dados suja; **multas já correndo** |
| Google Pay | Avanço parcial. Crédito + pré-pago em provas de [[Push - In-App Provisioning (fluxo verde)|push provisioning]]; débito travado. Novo pré-requisito [[UPP (Unified Push Provisioning)|UPP]] |
| Apple Pay | Sem iniciar. Checklist aprovado por Emiliano **exceto a "API de novedades"** |
| Garmin Pay | Sem iniciar — declarado o track de **menor prioridade** no SteerCo |
| Mandato [[OCT - AFT|OCT/AFT]] | Espera do banco — falta a postura normativa da **UPLA**. Waiver formal **vencido em junho** |
| Mandato [[ANI]] | Espera de fornecedor — "fábrica" não priorizou. Extensão vence **31/ago** |
| Billetera própria do BROU | **Fora de escopo** — tem Token Requestor ID próprio |

## Histórico (linha do tempo)
- **21/abr/2026** — Início do track de [[Tokenização]].
- **8/jun/2026** — Confirmado que as validações de [[ANI]] do lado Visa **não teriam custo**.
- **~21/jul/2026** — Sessão técnica de [[Click to Pay]] com Produto (Alexis) + [[Sistarbank]]: [[Destination Site]] será desativado por região; confirmado o desenho do [[Enrolamento massivo]].
- **22/jul/2026** — Seguimento de certificação de APIs: depuração do caso **13.2**; confirmado que no **campo 2 vai o [[DPAN]] / token number**.
- **24/jul/2026** — Revisão interna do deck do SteerCo. Nasce a proposta de substituir o cronograma por um **mapa de dependências**.
- **29/jul/2026** — **1º SteerCo** (presencial, Montevidéu) — ver seção abaixo.
- **29/jul/2026** — Weekly de certificação: projeto em 56%; nenhum token disponível a dias da certificação.
- **~5/ago/2026** — **[[Scoping call]]** de certificação: escopo fechado, caso 13.2 marcado como **não aplicável**, janelas agendadas.
- **6/ago/2026** — Seguimento: compromisso de enviar o **[[DEF (Digital Enrollment Form)|DEF]]** e o Processor Digital Activation Request de produção já em 7/ago, ganhando ~1 semana.
- **11/ago/2026** — ✅ **Certificação de host concluída** em duas janelas de 1 h (09h30 e 17h30 Uruguai). **Carta obtida.**
- **12/ago/2026** — Ticket de configuração produtiva criado. Replanejamento até o encerramento.
- **~31/ago/2026** — **BIN produtivo** — marco de desbloqueio das billeteras.
- **1/set/2026** — Início do **[[Friends and Family]]** (5 dias).
- **1ª semana de set/2026** — Remoção da [[Whitelist|whitelist]] = **go-live**; abertura tentativa dos projetos de billeteras.
- **15/set/2026** — Encerramento do projeto de tokenização.
- **21/set/2026** — Fim do contrato VCA atual.
- **30/set/2026** — Vence o [[Waiver|waiver]] de [[Click to Pay]].
- **25/nov/2026** — Última janela de instalação antes do **freeze** do banco (até janeiro).

**Acréscimo — ago a nov/2026 (transcrições; datas de planejamento acima podem ter mudado):**
- **19/ago/2026** — Seguimento [[VTS (Visa Token Service)|VTS]] COF + e-Commerce: configuração produtiva marcada para **27/ago**, piloto [[Friends and Family]] de 5 dias dentro da [[Whitelist|whitelist]] e go-live formal estimado para **3/set**. Projeto adiantado ("ganamos unos días"). *Substitui a previsão de BIN produtivo ~31/ago do replanejamento de 12/ago.*
- **4/set/2026** — 1ª Pipeline Review VCA × CS: todos os tracks dependem da tokenização; CS só tem aberto COF / e-Commerce; risco de penalidades por mandatos.
- **8/set/2026** — Reunião sobre renovar o contrato por mais 6 meses *(resultado não consta)*. O vencimento passa a ser citado como **14/out** — diverge do 21/set registrado acima.
- **~29/set/2026** — Com o contrato a vencer, CS pede passar todos os tracks a *prospecting* até haver fundos; Garmin (inclusão de BIN) sai da vista de CS. Legal trabalha a cláusula de continuidade.
- **5/out/2026** — Fundos confirmados; proposta enviada ao banco. CS **rejeita abrir o projeto de Apple Pay**: contrato com ~3 semanas de vigência.
- **13/out/2026** — Renovação pendente do OK do BD e da parte contratual.
- **19/out/2026** — ✅ **Contrato renovado/assinado.** 5 tracks em implementing; OCT/AFT *withdrawn*; ANI sem track em CS.
- **22/out/2026** — No BiWeekly do time, o roadmap digital do BROU é citado como caso a divulgar: acompanha 3 mandatos e alivia CS.
- **2/nov/2026** — Google Pay com BIN de débito configurado; Garmin *completed*; Click to Pay com fase 1 configurada, em testes de carga massiva.
- **10–11/nov/2026** — Apple Pay com projeto aberto; Bruno cobre Jenny no seguimento de 11/nov.
- **16/nov/2026** — **Apple Pay em warning**: datas FIME perdidas, 1/dez não ocorre. Click to Pay em enrolamento massivo.

## 1º SteerCo (29/jul/2026)
Primeiro Steering Committee do programa, presencial na sede do banco. A governança prevista — SteerCo mensal — nunca havia ocorrido; esta foi a sessão de inauguração.

**Semáforo apresentado:** [[Tokenização]] 🟢 (em curso, com cadência, fecho estimado 28/ago) · Google Pay em avanço · **Apple Pay 🔴** · **Garmin 🔴** (menor prioridade) · [[Click to Pay]] em curso · [[ANI]] e [[OCT - AFT|OCT/AFT]] em espera.

Leitura executiva declarada: *"Estamos mal que bien, estamos avanzando en todos los frentes menos en Garmin. Apple va un poquito más lento… varias de las billeteras todavía están dependientes de este primer proyecto que va en curso."*

**Decisão pedida pelo banco — extensão do contrato.** Restam ~2 meses de 6 e o gatilho das billeteras só ocorre no fim de agosto. O BROU pediu explicitamente a possibilidade de estender. A Visa ficou de dimensionar **capacity, continuidade da PM e preço** para cenários de **1, 2 ou 3 meses**, com visibilidade **até meados de agosto** e decisão na **SteerCo de agosto**. Cenário alternativo levantado: **tirar o mandato [[ANI]] do escopo VCA** e concentrar recursos nas billeteras.

**Feedback do banco sobre o serviço (favorável):** o modelo de PM dedicada foi considerado fundamental — ordenou prioridades, centralizou a abertura dos projetos individuais e supre a limitação de banda do CSM (*"Emi es muy bueno, pero Emi está asignado a un montón"*). É a primeira vez que o BROU contrata este tipo de consultoria da Visa.

## Certificação de tokenização (ago/2026)
O ciclo que destravou o programa, e que vale como referência para outros emissores — ver [[Troubleshooting — certificação de tokenização (provas e janelas)]].

- **Scoping call:** escopo fechado em **somente casos de token** — retail, [[OCT - AFT|AFT e OCT]] fora. O **caso 13.2 (Dynamic CVV)**, única prova que o banco não conseguira executar, foi marcado como **não aplicável** e encerrado sem execução.
- **Janelas:** não havia slot de 2 h antes de 17–18/ago, então a janela padrão foi **quebrada em duas de 1 h no mesmo dia (11/ago)**, antecipando o cronograma. Cancelamento tardio é cobrado igual.
- **Preparação:** estação **11.7653** verificada por *ecotest*; cartão de provisionamento compartilhado antes, para o certificador já preparar os tokens. Com tokens pré-provisionados, HCT e [[Sistarbank]] não precisaram estar presentes.
- **Resultado:** certificação concluída em 11/ago, **carta obtida**.

## Caminho até produção (replanejado em 12/ago)
`Carta de certificação` → `ticket de configuração produtiva (10 dias úteis)` → **`BIN produtivo ~31/ago`** → `[[Friends and Family]] 1/set (5 dias)` → `remover whitelist = go-live` → `Post Launch Tracking` → `fim do projeto 15/set`.

> [!important] O marco que destrava as billeteras
> Perguntado qual entregável libera a abertura dos projetos de carteiras, o Implementation Manager foi explícito: *"tan pronto el BIN esté productivo, o sea las configuraciones estén productivas, ya podrían iniciar el proyecto"*. **Não é preciso esperar 15/set** — a abertura das billeteras ficou marcada como tentativa para o **início de setembro**.

## Decisões e pontos importantes
- **Rota crítica:** reforçar toda semana a sequência tokenização → billeteras / [[Click to Pay]] de débito.
- **[[Click to Pay]]:** waiver até **30/set** (crédito, pré-pago e débito); meta de subida massiva **1/out**.
- **[[External Consumer ID]]:** BROU tem **4 códigos emisores** → até 4 perfis por cliente. O impacto apurado é de **performance** (múltiplas invocações de API), não de experiência — mas o desenho segue pendente de validação com o time regional.
- **[[Enrolamento massivo]] — desenho confirmado:** arquivo do banco → [[Sistarbank]] → API massiva da HCT → API massiva da Visa.
- **[[Destination Site]]:** será desativado região a região. Onde o emissor faz o enrolamento massivo, **o que ele enviou prevalece** e o site fica somente leitura.
- **Regras de risco são decisão do emissor.** A Visa envia os casos de uso sugeridos para token e-Commerce/COF (incluindo whitelist); o banco compara com o que já tem de crédito e pré-pago.
- **Billetera própria fora de escopo** — tem Token Requestor ID específico, não é Card-on-File. Exige projeto de implementação adicional ou requerimento por BAU com o gerente de conta.
- **[[OCT - AFT|AFT]] não tem correlação com tokenização** (confirmado por Klaus) — ao contrário do que a ordenação inicial sugeria.
- **Expectativa realista:** o conjunto não sai em menos de 9 meses; com 6 de engajamento, não se chega a tudo sem extensão.

## Pendências e riscos

**Programa**
- **Decisão de extensão do contrato VCA** — pedida em 29/jul, com visibilidade prometida para meados de agosto. **Está vencida.** Sem ela, o BIN fica produtivo em ~31/ago e o contrato acaba em 21/set: ~3 semanas, nenhuma carteira de débito cabe.

**[[Tokenização]]**
- Confirmar a **data efetiva** das configurações produtivas (a de 31/ago é preliminar, sai da revisão do engenheiro de configurações).
- **Chaves públicas associadas às API Keys** carregadas em BDP/[[VDP (Visa Developer Platform)|VDP]] para produção — HCT ou [[Sistarbank]].
- Concluir a **whitelist do piloto** no VRM (era para 12–13/ago).
- Comparar os **casos de uso sugeridos de VRM** com as regras já existentes e decidir os ajustes de débito antes do [[Friends and Family|F&F]].

**[[Click to Pay]]**
- **Base de dados do enrolamento massivo** — gargalo antigo; falta definir o **percentual de credenciais** que sobe. Problema estrutural: e-mails históricos sujos e **celulares/e-mails compartilhados entre clientes** (caso citado de um contato usado por 400+ clientes). Aceite parcial em discussão (subir um percentual demonstrável em vez de 100%).
- **Gap na HCT:** não existe contraparte do método *Click to Pay Enrollment Attempt Notification* — nem no Swagger nem no SDK. Pode virar requisito de desenvolvimento não previsto.
- Validar o formato de **[[External Consumer ID]]** com o time regional.
- Formulário de **opt-out no home banking** + comunicação aos clientes **30 dias antes**.

**Billeteras**
- **Apple Pay: "API de novedades"** exigida pela Apple, com problema interno do banco — risco de **+1 mês**.
- **Google Pay:** resposta do Google sobre os provisionamentos falhos (não aparecem nem no [[Sistarbank]] nem nas ferramentas Visa); depois agendar a sessão com o time técnico. Atenção: a primeira sessão de 30 min é gratuita, as seguintes são cobradas — chegar com perguntas fechadas.
- **[[UPP (Unified Push Provisioning)|UPP]]:** falta o material técnico escrito da HCT. **Conflito de calendário:** o Google exige até **dez/2026**, mas o **freeze do banco vai de 25/nov a janeiro** → o prazo real é fim de novembro.

**Mandatos**
- **[[OCT - AFT|OCT/AFT]]:** postura normativa da UPLA; **waiver formalizado venceu em junho** e não há registro de validade até outubro → exposição a carta de penalização. Combinado no SteerCo preparar uma **nota preventiva** à área de regras da Visa antes de receber a carta.
- **[[ANI]]:** priorização travada na "fábrica" do fornecedor; **extensão vence 31/ago**.

**Encerrado desde o último dossiê**
- ~~Certificação de tokenização~~ — **concluída em 11/ago, carta obtida**.
- ~~Caso 13.2~~ — marcado como **não aplicável** (Dynamic CVV, que o BROU não usa); encerrado sem execução.
- ~~DEF e Processor Digital Activation Request de produção~~ — entregues.
- ~~Provas desatendidas~~ — finalizadas.
- ~~Erro de CVV nas provas de API~~ — causa identificada: os cartões de teste tinham sido gerados com **chaves de produção** em vez de teste.
- ~~Dúvida do campo 2 no caso 13.2~~ — confirmado pelo Global Client Testing que vai o **[[DPAN]]**.
- ~~Aprovação do Google para [[UPP (Unified Push Provisioning)|UPP]]~~ — obtida.
- ~~1º SteerCo pendente~~ — realizado em 29/jul.
- ~~Fases do enrolamento massivo no [[Sistarbank]]~~ — confirmado que suporta, com layout entregue.

## Go-live da tokenização: o que ficou combinado em 19/ago
Última reunião com o banco de que há registro. O que se combinou explica como a tokenização deveria ter saído de cena:

- **Configuração produtiva com fim em 27/ago** — data "preliminar" no sistema; mudanças produtivas na Visa entram entre 5h e 7h de Miami. *"Del lado Visa, el día 27 ya estarían en producción."*
- **[[Whitelist]] no BRM antes de 27/ago.** O banco já tinha a lista montada; faltava saber a que regra associá-la para e-Commerce e Card on File.
- **A Visa deixou de enviar regras sugeridas.** O Implementation Manager não entra no BRM do emissor (as regras são próprias e confidenciais) e relatou orientação recente de evitar o envio de sugestões: o banco manda a captura da whitelist e das regras previstas, e a Visa valida com o time de BRM. *Isto corrige a decisão registrada acima ("a Visa envia os casos de uso sugeridos").*
- **Mesmos certificados**; pediu-se o Key ID produtivo para duplo cheque. API Key e Shared Secret ficam no [[VDP (Visa Developer Platform)|VDP]] depois da configuração produtiva.
- **Acesso de Carlos ([[HST - HCT|HCT]]) ao VDP falhando** — convite reenviado pelo banco e caso aberto pela Visa.
- **Sequência:** configuração produtiva → API Key → piloto [[Friends and Family|F&F]] de 5 dias → remoção da whitelist = **go-live formal (3/set)**.

> [!question] Lacuna
> Não há registro de que 27/ago e 3/set tenham sido cumpridos. A evidência é indireta: em outubro–novembro as carteiras e o Click to Pay aparecem com projeto aberto e BIN de débito configurado.

## A renovação do contrato (set–out/2026)
A decisão de extensão pedida pelo banco no SteerCo de 29/jul só se resolveu em outubro, e o intervalo teve custo.

**O que aconteceu.** O contrato de ~6 meses chegou ao fim com a tokenização recém-entregue e seis tracks dependentes dela. Em 8/set discutia-se renovar por mais 6 meses; a extensão ficou com Jenny e Desi (pricing), e Bruno saiu do escopo comercial do BROU. No fim de setembro, sem fundos definidos, o time de [[CS Implementations|CS]] pediu reclassificar todos os tracks como *prospecting*. Em 5/out os fundos foram confirmados e a proposta seguiu para o banco; no mesmo dia CS **recusou abrir o projeto de Apple Pay** porque o contrato tinha ~3 semanas de vigência. A assinatura saiu antes de 19/out.

**Por que importa.**
- A regra de CS ficou explícita: abrir projeto exige pré-requisitos completos, data comprometida pelo emissor **e contrato VCA com vigência suficiente**.
- Sem renovação, a alternativa é CS cobrar por *billing* mês a mês, com serviço mais limitado. Legal passou a trabalhar uma cláusula para o cliente autorizar essa continuidade; em contratos vigentes vale a autorização por e-mail.
- O efeito prático foi cerca de um mês em que nenhuma carteira pôde ser aberta, justamente depois de a tokenização destravar o programa.

> [!warning] Divergência de datas
> O vencimento do contrato original aparece como **21/set** neste dossiê (fonte: atas até agosto) e como **14/out** nas reuniões internas de set–out. A duração e o fim do contrato renovado não foram ditos.

## Apple Pay: do "sem iniciar" ao warning
Em julho o Apple Pay era vermelho por não ter começado. A sequência desde então:

1. **Agosto** — checklist aprovado pelo [[CSM (Customer Success Manager)|CSM]], exceto a "API de novedades".
2. **5/out** — CS recusa abrir o projeto (vigência de contrato).
3. **Entre 19/out e 10/nov** — projeto aberto em CS depois da renovação.
4. **10/nov** — o Implementation Manager está de férias; Franco cobre e deve ao banco: confirmar o fim da configuração, compartilhar chaves ouvidas como "WSD" *(grafia a confirmar)* e responder dúvidas de funcionalidades Apple enviadas por Jimena.
5. **16/nov** — **warning**: o banco perdeu as datas de laboratório [[FIME]]. Queria lançar em 1/dez; não ocorrerá. Faltam novas datas e desenvolvimentos do banco para a certificação.

A FIME é o único laboratório aceito pela Apple, e a reserva é do emissor: perdida a janela, pede-se outra. *(O motivo da perda e as datas originais não constam.)* Vale cruzar com o freeze do banco (25/nov a janeiro, registrado acima): se continuar valendo, um lançamento depois de 1/dez tende a cair em 2027 *(dedução — a confirmar)*.

## Click to Pay, Google Pay, Garmin e mandatos — o que mudou
- **[[Click to Pay]].** Projeto aberto em CS com a fase 1 configurada; em 2/nov estava em testes de carga massiva e em 16/nov "em enrolamento massivo". É implementado com fornecedor próprio, sem SDK Visa. O que não se sabe: se o [[Waiver|waiver]] de 30/set foi prorrogado, se houve multa e que percentual da base sobe.
- **Google Pay.** BIN de débito configurado. Ficou anotado que o banco deve subir informação ao Google "para evitar flujo verde" — redação do extrato, sentido a confirmar.
- **Garmin Pay.** De track de menor prioridade a *completed* em 2/nov. Em setembro foi descrito como inclusão de BIN e saiu da vista de CS.
- **[[Mandato]] [[OCT - AFT|OCT/AFT]].** Passou a *withdrawn* na pipeline em 19/out, recuperável.
- **[[Mandato]] [[ANI]].** Segue em implementing na pipeline VCA, mas sem projeto aberto em CS; em 2/nov não estava claro quem deveria abri-lo.
- **Featurespace.** Aparece como prospect separado, em espera enquanto o banco implementa outra solução ouvida como "VCAS" *(sigla a confirmar)*.

## Decisões e aprendizados de ago–nov/2026
- **Renovar em vez de operar por billing de CS** — foi o que devolveu os tracks a implementing.
- **Tirar OCT/AFT da pipeline ativa** em vez de mantê-lo parado como track aberto.
- **Começar a renovação meses antes do vencimento**: contrato curto com implementação em curso bloqueia a abertura de projetos novos em CS.
- **Tratar a reserva de laboratório FIME como marco do plano**, com dono no banco e margem para o freeze de fim de ano.
- **Acessos de terceiros ao VDP** entram no checklist anterior à janela de produção.
- O modelo de roadmap digital com mandatos e carteiras no mesmo programa foi reconhecido internamente como caso a divulgar a BDs e CS.

## Lacunas desta atualização
- Confirmação do go-live da tokenização (27/ago e 3/set).
- Quais são os "5 tracks em implementing" e a data de fim do contrato renovado.
- Origem dos fundos da renovação: "haverá fundos" (5/out) × "sem VIK / sem incentivos" (ficha acima).
- Waiver e multas de Click to Pay; extensão do ANI (vencia em 31/ago).
- Conteúdo do seguimento de Apple Pay de 11/nov e novas datas FIME.
- Em 3/set Bruno citou internamente um "SDK" como primeiro track e "talvez Thales" como terceiro — não bate com os demais registros (tokenização via HCT); provável imprecisão do relato.

---
[[Home]]
