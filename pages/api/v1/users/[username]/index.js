import { createRouter } from "next-connect";
import controller from "@/infra/controller";
import user from "models/user";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandler);

async function getHandler(req, res) {
  const username = req.query.username;

  const userFound = await user.findOneByUsername(username);

  return res.status(200).json(userFound);
}
