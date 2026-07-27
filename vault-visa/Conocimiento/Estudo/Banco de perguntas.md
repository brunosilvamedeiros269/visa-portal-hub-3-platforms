---
tags: ["estudo"]
---

# Banco de perguntas (com respostas)

Responda de cabeça e clique para revelar. Se acertou a ideia central, está dominado. Ver [[Plano de estudos]].

## P1 · Fundamentos de pagamentos
<details><summary>Desenhe o caminho de uma compra, do início até a aprovação voltar.</summary>

Portador → Comércio → [[Adquirente]] → Visa ([[VisaNet]]) → [[Processador]] → [[Emissor]]. O emissor (ou o processador em nome dele) confere saldo/fraude e aprova; a resposta volta pelo caminho inverso.
</details>
<details><summary>Qual a diferença entre autorização, clearing e settlement?</summary>

**Autorização:** aprovação em tempo real (checa saldo/fraude) — mas o dinheiro não se move. **[[Clearing]]:** troca e conciliação das informações. **[[Settlement]]:** liquidação, quando o dinheiro efetivamente se move (em lotes).
</details>
<details><summary>Diferencie processador, adquirente e emissor.</summary>

[[Emissor]] = banco do cliente. [[Adquirente]] = banco do comércio. [[Processador]] = empresa técnica que opera as mensagens por conta de um emissor OU adquirente. [[Sistarbank]] (BROU) e [[Prisma]] (Corrientes) são processadores emissores.
</details>
<details><summary>O que são as mensagens 0100 e 0110?</summary>

Tipos de mensagem do padrão [[ISO 8583]]: 0100 = requisição de autorização, 0110 = resposta.
</details>

## P2 · [[Tokenização]]
<details><summary>Por que quase nenhum emissor se conecta direto ao [[VTS (Visa Token Service)|VTS]]?</summary>

Porque o [[TSP (Token Service Provider)|TSP]] entrega valor agregado — gerencia o ciclo de vida dos tokens e oferece consoles. Sem ele, o banco teria que programar tudo.
</details>
<details><summary>O que muda entre o fluxo verde e o amarelo?</summary>

Verde ([[Approve Provisioning]] = 00): aprovação incondicional, sem step-up (enrolar de dentro do app do banco). Amarelo (85): condicional; o token fica inativo até uma verificação extra (OTP, call center, app-to-app).
</details>
<details><summary>[[FPAN]], [[DPAN]] e [[MPAN]] — o que é cada um?</summary>

[[FPAN]] = número real do cartão. [[DPAN]] = token no dispositivo (Apple/Google Pay). [[MPAN]] = token vinculado a um comércio (recorrência).
</details>
<details><summary>O que é [[CTF (Cloud Token Framework)|CTF]] e [[TAVV]]?</summary>

[[CTF (Cloud Token Framework)]]: device binding para tokens de e-commerce/CoF existentes. [[TAVV]]: cryptograma de verificação enviado na transação de um token.
</details>

## P3 · Carteiras (Apple / Google)
<details><summary>Cite três pré-requisitos que a Apple exige e o Google não.</summary>

Laboratório [[FIME]] com data-alvo; [[Wallet Extensions]]; e o contrato/NDA específico da Apple. O Google pede bem menos.
</details>
<details><summary>Por que o Google não deixa tokenizar em produção antes do [[CTA (Click-to-Accept)|CTA]]?</summary>

O [[CTA (Click-to-Accept)|CTA]] autoriza o uso das APIs de push provisioning. O Google proíbe qualquer tokenização em produção antes de aceitá-lo — acordo padrão e não customizável.
</details>
<details><summary>Um cliente diz que o push provisioning crasha. Primeiras hipóteses?</summary>

Ver se a config da Visa está OK (fluxo amarelo funciona? T&C carregados?). Se sim, o problema está no [[ITSP]]/SDK: checar o payload/token de login (expiração), publicar no [[TestFlight]], confirmar o [[AID (Apple)|AID]] e comparar via Correlation ID / Token Reference ID ([[Vital Sign]]).
</details>
<details><summary>O que é o mandato [[UPP (Unified Push Provisioning)|UPP]] e até quando vale?</summary>

[[UPP (Unified Push Provisioning)|Unified Push Provisioning]]; todos os emissores devem migrar até o fim de 2026. Pré-requisito: manter também o manual provisioning.
</details>
<details><summary>O [[Partner Hub]] é técnico ou administrativo?</summary>

Administrativo (bines, produtos, certificador, marketing). Problemas técnicos de push provisioning não se resolvem lá.
</details>

## P4 · [[Click to Pay]]
<details><summary>Por que o [[Click to Pay]] é cross-emisor e cross-marca?</summary>

Porque é solução de indústria (SRC/[[SRC - EMVCo|EMVCo]]). Ao logar (email ou telefone, via OTP), o lookup lista todas as credenciais associadas àquele contato — Visa, Mastercard, de vários bancos.
</details>
<details><summary>Quais são as três fases do mandato — e qual não tem [[TPM (Technical Project Manager)|TPM]]?</summary>

(1) [[Enrolamento massivo]] + T&C + data privacy; (2) ciclo de vida nos canais do emissor; (3) logo [[Click to Pay]]. A fase (2), ciclo de vida, não tem [[TPM (Technical Project Manager)|TPM]].
</details>
<details><summary>O que acontece com o perfil do [[Destination Site]] após o enrolamento massivo?</summary>

Fica somente leitura: o usuário não gere mais nada por lá. Toda a gestão passa aos canais do emissor.
</details>

## P5 · Mandatos, waivers e PMO
<details><summary>Diferença entre mandato e waiver — e quem concede o waiver de uma carteira?</summary>

[[Mandato]]: regra da Visa; descumprir gera multa, mas não para o serviço. [[Waiver]]: permissão temporária, com compromisso futuro. Nas carteiras, quem concede é Google/Apple (não a Visa). Exige evidência escrita.
</details>
<details><summary>Em que passo do fluxo nós entramos, e o que valida a abertura do projeto?</summary>

Entramos no passo 5 (pré-requisitos). A abertura só ocorre com 100% dos pré-requisitos + contrato, via ticket na [[VCMM]] (com apoio do [[CSM (Customer Success Manager)|CSM]]).
</details>
<details><summary>O cliente te pressiona por uma data. O que pode (e não pode) prometer?</summary>

Não comprometer prazo por conta própria. Pode pedir às implementações um plano de alto nível e apresentar esse plano validado. Nunca mostrar cronograma de projeto parecido.
</details>
<details><summary>Para que servem [[VCMM]], [[PRM (Visa Access)|PRM]] e [[Whitelist]]?</summary>

[[VCMM]]: plataforma da Visa para clientes (abertura via ticket, artes, T&C). [[PRM (Visa Access)]]: enrolar o [[ITSP]] como [[Third Party Agent]]. [[Whitelist]]: lista de PANs liberada com o processador para a fase de testing.
</details>

---
[[Home]]
