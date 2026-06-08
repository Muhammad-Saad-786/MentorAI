import { motion } from "framer-motion";

function getColor(score) {
  if (score >= 70) return "#2ECC71";
  if (score >= 40) return "#F39C12";
  return "#E74C3C";
}

export default function TopicChart({ topics = [] }) {
  const sorted = [...topics].sort((a, b) => b.score - a.score);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sorted.map((topic, i) => (
        <motion.div
          key={topic.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E" }}>
              {topic.name}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: getColor(topic.score),
              }}
            >
              {topic.score}%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                flex: 1,
                height: 10,
                backgroundColor: "#F0EBE3",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topic.score}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                style={{
                  height: "100%",
                  backgroundColor: getColor(topic.score),
                  borderRadius: 5,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                color: "#8B8B9E",
                minWidth: 40,
                textAlign: "right",
              }}
            >
              {topic.solved || 0}/{topic.attempts || 0}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
