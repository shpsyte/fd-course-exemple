test("Get to /api/v2/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  const expectedStatusCode = 200;
  const actualStatusCode = response.status;
  expect(actualStatusCode).toBe(expectedStatusCode);

  const responseJson = await response.json();

  console.log(responseJson);

  // {
  //   updated_at: '2023-12-08T14:45:21.779Z',
  //   dependencies: {
  //     database: { version: '16.0', max_connections: 100, current_connections: 1 }
  //   }
  // }
  const dateParsedAt = new Date(responseJson.updated_at).toISOString();

  // validate the shape of the response
  const expectedResponseJson = {
    updated_at: expect.any(String),
    dependencies: expect.objectContaining({
      database: expect.objectContaining({
        version: expect.any(String),
        max_connections: expect.any(Number),
        current_connections: expect.any(Number),
      }),
    }),
  };

  expect(responseJson).toMatchObject(expectedResponseJson);

  // expect(responseJson.updated_at).toBeDefined();
  // const dateParsedAt = new Date(responseJson.updated_at).toISOString();
  // expect(responseJson.updated_at).toEqual(dateParsedAt);

  // // verison
  // expect(responseJson.dependencies.database.version).toEqual("16.0");

  // expect(responseJson.dependencies.database.max_connections).toBeDefined();
  // expect(responseJson.dependencies.database.max_connections).toBeGreaterThan(0);

  // expect(responseJson.dependencies.database.current_connections).toBeDefined();
});
