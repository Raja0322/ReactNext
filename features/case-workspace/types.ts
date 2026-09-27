import { z } from "zod";

export const severitySchema = z.enum(["low", "medium", "high"]);
export const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
export const decisionSchema = z.enum(["pending", "include", "exclude"]);

export const findingSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  entityName: z.string().min(1),
  source: z.string().min(1),
  category: z.string().min(1),
  publishedAt: z.string().min(1),
  severity: severitySchema,
  decision: decisionSchema,
  notes: z.string().max(2000),
});

export const screeningReportSchema = z.object({
  id: z.string().min(1),
  entityId: z.string().min(1),
  generatedAt: z.iso.datetime(),
  sample: z.literal(true),
  overallRisk: riskLevelSchema,
  entityCount: z.number().int().positive(),
  sourceCount: z.number().int().nonnegative(),
  categories: z.array(z.object({ name: z.string(), level: severitySchema })),
  findings: z.array(findingSchema),
});

export type Severity = z.infer<typeof severitySchema>;
export type RiskLevel = z.infer<typeof riskLevelSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type FindingDecision = z.infer<typeof decisionSchema>;
export type ScreeningReport = z.infer<typeof screeningReportSchema>;
export type CaseTab = "overview" | "assessment" | "memo";

export interface CaseMetadata {
  assignedOfficer: string;
  transactionType: string;
  facilityDescription: string;
}

export interface PolicyAssessment {
  sensitiveSector: boolean;
  sector: string;
  notes: string;
  equatorPrinciples: boolean;
  riskLevel: RiskLevel;
  rationale: string;
}
