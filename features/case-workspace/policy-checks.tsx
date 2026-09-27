import { ShieldCheck } from "lucide-react";

import { riskLevelSchema, type PolicyAssessment } from "./types";

interface PolicyChecksProps {
  policy: PolicyAssessment;
  onChange: (patch: Partial<PolicyAssessment>) => void;
}

const fieldClass = "w-full rounded-sm border border-border bg-white px-3 py-2 text-sm outline-offset-2 placeholder:text-muted focus-visible:outline-2 focus-visible:outline-brand";

export function PolicyChecks({ policy, onChange }: PolicyChecksProps) {
  return (
    <aside aria-labelledby="policy-checks-heading" className="print:hidden">
      <h2 id="policy-checks-heading" className="flex items-center gap-2.5 text-sm font-bold uppercase"><ShieldCheck className="shrink-0 text-brand" size={18} aria-hidden="true" />Policy checks & rationale</h2>
      <div className="mt-8 space-y-7">
        <div>
          <label className="flex items-center gap-3 text-xs font-semibold uppercase">
            <input type="checkbox" className="size-4 accent-brand" checked={policy.sensitiveSector} onChange={(event) => onChange({ sensitiveSector: event.target.checked })} />
            Sensitive sector
          </label>
          {policy.sensitiveSector && <div className="ml-7 mt-4">
            <label htmlFor="sensitive-sector-name" className="sr-only">Sensitive sector name</label>
            <input id="sensitive-sector-name" className={fieldClass} value={policy.sector} maxLength={120} onChange={(event) => onChange({ sector: event.target.value })} />
          </div>}
          <div className="mt-5">
            <label htmlFor="policy-notes" className="sr-only">Policy notes</label>
            <textarea id="policy-notes" className={`${fieldClass} min-h-20 resize-y`} placeholder="Notes" maxLength={2000} value={policy.notes} onChange={(event) => onChange({ notes: event.target.value })} />
          </div>
        </div>
        <label className="flex items-center gap-3 text-xs font-semibold uppercase">
          <input type="checkbox" className="size-4 accent-brand" checked={policy.equatorPrinciples} onChange={(event) => onChange({ equatorPrinciples: event.target.checked })} />
          Equator principles
        </label>
        <div>
          <label htmlFor="memo-risk-level" className="mb-3 block text-[10px] font-semibold uppercase tracking-wide text-muted">Assessed risk level</label>
          <select id="memo-risk-level" className={`${fieldClass} uppercase`} value={policy.riskLevel} onChange={(event) => {
            const parsed = riskLevelSchema.safeParse(event.target.value);
            if (parsed.success) onChange({ riskLevel: parsed.data });
          }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label htmlFor="risk-rationale" className="mb-3 block text-[10px] font-semibold uppercase tracking-wide text-muted">Risk rationale</label>
          <textarea id="risk-rationale" className={`${fieldClass} min-h-28 resize-y`} maxLength={2000} placeholder="Briefly justify the assessment…" value={policy.rationale} onChange={(event) => onChange({ rationale: event.target.value })} />
        </div>
      </div>
    </aside>
  );
}
