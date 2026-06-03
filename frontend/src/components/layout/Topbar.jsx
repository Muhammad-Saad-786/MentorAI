import { useAuth } from "../../hooks/useAuth";
import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-[64px] bg-white border-b border-[#E8D5C4] flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 relative z-30">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#5C5C6E] hover:bg-[#FFFBF5] transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search */}
        <div className="relative hidden md:block w-[240px] lg:w-[360px]">
          <Search
            size={18}
            color="#8B8B9E"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search your code history..."
            className="w-full bg-[#FFFBF5] border border-[#E8D5C4] rounded-lg py-2 pl-10 pr-4 text-[13px] text-[#1A1A2E] outline-none font-sans transition-colors focus:border-[#FF6B35]"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-lg border border-[#E8D5C4] bg-white flex items-center justify-center cursor-pointer transition-colors hover:bg-[#FFFBF5] relative">
          <Bell size={18} color="#5C5C6E" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E74C3C]" />
        </button>

        {/* User Profile */}
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg border border-[#E8D5C4] bg-white cursor-pointer transition-colors hover:bg-[#FFFBF5] font-sans"
        >
          <div className="w-8 h-8 rounded-md bg-[#FF6B35] flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <span className="hidden sm:block text-[13px] font-semibold text-[#1A1A2E]">
            {user?.name || "User"}
          </span>
          <ChevronDown size={14} color="#8B8B9E" className="hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
