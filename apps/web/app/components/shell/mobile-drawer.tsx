"use client";

import Link from "next/link";
import { X, Disc3 } from "lucide-react";
import { mainNavigation } from "../../lib/navigation";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({
  open,
  onClose,
}: MobileDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <aside
        className="
          relative h-full w-[280px]
          border-r border-white/10
          bg-[#0B0908]
          p-4
          shadow-2xl
        "
      >
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <Disc3 size={22} />
            <span className="font-semibold">
              SONORA
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="
              grid h-9 w-9 place-items-center
              rounded-lg
              hover:bg-white/5
            "
          >
            <X size={18} />
          </button>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="space-y-1"
        >
          {mainNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="
                  flex items-center gap-3
                  rounded-xl px-3 py-3
                  text-sm text-[#B5A69A]
                  hover:bg-white/5
                  hover:text-[#F2E9DE]
                "
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}