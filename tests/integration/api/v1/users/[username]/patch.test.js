import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/joseluiz", () => {
  describe("Anonymous user", () => {
    test("With nonexistis 'username'", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/usuarioInexistente",
        {
          method: "PATCH",
        },
      );

      expect(response2.status).toBe(404);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        message: "User not found",
        name: "NotFoundError",
        action: "Check the username and try again",
        status_code: 404,
      });
    });

    test("With duplicate `username`", async () => {
      await orchestrator.createUser({
        username: "user1",
      });

      await orchestrator.createUser({
        username: "user2",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/user2",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "user1",
          }),
        },
      );

      expect(response2.status).toBe(400);
    });

    test("With duplicate `email`", async () => {
      await orchestrator.createUser({
        email: "email1@curso.dev",
      });

      const createUser2 = await orchestrator.createUser({
        email: "email2@curso.dev",
      });

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${createUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "email1@curso.dev",
          }),
        },
      );

      expect(response2.status).toBe(400);
    });

    test("With unique `username`", async () => {
      await orchestrator.createUser({
        username: "uniqueuser1",
        email: "unique1@curso.dev",
        password: "password",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/uniqueuser1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueuser2",
          }),
        },
      );

      expect(response2.status).toBe(200);
    });

    test("With unique `email`", async () => {
      await orchestrator.createUser({
        username: "uniqueuser3",
        email: "unique3@curso.dev",
        password: "password",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/uniqueuser3",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "unique23@curso.com",
          }),
        },
      );

      expect(response2.status).toBe(200);
    });
  });
});
