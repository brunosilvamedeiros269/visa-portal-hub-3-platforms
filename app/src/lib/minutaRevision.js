// Mapeo del resultado crudo de la IA (procesarMinuta) + el directorio de
// contactos hacia el estado editable que consume el panel de revisión
// (ReunionRevision). Lógica pura: sin React, sin red, sin Supabase — solo
// transforma datos. Separado de minutaRouting.js porque acá la preocupación es
// "dar forma al resultado de la IA para la UI de revisión", no el ruteo de
// items hacia tracks (aunque usa destinoInicial para eso).

import { destinoInicial } from './minutaRouting';
import { RISK_TIPOS, SEVERIDADES } from './raidConstants';

const norm = (s) => (s || '').trim().toLowerCase();

// Arma las filas de participantes: si el nombre matchea un contacto del
// directorio (case-insensitive), pre-rellena email/organización desde ahí y
// marca `existe: true`; si no, es un participante nuevo y no se le inventa
// ni email ni organización.
export function buildParticipantes(participantesIA, contactos) {
  const byName = Object.fromEntries((contactos || []).map((c) => [norm(c.nombre), c]));
  return (participantesIA || []).map((p) => {
    const hit = byName[norm(p.nombre)];
    return {
      nombre: p.nombre || '',
      email: p.email || hit?.email || '',
      organizacion: p.organizacion || hit?.organizacion || '',
      incluir: true,
      existe: Boolean(hit),
    };
  });
}

// Arma las filas de action items → tareas: recorta el prazo a YYYY-MM-DD y
// resuelve el destino inicial (track propuesta por la IA o proyecto).
export function buildActionItems(actionItemsIA, tracks) {
  return (actionItemsIA || []).map((a) => ({
    titulo: a.titulo || '',
    responsable: a.responsable || '',
    prazo: (a.prazo || '').slice(0, 10),
    destino: destinoInicial(a, tracks),
    incluir: true,
  }));
}

// Arma las filas de riesgos → RAID: clampa tipo/severidade a los valores
// permitidos (si la IA devuelve algo fuera de esos conjuntos, cae al default)
// y resuelve el destino inicial igual que un action item.
export function buildRiesgos(riesgosIA, tracks) {
  return (riesgosIA || []).map((x) => ({
    descricao: x.descricao || '',
    tipo: RISK_TIPOS.includes(x.tipo) ? x.tipo : 'riesgo',
    severidade: SEVERIDADES.includes(x.severidade) ? x.severidade : 'media',
    dueno: x.dueno || '',
    destino: destinoInicial(x, tracks),
    incluir: true,
  }));
}

// Arma las filas de decisiones. El modelo puede devolver strings sueltos o
// objetos { texto }; acá se normaliza a un solo shape.
export function buildDecisiones(decisionesIA) {
  return (decisionesIA || []).map((d) => ({
    texto: typeof d === 'string' ? d : (d.texto || ''),
    incluir: true,
  }));
}

// Arma el `result` completo que espera ReunionRevision a partir del resultado
// crudo de procesarMinuta, las tracks del proyecto y el directorio de
// contactos. Bloques ausentes o vacíos en el resultado de la IA producen
// listas vacías, nunca un throw.
export function buildRevisionResult(resultadoIA, tracks, contactos) {
  const r = resultadoIA || {};
  return {
    resumen: r.resumen || '',
    decisiones: buildDecisiones(r.decisiones),
    action_items: buildActionItems(r.action_items, tracks),
    riesgos: buildRiesgos(r.riesgos, tracks),
    participantes: buildParticipantes(r.participantes, contactos),
  };
}
