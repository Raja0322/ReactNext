import { BriefcaseBusiness, Building2, ChartColumn, LayoutDashboard } from "lucide-react";

export const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Search Entity", href: "/", icon: BriefcaseBusiness },
  { label: "Case Queue", href: "/cases", icon: ChartColumn },
  { label: "Reference", href: "/reference", icon: Building2 },
] as const;

export function isNavigationActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href === "/cases") return pathname === "/cases" || pathname.startsWith("/entities/");
  return pathname === href || pathname.startsWith(`${href}/`);
}
