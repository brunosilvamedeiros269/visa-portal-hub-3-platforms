---
tags: ["proyecto", "cliente/Grupo-Petersen"]
fuente: Transcripciones automáticas de sep–nov/2026 (kickoff 12/11, Tesorería 12/11, alineación interna 12/11, demo VDMU 16/11, Weekly Tech)
estado: parcial
title: "Grupo Petersen — dossier"
---

# 🇦🇷 Grupo Petersen (Argentina) — Proyecto Fusión

> [!info] Dossier de proyecto (contexto cualitativo)
> El seguimiento **vivo** está en la app. Aquí queda el contexto, la historia y el porqué de las decisiones.

> [!warning] Fuente no validada
> Todo lo que está aquí viene de transcripciones automáticas, con hablantes anonimizados y nombres corrompidos. Lo que lleva `[a confirmar]` no fue validado con las personas.

## Ficha
- **Cliente:** Grupo Petersen. **País:** Argentina.
- **Proyecto:** PMO de la integración bancaria ("Proyecto Fusión"). No es un proyecto de billetera ni de producto: es orquestación.
- **Rol de Visa:** PMO — Bruno (PM) y Desiree "Desi" Ovejero (client facing). Solo VCA, sin CS.
- **Duración dicha:** 9 meses, de nov/2026 a jul/2027.
- **[[Processador|Procesador]]:** [[Prisma]], para todos los bancos, antes y después de la fusión.
- **Contactos —** Grupo: Carolina "Caro" (lidera), Ricardo "Richard", "Macu", Mariana (APIs), "Ale", Adrián, Mario `[apellidos y cargos a confirmar]`. Visa: Gabriela "Gaby" y Damián "Dami" (llevaban el tema antes de la PMO) `[cargos a confirmar]`, Cindy (Tesorería), Alexis (productos digitales Cono Sur), Débora (Benefits), Ale Rosa y Agustín Cánovas (BD). [[Prisma]]: Diego Echevarría `[grafía a confirmar]`.

## Estado actual (base: demo del 16/nov/2026)
**Ámbar (sugerencia).** El proyecto está en el primer mes, en fase de relevamiento: kickoff hecho, dos sesiones temáticas realizadas (Tesorería y arte digital), ningún frente con plan cerrado. No hay atraso. El ámbar viene de cuatro cabos sueltos que dependen de terceros o de áreas internas: confirmación escrita de Google y Apple, respuesta sobre mandatos, relevamiento de Tesorería y la entrada de [[Prisma]] en la conversación con Visa.

## Cómo nació el proyecto
La cuenta entró en la pipe como **Issuer Wallet**. El 28/sep la propuesta estaba lista, pero al cliente le pareció cara y el equipo alertó que serían 4 bancos. Al día siguiente la conversación cambió: si tres de los cuatro bancos van a unificarse, no tiene sentido certificar una billetera por banco. Soledad pidió una línea nueva en la pipe, "Integración Bancos", para un PM que orquestara la integración. El 05/oct la recomendación de BD y de Damián fue retomar el Issuer Wallet solo después de la fusión; el 19/oct fue cancelado internamente.

La propuesta de PMO fue cargada, el cliente "teoricamente disse sim" (02/nov) y el 05/nov se anunció el contrato con Bruno como responsable. Dos puntos de contexto dichos en la Weekly Tech del 11/nov ayudan a calibrar la postura: el proyecto del cliente ya llevaba más de seis meses en marcha cuando entró la PMO, y el cliente aceptó la PMO con reservas. El objetivo declarado es ser visto como socio estratégico. Por eso el kickoff se diseñó simple: dentro de la semanal que ya existía, con pocas láminas, adaptadas del deck de la PMO de Macro.

## Qué es la fusión (corregido por la clienta)
> [!important] No nace un banco nuevo
> En el kickoff, la clienta corrigió la lámina de Visa. Banco Entre Ríos (BERSA) y Banco San Juan **se integran al Banco Santa Fe**. Santa Fe mantiene el CUIT, cambia de nombre (aún indefinido) y de imagen, y tiene un upgrade tecnológico. El Banco Santa Cruz queda separado.

- Para Visa, 4 emisores pasan a 2.
- Son dos momentos: nueva marca de Santa Fe el **21/jun/2027** `[día a confirmar]` e integración de Entre Ríos y San Juan el **9/jul/2027**. De febrero hasta la migración el cliente está en pruebas.
- El grupo quiere una integración "copy-paste" hacia dentro de Santa Fe. Damián resumió el principio: replicar en el [[Emissor|emisor]] resultante lo que existe hoy y simplificar después.
- La misma operación tiene dos nombres según quién mira: para [[Prisma]] es una reclasificación (mismas cuentas, [[BIN|BINs]] reasignados); para Visa son bancos independientes y se trata de una transferencia.
- Ninguno de los bancos es principal member. Garantías y operativa de liquidación pasan por [[Prisma]]; el banco solo recibe la factura.

## Historial (línea de tiempo)
- **28/sep/2026** — Issuer Wallet: propuesta lista; al cliente le pareció cara.
- **29/sep** — Nace la línea "Integración Bancos" en la pipe.
- **05/oct** — Issuer Wallet queda para después de la fusión. Reunión "Following Grupo Petersen PMO Proyecto 1" (sin transcripción).
- **19/oct** — Issuer Wallet cancelado internamente.
- **22/oct** — Minuta con 8 frentes (contratos Google/Apple, tokenización/Click to Pay, BINs, plásticos, mandatos, denominación, accesos, plataformas).
- **02/nov** — Propuesta de PMO cargada; el cliente dijo que sí.
- **05/nov** — Contrato anunciado; Bruno designado.
- **12/nov** — **Kickoff de la PMO**; por la tarde, sesión con Tesorería; después, alineación interna.
- **13/nov** — Reunión interna Visa sobre los códigos de tesorería.
- **16/nov** — **Demo VDMU**. La sesión con [[Prisma]] prevista para las 14h no ocurrió.
- **18/nov** — Reunión interna con Cindy, que queda fuera hasta el 27/nov.
- **19/nov** — Próxima semanal con el cliente.

## Kickoff (12/nov/2026)
La PMO presentó cinco funciones: gobernanza (roles y semanal), planificación y seguimiento, coordinación entre áreas y bancos, gestión de riesgos y documentación en un archivo único. La parte más útil vino del cliente, en tres pedidos claros:

- **Nada puede ser bloqueante para la migración.** De ahí la pregunta sobre [[Mandato|mandatos]]: si alguno exige [[Waiver|waiver]], el grupo quiere saberlo ya.
- **Confirmaciones por escrito.** Google y Apple respondieron verbalmente que la fusión no exige nada en los contratos. Visa quiere eso por escrito y aún no lo consiguió. Lo mismo vale para la [[Tokenização|tokenización]] y para la duda de si el cliente final tiene que volver a enrolar la tarjeta en las billeteras.
- **[[Prisma]] en la misma mesa.** Se acordó traerla al espacio Visa–Grupo, porque el espacio que el grupo ya tiene con ella trata de otras marcas y otros temas.

## Sesión de Tesorería (12/nov/2026)
El tema es [[Settlement|liquidación]]: cómo los fondos calculados por Visa llegan a la cuenta correcta después de la fusión. Entran aquí las cuentas de liquidación internacional y doméstica, las jerarquías de liquidación, las licencias, los nombres legales y los reportes.

La pieza central son los **"numéricos de tesorería"**: identificadores que Visa asigna y comparte con el [[Processador|procesador]], cada uno vinculado a una cuenta de liquidación. Al ceder los [[BIN|BINs]] de San Juan y BERSA a Santa Fe, hay que decidir qué numérico apunta a dónde. El grupo no conoce esos códigos, porque quien los opera es [[Prisma]].

La sesión dejó dos mensajes Visa diferentes. Cindy pidió un relevamiento completo antes de hablar con [[Prisma]] ([[BID|BIDs]] de las cuatro instituciones, jerarquías, cuentas, nombres legales) y lo trató como requisito para asignar un implementador. Damián dijo que hay tiempo de sobra. La clienta salió pidiendo que el tema no se vuelva bloqueante.

> [!note] Lo que el equipo sacó de la sesión
> Fue demasiado técnica para la audiencia y no había nadie de tesorería del banco. Regla adoptada: reunión interna con cada equipo Visa **antes** de cada sesión con el cliente. La próxima de Tesorería debe tener a la tesorería del banco y, de preferencia, a [[Prisma]].

## VDMU — arte digital del parque tokenizado (16/nov/2026)
El problema del grupo: en la fusión, todas las tarjetas de Santa Fe, San Juan y BERSA cambian de arte y de nombre de emisor, incluidas las que ya están en billeteras digitales.

El **Visa Dynamic Metadata Updater** resuelve la parte Visa sin desarrollo. El emisor cambia el arte en el portal de metadata ([[VCMM]] `[grafía del portal a confirmar]`, al que se accede por [[PRM (Visa Access)|Visa Access]]) y Visa notifica a los token requesters en su nombre ([[OBO (On-Behalf-Of)|OBO]]), que van a buscar la novedad al [[VTS (Visa Token Service)|VTS]]. Sin el VDMU, cambiar el arte en el portal solo vale para nuevos aprovisionamientos.

- **Límites:** solo credenciales Visa; solo por account range (el grupo ya usa esa configuración).
- **Fechas:** todos los emisores LAC quedan enrolados a partir de feb/2027, con opt-out. Como la fusión es en junio, no hace falta pedir activación anticipada.
- **Precio:** cobro desde el 01/feb/2027, por notificación exitosa a un device token. E-commerce / card-on-file no se cobra inicialmente.

> [!warning] Precio ambiguo
> El valor se dijo como "0,01 centavos de dólar". Puede ser US$ 0,01 o 0,01 centavo: 100 veces de diferencia. El grupo tiene ~2 millones de clientes con enrolamiento automático en MODO, más Apple y Google, o sea hasta 3 notificaciones por credencial. **Confirmar en el comunicado Visa antes de hacer cualquier cuenta.**

Las tarjetas Mastercard del grupo quedan fuera: el grupo tiene que verlo con la otra marca.

## Decisiones y porqué
| Decisión | Porqué |
|---|---|
| Issuer Wallet solo después de la fusión | Certificar 4 bancos cuando 3 van a unificarse no tiene sentido |
| PMO solo con VCA | Proyecto de orquestación, sin implementación de producto por CS |
| [[Prisma]] viene al espacio Visa–Grupo | El otro espacio del grupo con Prisma mezcla marcas y temas |
| Tesorería: interno Visa → cliente → Prisma | Evitar accionar al procesador sin que Visa tenga la fotografía completa |
| VDMU en lugar de la API de metadata | Evita integrar, certificar y mantener una API para un uso único |

## Riesgos de fondo
- **Dependencia de [[Prisma]].** Ejecuta casi todo y se reúne con el cliente los lunes sin Visa. Propuesta de Desi: dos cadencias semanales, una banco+Visa y otra tripartita, como en la PMO de Macro.
- **Palabra sin papel.** Contratos de billeteras y re-enrolamiento están resueltos solo verbalmente.
- **Tesorería.** Cindy ausente del 18 al 27/nov, con devolución al cliente prometida para el 19/nov.
- **Percepción de valor.** La PMO entró tarde en un proyecto del cliente; cada sesión mal preparada pesa más.

## Pendiente de definición
- Día exacto de la nueva marca de Santa Fe y nombre nuevo del banco.
- Frentes "accesos" y "plataformas" y el tema [[Click to Pay]]: no tratados hasta el 16/nov.
- Benefits: sesión con el grupo por agendar.
- Cargos de Gabriela y Damián; quién es la "Gaby" antes citada como PM.
- Duración contractual: "9 meses" × anotación "3 meses" en la Weekly Tech del 11/nov.
