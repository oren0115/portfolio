"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 text-sm font-medium text-slate-600">
      {LINKS.map((link) => {
        const active =
          pathname === link.href || pathname?.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative rounded-full px-4 py-2 transition ${
              active
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:underline"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

