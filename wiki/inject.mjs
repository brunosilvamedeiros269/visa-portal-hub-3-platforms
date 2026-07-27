// Injeta uma barra de topo Visa (igual ao app) em todas as páginas do wiki.
// Vai em todo HTML para persistir na navegação SPA do Quartz.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const APP_URL = 'https://visa-portal-hub-3-platforms.vercel.app/';
const BAR =
  '<header id="visa-topbar">' +
  '<a href="/" class="vt-brand" aria-label="Inicio">' +
  '<span class="vt-mark">VISA</span>' +
  '<span class="vt-div"></span>' +
  '<span class="vt-sub"><strong>Base de Conocimiento</strong><em>Visa Implementation Services</em></span>' +
  '</a>' +
  `<a href="${APP_URL}" target="_blank" rel="noreferrer" class="vt-app">Seguimiento <span aria-hidden="true">&#8599;</span></a>` +
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
