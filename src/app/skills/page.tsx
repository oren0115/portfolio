import { SectionHeading } from "@/components/SectionHeading";
import { SkillPill } from "@/components/SkillPill";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { getSkills } from "@/lib/data";

export const metadata = {
  title: "Skills | Portfolio CMS",
};

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  jaringan: "Jaringan",
  database: "Database",
};

export default async function SkillsPage() {
  const skills = await getSkills();
  
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    // Ensure category exists and is valid, default to "frontend" if missing or invalid
    const validCategories = ["frontend", "backend", "jaringan", "database"];
    const category = (skill.category && validCategories.includes(skill.category))
      ? skill.category 
      : "frontend";
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categories = ["frontend", "backend", "jaringan", "database"];

  return (
    <div className="page-wrapper relative overflow-hidden">
      <BackgroundDecorations />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-16 relative z-10">
        <SectionHeading
          title="Skills"
          subtitle="Bahasa pemrograman, framework, dan tools yang dipakai."
        />
        {skills.length ? (
          <div className="space-y-10">
            {categories.map((category) => {
              const categorySkills = skillsByCategory[category] || [];
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {categoryLabels[category]}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categorySkills.map((skill) => (
                      <SkillPill key={skill._id} skill={skill} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500">
            Data skill belum ada. Kelola lewat dashboard admin.
          </p>
        )}
      </main>
    </div>
  );
}

