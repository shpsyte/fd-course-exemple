import { join } from "node:path";
import migrationRunner from "node-pg-migrate";

export default async function migrations(req, res) {
  const defaultMigration = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: false,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method === "POST") {
    const migratedMigrations = await migrationRunner(defaultMigration);

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  }

  if (req.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigration,
      dryRun: true,
    });

    return res.status(200).json(pendingMigrations);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
