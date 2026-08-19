---
tags: ["proyecto", "cliente/Banco-de-Chile"]
fuente: Dailies de estabilización — Banco de Chile × Nuek
estado: verificado
---

# 🇨🇱 Banco de Chile × Nuek — migração de processador

> [!info] Dossiê de projeto (contexto qualitativo)
> Única frente da base que **não é implementação de produto** e sim **estabilização pós-migração**. A cadência é diária, o insumo é a fila de tickets e o papel do PM é governança sobre a fila, não sobre um cronograma de marcos.

## Ficha
- **Cliente:** Banco de Chile. **País:** Chile.
- **Escopo:** migração da plataforma de processamento de cartões para a **Nuek**, com estabilização pós-produção.
- **PM Visa:** Lina Torres — substituída por **Bruno Medeiros** durante a licença (ago/2026). Consultoria **CYBS** citada no contexto do projeto *(não aparece nas transcrições — confirmar)*.
- **Fase:** **estabilização** — sistema em produção, fila ativa de incidentes.

**Contatos —** Nuek *(atribuições a confirmar)*: Sebastián ("Seba", conduz a daily), José / José Luis (parametrização), Waldo, Pedro, Sebastián Tobar. Banco de Chile: Claudia (liderança operacional), Paola ("Pau"), Joyce, Tatiana ("Tati"), John, Claudio, Jorge Borque, Luis, Gonzalo, Erika, Carlos, Francisco, Mayra. Há um **analista baseado na Espanha** envolvido em temas específicos.

## Governança
- **Daily "Estabilización Migración"** entre banco, Nuek e Visa — revisão de tickets resolvidos e pendentes com planilha compartilhada.
- **A partir de ~19/ago/2026: daily fixa às 08h00 por 2 semanas** (com Luis e Gonzalo), com as reuniões da tarde suspensas até o retorno da Erika (~1/set).
- Reuniões internas (ex.: 10h30) e ad hoc por tema.
- Tickets com numeração de 6 dígitos (séries 45xxxx / 46xxxx).

## Domínios afetados
Emissão e reemissão de cartões (bloqueio, reposição, embossing, reimpressão, renovação) · cartões virtuais · cartão empresa / estrutura *business* · autorizações e transacionalidade (avance, reversas/anulações, taxa zero, montantes menores, cota controlada) · base de clientes · relatórios e estatísticas (**LCN**) · canais (app, banco em linha, caixa, banca telefônica, agência).

**Sistemas citados:** LCN, MSF, IRD, EPCF/BCF, SAC, SAT, DEM; legado **Nexus** *(a confirmar)*. Bandeiras Visa e Mastercard.

## Status atual (base: daily de 18/ago/2026)
Fila ativa, com alguns temas já dados por fechados (incidente "incoming Visa", BCF) e outros que são **regressões ou funcionalidades perdidas na migração** — categoria que merece atenção especial porque não aparece como bug, aparece como "o sistema não faz mais isso".

## Temas abertos
| Tema | Descrição | Prazo |
|---|---|---|
| **Ticket do Francisco** (+ ~2 correlatos) | Compromisso reafirmado ao banco | **20/ago (máximo)** |
| **Erro de reversa no canal caixa** | O serviço recebe a informação em `0`, tenta converter para data, não encontra e devolve resposta negativa ao canal. Todo o fluxo prévio funciona. Pedido: enviar data (ano+dia) e hora nos valores da reversa, como já ocorre no pagamento | — |
| **Estrutura *business* / cartão empresa** | 295 contas regularizadas e enviadas. Aberto: quem executa a mudança de conta de controle → conta de empregado. Cartão empresa criado por **DEM** saiu como **pessoa natural** — e com giro de pessoa natural não dá para associar estrutura empresa | confirmação 18/ago |
| **Renovação antecipada** | Existia no legado e **não funciona na Nuek**: o processo emite uma reimpressão, sem cartão ativo e sem alterar a validade. O **IRD** não distingue renovação normal de antecipada. Existe parâmetro "meses antes do vencimento", hoje em **5 meses** — alterá-lo é **global** e impacta plásticos e processos | reunião dedicada a marcar |
| **LCN — inversão de moeda** | **Desde 15/jul/2026** a proporção virou: ~80% dólar / 20% peso (antes o inverso). A LCN é base de estatísticas e consulta de transações para várias áreas | ticket a abrir |
| **Cartão virtual** | Transações aprovadas operando bem em ambos os BINs com mensagens **1100**; chamou atenção a chegada de mensagens **1120** (advice da bandeira). Novo caso de **rejeição por CVV** | ticket a abrir |
| **Erro 5906 — "Excedido operaciones diarias"** | Rejeição de **anulação** (código de transação 17). Tese do banco: anulação/devolução deveria **subtrair** do contador, não somar. Caso conexo: avance aprovado no processador e revertido nos canais (possível *timeout*), deixando **cota tomada** | sem replicação |
| **Ticket de cota controlada** | — | **31/ago** |
| **Bloqueio com reemissão** *(outra daily)* | Ao bloquear o cartão pelo app ou banco em linha, **o cartão bloqueia mas o novo não é gerado**. Regressão: antes funcionava. Fluxo esperado: bloqueia → novo gerado sem número novo, com PIN, na carteira digital; físico com embossing na hora em qualquer agência. **Nem todas as agências conseguem embossar sem número novo.** Contorno conhecido: eliminar cookies e cartões em processo | — |

## Decisões (18/ago/2026)
1. **Abrir ticket específico para a LCN**, separado do "ticket gigante", por rastreabilidade.
2. **Abrir ticket para o cartão virtual rejeitado por CVV**, consolidando os casos reportados.
3. **Não forçar manualmente** uma renovação antecipada para o cliente pontual — tratar via parâmetro, em reunião específica com os especialistas (incluindo plásticos).
4. Reunião dedicada ao ticket **456675** (reposição × embossing).
5. **Daily fixa às 08h00 por 2 semanas**; reunião da tarde reagendada para depois do retorno da Erika.
6. Caso do cartão empresa criado como pessoa natural: enviar antecedentes por e-mail para análise.

## Riscos
1. **Funcionalidade perdida na migração** — a renovação antecipada existia no legado e não existe na Nuek. A alternativa (mexer no parâmetro de 5 meses) é **global**, com efeito colateral amplo. *"Puede cambiar un solo parametrito, puede gatillar quizás cuántas cosas."*
2. **Distorção da LCN** — a base de estatísticas do banco não é confiável desde 15/jul.
3. **Cartão virtual** com segundo caso de rejeição por CVV e mensagens 1120 inesperadas — não é problema isolado.
4. **Cota tomada indevidamente** em avances (divergência processador × canais) — impacto direto e recorrente no cliente.
5. **Volume e emaranhamento de tickets** — risco explicitado pelo próprio banco de perder rastreabilidade dentro de um ticket gigante.
6. **Transição de PM em pleno período de instabilidade.**
7. Dependência de analista externo com restrição de fuso.

---
[[Home]]
