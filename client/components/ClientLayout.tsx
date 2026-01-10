"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function LayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <div className="antialiased">{children}</div>
      </QueryClientProvider>
  );
}