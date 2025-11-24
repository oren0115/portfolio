import Link from "next/link";

import { BlogCard } from "@/components/BlogCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getBlogPosts } from "@/lib/data";

export const metadata = {
  title: "Blog | Portfolio CMS",
};

export default async function BlogPage() {
  const blogs = await getBlogPosts();
  return (
    <div className="page-wrapper">
      <main className="mx-auto max-w-6xl px-6 py-16 space-y-6">
        <SectionHeading
          title="Blog"
          subtitle="Artikel, catatan proses, dan update terbaru."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {blogs.length ? (
            blogs.map((post) => <BlogCard key={post._id} post={post} />)
          ) : (
            <div className="card col-span-full text-slate-500">
              Belum ada artikel. Login ke dashboard admin untuk membuatnya.
            </div>
          )}
        </div>
        <div className="text-sm text-slate-500">
          Mau berbagi cerita baru?{" "}
          <Link href="/admin/blog" className="underline">
            buka panel admin
          </Link>
          .
        </div>
      </main>
    </div>
  );
}

