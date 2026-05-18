import app from './app.js';
import { env } from './config/env.js';
import { initializeDatabase } from './db/initializeDatabase.js';
import { waitForDatabase } from './db/pool.js';

async function bootstrap() {
  await waitForDatabase();
  await initializeDatabase();

  app.listen(env.port, env.host, () => {
    console.log(
      `[server] Backend iniciado en ${env.host}:${env.port}`,
    );
  });
}

bootstrap().catch((error) => {
  console.error('[server] No fue posible iniciar el backend.', error);
  process.exit(1);
});
