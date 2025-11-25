import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getBlogBySlug } from "@/lib/data";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";

export const dynamic = "force-dynamic";

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) {
      notFound();
    }

    return (
      <div className="page-wrapper relative overflow-hidden">
        <BackgroundDecorations />
        <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-16 relative z-10">
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
                loading="eager"
                priority
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
  } catch (error) {
    console.error("Error loading blog:", error);
    notFound();
  }
}

