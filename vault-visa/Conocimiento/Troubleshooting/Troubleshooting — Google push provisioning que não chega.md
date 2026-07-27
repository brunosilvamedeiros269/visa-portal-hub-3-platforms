---
tags: ["troubleshooting"]
---

# Troubleshooting — Google push provisioning que não chega

> [!bug] Sintoma
> Alguns provisionamentos no Google Pay **falham** e a tentativa **nunca aparece** no processador nem nas ferramentas da Visa.

## Diagnóstico
- Se a tentativa não chega ao processador **nem** à Visa → o problema está **antes**, na integração **banco ↔ Google** (config/credenciais), não na Visa.
- Comparar casos que funcionam vs. falham (fluxo amarelo/verde).

## Ações
- Banco levanta **ticket direto com o Google** + extrai **logs** das casuísticas falhas.
- Aproveitar uma **sessão técnica da Visa** (~30 min, gratuita) com perguntas preparadas, assim que o Google responder.
- Revisar a **[[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning API** no [[Google Pay — Onboarding e UPP|Issuer Console]] e as chaves ([[Google Pay — Chaves VDP e criptografia]]).

> [!example] Visto em produção
> [[BROU — dossiê|BROU]] (Google Pay) — provisionamentos falhos que não chegavam ao [[Sistarbank]]/Visa.

---
[[Home]]
