---
tags: ["proyecto", "cliente/Banco-de-Corrientes"]
fuente: Reports e atas — Banco de Corrientes; transcrições automáticas de ago–nov/2026 (não validadas)
estado: parcial
---

# 🇦🇷 Banco de Corrientes (Argentina)

> [!success] Confirmado por Bruno em 16/11/2026
> O projeto de implementação de Click to Pay está **finalizado** e o banco **não pagou a multa de US$ 5.000** à Visa.


> [!info] Dossiê de projeto (contexto qualitativo)
> O acompanhamento **vivo** está no app. Aqui fica o contexto e a história.

## Ficha
- **Cliente:** Banco de Corrientes. **País:** Argentina.
- **Tracks:** Apple Pay e [[Click to Pay]]. Acompanhamento até **30/set**.
- **[[Processador]]:** [[Prisma]]. **TSP/SDK ([[ITSP]]):** [[Thales]]. **Certificador:** [[FIME]].
- **Contatos —** Banco: Martín De la Vega (executivo), Juan Torres "Juanjo" (Torres Barusso), Verónica Escobar, Valentina Torrado, Cristian (técnico). Visa: Lina Torres, Marlene Migliardi, Javier Cadena, Laura. [[Thales]]: Patricia González, Miguel Ángel. [[Prisma]]: Ivan Hirsch, Mario.
  - ⚠️ A tabela de participantes da minuta de 30/jul lista **Edgar Javier Cadena** na linha do banco e embaralha as linhas de Visa/[[Thales]]/[[Prisma]] (Patricia González aparece sob Visa, Ivan Hirsch sob Thales). O vínculo aqui — Patricia/[[Thales]], Ivan/[[Prisma]], Javier Cadena/Visa — é o verificado nos weeklies; **confirmar com o autor da minuta** antes de propagar a versão dela.

## Status em 16/11/2026 (base: transcrições de set–nov/2026)

> [!warning] Até onde vai a informação
> Conteúdo novo vindo de **transcrição automática não validada**. Última reunião de Corrientes com conteúdo técnico: **7/out/2026**. Última menção ao estado contratual: **5/out/2026**. Depois disso só há duas citações (2 e 4/nov) confirmando o [[Click to Pay]] em produção. **Sobre o Apple Pay depois de 7/out não há nada.**

**Programa encerrado em 30/set/2026.** [[Click to Pay]] **concluído** — fase 2 em produção desde **25/set**, cinco dias antes do prazo do [[Mandato|mandato]]; fase 3 (logo nas credenciais) com evidências registradas; fechamento carregado pelo banco no Visa Access em 29/set. **Apple Pay** saiu do programa sem certificação e seguiu em canal técnico: pré-certificação [[FIME]] iniciada em 5/out e, em 7/out, erro em prova produtiva de push provisioning sem causa identificada. Para a carteira de Bruno e de VCA o projeto está **fechado**: segue com CS por billing ("va por billing ahora", Weekly Tech de 5/out).

## Status anterior (base: weekly de 7/ago/2026)
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
- **24/ago/2026** — Sessão técnica [[Click to Pay]] com a [[Thales]]: login do SDK responde OK, o enrolamento falha; a Thales enxerga três logins por disparo.
- **27/ago/2026** — Reuniões internas sobre a cobrança de US$ 5.000 (ver seção "As duas cobranças").
- **~28/ago/2026** — Weekly: o erro passa a vir da Visa (emissor/agregador não habilitado no ambiente de teste); caso aberto no Support Hub. Não há transcrição de 3º SteerCo nessa data.
- **2–3/set/2026** — Escalação interna do custo de US$ 350 do sandbox; decidido não cobrar "desta vez".
- **~4/set/2026** (alternativa 11/set) — **Decisão de ir direto a produção controlada.**
- **25/set/2026** — **[[Click to Pay]] fase 2 em produção.**
- **29/set/2026** — Reunião de continuidade do Apple Pay; fechamento do mandato carregado no Visa Access.
- **30/set/2026** — **SteerCo de fechamento do programa.**
- **~2/out/2026** — Seguimento: banco sinaliza "ir por billing", sem decisão formal.
- **5/out/2026** — Início da pré-certificação [[FIME]]; internamente, Corrientes sai da carteira VCA.
- **7/out/2026** — Erro em casos produtivos de push provisioning. Último registro.
- **25 ou 26/out/2026** — Início planejado da certificação oficial [[FIME]] (data a confirmar; resultado desconhecido).

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

## Como o Click to Pay chegou a produção (ago–set/2026)

Em 7/ago o bloqueio era o HTTP 503 e as colisões de [[CAR ID]] no [[Register Consumer]]. Esses dois temas não voltam a aparecer. No fim de agosto, certificados, OAuth e login do SDK da [[Thales]] já funcionavam, e o erro mudou de natureza: a resposta passou a vir **da Visa**, dizendo que o emissor/chamador não estava habilitado para aquele dado (texto exato não confiável na transcrição).

A causa só ficou clara em ~4/set: **faltava configurar, no ambiente de teste da Visa, a relação entre o identificador da [[Thales]] (agregador certificado) e o [[BID|Business ID]] do banco.** A habilitação que a Visa fizera em produção para o [[Enrolamento massivo|enrolamento massivo]] da fase 1 **não se replica no ambiente de teste**. Para tê-la, é preciso um pedido formal de configuração — até 10 dias úteis a partir do caso, e com custo.

Com o prazo de 30/set à vista, o banco tomou o atalho: **promover a fase 2 direto a produção em modo controlado** — iOS via [[TestFlight]], Android via grupo de teste no Google Play, só para o time de desenvolvimento. A Visa confirmou que, com a prova em produção, a fase 2 podia ser indicada como produtiva e o marco perante Rules ficava cumprido. O deploy estava previsto para a semana seguinte; a entrada em produção registrada é **25/set** (o intervalo não é explicado nas transcrições).

> [!tip] O que vale reaproveitar
> Para fase 2 de [[Click to Pay]] com agregador, **pedir a configuração do ambiente de teste no início do projeto**. Corrientes foi dos pioneiros na fase 2 e o primeiro emissor a sair com isto na Argentina; outros emissores com [[Thales]] terão a mesma necessidade. E quando o prazo aperta, produção controlada conta para o mandato.

Dois detalhes de produto registrados no caminho: em produção a habilitação de [[Click to Pay]] é **por produto (crédito/débito), não por [[BIN]]**; no sandbox só se configuram os BINs de teste pedidos por formulário, no máximo cinco. E a [[Prisma]] havia deixado desde julho uma base consolidada de Consumer IDs e Card IDs registrados em produção, que o banco precisava carregar nas próprias tabelas antes do go-live para não tentar registrar de novo (carga não confirmada explicitamente).

## As duas cobranças: US$ 5.000 e US$ 350

**US$ 5.000 — penalidade de Rules.** A história, contada por Produto em 27/ago: carta de não conformidade enviada em dezembro/2025; plano do banco aprovado em 20/jan com fase 2 até 30/abr; por volta de 1/mai o banco pede extensão para 30/out; Produto só aprova planos até o fim do ano fiscal, e o plano é reaprovado em junho com 30/set; a cobrança aparece na fatura de julho. A tabela é escalonada (5.000, 10.000, 15.000…) — cada alteração de data sobe um degrau.

O banco contestou porque tinha contratado a consultoria da Visa. A posição interna foi firme: o entregável de VCA é **acompanhamento, não execução**; o contrato de PMO não compromete a Visa com data de entrega; o cliente sabia da penalidade desde abril. **VIS não cobre a multa.** Comercial quis evitar a cobrança por causa da renovação do contrato de incentivos; Rules respondeu por e-mail que não se pode reembolsar; ficou de se pedir condonação. **Nenhuma fonte registra o desfecho.** O que se sabe é que o [[Mandato|mandato]] foi cumprido — não há indício de segundo degrau (dedução).

**US$ 350 — o sandbox.** Ao analisar o caso aberto no Support Hub, o suporte respondeu que precisaria criar/configurar um sandbox, com custo de US$ 350 para o banco. Vindo logo depois de uma conversa "áspera" sobre os US$ 5.000, o time considerou que o problema não era o valor, era a fricção. Consenso de não cobrar; ninguém sabia o procedimento para bonificar. Em 3/set decidiu-se **não cobrar desta vez**, sem definir o que acontece se o caso se repetir. Como o banco foi direto a produção, o pedido de configuração ficou em espera. Sem registro de cobrança efetiva.

> [!warning] Lição
> Penalidade de Rules e contrato de acompanhamento são coisas independentes — mas o cliente não vê assim. Dizer em proposta e kickoff que a consultoria **não isenta de penalidades nem cobre o suporte de outras equipes**, e avisar dos custos extras (ambiente de teste) no começo.

## O fechamento do programa (30/set/2026)

Edgar "Javier" Cadena conduziu o steering de fechamento com Verónica e Laila (em nome de Martín) pelo banco e Patricia pela [[Thales]]. Mensagem central: o programa cumpriu o objetivo de executar [[Click to Pay]] e Apple Pay em paralelo.

- **[[Click to Pay]]** passa a operação normal.
- **Apple Pay** sai do programa "com rota de certificação confirmada": push provisioning provado nos fluxos [[Fluxo amarelo (85)|amarelo]] e [[Fluxo verde (00)|verdes]], [[Wallet Extensions|wallet extension]] funcionando em provas isoladas, [[FIME]] agendada.
- **Regra de continuidade:** o programa e a governança fecham; o workstream não. Desvio que afete a [[FIME]] escala pelo canal técnico existente, **sem reabrir a governança**.
- **Remanescentes, todos do banco:** estabilizar a app unificada e repetir as provas; completar dados e wireframes no [[Partner Hub]]; coordenar cartões e dados para o laboratório.
- A [[Thales]] pediu o documento de evidências das provas em produção ("ATP de Thales"), pré-requisito do seu handover interno a operações.

Modelo de fechamento que ficou como referência: resumo, valor entregue, remanescentes com dono e regra de continuidade.

## A continuidade do Apple Pay: versões que não fecham

O acordo de acompanhamento terminava em 30/set e a certificação só começava em outubro. O tema já estava no radar interno desde o fim de agosto (iniciar conversa de renovação; em 4/set: exigiria adenda, cliente sem fundos, e "sem contrato, CS cobra por billing"), mas só chegou ao banco na **véspera**, em 29/set.

| Fonte | O que diz |
|---|---|
| Reunião com o banco, 29/set | Opção 1: manter o acordo por mais um mês, cobrado via billing (desconto na fatura mensal). Opção 2: não continuar, sem cobrança — reabrir depois é mais caro e burocrático |
| Weekly Tech, 29/set (interna) | Opções: renovar com VCA **ou** seguir por billing de CS a **USD 3.000/mês**, mês a mês; FIME → produção → monitoramento levaria uns dois meses ou mais |
| Seguimento, ~2/out | Bruno segue por pelo menos mais um mês **ou** vão "por billing". Banco: sem decisão formal, mas a direção é billing, para manter o apoio de Franco; cita "los 3.000 dólares" |
| Weekly Tech, 5/out (interna) | "Corrientes va por billing ahora" — fechado para VCA |

Também não fecha a **data de fim do contrato**: a Visa sustenta 30/set (extensão acordada por e-mail, fora do contrato); o banco falou em dia 14 e, noutra fonte, 15/out. Antes disso, em ~28/set, o cliente já tinha sinalizado que a diretoria não renovaria com VCA.

Leitura mais recente, que manda: **o Apple Pay seguiu com CS por billing e o projeto saiu da carteira VCA.** O que falta para dar isso por verificado é a decisão formal do banco por e-mail, que não aparece em nenhuma fonte.

> [!warning] Lição
> Discutir o fim do acordo **semanas antes**, não na véspera. Aqui a certificação começou sem cobertura formal.

## Apple Pay em outubro — último estado conhecido (7/out/2026)

- **Lado Visa:** configurações e VRM concluídas desde o fim de agosto; resta liberar a [[Whitelist|whitelist]] no dia da saída a produção.
- **[[Partner Hub]]:** o bloqueio da assinatura de T&C ficou para trás — documentação assinada e validada pela Apple, três pessoas do banco com acesso, identificador da app e wireframe informados. As peças de marketing estão prontas e aguardam o passo do Hub abrir. Confirmado que **a Visa não tem material de marketing da Apple**: tudo sai do Hub.
- **[[FIME]]:** o banco decidiu ir ao laboratório por conta própria. Juntou 12 cartões produtivos (3 usuários × 2 de débito + 2 de crédito). Pré-certificação de 5 dias a partir de 5/out; certificação oficial de duas semanas no fim de outubro.
- **Artes:** a FIME pede arte por faixa de [[BIN]], mas o banco tem várias artes no mesmo BIN por grupo de afinidade. Orientação provisória: enviar as artes que aparecem no cartão tokenizado e confirmar com a FIME (resposta não registrada).
- **App unificada** integrada só em ~1/out, dias antes do laboratório.
- **7/out — bloqueio:** em prova produtiva de push provisioning iniciado na app do banco, a wallet se fecha ao lançar o pedido. A [[Prisma]] não encontra pedidos no VRM para os cartões e o pedido tampouco chega a ela. O time de riscos valida se regras de VRM estão friccionando. Bruno não tem acesso para verificar o lado Visa e encaminha a Franco. Sem causa nem solução registradas.

## Decisões de set–out/2026
- Dúvida técnica de [[Click to Pay]] vai por ticket no Support Hub, mesmo com projeto aberto — abrir cedo e incluir o X-Correlation-ID.
- VIS não cobre a multa; pedidos sobre a multa centralizam em Bruno.
- Não cobrar os US$ 350 desta vez.
- Produção controlada em vez de esperar o ambiente de teste.
- Fechar o programa em 30/set, mantendo o Apple Pay em seguimento técnico.
- Corrientes sai da carteira VCA; Apple Pay segue por billing de CS.

## Em aberto / a confirmar (16/11/2026)
- Tudo sobre o Apple Pay depois de 7/out: causa do erro, resultado da pré-certificação, data e resultado da certificação oficial (25/out dito no steering é domingo; o registro anterior tinha 26/out–6/nov), go-live.
- Decisão formal do banco sobre a continuidade e o valor (USD 3.000/mês vem de fonte interna; em 4/set aparece "3.500 dólares").
- Data real de fim do contrato (30/set × 14 ou 15/out).
- Desfecho dos US$ 5.000 com Rules e dos US$ 350.
- Resposta formal da Visa ao fechamento do mandato no Visa Access.
- Entrega do ATP de Thales.
- Data exata da weekly da decisão de produção controlada (~4/set ou 11/set).
- Filiação de Patricia (tratada como [[Thales]] por falas próprias) e grafia de Laila.

---
[[Home]]
