import { useState, useEffect } from "react";
import { Plus, Trash2, FolderKanban } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { categoryService } from "../../services/category.service";
import type { SidebarFilter, Category } from "../../types";

export default function GerenciarCategorias() {
  const { user } = useAuth();
  const [activeFilter] = useState<SidebarFilter>("inbox");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    categoryService
      .findAll()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      const newCat = await categoryService.create({
        name,
        description: description || undefined,
      });
      setCategories((prev) => [...prev, newCat]);
      setName("");
      setDescription("");
      setShowForm(false);
    } catch {}
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {}
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar
          activeFilter={activeFilter}
          userRole={user?.role}
          userName={user?.name}
          userInitials={user?.name?.charAt(0)?.toUpperCase()}
        />
      }
      header={<Header hideSearch />}
    >
      <div className="absolute inset-0 bg-white overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-base font-semibold text-[#1F2937] mb-1">
                Gerenciar Categorias
              </h1>
              <p className="text-xs text-[#6B7280]">
                {categories.length} categoria(s) cadastrada(s)
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#0256CB] hover:bg-[#0143A3] text-white text-xs font-semibold py-1.5 px-3 rounded-sm transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Nova Categoria
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAdd}
              className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-sm p-4 mb-6 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome da categoria"
                    className="w-full px-2 py-1.5 text-sm border border-[#D1D5DB] rounded-sm focus:outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] placeholder-[#6B7280]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição opcional"
                    className="w-full px-2 py-1.5 text-sm border border-[#D1D5DB] rounded-sm focus:outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] placeholder-[#6B7280]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 text-xs text-[#6B7280] border border-[#D1D5DB] rounded-sm hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#0256CB] hover:bg-[#0143A3] text-white text-xs font-semibold py-1.5 px-3 rounded-sm transition-colors shadow-sm"
                >
                  Adicionar
                </button>
              </div>
            </form>
          )}

          <div className="border border-[#D1D5DB] rounded-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F3F4F6] border-b border-[#D1D5DB]">
                <tr>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    Categoria
                  </th>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    Descrição
                  </th>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280] w-16">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-amber-100 text-amber-700 rounded-sm flex items-center justify-center font-bold text-xs">
                          <FolderKanban className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[#1F2937]">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#6B7280]">
                      {c.description || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 text-[#6B7280] hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
