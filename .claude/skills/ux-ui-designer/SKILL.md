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

## Idioma (regra fixa)

**Interface pública 100% em espanhol.** Sem seletor de idioma. Rótulos, botões, KPIs,
mensagens e datas em ES. Valores de status vêm do Notion e são exibidos em ES via mapa
`STATUS_LABEL` (traduza a exibição, não o dado).

## Marca

Header com **wordmark Visa** (branco, itálico, com acento dourado) + "Base de Conocimiento
Activa". Menu de mercado, limpo: **Seguimiento · Proyectos · Wiki · Diccionario**. Sem
referências a ferramentas internas (OpenProject/BookStack/Docker) e sem botões promocionais.

## Arquitetura de telas (atual — 3 níveis)

1. **Panel (Seguimiento)** — KPIs + cards por **proyecto** com resumo dos tracks.
2. **Detalle de proyecto** — todos os tracks + documentos do projeto.
3. **Detalle de track** — status, próximo paso, histórico, **Actividades**, **Reuniones**,
   **Documentos** e dependências (Depende de / Requerido por).

## Nota de escopo

Um único app React (`app/`) no **Vercel**, lendo/escrevendo o **Notion** via `/api/notion`.
Todas as telas vivem nesse app; aplique o design system de forma consistente. Ver
`development-workflow`.
