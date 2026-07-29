import { describe, it, expect } from 'vitest';
import { PROYECTO, normalizeName, matchTrack, destinoInicial, destinoFields, resumenRateo, tracksConItems } from './minutaRouting';

const TRACKS = [
  { id: 't-tok', nombre: 'Tokenización Tarjeta Débito' },
  { id: 't-ctp', nombre: 'Click to Pay' },
  { id: 't-ap', nombre: 'Apple Pay' },
];
const PROJ = 'p-1';

describe('normalizeName', () => {
  it('baja caja, saca acentos y colapsa espacios', () => {
    expect(normalizeName('  Tokenización   Tarjeta  Débito ')).toBe('tokenizacion tarjeta debito');
  });
  it('tolera no-strings', () => {
    expect(normalizeName(null)).toBe('');
    expect(normalizeName(undefined)).toBe('');
  });
});

describe('matchTrack', () => {
  it('casa exacto', () => expect(matchTrack('Click to Pay', TRACKS).id).toBe('t-ctp'));
  it('casa con variación de caja, acento y espacios', () => {
    expect(matchTrack('tokenizacion   TARJETA debito', TRACKS).id).toBe('t-tok');
  });
  it('no casa un nombre desconocido', () => expect(matchTrack('Garmin Pay', TRACKS)).toBe(null));
  it('no casa vacío ni null', () => {
    expect(matchTrack('', TRACKS)).toBe(null);
    expect(matchTrack(null, TRACKS)).toBe(null);
  });
});

describe('destinoInicial', () => {
  it('track reconocida → id de la track', () => {
    expect(destinoInicial({ track: 'Apple Pay' }, TRACKS)).toBe('t-ap');
  });
  it('"proyecto" → proyecto', () => {
    expect(destinoInicial({ track: 'proyecto' }, TRACKS)).toBe(PROYECTO);
    expect(destinoInicial({ track: 'Proyecto' }, TRACKS)).toBe(PROYECTO);
  });
  it('nombre desconocido → proyecto, nunca una track por aproximación', () => {
    expect(destinoInicial({ track: 'Garmin Pay' }, TRACKS)).toBe(PROYECTO);
    expect(destinoInicial({ track: 'Click' }, TRACKS)).toBe(PROYECTO);
  });
  it('sin track → proyecto', () => {
    expect(destinoInicial({}, TRACKS)).toBe(PROYECTO);
    expect(destinoInicial({ track: '' }, TRACKS)).toBe(PROYECTO);
  });
});

describe('destinoFields', () => {
  it('track → track_id, projeto_id null', () => {
    expect(destinoFields('t-ctp', PROJ)).toEqual({ track_id: 't-ctp', projeto_id: null });
  });
  it('proyecto → projeto_id, track_id null', () => {
    expect(destinoFields(PROYECTO, PROJ)).toEqual({ track_id: null, projeto_id: PROJ });
  });
});

describe('resumenRateo', () => {
  it('cuenta por destino y omite destinos sin items', () => {
    const items = [
      { destino: 't-ctp', incluir: true },
      { destino: 't-ctp', incluir: true },
      { destino: PROYECTO, incluir: true },
    ];
    expect(resumenRateo(items, TRACKS)).toEqual([
      { label: 'Click to Pay', n: 2 },
      { label: 'Proyecto', n: 1 },
    ]);
  });
  it('ignora items desmarcados', () => {
    const items = [{ destino: 't-ap', incluir: false }, { destino: 't-ap', incluir: true }];
    expect(resumenRateo(items, TRACKS)).toEqual([{ label: 'Apple Pay', n: 1 }]);
  });
  it('lista vacía → []', () => expect(resumenRateo([], TRACKS)).toEqual([]));
});

describe('tracksConItems', () => {
  it('junta varias listas sin repetir y sin el sentinela proyecto', () => {
    const a = [{ destino: 't-ctp', incluir: true }, { destino: PROYECTO, incluir: true }];
    const b = [{ destino: 't-ctp', incluir: true }, { destino: 't-ap', incluir: true }];
    expect(tracksConItems(a, b)).toEqual(['t-ctp', 't-ap']);
  });
  it('ignora desmarcados', () => {
    expect(tracksConItems([{ destino: 't-ap', incluir: false }])).toEqual([]);
  });
  it('sin listas → []', () => expect(tracksConItems()).toEqual([]));
});
