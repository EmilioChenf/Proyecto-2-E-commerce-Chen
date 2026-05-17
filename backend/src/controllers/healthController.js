import { pool } from '../db/pool.js';

export async function healthCheck(_req, res, next) {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, message: 'API funcionando' });
  } catch (error) {
    next(error);
  }
}
