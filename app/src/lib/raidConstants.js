// Valores permitidos para tipo/severidade de un riesgo (tabla RAID). Viven acá
// (no en components/trackingUi.jsx) porque lib/ es lógica pura sin React y
// necesita estos valores para validar/clampar datos que vienen de la IA
// (ver lib/minutaRevision.js); trackingUi.jsx los reexporta para no duplicar.

export const RISK_TIPOS = ['riesgo', 'issue'];
export const SEVERIDADES = ['alta', 'media', 'baja'];
