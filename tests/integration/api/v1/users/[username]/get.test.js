import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/joseluiz", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "MesmoCase",
        email: "Mesmocase@email.com",
        password: "password",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(response2.status).toBe(200);

      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "MesmoCase",
        email: "Mesmocase@email.com",
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });

      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });

    test("With exact case mismatch", async () => {
      await orchestrator.createUser({
        username: "CaseDif",
        email: "CaseDif@email.com",
        password: "password",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/caseDif",
      );

      expect(response2.status).toBe(200);

      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "CaseDif",
        email: "CaseDif@email.com",
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });

      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });
    test("With nonexistis username", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/usernoex",
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
  });
});
