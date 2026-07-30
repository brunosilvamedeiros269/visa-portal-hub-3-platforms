-- Bloco C — reunión multi-track — 2026-07-29
-- `reunioes` já tem cliente_id/projeto_id e `reunion_tracks` já é N:N: nada a fazer ali.
-- `riscos` já aceita projeto_id OU track_id. A única mudança é em `tareas`.
-- Itens transversais de reunión (ações que ligam o projeto inteiro, não apenas uma track)
-- agora podem ser criados com projeto_id, deixando track_id nulo.
-- Idempotente. Rodar no SQL Editor do projeto iuwvwhofxuvmwnpbsnth.

-- 1. tareas: passa a aceitar alvo track OU proyecto (itens transversais de reunión)
alter table tareas alter column track_id drop not null;
alter table tareas add column if not exists projeto_id uuid references projetos(id) on delete cascade;
create index if not exists tareas_projeto_idx on tareas(projeto_id);

-- 2. exatamente um dos dois (mesmo padrão do check de `riscos`).
-- As linhas existentes têm track_id preenchido e projeto_id nulo, então já satisfazem.
do $$ begin
  alter table tareas add constraint tareas_scope_chk
    check ((projeto_id is null) <> (track_id is null));
exception when duplicate_object then null; end $$;

-- 3. Backfill de reuniones creadas antes de este bloque: el `createReuniaoParaTrack`
-- que existía entonces nunca seteaba `reunioes.projeto_id` (solo ligaba por
-- reunion_tracks), así que el card "Reuniones del proyecto" — que filtra por
-- `reunioes.projeto_id` — no las mostraba. Idempotente: solo toca filas con
-- projeto_id nulo que tengan una track ligada.
update reunioes r
set projeto_id = t.projeto_id
from reunion_tracks rt
join tracks t on t.id = rt.track_id
where rt.reuniao_id = r.id and r.projeto_id is null;
