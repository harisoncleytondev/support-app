import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Ticket } from "../types";

interface TicketListProps {
  tickets: Ticket[];
  setView: (ticket: Ticket) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const statusLabel: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  resolved: "Resolvido",
  closed: "Fechado",
};

const selectDenseClass =
  "px-1.5 py-0.5 text-xs border border-[#D1D5DB] rounded-none bg-white w-full focus:outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] pr-6";

function TicketList({
  tickets,
  setView,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}: TicketListProps) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white z-10">
      <div className="bg-[#F3F4F6] border-b border-[#D1D5DB] p-2 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1F2937] ml-1 mr-2">
            Filtros:
          </span>

          <select
            className={`${selectDenseClass} w-auto`}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="">Status: Abertos & Em Andamento</option>
            <option value="todos">Status: Todos</option>
          </select>

          <button
            className="px-2 py-1 text-[#0256CB] hover:underline"
            onClick={onClearFilters}
          >
            Limpar filtros
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#6B7280]">
          <span>
            Mostrando 1-{tickets.length} de {tickets.length}
          </span>
          <div className="flex">
            <button
              className="p-1 border border-[#D1D5DB] bg-white rounded-l-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={tickets.length <= 5}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1 border-t border-b border-r border-[#D1D5DB] bg-white rounded-r-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={tickets.length <= 5}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-[#F3F4F6] sticky top-0 z-10 border-b border-[#D1D5DB] shadow-[0_1px_0_0_#D1D5DB]">
            <tr>
              <th className="px-2 py-1.5 font-semibold text-xs text-[#6B7280] w-16">
                ID
              </th>
              <th className="px-2 py-1.5 font-semibold text-xs text-[#6B7280]">
                Status
              </th>
              <th className="px-2 py-1.5 font-semibold text-xs text-[#6B7280]">
                Assunto
              </th>
              <th className="px-2 py-1.5 font-semibold text-xs text-[#6B7280]">
                Data Criação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs">
            {tickets.map((ticket) => {
              const isResolved =
                ticket.status === "resolved" || ticket.status === "closed";
              return (
                <tr
                  key={ticket.id}
                  className="hover:bg-[#F8FAFC] cursor-pointer"
                  onClick={() => setView(ticket)}
                >
                  <td className="px-2 py-1 font-medium text-[#0256CB] hover:underline">
                    {ticket.id}
                  </td>
                  <td className="px-2 py-1">
                    <div
                      className={`flex items-center gap-1.5 ${isResolved ? "text-[#6B7280]" : "text-[#1F2937]"}`}
                    >
                      <span
                        className={`text-[10px] ${isResolved ? "text-gray-400" : "text-gray-500"}`}
                      >
                        ●
                      </span>
                      {statusLabel[ticket.status] || ticket.status}
                    </div>
                  </td>
                  <td
                    className={`px-2 py-1 max-w-xs truncate font-medium ${isResolved ? "text-[#6B7280] line-through font-normal" : "text-[#1F2937]"}`}
                  >
                    {ticket.subject}
                  </td>
                  <td className="px-2 py-1 text-[#6B7280]">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                </tr>
              );
            })}
            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-2 py-8 text-center text-[#6B7280]"
                >
                  Nenhum chamado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketList;
