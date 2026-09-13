import React from "react";

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const variantClass =
    variant === "primary"
      ? "btn-liquid-primary"
      : variant === "secondary"
      ? "btn-liquid-secondary"
      : "btn-liquid-ghost";

  const sizeClass =
    size === "sm"
      ? "!py-1.5 !px-3.5 !text-xs"
      : size === "lg"
      ? "!py-3.5 !px-8 !text-base !font-bold"
      : "!py-2.5 !px-5 !text-sm";

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button
      className={`${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
