import { Router } from "express";
import { authController } from "../containers/auth.container.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", authenticate, authController.me);
router.post("/logout", authenticate, authController.logout);

export default router;
