import { SectionHeading } from "@/components/SectionHeading";
import { SkillPill } from "@/components/SkillPill";
import { getSkills } from "@/lib/data";

export const metadata = {
  title: "Skills | Portfolio CMS",
};

export default async function SkillsPage() {
  const skills = await getSkills();
  return (
    <div className="page-wrapper">
      <main className="mx-auto max-w-6xl px-6 py-16 space-y-6">
        <SectionHeading
          title="Skills"
          subtitle="Bahasa pemrograman, framework, dan tools yang dipakai."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {skills.length ? (
            skills.map((skill) => <SkillPill key={skill._id} skill={skill} />)
          ) : (
            <p className="text-slate-500">
              Data skill belum ada. Kelola lewat dashboard admin.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

