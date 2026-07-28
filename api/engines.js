import { ENGINES } from './minutaLib.js';

export default function handler(req, res) {
  const list = ENGINES.map((e) => ({
    id: e.id,
    label: e.label,
    model: process.env[e.modelEnv] || e.defaultModel,
    available: Boolean(process.env[e.envKey]),
  }));
  res.status(200).json({ engines: list });
}
