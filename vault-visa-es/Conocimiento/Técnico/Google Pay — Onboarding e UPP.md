---
tags: ["tecnico"]
fuente: Guías de la carpeta + fuentes públicas
estado: verificado
title: "Google Pay — Onboarding y UPP"
---

# Google Pay — Onboarding ([[Issuer Console]]) y [[UPP (Unified Push Provisioning)|UPP]]

Al agregar la tarjeta en Google Pay, el usuario recibe: **[[DPAN]]** (device token), **card-on-file** ([[FPAN]] + vencimiento + nombre) y/o **cloud token**.

## Onboarding en el [[Issuer Console]] (Google Pay & Wallet Console)
1. Ingresar al **[[Issuer Console]]** con e-mail corporativo (asociarlo a una Google Account si hace falta).
2. Nombre público, ubicación y tipo = **Financial Institution**; aceptar los Terms of Service.
3. Crear el **Business Profile** (obligatorio antes de lanzar cualquier cosa).
4. Habilitar la **[[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning API** y completar los **Issuer Details** (firmante, países, portafolio, redes, [[BID]] de Visa).
5. Queda "In Review" hasta tener **NDA + [[CTA (Click-to-Accept)|CTA]]** firmados. Google **prohíbe tokenizar en producción antes del CTA**.

## [[UPP (Unified Push Provisioning)]]
Evolución del push provisioning; **mandato de migración hasta fines de 2026**. Los emisores nuevos integran directo en UPP; prerrequisito mantener también el **[[Manual provisioning|manual provisioning]]**. Ver [[UPP (Unified Push Provisioning)]].

---
[[Home]]
