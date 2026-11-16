// Build da wiki em duas línguas: vault-visa (português) em public/ e vault-visa-es (espanhol) em public/es/.
// O Quartz lê quartz.config.yaml antes do default, então geramos um por língua e apagamos no fim.
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, copyFileSync, rmSync } from 'fs';

const base = readFileSync('quartz.config.default.yaml', 'utf8');
const LANGS = [
  { dir: '../vault-visa', out: 'public', locale: 'pt-BR', title: 'Base de Conhecimento — Visa' },
  { dir: '../vault-visa-es', out: 'public/es', locale: 'es-ES', title: 'Base de Conocimiento — Visa' },
];

try {
  for (const l of LANGS) {
    const cfg = base
      .replace(/^(\s*pageTitle:).*$/m, `$1 ${l.title}`)
      .replace(/^(\s*locale:).*$/m, `$1 ${l.locale}`);
    writeFileSync('quartz.config.yaml', cfg);
    execSync(`node quartz/bootstrap-cli.mjs build -d ${l.dir} -o ${l.out}`, { stdio: 'inherit' });
  }
} finally {
  rmSync('quartz.config.yaml', { force: true });
}
copyFileSync('static-404.html', 'public/404.html');
execSync('node inject.mjs', { stdio: 'inherit' });
