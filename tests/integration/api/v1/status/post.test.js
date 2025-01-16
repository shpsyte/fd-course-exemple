import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("POST to /api/v2/status should return 405", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status", {
    method: "POST",
  });

  const expectedStatusCode = 405;
  const actualStatusCode = response.status;
  const responseBody = await response.json();
  expect(actualStatusCode).toBe(expectedStatusCode);
  expect(responseBody).toEqual({
    name: "MethodNotAllowedError",
    message: "Method Not Allowed",
    action: "Pls check the allowed methods for this endpoint",
    status_code: 405,
  });
});
