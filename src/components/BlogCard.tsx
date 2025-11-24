"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import type { IBlog } from "@/models/Blog";
import type { WithId } from "@/types/content";

type Props = {
  post: WithId<IBlog>;
};

export function BlogCard({ post }: Props) {
  const dateLabel = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <BookOpen className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {dateLabel || "Blog"}
          </p>
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-3">
            {post.content.slice(0, 160)}…
          </p>
        </div>
        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  );
}

