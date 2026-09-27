import { Printer } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import type { Entity } from "@/features/entity-search/types";

import { getIncludedFindings, getPendingFindingsCount } from "./case-state";
import { PolicyChecks } from "./policy-checks";
import { RiskBadge } from "./risk-badge";
import type { CaseMetadata, PolicyAssessment, ScreeningReport } from "./types";

interface MemoPanelProps {
  entity: Entity;
  report: ScreeningReport;
  metadata: CaseMetadata;
  policy: PolicyAssessment;
  onPolicyChange: (patch: Partial<PolicyAssessment>) => void;
}

export function MemoPanel({ entity, report, metadata, policy, onPolicyChange }: MemoPanelProps) {
  const includedFindings = getIncludedFindings(report);
  const pendingCount = getPendingFindingsCount(report);
  const memoFields = [
    ["Call tracking code", report.id],
    ["Client name", entity.name],
    ["GCIF / BCIF", entity.gcif],
    ["Group core identifier", `${entity.name} (client is Group Core)`],
    ["Country", entity.country],
    ["Industry", "Agribusiness · Diversified"],
    ...(metadata.assignedOfficer ? [["Assigned officer", metadata.assignedOfficer]] : []),
    ...(metadata.transactionType ? [["Transaction type", metadata.transactionType]] : []),
  ];

  return (
    <div className="grid gap-10 pt-10 xl:grid-cols-[minmax(0,1fr)_280px] print:block">
      <article aria-label="Screening memorandum" className="min-w-0 px-1 sm:px-6 print:px-0">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b-[3px] border-brand pb-7">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight">Memo Preview</h2>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted">Mitsubishi UFJ Financial Group</p>
          </div>
          <BrandLogo className="mt-1" />
        </header>
        <dl className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {memoFields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
              <dd className="mt-3 text-sm font-semibold leading-6">{value}</dd>
            </div>
          ))}
        </dl>

        {metadata.facilityDescription && <section className="mt-9">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted">Facility description</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{metadata.facilityDescription}</p>
        </section>}

        <section className="mt-10 border-t border-border pt-7" aria-labelledby="memo-assessment-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 id="memo-assessment-heading" className="text-sm font-semibold">Risk assessment</h3>
            <RiskBadge level={policy.riskLevel} showRisk />
          </div>
          <p className="mt-4 text-xs leading-6">Sensitive sector: {policy.sensitiveSector ? policy.sector || "Not specified" : "No"}. Equator Principles: {policy.equatorPrinciples ? "Applicable" : "Not applicable"}.</p>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-muted">{policy.rationale || "Add the risk rationale in Policy Checks & Rationale."}</p>
          {policy.notes && <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-muted">Policy notes: {policy.notes}</p>}
        </section>

        <section className="mt-8" aria-labelledby="memo-findings-heading">
          <h3 id="memo-findings-heading" className="text-sm font-semibold">Included findings ({includedFindings.length})</h3>
          {includedFindings.length ? <ol className="mt-4 space-y-5">
            {includedFindings.map((finding) => <li key={finding.id} className="break-inside-avoid">
              <div className="flex items-start gap-2"><RiskBadge level={finding.severity} className="mt-0.5 shrink-0" /><h4 className="text-xs font-semibold leading-5">{finding.title}</h4></div>
              <p className="mt-2 text-xs leading-6 text-muted">{finding.summary}</p>
              {finding.notes && <p className="mt-2 whitespace-pre-wrap text-xs leading-6">Reviewer notes: {finding.notes}</p>}
            </li>)}
          </ol> : <p className="mt-3 text-xs leading-6 text-muted">No findings included. Review the findings in Screening & Assessment to add them to this memo.</p>}
          {pendingCount > 0 && <p className="mt-4 text-xs text-muted">Draft · {pendingCount} {pendingCount === 1 ? "finding awaits" : "findings await"} a review decision.</p>}
        </section>
        <footer className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <p className="max-w-sm text-[10px] leading-5 text-muted">Sample memorandum · fictional demonstration data. Changes are retained only while this case remains open.</p>
          <Button variant="secondary" className="print:hidden" onClick={() => window.print()}><Printer size={15} aria-hidden="true" />Print memo</Button>
        </footer>
      </article>
      <PolicyChecks policy={policy} onChange={onPolicyChange} />
    </div>
  );
}
