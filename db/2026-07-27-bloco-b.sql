-- Bloco B — 2026-07-27 — directorio global de contactos
create table if not exists contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  organizacion text,
  created_at timestamptz not null default now()
);
-- match por nombre case-insensitive (evita "Bruno" vs "bruno")
create unique index if not exists contactos_nombre_uidx on contactos (lower(nombre));
alter table contactos enable row level security;
do $$ begin
  create policy anon_all_contactos on contactos for all using (true) with check (true);
exception when duplicate_object then null; end $$;

-- reunioes ya tiene ata, resumo_ia, decisoes, participantes(array), riscos.
-- Nada que alterar allí.
