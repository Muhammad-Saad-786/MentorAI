import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Sparkles, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Reset failed. The link may have expired.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFBF5",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 440, width: "100%", padding: 40 }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <img src="/public/favicon.png" alt="logo" height={50} width={50} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#1A1A2E",
              fontFamily: "'Cabinet Grotesk', sans-serif",
              margin: "0 0 4px 0",
            }}
          >
            Reset Password
          </h1>
          <p style={{ color: "#5C5C6E", fontSize: 14, margin: 0 }}>
            Enter your new password
          </p>
        </div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center" }}
          >
            <CheckCircle2
              size={56}
              color="#2ECC71"
              style={{ marginBottom: 16 }}
            />
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#1A1A2E",
                marginBottom: 8,
              }}
            >
              Password Reset!
            </p>
            <p style={{ color: "#5C5C6E", fontSize: 14 }}>
              Redirecting to login...
            </p>
            <Link
              to="/login"
              style={{
                color: "#FF6B35",
                fontWeight: 700,
                textDecoration: "none",
                marginTop: 12,
                display: "inline-block",
              }}
            >
              Go to Login{" "}
              <ArrowRight size={16} style={{ verticalAlign: "middle" }} />
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1A1A2E",
                }}
              >
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  color="#8B8B9E"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 44px",
                    borderRadius: 12,
                    border: "2px solid #E8D5C4",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8D5C4")}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1A1A2E",
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  color="#8B8B9E"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 44px",
                    borderRadius: 12,
                    border: "2px solid #E8D5C4",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8D5C4")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                backgroundColor: isLoading ? "#E8D5C4" : "#FF6B35",
                color: "#FFFFFF",
                border: "none",
                padding: "14px 28px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {isLoading ? (
                "Resetting..."
              ) : (
                <>
                  Reset Password <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
