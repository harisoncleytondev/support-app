import { CreateTicketReplyDTO } from "../dtos/ticket-reply/index.js";
import { TicketReplyRepository } from "../repositories/ticket-reply.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { getSocketManager } from "../websocket/socket.js";

export class TicketReplyService {
  constructor(
    private readonly ticketReplyRepository: TicketReplyRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateTicketReplyDTO) {
    const ticket = await this.ticketRepository.findById(dto.ticketId);
    if (!ticket) throw new Error("Ticket não encontrado");
    if (ticket.status === "resolved" || ticket.status === "closed") {
      throw new Error("Ticket está resolvido ou fechado");
    }

    const id = await this.ticketReplyRepository.create(dto);
    const user = await this.userRepository.findById(dto.userId);

    const reply = {
      id,
      ticketId: dto.ticketId,
      userId: dto.userId,
      userName: user?.name ?? "Usuário",
      message: dto.message,
      createdAt: new Date().toISOString(),
    };

    getSocketManager().broadcast("reply:created", reply);

    return reply;
  }

  async findByTicketId(ticketId: number) {
    const rows = await this.ticketReplyRepository.findByTicketId(ticketId);
    if (rows.length === 0) return rows;

    const userIds = [...new Set(rows.map((r: any) => r.user_id))];
    const userMap = new Map<number, string>();
    for (const id of userIds) {
      const user = await this.userRepository.findById(id);
      if (user) userMap.set(id, user.name);
    }

    return rows.map((r: any) => ({
      ...r,
      userName: userMap.get(r.user_id) ?? "Usuário",
    }));
  }
}
