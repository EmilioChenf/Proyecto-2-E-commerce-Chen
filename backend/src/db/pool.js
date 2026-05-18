import pg from 'pg';

import { env } from '../config/env.js';

const { Pool } = pg;

pg.types.setTypeParser(20, Number);
pg.types.setTypeParser(1700, Number);

const poolConfig = env.db.databaseUrl
  ? {
      connectionString: env.db.databaseUrl,
      max: env.db.connectionLimit,
      ssl:
        env.nodeEnv === 'production'
          ? { rejectUnauthorized: false }
          : undefined,
    }
  : {
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
      user: env.db.user,
      password: env.db.password,
      max: env.db.connectionLimit,
    };

export const pool = new Pool(poolConfig);

export async function waitForDatabase({
  retries = 40,
  delayMs = 3000,
} = {}) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      console.log('[db] Conexion con PostgreSQL exitosa.');
      return;
    } catch (error) {
      lastError = error;
      console.log(
        `[db] Esperando conexion con PostgreSQL (${attempt}/${retries})...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
