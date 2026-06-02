import { Router } from "express";
import { categoryController } from "../containers/category.container.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", authenticate, categoryController.findAll);
router.get("/:id", authenticate, categoryController.findById);
router.post("/", authenticate, requireAdmin, categoryController.create);
router.put("/:id", authenticate, requireAdmin, categoryController.update);
router.delete("/:id", authenticate, requireAdmin, categoryController.delete);

export default router;
