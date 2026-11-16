---
tags: ["tecnico"]
fuente: Guías de la carpeta + fuentes públicas
estado: verificado
---

# Apple Pay — Issuer Functional Requirements v3.5

> [!warning] Compliance obligatorio hasta el **15/ene/2026** (publicado 8/jul/2025). Documento *Apple Confidential* — aquí solo el mapa de las exigencias, para saber dónde vive cada tema.

Especificación de Apple para emisores. Vinculada a [[4. Carteiras — Apple Pay e Google Pay|4. Billeteras — Apple Pay y Google Pay]] · [[Partner Hub]] (administrativo) · [[FIME]] (certificación).

## Las 11 áreas de requisitos
1. **[[Tokenização|Tokenización]]** — integración con el [[TSP (Token Service Provider)|TSP]].
2. **Provisioning** — capacidades de pago, reglas de tokenización, tarjetas elegibles, menores, co-badge, [[Tap to Add Card]], continuidad de la tarjeta.
3. **Autenticación (ID&V)** — verificación, información *tenured*, SMS, in-app/URL, llamada inbound, enmascaramiento, reglas de OTP/[[Step-up]], no discriminación.
4. **App y sitio del emisor** — in-app provisioning en la app principal, linking, featuring de Apple Pay, seguridad, remote enable/disable, [[Wallet Extensions]], web provisioning.
5. **Prevención de fraude** — verificar CV2/vencimiento, risk recommendations, Apple Risk Data, transit open loop, reporte de fraude confirmado.
6. **Procesamiento** — sin límites/discriminación, distinguir transacciones, [[ODCVM - CDCVM|ODCVM]], token tenure, step-up, co-brand.
7. **Metadata de la tarjeta** — card art (imagen + specs), sufijo del [[FPAN]], presentación de T&C, customer servicing.
8. **[[Push - In-App Provisioning (fluxo verde)|Push]] notifications** — notificación de transacción, ícono del emisor, historial.
9. **Card Lifecycle Management (CLM)** — CLM automático, update de token, preservar el [[DPAN]] si el [[FPAN]] está suspendido, borrar credenciales de cuenta cerrada.
10. **Loyalty** — soporte a loyalty en transacciones tokenizadas.
11. **Notificación de provisioning** — confirmación por canal *tenured* y timing.

---
[[Home]]
