---
aliases: ["TLCM", "Token Lifecycle Manager"]
tags: ["glosario/tokenizacao"]
categoria: Tokenização
fuente: Seguimiento BBVA Uruguay (18/ago/2026)
estado: parcial
---

# TLCM (Token Lifecycle Manager)

> [!info] [[Tokenização]]

Ferramenta de gestão do **ciclo de vida dos tokens** — permite, entre outras operações, **reatribuir os tokens de um PAN a outro PAN** (o caso típico é a troca de cartão do portador).

## Ponto de atenção conhecido
Não está confirmado se existe **rollback** dessa reatribuição. A pergunta surgiu no [[BBVA Uruguay — dossiê|BBVA Uruguay]]: como desfazer uma troca de cartão feita por erro?

Comportamento observado em teste: ao forçar uma substituição, **o cartão "antigo" não pôde ser provisionado novamente**. O entendimento preliminar é que, ao desabilitar um PAN no TLCM e religar seus tokens a um PAN novo, **evita-se que aquele PAN volte a ser provisionado** — por desenho, não por defeito.

> [!warning] Trate como sem volta até que se prove o contrário
> Uma reatribuição feita por engano pode deixar um grupo de cartões inconsistente e sem caminho de recuperação. Confirme o procedimento com a Visa **antes** de operar em lote.

> [!note] Estado desta nota
> Comportamento observado em teste e entendimento preliminar da Visa; **não confirmado contra a documentação**.

**Categoría:** [[MOC — Tokenização]]

---
[[Home]]
