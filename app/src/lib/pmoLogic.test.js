import { describe, it, expect } from 'vitest';
import {
  daysTo, isOverdue, avanceTrack, avanceProjeto,
  ragTrack, ragProjeto, nextMarco, countVencidas, countBloqueadas,
} from './pmoLogic';

const TODAY = '2026-07-27';

describe('daysTo / isOverdue', () => {
  it('conta dias positivos no futuro', () => expect(daysTo('2026-07-30', TODAY)).toBe(3));
  it('conta dias negativos no passado', () => expect(daysTo('2026-07-25', TODAY)).toBe(-2));
  it('null sem data', () => expect(daysTo(null, TODAY)).toBe(null));
  it('vencido quando data < hoje', () => expect(isOverdue('2026-07-25', TODAY)).toBe(true));
  it('não vencido quando data = hoje', () => expect(isOverdue('2026-07-27', TODAY)).toBe(false));
});

describe('avanceTrack', () => {
  it('deriva de fechadas/total', () => {
    const t = avanceTrack({ avance: null }, [
      { status: 'fechado' }, { status: 'fechado' }, { status: 'aberto' }, { status: 'bloqueada' },
    ]);
    expect(t).toEqual({ pct: 50, hasData: true });
  });
  it('sem tarefas => hasData false, pct 0', () => {
    expect(avanceTrack({ avance: null }, [])).toEqual({ pct: 0, hasData: false });
  });
  it('override manual vence', () => {
    expect(avanceTrack({ avance: 80 }, [{ status: 'aberto' }])).toEqual({ pct: 80, hasData: true });
  });
});

describe('avanceProjeto', () => {
  it('média dos tracks', () => {
    const tracks = [{ id: 'a', avance: null }, { id: 'b', avance: null }];
    const byTrack = { a: [{ status: 'fechado' }, { status: 'aberto' }], b: [{ status: 'fechado' }] };
    expect(avanceProjeto(tracks, byTrack)).toBe(75); // (50 + 100)/2
  });
});

describe('ragTrack', () => {
  const clean = { id: 't', rag_override: null, waiver_hasta: null };
  it('rojo com tarefa bloqueada', () => {
    expect(ragTrack(clean, [{ status: 'bloqueada' }], [], TODAY)).toBe('rojo');
  });
  it('rojo com marco vencido não concluído', () => {
    expect(ragTrack(clean, [], [{ fecha: '2026-07-25', concluido: false }], TODAY)).toBe('rojo');
  });
  it('amarelo com waiver em <=7 dias', () => {
    expect(ragTrack({ ...clean, waiver_hasta: '2026-08-01' }, [], [], TODAY)).toBe('amarelo');
  });
  it('verde sem sinais', () => {
    expect(ragTrack(clean, [{ status: 'aberto' }], [], TODAY)).toBe('verde');
  });
  it('override vence a regra', () => {
    expect(ragTrack({ ...clean, rag_override: 'rojo' }, [], [], TODAY)).toBe('rojo');
  });
});

describe('ragProjeto', () => {
  it('pior RAG entre tracks', () => {
    const tracks = [{ id: 'a', rag_override: null, waiver_hasta: null }, { id: 'b', rag_override: null, waiver_hasta: null }];
    const byTrack = { a: [{ status: 'aberto' }], b: [{ status: 'bloqueada' }] };
    expect(ragProjeto({ rag_override: null }, tracks, byTrack, {}, TODAY)).toBe('rojo');
  });
  it('override do projeto vence', () => {
    expect(ragProjeto({ rag_override: 'amarelo' }, [], {}, {}, TODAY)).toBe('amarelo');
  });
});

describe('nextMarco / contadores', () => {
  it('próximo marco = menor fecha não concluída', () => {
    const m = nextMarco([
      { nome: 'A', fecha: '2026-09-30', concluido: false },
      { nome: 'B', fecha: '2026-08-08', concluido: false },
      { nome: 'C', fecha: '2026-07-01', concluido: true },
    ], TODAY);
    expect(m.nome).toBe('B');
  });
  it('countVencidas ignora fechadas', () => {
    expect(countVencidas([
      { status: 'aberto', previsao_entrega: '2026-07-25' },
      { status: 'fechado', previsao_entrega: '2026-07-25' },
      { status: 'aberto', previsao_entrega: '2026-08-10' },
    ], TODAY)).toBe(1);
  });
  it('countBloqueadas', () => {
    expect(countBloqueadas([{ status: 'bloqueada' }, { status: 'aberto' }])).toBe(1);
  });
});
