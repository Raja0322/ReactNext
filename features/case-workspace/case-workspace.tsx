"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";

import { Button } from "@/components/ui/button";
import type { Entity } from "@/features/entity-search/types";
import { requestScreening } from "@/services/screening-api";

import { AssessmentPanel } from "./assessment-panel";
import { caseReducer, initialCaseState } from "./case-state";
import { CaseTabs } from "./case-tabs";
import { MemoPanel } from "./memo-panel";
import { OverviewPanel } from "./overview-panel";
import { ScreeningProgress } from "./screening-progress";

export function CaseWorkspace({ entity }: { entity: Entity }) {
  const [state, dispatch] = useReducer(caseReducer, initialCaseState);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => () => activeRequest.current?.abort(), []);

  async function launchScreening() {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    dispatch({ type: "start-screening" });

    try {
      const report = await requestScreening({ entityId: entity.id }, controller.signal);
      if (!controller.signal.aborted) dispatch({ type: "screening-complete", report });
    } catch (error) {
      if (!controller.signal.aborted) {
        dispatch({
          type: "screening-failed",
          message: error instanceof Error && error.message.startsWith("Screening")
            ? error.message
            : "Screening could not be completed. Check your connection and try again.",
        });
      }
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  }

  return (
    <div className={state.tab === "memo" ? "case-workspace case-memo" : "case-workspace"}>
      <header className="print:hidden">
        <h1 className="text-2xl font-semibold tracking-tight">{entity.name}</h1>
        <p className="mt-1.5 text-sm text-muted">Part of {entity.groupName}</p>
      </header>
      <div className="print:hidden">
        <CaseTabs activeTab={state.tab} onTabChange={(tab) => dispatch({ type: "change-tab", tab })} />
      </div>
      <p className="sr-only" role="status">{state.status === "complete" ? `Screening complete. ${state.report?.findings.length ?? 0} findings available.` : ""}</p>

      <div id="case-panel-overview" role="tabpanel" aria-labelledby="case-tab-overview" tabIndex={0} hidden={state.tab !== "overview"} className="outline-offset-4">
        {state.tab === "overview" && <OverviewPanel
          entity={entity}
          metadata={state.metadata}
          isRunning={state.status === "running"}
          hasReport={state.report !== null}
          onMetadataChange={(patch) => dispatch({ type: "update-metadata", patch })}
          onLaunch={launchScreening}
          onViewReport={() => dispatch({ type: "change-tab", tab: "assessment" })}
        />}
      </div>

      <div id="case-panel-assessment" role="tabpanel" aria-labelledby="case-tab-assessment" tabIndex={0} hidden={state.tab !== "assessment"} className="outline-offset-4">
        {state.tab === "assessment" && <>
          {state.status === "running" ? <ScreeningProgress entityCount={entity.group.length} />
            : state.status === "error" ? <div className="mt-8 border border-brand/30 p-8">
              <p role="alert" className="text-sm text-brand">{state.error}</p>
              <Button className="mt-4" onClick={launchScreening}>Retry screening</Button>
            </div>
              : state.report ? <AssessmentPanel report={state.report} onFindingChange={(id, patch) => dispatch({ type: "update-finding", id, patch })} />
                : <ScreeningEmptyState onLaunch={launchScreening} />}
        </>}
      </div>

      <div id="case-panel-memo" role="tabpanel" aria-labelledby="case-tab-memo" tabIndex={0} hidden={state.tab !== "memo"} className="outline-offset-4">
        {state.tab === "memo" && (state.report ? <MemoPanel
          entity={entity}
          report={state.report}
          metadata={state.metadata}
          policy={state.policy}
          onPolicyChange={(patch) => dispatch({ type: "update-policy", patch })}
        /> : state.status === "running" ? <ScreeningProgress entityCount={entity.group.length} /> : <ScreeningEmptyState onLaunch={launchScreening} forMemo />)}
      </div>
    </div>
  );
}

function ScreeningEmptyState({ onLaunch, forMemo = false }: { onLaunch: () => void; forMemo?: boolean }) {
  return (
    <div className="mt-8 flex min-h-60 flex-col items-center justify-center border border-border p-8 text-center">
      <ShieldCheck size={30} className="mb-4 text-muted" aria-hidden="true" />
      <h2 className="text-base font-semibold">{forMemo ? "Your memo starts with a screening" : "Ready to screen this group"}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">Launch the screening engine to review sample findings and prepare the risk assessment.</p>
      <Button className="mt-5" onClick={onLaunch}>Launch Screening Engine</Button>
    </div>
  );
}
