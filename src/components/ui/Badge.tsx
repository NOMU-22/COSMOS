import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "blue" | "pink" | "green" | "amber" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "purple",
  size = "md",
  className = "",
}) => {
  const variantStyles = {
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(139,92,246,0.2)]",
    blue: "bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    pink: "bg-pink-500/15 text-pink-300 border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.2)]",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    neutral: "bg-slate-800/60 text-slate-300 border-slate-700/50",
  }[variant];

  const sizeStyles = size === "sm" ? "text-xs px-2.5 py-0.5" : "text-xs px-3 py-1";

  return (
    <span
      className={`inline-flex items-center font-medium tracking-wide rounded-full border backdrop-blur-md ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
