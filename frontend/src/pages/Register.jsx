import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                backgroundColor: "#FF6B35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={24} color="#FFFFFF" />
            </div>
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
            Start your journey to becoming an independent developer.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: "440px" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
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
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              size="lg"
              style={{ width: "100%", marginTop: "8px" }}
              disabled={isLoading}
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account <ArrowRight size={20} />
                </>
              )}
            </Button>
          </div>
        </form>

        <p style={{ marginTop: "28px", fontSize: "14px", color: "#5C5C6E" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#FF6B35",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign in
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
            maxWidth: "380px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <pre
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              color: "#FF6B35",
              margin: 0,
              lineHeight: 1.8,
            }}
          >
            {`// Your mentor journey starts here
const developer = {
  skills: [],
  confidence: 0,
};

mentorAI.onboard(developer);
// → "Welcome! Let's discover
//    your starting point..."`}
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
          "Every expert was once a beginner who refused to give up."
        </motion.p>
      </motion.div>
    </div>
  );
}
