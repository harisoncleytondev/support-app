import { api } from "./api";

export const userService = {
  findAll() {
    return api("/users");
  },
  update(id: number, data: Record<string, unknown>) {
    return api(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  delete(id: number) {
    return api(`/users/${id}`, { method: "DELETE" });
  },
};
