import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ticketService } from "../../services/ticket.service";
import { categoryService } from "../../services/category.service";
import { useAuth } from "../../contexts/AuthContext";
import AppLayout from "../../components/AppLayout";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import type { Category } from "../../types";

function NewTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subject, setSubject] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    categoryService
      .findAll()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!subject || !description) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await ticketService.create({
        subject,
        description,
        categoryId: categoryId || undefined,
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar chamado");
    }
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar
          activeFilter="inbox"
          userName={user?.name}
          userInitials={user?.name?.charAt(0)?.toUpperCase()}
          userRole={user?.role}
        />
      }
      header={<Header searchQuery="" onSearchChange={() => {}} hideSearch />}
    >
      <div className="absolute inset-0 bg-white overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-base font-semibold text-[#1F2937] mb-1">
            Novo Chamado
          </h1>
          <p className="text-xs text-[#6B7280] mb-6">
            Preencha os dados abaixo para abrir um novo chamado de suporte.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                Assunto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Resumo do problema"
                required
                className="w-full px-2 py-1.5 text-sm border border-[#D1D5DB] rounded-sm focus:outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] placeholder-[#6B7280]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value ? Number(e.target.value) : "")
                }
                required
                className="w-full px-2 py-1.5 text-sm border border-[#D1D5DB] rounded-sm focus:outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] bg-white"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2 min-h-[160px] border border-[#D1D5DB] rounded-sm focus:outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] resize-y"
                placeholder="Descreva detalhadamente o problema ou solicitação..."
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-1.5 text-sm text-[#6B7280] hover:text-[#1F2937] border border-[#D1D5DB] rounded-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#0256CB] hover:bg-[#0143A3] text-white text-sm font-semibold py-1.5 px-6 rounded-sm transition-colors shadow-sm"
              >
                Abrir Chamado
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default NewTicket;
