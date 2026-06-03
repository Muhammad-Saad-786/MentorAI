import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Code2,
  MessageSquare,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Code Editor", icon: Code2, path: "/editor" },
  { label: "AI Mentor", icon: MessageSquare, path: "/mentor" },
  { label: "DSA Practice", icon: Brain, path: "/dsa" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-[260px] bg-white border-r border-[#E8D5C4] flex flex-col h-full"
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#E8D5C4] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center shrink-0">
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1A1A2E] font-['Cabinet_Grotesk',sans-serif] m-0 leading-tight">
              MentorAI
            </h1>
            <p className="text-[11px] text-[#8B8B9E] m-0 leading-tight">
              Your coding companion
            </p>
          </div>
        </div>

        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-[#8B8B9E] hover:bg-[#FFFBF5] rounded-lg transition-colors"
          >
            <LogOut size={20} className="rotate-180" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-none text-sm cursor-pointer transition-all duration-200 mb-1 font-sans ${
                isActive
                  ? "bg-[#FFF3E8] text-[#FF6B35] font-semibold"
                  : "bg-transparent text-[#5C5C6E] font-medium hover:bg-[#FFFBF5] hover:text-[#1A1A2E]"
              }`}
            >
              <item.icon size={20} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B35]"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#E8D5C4]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-none bg-transparent text-[#E74C3C] text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-[#FDEDEC] font-sans">
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </motion.aside>
  );
}
