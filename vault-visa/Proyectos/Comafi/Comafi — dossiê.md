---
tags: ["proyecto", "cliente/Comafi"]
fuente: Transcrições automáticas — Weekly Visa SDK (~20/ago/2026), alinhamento interno (27/ago), Pipeline Review VCA × CS (4/set), Weekly Tech (28/set–16/nov/2026)
estado: parcial
---

# 🇦🇷 Comafi (Argentina) — Visa SDK + Apple Pay + Google Pay

> [!info] Dossiê de projeto (contexto qualitativo)
> Projeto **fechado para a VCA** (decisão de 4/set/2026) e fora da carteira de Bruno (até 5/out/2026). Aqui fica o contexto, a história e o porquê do fechamento.

> [!caution] Até onde vai a informação
> - **Técnico** (erro 303, artes, rebranding, relatório de aprovisionamento): até o weekly de **~20/ago** e o alinhamento interno de **27/ago**. Não há reunião do projeto depois disso.
> - **Encerramento:** decisão em **4/set**; "fechado" em **~28/set** e **5/out**.
> - **Depois:** só menções indiretas, até **16/nov**.
> - **Sem desfecho confirmado:** lançamento do Google Pay, erro 303, rebranding das artes e o envio do e-mail de fechamento.
>
> Tudo vem de transcrição automática não validada — daí `estado: parcial`.

## Ficha
- **Cliente:** Banco Comafi. **País:** Argentina.
- **Escopo:** Visa SDK ([[Wallet Extensions|wallet extension]] e [[Push - In-App Provisioning (fluxo verde)|push provisioning]]) + Apple Pay + Google Pay.
- **Visa:** Laura ("Lau"), líder técnica do projeto em CS; "Mar"/"Marlene" (grafia a confirmar) no tema de custos; Lina Torres como PM VCA; Bruno no seguimento durante a licença da Lina (a partir de 27/ago); Facundo como [[CSM (Customer Success Manager)|CSM]].
- **Comafi:** um interlocutor principal (possivelmente "Juli" — a confirmar); Pablo, novo, assumindo gradualmente; Maxi, de meios de pagamento, em saída.
- **Terceiros:** Mastercard (a outra bandeira do SDK), Apple, Google. [[Prisma]] foi citada como quem cria as regras de risco — a confirmar.
- **Governança:** weekly com o cliente conduzido pela Laura; relatório semanal de aprovisionamento numa pasta compartilhada.

## Status atual (base: 16/nov/2026)
**Fechado.** Apple Pay em produção e estável. Google Pay com a implementação pronta do lado Visa, mas **sem confirmação de que foi lançado**. O Comafi segue por conta própria: em 2/nov foi dito que implementa [[Click to Pay]] com o SDK Visa sem acompanhamento, depois de uma troca de gestão.

| Frente | Situação | Último dado |
|---|---|---|
| Apple Pay | Em produção; média de 85,5% no primeiro mês de relatório; erro 303 aberto | 27/ago |
| Google Pay | Pronto, não lançado — à espera de correção da Mastercard | 4/set |
| Visa SDK | Entregue; projeto de SDK encerrado | 5/out |
| [[Click to Pay]] | Fora do escopo; o banco implementa sozinho | 2/nov |

## A história em três momentos

### 1. Um projeto que funcionava (~20/ago/2026)
O weekly de ~20/ago mostra um projeto em regime: o primeiro mês de relatório de aprovisionamento do Apple Pay (20/jul a 20/ago) fechou com **média de 85,5%**, e os últimos dias vinham em 100%, 93%, 98% e 87%. O volume diário de tentativas já era baixo.

O único ruído técnico era o **erro 303** — "el dolor de cabeza" —, com ticket no time técnico da Visa. A discussão do erro em si não está no áudio (a gravação começa no meio).

Uma correção recente servia de exemplo de como as coisas andavam: uma arte de cartão que aparecia vertical em vez de horizontal foi corrigida pela Visa, mas levou ~5 dias nos dois ambientes por causa de um *freeze* interno.

### 2. O rebranding e o que ele ensinou sobre arte de cartão
O banco anunciou um **rebranding** próximo (logo, cartões, cores) e contou que tinha mudado metadados e, depois de ~10 dias, não via mudança num cartão já tokenizado. A resposta da Visa é o conhecimento mais reaproveitável deste projeto:

> [!tip] Arte em tokens existentes
> - A Visa **não atualiza a arte em tokens já emitidos**. O cliente precisa **desenrolar e voltar a enrolar** — vale para Apple e para Android. (Na Mastercard a atualização é automática.)
> - O push provisioning não "convida" o cliente a re-tokenizar.
> - Dá para forçar desativando os tokens no [[TLCM (Token Lifecycle Manager)|TLCM]], mas é má experiência e há risco de o cliente não voltar. Outros emissores preferiram um e-mail pedindo o re-enrolamento.
> - **Cada aprovação de arte custa US$ 150**; arte repetida entre [[BIN|BINs]] aprova-se uma vez só.
> - Mudanças de metadados entram em cortes a cada 6 horas (GMT).
> - Com SDK / wallet extension, as artes novas têm de ser **reenviadas à Visa com a relação arte × BIN**, no mesmo formato da primeira vez. Ver também [[Revisão de Artes]].

A estratégia de re-enrolamento ficou a critério do Comafi. Ficou uma dúvida sem resposta: o banco diz ter visto o **texto** do cartão mudar no mesmo token; a Laura ficou de perguntar se texto atualiza sozinho.

Do mesmo weekly saíram dois esclarecimentos sobre o relatório de aprovisionamento:
- **Código 59 = recusa por regra de risco do [[Emissor|emissor]].** Num dia houve ~8–10 recusas sobre ~75 tentativas, que a Visa recomendou revisar (possível ataque).
- O relatório **não separa** recusas por política da Apple: elas aparecem como 59 quando as regras do emissor usam as respostas da Apple. Só regras 100% de negócio podem ser flexibilizadas.

E uma divergência de **conceito** (não de valor) no custo mensal: o que a Apple indica como métrica de faturamento não fechava com o que a Visa enviou, em torno do que conta como "activo". O banco ficou de mandar por e-mail.

### 3. Por que fechou sem o Google Pay (27/ago → 4/set)
Em 27/ago, quando Bruno assume o seguimento, a Laura resume: o projeto está "pronto a cerrar" e o que falta é o Comafi **lançar o Google Pay**. O bloqueio não era da Visa:

> [!warning] SDK agnóstico, cronograma refém
> O SDK é agnóstico (Visa + Mastercard). O Comafi **não segmenta releases por bandeira** — então só publica quando as duas estão prontas. A **Mastercard devia uma correção havia mais de três meses**. O Apple Pay estava "afuera hace rato".

Naquele momento o fechamento parecia depender de duas coisas: o erro 303 e o lançamento + monitoramento do Google Pay.

Na Pipeline Review VCA × CS de **4/set** a conta foi outra. O contrato **já tinha sido estendido** e passara ~3 meses em "freeze" à espera do desenvolvimento do cliente. A decisão: **não fazer nova adenda; fechar formalmente**. O e-mail de fechamento ficou com Bruno, como PM — recap, fases, o CSM Facundo como ponto focal dali em diante, cópia a CS.

Em ~28/set o Comafi aparece como fechado (e-mail de encerramento); em 5/out, "Apple Pay fechado la semana pasada", e Bruno confirma à Lina que o projeto já não está com ele.

> [!note] Dois pontos que o registro não fecha
> - A tarefa de 4/set descreve o recap com "Apple Pay **e Google Pay** em produção", mas na mesma reunião consta que o cliente não tinha lançado o Google. **Confirmar o que o e-mail disse.**
> - Não há evidência de quem enviou o e-mail de fechamento nem quando.

## Depois do fechamento: Comafi como referência
O projeto continua a aparecer nas conversas internas como caso de consulta:
- **SDK com carteiras:** Comafi é o caso feito; BancoEstado é o caso em curso (4/nov).
- **[[Click to Pay]] com SDK Visa:** em 2/nov o Comafi é citado como "a referência", implementando por conta própria. Dois dias depois foi dito que não há implementação de Click to Pay com SDK Visa na América Latina nem conhecimento em CS. As duas frases só fecham se o Comafi estiver **implementando, sem ter concluído** — a confirmar.
- **Relatórios Apple personalizados** construídos para o Comafi com o time de dados são reutilizáveis (lembrado para o BancoEstado em 16/nov).
- **Carteiras em paralelo:** o Comafi fez Google e Apple 100% em paralelo; os lançamentos não podem ser simultâneos (16/nov).

## Linha do tempo
- **20/jul–20/ago/2026** — Primeiro mês de relatório do Apple Pay: média 85,5%.
- **~15/ago** — Arte vertical corrigida do lado Visa (data deduzida).
- **~20/ago** — Weekly Visa SDK (data inferida): erro 303, rebranding, transição Maxi → Pablo.
- **27/ago** — Alinhamento interno: Bruno assume o seguimento.
- **4/set** — Pipeline Review VCA × CS: **sem adenda; fechar formalmente**.
- **~28/set** — Fechado (e-mail de encerramento).
- **5/out** — Fora da carteira de Bruno.
- **2/nov** — Comafi implementa Click to Pay com SDK Visa por conta própria.
- **16/nov** — Citado como fonte de relatórios e de experiência reaproveitáveis.

## Lições que ficam
- **Perguntar cedo como o emissor publica o app.** SDK agnóstico sem release por bandeira amarra o lançamento Visa ao ritmo da outra bandeira.
- **Contrato parado custa.** Depois de uma extensão e ~3 meses de espera, a saída foi fechar formalmente e deixar o CSM como ponto focal, em vez de estender de novo.
- **Arte é projeto, não detalhe:** aprovação paga, propagação em cortes e re-enrolamento obrigatório. Um rebranding precisa de plano de comunicação ao cliente final.
- **Ler o relatório de aprovisionamento com cuidado:** o código 59 mistura regra de negócio com resposta da Apple.

## Lacunas
- **Google Pay foi lançado?** Nada depois de 4/set.
- **Erro 303 foi resolvido?** Nada depois de 27/ago.
- **Rebranding:** data não dita; sem registro do reenvio das artes.
- **E-mail de fechamento:** quem enviou, quando e com que texto.
- **Nomes:** "Lau/Laura/Lana", "Mar/Marlene", "Marlu" (citada com o time de dados; pode ser a mesma pessoa), "Juli", "Ori" — grafias não confirmadas.
- A sigla do custo mensal discutido em ~20/ago não foi confirmada e por isso não é usada aqui.

---
[[Home]]
