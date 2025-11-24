"use client";

import { BriefcaseBusiness } from "lucide-react";

import type { IExperience } from "@/models/Experience";
import type { WithId } from "@/types/content";

type Props = {
  experience: WithId<IExperience>;
};

export function ExperienceCard({ experience }: Props) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <BriefcaseBusiness className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {experience.startDate} — {experience.endDate ?? "Present"}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            {experience.role}
          </h3>
          <p className="text-sm text-slate-500">{experience.company}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600">{experience.description}</p>
      {experience.highlights?.length ? (
        <ul className="space-y-1 text-sm text-slate-600">
          {experience.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

