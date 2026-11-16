---
tags: ["proyecto", "cliente/Banco-de-Corrientes"]
fuente: Reportes y minutas — Banco de Corrientes; transcripciones automáticas de ago–nov/2026 (no validadas)
estado: parcial
title: "Banco de Corrientes — dossier"
---

# 🇦🇷 Banco de Corrientes (Argentina)

> [!success] Confirmado por Bruno el 16/11/2026
> El proyecto de implementación de Click to Pay está **finalizado** y el banco **no pagó la multa de US$ 5.000** a Visa.


> [!info] Dossier de proyecto (contexto cualitativo)
> El seguimiento **vivo** está en la app. Aquí queda el contexto y la historia.

## Ficha
- **Cliente:** Banco de Corrientes. **País:** Argentina.
- **Tracks:** Apple Pay y [[Click to Pay]]. Acompañamiento hasta el **30/sep**.
- **[[Processador|Procesador]]:** [[Prisma]]. **TSP/SDK ([[ITSP]]):** [[Thales]]. **Certificador:** [[FIME]].
- **Contactos —** Banco: Martín De la Vega (ejecutivo), Juan Torres "Juanjo" (Torres Barusso), Verónica Escobar, Valentina Torrado, Cristian (técnico). Visa: Lina Torres, Marlene Migliardi, Javier Cadena, Laura. [[Thales]]: Patricia González, Miguel Ángel. [[Prisma]]: Ivan Hirsch, Mario.
  - ⚠️ La tabla de participantes de la minuta del 30/jul lista a **Edgar Javier Cadena** en la fila del banco y mezcla las filas de Visa/[[Thales]]/[[Prisma]] (Patricia González aparece bajo Visa, Ivan Hirsch bajo Thales). El vínculo que figura aquí — Patricia/[[Thales]], Ivan/[[Prisma]], Javier Cadena/Visa — es el verificado en las weeklies; **confirmar con el autor de la minuta** antes de propagar su versión.

## Estado al 16/11/2026 (base: transcripciones de sep–nov/2026)

> [!warning] Hasta dónde llega la información
> Contenido nuevo proveniente de **transcripción automática no validada**. Última reunión de Corrientes con contenido técnico: **7/oct/2026**. Última mención al estado contractual: **5/oct/2026**. Después de eso solo hay dos citas (2 y 4/nov) que confirman el [[Click to Pay]] en producción. **Sobre Apple Pay después del 7/oct no hay nada.**

**Programa cerrado el 30/sep/2026.** [[Click to Pay]] **concluido** — fase 2 en producción desde el **25/sep**, cinco días antes del plazo del [[Mandato|mandato]]; fase 3 (logo en las credenciales) con evidencias registradas; cierre cargado por el banco en Visa Access el 29/sep. **Apple Pay** salió del programa sin certificación y siguió por canal técnico: precertificación [[FIME]] iniciada el 5/oct y, el 7/oct, error en prueba productiva de push provisioning sin causa identificada. Para la cartera de Bruno y de VCA el proyecto está **cerrado**: sigue con CS por billing ("va por billing ahora", Weekly Tech del 5/oct).

## Estado anterior (base: weekly del 7/ago/2026)
**Apple Pay** ámbar — el **push provisioning ya funciona**, y se encontró la causa del impasse de la semana anterior: los datos de Apple en el **[[VCMM|BCM]] nunca se habían enviado (submit)**. El bloqueo ahora es la **[[Wallet Extensions|Wallet Extension]]**, que sigue fallando, y el **[[Partner Hub]] está detenido a la espera de la firma del contrato de T&C** por parte de la gerencia del banco. **[[Click to Pay]]** ámbar — conectividad con [[Thales]] resuelta (certificado), pero quedan el **HTTP 503 en el PUT** y las colisiones de **[[CAR ID]] / Consumer ID** en el [[Register Consumer]], con el mandato venciendo el 30/sep.

## Frentes / tracks
| Frente | Situación |
|---|---|
| [[Click to Pay]] | Móvil prácticamente completo. Certificado corregido; el **HTTP 503 en el PUT** y la colisión de [[CAR ID]] en el [[Register Consumer]] todavía impiden el E2E. Las notificaciones (Firebase/APNs) quedan para después — no son *stopper* |
| Apple Pay | **Push provisioning OK.** [[Wallet Extensions|Wallet Extension]] fallando. [[Partner Hub]] bloqueado por la firma del contrato de T&C. Material de marketing atrasado |

## Historial (línea de tiempo)
- **2025** — Prerrequisito Apple enviado (e-mail del [[AID (Apple)|AID]] a Apple).
- **Configuración del [[Partner Hub]]** — de 27% → 50/60%; corregir el país a **Argentina** destrabó aprobaciones.
- **Reunión técnica Apple Pay** (Visa + [[Thales]] + [[Prisma]] + banco) — diagnóstico del crash en el flujo verde: config Visa OK (el flujo amarillo funciona; T&C cargados; ya funciona en Google Pay), pero el **flujo verde no llega a Visa** (queda en el [[ITSP]]/Thales). Causa raíz probable: payload/token de login expirado.
- **17/jul/2026** — Weekly [[Click to Pay]]: ambientes listos; carga masiva OK en [[Prisma]]; pruebas funcionales en preproducción agendadas para el 22/jul.
- **16/jun/2026** — **1.er SteerCo** (ver sección abajo).
- **29–31/jul** — Ventana objetivo del 2.º SteerCo (reprogramado para asegurar a Martín y Agustín).
- **30/jul/2026** — **2.º SteerCo** (ver sección abajo): crédito destrabado en Apple Pay; [[Click to Pay]] bloqueado en el Register Consumer.
- **31/jul/2026** — Sesión técnica banco + [[Thales]] sobre el HTTP 500 del Register Consumer.
- **6/ago/2026** — Briefing de handover: Javier Cadena le pasa la conducción de las weeklies a Bruno (feriado en Colombia + licencia de Lina).
- **7/ago/2026** — **Weekly doble Apple Pay + [[Click to Pay]]** (ver sección abajo): push provisioning funcionando; config del [[VCMM|BCM]] regrabada en vivo.
- **28/ago/2026** — **3.er SteerCo** (agendado).
- **30/sep/2026** — Fecha límite del mandato [[Click to Pay]].
- **24/ago/2026** — Sesión técnica [[Click to Pay]] con [[Thales]]: el login del SDK responde OK, el enrolamiento falla; Thales ve tres logins por disparo.
- **27/ago/2026** — Reuniones internas sobre el cobro de US$ 5.000 (ver sección "Los dos cobros").
- **~28/ago/2026** — Weekly: el error pasa a venir de Visa (emisor/agregador no habilitado en el ambiente de prueba); caso abierto en el Support Hub. No hay transcripción de un 3.er SteerCo en esa fecha.
- **2–3/sep/2026** — Escalamiento interno del costo de US$ 350 del sandbox; se decide no cobrar "esta vez".
- **~4/sep/2026** (alternativa 11/sep) — **Decisión de ir directo a producción controlada.**
- **25/sep/2026** — **[[Click to Pay]] fase 2 en producción.**
- **29/sep/2026** — Reunión de continuidad de Apple Pay; cierre del mandato cargado en Visa Access.
- **30/sep/2026** — **SteerCo de cierre del programa.**
- **~2/oct/2026** — Seguimiento: el banco señala "ir por billing", sin decisión formal.
- **5/oct/2026** — Inicio de la precertificación [[FIME]]; internamente, Corrientes sale de la cartera VCA.
- **7/oct/2026** — Error en casos productivos de push provisioning. Último registro.
- **25 o 26/oct/2026** — Inicio planificado de la certificación oficial [[FIME]] (fecha a confirmar; resultado desconocido).

## SteerCo inicial (jun/2026)
1.er Steering Committee (Apple Pay & Click to Pay) — foco en **visibilidad ejecutiva**, dependencias críticas y avance coordinado de los dos frentes. Deadline del mandato [[Click to Pay]]: **30/sep/2026**. Gobernanza instalada: **SteerCo mensual/ad-hoc** (estratégico) + **weekly operativa**.

**Apple Pay** — avanzado, entrando en una fase en la que **1–2 definiciones técnicas** condicionan el próximo paso. Preparación para la certificación [[FIME]]; exige coordinar dispositivos, tarjetas y [[Whitelist|whitelist]]. Config con **CCM Digital** agendada (17/jun); pendientes: certificados **JWS/JWE** y llave **WSD/ZCMK**.

**[[Click to Pay]]** — plan aprobado (2.ª prórroga), cierra el **30/sep/2026**, integración técnica en curso. El banco enviará el **DEF para los 5 BINes**; el CCM estimó **~5 días hábiles por ambiente**.

**Línea de tiempo técnica ([[Thales]]):** SDK iOS/Android **v4.3.0** → integración de la app BanCo con el SDK → config de bines/certificados/llaves en el tenant Thales (Pre-PRD) → habilitar al menos 1 [[BIN]].

## 2.º SteerCo (30/jul/2026)
Segundo Steering Committee del programa. Objetivo declarado: **convertir el avance técnico reciente en decisión ejecutiva** — owner claro, fecha de la próxima prueba y ruta de evidencia para los dos frentes. El programa salió de la fase de dependencias de configuración y entró en **pruebas reales**.

**Apple Pay — ámbar.** El push provisioning de **crédito se completó con éxito** (después de un ajuste de [[Prisma]]) — es el avance que destraba el frente. El [[TestFlight]] permitió progresar en el flujo: la Wallet abre, muestra los datos y presenta los T&C. Quedaron dos problemas:
- **Débito sigue fallando.** [[Thales]] reporta **HTTP 400** proveniente de [[Prisma]]/emisor, asociado a `checkCardEligibility` / `requestCardDigitization`, con **responseCode 911 — Operation failed**.
- **El estado posenrolamiento no vuelve correcto a la app del banco.** Después de un provisioning exitoso la app sigue mostrando la tarjeta como no enrolada, y deja que el usuario repita la operación. El banco entiende que la revisión tiene que enfocarse en la **devolución del status por parte de las plataformas involucradas**, no en la app.

**[[Click to Pay]] — ámbar tendiendo a verde.** La funcionalidad móvil está prácticamente completa y los ambientes/configuraciones dejaron de percibirse como bloqueo. Los **BINs fueron enviados: 5 de crédito y 2 de débito**. Una vez generado el caso de implementación, Visa tiene un **SLA de 5 días hábiles** para habilitar el ambiente de pruebas. Situación por componente: **DEF/BINes validado · Ambientes listos · Backend casi listo · Pruebas E2E por evidenciar**.
- **Bloqueo único:** la **API Register Consumer**. El banco creyó al principio que era un problema interno, pero hoy observa un **HTTP 500** devuelto en la interacción con [[Thales]]. Sesión técnica dedicada agendada para el 31/jul.

**Preocupación ejecutiva (Martín De la Vega).** Presión por cumplir el roadmap por obligación regulatoria; recursos económicos ya comprometidos en los dos frentes; exigencia de que **todo bloqueo sea identificado y comunicado a tiempo**, con **transparencia sobre el origen** y coordinación estrecha entre Visa, [[Prisma]], [[Thales]] y el banco para no acumular atraso por dependencia de terceros.

**Riesgos planteados en el comité:** débito HTTP 400/911 (ámbar/rojo) · Apple Pay todavía no listo para [[FIME]] (ámbar) · backend interno trabando el E2E de [[Click to Pay]] (ámbar) · deadline regulatorio del 30/sep (ámbar).

## Weekly del 7/ago/2026 — Apple Pay y Click to Pay

Sesión conducida en cobertura doble: Javier de feriado y Lina de licencia. La weekly son **dos reuniones en el mismo canal** — bloque Apple Pay (conducido por Visa/Argentina, que también envía la minuta) y, a continuación, bloque [[Click to Pay]].

### Apple Pay — el hallazgo de la semana
El **push provisioning empezó a funcionar** — el bloqueo central de julio quedó atrás. Pero apareció un síntoma nuevo: después de un provisioning exitoso, al consultar el **estado de la tarjeta** por otro método, [[Thales]] devolvía un estado incorrecto y la app seguía ofreciendo el botón de aprovisionar.

La causa se encontró en vivo: en el **[[VCMM|BCM]] → pestaña *Additional Information* → sección iOS (**App ID** / **Banking Store ID**), los valores **no aparecían**. El banco los había tipeado, pero **el submit nunca se concretó** — el campo *Last Update* todavía marcaba el **2 de julio**. [[Thales]] había alertado sobre esto cuatro o cinco veces. Regrabado en la sesión; costo: una semana entera de pruebas.

> [!warning] Lección
> En el [[VCMM|BCM]], **revisar el campo *Last Update* después de grabar**. Tipear no es enviar (submit) — y la alerta del proveedor fue ignorada varias veces antes de que alguien abriera la pantalla.

Notas técnicas de [[VCMM|BCM]] registradas en la sesión:
- Los cambios en *Additional Information* tienen que estar asignados a los rangos de [[BIN]] (pestaña *Assignments → Manage Assignments*). Como el banco tiene **un único grupo**, todos los rangos ya están vinculados — **no hace falta reasignar**.
- La propagación lleva **algunas horas**.
- El campo **URL** solo es necesario para **INAP** (In-App Provisioning), fuera del alcance actual.

La **[[Wallet Extensions|Wallet Extension]]** seguía fallando al final de la reunión ("no se puede agregar la tarjeta"). [[Thales]] lo asocia directamente a la configuración ausente en el BCM y señala que existe una línea dedicada a la extension en la configuración del SDK.

**[[Partner Hub]]:** el banco no tiene dudas y venía avanzando, pero está **bloqueado a la espera de la firma del contrato de términos y condiciones por parte del área gerencial** — el contrato fue a legales, que tiene que traducirlo y revisarlo. La acción pendiente en el Hub es cargar el contrato firmado. **Material de marketing "bastante atrasado"**; Visa **no participa** de la producción — el banco produce según los requisitos de Apple y carga en el Hub para aprobación.

**[[FIME]]:** orientación de **consultar la disponibilidad sin cerrar fecha**, decidiendo después en función del avance de las pruebas.

### Click to Pay — dos incidentes
**Conectividad — resuelta.** El certificado usado por el banco referenciaba **Amazon RCA**, mientras que el endpoint de [[Thales]] en **STG** pasó a presentar **Amazon RCA 2048-M**; corregida la cadena de confianza, la respuesta pasó a ser exitosa. El 7/ago el tema se describe simplemente como certificado vencido. Queda abierto preguntarle a Thales si hubo una renovación planificada de certificados en STG.

**HTTP 503 en el PUT — abierto.** Superada la generación de token/OAuth, el consumo del servicio siguiente (una solicitud **PUT**) devuelve **503**. Sin causa raíz ni ETA; dependencia total de [[Thales]].

**[[Register Consumer]] — causa identificada.** La falla era de dato: se intentaba registrar un **PAN ya registrado en [[Thales]] con otro [[CAR ID]]**. La tarjeta terminada en 7392 ya figuraba con un CAR ID específico y el Consumer ID correspondiente. **Existen registros exitosos del 5/ago** — el banco tiene un juego de datos válido.

> [!tip] Recomendación de [[Thales]]
> Dejar de gastar tiempo en la etapa de registro en ambiente de prueba: usar el par **[[CAR ID]] + Consumer ID ya registrado**, o datos limpios, o saltear el registro — e ir directo a las pruebas de [[Click to Pay]] con el SDK, que es lo que interesa. Existe la API **`getCard`** (entra el CAR ID, devuelve el PAN); el banco debe mantener una **tabla asociativa propia** entre sus datos y los CAR IDs.

**Notificaciones (push de [[Click to Pay]]):** dos opciones — **backend-to-backend** o **vía frontend** del banco. Para frontend, [[Thales]] necesita datos de **Firebase y APNs**; plazo de 5 días en prueba + 5 en producción, más aprobación en **CAB**. **Decisión: no son obligatorias para la homologación y no son *stopper*** — quedan para después, dado lo ajustado del plazo.

**Mecánica asíncrona explicada en la sesión:** la API de enrolamiento disparada por el SDK va a Visa de forma asíncrona — Thales envía el requerimiento, Visa devuelve errores de datos en el momento, y después hay un **polling de Thales a Visa** buscando el estado; cuando Visa responde, Thales le responde al banco.

## Decisiones y puntos importantes
- **Certificados Apple Pay — cerrado.** Se confirmó que los certificados usados en Google Pay y en Apple Pay **son los mismos** y ya estaban validados internamente: no hace falta generar un certificado exclusivo para Apple Pay. Solo queda el seguimiento por e-mail de cualquier cabo suelto.
- **El foco de Apple Pay migra** de la configuración a la **corrección del comportamiento funcional posprovisioning** y el cierre del débito.
- **[[FIME]] queda condicionado** a una prueba exitosa de crédito **+** débito con evidencia de tokenización.
- **Gobernanza mantenida:** trazabilidad y visibilidad de bloqueadores en las weeklies, con los hitos de Apple Pay y [[Click to Pay]] alineados al roadmap regulatorio. Próximo SteerCo: **28/ago/2026**.
- **Apple Pay — causa raíz** probable en el **payload/token de login** (banco + [[Thales]]), no en la config de Visa.
- **Acciones Apple Pay:** publicar la app en **[[TestFlight]]**; reenviar e-mail a Apple confirmando el **[[AID (Apple)|AID]]**; compartir **Correlation ID / Token Reference ID** ([[Vital Sign]]) para diagnóstico.
- **[[Partner Hub]] — buena práctica:** asegurar que más de una persona del banco tenga acceso.

## Pendientes y riesgos (actualizado en la weekly del 7/ago/2026)

**Apple Pay**
- **Cargar el contrato de términos y condiciones firmado en el [[Partner Hub]]** — depende de la gerencia y de legales del banco (traducción + revisión). **Bloqueo activo, sin plazo y fuera del control del equipo de proyecto.** Necesita escalamiento.
- **Resolver la [[Wallet Extensions|Wallet Extension]]** — prioridad n.º 1 del track y puerta de entrada a la certificación [[FIME]]. Capturar logs de consola y revisar la configuración de la extension dentro del SDK de [[Thales]].
- **Producir y cargar el material de marketing** según los requisitos de Apple (Yamila/marketing + Seba/comercial). Atrasado — y hay un precedente de emisor detenido 2 meses por rechazo de una pieza.
- **Consultar la disponibilidad de [[FIME]]** sin cerrar fecha.
- **Definir el criterio de avance hacia [[FIME]]** — condicionado a crédito + débito OK con evidencia de tokenización.
- Asegurar un **2.º acceso probado** al [[Partner Hub]].

**[[Click to Pay]]**
- **Explicar/resolver el HTTP 503 en el PUT** — sin causa raíz ni ETA, dependencia total de [[Thales]]. Es lo que bloquea el E2E.
- **Confirmar con [[Thales]]** si hubo un cambio planificado o una renovación de certificados en el ambiente STG.
- **Cargar manualmente las tarjetas en las tablas del banco** y volver a probar el flujo; ejercitar el registro completo con otras tarjetas.
- Enviar datos de **Firebase y APNs** a [[Thales]] — poshomologación, no bloqueante.
- **Deadline regulatorio 30/sep/2026** — sin evidencia de E2E el riesgo de incumplimiento sube; mantener el tracking semanal y escalar temprano.

**Cerrado desde el último dossier**
- ~~Crash del flujo verde / push provisioning~~ — **funcionando** desde el 7/ago.
- ~~Configuración de Apple en el [[VCMM|BCM]]~~ — se descubrió que el submit nunca se había concretado; **regrabado** en la sesión del 7/ago.
- ~~Conectividad banco ↔ [[Thales]] en [[Click to Pay]]~~ — resuelta (cadena de certificados Amazon RCA → RCA 2048-M / certificado vencido).
- ~~Causa del error de [[Register Consumer]]~~ — identificada: PAN ya registrado con otro [[CAR ID]]. Existen registros exitosos del 5/ago.
- ~~Necesidad de reasignar rangos de [[BIN]] en el BCM~~ — descartada (grupo único de Additional Information).
- ~~Obligatoriedad de las notificaciones para homologar~~ — aclarado que **no son *stopper***.
- ~~Certificados Apple (JWS/JWE, WSD/ZCMK)~~ — mismos certificados de Google Pay, validados; tema cerrado en el SteerCo.
- ~~DEF de los 5 BINes~~ — enviados **5 BINs de crédito + 2 de débito**; DEF/BINes validado.

**Todavía abierto del ciclo anterior**
- Confirmar la vigencia del [[AID (Apple)|AID]] con Apple.
- Compartir **Correlation ID / Token Reference ID** para diagnóstico.
- **Débito en Apple Pay** — HTTP 400 / responseCode 911 reportado en el SteerCo del 30/jul; la weekly del 7/ago no retomó el tema explícitamente. **Confirmar si sigue abierto.**

## Cómo llegó Click to Pay a producción (ago–sep/2026)

El 7/ago el bloqueo era el HTTP 503 y las colisiones de [[CAR ID]] en el [[Register Consumer]]. Esos dos temas no vuelven a aparecer. A fines de agosto, los certificados, el OAuth y el login del SDK de [[Thales]] ya funcionaban, y el error cambió de naturaleza: la respuesta pasó a venir **de Visa**, diciendo que el emisor/llamador no estaba habilitado para ese dato (texto exacto no confiable en la transcripción).

La causa recién quedó clara el ~4/sep: **faltaba configurar, en el ambiente de prueba de Visa, la relación entre el identificador de [[Thales]] (agregador certificado) y el [[BID|Business ID]] del banco.** La habilitación que Visa había hecho en producción para el [[Enrolamento massivo|enrolamiento masivo]] de la fase 1 **no se replica en el ambiente de prueba**. Para tenerla, hace falta un pedido formal de configuración — hasta 10 días hábiles a partir del caso, y con costo.

Con el plazo del 30/sep a la vista, el banco tomó el atajo: **promover la fase 2 directo a producción en modo controlado** — iOS vía [[TestFlight]], Android vía grupo de prueba en Google Play, solo para el equipo de desarrollo. Visa confirmó que, con la prueba en producción, la fase 2 podía indicarse como productiva y el hito ante Rules quedaba cumplido. El deploy estaba previsto para la semana siguiente; la entrada en producción registrada es el **25/sep** (el intervalo no se explica en las transcripciones).

> [!tip] Lo que vale la pena reutilizar
> Para la fase 2 de [[Click to Pay]] con agregador, **pedir la configuración del ambiente de prueba al inicio del proyecto**. Corrientes fue de los pioneros en la fase 2 y el primer emisor en salir con esto en Argentina; otros emisores con [[Thales]] tendrán la misma necesidad. Y cuando el plazo aprieta, la producción controlada cuenta para el mandato.

Dos detalles de producto registrados en el camino: en producción la habilitación de [[Click to Pay]] es **por producto (crédito/débito), no por [[BIN]]**; en el sandbox solo se configuran los BINs de prueba pedidos por formulario, como máximo cinco. Y [[Prisma]] había dejado desde julio una base consolidada de Consumer IDs y Card IDs registrados en producción, que el banco tenía que cargar en sus propias tablas antes del go-live para no intentar registrar de nuevo (carga no confirmada explícitamente).

## Los dos cobros: US$ 5.000 y US$ 350

**US$ 5.000 — penalidad de Rules.** La historia, contada por Producto el 27/ago: carta de no conformidad enviada en diciembre/2025; plan del banco aprobado el 20/ene con fase 2 hasta el 30/abr; alrededor del 1/may el banco pide extensión al 30/oct; Producto solo aprueba planes hasta el fin del año fiscal, y el plan se vuelve a aprobar en junio con 30/sep; el cobro aparece en la factura de julio. La tabla es escalonada (5.000, 10.000, 15.000…) — cada cambio de fecha sube un escalón.

El banco objetó porque había contratado la consultoría de Visa. La posición interna fue firme: el entregable de VCA es **acompañamiento, no ejecución**; el contrato de PMO no compromete a Visa con una fecha de entrega; el cliente sabía de la penalidad desde abril. **VIS no cubre la multa.** Comercial quiso evitar el cobro por la renovación del contrato de incentivos; Rules respondió por e-mail que no se puede reembolsar; quedó en pedirse la condonación. **Ninguna fuente registra el desenlace.** Lo que se sabe es que el [[Mandato|mandato]] se cumplió — no hay indicio de un segundo escalón (deducción).

**US$ 350 — el sandbox.** Al analizar el caso abierto en el Support Hub, soporte respondió que tendría que crear/configurar un sandbox, con un costo de US$ 350 para el banco. Llegando justo después de una conversación "áspera" sobre los US$ 5.000, el equipo consideró que el problema no era el monto, era la fricción. Consenso de no cobrar; nadie sabía el procedimiento para bonificar. El 3/sep se decidió **no cobrar esta vez**, sin definir qué pasa si el caso se repite. Como el banco fue directo a producción, el pedido de configuración quedó en espera. Sin registro de cobro efectivo.

> [!warning] Lección
> La penalidad de Rules y el contrato de acompañamiento son cosas independientes — pero el cliente no lo ve así. Decir en la propuesta y en el kickoff que la consultoría **no exime de penalidades ni cubre el soporte de otros equipos**, y avisar de los costos extra (ambiente de prueba) al comienzo.

## El cierre del programa (30/sep/2026)

Edgar "Javier" Cadena condujo el steering de cierre con Verónica y Laila (en nombre de Martín) por el banco y Patricia por [[Thales]]. Mensaje central: el programa cumplió el objetivo de ejecutar [[Click to Pay]] y Apple Pay en paralelo.

- **[[Click to Pay]]** pasa a operación normal.
- **Apple Pay** sale del programa "con ruta de certificación confirmada": push provisioning probado en los flujos [[Fluxo amarelo (85)|amarillo]] y [[Fluxo verde (00)|verdes]], [[Wallet Extensions|wallet extension]] funcionando en pruebas aisladas, [[FIME]] agendada.
- **Regla de continuidad:** el programa y la gobernanza cierran; el workstream no. Un desvío que afecte a [[FIME]] se escala por el canal técnico existente, **sin reabrir la gobernanza**.
- **Remanentes, todos del banco:** estabilizar la app unificada y repetir las pruebas; completar datos y wireframes en el [[Partner Hub]]; coordinar tarjetas y datos para el laboratorio.
- [[Thales]] pidió el documento de evidencias de las pruebas en producción ("ATP de Thales"), prerrequisito de su handover interno a operaciones.

Modelo de cierre que quedó como referencia: resumen, valor entregado, remanentes con dueño y regla de continuidad.

## La continuidad de Apple Pay: versiones que no cierran

El acuerdo de acompañamiento terminaba el 30/sep y la certificación recién empezaba en octubre. El tema ya estaba en el radar interno desde fines de agosto (iniciar conversación de renovación; el 4/sep: exigiría adenda, cliente sin fondos, y "sin contrato, CS cobra por billing"), pero recién llegó al banco la **víspera**, el 29/sep.

| Fuente | Qué dice |
|---|---|
| Reunión con el banco, 29/sep | Opción 1: mantener el acuerdo un mes más, cobrado vía billing (descuento en la factura mensual). Opción 2: no continuar, sin cobro — reabrir después es más caro y burocrático |
| Weekly Tech, 29/sep (interna) | Opciones: renovar con VCA **o** seguir por billing de CS a **USD 3.000/mes**, mes a mes; FIME → producción → monitoreo llevaría unos dos meses o más |
| Seguimiento, ~2/oct | Bruno sigue por al menos un mes más **o** van "por billing". Banco: sin decisión formal, pero la dirección es billing, para mantener el apoyo de Franco; cita "los 3.000 dólares" |
| Weekly Tech, 5/oct (interna) | "Corrientes va por billing ahora" — cerrado para VCA |

Tampoco cierra la **fecha de fin del contrato**: Visa sostiene el 30/sep (extensión acordada por e-mail, fuera del contrato); el banco habló del día 14 y, en otra fuente, del 15/oct. Antes de eso, el ~28/sep, el cliente ya había señalado que el directorio no renovaría con VCA.

Lectura más reciente, que es la que manda: **Apple Pay siguió con CS por billing y el proyecto salió de la cartera VCA.** Lo que falta para darlo por verificado es la decisión formal del banco por e-mail, que no aparece en ninguna fuente.

> [!warning] Lección
> Discutir el fin del acuerdo **semanas antes**, no la víspera. Aquí la certificación empezó sin cobertura formal.

## Apple Pay en octubre — último estado conocido (7/oct/2026)

- **Lado Visa:** configuraciones y VRM concluidas desde fines de agosto; queda liberar la [[Whitelist|whitelist]] el día de la salida a producción.
- **[[Partner Hub]]:** el bloqueo de la firma de T&C quedó atrás — documentación firmada y validada por Apple, tres personas del banco con acceso, identificador de la app y wireframe informados. Las piezas de marketing están listas y esperan que se abra el paso del Hub. Confirmado que **Visa no tiene material de marketing de Apple**: todo sale del Hub.
- **[[FIME]]:** el banco decidió ir al laboratorio por cuenta propia. Juntó 12 tarjetas productivas (3 usuarios × 2 de débito + 2 de crédito). Precertificación de 5 días a partir del 5/oct; certificación oficial de dos semanas a fines de octubre.
- **Artes:** FIME pide un arte por rango de [[BIN]], pero el banco tiene varios artes en el mismo BIN por grupo de afinidad. Orientación provisoria: enviar los artes que aparecen en la tarjeta tokenizada y confirmar con FIME (respuesta no registrada).
- **App unificada** integrada recién el ~1/oct, días antes del laboratorio.
- **7/oct — bloqueo:** en una prueba productiva de push provisioning iniciado en la app del banco, la wallet se cierra al lanzar el pedido. [[Prisma]] no encuentra pedidos en el VRM para las tarjetas y el pedido tampoco le llega. El equipo de riesgos valida si hay reglas de VRM generando fricción. Bruno no tiene acceso para verificar el lado Visa y lo deriva a Franco. Sin causa ni solución registradas.

## Decisiones de sep–oct/2026
- La duda técnica de [[Click to Pay]] va por ticket en el Support Hub, incluso con proyecto abierto — abrir temprano e incluir el X-Correlation-ID.
- VIS no cubre la multa; los pedidos sobre la multa se centralizan en Bruno.
- No cobrar los US$ 350 esta vez.
- Producción controlada en lugar de esperar el ambiente de prueba.
- Cerrar el programa el 30/sep, manteniendo Apple Pay en seguimiento técnico.
- Corrientes sale de la cartera VCA; Apple Pay sigue por billing de CS.

## Abierto / a confirmar (16/11/2026)
- Todo sobre Apple Pay después del 7/oct: causa del error, resultado de la precertificación, fecha y resultado de la certificación oficial (el 25/oct dicho en el steering es domingo; el registro anterior tenía 26/oct–6/nov), go-live.
- Decisión formal del banco sobre la continuidad y el monto (USD 3.000/mes viene de fuente interna; el 4/sep aparece "3.500 dólares").
- Fecha real de fin del contrato (30/sep × 14 o 15/oct).
- Desenlace de los US$ 5.000 con Rules y de los US$ 350.
- Respuesta formal de Visa al cierre del mandato en Visa Access.
- Entrega del ATP de Thales.
- Fecha exacta de la weekly de la decisión de producción controlada (~4/sep o 11/sep).
- Filiación de Patricia (tratada como [[Thales]] por dichos propios) y grafía de Laila.

---
[[Home]]
