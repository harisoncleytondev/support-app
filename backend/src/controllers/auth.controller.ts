import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userAgent = req.headers["user-agent"];
      const ipAddress = req.ip;
      const tokens = await this.authService.login(
        req.body,
        userAgent,
        ipAddress,
      );

      return res.status(200).json(tokens);
    } catch (error) {
      return res.status(401).json({
        message: error instanceof Error ? error.message : "Erro ao autenticar",
      });
    }
  };

  refresh = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token é obrigatório" });
      }

      const tokens = await this.authService.refresh(refreshToken);

      return res.status(200).json(tokens);
    } catch (error) {
      return res.status(401).json({
        message:
          error instanceof Error ? error.message : "Erro ao renovar token",
      });
    }
  };

  me = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.authService.me(req.user!.userId);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({
        message: error instanceof Error ? error.message : "Usuário não encontrado",
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token é obrigatório" });
      }

      await this.authService.logout(refreshToken);

      return res.status(204).send();
    } catch {
      return res.status(500).json({ message: "Erro ao fazer logout" });
    }
  };
}
