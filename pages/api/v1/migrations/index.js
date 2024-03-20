import { join } from "node:path";
import migrationRunner from "node-pg-migrate";

export default async function migrations(req, res) {
  if (req.method === "POST") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: false,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    return res.status(200).json(migrations);
  }

  if (req.method === "GET") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    return res.status(200).json(migrations);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
