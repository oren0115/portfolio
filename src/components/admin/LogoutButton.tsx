"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
    >
      Logout
    </button>
  );
}

