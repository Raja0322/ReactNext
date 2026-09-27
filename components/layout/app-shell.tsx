"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { isNavigationActive, navigation } from "./navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-dvh">
      <a href="#main-content" className="sr-only fixed top-3 left-3 z-50 rounded bg-white p-3 text-brand shadow focus:not-sr-only">Skip to main content</a>
      <header data-app-header className="flex min-h-24 flex-wrap items-center gap-y-3 px-5 py-5 md:flex-nowrap md:px-6 md:py-7">
        <div className="flex w-full shrink-0 items-center gap-5 md:w-56">
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} className="flex size-9 items-center justify-center rounded hover:bg-surface md:hidden">
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed} aria-controls="desktop-navigation" aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} className="hidden size-7 items-center justify-center rounded hover:bg-surface md:flex">
            <Menu size={23} aria-hidden="true" />
          </button>
          <Link href="/" aria-label="MUFG — entity search"><BrandLogo /></Link>
        </div>
        <p className="pl-14 text-sm font-medium text-foreground md:pl-6 md:text-base">Armo Reputation Risk Screening Platform</p>
      </header>

      <nav id="mobile-navigation" aria-label="Primary navigation" className={`${mobileOpen ? "block" : "hidden"} border-y border-border px-4 py-2 md:hidden`}>
        {navigation.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)} aria-current={isNavigationActive(href, pathname) ? "page" : undefined} className="flex min-h-12 items-center gap-3 rounded px-3 text-sm font-semibold hover:bg-surface aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand">
            <Icon size={22} aria-hidden="true" />{label}
          </Link>
        ))}
      </nav>

      <div className="flex">
        <aside data-app-sidebar className={`hidden min-h-[calc(100dvh-96px)] shrink-0 flex-col pt-4 md:flex ${collapsed ? "w-20" : "w-62"}`}>
          <nav id="desktop-navigation" aria-label="Primary navigation" className="space-y-1">
            {navigation.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined} className={`flex min-h-13 items-center gap-3 border-l-2 border-transparent px-6 text-sm font-semibold hover:bg-surface aria-[current=page]:border-brand aria-[current=page]:text-brand ${collapsed ? "justify-center px-0" : ""}`}>
                <Icon size={23} strokeWidth={2} aria-hidden="true" />{!collapsed && <span>{label}</span>}
              </Link>
            ))}
          </nav>
        </aside>
        <main id="main-content" data-app-content tabIndex={-1} className="min-w-0 flex-1 px-5 pt-6 pb-16 outline-none md:px-6 md:pt-6 lg:pr-12 lg:pl-8">
          {children}
        </main>
      </div>
    </div>
  );
}
