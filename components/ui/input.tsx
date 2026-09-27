import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input 
  className={`min-h-10 w-full rounded border border-border bg-white px-3 py-2 
    text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-2 focus:outline-offset-2 
    focus:outline-brand disabled:bg-surface disabled:text-muted aria-invalid:border-brand ${className}`} {...props} />;
}
