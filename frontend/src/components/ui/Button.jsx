import { motion } from "framer-motion";

const variants = {
  primary: {
    bg: "#FF6B35",
    hoverBg: "#E55A2B",
    color: "#FFFFFF",
    border: "none",
  },
  secondary: {
    bg: "#FFFFFF",
    hoverBg: "#FFF3E8",
    color: "#004E64",
    border: "2px solid #004E64",
  },
  ghost: {
    bg: "transparent",
    hoverBg: "#FFF3E8",
    color: "#1A1A2E",
    border: "none",
  },
  danger: {
    bg: "#E74C3C",
    hoverBg: "#C0392B",
    color: "#FFFFFF",
    border: "none",
  },
};

const sizes = {
  sm: { padding: "8px 16px", fontSize: "13px", borderRadius: "10px" },
  md: { padding: "12px 24px", fontSize: "14px", borderRadius: "12px" },
  lg: { padding: "16px 32px", fontSize: "16px", borderRadius: "14px" },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  style: userStyle = {},
  ...props
}) {
  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      style={{
        backgroundColor: variantStyle.bg,
        color: variantStyle.color,
        border: variantStyle.border,
        ...sizeStyle,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "background-color 0.2s ease",
        fontFamily: "'Inter', sans-serif",
        ...userStyle,
      }}
      className={className}
      onMouseEnter={(e) =>
        (e.target.style.backgroundColor = variantStyle.hoverBg)
      }
      onMouseLeave={(e) => (e.target.style.backgroundColor = variantStyle.bg)}
      {...props}
    >
      {Icon && <Icon size={sizeStyle.fontSize === "13px" ? 16 : 20} />}
      {children}
    </motion.button>
  );
}
