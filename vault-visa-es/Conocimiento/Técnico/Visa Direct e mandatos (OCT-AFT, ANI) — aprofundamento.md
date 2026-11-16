---
tags: ["tecnico"]
fuente: Guías de la carpeta + fuentes públicas
estado: verificado
title: "Visa Direct y mandatos (OCT-AFT, ANI) — profundización"
---

# [[Visa Direct]] y mandatos ([[OCT - AFT|OCT]]-AFT, [[ANI]]) — profundización

Profundiza [[7. Mandatos e Waivers|7. Mandatos y Waivers]]. Síntesis + fuentes públicas. En el [[BROU — dossiê|BROU]], estos son dos de los mandatos en alcance.

## [[Visa Direct]] — el riel de push payments
[[Visa Direct]] permite a los *originators* (bancos, fintechs) **empujar fondos** directo a una tarjeta Visa. Casos de uso: P2P, disbursements, cargas de prepago, pago de factura.

## [[OCT - AFT|OCT]] × AFT
| | Qué hace |
|---|---|
| **[[OCT - AFT|OCT]]** (Original Credit Transaction) | **Empuja** (acredita) fondos a una tarjeta Visa elegible. Puede fondearse desde varias fuentes (cuenta de red, cuenta bancaria). |
| **[[OCT - AFT|AFT]]** (Account Funding Transaction) | **Extrae** fondos de una tarjeta para fondear un OCT a otra cuenta (del propio titular o de un tercero). Solo fondea cuentas no comerciales. |

Una vez enviado el AFT/[[OCT - AFT|OCT]] (vía API o ISO), viaja por la red y usa los mecanismos de **[[Clearing]]** y **[[Settlement]]** ya existentes. En algunos países, Visa exige poner los fondos a disposición del titular en **hasta 30 min** desde la aprobación.

## [[ANI]] — Account Name Inquiry
Capability de **Visa Account Verification**: un mensaje de autorización de **valor cero** que confirma si el **nombre** informado coincide con el nombre que el **[[Emissor|emisor]]** tiene registrado — antes de mandar la autorización (útil en card-not-present).
- El originador envía nombre (first / middle / last) + PAN, vencimiento y, opcionalmente, CVV2 / billing address.
- El **algoritmo de match** de Visa devuelve un resultado **por nombre** + un resultado general.
- Se consume vía **Payment Account Validation (PAV) API**; puede correr junto con AVS y CVV2.
- En el BROU: **[[Waiver|waiver]] hasta agosto/2026**; Visa confirmó que las validaciones **no tienen costo**.

## Fuentes oficiales (públicas)
- [[[Visa Direct]] — Getting Started (Developer)](https://developer.visa.com/capabilities/visa_direct/docs) · [Visa Direct FAQ](https://usa.visa.com/supporting-info/visa-direct/visa-direct-faq.html)
- [Payment Account Validation / [[ANI]] (Developer)](https://developer.visa.com/capabilities/pav/docs) · [Verify cardholder information (Visa)](https://corporate.visa.com/en/solutions/acceptance/verification.html)

---
[[Home]]
