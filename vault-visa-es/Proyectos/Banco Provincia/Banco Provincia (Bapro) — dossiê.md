---
tags: ["proyecto", "cliente/Banco-Provincia"]
fuente: Handover de autorizaciones y fraude (10/ago/2026) + transcripciones de sep–nov/2026 (sección de actualización)
estado: parcial
title: "Banco Provincia (Bapro) — dossier"
---

# 🇦🇷 Banco Provincia (Bapro) — squad de Autorizaciones y Fraude

> [!info] Dossier de proyecto (contexto cualitativo)
> **Consultoría pura, no implementación de sistema.** Formato "squad". La implementación final de las recomendaciones es del procesador o del banco — Visa no implementa.

## Ficha
- **Cliente:** Banco de la Provincia de Buenos Aires ("Banco Provincia" / **Bapro**) — banco estatal, descrito como el mayor banco gubernamental de Argentina en relevancia para Visa.
- **País:** Argentina.
- **Duración:** 12 meses (mínimo comercial 9).
- **Fases:** **6 semanas** de diagnóstico cuantitativo → **+4 semanas** de calibración y roadmap → implementación con seguimiento continuo ("always on").
- **Fase actual (10/ago/2026):** **posdiagnóstico, prepresentación — trabado del lado del cliente.**

**Equipo Visa —** **Moisés** (VIS, líder de los proyectos de autorizaciones y fraude; saliendo del rol de contacto directo), **Bruno Medeiros** (VIS, nuevo punto de contacto visible), **Juan Pablo** (líder de la vertical de Riesgo CONOSUR, dedicación parcial, ejecuta el diagnóstico), **Rafael Polo** (**implante** externo, dedicación casi exclusiva, debe ir al banco 2x/semana), **Diana Dicochea** (Disputas, trimestral), Customer Success Executive (a nombrar). Apoyo: Core Consulting, Client Success, **GBO** (Global Business Optimization — dueño de los datos y de los dashboards).

**Equipo del cliente —** coordinador de proyecto **a designar** + líderes de **Autorizaciones**, **Operaciones** y **Fraude** **a designar**. *El 95% de las recomendaciones cae en esas tres áreas.*

## Tracks
| # | Track | Contenido | Quién ejecuta |
|---|---|---|---|
| 1 | **Autorizaciones y fraude** | Diagnóstico + roadmap + implementación y seguimiento | Riesgo (Juan Pablo) + implante (Rafael Polo); **VIS asegura la gobernanza** |
| 2 | **Disputas / controversias** | Análisis **trimestral** con recomendaciones caso a caso | Diana Dicochea; VIS solo garantiza que la sesión ocurra |
| 3 | **Benchmark de cartera** *(adyacente)* | Estudio trimestral de penetración/portafolio | **Otro equipo de VCA** — vendido en conjunto, pero corre 100% separado |

## Estado actual — bloqueo central
> [!warning] Superado
> El bloqueo descrito aquí es la foto del 10/ago/2026. Para el estado al 16/11/2026, ver "Actualización sep–nov/2026" más abajo.

**"Están parados 100%."** El kick-off ocurrió hace ~2 meses (≈ jun/2026). El **diagnóstico está listo hace 3 semanas y aún no fue presentado** — el banco no responde a los pedidos de agenda, no designó coordinador ni responsables de área, y no liberó accesos ni equipamiento al implante. El diagnóstico de disputas también está listo y sin fecha.

> [!bug] Círculo vicioso identificado
> Como la sesión inicial no ocurre, no se activa la ida de Rafael Polo al banco — que es justamente lo que destrabaría la sesión.

**El costo de esperar es medible:** en **febrero** el banco alcanzó el tope del programa **[[MAR (Minimum Approval Rate)|MAR]]** (10 BINs) y en **marzo** tuvo **9 segmentos** en MAR. En el último año destinó "miles de miles de dólares" a esas multas.

## Línea de base del diagnóstico
Banco **por debajo de los peers en todos los cuadrantes**.

- **Crédito:** CP doméstico −0,4 p.p. · CP internacional <1% por debajo · un cuadrante −2% · **CNP internacional −6%** (principal punto de dolor).
- **Débito:** **CP internacional −8%** · **CNP doméstico −7%**.
- **Motivo de rechazo n.º 1:** **NSF (Not Sufficient Funds)**, en crédito y en débito.
- **Fraude:** en internacional no presente el banco tiene **aprobación bajísima y fraude altísimo al mismo tiempo** — *"estás mal por los dos lados"*. En débito está mejor que los peers en casi todos los cortes.

**Entregable:** documento de **150 a 200 páginas**, ~**40 accionables** organizados en **matriz de esfuerzo × impacto**. Después, banco + Visa construyen un roadmap priorizado — y el banco puede descartar ítems. Responsabilidad explícita de VIS: *"que eso se traduzca en un roadmap accionable"*.

## Conceptos del producto (ver también [[Squad de autorizações e fraude|Squad de autorizaciones y fraude]])
- **Framework de los 4 cuadrantes** — producto (crédito × débito) × geografía (doméstico × internacional) × ambiente (CP × CNP). Una métrica única de banco "no nos dice dónde hay que concentrarse".
- **Peers** — los **5 bancos más parecidos** por volumen, público objetivo y posición de mercado. Comparación siempre doble: vs. mercado y vs. peers.
- **[[MAR (Minimum Approval Rate)|MAR]]** — approval rate mínimo por BIN-segmento, con multa de **US$ 2.500 por BIN por mes** y tope de 10 BINs.
- **Limitación de datos de Visa** — por compliance Visa no almacena DNI ni nombre: **"para nosotros cada cliente es una tarjeta"**. Metáfora del *diagrama de Venn al revés*: ~20% de la información es solo del banco, ~20% es solo de Visa.

## Pendientes y riesgos
| Qué | Responsable | Situación |
|---|---|---|
| **Designar coordinador de proyecto y responsables de Autorizaciones, Operaciones y Fraude** | Banco Provincia | pendiente hace ~2 meses |
| **Liberar accesos y equipamiento al implante** (Rafael Polo) | Banco Provincia | sin respuesta |
| **Agendar la presentación del diagnóstico** | Banco (agenda) / VIS (push) | opciones ya enviadas, sin respuesta |
| **Coordinar la primera sesión de disputas** | Banco (agenda) / VIS | sin feedback |
| Armado del **roadmap accionable** | Visa + banco | bloqueado por los ítems de arriba |
| Escalar el destrabe a un nivel más alto | Moisés | en curso |
| Nombrar al **Customer Success Executive** | Visa | sin fecha |

**Riesgos**
1. **Inercia del cliente** — proyecto de 1 año que pierde ~2 meses de ventana, y la curva de arranque ya es de 3–4 meses.
2. **Cultura de empresa estatal** — *"les cuesta más accionar, por ahí más pasivo"*; exige presencia física y presión constante del implante.
3. **Implante sin accesos** — neutraliza el principal mecanismo de destrabe.
4. **NSF como ofensor n.º 1 con margen casi nulo** — el único accionable real es ampliar la línea de crédito, y en el contexto argentino ningún banco quiere hacerlo. Los bancos piden explícitamente "soluciones técnicas".
5. **Exposición financiera activa a multas MAR** mientras el roadmap no arranca.
6. **CNP internacional** con aprobación baja y fraude alto simultáneamente — cuadrante de mayor complejidad técnica.

## Actualización sep–nov/2026 (estado al 16/11/2026)

> [!warning] Contenido parcial
> Esta sección viene de transcripciones automáticas (08/09, 27/10, 30/10 y 12/11/2026), aún no validadas. Hablantes anonimizados; lo que es deducción está marcado `[a confirmar]`. Las secciones de arriba (handover del 10/ago) quedan como estaban.

### Estado actual
**El proyecto se destrabó.** El banco que en agosto no respondía pasó a tener sesión semanal con Visa — el 30/10 ya era el "tercer seguimiento" — y el 12/11 escuchó por primera vez la lectura formal del informe de disputas. Fase: **ejecución, con seguimiento semanal de iniciativas**. Semáforo sugerido: verde con puntos de atención (Redlink sin respuesta; análisis de la base de límites parado en la inteligencia comercial del banco).

Lo que no se puede afirmar por las fuentes: la presentación presencial del diagnóstico estaba agendada para el **17/09** `[a confirmar — fecha deducida]` y no hay transcripción de ella, ni del debrief, ni de la sesión de acuerdo de roadmap.

### Cómo salió el proyecto del bloqueo
El **08/09** Moisés reunió a Rafael "Rafa" Polo y a Bruno por primera vez. El contrato había sido firmado "há pouco mais de três meses" y el trabajo estaba parado porque el banco no respondía. En esa conversación quedó diseñado lo que vino después:

- **Rafa es la "punta de lanza"**: dedicado al squad, lidera de cara al banco y conduce las weeklies.
- **Bruno es el nexo con [[VIS (Visa Implementation Services)|VIS]]**, en rol **habilitador**: accesos, reportería, relación con el [[CSM (Customer Success Manager)|CSM]] de la cuenta, vínculo con los dueños de herramientas internas, temas administrativos y contractuales, apoyo a business case. Cubre a Rafa en las ausencias.
- **Moisés** queda periférico y pretende estar en las sesiones presenciales.

> [!note] Corrige lo que está arriba
> La ficha de agosto describe a Bruno como "nuevo punto de contacto visible". Desde el 08/09 el frente con el banco es de Rafa; Bruno habilita por dentro de Visa.

La hoja de ruta acordada: presentación del diagnóstico → **debrief** ~7–10 días después (dudas y pedidos adicionales de métricas) → **sesión de acuerdo de roadmap** ~10 días después (el banco dice qué hace y qué no hace) → gobernanza recurrente (weekly con el banco, weekly interna, monthly — para este banco tal vez bimestral). Moisés pidió que cada sesión terminara ya con la fecha de la siguiente, por el historial de convocatoria.

El deck del diagnóstico que mostró Rafa reorganiza las recomendaciones por **impacto × complejidad**: 3 a 5 prioritarias y 15 oportunidades adicionales, mapa de calor (quick wins, apuestas estratégicas, oportunistas, reevaluar), cálculo de oportunidad económica y próximos pasos con tareas para Visa, banco y [[Prisma]]. El informe base es de Francisco Capetillo. *(El handover de agosto hablaba de 150–200 páginas y ~40 accionables; pueden ser el informe base y el deck — `[a confirmar]`.)*

### El primer frente: fondos insuficientes en cross-border
El diagnóstico ya señalaba fondos insuficientes como motivo de rechazo n.º 1. La ejecución empezó por ahí, pero con un recorte: **operaciones internacionales**.

El **27/10** la analista Lucía mostró que, en 11 meses, **244.000 tarjetas** tuvieron al menos un rechazo internacional y **214.000 siguen activas (87,6%)**; el resto aparece con código 62 (restricción por mora, ~25.000), código 46 (cuenta cerrada, 3.966) o ambos (1.353). La propuesta de Visa: **aumento de línea dirigido** a esos 214 mil — los que de hecho compran afuera y chocan con el límite.

El banco respondió que ya había aumentado el límite de ~**600.000 cuentas** a inicios de octubre (~13/10, a verificar), por el score propio, sin distinguir doméstico de internacional. De ahí la lección de la sesión: un aumento genérico no muestra efecto si no alcanza a quien tiene el rechazo. Y como Visa solo ve mora y baja por la transaccionalidad, el cruce con los datos del banco es obligatorio.

Hipótesis discutida para el origen del problema: la **unificación de límites** hecha por el banco alrededor de abril pesa más en el cross-border, porque esas compras no son en cuotas.

La base fue entregada por **caso en Visa Access**, a nombre de Damián (solo él accede). Procedimiento acordado el 30/10: excluir mora/cerrados → revisar quién ya tuvo aumento → evaluar ajuste. **La decisión es del banco.** El cuello de botella previsible es el área de inteligencia comercial.

> [!info] Esto dialoga con el riesgo 4 de la lista de agosto
> En agosto se decía que ningún banco argentino quería ampliar la línea de crédito. Bapro la amplió — la discusión ahora es **a quién**.

### Los otros frentes
- **Redlink** — sesión conjunta sobre la configuración "hasta 4 veces el límite de excepción". Rafa escribió y no tuvo respuesta; el banco cambió de referente comercial en Redlink y la nueva ejecutiva de cuentas aún no había sido presentada al 30/10. Quedó **en standby**. El banco también presiona a Link por los rechazos de código 57 (significado no explicado en la reunión).
- **Gasto por comercio y rubro** — pedido del banco (Fede) atendido el 30/10 en dólares; quedó por ampliar en pesos y con versión de consumo local.
- **[[Tokenização|Tokenización]]** — avance el 27/10 (94% global; 93,9% tarjeta no presente; 95,6% tarjeta presente; la métrica no fue nombrada). La discusión prevista para el 30/10 no aparece en la transcripción.
- **Agrupación de [[BIN|BINs]]** — solo listada como tema abierto.

### Disputas: de informe encajonado a sesión formal
Había **dos informes trimestrales listos que nunca habían sido presentados**. El 08/09 Moisés pidió el tercero ya con presentación formal. Ocurrió el **12/11**, conducida por **Laura Gómez** (Visa Dispute Optimization), cubriendo **junio–agosto de 2026** con benchmark de emisores del Cono Sur. Agenda: contexto y alcance; visión ejecutiva (volumen e importe); categorías y concentración en el portafolio; rechazos en la plataforma al intentar generar disputas; casos que llegan a arbitraje. Próxima lectura: **diciembre de 2026** (sep–nov).

La transcripción se corta a los ~10 minutos — **ningún número del informe quedó registrado**. En esa sesión el banco presentó a **Gonzalo Campana**, nuevo subgerente del área de productos.

En paralelo existe un programa de mejora de disputas llevado por Juan Pablo directamente con [[Prisma]] (que gestiona las disputas de la mayoría de los bancos argentinos), con apoyo de Rafa — sin novedades en las fuentes.

### Línea de tiempo (agregado)
- **~jun/2026** — contrato firmado.
- **08/09/2026** — alineación interna Moisés–Rafa–Bruno; roles definidos.
- **17/09/2026** `[a confirmar]` — presentación presencial del diagnóstico.
- **~13/10/2026** `[a verificar por el banco]` — el banco aumenta el límite de ~600 mil cuentas.
- **27/10/2026** — weekly: rechazos cross-border; base de 214 mil tarjetas.
- **30/10/2026** — "tercer seguimiento": base enviada por Visa Access; gasto por comercio; Redlink en standby.
- **12/11/2026** — primera lectura formal del informe de disputas.
- **dic/2026** — próxima lectura de disputas.

### Personas que aparecieron en este período
- **Banco:** Damián "Dami" (interlocutor principal), Fede (pide análisis), Sofía, Gonzalo Campana (subgerente de productos, nuevo). Cargos y apellidos `[a confirmar]`.
- **Visa:** Rafa Polo, Juan Pablo, Lucía (datos), Moisés, Bruno, Laura Gómez y Diana (disputas), Francisco Capetillo.
- **Terceros:** Redlink / Link; [[Prisma]].

### Lo que todavía no se sabe
- Si el debrief y la sesión de roadmap ocurrieron, y qué aceptó el banco en el roadmap.
- Duración/formato del contrato: 12 meses (handover) × "30 dias + 30 a 90 de seguimento" (dicho por Bruno en un onboarding del 08/09) — verificar en el contrato.
- Si el banco llegó a designar formalmente coordinador y líderes de área, y si el implante recibió accesos y equipamiento (pendientes de agosto sin evidencia de cierre).
- Situación de las multas [[MAR (Minimum Approval Rate)|MAR]] después de marzo.

---
[[Home]]
