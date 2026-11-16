---
title: "Base de Conocimiento — Visa"
tags: ["home"]
aliases: ["Home"]
---

# 🧠 Base de Conocimiento — Visa

Mi base personal. Está **separada en dos**: conocimiento **general** (reutilizable) y contexto **específico de proyecto**. El seguimiento vivo (tracks/tareas) está en el app; acá vive el conocimiento.

> [!tip] Abrir esta carpeta como *vault* en Obsidian y usar el **Graph View** para ver la red de enlaces.

## 📚 Conocimiento general
### Conceptos (leer en orden)
1. [[1. Visão geral — nosso papel e o fluxo]]
2. [[2. Fundamentos de pagamentos]]
3. [[3. Tokenização]]
4. [[4. Carteiras — Apple Pay e Google Pay]]
5. [[5. Click to Pay]]
6. [[6. Processo PMO de Carteiras]]
7. [[7. Mandatos e Waivers]]
### Glosario por categoría
- [[MOC — Autorizações e Fraude]]
- [[MOC — Carteiras]]
- [[MOC — Click to Pay]]
- [[MOC — Fundamentos]]
- [[MOC — Mandatos]]
- [[MOC — Processo-PMO]]
- [[MOC — Tokenização]]
### Estudio
- [[Plano de estudos]]
- [[Banco de perguntas]]
### Guías técnicas (implementación)
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
- [[Índice — fuentes]] — de dónde viene cada nota y su estado

## 🗂️ Proyectos (contexto por cliente)
*Estado en 16/nov/2026 — detalle vivo en el app de seguimiento.*
- [[Grupo Petersen — dossiê]] *(Grupo Petersen · Argentina)* — Proyecto Fusión: PMO de la integración bancaria; kickoff 12/nov
- [[BancoEstado — dossiê]] *(BancoEstado · Chile)* — SDK + Apple Pay; prerrequisitos cumplidos, apertura del proyecto técnico
- [[Naranja X — dossiê]] *(Naranja X · Argentina)* — migración de prepago/débito a Pismo; contrato firmado, sin kickoff de Pismo
- [[Banco Provincia (Bapro) — dossiê]] *(Banco Provincia · Argentina)* — squad de autorizaciones y fraude + disputas; en ejecución
- [[BCI (Featurespace) — dossiê]] *(BCI · Chile)* — preventa de Featurespace (ARIC)
- [[BROU — dossiê]] *(BROU · Uruguay)* — contrato renovado; Apple Pay en warning, Click to Pay en enrolamiento masivo
- [[Banco de Chile (Nuek) — dossiê]] *(Banco de Chile)* — migración de procesador cerrada; etapa 2 en preventa
- [[Banco de Corrientes — dossiê]] *(Banco de Corrientes · Argentina)* — Click to Pay en producción (mandato cumplido); programa VCA cerrado 30/sep
- [[BBVA Uruguay — dossiê]] *(BBVA Uruguay)* — Google Pay en producción; cerrado para VCA
- [[Comafi — dossiê]] *(Comafi · Argentina)* — SDK + Apple Pay; cerrado para VCA

## Cómo está organizado
- **Conocimiento/** — general y reutilizable: `Conceptos/` (temas + mermaid), `Glosario/` (1 nota por término, con siglas como `aliases`), `MOCs/` (mapas por categoría) y `Estudo/`.
- **Proyectos/** — específico por cliente: dossier, historia, decisiones e incidentes; **enlaza** al conocimiento general pero el general no depende de él.
