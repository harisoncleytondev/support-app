import { useState, useEffect } from "react";
import { ArrowLeft, Send, User, ShieldCheck } from "lucide-react";
import { ticketService } from "../services/ticket.service";
import { ticketReplyService } from "../services/ticket-reply.service";
import { useAuth } from "../contexts/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";
import type { Ticket } from "../types";

interface TicketDetailProps {
  ticket: Ticket;
  onBack: () => void;
}

interface Reply {
  id: number;
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

export default function TicketDetail({ ticket, onBack }: TicketDetailProps) {
  const { user } = useAuth();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(ticket.status);

  useEffect(() => {
    ticketReplyService
      .findByTicketId(ticket.id)
      .then(setReplies)
      .catch(() => {});
  }, [ticket.id]);

  useWebSocket(
    {
      "reply:created": (data: any) => {
        if (data.ticketId === ticket.id) {
          setReplies((prev) =>
            prev.some((r) => r.id === data.id) ? prev : [...prev, data],
          );
        }
      },
      "ticket:updated": (data: any) => {
        if (data.id === ticket.id) {
          setStatus(data.status);
        }
      },
    },
    [ticket.id],
  );

  const handleSendReply = async () => {
    if (!message.trim()) return;
    try {
      const reply = await ticketReplyService.create({
        ticketId: ticket.id,
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

  const handleStatusChange = async (s: string) => {
    try {
      await ticketService.update(ticket.id, { status: s });
      setStatus(s as typeof ticket.status);
    } catch {
      /* */
    }
  };

  const isAdmin = user?.role === "admin";
  const closedStatus = status === "resolved" || status === "closed";

  return (
    <div className="absolute inset-0 bg-white flex flex-col">
      <div className="h-14 bg-white border-b border-[#D1D5DB] flex items-center px-4 gap-3 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-100 rounded-sm border border-transparent hover:border-[#D1D5DB]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="h-6 w-px bg-[#D1D5DB]" />
        <span className="text-xs text-[#6B7280] font-medium">#{ticket.id}</span>
        <span className="text-xs font-semibold text-[#1F2937] truncate">
          {ticket.subject}
        </span>
        <span
          className={`text-[11px] px-1.5 py-0.5 font-medium ${status === "resolved" || status === "closed" ? "text-[#6B7280]" : "text-[#1F2937]"}`}
        >
          {statusLabel[status] || status}
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 border-r border-[#D1D5DB] p-4 shrink-0 overflow-auto bg-white">
          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
            Solicitante
          </h3>
          <p className="text-sm font-medium text-[#1F2937]">
            Usuário #{ticket.userId}
          </p>

          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mt-4 mb-2">
            Detalhes
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-[#6B7280] mb-0.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-1.5 py-1 text-xs border border-[#D1D5DB] rounded-sm focus:outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB]"
              >
                <option value="open">Aberto</option>
                <option value="in_progress">Em andamento</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#6B7280] mb-0.5">
                Categoria
              </label>
              <p className="font-medium text-[#1F2937]">
                {ticket.categoryId ? `#${ticket.categoryId}` : "—"}
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#6B7280] mb-0.5">
                Atribuído para
              </label>
              <p className="font-medium text-[#1F2937]">
                {ticket.assignedTo ? `#${ticket.assignedTo}` : "—"}
              </p>
            </div>
          </div>

          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mt-4 mb-2">
            Datas
          </h3>
          <div className="text-xs space-y-1">
            <p className="text-[#1F2937]">
              <span className="text-[#6B7280]">Criado:</span>{" "}
              {fmt(ticket.createdAt)}
            </p>
            <p className="text-[#1F2937]">
              <span className="text-[#6B7280]">Atualizado:</span>{" "}
              {fmt(ticket.updatedAt)}
            </p>
          </div>

          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mt-4 mb-2">
            Descrição
          </h3>
          <p className="text-xs whitespace-pre-wrap bg-[#F3F4F6] p-3 rounded-sm border border-[#D1D5DB] text-[#1F2937]">
            {ticket.description}
          </p>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-[#F3F4F6]">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <div className="w-7 h-7 bg-gray-100 text-gray-500 rounded-sm flex items-center justify-center shrink-0 mt-0.5">
                  {isAdmin ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
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
            {replies.length === 0 && (
              <p className="text-xs text-[#6B7280] text-center py-8">
                Nenhuma resposta ainda
              </p>
            )}
          </div>

          <div className="bg-white border-t border-[#D1D5DB] p-3 shrink-0">
            {closedStatus ? (
              <p className="text-xs text-[#6B7280] text-center py-2">
                Ticket {status === "resolved" ? "resolvido" : "fechado"} — não é
                possível enviar mensagens
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
      </div>
    </div>
  );
}
