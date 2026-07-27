-- Camada PMO (Bloco A) — 2026-07-27
-- Decisão CSM: gerente-é-csm? NÃO. 'projetos.gerente' guarda uma LISTA de gerentes
-- (ex.: "Bruno / Jenny / Lina"); o CSM é papel distinto → criar coluna 'csm'.
-- Rodar no SQL Editor do projeto iuwvwhofxuvmwnpbsnth. Idempotente (if not exists).
-- Storage: o bucket 'track-docs' (privado) e suas policies são criados pelo próprio
-- script (seção 8) — a etapa manual de criar o bucket pelo Dashboard vira opcional.

-- 1. marcos
create table if not exists marcos (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references tracks(id) on delete cascade,
  nome text not null,
  fecha date,
  concluido boolean not null default false,
  orden int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists marcos_track_idx on marcos(track_id);

-- 2. riscos (RAID) — ligável a projeto OU track
create table if not exists riscos (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid references projetos(id) on delete cascade,
  track_id uuid references tracks(id) on delete cascade,
  descricao text not null,
  tipo text not null default 'riesgo',        -- riesgo | issue
  severidade text not null default 'media',    -- alta | media | baja
  dueno text,
  status text not null default 'abierto',      -- abierto | en_mitigacion | cerrado
  mitigacion text,
  created_at timestamptz not null default now(),
  check ((projeto_id is null) <> (track_id is null))
);
create index if not exists riscos_projeto_idx on riscos(projeto_id);
create index if not exists riscos_track_idx on riscos(track_id);
do $$ begin
  alter table riscos drop constraint if exists riscos_projeto_id_check1;
exception when others then null; end $$;
-- nota: se a tabela já existia com o check antigo, ajustar manualmente é opcional (a UI só cria riscos por track).

-- 3. tareas: cierre + origen
alter table tareas add column if not exists data_fechamento date;
alter table tareas add column if not exists origen text not null default 'manual';

-- 4. tracks: rag override (avance já existe = override do %)
alter table tracks add column if not exists rag_override text;  -- verde | amarelo | rojo | null

-- 5. projetos: csm + rag override  (csm é coluna nova; gerente permanece)
alter table projetos add column if not exists csm text;
alter table projetos add column if not exists rag_override text;

-- 6. documentos: garantir colunas usadas pela app
create table if not exists documentos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table documentos add column if not exists track_id uuid references tracks(id) on delete cascade;
alter table documentos add column if not exists nome text;
alter table documentos add column if not exists path text;
alter table documentos add column if not exists subido_por text;
create index if not exists documentos_track_idx on documentos(track_id);

-- 6b. reunioes: garantir colunas usadas pelo formulário de registro manual
alter table reunioes add column if not exists participantes text;
alter table reunioes add column if not exists ata text;

-- 7. RLS aberto ao anon (coerente com o resto; Auth fica para depois)
alter table marcos enable row level security;
alter table riscos enable row level security;
alter table documentos enable row level security;
do $$ begin
  create policy anon_all_marcos on marcos for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy anon_all_riscos on riscos for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy anon_all_documentos on documentos for all using (true) with check (true);
exception when duplicate_object then null; end $$;

-- 8. Storage: bucket privado track-docs + policies anon (coerente com RLS aberto)
insert into storage.buckets (id, name, public)
values ('track-docs', 'track-docs', false)
on conflict (id) do nothing;
do $$ begin
  create policy anon_read_track_docs on storage.objects for select using (bucket_id = 'track-docs');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy anon_insert_track_docs on storage.objects for insert with check (bucket_id = 'track-docs');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy anon_delete_track_docs on storage.objects for delete using (bucket_id = 'track-docs');
exception when duplicate_object then null; end $$;
