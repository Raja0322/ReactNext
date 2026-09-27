import "server-only";

import type { ScreeningReport } from "@/features/case-workspace/types";
import { getEntityById } from "@/services/entity-service";

/** Replace this adapter with an authorized screening provider before production use. */
export async function runScreening(entityId: string): Promise<ScreeningReport | null> {
  const entity = await getEntityById(entityId);
  if (!entity) return null;

  // A short delay makes the asynchronous provider lifecycle visible in this demo.
  await new Promise<void>((resolve) => setTimeout(resolve, 1800));

  return {
    id: "ARMO-2026-0005",
    entityId: entity.id,
    generatedAt: new Date().toISOString(),
    sample: true,
    overallRisk: "critical",
    entityCount: entity.group.length,
    sourceCount: 84,
    categories: [
      { name: "Environmental", level: "high" },
      { name: "Labour", level: "high" },
      { name: "Community", level: "high" },
      { name: "Governance", level: "medium" },
      { name: "Supply Chain", level: "medium" },
    ],
    findings: [
      {
        id: "finding-governance",
        title: "Meridian Global Resources faces shareholder resolution on plantation disclosure",
        summary:
          "In this fictional scenario, shareholders request more detailed plantation disclosures, including land-use practices and grievance reporting. The resolution seeks stronger governance and transparency. Management has committed to reviewing its reporting framework.",
        entityName: entity.name,
        source: "ESG Governance Monitor · sample source",
        category: "Governance",
        publishedAt: "18 Sep 2026",
        severity: "medium",
        decision: "pending",
        notes: "",
      },
      {
        id: "finding-labour",
        title: "Investigation finds recruitment fee debt among migrant harvesters at Kalimantan estates",
        summary:
          "This fictional sample describes recruitment fees paid by migrant workers at a group estate. The illustrative report raises concerns about repayment periods and worker protections. The company describes a review of recruitment agents and a proposed reimbursement programme.",
        entityName: "Kestral",
        source: "Responsible Work Review · sample source",
        category: "Labour",
        publishedAt: "15 Sep 2026",
        severity: "high",
        decision: "pending",
        notes: "",
      },
    ],
  };
}
