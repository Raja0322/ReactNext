import { NextResponse, type NextRequest } from "next/server";
import { entitySearchRequestSchema } from "@/features/entity-search/schema";
import type {
  EntitySearchErrorResponse,
  EntitySearchResponse,
} from "@/features/entity-search/types";
import { searchEntities } from "@/services/entity-service";

const responseHeaders = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const result = entitySearchRequestSchema.safeParse({
    query: request.nextUrl.searchParams.get("q"),
  });

  if (!result.success) {
    return NextResponse.json<EntitySearchErrorResponse>(
      { error: "Enter a valid search of 1 to 120 characters." },
      { status: 400, headers: responseHeaders },
    );
  }

  try {
    const entities = await searchEntities(result.data.query);
    return NextResponse.json<EntitySearchResponse>(
      { query: result.data.query, entities },
      { headers: responseHeaders },
    );
  } catch {
    return NextResponse.json<EntitySearchErrorResponse>(
      { error: "The entity directory is unavailable. Please try again." },
      { status: 503, headers: responseHeaders },
    );
  }
}
