import { Router } from "express";
import { ticketReplyController } from "../containers/ticket-reply.container.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:ticketId", authenticate, ticketReplyController.findByTicketId);
router.post("/", authenticate, ticketReplyController.create);

export default router;
