---
tags: ["tecnico"]
fuente: Transcrições de reuniões set–nov/2026
estado: parcial
---

# Aprendizados das reuniões — set a nov 2026

Versão enxuta do que foi **dito em reunião** entre o fim de agosto e 16/11/2026 sobre produto e processo Visa. Não é documentação oficial: cada ponto traz a reunião de origem (cliente + data; `~` = data inferida) e o que está marcado `[a confirmar]` segue sem validação. A versão completa, com todas as fontes, está na base de conhecimento em `claude/conhecimento-reunioes-set-nov-2026.md`.

## Apple Pay

### Pré-requisitos de abertura
- O projeto técnico com [[CS Implementations]] só abre com pré-requisitos cumpridos; a [[CSM (Customer Success Manager)|CSM]] envia e-mail com os pré-requisitos e o SOW e o [[TPM (Technical Project Manager)|PM técnico]] é designado em 3–5 dias úteis (BancoEstado, ~30/09 e 11/11).
- Pré-requisitos citados no BancoEstado (10 no total, lista completa não aparece): contrato Apple/[[Partner Hub]] com usuários autorizados, registro de [[Third Party Agent|third party agents]], suporte a PAN Source 06, formulário de emissores, SOW (BancoEstado, ~23/09 e 28/10).
- [[Tap to Add Card|Tap to Add]], [[Wallet Extensions]] e [[Push - In-App Provisioning (fluxo verde)|Push Provisioning]] são exigências da Apple; as duas últimas vêm no SDK, Tap to Add não (1:1 Jenny, 28/10).
- A abertura exige ainda data comprometida pelo emissor e contrato VCA com vigência suficiente; um pedido do BROU foi rejeitado com ~3 semanas de contrato (Weekly Tech, 05/10 e 19/10).
- Solution Design (entregável do scoping de pré-vendas, aprovado pelo cliente) passou a ser obrigatório no pedido de abertura (interna, 05/10; weekly Lina, 02/11).
- No [[PRM (Visa Access)|PRM]], basta o terceiro estar carregado (com número de track), não necessariamente aprovado; laboratório não se registra (BancoEstado, 29/10).

### Requisitos funcionais
Detalhe em [[Apple Pay — Issuer Functional Requirements v3.5]]. O que foi reforçado em sessão (BancoEstado, 09/09):
- Aceitar a autenticação do dispositivo em valor alto; não exigir PIN.
- 5 a 10 dispositivos por PAN; ≥95% dos cartões de consumo elegíveis.
- [[Step-up]] com no mínimo dois métodos, um deles SMS; a Apple agora pede app-to-app.
- Não discriminação: regras de fraude e autorização não podem ser mais duras que em outras wallets.
- Ciclo de vida do token independente do plástico; inaceitável a Wallet mostrar o cartão ativo e a compra ser recusada.
- Cliente que aprovisiona e não transaciona em 7 dias deve receber comunicação (BancoEstado, ~30/09, relatado pelo banco).
- Exceções da Apple são raras: escalar cedo e ter o [[Waiver|waiver]] por escrito (BancoEstado, 21/10).

### PAN Source, Tap to Add e Wallet Extension
- PAN Source é o campo de origem do aprovisionamento: entrada manual, push, Tap to Add e Card Continuity. Nos dois últimos não há CVV: não se pode recusar por isso, mas pode-se desafiar (BancoEstado, 09/09).
- PAN Source 06 vai em campo da mensageria (campo 125 `[a confirmar]`) e é provado na [[FIME]]; reprovação → a Apple não libera (BancoEstado, 28/10; 1:1 Jenny, 28/10).
- Tap to Add: só a Apple concede waiver. Segundo Jenny, nunca foi flexibilizado; no BancoEstado foi, para a abertura (BancoEstado, 28/10).
- Wallet Extension é pré-requisito e a Apple não dá waiver — caso BBVA Uruguay escalado até Miami (Weekly Tech, ~28/09 e 16/11). Web Provisioning não é pré-requisito (BancoEstado, ~11/09).

### Partner Hub e FIME
- No [[Partner Hub]]: contrato, questionários (~55), marketing, wireframes e artes. As etapas são sequenciais — a seguinte só aparece após aprovação da Apple (BancoEstado, ~23/09; Corrientes, ~04/09).
- A Visa não distribui material de marketing da Apple (Corrientes, ~04/09).
- [[FIME]] é o único laboratório aceito pela Apple; o emissor contrata direto e só então pede datas; perder a reserva obriga a pedir novas (Weekly Tech, 13/10 e 16/11).
- Duração: 25 dias úteis (5 + 10 + 10) no BancoEstado (14/10); ~5 dias + ~2 semanas no Corrientes (~04/09). A pré-certificação exige app em produção e 100% das funcionalidades (BancoEstado, 04/11).
- FIME não é pré-requisito de abertura, mas é obrigatória para concluir (1:1 Jenny, 14/10).

### Plano e go-live
- Fases: escopo (até o SOW) → desenho da solução → configurações em produção → testes [[Friends and Family]] com [[Whitelist|whitelist]] → pré-certificação e certificação → lançamento (BancoEstado, 14/10).
- Configuração produtiva da wallet: 10 dias úteis, prazo fixo; usa o [[DEF (Digital Enrollment Form)|DEF]] (BancoEstado, ~04/09).
- Não há sandbox Apple nem ambiente pré-produtivo para carteiras: tudo em produção, protegido pela whitelist (BancoEstado, ~04/09).
- A Apple aprova saídas só na 1ª e na 3ª terça-feira do mês, com pedido 1 semana antes; depois, 10 dias de monitoramento conjunto (BancoEstado, ~04/09).
- Go-live = remoção da whitelist pelo emissor (BancoEstado, ~04/09; BROU, 19/08). No Corrientes foi dito que a Visa a libera (~02/10) `[a confirmar]`.
- O 1º dia de produção costuma ter taxa menor; >90% é muito bom (BBVA Uruguay, ~24/08).
- Lançamentos de wallets diferentes não podem ser simultâneos (Weekly Tech, 16/11).
- Prazo: 4–6 meses desde a abertura (BancoEstado, ~04/09); padrão de wallet 6 meses, 4 meses com Apple é inviável (Pipe CS, 04/09).

## SDK da Visa
- É pré-condição das carteiras e do Click to Pay via SDK; SDK + Apple Pay abre-se como um projeto só em CS (time NT, 03/09; interna, 05/10).
- Onboarding Form → a equipe de Manila devolve App ID + shared secret, necessários para inicializar o SDK (BancoEstado, ~04/09).
- A documentação vem no ZIP baixado no [[VDP (Visa Developer Platform)|VDP]] (BancoEstado, ~11/09).
- O SDK não consulta tokens emitidos (ficam no [[VTS (Visa Token Service)|VTS]]) `[a confirmar]`; a lista de cartões e os dados cifrados vêm de serviço do próprio banco (BancoEstado, ~11/09).
- Existe UI embutida e modo headless; as telas da Apple não são alteráveis (BancoEstado, ~11/09).
- SDK agnóstico sem release segmentado por bandeira: o lançamento fica refém da outra bandeira (Comafi, 27/08).
- O processo de SDK é novo e obrigatório para CS LAC (interna com Visa Brasil, 06/10).

## Click to Pay
- [[Click to Pay]] é tratado como [[Mandato|mandato]]; o descumprimento gera penalidade mesmo com acompanhamento VCA (Weekly Tech, ~28/09).
- Fases: (1) enrolamento massivo via [[Processador|processador]]; (2) gestão/ciclo de vida na app do emissor; (3) logo nas credenciais físicas e digitais (Corrientes, 30/09). A Weekly Tech conta duas fases + marketing e T&C (02/11).
- Não conformidade: carta de não conformidade → plano com datas no Visa Access → aprovação por [[Produto (Visa)|Produto]] → mudança de data só antes do vencimento, com penalidade escalonada (5.000 / 10.000 / 15.000…). Planos só até o fim do ano fiscal, 30/09 (Corrientes, 27/08).
- Rules decide a condonação de multas (SOCO, 27/08).
- Em produção habilita-se por produto (crédito/débito), não por [[BIN]]; no sandbox, no máximo 5 BINs de teste (Corrientes, ~28/08).
- Com auto-enrollment ligado, todo registro de cartão enrola em Click to Pay (Corrientes, 24/08).
- Pode ser feito com SDK Visa ou fornecedor próprio (ex.: [[Thales]]); com SDK Visa não havia caso na América Latina até 04/11 (weekly Lina, 02/11; interna, 04/11).
- Aprofundar em [[Click to Pay — SRC, enrolamento e ciclo de vida (aprofundamento)]] e [[Click to Pay — comunicação e marketing (fase 3)]].

## Tokenização e ciclo de vida
- Sequência VTS Card on File/e-commerce: certificação → configuração produtiva → API Key/Shared Secret no VDP → piloto com whitelist → remoção (BROU, 19/08).
- Mudanças produtivas na Visa entram entre 5h e 7h, hora de Miami (BROU, 19/08).
- PAN replacement no [[TLCM (Token Lifecycle Manager)|TLCM]] move todos os tokens para o PAN novo e não tem rollback; rodado antes da vigência do cartão novo, inutiliza o PAN atual para tokenização (BBVA Uruguay, ~24/08 e 31/08).
- Cada BIN tem um token range; promoções por BIN precisam incluí-lo (BBVA Uruguay, 31/08).
- Código 59 no relatório de aprovisionamento = recusa por regra da ferramenta de regras do emissor; recusas por política da Apple entram no mesmo código (Comafi, ~20/08).
- Troca de processador: se o [[TSP (Token Service Provider)|TSP]] foi contratado via processador antigo, este precisa ceder os tokens ou eles se perdem (Naranja X, 08/10).
- Aprofundar em [[Tokenização — arquitetura VTS e provisioning (aprofundamento)]].

## VDMU e arte de cartão
- VDMU (Visa Dynamic Metadata Updater): a Visa atualiza a metadata em nome do emissor e notifica os token requesters; permite também arte por período ("time-based card art") (Grupo Petersen, 16/11).
- Sem VDMU, a arte nova só vale para novos aprovisionamentos — é preciso re-enrolar (Comafi, ~20/08). Com VDMU, atualiza tokens já provisionados (Grupo Petersen, 16/11).
- Não exige desenvolvimento do emissor; só por account range; só credenciais Visa (Grupo Petersen, 16/11).
- Auto-enrolamento de todos os emissores LAC a partir de fevereiro/2027, com opt-out; cobrança desde 01/02/2027 por notificação a device token; valor `[a confirmar no comunicado]` (Grupo Petersen, 16/11).
- A arte fica no portal de metadata ([[VCMM]] `[grafia a confirmar na transcrição]`) e passa por aprovação de marca — ver [[Revisão de Artes]]. Configura-se por faixa de BIN: várias artes no mesmo BIN não se distinguem sem faixa separada (BancoEstado, ~04/09; Corrientes, ~02/10).
- Cada aprovação de arte custa US$ 150; metadados entram em cortes a cada 6 h GMT (Comafi, ~20/08).

## Migração de processador (Pismo)
- Um BIN inteiro pertence a um único processador; gradualidade só por BIN inteiro ou abrindo BIN de 6 em BINs de 8 (Naranja X, 07/10).
- O identificador do processador para o cliente (PCR `[sigla a confirmar]`) não se migra: migração = PCR novo + certificação completa (Weekly Tech, ~29/09). A Pismo sobe um PCR novo por cliente (Naranja X, 03/11).
- BIN novo só se configura quando existe o PCR do processador novo; amarrado ao antigo, vira migração (Naranja X, 15/10).
- Produto que o processador ainda não tem em produção no país = certificação completa, ~90 dias (Naranja X, 08/10).
- Dois níveis de teste: sandbox do processador → sandbox Visa (Naranja X, 03/11).
- Freeze de fim de ano: de dezembro (12/12, dito em 07/10) até 06/01, em produção e em sandbox (Naranja X, 08/10).
- O projeto Visa entra depois de o cliente avançar na integração com o processador (Naranja X, 03/11). Sem recursos Pismo alocados, CS não abre projeto (Weekly Tech, 16/11).
- Zero Balance: saldo fora da Pismo; autorização via webhook ao emissor; o ISO completo vai por fila e não serve para decidir (Naranja X, ~02/10).
- Mandatos semestrais da marca são do processador; fees por approval rate e provisioning rate são do emissor (Naranja X, 08/10).

## Liquidação e tesouraria
- Via Pismo, o emissor recebe o arquivo de [[Clearing|clearing]] com o PAN trocado por ID; conciliação e pagamento à Visa são do emissor (Naranja X, ~02/10 e 05/11).
- Principal member tem contas de [[Settlement|liquidação]] próprias; quem não é, liquida via processador e só recebe a fatura (Naranja X, 08/10; Grupo Petersen, 12/11).
- Numa fusão de emissores, cada BIN tem um "numérico de tesouraria" ligado a uma conta de liquidação; é preciso decidir para onde cada um aponta (Grupo Petersen, 12/11; interna, 12/11).
- Ordem recomendada: assessment Visa → definição com o cliente → acionar o processador (Grupo Petersen, 12/11).
- O processador vê reclassificação; a Visa vê transferência entre emissores independentes (interna, 12/11).

## Featurespace ARIC e risco
- ARIC é plataforma completa de gestão de risco, SaaS em AWS, com ambiente isolado por cliente (demo, 09/10).
- Integração por API de eventos única; saída de dados por S3 bucket (demo, 09/10).
- Retenção: 3 meses ao vivo, 13 meses de histórico; auditorias mais longas dependem de exportação do cliente (demo, 09/10).
- Não é orquestrador nem tem SLA nativo por incidente; relatórios à medida são ponto fraco assumido (demo, 09/10).
- Integração direta VisaNet → Featurespace está em roadmap, sem data firme (BCI, 05/10; 1:1 Lina, 26/10).
- ~6 meses de dados mínimos para boas decisões (1:1 Lina, 26/10).
- Squad de autorizações: diagnóstico → debrief ~7–10 dias depois → acordo de roadmap → governança recorrente (Bapro, 08/09). Ver [[Squad de autorizações e fraude]] e [[BCI (Featurespace) — dossiê]].

## Relatórios e suporte
- VAP (Visa Analytics Platform): approval rates e o relatório mensal obrigatório de Apple Pay, pré-montado; módulos 1, 2 e 14 (Naranja X, 08/10; BancoEstado, 21/10).
- Support Hub no Visa Access é o canal obrigatório para análise técnica; se não resolver, escala-se com Produto (Corrientes, 27/08).
- Para analisar um aprovisionamento: data/hora, Correlation ID, BIN + últimos 4 (BancoEstado, ~04/09).
- Qualquer configuração (teste ou produção) segue processo formal de até 10 dias úteis, com custo (Corrientes, ~04/09). CS pode fazer "Expedite" em 1–2 dias; usado sem custo no BBVA, cria precedente (Weekly Tech, 16/11).

## Como a Visa trabalha
- [[VIS (Visa Implementation Services)|VIS]] acompanha e orquestra; não executa nem promete prazos. O PM técnico de CS só entra com projeto aberto e fecha com carta de turnover (Pipe CS, 04/09; time NT, 03/09).
- CSM é o referente antes do projeto e o primeiro nível depois; BD é dono do contrato de incentivos e pode fazer waiver de cobrança (Pipe CS, 04/09).
- Pré-vendas de VAS cuida só da venda e do Solution Design; aberto o projeto, é CS (VAS × VIS, 20/10).
- Pipeline VCA × CS: frentes *prospecting* e *implementing*; tablero com uma aba por semana, unidade = track; reunião às terças desde outubro (Pipe CS, 04/09; BiWeekly, 08/10).
- Ficam fora da pipe com CS: squads de autorizações/fraude, Feature Space e BAU (Pipe CS, 04/09).
- Sem contrato VCA vigente, CS cobra por billing — USD 3.000/mês de Tech PM (Weekly Tech, ~29/09).
- O contrato deve começar quando o cliente já pode operar; contrato assinado vai para a pasta compartilhada com CS (Pipe CS, 04/09; Weekly Tech, 19/10).
- Ambiente de testes fora de projeto contratado e revisão de Gantt sem assinatura têm custo (US$ 350) (Pipe CS, 04/09).
- Ano fiscal fecha em 30/09; oportunidades entram no VPC (Visa Project Central); a auditoria olha só a evidência subida no sistema (BiWeekly, 08/10; weekly de equipe, ~10/09).
- Não gerar listas de PAN a partir de fragmentos (weekly de equipe, ~10/09).
- Ver também [[7. Mandatos e Waivers]].

## Referência externa — NÃO validada contra o processo Visa LAC
Relato de emissor brasileiro com **Mastercard** (conversa "Wallets - Entendimento", ~20–21/08). Serve de referência de mercado, não de regra:
- Três métodos: OTP por SMS, app-to-app e push provisioning; quem oferece app-to-app também oferece o caminho de dentro do app.
- Os roteiros de teste "sujam" aparelhos e contas; aparelho bloqueado na carteira não serve mais para teste.
- FIME: pré-certificação + certificação em 15–21 dias; exclusividade Apple de ~3 meses `[como relatado; validar]`.
- Opinião do convidado: 4–5 meses se os pré-requisitos estiverem prontos.
- Os riscos reais estão em volta do SDK: segurança/autenticação e ciclo de vida do token.

## Divergências a resolver
- Regras sugeridas de VRM: a Visa entrega (BancoEstado, 29/10) × não envia mais (BROU, 19/08).
- Quem remove a whitelist: emissor (BancoEstado, BROU) × Visa (Corrientes).
- Billing de CS: "3.500 dólares" (Pipe CS, 04/09) × USD 3.000/mês (Weekly Tech, ~29/09) — vale o mais recente.
- Pismo × CS: "não passa por CS" (time NT, 23/09) × CS dá o plano e abre projeto (Naranja X, 03/11; Weekly Tech, 16/11).

---
[[Home]]
