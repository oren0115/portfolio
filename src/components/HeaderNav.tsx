"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1.5 text-xs font-medium text-slate-600 sm:gap-2 sm:text-sm">
      {LINKS.map((link) => {
        const active =
          pathname === link.href || pathname?.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "relative transition",
              active
                ? "bg-neutral-100 font-semibold text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            {link.label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-neutral-900" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
