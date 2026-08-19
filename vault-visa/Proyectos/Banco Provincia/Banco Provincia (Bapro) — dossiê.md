---
tags: ["proyecto", "cliente/Banco-Provincia"]
fuente: Handover de autorizaciones y fraude (10/ago/2026)
estado: verificado
---

# 🇦🇷 Banco Provincia (Bapro) — squad de Autorizações e Fraude

> [!info] Dossiê de projeto (contexto qualitativo)
> **Consultoria pura, não implementação de sistema.** Formato "squad". A implementação final das recomendações é do processador ou do banco — a Visa não implementa.

## Ficha
- **Cliente:** Banco de la Provincia de Buenos Aires ("Banco Provincia" / **Bapro**) — banco estatal, descrito como o maior banco governamental da Argentina em relevância para a Visa.
- **País:** Argentina.
- **Duração:** 12 meses (mínimo comercial 9).
- **Fases:** **6 semanas** de diagnóstico quantitativo → **+4 semanas** de calibração e roadmap → implementação com seguimento contínuo ("always on").
- **Fase atual (10/ago/2026):** **pós-diagnóstico, pré-apresentação — travado do lado do cliente.**

**Time Visa —** **Moisés** (VIS, líder dos projetos de autorizações e fraude; saindo do papel de contato direto), **Bruno Medeiros** (VIS, novo ponto de contato visível), **Juan Pablo** (líder da vertical de Risco CONOSUR, dedicação parcial, executa o diagnóstico), **Rafael Polo** (**implante** externo, dedicação quase exclusiva, deve ir ao banco 2x/semana), **Diana Dicochea** (Disputas, trimestral), Customer Success Executive (a nomear). Apoio: Core Consulting, Client Success, **GBO** (Global Business Optimization — dono dos dados e dos dashboards).

**Time do cliente —** coordenador de projeto **a designar** + líderes de **Autorizações**, **Operações** e **Fraude** **a designar**. *95% das recomendações caem nessas três áreas.*

## Tracks
| # | Track | Conteúdo | Quem executa |
|---|---|---|---|
| 1 | **Autorizações e fraude** | Diagnóstico + roadmap + implementação e seguimento | Risco (Juan Pablo) + implante (Rafael Polo); **VIS assegura a governança** |
| 2 | **Disputas / controvérsias** | Análise **trimestral** com recomendações caso a caso | Diana Dicochea; VIS só garante que a sessão aconteça |
| 3 | **Benchmark de carteira** *(adjacente)* | Estudo trimestral de penetração/portfólio | **Outro time da VCA** — vendido em conjunto, mas corre 100% separado |

## Status atual — bloqueio central
**"Están parados 100%."** O kick-off ocorreu há ~2 meses (≈ jun/2026). O **diagnóstico está pronto há 3 semanas e ainda não foi apresentado** — o banco não responde aos pedidos de agenda, não designou coordenador nem responsáveis de área, e não liberou acessos nem equipamento ao implante. O diagnóstico de disputas também está pronto e sem data.

> [!bug] Círculo vicioso identificado
> Como a sessão inicial não acontece, não se aciona a ida de Rafael Polo ao banco — que é justamente o que destravaria a sessão.

**O custo de esperar é mensurável:** em **fevereiro** o banco atingiu o teto do programa **[[MAR (Minimum Approval Rate)|MAR]]** (10 BINs) e em **março** teve **9 segmentos** em MAR. No último ano destinou "miles de miles de dólares" a essas multas.

## Linha de base do diagnóstico
Banco **abaixo dos peers em todos os quadrantes**.

- **Crédito:** CP doméstico −0,4 p.p. · CP internacional <1% abaixo · um quadrante −2% · **CNP internacional −6%** (principal ponto de dor).
- **Débito:** **CP internacional −8%** · **CNP doméstico −7%**.
- **Motivo de rejeição nº 1:** **NSF (Not Sufficient Funds)**, em crédito e em débito.
- **Fraude:** em internacional não-presente o banco tem **aprovação baixíssima e fraude altíssima ao mesmo tempo** — *"estás mal por los dos lados"*. Em débito está melhor que os peers em quase todos os cortes.

**Entregável:** documento de **150 a 200 páginas**, ~**40 acionáveis** organizados em **matriz de esforço × impacto**. Depois, banco + Visa constroem um roadmap priorizado — e o banco pode descartar itens. Responsabilidade explícita do VIS: *"que eso se traduzca en un roadmap accionable"*.

## Conceitos do produto (ver também [[Squad de autorizações e fraude]])
- **Framework dos 4 quadrantes** — produto (crédito × débito) × geografia (doméstico × internacional) × ambiente (CP × CNP). Uma métrica única de banco "no nos dice dónde hay que concentrarse".
- **Peers** — os **5 bancos mais parecidos** por volume, público-alvo e posição de mercado. Comparação sempre dupla: vs. mercado e vs. peers.
- **[[MAR (Minimum Approval Rate)|MAR]]** — approval rate mínimo por BIN-segmento, com multa de **US$ 2.500 por BIN por mês** e teto de 10 BINs.
- **Limitação de dados da Visa** — por compliance a Visa não armazena DNI nem nome: **"para nosotros cada cliente es una tarjeta"**. Metáfora do *diagrama de Venn ao contrário*: ~20% da informação é só do banco, ~20% é só da Visa.

## Pendências e riscos
| O quê | Responsável | Situação |
|---|---|---|
| **Designar coordenador de projeto e responsáveis de Autorizações, Operações e Fraude** | Banco Provincia | pendente há ~2 meses |
| **Liberar acessos e equipamento ao implante** (Rafael Polo) | Banco Provincia | sem resposta |
| **Agendar a apresentação do diagnóstico** | Banco (agenda) / VIS (push) | opções já enviadas, sem retorno |
| **Coordenar a primeira sessão de disputas** | Banco (agenda) / VIS | sem feedback |
| Montagem do **roadmap acionável** | Visa + banco | bloqueado pelos itens acima |
| Escalar o destravamento a nível mais alto | Moisés | em curso |
| Nomear o **Customer Success Executive** | Visa | sem data |

**Riscos**
1. **Inércia do cliente** — projeto de 1 ano perdendo ~2 meses de janela, e a curva de arranque já é de 3–4 meses.
2. **Cultura de empresa estatal** — *"les cuesta más accionar, por ahí más pasivo"*; exige presença física e pressão constante do implante.
3. **Implante sem acessos** — neutraliza o principal mecanismo de destravamento.
4. **NSF como ofensor nº 1 com margem quase nula** — o único acionável real é ampliar a linha de crédito, e no contexto argentino nenhum banco quer fazê-lo. Os bancos pedem explicitamente "soluciones técnicas".
5. **Exposição financeira ativa a multas MAR** enquanto o roadmap não arranca.
6. **CNP internacional** com aprovação baixa e fraude alta simultaneamente — quadrante de maior complexidade técnica.

---
[[Home]]
