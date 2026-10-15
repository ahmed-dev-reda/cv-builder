"use client";

import { type ComponentType, type RefObject } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
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
  zoom: number;
  downloaded: boolean;
  onDismissDownloaded: () => void;
}

/**
 * Right preview column: zoomable live CV preview. The toolbar lives in
 * BuilderClient so the header spans the full builder width.
 */
export default function BuilderPreview({
  previewRef,
  zoom,
  downloaded,
  onDismissDownloaded,
}: BuilderPreviewProps) {
  const resumeData = useSelector((state: RootState) => state.resume);

  const Template = templates[resumeData.template];

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
  

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
