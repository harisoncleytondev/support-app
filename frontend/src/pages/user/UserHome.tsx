import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Send, User } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { ticketService } from "../../services/ticket.service";
import { ticketReplyService } from "../../services/ticket-reply.service";
import { useAuth } from "../../contexts/AuthContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import type { SidebarFilter, Ticket } from "../../types";

interface Reply {
  id: number;
  ticketId: number;
  userId: number;
  userName?: string;
  message: string;
  createdAt: string;
}

const statusLabel: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  resolved: "Resolvido",
  closed: "Fechado",
};

function fmt(d: string | undefined) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleString("pt-BR");
  } catch {
    return "-";
  }
}

function UserHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [activeFilter, setActiveFilter] = useState<SidebarFilter>("inbox");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [message, setMessage] = useState("");

  const refresh = useCallback(() => {
    if (user) {
      ticketService
        .findAll({ userId: user.id })
        .then(setTickets)
        .catch(() => {});
    }
  }, [user]);

  const selectedIdRef = useRef(selected?.id);
  selectedIdRef.current = selected?.id;

  useEffect(() => {
    refresh();
  }, [refresh]);

  useWebSocket(
    {
      "ticket:created": refresh,
      "ticket:updated": refresh,
      "ticket:deleted": refresh,
      "reply:created": (data: any) => {
        if (data.ticketId === selectedIdRef.current) {
          setReplies((prev) =>
            prev.some((r) => r.id === data.id) ? prev : [...prev, data],
          );
        }
      },
    },
    [refresh],
  );

  useEffect(() => {
    if (selected) {
      ticketReplyService
        .findByTicketId(selected.id)
        .then(setReplies)
        .catch(() => {});
    }
  }, [selected?.id]);

  const handleSendReply = async () => {
    if (!message.trim() || !selected) return;
    try {
      const reply = await ticketReplyService.create({
        ticketId: selected.id,
        message: message.trim(),
      });
      setReplies((prev) =>
        prev.some((r) => r.id === reply.id) ? prev : [...prev, reply],
      );
      setMessage("");
    } catch {
      /* */
    }
  };

  const filteredTickets =
    activeFilter === "resolvidos"
      ? tickets.filter((t) => t.status === "resolved" || t.status === "closed")
      : tickets;

  const abertos = tickets.filter(
    (t) => t.status === "open" || t.status === "in_progress",
  );
  const resolvidos = tickets.filter(
    (t) => t.status === "resolved" || t.status === "closed",
  );

  if (selected) {
    return (
      <div className="absolute inset-0 bg-white flex flex-col z-30">
        <div className="h-14 bg-white border-b border-[#D1D5DB] flex items-center px-4 shrink-0 gap-3">
          <button
            onClick={() => setSelected(null)}
            className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-100 rounded-sm border border-transparent hover:border-[#D1D5DB]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-[#D1D5DB]" />
          <span className="text-xs text-[#6B7280] font-medium">
            #{selected.id}
          </span>
          <span
            className={`text-[11px] px-1.5 py-0.5 font-medium ${selected.status === "resolved" || selected.status === "closed" ? "text-[#6B7280]" : "text-[#1F2937]"}`}
          >
            {statusLabel[selected.status]}
          </span>
          <span className="text-xs text-[#6B7280] ml-auto">
            {selected.createdAt}
          </span>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-[#1F2937] mb-1">
              {selected.subject}
            </h2>
            <p className="text-xs text-[#6B7280] mb-4">
              Criado por {user?.name}
            </p>
            <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-sm p-4">
              <p className="text-sm text-[#1F2937] whitespace-pre-wrap">
                {selected.description}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <div className="w-7 h-7 bg-gray-100 text-gray-500 rounded-sm flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#1F2937]">
                      {reply.userName || `Usuário #${reply.userId}`}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">
                      {fmt(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs mt-1 whitespace-pre-wrap text-[#1F2937]">
                    {reply.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#D1D5DB] p-3 bg-white shrink-0">
          {selected.status === "resolved" || selected.status === "closed" ? (
            <p className="text-xs text-[#6B7280] text-center py-2">
              Ticket {selected.status === "resolved" ? "resolvido" : "fechado"}{" "}
              — não é possível enviar mensagens
            </p>
          ) : (
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
                placeholder="Digite sua resposta..."
                rows={2}
                className="flex-1 border border-[#D1D5DB] rounded-sm px-3 py-2 text-xs outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] resize-none"
              />
              <button
                onClick={handleSendReply}
                disabled={!message.trim()}
                className="bg-[#0256CB] hover:bg-[#0143A3] disabled:bg-gray-300 text-white px-3 py-2 rounded-sm text-xs flex items-center gap-1 transition-colors"
              >
                <Send className="w-3 h-3" /> Enviar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      sidebar={
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onNewTicket={() => navigate("/new-ticket")}
          userName={user?.name}
          userInitials={user?.name?.charAt(0)?.toUpperCase()}
          userRole={user?.role}
        />
      }
      header={<Header searchQuery="" onSearchChange={() => {}} hideSearch />}
    >
      <div className="absolute inset-0 bg-[#F3F4F6] overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-base font-semibold text-[#1F2937]">
              Olá, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Bem-vindo ao DeskPro
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-[#D1D5DB] rounded-sm p-4">
              <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Total
              </p>
              <p className="text-2xl font-bold text-[#1F2937] mt-1">
                {tickets.length}
              </p>
            </div>
            <div className="bg-white border border-[#D1D5DB] rounded-sm p-4">
              <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Abertos
              </p>
              <p className="text-2xl font-bold text-[#1F2937] mt-1">
                {abertos.length}
              </p>
            </div>
            <div className="bg-white border border-[#D1D5DB] rounded-sm p-4">
              <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Resolvidos
              </p>
              <p className="text-2xl font-bold text-[#1F2937] mt-1">
                {resolvidos.length}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#D1D5DB] rounded-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#D1D5DB]">
              <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                Meus Chamados
              </h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F3F4F6] border-b border-[#D1D5DB]">
                <tr>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    ID
                  </th>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    Assunto
                  </th>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    Status
                  </th>
                  <th className="px-3 py-2 font-semibold text-xs text-[#6B7280]">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs">
                {filteredTickets.map((t) => {
                  const isResolved =
                    t.status === "resolved" || t.status === "closed";
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-[#F8FAFC] cursor-pointer"
                      onClick={() => setSelected(t)}
                    >
                      <td className="px-3 py-2 font-medium text-[#0256CB]">
                        {t.id}
                      </td>
                      <td className="px-3 py-2 text-[#1F2937] max-w-xs truncate">
                        {t.subject}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`flex items-center gap-1 ${isResolved ? "text-[#6B7280]" : "text-[#1F2937]"}`}
                        >
                          <span
                            className={`text-[10px] ${isResolved ? "text-gray-400" : "text-gray-500"}`}
                          >
                            ●
                          </span>
                          {statusLabel[t.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[#6B7280]">
                        {t.createdAt}
                      </td>
                    </tr>
                  );
                })}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-8 text-center text-[#6B7280]"
                    >
                      Nenhum chamado encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default UserHome;
