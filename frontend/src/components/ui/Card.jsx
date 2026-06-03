
import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  delay = 0,
  padding = "24px",
  hover = false,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8D5C4",
        borderRadius: "16px",
        padding,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      className={className}
      whileHover={
        hover
          ? {
              borderColor: "#FF6B35",
              boxShadow: "0 4px 20px rgba(255,107,53,0.1)",
            }
          : {}
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
