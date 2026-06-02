export interface CreateTicketDTO {
  userId: number;
  categoryId?: number;
  subject: string;
  description: string;
}

export interface UpdateTicketDTO {
  assignedTo?: number;
  categoryId?: number;
  subject?: string;
  description?: string;
  status?: "open" | "in_progress" | "resolved" | "closed";
}

export interface TicketFilterDTO {
  userId?: number;
  assignedTo?: number;
  categoryId?: number;
  status?: "open" | "in_progress" | "resolved" | "closed";
}

export interface TicketResponseDTO {
  id: number;
  userId: number;
  assignedTo: number | null;
  categoryId: number | null;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
}
