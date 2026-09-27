import { z } from "zod";

export const entitySearchQuerySchema = z
  .string()
  .trim()
  .min(1, "Enter an entity name or GCIF to search.")
  .max(120, "Use 120 characters or fewer.")
  .refine((value) => Array.from(value).every((character) => {
    const code = character.codePointAt(0) ?? 0;
    return code >= 32 && code !== 127;
  }), {
    message: "Remove unsupported characters from your search.",
  });

export const entitySearchRequestSchema = z.object({
  query: entitySearchQuerySchema,
});

export const entitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  legalName: z.string().min(1),
  country: z.string().min(1),
  sector: z.string().min(1),
  gcif: z.string().min(1),
  role: z.string().min(1),
  parent: z.string().min(1),
  rating: z.string().min(1),
  description: z.string().min(1),
  groupName: z.string().min(1),
  group: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      role: z.string().min(1),
      ownership: z.number().min(0).max(100),
    }),
  ),
});

export const entitySearchResponseSchema = z.object({
  query: entitySearchQuerySchema,
  entities: z.array(entitySchema),
});
