export default function Badge({ children, variant = "default" }) {
  const styles = {
    default: { bg: "#FFF3E8", color: "#FF6B35" },
    success: { bg: "#E8F8F0", color: "#2ECC71" },
    warning: { bg: "#FFF8E1", color: "#F39C12" },
    error: { bg: "#FFEBEE", color: "#E74C3C" },
    info: { bg: "#E3F2FD", color: "#3498DB" },
    secondary: { bg: "#E8F0F4", color: "#004E64" },
  };

  const style = styles[variant] || styles.default;

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "4px 10px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}
