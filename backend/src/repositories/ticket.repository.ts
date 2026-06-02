import { ResultSetHeader, RowDataPacket } from "mysql2";
import { connection } from "../database/connection.js";
import {
  CreateTicketDTO,
  TicketFilterDTO,
  UpdateTicketDTO,
} from "../dtos/ticket/index.js";

export class TicketRepository {
  async findAll(filters: TicketFilterDTO) {
    let query = "SELECT * FROM tickets WHERE is_deleted = FALSE";
    const params: unknown[] = [];

    if (filters.userId) {
      query += " AND user_id = ?";
      params.push(filters.userId);
    }

    if (filters.assignedTo) {
      query += " AND assigned_to = ?";
      params.push(filters.assignedTo);
    }

    if (filters.categoryId) {
      query += " AND category_id = ?";
      params.push(filters.categoryId);
    }

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await connection.query<RowDataPacket[]>(query, params);
    return rows;
  }

  async findById(id: number) {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM tickets WHERE id = ? AND is_deleted = FALSE",
      [id],
    );
    return rows[0] ?? null;
  }

  async create(dto: CreateTicketDTO) {
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO tickets (user_id, category_id, subject, description)
       VALUES (?, ?, ?, ?)`,
      [dto.userId, dto.categoryId ?? null, dto.subject, dto.description],
    );
    return result.insertId;
  }

  async update(id: number, dto: UpdateTicketDTO) {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (dto.assignedTo !== undefined) {
      fields.push("assigned_to = ?");
      params.push(dto.assignedTo);
    }
    if (dto.categoryId !== undefined) {
      fields.push("category_id = ?");
      params.push(dto.categoryId);
    }
    if (dto.subject !== undefined) {
      fields.push("subject = ?");
      params.push(dto.subject);
    }
    if (dto.description !== undefined) {
      fields.push("description = ?");
      params.push(dto.description);
    }
    if (dto.status !== undefined) {
      fields.push("status = ?");
      params.push(dto.status);
    }
    if (fields.length === 0) return;

    params.push(id);
    await connection.query(
      `UPDATE tickets SET ${fields.join(", ")} WHERE id = ?`,
      params,
    );
  }

  async delete(id: number) {
    await connection.query(
      "UPDATE tickets SET is_deleted = TRUE WHERE id = ?",
      [id],
    );
  }
}
