// Injeta uma barra de topo Visa idêntica ao app (3 zonas: marca | nav | estado).
// Vai em todo HTML para persistir na navegação SPA do Quartz.
// A wiki sai em duas línguas: public/ (português) e public/es/ (espanhol), com os mesmos caminhos.
// A barra traz o seletor PT | ES, que leva à mesma nota na outra língua.
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, relative, sep } from 'path';

const APP_URL = 'https://visa-portal-hub-3-platforms.vercel.app/';

const ICON_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
const ICON_GRID = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>';

const T = {
  pt: { home: '/', label: 'Início', sub: 'Base de Conhecimento Ativa', follow: 'Acompanhamento', live: 'Dados ao vivo' },
  es: { home: '/es/', label: 'Inicio', sub: 'Base de Conocimiento Activa', follow: 'Seguimiento', live: 'Datos en vivo' },
};

// Caminho público (cleanUrls) de um arquivo HTML relativo à raiz de uma língua.
function urlOf(rel) {
  let u = rel.replace(/\\/g, '/').replace(/\.html$/, '');
  if (u === 'index') u = '';
  else if (u.endsWith('/index')) u = u.slice(0, -'index'.length);
  return encodeURI(u);
}

function bar(lang, rel) {
  const t = T[lang];
  const u = urlOf(rel);
  // O seletor aponta para a mesma nota na outra língua; se ela não existir, vai para a home.
  const hasPt = existsSync(join('public', rel));
  const hasEs = existsSync(join('public', 'es', rel));
  const pt = hasPt ? '/' + u : '/';
  const es = hasEs ? '/es/' + u : '/es/';
  const pill = (l, href) =>
    `<a href="${href}" data-router-ignore class="vt-pill vt-lang${l === lang ? ' vt-active' : ''}" hreflang="${l}" lang="${l}">${l.toUpperCase()}</a>`;
  return (
    '<header id="visa-topbar">' +
    `<a href="${t.home}" class="vt-brand" aria-label="${t.label}">` +
    '<span class="vt-mark">VISA</span>' +
    '<span class="vt-div"></span>' +
    `<span class="vt-sub"><strong>${t.sub}</strong><em>Visa Implementation Services</em></span>` +
    '</a>' +
    '<nav class="vt-nav">' +
    `<a href="${t.home}" class="vt-pill vt-active">${ICON_BOOK} Wiki</a>` +
    `<a href="${APP_URL}" target="_blank" rel="noreferrer" class="vt-pill">${ICON_GRID} ${t.follow} <span aria-hidden="true">&#8599;</span></a>` +
    '</nav>' +
    '<div class="vt-right">' +
    `<div class="vt-langs" role="group" aria-label="Idioma">${pill('pt', pt)}${pill('es', es)}</div>` +
    `<div class="vt-live"><span class="vt-dot"></span> ${t.live}</div>` +
    '</div>' +
    '</header>'
  );
}

let count = 0;
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) { walk(p); continue; }
    if (!p.endsWith('.html') || p.endsWith('404.html')) continue;
    let html = readFileSync(p, 'utf8');
    if (html.includes('id="visa-topbar"')) continue;
    const at = html.indexOf('<body');
    if (at === -1) continue;
    const close = html.indexOf('>', at);
    const relAll = relative('public', p);
    const isEs = relAll === 'es' || relAll.startsWith('es' + sep);
    const rel = isEs ? relative(join('public', 'es'), p) : relAll;
    html = html.slice(0, close + 1) + bar(isEs ? 'es' : 'pt', rel) + html.slice(close + 1);
    writeFileSync(p, html);
    count++;
  }
}
walk('public');
console.log(`Visa topbar injected into ${count} pages.`);
