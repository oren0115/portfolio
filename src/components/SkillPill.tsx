"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { ISkill } from "@/models/Skill";
import type { WithId } from "@/types/content";

type Props = {
  skill: WithId<ISkill>;
};

const levelCopy: Record<ISkill["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

export function SkillPill({ skill }: Props) {
  const iconIsUrl = Boolean(skill.icon && /^https?:/i.test(skill.icon));

  return (
    <Card className="flex items-center gap-4 px-4 py-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
        {skill.icon ? (
          iconIsUrl ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image
                src={skill.icon}
                alt={skill.name}
                fill
                className="object-cover"
                sizes="40px"
                unoptimized
              />
            </div>
          ) : (
            <span className="text-2xl">{skill.icon}</span>
          )
        ) : (
          <Sparkles className="h-5 w-5 text-slate-400" />
        )}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{skill.name}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {levelCopy[skill.level]}
        </p>
      </div>
    </Card>
  );
}
