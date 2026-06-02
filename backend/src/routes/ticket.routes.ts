import { Router } from "express";
import { ticketController } from "../containers/ticket.container.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", authenticate, ticketController.findAll);
router.get("/:id", authenticate, ticketController.findById);
router.post("/", authenticate, ticketController.create);
router.put("/:id", authenticate, ticketController.update);
router.delete("/:id", authenticate, requireAdmin, ticketController.delete);

export default router;
