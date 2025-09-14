import { ReactNode } from "react";

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

function GlassButton({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  className = "",
  icon 
}: GlassButtonProps): JSX.Element {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base", 
    lg: "px-8 py-4 text-lg"
  };

  const variantStyles = {
    primary: {
      background: "rgba(140, 125, 209, 0.2)",
      borderColor: "#8C7DD1",
      color: "white"
    },
    secondary: {
      background: "rgba(255, 255, 255, 0.1)",
      borderColor: "#ACACE6", 
      color: "white"
    },
    danger: {
      background: "rgba(239, 68, 68, 0.2)",
      borderColor: "#ef4444",
      color: "white"
    }
  };

  return (
    <button
      className={`
        backdrop-blur-xl rounded-xl border font-medium
        transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'} 
        ${sizeClasses[size]} 
        ${className}
        flex items-center justify-center gap-2
      `}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: variantStyles[variant].background,
        borderColor: variantStyles[variant].borderColor,
        color: variantStyles[variant].color,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 255, 255, 0.05) inset'
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

export default GlassButton;