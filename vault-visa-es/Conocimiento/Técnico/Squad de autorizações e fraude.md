---
tags: ["tecnico"]
fuente: Handover de autorizaciones y fraude — Bapro (10/ago/2026)
estado: verificado
title: "Squad de autorizaciones y fraude"
---

# Squad de autorizaciones y fraude

Formato de proyecto de Visa para **optimizar la tasa de autorización y de fraude** de un emisor. No es implementación de sistema: *"hacemos consultoría, miramos lo que está bien o mal"* — la implementación final es del [[Processador|procesador]] o del banco.

## Composición del equipo
| Rol | Función |
|---|---|
| Especialista de la **vertical de Riesgo** de la consultoría Visa | Ejecuta el diagnóstico, calcula peers, presenta los números |
| **Customer Success Executive** | Relación diaria — "un ejecutivo del banco, pero de Visa para el banco" |
| **[[VIS (Visa Implementation Services)|VIS]]** | **Asegura la gobernanza**: que la sesión ocurra, que tenga calidad y que los compromisos se cumplan |
| **Implante** | Recurso externo con dedicación casi exclusiva, **físicamente en el banco** al menos 2 veces por semana |

El **implante** es el nexo bidireccional — empuja cosas de Visa→banco y de banco→Visa y ayuda a priorizar. Justificación explícita: *"Visa… es muy grande, tiene muchas partes móviles"*.

## Duración y fases
Se vende como mínimo por **9 meses**, generalmente **1 año**. La curva inicial — integrarse al banco, entender la dinámica, diagnosticar, mover las partes internas — consume **3 a 4 meses**; un proyecto de 6 meses terminaría justo cuando empieza a aceitarse.

`6 semanas de diagnóstico cuantitativo` → `+4 semanas de calibración y roadmap` → `implementación con seguimiento y recalibración continuos (always on)`

## El framework de los 4 cuadrantes
Todo análisis se abre en cuadrantes, nunca como métrica única de banco — *"no nos dice nada, no nos dice dónde hay que concentrarse"*.

- **Producto:** crédito × débito
- **Geografía:** doméstico × internacional (cross-border)
- **Ambiente:** presente (CP) × no presente (CNP)

### Leyes empíricas (para normalizar expectativa)
| Regla | Por qué |
|---|---|
| Approval CNP **<** approval CP | naturaleza de la transacción |
| Approval internacional **<** approval doméstico | naturaleza de la transacción |
| Fraude CNP **>** fraude CP | más fácil que ocurra; el tarjetahabiente olvida suscripciones y descripciones poco claras |
| Fraude crédito **>** fraude débito | *"los defraudadores no suelen ir a atacar débito porque es más probable que no tengan fondos"* |
| NSF en débito es estructuralmente alto | débitos automáticos (streaming, cuentas) que el cliente olvida — 70–80% es "entre comillas normal" |

## Peers
Los **5 bancos más parecidos**, seleccionados por volumen de transacciones, público objetivo y posición de mercado; el cálculo es del equipo de Riesgo. Toda comparación es doble: **vs. mercado total y vs. peers**. La prioridad está donde el gap contra peers es mayor — aunque el banco esté por encima del promedio del mercado.

## Qué tan accionables son los motivos de rechazo
- **NSF (Not Sufficient Funds)** es la palanca más difícil: es un problema de límite/crédito, y el único accionable real es ampliar la línea — algo que, en contextos de crédito ajustado, ningún banco quiere hacer. De ahí la presión de los clientes por "soluciones técnicas".
- **Rechazos de origen técnico** (motivo no identificado, restricción de configuración de la tarjeta, mensajería incorrecta, CVV que no viaja) **tienen solución técnica** — es el campo fértil de las recomendaciones.
- Para NSF en débito solo cabe una acción **comunicacional** (avisarle al cliente que un servicio vence en 3 días).

## Ejemplo canónico de recomendación — estrategia de *over limit*
1. Se detecta un exceso de rechazos por límite insuficiente en un **rubro (MCC) específico**.
2. Se analiza cómo vienen los gastos en ese rubro, el **ticket promedio de las rechazadas** y el **score de riesgo** de esos clientes.
3. Se recomienda con especificidad numérica: *"para este rubro específico debería haber un over limit de 20 dólares, porque con ese límite no corres mucho riesgo en fraude y va a subir tu tasa de aprobación en tanto porcentaje."*
4. Entrega al banco y acompañamiento junto al procesador hasta la implementación.

## La limitación estructural de datos de Visa
Por compliance y ley antimonopolio, Visa **no almacena número de identificación ni nombre que individualice a la persona**. Consecuencia operativa: **"para nosotros cada cliente es una tarjeta"** — el mismo titular con un débito y un crédito en el mismo banco son **dos clientes distintos** en la red.

Impacto en el diagnóstico de fraude: un cliente que se comporta perfectamente en débito y comete autofraude en crédito recibirá una recomendación positiva en débito. Metáfora usada: **"diagrama de Venn al revés"** — ~20% de la información es solo del banco, ~20% es solo de Visa; integrar los dos 20% ciegos es lo que enriquece la recomendación.

**Regla de fase:** las 6 semanas de diagnóstico + 4 de calibración usan **100% información Visa (MIS)**. Los datos del banco solo entran en la fase de ejecución, para "hilar más fino".

## Disputas / controversias
Disputa es el proceso que se inicia cuando el tarjetahabiente **desconoce un gasto**. Cadencia **trimestral**: una especialista regional analiza cómo trató el banco las disputas del trimestre y devuelve recomendaciones caso por caso, en tres tipos:
1. casos mal conducidos — *"estas 20 disputas las pudiste haber manejado de esta manera y por eso perdiste el juicio"*;
2. casos que **ni siquiera deberían haberse abierto**;
3. casos con una estrategia probatoria alternativa de mayor probabilidad de éxito.

El [[VIS (Visa Implementation Services)|VIS]] solo centraliza las instancias — no hace el análisis.

## Entregable y contraparte obligatoria
El diagnóstico es un documento de **150 a 200 páginas** con métricas específicas y ~**40 accionables** en una **matriz de esfuerzo × impacto**. Después, banco + Visa construyen un roadmap priorizado — y el banco puede descartar ítems.

Del lado del cliente siempre hace falta **1 líder de proyecto** más los **líderes de Autorizaciones, Operaciones y Fraude**: **el 95% de las recomendaciones caen en esas tres áreas**, por lo tanto tienen que estar "súper embebidas" en el proyecto.

---
[[Home]]
