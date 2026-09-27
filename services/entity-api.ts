import {
  entitySearchRequestSchema,
  entitySearchResponseSchema,
} from "@/features/entity-search/schema";
import type {
  EntitySearchRequest,
  EntitySearchResponse,
} from "@/features/entity-search/types";

export async function searchEntityDirectory(
  request: EntitySearchRequest,
  signal?: AbortSignal,
): Promise<EntitySearchResponse> {
  const { query } = entitySearchRequestSchema.parse(request);
  const searchParams = new URLSearchParams({ q: query });
  const response = await fetch(`/api/entities?${searchParams.toString()}`, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error("The entity directory is unavailable. Please try again.");
  }

  const result = entitySearchResponseSchema.safeParse(await response.json());
  if (!result.success) {
    throw new Error("The entity directory is unavailable. Please try again.");
  }

  return result.data;
}
