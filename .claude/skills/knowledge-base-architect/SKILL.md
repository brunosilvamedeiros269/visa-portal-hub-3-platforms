---
name: knowledge-base-architect
description: Arquitetura de informação e ingestão para a Base de Conhecimento Visa. Use ao adicionar/organizar projetos, reuniões, produtos, mandatos ou termos, ao processar transcrições/atas/PPTX/PDFs em notas estruturadas, ou ao criar ligações cruzadas entre entidades.
---

# Knowledge Base & Information Architect

Você mantém a arquitetura de informação da **Visa — Base de Conhecimento Ativa**.
Leia o `CLAUDE.md` da raiz antes de agir — ele define a arquitetura e os padrões.

## Modelo de entidades

O app (React + Supabase) é a fonte da verdade; as pastas markdown são **seed inicial**.

| Pasta markdown (seed) | Entidade | Tabela / aba no app |
|---|---|---|
| `01_Projetos/` | Macro e micro-projetos (tracks) | `projects_macro` → aba Projetos |
| `02_Reunioes/` | Reuniões e transcrições processadas | `meetings` → aba Reuniões |
| `03_Produtos/` | Páginas de produtos Visa | `shelves` → aba Wiki |
| `04_Visa_Workflows/` | Mandatos e processos Visa | `shelves` → aba Wiki |
| `05_Dicionario_Termos/` | Siglas, campos e regras | `data_terms` → aba Dicionário |

## Padrão de metadados

Toda entidade começa com **YAML frontmatter**. Campos mínimos por tipo:

- **Projeto**: `id, cliente, titulo, status, fase, gerente_visa, data_inicio,
  proximo_marco, produtos[], tags[]`.
- **Reunião**: `id, data, projeto_id, participantes[], produtos_citados[], tags[]`.
- **Produto / Mandato / Termo**: `id, titulo, tipo, tags[]` (+ `mandato`/`vigencia` quando aplicável).

Estados de status válidos: `Em Andamento`, `Aguardando Cliente`, `Em Certificação`,
`Mandato Pendente`, `Concluído`.

## Cadências de reunião

Três tipos, todos alimentáveis por transcrição:
- **Board mensal** (board do cliente) → nível **macro-projeto**.
- **Semanal** (por projeto/track) → nível **micro-projeto**.
- **Ad-hoc** (sob demanda) → ligada ao projeto/track pertinente.

## Ingestão multiformato (o "ativo" da base)

Ao receber uma transcrição, ata, PPTX, PDF ou link:

1. **Classifique** por Cliente, Projeto, Produto(s) Visa e Data.
2. **Extraia** para a nota estruturada, sempre com três blocos:
   - **Decisões** (o que foi decidido e por quê)
   - **Action Items** (responsável + prazo, em checkbox `- [ ]`)
   - **Riscos / Bloqueios**
3. **Ligue** (cross-linking) — ver abaixo.
4. Salve na pasta correta com frontmatter completo.

## Ligações cruzadas (bi-directional)

- Reunião → **1 Projeto**, **N Produtos**, **N Termos**.
- Projeto → seus **Mandatos** e **Produtos**.
- Use **caminhos relativos do repositório** (ex.: `../03_Produtos/Apple_Pay.md`), nunca
  caminhos absolutos de disco.

## Regras

- **Nunca** crie pasta ou serviço paralelo novo — procure onde a informação já vive.
- Preserve frontmatter e status padronizados.
- Português, objetivo, coerente com o conteúdo existente.
