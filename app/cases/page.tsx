import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { getEntityById } from "@/services/entity-service";

export const metadata: Metadata = { title: "Case Queue" };

export default async function CaseQueuePage() {
  const entity = await getEntityById("ENT-001");

  return (
    <section aria-labelledby="case-queue-heading">
      <h1 id="case-queue-heading" className="text-2xl font-semibold tracking-tight">Case Queue</h1>
      <p className="mt-1 text-sm text-muted">Open a case to review its entity profile and begin screening.</p>
      {entity && (
        <article className="mt-10 flex flex-col gap-6 border-y border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Sample case · ARMO-2026-0005</p>
            <h2 className="mt-2 text-lg font-semibold">{entity.name}</h2>
            <p className="mt-2 text-sm text-muted">{entity.country} · {entity.sector}</p>
          </div>
          <Link href={`/entities/${entity.id}`} className={buttonStyles({ className: "shrink-0" })}>Open Case</Link>
        </article>
      )}
      <p className="mt-6 text-xs text-muted">This queue contains a sample case. Assessment changes are not stored after leaving the entity workspace.</p>
    </section>
  );
}
