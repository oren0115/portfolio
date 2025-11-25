import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { getProjects } from "@/lib/data";

export const metadata = {
  title: "Projects | Portfolio CMS",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="page-wrapper relative overflow-hidden">
      <BackgroundDecorations />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-16 relative z-10">
        <SectionHeading
          title="Projects"
          subtitle="Semua project yang dipublikasikan."
        />
        {projects.length ? (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center shadow-sm">
            <p className="text-neutral-500">
              Belum ada project. Masuk sebagai admin untuk menambahkan.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
