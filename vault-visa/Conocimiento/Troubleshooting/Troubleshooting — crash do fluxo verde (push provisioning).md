---
tags: ["troubleshooting"]
---

# Troubleshooting — crash do fluxo verde (push provisioning)

> [!bug] Sintoma
> O push provisioning in-app ([[Fluxo verde (00)|fluxo verde]]) **crasha** ou não completa ao enrolar o cartão pela carteira do banco.

## Diagnóstico (nesta ordem)
1. **A config da Visa está OK?** Se o [[Fluxo amarelo (85)|fluxo amarelo]] funciona, os T&C estão carregados e já funciona no Google Pay → a config Visa provavelmente está boa.
2. **Onde a chamada morre?** Se a tentativa **não chega à Visa** (fica no [[ITSP]]/SDK), o problema é do lado do ITSP/app, não da Visa.
3. **Comparar logs** via [[Vital Sign]] (Correlation ID / Token Reference ID).

## Causa raiz mais comum
**Payload / token de login expirado** entre o app do banco e o [[ITSP]] — a sessão de autenticação usada para iniciar o enrolamento venceu.

## Ações
- Publicar a app no **[[TestFlight]]** (não rodar só release local no device).
- Reenviar e-mail à Apple confirmando a vigência do **[[AID (Apple)|AID]]**.
- Compartilhar **Correlation ID / Token Reference ID** com o [[ITSP]] para rastrear.

> [!example] Visto em produção
> [[Banco de Corrientes — dossiê|Banco de Corrientes]] (Apple Pay) — flujo verde travado; config Visa OK, chamada não chegava à Visa.

---
[[Home]]
