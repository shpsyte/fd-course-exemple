import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getMigrations).post(postMigrations);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(req, res) {
  const publicError = new MethodNotAllowedError();
  res.status(publicError.statusCode).json(publicError);
}

function onErrorHandler(error, req, res) {
  console.error(error);
  const publicError = new InternalServerError();
  return res.status(publicError.statusCode).json(publicError);
}

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

async function getMigrations(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigration = getDefaulMigration(dbClient);
    const pendingMigrations = await migrationRunner({
      ...defaultMigration,
      dryRun: true,
    });

    return res.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postMigrations(req, res) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const defaultMigration = getDefaulMigration(dbClient);

    const migratedMigrations = await migrationRunner(defaultMigration);

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
