import { Request, Response } from "express";
import { TicketReplyService } from "../services/ticket-reply.service.js";

export class TicketReplyController {
  constructor(private readonly ticketReplyService: TicketReplyService) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const reply = await this.ticketReplyService.create({
        ...req.body,
        userId: req.user!.userId,
      });

      return res.status(201).json(reply);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao criar resposta",
      });
    }
  };

  findByTicketId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const ticketId = Number(req.params.ticketId);
      const replies = await this.ticketReplyService.findByTicketId(ticketId);

      return res.status(200).json(replies);
    } catch {
      return res.status(500).json({ message: "Erro ao buscar respostas" });
    }
  };
}
