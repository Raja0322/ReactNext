import type { RiskLevel } from "./types";

const colorClasses: Record<RiskLevel, string> = {
  low: "bg-emerald-700 text-white",
  medium: "bg-amber-400 text-amber-950",
  high: "bg-red-700 text-white",
  critical: "bg-[#321057] text-white",
};

export function RiskBadge({ level, className = "", showRisk = false }: { level: RiskLevel; className?: string; showRisk?: boolean }) {
  return <span className={`inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold uppercase leading-none ${colorClasses[level]} ${className}`}>{level}{showRisk ? " risk" : ""}</span>;
}
