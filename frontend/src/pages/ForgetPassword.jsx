import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSentEmail(email);
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to send reset link";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
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
      {/* Left Panel */}
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
          maxWidth: "520px",
        }}
      >
        {/* Back link */}
        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#5C5C6E",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: 40,
            width: "fit-content",
          }}
        >
          <ArrowLeft size={18} /> Back to Login
        </Link>

        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
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
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                backgroundColor: "#E8F8F0",
                border: "1px solid #2ECC71",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              <CheckCircle2
                size={48}
                color="#2ECC71"
                style={{ marginBottom: 16 }}
              />
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1A1A2E",
                  margin: "0 0 8px 0",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                }}
              >
                Reset Link Sent!
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#5C5C6E",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                We've sent a password reset link to <strong>{sentEmail}</strong>
                . Please check your inbox and click the link to reset your
                password.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#FFF3E8",
                border: "1px solid #E8D5C4",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "#5C5C6E",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                📧 <strong>Didn't receive the email?</strong>
                <br />
                Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail(sentEmail);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#FF6B35",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  try again
                </button>
              </p>
            </div>

            <Link
              to="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: "#FF6B35",
                color: "#FFFFFF",
                border: "none",
                padding: "14px 28px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Return to Login <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#1A1A2E",
                margin: "0 0 8px 0",
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              Forgot Password?
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#5C5C6E",
                margin: "0 0 28px 0",
                lineHeight: 1.6,
              }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1A1A2E",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative", marginBottom: 20 }}>
                <Mail
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 44px",
                    borderRadius: 12,
                    border: "2px solid #E8D5C4",
                    backgroundColor: "#FFFFFF",
                    fontSize: 14,
                    color: "#1A1A2E",
                    outline: "none",
                    fontFamily: "'Inter', sans-serif",
                    transition: "border-color 0.25s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8D5C4")}
                />
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
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>

      {/* Right Panel */}
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 80,
            width: 200,
            height: 200,
            borderRadius: "50%",
            backgroundColor: "#FF6B35",
            opacity: 0.08,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 60,
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "#2ECC71",
            opacity: 0.06,
          }}
        />

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
          "Your account security matters. We'll help you get back to coding in
          no time."
        </p>
      </motion.div>
    </div>
  );
}
