import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";

export default async function migrations(req, res) {
  const methodsAllowed = ["GET", "POST"];

  if (!methodsAllowed.includes(req.method)) {
    return res.status(405).json({ message: "Method not allowed" });
  }
  let dbClient;
  // eslint-disable-next-line no-undef this is a test of dsdkfjasdk

  try {
    dbClient = await database.getNewClient();

    const defaultMigration = {
      dbClient: dbClient,
      dryRun: false,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (req.method === "GET") {
      const pendingMigrations = await migrationRunner({
        ...defaultMigration,
        dryRun: true,
      });

      return res.status(200).json(pendingMigrations);
    }

    if (req.method === "POST") {
      const migratedMigrations = await migrationRunner(defaultMigration);

      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations);
      }

      return res.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await dbClient.end();
  }
}
