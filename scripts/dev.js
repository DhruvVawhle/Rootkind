const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 5433;
const HOST = '127.0.0.1';
const dbDir = path.resolve(__dirname, '../.postgres-data');

function isPortOpen(port, host = HOST) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function main() {
  let pgInstance = null;
  let startedByUs = false;

  console.log('[Rootkind] Checking PostgreSQL database on port 5433...');
  const alreadyRunning = await isPortOpen(PORT);

  if (alreadyRunning) {
    console.log('[Rootkind] ✓ PostgreSQL is already running and accessible on port 5433.');
  } else {
    console.log('[Rootkind] Starting embedded PostgreSQL on port 5433...');
    try {
      const EmbeddedPostgres = require('embedded-postgres').default;
      pgInstance = new EmbeddedPostgres({
        databaseDir: dbDir,
        port: PORT,
        user: 'postgres',
        password: 'postgrespassword',
        persistent: true,
      });

      try {
        await pgInstance.initialise();
      } catch (e) {
        // Already initialized
      }

      await pgInstance.start();
      startedByUs = true;
      console.log('[Rootkind] ✓ PostgreSQL started successfully on port 5433.');

      try {
        await pgInstance.createDatabase('rootkind');
      } catch (e) {
        // Database already exists
      }
    } catch (err) {
      console.error('[Rootkind] Failed to start embedded PostgreSQL automatically:', err.message || err);
      console.log('[Rootkind] Attempting to continue with Next.js dev server...');
    }
  }

  console.log('[Rootkind] Launching Next.js development server...\n');
  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? 'npx.cmd' : 'npx';
  const args = ['next', 'dev', ...process.argv.slice(2)];

  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  const cleanup = async () => {
    if (child && !child.killed) {
      try {
        child.kill();
      } catch (e) {}
    }

    if (startedByUs && pgInstance) {
      console.log('\n[Rootkind] Stopping embedded PostgreSQL...');
      try {
        await pgInstance.stop();
      } catch (e) {}
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  child.on('exit', (code) => {
    cleanup().then(() => {
      process.exit(code || 0);
    });
  });
}

main().catch((err) => {
  console.error('[Rootkind] Dev runner error:', err);
  process.exit(1);
});
