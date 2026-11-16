---
tags: ["proyecto", "cliente/Comafi"]
fuente: Transcripciones automáticas — Weekly Visa SDK (~20/ago/2026), alineación interna (27/ago), Pipeline Review VCA × CS (4/sep), Weekly Tech (28/sep–16/nov/2026)
estado: parcial
title: "Comafi — dossier"
---

# 🇦🇷 Comafi (Argentina) — Visa SDK + Apple Pay + Google Pay

> [!info] Dossier de proyecto (contexto cualitativo)
> Proyecto **cerrado para VCA** (decisión del 4/sep/2026) y fuera de la cartera de Bruno (hasta el 5/oct/2026). Aquí queda el contexto, la historia y el porqué del cierre.

> [!caution] Hasta dónde llega la información
> - **Técnico** (error 303, artes, rebranding, reporte de aprovisionamiento): hasta el weekly del **~20/ago** y la alineación interna del **27/ago**. No hay reunión del proyecto después de eso.
> - **Cierre:** decisión el **4/sep**; "cerrado" el **~28/sep** y el **5/oct**.
> - **Después:** solo menciones indirectas, hasta el **16/nov**.
> - **Sin desenlace confirmado:** lanzamiento de Google Pay, error 303, rebranding de las artes y el envío del e-mail de cierre.
>
> Todo viene de transcripción automática no validada — de ahí `estado: parcial`.

## Ficha
- **Cliente:** Banco Comafi. **País:** Argentina.
- **Alcance:** Visa SDK ([[Wallet Extensions|wallet extension]] y [[Push - In-App Provisioning (fluxo verde)|push provisioning]]) + Apple Pay + Google Pay.
- **Visa:** Laura ("Lau"), líder técnica del proyecto en CS; "Mar"/"Marlene" (grafía a confirmar) en el tema de costos; Lina Torres como PM VCA; Bruno en el seguimiento durante la licencia de Lina (a partir del 27/ago); Facundo como [[CSM (Customer Success Manager)|CSM]].
- **Comafi:** un interlocutor principal (posiblemente "Juli" — a confirmar); Pablo, nuevo, asumiendo gradualmente; Maxi, de medios de pago, en salida.
- **Terceros:** Mastercard (la otra marca del SDK), Apple, Google. [[Prisma]] fue citada como quien crea las reglas de riesgo — a confirmar.
- **Gobernanza:** weekly con el cliente conducido por Laura; reporte semanal de aprovisionamiento en una carpeta compartida.

## Estado actual (base: 16/nov/2026)
**Cerrado.** Apple Pay en producción y estable. Google Pay con la implementación lista del lado Visa, pero **sin confirmación de que se haya lanzado**. Comafi sigue por cuenta propia: el 2/nov se dijo que implementa [[Click to Pay]] con el SDK Visa sin acompañamiento, después de un cambio de gestión.

| Frente | Situación | Último dato |
|---|---|---|
| Apple Pay | En producción; promedio de 85,5% en el primer mes de reporte; error 303 abierto | 27/ago |
| Google Pay | Listo, no lanzado — a la espera de una corrección de Mastercard | 4/sep |
| Visa SDK | Entregado; proyecto de SDK cerrado | 5/oct |
| [[Click to Pay]] | Fuera del alcance; el banco implementa solo | 2/nov |

## La historia en tres momentos

### 1. Un proyecto que funcionaba (~20/ago/2026)
El weekly del ~20/ago muestra un proyecto en régimen: el primer mes de reporte de aprovisionamiento de Apple Pay (20/jul al 20/ago) cerró con un **promedio de 85,5%**, y los últimos días venían en 100%, 93%, 98% y 87%. El volumen diario de intentos ya era bajo.

El único ruido técnico era el **error 303** — "el dolor de cabeza" —, con ticket en el equipo técnico de Visa. La discusión del error en sí no está en el audio (la grabación empieza por la mitad).

Una corrección reciente servía de ejemplo de cómo andaban las cosas: un arte de tarjeta que aparecía vertical en lugar de horizontal fue corregido por Visa, pero llevó ~5 días en los dos ambientes por causa de un *freeze* interno.

### 2. El rebranding y lo que enseñó sobre arte de tarjeta
El banco anunció un **rebranding** próximo (logo, tarjetas, colores) y contó que había cambiado metadatos y, después de ~10 días, no veía cambio en una tarjeta ya tokenizada. La respuesta de Visa es el conocimiento más reutilizable de este proyecto:

> [!tip] Arte en tokens existentes
> - Visa **no actualiza el arte en tokens ya emitidos**. El cliente necesita **desenrolar y volver a enrolar** — vale para Apple y para Android. (En Mastercard la actualización es automática.)
> - El push provisioning no "invita" al cliente a retokenizar.
> - Se puede forzar desactivando los tokens en el [[TLCM (Token Lifecycle Manager)|TLCM]], pero es mala experiencia y hay riesgo de que el cliente no vuelva. Otros emisores prefirieron un e-mail pidiendo el reenrolamiento.
> - **Cada aprobación de arte cuesta US$ 150**; el arte repetido entre [[BIN|BINs]] se aprueba una sola vez.
> - Los cambios de metadatos entran en cortes cada 6 horas (GMT).
> - Con SDK / wallet extension, las artes nuevas tienen que **reenviarse a Visa con la relación arte × BIN**, en el mismo formato de la primera vez. Ver también [[Revisão de Artes|Revisión de Artes]].

La estrategia de reenrolamiento quedó a criterio de Comafi. Quedó una duda sin respuesta: el banco dice haber visto cambiar el **texto** de la tarjeta en el mismo token; Laura quedó en preguntar si el texto se actualiza solo.

Del mismo weekly salieron dos aclaraciones sobre el reporte de aprovisionamiento:
- **Código 59 = rechazo por regla de riesgo del [[Emissor|emisor]].** En un día hubo ~8–10 rechazos sobre ~75 intentos, que Visa recomendó revisar (posible ataque).
- El reporte **no separa** los rechazos por política de Apple: aparecen como 59 cuando las reglas del emisor usan las respuestas de Apple. Solo las reglas 100% de negocio pueden flexibilizarse.

Y una divergencia de **concepto** (no de valor) en el costo mensual: lo que Apple indica como métrica de facturación no cerraba con lo que Visa envió, en torno a qué cuenta como "activo". El banco quedó en mandarlo por e-mail.

### 3. Por qué se cerró sin Google Pay (27/ago → 4/sep)
El 27/ago, cuando Bruno asume el seguimiento, Laura resume: el proyecto está "pronto a cerrar" y lo que falta es que Comafi **lance Google Pay**. El bloqueo no era de Visa:

> [!warning] SDK agnóstico, cronograma rehén
> El SDK es agnóstico (Visa + Mastercard). Comafi **no segmenta releases por marca** — entonces solo publica cuando las dos están listas. **Mastercard debía una corrección desde hacía más de tres meses**. Apple Pay estaba "afuera hace rato".

En aquel momento el cierre parecía depender de dos cosas: el error 303 y el lanzamiento + monitoreo de Google Pay.

En la Pipeline Review VCA × CS del **4/sep** la cuenta fue otra. El contrato **ya había sido extendido** y había pasado ~3 meses en "freeze" a la espera del desarrollo del cliente. La decisión: **no hacer nueva adenda; cerrar formalmente**. El e-mail de cierre quedó con Bruno, como PM — recap, fases, el CSM Facundo como punto focal de ahí en adelante, copia a CS.

El ~28/sep Comafi aparece como cerrado (mail de cierre); el 5/oct, "Apple Pay cerrado la semana pasada", y Bruno le confirma a Lina que el proyecto ya no está con él.

> [!note] Dos puntos que el registro no cierra
> - La tarea del 4/sep describe el recap con "Apple Pay **y Google Pay** en producción", pero en la misma reunión consta que el cliente no había lanzado Google. **Confirmar qué dijo el e-mail.**
> - No hay evidencia de quién envió el e-mail de cierre ni cuándo.

## Después del cierre: Comafi como referencia
El proyecto sigue apareciendo en las conversaciones internas como caso de consulta:
- **SDK con billeteras:** Comafi es el caso hecho; BancoEstado es el caso en curso (4/nov).
- **[[Click to Pay]] con SDK Visa:** el 2/nov Comafi es citado como "la referencia", implementando por cuenta propia. Dos días después se dijo que no hay implementación de Click to Pay con SDK Visa en América Latina ni conocimiento en CS. Las dos frases solo cierran si Comafi está **implementando, sin haber concluido** — a confirmar.
- **Reportes Apple personalizados** construidos para Comafi con el equipo de datos son reutilizables (recordado para BancoEstado el 16/nov).
- **Billeteras en paralelo:** Comafi hizo Google y Apple 100% en paralelo; los lanzamientos no pueden ser simultáneos (16/nov).

## Línea de tiempo
- **20/jul–20/ago/2026** — Primer mes de reporte de Apple Pay: promedio 85,5%.
- **~15/ago** — Arte vertical corregido del lado Visa (fecha deducida).
- **~20/ago** — Weekly Visa SDK (fecha inferida): error 303, rebranding, transición Maxi → Pablo.
- **27/ago** — Alineación interna: Bruno asume el seguimiento.
- **4/sep** — Pipeline Review VCA × CS: **sin adenda; cerrar formalmente**.
- **~28/sep** — Cerrado (mail de cierre).
- **5/oct** — Fuera de la cartera de Bruno.
- **2/nov** — Comafi implementa Click to Pay con SDK Visa por cuenta propia.
- **16/nov** — Citado como fuente de reportes y de experiencia reutilizables.

## Lecciones que quedan
- **Preguntar temprano cómo publica la app el emisor.** Un SDK agnóstico sin release por marca ata el lanzamiento Visa al ritmo de la otra marca.
- **Un contrato detenido cuesta.** Después de una extensión y ~3 meses de espera, la salida fue cerrar formalmente y dejar al CSM como punto focal, en lugar de extender de nuevo.
- **El arte es proyecto, no detalle:** aprobación paga, propagación en cortes y reenrolamiento obligatorio. Un rebranding necesita un plan de comunicación al cliente final.
- **Leer el reporte de aprovisionamiento con cuidado:** el código 59 mezcla regla de negocio con respuesta de Apple.

## Vacíos
- **¿Google Pay fue lanzado?** Nada después del 4/sep.
- **¿El error 303 fue resuelto?** Nada después del 27/ago.
- **Rebranding:** fecha no dicha; sin registro del reenvío de las artes.
- **E-mail de cierre:** quién lo envió, cuándo y con qué texto.
- **Nombres:** "Lau/Laura/Lana", "Mar/Marlene", "Marlu" (citada con el equipo de datos; puede ser la misma persona), "Juli", "Ori" — grafías no confirmadas.
- La sigla del costo mensual discutido el ~20/ago no fue confirmada y por eso no se usa aquí.

---
[[Home]]
