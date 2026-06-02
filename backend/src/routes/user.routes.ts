import { Router } from "express";
import { userController } from "../containers/user.container.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", userController.create);
router.get("/", authenticate, requireAdmin, userController.findAll);
router.put("/:id", authenticate, userController.update);
router.delete("/:id", authenticate, requireAdmin, userController.delete);

export default router;
