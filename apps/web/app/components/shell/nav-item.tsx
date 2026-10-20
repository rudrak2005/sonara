"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
}

export function NavItem({
  href,
  label,
  icon: Icon,
  collapsed = false,
}: NavItemProps) {
  const pathname = usePathname();

  const active =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={
        collapsed ? label : undefined
      }
      className={[
        "group flex items-center gap-3 rounded-xl",
        "px-3 py-2.5",
        "text-sm transition-colors duration-200",
        active
          ? "bg-white/10 text-[#F2E9DE]"
          : "text-[#B5A69A] hover:bg-white/5 hover:text-[#F2E9DE]",
        collapsed ? "justify-center" : "",
      ].join(" ")}
    >
      <Icon
        size={18}
        strokeWidth={1.8}
        aria-hidden="true"
      />

      {!collapsed && (
        <span className="truncate">
          {label}
        </span>
      )}
    </Link>
  );
}