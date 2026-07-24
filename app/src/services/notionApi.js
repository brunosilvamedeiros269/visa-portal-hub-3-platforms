// Cliente de leitura da base Notion via função serverless /api/notion.
// Em produção (Vercel) funciona direto. Em dev local, use `vercel dev` para
// ter a função disponível — com `vite` puro, /api não existe e o fetch falha.

async function call(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/notion?${qs}`);
  let data = null;
  try { data = await res.json(); } catch (e) { /* resposta não-JSON */ }
  if (!res.ok) {
    const msg = (data && data.error) || `Erro ${res.status} ao chamar /api/notion`;
    const err = new Error(msg);
    err.notion = data && data.notion;
    throw err;
  }
  return data;
}

export const fetchTracks = () => call({ resource: 'tracks' }).then((d) => d.tracks || []);
export const fetchMeetings = () => call({ resource: 'meetings' }).then((d) => d.meetings || []);
export const fetchProjects = () => call({ resource: 'projects' }).then((d) => d.projects || []);
export const fetchActivities = () => call({ resource: 'activities' }).then((d) => d.activities || []);
export const fetchDocuments = () => call({ resource: 'documents' }).then((d) => d.documents || []);
export const fetchTrack = (id) => call({ resource: 'track', id });
export const checkHealth = () => call({ resource: 'health' });

async function post(body) {
  const res = await fetch('/api/notion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* não-JSON */ }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Erro ${res.status} al escribir en Notion`);
    err.notion = data && data.notion;
    throw err;
  }
  return data;
}

export const createActivity = (payload) => post({ action: 'createActivity', ...payload });
export const updateActivityStatus = (pageId, status) => post({ action: 'updateActivityStatus', pageId, status });
export const createTrack = (payload) => post({ action: 'createTrack', ...payload });
