---
aliases: ["BCM", "Visa Card Metadata Manager"]
tags: ["glosario/processo-pmo"]
categoria: Processo/PMO
fuente: Dicionário (Notion)
estado: verificado
---

# VCMM

> [!info] Processo/PMO

Plataforma da Visa para clientes: abertura de projeto (ticket), [[Revisão de Artes]], T&C. Nas reuniões aparece com frequência como **BCM**.

É também onde vivem os **metadados do cartão por carteira** — na aba *Additional Information*, seção iOS, ficam o **App ID** e o **Banking Store ID** exigidos pelo Apple Pay.

> [!warning] Digitar não é submeter
> Já custou uma semana de testes ao [[Banco de Corrientes — dossiê|Banco de Corrientes]]: os valores tinham sido digitados mas o *submit* nunca foi efetivado, e o campo **Last Update** seguia com a data antiga. **Conferir o Last Update depois de gravar.**

> [!info] Notas de operação
> Mudanças em *Additional Information* precisam estar atribuídas aos ranges de [[BIN]] (aba *Assignments → Manage Assignments*); com um único grupo de Additional Information, todos os ranges já estão vinculados e não é preciso reatribuir. A propagação leva **algumas horas**. O campo **URL** só é necessário para In-App Provisioning (INAP).

**Categoría:** [[MOC — Processo-PMO]]
