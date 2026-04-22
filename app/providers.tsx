"use client";

import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/query-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-secondary)",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
            },
          }}
          richColors
          closeButton
        />
      </AuthProvider>
    </QueryProvider>
  );
}
