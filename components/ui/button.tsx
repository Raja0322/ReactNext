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
