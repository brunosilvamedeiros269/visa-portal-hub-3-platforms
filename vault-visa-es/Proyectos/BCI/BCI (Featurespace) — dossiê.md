---
tags: ["proyecto", "cliente/BCI"]
fuente: Transcripciones de sep–nov/2026 (reunión interna del 05/10, demo Featurespace del 09/10, 1:1 con Lina, Weekly Tech, weeklies SOCO)
estado: parcial
title: "BCI (Featurespace) — dossier"
---

# 🇨🇱 BCI (Featurespace) — migración de la plataforma de riesgo a SaaS

> [!success] Confirmado por Bruno el 16/11/2026
> **BCI todavía no es cliente — está en prospección**.


> [!info] Dossier de preventa (contexto cualitativo)
> **Todavía no es proyecto.** Al 16/11/2026 no hay contrato de implementación firmado. Este dossier guarda el contexto para cuando arranque — y lo que el equipo aprendió sobre el producto.

> [!warning] Contenido parcial
> Todo aquí viene de transcripciones automáticas no validadas. La reunión cuyo archivo se llama "BCI" (05/10) empieza por la mitad y **no nombra al cliente de la migración**; el vínculo con BCI se apoya en el nombre del archivo y en lo que Lina contó en los 1:1. Confirmar con Lina antes de tratarlo como hecho.

## Ficha
- **Cliente:** BCI. **País:** Chile.
- **Producto:** ARIC, la plataforma de gestión de riesgo y fraude de Featurespace.
- **Situación del banco:** tiene la plataforma desde ~2020/21, comprada vía el reseller Nuvatec e instalada en el tenant Azure del propio banco (modelo IaaS).
- **Qué se propone:** migrar al modelo SaaS y, después, evolucionar el uso.
- **Fase (16/11/2026):** preventa. Reunión con el banco agendada para el **18/11**.
- **Equipo Visa —** Sole y Rodri lideran la conversación comercial (Diego cubre a Rodri); Lina hizo la parte de tecnología del assessment y armó la propuesta; Desi cubrió en octubre; Gerard/Gerardo (preventa de productos de riesgo) `[grafía a confirmar]`; Felipe (recursos de analítica) `[área a confirmar]`; **Bruno** apoya a Lina en las arquitecturas y es el PM indicado para cuando se firme.
- **Sin Client Services:** los proyectos Featurespace corren fuera de CS.

## Por qué importa este caso
Dentro de Visa, BCI fue presentado como el **primer caso global con Featurespace** — fue candidato a premio interno en agosto y subió al escenario del LAC Market Kickoff en octubre. El 26/10 Lina resumió: ningún proyecto Featurespace está en ejecución, y BCI fue el único ya ejecutado (el assessment). Lo que se aprenda aquí se vuelve modelo para las oportunidades siguientes.

## La historia hasta aquí
**El punto de partida.** BCI opera la plataforma por cuenta propia, en infraestructura suya. El assessment de Visa — cuatro equipos: tecnología (Lina), riesgo, Core Consulting y reglas — terminó alrededor de agosto–septiembre de 2026 y encontró un ambiente difícil de sostener: sin gestión de parches, upgrade de MongoDB caro, Red Hat cerca de quedarse sin soporte, sin plan de recuperación ante desastres. En el uso, dos hallazgos de negocio: la plataforma no decide en tiempo real para el crédito del banco, y el [[Processador|procesador]] decide por fraude antes de las validaciones operativas.

**La recomendación.** Migrar a SaaS primero; después modelos de consorcio, más fuentes de datos (se citó BioCatch) y uso en línea. La razón técnica dada por Lina: en SaaS los modelos de consorcio son casi plug-and-play; en IaaS exigen consultores y cuestan caro.

**La propuesta.** En fases — SaaS → modelos de machine learning → cambio de flujo —, con la misma plantilla usada para Banco de Chile. El 05/10 el PPT estaba listo y faltaban los números. La estimación de esfuerzo que circuló ese día: **123 días = US$ 184.000**, todavía por validar internamente.

**El reloj de las licencias.** Las licencias del banco vencían en septiembre y fueron renovadas temporalmente hasta **diciembre**, mientras se firma el paso a SaaS.

**El freno.** El equipo de analítica tiene restricción global de capacidad. El 05/10 la lectura era: improbable en Q1, más realista **Q2 FY27** (a partir de ~enero), y solo con reserva anticipada. Se decidió **no prometer Q1** al cliente.

**Octubre–noviembre.** Desi retomó el contacto con el banco el 09/10 y encontró los datos de costo desalineados — el banco había pasado números diferentes en dos momentos; había que fijar un baseline antes de enviar la propuesta. En noviembre la conducción pasó a Rodri y Sole. La reunión del 11/11 fue cancelada por "Tiago" `[quién es: a confirmar]` y reagendada para el **18/11**.

## Qué es ARIC (demo del 09/10)
Federico le presentó al equipo la demo inicial estándar — la misma que se da a emisores y adquirentes.

- **No es solo un motor de reglas ni solo un score**: es la plataforma entera de gestión de riesgo. Decide en tiempo real, near-real-time y batch.
- **Soluciones modulares**: crimen financiero, tarjetas y autenticación, pagos en tiempo real y canales digitales, adquirencia (dos módulos), onboarding. Cada una con reglas adaptativas por comportamiento y modelo de machine learning propio.
- **SaaS en AWS**, interfaz web, un ambiente aislado por cliente. Usuarios y actualizaciones de versión incluidos.
- **Tres canales**: interfaz de usuario, una API de eventos única, y salida de datos por S3 hacia el data lake del cliente.
- **Retención**: 3 meses en vivo, 13 meses de histórico. Para auditoría de 2 años, el cliente tiene que exportar.
- **Operación**: las alertas se agrupan en incidentes por entidad; los filtros se vuelven colas de trabajo; el analista marca riesgo/genuino y eso realimenta los modelos.
- **Multi-tenancy**: una procesadora puede revender creando tenants por banco.

> [!bug] Limitaciones dichas abiertamente
> Reportes internos a día cerrado y BI débil (la apuesta es el BI del cliente). Sin SLA nativo por incidente. No es un orquestador — cada flujo externo es desarrollo aparte. Pruebas de concepto analíticas suspendidas por falta de capacidad. Migrar histórico de otro sistema es posible, pero difícil, y la generación de los datos queda a cargo del [[Emissor|emisor]].

La parte de analítica (perfiles, reglas, modelos) quedó para una segunda sesión; no hay transcripción de ella.

## Para no confundir: las otras oportunidades Featurespace
| Cliente | Qué es | Estado |
|---|---|---|
| **Banco de Chile** | Solución de tarjetas; sería la primera con integración directa [[VisaNet]] → Featurespace. El banco quiere internalizar la gestión de fraude que hoy hace el procesador. Assessment primero, implementación después | Preventa; el banco indicó Q2 FY27 |
| **Galicia** | Assessment de riesgo solo del banco: 3 meses + 6 de modelo operativo | Propuesta revisada; falta llevarla al cliente |
| **BROU** | — | En espera |
| **BBVA Uruguay** | — | Prospect nuevo (Q2/Q3) |

La oportunidad Featurespace de Banco de Chile **no es** el proyecto Nexus–Nuek del mismo banco.

## Riesgos que ya se ven
1. Capacidad del equipo de analítica — es lo que define la fecha, no la voluntad del cliente.
2. Las licencias temporales vencen en diciembre sin el paso a SaaS firmado.
3. Un baseline de costos inconsistente atrasa la propuesta.
4. Integración [[VisaNet]] → Featurespace todavía en roadmap (anuncio esperado para nov/2026, incierto).

## Lecciones que Lina dejó del assessment
- Coordinar bien las entrevistas con el banco.
- Evitar la pérdida de contexto entre sesiones.
- Transcribir todo y guardarlo en un repositorio central.
- Contar con ~6 meses de datos mínimos para buenas decisiones; la calidad de los datos es trabajo del cliente.

## Línea de tiempo
- **~2020/21** — BCI compra la plataforma vía Nuvatec; la instala en Azure propio.
- **~ago–sep/2026** — assessment Visa concluido.
- **sep/2026** — licencias renovadas temporalmente hasta diciembre.
- **05/10/2026** — alineación interna: 123 días / US$ 184 mil; recursos solo en Q2.
- **09/10/2026** — demo ARIC para el equipo; Desi retoma el contacto con el banco.
- **22/10/2026** — caso BCI/Featurespace en el LAC Market Kickoff.
- **26/10/2026** — Bruno entra para apoyar la propuesta (arquitecturas as-is / to-be).
- **10/11/2026** — BCI indicado como próximo proyecto de Bruno; no firmado.
- **11/11/2026** — reunión con el banco cancelada.
- **18/11/2026** — reunión reagendada (Rodri + Sole).

## Qué falta confirmar
- Que la ficha "plataforma de riesgo SaaS" de la base es realmente BCI.
- Quién es "Tiago" y cuál es la agenda del 18/11.
- Si los 123 días / US$ 184 mil son la estimación de BCI.
- A qué corresponden los valores de pipeline citados (~US$ 150 mil; "2 proyectos ≈ US$ 270 mil").
