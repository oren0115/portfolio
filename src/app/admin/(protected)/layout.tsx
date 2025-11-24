import { redirect } from "next/navigation";

import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-12">
        <Card>
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500 sm:text-sm">
                Admin
              </p>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Dashboard Konten
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">{session.email}</p>
            </div>
            <LogoutButton />
          </CardContent>
        </Card>
        <AdminNav />
        <div>{children}</div>
      </main>
    </div>
  );
}
