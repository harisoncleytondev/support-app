import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginDTO, TokenResponseDTO } from "../dtos/auth/index.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserAccessRepository } from "../repositories/user-access.repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAccessRepository: UserAccessRepository,
  ) {}

  async login(
    dto: LoginDTO,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<TokenResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordMatch = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!passwordMatch) {
      throw new Error("Email ou senha inválidos");
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

    await this.userAccessRepository.create({
      userId: user.id,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
    };
  }

  async refresh(refreshToken: string): Promise<TokenResponseDTO> {
    const stored =
      await this.userAccessRepository.findByRefreshToken(refreshToken);

    if (!stored) {
      throw new Error("Refresh token inválido ou revogado");
    }

    try {
      jwt.verify(refreshToken, JWT_SECRET);
    } catch {
      await this.userAccessRepository.revoke(refreshToken);
      throw new Error("Refresh token expirado");
    }

    await this.userAccessRepository.revoke(refreshToken);

    const user = await this.userRepository.findById(stored.user_id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

    await this.userAccessRepository.create({
      userId: user.id,
      refreshToken: newRefreshToken,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 15 * 60,
    };
  }

  async me(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("Usuário não encontrado");
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.userAccessRepository.revoke(refreshToken);
  }
}
