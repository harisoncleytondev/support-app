export interface CreateTicketReplyDTO {
  ticketId: number;
  userId: number;
  message: string;
}

export interface TicketReplyResponseDTO {
  id: number;
  ticketId: number;
  userId: number;
  message: string;
  createdAt: Date;
}
