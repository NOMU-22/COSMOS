import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "blue" | "pink" | "none";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  hoverEffect = true,
  glow = "none",
  children,
  className = "",
  ...props
}) => {
  const hoverClass = hoverEffect ? "glass-card-hover" : "";
  const glowClass =
    glow === "purple"
      ? "shadow-[0_0_30px_rgba(139,92,246,0.25)]"
      : glow === "blue"
      ? "shadow-[0_0_30px_rgba(56,189,248,0.25)]"
      : glow === "pink"
      ? "shadow-[0_0_30px_rgba(236,72,153,0.25)]"
      : "";

  return (
    <div
      className={`glass-card p-6 relative overflow-hidden ${hoverClass} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
