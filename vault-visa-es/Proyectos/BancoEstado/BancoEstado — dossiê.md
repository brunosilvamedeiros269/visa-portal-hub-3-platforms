---
tags: ["proyecto", "cliente/BancoEstado"]
fuente: Sesiones de presentación del proceso — BancoEstado (ago/2026); transcripciones automáticas de reuniones sep–nov/2026 (no validadas)
estado: parcial
title: "BancoEstado — dossier"
---

# 🇨🇱 BancoEstado (Chile) — Apple Pay + SDK Visa

> [!success] Confirmado por Bruno el 16/11/2026
> El **kickoff de Implementations (proyecto técnico) es el 25/11/2026**.


> [!info] Dossier de proyecto (contexto cualitativo)
> Proyecto **aún no abierto**. Aquí queda el registro de las dos sesiones de presentación del proceso, antes de la apertura formal.

> [!important] Actualización del 16/11/2026
> El texto hasta la línea de separación más abajo es el registro de **agosto/2026** y se mantuvo tal como estaba. Lo que ocurrió de septiembre a noviembre — contrato, kickoff, los tres prerrequisitos que frenaron la apertura y el estado actual — está en **«Actualización sep–nov/2026»**, al final de esta nota. Donde los dos textos difieren, vale el bloque nuevo.

> [!note] Estado de esta nota
> Las dos transcripciones disponibles **no traen fecha absoluta** — solo se sabe que son de días consecutivos, con la segunda a las 16:00. Fechar antes de usar como referencia histórica.

## Ficha
- **Cliente:** BancoEstado. **País:** Chile.
- **Producto:** **Apple Pay** con integración del **SDK de Visa** en la app del banco. El SDK es **prerrequisito** de Apple Pay.
- **Etapa:** **preproyecto** — *"es que no hay proyecto… todavía estamos en los temas contractuales"*. Sin proyecto abierto no hay PM técnico designado.
- **Proveedor del banco:** **Veritran** — ya certificada como [[TSP (Token Service Provider)|TSP]], pero falta el registro como **[[Third Party Agent|agente tercero]]**.

**Contactos —** Visa: **Soledad Rúa** (directora de Implementaciones Conosur), **Jenny Johansen** (PM funcional), **Bruno Da Silva** (PM funcional), **Lorena Retamales** ([[CSM (Customer Success Manager)|CSM]] dedicada), Gerardo (contratos/Digital Enablement), "Pancho"/Francisco (técnico). BancoEstado: Ángela (coordinación del proyecto, con Rodrigo Miranda y Cynthia), Oscar (jefatura de tecnología), **Felipe Muñoz** (líder técnico), Claudio y Claudia (producto), Marcelo, Humberto (autorizaciones), Jorge Núñez (revisión contractual).

## Estado actual
> [!warning] Superado — ver «Estado al 16/11/2026» al final de la nota
> Este cuadro retrata agosto. El contrato de acompañamiento se firmó en la primera semana de septiembre; el contrato con **Apple**, dado aquí como firmado, recién aparece firmado y cargado en el [[Partner Hub]] en la weekly del 14/10 (en septiembre todavía era uno de los tres prerrequisitos abiertos).

Trabado en lo **contractual**. Hay tres contratos en juego y el tercero es el que impide la apertura:

| Contrato | Situación |
|---|---|
| Con **Apple** | ✅ **Firmado** — adjuntar al caso en la apertura |
| **SDK de Visa** | En firma, "dentro de estos días" |
| **Servicio de acompañamiento / consultoría Visa** | ⚠️ **No contratado** — es este el que traba la apertura y la designación del PM |

**Desbloqueo decidido:** Visa **libera el SDK antes de la firma**, vía [[VDP (Visa Developer Platform)|VDP]], apenas el banco envíe nombre + e-mail de los usuarios — para no trabar el avance técnico.

## El conflicto central: plazo
| | |
|---|---|
| **Meta interna del banco** | **Producción idealmente en diciembre** |
| **Plan del banco** | 3 semanas de prerrequisitos + **18 semanas** de configuración/desarrollo (4 del banco + 14 atribuidas a Visa) |
| **Lectura de Visa** | 3 semanas de prerrequisitos es poco; el cronograma del banco se lee como **~8 meses** |
| **Benchmark declarado** | *"No tenemos un caso en la región, incluyendo Chile, Argentina, Uruguay, que se haya hecho en menos de seis meses."* |
| **Respuesta del banco** | *"No tiene por qué ser una limitante, porque podríamos ser el primero."* |

> [!warning] Malentendido de fondo que ya se corrigió en reunión
> El plan del banco atribuía **14 semanas a Visa**. **Visa no desarrolla.** Entrega bibliotecas/SDK, guía técnica, apoyo de consultoría, configuración del lado Visa y certificación — todo el desarrollo (front, back, wallet, portal, [[Wallet Extensions]], carga de certificados) es del banco. Conviene dejar esto por escrito antes de que el proyecto abra.

## Tiempos presentados al cliente
- Prerrequisitos: **3 a 4 semanas** si el cliente está casi listo; hay casos reales de **3, 4 y hasta 6 meses**.
- Solo la implementación de Apple: **4 a 6 meses**.
- Paquete SDK + Apple: **7 a 8 meses** hasta el go-live, con la **certificación (~1 a 1,5 mes) ya incluida**.
- Acompañamiento productivo post go-live: **~2 semanas**.

## Prerrequisitos
| Ítem | Situación |
|---|---|
| Caso vía **BCH en [[PRM (Visa Access)|Visa Access]]** + formulario + **[[SOW Token Service|SOW]]** | A completar con apoyo de la CSM |
| Contrato del SDK | En firma |
| Contrato con Apple | ✅ Firmado |
| Servicio de acompañamiento | ⚠️ No contratado |
| Enrolamiento en el [[VDP (Visa Developer Platform)|VDP]] | Pendiente. **Bloqueo:** el banco filtra links en e-mails externos; TI tiene que liberarlo |
| Terceros como [[Third Party Agent|agente tercero]] | Veritran es [[TSP (Token Service Provider)|TSP]] certificada; falta el registro como agente tercero |
| APIs de [[Tokenização|tokenización]] | Ya operan para Google Pay y billetera propia. **Ambigüedad abierta:** qué APIs son del core del banco, cuáles de Veritran y cuáles son las APIs Visa del TSP |
| [[BIN|BINs]] tokenizados | ✅ **Verificado — OK** |
| [[Tap to Add Card]] | Mandato al que el banco no adhirió antes |
| VRM | Ya lo usan; crear las reglas del proyecto antes de producción |
| [[Step-up]] adicional | Hoy **solo OTP SMS**. Apple exige más — probable **app-to-app** vía Veritran, con certificación ante Visa. **Esfuerzo no dimensionado** |

**Criterio de apertura:** los desarrollos **no necesitan estar listos, pero sí avanzados y con plazo dimensionado** — Visa no mantiene proyectos abiertos sin avance.

## Puntos técnicos registrados
- **[[Tap to Add Card]] no exige desarrollo de lectura** — quien lee la antena NFC es la Wallet. Para el banco, lo que cambia es recibir un **valor nuevo en un campo ya existente** de origen del aprovisionamiento. Hay que validarlo con el equipo de **autorizaciones** para no romper la mensajería.
- **El CVV no llega al emisor** en ese flujo — Visa valida con sus propias llaves. **Riesgo concreto:** *"algunos bancos erróneamente… lo desarrollaron de manera dura, que todo provisionamiento tenía que venir con CVV y si no venía lo declinaban"*.
- Los métodos de [[Step-up|step-up]] son desarrollo del banco, pero **certificados con Visa**.
- **13 requisitos funcionales de Apple** citados como lista de referencia.
- Documentación del SDK: **~500 páginas**, entregada pocos días antes.

## Gobernanza propuesta
Kick-off con stakeholders · **reunión semanal** de avance · espacios ad hoc (producto, CSM) · **SteerCo mensual o bimestral** · **~2 semanas de monitoreo productivo** post go-live. Las sesiones de consultoría ad hoc (ej.: reglas de VRM fuera del estándar) son **pagas**.

## Pendientes y riesgos
- **Firmar el contrato del SDK** y **decidir la contratación del acompañamiento** — sin eso no hay proyecto.
- **Que TI del banco libere los e-mails con link** para el acceso al [[VDP (Visa Developer Platform)|VDP]].
- **Confirmar con autorizaciones** el soporte al nuevo valor del campo de origen del aprovisionamiento.
- **Verificar el registro de Veritran como [[Third Party Agent|agente tercero]]**.
- **Enviar el checklist de lo que es exclusivo de Apple** (lo que no está cubierto por lo que ya existe para Google Pay) y la documentación de APIs — prometido por la CSM.
- **Dimensionar el plazo de los desarrollos del banco** (SDK, step-up adicional, front) — precondición para abrir.
- **Responder el conjunto de dudas técnicas** sobre el SDK.
- **Riesgo de relación:** el banco pidió reuniones diarias y "modalidad de proyecto", criticando la burocracia y la fluidez de la comunicación. El canal indirecto (Oscar → Claudio → Visa) ya causó pérdida comprobada de mensajes; se autorizó el canal directo.
- **Riesgo de expectativa:** meta de diciembre contra benchmark de 6+ meses. Dejarlo por escrito.

---

# Actualización sep–nov/2026

> [!note] Origen y confiabilidad de este bloque
> Escrito el 16/11/2026 a partir de transcripciones automáticas de ~25 reuniones (internas y con el cliente) entre fines de agosto y el 16/11. No se validaron contra minutas. Las fechas con `~` son inferidas; `[a confirmar]` marca una deducción o un nombre oído de forma incierta. El seguimiento semanal (pendientes, fechas, responsables) está en la ficha de la base y en la planilla del proyecto — aquí queda la historia y el porqué.

> [!warning] Correcciones al registro de agosto
> - El PM funcional de apoyo es **Bruno Medeiros** (la sección «Ficha» trae "Bruno Da Silva").
> - **Lina Torres** es liderazgo VCA; no es contacto del cliente.
> - El contrato con Apple **no** estaba firmado en agosto: se cerró en octubre.
> - Veritran recién fue registrada como [[Third Party Agent]] en noviembre; si es el [[ITSP]] del banco sigue en duda.
> - La meta de producción en diciembre/2026 salió de escena: el objetivo del banco pasó a ser **mayo/2027**.

## Estado al 16/11/2026

**Ámbar.** El proyecto está al final de la preparación — lo que el equipo llama "mes 0" o etapa cero — y camino a la apertura del proyecto técnico con [[CS Implementations]]. Los diez prerrequisitos de apertura están funcionalmente cumplidos y la apertura fue solicitada. En la weekly con el cliente del 11/11 se esperaba el kickoff técnico para la semana del 16/11; la Weekly Tech interna del 16/11 registra el kickoff el **25/11**, porque el PM técnico previsto (Fernando Núñez) estaba de vacaciones, con la apertura oficial después. Es la información más reciente. No hay, en los registros, el OK escrito de la CSM.

El color es ámbar y no verde por cuatro motivos: la apertura estaba planificada para el 15/10; [[FIME]] todavía no está contratada; el banco no tenía el [[Tap to Add Card|Tap to Add]] desarrollado; y el desarrollo banco/Veritran (18 semanas, hasta febrero) no deja holgura para mayo/2027.

## Cómo llegó el proyecto hasta aquí

### Agosto–septiembre: definir qué hace Visa y qué no
En un proyecto común de Apple Pay el banco llega con los prerrequisitos cumplidos y Visa entra solo en la configuración y certificación. Aquí hay una consultoría contratada: Jenny Johansen y Bruno Medeiros acompañan desde el SDK y los prerrequisitos, centralizan las dudas y las derivan a producto y a CS. El [[TPM (Technical Project Manager)|PM técnico]] recién se designa cuando abre el proyecto técnico. De ahí los **dos kickoffs**: el general (15/09) y el técnico (todavía por ocurrir).

Buena parte del trabajo de septiembre fue de lenguaje. El deck de kickoff pasó por varias versiones para decir, sin ambigüedad, que Visa pone a disposición el SDK pero no lo desarrolla ni lo integra; que quien certifica es FIME, contratada por el banco; y que Visa no gestiona a Veritran ni a Apple. Antes del kickoff hubo tres sesiones con el banco: el Gantt técnico estándar (4 a 6 meses a partir de la apertura), los requisitos funcionales de Apple (guía versión 3.5) y las dudas de SDK con Veritran.

De esas sesiones salieron las definiciones técnicas que valen hasta hoy: integración en modo **headless** (interfaz propia del banco), con [[Push - In-App Provisioning (fluxo verde)|Push Provisioning]] y [[Wallet Extensions|Wallet Extension]] por el SDK; Tap to Add fuera del SDK; mismos artes de las tarjetas actuales; SDK en la versión 5.9.

> [!tip] Decisión de método
> El 11/09 se decidió **no poner plazos de desarrollo del banco en el Gantt de Visa**. Visa muestra la línea de base de CS; los tiempos del banco son del banco. El motivo fue la experiencia de septiembre: circularon versiones de 4, 6, 7 y 8,5 meses, cada una leída de una manera distinta.

### 15/09–15/10: siete de diez, y los tres que faltaban
El kickoff del 15/09 cerró con 7 de los 10 prerrequisitos cumplidos. Los tres abiertos eran de naturaleza distinta, y eso explica por qué llevaron dos meses:

| Prerrequisito | Por qué demoró | Cuándo cerró |
|---|---|---|
| Contrato con Apple en el Partner Hub | Banco público: la contratación directa de Apple y FIME (sin licitación) necesitaba una minuta aprobada por el Comité Ejecutivo, lo que ocurrió el 29/09 | antes del 14/10 |
| Registro de Veritran como Third Party Agent | Quien se ocupa de esto en el banco no lograba entrar a la plataforma; la recuperación de cuenta envía un link y el e-mail del banco elimina los links | carta de aprobación informada el 04/11 |
| Soporte a PAN Source 06 | El banco no sabía decir si lo soportaba; recibía el campo sin usar el valor. Postergó tres veces la sesión técnica | 05/11 |

A fines de septiembre el seguimiento salió del deck y pasó a una **planilla única** (pendientes generales, SDK, requisitos Apple, matriz de riesgos, resumen), y se creó un **one-pager** para el Comité Ejecutivo del banco, pensado para presentarse cada dos meses. La meta acordada con el banco era abrir el proyecto técnico el 15/10.

### Segunda quincena de octubre: el punto más tenso
La meta del 15/10 pasó. Para abrir sin el PAN Source, CS le pidió al banco una fecha de cumplimiento. El banco respondió **mayo/2027** — la misma fecha del objetivo de lanzamiento. En la misma semana quedó en evidencia que el banco **no tenía los desarrollos de Tap to Add**, aunque el ítem figuraba como listo, y que el desarrollo total con Veritran llevaría 18 semanas, hasta febrero.

Dentro de Visa había dos lecturas. CS no recomendaba abrir: el proyecto se trabaría en el segundo o tercer mes, FIME exige el 100% de las funcionalidades y el contrato Visa–banco tiene duración fija (~6–7 meses), de modo que cada mes detenido cuesta una adenda. Producto consideraba peor mantener todo detenido y proponía abrir con fecha límite y escalar al nivel ejecutivo. La interna del 29/10 cerró una **postura única**:

- Tap to Add **flexibilizado para la apertura** — del lado Visa es un ítem de formulario y reglas de VRM; el desarrollo es del banco y el [[Waiver|waiver]], si lo hubiera, solo lo daría Apple;
- PAN Source 06 con límite a mediados de diciembre;
- Veritran al menos registrada (FIME no se registra);
- pedirle al banco el Gantt interno en alto nivel y reportar con transparencia todas las semanas.

### Noviembre: el ítem que cerró en una semana
La sesión técnica del 05/11 (banco, Veritran y Visa) terminó con el consenso de que el banco **ya soporta** el PAN Source. El prerrequisito que había recibido fecha de mayo/2027 se dio por cumplido seis días después, y la fecha límite de diciembre dejó de ser necesaria. El 11/11 la apertura estaba solicitada.

En paralelo, FIME pasó de NDA a primera reunión y dio la referencia de calendario: pedir el laboratorio en los primeros días de enero para probar en la segunda quincena de febrero, 25 días hábiles en total, con los desarrollos ya en producción en la precertificación. El banco avisó de un freeze de ~10/12 a ~2–3/01 y apareció una alerta nueva: la tasa de aprovisionamiento del banco en Google Pay está entre 45% y 62%.

## Qué explica el riesgo de plazo

La cuenta que sostiene el ámbar es simple y se dijo en reunión: 18 semanas de desarrollo terminan en febrero; FIME ocupa 25 días hábiles a partir de la segunda quincena de febrero; Apple solo aprueba salidas el 1.er y el 3.er martes del mes; y el objetivo es tener usuarios enrolando en mayo/2027. No queda margen para una reprobación en el laboratorio, y lo que más amenaza la certificación es justamente lo que todavía no existe: Tap to Add y los diseños que dependen de la aceptación de Apple (autenticación por SMS y call center sin [[Passkey - App-to-App|app-to-app]], segundo factor propio del banco en el push provisioning, ciclo de vida del token con un autorizador que decide por PAN). En septiembre el banco decía tener aceptaciones verbales; en octubre pasó a decir que no pretende pedir excepciones.

Dos puntos de fondo siguen sin respuesta: el **alcance Mastercard** (el SDK es multimarca, la asesoría es solo Visa, y Apple espera el lanzamiento completo) y la **vigencia del contrato Visa**, que puede terminar antes del go-live.

## Decisiones que valen de aquí en adelante
- Jenny y Bruno son el punto focal único; todo e-mail del proyecto lleva a los dos en copia.
- Todo acuerdo con Apple queda por escrito y pasa por los canales formales.
- Seguimiento en planilla única; la minuta lleva las notas en el cuerpo del e-mail (el banco tiende a no abrir el adjunto y su e-mail elimina los links).
- Weekly los miércoles, 12:00 de Chile, 45 min. Después de la apertura: dos reuniones semanales, la técnica con el PM técnico y la general.
- Para CS el proyecto es **uno solo** (Apple Pay + SDK).

## Línea de tiempo (agregado)
- **~27–28/08** — Interna de roles: sin contrato firmado no se inicia nada.
- **~04/09** — 1.ª sesión de Gantt técnico con el banco; contrato firmado entre el 04 y el 09/09 `[fecha exacta a confirmar]`.
- **09/09** — Requisitos funcionales Apple. **~11/09** — Dudas de SDK con Veritran.
- **15/09** — Kickoff general (7/10).
- **29/09** — El Comité Ejecutivo del banco aprueba la compra directa con Apple y FIME. **30/09** — reunión presencial del liderazgo Visa en el banco; 1.ª weekly en planilla.
- **antes del 14/10** — Contrato Apple en el Partner Hub (8/10).
- **15/10** — Meta de apertura no cumplida; Comité Ejecutivo cancelado y reprogramado para el 02/11.
- **19/10** — El banco firma el NDA de FIME. **~20/10** — Veritran empieza a integrar el SDK.
- **28–29/10** — El banco da mayo/2027 para el PAN Source; Visa cierra postura única.
- **04/11** — Veritran aprobada (9/10). **05/11** — Sesión PAN Source (10/10).
- **11/11** — Apertura solicitada; weekly conducida por Bruno.
- **16/11** — Weekly Tech: kickoff técnico el 25/11.

## Lecciones de este período
- Separar tres listas que el cliente confundía: prerrequisitos de apertura, requisitos funcionales de Apple y alcance del SDK.
- Capacitar antes de pedir fechas — la fecha de mayo/2027 se dio sin la sesión técnica.
- Confirmar cada prerrequisito en la fuente; "estamos revisando, sin dudas" no es avance.
- Alinear la postura interna antes de hablar con el cliente.
- Los bancos que ya están en producción no sirven de referencia para las reglas de Apple: lanzaron con una versión anterior de la guía y con excepciones.

## Qué falta confirmar
- OK escrito de CS y fecha efectiva del kickoff técnico (16/11 × 25/11).
- Si el Comité Ejecutivo del 02/11 se realizó.
- Rol exacto de Veritran y alcance de las 18 semanas.
- Alcance Mastercard.
- El kickoff del 15/09 y la weekly del 28/10 no tienen transcripción utilizable.

---
[[Home]]
