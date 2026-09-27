import assert from "node:assert/strict";
import test from "node:test";

import { caseReducer, getIncludedFindings, getPendingFindingsCount, initialCaseState } from "../features/case-workspace/case-state";
import { screeningReportSchema, type ScreeningReport } from "../features/case-workspace/types";

const report: ScreeningReport = {
  id: "sample-case",
  entityId: "ENT-001",
  generatedAt: "2026-09-25T00:00:00.000Z",
  sample: true,
  overallRisk: "critical",
  entityCount: 3,
  sourceCount: 84,
  categories: [{ name: "Governance", level: "medium" }],
  findings: [{
    id: "finding-1",
    title: "Fictional sample finding",
    summary: "Sample text",
    entityName: "Sample entity",
    source: "Sample source",
    category: "Governance",
    publishedAt: "18 Sep 2026",
    severity: "medium",
    decision: "pending",
    notes: "",
  }],
};

test("screening lifecycle adopts provider risk and guards duplicate starts", () => {
  const started = caseReducer(initialCaseState, { type: "start-screening" });
  assert.equal(started.tab, "assessment");
  assert.equal(started.status, "running");
  assert.equal(caseReducer(started, { type: "start-screening" }), started);
  const complete = caseReducer(started, { type: "screening-complete", report });
  assert.equal(complete.status, "complete");
  assert.equal(complete.policy.riskLevel, report.overallRisk);
});

test("review decisions and severity survive tab changes and determine memo inclusion", () => {
  const complete = caseReducer(initialCaseState, { type: "screening-complete", report });
  assert.equal(getPendingFindingsCount(complete.report), 1);
  const reviewed = caseReducer(complete, { type: "update-finding", id: "finding-1", patch: { decision: "include", severity: "high", notes: "Escalate for review" } });
  const memo = caseReducer(reviewed, { type: "change-tab", tab: "memo" });
  assert.equal(getIncludedFindings(memo.report).length, 1);
  assert.equal(getIncludedFindings(memo.report)[0].severity, "high");
  assert.equal(getIncludedFindings(memo.report)[0].notes, "Escalate for review");
  assert.equal(getPendingFindingsCount(memo.report), 0);
  assert.equal(report.findings[0].decision, "pending", "the original provider response is not mutated");
  const excluded = caseReducer(memo, { type: "update-finding", id: "finding-1", patch: { decision: "exclude" } });
  assert.equal(getIncludedFindings(excluded.report).length, 0);
});

test("screening failure preserves metadata and can be retried", () => {
  const edited = caseReducer(initialCaseState, { type: "update-metadata", patch: { assignedOfficer: "Case officer" } });
  const failed = caseReducer(edited, { type: "screening-failed", message: "Unavailable" });
  assert.equal(failed.status, "error");
  const retry = caseReducer(failed, { type: "start-screening" });
  assert.equal(retry.error, null);
  assert.equal(retry.metadata.assignedOfficer, "Case officer");
});

test("runtime response validation rejects unsupported risk levels and malformed counts", () => {
  assert.equal(screeningReportSchema.safeParse(report).success, true);
  assert.equal(screeningReportSchema.safeParse({ ...report, overallRisk: "unknown" }).success, false);
  assert.equal(screeningReportSchema.safeParse({ ...report, entityCount: -1 }).success, false);
  assert.equal(screeningReportSchema.safeParse({ ...report, generatedAt: "yesterday" }).success, false);
});
