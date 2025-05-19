import retry from "async-retry";
import database from "infra/database.js";
import migrations from "models/migrator.js";
import user from "models/user.js";
import { faker } from "@faker-js/faker";

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
  await database.query("drop schema public cascade;");
  await database.query("create schema public;");
  await database.query("commit;");
}

async function createUser(userInputValues) {
  return await user.create({
    username:
      userInputValues.username ||
      faker.internet.username().replace(/[_.-]/g, ""),
    email: userInputValues.email || faker.internet.email(),
    password: userInputValues.password || "valid-password",
  });
}

async function runPendingMigrations() {
  await migrations.runPendingMigrations();
}
const orchestrator = {
  waitForAllServices: waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
};
export default orchestrator;
