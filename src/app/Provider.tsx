// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AppProvider } from "../context/AppProvider";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            richColors
            position="top-center"
            // ✅ Mantenha apenas o estilo geral aqui
            toastOptions={{
              unstyled: true,
              className:
                "flex items-center justify-center gap-2 p-2 px-4 w-full rounded-md shadow-lg border-2 border-green-600 text-gray-100 bg-gray-900 dark:bg-[#151526] dark:border-green-600 dark:text-gray-100",
            }}
          />
        </ThemeProvider>
      </AppProvider>
      {/* Devtools para depuração */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
