import "server-only";

import {
  findEntityRecord,
  searchEntityRecords,
} from "@/features/entity-search/entity-data";
import { entitySearchQuerySchema } from "@/features/entity-search/schema";
import type { Entity } from "@/features/entity-search/types";

export async function searchEntities(query: string): Promise<Entity[]> {
  return searchEntityRecords(entitySearchQuerySchema.parse(query));
}

export async function getEntityById(id: string): Promise<Entity | null> {
  return findEntityRecord(id);
}
