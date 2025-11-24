"use client";

import { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <Alert className="flex flex-col items-center gap-3 text-center">
      <div className="text-3xl">{icon}</div>
      <div>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
      {action}
    </Alert>
  );
}

