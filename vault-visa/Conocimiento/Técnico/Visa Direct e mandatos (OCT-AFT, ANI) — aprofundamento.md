---
tags: ["tecnico"]
---

# [[Visa Direct]] e mandatos ([[OCT - AFT|OCT]]-AFT, [[ANI]]) — aprofundamento

Aprofunda [[7. Mandatos e Waivers]]. Síntese + fontes públicas. No [[BROU — dossiê|BROU]], estes são dois dos mandatos em escopo.

## [[Visa Direct]] — o trilho de push payments
[[Visa Direct]] permite a *originators* (bancos, fintechs) **empurrar fundos** direto para um cartão Visa. Casos de uso: P2P, disbursements, cargas de pré-pago, pagamento de fatura.

## [[OCT - AFT|OCT]] × AFT
| | O que faz |
|---|---|
| **[[OCT - AFT|OCT]]** (Original Credit Transaction) | **Empurra** (credita) fundos para um cartão Visa elegível. Pode ser fundeado por várias fontes (conta de rede, conta bancária). |
| **[[OCT - AFT|AFT]]** (Account Funding Transaction) | **Puxa** fundos de um cartão para fundear um OCT a outra conta (do próprio titular ou de terceiro). Só fundeia contas não-comerciais. |

Submetido o AFT/[[OCT - AFT|OCT]] (via API ou ISO), ele viaja pela rede e usa os mecanismos de **[[Clearing]]** e **[[Settlement]]** já existentes. Em alguns países, a Visa exige disponibilizar os fundos ao titular em **até 30 min** da aprovação.

## [[ANI]] — Account Name Inquiry
Capability do **Visa Account Verification**: uma mensagem de autorização de **valor zero** que confirma se o **nome** informado bate com o nome que o **[[Emissor|emissor]]** tem em registro — antes de mandar a autorização (útil em card-not-present).
- O originador envia nome (first / middle / last) + PAN, validade e, opcionalmente, CVV2 / billing address.
- O **algoritmo de match** da Visa retorna resultado **por nome** + um resultado geral.
- Consome-se via **Payment Account Validation (PAV) API**; pode rodar junto com AVS e CVV2.
- No BROU: **[[Waiver|waiver]] até agosto/2026**; a Visa confirmou que as validações **não têm custo**.

## Fontes oficiais (públicas)
- [[[Visa Direct]] — Getting Started (Developer)](https://developer.visa.com/capabilities/visa_direct/docs) · [Visa Direct FAQ](https://usa.visa.com/supporting-info/visa-direct/visa-direct-faq.html)
- [Payment Account Validation / [[ANI]] (Developer)](https://developer.visa.com/capabilities/pav/docs) · [Verify cardholder information (Visa)](https://corporate.visa.com/en/solutions/acceptance/verification.html)

---
[[Home]]
