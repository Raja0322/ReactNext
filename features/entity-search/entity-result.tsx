import Link from "next/link";
import { Building2 } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import type { Entity } from "./types";

export function EntityResult({ entity }: { entity: Entity }) {
  const details = [
    ["Country", entity.country],
    ["Sector", entity.sector],
    ["GCIF", entity.gcif],
    ["Entity role", entity.role],
  ];

  return (
    <article className="flex flex-col justify-between gap-6 px-1 py-6 sm:px-5 lg:flex-row lg:items-center">
      <div>
        <h3 className="flex items-start gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
          <Building2 className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
          {entity.name}
        </h3>
        <dl className="mt-4 grid grid-cols-2 gap-x-7 gap-y-4 sm:flex sm:flex-wrap">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase text-muted">{label}</dt>
              <dd className="mt-1 text-sm font-medium sm:text-base">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex items-end justify-between gap-4 lg:flex-col lg:items-center lg:gap-5">
        <dl className="lg:text-center">
          <dt className="text-xs font-semibold uppercase text-muted">Parent</dt>
          <dd className="mt-1 text-base font-medium">{entity.parent}</dd>
        </dl>
        <Link
          href={`/entities/${encodeURIComponent(entity.id)}`}
          className={buttonStyles({ className: "whitespace-nowrap" })}
          aria-label={`Confirm entity ${entity.name}`}
        >
          Confirm Entity
        </Link>
      </div>
    </article>
  );
}
