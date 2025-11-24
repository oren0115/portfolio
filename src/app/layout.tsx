import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Link from "next/link";
import { HeaderNav } from "@/components/HeaderNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Portfolio CMS",
  description:
    "Portfolio fullstack dengan CRUD Projects, Blog, Skills, Experience menggunakan Next.js + MongoDB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white/85 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
              <Link href="/" className="text-base font-semibold text-slate-900 sm:text-lg">
                Portfolio
              </Link>
              <HeaderNav />
            </div>
          </header>
          <div className="flex-1">{children}</div>
          <footer className="border-t border-slate-200 bg-white/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} Portfolio CMS.</p>
              <p>Dibangun dengan Next.js 14, MongoDB, dan Tailwind CSS.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
