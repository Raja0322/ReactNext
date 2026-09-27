import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return <div role="status" className="flex items-center gap-3 py-10 text-sm text-muted"><LoaderCircle className="animate-spin text-brand" size={20} aria-hidden="true" />Loading workspace…</div>;
}
