import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
      <div className="bg-white border border-[#D1D5DB] rounded-sm shadow-sm p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <span className="font-semibold text-2xl tracking-tight text-[#0256CB]">
            DeskPro
          </span>
          <p className="text-xs text-[#6B7280] mt-1">Sistema de Suporte</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#D1D5DB] rounded-sm px-3 py-2 text-sm outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] placeholder-[#6B7280]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#D1D5DB] rounded-sm px-3 py-2 text-sm outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] placeholder-[#6B7280]"
          />

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            className="bg-[#0256CB] hover:bg-[#0143A3] text-white text-sm font-medium py-2 rounded-sm transition cursor-pointer"
          >
            Entrar
          </button>
        </form>

        <p className="text-xs text-center text-[#6B7280] mt-4">
          Não tem conta?{" "}
          <Link to="/register" className="text-[#0256CB] hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
