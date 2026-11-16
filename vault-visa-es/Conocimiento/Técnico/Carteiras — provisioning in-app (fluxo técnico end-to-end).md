---
tags: ["tecnico"]
fuente: Guías de la carpeta + fuentes públicas
estado: verificado
title: "Billeteras — provisioning in-app (flujo técnico end-to-end)"
---

# Billeteras — provisioning in-app (flujo técnico end-to-end)

Profundiza [[4. Carteiras — Apple Pay e Google Pay|4. Billeteras — Apple Pay y Google Pay]]. **In-app / push provisioning = [[Fluxo verde (00)|flujo verde]]**: como el cliente ya está autenticado en la app del banco (ID&V), no hay step-up extra.

## El patrón común (Apple y Google)
1. La app del banco hace el **ID&V** del cliente (login ya hecho).
2. La app obtiene material criptográfico y arma un **payload cifrado** con los datos de la tarjeta.
3. Lo envía a la billetera → la billetera/red tokeniza vía [[VTS (Visa Token Service)|VTS]] ([[Check Eligibility]] → [[Approve Provisioning]]).
4. La respuesta **00** (verde) crea el token ([[DPAN]]) en la billetera; **85** ([[Fluxo amarelo (85)|amarillo]]) exige step-up antes de activar.

Ver el flujo VTS completo en [[Tokenização — arquitetura VTS e provisioning (aprofundamento)|Tokenización — arquitectura VTS y provisioning (profundización)]].

## Apple — PassKit
- `PKAddPaymentPassViewController` presenta, **desde dentro de la app**, la UI de "agregar a Apple Pay".
- Exige el entitlement `com.apple.developer.payment-pass-provisioning` y **permiso especial de Apple**.
- La app obtiene los **certificados de provisioning del emisor**, genera material cripto y arma `{ encryptedPassData, activationData, ephemeralPublicKey }` (flujo EV_ECC_v2).
- **encryptedPassData** = JSON cifrado con los datos sensibles de la tarjeta.

## Google — [[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning API (TapAndPay)
- La **[[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning API** agrega la funcionalidad Google Wallet a la app del banco; se integra vía **[[TSP (Token Service Provider)|TSP]]**.
- **Google [[OPC]] (Opaque Payment Card):** JSON **firmado + cifrado** (OpenPGP + Base64, server-side del emisor) con los campos `protocolHeader`, `validationContext`, `paymentCard`.
- Mantener también el **[[Manual provisioning|manual provisioning]]** (con [[FPAN]]) — prerrequisito del [[UPP (Unified Push Provisioning)|UPP]] (mandato hasta fines de 2026).

## Fuentes oficiales (públicas)
- Apple: [PKAddPaymentPassViewController](https://developer.apple.com/documentation/passkit/pkaddpaymentpassviewcontroller) · [encryptedPassData](https://developer.apple.com/documentation/passkit_apple_pay_and_wallet/pkaddpaymentpassrequest/1615926-encryptedpassdata) · [PassKit](https://developer.apple.com/documentation/passkit)
- Google: [[[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning — Overview](https://developers.google.com/pay/issuers/tsp-integration/overview) · [Google Opaque Payment Card](https://developers.google.com/pay/issuers/apis/push-provisioning/android/push-provisioning-google-opc) · [Client-Side Push Provisioning Flow](https://developers.google.com/pay/client-side-push-provisioning-v1/google-client-side-push-provisioning-api/Client.Side.Push.Provisioning.Flow)

---
[[Home]]
