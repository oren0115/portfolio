"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
    <Card className="group flex flex-col overflow-hidden border-neutral-200 shadow-sm transition hover:shadow-md">
      <div className="relative h-56 w-full overflow-hidden border-b border-neutral-100 bg-gradient-to-br from-neutral-50 to-neutral-100">
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
          <div className="flex h-full items-center justify-center text-neutral-300">
            <Github className="h-12 w-12" />
          </div>
        )}
      </div>
      <CardHeader className="space-y-2 pb-4">
        <p className="text-xs font-medium tracking-wide text-neutral-500">
          {createdAt || "Project"}
        </p>
        <h3 className="text-lg font-semibold text-neutral-900">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600">
          {project.description}
        </p>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {project.techStack?.length ? (
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-neutral-100 px-2 py-0.5 text-xs font-normal text-neutral-700"
              >
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge
                variant="secondary"
                className="bg-neutral-100 px-2 py-0.5 text-xs font-normal text-neutral-700"
              >
                +{project.techStack.length - 4}
              </Badge>
            )}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        <div className="flex flex-wrap gap-2">
          {project.link_demo && (
            <Link
              href={project.link_demo}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Demo
            </Link>
          )}
          {project.link_repo && (
            <Link
              href={project.link_repo}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              <Github className="h-3.5 w-3.5" />
              Source
            </Link>
          )}
        </div>
        <Link
          href={`/projects/${project._id}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Detail
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
