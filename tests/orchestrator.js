import retry from "async-retry";
import database from "infra/database.js";
import migrations from "models/migrator.js";
async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 3000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseJson = await response.json();
      if (responseJson.dependencies.database.open_connections > 0) {
        return;
      }
      throw new Error("Database is not ready");
    }
  }
}
async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrations.runPendingMigrations();
}
const orchestrator = {
  waitForAllServices: waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};
export default orchestrator;
