import { useState, useEffect, useCallback } from "react";
import AppLayout from "../../components/AppLayout";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import TicketList from "../../components/TicketList";
import TicketDetail from "../../components/TicketDetail";
import { ticketService } from "../../services/ticket.service";
import { useAuth } from "../../contexts/AuthContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import type { Ticket, ViewState, SidebarFilter } from "../../types";

export default function Home() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [view, setView] = useState<ViewState>("list");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SidebarFilter>("inbox");
  const [statusFilter, setStatusFilter] = useState("");

  const refresh = useCallback(() => {
    ticketService
      .findAll()
      .then(setTickets)
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useWebSocket(
    {
      "ticket:created": refresh,
      "ticket:updated": refresh,
      "ticket:deleted": refresh,
    },
    [refresh],
  );

  const filteredTickets = tickets.filter((t) => {
    if (activeFilter === "resolvidos") {
      if (t.status !== "resolved" && t.status !== "closed") return false;
    } else {
      if (t.status === "resolved" || t.status === "closed") return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = String(t.id).includes(q);
      const matchSubject = t.subject.toLowerCase().includes(q);
      if (!matchId && !matchSubject) return false;
    }

    if (statusFilter && t.status !== statusFilter) return false;

    return true;
  });

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setView("detail");
  };

  const handleBack = () => {
    setView("list");
    setSelectedTicket(null);
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          userName={user?.name}
          userInitials={user?.name?.charAt(0)?.toUpperCase()}
          userRole={user?.role}
        />
      }
      header={
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hideSearch={view === "detail"}
        />
      }
    >
      {view === "list" ? (
        <TicketList
          tickets={filteredTickets}
          setView={handleSelectTicket}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={() => setStatusFilter("")}
        />
      ) : (
        selectedTicket && (
          <TicketDetail ticket={selectedTicket} onBack={handleBack} />
        )
      )}
    </AppLayout>
  );
}
