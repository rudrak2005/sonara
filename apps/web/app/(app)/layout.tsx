import type { ReactNode } from "react";

import { AuthGate } from "@/app/components/auth/auth-gate";
import { AppShell } from "@/app/components/shell/app-shell";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGate>
      <AppShell>
        {children}
      </AppShell>
    </AuthGate>
  );
}