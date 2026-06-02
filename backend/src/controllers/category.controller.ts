import { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const category = await this.categoryService.create(req.body);

      return res.status(201).json(category);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao criar categoria",
      });
    }
  };

  findAll = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const categories = await this.categoryService.findAll();

      return res.status(200).json(categories);
    } catch {
      return res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  };

  findById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);
      const category = await this.categoryService.findById(id);

      return res.status(200).json(category);
    } catch (error) {
      return res.status(404).json({
        message:
          error instanceof Error ? error.message : "Categoria não encontrada",
      });
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      await this.categoryService.update(id, req.body);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar categoria",
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      await this.categoryService.delete(id);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao remover categoria",
      });
    }
  };
}
