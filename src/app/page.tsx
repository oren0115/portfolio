import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Projects", value: 0 },
    { label: "Blog posts", value: 0 },
    { label: "Experience", value: 0 },
  ];

  return (
    <div className="page-wrapper">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="relative flex min-h-[70vh] overflow-hidden rounded-[32px] border border-slate-800/10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-8 py-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_45%)]" />
          <div className="relative grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                <Sparkles className="h-3.5 w-3.5" />
                Portfolio
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-white">
                  Jejak digital profesional yang menampilkan project dan
                  perjalanan karier secara elegan.
                </h1>
                <p className="text-lg leading-relaxed text-white/85">
                  Semua konten tersambung ke sumber data tunggal sehingga mudah
                  di-update. Cocok untuk personal branding, freelancer, atau tim
                  kecil yang butuh medium showcase cepat.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5"
                >
                  Lihat Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Pelajari fitur
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-white/80">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-semibold text-white">
                      {stat.value || "—"}
                    </p>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
