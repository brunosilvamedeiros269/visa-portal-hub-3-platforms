// Injeta uma barra de topo Visa idêntica ao app (3 zonas: marca | nav | estado).
// Vai em todo HTML para persistir na navegação SPA do Quartz.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const APP_URL = 'https://visa-portal-hub-3-platforms.vercel.app/';

const ICON_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
const ICON_GRID = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>';

const BAR =
  '<header id="visa-topbar">' +
  '<a href="/" class="vt-brand" aria-label="Inicio">' +
  '<span class="vt-mark">VISA</span>' +
  '<span class="vt-div"></span>' +
  '<span class="vt-sub"><strong>Base de Conocimiento Activa</strong><em>Visa Implementation Services</em></span>' +
  '</a>' +
  '<nav class="vt-nav">' +
  `<a href="/" class="vt-pill vt-active">${ICON_BOOK} Wiki</a>` +
  `<a href="${APP_URL}" target="_blank" rel="noreferrer" class="vt-pill">${ICON_GRID} Seguimiento <span aria-hidden="true">&#8599;</span></a>` +
  '</nav>' +
  '<div class="vt-live"><span class="vt-dot"></span> Datos en vivo</div>' +
  '</header>';

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
    html = html.slice(0, close + 1) + BAR + html.slice(close + 1);
    writeFileSync(p, html);
    count++;
  }
}
walk('public');
console.log(`Visa topbar injected into ${count} pages.`);
