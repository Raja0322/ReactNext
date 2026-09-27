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
