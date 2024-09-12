import orchestrator from "tests/orchestrator.js";
import database from "infra/database";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
});

async function cleanDatabase() {
  const q = "drop schema public cascade; create schema public;";
  await database.query(q);
}

test("POST to /api/v1/migrations to apply all teste migrations", async () => {
  // Get information about migrations before applying
  const migrationsResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
  );
  const migrationsData = await migrationsResponse.json();
  const totalMigrationsToApply = migrationsData.length;

  // Perform the migration
  const applyMigrationResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );

  // Testing the endpoint response status code
  const actualStatusCode = applyMigrationResponse.status;
  expect(actualStatusCode).toBe(201);

  // Testing if the response is an array
  const responseBody = await applyMigrationResponse.json();
  expect(Array.isArray(responseBody)).toBe(true);

  // The number of migrations applied should be the same as the number of migrations returned
  const migrationCountQuery = await database.query(
    "SELECT count(*) FROM pgmigrations;",
  );
  const numerOfMigrationsInDb = +migrationCountQuery.rows[0].count;
  expect(numerOfMigrationsInDb).toBe(responseBody.length);

  // The number of migrations should also be equal to total migrations to apply
  expect(numerOfMigrationsInDb).toBe(totalMigrationsToApply);
});
