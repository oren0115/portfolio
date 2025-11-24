import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getBlogBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) {
    notFound();
  }

  return (
    <div className="page-wrapper">
      <main className="mx-auto max-w-3xl px-6 py-16 space-y-6">
        <Link href="/blog" className="text-sm text-slate-500 underline">
          ← Semua blog
        </Link>
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
          Blog
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">{blog.title}</h1>
        <p className="text-sm text-slate-500">
          {new Date(blog.createdAt ?? "").toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        {blog.coverImage && (
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={1200}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
        )}
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
        {blog.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}

