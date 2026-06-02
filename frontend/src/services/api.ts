const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapKeys(o: any): any {
  if (Array.isArray(o)) return o.map(mapKeys);
  if (o && typeof o === "object") {
    const r: any = {};
    for (const k of Object.keys(o)) r[toCamel(k)] = mapKeys(o[k]);
    return r;
  }
  return o;
}

export async function api(path: string, options: any = {}) {
  let headers = { "Content-Type": "application/json", ...options.headers };
  const token = localStorage.getItem("accessToken");
  if (token) headers["Authorization"] = "Bearer " + token;

  let res = await fetch(BASE + path, { ...options, headers });

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshRes = await fetch(BASE + "/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const d = await refreshRes.json();
        localStorage.setItem("accessToken", d.accessToken);
        headers["Authorization"] = "Bearer " + d.accessToken;
        res = await fetch(BASE + path, { ...options, headers });
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  }

  if (res.status === 204) return;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro na requisição");
  return mapKeys(data);
}
