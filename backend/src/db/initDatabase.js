import { pool } from './pool.js';
import { initializeDatabase } from './initializeDatabase.js';

initializeDatabase()
  .catch((error) => {
    console.error('[db] No fue posible inicializar la base de datos.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
