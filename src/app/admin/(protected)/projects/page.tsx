import ProjectsManager from "@/components/admin/ProjectsManager";
import { SectionHeading } from "@/components/SectionHeading";
import { getProjects } from "@/lib/data";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Kelola Projects"
        subtitle="Tambah, edit, atau hapus project portfolio."
      />
      <ProjectsManager initialProjects={projects} />
    </section>
  );
}

