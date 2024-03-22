import database from "infra/database";
beforeAll(async () => {
  await cleanDatabase();
});

async function cleanDatabase() {
  const q = "drop schema public cascade; create schema public;";
  await database.query(q);
}

test("Get to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  // const q = "SELECT * FROM pgmigrations";
  // const result = await database.query(q);
  // console.log(result);

  const expectedStatusCode = 200;
  const actualStatusCode = response.status;
  expect(actualStatusCode).toBe(expectedStatusCode);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
