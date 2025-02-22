import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { resolve } from "path";

function getDefaulMigration(dbClient) {
  return {
    dryRun: false,
    dbClient,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigration = getDefaulMigration(dbClient);
    const pendingMigrations = await migrationRunner({
      ...defaultMigration,
      dryRun: true,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const defaultMigration = getDefaulMigration(dbClient);

    const migratedMigrations = await migrationRunner(defaultMigration);

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
