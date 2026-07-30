import { describe, it, expect } from 'vitest';
import { buildPrompt, parseModelJson, MAX_CHARS, ENGINES } from './minutaLib.js';

describe('buildPrompt', () => {
  it('incluye el texto y pide JSON estricto con los 5 bloques', () => {
    const p = buildPrompt('Acta: se decidió X.', { track: 'Click to Pay', cliente: 'BROU' });
    expect(p).toContain('Acta: se decidió X.');
    expect(p).toContain('resumen');
    expect(p).toContain('action_items');
    expect(p).toContain('participantes');
    expect(p).toContain('Click to Pay');
  });
});

describe('parseModelJson', () => {
  it('parsea JSON limpio', () => {
    const r = parseModelJson('{"resumen":"ok","decisiones":["d1"],"action_items":[],"riesgos":[],"participantes":[]}');
    expect(r.resumen).toBe('ok');
    expect(r.decisiones).toEqual(['d1']);
  });
  it('extrae JSON dentro de cercas de código y texto alrededor', () => {
    const raw = 'Claro, aquí tienes:\n```json\n{"resumen":"x","decisiones":[],"action_items":[{"titulo":"t","responsable":"Ana","prazo":null}],"riesgos":[],"participantes":[]}\n```\n¡Listo!';
    const r = parseModelJson(raw);
    expect(r.action_items[0].titulo).toBe('t');
  });
  it('normaliza campos faltantes a vacío', () => {
    const r = parseModelJson('{"resumen":"solo resumen"}');
    expect(r.decisiones).toEqual([]);
    expect(r.action_items).toEqual([]);
    expect(r.riesgos).toEqual([]);
    expect(r.participantes).toEqual([]);
    expect(r.resumen).toBe('solo resumen');
  });
  it('lanza si no hay JSON', () => {
    expect(() => parseModelJson('no hay json aquí')).toThrow('JSON inválido del modelo');
  });
});

describe('constantes', () => {
  it('MAX_CHARS = 60000', () => expect(MAX_CHARS).toBe(60000));
  it('ENGINES tiene gemini/xai/claude con envKey', () => {
    expect(ENGINES.map((e) => e.id)).toEqual(['gemini', 'xai', 'claude']);
    expect(ENGINES[0].envKey).toBe('GEMINI_API_KEY');
  });
});

describe('buildPrompt multi-track', () => {
  const tracks = [
    { nombre: 'Tokenización Tarjeta Débito', frente: 'Tokenização TD', proximo_paso: 'Certificación de host.' },
    { nombre: 'Click to Pay', frente: 'Click to Pay', proximo_paso: 'Enrolamiento masivo.' },
  ];

  it('lista las tracks del proyecto con su contexto', () => {
    const p = buildPrompt('acta', { cliente: 'BROU', proyecto: 'Journey Digital', tracks });
    expect(p).toContain('Tokenización Tarjeta Débito');
    expect(p).toContain('Certificación de host.');
    expect(p).toContain('Click to Pay');
    expect(p).toContain('Journey Digital');
  });

  it('pide el campo track en action_items y riesgos', () => {
    const p = buildPrompt('acta', { tracks });
    expect(p).toContain('"track"');
    expect(p).toMatch(/action_items[\s\S]*"track"/);
    expect(p).toMatch(/riesgos[\s\S]*"track"/);
  });

  it('instruye usar "proyecto" cuando el item es transversal o dudoso', () => {
    const p = buildPrompt('acta', { tracks });
    expect(p).toContain('proyecto');
    expect(p.toLowerCase()).toContain('no adivines');
  });

  it('sin tracks no rompe y no pide routing', () => {
    const p = buildPrompt('acta', { cliente: 'BROU' });
    expect(p).toContain('acta');
    expect(p).not.toContain('TRACKS DEL PROYECTO');
    expect(p.toLowerCase()).not.toContain('no adivines');
    expect(p).not.toContain('"track"');
  });
});

describe('parseModelJson conserva track', () => {
  it('mantiene track en action_items y riesgos', () => {
    const raw = '{"resumen":"r","decisiones":[],"action_items":[{"titulo":"t","responsable":null,"prazo":null,"track":"Click to Pay"}],"riesgos":[{"descricao":"d","tipo":"issue","severidade":"alta","dueno":null,"track":"proyecto"}],"participantes":[]}';
    const r = parseModelJson(raw);
    expect(r.action_items[0].track).toBe('Click to Pay');
    expect(r.riesgos[0].track).toBe('proyecto');
  });

  it('item sin track no rompe: queda string vacía', () => {
    const raw = '{"resumen":"r","action_items":[{"titulo":"t"}],"riesgos":[{"descricao":"d"}]}';
    const r = parseModelJson(raw);
    expect(r.action_items[0].track).toBe('');
    expect(r.riesgos[0].track).toBe('');
  });

  it('track no-string se normaliza a string vacía', () => {
    const raw = '{"action_items":[{"titulo":"t","track":42}],"riesgos":[]}';
    const r = parseModelJson(raw);
    expect(r.action_items[0].track).toBe('');
  });
});
