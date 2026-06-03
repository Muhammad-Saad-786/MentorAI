
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  error,
  icon: Icon,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div style={{ width: "100%" }} className={className}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#1A1A2E",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={18}
            color={isFocused ? "#FF6B35" : "#8B8B9E"}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              transition: "color 0.25s ease",
            }}
          />
        )}
        <input
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: error
              ? "2px solid #E74C3C"
              : isFocused
                ? "2px solid #FF6B35"
                : "2px solid #E8D5C4",
            borderRadius: "12px",
            padding: Icon ? "12px 16px 12px 42px" : "12px 16px",
            fontSize: "14px",
            color: "#1A1A2E",
            outline: "none",
            transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            boxShadow: isFocused ? "0 0 0 3px #FFF3E8" : "none",
            fontFamily: "'Inter', sans-serif",
          }}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            {showPassword ? (
              <EyeOff size={18} color="#8B8B9E" />
            ) : (
              <Eye size={18} color="#8B8B9E" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p
          style={{
            marginTop: "6px",
            fontSize: "12px",
            color: "#E74C3C",
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
