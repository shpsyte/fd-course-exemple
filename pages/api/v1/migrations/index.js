import { join } from "node:path";
import migrationRunner from "node-pg-migrate";

export default async function migrations(req, res) {
  const migrations = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  });
  res.status(200).json(migrations);
}
