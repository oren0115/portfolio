import { redirect } from "next/navigation";

import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import { getSessionFromCookies } from "@/lib/auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="page-wrapper">
      <main className="mx-auto max-w-6xl px-6 py-12 space-y-6">
        <div className="card flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
              Admin
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Dashboard Konten
            </h1>
            <p className="text-sm text-slate-500">{session.email}</p>
          </div>
          <LogoutButton />
        </div>
        <AdminNav />
        <div>{children}</div>
      </main>
    </div>
  );
}

