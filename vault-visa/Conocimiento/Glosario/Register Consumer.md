---
aliases: []
tags: ["glosario/click-to-pay"]
categoria: Click to Pay
fuente: SteerCo Banco de Corrientes (30/jul/2026)
estado: parcial
---

# Register Consumer

> [!info] [[Click to Pay]]

API do fluxo de enrolamento de [[Click to Pay]] que **registra o consumidor** — o passo que cria/associa o **[[SRC - EMVCo|SRC]] Profile** ao qual os PANs depois se ligam. Na integração via [[ITSP]], é chamada pelo **backend do emissor** contra a plataforma do provedor de SDK.

> [!warning] Ponto de falha conhecido
> É onde o [[Banco de Corrientes — dossiê|Banco de Corrientes]] travou em jul/2026: **HTTP 500** devolvido na interação com a [[Thales]]. O banco chegou a atribuir o erro a um problema interno antes de identificar a origem — vale sempre olhar os dois lados antes de fechar a causa. Sem essa API funcionando **não há prova E2E**, e sem prova E2E não se evidencia o cumprimento do [[Mandato|mandato]].

> [!note] Estado desta nota
> O nome e o papel vêm da ata do SteerCo, não da especificação. **Contrato exato, parâmetros e códigos de erro não foram confirmados contra a documentação** — confirmar com o [[ITSP]] antes de usar como referência técnica.

**Categoría:** [[MOC — Click to Pay]]

---
[[Home]]
