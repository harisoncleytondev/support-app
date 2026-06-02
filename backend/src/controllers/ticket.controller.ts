import { Request, Response } from "express";
import { TicketFilterDTO } from "../dtos/ticket/index.js";
import { TicketService } from "../services/ticket.service.js";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const ticket = await this.ticketService.create({
        ...req.body,
        userId: req.user!.userId,
      });

      return res.status(201).json(ticket);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao criar ticket",
      });
    }
  };

  findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, assignedTo, categoryId, status } = req.query;

      const filters = {
        userId: userId ? Number(userId) : undefined,
        assignedTo: assignedTo ? Number(assignedTo) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        status:
          typeof status === "string"
            ? (status as TicketFilterDTO["status"])
            : undefined,
      };

      const tickets = await this.ticketService.findAll(filters);

      return res.status(200).json(tickets);
    } catch {
      return res.status(500).json({ message: "Erro ao buscar tickets" });
    }
  };

  findById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);
      const ticket = await this.ticketService.findById(id);

      return res.status(200).json(ticket);
    } catch (error) {
      return res.status(404).json({
        message:
          error instanceof Error ? error.message : "Ticket não encontrado",
      });
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      await this.ticketService.update(id, req.body);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao atualizar ticket",
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      await this.ticketService.delete(id);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao remover ticket",
      });
    }
  };
}
