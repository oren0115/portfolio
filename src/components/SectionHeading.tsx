"use client";

import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  icon,
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {eyebrow}
          </p>
        )}
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              {icon}
            </span>
          )}
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      {action}
    </div>
  );
}

