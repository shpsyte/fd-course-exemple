import database from "infra/database";

test("Get to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  // console.log(response);
  console.log(process.env.NODE_ENV);
  console.log(process.env.DATABASE_URL);

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
