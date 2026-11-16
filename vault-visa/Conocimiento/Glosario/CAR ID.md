---
aliases: ["CAR ID", "Card Reference ID"]
tags: ["glosario/click-to-pay"]
categoria: Click to Pay
fuente: Weekly Banco de Corrientes (7/ago/2026)
estado: parcial
---

# CAR ID

> [!info] [[Click to Pay]]

Identificador com que a plataforma do [[ITSP]] referencia um **cartão registrado** no [[Click to Pay]]. Anda em par com o **Consumer ID** (o consumidor a que o cartão está associado).

## Por que importa
Um **PAN só pode estar registrado uma vez** com um dado CAR ID. Tentar registrá-lo de novo — com outro CAR ID ou sob outro consumidor — falha. É a causa mais comum de erro repetido no [[Register Consumer]] em ambiente de teste, onde o mesmo punhado de cartões é reutilizado.

> [!tip] Boa prática
> O emissor deve manter uma **tabela associativa própria** entre os seus dados e os CAR IDs / Consumer IDs. Sem ela, o app não sabe se o cartão já está registrado e entra em loop de tentativa. A [[Thales]] expõe a API **`getCard`** (entra o CAR ID, devolve o PAN associado) para reconciliar.

> [!warning] Em ambiente de teste, não insista no registro
> Se o objetivo é provar o [[Click to Pay]] e não o cadastro, use a dupla CAR ID + Consumer ID já registrada, ou dados limpos, ou bypasse a etapa de registro. Foi a recomendação explícita do [[ITSP]] ao [[Banco de Corrientes — dossiê|Banco de Corrientes]].

> [!note] Estado desta nota
> Nome e papel vêm de ata de reunião, não da especificação. **Contrato exato e formato do identificador não confirmados** contra a documentação do [[ITSP]].

**Categoria:** [[MOC — Click to Pay]]

---
[[Home]]
