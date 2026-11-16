---
tags: ["proyecto", "cliente/Banco-de-Chile"]
fuente: Dailies de estabilización — Banco de Chile × Nuek; transcripciones automáticas de ago–nov/2026 (no validadas)
estado: parcial
title: "Banco de Chile (Nuek) — dossier"
---

# 🇨🇱 Banco de Chile × Nuek — migración de procesador

> [!info] Dossier de proyecto (contexto cualitativo)
> Único frente de la base que **no es implementación de producto** sino **estabilización posmigración**. La cadencia es diaria, el insumo es la cola de tickets y el rol del PM es gobernanza sobre la cola, no sobre un cronograma de hitos.

## Ficha
- **Cliente:** Banco de Chile. **País:** Chile.
- **Alcance:** migración de la plataforma de procesamiento de tarjetas a **Nuek**, con estabilización posproducción.
- **PM Visa:** Lina Torres — reemplazada por **Bruno Medeiros** durante la licencia (ago/2026). Consultoría **CYBS** citada en el contexto del proyecto *(no aparece en las transcripciones — confirmar)*.
- **Fase:** **estabilización** — sistema en producción, cola activa de incidentes.

**Contactos —** Nuek *(atribuciones a confirmar)*: Sebastián ("Seba", conduce la daily), José / José Luis (parametrización), Waldo, Pedro, Sebastián Tobar. Banco de Chile: Claudia (liderazgo operativo), Paola ("Pau"), Joyce, Tatiana ("Tati"), John, Claudio, Jorge Borque, Luis, Gonzalo, Erika, Carlos, Francisco, Mayra. Hay un **analista basado en España** involucrado en temas específicos.

## Gobernanza
- **Daily "Estabilización Migración"** entre banco, Nuek y Visa — revisión de tickets resueltos y pendientes con planilla compartida.
- **A partir de ~19/ago/2026: daily fija a las 08h00 por 2 semanas** (con Luis y Gonzalo), con las reuniones de la tarde suspendidas hasta el regreso de Erika (~1/sep).
- Reuniones internas (ej.: 10h30) y ad hoc por tema.
- Tickets con numeración de 6 dígitos (series 45xxxx / 46xxxx).

## Dominios afectados
Emisión y reemisión de tarjetas (bloqueo, reposición, embossing, reimpresión, renovación) · tarjetas virtuales · tarjeta empresa / estructura *business* · autorizaciones y transaccionalidad (avance, reversas/anulaciones, tasa cero, montos menores, cupo controlado) · base de clientes · reportes y estadísticas (**LCN**) · canales (app, banca en línea, caja, banca telefónica, sucursal).

**Sistemas citados:** LCN, MSF, IRD, EPCF/BCF, SAC, SAT, DEM; legado **Nexus** *(a confirmar)*. Marcas Visa y Mastercard.

## Estado actual (base: Weekly Tech interna del 16/nov/2026)
> [!warning] Actualización a partir de transcripciones automáticas — no validada
> Entre el 4/sep y el 27/oct no hay reunión con el banco en los archivos; el estado reciente viene de relatos internos de Visa.

**La migración terminó y el proyecto está en cierre.** Fueron **4 migraciones**, con todos los BINs migrados, [[Friends and Family|F&F]], capacitación y gestión del cambio concluidos y **772 tickets cerrados** (dato del 27/oct). El 16/nov la migración se describe como "va bien". El engagement actual va **hasta diciembre**; las dailies se detuvieron antes del 19/oct. El video de cierre está listo desde el 28/oct. La conversación ahora es comercial: una **etapa 2 con CYBS** para funcionalidades nativas de Nuek (~USD 900 mil, ~9 meses, 10 funcionalidades — a la espera del OK formal del banco) y, más adelante, **Featurespace** (el banco indicó Q2 FY27).

## Estado actual (base: daily del 18/ago/2026)
> [!note] Registro del 18/ago, mantenido como histórico — el estado vigente es el bloque de arriba.
Cola activa, con algunos temas ya dados por cerrados (incidente "incoming Visa", BCF) y otros que son **regresiones o funcionalidades perdidas en la migración** — categoría que merece atención especial porque no aparece como bug, aparece como "el sistema ya no hace esto".

## Temas abiertos
| Tema | Descripción | Plazo |
|---|---|---|
| **Ticket de Francisco** (+ ~2 relacionados) | Compromiso reafirmado al banco | **20/ago (máximo)** |
| **Error de reversa en el canal caja** | El servicio recibe la información en `0`, intenta convertirla a fecha, no la encuentra y devuelve respuesta negativa al canal. Todo el flujo previo funciona. Pedido: enviar fecha (año+día) y hora en los valores de la reversa, como ya ocurre en el pago | — |
| **Estructura *business* / tarjeta empresa** | 295 cuentas regularizadas y enviadas. Abierto: quién ejecuta el cambio de cuenta de control → cuenta de empleado. Tarjeta empresa creada por **DEM** salió como **persona natural** — y con giro de persona natural no se puede asociar estructura empresa | confirmación 18/ago |
| **Renovación anticipada** | Existía en el legado y **no funciona en Nuek**: el proceso emite una reimpresión, sin tarjeta activa y sin alterar la vigencia. El **IRD** no distingue renovación normal de anticipada. Existe el parámetro "meses antes del vencimiento", hoy en **5 meses** — modificarlo es **global** e impacta plásticos y procesos | reunión dedicada por agendar |
| **LCN — inversión de moneda** | **Desde el 15/jul/2026** la proporción se invirtió: ~80% dólar / 20% peso (antes al revés). La LCN es base de estadísticas y consulta de transacciones para varias áreas | ticket por abrir |
| **Tarjeta virtual** | Transacciones aprobadas operando bien en ambos BINs con mensajes **1100**; llamó la atención la llegada de mensajes **1120** (advice de la marca). Nuevo caso de **rechazo por CVV** | ticket por abrir |
| **Error 5906 — "Excedido operaciones diarias"** | Rechazo de **anulación** (código de transacción 17). Tesis del banco: la anulación/devolución debería **restar** del contador, no sumar. Caso conexo: avance aprobado en el procesador y reversado en los canales (posible *timeout*), dejando **cupo tomado** | sin replicación |
| **Ticket de cupo controlado** | — | **31/ago** |
| **Bloqueo con reemisión** *(otra daily)* | Al bloquear la tarjeta por la app o la banca en línea, **la tarjeta se bloquea pero la nueva no se genera**. Regresión: antes funcionaba. Flujo esperado: bloquea → nueva generada sin número nuevo, con PIN, en la billetera digital; física con embossing en el momento en cualquier sucursal. **No todas las sucursales logran embozar sin número nuevo.** Solución alternativa conocida: eliminar cookies y tarjetas en proceso | — |

## Decisiones (18/ago/2026)
1. **Abrir un ticket específico para la LCN**, separado del "ticket gigante", por trazabilidad.
2. **Abrir un ticket para la tarjeta virtual rechazada por CVV**, consolidando los casos reportados.
3. **No forzar manualmente** una renovación anticipada para el cliente puntual — tratarlo vía parámetro, en reunión específica con los especialistas (incluyendo plásticos).
4. Reunión dedicada al ticket **456675** (reposición × embossing).
5. **Daily fija a las 08h00 por 2 semanas**; reunión de la tarde reagendada para después del regreso de Erika.
6. Caso de la tarjeta empresa creada como persona natural: enviar antecedentes por e-mail para análisis.

## Riesgos
1. **Funcionalidad perdida en la migración** — la renovación anticipada existía en el legado y no existe en Nuek. La alternativa (tocar el parámetro de 5 meses) es **global**, con efecto colateral amplio. *"Puede cambiar un solo parametrito, puede gatillar quizás cuántas cosas."*
2. **Distorsión de la LCN** — la base de estadísticas del banco no es confiable desde el 15/jul.
3. **Tarjeta virtual** con segundo caso de rechazo por CVV y mensajes 1120 inesperados — no es un problema aislado.
4. **Cupo tomado indebidamente** en avances (divergencia procesador × canales) — impacto directo y recurrente en el cliente.
5. **Volumen y enredo de tickets** — riesgo explicitado por el propio banco de perder trazabilidad dentro de un ticket gigante.
6. **Transición de PM en pleno período de inestabilidad.**
7. Dependencia de un analista externo con restricción de huso horario.

## Línea de tiempo (ago–nov/2026)
- **26/ago/2026** — 1:1 de contexto con el banco: **142 tickets abiertos, 34 prioritarios**; 65 en Nuek sin fecha objetivo. Bruno asume el caso del bloqueo por fraude que no llega a la marca.
- **27/ago/2026** — El directorio del banco aprueba pagos y ajustes por *fecha valor*. Del lado comercial, el sponsor de medios de pago sale el 31/ago.
- **~28/ago/2026** — Daily: rechazos que la atención al cliente no logra ver; Visa ya había respondido el caso de fraude.
- **4/sep/2026** — Daily: error criptográfico del [[BIN]] 415282 con corrección en el día; Bruno es convocado en un segundo caso con la marca (fallback manual).
- **5/oct/2026** — Lina da el contexto al equipo: CYBS con 9 personas, contrato hasta dic/2026, funcionalidades que Nuek no entrega.
- **19/oct/2026** — Las dailies se detuvieron; en el equipo nadie sabe si el contrato sigue.
- **26–28/oct/2026** — Pedido, guion y entrega del **video de cierre**.
- **2/nov/2026** — Propuesta de renovación (2 funcionalidades, USD 385 mil, 4 meses) enviada; Featurespace indicado para Q2 FY27.
- **10/nov/2026** — Reunión con el decisor del banco sobre la renovación: "positiva".
- **16/nov/2026** — Oportunidad armada para 10 funcionalidades, ~USD 900 mil, ~9 meses; a la espera del OK formal.

## El rol de Visa en la estabilización
El dossier de arriba describe la cola; faltaba registrar **desde qué lugar** Visa la miraba. En el 1:1 del 26/ago el propio banco lo resumió: hasta entonces Visa escuchaba las reuniones y recibía las presentaciones, y solo tenía participación activa en casos en que podía acelerar algo con la marca. Internamente el diseño es el mismo: Visa actúa como PMO, la integración la conduce el equipo de CYBS, y **las dudas técnicas del cliente no tienen dueño en Visa** cuando no hay un frente técnico contratado.

Dos casos arrastraron a Visa hacia adentro:

- **Bloqueo por fraude que no llega a la marca.** Con Nexus, un bloqueo por fraude o robo aparecía de inmediato en Visa; después de la migración, el bloqueo se hace pero no se refleja. Nuek abrió ticket en las dos marcas sin solución, y el caso quedó detenido en Visa por cambio de responsable. La respuesta de Visa (registrada el ~28/ago): **no había problema de conectividad — el contenido del mensaje estaba mal**. La corrección quedó del lado de Nuek, con fecha 7/sep *(el desenlace no consta)*.
- **Fallback manual.** El 4/sep el banco relató haber abierto un caso en Visa sobre transacciones con codificación manual rechazadas por Nuek y pidió apoyo para una reunión. El tramo del audio es contradictorio sobre la posición de Visa *(a confirmar en el e-mail del banco)*.

> [!tip] Aprendizaje
> Un caso con la marca necesita **dueño nombrado** y traspaso formal en vacaciones y salidas. Fue el punto en que el cliente más sintió la ausencia de Visa.

## El dolor central: rechazos que la atención al cliente no ve
Además de las regresiones ya listadas, la estabilización tuvo un problema transversal de **visibilidad**. Un rechazo del motor antifraude (Monitor) aparecía en el SAT como "aprobada + anulación aceptada" y en la LCN como rechazo; Nuek respondía un código y la marca mostraba otro. Las líneas de atención solo ven el SAT, no sabían que debían marcar al cliente como VIP para liberar, y escalar al segundo nivel penaliza sus métricas. Clientes de alto valor quedaron sin poder comprar y sin explicación.

Por decisión del banco, esos tickets **no se marcaron como "proyecto"**, para no inflar el stock de la estabilización — lo que ayuda a leer los números, pero esconde el dolor. Nuek llevó el tema a una mesa de "glosas y flujo" *(estado posterior desconocido)*.

Otros temas de fondo del mismo período: reversa que cuenta en el límite diario de operaciones (solución llevada a producto, sin fecha); *fecha valor* con devolución de impuestos, posible en dos fases; error criptográfico ligado a la parametría de CVV después de la apertura de rangos de BIN para tarjeta virtual.

## Cierre y video de cierre (oct/2026)
El cierre se contó a partir del deck que CYBS completó el 27/oct:

- **Objetivo:** asegurar continuidad, estabilidad y control durante la ejecución, el go-live y la estabilización.
- **Entregado:** 4 migraciones, todos los F&F, capacitación y gestión del cambio; estabilización en etapa de cierre.
- **Equipo:** no solo PMO — soporte a la certificación con las marcas, contabilidad y regulación, especialistas técnicos, soporte a la migración. Coordinación central de Visa ([[VIS (Visa Implementation Services)|VIS]] + CYBS) entre banco, procesador nuevo, marcas y procesador anterior.
- **Indicador:** 772 tickets cerrados. Se decidió usar **solo indicadores con número comprobable**.
- **Valor técnico:** la validación financiero-contable posmigración (devengo, intereses, diferencias), hecha casi caso a caso.
- **Legado:** modelo de seguimiento instalado y marco de validaciones posmigración; los pendientes principales quedan para **2027**, sin línea de tiempo.

El video, pedido por la dirección, quedó listo el 28/oct (~3 minutos, guion por escenas, hecho con Claude). La alternativa Copilot + Clipchamp se presentó al equipo el mismo día; un aprendizaje útil: adjuntar la PPT hace que Copilot narre el deck entero, incluyendo el aviso de confidencialidad.

> [!note] "Cerrado" no es "terminado"
> El material es de cierre, pero el 27/oct al engagement todavía le quedaban dos meses por delante — para priorizar los pendientes y armar el roadmap de 2027.

## Lo que viene después: etapa 2 y Featurespace
**Etapa 2 con CYBS — funcionalidades nativas de Nuek.** La migración dejó funcionalidades que Nuek no entrega como las entregaba Nexus; la renovación es la propuesta de construirlas. La cotización evolucionó en tres semanas: 2 funcionalidades / USD 385 mil / 4 meses (2/nov) → tres tamaños (5/nov) → 10 funcionalidades / ~USD 900 mil / ~9 meses (16/nov). Son escenarios de la misma cotización (2, 5 y 10). La reunión del 10/nov con el decisor del banco fue positiva; falta el OK formal.

**Featurespace.** Oportunidad separada, que no debe mezclarse con la migración. El banco quiere internalizar la gestión de fraude que hoy hace el procesador, y Nuek no tiene integración con Featurespace. Sería la primera implementación prevista con las transacciones yendo directo de [[VisaNet]] a Featurespace. Enfoque aprobado por el cliente: primero assessment (as-is, arquitectura futura, roadmap), después implementación. Depende de un nuevo acuerdo de incentivos y de la disponibilidad de esa interfaz; el banco indicó Q2 FY27.

## Vacíos de esta actualización
- Cuántos tickets siguen abiertos y qué entró en los "pendientes de 2027".
- Desenlace de los dos casos con la marca.
- Si el contrato actual termina en diciembre o es absorbido por la etapa 2; quién responde por la gobernanza con las dailies detenidas.
- Cuáles son las 10 funcionalidades de la etapa 2.
- Relación societaria entre Minsait, Nuek y Nexus — dicha de formas distintas el 5/oct y el 27/oct; no usar en material sin verificar.
- CYBS está confirmada en las transcripciones de sep–nov como el equipo que conduce la integración *(la nota "confirmar" de la ficha de arriba queda superada en cuanto a la presencia; el rol exacto sigue a confirmar)*.

---
[[Home]]
