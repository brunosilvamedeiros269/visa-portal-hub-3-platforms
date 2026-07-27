---
tags: ["tecnico"]
---

# Carteiras — provisioning in-app (fluxo técnico end-to-end)

Aprofunda [[4. Carteiras — Apple Pay e Google Pay]]. **In-app / push provisioning = [[Fluxo verde (00)|fluxo verde]]**: como o cliente já está autenticado no app do banco (ID&V), não há step-up extra.

## O padrão comum (Apple e Google)
1. O app do banco faz o **ID&V** do cliente (login já feito).
2. O app obtém material criptográfico e monta um **payload criptografado** com os dados do cartão.
3. Envia à carteira → a carteira/rede tokeniza via [[VTS (Visa Token Service)|VTS]] ([[Check Eligibility]] → [[Approve Provisioning]]).
4. Resposta **00** (verde) cria o token ([[DPAN]]) na carteira; **85** ([[Fluxo amarelo (85)|amarelo]]) exige step-up antes de ativar.

Ver o fluxo VTS completo em [[Tokenização — arquitetura VTS e provisioning (aprofundamento)]].

## Apple — PassKit
- `PKAddPaymentPassViewController` apresenta, **de dentro do app**, a UI de "adicionar ao Apple Pay".
- Exige o entitlement `com.apple.developer.payment-pass-provisioning` e **permissão especial da Apple**.
- O app obtém os **certificados de provisioning do emissor**, gera material cripto e monta `{ encryptedPassData, activationData, ephemeralPublicKey }` (fluxo EV_ECC_v2).
- **encryptedPassData** = JSON criptografado com os dados sensíveis do cartão.

## Google — [[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning API (TapAndPay)
- A **[[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning API** adiciona a funcionalidade Google Wallet ao app do banco; integra via **[[TSP (Token Service Provider)|TSP]]**.
- **Google [[OPC]] (Opaque Payment Card):** JSON **assinado + criptografado** (OpenPGP + Base64, server-side do emissor) com os campos `protocolHeader`, `validationContext`, `paymentCard`.
- Manter também o **[[Manual provisioning|manual provisioning]]** (com [[FPAN]]) — pré-requisito do [[UPP (Unified Push Provisioning)|UPP]] (mandato até fim de 2026).

## Fontes oficiais (públicas)
- Apple: [PKAddPaymentPassViewController](https://developer.apple.com/documentation/passkit/pkaddpaymentpassviewcontroller) · [encryptedPassData](https://developer.apple.com/documentation/passkit_apple_pay_and_wallet/pkaddpaymentpassrequest/1615926-encryptedpassdata) · [PassKit](https://developer.apple.com/documentation/passkit)
- Google: [[[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning — Overview](https://developers.google.com/pay/issuers/tsp-integration/overview) · [Google Opaque Payment Card](https://developers.google.com/pay/issuers/apis/push-provisioning/android/push-provisioning-google-opc) · [Client-Side Push Provisioning Flow](https://developers.google.com/pay/client-side-push-provisioning-v1/google-client-side-push-provisioning-api/Client.Side.Push.Provisioning.Flow)

---
[[Home]]
