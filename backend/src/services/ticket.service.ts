import {
  CreateTicketDTO,
  TicketFilterDTO,
  UpdateTicketDTO,
} from "../dtos/ticket/index.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { getSocketManager } from "../websocket/socket.js";

export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async create(dto: CreateTicketDTO) {
    const id = await this.ticketRepository.create(dto);

    const now = new Date().toISOString();
    const ticket = {
      id,
      userId: dto.userId,
      categoryId: dto.categoryId ?? null,
      subject: dto.subject,
      description: dto.description,
      status: "open",
      createdAt: now,
      updatedAt: now,
    };

    getSocketManager().broadcast("ticket:created", ticket);

    return ticket;
  }

  async findAll(filters: TicketFilterDTO = {}) {
    return this.ticketRepository.findAll(filters);
  }

  async findById(id: number) {
    const ticket = await this.ticketRepository.findById(id);

    if (!ticket) {
      throw new Error("Ticket não encontrado");
    }

    return ticket;
  }

  async update(id: number, dto: UpdateTicketDTO) {
    await this.findById(id);
    await this.ticketRepository.update(id, dto);

    getSocketManager().broadcast("ticket:updated", { id, ...dto });
  }

  async delete(id: number) {
    await this.findById(id);
    await this.ticketRepository.delete(id);

    getSocketManager().broadcast("ticket:deleted", { id });
  }
}
