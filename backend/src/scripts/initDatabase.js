import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { pool } from '../db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initSqlPath = path.resolve(__dirname, '../sql/init.sql');

async function initDatabase() {
  const sql = await fs.readFile(initSqlPath, 'utf8');
  await pool.query(sql);
  console.log('[db] Esquema y datos semilla aplicados correctamente.');
}

initDatabase()
  .catch((error) => {
    console.error('[db] No fue posible inicializar la base de datos.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
