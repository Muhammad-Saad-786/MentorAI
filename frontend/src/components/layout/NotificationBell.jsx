import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  Flame,
  Trophy,
  MessageSquare,
  Code2,
  BarChart3,
  Info,
} from "lucide-react";
import { notificationApi } from "../../services/notificationApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const iconMap = {
  Flame: Flame,
  Trophy: Trophy,
  MessageSquare: MessageSquare,
  Code2: Code2,
  BarChart3: BarChart3,
};

const iconColors = {
  streak: "#FF6B35",
  achievement: "#F39C12",
  mentor_reply: "#3498DB",
  problem_solved: "#2ECC71",
  weekly_report: "#9B59B6",
  system: "#5C5C6E",
};

export default function NotificationBell() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      loadNotifications();
      // Poll every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationApi.getAll();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      // Silent fail
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await notificationApi.markAsRead(notification._id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n,
          ),
        );
      } catch (error) {
        /* silent */
      }
    }
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  const IconComponent = (iconName) => {
    const Comp = iconMap[iconName] || Info;
    return Comp;
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: "1px solid #E8D5C4",
          backgroundColor: isOpen ? "#FFFBF5" : "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.target.style.backgroundColor = "#FFFBF5";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.target.style.backgroundColor = "#FFFFFF";
        }}
      >
        <Bell size={18} color={unreadCount > 0 ? "#FF6B35" : "#5C5C6E"} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#E74C3C",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: 380,
              maxHeight: 480,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8D5C4",
              borderRadius: 16,
              boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
              overflow: "hidden",
              zIndex: 200,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: "1px solid #E8D5C4",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={16} color="#FF6B35" />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1A1A2E",
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                  }}
                >
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      background: "#FFF3E8",
                      color: "#FF6B35",
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontWeight: 700,
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#FF6B35",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div style={{ overflow: "auto", maxHeight: 380 }}>
              {notifications.length > 0 ? (
                notifications.map((notif) => {
                  const IconComp = IconComponent(notif.icon);
                  return (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => handleNotificationClick(notif)}
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: "12px 18px",
                        borderBottom: "1px solid #E8D5C4",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        backgroundColor: notif.isRead ? "#FFFFFF" : "#FFFBF5",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FFF3E8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = notif.isRead
                          ? "#FFFFFF"
                          : "#FFFBF5")
                      }
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor:
                            (iconColors[notif.type] || "#5C5C6E") + "15",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <IconComp
                          size={18}
                          color={iconColors[notif.type] || "#5C5C6E"}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: notif.isRead ? "#5C5C6E" : "#1A1A2E",
                              margin: 0,
                              flex: 1,
                            }}
                          >
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "#FF6B35",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#8B8B9E",
                            margin: "2px 0 0 0",
                            lineHeight: 1.4,
                          }}
                        >
                          {notif.message}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "#8B8B9E",
                            margin: "4px 0 0 0",
                          }}
                        >
                          {formatTime(notif.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div
                  style={{ textAlign: "center", padding: 40, color: "#8B8B9E" }}
                >
                  <Bell
                    size={36}
                    color="#E8D5C4"
                    style={{ marginBottom: 12 }}
                  />
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                    No notifications yet
                  </p>
                  <p style={{ fontSize: 12, margin: "4px 0 0 0" }}>
                    We'll notify you when something happens
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
