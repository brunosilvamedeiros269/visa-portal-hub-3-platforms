---
tags: ["proyecto", "cliente/BROU"]
---

# 🇺🇾 BROU — Banco de la República (Uruguai)

> [!info] Dossiê de projeto (contexto qualitativo)
> O acompanhamento **vivo** (tracks, tarefas, status) está no app. Aqui fica o contexto, a história e as decisões. Conceitos citados linkam para [[Home|o conhecimento geral]].

## Ficha
- **Cliente:** Banco de la República Oriental del Uruguay (BROU) — banco público.
- **País:** Uruguai. **PM Visa (líder):** Jenny (Lina / Bruno).
- **Engajamento:** PMs por ~6 meses, desde **14/abr/2026** ("até onde chegarem").
- **[[Processador]]:** [[Sistarbank]]. **Habilitador [[Click to Pay]]:** [[HST - HCT|HST]] / HCT.
- **Rota crítica (débito):** [[Tokenização]] → [[Click to Pay]].

## Status atual (base: weekly 22/jul/2026)
Em andamento, ritmo lento. Foco: destravar a [[Tokenização]] (rota crítica) para liberar o [[Click to Pay]] de débito; **o gargalo do momento é a base de dados do próprio banco** (sem data). Jenny fora ~2 semanas → Lina lidera os tracks com apoio do Bruno. 1º SteerCo ainda pendente.

## Frentes / tracks
| Frente | Escopo | Situação |
|---|---|---|
| [[Tokenização]] TD | Rota crítica; instância própria | Em implementação |
| Billeteras | Google (crédito, PP+in-App), Apple (crédito+PP+débito), Garmin (débito), BAMw (futuro) | Em preparação |
| [[Click to Pay]] | [[Enrolamento massivo]] + ciclo de vida | Aguardando tokenização / [[Sistarbank]] |
| Mandatos | [[OCT - AFT|OCT]]-AFT ([[Visa Direct]]) e [[ANI]] | Em curso |

## Decisões e pontos importantes
- **Rota crítica:** reforçar toda semana a sequência tokenização → [[Click to Pay]].
- **[[Click to Pay]]:** waiver até **30/set** (crédito e pré-pago); débito depende de finalizar a tokenização.
- **[[External Consumer ID]]:** BROU tem **4 códigos emisores** → risco de perfis redundantes.
- **Expectativa realista:** o conjunto não sai em menos de 9 meses; com 6 de engajamento, provavelmente não se chega a tudo.
- **3º mandato = [[ANI]]** (antes "Annie"), waiver até agosto/2026.

## Pendências e riscos
- **Base de dados do banco (CTP massivo)** — gargalo crítico, atrasado por recursos alocados em outra implementação; sem data.
- **"Baja" no [[Sistarbank]]** — suporta as fases, mas a baixa/desativação ainda não foi testada.
- **[[OCT - AFT|OCT]]:** documento do ponto 5 (Klaus) faltando; sem feedback das áreas do banco → nova data 29/jul.
- **[[ANI]] estático** há ~3 semanas — provedor não prioriza.
- **Google [[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning:** provisionamentos falhos que não chegam ao [[Sistarbank]]/Visa; suspeita de config banco↔Google (ticket aberto).
- **[[UPP (Unified Push Provisioning)|UPP]]:** falta material técnico escrito da HCT/[[HST - HCT|HST]]; **freeze do banco (25/nov–jan)** — mudança precisa entrar antes de fins de novembro.
- **Escopo vs. prazo:** projeto até setembro; billetera própria do banco fora do escopo (avaliar extensão no SteerCo).

## Marcos críticos
[[Tokenização]] TD fim est. **28/08** · [[Click to Pay]] waiver **30/09** · [[ANI]] waiver **31/08** · Issuer enablement fee efetivo **ago/2026**.

---
[[Home]]
