// Sincronizador Automático Bidirecional (OpenProject -> Supabase Cloud)
// Este script lê os projetos do OpenProject local e atualiza o Supabase em tempo real.

const { createClient } = require('./app/node_modules/@supabase/supabase-js');

const OPENPROJECT_URL = "http://localhost:8082";
const SUPABASE_URL = "https://iuwvwhofxuvmwnpbsnth.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3Z3aG9meHV2bXducGJzbnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzA3OTMsImV4cCI6MjEwMDQwNjc5M30.0kvXT5Dgr68nyOJGRoSlKx25kUlu4XCK-zB9yXCX9Dk";

const DEFAULT_API_KEY = "c74bb8c5e5b7ae08a74393e9c0deea3d2721fcd96cf445490677ee945d7230f6";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncOpenProjectToSupabase() {
  let apiKey = DEFAULT_API_KEY;

  // Pegar o argumento que não seja flag
  const argToken = process.argv.find(arg => !arg.startsWith('--') && !arg.endsWith('.js') && !arg.endsWith('node'));
  if (argToken) apiKey = argToken;

  const authHeader = 'Basic ' + Buffer.from('apikey:' + apiKey.trim()).toString('base64');

  console.log(`[${new Date().toLocaleTimeString()}] 🔄 Sincronizando OpenProject (:8082) com Supabase Cloud...`);

  try {
    // 1. Buscar todos os projetos no OpenProject
    const res = await fetch(`${OPENPROJECT_URL}/api/v3/projects`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/hal+json'
      }
    });

    if (!res.ok) {
      console.error("⚠️ Erro ao consultar OpenProject API:", res.status);
      return;
    }

    const data = await res.json();
    const rawProjects = data._embedded?.elements || [];

    console.log(`📊 Encontrados ${rawProjects.length} projetos no OpenProject.`);

    // 2. Filtrar apenas projetos Macro (sem pai)
    const macroProjects = [];
    const subProjectsMap = {};

    rawProjects.forEach(proj => {
      const parentLink = proj._links?.parent?.href;
      if (!parentLink) {
        // Projeto Macro
        macroProjects.push({
          id: `op-live-${proj.id}`,
          openproject_id: proj.id,
          titulo: proj.name,
          cliente: proj.name.split('—')[1]?.trim() || proj.name.split('-')[0]?.trim() || proj.name,
          pais: proj.name.includes('Alfa') ? 'Brasil' : proj.name.includes('Sul') ? 'Argentina' : 'Uruguai',
          bandeira: proj.name.includes('Alfa') ? '🇧🇷' : proj.name.includes('Sul') ? '🇦🇷' : '🇺🇾',
          status: 'Em Progresso',
          gerente: 'Bruno',
          progresso: 60,
          data_inicio: proj.createdAt ? proj.createdAt.split('T')[0] : '2026-07-24',
          data_fim: '2026-12-31',
          descricao: proj.description?.raw || 'Projeto sincronizado do OpenProject Server.',
          estante_id: proj.name.includes('Alfa') ? 'shelf-alfa-01' : proj.name.includes('Sul') ? 'shelf-sul-02' : null
        });
      } else {
        // Subprojeto (Filho)
        const parentId = parentLink.split('/').pop();
        if (!subProjectsMap[parentId]) subProjectsMap[parentId] = [];
        subProjectsMap[parentId].push({
          id: `op-sub-${proj.id}`,
          titulo: proj.name,
          status: 'Em Desenvolvimento',
          progresso: 50,
          responsavel: 'Equipe OpenProject',
          entregavel: 'Entregável Sincronizado'
        });
      }
    });

    // 3. Atualizar tabela projects_macro no Supabase
    for (const macro of macroProjects) {
      const { error } = await supabase.from('projects_macro').upsert([macro], { onConflict: 'id' });
      if (error) {
        console.error(`⚠️ Erro ao enviar '${macro.titulo}' para o Supabase:`, error.message);
      } else {
        console.log(`✅ Sincronizado: ${macro.titulo} (ID OpenProject: #${macro.openproject_id})`);
      }
    }

    console.log(`✨ Sincronização concluída com sucesso! Portal atualizado.\n`);

  } catch (err) {
    console.error("❌ Erro no processo de sincronização:", err.message);
  }
}

// Executar uma vez no boot
syncOpenProjectToSupabase();

// Rodar em loop a cada 15 segundos se executado com --watch
if (process.argv.includes('--watch')) {
  setInterval(syncOpenProjectToSupabase, 15000);
}
