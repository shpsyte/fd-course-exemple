import { join } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();

  const defaultMigration = {
    dbClient: dbClient,
    dryRun: false,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigration,
      dryRun: true,
    });

    await dbClient.end();
    return res.status(200).json(pendingMigrations);
  }

  if (req.method === "POST") {
    const migratedMigrations = await migrationRunner(defaultMigration);
    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
