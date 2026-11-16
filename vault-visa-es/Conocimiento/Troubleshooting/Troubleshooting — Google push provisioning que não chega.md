---
title: "Troubleshooting — Google push provisioning que no llega"
tags: ["troubleshooting"]
fuente: Reports/minutas de proyecto
estado: verificado
---

# Troubleshooting — Google push provisioning que no llega

> [!bug] Síntoma
> Algunos aprovisionamientos en Google Pay **fallan** y el intento **nunca aparece** en el procesador ni en las herramientas de Visa.

## Diagnóstico
- Si el intento no llega al procesador **ni** a Visa → el problema está **antes**, en la integración **banco ↔ Google** (config/credenciales), no en Visa.
- Comparar casos que funcionan vs. los que fallan (flujo amarillo/verde).

## Acciones
- El banco levanta un **ticket directo con Google** + extrae **logs** de las casuísticas fallidas.
- Aprovechar una **sesión técnica de Visa** (~30 min, gratuita) con preguntas preparadas, apenas Google responda.
- Revisar la **[[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning API** en el [[Google Pay — Onboarding e UPP|Issuer Console]] y las claves ([[Google Pay — Chaves VDP e criptografia|Google Pay — Claves VDP y criptografía]]).

> [!example] Visto en producción
> [[BROU — dossiê|BROU]] (Google Pay) — aprovisionamientos fallidos que no llegaban a [[Sistarbank]]/Visa.

---
[[Home]]
