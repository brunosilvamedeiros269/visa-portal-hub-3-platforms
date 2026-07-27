---
tags: ["tecnico"]
---

# Google Pay — Onboarding ([[Issuer Console]]) e [[UPP (Unified Push Provisioning)|UPP]]

Ao adicionar o cartão no Google Pay, o usuário recebe: **[[DPAN]]** (device token), **card-on-file** ([[FPAN]] + validade + nome) e/ou **cloud token**.

## Onboarding no [[Issuer Console]] (Google Pay & Wallet Console)
1. Entrar no **[[Issuer Console]]** com e-mail corporativo (associar a uma Google Account se preciso).
2. Nome público, localização e tipo = **Financial Institution**; aceitar os Terms of Service.
3. Criar o **Business Profile** (obrigatório antes de lançar qualquer coisa).
4. Habilitar a **[[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning API** e preencher os **Issuer Details** (signatário, países, portfólio, redes, [[BID]] da Visa).
5. Fica "In Review" até **NDA + [[CTA (Click-to-Accept)|CTA]]** assinados. O Google **proíbe tokenizar em produção antes do CTA**.

## [[UPP (Unified Push Provisioning)]]
Evolução do push provisioning; **mandato de migração até o fim de 2026**. Novos emissores integram direto em UPP; pré-requisito manter também o **[[Manual provisioning|manual provisioning]]**. Ver [[UPP (Unified Push Provisioning)]].

---
[[Home]]
