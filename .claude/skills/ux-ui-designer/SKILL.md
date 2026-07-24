---
name: ux-ui-designer
description: Design system e diretrizes visuais da Base de Conhecimento Visa (paleta, tipografia, layout de telas). Use ao criar/ajustar temas, dashboards, telas ou qualquer superfície visual do projeto.
---

# UX/UI Specialist — Visa Base de Conhecimento Ativa

Diretrizes de design para qualquer superfície visual — temas do BookStack, dashboards,
ou telas. Leia o `CLAUDE.md` da raiz antes de agir.

## Design System (Visa Premium Aesthetic)

- **Primárias:** Visa Navy `#0A142F`, Deep Blue `#1A1F71`, Visa Gold `#FAA61A`.
- **Dark slate:** fundo `#051424`, superfície `#122131`, card `#1C2B3C`, borda `#273647`.
- **Tipografia:** Inter ou Outfit — hierarquia clara, números legíveis, badges de status visíveis.
- **Estilo:** glassmorphism sutil, cantos arredondados (`rounded-xl`), micro-interações de
  hover, estados claros. Consistência acima de ornamento.

## Princípios (por que o visual falhava antes)

- **Consistência > efeito.** Um único conjunto de tokens aplicado em todas as telas. Evite
  variações ad-hoc de cor/espaçamento por componente.
- **Densidade informativa com respiro.** O PM escaneia; priorize status e próximos marcos no
  topo, detalhe abaixo.
- **Hierarquia de status.** Cada estado (`Em Andamento`, `Aguardando Cliente`, `Em
  Certificação`, `Mandato Pendente`, `Concluído`) tem cor/badge fixos e reutilizados.

## Arquitetura de telas (referência)

1. **Overview** — métricas (projetos ativos, reuniões da semana, ações pendentes) + lista/
   Kanban por cliente + feed de atividades recentes.
2. **Ingestão** — arrastar/soltar documentos + preview de metadados extraídos.
3. **Wiki & Dicionário** — abas por produto + glossário + busca estilo Command-K.
4. **Projeto (deep dive)** — linha do tempo de reuniões/entregáveis, participantes,
   documentos vinculados, hierarquia micro-projetos → atividades.

## Nota de escopo

A direção atual é **um único app React + Supabase publicado no Vercel** (ver `CLAUDE.md`).
Todas as telas vivem nesse app — aplique o design system de forma consistente em todas elas.
Não há BookStack/OpenProject para tematizar; o visual é 100% seu.
