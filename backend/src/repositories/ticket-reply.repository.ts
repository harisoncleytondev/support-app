import { ResultSetHeader, RowDataPacket } from "mysql2";
import { connection } from "../database/connection.js";
import { CreateTicketReplyDTO } from "../dtos/ticket-reply/index.js";

export class TicketReplyRepository {
  async findByTicketId(ticketId: number) {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM ticket_replies WHERE ticket_id = ? AND is_deleted = FALSE ORDER BY created_at ASC",
      [ticketId],
    );
    return rows;
  }

  async create(dto: CreateTicketReplyDTO) {
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO ticket_replies (ticket_id, user_id, message) VALUES (?, ?, ?)",
      [dto.ticketId, dto.userId, dto.message],
    );
    return result.insertId;
  }
}
