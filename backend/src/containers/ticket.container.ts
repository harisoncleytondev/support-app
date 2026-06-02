import { TicketController } from "../controllers/ticket.controller.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { TicketService } from "../services/ticket.service.js";

const ticketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);
const ticketController = new TicketController(ticketService);

export { ticketController };
