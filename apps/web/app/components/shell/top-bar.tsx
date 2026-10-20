"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({
  onMenuClick,
}: TopBarProps) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyboardShortcut(
      event: KeyboardEvent,
    ) {
      const target =
        event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (
        event.key === "/" &&
        !isTyping
      ) {
        event.preventDefault();
        router.push("/sonora/search");
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut,
      );
    };
  }, [router]);

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 items-center
        justify-between
        border-b border-white/10
        bg-[#0B0908]/80
        px-4 md:px-6
        backdrop-blur-xl
      "
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="
            grid h-10 w-10 place-items-center
            rounded-xl
            text-[#B5A69A]
            hover:bg-white/5
            hover:text-[#F2E9DE]
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/sonora/search")
          }
          aria-label="Search your music"
          className="
            hidden sm:flex
            items-center gap-3
            rounded-xl
            border border-white/10
            bg-[#15100D]
            px-4 py-2
            text-sm text-[#B5A69A]
            transition
            hover:border-white/20
            hover:bg-[#1B1410]
            hover:text-[#F2E9DE]
            focus:outline-none
            focus:ring-2
            focus:ring-[#D18A4D]/40
          "
        >
          <Search size={16} />

          <span>
            Search your music...
          </span>

          <kbd
            className="
              ml-5
              rounded
              border border-white/10
              px-1.5 py-0.5
              text-[10px]
              text-[#8F8175]
            "
          >
            /
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="
            grid h-10 w-10 place-items-center
            rounded-xl
            text-[#B5A69A]
            hover:bg-white/5
            hover:text-[#F2E9DE]
          "
        >
          <Bell size={18} />
        </button>

        <button
          type="button"
          aria-label="Open profile menu"
          className="
            grid h-10 w-10 place-items-center
            rounded-full
            border border-white/10
            bg-[#201712]
            text-sm font-semibold
          "
        >
          R
        </button>
      </div>
    </header>
  );
}