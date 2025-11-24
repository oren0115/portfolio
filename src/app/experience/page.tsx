import { ExperienceCard } from "@/components/ExperienceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getExperiences } from "@/lib/data";

export const metadata = {
  title: "Experience | Portfolio CMS",
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();
  return (
    <div className="page-wrapper">
      <main className="mx-auto max-w-6xl px-6 py-16 space-y-6">
        <SectionHeading
          title="Experience"
          subtitle="Timeline pekerjaan dan kontribusi utama."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {experiences.length ? (
            experiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))
          ) : (
            <p className="text-slate-500">
              Belum ada data pengalaman. Isi dari dashboard admin.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

