"use client";

import { useRef, useState, useCallback } from "react";
import { useAppDispatch } from "@/lib/hooks";
import BuilderPanel from "@/components/builder/BuilderPanel";
import BuilderPreview from "@/components/builder/BuilderPreview";
import SupportMeModal from "@/components/builder/SupportMeModal";
import type { SidebarRoute } from "@/components/builder/BuilderSidebar";
import { requestSupportMe } from "@/lib/features/supportMeSlice";
import { useBuilderCv } from "./useBuilderCv";
import { usePdfExport } from "./usePdfExport";
import type { InitialCv } from "./useBuilderCv";

interface BuilderClientProps {
  cvId: string | null;
  initialCv: InitialCv | null;
}

/**
 * Builder composition root: owns panel navigation + form visibility (pure
 * UI state) and composes the CV data hook, PDF export, panel, and preview.
 */
export default function BuilderClient({ cvId, initialCv }: BuilderClientProps) {
  const dispatch = useAppDispatch();
  const [sidebarRoute, setSidebarRoute] = useState<SidebarRoute>("editor");
  const [showForm, setShowForm] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const pdf = usePdfExport(previewRef);
  const { saveStatus, startNewCv } = useBuilderCv({
    cvId,
    initialCv,
    isDownloadOpen: pdf.downloaded,
  });

  // Panel navigation. Returning to the Editor panel counts as the
  // "go back to the previous editing step" trigger (the project has no
  // undo handler, so this is the closest existing back action).
  const handleSidebarChange = useCallback(
    (route: SidebarRoute) => {
      setSidebarRoute(route);
      if (route === "editor") {
        dispatch(requestSupportMe("back"));
      }
    },
    [dispatch],
  );

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-background xl:flex-row">
      <BuilderPanel
        route={sidebarRoute}
        onRouteChange={handleSidebarChange}
        showForm={showForm}
        onToggleForm={setShowForm}
        saveStatus={saveStatus}
      />

      <BuilderPreview
        previewRef={previewRef}
        showForm={showForm}
        onShowForm={() => setShowForm(true)}
        onNewCv={startNewCv}
        downloaded={pdf.downloaded}
        onDismissDownloaded={pdf.dismissDownloaded}
        onDownload={pdf.handleDownloadPDF}
      />

      {/* ================= SUPPORT ME (single instance) ================= */}
      <SupportMeModal />
    </main>
  );
}
