---
tags: ["proyecto", "cliente/Banco-de-Corrientes"]
fuente: Reports e atas — Banco de Corrientes
estado: verificado
---

# 🇦🇷 Banco de Corrientes (Argentina)

> [!info] Dossiê de projeto (contexto qualitativo)
> O acompanhamento **vivo** está no app. Aqui fica o contexto e a história.

## Ficha
- **Cliente:** Banco de Corrientes. **País:** Argentina.
- **Tracks:** Apple Pay e [[Click to Pay]]. Acompanhamento até **30/set**.
- **[[Processador]]:** [[Prisma]]. **TSP/SDK ([[ITSP]]):** [[Thales]]. **Certificador:** [[FIME]].
- **Contatos —** Banco: Martín De la Vega (executivo), Juan Torres "Juanjo" (Torres Barusso), Verónica Escobar, Valentina Torrado, Cristian (técnico). Visa: Lina Torres, Marlene Migliardi, Javier Cadena, Laura. [[Thales]]: Patricia González, Miguel Ángel. [[Prisma]]: Ivan Hirsch, Mario.
  - ⚠️ A tabela de participantes da minuta de 30/jul lista **Edgar Javier Cadena** na linha do banco e embaralha as linhas de Visa/[[Thales]]/[[Prisma]] (Patricia González aparece sob Visa, Ivan Hirsch sob Thales). O vínculo aqui — Patricia/[[Thales]], Ivan/[[Prisma]], Javier Cadena/Visa — é o verificado nos weeklies; **confirmar com o autor da minuta** antes de propagar a versão dela.

## Status atual (base: 2º SteerCo, 30/jul/2026)
**[[Click to Pay]]** âmbar tendendo a verde — desenvolvimento funcional praticamente completo, travado num único ponto de backend. **Apple Pay** âmbar — crédito destravou (push provisioning bem-sucedido), débito ainda falha.

## Frentes / tracks
| Frente | Situação |
|---|---|
| [[Click to Pay]] | Móvel praticamente completo; ambientes e config já não são bloqueio; **API Register Consumer devolvendo HTTP 500** impede o E2E |
| Apple Pay | Crédito: push provisioning **OK**. Débito: **HTTP 400 / responseCode 911**. Estado pós-provisioning não reflete na app |

## Histórico (linha do tempo)
- **2025** — Pré-requisito Apple enviado (e-mail do [[AID (Apple)|AID]] à Apple).
- **Configuração do [[Partner Hub]]** — de 27% → 50/60%; corrigir o país para **Argentina** destravou aprovações.
- **Reunião técnica Apple Pay** (Visa + [[Thales]] + [[Prisma]] + banco) — diagnóstico do crash no fluxo verde: config Visa OK (fluxo amarelo funciona; T&C carregados; já funciona no Google Pay), mas o **fluxo verde não chega à Visa** (fica no [[ITSP]]/Thales). Causa raiz provável: payload/token de login expirado.
- **17/jul/2026** — Weekly [[Click to Pay]]: ambientes prontos; carga massiva OK no [[Prisma]]; provas funcionais em preprodução marcadas para 22/jul.
- **16/jun/2026** — **1º SteerCo** (ver seção abaixo).
- **29–31/jul** — Janela-alvo do 2º SteerCo (remarcado para garantir Martín e Agustín).
- **30/jul/2026** — **2º SteerCo** (ver seção abaixo): crédito destravado no Apple Pay; [[Click to Pay]] bloqueado no Register Consumer.
- **31/jul/2026** — Sessão técnica banco + [[Thales]] sobre o HTTP 500 do Register Consumer.
- **28/ago/2026** — **3º SteerCo** (agendado).
- **30/set/2026** — Data-limite do mandato [[Click to Pay]].

## SteerCo inicial (jun/2026)
1º Steering Committee (Apple Pay & Click to Pay) — foco em **visibilidade executiva**, dependências críticas e avanço coordenado dos dois frentes. Deadline do mandato [[Click to Pay]]: **30/set/2026**. Governança instalada: **SteerCo mensal/ad-hoc** (estratégico) + **weekly operativo**.

**Apple Pay** — avançado, entrando numa fase em que **1–2 definições técnicas** condicionam o próximo passo. Preparação para certificação [[FIME]]; exige coordenar dispositivos, cartões e [[Whitelist|whitelist]]. Config com **CCM Digital** agendada (17/jun); pendências: certificados **JWS/JWE** e chave **WSD/ZCMK**.

**[[Click to Pay]]** — plano aprovado (2ª prórroga), fecha **30/set/2026**, integração técnica em curso. Banco enviará **DEF para os 5 BINes**; o CCM estimou **~5 dias hábeis por ambiente**.

**Linha do tempo técnica ([[Thales]]):** SDK iOS/Android **v4.3.0** → integração do app BanCo com o SDK → config de bines/certificados/chaves no tenant Thales (Pre-PRD) → habilitar ao menos 1 [[BIN]].

## 2º SteerCo (30/jul/2026)
Segundo Steering Committee do programa. Objetivo declarado: **converter o avanço técnico recente em decisão executiva** — owner claro, data da próxima prova e rota de evidência para as duas frentes. O programa saiu da fase de dependências de configuração e entrou em **provas reais**.

**Apple Pay — âmbar.** O push provisioning de **crédito foi concluído com sucesso** (depois de um ajuste da [[Prisma]]) — é o avanço que destrava a frente. O [[TestFlight]] permitiu progredir no fluxo: a Wallet abre, mostra os dados e apresenta os T&C. Ficaram dois problemas:
- **Débito continua falhando.** A [[Thales]] reporta **HTTP 400** vindo de [[Prisma]]/emissor, associado a `checkCardEligibility` / `requestCardDigitization`, com **responseCode 911 — Operation failed**.
- **O estado pós-enrolamento não volta correto para a app do banco.** Depois de um provisioning bem-sucedido a app segue mostrando o cartão como não enrolado, e deixa o usuário repetir a operação. O banco entende que a revisão tem de focar na **devolução do status pelas plataformas envolvidas**, não na app.

**[[Click to Pay]] — âmbar tendendo a verde.** A funcionalidade móvel está praticamente completa e ambientes/configurações deixaram de ser percebidos como bloqueio. Os **BINs foram enviados: 5 de crédito e 2 de débito**. Uma vez gerado o caso de implementação, a Visa tem **SLA de 5 dias úteis** para habilitar o ambiente de provas. Situação por componente: **DEF/BINes validado · Ambientes prontos · Backend quase pronto · Provas E2E por evidenciar**.
- **Bloqueio único:** a **API Register Consumer**. O banco achou de início que era problema interno, mas hoje observa **HTTP 500** devolvido na interação com a [[Thales]]. Sessão técnica dedicada marcada para 31/jul.

**Preocupação executiva (Martín De la Vega).** Pressão para cumprir o roadmap por obrigação regulatória; recursos econômicos já comprometidos nas duas frentes; exigência de que **todo bloqueio seja identificado e comunicado no tempo certo**, com **transparência sobre a origem** e coordenação estreita entre Visa, [[Prisma]], [[Thales]] e banco para não acumular atraso por dependência de terceiros.

**Riscos levantados no comitê:** débito HTTP 400/911 (âmbar/vermelho) · Apple Pay ainda não pronto para [[FIME]] (âmbar) · backend interno travando o E2E de [[Click to Pay]] (âmbar) · deadline regulatório de 30/set (âmbar).

## Decisões e pontos importantes
- **Certificados Apple Pay — encerrado.** Confirmou-se que os certificados usados no Google Pay e no Apple Pay **são os mesmos** e já estavam validados internamente: não é preciso gerar certificado exclusivo para Apple Pay. Resta só seguimento por e-mail de qualquer ponta solta.
- **Foco do Apple Pay migra** da configuração para a **correção do comportamento funcional pós-provisioning** e o fecho do débito.
- **[[FIME]] fica condicionado** a prova bem-sucedida de crédito **+** débito com evidência de tokenização.
- **Governança mantida:** rastreabilidade e visibilidade de bloqueadores nas weeklies, com os hitos de Apple Pay e [[Click to Pay]] alinhados ao roadmap regulatório. Próximo SteerCo: **28/ago/2026**.
- **Apple Pay — causa raiz** provável no **payload/token de login** (banco + [[Thales]]), não na config da Visa.
- **Ações Apple Pay:** publicar a app no **[[TestFlight]]**; reenviar e-mail à Apple confirmando o **[[AID (Apple)|AID]]**; compartilhar **Correlation ID / Token Reference ID** ([[Vital Sign]]) para diagnóstico.
- **[[Partner Hub]] — boa prática:** garantir mais de uma pessoa do banco com acesso.

## Pendências e riscos (atualizado no 2º SteerCo, 30/jul/2026)

**Apple Pay**
- Corrigir a **falha do débito**: HTTP 400 / responseCode 911 em `checkCardEligibility` / `requestCardDigitization`. Falta **definir o owner do fecho técnico** e a data de resposta ([[Prisma]] / banco / [[Thales]]).
- Corrigir a **devolução do status pós-provisioning** — hoje a app segue mostrando o cartão como não enrolado e permite repetir a operação.
- **Marcar a próxima prova integral crédito + débito** (data em aberto).
- **Definir o critério de avanço para [[FIME]]** — o comitê já alinhou que fica condicionado a crédito + débito OK com evidência de tokenização.

**[[Click to Pay]]**
- **Destravar a API Register Consumer** (HTTP 500 na interação com a [[Thales]]) — condição necessária para começar o E2E. Sessão técnica em 31/jul.
- **Confirmar o responsável de backend do banco** por esse ponto.
- **Confirmar a data do re-test E2E** e qual evidência será compartilhada na weekly / PMO.
- Concluir o processo administrativo do caso de implementação para disparar o **SLA de 5 dias úteis** da Visa e habilitar o ambiente de provas.
- **Deadline regulatório 30/set/2026** — sem evidência de E2E o risco de descumprimento sobe; manter tracking semanal e escalar cedo.

**Encerrado desde o último dossiê**
- ~~Certificados Apple (JWS/JWE, WSD/ZCMK)~~ — mesmos certificados do Google Pay, validados; tema fechado no SteerCo.
- ~~DEF dos 5 BINes~~ — enviados **5 BINs de crédito + 2 de débito**; DEF/BINes validado.
- ~~Crash do fluxo verde no crédito~~ — push provisioning de crédito concluído com sucesso após ajuste da [[Prisma]]. (A causa raiz permanece aberta **para débito**.)

**Ainda em aberto do ciclo anterior**
- Confirmar a vigência do [[AID (Apple)|AID]] com a Apple.
- Compartilhar **Correlation ID / Token Reference ID** para diagnóstico.

---
[[Home]]
