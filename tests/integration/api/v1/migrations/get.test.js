test("Get to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  // console.log(response);

  const expectedStatusCode = 200;
  const actualStatusCode = response.status;
  expect(actualStatusCode).toBe(expectedStatusCode);

  const responseBody = await response.json();
  console.log(responseBody);

  expect(Array.isArray(responseBody)).toBe(true);
});
