import ExperienceManager from "@/components/admin/ExperienceManager";
import { SectionHeading } from "@/components/SectionHeading";
import { getExperiences } from "@/lib/data";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Kelola Experience"
        subtitle="Susun timeline pengalaman kerja."
      />
      <ExperienceManager initialExperiences={experiences} />
    </section>
  );
}

