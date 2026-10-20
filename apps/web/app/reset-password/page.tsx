import {
  Suspense,
} from "react";

import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center bg-[#0b0908] text-[#f2e9de]">
          <div className="text-xs uppercase tracking-[0.3em] text-[#b5a69a]">
            SONORA / LOADING RESET
          </div>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}