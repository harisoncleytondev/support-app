import { api } from "./api";

export const categoryService = {
  findAll() {
    return api("/categories");
  },
  create(data: Record<string, unknown>) {
    return api("/categories", { method: "POST", body: JSON.stringify(data) });
  },
  update(id: number, data: Record<string, unknown>) {
    return api(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete(id: number) {
    return api(`/categories/${id}`, { method: "DELETE" });
  },
};
