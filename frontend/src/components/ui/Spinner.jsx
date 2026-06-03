import { motion } from "framer-motion";

export default function Spinner({ size = 40, color = "#FF6B35" }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{
        width: size,
        height: size,
        border: `3px solid #E8D5C4`,
        borderTopColor: color,
        borderRadius: "50%",
      }}
    />
  );
}
