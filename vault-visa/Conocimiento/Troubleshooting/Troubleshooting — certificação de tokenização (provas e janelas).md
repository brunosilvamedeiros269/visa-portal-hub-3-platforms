---
tags: ["troubleshooting"]
fuente: Certificação VTS COF/e-Commerce — BROU (jul–ago/2026)
estado: verificado
---

# Troubleshooting — certificação de tokenização (provas e janelas)

> [!bug] Sintoma
> A certificação de [[Tokenização|tokenização]] não avança: casos travados, janelas desperdiçadas, provas que não se conseguem executar — e o track inteiro de billeteras parado atrás dela.

Reunião a reunião, os bloqueios de certificação do [[BROU — dossiê|BROU]] caíram em quatro categorias. Nenhuma era um defeito de plataforma.

## 1. Falta de jogo de dados
**O antipadrão:** ter **um único cartão tokenizado** e trabalhar em cima dele. Quando esse token cai ou é desmontado, uma linha inteira de provas para.

> *"Cometimos el problema de tener una única tarjeta tokenizada y después trabajar sobre ella… ahora no estaríamos con este problema de que tenemos toda una línea de pruebas trancadas por falta de juegos de datos."*

**O que fazer:** é possível gerar **N tokens por cartão**. Antes de desmontar qualquer token, gere vários sobre o cartão que comprovadamente tokeniza e deixe um jogo ativo. **Nunca desmonte um token sem ter outro funcionando.**

## 2. Dados de teste inválidos
Duas ocorrências distintas, ambas caras:
- **Cartões gerados com chaves de produção** em vez de chaves de teste → falha na validação do CVV em aprovisionamentos com CVV incluído. Foi a causa raiz de uma janela inteira perdida.
- **Cartões físicos mal embossados** — CVV impresso no plástico **705**, valor lido no simulador **303**, valor informado pelo processador **113**. Nenhum dos três coincidia, e a suspeita era de que **toda a partida** estivesse errada. Detalhe que confunde: transações **não tokenizadas** com esses mesmos cartões funcionavam.

**O que fazer:** validar o CVV com o [[Processador|processador]] antes de começar, e ter cartões de reserva fora da partida suspeita.

## 3. Documentação do script insuficiente
O Excel do caso 13.2 dizia apenas **"a valid token"** no campo 2 — sem especificar **qual componente** do token. O time gastou uma reunião inteira em tentativa e erro entre PAN e DPAN.

**Resposta correta, confirmada pelo Global Client Testing:** no **campo 2 vai o [[DPAN]] / token number**. Os dois cenários de falha:
- com **PAN** no campo 2 → chega ao processador, que rejeita por CVV em branco;
- com **DPAN** no campo 2 → a Visa rejeita antes (código **82**) e a transação nem chega ao processador.

**O que fazer:** quando o script for ambíguo, escreva ao **Global Client Testing** com caso de prova, **Token Reference ID**, valor do token e o **RRN** gerado — em vez de iterar às cegas.

## 4. Janelas mal dimensionadas
| Erro | Correção |
|---|---|
| Agendar **30 minutos** para um roteiro que exige 1–2 h | Pedir **1 a 2 horas** desde o início. Uma janela curta custa uma semana |
| Não achar slot de 2 h contínuas e esperar | **Quebrar em duas janelas de 1 h no mesmo dia** — foi assim que o BROU antecipou a certificação em uma semana |
| Cancelar em cima da hora | **É cobrado igual.** Remarcar com antecedência; se houver risco de ajuste técnico, deixar um dia entre uma janela e outra |
| Chegar sem insumos | Confirmar a estação por **ecotest** e **compartilhar o cartão antes**, para o certificador já provisionar os tokens |

> [!tip] Com tokens pré-provisionados, menos gente precisa estar na sala
> Se o engenheiro gera os tokens antes da sessão, o [[ITSP]] e o [[Processador|processador]] **não precisam participar** da execução. Confirme isso com o engenheiro e poupe convocações desnecessárias.

## 5. Casos que simplesmente não se aplicam
Antes de brigar com um caso, verifique se ele **aplica ao perfil do emissor**. Na [[Scoping call|scoping call]] do BROU, o caso **13.2 (Dynamic CVV)** — a única prova pendente, que vinha travando o fecho — foi marcado como **no aplica** e encerrado **sem execução**. O mesmo costuma valer para provas de [[OCT - AFT|AFT e OCT]] em emissores que não participam desses fluxos, e para provas de retail quando o escopo é só token.

> [!example] Visto em produção
> [[BROU — dossiê|BROU]], jul–ago/2026 — provas de API travadas por falta de jogo de dados e por dados de cartão inválidos; caso 13.2 sem interpretação por ambiguidade do script; janela de 30 min insuficiente. Resolvidos os quatro pontos, a certificação de host fechou em **11/ago** em duas janelas de 1 h, com carta obtida.

---
[[Home]]
