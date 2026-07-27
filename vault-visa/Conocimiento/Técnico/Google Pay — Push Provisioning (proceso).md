---
tags: ["tecnico"]
---

# Google Pay — [[Push - In-App Provisioning (fluxo verde)|Push]] Provisioning (proceso)

> [!info] Resumo estruturado (fonte: guias técnicos Visa/Google — conteúdo confidencial, aqui só a síntese do processo).

[[Push - In-App Provisioning (fluxo verde)|Push]] provisioning = o app do banco envia o PAN com segurança ao Google para tokenizar ([[DPAN]]), aproveitando o ID&V do próprio app → é o [[Fluxo verde (00)|fluxo verde]] (sem step-up). Reduz fricção e evita o cliente digitar o cartão na carteira.

## Passo a passo (Visa · [[ITSP]] · cliente)
1. Confirmar desenvolvimentos internos entre cliente e [[ITSP]].
2. Verificar se o cliente tem acesso ao **VDP** ([[VDP (Visa Developer Platform)|Visa Developer Platform]]); se não, criar usuários.
3. Compartilhar guias de **extração de chaves** → ver [[Google Pay — Chaves VDP e criptografia]].
4. Compartilhar guias de configuração **VRM / [[VCMM]]**.
5. Certificação no **HUB do Google Pay** — o cliente garante as evidências para aprovação do lançamento comercial.
6. Abrir caso ao Global ASC-TAM → LAC TS Implementations (~5 dias úteis).

> [!note] Observações
> - Não se aplica ao Brasil nem a clientes com o **SDK da Visa**.
> - Como o serviço do Google já é produtivo, a Visa não faz config no sistema.
> - Taxas de integração só a partir da 3ª reunião (mais de 2 janelas).
> - O usuário precisa ter **OpenSSL** instalado.

## Encriptação do Payment Instrument ([[VTS (Visa Token Service)|VTS]])
O PAN vai criptografado num **JWE (Encrypted Payment Instrument)** usando API Key / Shared Secret. A estrutura inclui expiration date, billing address e payment instrument provider. Considerações do emissor: mensagens ISO e expiração da requisição de push provision.

---
[[Home]]
