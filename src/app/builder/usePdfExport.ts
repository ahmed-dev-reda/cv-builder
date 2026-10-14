"use client";

import { useState, type RefObject } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { toast } from "sonner";
import { resolvePdfFont, buildPdfDocument } from "@/lib/pdfFonts";

/**
 * Owns PDF export for the builder: resolves the selected font, builds the
 * standalone export document, posts it to /api/generate-pdf, and downloads
 * the resulting file. Tracks the success dialog visibility so callers can
 * coordinate (e.g. suppress competing popups).
 */
export function usePdfExport(
  previewRef: RefObject<HTMLDivElement | null>,
) {
  const resumeData = useSelector((state: RootState) => state.resume);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadPDF = async () => {
    const element = previewRef.current;

    if (!element) return;

    try {
      const styles = Array.from(document.styleSheets)
        .flatMap((sheet) => {
          try {
            return Array.from(sheet.cssRules).map((rule) => rule.cssText);
          } catch {
            return [];
          }
        })
        .join("\n");

      // Resolved per export: real CSS stack + webfont URL for the PDF
      // renderer (opaque next/font identifiers can't leave the Next app).
      const pdfFont = resolvePdfFont(resumeData.font);
      const fullName = resumeData.personalInfo.fullName
        .split(" ")
        .join("")
        .toLowerCase();

      const html = buildPdfDocument({
        css: styles,
        bodyHtml: element.outerHTML,
        font: pdfFont,
      });

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        const error = await response.json();

        throw new Error(error.error || "Failed to generate PDF");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${fullName || "my"}-cv.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      setDownloaded(true);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return {
    downloaded,
    dismissDownloaded: () => setDownloaded(false),
    handleDownloadPDF,
  };
}
