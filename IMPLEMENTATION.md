# Complete implementation

The architecture, screenshot analysis, assumptions, and run instructions are in README.md below. Each authored source file is included in full. Generated dependency lockfiles, framework instructions, build output, and browser screenshots are delivered separately in the project.

## Project structure

```text
package.json
tsconfig.json
next-env.d.ts
next.config.ts
postcss.config.mjs
eslint.config.mjs
playwright.config.ts
.gitignore
README.md
app/api/entities/route.ts
app/api/screenings/route.ts
app/cases/page.tsx
app/dashboard/page.tsx
app/entities/[id]/page.tsx
app/error.tsx
app/globals.css
app/layout.tsx
app/loading.tsx
app/not-found.tsx
app/page.tsx
app/reference/page.tsx
components/layout/app-shell.tsx
components/layout/brand-logo.tsx
components/layout/navigation.ts
components/ui/button.tsx
components/ui/input.tsx
features/case-workspace/assessment-panel.tsx
features/case-workspace/case-state.ts
features/case-workspace/case-tabs.tsx
features/case-workspace/case-workspace.tsx
features/case-workspace/finding-card.tsx
features/case-workspace/memo-panel.tsx
features/case-workspace/overview-panel.tsx
features/case-workspace/policy-checks.tsx
features/case-workspace/risk-badge.tsx
features/case-workspace/screening-progress.tsx
features/case-workspace/types.ts
features/entity-search/entity-data.ts
features/entity-search/entity-result.tsx
features/entity-search/entity-search.tsx
features/entity-search/schema.ts
features/entity-search/types.ts
services/entity-api.ts
services/entity-service.ts
services/screening-api.ts
services/screening-service.ts
tests/entity-search.test.ts
tests/screening.test.ts
tests/workflow.spec.ts
scripts/export-source.mjs
```

FILE: package.json

````json
{
  "name": "armo-risk-screening",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --hostname 127.0.0.1",
    "build": "next build",
    "start": "next start --hostname 127.0.0.1",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "tsx --test tests/*.test.ts",
    "test:e2e": "playwright test",
    "source:export": "node scripts/export-source.mjs"
  },
  "engines": {
    "node": ">=20.9.0"
  },
  "dependencies": {
    "lucide-react": "1.48.0",
    "next": "16.3.6",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "server-only": "0.0.1",
    "zod": "4.6.5"
  },
  "devDependencies": {
    "@axe-core/playwright": "4.13.0",
    "@playwright/test": "1.63.0",
    "@tailwindcss/postcss": "4.3.3",
    "@types/node": "26.6.2",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "@typescript/native": "npm:typescript@7.0.2",
    "eslint": "9.39.5",
    "eslint-config-next": "16.3.6",
    "tailwindcss": "4.3.3",
    "tsx": "4.23.15",
    "typescript": "npm:@typescript/typescript6@6.0.2"
  }
}
````

FILE: tsconfig.json

````json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

FILE: next-env.d.ts

````ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";
import "./.next/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
````

FILE: next.config.ts

````ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
      ],
    }];
  },
};

export default nextConfig;
````

FILE: postcss.config.mjs

````js
const config = { plugins: { "@tailwindcss/postcss": {} } };

export default config;
````

FILE: eslint.config.mjs

````js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".next/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
]);
````

FILE: playwright.config.ts

````ts
import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const localChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  (existsSync(localChrome) ? localChrome : undefined);

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    browserName: "chromium",
    viewport: { width: 1440, height: 900 },
    launchOptions: { executablePath },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
````

FILE: .gitignore

````text
node_modules/
.next/
out/
coverage/
playwright-report/
test-results/
*.tsbuildinfo
.env*
!.env.example
.DS_Store
````

FILE: README.md

````markdown
# Armo Reputation Risk Screening Platform

A runnable Next.js implementation of the six supplied screen states, using fictional mock data. The application recreates the white MUFG header, sidebar, red actions, entity search, group overview, screening progress, findings assessment, and memo preview. PowerPoint/browser chrome in the photographs is excluded.

## Run

Node.js 20.9 or later is required; use a supported Node.js LTS release for deployment.

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:3000>. Search for **Meridian** or **ENT-001**, choose **Confirm Entity**, then **Launch Screening Engine**. Review the findings with **Include** / **Exclude** and open **Memo Preview**. Case metadata, decisions, notes, and policy fields are editable. **Print memo** uses the browser’s print dialog, including its Save as PDF option.

```sh
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
npm start
```

The browser tests use an installed Google Chrome on macOS when available. Otherwise install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to your browser executable. Development and production servers both use port 3000; stop one before starting the other.

## Versions

Versions were checked against the npm registry and pinned in `package.json` and `package-lock.json`:

| Technology | Version |
| --- | --- |
| Next.js | 16.3.6 |
| React / React DOM | 19.3.0 |
| TypeScript compiler | 7.0.2 |
| Tailwind CSS | 4.3.3 |

TypeScript 7 does not expose the compiler API required by the installed ESLint tooling. This project follows [Microsoft’s side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0): `@typescript/native` aliases TypeScript 7 for `tsc`, while `typescript` aliases the TypeScript 6 compatibility API for tools such as ESLint and Next.js. `npm run typecheck` uses the TypeScript 7 compiler.

## Screen analysis and assumptions

| Reference | Implemented state |
| --- | --- |
| screen1.jpeg | Empty Entity Search, Matches (0) |
| screen6.jpeg | Search result, entity details, Confirm Entity |
| screen5.jpeg | Subject entity profile, group ownership, screening action, case metadata |
| screen4.jpeg | Asynchronous screening progress |
| screen3.jpeg | Risk profile, negative news findings, severity and review decisions |
| screen2.jpeg | Memo document and policy checks/rationale |

The common structure is a branded horizontal header, left navigation, and main workspace. Search and confirmation buttons share a primary red style. The case screens share an entity heading and three tabs. Profile values use semantic description lists; repeated findings and ownership rows are data driven. The desktop side panels stack beneath their main content on smaller screens. Mobile navigation expands in normal document flow, and case tabs scroll within their own row.

The photographs contain perspective distortion and some unreadable text. The implementation makes these explicit assumptions:

- The product name is **Armo Reputation Risk Screening Platform**. Arial is used as a local system font matching the reference’s general appearance.
- MUFG branding is recreated with a lightweight SVG mark and text. Replace this approximation with an approved brand asset when one is supplied.
- The screenshots disagree on GCIF values; **ENT-001** is used consistently throughout the mock record and memo. The visible parent value **bnm1** is preserved.
- The group has Meridian Agri (100%), Kestral (100%), and Meridian health (50%), as shown. These are sample reference records.
- Two sample findings are provided, matching the two visible findings. The progress screen uses an honest in-progress status instead of claiming seven returned findings. The 84-source count is illustrative and no external sources are queried.
- Small article copy and source names are fictional substitutes. No live media or sanctions searches run.
- The memo’s editable assessed risk starts from the screening report’s **Critical** risk. The conflicting **Low** value in the memo photograph is not silently applied. A reviewer can change the assessed risk and supply a rationale.
- Dashboard, Case Queue, and Reference were visible in navigation but had no supplied designs. They are restrained supporting pages using the same visual language.

## Architecture

```text
app/
  layout.tsx                 Server root layout and metadata
  page.tsx                   Entity Search route
  entities/[id]/page.tsx      Server-side entity lookup and case workspace
  api/entities/route.ts      Validated entity search endpoint
  api/screenings/route.ts    Validated screening endpoint
  dashboard/                 Supporting dashboard
  cases/                     Sample case queue
  reference/                 Workflow reference
  error.tsx / not-found.tsx / loading.tsx
components/
  layout/                    Branding, navigation, responsive shell
  ui/                        Typed Button and Input
features/
  entity-search/             Search UI, result row, schema, types, fixtures
  case-workspace/            Overview, tabs, progress, findings, memo, reducer
services/
  entity-api.ts              Browser-side search API client
  entity-service.ts          Server-only entity directory adapter
  screening-api.ts           Browser-side screening API client
  screening-service.ts       Server-only mock screening adapter
tests/                       Unit, API, browser, and accessibility checks
```

**Server vs Client Components.** Route pages, metadata, reference content, and entity lookup run on the server. `AppShell` is a small client boundary for navigation toggles and active links, with server-rendered page content passed as children. `EntitySearch` manages browser form events and requests. `CaseWorkspace` manages the interactive case; its smaller child components inherit this boundary without unnecessary `use client` declarations. A new entity ID resets the workspace via a React key.

**State management.** Search state stays local to the form. A typed reducer owns the case lifecycle, selected tab, findings, case metadata, and policy assessment. Decisions remain intact across tabs and feed the memo. No global state library is needed. Abort controllers cancel client requests when a component unmounts, and request refs prevent duplicate submission. Effects are used only for cleanup. Edits are intentionally in memory and reset on reload or when leaving the case; this is stated in the UI.

**API integration.** UI components call typed API clients rather than scattering `fetch` calls. Requests are validated at the server boundary, and responses are validated with Zod at the client boundary. The server-only services are replaceable adapters. Search has initial, loading, success, empty, validation, and recoverable error states. Screening includes a 1.8-second mock provider delay, progress feedback, and retry on failure. Both API routes return uncached responses and generic errors.

To connect a real backend, replace the two server service adapters, validate upstream responses, and preserve the client-facing response contracts. Replace the explicit `sample: true` schema/labels when integrating real reports. Enforce authentication, tenant/entity authorization, rate limits, audit logging, and durable case storage on the server before exposing real customer data. The current public demo endpoints use only fictional fixtures; they do not implement identity or authorization. A real screening provider should use background jobs with status polling and server-side idempotency rather than holding a request open. Behind a reverse proxy, set server-only `APP_ORIGIN` to the exact public origin, for example `https://armo.example.com` without a trailing slash. Locally it defaults to the request protocol and Host header; the proxy should validate incoming Host values.

**Security.** No secrets, unsafe HTML injection, client credentials, or sensitive browser storage are used. Server-only imports guard data adapters. Inputs are constrained and validated; React escapes displayed text. The screening endpoint checks JSON content type, payload shape, body size, and browser origin. Origin checking is not authentication. Security headers disable framing, MIME sniffing, unnecessary browser capabilities, and unsafe document embedding. The CSP is a small baseline, not a complete script policy; adapt it with nonces and deployment origins when introducing authentication or third-party scripts. Put an upstream request-size/rate limit in place for a deployed API.

**Reusable components.** Button variants and a native-prop Input support consistent states and styling. BrandLogo is reused in the shell and memo. CaseTabs provides keyboard navigation, RiskBadge consistently represents risk, FindingCard handles repeated review items, and OverviewPanel / AssessmentPanel / MemoPanel separate distinct screen responsibilities. No extra wrapper components or state hooks are added without a use.

**Responsive design.** Desktop keeps a 248px sidebar and wide workspace. The sidebar can collapse; mobile uses expandable navigation. Search actions stack on small screens. Profile fields use adaptive grids, overview/memo side panels stack, and findings move controls below text. Tabs scroll without causing whole-page overflow. Print CSS removes app chrome and policy controls, leaving the memo document.

**Accessibility.** The app includes semantic headings, navigation landmarks, active-page indicators, a skip link, native controls, explicit labels, inline validation, status announcements, visible focus, disabled states, and reduced-motion support. Tabs use the tab/tabpanel pattern with Left/Right/Home/End keyboard controls. Severity is expressed with text as well as color. Automated axe checks are included in browser tests; they complement manual keyboard and visual checks rather than establishing complete WCAG conformance.

**Performance.** App Router pages default to Server Components. The UI uses system fonts, small SVG icons, no external image/font requests, and no heavy component library. Mock reads are cheap; request-dependent results are not cached. The layout and supporting pages can be prerendered, while entity pages resolve server data by route ID. There is no premature memoization or artificial lazy loading.

## Source delivery

`IMPLEMENTATION.md` contains the proposed structure and complete authored source, file by file, using `FILE: path` labels and code blocks. The runnable files live in this project alongside the generated npm lockfile. Regenerate the document with `npm run source:export` after source changes.
````

FILE: app/api/entities/route.ts

````ts
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
````

FILE: app/api/screenings/route.ts

````ts
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
````

FILE: app/cases/page.tsx

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { getEntityById } from "@/services/entity-service";

export const metadata: Metadata = { title: "Case Queue" };

export default async function CaseQueuePage() {
  const entity = await getEntityById("ENT-001");

  return (
    <section aria-labelledby="case-queue-heading">
      <h1 id="case-queue-heading" className="text-2xl font-semibold tracking-tight">Case Queue</h1>
      <p className="mt-1 text-sm text-muted">Open a case to review its entity profile and begin screening.</p>
      {entity && (
        <article className="mt-10 flex flex-col gap-6 border-y border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Sample case · ARMO-2026-0005</p>
            <h2 className="mt-2 text-lg font-semibold">{entity.name}</h2>
            <p className="mt-2 text-sm text-muted">{entity.country} · {entity.sector}</p>
          </div>
          <Link href={`/entities/${entity.id}`} className={buttonStyles({ className: "shrink-0" })}>Open Case</Link>
        </article>
      )}
      <p className="mt-6 text-xs text-muted">This queue contains a sample case. Assessment changes are not stored after leaving the entity workspace.</p>
    </section>
  );
}
````

FILE: app/dashboard/page.tsx

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardList } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading" className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Your reputation risk screening workspace</p>
      <div className="mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        <article className="rounded border border-border p-6">
          <BriefcaseBusiness size={26} className="text-brand" aria-hidden="true" />
          <h2 className="mt-5 text-lg font-semibold">Start a new screening</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Find an entity, review its group structure, and assess its screening findings.</p>
          <Link href="/" className={buttonStyles({ className: "mt-6" })}>Search Entity <ArrowRight size={16} aria-hidden="true" /></Link>
        </article>
        <article className="rounded border border-border p-6">
          <ClipboardList size={26} className="text-brand" aria-hidden="true" />
          <h2 className="mt-5 text-lg font-semibold">Explore the sample case</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Review Meridian Global Resources and work through a sample assessment and memo.</p>
          <Link href="/cases" className={buttonStyles({ variant: "secondary", className: "mt-6" })}>View Case Queue <ArrowRight size={16} aria-hidden="true" /></Link>
        </article>
      </div>
      <p className="mt-8 text-xs text-muted">Demo workspace. Sample records are fictional; edits last while the entity workspace is open.</p>
    </section>
  );
}
````

FILE: app/entities/[id]/page.tsx

````tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseWorkspace } from "@/features/case-workspace/case-workspace";
import { getEntityById } from "@/services/entity-service";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const entity = await getEntityById(id);
  return { title: entity?.name ?? "Entity not found" };
}

export default async function EntityPage({ params }: PageProps) {
  const { id } = await params;
  const entity = await getEntityById(id);
  if (!entity) notFound();
  return <CaseWorkspace key={entity.id} entity={entity} />;
}
````

FILE: app/error.tsx

````tsx
"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="py-10" role="alert"><h1 className="text-2xl font-semibold">We couldn’t load this page</h1><p className="mt-3 text-muted">Please try again. If the issue continues, contact your support team.</p><Button onClick={reset} className="mt-6">Try again</Button></section>;
}
````

FILE: app/globals.css

````css
@import "tailwindcss";

@theme inline {
  --color-brand: #c90024;
  --color-brand-dark: #a3001d;
  --color-brand-soft: #fff5f6;
  --color-foreground: #202124;
  --color-muted: #666970;
  --color-border: #dedfe2;
  --color-surface: #f8f9fa;
  --font-sans: Arial, Helvetica, sans-serif;
}

:root { color-scheme: light; }
body { margin: 0; background: #fff; color: var(--color-foreground); }
button, a, input, select, textarea { -webkit-tap-highlight-color: transparent; }
button:not(:disabled), select:not(:disabled) { cursor: pointer; }
:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 4px; }
::selection { background: #f9d8de; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media print {
  [data-app-header], [data-app-sidebar], .no-print { display: none !important; }
  [data-app-content] { padding: 0 !important; width: 100% !important; }
  body { font-size: 11pt; }
  a { text-decoration: none; }
}
````

FILE: app/layout.tsx

````tsx
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Entity Search | Armo", template: "%s | Armo" },
  description: "Armo Reputation Risk Screening Platform — entity search, screening assessment, and case memos.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
````

FILE: app/loading.tsx

````tsx
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return <div role="status" className="flex items-center gap-3 py-10 text-sm text-muted"><LoaderCircle className="animate-spin text-brand" size={20} aria-hidden="true" />Loading workspace…</div>;
}
````

FILE: app/not-found.tsx

````tsx
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return <section className="py-10"><h1 className="text-2xl font-semibold">Page not found</h1><p className="mt-3 text-muted">This entity or page could not be found.</p><Link href="/" className={buttonStyles({ className: "mt-6" })}>Return to Entity Search</Link></section>;
}
````

FILE: app/page.tsx

````tsx
import { EntitySearch } from "@/features/entity-search/entity-search";

export default function HomePage() {
  return <EntitySearch />;
}
````

FILE: app/reference/page.tsx

````tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reference" };

const workflowSteps = [
  ["Search Entity", "Search by entity name or GCIF. In the sample directory, try Meridian or ENT-001."],
  ["Overview & Structure", "Confirm the subject entity, group ownership, and case metadata before screening."],
  ["Screening & Assessment", "Run the sample screening, review each finding, and choose Include or Exclude for the memo."],
  ["Memo Preview", "Review selected findings, complete policy checks and rationale, and print the draft memo."],
];

export default function ReferencePage() {
  return (
    <section className="max-w-4xl" aria-labelledby="reference-heading">
      <h1 id="reference-heading" className="text-2xl font-semibold tracking-tight">Reference</h1>
      <p className="mt-1 text-sm text-muted">A guide to the screening workflow</p>
      <dl className="mt-10 divide-y divide-border border-y border-border">
        {workflowSteps.map(([label, description]) => (
          <div key={label} className="grid gap-2 py-6 sm:grid-cols-3 sm:gap-8">
            <dt className="text-sm font-semibold">{label}</dt>
            <dd className="text-sm leading-6 text-muted sm:col-span-2">{description}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-xs leading-5 text-muted">The directory, findings, sources, and risk ratings are illustrative fixtures. No live screening provider or institutional policy rules are connected.</p>
    </section>
  );
}
````

FILE: components/layout/app-shell.tsx

````tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { isNavigationActive, navigation } from "./navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-dvh">
      <a href="#main-content" className="sr-only fixed top-3 left-3 z-50 rounded bg-white p-3 text-brand shadow focus:not-sr-only">Skip to main content</a>
      <header data-app-header className="flex min-h-24 flex-wrap items-center gap-y-3 px-5 py-5 md:flex-nowrap md:px-6 md:py-7">
        <div className="flex w-full shrink-0 items-center gap-5 md:w-56">
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} className="flex size-9 items-center justify-center rounded hover:bg-surface md:hidden">
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed} aria-controls="desktop-navigation" aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} className="hidden size-7 items-center justify-center rounded hover:bg-surface md:flex">
            <Menu size={23} aria-hidden="true" />
          </button>
          <Link href="/" aria-label="MUFG — entity search"><BrandLogo /></Link>
        </div>
        <p className="pl-14 text-sm font-medium text-foreground md:pl-6 md:text-base">Armo Reputation Risk Screening Platform</p>
      </header>

      <nav id="mobile-navigation" aria-label="Primary navigation" className={`${mobileOpen ? "block" : "hidden"} border-y border-border px-4 py-2 md:hidden`}>
        {navigation.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)} aria-current={isNavigationActive(href, pathname) ? "page" : undefined} className="flex min-h-12 items-center gap-3 rounded px-3 text-sm font-semibold hover:bg-surface aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand">
            <Icon size={22} aria-hidden="true" />{label}
          </Link>
        ))}
      </nav>

      <div className="flex">
        <aside data-app-sidebar className={`hidden min-h-[calc(100dvh-96px)] shrink-0 flex-col pt-4 md:flex ${collapsed ? "w-20" : "w-62"}`}>
          <nav id="desktop-navigation" aria-label="Primary navigation" className="space-y-1">
            {navigation.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined} aria-current={isNavigationActive(href, pathname) ? "page" : undefined} className={`flex min-h-13 items-center gap-3 border-l-2 border-transparent px-6 text-sm font-semibold hover:bg-surface aria-[current=page]:border-brand aria-[current=page]:text-brand ${collapsed ? "justify-center px-0" : ""}`}>
                <Icon size={23} strokeWidth={2} aria-hidden="true" />{!collapsed && <span>{label}</span>}
              </Link>
            ))}
          </nav>
        </aside>
        <main id="main-content" data-app-content tabIndex={-1} className="min-w-0 flex-1 px-5 pt-6 pb-16 outline-none md:px-6 md:pt-6 lg:pr-12 lg:pl-8">
          {children}
        </main>
      </div>
    </div>
  );
}
````

FILE: components/layout/brand-logo.tsx

````tsx
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 ${className}`} aria-label="MUFG">
      <svg width="50" height="38" viewBox="0 0 54 40" fill="none" aria-hidden="true">
        <ellipse cx="27" cy="20" rx="27" ry="20" fill="#c90024" />
        <circle cx="27" cy="20" r="17" fill="white" />
        <circle cx="27" cy="20" r="10" fill="#c90024" />
      </svg>
      <span className="text-[32px] leading-none font-bold tracking-[-1.5px] text-black">MUFG</span>
    </span>
  );
}
````

FILE: components/layout/navigation.ts

````ts
import { BriefcaseBusiness, Building2, ChartColumn, LayoutDashboard } from "lucide-react";

export const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Search Entity", href: "/", icon: BriefcaseBusiness },
  { label: "Case Queue", href: "/cases", icon: ChartColumn },
  { label: "Reference", href: "/reference", icon: Building2 },
] as const;

export function isNavigationActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href === "/cases") return pathname === "/cases" || pathname.startsWith("/entities/");
  return pathname === href || pathname.startsWith(`${href}/`);
}
````

FILE: components/ui/button.tsx

````tsx
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
const variants: Record<ButtonVariant, string> = {
  primary: "border-brand bg-brand text-white hover:border-brand-dark hover:bg-brand-dark",
  secondary: "border-border bg-white text-foreground hover:bg-surface",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-surface",
};

export function buttonStyles({ variant = "primary", className = "" }: { variant?: ButtonVariant; className?: string } = {}) {
  return `inline-flex min-h-10 items-center justify-center gap-2 rounded border px-5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`;
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonStyles({ variant, className })} {...props} />;
}
````

FILE: components/ui/input.tsx

````tsx
import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`min-h-10 w-full rounded border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand disabled:bg-surface disabled:text-muted aria-invalid:border-brand ${className}`} {...props} />;
}
````

FILE: features/case-workspace/assessment-panel.tsx

````tsx
import { Shield } from "lucide-react";

import { FindingCard } from "./finding-card";
import { RiskBadge } from "./risk-badge";
import type { Finding, ScreeningReport } from "./types";

interface AssessmentPanelProps {
  report: ScreeningReport;
  onFindingChange: (id: string, patch: Partial<Pick<Finding, "severity" | "decision" | "notes">>) => void;
}

export function AssessmentPanel({ report, onFindingChange }: AssessmentPanelProps) {
  return (
    <div className="grid gap-10 pt-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside aria-labelledby="risk-profile-heading" className="pt-1">
        <h2 id="risk-profile-heading" className="text-xs font-bold uppercase tracking-wide">Risk profile</h2>
        <p className="mt-7 text-[9px] font-semibold uppercase tracking-wider text-muted">Calculated inherent risk</p>
        <RiskBadge level={report.overallRisk} showRisk className="mt-2 min-h-7 w-full" />
        <h3 className="mt-6 text-[9px] font-semibold uppercase tracking-wider text-muted">Risk dimensions</h3>
        <dl className="mt-4 space-y-4">
          {report.categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between gap-4">
              <dt className="text-xs">{category.name}</dt>
              <dd><RiskBadge level={category.level} className="min-w-14" /></dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[10px] leading-5 text-muted">Sample group risk profile. Individual finding decisions inform the memo; they do not recalculate the provider’s inherent risk.</p>
      </aside>
      <section aria-labelledby="negative-news-heading" className="min-w-0">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-brand" aria-hidden="true" />
          <h2 id="negative-news-heading" className="text-sm font-bold uppercase">Negative news findings</h2>
          <span className="ml-auto text-xs text-muted">{report.findings.length} findings</span>
        </div>
        <p className="mt-2 text-[10px] leading-4 text-muted">Fictional sample findings for demonstration. Review each item for inclusion in the memo.</p>
        {report.findings.length ? report.findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} onChange={(patch) => onFindingChange(finding.id, patch)} />
        )) : <p className="py-12 text-sm text-muted">No findings were returned for this entity.</p>}
      </section>
    </div>
  );
}
````

FILE: features/case-workspace/case-state.ts

````ts
import type {
  CaseMetadata,
  CaseTab,
  Finding,
  PolicyAssessment,
  ScreeningReport,
} from "./types";

export interface CaseState {
  tab: CaseTab;
  status: "idle" | "running" | "complete" | "error";
  report: ScreeningReport | null;
  error: string | null;
  metadata: CaseMetadata;
  policy: PolicyAssessment;
}

export const initialCaseState: CaseState = {
  tab: "overview",
  status: "idle",
  report: null,
  error: null,
  metadata: { assignedOfficer: "", transactionType: "", facilityDescription: "" },
  policy: {
    sensitiveSector: true,
    sector: "Palm oil",
    notes: "",
    equatorPrinciples: false,
    riskLevel: "critical",
    rationale: "",
  },
};

export type CaseAction =
  | { type: "change-tab"; tab: CaseTab }
  | { type: "start-screening" }
  | { type: "screening-complete"; report: ScreeningReport }
  | { type: "screening-failed"; message: string }
  | { type: "update-finding"; id: string; patch: Partial<Pick<Finding, "severity" | "decision" | "notes">> }
  | { type: "update-metadata"; patch: Partial<CaseMetadata> }
  | { type: "update-policy"; patch: Partial<PolicyAssessment> };

export function caseReducer(state: CaseState, action: CaseAction): CaseState {
  switch (action.type) {
    case "change-tab":
      return { ...state, tab: action.tab };
    case "start-screening":
      if (state.status === "running") return state;
      return { ...state, tab: "assessment", status: "running", error: null };
    case "screening-complete":
      return {
        ...state,
        status: "complete",
        report: action.report,
        error: null,
        policy: { ...state.policy, riskLevel: action.report.overallRisk },
      };
    case "screening-failed":
      return { ...state, status: "error", error: action.message };
    case "update-finding":
      if (!state.report) return state;
      return {
        ...state,
        report: {
          ...state.report,
          findings: state.report.findings.map((finding) =>
            finding.id === action.id ? { ...finding, ...action.patch } : finding,
          ),
        },
      };
    case "update-metadata":
      return { ...state, metadata: { ...state.metadata, ...action.patch } };
    case "update-policy":
      return { ...state, policy: { ...state.policy, ...action.patch } };
  }
}

export function getIncludedFindings(report: ScreeningReport | null): Finding[] {
  return report?.findings.filter((finding) => finding.decision === "include") ?? [];
}

export function getPendingFindingsCount(report: ScreeningReport | null): number {
  return report?.findings.filter((finding) => finding.decision === "pending").length ?? 0;
}
````

FILE: features/case-workspace/case-tabs.tsx

````tsx
import { Activity, FileText, ShieldCheck } from "lucide-react";
import type { KeyboardEvent } from "react";

import type { CaseTab } from "./types";

const tabs = [
  { id: "overview", label: "Overview & Structure", icon: Activity },
  { id: "assessment", label: "Screening & Assessment", icon: ShieldCheck },
  { id: "memo", label: "Memo Preview", icon: FileText },
] as const;

interface CaseTabsProps {
  activeTab: CaseTab;
  onTabChange: (tab: CaseTab) => void;
}

export function CaseTabs({ activeTab, onTabChange }: CaseTabsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % tabs.length; break;
      case "ArrowLeft": nextIndex = (index + tabs.length - 1) % tabs.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    const next = tabs[nextIndex];
    onTabChange(next.id);
    document.getElementById(`case-tab-${next.id}`)?.focus();
  }

  return (
    <div className="mt-3 flex overflow-x-auto border-b border-border" role="tablist" aria-label="Entity case sections">
      {tabs.map(({ id, label, icon: Icon }, index) => (
        <button
          key={id}
          id={`case-tab-${id}`}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          aria-controls={`case-panel-${id}`}
          tabIndex={activeTab === id ? 0 : -1}
          onClick={() => onTabChange(id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={`flex shrink-0 items-center gap-2.5 border-b-2 px-4 py-4 text-sm font-semibold transition-colors outline-offset-[-4px] focus-visible:outline-2 focus-visible:outline-brand sm:px-5 ${activeTab === id ? "border-brand text-foreground" : "border-transparent text-muted hover:text-foreground"}`}
        >
          <Icon aria-hidden="true" size={22} strokeWidth={1.9} />
          {label}
        </button>
      ))}
    </div>
  );
}
````

FILE: features/case-workspace/case-workspace.tsx

````tsx
"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";

import { Button } from "@/components/ui/button";
import type { Entity } from "@/features/entity-search/types";
import { requestScreening } from "@/services/screening-api";

import { AssessmentPanel } from "./assessment-panel";
import { caseReducer, initialCaseState } from "./case-state";
import { CaseTabs } from "./case-tabs";
import { MemoPanel } from "./memo-panel";
import { OverviewPanel } from "./overview-panel";
import { ScreeningProgress } from "./screening-progress";

export function CaseWorkspace({ entity }: { entity: Entity }) {
  const [state, dispatch] = useReducer(caseReducer, initialCaseState);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => () => activeRequest.current?.abort(), []);

  async function launchScreening() {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    dispatch({ type: "start-screening" });

    try {
      const report = await requestScreening({ entityId: entity.id }, controller.signal);
      if (!controller.signal.aborted) dispatch({ type: "screening-complete", report });
    } catch (error) {
      if (!controller.signal.aborted) {
        dispatch({
          type: "screening-failed",
          message: error instanceof Error && error.message.startsWith("Screening")
            ? error.message
            : "Screening could not be completed. Check your connection and try again.",
        });
      }
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  }

  return (
    <div className={state.tab === "memo" ? "case-workspace case-memo" : "case-workspace"}>
      <header className="print:hidden">
        <h1 className="text-2xl font-semibold tracking-tight">{entity.name}</h1>
        <p className="mt-1.5 text-sm text-muted">Part of {entity.groupName}</p>
      </header>
      <div className="print:hidden">
        <CaseTabs activeTab={state.tab} onTabChange={(tab) => dispatch({ type: "change-tab", tab })} />
      </div>
      <p className="sr-only" role="status">{state.status === "complete" ? `Screening complete. ${state.report?.findings.length ?? 0} findings available.` : ""}</p>

      <div id="case-panel-overview" role="tabpanel" aria-labelledby="case-tab-overview" tabIndex={0} hidden={state.tab !== "overview"} className="outline-offset-4">
        {state.tab === "overview" && <OverviewPanel
          entity={entity}
          metadata={state.metadata}
          isRunning={state.status === "running"}
          hasReport={state.report !== null}
          onMetadataChange={(patch) => dispatch({ type: "update-metadata", patch })}
          onLaunch={launchScreening}
          onViewReport={() => dispatch({ type: "change-tab", tab: "assessment" })}
        />}
      </div>

      <div id="case-panel-assessment" role="tabpanel" aria-labelledby="case-tab-assessment" tabIndex={0} hidden={state.tab !== "assessment"} className="outline-offset-4">
        {state.tab === "assessment" && <>
          {state.status === "running" ? <ScreeningProgress entityCount={entity.group.length} />
            : state.status === "error" ? <div className="mt-8 border border-brand/30 p-8">
              <p role="alert" className="text-sm text-brand">{state.error}</p>
              <Button className="mt-4" onClick={launchScreening}>Retry screening</Button>
            </div>
              : state.report ? <AssessmentPanel report={state.report} onFindingChange={(id, patch) => dispatch({ type: "update-finding", id, patch })} />
                : <ScreeningEmptyState onLaunch={launchScreening} />}
        </>}
      </div>

      <div id="case-panel-memo" role="tabpanel" aria-labelledby="case-tab-memo" tabIndex={0} hidden={state.tab !== "memo"} className="outline-offset-4">
        {state.tab === "memo" && (state.report ? <MemoPanel
          entity={entity}
          report={state.report}
          metadata={state.metadata}
          policy={state.policy}
          onPolicyChange={(patch) => dispatch({ type: "update-policy", patch })}
        /> : state.status === "running" ? <ScreeningProgress entityCount={entity.group.length} /> : <ScreeningEmptyState onLaunch={launchScreening} forMemo />)}
      </div>
    </div>
  );
}

function ScreeningEmptyState({ onLaunch, forMemo = false }: { onLaunch: () => void; forMemo?: boolean }) {
  return (
    <div className="mt-8 flex min-h-60 flex-col items-center justify-center border border-border p-8 text-center">
      <ShieldCheck size={30} className="mb-4 text-muted" aria-hidden="true" />
      <h2 className="text-base font-semibold">{forMemo ? "Your memo starts with a screening" : "Ready to screen this group"}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">Launch the screening engine to review sample findings and prepare the risk assessment.</p>
      <Button className="mt-5" onClick={onLaunch}>Launch Screening Engine</Button>
    </div>
  );
}
````

FILE: features/case-workspace/finding-card.tsx

````tsx
import { CircleCheck, CircleX } from "lucide-react";

import { RiskBadge } from "./risk-badge";
import { severitySchema, type Finding } from "./types";

interface FindingCardProps {
  finding: Finding;
  onChange: (patch: Partial<Pick<Finding, "severity" | "decision" | "notes">>) => void;
}

export function FindingCard({ finding, onChange }: FindingCardProps) {
  return (
    <article className="grid gap-5 border-b border-border py-6 lg:grid-cols-[minmax(0,1fr)_128px]" aria-labelledby={`${finding.id}-title`}>
      <div className="min-w-0">
        <div className="flex items-start gap-2.5">
          <RiskBadge level={finding.severity} className="mt-0.5 shrink-0" />
          <h3 id={`${finding.id}-title`} className="text-sm font-semibold leading-5">{finding.title}</h3>
        </div>
        <p className="mt-3 text-xs leading-6 text-muted">{finding.summary}</p>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[9px] uppercase leading-4 tracking-wide">
          <div><dt className="sr-only">Entity</dt><dd>{finding.entityName}</dd></div>
          <div><dt className="sr-only">Source</dt><dd>{finding.source}</dd></div>
          <div><dt className="sr-only">Category</dt><dd className="font-semibold text-brand">{finding.category}</dd></div>
          <div><dt className="sr-only">Published</dt><dd className="text-muted">{finding.publishedAt}</dd></div>
        </dl>
        <label htmlFor={`${finding.id}-notes`} className="sr-only">Review notes for {finding.title}</label>
        <textarea id={`${finding.id}-notes`} rows={2} maxLength={2000} className="mt-5 w-full resize-y rounded-sm border border-transparent px-2 py-2 text-xs outline-offset-2 placeholder:text-muted hover:border-border focus:border-border focus-visible:outline-2 focus-visible:outline-brand" placeholder="Click to add review comments…" value={finding.notes} onChange={(event) => onChange({ notes: event.target.value })} />
      </div>
      <div className="flex flex-wrap items-start gap-5 lg:flex-col lg:gap-6">
        <div className="w-32">
          <label htmlFor={`${finding.id}-severity`} className="mb-2 block text-[9px] font-semibold uppercase tracking-wider text-muted">Severity<span className="sr-only"> for {finding.title}</span></label>
          <select id={`${finding.id}-severity`} className="h-9 w-full rounded-sm border border-border bg-white px-2 text-[10px] font-semibold uppercase outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand" value={finding.severity} onChange={(event) => {
            const parsed = severitySchema.safeParse(event.target.value);
            if (parsed.success) onChange({ severity: parsed.data });
          }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <fieldset className="w-32 space-y-1.5">
          <legend className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-muted">Decision<span className="sr-only"> for {finding.title}</span></legend>
          <button type="button" aria-pressed={finding.decision === "include"} onClick={() => onChange({ decision: finding.decision === "include" ? "pending" : "include" })} className={`flex min-h-9 w-full items-center gap-2 rounded-sm border px-3 py-2 text-[10px] font-semibold uppercase transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand ${finding.decision === "include" ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-border hover:bg-emerald-50"}`}>
            <CircleCheck size={13} className="text-emerald-700" aria-hidden="true" />Include
          </button>
          <button type="button" aria-pressed={finding.decision === "exclude"} onClick={() => onChange({ decision: finding.decision === "exclude" ? "pending" : "exclude" })} className={`flex min-h-9 w-full items-center gap-2 rounded-sm border px-3 py-2 text-[10px] font-semibold uppercase transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand ${finding.decision === "exclude" ? "border-brand bg-red-50 text-brand" : "border-border hover:bg-red-50"}`}>
            <CircleX size={13} className="text-brand" aria-hidden="true" />Exclude
          </button>
        </fieldset>
      </div>
    </article>
  );
}
````

FILE: features/case-workspace/memo-panel.tsx

````tsx
import { Printer } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import type { Entity } from "@/features/entity-search/types";

import { getIncludedFindings, getPendingFindingsCount } from "./case-state";
import { PolicyChecks } from "./policy-checks";
import { RiskBadge } from "./risk-badge";
import type { CaseMetadata, PolicyAssessment, ScreeningReport } from "./types";

interface MemoPanelProps {
  entity: Entity;
  report: ScreeningReport;
  metadata: CaseMetadata;
  policy: PolicyAssessment;
  onPolicyChange: (patch: Partial<PolicyAssessment>) => void;
}

export function MemoPanel({ entity, report, metadata, policy, onPolicyChange }: MemoPanelProps) {
  const includedFindings = getIncludedFindings(report);
  const pendingCount = getPendingFindingsCount(report);
  const memoFields = [
    ["Call tracking code", report.id],
    ["Client name", entity.name],
    ["GCIF / BCIF", entity.gcif],
    ["Group core identifier", `${entity.name} (client is Group Core)`],
    ["Country", entity.country],
    ["Industry", "Agribusiness · Diversified"],
    ...(metadata.assignedOfficer ? [["Assigned officer", metadata.assignedOfficer]] : []),
    ...(metadata.transactionType ? [["Transaction type", metadata.transactionType]] : []),
  ];

  return (
    <div className="grid gap-10 pt-10 xl:grid-cols-[minmax(0,1fr)_280px] print:block">
      <article aria-label="Screening memorandum" className="min-w-0 px-1 sm:px-6 print:px-0">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b-[3px] border-brand pb-7">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight">Memo Preview</h2>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted">Mitsubishi UFJ Financial Group</p>
          </div>
          <BrandLogo className="mt-1" />
        </header>
        <dl className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {memoFields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
              <dd className="mt-3 text-sm font-semibold leading-6">{value}</dd>
            </div>
          ))}
        </dl>

        {metadata.facilityDescription && <section className="mt-9">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted">Facility description</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{metadata.facilityDescription}</p>
        </section>}

        <section className="mt-10 border-t border-border pt-7" aria-labelledby="memo-assessment-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 id="memo-assessment-heading" className="text-sm font-semibold">Risk assessment</h3>
            <RiskBadge level={policy.riskLevel} showRisk />
          </div>
          <p className="mt-4 text-xs leading-6">Sensitive sector: {policy.sensitiveSector ? policy.sector || "Not specified" : "No"}. Equator Principles: {policy.equatorPrinciples ? "Applicable" : "Not applicable"}.</p>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-muted">{policy.rationale || "Add the risk rationale in Policy Checks & Rationale."}</p>
          {policy.notes && <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-muted">Policy notes: {policy.notes}</p>}
        </section>

        <section className="mt-8" aria-labelledby="memo-findings-heading">
          <h3 id="memo-findings-heading" className="text-sm font-semibold">Included findings ({includedFindings.length})</h3>
          {includedFindings.length ? <ol className="mt-4 space-y-5">
            {includedFindings.map((finding) => <li key={finding.id} className="break-inside-avoid">
              <div className="flex items-start gap-2"><RiskBadge level={finding.severity} className="mt-0.5 shrink-0" /><h4 className="text-xs font-semibold leading-5">{finding.title}</h4></div>
              <p className="mt-2 text-xs leading-6 text-muted">{finding.summary}</p>
              {finding.notes && <p className="mt-2 whitespace-pre-wrap text-xs leading-6">Reviewer notes: {finding.notes}</p>}
            </li>)}
          </ol> : <p className="mt-3 text-xs leading-6 text-muted">No findings included. Review the findings in Screening & Assessment to add them to this memo.</p>}
          {pendingCount > 0 && <p className="mt-4 text-xs text-muted">Draft · {pendingCount} {pendingCount === 1 ? "finding awaits" : "findings await"} a review decision.</p>}
        </section>
        <footer className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <p className="max-w-sm text-[10px] leading-5 text-muted">Sample memorandum · fictional demonstration data. Changes are retained only while this case remains open.</p>
          <Button variant="secondary" className="print:hidden" onClick={() => window.print()}><Printer size={15} aria-hidden="true" />Print memo</Button>
        </footer>
      </article>
      <PolicyChecks policy={policy} onChange={onPolicyChange} />
    </div>
  );
}
````

FILE: features/case-workspace/overview-panel.tsx

````tsx
import { CirclePlay } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Entity } from "@/features/entity-search/types";

import type { CaseMetadata } from "./types";

interface OverviewPanelProps {
  entity: Entity;
  metadata: CaseMetadata;
  isRunning: boolean;
  hasReport: boolean;
  onMetadataChange: (patch: Partial<CaseMetadata>) => void;
  onLaunch: () => void;
  onViewReport: () => void;
}

export function OverviewPanel({ entity, metadata, isRunning, hasReport, onMetadataChange, onLaunch, onViewReport }: OverviewPanelProps) {
  const profile = [
    ["Legal name", entity.legalName],
    ["Role", entity.role],
    ["Country", entity.country],
    ["Sector", entity.sector],
    ["GCIF", entity.gcif],
    ["Internal rating", entity.rating],
    ["Description", entity.description],
  ];

  return (
    <div className="grid gap-10 pt-8 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <section aria-labelledby="entity-profile-heading">
          <h2 id="entity-profile-heading" className="text-sm font-bold uppercase tracking-wide">Subject entity profile</h2>
          <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 xl:gap-x-3">
            {profile.map(([label, value]) => (
              <div key={label}>
                <dt className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</dt>
                <dd className="text-sm font-medium leading-5">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="group-structure-heading" className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 id="group-structure-heading" className="text-sm font-bold uppercase tracking-wide">Group structure</h2>
            <span className="bg-foreground px-2 py-1 text-[10px] font-semibold text-white">{entity.group.length} ENTITIES</span>
          </div>
          <ol className="mt-3 divide-y divide-border">
            {entity.group.map((member, index) => (
              <li key={member.id} className="flex items-center justify-between gap-6 py-5">
                <div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <h3 className="text-sm font-semibold">{member.name}</h3>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted">{member.role}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">{index + 1}</p>
                </div>
                <dl className="w-24 shrink-0">
                  <dt className="text-[10px] font-semibold text-muted">Ownership</dt>
                  <dd className="mt-1 text-sm font-semibold">{member.ownership}%</dd>
                </dl>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <aside className="space-y-7">
        <section className="border border-border px-5 py-6 text-center" aria-labelledby="automated-screening-heading">
          <CirclePlay aria-hidden="true" className="mx-auto mb-3" size={25} strokeWidth={1.8} />
          <h2 id="automated-screening-heading" className="text-sm font-bold uppercase">Automated screening</h2>
          <p className="mt-2 text-xs leading-5 text-muted">Screening negative news and ESG controversies across the entire group</p>
          <Button className="mt-4 w-full" disabled={isRunning} onClick={hasReport ? onViewReport : onLaunch}>
            {isRunning ? "Screening in progress…" : hasReport ? "View Screening Results" : "Launch Screening Engine"}
          </Button>
          <p className="mt-3 text-[10px] leading-4 text-muted">Sample screening using fictional findings.</p>
        </section>

        <section aria-labelledby="case-metadata-heading">
          <h2 id="case-metadata-heading" className="text-sm font-semibold uppercase">Case metadata</h2>
          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="assigned-officer" className="mb-2 block text-xs font-semibold">Assigned Officer</label>
              <Input id="assigned-officer" value={metadata.assignedOfficer} maxLength={120} placeholder="Enter officer name" onChange={(event) => onMetadataChange({ assignedOfficer: event.target.value })} />
            </div>
            <div>
              <label htmlFor="transaction-type" className="mb-2 block text-xs font-semibold">Transaction Type</label>
              <select id="transaction-type" className="h-10 w-full rounded-sm border border-border bg-white px-3 text-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand" value={metadata.transactionType} onChange={(event) => onMetadataChange({ transactionType: event.target.value })}>
                <option value="">Select transaction type</option>
                <option>New relationship</option>
                <option>Credit facility</option>
                <option>Annual review</option>
              </select>
            </div>
            <div>
              <label htmlFor="facility-description" className="mb-2 block text-xs font-semibold">Facility Description</label>
              <textarea id="facility-description" className="min-h-20 w-full resize-y rounded-sm border border-border px-3 py-2 text-sm outline-offset-2 placeholder:text-muted focus-visible:outline-2 focus-visible:outline-brand" maxLength={1000} placeholder="Add facility details" value={metadata.facilityDescription} onChange={(event) => onMetadataChange({ facilityDescription: event.target.value })} />
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
````

FILE: features/case-workspace/policy-checks.tsx

````tsx
import { ShieldCheck } from "lucide-react";

import { riskLevelSchema, type PolicyAssessment } from "./types";

interface PolicyChecksProps {
  policy: PolicyAssessment;
  onChange: (patch: Partial<PolicyAssessment>) => void;
}

const fieldClass = "w-full rounded-sm border border-border bg-white px-3 py-2 text-sm outline-offset-2 placeholder:text-muted focus-visible:outline-2 focus-visible:outline-brand";

export function PolicyChecks({ policy, onChange }: PolicyChecksProps) {
  return (
    <aside aria-labelledby="policy-checks-heading" className="print:hidden">
      <h2 id="policy-checks-heading" className="flex items-center gap-2.5 text-sm font-bold uppercase"><ShieldCheck className="shrink-0 text-brand" size={18} aria-hidden="true" />Policy checks & rationale</h2>
      <div className="mt-8 space-y-7">
        <div>
          <label className="flex items-center gap-3 text-xs font-semibold uppercase">
            <input type="checkbox" className="size-4 accent-brand" checked={policy.sensitiveSector} onChange={(event) => onChange({ sensitiveSector: event.target.checked })} />
            Sensitive sector
          </label>
          {policy.sensitiveSector && <div className="ml-7 mt-4">
            <label htmlFor="sensitive-sector-name" className="sr-only">Sensitive sector name</label>
            <input id="sensitive-sector-name" className={fieldClass} value={policy.sector} maxLength={120} onChange={(event) => onChange({ sector: event.target.value })} />
          </div>}
          <div className="mt-5">
            <label htmlFor="policy-notes" className="sr-only">Policy notes</label>
            <textarea id="policy-notes" className={`${fieldClass} min-h-20 resize-y`} placeholder="Notes" maxLength={2000} value={policy.notes} onChange={(event) => onChange({ notes: event.target.value })} />
          </div>
        </div>
        <label className="flex items-center gap-3 text-xs font-semibold uppercase">
          <input type="checkbox" className="size-4 accent-brand" checked={policy.equatorPrinciples} onChange={(event) => onChange({ equatorPrinciples: event.target.checked })} />
          Equator principles
        </label>
        <div>
          <label htmlFor="memo-risk-level" className="mb-3 block text-[10px] font-semibold uppercase tracking-wide text-muted">Assessed risk level</label>
          <select id="memo-risk-level" className={`${fieldClass} uppercase`} value={policy.riskLevel} onChange={(event) => {
            const parsed = riskLevelSchema.safeParse(event.target.value);
            if (parsed.success) onChange({ riskLevel: parsed.data });
          }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label htmlFor="risk-rationale" className="mb-3 block text-[10px] font-semibold uppercase tracking-wide text-muted">Risk rationale</label>
          <textarea id="risk-rationale" className={`${fieldClass} min-h-28 resize-y`} maxLength={2000} placeholder="Briefly justify the assessment…" value={policy.rationale} onChange={(event) => onChange({ rationale: event.target.value })} />
        </div>
      </div>
    </aside>
  );
}
````

FILE: features/case-workspace/risk-badge.tsx

````tsx
import type { RiskLevel } from "./types";

const colorClasses: Record<RiskLevel, string> = {
  low: "bg-emerald-700 text-white",
  medium: "bg-amber-400 text-amber-950",
  high: "bg-red-700 text-white",
  critical: "bg-[#321057] text-white",
};

export function RiskBadge({ level, className = "", showRisk = false }: { level: RiskLevel; className?: string; showRisk?: boolean }) {
  return <span className={`inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold uppercase leading-none ${colorClasses[level]} ${className}`}>{level}{showRisk ? " risk" : ""}</span>;
}
````

FILE: features/case-workspace/screening-progress.tsx

````tsx
import { LoaderCircle } from "lucide-react";

export function ScreeningProgress({ entityCount }: { entityCount: number }) {
  return (
    <div className="mt-8 flex min-h-64 flex-col items-center justify-center border border-brand/30 bg-brand/[0.015] px-5 py-9 text-center" role="status" aria-live="polite">
      <LoaderCircle size={40} strokeWidth={2} className="mb-6 animate-spin text-brand motion-reduce:animate-none" aria-hidden="true" />
      <h2 className="text-sm font-bold uppercase text-brand">Screening engine is running</h2>
      <p className="mt-3 max-w-md text-xs leading-5 text-muted">Querying global media, regulatory lists, and NGO sources for {entityCount} entities in the group</p>
      <dl className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[10px] uppercase tracking-wide">
        <div className="flex gap-2"><dt className="text-muted">Entities</dt><dd className="font-bold">{entityCount}</dd></div>
        <div className="flex gap-2"><dt className="text-muted">Sources</dt><dd className="font-bold">84</dd></div>
        <div className="flex gap-2"><dt className="text-muted">Status</dt><dd className="font-bold">In progress</dd></div>
      </dl>
      <p className="mt-4 text-[10px] text-muted">Simulated screening · fictional sample data</p>
    </div>
  );
}
````

FILE: features/case-workspace/types.ts

````ts
import { z } from "zod";

export const severitySchema = z.enum(["low", "medium", "high"]);
export const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
export const decisionSchema = z.enum(["pending", "include", "exclude"]);

export const findingSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  entityName: z.string().min(1),
  source: z.string().min(1),
  category: z.string().min(1),
  publishedAt: z.string().min(1),
  severity: severitySchema,
  decision: decisionSchema,
  notes: z.string().max(2000),
});

export const screeningReportSchema = z.object({
  id: z.string().min(1),
  entityId: z.string().min(1),
  generatedAt: z.iso.datetime(),
  sample: z.literal(true),
  overallRisk: riskLevelSchema,
  entityCount: z.number().int().positive(),
  sourceCount: z.number().int().nonnegative(),
  categories: z.array(z.object({ name: z.string(), level: severitySchema })),
  findings: z.array(findingSchema),
});

export type Severity = z.infer<typeof severitySchema>;
export type RiskLevel = z.infer<typeof riskLevelSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type FindingDecision = z.infer<typeof decisionSchema>;
export type ScreeningReport = z.infer<typeof screeningReportSchema>;
export type CaseTab = "overview" | "assessment" | "memo";

export interface CaseMetadata {
  assignedOfficer: string;
  transactionType: string;
  facilityDescription: string;
}

export interface PolicyAssessment {
  sensitiveSector: boolean;
  sector: string;
  notes: string;
  equatorPrinciples: boolean;
  riskLevel: RiskLevel;
  rationale: string;
}
````

FILE: features/entity-search/entity-data.ts

````ts
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
  const entity = entities.find((record) => record.id === id);
  return entity ? structuredClone(entity) : null;
}
````

FILE: features/entity-search/entity-result.tsx

````tsx
import Link from "next/link";
import { Building2 } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import type { Entity } from "./types";

export function EntityResult({ entity }: { entity: Entity }) {
  const details = [
    ["Country", entity.country],
    ["Sector", entity.sector],
    ["GCIF", entity.gcif],
    ["Entity role", entity.role],
  ];

  return (
    <article className="flex flex-col justify-between gap-6 px-1 py-6 sm:px-5 lg:flex-row lg:items-center">
      <div>
        <h3 className="flex items-start gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
          <Building2 className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
          {entity.name}
        </h3>
        <dl className="mt-4 grid grid-cols-2 gap-x-7 gap-y-4 sm:flex sm:flex-wrap">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase text-muted">{label}</dt>
              <dd className="mt-1 text-sm font-medium sm:text-base">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex items-end justify-between gap-4 lg:flex-col lg:items-center lg:gap-5">
        <dl className="lg:text-center">
          <dt className="text-xs font-semibold uppercase text-muted">Parent</dt>
          <dd className="mt-1 text-base font-medium">{entity.parent}</dd>
        </dl>
        <Link
          href={`/entities/${encodeURIComponent(entity.id)}`}
          className={buttonStyles({ className: "whitespace-nowrap" })}
          aria-label={`Confirm entity ${entity.name}`}
        >
          Confirm Entity
        </Link>
      </div>
    </article>
  );
}
````

FILE: features/entity-search/entity-search.tsx

````tsx
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
````

FILE: features/entity-search/schema.ts

````ts
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
````

FILE: features/entity-search/types.ts

````ts
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
````

FILE: services/entity-api.ts

````ts
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
````

FILE: services/entity-service.ts

````ts
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
````

FILE: services/screening-api.ts

````ts
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
````

FILE: services/screening-service.ts

````ts
import "server-only";

import type { ScreeningReport } from "@/features/case-workspace/types";
import { getEntityById } from "@/services/entity-service";

/** Replace this adapter with an authorized screening provider before production use. */
export async function runScreening(entityId: string): Promise<ScreeningReport | null> {
  const entity = await getEntityById(entityId);
  if (!entity) return null;

  // A short delay makes the asynchronous provider lifecycle visible in this demo.
  await new Promise<void>((resolve) => setTimeout(resolve, 1800));

  return {
    id: "ARMO-2026-0005",
    entityId: entity.id,
    generatedAt: new Date().toISOString(),
    sample: true,
    overallRisk: "critical",
    entityCount: entity.group.length,
    sourceCount: 84,
    categories: [
      { name: "Environmental", level: "high" },
      { name: "Labour", level: "high" },
      { name: "Community", level: "high" },
      { name: "Governance", level: "medium" },
      { name: "Supply Chain", level: "medium" },
    ],
    findings: [
      {
        id: "finding-governance",
        title: "Meridian Global Resources faces shareholder resolution on plantation disclosure",
        summary:
          "In this fictional scenario, shareholders request more detailed plantation disclosures, including land-use practices and grievance reporting. The resolution seeks stronger governance and transparency. Management has committed to reviewing its reporting framework.",
        entityName: entity.name,
        source: "ESG Governance Monitor · sample source",
        category: "Governance",
        publishedAt: "18 Sep 2026",
        severity: "medium",
        decision: "pending",
        notes: "",
      },
      {
        id: "finding-labour",
        title: "Investigation finds recruitment fee debt among migrant harvesters at Kalimantan estates",
        summary:
          "This fictional sample describes recruitment fees paid by migrant workers at a group estate. The illustrative report raises concerns about repayment periods and worker protections. The company describes a review of recruitment agents and a proposed reimbursement programme.",
        entityName: "Kestral",
        source: "Responsible Work Review · sample source",
        category: "Labour",
        publishedAt: "15 Sep 2026",
        severity: "high",
        decision: "pending",
        notes: "",
      },
    ],
  };
}
````

FILE: tests/entity-search.test.ts

````ts
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
````

FILE: tests/screening.test.ts

````ts
import assert from "node:assert/strict";
import test from "node:test";

import { caseReducer, getIncludedFindings, getPendingFindingsCount, initialCaseState } from "../features/case-workspace/case-state";
import { screeningReportSchema, type ScreeningReport } from "../features/case-workspace/types";

const report: ScreeningReport = {
  id: "sample-case",
  entityId: "ENT-001",
  generatedAt: "2026-09-25T00:00:00.000Z",
  sample: true,
  overallRisk: "critical",
  entityCount: 3,
  sourceCount: 84,
  categories: [{ name: "Governance", level: "medium" }],
  findings: [{
    id: "finding-1",
    title: "Fictional sample finding",
    summary: "Sample text",
    entityName: "Sample entity",
    source: "Sample source",
    category: "Governance",
    publishedAt: "18 Sep 2026",
    severity: "medium",
    decision: "pending",
    notes: "",
  }],
};

test("screening lifecycle adopts provider risk and guards duplicate starts", () => {
  const started = caseReducer(initialCaseState, { type: "start-screening" });
  assert.equal(started.tab, "assessment");
  assert.equal(started.status, "running");
  assert.equal(caseReducer(started, { type: "start-screening" }), started);
  const complete = caseReducer(started, { type: "screening-complete", report });
  assert.equal(complete.status, "complete");
  assert.equal(complete.policy.riskLevel, report.overallRisk);
});

test("review decisions and severity survive tab changes and determine memo inclusion", () => {
  const complete = caseReducer(initialCaseState, { type: "screening-complete", report });
  assert.equal(getPendingFindingsCount(complete.report), 1);
  const reviewed = caseReducer(complete, { type: "update-finding", id: "finding-1", patch: { decision: "include", severity: "high", notes: "Escalate for review" } });
  const memo = caseReducer(reviewed, { type: "change-tab", tab: "memo" });
  assert.equal(getIncludedFindings(memo.report).length, 1);
  assert.equal(getIncludedFindings(memo.report)[0].severity, "high");
  assert.equal(getIncludedFindings(memo.report)[0].notes, "Escalate for review");
  assert.equal(getPendingFindingsCount(memo.report), 0);
  assert.equal(report.findings[0].decision, "pending", "the original provider response is not mutated");
  const excluded = caseReducer(memo, { type: "update-finding", id: "finding-1", patch: { decision: "exclude" } });
  assert.equal(getIncludedFindings(excluded.report).length, 0);
});

test("screening failure preserves metadata and can be retried", () => {
  const edited = caseReducer(initialCaseState, { type: "update-metadata", patch: { assignedOfficer: "Case officer" } });
  const failed = caseReducer(edited, { type: "screening-failed", message: "Unavailable" });
  assert.equal(failed.status, "error");
  const retry = caseReducer(failed, { type: "start-screening" });
  assert.equal(retry.error, null);
  assert.equal(retry.metadata.assignedOfficer, "Case officer");
});

test("runtime response validation rejects unsupported risk levels and malformed counts", () => {
  assert.equal(screeningReportSchema.safeParse(report).success, true);
  assert.equal(screeningReportSchema.safeParse({ ...report, overallRisk: "unknown" }).success, false);
  assert.equal(screeningReportSchema.safeParse({ ...report, entityCount: -1 }).success, false);
  assert.equal(screeningReportSchema.safeParse({ ...report, generatedAt: "yesterday" }).success, false);
});
````

FILE: tests/workflow.spec.ts

````ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function searchForMeridian(page: Page) {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Entity name or GCIF" }).fill("Meridian");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Matches (1)" })).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
}

test("search validates input, returns matches, and handles an empty result", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Entity Search", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Matches (0)" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("01-entity-search.png"), fullPage: true });

  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("Enter an entity name or GCIF to search.");
  await expect(page.getByRole("searchbox")).toHaveAttribute("aria-invalid", "true");

  await page.getByRole("searchbox").fill("no-such-entity-qa");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No entities found for", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Matches (0)" })).toBeVisible();

  await page.getByRole("searchbox").fill("Meridian");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Matches (1)" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meridian Global Resources Ltd" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Confirm entity Meridian Global Resources Ltd" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("02-search-result.png"), fullPage: true });
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("search recovers from a failed API request", async ({ page }) => {
  await page.route("**/api/entities?*", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/");
  await page.getByRole("searchbox").fill("Meridian");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("We couldn’t search the entity directory. Please try again.");
  await expect(page.getByRole("button", { name: "Search", exact: true })).toBeEnabled();
  await page.unroute("**/api/entities?*");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Matches (1)" })).toBeVisible();
});

test("mobile navigation and search fit a 390px viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expectNoHorizontalOverflow(page);
  const navigationToggle = page.getByRole("button", { name: "Open navigation", exact: true });
  await expect(navigationToggle).toHaveAttribute("aria-expanded", "false");
  await navigationToggle.click();
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Search Entity" })).toHaveAttribute("aria-current", "page");
  await navigation.getByRole("link", { name: "Search Entity" }).click();
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toHaveAttribute("aria-expanded", "false");
  await searchForMeridian(page);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("mobile-search.png"), fullPage: true });
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("a confirmed entity can be screened, reviewed, and composed into a memo", async ({ page }, testInfo) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await searchForMeridian(page);
  await page.getByRole("link", { name: "Confirm entity Meridian Global Resources Ltd" }).click();
  await expect(page).toHaveURL(/\/entities\/ENT-001$/);
  await expect(page.getByRole("heading", { name: "Subject entity profile" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Group structure" })).toBeVisible();
  await page.getByLabel("Assigned Officer", { exact: true }).fill("Alex Morgan");
  await page.getByLabel("Transaction Type", { exact: true }).selectOption("Annual review");
  await page.getByLabel("Facility Description", { exact: true }).fill("Annual review of the group facility.");
  await page.screenshot({ path: testInfo.outputPath("03-overview.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);

  const overviewTab = page.getByRole("tab", { name: "Overview & Structure" });
  await overviewTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Screening & Assessment" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Screening & Assessment" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(overviewTab).toBeFocused();

  await page.getByRole("button", { name: "Launch Screening Engine" }).click();
  await expect(page.getByRole("heading", { name: "Screening engine is running" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("04-screening-running.png"), fullPage: true });
  await expect(page.getByRole("heading", { name: "Negative news findings" })).toBeVisible();

  const governanceTitle = "Meridian Global Resources faces shareholder resolution on plantation disclosure";
  const labourTitle = "Investigation finds recruitment fee debt among migrant harvesters at Kalimantan estates";
  const governance = page.getByRole("article", { name: governanceTitle });
  const labour = page.getByRole("article", { name: labourTitle });
  await governance.getByRole("button", { name: "Include", exact: true }).click();
  await expect(governance.getByRole("button", { name: "Include", exact: true })).toHaveAttribute("aria-pressed", "true");
  await governance.getByRole("combobox").selectOption("high");
  await governance.getByRole("textbox").fill("Retain this governance finding for review.");
  await labour.getByRole("button", { name: "Exclude", exact: true }).click();
  await expect(labour.getByRole("button", { name: "Exclude", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: testInfo.outputPath("05-screening-assessment.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);

  await page.getByRole("tab", { name: "Memo Preview" }).click();
  const memorandum = page.getByRole("article", { name: "Screening memorandum" });
  await expect(memorandum.getByText("Alex Morgan", { exact: true })).toBeVisible();
  await expect(memorandum.getByText("Annual review", { exact: true })).toBeVisible();
  await expect(memorandum.getByText("Annual review of the group facility.", { exact: true })).toBeVisible();
  await expect(memorandum.getByRole("heading", { name: "Included findings (1)" })).toBeVisible();
  await expect(memorandum.getByRole("heading", { name: governanceTitle })).toBeVisible();
  await expect(memorandum.getByRole("heading", { name: labourTitle })).toHaveCount(0);
  await expect(memorandum.getByText("Reviewer notes: Retain this governance finding for review.")).toBeVisible();

  await page.getByLabel("Policy notes", { exact: true }).fill("Confirm the latest sector assessment.");
  await page.getByLabel("Equator principles", { exact: true }).check();
  await page.getByLabel("Assessed risk level", { exact: true }).selectOption("medium");
  await page.getByLabel("Risk rationale", { exact: true }).fill("Controls reduce the assessed residual risk.");
  await expect(memorandum.getByText("Controls reduce the assessed residual risk.", { exact: true })).toBeVisible();
  await expect(memorandum.getByText("Policy notes: Confirm the latest sector assessment.")).toBeVisible();
  await expect(memorandum.getByText("Sensitive sector: Palm oil. Equator Principles: Applicable.")).toBeVisible();
  await expect(memorandum.getByText(/^medium risk$/i)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("06-memo-preview.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test("case overview, assessment, and memo fit a mobile viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/entities/ENT-001");
  await expect(page.getByRole("heading", { name: "Subject entity profile" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole("button", { name: "Launch Screening Engine" }).click();
  await expect(page.getByRole("heading", { name: "Negative news findings" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole("article").first().getByRole("button", { name: "Include", exact: true }).click();
  await page.getByRole("tab", { name: "Memo Preview" }).click();
  await expect(page.getByRole("heading", { name: "Included findings (1)" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("mobile-memo.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("API routes validate empty, malformed, unknown, and cross-origin requests", async ({ request }) => {
  const emptySearch = await request.get("/api/entities?q=");
  expect(emptySearch.status()).toBe(400);
  expect(await emptySearch.json()).toEqual({ error: "Enter a valid search of 1 to 120 characters." });

  const malformedScreening = await request.post("/api/screenings", {
    headers: { "Content-Type": "application/json" },
    data: Buffer.from("{not-json"),
  });
  expect(malformedScreening.status()).toBe(400);
  expect(await malformedScreening.json()).toEqual({ error: "Invalid request." });

  const invalidScreening = await request.post("/api/screenings", { data: { entityId: 123 } });
  expect(invalidScreening.status()).toBe(400);

  const unknownScreening = await request.post("/api/screenings", { data: { entityId: "missing-entity" } });
  expect(unknownScreening.status()).toBe(404);
  expect(await unknownScreening.json()).toEqual({ error: "Entity not found." });

  const crossOriginScreening = await request.post("/api/screenings", {
    headers: { Origin: "https://untrusted.example" },
    data: { entityId: "ENT-001" },
  });
  expect(crossOriginScreening.status()).toBe(403);
  expect(await crossOriginScreening.json()).toEqual({ error: "Request not permitted." });
});
````

FILE: scripts/export-source.mjs

````js
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const directories = ["app", "components", "features", "services", "tests", "scripts"];
const rootFiles = ["package.json", "tsconfig.json", "next-env.d.ts", "next.config.ts", "postcss.config.mjs", "eslint.config.mjs", "playwright.config.ts", ".gitignore", "README.md"];

async function listFiles(directory) {
  const entries = await readdir(path.join(projectRoot, directory), { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const relativePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(relativePath) : [relativePath];
  }));
  return files.flat().sort();
}

const sourceFiles = [...rootFiles, ...(await Promise.all(directories.map(listFiles))).flat()];
const languageByExtension = { ".tsx": "tsx", ".ts": "ts", ".mjs": "js", ".json": "json", ".css": "css", ".md": "markdown" };
const sections = await Promise.all(sourceFiles.map(async (file) => {
  const contents = await readFile(path.join(projectRoot, file), "utf8");
  const language = languageByExtension[path.extname(file)] ?? "text";
  return `FILE: ${file}\n\n\`\`\`\`${language}\n${contents.trimEnd()}\n\`\`\`\`\n`;
}));

await writeFile(path.join(projectRoot, "IMPLEMENTATION.md"), [
  "# Complete implementation\n",
  "The architecture, screenshot analysis, assumptions, and run instructions are in README.md below. Each authored source file is included in full. Generated dependency lockfiles, framework instructions, build output, and browser screenshots are delivered separately in the project.\n",
  "## Project structure\n",
  `\`\`\`text\n${sourceFiles.join("\n")}\n\`\`\`\n`,
  ...sections,
].join("\n"));

console.log(`Exported ${sourceFiles.length} complete files to IMPLEMENTATION.md`);
````
