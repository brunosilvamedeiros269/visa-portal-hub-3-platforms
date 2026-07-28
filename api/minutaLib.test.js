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
