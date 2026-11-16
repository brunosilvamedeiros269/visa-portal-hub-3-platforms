---
aliases: ["BCM", "Visa Card Metadata Manager"]
tags: ["glosario/processo-pmo"]
categoria: Processo/PMO
fuente: Diccionario (Notion)
estado: verificado
---

# VCMM

> [!info] Proceso/PMO

Plataforma de Visa para clientes: apertura de proyecto (ticket), [[Revisão de Artes|Revisión de Artes]], T&C. En las reuniones aparece con frecuencia como **BCM**.

Es también donde viven los **metadatos de la tarjeta por billetera** — en la pestaña *Additional Information*, sección iOS, están el **App ID** y el **Banking Store ID** exigidos por Apple Pay.

> [!warning] Digitar no es enviar
> Ya le costó una semana de pruebas al [[Banco de Corrientes — dossiê|Banco de Corrientes]]: los valores se habían digitado pero el *submit* nunca se concretó, y el campo **Last Update** seguía con la fecha antigua. **Verificar el Last Update después de guardar.**

> [!info] Notas de operación
> Los cambios en *Additional Information* deben estar asignados a los rangos de [[BIN]] (pestaña *Assignments → Manage Assignments*); con un único grupo de Additional Information, todos los rangos ya están vinculados y no hace falta reasignar. La propagación lleva **algunas horas**. El campo **URL** solo es necesario para In-App Provisioning (INAP).

**Categoría:** [[MOC — Processo-PMO]]
