import { ResultSetHeader, RowDataPacket } from "mysql2";
import { connection } from "../database/connection.js";

export interface CreateUserAccessDTO {
  userId: number;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
}

export class UserAccessRepository {
  async findByRefreshToken(refreshToken: string) {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM user_access WHERE refresh_token = ? AND is_revoked = FALSE",
      [refreshToken],
    );
    return rows[0] ?? null;
  }

  async create(dto: CreateUserAccessDTO) {
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO user_access (user_id, refresh_token, user_agent, ip_address, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        dto.userId,
        dto.refreshToken,
        dto.userAgent ?? null,
        dto.ipAddress ?? null,
        dto.expiresAt,
      ],
    );
    return result.insertId;
  }

  async revoke(refreshToken: string) {
    await connection.query(
      "UPDATE user_access SET is_revoked = TRUE WHERE refresh_token = ?",
      [refreshToken],
    );
  }

  async revokeAllByUserId(userId: number) {
    await connection.query(
      "UPDATE user_access SET is_revoked = TRUE WHERE user_id = ?",
      [userId],
    );
  }
}
