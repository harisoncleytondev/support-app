import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "../services/auth.service";
import { api } from "../services/api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      api("/auth/me")
        .then((data: any) => {
          setUser(data);
          saveUser(data);
        })
        .catch(() => {
          authService.logout();
          saveUser(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    const me = await api("/auth/me");
    setUser(me);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    await authService.register(name, email, password);
    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("Erro ao usar authcontext.");
  return ctx;
};
