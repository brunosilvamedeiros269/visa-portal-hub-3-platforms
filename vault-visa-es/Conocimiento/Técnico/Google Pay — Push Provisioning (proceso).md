---
tags: ["tecnico"]
fuente: Guías de la carpeta + fuentes públicas
estado: verificado
---

# Google Pay — [[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning (proceso)

> [!info] Resumen estructurado (fuente: guías técnicas Visa/Google — contenido confidencial, aquí solo la síntesis del proceso).

[[Push - In-App Provisioning (fluxo verde)|Push]] provisioning = la app del banco envía el PAN de forma segura a Google para tokenizar ([[DPAN]]), aprovechando el ID&V de la propia app → es el [[Fluxo verde (00)|flujo verde]] (sin step-up). Reduce fricción y evita que el cliente digite la tarjeta en la billetera.

## Paso a paso (Visa · [[ITSP]] · cliente)
1. Confirmar desarrollos internos entre cliente e [[ITSP]].
2. Verificar si el cliente tiene acceso al **VDP** ([[VDP (Visa Developer Platform)|Visa Developer Platform]]); si no, crear usuarios.
3. Compartir guías de **extracción de claves** → ver [[Google Pay — Chaves VDP e criptografia|Google Pay — Claves VDP y criptografía]].
4. Compartir guías de configuración **VRM / [[VCMM]]**.
5. Certificación en el **HUB de Google Pay** — el cliente asegura las evidencias para la aprobación del lanzamiento comercial.
6. Abrir caso al Global ASC-TAM → LAC TS Implementations (~5 días hábiles).

> [!note] Observaciones
> - No aplica a Brasil ni a clientes con el **SDK de Visa**.
> - Como el servicio de Google ya es productivo, Visa no hace config en el sistema.
> - Tarifas de integración solo a partir de la 3ª reunión (más de 2 ventanas).
> - El usuario necesita tener **OpenSSL** instalado.

## Cifrado del Payment Instrument ([[VTS (Visa Token Service)|VTS]])
El PAN va cifrado en un **JWE (Encrypted Payment Instrument)** usando API Key / Shared Secret. La estructura incluye expiration date, billing address y payment instrument provider. Consideraciones del emisor: mensajes ISO y expiración de la solicitud de push provision.

---
[[Home]]
