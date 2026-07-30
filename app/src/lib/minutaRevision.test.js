import { describe, it, expect } from 'vitest';
import { buildParticipantes, buildActionItems, buildRiesgos, buildDecisiones, buildRevisionResult } from './minutaRevision';

// Filas crudas de la base: la columna es `nome` (portugués), no `nombre`.
const TRACKS = [
  { id: 't-tok', nome: 'Tokenización Tarjeta Débito' },
  { id: 't-ap', nome: 'Apple Pay' },
];

const CONTACTOS = [
  { id: 'c-1', nombre: 'Ana Pérez', email: 'ana@banco.com', organizacion: 'Banco Alfa' },
];

describe('buildParticipantes', () => {
  it('matchea contra el directorio ignorando mayúsculas/espacios y pre-rellena', () => {
    const out = buildParticipantes([{ nombre: '  ana pérez ' }], CONTACTOS);
    expect(out).toEqual([{ nombre: '  ana pérez ', email: 'ana@banco.com', organizacion: 'Banco Alfa', incluir: true, existe: true }]);
  });
  it('un nombre que no matchea es nuevo y no se le inventa email ni organización', () => {
    const out = buildParticipantes([{ nombre: 'Juan Nuevo' }], CONTACTOS);
    expect(out).toEqual([{ nombre: 'Juan Nuevo', email: '', organizacion: '', incluir: true, existe: false }]);
  });
  it('respeta el email/organización que ya viene de la IA en vez del directorio', () => {
    const out = buildParticipantes([{ nombre: 'Ana Pérez', email: 'otro@x.com', organizacion: 'Otra Org' }], CONTACTOS);
    expect(out[0]).toMatchObject({ email: 'otro@x.com', organizacion: 'Otra Org', existe: true });
  });
  it('lista vacía o ausente → []', () => {
    expect(buildParticipantes([], CONTACTOS)).toEqual([]);
    expect(buildParticipantes(undefined, CONTACTOS)).toEqual([]);
  });
  it('sin contactos → nadie existe', () => {
    expect(buildParticipantes([{ nombre: 'Ana Pérez' }], [])).toEqual([
      { nombre: 'Ana Pérez', email: '', organizacion: '', incluir: true, existe: false },
    ]);
  });
  it('salta elementos nulos/indefinidos dentro de la lista', () => {
    const out = buildParticipantes([{ nombre: 'Ana Pérez' }, null, { nombre: 'Juan Nuevo' }, undefined], CONTACTOS);
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ nombre: 'Ana Pérez', existe: true });
    expect(out[1]).toMatchObject({ nombre: 'Juan Nuevo', existe: false });
  });
});

describe('buildActionItems', () => {
  it('track propuesta que matchea una track real → id de esa track', () => {
    const out = buildActionItems([{ titulo: 'Certificar', track: 'Apple Pay' }], TRACKS);
    expect(out[0].destino).toBe('t-ap');
  });
  it('track propuesta desconocida o ausente cae al proyecto', () => {
    expect(buildActionItems([{ titulo: 'X', track: 'Garmin Pay' }], TRACKS)[0].destino).toBe('proyecto');
    expect(buildActionItems([{ titulo: 'X' }], TRACKS)[0].destino).toBe('proyecto');
  });
  it('recorta el prazo a YYYY-MM-DD', () => {
    expect(buildActionItems([{ titulo: 'X', prazo: '2026-08-15T00:00:00.000Z' }], TRACKS)[0].prazo).toBe('2026-08-15');
  });
  it('lista vacía o ausente → []', () => {
    expect(buildActionItems([], TRACKS)).toEqual([]);
    expect(buildActionItems(undefined, TRACKS)).toEqual([]);
  });
  it('salta elementos nulos/indefinidos dentro de la lista', () => {
    const out = buildActionItems([{ titulo: 'Certificar', track: 'Apple Pay' }, null, { titulo: 'Probar' }, undefined], TRACKS);
    expect(out).toHaveLength(2);
    expect(out[0].titulo).toBe('Certificar');
    expect(out[0].destino).toBe('t-ap');
    expect(out[1].titulo).toBe('Probar');
    expect(out[1].destino).toBe('proyecto');
  });
});

describe('buildRiesgos', () => {
  it('tipo y severidade dentro de lo permitido pasan igual', () => {
    const out = buildRiesgos([{ descricao: 'Falla en cert.', tipo: 'issue', severidade: 'alta' }], TRACKS);
    expect(out[0]).toMatchObject({ tipo: 'issue', severidade: 'alta' });
  });
  it('tipo y severidade fuera de lo permitido se clampan a los defaults', () => {
    const out = buildRiesgos([{ descricao: 'X', tipo: 'invalido', severidade: 'extrema' }], TRACKS);
    expect(out[0]).toMatchObject({ tipo: 'riesgo', severidade: 'media' });
  });
  it('resuelve destino igual que un action item', () => {
    const out = buildRiesgos([{ descricao: 'X', track: 'Apple Pay' }], TRACKS);
    expect(out[0].destino).toBe('t-ap');
  });
  it('lista vacía o ausente → []', () => {
    expect(buildRiesgos([], TRACKS)).toEqual([]);
    expect(buildRiesgos(undefined, TRACKS)).toEqual([]);
  });
  it('salta elementos nulos/indefinidos dentro de la lista', () => {
    const out = buildRiesgos([{ descricao: 'Falla en cert.', tipo: 'issue', severidade: 'alta' }, null, { descricao: 'Otro riesgo' }, undefined], TRACKS);
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ descricao: 'Falla en cert.', tipo: 'issue', severidade: 'alta' });
    expect(out[1]).toMatchObject({ descricao: 'Otro riesgo', tipo: 'riesgo', severidade: 'media' });
  });
});

describe('buildDecisiones', () => {
  it('acepta strings sueltos', () => {
    expect(buildDecisiones(['Se aprueba el roadmap'])).toEqual([{ texto: 'Se aprueba el roadmap', incluir: true }]);
  });
  it('acepta objetos { texto }', () => {
    expect(buildDecisiones([{ texto: 'Se aprueba' }])).toEqual([{ texto: 'Se aprueba', incluir: true }]);
  });
  it('lista vacía o ausente → []', () => {
    expect(buildDecisiones([])).toEqual([]);
    expect(buildDecisiones(undefined)).toEqual([]);
  });
  it('salta elementos nulos/indefinidos dentro de la lista', () => {
    const out = buildDecisiones(['Se aprueba X', null, { texto: 'Se rechaza Y' }, undefined]);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ texto: 'Se aprueba X', incluir: true });
    expect(out[1]).toEqual({ texto: 'Se rechaza Y', incluir: true });
  });
});

describe('buildRevisionResult', () => {
  it('arma el result completo a partir del resultado crudo de la IA', () => {
    const r = buildRevisionResult({
      resumen: 'Resumen de la reunión',
      decisiones: ['Se aprueba X'],
      action_items: [{ titulo: 'Certificar', track: 'Apple Pay' }],
      riesgos: [{ descricao: 'Riesgo Y', track: 'proyecto' }],
      participantes: [{ nombre: 'Ana Pérez' }],
    }, TRACKS, CONTACTOS);
    expect(r.resumen).toBe('Resumen de la reunión');
    expect(r.decisiones).toEqual([{ texto: 'Se aprueba X', incluir: true }]);
    expect(r.action_items[0].destino).toBe('t-ap');
    expect(r.riesgos[0].destino).toBe('proyecto');
    expect(r.participantes[0].existe).toBe(true);
  });
  it('resultado de la IA sin bloques (o vacío) no explota, produce listas vacías', () => {
    expect(buildRevisionResult({}, TRACKS, CONTACTOS)).toEqual({
      resumen: '', decisiones: [], action_items: [], riesgos: [], participantes: [],
    });
    expect(buildRevisionResult(undefined, TRACKS, CONTACTOS)).toEqual({
      resumen: '', decisiones: [], action_items: [], riesgos: [], participantes: [],
    });
  });
});
