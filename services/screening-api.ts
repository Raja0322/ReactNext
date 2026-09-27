import { screeningReportSchema, type ScreeningReport } from "@/features/case-workspace/types";

export interface ScreeningRequest {
  entityId: string;
}

export async function requestScreening(
  request: ScreeningRequest,
  signal?: AbortSignal,
): Promise<ScreeningReport> {
  const response = await fetch("/api/screenings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(request),
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "This entity is no longer available. Return to entity search and try again."
        : "Screening could not be completed. Please try again.",
    );
  }

  const payload: unknown = await response.json();
  const parsed = screeningReportSchema.safeParse(payload);
  if (!parsed.success || parsed.data.entityId !== request.entityId) {
    throw new Error("The screening response could not be verified. Please try again.");
  }
  return parsed.data;
}
