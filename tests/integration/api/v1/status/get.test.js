

test('Get to /api/v2/status should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status')

  const expectedStatusCode = 200
  const actualStatusCode = response.status

  expect(actualStatusCode).toBe(expectedStatusCode)
  // expect(response.statusCode).toBe(200)
  // expect(response.body.status).toBe('ok')
})