import { Shield } from "lucide-react";

import { FindingCard } from "./finding-card";
import { RiskBadge } from "./risk-badge";
import type { Finding, ScreeningReport } from "./types";

interface AssessmentPanelProps {
  report: ScreeningReport;
  onFindingChange: (id: string, patch: Partial<Pick<Finding, "severity" | "decision" | "notes">>) => void;
}

export function AssessmentPanel({ report, onFindingChange }: AssessmentPanelProps) {
  return (
    <div className="grid gap-10 pt-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside aria-labelledby="risk-profile-heading" className="pt-1">
        <h2 id="risk-profile-heading" className="text-xs font-bold uppercase tracking-wide">Risk profile</h2>
        <p className="mt-7 text-[9px] font-semibold uppercase tracking-wider text-muted">Calculated inherent risk</p>
        <RiskBadge level={report.overallRisk} showRisk className="mt-2 min-h-7 w-full" />
        <h3 className="mt-6 text-[9px] font-semibold uppercase tracking-wider text-muted">Risk dimensions</h3>
        <dl className="mt-4 space-y-4">
          {report.categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between gap-4">
              <dt className="text-xs">{category.name}</dt>
              <dd><RiskBadge level={category.level} className="min-w-14" /></dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[10px] leading-5 text-muted">Sample group risk profile. Individual finding decisions inform the memo; they do not recalculate the provider’s inherent risk.</p>
      </aside>
      <section aria-labelledby="negative-news-heading" className="min-w-0">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-brand" aria-hidden="true" />
          <h2 id="negative-news-heading" className="text-sm font-bold uppercase">Negative news findings</h2>
          <span className="ml-auto text-xs text-muted">{report.findings.length} findings</span>
        </div>
        <p className="mt-2 text-[10px] leading-4 text-muted">Fictional sample findings for demonstration. Review each item for inclusion in the memo.</p>
        {report.findings.length ? report.findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} onChange={(patch) => onFindingChange(finding.id, patch)} />
        )) : <p className="py-12 text-sm text-muted">No findings were returned for this entity.</p>}
      </section>
    </div>
  );
}
