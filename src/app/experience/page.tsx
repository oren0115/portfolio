import { ExperienceCard } from "@/components/ExperienceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { getExperiences } from "@/lib/data";

export const metadata = {
  title: "Experience | Portfolio CMS",
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();
  return (
    <div className="page-wrapper relative overflow-hidden">
      <BackgroundDecorations />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-16 relative z-10">
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

