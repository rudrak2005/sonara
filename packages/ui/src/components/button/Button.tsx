import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#D18A4D] text-[#0B0908] hover:brightness-110",
  secondary:
    "bg-[#201712] text-[#F2E9DE] border border-white/10 hover:bg-white/10",
  ghost:
    "bg-transparent text-[#F2E9DE] hover:bg-white/5",
  destructive:
    "bg-[#D75A4A] text-white hover:brightness-110",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center",
        "rounded-[10px]",
        "px-4 py-2.5",
        "text-sm font-medium",
        "transition-all duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#D18A4D]",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}