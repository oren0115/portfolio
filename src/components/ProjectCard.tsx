"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FolderGit2, Github, Globe } from "lucide-react";

import type { IProject } from "@/models/Project";
import type { WithId } from "@/types/content";

type Props = {
  project: WithId<IProject>;
};

export function ProjectCard({ project }: Props) {
  const createdAt = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <FolderGit2 className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {createdAt || "Project"}
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            {project.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-3">
            {project.description}
          </p>
        </div>
        {project.techStack?.length ? (
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-3 text-sm font-medium">
          {project.link_demo && (
            <Link
              href={project.link_demo}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              <Globe className="h-4 w-4" />
              Live Demo
            </Link>
          )}
          {project.link_repo && (
            <Link
              href={project.link_repo}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              <Github className="h-4 w-4" />
              Source
            </Link>
          )}
          <Link
            href={`/projects/${project._id}`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
          >
            Detail
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

