"use client";

import { useRef } from "react";

import { FaFileDownload } from "react-icons/fa";

import CVForm from "@/components/builder/CVForm";

import Simple from "@/templates/Simple";
import Minimalist from "@/templates/Minimalist";
import ClassicOne from "@/templates/ClassicOne";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import BuilderHeader from "@/components/builder/BuilderHeader";
import { TemplateType } from "@/lib/features/resumeSlice";
import { motion } from "motion/react";
import ClassicTwo from "@/templates/ClassicTwo";
import MinimalistTwo from "@/templates/MinimalistTwo";

// Builder page — form editor, live preview, and PDF export
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
  };
  const Template = templates[template];

  const ref = useRef<HTMLDivElement>(null);

  // Handlers

  // Capture preview as PNG, embed full-page in A4 PDF, trigger download

  const handleDownloadPDF = async () => {
    const element = ref.current;

    if (!element) return;

    try {
      // Get Tailwind/global styles from the current page
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
      link.download = `${fullName}-cv.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  // Render — two-column layout: editable form (left) and live preview (right)

  return (
    <main className="flex max-xl:flex-col xl:max-h-dvh bg-[#E5EEFF]">
      {/* Form */}

      <motion.section
        initial={{ x: -500 }}
        animate={{ x: 0 }}
        className="flex flex-1 flex-col border-r border-gray-300 bg-[#F8F9FF] shadow-2xl"
      >
        <div className="flex-1 overflow-hidden ">
          <CVForm />
        </div>

        {/* Download */}

        <div className="border-t border-gray-300 p-4">
          {/* Split button: download action + quality picker toggle */}

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="relative m-auto w-fit flex items-center rounded-lg border border-gray-300 bg-white text-[#0D47A1] shadow-sm px-4 py-2 gap-2 cursor-pointer"
          >
            <FaFileDownload />
            Download PDF
          </button>
        </div>
      </motion.section>

      {/* Preview */}

      {/* A4-sized canvas; ref here is the PDF capture target */}

      <section className="h-full flex-3 overflow-auto bg-[#E5EEFF] py-4 xl:p-0">
        <BuilderHeader />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="h-full flex justify-center mt-10 max-xl:zoom-75 max-lg:zoom-60"
        >
          <div
            ref={ref}
            className={`h-280.75 w-198.5 origin-top bg-white ${resumeData.font}`}
          >
            <Template />
          </div>
        </motion.div>
      </section>
    </main>
  );
}
