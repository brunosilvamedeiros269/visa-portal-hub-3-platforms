---
tags: ["proyecto", "cliente/Banco-Provincia"]
fuente: Handover de autorizações e fraude (10/ago/2026) + transcrições de set–nov/2026 (seção de atualização)
estado: parcial
---

# 🇦🇷 Banco Provincia (Bapro) — squad de Autorizações e Fraude

> [!info] Dossiê de projeto (contexto qualitativo)
> **Consultoria pura, não implementação de sistema.** Formato "squad". A implementação final das recomendações é do processador ou do banco — a Visa não implementa.

## Ficha
- **Cliente:** Banco de la Provincia de Buenos Aires ("Banco Provincia" / **Bapro**) — banco estatal, descrito como o maior banco governamental da Argentina em relevância para a Visa.
- **País:** Argentina.
- **Duração:** 12 meses (mínimo comercial 9).
- **Fases:** **6 semanas** de diagnóstico quantitativo → **+4 semanas** de calibração e roadmap → implementação com seguimento contínuo ("always on").
- **Fase atual (10/ago/2026):** **pós-diagnóstico, pré-apresentação — travado do lado do cliente.**

**Time Visa —** **Moisés** (VIS, líder dos projetos de autorizações e fraude; saindo do papel de contato direto), **Bruno Medeiros** (VIS, novo ponto de contato visível), **Juan Pablo** (líder da vertical de Risco CONOSUR, dedicação parcial, executa o diagnóstico), **Rafael Polo** (**implante** externo, dedicação quase exclusiva, deve ir ao banco 2x/semana), **Diana Dicochea** (Disputas, trimestral), Customer Success Executive (a nomear). Apoio: Core Consulting, Client Success, **GBO** (Global Business Optimization — dono dos dados e dos dashboards).

**Time do cliente —** coordenador de projeto **a designar** + líderes de **Autorizações**, **Operações** e **Fraude** **a designar**. *95% das recomendações caem nessas três áreas.*

## Tracks
| # | Track | Conteúdo | Quem executa |
|---|---|---|---|
| 1 | **Autorizações e fraude** | Diagnóstico + roadmap + implementação e seguimento | Risco (Juan Pablo) + implante (Rafael Polo); **VIS assegura a governança** |
| 2 | **Disputas / controvérsias** | Análise **trimestral** com recomendações caso a caso | Diana Dicochea; VIS só garante que a sessão aconteça |
| 3 | **Benchmark de carteira** *(adjacente)* | Estudo trimestral de penetração/portfólio | **Outro time da VCA** — vendido em conjunto, mas corre 100% separado |

## Status atual — bloqueio central
> [!warning] Superado
> O bloqueio descrito aqui é o retrato de 10/ago/2026. Para o estado de 16/11/2026, ver "Atualização set–nov/2026" mais abaixo.

**"Están parados 100%."** O kick-off ocorreu há ~2 meses (≈ jun/2026). O **diagnóstico está pronto há 3 semanas e ainda não foi apresentado** — o banco não responde aos pedidos de agenda, não designou coordenador nem responsáveis de área, e não liberou acessos nem equipamento ao implante. O diagnóstico de disputas também está pronto e sem data.

> [!bug] Círculo vicioso identificado
> Como a sessão inicial não acontece, não se aciona a ida de Rafael Polo ao banco — que é justamente o que destravaria a sessão.

**O custo de esperar é mensurável:** em **fevereiro** o banco atingiu o teto do programa **[[MAR (Minimum Approval Rate)|MAR]]** (10 BINs) e em **março** teve **9 segmentos** em MAR. No último ano destinou "miles de miles de dólares" a essas multas.

## Linha de base do diagnóstico
Banco **abaixo dos peers em todos os quadrantes**.

- **Crédito:** CP doméstico −0,4 p.p. · CP internacional <1% abaixo · um quadrante −2% · **CNP internacional −6%** (principal ponto de dor).
- **Débito:** **CP internacional −8%** · **CNP doméstico −7%**.
- **Motivo de rejeição nº 1:** **NSF (Not Sufficient Funds)**, em crédito e em débito.
- **Fraude:** em internacional não-presente o banco tem **aprovação baixíssima e fraude altíssima ao mesmo tempo** — *"estás mal por los dos lados"*. Em débito está melhor que os peers em quase todos os cortes.

**Entregável:** documento de **150 a 200 páginas**, ~**40 acionáveis** organizados em **matriz de esforço × impacto**. Depois, banco + Visa constroem um roadmap priorizado — e o banco pode descartar itens. Responsabilidade explícita do VIS: *"que eso se traduzca en un roadmap accionable"*.

## Conceitos do produto (ver também [[Squad de autorizações e fraude]])
- **Framework dos 4 quadrantes** — produto (crédito × débito) × geografia (doméstico × internacional) × ambiente (CP × CNP). Uma métrica única de banco "no nos dice dónde hay que concentrarse".
- **Peers** — os **5 bancos mais parecidos** por volume, público-alvo e posição de mercado. Comparação sempre dupla: vs. mercado e vs. peers.
- **[[MAR (Minimum Approval Rate)|MAR]]** — approval rate mínimo por BIN-segmento, com multa de **US$ 2.500 por BIN por mês** e teto de 10 BINs.
- **Limitação de dados da Visa** — por compliance a Visa não armazena DNI nem nome: **"para nosotros cada cliente es una tarjeta"**. Metáfora do *diagrama de Venn ao contrário*: ~20% da informação é só do banco, ~20% é só da Visa.

## Pendências e riscos
| O quê | Responsável | Situação |
|---|---|---|
| **Designar coordenador de projeto e responsáveis de Autorizações, Operações e Fraude** | Banco Provincia | pendente há ~2 meses |
| **Liberar acessos e equipamento ao implante** (Rafael Polo) | Banco Provincia | sem resposta |
| **Agendar a apresentação do diagnóstico** | Banco (agenda) / VIS (push) | opções já enviadas, sem retorno |
| **Coordenar a primeira sessão de disputas** | Banco (agenda) / VIS | sem feedback |
| Montagem do **roadmap acionável** | Visa + banco | bloqueado pelos itens acima |
| Escalar o destravamento a nível mais alto | Moisés | em curso |
| Nomear o **Customer Success Executive** | Visa | sem data |

**Riscos**
1. **Inércia do cliente** — projeto de 1 ano perdendo ~2 meses de janela, e a curva de arranque já é de 3–4 meses.
2. **Cultura de empresa estatal** — *"les cuesta más accionar, por ahí más pasivo"*; exige presença física e pressão constante do implante.
3. **Implante sem acessos** — neutraliza o principal mecanismo de destravamento.
4. **NSF como ofensor nº 1 com margem quase nula** — o único acionável real é ampliar a linha de crédito, e no contexto argentino nenhum banco quer fazê-lo. Os bancos pedem explicitamente "soluciones técnicas".
5. **Exposição financeira ativa a multas MAR** enquanto o roadmap não arranca.
6. **CNP internacional** com aprovação baixa e fraude alta simultaneamente — quadrante de maior complexidade técnica.

## Atualização set–nov/2026 (estado em 16/11/2026)

> [!warning] Conteúdo parcial
> Esta seção vem de transcrições automáticas (08/09, 27/10, 30/10 e 12/11/2026), ainda não validadas. Falantes anonimizados; o que é dedução está marcado `[a confirmar]`. As seções acima (handover de 10/ago) ficam como estavam.

### Status atual
**O projeto destravou.** O banco que em agosto não respondia passou a ter sessão semanal com a Visa — em 30/10 já era o "tercer seguimiento" — e em 12/11 ouviu pela primeira vez a leitura formal do relatório de disputas. Fase: **execução, com seguimento semanal de iniciativas**. Semáforo sugerido: verde com pontos de atenção (Redlink sem resposta; análise da base de limites parada na inteligência comercial do banco).

O que não se consegue afirmar pelas fontes: a apresentação presencial do diagnóstico estava marcada para **17/09** `[a confirmar — data deduzida]` e não há transcrição dela, nem do debrief, nem da sessão de acordo de roadmap.

### Como o projeto saiu do bloqueio
Em **08/09** Moisés reuniu Rafael "Rafa" Polo e Bruno pela primeira vez. O contrato tinha sido assinado "há pouco mais de três meses" e o trabalho estava parado porque o banco não respondia. Nessa conversa ficou desenhado o que veio depois:

- **Rafa é a "punta de lanza"**: dedicado ao squad, lidera de cara ao banco e conduz as weeklies.
- **Bruno é o nexo com [[VIS (Visa Implementation Services)|VIS]]**, em papel **habilitador**: acessos, relatórios, relação com o [[CSM (Customer Success Manager)|CSM]] da conta, ligação aos donos de ferramentas internas, temas administrativos e contratuais, apoio a business case. Cobre Rafa nas ausências.
- **Moisés** fica periférico e pretende estar nas sessões presenciais.

> [!note] Corrige o que está acima
> A ficha de agosto descreve Bruno como "novo ponto de contato visível". Desde 08/09 a frente com o banco é de Rafa; Bruno habilita por dentro da Visa.

O roteiro combinado: apresentação do diagnóstico → **debrief** ~7–10 dias depois (dúvidas e pedidos adicionais de métricas) → **sessão de acordo de roadmap** ~10 dias depois (o banco diz o que faz e o que não faz) → governança recorrente (weekly com o banco, weekly interna, monthly — para este banco talvez bimestral). Moisés pediu que cada sessão terminasse já com a data da seguinte, por causa do histórico de convocatória.

O deck do diagnóstico que Rafa mostrou reorganiza as recomendações por **impacto × complexidade**: 3 a 5 prioritárias e 15 oportunidades adicionais, mapa de calor (quick wins, apostas estratégicas, oportunistas, reavaliar), cálculo de oportunidade econômica e próximos passos com tarefas para Visa, banco e [[Prisma]]. O relatório-base é de Francisco Capetillo. *(O handover de agosto falava em 150–200 páginas e ~40 acionáveis; podem ser o relatório-base e o deck — `[a confirmar]`.)*

### A primeira frente: fundos insuficientes em cross-border
O diagnóstico já apontava fundos insuficientes como motivo de rejeição n.º 1. A execução começou por aí, mas com um recorte: **operações internacionais**.

Em **27/10** a analista Lucía mostrou que, em 11 meses, **244.000 cartões** tiveram ao menos uma recusa internacional e **214.000 seguem ativos (87,6%)**; o resto aparece com código 62 (restrição por mora, ~25.000), código 46 (conta fechada, 3.966) ou ambos (1.353). A proposta da Visa: **aumento de linha direcionado** a esses 214 mil — os que de fato compram fora e batem no limite.

O banco respondeu que já tinha aumentado o limite de ~**600.000 contas** no início de outubro (~13/10, a verificar), pelo score próprio, sem distinguir doméstico de internacional. Daí a lição da sessão: aumento genérico não mostra efeito se não atinge quem tem a recusa. E como a Visa só enxerga mora e baixa pela transacionalidade, o cruzamento com os dados do banco é obrigatório.

Hipótese discutida para a origem do problema: a **unificação de limites** feita pelo banco por volta de abril pesa mais no cross-border, porque essas compras não são parceladas.

A base foi entregue por **caso no Visa Access**, em nome de Damián (só ele acessa). Procedimento acordado em 30/10: excluir mora/fechados → rever quem já teve aumento → avaliar ajuste. **A decisão é do banco.** O gargalo previsível é a área de inteligência comercial.

> [!info] Isto dialoga com o risco 4 da lista de agosto
> Em agosto dizia-se que nenhum banco argentino queria ampliar linha de crédito. O Bapro ampliou — a discussão agora é **a quem**.

### As outras frentes
- **Redlink** — sessão conjunta sobre a configuração "hasta 4 veces el límite de excepción". Rafa escreveu e não teve resposta; o banco trocou de interlocutor comercial na Redlink e a nova executiva de contas ainda não tinha sido apresentada em 30/10. Ficou **em standby**. O banco também pressiona a Link pelas recusas de código 57 (significado não explicado na reunião).
- **Gasto por comércio e ramo** — pedido do banco (Fede) atendido em 30/10 em dólares; ficou por ampliar em pesos e com versão de consumo local.
- **[[Tokenização]]** — prévia em 27/10 (94% global; 93,9% cartão não presente; 95,6% cartão presente; a métrica não foi nomeada). A discussão prevista para 30/10 não aparece na transcrição.
- **Agrupação de [[BIN|BINs]]** — só listada como tema aberto.

### Disputas: de relatório engavetado a sessão formal
Havia **dois relatórios trimestrais prontos que nunca tinham sido apresentados**. Em 08/09 Moisés pediu o terceiro já com apresentação formal. Ela aconteceu em **12/11**, conduzida por **Laura Gómez** (Visa Dispute Optimization), cobrindo **junho–agosto de 2026** com benchmark de emissores do Cone Sul. Agenda: contexto e alcance; visão executiva (volume e valor); categorias e concentração no portfólio; recusas na plataforma ao tentar gerar disputas; casos que chegam a arbitragem. Próxima leitura: **dezembro de 2026** (set–nov).

A transcrição corta aos ~10 minutos — **nenhum número do relatório ficou registrado**. Nessa sessão o banco apresentou **Gonzalo Campana**, novo subgerente da área de produtos.

Em paralelo existe um programa de melhoria de disputas tocado por Juan Pablo diretamente com a [[Prisma]] (que gere as disputas da maioria dos bancos argentinos), com apoio de Rafa — sem novidades nas fontes.

### Linha do tempo (acréscimo)
- **~jun/2026** — contrato assinado.
- **08/09/2026** — alinhamento interno Moisés–Rafa–Bruno; papéis definidos.
- **17/09/2026** `[a confirmar]` — apresentação presencial do diagnóstico.
- **~13/10/2026** `[a verificar pelo banco]` — banco aumenta o limite de ~600 mil contas.
- **27/10/2026** — weekly: recusas cross-border; base de 214 mil cartões.
- **30/10/2026** — "tercer seguimiento": base enviada por Visa Access; gasto por comércio; Redlink em standby.
- **12/11/2026** — primeira leitura formal do relatório de disputas.
- **dez/2026** — próxima leitura de disputas.

### Pessoas que apareceram neste período
- **Banco:** Damián "Dami" (interlocutor principal), Fede (pede análises), Sofía, Gonzalo Campana (subgerente de produtos, novo). Cargos e sobrenomes `[a confirmar]`.
- **Visa:** Rafa Polo, Juan Pablo, Lucía (dados), Moisés, Bruno, Laura Gómez e Diana (disputas), Francisco Capetillo.
- **Terceiros:** Redlink / Link; [[Prisma]].

### O que ainda não se sabe
- Se debrief e sessão de roadmap aconteceram, e o que o banco aceitou no roadmap.
- Duração/formato do contrato: 12 meses (handover) × "30 dias + 30 a 90 de seguimento" (dito por Bruno num onboarding de 08/09) — conferir no contrato.
- Se o banco chegou a designar formalmente coordenador e líderes de área, e se o implante recebeu acessos e equipamento (pendências de agosto sem evidência de fecho).
- Situação das multas [[MAR (Minimum Approval Rate)|MAR]] depois de março.

---
[[Home]]
