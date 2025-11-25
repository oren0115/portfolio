"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HeaderNav } from "@/components/HeaderNav";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide navbar and footer on admin pages (including login)
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminPage && (
        <header className="border-b border-slate-200 bg-white/85 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <Link href="/" className="text-base font-semibold text-slate-900 sm:text-lg">
              Portfolio
            </Link>
            <HeaderNav />
          </div>
        </header>
      )}
      <div className="flex-1">{children}</div>
      {!isAdminPage && (
        <footer className="border-t border-slate-200 bg-white/80">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Portfolio CMS.</p>
            <p>Dibangun dengan Next.js 14, MongoDB, dan Tailwind CSS.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

