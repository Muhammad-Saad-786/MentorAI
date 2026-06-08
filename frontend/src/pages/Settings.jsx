import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import {
  User,
  Mail,
  Lock,
  Shield,
  LogOut,
  Bell,
  Save,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Camera,
  Key,
  Globe,
  Trash2,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile
  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Appearance
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSavingProfile(true);
    try {
      await api.put("/auth/profile", { name });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveNotifications = () => {
    setSavingNotifications(true);
    setTimeout(() => {
      toast.success("Notification preferences saved!");
      setSavingNotifications(false);
    }, 500);
  };

  const handleLogout = () => {
    toast.success("Logged out");
    logout();
    navigate("/login");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Sun },
  ];

  const ToggleSwitch = ({ state, setter }) => (
    <button
      onClick={() => setter(!state)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        border: "none",
        backgroundColor: state ? "#2ECC71" : "#E8D5C4",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ left: state ? 23 : 3 }}
        transition={{ duration: 0.2 }}
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          position: "absolute",
          top: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="settings-page"
    >
      {/* Header */}
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-layout">
        {/* Mobile Tab Selector */}
        <div className="settings-mobile-tabs">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="settings-mobile-tab-btn"
          >
            {tabs.find((t) => t.id === activeTab)?.label || "Profile"}
            <Menu size={18} />
          </button>
          {mobileMenuOpen && (
            <div className="settings-mobile-dropdown">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`settings-mobile-dropdown-item ${activeTab === tab.id ? "active" : ""}`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
              <div className="settings-mobile-dropdown-divider" />
              <button
                onClick={handleLogout}
                className="settings-mobile-dropdown-item danger"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Tabs */}
        <div className="settings-sidebar">
          <Card padding="12px">
            <nav className="settings-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-nav-item ${activeTab === tab.id ? "active" : ""}`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </nav>
          </Card>
          <Card
            padding="16px"
            style={{ marginTop: 12, borderColor: "#E74C3C" }}
          >
            <p className="settings-danger-title">Danger Zone</p>
            <button onClick={handleLogout} className="settings-danger-btn">
              <LogOut size={16} /> Sign Out
            </button>
            <button
              onClick={() => toast.error("Not available yet")}
              className="settings-danger-btn-secondary"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card padding="24px">
                <h3 className="settings-section-title">
                  <User size={20} color="#FF6B35" /> Profile Information
                </h3>
                <div className="settings-avatar-row">
                  <div className="settings-avatar-wrap">
                    <div className="settings-avatar">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <button className="settings-avatar-camera">
                      <Camera size={14} color="#5C5C6E" />
                    </button>
                  </div>
                  <div>
                    <p className="settings-avatar-name">{user?.name}</p>
                    <p className="settings-avatar-email">{user?.email}</p>
                    {user?.isVerified ? (
                      <span className="settings-badge-verified">
                        <CheckCircle2 size={12} color="#2ECC71" /> Verified
                      </span>
                    ) : (
                      <span className="settings-badge-unverified">
                        <AlertCircle size={12} color="#F39C12" /> Not Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="settings-form">
                  <Input
                    label="Full Name"
                    icon={User}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                  <Input
                    label="Email Address"
                    icon={Mail}
                    value={user?.email || ""}
                    disabled
                  />
                  <div className="settings-form-actions">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                    >
                      <Save size={18} />{" "}
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setName(user?.name || "")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card padding="24px" style={{ marginBottom: 16 }}>
                <h3 className="settings-section-title">
                  <Key size={20} color="#FF6B35" /> Change Password
                </h3>
                <div className="settings-form">
                  <Input
                    label="Current Password"
                    type="password"
                    icon={Lock}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    icon={Lock}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    icon={Lock}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                  <Button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    variant="secondary"
                  >
                    <Shield size={18} />{" "}
                    {changingPassword ? "Changing..." : "Update Password"}
                  </Button>
                </div>
              </Card>
              <Card padding="24px">
                <h3 className="settings-section-title">
                  <Globe size={20} color="#FF6B35" /> Active Sessions
                </h3>
                <div className="settings-session-card">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#2ECC71",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p className="settings-session-name">Current Session</p>
                    <p className="settings-session-time">
                      Last active: Just now
                    </p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card padding="24px">
                <h3 className="settings-section-title">
                  <Bell size={20} color="#FF6B35" /> Notification Preferences
                </h3>
                <div className="settings-notif-list">
                  {[
                    {
                      icon: Mail,
                      label: "Email Notifications",
                      desc: "Receive important account updates",
                      state: emailNotifications,
                      setter: setEmailNotifications,
                    },
                    {
                      icon: Globe,
                      label: "Streak Reminders",
                      desc: "Daily reminders to maintain your streak",
                      state: streakReminders,
                      setter: setStreakReminders,
                    },
                    {
                      icon: BarChart3,
                      label: "Weekly Report",
                      desc: "Weekly summary of your progress",
                      state: weeklyReport,
                      setter: setWeeklyReport,
                    },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className="settings-notif-item"
                      style={{
                        borderBottom: i < 2 ? "1px solid #E8D5C4" : "none",
                      }}
                    >
                      <div className="settings-notif-info">
                        <item.icon size={18} color="#5C5C6E" />
                        <div>
                          <p className="settings-notif-label">{item.label}</p>
                          <p className="settings-notif-desc">{item.desc}</p>
                        </div>
                      </div>
                      <ToggleSwitch state={item.state} setter={item.setter} />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSaveNotifications}
                  disabled={savingNotifications}
                  style={{ marginTop: 20 }}
                >
                  <Save size={18} />{" "}
                  {savingNotifications ? "Saving..." : "Save Preferences"}
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card padding="24px">
                <h3 className="settings-section-title">
                  <Sun size={20} color="#FF6B35" /> Appearance
                </h3>
                <p className="settings-sub-label">Theme</p>
                <div className="settings-theme-row">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        toast.success(`Switched to ${t.label} mode`);
                      }}
                      className={`settings-theme-btn ${theme === t.id ? "active" : ""}`}
                    >
                      <t.icon size={18} /> {t.label}
                    </button>
                  ))}
                </div>
                <p className="settings-sub-label" style={{ marginTop: 20 }}>
                  Font Size
                </p>
                <div className="settings-theme-row">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`settings-font-btn ${fontSize === size ? "active" : ""}`}
                      style={{
                        fontSize:
                          size === "small" ? 12 : size === "large" ? 16 : 14,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .settings-page { padding-bottom: 80px; }
        .settings-header { margin-bottom: 24px; }
        .settings-header h2 { font-size: clamp(20px, 3vw, 28px); font-weight: 800; color: #1A1A2E; margin: 0 0 4px 0; font-family: 'Cabinet Grotesk', sans-serif; }
        .settings-header p { font-size: 14px; color: #5C5C6E; margin: 0; }

        .settings-layout { display: flex; gap: 24px; flex-wrap: wrap; }
        .settings-sidebar { width: 220px; flex-shrink: 0; }
        .settings-content { flex: 1; min-width: 0; }
        .settings-nav { display: flex; flex-direction: column; gap: 2px; }
        .settings-nav-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px;
          border: none; width: 100%; text-align: left; background: transparent; color: #5C5C6E;
          font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s;
        }
        .settings-nav-item:hover { background: #FFFBF5; color: #1A1A2E; }
        .settings-nav-item.active { background: #FFF3E8; color: #FF6B35; font-weight: 600; }

        .settings-danger-title { font-size: 12px; font-weight: 700; color: #E74C3C; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .settings-danger-btn {
          width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px;
          border: none; background: transparent; color: #E74C3C; font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s;
        }
        .settings-danger-btn:hover { background: #FFF5F5; }
        .settings-danger-btn-secondary {
          width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px;
          border: none; background: transparent; color: #8B8B9E; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; margin-top: 4px;
        }
        .settings-danger-btn-secondary:hover { background: #FFFBF5; }

        .settings-section-title { font-size: 18px; font-weight: 700; color: #1A1A2E; margin: 0 0 24px 0; font-family: 'Cabinet Grotesk', sans-serif; display: flex; align-items: center; gap: 8px; }
        .settings-avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .settings-avatar-wrap { position: relative; }
        .settings-avatar { width: 72px; height: 72px; border-radius: 20px; background: #FF6B35; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 28px; font-weight: 800; font-family: 'Cabinet Grotesk', sans-serif; }
        .settings-avatar-camera { position: absolute; bottom: -4px; right: -4px; width: 28px; height: 28px; border-radius: 8px; background: #FFFFFF; border: 2px solid #E8D5C4; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .settings-avatar-name { font-size: 16px; font-weight: 700; color: #1A1A2E; margin: 0 0 2px 0; }
        .settings-avatar-email { font-size: 13px; color: #5C5C6E; margin: 0; }
        .settings-badge-verified { display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 11px; color: #2ECC71; font-weight: 600; }
        .settings-badge-unverified { display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 11px; color: #F39C12; font-weight: 600; }

        .settings-form { display: flex; flex-direction: column; gap: 16px; }
        .settings-form-actions { display: flex; gap: 8px; flex-wrap: wrap; }

        .settings-session-card { padding: 12px 16px; border-radius: 10px; background: #E8F8F0; border: 1px solid #2ECC71; display: flex; align-items: center; gap: 12px; }

        .settings-notif-list { display: flex; flex-direction: column; }
        .settings-notif-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; gap: 12px; }
        .settings-notif-info { display: flex; align-items: flex-start; gap: 10px; }
        .settings-notif-label { font-size: 14px; font-weight: 600; color: #1A1A2E; margin: 0; }
        .settings-notif-desc { font-size: 12px; color: #8B8B9E; margin: 2px 0 0 0; }

        .settings-sub-label { font-size: 14px; font-weight: 600; color: #1A1A2E; margin: 0 0 12px 0; }
        .settings-theme-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .settings-theme-btn, .settings-font-btn {
          display: flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px;
          border: 1px solid #E8D5C4; background: #FFFFFF; color: #5C5C6E; font-size: 14px;
          font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; text-transform: capitalize;
        }
        .settings-theme-btn.active, .settings-font-btn.active { border: 2px solid #FF6B35; background: #FFF3E8; color: #FF6B35; }

        /* Mobile Tabs */
        .settings-mobile-tabs { display: none; position: relative; margin-bottom: 16px; }
        .settings-mobile-tab-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #E8D5C4; background: #FFFFFF; color: #1A1A2E; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
        .settings-mobile-dropdown { position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: #FFFFFF; border: 1px solid #E8D5C4; border-radius: 12px; padding: 8px; z-index: 20; box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
        .settings-mobile-dropdown-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border-radius: 8px; border: none; background: transparent; color: #5C5C6E; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; text-align: left; }
        .settings-mobile-dropdown-item.active { background: #FFF3E8; color: #FF6B35; font-weight: 600; }
        .settings-mobile-dropdown-item.danger { color: #E74C3C; }
        .settings-mobile-dropdown-divider { height: 1px; background: #E8D5C4; margin: 4px 0; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1023px) {
          .settings-sidebar { display: none; }
          .settings-mobile-tabs { display: block; }
          .settings-content { flex: 1 1 100%; }
        }

        @media (max-width: 767px) {
          .settings-page { padding-bottom: 80px; }
          .settings-header h2 { font-size: 22px; }
          .settings-section-title { font-size: 16px; margin-bottom: 16px; }
          .settings-avatar { width: 56px; height: 56px; border-radius: 16px; font-size: 22px; }
          .settings-avatar-name { font-size: 15px; }
          .settings-form-actions { flex-direction: column; }
          .settings-theme-row { flex-direction: column; }
          .settings-theme-btn, .settings-font-btn { justify-content: center; }
          .settings-notif-item { flex-direction: column; align-items: flex-start; gap: 10px; padding: 12px 0; }
        }
      `}</style>
    </motion.div>
  );
}
