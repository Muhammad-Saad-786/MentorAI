import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";

export default function Analytics() {
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
          margin: "0 0 6px 0",
          fontFamily: "'Cabinet Grotesk', sans-serif",
        }}
      >
        Analytics
      </h2>
      <p style={{ fontSize: "14px", color: "#5C5C6E", margin: "0 0 32px 0" }}>
        Track your progress, identify weak spots, and celebrate your growth.
      </p>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E8D5C4",
          borderRadius: "16px",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <BarChart3 size={48} color="#FF6B35" />
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1A1A2E",
            margin: 0,
            fontFamily: "'Cabinet Grotesk', sans-serif",
          }}
        >
          Analytics Dashboard Coming Soon
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#8B8B9E",
            margin: 0,
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          Detailed charts, skill graphs, and learning insights will be available
          in Phase 5.
        </p>
      </div>
    </motion.div>
  );
}
