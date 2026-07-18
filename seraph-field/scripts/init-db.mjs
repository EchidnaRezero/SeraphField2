import { ensureDatabase } from './lib/sqlite-store.mjs';
import { databasePath } from './lib/paths.mjs';

ensureDatabase()
  .then(() => {
    console.log(`SQLite database is ready: ${databasePath}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
