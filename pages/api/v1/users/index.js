import { createRouter } from "next-connect";
import controller from "@/infra/controller";
import user from "models/user.js";

const router = createRouter();

router.post(postMigrations);

export default router.handler(controller.errorHandler);

async function postMigrations(req, res) {
  const unserInputValues = req.body;
  const newUser = await user.create(unserInputValues);
  return res.status(201).json(newUser);
}
