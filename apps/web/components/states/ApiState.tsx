"use client";

interface ApiStateProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function ApiState({
  loading = false,
  error,
  onRetry,
  children,
}: ApiStateProps) {
  if (loading) {
    return (
      <div className="rounded-[16px] border border-white/10 bg-[#201712] p-6 text-[#B5A69A]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[16px] border border-[#D75A4A]/30 bg-[#D75A4A]/10 p-6">
        <p className="text-sm text-[#F2E9DE]">
          {error}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-[8px] bg-[#201712] px-4 py-2 text-sm text-[#F2E9DE]"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}