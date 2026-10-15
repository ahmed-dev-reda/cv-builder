"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { FaFileDownload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import BuilderHeader from "@/components/builder/BuilderHeader";
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

const DESKTOP_MEDIA_QUERY = "(min-width: 1280px)";

/**
 * Builder composition root: owns panel navigation + form visibility (pure
 * UI state) and composes the CV data hook, PDF export, panel, and preview.
 */
export default function BuilderClient({ cvId, initialCv }: BuilderClientProps) {
  const dispatch = useAppDispatch();
  const [sidebarRoute, setSidebarRoute] = useState<SidebarRoute>("editor");
  const [showForm, setShowForm] = useState(true);
  const [zoom, setZoom] = useState(0.5);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateZoom = () => {
      setZoom(desktopQuery.matches ? 1 : 0.5);
    };

    updateZoom();
    desktopQuery.addEventListener("change", updateZoom);
    return () => desktopQuery.removeEventListener("change", updateZoom);
  }, []);

  const pdf = usePdfExport(previewRef);
  const { saveStatus } = useBuilderCv({
    cvId,
    initialCv,
    isDownloadOpen: pdf.downloaded,
  });

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 1.5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const resetZoom = () => {
    setZoom(window.matchMedia(DESKTOP_MEDIA_QUERY).matches ? 1 : 0.5);
  };

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
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-background">
      {/* ================= BUILDER HEADER ================= */}
      <div className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 sm:px-5">
        <div className="min-w-0 flex-1">
          <BuilderHeader />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Show Form (when hidden) */}
          {!showForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <span className="text-xs">Edit CV</span>
            </Button>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
            <button
              onClick={zoomOut}
              className="flex h-8 w-8 items-center justify-center rounded-md text-lg text-muted transition hover:bg-gray-50 hover:text-foreground cursor-pointer"
              aria-label="Zoom out"
            >
              −
            </button>

            <button
              onClick={resetZoom}
              className="min-w-12 rounded-md px-2 py-1 text-sm font-medium text-muted transition hover:bg-gray-50 cursor-pointer"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              onClick={zoomIn}
              className="flex h-8 w-8 items-center justify-center rounded-md text-lg text-muted transition hover:bg-gray-50 hover:text-foreground cursor-pointer"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>

          {/* Download */}
          <Button
            onClick={pdf.handleDownloadPDF}
            size="sm"
            className="gap-1.5 bg-primary hover:bg-primary-dark"
          >
            <FaFileDownload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download PDF</span>

            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row ">
        <BuilderPanel
          route={sidebarRoute}
          onRouteChange={handleSidebarChange}
          showForm={showForm}
          onToggleForm={setShowForm}
          saveStatus={saveStatus}
        />

        <BuilderPreview
          previewRef={previewRef}
          zoom={zoom}
          downloaded={pdf.downloaded}
          onDismissDownloaded={pdf.dismissDownloaded}
        />
      </div>

      {/* ================= SUPPORT ME (single instance) ================= */}
      <SupportMeModal />
    </main>
  );
}
