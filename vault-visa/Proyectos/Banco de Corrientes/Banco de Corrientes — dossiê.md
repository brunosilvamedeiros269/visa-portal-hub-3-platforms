---
tags: ["proyecto", "cliente/Banco-de-Corrientes"]
fuente: Reports e atas — Banco de Corrientes
estado: verificado
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
- **16/jun/2026** — **1º SteerCo** (ver seção abaixo).
- **29–31/jul** — Janela-alvo do 2º SteerCo (remarcado para garantir Martín e Agustín).

## SteerCo inicial (jun/2026)
1º Steering Committee (Apple Pay & Click to Pay) — foco em **visibilidade executiva**, dependências críticas e avanço coordenado dos dois frentes. Deadline do mandato [[Click to Pay]]: **30/set/2026**. Governança instalada: **SteerCo mensal/ad-hoc** (estratégico) + **weekly operativo**.

**Apple Pay** — avançado, entrando numa fase em que **1–2 definições técnicas** condicionam o próximo passo. Preparação para certificação [[FIME]]; exige coordenar dispositivos, cartões e [[Whitelist|whitelist]]. Config com **CCM Digital** agendada (17/jun); pendências: certificados **JWS/JWE** e chave **WSD/ZCMK**.

**[[Click to Pay]]** — plano aprovado (2ª prórroga), fecha **30/set/2026**, integração técnica em curso. Banco enviará **DEF para os 5 BINes**; o CCM estimou **~5 dias hábeis por ambiente**.

**Linha do tempo técnica ([[Thales]]):** SDK iOS/Android **v4.3.0** → integração do app BanCo com o SDK → config de bines/certificados/chaves no tenant Thales (Pre-PRD) → habilitar ao menos 1 [[BIN]].

## Decisões e pontos importantes
- **Apple Pay — causa raiz** provável no **payload/token de login** (banco + [[Thales]]), não na config da Visa.
- **Ações Apple Pay:** publicar a app no **[[TestFlight]]**; reenviar e-mail à Apple confirmando o **[[AID (Apple)|AID]]**; compartilhar **Correlation ID / Token Reference ID** ([[Vital Sign]]) para diagnóstico.
- **[[Partner Hub]] — boa prática:** garantir mais de uma pessoa do banco com acesso.

## Pendências e riscos
- Resolver a causa raiz do crash do fluxo verde (payload/token) com o banco + [[Thales]].
- Confirmar a vigência do [[AID (Apple)|AID]] com a Apple.
- Fechar definições técnicas Apple (certificados **JWS/JWE**, chave **WSD/ZCMK**) para a config com o CCM Digital.
- [[Click to Pay]]: banco enviar o **DEF dos 5 BINes** para destravar a configuração.
- Executar e validar as provas de CTP (a cargo do banco, com o processador).

---
[[Home]]
