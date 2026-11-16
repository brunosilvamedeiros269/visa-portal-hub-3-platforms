---
tags: ["proyecto", "cliente/BCI"]
fuente: Transcrições de set–nov/2026 (reunião interna de 05/10, demo Featurespace de 09/10, 1:1 com Lina, Weekly Tech, weeklies SOCO)
estado: parcial
---

# 🇨🇱 BCI (Featurespace) — migração da plataforma de risco para SaaS

> [!success] Confirmado por Bruno em 16/11/2026
> O **BCI ainda não é cliente — está em prospecção**.


> [!info] Dossiê de pré-venda (contexto qualitativo)
> **Ainda não é projeto.** Em 16/11/2026 não há contrato de implementação assinado. Este dossiê guarda o contexto para quando arrancar — e o que a equipe aprendeu sobre o produto.

> [!warning] Conteúdo parcial
> Tudo aqui vem de transcrições automáticas não validadas. A reunião cujo arquivo se chama "BCI" (05/10) começa a meio e **não nomeia o cliente da migração**; a ligação ao BCI assenta no nome do arquivo e no que Lina contou nos 1:1. Confirmar com Lina antes de tratar como fato.

## Ficha
- **Cliente:** BCI. **País:** Chile.
- **Produto:** ARIC, a plataforma de gestão de risco e fraude da Featurespace.
- **Situação do banco:** tem a plataforma desde ~2020/21, comprada via o reseller Nuvatec e instalada no tenant Azure do próprio banco (modelo IaaS).
- **O que se propõe:** migrar para o modelo SaaS e, depois, evoluir o uso.
- **Fase (16/11/2026):** pré-venda. Reunião com o banco marcada para **18/11**.
- **Time Visa —** Sole e Rodri lideram a conversa comercial (Diego cobre Rodri); Lina fez a parte de tecnologia do assessment e montou a proposta; Desi cobriu em outubro; Gerard/Gerardo (pré-venda de produtos de risco) `[grafia a confirmar]`; Felipe (recursos de analítica) `[área a confirmar]`; **Bruno** apoia Lina nas arquiteturas e é o PM indicado para quando assinar.
- **Sem Client Services:** projetos Featurespace correm fora de CS.

## Por que este caso importa
Dentro da Visa o BCI foi apresentado como o **primeiro caso global com Featurespace** — foi candidato a prémio interno em agosto e subiu ao palco do LAC Market Kickoff em outubro. Em 26/10 Lina resumiu: nenhum projeto Featurespace está em execução, e o BCI foi o único já executado (o assessment). O que se aprender aqui vira modelo para as oportunidades seguintes.

## A história até aqui
**O ponto de partida.** O BCI opera a plataforma por conta própria, em infraestrutura sua. O assessment da Visa — quatro equipes: tecnologia (Lina), risco, Core Consulting e regras — terminou por volta de agosto–setembro de 2026 e encontrou um ambiente difícil de sustentar: sem gestão de patches, upgrade de MongoDB caro, Red Hat perto de ficar sem suporte, sem plano de recuperação de desastre. No uso, dois achados de negócio: a plataforma não decide em tempo real para o crédito do banco, e o [[Processador|processador]] decide por fraude antes das validações operativas.

**A recomendação.** Migrar para SaaS primeiro; depois modelos de consórcio, mais fontes de dados (foi citada a BioCatch) e uso em linha. A razão técnica dada por Lina: em SaaS os modelos de consórcio são quase plug-and-play; em IaaS exigem consultores e custam caro.

**A proposta.** Em fases — SaaS → modelos de machine learning → mudança de fluxo —, com a mesma plantilha usada para o Banco de Chile. Em 05/10 o PPT estava pronto e faltavam os números. A estimativa de esforço que circulou nesse dia: **123 dias = US$ 184.000**, ainda por validar internamente.

**O relógio das licenças.** As licenças do banco venciam em setembro e foram renovadas temporariamente até **dezembro**, enquanto se assina a passagem a SaaS.

**O travão.** O time de analítica tem restrição global de capacidade. Em 05/10 a leitura era: improvável em Q1, mais realista **Q2 FY27** (a partir de ~janeiro), e só com reserva antecipada. Decidiu-se **não prometer Q1** ao cliente.

**Outubro–novembro.** Desi retomou o contato com o banco em 09/10 e encontrou os dados de custo desalinhados — o banco tinha passado números diferentes em dois momentos; era preciso fixar um baseline antes de enviar a proposta. Em novembro a condução passou a Rodri e Sole. A reunião de 11/11 foi cancelada por "Tiago" `[quem é: a confirmar]` e remarcada para **18/11**.

## O que é o ARIC (demo de 09/10)
Federico apresentou ao time a demo inicial padrão — a mesma dada a emissores e adquirentes.

- **Não é só um motor de regras nem só um score**: é a plataforma inteira de gestão de risco. Decide em tempo real, near-real-time e batch.
- **Soluções modulares**: crime financeiro, cartões e autenticação, pagamentos em tempo real e canais digitais, adquirência (dois módulos), onboarding. Cada uma com regras adaptativas por comportamento e modelo de machine learning próprio.
- **SaaS em AWS**, interface web, um ambiente isolado por cliente. Utilizadores e atualizações de versão incluídos.
- **Três canais**: interface de utilizador, uma API de eventos única, e saída de dados por S3 para o data lake do cliente.
- **Retenção**: 3 meses ao vivo, 13 meses de histórico. Para auditoria de 2 anos, o cliente tem de exportar.
- **Operação**: alertas agrupam-se em incidentes por entidade; filtros viram filas de trabalho; o analista marca risco/genuíno e isso realimenta os modelos.
- **Multi-tenancy**: uma processadora pode revender criando tenants por banco.

> [!bug] Limitações ditas abertamente
> Relatórios internos a dia fechado e BI fraco (a aposta é o BI do cliente). Sem SLA nativo por incidente. Não é um orquestrador — cada fluxo externo é desenvolvimento à parte. Provas de conceito analíticas suspensas por falta de capacidade. Migrar histórico de outro sistema é possível, mas difícil, e a geração dos dados fica com o [[Emissor|emissor]].

A parte de analítica (perfis, regras, modelos) ficou para uma segunda sessão; não há transcrição dela.

## Para não confundir: as outras oportunidades Featurespace
| Cliente | O que é | Estado |
|---|---|---|
| **Banco de Chile** | Solução de cartões; seria a primeira com integração direta [[VisaNet]] → Featurespace. O banco quer internalizar a gestão de fraude hoje feita pelo processador. Assessment primeiro, implementação depois | Pré-venda; banco indicou Q2 FY27 |
| **Galicia** | Assessment de risco só do banco: 3 meses + 6 de modelo operativo | Proposta revisada; falta levar ao cliente |
| **BROU** | — | Em espera |
| **BBVA Uruguay** | — | Prospect novo (Q2/Q3) |

A oportunidade Featurespace do Banco de Chile **não é** o projeto Nexus–Nuek do mesmo banco.

## Riscos que já se veem
1. Capacidade do time de analítica — é o que define a data, não a vontade do cliente.
2. Licenças temporárias vencem em dezembro sem a passagem a SaaS assinada.
3. Baseline de custos inconsistente atrasa a proposta.
4. Integração [[VisaNet]] → Featurespace ainda em roadmap (anúncio esperado para nov/2026, incerto).

## Lições que Lina deixou do assessment
- Coordenar bem as entrevistas com o banco.
- Evitar perda de contexto entre sessões.
- Transcrever tudo e guardar num repositório central.
- Contar com ~6 meses de dados mínimos para boas decisões; a qualidade dos dados é trabalho do cliente.

## Linha do tempo
- **~2020/21** — BCI compra a plataforma via Nuvatec; instala em Azure próprio.
- **~ago–set/2026** — assessment Visa concluído.
- **set/2026** — licenças renovadas temporariamente até dezembro.
- **05/10/2026** — alinhamento interno: 123 dias / US$ 184 mil; recursos só em Q2.
- **09/10/2026** — demo ARIC para o time; Desi retoma contato com o banco.
- **22/10/2026** — caso BCI/Featurespace no LAC Market Kickoff.
- **26/10/2026** — Bruno entra para apoiar a proposta (arquiteturas as-is / to-be).
- **10/11/2026** — BCI indicado como próximo projeto de Bruno; não assinado.
- **11/11/2026** — reunião com o banco cancelada.
- **18/11/2026** — reunião remarcada (Rodri + Sole).

## O que falta confirmar
- Que a ficha "plataforma de risco SaaS" da base é mesmo o BCI.
- Quem é "Tiago" e qual é a pauta de 18/11.
- Se os 123 dias / US$ 184 mil são a estimativa do BCI.
- A que correspondem os valores de pipeline citados (~US$ 150 mil; "2 projetos ≈ US$ 270 mil").
