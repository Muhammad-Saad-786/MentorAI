import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, ArrowRight, Mail, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userId = location.state?.userId;
  const email = location.state?.email;

  if (!userId || !email) {
    navigate("/register");
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      const response = await api.post("/auth/verify-otp", { userId, otp });
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      toast.success("Email verified! Welcome to MentorAI");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-otp", { userId });
      toast.success("New code sent!");
    } catch (error) {
      toast.error("Failed to resend code");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#FFFBF5",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          maxWidth: "500px",
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <img src="/public/favicon.png" alt="logo" height={50} width={50} />

            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "'Cabinet Grotesk', sans-serif",
                color: "#1A1A2E",
                margin: 0,
              }}
            >
              MentorAI
            </h1>
          </div>
          <p style={{ color: "#5C5C6E", fontSize: 15, margin: 0 }}>
            Verify your email to get started
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#FFF3E8",
            border: "1px solid #E8D5C4",
            borderRadius: 16,
            padding: 24,
            marginBottom: 28,
          }}
        >
          <Mail size={24} color="#FF6B35" style={{ marginBottom: 12 }} />
          <p
            style={{
              fontSize: 14,
              color: "#1A1A2E",
              margin: "0 0 4px 0",
              fontWeight: 600,
            }}
          >
            Check your email
          </p>
          <p style={{ fontSize: 13, color: "#5C5C6E", margin: 0 }}>
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#1A1A2E",
              }}
            >
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              style={{
                width: "100%",
                textAlign: "center",
                letterSpacing: 12,
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                padding: "16px 20px",
                borderRadius: 14,
                border: "2px solid #E8D5C4",
                backgroundColor: "#FFFFFF",
                color: "#1A1A2E",
                outline: "none",
                transition: "border-color 0.25s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
              onBlur={(e) => (e.target.style.borderColor = "#E8D5C4")}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            style={{
              width: "100%",
              backgroundColor:
                isLoading || otp.length !== 6 ? "#E8D5C4" : "#FF6B35",
              color: "#FFFFFF",
              border: "none",
              padding: "16px 32px",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              cursor: isLoading || otp.length !== 6 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                Verify Email <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
            color: "#5C5C6E",
          }}
        >
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "#FF6B35",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Resend
          </button>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          flex: 1,
          backgroundColor: "#1A1A2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <Shield size={64} color="#FF6B35" />
        <p
          style={{
            color: "#8B8B9E",
            fontSize: 14,
            maxWidth: 300,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          "Verification keeps your account secure and your progress saved."
        </p>
      </motion.div>
    </div>
  );
}
