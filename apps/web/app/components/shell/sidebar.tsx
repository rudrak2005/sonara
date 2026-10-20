import Link from "next/link";
import { Disc3 } from "lucide-react";
import { mainNavigation } from "../../lib/navigation";
import { NavItem } from "./nav-item";

export function Sidebar() {
  return (
    <aside
      className="
        hidden lg:flex
        h-screen w-64 shrink-0
        flex-col
        border-r border-white/10
        bg-[#0B0908]/90
        backdrop-blur-xl
      "
    >
      <div className="flex h-20 items-center px-5">
        <Link
          href="/sonora"
          className="flex items-center gap-3"
        >
          <div
            className="
              grid h-10 w-10 place-items-center
              rounded-xl
              border border-white/10
              bg-[#201712]
            "
          >
            <Disc3 size={20} />
          </div>

          <div>
            <p className="font-semibold tracking-wide">
              SONORA
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5A69A]">
              Music Machine
            </p>
          </div>
        </Link>
      </div>

      <nav
        aria-label="Primary navigation"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      >
        {mainNavigation.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-[#B5A69A]">
          SONORA
        </p>

        <p className="mt-1 text-[11px] text-white/40">
          Your music. Your memories. Your AI.
        </p>
      </div>
    </aside>
  );
}