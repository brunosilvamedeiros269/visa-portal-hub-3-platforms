---
tags: ["proyecto", "cliente/BROU"]
fuente: Reportes y minutas — BROU; transcripciones automáticas de ago–nov/2026 (no validadas)
estado: parcial
title: "BROU — dossier"
---

# 🇺🇾 BROU — Banco de la República (Uruguay)

> [!info] Dossier de proyecto (contexto cualitativo)
> El seguimiento **vivo** (tracks, tareas, estado) está en la app. Aquí queda el contexto, la historia y las decisiones. Los conceptos citados enlazan a [[Home|el conocimiento general]].

## Ficha
- **Cliente:** Banco de la República Oriental del Uruguay (BROU) — banco público.
- **País:** Uruguay. **PM Visa (líder):** Jenny (Lina / Bruno).
- **Engagement:** PMs por ~6 meses, desde el **14/abr/2026** ("hasta donde lleguen"). Track de tokenización iniciado el **21/abr/2026**; el contrato VCA vence el **21/sep/2026**.
- **[[Processador|Procesador]]:** [[Sistarbank]] — **PCR 1913**. **Habilitador [[Click to Pay]] / [[ITSP]]:** [[HST - HCT|HST]] / HCT.
- **Ruta crítica (débito):** [[Tokenização|Tokenización]] → billeteras y [[Click to Pay]] de débito.
- **Modelo comercial:** **sin VIK / sin incentivos** — el banco pagó con recursos propios, con descuento negociado. Alcance vendido en **6 meses** cuando el equipo estimaba **9**.

**Contactos —** Banco: Jimena ("Jime", coordinación técnica/funcional), Alfredo (switch/integración), Eduardo (canales digitales), Gonzalo (simulador/BTS), Pablo, Luis, Rosa, Ariel; **UPLA** (Unidad de Prevención de Lavado de Activos) define la postura de [[OCT - AFT|OCT/AFT]]. Visa: Jenny, Lina Torres, Bruno Medeiros, **Emiliano ("Emi", [[CSM (Customer Success Manager)|CSM]])**, Melina Albornoz (stakeholder técnica), **Fernando** (Implementation Manager de la tokenización), Juliana (ingeniera de pruebas), Klaus (mandatos OCT/AFT), Mauro (Producto — ANI y OCT/AFT), Alexis (Producto — [[Click to Pay]]), Joyce (soporte técnico Google Pay), Vanessa, Soledad Rua. [[Sistarbank]]: Ivana, Juan Pablo, Adiel (Smart Vista). HCT: Carlos, José, Juan Pablo.

## Estado actual (base: Weekly Tech interna del 16/nov/2026)
> [!warning] Actualización a partir de transcripciones automáticas — no validada
> Todo lo que viene de sep–nov/2026 salió de relatos **internos** de Visa (Weekly Tech, 1:1). No hay transcripción de reunión con el banco después del 19/ago. Los ítems marcados *(a confirmar)* no deben llevarse al cliente sin verificación.

**El programa atravesó la renovación y cambió de cuello de botella otra vez.** El contrato VCA fue **renovado y firmado antes del 19/oct**; cinco tracks volvieron a *implementing*. El punto de atención ahora es **Apple Pay, en warning**: el banco perdió las fechas de laboratorio [[FIME]] y el lanzamiento que quería para el **1/dic no ocurre**. El [[Click to Pay]] sigue en [[Enrolamento massivo|enrolamiento masivo]]; Google Pay tiene el BIN de débito configurado; Garmin se dio por concluido. Los dos mandatos siguen sin ejecución: [[OCT - AFT|OCT/AFT]] fue retirado de la pipeline (recuperable) y el [[ANI]] no tiene proyecto abierto en CS.

| Frente | Situación al 16/nov |
|---|---|
| [[Tokenização|Tokenización]] — COF / e-Commerce | El 19/ago: configuración productiva para el 27/ago y go-live estimado para el 3/sep. **El resultado no consta**; las billeteras pasaron a tratarse como destrabadas *(deducción — a confirmar)* |
| [[Click to Pay]] | Proyecto abierto en CS; fase 1 configurada; en enrolamiento masivo. Proveedor propio, sin SDK Visa. Situación del [[Waiver|waiver]] del 30/sep no dicha |
| Google Pay | En curso; BIN de débito configurado el "día 22" *(~22/oct, a confirmar)* |
| Apple Pay | Proyecto abierto en CS (antes del 10/nov). **Warning** — fechas FIME perdidas; el 1/dic no ocurre |
| Garmin Pay | *Completed* (2/nov) — descrito como inclusión de BIN |
| Mandato [[OCT - AFT|OCT/AFT]] | *Withdrawn* en la pipeline — puede volver |
| Mandato [[ANI]] | En implementing en la pipeline VCA, sin proyecto en CS; duda sobre quién lo abre |

## Estado actual (base: seguimiento de tokenización, 12/ago/2026)
> [!note] Registro del 12/ago, mantenido como historial — el estado vigente es el bloque de arriba.
**La tokenización dejó de ser el bloqueo.** La certificación de host se completó el **11/ago** con la carta obtenida, y el ticket de configuración productiva se creó el **12/ago**. El hito que destraba las billeteras es el **BIN productivo (~31/ago)** — no el fin del proyecto. A partir de ahí el cuello de botella del programa pasa a ser **contractual**: el contrato VCA vence el **21/sep** y la decisión de extensión, pedida por el banco en el SteerCo del 29/jul, sigue abierta.

## Frentes / tracks
| Frente | Situación |
|---|---|
| [[Tokenização|Tokenización]] — COF / e-Commerce ([[VTS (Visa Token Service)|VTS]]) | **Certificado.** Carta obtenida el 11/ago. Configuración productiva en curso (10 días hábiles) |
| [[Click to Pay]] | En curso. [[Waiver]] hasta el **30/sep**; meta de subida masiva **1/oct**. Base de datos sucia; **multas ya corriendo** |
| Google Pay | Avance parcial. Crédito + prepago en pruebas de [[Push - In-App Provisioning (fluxo verde)|push provisioning]]; débito trabado. Nuevo prerrequisito [[UPP (Unified Push Provisioning)|UPP]] |
| Apple Pay | Sin iniciar. Checklist aprobado por Emiliano **excepto la "API de novedades"** |
| Garmin Pay | Sin iniciar — declarado el track de **menor prioridad** en el SteerCo |
| Mandato [[OCT - AFT|OCT/AFT]] | Espera del banco — falta la postura normativa de la **UPLA**. Waiver formal **vencido en junio** |
| Mandato [[ANI]] | Espera del proveedor — la "fábrica" no lo priorizó. La extensión vence el **31/ago** |
| Billetera propia del BROU | **Fuera de alcance** — tiene Token Requestor ID propio |

## Historial (línea de tiempo)
- **21/abr/2026** — Inicio del track de [[Tokenização|Tokenización]].
- **8/jun/2026** — Confirmado que las validaciones de [[ANI]] del lado Visa **no tendrían costo**.
- **~21/jul/2026** — Sesión técnica de [[Click to Pay]] con Producto (Alexis) + [[Sistarbank]]: el [[Destination Site]] se desactivará por región; confirmado el diseño del [[Enrolamento massivo|enrolamiento masivo]].
- **22/jul/2026** — Seguimiento de certificación de APIs: depuración del caso **13.2**; confirmado que en el **campo 2 va el [[DPAN]] / token number**.
- **24/jul/2026** — Revisión interna del deck del SteerCo. Nace la propuesta de reemplazar el cronograma por un **mapa de dependencias**.
- **29/jul/2026** — **1.er SteerCo** (presencial, Montevideo) — ver sección abajo.
- **29/jul/2026** — Weekly de certificación: proyecto en 56%; ningún token disponible a días de la certificación.
- **~5/ago/2026** — **[[Scoping call]]** de certificación: alcance cerrado, caso 13.2 marcado como **no aplicable**, ventanas agendadas.
- **6/ago/2026** — Seguimiento: compromiso de enviar el **[[DEF (Digital Enrollment Form)|DEF]]** y el Processor Digital Activation Request de producción ya el 7/ago, ganando ~1 semana.
- **11/ago/2026** — ✅ **Certificación de host concluida** en dos ventanas de 1 h (09h30 y 17h30 Uruguay). **Carta obtenida.**
- **12/ago/2026** — Ticket de configuración productiva creado. Replanificación hasta el cierre.
- **~31/ago/2026** — **BIN productivo** — hito de desbloqueo de las billeteras.
- **1/sep/2026** — Inicio del **[[Friends and Family]]** (5 días).
- **1.ª semana de sep/2026** — Remoción de la [[Whitelist|whitelist]] = **go-live**; apertura tentativa de los proyectos de billeteras.
- **15/sep/2026** — Cierre del proyecto de tokenización.
- **21/sep/2026** — Fin del contrato VCA actual.
- **30/sep/2026** — Vence el [[Waiver|waiver]] de [[Click to Pay]].
- **25/nov/2026** — Última ventana de instalación antes del **freeze** del banco (hasta enero).

**Agregado — ago a nov/2026 (transcripciones; las fechas de planificación de arriba pueden haber cambiado):**
- **19/ago/2026** — Seguimiento [[VTS (Visa Token Service)|VTS]] COF + e-Commerce: configuración productiva agendada para el **27/ago**, piloto [[Friends and Family]] de 5 días dentro de la [[Whitelist|whitelist]] y go-live formal estimado para el **3/sep**. Proyecto adelantado ("ganamos unos días"). *Reemplaza la previsión de BIN productivo ~31/ago de la replanificación del 12/ago.*
- **4/sep/2026** — 1.ª Pipeline Review VCA × CS: todos los tracks dependen de la tokenización; CS solo tiene abierto COF / e-Commerce; riesgo de penalidades por mandatos.
- **8/sep/2026** — Reunión sobre renovar el contrato por 6 meses más *(el resultado no consta)*. El vencimiento pasa a citarse como **14/oct** — difiere del 21/sep registrado arriba.
- **~29/sep/2026** — Con el contrato por vencer, CS pide pasar todos los tracks a *prospecting* hasta que haya fondos; Garmin (inclusión de BIN) sale de la vista de CS. Legal trabaja la cláusula de continuidad.
- **5/oct/2026** — Fondos confirmados; propuesta enviada al banco. CS **rechaza abrir el proyecto de Apple Pay**: contrato con ~3 semanas de vigencia.
- **13/oct/2026** — Renovación pendiente del OK del BD y de la parte contractual.
- **19/oct/2026** — ✅ **Contrato renovado/firmado.** 5 tracks en implementing; OCT/AFT *withdrawn*; ANI sin track en CS.
- **22/oct/2026** — En el BiWeekly del equipo, el roadmap digital del BROU se cita como caso a difundir: acompaña 3 mandatos y alivia a CS.
- **2/nov/2026** — Google Pay con BIN de débito configurado; Garmin *completed*; Click to Pay con fase 1 configurada, en pruebas de carga masiva.
- **10–11/nov/2026** — Apple Pay con proyecto abierto; Bruno cubre a Jenny en el seguimiento del 11/nov.
- **16/nov/2026** — **Apple Pay en warning**: fechas FIME perdidas, el 1/dic no ocurre. Click to Pay en enrolamiento masivo.

## 1.er SteerCo (29/jul/2026)
Primer Steering Committee del programa, presencial en la sede del banco. La gobernanza prevista — SteerCo mensual — nunca había ocurrido; esta fue la sesión de inauguración.

**Semáforo presentado:** [[Tokenização|Tokenización]] 🟢 (en curso, con cadencia, cierre estimado 28/ago) · Google Pay en avance · **Apple Pay 🔴** · **Garmin 🔴** (menor prioridad) · [[Click to Pay]] en curso · [[ANI]] y [[OCT - AFT|OCT/AFT]] en espera.

Lectura ejecutiva declarada: *"Estamos mal que bien, estamos avanzando en todos los frentes menos en Garmin. Apple va un poquito más lento… varias de las billeteras todavía están dependientes de este primer proyecto que va en curso."*

**Decisión pedida por el banco — extensión del contrato.** Quedan ~2 meses de 6 y el disparador de las billeteras recién ocurre a fines de agosto. El BROU pidió explícitamente la posibilidad de extender. Visa quedó en dimensionar **capacity, continuidad de la PM y precio** para escenarios de **1, 2 o 3 meses**, con visibilidad **hasta mediados de agosto** y decisión en el **SteerCo de agosto**. Escenario alternativo planteado: **sacar el mandato [[ANI]] del alcance VCA** y concentrar recursos en las billeteras.

**Feedback del banco sobre el servicio (favorable):** el modelo de PM dedicada fue considerado fundamental — ordenó prioridades, centralizó la apertura de los proyectos individuales y suple la limitación de capacidad del CSM (*"Emi es muy bueno, pero Emi está asignado a un montón"*). Es la primera vez que el BROU contrata este tipo de consultoría de Visa.

## Certificación de tokenización (ago/2026)
El ciclo que destrabó el programa, y que sirve como referencia para otros emisores — ver [[Troubleshooting — certificação de tokenização (provas e janelas)|Troubleshooting — certificación de tokenización (pruebas y ventanas)]].

- **Scoping call:** alcance cerrado en **solo casos de token** — retail, [[OCT - AFT|AFT y OCT]] afuera. El **caso 13.2 (Dynamic CVV)**, única prueba que el banco no había logrado ejecutar, fue marcado como **no aplicable** y cerrado sin ejecución.
- **Ventanas:** no había slot de 2 h antes del 17–18/ago, así que la ventana estándar se **partió en dos de 1 h el mismo día (11/ago)**, adelantando el cronograma. La cancelación tardía se cobra igual.
- **Preparación:** estación **11.7653** verificada por *ecotest*; tarjeta de aprovisionamiento compartida antes, para que el certificador ya preparara los tokens. Con tokens preaprovisionados, HCT y [[Sistarbank]] no necesitaron estar presentes.
- **Resultado:** certificación concluida el 11/ago, **carta obtenida**.

## Camino hasta producción (replanificado el 12/ago)
`Carta de certificación` → `ticket de configuración productiva (10 días hábiles)` → **`BIN productivo ~31/ago`** → `[[Friends and Family]] 1/sep (5 días)` → `remover whitelist = go-live` → `Post Launch Tracking` → `fin del proyecto 15/sep`.

> [!important] El hito que destraba las billeteras
> Consultado sobre qué entregable libera la apertura de los proyectos de billeteras, el Implementation Manager fue explícito: *"tan pronto el BIN esté productivo, o sea las configuraciones estén productivas, ya podrían iniciar el proyecto"*. **No hace falta esperar al 15/sep** — la apertura de las billeteras quedó marcada como tentativa para **principios de septiembre**.

## Decisiones y puntos importantes
- **Ruta crítica:** reforzar todas las semanas la secuencia tokenización → billeteras / [[Click to Pay]] de débito.
- **[[Click to Pay]]:** waiver hasta el **30/sep** (crédito, prepago y débito); meta de subida masiva **1/oct**.
- **[[External Consumer ID]]:** BROU tiene **4 códigos emisores** → hasta 4 perfiles por cliente. El impacto relevado es de **performance** (múltiples invocaciones de API), no de experiencia — pero el diseño sigue pendiente de validación con el equipo regional.
- **[[Enrolamento massivo|Enrolamiento masivo]] — diseño confirmado:** archivo del banco → [[Sistarbank]] → API masiva de HCT → API masiva de Visa.
- **[[Destination Site]]:** se desactivará región por región. Donde el emisor hace el enrolamiento masivo, **lo que él envió prevalece** y el sitio queda en solo lectura.
- **Las reglas de riesgo son decisión del emisor.** Visa envía los casos de uso sugeridos para token e-Commerce/COF (incluida la whitelist); el banco los compara con lo que ya tiene de crédito y prepago.
- **Billetera propia fuera de alcance** — tiene Token Requestor ID específico, no es Card-on-File. Exige un proyecto de implementación adicional o un requerimiento por BAU con el gerente de cuenta.
- **[[OCT - AFT|AFT]] no tiene correlación con la tokenización** (confirmado por Klaus) — al contrario de lo que sugería el orden inicial.
- **Expectativa realista:** el conjunto no sale en menos de 9 meses; con 6 de engagement, no se llega a todo sin extensión.

## Pendientes y riesgos

**Programa**
- **Decisión de extensión del contrato VCA** — pedida el 29/jul, con visibilidad prometida para mediados de agosto. **Está vencida.** Sin ella, el BIN queda productivo el ~31/ago y el contrato termina el 21/sep: ~3 semanas, no entra ninguna billetera de débito.

**[[Tokenização|Tokenización]]**
- Confirmar la **fecha efectiva** de las configuraciones productivas (la del 31/ago es preliminar, sale de la revisión del ingeniero de configuraciones).
- **Llaves públicas asociadas a las API Keys** cargadas en BDP/[[VDP (Visa Developer Platform)|VDP]] para producción — HCT o [[Sistarbank]].
- Completar la **whitelist del piloto** en el VRM (era para el 12–13/ago).
- Comparar los **casos de uso sugeridos de VRM** con las reglas ya existentes y decidir los ajustes de débito antes del [[Friends and Family|F&F]].

**[[Click to Pay]]**
- **Base de datos del enrolamiento masivo** — cuello de botella antiguo; falta definir el **porcentaje de credenciales** que sube. Problema estructural: e-mails históricos sucios y **celulares/e-mails compartidos entre clientes** (caso citado de un contacto usado por 400+ clientes). Aceptación parcial en discusión (subir un porcentaje demostrable en lugar del 100%).
- **Gap en HCT:** no existe contraparte del método *Click to Pay Enrollment Attempt Notification* — ni en el Swagger ni en el SDK. Puede convertirse en un requisito de desarrollo no previsto.
- Validar el formato de **[[External Consumer ID]]** con el equipo regional.
- Formulario de **opt-out en el home banking** + comunicación a los clientes **30 días antes**.

**Billeteras**
- **Apple Pay: "API de novedades"** exigida por Apple, con un problema interno del banco — riesgo de **+1 mes**.
- **Google Pay:** respuesta de Google sobre los aprovisionamientos fallidos (no aparecen ni en [[Sistarbank]] ni en las herramientas Visa); después agendar la sesión con el equipo técnico. Atención: la primera sesión de 30 min es gratuita, las siguientes se cobran — llegar con preguntas cerradas.
- **[[UPP (Unified Push Provisioning)|UPP]]:** falta el material técnico escrito de HCT. **Conflicto de calendario:** Google lo exige hasta **dic/2026**, pero el **freeze del banco va del 25/nov a enero** → el plazo real es fines de noviembre.

**Mandatos**
- **[[OCT - AFT|OCT/AFT]]:** postura normativa de la UPLA; el **waiver formalizado venció en junio** y no hay registro de validez hasta octubre → exposición a carta de penalización. Acordado en el SteerCo preparar una **nota preventiva** al área de reglas de Visa antes de recibir la carta.
- **[[ANI]]:** priorización trabada en la "fábrica" del proveedor; la **extensión vence el 31/ago**.

**Cerrado desde el último dossier**
- ~~Certificación de tokenización~~ — **concluida el 11/ago, carta obtenida**.
- ~~Caso 13.2~~ — marcado como **no aplicable** (Dynamic CVV, que el BROU no usa); cerrado sin ejecución.
- ~~DEF y Processor Digital Activation Request de producción~~ — entregados.
- ~~Pruebas desatendidas~~ — finalizadas.
- ~~Error de CVV en las pruebas de API~~ — causa identificada: las tarjetas de prueba se habían generado con **llaves de producción** en lugar de las de prueba.
- ~~Duda del campo 2 en el caso 13.2~~ — confirmado por Global Client Testing que va el **[[DPAN]]**.
- ~~Aprobación de Google para [[UPP (Unified Push Provisioning)|UPP]]~~ — obtenida.
- ~~1.er SteerCo pendiente~~ — realizado el 29/jul.
- ~~Fases del enrolamiento masivo en [[Sistarbank]]~~ — confirmado que lo soporta, con layout entregado.

## Go-live de la tokenización: lo que quedó acordado el 19/ago
Última reunión con el banco de la que hay registro. Lo que se acordó explica cómo la tokenización debería haber salido de escena:

- **Configuración productiva con fin el 27/ago** — fecha "preliminar" en el sistema; los cambios productivos en Visa entran entre las 5h y las 7h de Miami. *"Del lado Visa, el día 27 ya estarían en producción."*
- **[[Whitelist]] en el BRM antes del 27/ago.** El banco ya tenía la lista armada; faltaba saber a qué regla asociarla para e-Commerce y Card on File.
- **Visa dejó de enviar reglas sugeridas.** El Implementation Manager no entra al BRM del emisor (las reglas son propias y confidenciales) y relató una orientación reciente de evitar el envío de sugerencias: el banco manda la captura de la whitelist y de las reglas previstas, y Visa valida con el equipo de BRM. *Esto corrige la decisión registrada arriba ("Visa envía los casos de uso sugeridos").*
- **Mismos certificados**; se pidió el Key ID productivo para doble chequeo. API Key y Shared Secret quedan en el [[VDP (Visa Developer Platform)|VDP]] después de la configuración productiva.
- **Acceso de Carlos ([[HST - HCT|HCT]]) al VDP fallando** — invitación reenviada por el banco y caso abierto por Visa.
- **Secuencia:** configuración productiva → API Key → piloto [[Friends and Family|F&F]] de 5 días → remoción de la whitelist = **go-live formal (3/sep)**.

> [!question] Vacío
> No hay registro de que el 27/ago y el 3/sep se hayan cumplido. La evidencia es indirecta: en octubre–noviembre las billeteras y el Click to Pay aparecen con proyecto abierto y BIN de débito configurado.

## La renovación del contrato (sep–oct/2026)
La decisión de extensión pedida por el banco en el SteerCo del 29/jul recién se resolvió en octubre, y el intervalo tuvo costo.

**Qué pasó.** El contrato de ~6 meses llegó a su fin con la tokenización recién entregada y seis tracks dependientes de ella. El 8/sep se discutía renovar por 6 meses más; la extensión quedó con Jenny y Desi (pricing), y Bruno salió del alcance comercial del BROU. A fines de septiembre, sin fondos definidos, el equipo de [[CS Implementations|CS]] pidió reclasificar todos los tracks como *prospecting*. El 5/oct los fondos fueron confirmados y la propuesta siguió al banco; el mismo día CS **se negó a abrir el proyecto de Apple Pay** porque el contrato tenía ~3 semanas de vigencia. La firma salió antes del 19/oct.

**Por qué importa.**
- La regla de CS quedó explícita: abrir un proyecto exige prerrequisitos completos, fecha comprometida por el emisor **y contrato VCA con vigencia suficiente**.
- Sin renovación, la alternativa es que CS cobre por *billing* mes a mes, con un servicio más limitado. Legal empezó a trabajar una cláusula para que el cliente autorice esa continuidad; en contratos vigentes vale la autorización por e-mail.
- El efecto práctico fue cerca de un mes en el que no se pudo abrir ninguna billetera, justo después de que la tokenización destrabara el programa.

> [!warning] Divergencia de fechas
> El vencimiento del contrato original aparece como **21/sep** en este dossier (fuente: minutas hasta agosto) y como **14/oct** en las reuniones internas de sep–oct. La duración y el fin del contrato renovado no se dijeron.

## Apple Pay: del "sin iniciar" al warning
En julio Apple Pay era rojo por no haber empezado. La secuencia desde entonces:

1. **Agosto** — checklist aprobado por el [[CSM (Customer Success Manager)|CSM]], excepto la "API de novedades".
2. **5/oct** — CS se niega a abrir el proyecto (vigencia de contrato).
3. **Entre el 19/oct y el 10/nov** — proyecto abierto en CS después de la renovación.
4. **10/nov** — el Implementation Manager está de vacaciones; Franco cubre y le debe al banco: confirmar el fin de la configuración, compartir llaves oídas como "WSD" *(grafía a confirmar)* y responder dudas de funcionalidades Apple enviadas por Jimena.
5. **16/nov** — **warning**: el banco perdió las fechas de laboratorio [[FIME]]. Quería lanzar el 1/dic; no ocurrirá. Faltan nuevas fechas y desarrollos del banco para la certificación.

FIME es el único laboratorio aceptado por Apple, y la reserva es del emisor: perdida la ventana, se pide otra. *(El motivo de la pérdida y las fechas originales no constan.)* Conviene cruzarlo con el freeze del banco (25/nov a enero, registrado arriba): si sigue vigente, un lanzamiento después del 1/dic tiende a caer en 2027 *(deducción — a confirmar)*.

## Click to Pay, Google Pay, Garmin y mandatos — qué cambió
- **[[Click to Pay]].** Proyecto abierto en CS con la fase 1 configurada; el 2/nov estaba en pruebas de carga masiva y el 16/nov "en enrolamiento masivo". Se implementa con proveedor propio, sin SDK Visa. Lo que no se sabe: si el [[Waiver|waiver]] del 30/sep fue prorrogado, si hubo multa y qué porcentaje de la base sube.
- **Google Pay.** BIN de débito configurado. Quedó anotado que el banco debe subir información a Google "para evitar flujo verde" — redacción del extracto, sentido a confirmar.
- **Garmin Pay.** De track de menor prioridad a *completed* el 2/nov. En septiembre fue descrito como inclusión de BIN y salió de la vista de CS.
- **[[Mandato]] [[OCT - AFT|OCT/AFT]].** Pasó a *withdrawn* en la pipeline el 19/oct, recuperable.
- **[[Mandato]] [[ANI]].** Sigue en implementing en la pipeline VCA, pero sin proyecto abierto en CS; el 2/nov no estaba claro quién debía abrirlo.
- **Featurespace.** Aparece como prospect separado, en espera mientras el banco implementa otra solución oída como "VCAS" *(sigla a confirmar)*.

## Decisiones y aprendizajes de ago–nov/2026
- **Renovar en lugar de operar por billing de CS** — fue lo que devolvió los tracks a implementing.
- **Sacar OCT/AFT de la pipeline activa** en lugar de mantenerlo detenido como track abierto.
- **Empezar la renovación meses antes del vencimiento**: un contrato corto con implementación en curso bloquea la apertura de proyectos nuevos en CS.
- **Tratar la reserva de laboratorio FIME como hito del plan**, con dueño en el banco y margen para el freeze de fin de año.
- **Los accesos de terceros al VDP** entran en el checklist previo a la ventana de producción.
- El modelo de roadmap digital con mandatos y billeteras en el mismo programa fue reconocido internamente como caso a difundir a BDs y CS.

## Vacíos de esta actualización
- Confirmación del go-live de la tokenización (27/ago y 3/sep).
- Cuáles son los "5 tracks en implementing" y la fecha de fin del contrato renovado.
- Origen de los fondos de la renovación: "habrá fondos" (5/oct) × "sin VIK / sin incentivos" (ficha arriba).
- Waiver y multas de Click to Pay; extensión del ANI (vencía el 31/ago).
- Contenido del seguimiento de Apple Pay del 11/nov y nuevas fechas FIME.
- El 3/sep Bruno citó internamente un "SDK" como primer track y "tal vez Thales" como tercero — no coincide con los demás registros (tokenización vía HCT); probable imprecisión del relato.

---
[[Home]]
