import { CirclePlay } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Entity } from "@/features/entity-search/types";

import type { CaseMetadata } from "./types";

interface OverviewPanelProps {
  entity: Entity;
  metadata: CaseMetadata;
  isRunning: boolean;
  hasReport: boolean;
  onMetadataChange: (patch: Partial<CaseMetadata>) => void;
  onLaunch: () => void;
  onViewReport: () => void;
}

export function OverviewPanel({ entity, metadata, isRunning, hasReport, onMetadataChange, onLaunch, onViewReport }: OverviewPanelProps) {
  const profile = [
    ["Legal name", entity.legalName],
    ["Role", entity.role],
    ["Country", entity.country],
    ["Sector", entity.sector],
    ["GCIF", entity.gcif],
    ["Internal rating", entity.rating],
    ["Description", entity.description],
  ];

  return (
    <div className="grid gap-10 pt-8 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <section aria-labelledby="entity-profile-heading">
          <h2 id="entity-profile-heading" className="text-sm font-bold uppercase tracking-wide">Subject entity profile</h2>
          <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 xl:gap-x-3">
            {profile.map(([label, value]) => (
              <div key={label}>
                <dt className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</dt>
                <dd className="text-sm font-medium leading-5">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="group-structure-heading" className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 id="group-structure-heading" className="text-sm font-bold uppercase tracking-wide">Group structure</h2>
            <span className="bg-foreground px-2 py-1 text-[10px] font-semibold text-white">{entity.group.length} ENTITIES</span>
          </div>
          <ol className="mt-3 divide-y divide-border">
            {entity.group.map((member, index) => (
              <li key={member.id} className="flex items-center justify-between gap-6 py-5">
                <div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <h3 className="text-sm font-semibold">{member.name}</h3>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted">{member.role}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">{index + 1}</p>
                </div>
                <dl className="w-24 shrink-0">
                  <dt className="text-[10px] font-semibold text-muted">Ownership</dt>
                  <dd className="mt-1 text-sm font-semibold">{member.ownership}%</dd>
                </dl>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <aside className="space-y-7">
        <section className="border border-border px-5 py-6 text-center" aria-labelledby="automated-screening-heading">
          <CirclePlay aria-hidden="true" className="mx-auto mb-3" size={25} strokeWidth={1.8} />
          <h2 id="automated-screening-heading" className="text-sm font-bold uppercase">Automated screening</h2>
          <p className="mt-2 text-xs leading-5 text-muted">Screening negative news and ESG controversies across the entire group</p>
          <Button className="mt-4 w-full" disabled={isRunning} onClick={hasReport ? onViewReport : onLaunch}>
            {isRunning ? "Screening in progress…" : hasReport ? "View Screening Results" : "Launch Screening Engine"}
          </Button>
          <p className="mt-3 text-[10px] leading-4 text-muted">Sample screening using fictional findings.</p>
        </section>

        <section aria-labelledby="case-metadata-heading">
          <h2 id="case-metadata-heading" className="text-sm font-semibold uppercase">Case metadata</h2>
          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="assigned-officer" className="mb-2 block text-xs font-semibold">Assigned Officer</label>
              <Input id="assigned-officer" value={metadata.assignedOfficer} maxLength={120} placeholder="Enter officer name" onChange={(event) => onMetadataChange({ assignedOfficer: event.target.value })} />
            </div>
            <div>
              <label htmlFor="transaction-type" className="mb-2 block text-xs font-semibold">Transaction Type</label>
              <select id="transaction-type" className="h-10 w-full rounded-sm border border-border bg-white px-3 text-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand" value={metadata.transactionType} onChange={(event) => onMetadataChange({ transactionType: event.target.value })}>
                <option value="">Select transaction type</option>
                <option>New relationship</option>
                <option>Credit facility</option>
                <option>Annual review</option>
              </select>
            </div>
            <div>
              <label htmlFor="facility-description" className="mb-2 block text-xs font-semibold">Facility Description</label>
              <textarea id="facility-description" className="min-h-20 w-full resize-y rounded-sm border border-border px-3 py-2 text-sm outline-offset-2 placeholder:text-muted focus-visible:outline-2 focus-visible:outline-brand" maxLength={1000} placeholder="Add facility details" value={metadata.facilityDescription} onChange={(event) => onMetadataChange({ facilityDescription: event.target.value })} />
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
