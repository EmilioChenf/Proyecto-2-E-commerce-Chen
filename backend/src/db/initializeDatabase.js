import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initSqlPath = path.resolve(__dirname, '../sql/init.sql');

export async function initializeDatabase() {
  console.log('[db] Ejecutando inicializacion de PostgreSQL...');

  const sql = await fs.readFile(initSqlPath, 'utf8');
  await pool.query(sql);

  console.log('[db] Tablas e indices creados/verificados correctamente.');
  console.log('[db] Seeds iniciales insertados/actualizados correctamente.');
}
