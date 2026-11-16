---
tags: ["proyecto", "cliente/BBVA-Uruguay"]
fuente: Seguimento Switch ITSP + Google Pay (18/ago/2026); transcrições automáticas de ago–nov/2026 (seguimento ~24/ago, weekly 31/ago, Pipeline Review 4/set, Weekly Tech 28/set–16/nov)
estado: parcial
---

# 🇺🇾 BBVA Uruguay — Switch/ITSP + Google Pay

> [!info] Dossiê de projeto (contexto qualitativo)
> Projeto **em reta final**. Assumido por Bruno durante a licença da Lina (ago/2026).

## Ficha
- **Cliente:** BBVA Uruguay. **País:** Uruguai.
- **Escopo:** troca de **switch / [[ITSP]]** + habilitação de **Google Pay** ([[Push - In-App Provisioning (fluxo verde)|push provisioning]] e provisionamento *legacy*), gestão de tokens via **[[TLCM (Token Lifecycle Manager)|TLCM]]**.
- **Governança:** reunião recorrente de seguimento, pauta curta, minuta enviada pela Visa.
- Descrito na própria reunião como "proyecto muy largo y complicado" — está fechando.

> [!warning] Atualização de 16/nov/2026 — projeto fechado para a VCA
> O projeto original (switch/ITSP + Google Pay) foi **encerrado** e saiu da carteira de Bruno (até 5/out/2026). O que vem de **18/ago** para trás foi verificado; o que foi acrescentado em 16/nov vem de **transcrições automáticas não validadas** (por isso `estado: parcial`). As seções novas estão marcadas com "(acréscimo de 16/nov)".

## Status atual (base: 16/nov/2026) — acréscimo de 16/nov
**Projeto original: fechado.** O Google Pay saiu a produção em **20/ago/2026**, com aprovisionamento médio de **~93%**. Em 4/set decidiu-se fechar em ~10 dias, sem extensão de contrato; em ~28–29/set o projeto consta como fechado, com e-mail de encerramento enviado pelo Franco (Technical PM de CS).

**O que segue vivo é comercial, não é de Bruno:** uma oportunidade de **Apple Pay** (Lina e Desi), em que o cliente, em 16/nov, aceitou os requisitos mas **rejeitou o prazo de 4–6 meses** (esperava 3), e um prospect novo de **Featurespace** (Q2/Q3).

> [!caution] Até onde vai a informação
> - **Google Pay e [[TLCM (Token Lifecycle Manager)|TLCM]] (técnico):** até o weekly de **31/ago**. Sem reunião posterior.
> - **Encerramento:** até **~29/set**.
> - **Apple Pay e Featurespace:** até **16/nov**.
> - **Sem desfecho confirmado:** correção do OTP por SMS (prevista para 1/set), resposta do Google sobre o aviso de incompatibilidade, token ranges por [[BIN]], e a situação dos ~2.010 cartões do PAN replacement depois de outubro.

## Status em 18/ago/2026 (histórico — verificado)
**Testes concluídos** — push provisioning e *legacy* funcionando. **Material de marketing aprovado pelo Google** (após uma mudança de logo). O passo seguinte é a Visa enviar ao Google o pacote (testes + material) propondo a data de saída.

**Sequência até o fecho:** aprovação do Google → levantar a [[Whitelist|whitelist]] → alguns dias de monitoramento em produção (taxas de provisionamento e transacionalidade) → **encerramento do projeto**.

## Decisões (18/ago/2026)
1. **Propor 20/ago como data de go-live**, enfatizando ao Google a relevância dessa data.
2. **Descartar 24 e 26/ago** — **25/ago é feriado nacional no Uruguai** (Dia da Independência), com pouco suporte, e sair no dia 26 desperdiça a semana.
3. **Lançamento apenas Android → sem redes sociais** no início ("no queremos hacer mucho ruido"), para não frustrar portadores de iOS. Pode ampliar depois, sempre com nova aprovação do Google.
4. **Toda nova campanha de marketing de Google Pay passa pelo portal para aprovação do Google.**
5. **O tema de [[TLCM (Token Lifecycle Manager)|TLCM]] não bloqueia a saída** — segue como investigação em paralelo.

## Pendências e riscos
- **Resposta do Google sobre a data** — está fora do controle da Visa e o Google costuma pedir mais prazo. Risco direto sobre o dia 20.
- **Janela de calendário estreita** — o feriado de 25/ago reduz o suporte; deslizar do 20 empurra o go-live para depois de 26.
- **[[TLCM (Token Lifecycle Manager)|TLCM]] — rollback de reatribuição de token.** O banco perguntou se é possível desfazer a reatribuição de tokens a um PAN anterior (rollback de uma troca de cartão feita por erro). Sem resposta conclusiva. Em teste, ao forçar uma substituição, o cartão "antigo" **não pôde ser provisionado novamente**. Entendimento preliminar: ao desabilitar um PAN no TLCM e religar seus tokens a um PAN novo, evita-se que aquele PAN volte a ser provisionado — **a confirmar**. Afeta um grupo reduzido de cartões já alterados.
- **Publicar o app do banco** para o push aparecer na data de saída.
- **Risco de handover no banco** — o responsável trabalha por projeto e migrará para outro; o procedimento de aprovação de marketing junto ao Google pode se perder. **Deixar por escrito na entrega.**

> [!tip] Regra de marca a registrar na entrega
> Toda comunicação nova relacionada a Google Pay deve ser **subida ao portal e aprovada pelo Google** (logos corretos, consistência de imagem de marca). Isso vale **depois** do lançamento, para cada campanha — e é exatamente o tipo de procedimento que se perde num handover interno do banco.

## O go-live e as duas semanas seguintes (20–31/ago/2026) — acréscimo de 16/nov
A data proposta em 18/ago se cumpriu: a [[Whitelist|whitelist]] foi levantada na **quinta 20/ago, por volta das 10h30**. O primeiro dia fechou em **78,5%** de aprovisionamento (mais de 200 tentativas) — número mais baixo explicado pela hora de abertura —, o segundo em **95,2%** (mais de 400) e o terceiro em **93%**. O banco só enviou o e-mail aos clientes na sexta à tarde, coerente com a decisão de 18/ago de não fazer ruído. Em 31/ago a média desde a saída era **~93% (92,7%)**.

Com o produto no ar, a conversa passou a ser sobre três atritos, nenhum deles de configuração Visa:

**1. OTP por SMS.** Clientes recebiam um só método de autenticação. Em ~24/ago o tema era tratado como problema do lado Google/Visa: Franco escalou a integrações e ao Google, e levantou a hipótese de que, ao desativar a regra da whitelist nas regras de risco do [[Emissor|emissor]], outra regra preexistente tivesse passado a atuar. Em 31/ago a leitura mudou: **o banco encontrou causa interna** — numa atualização recente deixou de validar corretamente o celular e passou a enviar um só método. A correção ficou para 1/set. O banco retirou a consulta que tinha aberto no suporte do Google.
- Um segundo comportamento, anterior e separado (celulares com muitos aprovisionamentos recebem só um método), ficou sem solução.

**2. Aviso genérico do Google Pay** ("no se admiten pagos sin contacto"), em duas telas. A mensagem dá a entender que nenhum cartão do banco é admitido. Um cliente que errou o vencimento ficou irritado e não quis tentar de novo; antes disso tinha havido uma falha no fluxo [[Push - In-App Provisioning (fluxo verde)|in-app]] ainda sem explicação. Escalado ao Google; follow-up em 31/ago.

**3. Promoções por [[BIN]] que não aplicam com a carteira** (tema novo em 31/ago). Comércios dão desconto pelo BIN; com Google Pay o POS recebe o token e o desconto não entra. Existe um **token range associado a cada BIN**; ficou por confirmar como o banco os consulta.

## O caso do TLCM: a pergunta de 18/ago teve resposta — acréscimo de 16/nov
A dúvida registrada em 18/ago ("existe rollback da reatribuição de tokens?") foi respondida, e a resposta é **não**.

> [!danger] PAN replacement não tem volta
> O PAN replacement no [[TLCM (Token Lifecycle Manager)|TLCM]] desassocia **todos** os tokens do PAN antigo e os associa ao novo; é binário. Tentar um novo replacement de volta ao PAN original devolveu **"request inválido", sem código** (mostrado ao vivo pelo banco em ~24/ago). Em 31/ago o ponto foi dado como **fechado sem solução**; a necessidade foi levada a produto como melhoria futura.

**O que aconteceu.** O banco enviou em lote, pelo serviço de atualização de cartões usado pelo [[Processador|processador]], renovações **futuras** — cartões novos que só passam a valer em outubro. O efeito foi inutilizar o PAN vigente para [[Tokenização|tokenização]]: os cartões atuais seguem funcionando presencialmente, mas são recusados em e-commerce e não podem ser aprovisionados. **~2.010 cartões** (o banco disse "2010", a Visa repetiu "2000"). Não era, portanto, o "grupo reduzido" que se supunha em 18/ago.

**O que se decidiu.** O banco **pausou** a atualização em lote. Habilitar já os PANs novos não serve (os cartões ainda não foram entregues) e substituir fisicamente os cartões não é viável (clientes fora do país). Não ficou registrado plano de mitigação, nem há confirmação de que a situação se normalizou em outubro.

## Por que o projeto foi fechado como foi (set/2026) — acréscimo de 16/nov
Na primeira Pipeline Review VCA × CS (**4/set**), o quadro era: Google Pay em produção desde agosto com ~90% de aprovisionamento, **contrato já vencido** e a pendência restante atribuída ao Google. A decisão foi dar **até ~10 dias** e fechar com carta de turnover, **sem extensão**. Ou seja: produto no ar, contrato sem vigência e o que restava fora do controle da Visa — não se abriu adenda para esperar.

Em ~28/set o projeto aparece como fechado (e-mail de encerramento). Em ~29/set Bruno registra que houve desencontro de agenda na reunião de fechamento e que Franco já tinha enviado o mail. Em 5/out, com a Lina de volta, Bruno confirma que BBVA não está mais na sua carteira.

> [!note] O que não se sabe sobre o fechamento
> A data exata do e-mail de encerramento, se a reunião de fechamento foi refeita e se a regra de marca destacada em 18/ago (toda campanha nova de Google Pay passa pelo portal do Google) ficou por escrito na entrega.

## Apple Pay: de "dentro de poco" a oportunidade em negociação — acréscimo de 16/nov
Já em ~24/ago o banco dizia que o projeto incluía, "dentro de poco", a carteira da Apple. Ao reassumir a carteira (~28/set), Lina contou o histórico que explica por que a Apple não entrou no projeto original: a troca de [[ITSP]] para o processador novo (ouvido "Tohu" — grafia a confirmar; o anterior é HCT) e o pedido de **[[Waiver|waiver]] de [[Wallet Extensions]], negado pela Apple** mesmo com escalada até Miami. Wallet Extensions é pré-requisito de Apple Pay, e esse caso passou a ser citado internamente como prova de que a Apple não abre exceção.

Sequência da oportunidade:
- **~28/set** — Lina pede uma linha de prospecting "BBVA Uruguay Apple Pay" na planilha de pipeline.
- **5/out** — entra como prospecting; BD: Vane (Vanessa); contato interno: Felipe Merea.
- **2/nov** — o processador novo desenvolve Wallet Extensions; pede-se status; o BBVA não responde; escalado com a BD.
- **11/nov** — sem novidades.
- **16/nov** — reunião com o cliente: **aceita os requisitos, rejeita o prazo de 4–6 meses** (esperava 3).

> [!warning] O precedente do Expedite
> No Google Pay, CS fez configurações em regime acelerado (1–2 dias em vez do prazo normal de ~10) **sem custo**. Na leitura da Lina (16/nov) isso cria precedente: o cliente pode esperar o mesmo no Apple Pay.

**Featurespace.** Em 16/nov, BBVA Uruguay foi citado também como prospect novo de Featurespace (Q2/Q3). Só a menção; Lina ficou de registrar a oportunidade.

## Linha do tempo (ago–nov/2026) — acréscimo de 16/nov
- **18/ago** — Decisões de go-live (seção acima).
- **20/ago** — **Go-live do Google Pay** (~10h30). 78,5%.
- **21–22/ago** — E-mail aos clientes; 95,2% e 93%.
- **~24/ago** — Seguimento (data inferida): OTP, TLCM com ~2.010 cartões, aviso do Google. Banco pausa o lote.
- **31/ago** — Weekly: média ~93%; causa interna do OTP; TLCM fechado sem solução; promoções por BIN.
- **1/set** — Correção do OTP prevista (sem confirmação).
- **4/set** — Pipeline Review VCA × CS: fechar em ~10 dias, sem extensão.
- **~28–29/set** — Projeto fechado; e-mail de encerramento do Franco.
- **5/out** — Fora da carteira de Bruno; Apple Pay entra como prospecting.
- **2/nov** — Apple Pay: processador desenvolve Wallet Extensions; banco sem resposta; escalado.
- **16/nov** — Apple Pay: cliente aceita requisitos, rejeita 4–6 meses. Featurespace citado como prospect.

## Lições que ficam — acréscimo de 16/nov
- **Validar a data de vigência antes de rodar lotes de PAN replacement.** Renovação futura enviada antes da hora inutiliza o PAN vigente para tokenização, e não há como desfazer.
- **Ao levantar a whitelist, revisar a ordem das regras de risco restantes** (hipótese levantada no caso do OTP; não confirmada como causa).
- **Mapear promoções por BIN antes do go-live** e informar os token ranges aos comércios.
- **A taxa do primeiro dia não é referência**: sobe para mais de 90% no segundo.
- **Apple não dá waiver de Wallet Extensions** — levantar esse pré-requisito no início de qualquer conversa de Apple Pay.
- **Expedite sem custo vira expectativa** no projeto seguinte do mesmo cliente.
- Na Pipeline Review de 4/set, CS deixou a recomendação de não levar ao cliente um plano muito granular sem alguém de implementações na conversa.

## Pessoas (ago–nov/2026) — acréscimo de 16/nov
- **Visa:** Franco (Technical PM de CS — conduziu a implementação e o fechamento); Bruno (acompanhamento VCA durante a licença da Lina); Lina Torres e Desi (oportunidades de Apple Pay e Featurespace); Dani ([[CSM (Customer Success Manager)|CSM]]); Vane/Vanessa (BD); Felipe Merea (contato interno da conta — papel a confirmar).
- **BBVA:** Diego (interlocutor principal); Guille; Andrea (head de pagamentos, citada).
- **Processador novo:** Paco e Inés. **A confirmar:** Rafa (analisa logs com Franco; empresa não confirmada).

---
[[Home]]
