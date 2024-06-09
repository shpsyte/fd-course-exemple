import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("Get to /api/v2/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const expectedStatusCode = 200;
  const actualStatusCode = response.status;
  expect(actualStatusCode).toBe(expectedStatusCode);

  const responseJson = await response.json();

  // console.log(responseJson);

  expect(responseJson).toMatchObject(
    expect.objectContaining({
      updated_at: expect.any(String),
      dependencies: {
        database: {
          version: "16.0",
          max_connections: expect.any(Number),
          open_connections: 1,
        },
      },
    })
  );
});
