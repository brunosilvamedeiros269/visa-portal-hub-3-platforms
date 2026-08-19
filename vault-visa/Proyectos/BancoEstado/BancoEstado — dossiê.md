---
tags: ["proyecto", "cliente/BancoEstado"]
fuente: Sesiones de presentación del proceso — BancoEstado (ago/2026)
estado: parcial
---

# 🇨🇱 BancoEstado (Chile) — Apple Pay + SDK Visa

> [!info] Dossiê de projeto (contexto qualitativo)
> Projeto **ainda não aberto**. Aqui fica o registro das duas sessões de apresentação do processo, antes da abertura formal.

> [!note] Estado desta nota
> As duas transcrições disponíveis **não trazem data absoluta** — sabe-se apenas que são de dias consecutivos, com a segunda às 16:00. Datar antes de usar como referência histórica.

## Ficha
- **Cliente:** BancoEstado. **País:** Chile.
- **Produto:** **Apple Pay** com integração do **SDK da Visa** no app do banco. O SDK é **pré-requisito** do Apple Pay.
- **Estágio:** **pré-projeto** — *"es que no hay proyecto… todavía estamos en los temas contractuales"*. Sem projeto aberto não há PM técnico designado.
- **Fornecedor do banco:** **Veritran** — já certificada como [[TSP (Token Service Provider)|TSP]], mas falta o registro como **[[Third Party Agent|agente terceiro]]**.

**Contatos —** Visa: **Soledad Rúa** (diretora de Implementações Conosur), **Jenny Johansen** (PM funcional), **Bruno Da Silva** (PM funcional), **Lorena Retamales** ([[CSM (Customer Success Manager)|CSM]] dedicada), Gerardo (contratos/Digital Enablement), "Pancho"/Francisco (técnico). BancoEstado: Ángela (coordenação do projeto, com Rodrigo Miranda e Cynthia), Oscar (chefia de tecnologia), **Felipe Muñoz** (líder técnico), Claudio e Claudia (produto), Marcelo, Humberto (autorizações), Jorge Núñez (revisão contratual).

## Status atual
Travado no **contratual**. Três contratos estão em jogo e o terceiro é o que impede a abertura:

| Contrato | Situação |
|---|---|
| Com a **Apple** | ✅ **Assinado** — anexar ao caso na abertura |
| **SDK da Visa** | Em assinatura, "dentro destes dias" |
| **Serviço de acompanhamento / consultoria Visa** | ⚠️ **Não contratado** — é este que trava a abertura e a designação do PM |

**Desbloqueio decidido:** a Visa **libera o SDK antes da assinatura**, via [[VDP (Visa Developer Platform)|VDP]], assim que o banco enviar nome + e-mail dos usuários — para não travar o avanço técnico.

## O conflito central: prazo
| | |
|---|---|
| **Meta interna do banco** | **Produção idealmente em dezembro** |
| **Plano do banco** | 3 semanas de pré-requisitos + **18 semanas** de configuração/desenvolvimento (4 do banco + 14 atribuídas à Visa) |
| **Leitura da Visa** | 3 semanas de pré-requisitos é curto; o cronograma do banco lê como **~8 meses** |
| **Benchmark declarado** | *"No tenemos un caso en la región, incluyendo Chile, Argentina, Uruguay, que se haya hecho en menos de seis meses."* |
| **Resposta do banco** | *"No tiene por qué ser una limitante, porque podríamos ser el primero."* |

> [!warning] Mal-entendido de fundo que já foi corrigido em reunião
> O plano do banco atribuía **14 semanas à Visa**. **A Visa não desenvolve.** Entrega bibliotecas/SDK, guia técnica, apoio de consultoria, configuração do lado Visa e certificação — todo o desenvolvimento (front, back, wallet, portal, [[Wallet Extensions]], carga de certificados) é do banco. Vale registrar isso por escrito antes de o projeto abrir.

## Tempos apresentados ao cliente
- Pré-requisitos: **3 a 4 semanas** se o cliente estiver quase pronto; há casos reais de **3, 4 e até 6 meses**.
- Só a implementação de Apple: **4 a 6 meses**.
- Pacote SDK + Apple: **7 a 8 meses** até o go-live, com a **certificação (~1 a 1,5 mês) já dentro**.
- Acompanhamento produtivo pós-go-live: **~2 semanas**.

## Pré-requisitos
| Item | Situação |
|---|---|
| Caso via **BCH no [[PRM (Visa Access)|Visa Access]]** + formulário + **[[SOW Token Service|SOW]]** | A preencher com apoio da CSM |
| Contrato do SDK | Em assinatura |
| Contrato com a Apple | ✅ Assinado |
| Serviço de acompanhamento | ⚠️ Não contratado |
| Enrolamento no [[VDP (Visa Developer Platform)|VDP]] | Pendente. **Bloqueio:** o banco filtra links em e-mails externos; o TI precisa liberar |
| Terceiros como [[Third Party Agent|agente terceiro]] | Veritran é [[TSP (Token Service Provider)|TSP]] certificada; falta o registro como agente terceiro |
| APIs de [[Tokenização|tokenização]] | Já operam para Google Pay e carteira própria. **Ambiguidade aberta:** quais APIs são do core do banco, quais da Veritran e quais são as APIs Visa do TSP |
| [[BIN|BINs]] tokenizados | ✅ **Verificado — OK** |
| [[Tap to Add Card]] | Mandato ao qual o banco não aderiu antes |
| VRM | Já usam; criar as regras do projeto antes de produção |
| [[Step-up]] adicional | Hoje **só OTP SMS**. A Apple exige mais — provável **app-to-app** via Veritran, com certificação junto à Visa. **Esforço não dimensionado** |

**Critério de abertura:** os desenvolvimentos **não precisam estar prontos, mas avançados e com prazo dimensionado** — a Visa não mantém projetos abertos sem avanço.

## Pontos técnicos registrados
- **[[Tap to Add Card]] não exige desenvolvimento de leitura** — quem lê a antena NFC é a Wallet. Para o banco, o que muda é receber um **valor novo num campo já existente** de origem do provisionamento. Precisa ser validado com o time de **autorizações** para não quebrar a mensageria.
- **O CVV não chega ao emissor** nesse fluxo — a Visa valida com as próprias chaves. **Risco concreto:** *"algunos bancos erróneamente… lo desarrollaron de manera dura, que todo provisionamiento tenía que venir con CVV y si no venía lo declinaban"*.
- Os métodos de [[Step-up|step-up]] são desenvolvimento do banco, mas **certificados com a Visa**.
- **13 requisitos funcionais da Apple** citados como lista de referência.
- Documentação do SDK: **~500 páginas**, entregue poucos dias antes.

## Governança proposta
Kick-off com stakeholders · **reunião semanal** de avanço · espaços ad hoc (produto, CSM) · **SteerCo mensal ou bimestral** · **~2 semanas de monitoramento produtivo** pós go-live. Sessões de consultoria ad hoc (ex.: regras de VRM fora do padrão) são **pagas**.

## Pendências e riscos
- **Assinar o contrato do SDK** e **decidir a contratação do acompanhamento** — sem isso não há projeto.
- **TI do banco liberar e-mails com link** para acesso ao [[VDP (Visa Developer Platform)|VDP]].
- **Confirmar com autorizações** o suporte ao novo valor do campo de origem do provisionamento.
- **Verificar o registro da Veritran como [[Third Party Agent|agente terceiro]]**.
- **Enviar o checklist do que é exclusivo de Apple** (o que não é coberto pelo que já existe para Google Pay) e a documentação de APIs — prometido pela CSM.
- **Dimensionar o prazo dos desenvolvimentos do banco** (SDK, step-up adicional, front) — pré-condição para abrir.
- **Responder o conjunto de dúvidas técnicas** sobre o SDK.
- **Risco de relacionamento:** o banco pediu reuniões diárias e "modalidad de proyecto", criticando burocracia e fluidez da comunicação. O canal indireto (Oscar → Claudio → Visa) já causou perda comprovada de mensagens; foi autorizado canal direto.
- **Risco de expectativa:** meta de dezembro contra benchmark de 6+ meses. Registrar por escrito.

---
[[Home]]
