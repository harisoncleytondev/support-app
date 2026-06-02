import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Preencha todos os campos");
      return;
    }

    if (password !== confirm) {
      setError("Senhas não conferem");
      return;
    }

    if (password.length < 4) {
      setError("Senha deve ter no mínimo 4 caracteres");
      return;
    }

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
      <div className="bg-white border border-[#D1D5DB] rounded-sm shadow-sm p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <span className="font-semibold text-2xl tracking-tight text-[#0256CB]">
            DeskPro
          </span>
          <p className="text-xs text-[#6B7280] mt-1">Criar nova conta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-[#D1D5DB] rounded-sm px-3 py-2 text-sm outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] placeholder-[#6B7280]"
          />
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
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="border border-[#D1D5DB] rounded-sm px-3 py-2 text-sm outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] placeholder-[#6B7280]"
          />

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            className="bg-[#0256CB] hover:bg-[#0143A3] text-white text-sm font-medium py-2 rounded-sm transition cursor-pointer"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-xs text-center text-[#6B7280] mt-4">
          Já tem conta?{" "}
          <Link to="/login" className="text-[#0256CB] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
