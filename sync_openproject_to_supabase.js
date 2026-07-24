// Sincronizador Automático Bidirecional (OpenProject -> Supabase Cloud)

const { createClient } = require('./app/node_modules/@supabase/supabase-js');

const OPENPROJECT_URL = "http://localhost:8082";
const SUPABASE_URL = "https://iuwvwhofxuvmwnpbsnth.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3Z3aG9meHV2bXducGJzbnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzA3OTMsImV4cCI6MjEwMDQwNjc5M30.0kvXT5Dgr68nyOJGRoSlKx25kUlu4XCK-zB9yXCX9Dk";

const DEFAULT_API_KEY = "c74bb8c5e5b7ae08a74393e9c0deea3d2721fcd96cf445490677ee945d7230f6";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncOpenProjectToSupabase() {
  let apiKey = DEFAULT_API_KEY;

  // Pegar argumentos a partir da posição 2 ignorando flags
  const userToken = process.argv.slice(2).find(arg => !arg.startsWith('--'));
  if (userToken) apiKey = userToken;

  const authHeader = 'Basic ' + Buffer.from('apikey:' + apiKey.trim()).toString('base64');

  console.log(`[${new Date().toLocaleTimeString()}] 🔄 Sincronizando OpenProject (:8082) com Supabase Cloud...`);

  try {
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

    console.log(`📊 Encontrados ${rawProjects.length} itens no OpenProject.`);

    // 1. Agrupar subprojetos por ID do pai
    const subProjectsMap = {};
    rawProjects.forEach(proj => {
      const parentHref = proj._links?.parent?.href;
      if (parentHref) {
        const parentId = parentHref.split('/').pop();
        if (!subProjectsMap[parentId]) subProjectsMap[parentId] = [];

        subProjectsMap[parentId].push({
          id: `op-sub-${proj.id}`,
          openproject_id: proj.id,
          titulo: proj.name,
          status: 'Em Homologação',
          progresso: 80,
          responsavel: 'Equipe OpenProject',
          entregavel: proj.description?.raw || 'Subprojeto Técnico'
        });
      }
    });

    // 2. Montar Projetos Macro (sem pai) com seus subprojetos inclusos
    const macroProjects = [];
    const validMacroIds = [];

    rawProjects.forEach(proj => {
      const parentHref = proj._links?.parent?.href;
      if (!parentHref) {
        validMacroIds.push(`op-live-${proj.id}`);

        const children = subProjectsMap[proj.id.toString()] || [];

        macroProjects.push({
          id: `op-live-${proj.id}`,
          openproject_id: proj.id,
          titulo: proj.name,
          cliente: proj.name.includes('Alfa') ? 'Banco Alfa' : proj.name.includes('Sul') ? 'Banco Sul' : proj.name.includes('Uruguai') ? 'Fintech Uruguai' : proj.name,
          pais: proj.name.includes('Alfa') ? 'Brasil' : proj.name.includes('Sul') ? 'Argentina' : 'Uruguai',
          bandeira: proj.name.includes('Alfa') ? '🇧🇷' : proj.name.includes('Sul') ? '🇦🇷' : '🇺🇾',
          status: 'Em Progresso',
          gerente: 'Bruno',
          progresso: children.length > 0 ? 60 : 20,
          data_inicio: proj.createdAt ? proj.createdAt.split('T')[0] : '2026-07-24',
          data_fim: '2026-12-31',
          descricao: proj.description?.raw || 'Projeto espelhado em tempo real do OpenProject Server.',
          estante_id: proj.name.includes('Alfa') ? 'shelf-alfa-01' : proj.name.includes('Sul') ? 'shelf-sul-02' : null,
          subprojetos: children
        });
      }
    });

    // 3. Salvar/Atualizar no Supabase
    for (const macro of macroProjects) {
      const { error } = await supabase.from('projects_macro').upsert([macro], { onConflict: 'id' });
      if (error) {
        console.error(`⚠️ Erro ao enviar '${macro.titulo}' para o Supabase:`, error.message);
      } else {
        console.log(`✅ Sincronizado: ${macro.titulo} (${macro.subprojetos.length} subprojetos filhos)`);
      }
    }

    // 4. LIMPAR do Supabase qualquer projeto que foi excluído no OpenProject (ex: Banco Alfa #4)
    const { data: currentDbProjects } = await supabase.from('projects_macro').select('id');
    if (currentDbProjects) {
      for (const dbProj of currentDbProjects) {
        if (!validMacroIds.includes(dbProj.id)) {
          console.log(`🗑️ Limpando projeto excluído do OpenProject: ${dbProj.id}`);
          await supabase.from('projects_macro').delete().eq('id', dbProj.id);
        }
      }
    }

    console.log(`✨ Sincronização concluída com sucesso! Portal alinhado em tempo real.\n`);

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
