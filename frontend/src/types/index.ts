export type ViewState = "list" | "detail";
export type SidebarFilter = "inbox" | "resolvidos";
export type UserRole = "admin" | "user";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Ticket {
  id: number;
  userId: number;
  assignedTo: number | null;
  categoryId: number | null;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt?: string;
}
