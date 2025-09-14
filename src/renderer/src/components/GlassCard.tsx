import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "sm" | "md" | "lg";
}

function GlassCard({
  children,
  className = "",
  onClick,
  padding = "md",
}: GlassCardProps): JSX.Element {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white/15 backdrop-blur-xl rounded-2xl border ${onClick ? 'cursor-pointer' : ''} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
      style={{
        borderColor: "#8C7DD1",
        boxShadow:
          "0 4px 16px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.05) inset",
      }}
    >
      {children}
    </div>
  );
}

export default GlassCard;
