---
tags: ["proyecto", "cliente/Naranja-X"]
fuente: Transcripciones automáticas de reuniones (sep–nov/2026) — Naranja X, Weekly Tech y 1:1 internas
estado: parcial
title: "Naranja X — dossier"
---

# 🇦🇷 Naranja X (Argentina) — migración del prepago/débito a Pismo

> [!success] Confirmado por Bruno el 16/11/2026
> La **PMO formal del proyecto es Jenny Johansen**; Bruno apoya.


> [!info] Dossier de proyecto (contexto cualitativo)
> El seguimiento **vivo** (pendientes, fechas) está en la app y en la ficha `projetos/projeto-naranja-x-pismo.md`. Aquí quedan el contexto, la historia, las decisiones y el porqué.

> [!warning] Fuente no validada
> Todo viene de transcripción automática, con hablantes anonimizados y grabaciones cortadas. Lo que está marcado `[a confirmar]` no fue validado con nadie. Fecha de corte: **16/11/2026**.

## Ficha
- **Cliente:** Naranja X, fintech asociada al Banco Galicia; Principal Member de Visa. **País:** Argentina.
- **Qué es:** cambio de [[Processador|procesador]] del prepago y del débito Visa — de Global Processing (GP) a Pismo. Naranja ejecuta; Pismo habilita la plataforma; Visa hace PMO y capacitaciones. No es un proyecto de billetera digital ni de SDK.
- **Fuera del alcance:** crédito, que está en [[Prisma]] — tema que no se discute con el cliente sin consulta interna.
- **Terceros:** GP (procesador actual); [[Thales]] ([[Tokenização|tokens]] y 3DS, mantenidos en la fase 1); BCRA (regulador).
- **Contrato Visa:** advisory de 6 meses — PMO de la migración + capacitaciones + apoyo de diseño funcional. No incluye gap analysis.
- **Personas —** Naranja: Gabriela "Gaby" Conte (medios de pago), Marcos Mambrín (líder técnico inicial), Ariel (reemplaza a Marcos), Cristian "Cris" (decisor), Federico Cánepa (contrato). Visa: Jenny Johansen (lidera el PMO), Bruno (apoyo), Lina Torres (PM nombrada al inicio), Desi Ovejero (kickoff), Ale Rosa `[grafía a confirmar]` (dueño del contrato), Mariana Bellino (capacitaciones), Melina "Meli" Albornoz ([[CS Implementations]]). Equipo Pismo: Fede (comercial) y Leonel "Leo" Cuevas (técnico). NTConsult: Bruno Oliveira e Yves Abreu `[grafía a confirmar]` (especialista Pismo, bajo demanda).

## Estado actual (base: Weekly Tech del 16/11/2026)
**Rojo (sugerencia).** El contrato Naranja–Pismo fue firmado (~05–11/11) y Pismo designó un PM el 13/11, pero **no da fecha de kickoff por falta de recursos**; sin eso, CS no abre el proyecto en Visa. Al mismo tiempo, el contrato de advisory de 6 meses "vai ficar curtíssimo" frente a un plan de 9 meses — hay una conversación de renovación que tener con el cliente.

Cinco días antes, desde la óptica de las reuniones con el cliente (sesión técnica del 11/11), la lectura era ámbar tendiendo a positivo: contrato destrabado, dudas técnicas resueltas, sandbox prometido en días, roadmap preliminar en **junio** (el cliente quiere **mayo**; año no dicho, 2027 por deducción). Las dos lecturas quedan registradas; manda la más reciente.

## Frentes
| Frente | Situación |
|---|---|
| Contrato Naranja–Pismo y Solution Design | Contrato firmado; falta la adenda sobre el archivo de [[Clearing]] sin tratamiento (PCI). Solution Design en la versión 4, firma formal no confirmada |
| Apertura del proyecto Visa y kickoff | **Bloqueada**: Pismo sin recursos y sin fecha de kickoff |
| [[BIN]] nuevo de débito | BINs asignados y deliberadamente sin configurar; certificación completa (~90 días) solo después del kickoff Visa |
| Migración Big Bang de los BINs actuales | No iniciada; track separado, después del BIN nuevo |
| Capacitaciones | 4 módulos virtuales incluidos en el contrato, de la semana del 16/11 a inicios de diciembre |
| Gobernanza y plan integrado | Weekly + planilla + minuta funcionando; plan consolidado Visa+Pismo atrasado desde ~22/10 |

## La historia

### Un proyecto vendido antes de tener dueño (sep/2026)
Las conversaciones entre Naranja y Visa/Pismo venían de diciembre de 2025. Cuando se firmó el advisory de Visa, quien lo había vendido ya estaba de salida hacia otra cuenta, y la PM nombrada acababa de volver. El resultado fue un kickoff armado a las apuradas: el deck vino de NTConsult, fue adaptado al estándar del kickoff de BancoEstado, y el alcance contractual solo se leyó en detalle el mismo día del kickoff. De ahí salió la primera lección: **reconstruir contrato y alcance antes de hablar con el cliente**.

El kickoff (~30/09) salió mal en la evaluación interna. El cliente cuestionó láminas genéricas (embossing, que Naranja hace por cuenta propia), dijo que las respuestas a su planilla de dudas no respondían a lo que preguntaba y, poco después, se descubrió que Pismo ya tenía un frente en marcha con el cliente que el kickoff no cubría.

### La regla del mensaje único (02/10)
El viernes siguiente, el equipo Pismo dentro de Visa puso orden en la casa. Tres reglas que valen hasta hoy:
- Pregunta sobre Pismo, procesamiento o mensajería **no la responde el PMO**: va a Fede y Leo.
- Las capacitaciones explican "la relación con Visa teniendo a Pismo como procesador" — Pismo hace mucho menos que GP.
- Crédito no se toca.

> [!warning] Vocabulario
> El cliente y el deck llaman al proyecto "Switch Débito" y "autoprocesamiento"; las sesiones técnicas de los miércoles llevan "Autoprocesamiento" en el título. **Ninguna transcripción define el término.** Pismo pide no usar ni "switch" ni "autoprocesamiento" — decir que Pismo es switch es "completamente incorrecto". La fórmula pedida: "se van a procesar con Pismo; Pismo zero balance, zero decision". En los entregables, describir en palabras y no inventar una definición.

### Cambio de PM en la primera semana (06/10)
Lina salió de licencia y Jenny asumió, con Bruno de apoyo. Fede aprovechó para redefinir lo que espera del PMO: no ser especialista en Pismo, sino **coordinar a las tres partes** (Pismo, Visa, cliente), ocuparse de minutas y reuniones y mantener un solo mensaje. Y avisó: ningún plazo es firme antes del Solution Design; todo es referencia "con asteriscos". No hay registro formal del traspaso de PM, y las fuentes divergen sobre quién es la titular — ver lagunas.

### Big Bang, y por qué (07–08/10)
El producto de Naranja tiene **dos BINs en el mismo plástico** — banda de uno, chip de otro, prepago y débito. La regla de la marca es que un [[BIN]] entero pertenece a un único procesador, así que la gradualidad mínima es un BIN por vez. Fasear por rangos exigiría abrir los BINs de 6 dígitos en BINs de 8 (~200 en total): no es automático y multiplica los BINs sujetos a programas de penalidad por tasa de aprobación y de tokenización. Sumando el costo de operar contracargos y seguimiento en dos procesadores al mismo tiempo, Cris dio el "no go" al progresivo. Quedó **Big Bang**, mitigado con más tiempo de piloto interno ([[Friends and Family]]).

La misma conversación mató la expectativa de un hito productivo en 2026. El directorio de Naranja quería algo para mostrar en diciembre; la respuesta fue que, con el freeze de la marca (12/12 hasta el 6 de enero, que vale también para sandbox), producción en diciembre es imposible. Lo que se puede construir es una **narrativa de avances no productivos**: BIN pedido, ventanas de certificación agendadas, APIs integradas, sandbox configurado.

De ahí la estrategia en dos tiempos, ratificada por el cliente el 08/10: **primero un BIN nuevo de débito** (el hito), **después la migración** de los BINs actuales, en track separado. La cartera dual actual migra como está y muere por vencimiento natural (horizonte citado: 2032 `[a confirmar]`).

### La alerta de CS que nadie le llevó al cliente
Desde la víspera del kickoff, Implementations avisaba: Pismo tiene prepago y crédito en producción en Argentina, **no débito**. Consecuencias: certificación completa (~90 días del kickoff Visa a producción) en lugar de una copia de configuración; riesgo de que Pismo tenga que desarrollar en medio del proyecto; y la duda sobre lo regulatorio/fiscal local. Pismo respondió que, habiendo adecuado la plataforma para prepago, no necesita ajustes para débito — "a validar na prática". El riesgo se dejó deliberadamente fuera del deck de kickoff.

De la misma reunión interna salió la orientación de Meli que hoy explica el bloqueo: **no abrir el proyecto Visa antes de que la integración Naranja–Pismo esté avanzada**, si no queda parado y la certificación "cai".

### Seis semanas de contrato (08/10 → 11/11)
El contrato Naranja–Pismo fue el cuello de botella de octubre. El 15/10 las cláusulas comerciales estaban cerradas (fecha efectiva 01/11) y quedaba una cláusula de cumplimiento regulatorio del BCRA, excepción que Pismo normalmente no incluye. El 05/11 había OK contractual; el 11/11 Visa decía haber recibido el contrato.

En paralelo corría la discusión del archivo de [[Clearing]]. El estándar de Pismo es entregar un reporte con el número de tarjeta reemplazado por un ID interno; Naranja quería el archivo de Visa tal como viene. Como Naranja no es PCI, eso exigió validación interna y una adenda que exime a Pismo por el manejo del dato. Decisión registrada el 28/10: **la firma del contrato no queda atada a esa definición** — por eso el contrato se cerró y la adenda sigue pendiente.

### El plan que no cerraba (oct–nov)
El plan consolidado fue prometido al cliente para ~22/10 y se corrió hasta el 12/11. El motivo apareció el 03/11: el plan estándar de Pismo ("tempo comercial", ~8 meses hasta la migración, BIN nuevo en el mes 5) y el plan de Implementations no coincidían — producción desfasada en ~2 meses, pruebas en ~3. Fede dio el criterio: **tres hitos tienen que coincidir** entre los dos planes — certificación con Visa, producción del BIN nuevo, producción de la migración. Y Leo dio el consejo de expectativa: mejor pasar el plazo largo y acortar después.

### Capacitaciones: lo que cubre el contrato
Con la salida de GP, Naranja pasa a operar sola disputas, fraude, conciliación y reportes. El paquete contractual quedó en 4 módulos virtuales de ~1h: Autorizaciones, Conciliaciones y pagos, Fraude y disputas, Compliance de marcas. No cubren el uso práctico de las herramientas, porque Naranja aún no tiene acceso — eso queda para un entrenamiento pago cerca de la producción. La mayor laguna prevista es disputas.

## Cómo funciona este tipo de proyecto (resumen)
- **Procesador mínimo.** En el modelo *zero balance*, Pismo recibe la autorización de Visa, llama al webhook del [[Emissor|emisor]] y devuelve a la red la respuesta que dé el emisor. Saldo y decisión quedan con el emisor. El mensaje [[ISO 8583]] completo llega por cola, para rastreo.
- **Un identificador por cliente.** Pismo sube un identificador de procesador nuevo para cada cliente (oído "PCR" `[sigla a confirmar]`), y los BINs se asocian a él — solo con contrato firmado.
- **BIN nuevo no se configura temprano.** Configurar es atar a un procesador; en el antiguo, se vuelve migración.
- **Visa entra al final.** Contrato → integración del emisor con las APIs del procesador → apertura del proyecto con la marca → certificación → piloto → producción.
- **Dos sandboxes.** El del procesador (sin Visa, datos ficticios) y el de Visa (con la marca).
- **Quién responde por qué.** Las actualizaciones obligatorias de procesador quedan con Pismo ([[Mandato]]); fees por desempeño, reglas de fraude, disputas, conciliación y [[Settlement|liquidación]] son del emisor.
- **Tokens y llaves.** El [[TSP (Token Service Provider)|TSP]] puede quedarse donde está; las llaves del emisor tienen que ser cedidas por el procesador saliente.

## Decisiones y el porqué
- **Big Bang en lugar de progresivo** — costo y riesgo de dos procesadores y ~200 BINs de 8.
- **BIN nuevo antes de la migración** — es lo que permite darle un hito al cliente más temprano, solo con altas nuevas; la migración queda para después.
- **Sin hito productivo en diciembre** — freeze de la marca.
- **Tokens y 3DS con Thales en la fase 1** — evita certificación y migración de tokens.
- **El historial transaccional no migra.**
- **Contrato sin esperar la definición de los archivos** — para destrabar el proyecto.
- **El PMO no responde por Pismo** — mensaje único.

## Lecciones
> [!tip] Qué llevar al próximo proyecto con Pismo
> 1. Chequear con CS, antes de vender plazo, si el procesador ya tiene el producto en producción en el país.
> 2. Contrato firmado no es proyecto abierto: sin recursos del procesador no hay kickoff ni apertura en CS.
> 3. Ninguna fecha al cliente antes del Solution Design; cuando haya dos planes, anclar en tres hitos comunes.
> 4. Verificar la duración del advisory contra el roadmap del procesador antes de firmar: aquí son 6 meses contratados y, ya en el kickoff, a Lina y a Bruno les parecía poco.
> 5. Separar lo que es Visa-con-Visa antes de mandarle la planilla al cliente.

## Pendientes que piden decisión
- **Fecha de kickoff de Pismo** — sin ella nada avanza del lado Visa.
- **Renovación del contrato de advisory** — 6 meses contratados × plan de 9.
- **Fecha objetivo** — el cliente quiere mayo, el roadmap dice junio; no está claro si "junio" es la migración o el fin del proyecto.

## Lagunas
- Quién es la PM formal hoy (Lina nombrada el 28–29/09; Jenny lidera desde el 06–13/10; Bruno apoyo).
- "Global Payments" (un audio interno) × "Global Processing" (reuniones de proyecto) como nombre del procesador de origen.
- Significado de "autoprocesamiento"; nombre correcto del proyecto en los entregables.
- Año de las fechas objetivo; fecha exacta de firma del contrato Naranja–Pismo; fechas de inicio y fin del contrato Visa.
- Sin transcripción: weekly del 22/10, sesiones técnicas del 14 y 21/10 y 04/11, y lo que pasó con el cliente después del 11/11.
- Grafías y siglas oídas y no confirmadas: "PCR", "EP-747/EPM-747", "B-Roll" (herramienta de disputas), apellidos de varios participantes.
