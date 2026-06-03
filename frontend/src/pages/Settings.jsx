import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { User, Mail, Shield, LogOut } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "#1A1A2E",
          margin: "0 0 24px 0",
          fontFamily: "'Cabinet Grotesk', sans-serif",
        }}
      >
        Settings
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "600px",
        }}
      >
        <Card padding="24px">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                backgroundColor: "#FF6B35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "24px",
                fontWeight: 800,
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#1A1A2E",
                  margin: "0 0 4px 0",
                }}
              >
                {user?.name || "User"}
              </h3>
              <p style={{ fontSize: "13px", color: "#8B8B9E", margin: 0 }}>
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 0",
              }}
            >
              <User size={18} color="#5C5C6E" />
              <span style={{ fontSize: "14px", color: "#5C5C6E" }}>
                Edit Profile
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 0",
              }}
            >
              <Mail size={18} color="#5C5C6E" />
              <span style={{ fontSize: "14px", color: "#5C5C6E" }}>
                Change Email
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 0",
              }}
            >
              <Shield size={18} color="#5C5C6E" />
              <span style={{ fontSize: "14px", color: "#5C5C6E" }}>
                Privacy & Security
              </span>
            </div>
          </div>
        </Card>

        <Button
          variant="danger"
          onClick={handleLogout}
          style={{ width: "fit-content" }}
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </motion.div>
  );
}
