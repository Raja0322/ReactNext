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
