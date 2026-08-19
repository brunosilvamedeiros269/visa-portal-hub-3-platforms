---
tags: ["proyecto", "cliente/BROU"]
fuente: Reports e atas — BROU
estado: verificado
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

## Status atual (base: seguimento de tokenização, 12/ago/2026)
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

---
[[Home]]
