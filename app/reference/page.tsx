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
