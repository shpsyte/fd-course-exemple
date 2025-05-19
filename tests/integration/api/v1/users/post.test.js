import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "valid-username2",
          email: "email@email.com",
          password: "password",
        }),
      });
      const reveived = response.status;
      const responseBody = await response.json();

      expect(reveived).toBe(201);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "valid-username2",
        email: "email@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("valid-username2");
      const correctPasswordMatch = await password.compare(
        "password",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
    });

    test("With duplicate `email`", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "valid-username1",
          email: "duplicado@email.com",
          password: "password",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "valid-username2",
          email: "Duplicado@email.com",
          password: "password",
        }),
      });

      expect(response2.status).toBe(400);
    });

    test("With duplicate `username`", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "____valid-username1",
          email: "____duplicado@email.com",
          password: "password",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "____valid-username1",
          email: "_________duplicado@email.com",
          password: "password",
        }),
      });

      expect(response2.status).toBe(400);
    });
  });
});
