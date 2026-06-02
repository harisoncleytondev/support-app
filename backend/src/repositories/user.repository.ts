import { ResultSetHeader, RowDataPacket } from "mysql2";
import { connection } from "../database/connection.js";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user/index.js";

export class UserRepository {
  async findAll() {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT id, name, email, role, created_at, updated_at FROM users",
    );

    return rows;
  }

  async findById(id: number) {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    return rows[0] ?? null;
  }

  async findByEmail(email: string) {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    return rows[0] ?? null;
  }

  async create(dto: CreateUserDTO) {
    const [result] = await connection.query<ResultSetHeader>(
      `
      INSERT INTO users (      
        name,
        email,
        password_hash,
        role
      ) VALUES (?, ?, ?, ?)
      `,
      [dto.name, dto.email, dto.password, dto.role ?? "user"],
    );

    return result.insertId;
  }

  async update(id: number, dto: UpdateUserDTO) {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (dto.name !== undefined) {
      fields.push("name = ?");
      params.push(dto.name);
    }
    if (dto.email !== undefined) {
      fields.push("email = ?");
      params.push(dto.email);
    }
    if (dto.password !== undefined) {
      fields.push("password_hash = ?");
      params.push(dto.password);
    }
    if (dto.role !== undefined) {
      fields.push("role = ?");
      params.push(dto.role);
    }
    if (fields.length === 0) return;

    params.push(id);
    await connection.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      params,
    );
  }

  async delete(id: number) {
    await connection.query("DELETE FROM users WHERE id = ?", [id]);
  }
}
