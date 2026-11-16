---
title: "Base de Conhecimento — Visa"
tags: ["home"]
aliases: ["Home"]
---

# 🧠 Base de Conhecimento — Visa

Minha base pessoal. Está **separada em duas**: conhecimento **geral** (reutilizável) e contexto **específico de projeto**. O seguimento vivo (tracks/tarefas) está no app; aqui vive o conhecimento.

> [!tip] Abrir esta pasta como *vault* no Obsidian e usar o **Graph View** para ver a rede de links.

## 📚 Conhecimento geral
### Conceitos (ler em ordem)
1. [[1. Visão geral — nosso papel e o fluxo]]
2. [[2. Fundamentos de pagamentos]]
3. [[3. Tokenização]]
4. [[4. Carteiras — Apple Pay e Google Pay]]
5. [[5. Click to Pay]]
6. [[6. Processo PMO de Carteiras]]
7. [[7. Mandatos e Waivers]]
### Glossário por categoria
- [[MOC — Autorizações e Fraude]]
- [[MOC — Carteiras]]
- [[MOC — Click to Pay]]
- [[MOC — Fundamentos]]
- [[MOC — Mandatos]]
- [[MOC — Processo-PMO]]
- [[MOC — Tokenização]]
### Estudo
- [[Plano de estudos]]
- [[Banco de perguntas]]
### Guias técnicos (implementação)
- [[Google Pay — Push Provisioning (proceso)]]
- [[Google Pay — Chaves VDP e criptografia]]
- [[Google Pay — Onboarding e UPP]]
- [[Apple Pay — Issuer Functional Requirements v3.5]]
- [[Tokenização — arquitetura VTS e provisioning (aprofundamento)]]
- [[Carteiras — provisioning in-app (fluxo técnico end-to-end)]]
- [[Click to Pay — SRC, enrolamento e ciclo de vida (aprofundamento)]]
- [[Visa Direct e mandatos (OCT-AFT, ANI) — aprofundamento]]
- [[Click to Pay — comunicação e marketing (fase 3)]]
- [[PMO de Carteiras — rol e responsabilidades]]
- [[Squad de autorizações e fraude]]
- [[Aprendizados das reuniões — set a nov 2026]]
### Troubleshooting
- [[Troubleshooting — crash do fluxo verde (push provisioning)]]
- [[Troubleshooting — Google push provisioning que não chega]]
- [[Troubleshooting — certificação de tokenização (provas e janelas)]]
### Índices
- [[Índice — fuentes]] — de onde vem cada nota e o seu estado

## 🗂️ Projetos (contexto por cliente)
*Estado em 16/nov/2026 — detalhe vivo no app de seguimento.*
- [[Grupo Petersen — dossiê]] *(Grupo Petersen · Argentina)* — Proyecto Fusión: PMO da integração bancária; kickoff 12/nov
- [[BancoEstado — dossiê]] *(BancoEstado · Chile)* — SDK + Apple Pay; pré-requisitos cumpridos, abertura do projeto técnico
- [[Naranja X — dossiê]] *(Naranja X · Argentina)* — migração de pré-pago/débito para a Pismo; contrato assinado, sem kickoff da Pismo
- [[Banco Provincia (Bapro) — dossiê]] *(Banco Provincia · Argentina)* — squad de autorizações e fraude + disputas; em execução
- [[BCI (Featurespace) — dossiê]] *(BCI · Chile)* — pré-venda de Featurespace (ARIC)
- [[BROU — dossiê]] *(BROU · Uruguai)* — contrato renovado; Apple Pay em warning, Click to Pay em enrolamento massivo
- [[Banco de Chile (Nuek) — dossiê]] *(Banco de Chile)* — migração de processador fechada; etapa 2 em pré-venda
- [[Banco de Corrientes — dossiê]] *(Banco de Corrientes · Argentina)* — Click to Pay em produção (mandato cumprido); programa VCA encerrado em 30/set
- [[BBVA Uruguay — dossiê]] *(BBVA Uruguay)* — Google Pay em produção; fechado para a VCA
- [[Comafi — dossiê]] *(Comafi · Argentina)* — SDK + Apple Pay; fechado para a VCA

## Como está organizado
- **Conocimiento/** — geral e reutilizável: `Conceptos/` (temas + mermaid), `Glosario/` (1 nota por termo, com siglas como `aliases`), `MOCs/` (mapas por categoria) e `Estudo/`.
- **Proyectos/** — específico por cliente: dossiê, história, decisões e incidentes; **aponta** para o conhecimento geral, mas o geral não depende dele.
