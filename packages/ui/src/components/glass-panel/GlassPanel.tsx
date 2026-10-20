import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({
  children,
  className = "",
}: GlassPanelProps) {
  return (
    <section
      className={[
        "rounded-[22px]",
        "border border-white/10",
        "bg-[#201712]/70",
        "backdrop-blur-xl",
        "shadow-2xl",
        "text-[#F2E9DE]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}