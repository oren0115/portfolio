import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getProjects } from "@/lib/data";

export const metadata = {
  title: "Projects | Portfolio CMS",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="page-wrapper">
      <main className="mx-auto max-w-6xl px-6 py-16 space-y-6">
        <SectionHeading
          title="Projects"
          subtitle="Semua project yang dipublikasikan."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.length ? (
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          ) : (
            <p className="text-slate-500">
              Belum ada project. Masuk sebagai admin untuk menambahkan.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

