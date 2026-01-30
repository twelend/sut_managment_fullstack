"use client";

import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="antialiased">
        {pathname.includes("teacher") ? null : (
          <header className="fixed inset-0 top-4 z-50 h-fit">
            <nav className="grid grid-cols-[2fr_4fr_2fr] items-center px-20">
              <Link href="/">
                <Image src="/logo.png" alt="logo" width={85} height={85} />
              </Link>
              <ul className="flex justify-center gap-10 text-lg text-[#eee]">
                <li>
                  <Link className="links" href="/">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link className="links" href="/contests">
                    Конкурсы
                  </Link>
                </li>
                <li>
                  <Link className="links" href="/subjects">
                    Курсы
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
        )}
        {children}
      </div>
    </QueryClientProvider>
  );
}
