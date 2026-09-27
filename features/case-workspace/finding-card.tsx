import { CircleCheck, CircleX } from "lucide-react";

import { RiskBadge } from "./risk-badge";
import { severitySchema, type Finding } from "./types";

interface FindingCardProps {
  finding: Finding;
  onChange: (patch: Partial<Pick<Finding, "severity" | "decision" | "notes">>) => void;
}

export function FindingCard({ finding, onChange }: FindingCardProps) {
  return (
    <article className="grid gap-5 border-b border-border py-6 lg:grid-cols-[minmax(0,1fr)_128px]" aria-labelledby={`${finding.id}-title`}>
      <div className="min-w-0">
        <div className="flex items-start gap-2.5">
          <RiskBadge level={finding.severity} className="mt-0.5 shrink-0" />
          <h3 id={`${finding.id}-title`} className="text-sm font-semibold leading-5">{finding.title}</h3>
        </div>
        <p className="mt-3 text-xs leading-6 text-muted">{finding.summary}</p>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[9px] uppercase leading-4 tracking-wide">
          <div><dt className="sr-only">Entity</dt><dd>{finding.entityName}</dd></div>
          <div><dt className="sr-only">Source</dt><dd>{finding.source}</dd></div>
          <div><dt className="sr-only">Category</dt><dd className="font-semibold text-brand">{finding.category}</dd></div>
          <div><dt className="sr-only">Published</dt><dd className="text-muted">{finding.publishedAt}</dd></div>
        </dl>
        <label htmlFor={`${finding.id}-notes`} className="sr-only">Review notes for {finding.title}</label>
        <textarea id={`${finding.id}-notes`} rows={2} maxLength={2000} className="mt-5 w-full resize-y rounded-sm border border-transparent px-2 py-2 text-xs outline-offset-2 placeholder:text-muted hover:border-border focus:border-border focus-visible:outline-2 focus-visible:outline-brand" placeholder="Click to add review comments…" value={finding.notes} onChange={(event) => onChange({ notes: event.target.value })} />
      </div>
      <div className="flex flex-wrap items-start gap-5 lg:flex-col lg:gap-6">
        <div className="w-32">
          <label htmlFor={`${finding.id}-severity`} className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-muted">Severity<span className="sr-only"> for {finding.title}</span></label>
          <select id={`${finding.id}-severity`} className="h-9 w-full rounded-sm border border-border bg-white px-2 text-[10px] font-semibold uppercase outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand" value={finding.severity} onChange={(event) => {
            const parsed = severitySchema.safeParse(event.target.value);
            if (parsed.success) onChange({ severity: parsed.data });
          }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <fieldset className="w-32 space-y-1.5">
          <legend className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-muted">Decision<span className="sr-only"> for {finding.title}</span></legend>
          <button type="button" aria-pressed={finding.decision === "include"} onClick={() => onChange({ decision: finding.decision === "include" ? "pending" : "include" })} className={`flex min-h-9 w-full items-center gap-2 rounded-sm border px-3 py-2 text-[10px] font-semibold uppercase transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand ${finding.decision === "include" ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-border hover:bg-emerald-50"}`}>
            <CircleCheck size={13} className="text-emerald-700" aria-hidden="true" />Include
          </button>
          <button type="button" aria-pressed={finding.decision === "exclude"} onClick={() => onChange({ decision: finding.decision === "exclude" ? "pending" : "exclude" })} className={`flex min-h-9 w-full items-center gap-2 rounded-sm border px-3 py-2 text-[10px] font-semibold uppercase transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand ${finding.decision === "exclude" ? "border-brand bg-red-50 text-brand" : "border-border hover:bg-red-50"}`}>
            <CircleX size={13} className="text-brand" aria-hidden="true" />Exclude
          </button>
        </fieldset>
      </div>
    </article>
  );
}
