---
aliases: ["TLCM", "Token Lifecycle Manager"]
tags: ["glosario/tokenizacao"]
categoria: Tokenização
fuente: Seguimiento BBVA Uruguay (18/ago/2026)
estado: parcial
---

# TLCM (Token Lifecycle Manager)

> [!info] [[Tokenização|Tokenización]]

Herramienta de gestión del **ciclo de vida de los tokens** — permite, entre otras operaciones, **reasignar los tokens de un PAN a otro PAN** (el caso típico es el cambio de tarjeta del tarjetahabiente).

## Punto de atención conocido
No está confirmado si existe **rollback** de esa reasignación. La pregunta surgió en [[BBVA Uruguay — dossiê|BBVA Uruguay]]: ¿cómo deshacer un cambio de tarjeta hecho por error?

Comportamiento observado en prueba: al forzar una sustitución, **la tarjeta "antigua" no pudo aprovisionarse de nuevo**. El entendimiento preliminar es que, al deshabilitar un PAN en el TLCM y volver a vincular sus tokens a un PAN nuevo, **se evita que ese PAN vuelva a aprovisionarse** — por diseño, no por defecto.

> [!warning] Trátelo como sin vuelta atrás hasta que se pruebe lo contrario
> Una reasignación hecha por error puede dejar un grupo de tarjetas inconsistente y sin camino de recuperación. Confirme el procedimiento con Visa **antes** de operar en lote.

> [!note] Estado de esta nota
> Comportamiento observado en prueba y entendimiento preliminar de Visa; **no confirmado contra la documentación**.

**Categoría:** [[MOC — Tokenização]]

---
[[Home]]
