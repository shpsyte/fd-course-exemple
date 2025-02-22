import orchestrator from "tests/orchestrator.js";
import database from "@/infra/database";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unioque and valid data", async () => {
      await database.query({
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) ",
        values: ["valid-username2", "email@email.com", "password"],
      });

      const users = await database.query("SELECT * FROM users");

      console.log("users", users.rows);

      // const response1 = await fetch(
      //   "http://localhost:3000/api/v1/users",
      //   {
      //     method: "POST",
      //   },
      // );
      expect("test").toBe("test");
    });
  });
});
