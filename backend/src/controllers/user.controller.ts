import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.create(req.body);

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao criar usuário",
      });
    }
  };

  findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userService.findAll();

      return res.status(200).json(users);
    } catch {
      return res.status(500).json({
        message: "Erro ao buscar usuários",
      });
    }
  };

  findByEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
      const email = req.query.email as string;

      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório" });
      }

      const user = await this.userService.findByEmail(email);

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
        });
      }

      return res.status(200).json(user);
    } catch {
      return res.status(500).json({
        message: "Erro ao buscar usuário",
      });
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      await this.userService.update(id, req.body);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao atualizar usuário",
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      await this.userService.delete(id);

      return res.status(204).send();
    } catch {
      return res.status(500).json({
        message: "Erro ao remover usuário",
      });
    }
  };
}
