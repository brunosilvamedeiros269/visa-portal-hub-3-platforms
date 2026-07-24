// Vercel Serverless Function — proxy de LEITURA da base Notion (Tracks + Reuniões).
// O token fica só aqui no servidor (env NOTION_TOKEN); nunca é exposto ao navegador.
// Endpoints:
//   GET /api/notion?resource=health           -> diagnóstico (token presente?)
//   GET /api/notion?resource=tracks           -> lista de tracks (normalizada)
//   GET /api/notion?resource=meetings         -> lista de reuniões
//   GET /api/notion?resource=track&id=<pageId>-> track única: props + corpo (blocks)

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// IDs dos databases criados no teamspace VISA (não são segredos).
const DB = {
  clients: '06e934e012aa46478e5b9927190853c9',
  projects: '7f84b92b376f484f892b10c042432fc7',
  tracks: '9ca96ffb73bd436088ac370dd86fb5bc',
  meetings: '42e56f815dbb4d259e7c264a393e8ef6',
  activities: '3411b38c635746c991b8c9f32f739aaf',
  documents: '23f321f1f9aa47e3a1988e9dd52e3cc8',
};

function txt(rich) {
  return Array.isArray(rich) ? rich.map((r) => r.plain_text).join('') : '';
}

function normalizeProps(props) {
  const out = {};
  for (const [key, val] of Object.entries(props || {})) {
    switch (val.type) {
      case 'title': out[key] = txt(val.title); break;
      case 'rich_text': out[key] = txt(val.rich_text); break;
      case 'select': out[key] = val.select ? val.select.name : null; break;
      case 'status': out[key] = val.status ? val.status.name : null; break;
      case 'multi_select': out[key] = (val.multi_select || []).map((o) => o.name); break;
      case 'date': out[key] = val.date ? val.date.start : null; break;
      case 'checkbox': out[key] = val.checkbox; break;
      case 'number': out[key] = val.number; break;
      case 'relation': out[key] = (val.relation || []).map((r) => r.id); break;
      case 'people': out[key] = (val.people || []).map((p) => p.name || p.id); break;
      default: out[key] = null;
    }
  }
  return out;
}

async function notionFetch(path, options = {}) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    const e = new Error('NOTION_TOKEN não está configurado nas variáveis de ambiente do Vercel.');
    e.status = 500;
    throw e;
  }
  const res = await fetch(NOTION_API + path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(data.message || `Erro ${res.status} na API do Notion`);
    e.status = res.status;
    e.notion = data;
    throw e;
  }
  return data;
}

async function queryDatabase(dbId) {
  const results = [];
  let cursor;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const data = await notionFetch(`/databases/${dbId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return results.map((p) => ({ id: p.id, url: p.url, props: normalizeProps(p.properties) }));
}

async function getBlocks(pageId) {
  const out = [];
  let cursor;
  do {
    const qs = cursor ? `?start_cursor=${cursor}&page_size=100` : '?page_size=100';
    const data = await notionFetch(`/blocks/${pageId}/children${qs}`);
    for (const b of data.results) {
      const t = b.type;
      const rich = b[t] && b[t].rich_text ? txt(b[t].rich_text) : '';
      if (t === 'heading_1' || t === 'heading_2' || t === 'heading_3') out.push({ type: 'heading', text: rich });
      else if (t === 'paragraph') out.push({ type: 'paragraph', text: rich });
      else if (t === 'bulleted_list_item' || t === 'numbered_list_item') out.push({ type: 'bullet', text: rich });
      else if (t === 'to_do') out.push({ type: 'todo', text: rich, checked: b.to_do.checked });
      else if (t === 'quote') out.push({ type: 'quote', text: rich });
      else if (t === 'callout') out.push({ type: 'callout', text: rich });
      else if (t === 'divider') out.push({ type: 'divider' });
    }
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return out;
}

// ---- helpers de escrita (Notion property builders) ----
const pTitle = (v) => ({ title: [{ text: { content: String(v || '') } }] });
const pText = (v) => (v ? { rich_text: [{ text: { content: String(v) } }] } : { rich_text: [] });
const pSelect = (v) => (v ? { select: { name: String(v) } } : { select: null });
const pDate = (v) => (v ? { date: { start: v } } : { date: null });
const pRel = (ids) => ({ relation: (Array.isArray(ids) ? ids : [ids]).filter(Boolean).map((id) => ({ id })) });
const pCheck = (v) => ({ checkbox: !!v });

async function createPage(databaseId, properties, icon) {
  const body = { parent: { database_id: databaseId }, properties };
  if (icon) body.icon = { type: 'emoji', emoji: icon };
  return notionFetch('/pages', { method: 'POST', body: JSON.stringify(body) });
}
async function updatePage(pageId, properties) {
  return notionFetch(`/pages/${pageId}`, { method: 'PATCH', body: JSON.stringify({ properties }) });
}

async function handleWrite(body) {
  const b = body || {};
  switch (b.action) {
    case 'createActivity': {
      const props = {
        'Atividade': pTitle(b.name),
        'Track': pRel(b.trackId),
        'Status': pSelect(b.status || 'Aberto'),
        'Responsável': pText(b.responsavel),
        'Comentário': pText(b.comentario),
      };
      if (b.dataAbertura) props['Data de abertura'] = pDate(b.dataAbertura);
      if (b.prazo) props['Precisa fechar até'] = pDate(b.prazo);
      const page = await createPage(DB.activities, props);
      return { ok: true, id: page.id };
    }
    case 'updateActivityStatus': {
      await updatePage(b.pageId, { 'Status': pSelect(b.status) });
      return { ok: true };
    }
    case 'createTrack': {
      const props = {
        'Track': pTitle(b.name),
        'Cliente': pSelect(b.cliente),
        'Frente': pSelect(b.frente),
        'Status': pSelect(b.status || 'Sin iniciar'),
        'Ruta crítica': pCheck(b.rutaCritica),
        'Responsável': pText(b.responsavel),
        'Próximo passo': pText(b.proximoPasso),
        'Projeto': pRel(b.projetoId),
      };
      const page = await createPage(DB.tracks, props);
      return { ok: true, id: page.id };
    }
    default: {
      const e = new Error('action inválida (createActivity | updateActivityStatus | createTrack)');
      e.status = 400;
      throw e;
    }
  }
}

module.exports = async (req, res) => {
  const { resource, id } = req.query || {};
  try {
    if (req.method === 'POST') {
      return res.status(200).json(await handleWrite(req.body));
    }
    if (resource === 'health') {
      return res.status(200).json({ ok: true, hasToken: !!process.env.NOTION_TOKEN });
    }
    if (resource === 'tracks') {
      return res.status(200).json({ tracks: await queryDatabase(DB.tracks) });
    }
    if (resource === 'meetings') {
      return res.status(200).json({ meetings: await queryDatabase(DB.meetings) });
    }
    if (resource === 'projects') {
      return res.status(200).json({ projects: await queryDatabase(DB.projects) });
    }
    if (resource === 'clients') {
      return res.status(200).json({ clients: await queryDatabase(DB.clients) });
    }
    if (resource === 'activities') {
      return res.status(200).json({ activities: await queryDatabase(DB.activities) });
    }
    if (resource === 'documents') {
      return res.status(200).json({ documents: await queryDatabase(DB.documents) });
    }
    if (resource === 'track' && id) {
      const page = await notionFetch(`/pages/${id}`);
      const blocks = await getBlocks(id);
      return res.status(200).json({ id: page.id, url: page.url, props: normalizeProps(page.properties), blocks });
    }
    return res.status(400).json({ error: 'Parâmetro "resource" inválido. Use: health | tracks | meetings | track&id=...' });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message, notion: e.notion || null });
  }
};
