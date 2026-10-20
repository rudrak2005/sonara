"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { MobileDrawer } from "./mobile-drawer";
import { PlayerHost } from "../player/PlayerHost";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0908] text-[#F2E9DE]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <TopBar
            onMenuClick={() => setMobileOpen(true)}
          />

          <main
            id="main-content"
            className="
              min-h-[calc(100vh-4rem)]
              px-4 py-5
              md:px-6 md:py-6
              xl:px-8
            "
          >
            {children}
          </main>
          <PlayerHost />
        </div>
      </div>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </div>
  );
}