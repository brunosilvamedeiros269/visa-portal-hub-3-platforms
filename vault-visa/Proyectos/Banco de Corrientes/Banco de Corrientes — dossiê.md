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

## Status atual (base: weekly de 7/ago/2026)
**Apple Pay** âmbar — o **push provisioning já funciona**, e a causa do impasse da semana anterior foi encontrada: os dados de Apple no **[[VCMM|BCM]] nunca haviam sido submetidos**. O bloqueio agora é **[[Wallet Extensions|Wallet Extension]]**, que segue falhando, e o **[[Partner Hub]] está parado à espera da assinatura do contrato de T&C** pela gerência do banco. **[[Click to Pay]]** âmbar — conectividade com a [[Thales]] resolvida (certificado), mas restam o **HTTP 503 no PUT** e colisões de **[[CAR ID]] / Consumer ID** no [[Register Consumer]], com o mandato vencendo em 30/set.

## Frentes / tracks
| Frente | Situação |
|---|---|
| [[Click to Pay]] | Móvel praticamente completo. Certificado corrigido; **HTTP 503 no PUT** e colisão de [[CAR ID]] no [[Register Consumer]] ainda impedem o E2E. Notificações (Firebase/APNs) ficam para depois — não são *stopper* |
| Apple Pay | **Push provisioning OK.** [[Wallet Extensions|Wallet Extension]] falhando. [[Partner Hub]] bloqueado pela assinatura do contrato de T&C. Material de marketing atrasado |

## Histórico (linha do tempo)
- **2025** — Pré-requisito Apple enviado (e-mail do [[AID (Apple)|AID]] à Apple).
- **Configuração do [[Partner Hub]]** — de 27% → 50/60%; corrigir o país para **Argentina** destravou aprovações.
- **Reunião técnica Apple Pay** (Visa + [[Thales]] + [[Prisma]] + banco) — diagnóstico do crash no fluxo verde: config Visa OK (fluxo amarelo funciona; T&C carregados; já funciona no Google Pay), mas o **fluxo verde não chega à Visa** (fica no [[ITSP]]/Thales). Causa raiz provável: payload/token de login expirado.
- **17/jul/2026** — Weekly [[Click to Pay]]: ambientes prontos; carga massiva OK no [[Prisma]]; provas funcionais em preprodução marcadas para 22/jul.
- **16/jun/2026** — **1º SteerCo** (ver seção abaixo).
- **29–31/jul** — Janela-alvo do 2º SteerCo (remarcado para garantir Martín e Agustín).
- **30/jul/2026** — **2º SteerCo** (ver seção abaixo): crédito destravado no Apple Pay; [[Click to Pay]] bloqueado no Register Consumer.
- **31/jul/2026** — Sessão técnica banco + [[Thales]] sobre o HTTP 500 do Register Consumer.
- **6/ago/2026** — Briefing de handover: Javier Cadena passa a condução das weeklies a Bruno (feriado na Colômbia + licença da Lina).
- **7/ago/2026** — **Weekly dupla Apple Pay + [[Click to Pay]]** (ver seção abaixo): push provisioning funcionando; config do [[VCMM|BCM]] regravada ao vivo.
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

## Weekly de 7/ago/2026 — Apple Pay e Click to Pay

Sessão conduzida em cobertura dupla: Javier de feriado e Lina de licença. A weekly é **duas reuniões no mesmo canal** — bloco Apple Pay (conduzido pela Visa/Argentina, que também envia a minuta) e, na sequência, bloco [[Click to Pay]].

### Apple Pay — o achado da semana
O **push provisioning passou a funcionar** — o bloqueio central de julho ficou para trás. Mas apareceu um sintoma novo: depois de um provisioning bem-sucedido, ao consultar o **estado do cartão** por outro método, a [[Thales]] devolvia estado incorreto e a app seguia oferecendo o botão de provisionar.

A causa foi encontrada ao vivo: no **[[VCMM|BCM]] → aba *Additional Information* → seção iOS (**App ID** / **Banking Store ID**), os valores **não apareciam**. O banco os havia digitado, mas **o submit nunca foi efetivado** — o campo *Last Update* ainda marcava **2 de julho**. A [[Thales]] havia alertado sobre isso quatro ou cinco vezes. Regravado na sessão; custo: uma semana inteira de testes.

> [!warning] Lição
> No [[VCMM|BCM]], **conferir o campo *Last Update* depois de gravar**. Digitar não é submeter — e o alerta do fornecedor foi ignorado várias vezes antes de alguém abrir a tela.

Notas técnicas de [[VCMM|BCM]] registradas na sessão:
- Mudanças em *Additional Information* precisam estar atribuídas aos ranges de [[BIN]] (aba *Assignments → Manage Assignments*). Como o banco tem **um único grupo**, todos os ranges já estão vinculados — **não é preciso reatribuir**.
- A propagação leva **algumas horas**.
- O campo **URL** só é necessário para **INAP** (In-App Provisioning), fora do escopo atual.

**[[Wallet Extensions|Wallet Extension]]** seguia falhando ao fim da reunião ("no se puede agregar la tarjeta"). A [[Thales]] associa diretamente à configuração ausente no BCM e aponta que existe uma linha dedicada à extension na configuração do SDK.

**[[Partner Hub]]:** o banco não tem dúvidas e vinha avançando, mas está **bloqueado aguardando a assinatura do contrato de termos e condições pela área gerencial** — o contrato foi ao jurídico, que precisa traduzi-lo e revisá-lo. A ação pendente no Hub é carregar o contrato assinado. **Material de marketing "bastante atrasado"**; a Visa **não participa** da produção — o banco produz conforme os requisitos da Apple e carrega no Hub para aprovação.

**[[FIME]]:** orientação de **consultar a disponibilidade sem fechar data**, decidindo depois em função do avanço dos testes.

### Click to Pay — dois incidentes
**Conectividade — resolvida.** O certificado usado pelo banco referenciava **Amazon RCA**, enquanto o endpoint da [[Thales]] em **STG** passou a apresentar **Amazon RCA 2048-M**; corrigida a cadeia de confiança, a resposta passou a ser bem-sucedida. Em 7/ago o tema é descrito simplesmente como certificado vencido. Fica em aberto perguntar à Thales se houve renovação planejada de certificados no STG.

**HTTP 503 no PUT — aberto.** Superada a geração de token/OAuth, o consumo do serviço seguinte (uma requisição **PUT**) retorna **503**. Sem causa raiz nem ETA; dependência total da [[Thales]].

**[[Register Consumer]] — causa identificada.** A falha era de dado: tentava-se registrar um **PAN já registrado na [[Thales]] com outro [[CAR ID]]**. O cartão terminado em 7392 já constava com um CAR ID específico e o Consumer ID correspondente. **Existem registros bem-sucedidos de 5/ago** — o banco tem jogo de dados válido.

> [!tip] Recomendação da [[Thales]]
> Parar de gastar tempo na etapa de registro em ambiente de teste: usar a dupla **[[CAR ID]] + Consumer ID já registrada**, ou dados limpos, ou bypassar o registro — e ir direto às provas de [[Click to Pay]] com o SDK, que é o que interessa. Existe a API **`getCard`** (entra o CAR ID, devolve o PAN); o banco deve manter **tabela associativa própria** entre seus dados e os CAR IDs.

**Notificações (push do [[Click to Pay]]):** duas opções — **backend-to-backend** ou **via frontend** do banco. Para frontend, a [[Thales]] precisa de dados de **Firebase e APNs**; prazo de 5 dias em teste + 5 em produção, mais aprovação em **CAB**. **Decisão: não são obrigatórias para a homologação e não são *stopper*** — ficam para depois, dado o aperto de prazo.

**Mecânica assíncrona explicada na sessão:** a API de enrolamento disparada pelo SDK vai à Visa de forma assíncrona — a Thales envia o requerimento, a Visa devolve erros de dados no momento, e depois há um **polling da Thales à Visa** buscando o estado; quando a Visa responde, a Thales responde ao banco.

## Decisões e pontos importantes
- **Certificados Apple Pay — encerrado.** Confirmou-se que os certificados usados no Google Pay e no Apple Pay **são os mesmos** e já estavam validados internamente: não é preciso gerar certificado exclusivo para Apple Pay. Resta só seguimento por e-mail de qualquer ponta solta.
- **Foco do Apple Pay migra** da configuração para a **correção do comportamento funcional pós-provisioning** e o fecho do débito.
- **[[FIME]] fica condicionado** a prova bem-sucedida de crédito **+** débito com evidência de tokenização.
- **Governança mantida:** rastreabilidade e visibilidade de bloqueadores nas weeklies, com os hitos de Apple Pay e [[Click to Pay]] alinhados ao roadmap regulatório. Próximo SteerCo: **28/ago/2026**.
- **Apple Pay — causa raiz** provável no **payload/token de login** (banco + [[Thales]]), não na config da Visa.
- **Ações Apple Pay:** publicar a app no **[[TestFlight]]**; reenviar e-mail à Apple confirmando o **[[AID (Apple)|AID]]**; compartilhar **Correlation ID / Token Reference ID** ([[Vital Sign]]) para diagnóstico.
- **[[Partner Hub]] — boa prática:** garantir mais de uma pessoa do banco com acesso.

## Pendências e riscos (atualizado na weekly de 7/ago/2026)

**Apple Pay**
- **Carregar o contrato de termos e condições assinado no [[Partner Hub]]** — depende da gerência e do jurídico do banco (tradução + revisão). **Bloqueio ativo, sem prazo e fora do controle do time de projeto.** Precisa de escalonamento.
- **Resolver a [[Wallet Extensions|Wallet Extension]]** — prioridade nº 1 do track e portão para a certificação [[FIME]]. Capturar logs de console e revisar a configuração da extension dentro do SDK da [[Thales]].
- **Produzir e carregar o material de marketing** conforme os requisitos da Apple (Yamila/marketing + Seba/comercial). Em atraso — e há precedente de emissor parado 2 meses por rejeição de peça.
- **Consultar a disponibilidade da [[FIME]]** sem fechar data.
- **Definir o critério de avanço para [[FIME]]** — condicionado a crédito + débito OK com evidência de tokenização.
- Garantir **2º acesso testado** ao [[Partner Hub]].

**[[Click to Pay]]**
- **Explicar/resolver o HTTP 503 no PUT** — sem causa raiz nem ETA, dependência total da [[Thales]]. É o que bloqueia o E2E.
- **Confirmar com a [[Thales]]** se houve mudança planejada ou renovação de certificados no ambiente STG.
- **Carregar manualmente os cartões nas tabelas do banco** e retestar o fluxo; exercitar o registro completo com outros cartões.
- Enviar dados de **Firebase e APNs** à [[Thales]] — pós-homologação, não bloqueante.
- **Deadline regulatório 30/set/2026** — sem evidência de E2E o risco de descumprimento sobe; manter tracking semanal e escalar cedo.

**Encerrado desde o último dossiê**
- ~~Crash do fluxo verde / push provisioning~~ — **funcionando** desde 7/ago.
- ~~Configuração de Apple no [[VCMM|BCM]]~~ — descoberto que o submit nunca fora efetivado; **regravado** na sessão de 7/ago.
- ~~Conectividade banco ↔ [[Thales]] em [[Click to Pay]]~~ — resolvida (cadeia de certificados Amazon RCA → RCA 2048-M / certificado vencido).
- ~~Causa do erro de [[Register Consumer]]~~ — identificada: PAN já registrado com outro [[CAR ID]]. Existem registros bem-sucedidos de 5/ago.
- ~~Necessidade de reatribuir ranges de [[BIN]] no BCM~~ — descartada (grupo único de Additional Information).
- ~~Obrigatoriedade das notificações para homologar~~ — esclarecido que **não são *stopper***.
- ~~Certificados Apple (JWS/JWE, WSD/ZCMK)~~ — mesmos certificados do Google Pay, validados; tema fechado no SteerCo.
- ~~DEF dos 5 BINes~~ — enviados **5 BINs de crédito + 2 de débito**; DEF/BINes validado.

**Ainda em aberto do ciclo anterior**
- Confirmar a vigência do [[AID (Apple)|AID]] com a Apple.
- Compartilhar **Correlation ID / Token Reference ID** para diagnóstico.
- **Débito no Apple Pay** — HTTP 400 / responseCode 911 reportado no SteerCo de 30/jul; a weekly de 7/ago não retomou o tema explicitamente. **Confirmar se segue aberto.**

---
[[Home]]
