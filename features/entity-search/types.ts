import type { z } from "zod";
import type {
  entitySchema,
  entitySearchRequestSchema,
  entitySearchResponseSchema,
} from "./schema";

export type Entity = z.infer<typeof entitySchema>;
export type EntitySearchRequest = z.infer<typeof entitySearchRequestSchema>;
export type EntitySearchResponse = z.infer<typeof entitySearchResponseSchema>;

export interface EntitySearchErrorResponse {
  error: string;
}
