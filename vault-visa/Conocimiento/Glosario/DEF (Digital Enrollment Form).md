---
aliases: ["DEF", "Digital Enrollment Form"]
tags: ["glosario/tokenizacao"]
categoria: Tokenização
fuente: Seguimiento VTS COF/e-Commerce — BROU (ago/2026)
estado: verificado
---

# DEF (Digital Enrollment Form)

> [!info] [[Tokenização]]

Formulário que declara à Visa as **URLs e os campos a ativar a nível de [[Processador|PCR]]** para habilitar a tokenização de um emissor. Junto com o **Processor Digital Activation Request**, é o insumo obrigatório para a Visa solicitar as **configurações produtivas**.

## Como funciona na prática
- São **os mesmos dois documentos já preenchidos para o ambiente de teste** — basta revisar e trocar o campo de *entorno* para "producción".
- O Implementation Manager **não pode adiantar** a solicitação: ela só é enviada **depois da carta de certificação**.
- A configuração produtiva leva **10 dias úteis** e é executada pela equipe de configurações digitais da Visa, que faz uma revisão preliminar e devolve a data efetiva.

> [!tip] Ganho de cronograma
> Entregar o DEF e o Processor Digital Activation Request de produção **antes** da janela de certificação antecipa o gatilho dos 10 dias úteis. No [[BROU — dossiê|BROU]] isso valeu cerca de **uma semana**.

> [!warning] Armadilha conhecida
> A entrega do DEF já falhou por **bloqueio de e-mail com anexo** entre banco e Visa. Se o e-mail não chegar, anexar ao caso no **Dynamics** ou usar correio seguro.

**Categoría:** [[MOC — Tokenização]]

---
[[Home]]
