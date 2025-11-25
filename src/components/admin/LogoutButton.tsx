"use client";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <Button className="cursor-pointer hover:bg-slate-100" variant="outline" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
