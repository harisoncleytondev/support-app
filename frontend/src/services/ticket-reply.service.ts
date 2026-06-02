import { api } from "./api";

export const ticketReplyService = {
  findByTicketId(ticketId: number) {
    return api(`/ticket-replies/${ticketId}`);
  },
  create(data: Record<string, unknown>) {
    return api("/ticket-replies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
