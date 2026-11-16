---
title: "MOC — Tokenización"
tags: ["moc"]
---

# MOC — Tokenización

Términos del glosario en esta categoría.

- [[APAN]] — Token de cuenta derivado del DPAN, para pagos multicomercio.
- [[Approve Provisioning]] — API de aprobación del token; 00 = flujo verde (sin step-up), 85 = flujo amarillo (step-up), o rechazo.
- [[Check Eligibility]] — API por la cual Visa le pregunta al emisor si un PAN es elegible para tokenización.
- [[CTF (Cloud Token Framework)]] — Device binding para tokens de e-commerce/CoF existentes; verificación del titular bajo demanda.
- [[DEF (Digital Enrollment Form)]] — Formulario de URLs y campos a nivel de PCR; junto con el Processor Digital Activation Request, insumo de las configuraciones productivas (10 días hábiles).
- [[DPAN]] — Device PAN: token en el dispositivo (Apple/Google Pay).
- [[Fluxo amarelo (85)]] — Provisioning con step-up; el token queda inactivo hasta la verificación.
- [[Fluxo verde (00)]] — Provisioning sin step-up; típico de enrolar desde dentro de la app del banco (cliente ya autenticado).
- [[FPAN]] — Funding PAN: el número real de la tarjeta/cuenta.
- [[Get CVM]] — API para obtener los métodos de verificación del titular (OTP, call center) en el step-up.
- [[ITSP]] — Issuer TSP: el proveedor de tokenización del lado del emisor (ej.: Thales en Corrientes).
- [[MPAN]] — Merchant PAN: token vinculado a un comercio (recurrencia/suscripciones).
- [[Send Passcode]] — API del flujo de OTP en el step-up.
- [[TAVV]] — Criptograma de verificación enviado en la transacción de un token.
- [[TLCM (Token Lifecycle Manager)]] — Gestión del ciclo de vida de los tokens; reasignación de tokens entre PANs (rollback no confirmado).
- [[Tokenização]] — Reemplazar el PAN por un token que se guarda en lugar del número real.
- [[TSP (Token Service Provider)]] — Proveedor de tokenización contratado por el emisor (consolas, ciclo de vida).
- [[VDP (Visa Developer Platform)]] — Portal con la documentación/specs de las APIs (ej.: BK Batch Specification de Click to Pay).
- [[Vital Sign]] — Herramienta de Visa para ver los intentos/logs de provisioning (Correlation ID / Token Reference ID).
- [[VTS (Visa Token Service)]] — Servicio de tokenización de Visa, con APIs en Visa Developer.

---
[[Home]]
