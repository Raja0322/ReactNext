import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return <section className="py-10"><h1 className="text-2xl font-semibold">Page not found</h1><p className="mt-3 text-muted">This entity or page could not be found.</p><Link href="/" className={buttonStyles({ className: "mt-6" })}>Return to Entity Search</Link></section>;
}
