"use client";

import { motion } from "motion/react";
import CVForm from "@/components/builder/CVForm";
import AiAssistant from "@/components/builder/AiAssistant";
import TemplatePicker from "@/components/builder/TemplatePicker";
import BuilderSidebar, {
  SidebarRoute,
} from "@/components/builder/BuilderSidebar";
import type { SaveStatus } from "@/app/builder/useBuilderCv";

const PANEL_COPY: Record<SidebarRoute, { title: string; hint: string }> = {
  editor: { title: "Build your CV", hint: "Fill in your information" },
  templates: { title: "Templates", hint: "Choose a design" },
  ai: { title: "AI Assistant", hint: "Generate content with AI" },
};

interface BuilderPanelProps {
  route: SidebarRoute;
  onRouteChange: (route: SidebarRoute) => void;
  showForm: boolean;
  onToggleForm: (show: boolean) => void;
  saveStatus: SaveStatus;
}

/**
 * Left editing column: mobile nav, icon sidebar, panel header with save
 * status, and the editor/templates/AI content switch.
 */
export default function BuilderPanel({
  route,
  onRouteChange,
  showForm,
  onToggleForm,
  saveStatus,
}: BuilderPanelProps) {
  const copy = PANEL_COPY[route];

  return (
    <>
      {/* ================= MOBILE NAV ================= */}
      <div className="flex xl:hidden border-b border-border bg-surface">
        {(["editor", "templates", "ai"] as const).map((r) => (
          <button
            key={r}
            onClick={() => {
              onRouteChange(r);
              onToggleForm(true);
            }}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
              route === r && showForm
                ? "text-primary border-b-2 border-primary"
                : "text-muted"
            }`}
          >
            {r === "editor" && "Editor"}
            {r === "templates" && "Templates"}
            {r === "ai" && "AI"}
          </button>
        ))}
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="hidden xl:flex">
        <BuilderSidebar active={route} onChange={onRouteChange} />
      </div>

      {/* ================= CONTENT PANEL ================= */}
      <motion.section
        initial={{ x: -40, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{ duration: 0.4 }}
        className={`
          w-full
          shrink-0
          flex-col
          border-b
          border-border
          bg-surface
          shadow-sm
          xl:flex
          xl:h-full
          xl:max-w-105
          xl:border-b-0
          xl:border-r
          ${showForm ? "flex h-[55dvh]" : "hidden xl:flex"}
        `}
      >
        {/* Panel Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 sm:px-5">
          <div>
            <h1 className="text-base font-semibold text-foreground sm:text-lg">
              {copy.title}
            </h1>

            <p className="text-[11px] text-muted sm:text-xs">{copy.hint}</p>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <span className="text-xs text-muted">Saving...</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs text-success">Saved</span>
            )}
            {saveStatus === "error" && (
              <span className="text-xs text-error">Save failed</span>
            )}

            {/* Hide Form Button */}
            <button
              onClick={() => onToggleForm(false)}
              className="rounded-md border border-border px-3 py-2 text-xs font-medium text-muted transition hover:bg-gray-50 hover:text-foreground xl:hidden cursor-pointer"
            >
              Hide
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {route === "editor" && <CVForm />}
          {route === "templates" && <TemplatePicker />}
          {route === "ai" && <AiAssistant />}
        </div>
      </motion.section>
    </>
  );
}
