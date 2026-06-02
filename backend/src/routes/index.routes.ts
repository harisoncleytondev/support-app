import { Router } from "express";
import userRoutes from "./user.routes.js";
import categoryRoutes from "./category.routes.js";
import ticketRoutes from "./ticket.routes.js";
import ticketReplyRoutes from "./ticket-reply.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/tickets", ticketRoutes);
router.use("/ticket-replies", ticketReplyRoutes);
router.use("/auth", authRoutes);

export default router;
