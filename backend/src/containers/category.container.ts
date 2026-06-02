import { CategoryController } from "../controllers/category.controller.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { CategoryService } from "../services/category.service.js";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

export { categoryController };
