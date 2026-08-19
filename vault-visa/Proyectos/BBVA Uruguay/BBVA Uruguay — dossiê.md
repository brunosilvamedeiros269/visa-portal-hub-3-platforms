---
tags: ["proyecto", "cliente/BBVA-Uruguay"]
fuente: Seguimiento Switch ITSP + Google Pay (18/ago/2026)
estado: verificado
---

# 🇺🇾 BBVA Uruguay — Switch/ITSP + Google Pay

> [!info] Dossiê de projeto (contexto qualitativo)
> Projeto **em reta final**. Assumido por Bruno durante a licença da Lina (ago/2026).

## Ficha
- **Cliente:** BBVA Uruguay. **País:** Uruguai.
- **Escopo:** troca de **switch / [[ITSP]]** + habilitação de **Google Pay** ([[Push - In-App Provisioning (fluxo verde)|push provisioning]] e provisionamento *legacy*), gestão de tokens via **[[TLCM (Token Lifecycle Manager)|TLCM]]**.
- **Governança:** reunião recorrente de seguimento, pauta curta, minuta enviada pela Visa.
- Descrito na própria reunião como "proyecto muy largo y complicado" — está fechando.

## Status atual (base: 18/ago/2026)
**Testes concluídos** — push provisioning e *legacy* funcionando. **Material de marketing aprovado pelo Google** (após uma mudança de logo). O passo seguinte é a Visa enviar ao Google o pacote (testes + material) propondo a data de saída.

**Sequência até o fecho:** aprovação do Google → levantar a [[Whitelist|whitelist]] → alguns dias de monitoramento em produção (taxas de provisionamento e transacionalidade) → **encerramento do projeto**.

## Decisões (18/ago/2026)
1. **Propor 20/ago como data de go-live**, enfatizando ao Google a relevância dessa data.
2. **Descartar 24 e 26/ago** — **25/ago é feriado nacional no Uruguai** (Dia da Independência), com pouco suporte, e sair no dia 26 desperdiça a semana.
3. **Lançamento apenas Android → sem redes sociais** no início ("no queremos hacer mucho ruido"), para não frustrar portadores de iOS. Pode ampliar depois, sempre com nova aprovação do Google.
4. **Toda nova campanha de marketing de Google Pay passa pelo portal para aprovação do Google.**
5. **O tema de [[TLCM (Token Lifecycle Manager)|TLCM]] não bloqueia a saída** — segue como investigação em paralelo.

## Pendências e riscos
- **Resposta do Google sobre a data** — está fora do controle da Visa e o Google costuma pedir mais prazo. Risco direto sobre o dia 20.
- **Janela de calendário estreita** — o feriado de 25/ago reduz o suporte; deslizar do 20 empurra o go-live para depois de 26.
- **[[TLCM (Token Lifecycle Manager)|TLCM]] — rollback de reatribuição de token.** O banco perguntou se é possível desfazer a reatribuição de tokens a um PAN anterior (rollback de uma troca de cartão feita por erro). Sem resposta conclusiva. Em teste, ao forçar uma substituição, o cartão "antigo" **não pôde ser provisionado novamente**. Entendimento preliminar: ao desabilitar um PAN no TLCM e religar seus tokens a um PAN novo, evita-se que aquele PAN volte a ser provisionado — **a confirmar**. Afeta um grupo reduzido de cartões já alterados.
- **Publicar o app do banco** para o push aparecer na data de saída.
- **Risco de handover no banco** — o responsável trabalha por projeto e migrará para outro; o procedimento de aprovação de marketing junto ao Google pode se perder. **Deixar por escrito na entrega.**

> [!tip] Regra de marca a registrar na entrega
> Toda comunicação nova relacionada a Google Pay deve ser **subida ao portal e aprovada pelo Google** (logos corretos, consistência de imagem de marca). Isso vale **depois** do lançamento, para cada campanha — e é exatamente o tipo de procedimento que se perde num handover interno do banco.

---
[[Home]]
