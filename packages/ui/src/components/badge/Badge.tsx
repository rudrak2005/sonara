import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span
      className="
        inline-flex items-center
        rounded-full
        border border-white/10
        bg-white/5
        px-2.5 py-1
        text-xs
        text-[#B5A69A]
      "
    >
      {children}
    </span>
  );
}