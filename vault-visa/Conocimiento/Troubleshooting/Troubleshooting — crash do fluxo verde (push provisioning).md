---
tags: ["troubleshooting"]
fuente: Reports/atas de projeto
estado: verificado
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

## Variante: crédito passa, débito falha

Quando o mesmo app enrola **crédito com sucesso** mas **débito falha**, o problema deixa de ser da app ou da sessão e passa a ser de **elegibilidade/digitalização do produto** — a diferença está no que o processador/emissor responde para aquele BIN.

- Sintoma típico: **HTTP 400** devolvido pelo processador/emissor, em `checkCardEligibility` ([[Check Eligibility]]) ou `requestCardDigitization`, com **`responseCode 911 — Operation failed`**.
- O owner do fecho tende a ser o **[[Processador|processador]] / emissor**, não a Visa nem o [[ITSP]] — mas confirme o owner explicitamente: é o ponto que costuma ficar sem dono entre três partes.
- Não trate como o mesmo incidente do crash de fluxo verde: aquele é sessão/token, este é produto/BIN.

## Variante: enrolou, mas a app não sabe

Provisioning conclui com sucesso e ainda assim a app do banco segue mostrando o cartão como **não enrolado**, deixando o usuário repetir a operação. Aqui o defeito está na **devolução do status do token** para a app depois do enrolamento — verificar a atualização de estado nas plataformas envolvidas antes de mexer na app.

> [!example] Visto em produção
> [[Banco de Corrientes — dossiê|Banco de Corrientes]] (Apple Pay) — flujo verde travado; config Visa OK, chamada não chegava à Visa.
> [[Banco de Corrientes — dossiê|Banco de Corrientes]], 30/jul/2026 — crédito enrolando OK após ajuste da [[Prisma]]; **débito** com HTTP 400 / responseCode 911, e **estado pós-provisioning** não refletindo na app.

---
[[Home]]
