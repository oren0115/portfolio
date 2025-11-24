"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2 sm:gap-3">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Button
            key={link.href}
            asChild
            variant={active ? "default" : "outline"}
            size="sm"
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
