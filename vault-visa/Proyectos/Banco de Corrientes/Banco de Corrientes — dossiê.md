---
tags: ["proyecto", "cliente/Banco-de-Corrientes"]
---

# 🇦🇷 Banco de Corrientes (Argentina)

> [!info] Dossiê de projeto (contexto qualitativo)
> O acompanhamento **vivo** está no app. Aqui fica o contexto e a história.

## Ficha
- **Cliente:** Banco de Corrientes. **País:** Argentina.
- **Tracks:** Apple Pay e [[Click to Pay]]. Acompanhamento até **30/set**.
- **[[Processador]]:** [[Prisma]]. **TSP/SDK ([[ITSP]]):** [[Thales]]. **Certificador:** [[FIME]].
- **Contatos —** Banco: Juan Torres "Juanjo", Verónica Escobar, Cristian (técnico). Visa: Lina Torres, Marlene Migliardi, Javier Cadena, Laura. [[Thales]]: Patricia González, Miguel Ángel. [[Prisma]]: Ivan Hirsch, Mario.

## Status atual (base: weekly 17/jul/2026)
**[[Click to Pay]]** no rumo (mais estável); **Apple Pay** travado por um incidente técnico de push provisioning.

## Frentes / tracks
| Frente | Situação |
|---|---|
| [[Click to Pay]] | Fluxo principal finalizado; ambientes prontos; provas 22/jul |
| Apple Pay | Bloqueado: crash no fluxo verde (push provisioning) |

## Histórico (linha do tempo)
- **2025** — Pré-requisito Apple enviado (e-mail do [[AID (Apple)|AID]] à Apple).
- **Configuração do [[Partner Hub]]** — de 27% → 50/60%; corrigir o país para **Argentina** destravou aprovações.
- **Reunião técnica Apple Pay** (Visa + [[Thales]] + [[Prisma]] + banco) — diagnóstico do crash no fluxo verde: config Visa OK (fluxo amarelo funciona; T&C carregados; já funciona no Google Pay), mas o **fluxo verde não chega à Visa** (fica no [[ITSP]]/Thales). Causa raiz provável: payload/token de login expirado.
- **17/jul/2026** — Weekly [[Click to Pay]]: ambientes prontos; carga massiva OK no [[Prisma]]; provas funcionais em preprodução marcadas para 22/jul.
- **29–31/jul** — Janela-alvo do SteerCo (remarcado para garantir Martín e Agustín).

## Decisões e pontos importantes
- **Apple Pay — causa raiz** provável no **payload/token de login** (banco + [[Thales]]), não na config da Visa.
- **Ações Apple Pay:** publicar a app no **[[TestFlight]]**; reenviar e-mail à Apple confirmando o **[[AID (Apple)|AID]]**; compartilhar **Correlation ID / Token Reference ID** ([[Vital Sign]]) para diagnóstico.
- **[[Partner Hub]] — boa prática:** garantir mais de uma pessoa do banco com acesso.

## Pendências e riscos
- Resolver a causa raiz do crash do fluxo verde (payload/token) com o banco + [[Thales]].
- Confirmar a vigência do [[AID (Apple)|AID]] com a Apple.
- Executar e validar as provas de CTP (a cargo do banco, com o processador).

---
[[Home]]
