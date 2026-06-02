import { useState, useEffect } from "react";
import { Plus, Trash2, Shield, UserCog } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/user.service";
import type { SidebarFilter, User } from "../../types";

export default function GerenciarUsuarios() {
  const { user } = useAuth();
  const [activeFilter] = useState<SidebarFilter>("inbox");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userService
      .findAll()
      .then(setUsers)
      .catch(() => {});
  }, []);

  const toggleRole = async (userId: number, currentRole: string) => {
    try {
      await userService.update(userId, {
        role: currentRole === "admin" ? "user" : "admin",
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role: u.role === "admin" ? "user" : "admin" }
            : u,
        ),
      );
    } catch {}
  };

  const handleDelete = async (userId: number) => {
    try {
      await userService.delete(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
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
                Gerenciar Usuários
              </h1>
              <p className="text-xs text-[#6B7280]">
                {users.length} usuário(s) cadastrado(s)
              </p>
            </div>
            <button
              onClick={() => window.open("/register", "_self")}
              className="bg-[#0256CB] hover:bg-[#0143A3] text-white text-xs font-semibold py-1.5 px-3 rounded-sm transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Novo Usuário
            </button>
          </div>

          <div className="border border-[#D1D5DB] rounded-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F3F4F6] border-b border-[#D1D5DB]">
                <tr>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    Usuário
                  </th>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    E-mail
                  </th>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    Função
                  </th>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280] w-20">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-sm flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1F2937]">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#6B7280]">{u.email}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-sm border ${u.role === "admin" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                      >
                        {u.role === "admin" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <UserCog className="w-3 h-3" />
                        )}
                        {u.role === "admin" ? "Admin" : "Usuário"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleRole(u.id, u.role)}
                          disabled={u.id === user?.id}
                          className="px-2 py-1 text-[10px] font-medium text-[#6B7280] border border-[#D1D5DB] rounded-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {u.role === "admin" ? "Rebaixar" : "Promover"}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={u.id === user?.id}
                          className="p-1 text-[#6B7280] hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
