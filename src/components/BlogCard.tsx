"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
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
      <CardHeader className="gap-2">
        <Badge variant="outline" className="w-max text-xs">
          {dateLabel || "Blog"}
        </Badge>
        <CardTitle className="text-lg">{post.title}</CardTitle>
        <p className="text-sm text-slate-600 line-clamp-3">
          {post.content.slice(0, 160)}…
        </p>
      </CardHeader>
      <CardContent>
        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Baca selengkapnya →
        </Link>
      </CardFooter>
    </Card>
  );
}

