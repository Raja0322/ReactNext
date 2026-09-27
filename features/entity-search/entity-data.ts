import type { Entity } from "./types";

// Fictional reference records, isolated here until an upstream directory is connected.
const entities: readonly Entity[] = [
  {
    id: "ENT-001",
    name: "Meridian Global Resources Ltd",
    legalName: "Meridian",
    country: "Singapore",
    sector: "Agri-business",
    gcif: "ENT-001",
    role: "Group Corp",
    parent: "bnm1",
    rating: "BBB",
    description: "Global resources",
    groupName: "Meridian Agri Group",
    group: [
      { id: "1", name: "Meridian Agri", role: "Parent", ownership: 100 },
      { id: "2", name: "Kestral", role: "Subsidiary", ownership: 100 },
      {
        id: "3",
        name: "Meridian health",
        role: "Operating company",
        ownership: 50,
      },
    ],
  },
];

export function searchEntityRecords(query: string): Entity[] {
  console.log("searchEntityRecords====");
  const normalizedQuery = query.trim().toLocaleLowerCase("en");
  if (!normalizedQuery) return [];

  return entities
    .filter((entity) =>
      [entity.name, entity.legalName, entity.gcif, entity.groupName].some((value) =>
        value.toLocaleLowerCase("en").includes(normalizedQuery),
      ),
    )
    .map((entity) => structuredClone(entity));
}

export function findEntityRecord(id: string): Entity | null {
    console.log("findEntityRecord===="+entities);
  const entity = entities.find((record) => record.id === id);
  return entity ? structuredClone(entity) : null;
}
