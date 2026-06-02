import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserAccessRepository } from "../repositories/user-access.repository.js";

const userRepository = new UserRepository();
const userAccessRepository = new UserAccessRepository();
const authService = new AuthService(userRepository, userAccessRepository);
const authController = new AuthController(authService);

export { authController };
