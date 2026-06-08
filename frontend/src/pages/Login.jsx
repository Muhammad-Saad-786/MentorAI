import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.requiresVerification) {
        toast.error("Please verify your email first");
        navigate("/verify-email", {
          state: { userId: errorData.userId, email: errorData.email },
        });
      } else {
        toast.error(errorData?.error || "Login failed");
      }
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
        }}
      >
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <img src="/public/favicon.png" alt="logo" height={50} width={50} />

            <h1
              style={{
                fontSize: "28px",
                fontWeight: 800,
                fontFamily: "'Cabinet Grotesk', sans-serif",
                color: "#1A1A2E",
                margin: 0,
              }}
            >
              MentorAI
            </h1>
          </div>
          <p style={{ color: "#5C5C6E", fontSize: "15px", margin: 0 }}>
            Welcome back! Ready to level up your coding skills?
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "440px" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="hello@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "13px",
                  color: "#004E64",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </Button>
          </div>
        </form>

        <p style={{ marginTop: "32px", fontSize: "14px", color: "#5C5C6E" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#FF6B35",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Create one
          </Link>
        </p>
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
          gap: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "60px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            backgroundColor: "#FF6B35",
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "40px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            backgroundColor: "#2ECC71",
            opacity: 0.08,
          }}
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            backgroundColor: "#2C2C3A",
            border: "1px solid #3A3A4E",
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "400px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#E74C3C",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#F39C12",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#2ECC71",
              }}
            />
          </div>
          <pre
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              color: "#2ECC71",
              margin: 0,
              lineHeight: 1.8,
            }}
          >
            {`function becomeDeveloper() {
  const mentor = new MentorAI();
  while (!mastery) {
    mentor.guide();
    practice();
    levelUp();
  }
  return dreamJob;
}`}
          </pre>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            color: "#8B8B9E",
            fontSize: "14px",
            maxWidth: "380px",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          "The best mentors don't give you answers. They teach you how to find
          them yourself."
        </motion.p>
      </motion.div>
    </div>
  );
}
