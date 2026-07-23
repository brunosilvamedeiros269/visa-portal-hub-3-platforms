import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iuwvwhofxuvmwnpbsnth.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3Z3aG9meHV2bXducGJzbnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzA3OTMsImV4cCI6MjEwMDQwNjc5M30.0kvXT5Dgr68nyOJGRoSlKx25kUlu4XCK-zB9yXCX9Dk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 1. PROJECTS MACRO (OpenProject Sync)
// ==========================================
export async function fetchProjectsMacroSupabase() {
  try {
    const { data, error } = await supabase
      .from('projects_macro')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Erro ao buscar projetos no Supabase:", err);
    return null;
  }
}

export async function saveProjectMacroSupabase(proj) {
  try {
    const { error } = await supabase.from('projects_macro').insert([{
      id: proj.id,
      openproject_id: proj.openproject_id,
      titulo: proj.titulo,
      cliente: proj.cliente,
      pais: proj.pais,
      bandeira: proj.bandeira,
      status: proj.status,
      gerente: proj.gerente,
      progresso: proj.progresso,
      data_inicio: proj.data_inicio,
      data_fim: proj.data_fim,
      descricao: proj.descricao,
      estante_id: proj.estante_id || null
    }]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Erro ao salvar projeto no Supabase:", err);
    return false;
  }
}

// ==========================================
// 2. WIKI SHELVES (BookStack Metaphor)
// ==========================================
export async function fetchShelvesSupabase() {
  try {
    const { data, error } = await supabase
      .from('shelves')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Erro ao buscar estantes no Supabase:", err);
    return null;
  }
}

export async function saveShelfSupabase(shelf) {
  try {
    const { error } = await supabase.from('shelves').insert([{
      id: shelf.id,
      nome: shelf.nome,
      tipo: shelf.tipo,
      projeto_id: shelf.projeto_id || null,
      descricao: shelf.descricao,
      icone: shelf.icone || 'BookOpen',
      cor: shelf.cor || 'border-blue-500/30 bg-blue-500/5',
      livros: shelf.livros || []
    }]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Erro ao salvar estante no Supabase:", err);
    return false;
  }
}

// ==========================================
// 3. DATA TERMS (Dicionario & Metadata)
// ==========================================
export async function fetchDataTermsSupabase() {
  try {
    const { data, error } = await supabase
      .from('data_terms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Erro ao buscar termos de dados no Supabase:", err);
    return null;
  }
}

export async function saveDataTermSupabase(term) {
  try {
    const { error } = await supabase.from('data_terms').insert([{
      id: term.id,
      termo: term.termo,
      categoria: term.categoria,
      formato: term.formato,
      exemplo: term.exemplo,
      definicao: term.definicao
    }]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Erro ao salvar termo de dados no Supabase:", err);
    return false;
  }
}
