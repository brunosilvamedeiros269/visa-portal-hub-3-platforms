---
aliases: ["MAR", "Minimum Approval Rate"]
tags: ["glosario/autorizacoes-fraude"]
categoria: Autorizações e Fraude
fuente: Handover de autorizações e fraude — Bapro (10/ago/2026)
estado: verificado
---

# MAR (Minimum Approval Rate)

> [!info] Autorizações e Fraude

Programa da Visa que fixa um **approval rate mínimo por [[BIN]] e por segmento**. É um dos regulamentos que o emissor deve cumprir para manter a boa ordem transacional.

## Mecânica
- Cada BIN tem **4 segmentos**: CP doméstico · CP internacional · CNP doméstico · CNP internacional. O alvo é **diferente por segmento** — *"no le puedes poner el mismo objetivo a un CP doméstico que a un CNP internacional"*.
- **Descumprir por 0,01 p.p. já faz entrar em MAR.**
- **Multa: US$ 2.500 por BIN por mês**, cobrada mês a mês (não é um mandato com prazo).
- **1 entrada por BIN por mês**, mesmo descumprindo os 4 segmentos.
- **Teto de 10 BINs por mês** → exposição máxima de US$ 25.000/mês.
- **Não há bônus** para quem fica fora do MAR — o incentivo é não pagar.

## Valor como ferramenta de diagnóstico
O MAR quebra um número macro incompreensível ("ves un 90% a nivel completo CNP crédito") em **unidades acionáveis por BIN**. Ao dar duplo clique num BIN específico costuma-se descobrir uma configuração quebrada, mensageria incorreta ou **CVV que não trafega**.

> [!tip] Recomendação típica — BIN residual
> Um BIN com poucas transações (ex.: 100/mês) é estatisticamente **volátil**, tem **custo de manutenção**, tem **custo de esforço operacional** e ainda gera **US$ 2.500/mês** de multa. A recomendação costuma ser **migrar esses clientes e reimprimir os cartões para outro BIN**.

> [!note] Postura comercial
> *"Por nosotros que siga en MAR, no entra la plata."* A multa não é receita do time de consultoria — o discurso ao banco é de parceria para que ele **não** pague o fee.

**Categoria:** [[MOC — Autorizações e Fraude]]

---
[[Home]]
