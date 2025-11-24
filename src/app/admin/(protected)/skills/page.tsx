import SkillsManager from "@/components/admin/SkillsManager";
import { SectionHeading } from "@/components/SectionHeading";
import { getSkills } from "@/lib/data";

export default async function AdminSkillsPage() {
  const skills = await getSkills();
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Kelola Skills"
        subtitle="Perbarui daftar keahlian dan tingkat kemahiran."
      />
      <SkillsManager initialSkills={skills} />
    </section>
  );
}

