---
tags: ["tecnico"]
fuente: Handover de autorizações e fraude — Bapro (10/ago/2026)
estado: verificado
---

# Squad de autorizações e fraude

Formato de projeto da Visa para **otimizar taxa de autorização e de fraude** de um emissor. Não é implementação de sistema: *"hacemos consultoría, miramos lo que está bien o mal"* — a implementação final é do [[Processador|processador]] ou do banco.

## Composição do time
| Papel | Função |
|---|---|
| Especialista da **vertical de Risco** da consultoria Visa | Executa o diagnóstico, calcula peers, apresenta os números |
| **Customer Success Executive** | Relacionamento diário — "un ejecutivo del banco, pero de Visa para el banco" |
| **[[VIS (Visa Implementation Services)|VIS]]** | **Assegura a governança**: que a sessão aconteça, que tenha qualidade e que os compromissos se cumpram |
| **Implante** | Recurso externo com dedicação quase exclusiva, **fisicamente no banco** ao menos 2x/semana |

O **implante** é o nexo bidirecional — empurra coisas de Visa→banco e de banco→Visa e ajuda a priorizar. Justificativa explícita: *"Visa… es muy grande, tiene muchas partes móviles"*.

## Duração e fases
Vendido no mínimo por **9 meses**, geralmente **1 ano**. A curva inicial — integrar-se ao banco, entender a dinâmica, diagnosticar, mover as partes internas — consome **3 a 4 meses**; um projeto de 6 meses acabaria justo quando começa a azeitar.

`6 semanas de diagnóstico quantitativo` → `+4 semanas de calibração e roadmap` → `implementação com seguimento e recalibração contínuos (always on)`

## O framework dos 4 quadrantes
Toda análise é aberta em quadrantes, nunca como métrica única de banco — *"no nos dice nada, no nos dice dónde hay que concentrarse"*.

- **Produto:** crédito × débito
- **Geografia:** doméstico × internacional (cross-border)
- **Ambiente:** presente (CP) × não-presente (CNP)

### Leis empíricas (para normalizar expectativa)
| Regra | Por quê |
|---|---|
| Approval CNP **<** approval CP | natureza da transação |
| Approval internacional **<** approval doméstico | natureza da transação |
| Fraude CNP **>** fraude CP | mais fácil de ocorrer; o portador esquece assinaturas e descrições pouco claras |
| Fraude crédito **>** fraude débito | *"los defraudadores no suelen ir a atacar débito porque es más probable que no tengan fondos"* |
| NSF em débito é estruturalmente alto | débitos automáticos (streaming, contas) que o cliente esquece — 70–80% é "entre comillas normal" |

## Peers
Os **5 bancos mais parecidos**, selecionados por volume de transações, público-alvo e posição de mercado; o cálculo é do time de Risco. Toda comparação é dupla: **vs. mercado total e vs. peers**. A prioridade é onde o gap contra peers é maior — mesmo que o banco esteja acima da média do mercado.

## Alavancabilidade dos motivos de rejeição
- **NSF (Not Sufficient Funds)** é a alavanca mais difícil: é problema de limite/crédito, e o único acionável real é ampliar a linha — algo que, em contextos de crédito apertado, nenhum banco quer fazer. Daí a pressão dos clientes por "soluciones técnicas".
- **Rejeições de origem técnica** (motivo não identificado, restrição de configuração do cartão, mensageria incorreta, CVV que não trafega) **têm solução técnica** — é o campo fértil das recomendações.
- Para NSF em débito só cabe ação **comunicacional** (avisar o cliente que um serviço vence em 3 dias).

## Exemplo canônico de recomendação — estratégia de *over limit*
1. Detecta-se excesso de rejeições por limite insuficiente num **ramo (MCC) específico**.
2. Analisa-se como vêm os gastos nesse ramo, o **ticket médio das rejeitadas** e o **score de risco** desses clientes.
3. Recomenda-se com especificidade numérica: *"para este rubro específico debería haber un over limit de 20 dólares, porque con ese límite no corres mucho riesgo en fraude y va a subir tu tasa de aprobación en tanto porcentaje."*
4. Entrega ao banco e acompanhamento junto ao processador até a implementação.

## A limitação estrutural de dados da Visa
Por compliance e lei antimonopólio, a Visa **não armazena número de identificação nem nome que individualize a pessoa**. Consequência operacional: **"para nosotros cada cliente es una tarjeta"** — o mesmo titular com um débito e um crédito no mesmo banco são **dois clientes distintos** na rede.

Impacto no diagnóstico de fraude: um cliente que se comporta perfeitamente no débito e comete auto-fraude no crédito receberá recomendação positiva no débito. Metáfora usada: **"diagrama de Venn ao contrário"** — ~20% da informação é só do banco, ~20% é só da Visa; integrar os dois 20% cegos é o que enriquece a recomendação.

**Regra de fase:** as 6 semanas de diagnóstico + 4 de calibração usam **100% informação Visa (MIS)**. Dados do banco só entram na fase de execução, para "hilar más fino".

## Disputas / controvérsias
Disputa é o processo iniciado quando o portador **desconhece um gasto**. Cadência **trimestral**: uma especialista regional analisa como o banco tratou as disputas do trimestre e devolve recomendações caso a caso, em três tipos:
1. casos mal conduzidos — *"estas 20 disputas las pudiste haber manejado de esta manera y por eso perdiste el juicio"*;
2. casos que **nem deveriam ter sido abertos**;
3. casos com estratégia probatória alternativa de maior probabilidade de êxito.

O [[VIS (Visa Implementation Services)|VIS]] apenas centraliza as instâncias — não faz a análise.

## Entregável e contraparte obrigatória
O diagnóstico é um documento de **150 a 200 páginas** com métricas específicas e ~**40 acionáveis** numa **matriz de esforço × impacto**. Depois, banco + Visa constroem um roadmap priorizado — e o banco pode descartar itens.

Do lado do cliente é sempre necessário **1 líder de projeto** mais os **líderes de Autorizações, Operações e Fraude**: **95% das recomendações caem nessas três áreas**, portanto elas precisam estar "súper embebidas" no projeto.

---
[[Home]]
