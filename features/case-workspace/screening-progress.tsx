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
