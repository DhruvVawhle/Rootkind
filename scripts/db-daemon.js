const EmbeddedPostgres = require('embedded-postgres').default;
const path = require('path');

const dbDir = path.resolve(__dirname, '../.postgres-data');
const pg = new EmbeddedPostgres({
  databaseDir: dbDir,
  port: 5433,
  user: 'postgres',
  password: 'postgrespassword',
  persistent: true,
});

async function main() {
  console.log('[PG Daemon] Starting Embedded PostgreSQL on port 5433...');
  try {
    await pg.initialise();
  } catch (e) {
    console.log('[PG Daemon] Cluster already initialized, proceeding to start.');
  }

  await pg.start();
  console.log('[PG Daemon] PostgreSQL is ACTIVE and listening on 127.0.0.1:5433');

  try {
    await pg.createDatabase('rootkind');
    console.log('[PG Daemon] Database "rootkind" confirmed.');
  } catch (err) {
    console.log('[PG Daemon] Database "rootkind" status:', err.message || 'Already exists');
  }

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('[PG Daemon] Stopping PostgreSQL...');
    await pg.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('[PG Daemon] Stopping PostgreSQL...');
    await pg.stop();
    process.exit(0);
  });

  // Keep process alive
  setInterval(() => {}, 1000 * 60 * 60);
}

main().catch(err => {
  console.error('[PG Daemon] Fatal error:', err);
  process.exit(1);
});
