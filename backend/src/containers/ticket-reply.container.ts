import { TicketReplyController } from "../controllers/ticket-reply.controller.js";
import { TicketReplyRepository } from "../repositories/ticket-reply.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { TicketReplyService } from "../services/ticket-reply.service.js";
import { UserRepository } from "../repositories/user.repository.js";

const ticketReplyRepository = new TicketReplyRepository();
const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();
const ticketReplyService = new TicketReplyService(ticketReplyRepository, ticketRepository, userRepository);
const ticketReplyController = new TicketReplyController(ticketReplyService);

export { ticketReplyController };
