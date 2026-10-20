import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "w-full",
        "rounded-[10px]",
        "border border-white/10",
        "bg-[#15100D]",
        "px-4 py-3",
        "text-[#F2E9DE]",
        "placeholder:text-[#B5A69A]",
        "outline-none",
        "transition",
        "focus:border-[#D18A4D]",
        "focus:ring-2",
        "focus:ring-[#D18A4D]/20",
        className,
      ].join(" ")}
      {...props}
    />
  );
}