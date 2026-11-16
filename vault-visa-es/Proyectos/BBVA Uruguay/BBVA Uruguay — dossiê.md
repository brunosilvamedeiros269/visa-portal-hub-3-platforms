---
tags: ["proyecto", "cliente/BBVA-Uruguay"]
fuente: Seguimiento Switch ITSP + Google Pay (18/ago/2026); transcripciones automáticas de ago–nov/2026 (seguimiento ~24/ago, weekly 31/ago, Pipeline Review 4/sep, Weekly Tech 28/sep–16/nov)
estado: parcial
title: "BBVA Uruguay — dossier"
---

# 🇺🇾 BBVA Uruguay — Switch/ITSP + Google Pay

> [!info] Dossier de proyecto (contexto cualitativo)
> Proyecto **en la recta final**. Asumido por Bruno durante la licencia de Lina (ago/2026).

## Ficha
- **Cliente:** BBVA Uruguay. **País:** Uruguay.
- **Alcance:** cambio de **switch / [[ITSP]]** + habilitación de **Google Pay** ([[Push - In-App Provisioning (fluxo verde)|push provisioning]] y aprovisionamiento *legacy*), gestión de tokens vía **[[TLCM (Token Lifecycle Manager)|TLCM]]**.
- **Gobernanza:** reunión recurrente de seguimiento, agenda corta, minuta enviada por Visa.
- Descrito en la propia reunión como "proyecto muy largo y complicado" — está cerrando.

> [!warning] Actualización del 16/nov/2026 — proyecto cerrado para VCA
> El proyecto original (switch/ITSP + Google Pay) fue **cerrado** y salió de la cartera de Bruno (hasta el 5/oct/2026). Lo que viene del **18/ago** hacia atrás fue verificado; lo que se agregó el 16/nov viene de **transcripciones automáticas no validadas** (por eso `estado: parcial`). Las secciones nuevas están marcadas con "(agregado del 16/nov)".

## Estado actual (base: 16/nov/2026) — agregado del 16/nov
**Proyecto original: cerrado.** Google Pay salió a producción el **20/ago/2026**, con un aprovisionamiento promedio de **~93%**. El 4/sep se decidió cerrar en ~10 días, sin extensión de contrato; el ~28–29/sep el proyecto figura como cerrado, con mail de cierre enviado por Franco (Technical PM de CS).

**Lo que sigue vivo es comercial, no es de Bruno:** una oportunidad de **Apple Pay** (Lina y Desi), en la que el cliente, el 16/nov, aceptó los requisitos pero **rechazó el plazo de 4–6 meses** (esperaba 3), y un prospect nuevo de **Featurespace** (Q2/Q3).

> [!caution] Hasta dónde llega la información
> - **Google Pay y [[TLCM (Token Lifecycle Manager)|TLCM]] (técnico):** hasta el weekly del **31/ago**. Sin reunión posterior.
> - **Cierre:** hasta el **~29/sep**.
> - **Apple Pay y Featurespace:** hasta el **16/nov**.
> - **Sin desenlace confirmado:** corrección del OTP por SMS (prevista para el 1/sep), respuesta de Google sobre el aviso de incompatibilidad, token ranges por [[BIN]], y la situación de las ~2.010 tarjetas del PAN replacement después de octubre.

## Estado al 18/ago/2026 (histórico — verificado)
**Pruebas concluidas** — push provisioning y *legacy* funcionando. **Material de marketing aprobado por Google** (después de un cambio de logo). El paso siguiente es que Visa envíe a Google el paquete (pruebas + material) proponiendo la fecha de salida.

**Secuencia hasta el cierre:** aprobación de Google → levantar la [[Whitelist|whitelist]] → algunos días de monitoreo en producción (tasas de aprovisionamiento y transaccionalidad) → **cierre del proyecto**.

## Decisiones (18/ago/2026)
1. **Proponer el 20/ago como fecha de go-live**, enfatizando ante Google la relevancia de esa fecha.
2. **Descartar el 24 y el 26/ago** — **el 25/ago es feriado nacional en Uruguay** (Día de la Independencia), con poco soporte, y salir el día 26 desperdicia la semana.
3. **Lanzamiento solo Android → sin redes sociales** al inicio ("no queremos hacer mucho ruido"), para no frustrar a los tarjetahabientes de iOS. Se puede ampliar después, siempre con nueva aprobación de Google.
4. **Toda nueva campaña de marketing de Google Pay pasa por el portal para aprobación de Google.**
5. **El tema de [[TLCM (Token Lifecycle Manager)|TLCM]] no bloquea la salida** — sigue como investigación en paralelo.

## Pendientes y riesgos
- **Respuesta de Google sobre la fecha** — está fuera del control de Visa y Google suele pedir más plazo. Riesgo directo sobre el día 20.
- **Ventana de calendario estrecha** — el feriado del 25/ago reduce el soporte; correrse del 20 empuja el go-live para después del 26.
- **[[TLCM (Token Lifecycle Manager)|TLCM]] — rollback de reasignación de token.** El banco preguntó si es posible deshacer la reasignación de tokens a un PAN anterior (rollback de un cambio de tarjeta hecho por error). Sin respuesta concluyente. En prueba, al forzar una sustitución, la tarjeta "antigua" **no pudo aprovisionarse de nuevo**. Entendimiento preliminar: al deshabilitar un PAN en el TLCM y volver a vincular sus tokens a un PAN nuevo, se evita que aquel PAN vuelva a aprovisionarse — **a confirmar**. Afecta a un grupo reducido de tarjetas ya modificadas.
- **Publicar la app del banco** para que el push aparezca en la fecha de salida.
- **Riesgo de handover en el banco** — el responsable trabaja por proyecto y migrará a otro; el procedimiento de aprobación de marketing ante Google puede perderse. **Dejarlo por escrito en la entrega.**

> [!tip] Regla de marca a registrar en la entrega
> Toda comunicación nueva relacionada con Google Pay debe **subirse al portal y ser aprobada por Google** (logos correctos, consistencia de imagen de marca). Esto vale **después** del lanzamiento, para cada campaña — y es exactamente el tipo de procedimiento que se pierde en un handover interno del banco.

## El go-live y las dos semanas siguientes (20–31/ago/2026) — agregado del 16/nov
La fecha propuesta el 18/ago se cumplió: la [[Whitelist|whitelist]] se levantó el **jueves 20/ago, alrededor de las 10h30**. El primer día cerró en **78,5%** de aprovisionamiento (más de 200 intentos) — número más bajo explicado por la hora de apertura —, el segundo en **95,2%** (más de 400) y el tercero en **93%**. El banco recién envió el e-mail a los clientes el viernes por la tarde, coherente con la decisión del 18/ago de no hacer ruido. El 31/ago el promedio desde la salida era **~93% (92,7%)**.

Con el producto al aire, la conversación pasó a ser sobre tres fricciones, ninguna de ellas de configuración Visa:

**1. OTP por SMS.** Los clientes recibían un solo método de autenticación. El ~24/ago el tema se trataba como problema del lado Google/Visa: Franco escaló a integraciones y a Google, y planteó la hipótesis de que, al desactivar la regla de la whitelist en las reglas de riesgo del [[Emissor|emisor]], otra regla preexistente hubiera empezado a actuar. El 31/ago la lectura cambió: **el banco encontró una causa interna** — en una actualización reciente dejó de validar correctamente el celular y pasó a enviar un solo método. La corrección quedó para el 1/sep. El banco retiró la consulta que había abierto en el soporte de Google.
- Un segundo comportamiento, anterior y separado (celulares con muchos aprovisionamientos reciben solo un método), quedó sin solución.

**2. Aviso genérico de Google Pay** ("no se admiten pagos sin contacto"), en dos pantallas. El mensaje da a entender que ninguna tarjeta del banco es admitida. Un cliente que se equivocó en el vencimiento se molestó y no quiso intentar de nuevo; antes de eso había habido una falla en el flujo [[Push - In-App Provisioning (fluxo verde)|in-app]] todavía sin explicación. Escalado a Google; follow-up el 31/ago.

**3. Promociones por [[BIN]] que no aplican con la billetera** (tema nuevo el 31/ago). Los comercios dan descuento por el BIN; con Google Pay el POS recibe el token y el descuento no entra. Existe un **token range asociado a cada BIN**; quedó por confirmar cómo los consulta el banco.

## El caso del TLCM: la pregunta del 18/ago tuvo respuesta — agregado del 16/nov
La duda registrada el 18/ago ("¿existe rollback de la reasignación de tokens?") fue respondida, y la respuesta es **no**.

> [!danger] El PAN replacement no tiene vuelta atrás
> El PAN replacement en el [[TLCM (Token Lifecycle Manager)|TLCM]] desasocia **todos** los tokens del PAN antiguo y los asocia al nuevo; es binario. Intentar un nuevo replacement de vuelta al PAN original devolvió **"request inválido", sin código** (mostrado en vivo por el banco el ~24/ago). El 31/ago el punto se dio por **cerrado sin solución**; la necesidad se llevó a producto como mejora futura.

**Qué pasó.** El banco envió en lote, por el servicio de actualización de tarjetas que usa el [[Processador|procesador]], renovaciones **futuras** — tarjetas nuevas que recién empiezan a valer en octubre. El efecto fue inutilizar el PAN vigente para [[Tokenização|tokenización]]: las tarjetas actuales siguen funcionando presencialmente, pero son rechazadas en e-commerce y no pueden aprovisionarse. **~2.010 tarjetas** (el banco dijo "2010", Visa repitió "2000"). No era, por lo tanto, el "grupo reducido" que se suponía el 18/ago.

**Qué se decidió.** El banco **pausó** la actualización en lote. Habilitar ya los PANs nuevos no sirve (las tarjetas todavía no fueron entregadas) y sustituir físicamente las tarjetas no es viable (clientes fuera del país). No quedó registrado un plan de mitigación, ni hay confirmación de que la situación se haya normalizado en octubre.

## Por qué el proyecto se cerró como se cerró (sep/2026) — agregado del 16/nov
En la primera Pipeline Review VCA × CS (**4/sep**), el cuadro era: Google Pay en producción desde agosto con ~90% de aprovisionamiento, **contrato ya vencido** y el pendiente restante atribuido a Google. La decisión fue dar **hasta ~10 días** y cerrar con carta de turnover, **sin extensión**. Es decir: producto al aire, contrato sin vigencia y lo que restaba fuera del control de Visa — no se abrió adenda para esperar.

El ~28/sep el proyecto aparece como cerrado (mail de cierre). El ~29/sep Bruno registra que hubo un desencuentro de agenda en la reunión de cierre y que Franco ya había enviado el mail. El 5/oct, con Lina de vuelta, Bruno confirma que BBVA ya no está en su cartera.

> [!note] Lo que no se sabe sobre el cierre
> La fecha exacta del mail de cierre, si la reunión de cierre se rehízo y si la regla de marca destacada el 18/ago (toda campaña nueva de Google Pay pasa por el portal de Google) quedó por escrito en la entrega.

## Apple Pay: de "dentro de poco" a oportunidad en negociación — agregado del 16/nov
Ya el ~24/ago el banco decía que el proyecto incluía, "dentro de poco", la billetera de Apple. Al retomar la cartera (~28/sep), Lina contó el historial que explica por qué Apple no entró en el proyecto original: el cambio de [[ITSP]] al procesador nuevo (se oyó "Tohu" — grafía a confirmar; el anterior es HCT) y el pedido de **[[Waiver|waiver]] de [[Wallet Extensions]], negado por Apple** aun con escalamiento hasta Miami. Wallet Extensions es prerrequisito de Apple Pay, y ese caso pasó a citarse internamente como prueba de que Apple no hace excepciones.

Secuencia de la oportunidad:
- **~28/sep** — Lina pide una línea de prospecting "BBVA Uruguay Apple Pay" en la planilla de pipeline.
- **5/oct** — entra como prospecting; BD: Vane (Vanessa); contacto interno: Felipe Merea.
- **2/nov** — el procesador nuevo desarrolla Wallet Extensions; se pide estado; BBVA no responde; escalado con la BD.
- **11/nov** — sin novedades.
- **16/nov** — reunión con el cliente: **acepta los requisitos, rechaza el plazo de 4–6 meses** (esperaba 3).

> [!warning] El precedente del Expedite
> En Google Pay, CS hizo configuraciones en régimen acelerado (1–2 días en lugar del plazo normal de ~10) **sin costo**. En la lectura de Lina (16/nov) eso crea precedente: el cliente puede esperar lo mismo en Apple Pay.

**Featurespace.** El 16/nov, BBVA Uruguay fue citado también como prospect nuevo de Featurespace (Q2/Q3). Solo la mención; Lina quedó en registrar la oportunidad.

## Línea de tiempo (ago–nov/2026) — agregado del 16/nov
- **18/ago** — Decisiones de go-live (sección de arriba).
- **20/ago** — **Go-live de Google Pay** (~10h30). 78,5%.
- **21–22/ago** — E-mail a los clientes; 95,2% y 93%.
- **~24/ago** — Seguimiento (fecha inferida): OTP, TLCM con ~2.010 tarjetas, aviso de Google. El banco pausa el lote.
- **31/ago** — Weekly: promedio ~93%; causa interna del OTP; TLCM cerrado sin solución; promociones por BIN.
- **1/sep** — Corrección del OTP prevista (sin confirmación).
- **4/sep** — Pipeline Review VCA × CS: cerrar en ~10 días, sin extensión.
- **~28–29/sep** — Proyecto cerrado; mail de cierre de Franco.
- **5/oct** — Fuera de la cartera de Bruno; Apple Pay entra como prospecting.
- **2/nov** — Apple Pay: el procesador desarrolla Wallet Extensions; banco sin respuesta; escalado.
- **16/nov** — Apple Pay: el cliente acepta los requisitos, rechaza 4–6 meses. Featurespace citado como prospect.

## Lecciones que quedan — agregado del 16/nov
- **Validar la fecha de vigencia antes de correr lotes de PAN replacement.** Una renovación futura enviada antes de tiempo inutiliza el PAN vigente para tokenización, y no hay cómo deshacerlo.
- **Al levantar la whitelist, revisar el orden de las reglas de riesgo restantes** (hipótesis planteada en el caso del OTP; no confirmada como causa).
- **Mapear las promociones por BIN antes del go-live** e informar los token ranges a los comercios.
- **La tasa del primer día no es referencia**: sube a más de 90% en el segundo.
- **Apple no da waiver de Wallet Extensions** — plantear ese prerrequisito al inicio de cualquier conversación de Apple Pay.
- **El Expedite sin costo se vuelve expectativa** en el proyecto siguiente del mismo cliente.
- En la Pipeline Review del 4/sep, CS dejó la recomendación de no llevar al cliente un plan muy granular sin alguien de implementaciones en la conversación.

## Personas (ago–nov/2026) — agregado del 16/nov
- **Visa:** Franco (Technical PM de CS — condujo la implementación y el cierre); Bruno (acompañamiento VCA durante la licencia de Lina); Lina Torres y Desi (oportunidades de Apple Pay y Featurespace); Dani ([[CSM (Customer Success Manager)|CSM]]); Vane/Vanessa (BD); Felipe Merea (contacto interno de la cuenta — rol a confirmar).
- **BBVA:** Diego (interlocutor principal); Guille; Andrea (head de pagos, citada).
- **Procesador nuevo:** Paco e Inés. **A confirmar:** Rafa (analiza logs con Franco; empresa no confirmada).

---
[[Home]]
