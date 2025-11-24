import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Github,
  Globe,
  Info,
  RefreshCw,
} from "lucide-react";

import { getProjectById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const createdAt = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="page-wrapper">
      <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-slate-500 transition hover:text-slate-900"
        >
          ← Semua projects
        </Link>
        <section className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Project
              </p>
              <h1 className="text-4xl font-semibold text-slate-900">
                {project.title}
              </h1>
              {createdAt && (
                <p className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  Dirilis {createdAt}
                </p>
              )}
              <p className="text-base text-slate-600">{project.description}</p>
            </div>
          {project.image && (
            <div className="relative h-72 w-full overflow-hidden rounded-2xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
          )}
          {project.techStack?.length ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                Stack yang digunakan
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>
              <p className="inline-flex items-center gap-2 text-base text-slate-700">
                <Info className="h-4 w-4 text-emerald-500" />
                Aktif / Published
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Terakhir diperbarui
              </p>
              <p className="inline-flex items-center gap-2 text-base text-slate-700">
                <RefreshCw className="h-4 w-4 text-blue-500" />
                {project.updatedAt
                  ? new Date(project.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            {project.link_demo && (
              <Link
                href={project.link_demo}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                <Globe className="h-4 w-4" />
                Lihat demo
              </Link>
            )}
            {project.link_repo && (
              <Link
                href={project.link_repo}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                <Github className="h-4 w-4" />
                Source code
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

