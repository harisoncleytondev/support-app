import { api } from "./api";

export const authService = {
  async login(email: string, password: string) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  },

  async register(name: string, email: string, password: string) {
    return api("/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  async refresh() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Sem refresh token");
    const data = await api("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  },

  async logout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await api("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        /* */
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken() {
    return localStorage.getItem("accessToken");
  },

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },
};
