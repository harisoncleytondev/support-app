import bcrypt from "bcrypt";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user/index.js";
import { UserRepository } from "../repositories/user.repository.js";
import { getSocketManager } from "../websocket/socket.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDTO) {
    const userExists = await this.userRepository.findByEmail(dto.email);

    if (userExists) {
      throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const id = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const user = {
      id,
      name: dto.name,
      email: dto.email,
      role: dto.role ?? "user",
    };

    getSocketManager().broadcast("user:created", user);

    return user;
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async update(id: number, dto: UpdateUserDTO) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepository.update(id, dto);
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }
}
