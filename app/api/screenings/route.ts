import { NextResponse } from "next/server";
import { z } from "zod";

import { runScreening } from "@/services/screening-service";

const requestSchema = z.object({ entityId: z.string().min(1).max(100) }).strict();
const responseHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  // Next may use an internal hostname in request.url. The browser-facing Host
  // is the correct fallback; deployed reverse proxies can pin APP_ORIGIN.
  const expectedOrigin = process.env.APP_ORIGIN ?? `${requestUrl.protocol}//${request.headers.get("host") ?? requestUrl.host}`;
  if (origin && origin !== expectedOrigin) {
    return NextResponse.json({ error: "Request not permitted." }, { status: 403, headers: responseHeaders });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "A JSON request is required." }, { status: 415, headers: responseHeaders });
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (body.length > 2048) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413, headers: responseHeaders });
    }
    payload = JSON.parse(body) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: responseHeaders });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid entity identifier is required." }, { status: 400, headers: responseHeaders });
  }

  try {
    const report = await runScreening(parsed.data.entityId);
    if (!report) {
      return NextResponse.json({ error: "Entity not found." }, { status: 404, headers: responseHeaders });
    }
    return NextResponse.json(report, { headers: responseHeaders });
  } catch {
    return NextResponse.json({ error: "Screening is temporarily unavailable." }, { status: 500, headers: responseHeaders });
  }
}
