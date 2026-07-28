export async function enginesDisponibles() {
  const r = await fetch('/api/engines');
  if (!r.ok) throw new Error('No se pudo leer los motores');
  const j = await r.json();
  return (j.engines || []).filter((e) => e.available);
}

export async function procesarMinuta(engine, texto, contexto) {
  const r = await fetch('/api/procesar-minuta', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ engine, texto, contexto: contexto || {} }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Error al procesar la minuta');
  return j;
}
