#!/usr/bin/env python3
"""Regenera `Conocimiento/Índices/Índice — fuentes.md` nos dois vaults (pt e es) a partir do frontmatter.
Uso: python3 wiki/indice-fuentes.py   (a partir da raiz do repositório)"""
import glob, os, re

CAT = {'Conceptos': 'Concepto', 'Estudo': 'Estudo', 'Glosario': 'Glosario',
       'Troubleshooting': 'Troubleshooting', 'Técnico': 'Técnico'}
ORDER = ['Concepto', 'Estudo', 'Glosario', 'Proyecto', 'Troubleshooting', 'Técnico']
TXT = {
    'vault-visa': dict(
        h1='Índice de fontes', intro='De onde vem cada nota e o seu estado de verificação. É regenerado com o vault.',
        tot='**Total:** {t} notas · **verificadas:** {v} · **parciais (~):** {p}',
        leg='`~` = o termo e o seu papel vêm de ata ou transcrição de reunião, não da especificação; falta confirmar contra a documentação.',
        cols='| Nota | Fonte | Estado |',
        names={'Concepto': 'Conceito', 'Estudo': 'Estudo', 'Glosario': 'Glossário', 'Proyecto': 'Projeto',
               'Troubleshooting': 'Troubleshooting', 'Técnico': 'Técnico'}),
    'vault-visa-es': dict(
        h1='Índice de fuentes', intro='De dónde viene cada nota y su estado de verificación. Se regenera con el vault.',
        tot='**Total:** {t} notas · **verificadas:** {v} · **parciales (~):** {p}',
        leg='`~` = el término y su papel vienen de acta o transcripción de reunión, no de la especificación; falta confirmar contra documentación.',
        cols='| Nota | Fuente | Estado |',
        names={'Concepto': 'Concepto', 'Estudo': 'Estudio', 'Glosario': 'Glosario', 'Proyecto': 'Proyecto',
               'Troubleshooting': 'Troubleshooting', 'Técnico': 'Técnico'}),
}

for vault, tx in TXT.items():
    notes = {}
    for f in glob.glob(vault + '/**/*.md', recursive=True):
        parts = f.split('/')
        if 'Proyectos' in parts:
            c = 'Proyecto'
        elif 'Conocimiento' in parts and parts[2] in CAT:
            c = CAT[parts[2]]
        else:
            continue
        t = open(f, encoding='utf-8').read()
        m = re.match(r'^---\n(.*?)\n---', t, re.S)
        fm = m.group(1) if m else ''
        fu = re.search(r'^fuente:\s*(.*)$', fm, re.M)
        es = re.search(r'^estado:\s*(.*)$', fm, re.M)
        notes.setdefault(c, []).append((os.path.basename(f)[:-3], fu.group(1).strip().strip('"') if fu else '—',
                                        '✓' if es and es.group(1).strip() == 'verificado' else '~'))
    tot = sum(len(v) for v in notes.values())
    par = sum(1 for v in notes.values() for x in v if x[2] == '~')
    o = ['---', 'tags: ["indice"]', '---', '', '# ' + tx['h1'], '', tx['intro'], '',
         tx['tot'].format(t=tot, v=tot - par, p=par), '', tx['leg'], '']
    for c in ORDER:
        v = sorted(notes.get(c, []), key=lambda x: x[0].lower())
        o += [f"## {tx['names'][c]} ({len(v)})", '', tx['cols'], '|---|---|---|'] + [f'| [[{n}]] | {fu} | {es} |' for n, fu, es in v] + ['']
    open(vault + '/Conocimiento/Índices/Índice — fuentes.md', 'w', encoding='utf-8').write('\n'.join(o))
    print(vault, tot, par)
