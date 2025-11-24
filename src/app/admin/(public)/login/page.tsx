"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!response.ok) {
      setError("Email atau password salah.");
      return;
    }
    window.location.href = "/admin";
  };

  return (
    <div className="page-wrapper">
      <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="card space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
              Admin
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Masuk ke dashboard
            </h1>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              className="w-full rounded-md border border-slate-200 p-3"
              placeholder="Email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full rounded-md border border-slate-200 p-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full rounded-md bg-brand-accent px-4 py-3 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-xs text-slate-500">
            Gunakan kredensial ADMIN_EMAIL & ADMIN_PASSWORD dari file env.
          </p>
        </div>
      </main>
    </div>
  );
}

