import { Inbox, CheckCircle, Plus, FolderKanban, Users } from "lucide-react";
import { useNavigate } from "react-router";
import type { SidebarFilter, UserRole } from "../types";

interface SidebarProps {
  activeFilter: SidebarFilter;
  onFilterChange?: (filter: SidebarFilter) => void;
  onNewTicket?: () => void;
  userName?: string;
  userInitials?: string;
  userRole?: UserRole;
}

const activeClass =
  "w-full text-left px-3 py-1.5 bg-[#F3F4F6] border-l-2 border-[#0256CB] text-[#1F2937] font-medium flex items-center gap-2";
const inactiveClass =
  "w-full text-left px-3 py-1.5 border-l-2 border-transparent text-[#1F2937] hover:bg-gray-50 flex items-center gap-2";

function Sidebar({
  activeFilter,
  onFilterChange,
  onNewTicket,
  userName,
  userInitials,
  userRole,
}: SidebarProps) {
  const navigate = useNavigate();
  const initials = userInitials || userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="w-52 bg-white border-r border-[#D1D5DB] flex flex-col z-20 shrink-0">
      <button
        onClick={() => navigate("/")}
        className="h-12 border-b border-[#D1D5DB] flex items-center px-4 hover:bg-gray-50 w-full text-left"
      >
        <span className="font-semibold text-base tracking-tight text-[#0256CB]">
          DeskPro
        </span>
      </button>

      {userName && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#D1D5DB] bg-[#F9FAFB]">
          <div className="relative flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 font-bold rounded-sm text-xs">
            {initials}
            <div
              className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"
              title="Online"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#1F2937] truncate">
              {userName}
            </p>
            <p className="text-[10px] text-[#6B7280] capitalize">
              {userRole === "admin" ? "Atendente" : "Usuário"}
            </p>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-1">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
            Filtros de Chamados
          </span>
        </div>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => {
                navigate("/");
                onFilterChange?.("inbox");
              }}
              className={activeFilter === "inbox" ? activeClass : inactiveClass}
            >
              <Inbox className="w-4 h-4 text-[#6B7280]" />
              Caixa de Entrada
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                navigate("/");
                onFilterChange?.("resolvidos");
              }}
              className={
                activeFilter === "resolvidos" ? activeClass : inactiveClass
              }
            >
              <CheckCircle className="w-4 h-4 text-[#6B7280]" />
              Resolvidos
            </button>
          </li>
        </ul>

        {userRole === "admin" && (
          <>
            <div className="px-3 mt-4 mb-1">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                Gestão
              </span>
            </div>
            <ul className="space-y-0.5">
              <li>
                <button
                  onClick={() => navigate("/admin/manage-users")}
                  className="w-full text-left px-3 py-1.5 border-l-2 border-transparent text-[#1F2937] hover:bg-gray-50 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-[#6B7280]" />
                  Gerenciar Usuários
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/admin/manage-categories")}
                  className="w-full text-left px-3 py-1.5 border-l-2 border-transparent text-[#1F2937] hover:bg-gray-50 flex items-center gap-2"
                >
                  <FolderKanban className="w-4 h-4 text-[#6B7280]" />
                  Gerenciar Categorias
                </button>
              </li>
            </ul>
          </>
        )}
      </nav>

      {userRole !== "admin" && onNewTicket && (
        <div className="p-3 border-t border-[#D1D5DB]">
          <button
            onClick={onNewTicket}
            className="w-full bg-white border border-[#D1D5DB] hover:bg-[#F3F4F6] text-[#1F2937] font-medium py-1.5 px-3 rounded-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo Chamado
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
