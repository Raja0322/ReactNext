"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchEntityDirectory } from "@/services/entity-api";
import { EntityResult } from "./entity-result";
import { entitySearchQuerySchema } from "./schema";
import type { Entity } from "./types";

export function EntitySearch() {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => () => activeRequest.current?.abort(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeRequest.current) return;

    const result = entitySearchQuerySchema.safeParse(query);
    if (!result.success) {
      setFieldError(result.error.issues[0]?.message ?? "Enter a valid search.");
      return;
    }

    const controller = new AbortController();
    activeRequest.current = controller;
    setFieldError(null);
    setRequestError(null);
    setIsSearching(true);

    try {
      const response = await searchEntityDirectory(
        { query: result.data },
        controller.signal,
      );
      setEntities(response.entities);
      setSubmittedQuery(response.query);
    } catch {
      if (!controller.signal.aborted) {
        setRequestError("We couldn’t search the entity directory. Please try again.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
        activeRequest.current = null;
      }
    }
  }

  return (
    <section aria-labelledby="entity-search-heading">
      <h1 id="entity-search-heading" className="text-2xl font-semibold tracking-tight">
        Entity Search
      </h1>
      <p className="mt-1 text-sm text-muted" id={`${inputId}-description`}>
        Search the global entity reference database to initiate a new risk screening
      </p>

      <form onSubmit={handleSubmit} className="mt-11" noValidate>
        <label htmlFor={inputId} className="sr-only">Entity name or GCIF</label>
        <div className="flex flex-col items-start gap-3 sm:flex-row">
          <div className="w-full flex-1">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <Input
                id={inputId}
                name="query"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (fieldError) setFieldError(null);
                }}
                placeholder="e.g. Meridian Global Resources"
                autoComplete="off"
                maxLength={120}
                disabled={isSearching}
                className="pl-9"
                aria-invalid={Boolean(fieldError)}
                aria-describedby={`${inputId}-description${fieldError ? ` ${inputId}-error` : ""}`}
              />
            </div>
            {fieldError && (
              <p id={`${inputId}-error`} className="mt-2 text-sm text-brand" role="alert">
                {fieldError}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSearching} className="w-full sm:w-34">
            {isSearching && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {isSearching ? "Searching…" : "Search"}
          </Button>
        </div>
      </form>

      {requestError && <p className="mt-4 text-sm text-brand" role="alert">{requestError}</p>}

      <section className="mt-6" aria-labelledby="entity-matches-heading" aria-busy={isSearching}>
        <h2 id="entity-matches-heading" className="text-base font-semibold">
          Matches ({entities.length})
        </h2>
        <p className="sr-only" role="status" aria-live="polite">
          {isSearching ? "Searching the entity directory." : submittedQuery !== null
            ? `${entities.length} ${entities.length === 1 ? "match" : "matches"} found for ${submittedQuery}.`
            : ""}
        </p>
        {entities.map((entity) => <EntityResult key={entity.id} entity={entity} />)}
        {submittedQuery !== null && entities.length === 0 && !isSearching && !requestError && (
          <p className="py-8 text-sm text-muted">
            No entities found for “{submittedQuery}”. Try another entity name or GCIF.
          </p>
        )}
      </section>
    </section>
  );
}
