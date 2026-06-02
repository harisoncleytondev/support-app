import { ResultSetHeader, RowDataPacket } from "mysql2";
import { connection } from "../database/connection.js";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../dtos/category/index.js";

export class CategoryRepository {
  async findAll() {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE is_deleted = FALSE",
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE id = ? AND is_deleted = FALSE",
      [id],
    );
    return rows[0] ?? null;
  }

  async findByName(name: string) {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE name = ? AND is_deleted = FALSE",
      [name],
    );
    return rows[0] ?? null;
  }

  async create(dto: CreateCategoryDTO) {
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [dto.name, dto.description ?? null],
    );
    return result.insertId;
  }

  async update(id: number, dto: UpdateCategoryDTO) {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (dto.name !== undefined) {
      fields.push("name = ?");
      params.push(dto.name);
    }
    if (dto.description !== undefined) {
      fields.push("description = ?");
      params.push(dto.description);
    }
    if (fields.length === 0) return;

    params.push(id);
    await connection.query(
      `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`,
      params,
    );
  }

  async delete(id: number) {
    await connection.query(
      "UPDATE categories SET is_deleted = TRUE WHERE id = ?",
      [id],
    );
  }
}
