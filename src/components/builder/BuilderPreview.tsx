"use client";

import { useState, type ComponentType, type RefObject } from "react";
import { useSelector } from "react-redux";
import { FaFileDownload } from "react-icons/fa";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import BuilderHeader from "@/components/builder/BuilderHeader";
import DownloadSuccess from "@/components/builder/DownloadSuccess";

import Simple from "@/templates/Simple";
import Minimalist from "@/templates/Minimalist";
import ClassicOne from "@/templates/ClassicOne";
import ClassicTwo from "@/templates/ClassicTwo";
import MinimalistTwo from "@/templates/MinimalistTwo";
import ClassicThree from "@/templates/ClassicThree";
import ClassicFour from "@/templates/ClassicFour";

import type { TemplateType } from "@/lib/features/resumeSlice";

const templates: Record<TemplateType, ComponentType> = {
  simple: Simple,
  minimalist: Minimalist,
  classicOne: ClassicOne,
  classicTwo: ClassicTwo,
  minimalistTwo: MinimalistTwo,
  classicThree: ClassicThree,
  classicFour: ClassicFour,
};

interface BuilderPreviewProps {
  previewRef: RefObject<HTMLDivElement | null>;
  showForm: boolean;
  onShowForm: () => void;
  onNewCv: () => void;
  downloaded: boolean;
  onDismissDownloaded: () => void;
  onDownload: () => void;
}

/**
 * Right preview column: toolbar (header, form toggle, new CV, zoom,
 * download) and the zoomable live CV preview.
 */
export default function BuilderPreview({
  previewRef,
  showForm,
  onShowForm,
  onNewCv,
  downloaded,
  onDismissDownloaded,
  onDownload,
}: BuilderPreviewProps) {
  const resumeData = useSelector((state: RootState) => state.resume);
  const [zoom, setZoom] = useState(1);

  const Template = templates[resumeData.template];

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 1.5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Builder Header */}
      <div
        className="
          flex
          min-h-16
          shrink-0
          flex-wrap
          items-center
          justify-between
          gap-2
          border-b
          border-border
          bg-surface
          px-3
          py-2
          sm:px-5
        "
      >
        <div className="min-w-0 flex-1">
          <BuilderHeader />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Show Form (when hidden) */}
          {!showForm && (
            <Button variant="outline" size="sm" onClick={onShowForm}>
              <span className="text-xs">Edit CV</span>
            </Button>
          )}

          {/* New CV */}
          <Button variant="outline" size="sm" onClick={onNewCv}>
            <span className="text-xs">New</span>
          </Button>

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
            onClick={onDownload}
            size="sm"
            className="gap-1.5 bg-primary hover:bg-primary-dark"
          >
            <FaFileDownload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download PDF</span>

            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </div>

      {/* Download success dialog (state owned by the export hook) */}
      <DownloadSuccess open={downloaded} onClose={onDismissDownloaded} />

      {/* Preview Scroll Area */}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex min-h-full min-w-full justify-center px-3 py-6 sm:px-6 sm:py-10">
          <div
            className="origin-top"
            style={{
              transform: `scale(${zoom})`,
              marginBottom: `${(zoom - 1) * 1123}px`,
            }}
          >
            <div
              ref={previewRef}
              className={`
                h-280.75
                w-198.5
                shrink-0
                bg-white
                shadow-[0_8px_35px_rgba(0,0,0,0.12)]
                ${resumeData.font}
              `}
            >
              <Template />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
