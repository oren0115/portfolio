import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="page-wrapper">
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 md:px-6">
        <section className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
          <div className="relative grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                <Sparkles className="h-3.5 w-3.5" />
                Portfolio
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                  Nyoman Astika
                </h1>
                <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                  Saya adalah seorang pengembang perangkat lunak yang berpengalaman dengan fokus pada pengembangan aplikasi web dan mobile. Saya memiliki pengalaman dalam mengembangkan aplikasi web dan mobile yang responsif, scalable, dan mudah di-maintain.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5"
                >
                  Lihat Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Lihat Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
