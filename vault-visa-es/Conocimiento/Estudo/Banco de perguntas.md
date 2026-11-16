---
title: "Banco de preguntas (con respuestas)"
tags: ["estudo"]
fuente: Notas de estudio (Notion)
estado: verificado
---

# Banco de preguntas (con respuestas)

Responda de memoria y haga clic para revelar. Si acertó la idea central, está dominado. Ver [[Plano de estudos|Plan de estudios]].

## P1 · Fundamentos de pagos
<details><summary>Dibuje el camino de una compra, desde el inicio hasta que vuelve la aprobación.</summary>

Tarjetahabiente → Comercio → [[Adquirente]] → Visa ([[VisaNet]]) → [[Processador|Procesador]] → [[Emissor|Emisor]]. El emisor (o el procesador en su nombre) verifica saldo/fraude y aprueba; la respuesta vuelve por el camino inverso.
</details>
<details><summary>¿Cuál es la diferencia entre autorización, clearing y settlement?</summary>

**Autorización:** aprobación en tiempo real (chequea saldo/fraude) — pero el dinero no se mueve. **[[Clearing]]:** intercambio y conciliación de la información. **[[Settlement]]:** liquidación, cuando el dinero efectivamente se mueve (en lotes).
</details>
<details><summary>Diferencie procesador, adquirente y emisor.</summary>

[[Emissor|Emisor]] = banco del cliente. [[Adquirente]] = banco del comercio. [[Processador|Procesador]] = empresa técnica que opera los mensajes por cuenta de un emisor O adquirente. [[Sistarbank]] (BROU) y [[Prisma]] (Corrientes) son procesadores emisores.
</details>
<details><summary>¿Qué son los mensajes 0100 y 0110?</summary>

Tipos de mensaje del estándar [[ISO 8583]]: 0100 = solicitud de autorización, 0110 = respuesta.
</details>

## P2 · [[Tokenização|Tokenización]]
<details><summary>¿Por qué casi ningún emisor se conecta directo al [[VTS (Visa Token Service)|VTS]]?</summary>

Porque el [[TSP (Token Service Provider)|TSP]] entrega valor agregado — gestiona el ciclo de vida de los tokens y ofrece consolas. Sin él, el banco tendría que programar todo.
</details>
<details><summary>¿Qué cambia entre el flujo verde y el amarillo?</summary>

Verde ([[Approve Provisioning]] = 00): aprobación incondicional, sin step-up (enrolar desde dentro de la app del banco). Amarillo (85): condicional; el token queda inactivo hasta una verificación adicional (OTP, call center, app-to-app).
</details>
<details><summary>[[FPAN]], [[DPAN]] y [[MPAN]] — ¿qué es cada uno?</summary>

[[FPAN]] = número real de la tarjeta. [[DPAN]] = token en el dispositivo (Apple/Google Pay). [[MPAN]] = token vinculado a un comercio (recurrencia).
</details>
<details><summary>¿Qué son [[CTF (Cloud Token Framework)|CTF]] y [[TAVV]]?</summary>

[[CTF (Cloud Token Framework)]]: device binding para tokens de e-commerce/CoF existentes. [[TAVV]]: criptograma de verificación enviado en la transacción de un token.
</details>

## P3 · Billeteras (Apple / Google)
<details><summary>Cite tres prerrequisitos que Apple exige y Google no.</summary>

Laboratorio [[FIME]] con fecha objetivo; [[Wallet Extensions]]; y el contrato/NDA específico de Apple. Google pide bastante menos.
</details>
<details><summary>¿Por qué Google no deja tokenizar en producción antes del [[CTA (Click-to-Accept)|CTA]]?</summary>

El [[CTA (Click-to-Accept)|CTA]] autoriza el uso de las APIs de push provisioning. Google prohíbe cualquier tokenización en producción antes de aceptarlo — acuerdo estándar y no personalizable.
</details>
<details><summary>Un cliente dice que el push provisioning crashea. ¿Primeras hipótesis?</summary>

Ver si la config de Visa está OK (¿el flujo amarillo funciona? ¿T&C cargados?). Si es así, el problema está en el [[ITSP]]/SDK: revisar el payload/token de login (expiración), publicar en [[TestFlight]], confirmar el [[AID (Apple)|AID]] y comparar vía Correlation ID / Token Reference ID ([[Vital Sign]]).
</details>
<details><summary>¿Qué es el mandato [[UPP (Unified Push Provisioning)|UPP]] y hasta cuándo rige?</summary>

[[UPP (Unified Push Provisioning)|Unified Push Provisioning]]; todos los emisores deben migrar hasta fines de 2026. Prerrequisito: mantener también el manual provisioning.
</details>
<details><summary>¿El [[Partner Hub]] es técnico o administrativo?</summary>

Administrativo (bines, productos, certificador, marketing). Los problemas técnicos de push provisioning no se resuelven allí.
</details>

## P4 · [[Click to Pay]]
<details><summary>¿Por qué [[Click to Pay]] es cross-emisor y cross-marca?</summary>

Porque es una solución de industria (SRC/[[SRC - EMVCo|EMVCo]]). Al iniciar sesión (email o teléfono, vía OTP), el lookup lista todas las credenciales asociadas a ese contacto — Visa, Mastercard, de varios bancos.
</details>
<details><summary>¿Cuáles son las tres fases del mandato — y cuál no tiene [[TPM (Technical Project Manager)|TPM]]?</summary>

(1) [[Enrolamento massivo|Enrolamiento masivo]] + T&C + data privacy; (2) ciclo de vida en los canales del emisor; (3) logo [[Click to Pay]]. La fase (2), ciclo de vida, no tiene [[TPM (Technical Project Manager)|TPM]].
</details>
<details><summary>¿Qué pasa con el perfil del [[Destination Site]] después del enrolamiento masivo?</summary>

Queda en solo lectura: el usuario ya no gestiona nada desde allí. Toda la gestión pasa a los canales del emisor.
</details>

## P5 · Mandatos, waivers y PMO
<details><summary>Diferencia entre mandato y waiver — ¿y quién concede el waiver de una billetera?</summary>

[[Mandato]]: regla de Visa; incumplirla genera multa, pero no detiene el servicio. [[Waiver]]: permiso temporal, con compromiso futuro. En las billeteras, quien lo concede es Google/Apple (no Visa). Exige evidencia escrita.
</details>
<details><summary>¿En qué paso del flujo entramos nosotros, y qué valida la apertura del proyecto?</summary>

Entramos en el paso 5 (prerrequisitos). La apertura solo ocurre con el 100% de los prerrequisitos + contrato, vía ticket en la [[VCMM]] (con apoyo del [[CSM (Customer Success Manager)|CSM]]).
</details>
<details><summary>El cliente te presiona por una fecha. ¿Qué se puede (y qué no) prometer?</summary>

No comprometer plazo por cuenta propia. Se puede pedir a las implementaciones un plan de alto nivel y presentar ese plan validado. Nunca mostrar el cronograma de un proyecto parecido.
</details>
<details><summary>¿Para qué sirven [[VCMM]], [[PRM (Visa Access)|PRM]] y [[Whitelist]]?</summary>

[[VCMM]]: plataforma de Visa para clientes (apertura vía ticket, artes, T&C). [[PRM (Visa Access)]]: enrolar al [[ITSP]] como [[Third Party Agent]]. [[Whitelist]]: lista de PANs liberada con el procesador para la fase de testing.
</details>

---
[[Home]]
