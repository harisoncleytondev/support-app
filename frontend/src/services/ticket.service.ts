import { api } from "./api";

export const ticketService = {
  findAll(filters: Record<string, string | number> = {}) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== "") params.set(k, String(v));
    }
    const qs = params.toString();
    return api(`/tickets${qs ? `?${qs}` : ""}`);
  },

  findById(id: number) {
    return api(`/tickets/${id}`);
  },

  create(data: Record<string, unknown>) {
    return api("/tickets", { method: "POST", body: JSON.stringify(data) });
  },

  update(id: number, data: Record<string, unknown>) {
    return api(`/tickets/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },

  delete(id: number) {
    return api(`/tickets/${id}`, { method: "DELETE" });
  },
};
