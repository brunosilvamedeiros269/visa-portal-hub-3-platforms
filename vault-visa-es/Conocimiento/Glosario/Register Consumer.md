---
aliases: []
tags: ["glosario/click-to-pay"]
categoria: Click to Pay
fuente: SteerCo Banco de Corrientes (30/jul/2026)
estado: parcial
---

# Register Consumer

> [!info] [[Click to Pay]]

API del flujo de enrolamiento de [[Click to Pay]] que **registra al consumidor** — el paso que crea/asocia el **[[SRC - EMVCo|SRC]] Profile** al que después se vinculan los PANs. En la integración vía [[ITSP]], la llama el **backend del emisor** contra la plataforma del proveedor de SDK.

> [!warning] Punto de falla conocido
> Es donde el [[Banco de Corrientes — dossiê|Banco de Corrientes]] se trabó en jul/2026: **HTTP 500** devuelto en la interacción con [[Thales]]. El banco llegó a atribuir el error a un problema interno antes de identificar el origen — conviene siempre mirar los dos lados antes de cerrar la causa. Sin esta API funcionando **no hay prueba E2E**, y sin prueba E2E no se evidencia el cumplimiento del [[Mandato|mandato]].

> [!note] Estado de esta nota
> El nombre y el rol vienen de la minuta del SteerCo, no de la especificación. **Contrato exacto, parámetros y códigos de error no fueron confirmados contra la documentación** — confirmar con el [[ITSP]] antes de usarla como referencia técnica.

**Categoría:** [[MOC — Click to Pay]]

---
[[Home]]
