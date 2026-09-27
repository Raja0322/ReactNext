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
