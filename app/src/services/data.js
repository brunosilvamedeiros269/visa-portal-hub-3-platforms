import { supabase } from '../lib/supabase';

async function run(q) {
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
}

const TABLES = [
  'clientes', 'projetos', 'tracks', 'tareas', 'personas', 'persona_tracks',
  'prerequisitos', 'reunioes', 'reunion_tracks', 'track_dependencias',
  'marcos', 'riscos', 'documentos', 'contactos',
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

// ---- projetos ----
export const updateProjeto = (id, fields) => run(supabase.from('projetos').update(fields).eq('id', id).select().single());

// ---- tareas: fechar seta data_fechamento ----
export const updateTareaStatus = (id, status) => {
  const fields = { status };
  fields.data_fechamento = status === 'fechado' ? new Date().toISOString().slice(0, 10) : null;
  return run(supabase.from('tareas').update(fields).eq('id', id).select().single());
};

// ---- marcos ----
export const createMarco = (row) => run(supabase.from('marcos').insert(row).select().single());
export const updateMarco = (id, fields) => run(supabase.from('marcos').update(fields).eq('id', id).select().single());
export const deleteMarco = (id) => run(supabase.from('marcos').delete().eq('id', id));

// ---- riscos (RAID) ----
export const createRisco = (row) => run(supabase.from('riscos').insert(row).select().single());
export const updateRisco = (id, fields) => run(supabase.from('riscos').update(fields).eq('id', id).select().single());
export const deleteRisco = (id) => run(supabase.from('riscos').delete().eq('id', id));

// ---- documentos (Supabase Storage: bucket 'track-docs') ----
const BUCKET = 'track-docs';
export async function uploadDocumento(trackId, file, subidoPor) {
  const path = `${trackId}/${Date.now()}-${file.name}`;
  const up = await supabase.storage.from(BUCKET).upload(path, file);
  if (up.error) throw new Error(up.error.message);
  return run(supabase.from('documentos').insert({ track_id: trackId, nome: file.name, path, subido_por: subidoPor || null }).select().single());
}
export async function documentoUrl(path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}
export const deleteDocumento = async (doc) => {
  await supabase.storage.from(BUCKET).remove([doc.path]);
  return run(supabase.from('documentos').delete().eq('id', doc.id));
};

// ---- reuniones (registro manual, ligada ao track) ----
export async function createReuniaoParaTrack(trackId, row) {
  const reu = await run(supabase.from('reunioes').insert(row).select().single());
  await run(supabase.from('reunion_tracks').insert({ reuniao_id: reu.id, track_id: trackId }));
  return reu;
}

// Uma reunión pode cobrir várias tracks: `reunion_tracks` é N:N. Sem transação
// (REST anon); se a ligação falhar, a reunión já existe e o erro sobe para a UI.
export async function createReunionMultiTrack(row, trackIds = []) {
  const reu = await run(supabase.from('reunioes').insert(row).select().single());
  const ids = [...new Set(trackIds.filter(Boolean))];
  if (ids.length) {
    await run(supabase.from('reunion_tracks').insert(ids.map((track_id) => ({ reuniao_id: reu.id, track_id }))));
  }
  return reu;
}

// ---- contactos (directorio global) ----
export const fetchContactos = () => run(supabase.from('contactos').select('*').order('nombre'));
export const insertContacto = (row) => run(supabase.from('contactos').insert(row).select().single());
export const updateContacto = (id, fields) => run(supabase.from('contactos').update(fields).eq('id', id).select().single());
