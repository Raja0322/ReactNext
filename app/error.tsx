"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="py-10" role="alert"><h1 className="text-2xl font-semibold">We couldn’t load this page</h1><p className="mt-3 text-muted">Please try again. If the issue continues, contact your support team.</p><Button onClick={reset} className="mt-6">Try again</Button></section>;
}
