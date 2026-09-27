import type {
  CaseMetadata,
  CaseTab,
  Finding,
  PolicyAssessment,
  ScreeningReport,
} from "./types";

export interface CaseState {
  tab: CaseTab;
  status: "idle" | "running" | "complete" | "error";
  report: ScreeningReport | null;
  error: string | null;
  metadata: CaseMetadata;
  policy: PolicyAssessment;
}

export const initialCaseState: CaseState = {
  tab: "overview",
  status: "idle",
  report: null,
  error: null,
  metadata: { assignedOfficer: "", transactionType: "", facilityDescription: "" },
  policy: {
    sensitiveSector: true,
    sector: "Palm oil",
    notes: "",
    equatorPrinciples: false,
    riskLevel: "critical",
    rationale: "",
  },
};

export type CaseAction =
  | { type: "change-tab"; tab: CaseTab }
  | { type: "start-screening" }
  | { type: "screening-complete"; report: ScreeningReport }
  | { type: "screening-failed"; message: string }
  | { type: "update-finding"; id: string; patch: Partial<Pick<Finding, "severity" | "decision" | "notes">> }
  | { type: "update-metadata"; patch: Partial<CaseMetadata> }
  | { type: "update-policy"; patch: Partial<PolicyAssessment> };

export function caseReducer(state: CaseState, action: CaseAction): CaseState {
  switch (action.type) {
    case "change-tab":
      return { ...state, tab: action.tab };
    case "start-screening":
      if (state.status === "running") return state;
      return { ...state, tab: "assessment", status: "running", error: null };
    case "screening-complete":
      return {
        ...state,
        status: "complete",
        report: action.report,
        error: null,
        policy: { ...state.policy, riskLevel: action.report.overallRisk },
      };
    case "screening-failed":
      return { ...state, status: "error", error: action.message };
    case "update-finding":
      if (!state.report) return state;
      return {
        ...state,
        report: {
          ...state.report,
          findings: state.report.findings.map((finding) =>
            finding.id === action.id ? { ...finding, ...action.patch } : finding,
          ),
        },
      };
    case "update-metadata":
      return { ...state, metadata: { ...state.metadata, ...action.patch } };
    case "update-policy":
      return { ...state, policy: { ...state.policy, ...action.patch } };
  }
}

export function getIncludedFindings(report: ScreeningReport | null): Finding[] {
  return report?.findings.filter((finding) => finding.decision === "include") ?? [];
}

export function getPendingFindingsCount(report: ScreeningReport | null): number {
  return report?.findings.filter((finding) => finding.decision === "pending").length ?? 0;
}
