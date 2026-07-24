// Serviço de Integração com a API v3 do OpenProject (http://localhost:8082/api/v3)

export async function fetchOpenProjectData(apiKey, baseUrl = 'http://localhost:8082') {
  if (!apiKey) return null;

  try {
    const authHeader = 'Basic ' + btoa('apikey:' + apiKey.trim());

    // 1. Buscar todos os projetos (Macro e Subprojetos)
    const res = await fetch(`${baseUrl}/api/v3/projects`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/hal+json'
      }
    });

    if (!res.ok) {
      throw new Error(`Erro na API do OpenProject: ${res.status}`);
    }

    const data = await res.json();
    const rawProjects = data._embedded?.elements || [];

    // 2. Separar Projetos Macro (Sem pai) e Subprojetos (Com pai)
    const macroProjects = [];

    // Mapear cada projeto
    rawProjects.forEach(proj => {
      const parentLink = proj._links?.parent?.href;
      const isSubproject = !!parentLink;

      if (!isSubproject) {
        macroProjects.push({
          id: `op-live-${proj.id}`,
          openproject_id: proj.id,
          titulo: proj.name,
          cliente: proj.name.split('—')[1]?.trim() || proj.name,
          pais: 'Brasil',
          bandeira: '🌐',
          status: proj.status || 'Em Progresso',
          gerente: 'OpenProject User',
          progresso: 50,
          data_inicio: proj.createdAt ? proj.createdAt.split('T')[0] : '2026-07-24',
          data_fim: '2026-12-31',
          descricao: proj.description?.raw || 'Projeto sincronizado em tempo real do OpenProject Server.',
          subprojetos: []
        });
      }
    });

    // Associar os subprojetos aos seus respectivos projetos pai
    rawProjects.forEach(proj => {
      const parentLink = proj._links?.parent?.href;
      if (parentLink) {
        const parentId = parentLink.split('/').pop();
        const parentMacro = macroProjects.find(m => m.openproject_id.toString() === parentId);

        if (parentMacro) {
          parentMacro.subprojetos.push({
            id: `op-sub-${proj.id}`,
            titulo: proj.name,
            status: 'Em Desenvolvimento',
            progresso: 40,
            responsavel: 'Equipe OpenProject',
            entregavel: 'Entregável Sincronizado'
          });
        }
      }
    });

    return macroProjects;

  } catch (err) {
    console.error("Falha ao comunicar com OpenProject API:", err);
    return null;
  }
}

// Criar um novo projeto no OpenProject via API v3
export async function createOpenProjectViaAPI(apiKey, projectData, parentId = null, baseUrl = 'http://localhost:8082') {
  if (!apiKey) return null;

  try {
    const authHeader = 'Basic ' + btoa('apikey:' + apiKey.trim());
    const payload = {
      name: projectData.titulo,
      identifier: projectData.titulo.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50),
      description: {
        format: 'markdown',
        raw: projectData.descricao || ''
      }
    };

    if (parentId) {
      payload._links = {
        parent: {
          href: `/api/v3/projects/${parentId}`
        }
      };
    }

    const res = await fetch(`${baseUrl}/api/v3/projects`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/hal+json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Erro ao criar no OpenProject:", errBody);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Erro na API do OpenProject:", err);
    return null;
  }
}
