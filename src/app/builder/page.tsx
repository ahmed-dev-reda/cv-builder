"use client";

import { useRef, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

import CVForm from "@/components/builder/CVForm";
import BuilderHeader from "@/components/builder/BuilderHeader";
import DownloadSuccess from "@/components/builder/DownloadSuccess";

import Simple from "@/templates/Simple";
import Minimalist from "@/templates/Minimalist";
import ClassicOne from "@/templates/ClassicOne";
import ClassicTwo from "@/templates/ClassicTwo";
import MinimalistTwo from "@/templates/MinimalistTwo";
import ClassicThree from "@/templates/ClassicThree";
import ClassicFour from "@/templates/ClassicFour";

import { RootState } from "@/lib/store";
import { TemplateType } from "@/lib/features/resumeSlice";

export default function Builder() {
  const resumeData = useSelector((state: RootState) => state.resume);

  const fullName = resumeData.personalInfo.fullName
    .split(" ")
    .join("")
    .toLowerCase();

  const template: TemplateType = resumeData.template;

  const templates = {
    simple: Simple,
    minimalist: Minimalist,
    classicOne: ClassicOne,
    classicTwo: ClassicTwo,
    minimalistTwo: MinimalistTwo,
    classicThree: ClassicThree,
    classicFour: ClassicFour,
  };

  const Template = templates[template];

  const ref = useRef<HTMLDivElement>(null);

  const [downloaded, setDownloaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showForm, setShowForm] = useState(true);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 1.5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const handleDownloadPDF = async () => {
    const element = ref.current;

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

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />

            <style>
              ${styles}

              @page {
                size: A4;
                margin: 0;
              }

              html,
              body {
                margin: 0;
                padding: 0;
                background: white;
              }

              * {
                box-sizing: border-box;
              }
            </style>
          </head>

          <body>
            ${element.outerHTML}
          </body>
        </html>
      `;

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
    }
  };

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-[#eef2f7] xl:flex-row">
      {/* ================= FORM ================= */}
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
          border-gray-200
          bg-white
          shadow-sm
          xl:flex
          xl:h-full
          xl:max-w-105
          xl:border-b-0
          xl:border-r
          ${showForm ? "flex h-[55dvh]" : "hidden xl:flex"}
        `}
      >
        {/* Form Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4 sm:px-5">
          <div>
            <h1 className="text-base font-semibold text-gray-900 sm:text-lg">
              Build your CV
            </h1>

            <p className="text-[11px] text-gray-500 sm:text-xs">
              Fill in your information
            </p>
          </div>

          {/* Hide Form Button */}
          <button
            onClick={() => setShowForm(false)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black xl:hidden"
          >
            Hide
          </button>
        </div>

        {/* Form Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <CVForm />
        </div>
      </motion.section>

      {/* ================= DOWNLOAD SUCCESS ================= */}
      <DownloadSuccess open={downloaded} onClose={() => setDownloaded(false)} />

      {/* ================= PREVIEW ================= */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#eef2f7]">
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
            border-gray-200
            bg-[#F8F9FF]
            px-3
            py-2
            sm:px-5
          "
        >
          <div className="min-w-0 flex-1">
            <BuilderHeader />
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Show Form */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-100
                  sm:text-sm
                "
              >
                Edit CV
              </button>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
              <button
                onClick={zoomOut}
                className="flex h-8 w-8 items-center justify-center rounded-md text-lg text-gray-600 transition hover:bg-gray-100 hover:text-black"
                aria-label="Zoom out"
              >
                −
              </button>

              <button
                onClick={resetZoom}
                className="min-w-12 rounded-md px-2 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                {Math.round(zoom * 100)}%
              </button>

              <button
                onClick={zoomIn}
                className="flex h-8 w-8 items-center justify-center rounded-md text-lg text-gray-600 transition hover:bg-gray-100 hover:text-black"
                aria-label="Zoom in"
              >
                +
              </button>
            </div>

            {/* Download */}
            <button
              onClick={handleDownloadPDF}
              className="
                flex
                h-9
                items-center
                gap-1.5
                rounded-lg
                bg-[#0D47A1]
                px-3
                text-xs
                font-medium
                text-white
                transition
                hover:bg-[#1355b8]
                active:scale-95
                sm:h-10
                sm:gap-2
                sm:px-4
                sm:text-sm
              "
            >
              <FaFileDownload size={14} />

              <span className="hidden sm:inline">Download PDF</span>

              <span className="sm:hidden">Download</span>
            </button>
          </div>
        </div>

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
                ref={ref}
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
    </main>
  );
}
