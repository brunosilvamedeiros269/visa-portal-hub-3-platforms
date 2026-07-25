import { supabase } from '../lib/supabase';

async function run(q) {
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
}

const TABLES = [
  'clientes', 'projetos', 'tracks', 'tareas', 'personas', 'persona_tracks',
  'prerequisitos', 'reunioes', 'reunion_tracks', 'track_dependencias',
];

// Lê tudo de uma vez e monta os mapas de relação no cliente.
export async function fetchAll() {
  const res = await Promise.all(TABLES.map((t) => supabase.from(t).select('*')));
  const out = {};
  TABLES.forEach((t, i) => {
    if (res[i].error) throw new Error(`${t}: ${res[i].error.message}`);
    out[t] = res[i].data || [];
  });
  return out;
}

// ---- mutações ----
export const createCliente = (row) => run(supabase.from('clientes').insert(row).select().single());
export const createProjeto = (row) => run(supabase.from('projetos').insert(row).select().single());
export const createTrack = (row) => run(supabase.from('tracks').insert(row).select().single());
export const updateTrack = (id, fields) => run(supabase.from('tracks').update(fields).eq('id', id).select().single());
export const createTarea = (row) => run(supabase.from('tareas').insert(row).select().single());
export const updateTarea = (id, fields) => run(supabase.from('tareas').update(fields).eq('id', id).select().single());
export const deleteTarea = (id) => run(supabase.from('tareas').delete().eq('id', id));
export const createPrereq = (row) => run(supabase.from('prerequisitos').insert(row).select().single());
export const updatePrereq = (id, fields) => run(supabase.from('prerequisitos').update(fields).eq('id', id).select().single());
export const createPersona = (row) => run(supabase.from('personas').insert(row).select().single());
export const createReuniao = (row) => run(supabase.from('reunioes').insert(row).select().single());
