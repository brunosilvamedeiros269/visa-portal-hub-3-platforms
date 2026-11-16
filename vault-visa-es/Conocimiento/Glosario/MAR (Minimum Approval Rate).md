---
aliases: ["MAR", "Minimum Approval Rate"]
tags: ["glosario/autorizacoes-fraude"]
categoria: Autorizações e Fraude
fuente: Handover de autorizaciones y fraude — Bapro (10/ago/2026)
estado: verificado
---

# MAR (Minimum Approval Rate)

> [!info] Autorizaciones y Fraude

Programa de Visa que fija un **approval rate mínimo por [[BIN]] y por segmento**. Es uno de los reglamentos que el emisor debe cumplir para mantener prolijidad transaccional.

## Mecánica
- Cada BIN tiene **4 segmentos**: CP doméstico · CP internacional · CNP doméstico · CNP internacional. El objetivo es **diferente por segmento** — *"no le puedes poner el mismo objetivo a un CP doméstico que a un CNP internacional"*.
- **Incumplir por 0,01 p.p. ya hace entrar en MAR.**
- **Multa: US$ 2.500 por BIN por mes**, cobrada mes a mes (no es un mandato con plazo).
- **1 entrada por BIN por mes**, aun incumpliendo los 4 segmentos.
- **Tope de 10 BINs por mes** → exposición máxima de US$ 25.000/mes.
- **No hay bonificación** para quien queda fuera del MAR — el incentivo es no pagar.

## Valor como herramienta de diagnóstico
El MAR descompone un número macro incomprensible ("ves un 90% a nivel completo CNP crédito") en **unidades accionables por BIN**. Al hacer doble clic en un BIN específico se suele descubrir una configuración rota, mensajería incorrecta o **CVV que no viaja**.

> [!tip] Recomendación típica — BIN residual
> Un BIN con pocas transacciones (ej.: 100/mes) es estadísticamente **volátil**, tiene **costo de mantenimiento**, tiene **costo de esfuerzo operativo** y además genera **US$ 2.500/mes** de multa. La recomendación suele ser **migrar a esos clientes y reimprimir las tarjetas en otro BIN**.

> [!note] Postura comercial
> *"Por nosotros que siga en MAR, no entra la plata."* La multa no es ingreso del equipo de consultoría — el discurso al banco es de alianza para que **no** pague el fee.

**Categoría:** [[MOC — Autorizações e Fraude]]

---
[[Home]]
