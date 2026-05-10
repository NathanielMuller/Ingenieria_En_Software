import { createApp } from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection } from './config/database.js';

async function startServer() {
  await checkDatabaseConnection();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Pacific Reef MVP backend escuchando en http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('No fue posible iniciar el backend MVP.', error.message);
  process.exit(1);
});