import Link from "next/link";

import { getBlogPosts, getExperiences, getProjects, getSkills } from "@/lib/data";

export default async function AdminDashboardPage() {
  const [projects, blogs, skills, experiences] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getSkills(),
    getExperiences(),
  ]);

  const stats = [
    { label: "Projects", value: projects.length, href: "/admin/projects" },
    { label: "Blog Posts", value: blogs.length, href: "/admin/blog" },
    { label: "Skills", value: skills.length, href: "/admin/skills" },
    { label: "Experience", value: experiences.length, href: "/admin/experience" },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-3xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Alur kerja CRUD
        </h2>
        <ol className="list-decimal space-y-2 pl-6 text-sm text-slate-600">
          <li>Pilih menu konten (Projects, Blog, Skills, Experience).</li>
          <li>
            Gunakan form di bagian atas untuk membuat atau mengedit data.
          </li>
          <li>Gunakan tombol Edit/Delete pada daftar untuk mengelola data.</li>
          <li>Perubahan otomatis tampil di halaman publik.</li>
        </ol>
      </div>
    </section>
  );
}

