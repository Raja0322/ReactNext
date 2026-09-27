import { Activity, FileText, ShieldCheck } from "lucide-react";
import type { KeyboardEvent } from "react";

import type { CaseTab } from "./types";

const tabs = [
  { id: "overview", label: "Overview & Structure", icon: Activity },
  { id: "assessment", label: "Screening & Assessment", icon: ShieldCheck },
  { id: "memo", label: "Memo Preview", icon: FileText },
] as const;

interface CaseTabsProps {
  activeTab: CaseTab;
  onTabChange: (tab: CaseTab) => void;
}

export function CaseTabs({ activeTab, onTabChange }: CaseTabsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % tabs.length; break;
      case "ArrowLeft": nextIndex = (index + tabs.length - 1) % tabs.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    const next = tabs[nextIndex];
    onTabChange(next.id);
    document.getElementById(`case-tab-${next.id}`)?.focus();
  }

  return (
    <div className="mt-3 flex overflow-x-auto border-b border-border" role="tablist" aria-label="Entity case sections">
      {tabs.map(({ id, label, icon: Icon }, index) => (
        <button
          key={id}
          id={`case-tab-${id}`}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          aria-controls={`case-panel-${id}`}
          tabIndex={activeTab === id ? 0 : -1}
          onClick={() => onTabChange(id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={`flex shrink-0 items-center gap-2.5 border-b-2 px-4 py-4 text-sm font-semibold transition-colors outline-offset-[-4px] focus-visible:outline-2 focus-visible:outline-brand sm:px-5 ${activeTab === id ? "border-brand text-foreground" : "border-transparent text-muted hover:text-foreground"}`}
        >
          <Icon aria-hidden="true" size={22} strokeWidth={1.9} />
          {label}
        </button>
      ))}
    </div>
  );
}
