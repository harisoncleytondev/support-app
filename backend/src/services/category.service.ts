import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../dtos/category/index.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { getSocketManager } from "../websocket/socket.js";

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(dto: CreateCategoryDTO) {
    const existing = await this.categoryRepository.findByName(dto.name);

    if (existing) {
      throw new Error("Categoria já existe");
    }

    const id = await this.categoryRepository.create(dto);

    const category = {
      id,
      name: dto.name,
      description: dto.description ?? null,
    };

    getSocketManager().broadcast("category:created", category);

    return category;
  }

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async findById(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDTO) {
    await this.findById(id);

    if (dto.name) {
      const existing = await this.categoryRepository.findByName(dto.name);

      if (existing && existing.id !== id) {
        throw new Error("Nome de categoria já em uso");
      }
    }

    await this.categoryRepository.update(id, dto);

    getSocketManager().broadcast("category:updated", { id, ...dto });
  }

  async delete(id: number) {
    await this.findById(id);
    await this.categoryRepository.delete(id);

    getSocketManager().broadcast("category:deleted", { id });
  }
}
