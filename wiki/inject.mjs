// Injeta um link fixo "Seguimiento ↗" (volta ao app de projetos) em todas as páginas.
// É inserido em todo HTML para persistir na navegação SPA do Quartz.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const APP_URL = 'https://visa-portal-hub-3-platforms.vercel.app/';
const SNIPPET =
  `<a href="${APP_URL}" target="_blank" rel="noreferrer" id="seguimiento-link" aria-label="Ir a Seguimiento de proyectos"` +
  ` style="position:fixed;top:1.05rem;right:1.4rem;z-index:900;display:inline-flex;align-items:center;gap:.4rem;` +
  `background:#1A1F71;color:#fff;font:600 13px/1 Inter,system-ui,-apple-system,'Segoe UI',sans-serif;text-decoration:none;` +
  `padding:.55rem .95rem;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.32);">` +
  `Seguimiento <span style="opacity:.7">&#8599;</span></a>`;

let count = 0;
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) { walk(p); continue; }
    if (!p.endsWith('.html') || p.endsWith('404.html')) continue;
    let html = readFileSync(p, 'utf8');
    if (html.includes('id="seguimiento-link"') || !html.includes('</body>')) continue;
    writeFileSync(p, html.replace('</body>', SNIPPET + '</body>'));
    count++;
  }
}
walk('public');
console.log(`Seguimiento link injected into ${count} pages.`);
