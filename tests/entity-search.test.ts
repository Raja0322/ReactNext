import assert from "node:assert/strict";
import test from "node:test";
import {
  findEntityRecord,
  searchEntityRecords,
} from "../features/entity-search/entity-data";
import {
  entitySchema,
  entitySearchQuerySchema,
  entitySearchResponseSchema,
} from "../features/entity-search/schema";

test("search input trims whitespace and rejects empty, oversized, or control-character input", () => {
  assert.equal(entitySearchQuerySchema.parse("  Meridian  "), "Meridian");
  for (const query of ["", "   ", "a".repeat(121), "Meridian\u0000", "Meridian\nLtd"]) {
    assert.equal(entitySearchQuerySchema.safeParse(query).success, false);
  }
});

test("entity directory matches name and GCIF without case sensitivity", () => {
  assert.equal(searchEntityRecords("meridian")[0]?.id, "ENT-001");
  assert.equal(searchEntityRecords(" Ent-001 ")[0]?.name, "Meridian Global Resources Ltd");
  assert.deepEqual(searchEntityRecords("unlisted company"), []);
  assert.deepEqual(searchEntityRecords(""), []);
});

test("entity lookup returns validated group ownership data and no record for an unknown ID", () => {
  const entity = findEntityRecord("ENT-001");
  assert.ok(entity);
  assert.equal(entitySchema.safeParse(entity).success, true);
  assert.deepEqual(entity.group.map((member) => member.ownership), [100, 100, 50]);
  assert.equal(findEntityRecord("ENT-999"), null);
});

test("callers cannot mutate reference records through search results", () => {
  const first = searchEntityRecords("Meridian");
  assert.ok(first[0]);
  first[0].name = "Changed";
  first[0].group[0].ownership = 0;
  const stored = findEntityRecord("ENT-001");
  assert.equal(stored?.name, "Meridian Global Resources Ltd");
  assert.equal(stored?.group[0].ownership, 100);
});

test("response boundary rejects missing entity fields and invalid ownership", () => {
  assert.equal(entitySearchResponseSchema.safeParse({ query: "Meridian", entities: [{ id: "ENT-001" }] }).success, false);
  const entity = findEntityRecord("ENT-001");
  assert.ok(entity);
  entity.group[0].ownership = 101;
  assert.equal(entitySearchResponseSchema.safeParse({ query: "Meridian", entities: [entity] }).success, false);
});
