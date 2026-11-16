---
tags: ["tecnico"]
fuente: Transcripciones de reuniones sep–nov/2026
estado: parcial
title: "Aprendizajes de las reuniones — sep a nov 2026"
---

# Aprendizajes de las reuniones — sep a nov 2026

Versión resumida de lo que se **dijo en reunión** entre fines de agosto y el 16/11/2026 sobre producto y proceso Visa. No es documentación oficial: cada punto trae la reunión de origen (cliente + fecha; `~` = fecha inferida) y lo que está marcado `[a confirmar]` sigue sin validación. La versión completa, con todas las fuentes, está en la base de conocimiento en `claude/conhecimento-reunioes-set-nov-2026.md`.

## Apple Pay

### Prerrequisitos de apertura
- El proyecto técnico con [[CS Implementations]] solo se abre con los prerrequisitos cumplidos; la [[CSM (Customer Success Manager)|CSM]] envía un e-mail con los prerrequisitos y el SOW y el [[TPM (Technical Project Manager)|PM técnico]] se designa en 3–5 días hábiles (BancoEstado, ~30/09 y 11/11).
- Prerrequisitos citados en BancoEstado (10 en total, la lista completa no aparece): contrato Apple/[[Partner Hub]] con usuarios autorizados, registro de [[Third Party Agent|third party agents]], soporte a PAN Source 06, formulario de emisores, SOW (BancoEstado, ~23/09 y 28/10).
- [[Tap to Add Card|Tap to Add]], [[Wallet Extensions]] y [[Push - In-App Provisioning (fluxo verde)|Push Provisioning]] son exigencias de Apple; las dos últimas vienen en el SDK, Tap to Add no (1:1 Jenny, 28/10).
- La apertura exige además una fecha comprometida por el emisor y contrato VCA con vigencia suficiente; un pedido del BROU fue rechazado con ~3 semanas de contrato (Weekly Tech, 05/10 y 19/10).
- El Solution Design (entregable del scoping de preventa, aprobado por el cliente) pasó a ser obligatorio en el pedido de apertura (interna, 05/10; weekly Lina, 02/11).
- En el [[PRM (Visa Access)|PRM]], basta con que el tercero esté cargado (con número de track), no necesariamente aprobado; el laboratorio no se registra (BancoEstado, 29/10).

### Requisitos funcionales
Detalle en [[Apple Pay — Issuer Functional Requirements v3.5]]. Lo que se reforzó en sesión (BancoEstado, 09/09):
- Aceptar la autenticación del dispositivo en montos altos; no exigir PIN.
- 5 a 10 dispositivos por PAN; ≥95% de las tarjetas de consumo elegibles.
- [[Step-up]] con al menos dos métodos, uno de ellos SMS; Apple ahora pide app-to-app.
- No discriminación: las reglas de fraude y autorización no pueden ser más duras que en otras wallets.
- Ciclo de vida del token independiente del plástico; es inaceptable que la Wallet muestre la tarjeta activa y la compra sea rechazada.
- El cliente que aprovisiona y no transacciona en 7 días debe recibir una comunicación (BancoEstado, ~30/09, relatado por el banco).
- Las excepciones de Apple son raras: escalar temprano y tener el [[Waiver|waiver]] por escrito (BancoEstado, 21/10).

### PAN Source, Tap to Add y Wallet Extension
- PAN Source es el campo de origen del aprovisionamiento: ingreso manual, push, Tap to Add y Card Continuity. En los dos últimos no hay CVV: no se puede rechazar por eso, pero sí se puede desafiar (BancoEstado, 09/09).
- PAN Source 06 va en un campo de la mensajería (campo 125 `[a confirmar]`) y se prueba en la [[FIME]]; si se reprueba → Apple no libera (BancoEstado, 28/10; 1:1 Jenny, 28/10).
- Tap to Add: solo Apple concede waiver. Según Jenny, nunca se flexibilizó; en BancoEstado sí, para la apertura (BancoEstado, 28/10).
- Wallet Extension es prerrequisito y Apple no da waiver — caso BBVA Uruguay escalado hasta Miami (Weekly Tech, ~28/09 y 16/11). Web Provisioning no es prerrequisito (BancoEstado, ~11/09).

### Partner Hub y FIME
- En el [[Partner Hub]]: contrato, cuestionarios (~55), marketing, wireframes y artes. Las etapas son secuenciales — la siguiente solo aparece tras la aprobación de Apple (BancoEstado, ~23/09; Corrientes, ~04/09).
- Visa no distribuye material de marketing de Apple (Corrientes, ~04/09).
- [[FIME]] es el único laboratorio aceptado por Apple; el emisor contrata directo y recién entonces pide fechas; perder la reserva obliga a pedir nuevas (Weekly Tech, 13/10 y 16/11).
- Duración: 25 días hábiles (5 + 10 + 10) en BancoEstado (14/10); ~5 días + ~2 semanas en Corrientes (~04/09). La precertificación exige app en producción y el 100% de las funcionalidades (BancoEstado, 04/11).
- FIME no es prerrequisito de apertura, pero es obligatoria para concluir (1:1 Jenny, 14/10).

### Plan y go-live
- Fases: alcance (hasta el SOW) → diseño de la solución → configuraciones en producción → pruebas [[Friends and Family]] con [[Whitelist|whitelist]] → precertificación y certificación → lanzamiento (BancoEstado, 14/10).
- Configuración productiva de la wallet: 10 días hábiles, plazo fijo; usa el [[DEF (Digital Enrollment Form)|DEF]] (BancoEstado, ~04/09).
- No hay sandbox Apple ni ambiente preproductivo para billeteras: todo en producción, protegido por la whitelist (BancoEstado, ~04/09).
- Apple aprueba salidas solo el 1er y el 3er martes del mes, con pedido 1 semana antes; después, 10 días de monitoreo conjunto (BancoEstado, ~04/09).
- Go-live = remoción de la whitelist por parte del emisor (BancoEstado, ~04/09; BROU, 19/08). En Corrientes se dijo que Visa la libera (~02/10) `[a confirmar]`.
- El 1er día de producción suele tener una tasa menor; >90% es muy bueno (BBVA Uruguay, ~24/08).
- Los lanzamientos de wallets diferentes no pueden ser simultáneos (Weekly Tech, 16/11).
- Plazo: 4–6 meses desde la apertura (BancoEstado, ~04/09); estándar de wallet 6 meses, 4 meses con Apple es inviable (Pipe CS, 04/09).

## SDK de Visa
- Es precondición de las billeteras y de Click to Pay vía SDK; SDK + Apple Pay se abre como un solo proyecto en CS (equipo NT, 03/09; interna, 05/10).
- Onboarding Form → el equipo de Manila devuelve App ID + shared secret, necesarios para inicializar el SDK (BancoEstado, ~04/09).
- La documentación viene en el ZIP descargado en el [[VDP (Visa Developer Platform)|VDP]] (BancoEstado, ~11/09).
- El SDK no consulta tokens emitidos (quedan en el [[VTS (Visa Token Service)|VTS]]) `[a confirmar]`; la lista de tarjetas y los datos cifrados vienen de un servicio del propio banco (BancoEstado, ~11/09).
- Existe UI embebida y modo headless; las pantallas de Apple no son modificables (BancoEstado, ~11/09).
- SDK agnóstico sin release segmentado por marca: el lanzamiento queda rehén de la otra marca (Comafi, 27/08).
- El proceso de SDK es nuevo y obligatorio para CS LAC (interna con Visa Brasil, 06/10).

## Click to Pay
- [[Click to Pay]] se trata como [[Mandato|mandato]]; el incumplimiento genera penalidad incluso con acompañamiento VCA (Weekly Tech, ~28/09).
- Fases: (1) enrolamiento masivo vía [[Processador|procesador]]; (2) gestión/ciclo de vida en la app del emisor; (3) logo en las credenciales físicas y digitales (Corrientes, 30/09). La Weekly Tech cuenta dos fases + marketing y T&C (02/11).
- No conformidad: carta de no conformidad → plan con fechas en Visa Access → aprobación por [[Produto (Visa)|Producto]] → cambio de fecha solo antes del vencimiento, con penalidad escalonada (5.000 / 10.000 / 15.000…). Planes solo hasta el fin del año fiscal, 30/09 (Corrientes, 27/08).
- Rules decide la condonación de multas (SOCO, 27/08).
- En producción se habilita por producto (crédito/débito), no por [[BIN]]; en el sandbox, como máximo 5 BINs de prueba (Corrientes, ~28/08).
- Con el auto-enrollment activado, todo registro de tarjeta enrola en Click to Pay (Corrientes, 24/08).
- Puede hacerse con SDK Visa o con proveedor propio (ej.: [[Thales]]); con SDK Visa no había caso en América Latina hasta el 04/11 (weekly Lina, 02/11; interna, 04/11).
- Profundizar en [[Click to Pay — SRC, enrolamento e ciclo de vida (aprofundamento)|Click to Pay — SRC, enrolamiento y ciclo de vida (profundización)]] y [[Click to Pay — comunicação e marketing (fase 3)|Click to Pay — comunicación y marketing (fase 3)]].

## Tokenización y ciclo de vida
- Secuencia VTS Card on File/e-commerce: certificación → configuración productiva → API Key/Shared Secret en el VDP → piloto con whitelist → remoción (BROU, 19/08).
- Los cambios productivos en Visa entran entre las 5 h y las 7 h, hora de Miami (BROU, 19/08).
- El PAN replacement en el [[TLCM (Token Lifecycle Manager)|TLCM]] mueve todos los tokens al PAN nuevo y no tiene rollback; ejecutado antes de la vigencia de la tarjeta nueva, inutiliza el PAN actual para tokenización (BBVA Uruguay, ~24/08 y 31/08).
- Cada BIN tiene un token range; las promociones por BIN tienen que incluirlo (BBVA Uruguay, 31/08).
- Código 59 en el reporte de aprovisionamiento = rechazo por regla de la herramienta de reglas del emisor; los rechazos por política de Apple entran en el mismo código (Comafi, ~20/08).
- Cambio de procesador: si el [[TSP (Token Service Provider)|TSP]] se contrató vía el procesador anterior, este tiene que ceder los tokens o se pierden (Naranja X, 08/10).
- Profundizar en [[Tokenização — arquitetura VTS e provisioning (aprofundamento)|Tokenización — arquitectura VTS y provisioning (profundización)]].

## VDMU y arte de tarjeta
- VDMU (Visa Dynamic Metadata Updater): Visa actualiza la metadata en nombre del emisor y notifica a los token requesters; permite también arte por período ("time-based card art") (Grupo Petersen, 16/11).
- Sin VDMU, el arte nuevo solo vale para nuevos aprovisionamientos — hay que reenrolar (Comafi, ~20/08). Con VDMU, actualiza tokens ya aprovisionados (Grupo Petersen, 16/11).
- No exige desarrollo del emisor; solo por account range; solo credenciales Visa (Grupo Petersen, 16/11).
- Autoenrolamiento de todos los emisores LAC a partir de febrero/2027, con opt-out; cobro desde el 01/02/2027 por notificación a device token; valor `[a confirmar en el comunicado]` (Grupo Petersen, 16/11).
- El arte queda en el portal de metadata ([[VCMM]] `[grafía a confirmar en la transcripción]`) y pasa por aprobación de marca — ver [[Revisão de Artes|Revisión de Artes]]. Se configura por rango de BIN: varios artes en el mismo BIN no se distinguen sin un rango separado (BancoEstado, ~04/09; Corrientes, ~02/10).
- Cada aprobación de arte cuesta US$ 150; los metadatos entran en cortes cada 6 h GMT (Comafi, ~20/08).

## Migración de procesador (Pismo)
- Un BIN entero pertenece a un único procesador; la gradualidad solo es posible por BIN entero o abriendo un BIN de 6 en BINs de 8 (Naranja X, 07/10).
- El identificador del procesador para el cliente (PCR `[sigla a confirmar]`) no se migra: migración = PCR nuevo + certificación completa (Weekly Tech, ~29/09). Pismo levanta un PCR nuevo por cliente (Naranja X, 03/11).
- Un BIN nuevo solo se configura cuando existe el PCR del procesador nuevo; atado al anterior, se convierte en migración (Naranja X, 15/10).
- Producto que el procesador todavía no tiene en producción en el país = certificación completa, ~90 días (Naranja X, 08/10).
- Dos niveles de prueba: sandbox del procesador → sandbox Visa (Naranja X, 03/11).
- Freeze de fin de año: de diciembre (12/12, dicho el 07/10) hasta el 06/01, en producción y en sandbox (Naranja X, 08/10).
- El proyecto Visa entra después de que el cliente avance en la integración con el procesador (Naranja X, 03/11). Sin recursos Pismo asignados, CS no abre proyecto (Weekly Tech, 16/11).
- Zero Balance: saldo fuera de Pismo; autorización vía webhook al emisor; el ISO completo va por cola y no sirve para decidir (Naranja X, ~02/10).
- Los mandatos semestrales de la marca son del procesador; los fees por approval rate y provisioning rate son del emisor (Naranja X, 08/10).

## Liquidación y tesorería
- Vía Pismo, el emisor recibe el archivo de [[Clearing|clearing]] con el PAN reemplazado por un ID; la conciliación y el pago a Visa son del emisor (Naranja X, ~02/10 y 05/11).
- El principal member tiene cuentas de [[Settlement|liquidación]] propias; quien no lo es, liquida vía procesador y solo recibe la factura (Naranja X, 08/10; Grupo Petersen, 12/11).
- En una fusión de emisores, cada BIN tiene un "numérico de tesorería" ligado a una cuenta de liquidación; hay que decidir hacia dónde apunta cada uno (Grupo Petersen, 12/11; interna, 12/11).
- Orden recomendado: assessment Visa → definición con el cliente → accionar al procesador (Grupo Petersen, 12/11).
- El procesador ve una reclasificación; Visa ve una transferencia entre emisores independientes (interna, 12/11).

## Featurespace ARIC y riesgo
- ARIC es una plataforma completa de gestión de riesgo, SaaS en AWS, con ambiente aislado por cliente (demo, 09/10).
- Integración por API de eventos única; salida de datos por S3 bucket (demo, 09/10).
- Retención: 3 meses en vivo, 13 meses de histórico; las auditorías más largas dependen de la exportación del cliente (demo, 09/10).
- No es orquestador ni tiene SLA nativo por incidente; los reportes a medida son un punto débil asumido (demo, 09/10).
- La integración directa VisaNet → Featurespace está en roadmap, sin fecha firme (BCI, 05/10; 1:1 Lina, 26/10).
- ~6 meses de datos mínimos para buenas decisiones (1:1 Lina, 26/10).
- Squad de autorizaciones: diagnóstico → debrief ~7–10 días después → acuerdo de roadmap → gobernanza recurrente (Bapro, 08/09). Ver [[Squad de autorizações e fraude|Squad de autorizaciones y fraude]] y [[BCI (Featurespace) — dossiê|BCI (Featurespace) — dossier]].

## Reportes y soporte
- VAP (Visa Analytics Platform): approval rates y el reporte mensual obligatorio de Apple Pay, prearmado; módulos 1, 2 y 14 (Naranja X, 08/10; BancoEstado, 21/10).
- El Support Hub en Visa Access es el canal obligatorio para análisis técnico; si no resuelve, se escala con Producto (Corrientes, 27/08).
- Para analizar un aprovisionamiento: fecha/hora, Correlation ID, BIN + últimos 4 (BancoEstado, ~04/09).
- Cualquier configuración (prueba o producción) sigue un proceso formal de hasta 10 días hábiles, con costo (Corrientes, ~04/09). CS puede hacer "Expedite" en 1–2 días; usado sin costo en BBVA, crea precedente (Weekly Tech, 16/11).

## Cómo trabaja Visa
- [[VIS (Visa Implementation Services)|VIS]] acompaña y orquesta; no ejecuta ni promete plazos. El PM técnico de CS solo entra con proyecto abierto y cierra con carta de turnover (Pipe CS, 04/09; equipo NT, 03/09).
- La CSM es el referente antes del proyecto y el primer nivel después; BD es dueño del contrato de incentivos y puede hacer waiver de cobro (Pipe CS, 04/09).
- Preventa de VAS se ocupa solo de la venta y del Solution Design; abierto el proyecto, es CS (VAS × VIS, 20/10).
- Pipeline VCA × CS: frentes *prospecting* e *implementing*; tablero con una pestaña por semana, unidad = track; reunión los martes desde octubre (Pipe CS, 04/09; BiWeekly, 08/10).
- Quedan fuera de la pipe con CS: squads de autorizaciones/fraude, Feature Space y BAU (Pipe CS, 04/09).
- Sin contrato VCA vigente, CS cobra por billing — USD 3.000/mes de Tech PM (Weekly Tech, ~29/09).
- El contrato debe empezar cuando el cliente ya puede operar; el contrato firmado va a la carpeta compartida con CS (Pipe CS, 04/09; Weekly Tech, 19/10).
- El ambiente de pruebas fuera de un proyecto contratado y la revisión de Gantt sin firma tienen costo (US$ 350) (Pipe CS, 04/09).
- El año fiscal cierra el 30/09; las oportunidades entran en el VPC (Visa Project Central); la auditoría mira solo la evidencia subida al sistema (BiWeekly, 08/10; weekly de equipo, ~10/09).
- No generar listas de PAN a partir de fragmentos (weekly de equipo, ~10/09).
- Ver también [[7. Mandatos e Waivers|7. Mandatos y Waivers]].

## Referencia externa — NO validada contra el proceso Visa LAC
Relato de un emisor brasileño con **Mastercard** (conversación "Wallets - Entendimento", ~20–21/08). Sirve como referencia de mercado, no como regla:
- Tres métodos: OTP por SMS, app-to-app y push provisioning; quien ofrece app-to-app también ofrece el camino desde dentro de la app.
- Los guiones de prueba "ensucian" dispositivos y cuentas; un dispositivo bloqueado en la billetera ya no sirve para pruebas.
- FIME: precertificación + certificación en 15–21 días; exclusividad Apple de ~3 meses `[como fue relatado; validar]`.
- Opinión del invitado: 4–5 meses si los prerrequisitos están listos.
- Los riesgos reales están alrededor del SDK: seguridad/autenticación y ciclo de vida del token.

## Divergencias a resolver
- Reglas sugeridas de VRM: Visa las entrega (BancoEstado, 29/10) × ya no las envía (BROU, 19/08).
- Quién remueve la whitelist: emisor (BancoEstado, BROU) × Visa (Corrientes).
- Billing de CS: "3.500 dólares" (Pipe CS, 04/09) × USD 3.000/mes (Weekly Tech, ~29/09) — vale el más reciente.
- Pismo × CS: "não passa por CS" (time NT, 23/09) × CS da el plan y abre proyecto (Naranja X, 03/11; Weekly Tech, 16/11).

---
[[Home]]
