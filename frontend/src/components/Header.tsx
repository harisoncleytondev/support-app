import { Search, ChevronDown, LogOut } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  hideSearch?: boolean;
}

function Header({
  searchQuery = "",
  onSearchChange,
  hideSearch = false,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement !== inputRef.current &&
        !hideSearch
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hideSearch]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-12 bg-white border-b border-[#D1D5DB] flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center w-full max-w-md">
        {!hideSearch && (
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-2 top-1.5" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Pesquisar ID, assunto ou cliente... (Pressione /)"
              className="w-full pl-8 pr-2 py-1 text-sm border border-[#D1D5DB] rounded-sm focus:outline-none focus:border-[#0256CB] focus:ring-1 focus:ring-[#0256CB] placeholder-[#6B7280]"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="relative flex items-center gap-2 pl-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-sm px-1 py-0.5"
          >
            <div className="relative flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 font-bold rounded-sm text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
              <div
                className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"
                title="Online"
              />
            </div>
            <span className="font-medium text-xs">
              {user?.name ?? "Usuário"}
            </span>
            <ChevronDown className="w-3 h-3 text-[#6B7280]" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#D1D5DB] rounded-sm shadow-sm z-20">
                <div className="px-3 py-2 border-b border-[#D1D5DB]">
                  <p className="text-xs font-medium text-[#1F2937]">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-[#6B7280]">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#6B7280] hover:bg-gray-50 hover:text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
