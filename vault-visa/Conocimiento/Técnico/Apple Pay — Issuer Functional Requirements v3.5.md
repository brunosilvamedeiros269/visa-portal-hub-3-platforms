---
tags: ["tecnico"]
---

# Apple Pay — Issuer Functional Requirements v3.5

> [!warning] Compliance obrigatório até **15/jan/2026** (publicado 8/jul/2025). Documento *Apple Confidential* — aqui só o mapa das exigências, para saber onde cada tema mora.

Especificação da Apple para emissores. Ligada a [[4. Carteiras — Apple Pay e Google Pay]] · [[Partner Hub]] (administrativo) · [[FIME]] (certificação).

## As 11 áreas de requisitos
1. **[[Tokenização]]** — integração com o [[TSP (Token Service Provider)|TSP]].
2. **Provisioning** — capacidades de pagamento, regras de tokenização, cartões elegíveis, menores, co-badge, [[Tap to Add Card]], continuidade do cartão.
3. **Autenticação (ID&V)** — verificação, informação *tenured*, SMS, in-app/URL, chamada inbound, mascaramento, regras de OTP/[[Step-up]], não-discriminação.
4. **App e site do emissor** — in-app provisioning no app principal, linking, featuring do Apple Pay, segurança, remote enable/disable, [[Wallet Extensions]], web provisioning.
5. **Prevenção de fraude** — verificar CV2/validade, risk recommendations, Apple Risk Data, transit open loop, reporte de fraude confirmada.
6. **Processamento** — sem limites/discriminação, distinguir transações, [[ODCVM - CDCVM|ODCVM]], token tenure, step-up, co-brand.
7. **Metadata do cartão** — card art (imagem + specs), sufixo do [[FPAN]], apresentação de T&C, customer servicing.
8. **[[Push - In-App Provisioning (fluxo verde)|Push]] notifications** — notificação de transação, ícone do emissor, histórico.
9. **Card Lifecycle Management (CLM)** — CLM automático, update de token, preservar [[DPAN]] se [[FPAN]] suspenso, apagar credenciais de conta fechada.
10. **Loyalty** — suporte a loyalty em transações tokenizadas.
11. **Notificação de provisioning** — confirmação por canal *tenured* e timing.

---
[[Home]]
