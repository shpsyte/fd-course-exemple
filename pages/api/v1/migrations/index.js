import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "@/infra/controller";
import migrator from "@/models/migrator";

const router = createRouter();

router.get(getHandler).post(postMigrations);

export default router.handler(controller.errorHandler);

async function getHandler(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return res.status(200).json(pendingMigrations);
}

async function postMigrations(req, res) {
  const migratedMigrations = await migrator.runPendingMigrations();
  if (migratedMigrations.length > 0) {
    return res.status(201).json(migratedMigrations);
  }
  return res.status(200).json(migratedMigrations);
}
