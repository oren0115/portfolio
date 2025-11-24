import BlogManager from "@/components/admin/BlogManager";
import { SectionHeading } from "@/components/SectionHeading";
import { getBlogPosts } from "@/lib/data";

export default async function AdminBlogPage() {
  const blogs = await getBlogPosts();
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Kelola Blog"
        subtitle="Publish artikel baru atau update konten lama."
      />
      <BlogManager initialBlogs={blogs} />
    </section>
  );
}

