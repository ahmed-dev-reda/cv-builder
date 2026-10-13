"use client";

import * as React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { FaFileDownload } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

import CVForm from "@/components/builder/CVForm";
import BuilderHeader from "@/components/builder/BuilderHeader";
import DownloadSuccess from "@/components/builder/DownloadSuccess";
import AiAssistant from "@/components/builder/AiAssistant";
import BuilderSidebar, { SidebarRoute } from "@/components/builder/BuilderSidebar";
import TemplatePicker from "@/components/builder/TemplatePicker";

import Simple from "@/templates/Simple";
import Minimalist from "@/templates/Minimalist";
import ClassicOne from "@/templates/ClassicOne";
import ClassicTwo from "@/templates/ClassicTwo";
import MinimalistTwo from "@/templates/MinimalistTwo";
import ClassicThree from "@/templates/ClassicThree";
import ClassicFour from "@/templates/ClassicFour";

import { RootState } from "@/lib/store";
import { TemplateType, setResume } from "@/lib/features/resumeSlice";
import {
  inter,
  lato,
  merriweather,
  montserrat,
  nunito,
  openSans,
  oswald,
  playfairDisplay,
  poppins,
  roboto,
} from "@/lib/fonts";
import { useSession } from "next-auth/react";
import {
  saveGuestCv,
  getGuestCv,
  getActiveGuestCvId,
  setActiveGuestCv,
  updateAuthenticatedCv,
  fetchAuthenticatedCv,
} from "@/lib/persistence";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { validateResumeData } from "@/lib/validation";

const fontMap: Record<
  string,
  {
    className: string;
    fontFamily: string;
  }
> = {
  inter: {
    className: inter.className,
    fontFamily: inter.style.fontFamily,
  },
  roboto: {
    className: roboto.className,
    fontFamily: roboto.style.fontFamily,
  },
  "open-sans": {
    className: openSans.className,
    fontFamily: openSans.style.fontFamily,
  },
  lato: {
    className: lato.className,
    fontFamily: lato.style.fontFamily,
  },
  montserrat: {
    className: montserrat.className,
    fontFamily: montserrat.style.fontFamily,
  },
  poppins: {
    className: poppins.className,
    fontFamily: poppins.style.fontFamily,
  },
  merriweather: {
    className: merriweather.className,
    fontFamily: merriweather.style.fontFamily,
  },
  "playfair-display": {
    className: playfairDisplay.className,
    fontFamily: playfairDisplay.style.fontFamily,
  },
  oswald: {
    className: oswald.className,
    fontFamily: oswald.style.fontFamily,
  },
  nunito: {
    className: nunito.className,
    fontFamily: nunito.style.fontFamily,
  },
  "times-new-roman": {
    className: "",
    fontFamily: '"Times New Roman", serif',
  },
};

export default function Builder() {
  const resumeData = useSelector((state: RootState) => state.resume);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();

  const cvId = searchParams.get("cv");

  const fullName = resumeData.personalInfo.fullName
    .split(" ")
    .join("")
    .toLowerCase();

  const template: TemplateType = resumeData.template;
  const selectedFont = fontMap[resumeData.font] ?? fontMap.inter;
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

  const [sidebarRoute, setSidebarRoute] = useState<SidebarRoute>("editor");
  const [downloaded, setDownloaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showForm, setShowForm] = useState(true);
  const [, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [currentCvId, setCurrentCvId] = useState<string | null>(null);
  const [currentCvName, setCurrentCvName] = useState("My CV");

  // Guards autosave while a CV is being loaded. A ref is used deliberately so
  // that flipping it synchronously from the load effect is not a state update.
  const loadingCvRef = useRef(false);

  const saveCurrentCv = useCallback(async () => {
    if (loadingCvRef.current) return;

    setSaving(true);
    setSaveStatus("saving");

    try {
      if (user && currentCvId) {
        await updateAuthenticatedCv(currentCvId, currentCvName, resumeData);
      } else if (!user && currentCvId) {
        saveGuestCv({
          id: currentCvId,
          name: currentCvName,
          data: resumeData,
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        // Create new CV
        const newId = crypto.randomUUID();
        if (user) {
          const res = await fetch("/api/cvs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: currentCvName, data: resumeData }),
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentCvId(data.id);
          }
        } else {
          saveGuestCv({
            id: newId,
            name: currentCvName,
            data: resumeData,
            is_default: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          setCurrentCvId(newId);
          setActiveGuestCv(newId);
        }
      }
      setSaveStatus("saved");
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }, [user, currentCvId, currentCvName, resumeData]);

  // Load CV from URL param (authenticated) or the active guest CV
  useEffect(() => {
    if (user) {
      if (!cvId) return;

      loadingCvRef.current = true;
      let cancelled = false;

      (async () => {
        try {
          const cv = await fetchAuthenticatedCv(cvId);
          if (!cancelled) {
            const validation = validateResumeData(cv.data);
            if (!validation.valid || !validation.data) {
              toast.error("Saved CV data is corrupted");
              return;
            }
            dispatch(setResume(validation.data));
            setCurrentCvId(cv.id);
            setCurrentCvName(cv.name);
          }
        } catch (error) {
          if (!cancelled) {
            console.error("Failed to load CV:", error);
            toast.error("Failed to load CV");
          }
        } finally {
          if (!cancelled) loadingCvRef.current = false;
        }
      })();

      return () => {
        cancelled = true;
      };
    }

    // Guest mode: hydrate from the active guest CV
    (async () => {
      const activeId = getActiveGuestCvId();
      if (!activeId) return;
      const cv = getGuestCv(activeId);
      if (!cv) return;
      // Yield to the microtask queue so no setState happens synchronously
      // within the effect body (satisfies react-hooks/set-state-in-effect).
      await Promise.resolve();
      const validation = validateResumeData(cv.data);
      if (!validation.valid || !validation.data) {
        toast.error("Saved CV data is corrupted");
        return;
      }
      dispatch(setResume(validation.data));
      setCurrentCvId(cv.id);
      setCurrentCvName(cv.name);
    })();
  }, [cvId, user, dispatch]);

  // Autosave with debounce
  useEffect(() => {
    if (loadingCvRef.current) return;

    const timeout = setTimeout(async () => {
      await saveCurrentCv();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [resumeData, currentCvId, currentCvName, saveCurrentCv]);

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

            .cv-font,
            .cv-font * {
              font-family: ${selectedFont.fontFamily} !important;
            }
          </style>
        </head>

        <body>
          <div
            class="cv-font"
            style="font-family: ${selectedFont.fontFamily};"
          >
            ${element.outerHTML}
          </div>
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
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleNewCv = () => {
    setCurrentCvId(null);
    setCurrentCvName("My CV");
    router.push("/builder");
  };

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-background xl:flex-row">
      {/* ================= MOBILE NAV ================= */}
      <div className="flex xl:hidden border-b border-border bg-surface">
        {(["editor", "templates", "ai"] as const).map((route) => (
          <button
            key={route}
            onClick={() => {
              setSidebarRoute(route);
              setShowForm(true);
            }}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
              sidebarRoute === route && showForm
                ? "text-primary border-b-2 border-primary"
                : "text-muted"
            }`}
          >
            {route === "editor" && "Editor"}
            {route === "templates" && "Templates"}
            {route === "ai" && "AI"}
          </button>
        ))}
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="hidden xl:flex">
        <BuilderSidebar active={sidebarRoute} onChange={setSidebarRoute} />
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
              {sidebarRoute === "editor" && "Build your CV"}
              {sidebarRoute === "templates" && "Templates"}
              {sidebarRoute === "ai" && "AI Assistant"}
            </h1>

            <p className="text-[11px] text-muted sm:text-xs">
              {sidebarRoute === "editor" && "Fill in your information"}
              {sidebarRoute === "templates" && "Choose a design"}
              {sidebarRoute === "ai" && "Generate content with AI"}
            </p>
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
              onClick={() => setShowForm(false)}
              className="rounded-md border border-border px-3 py-2 text-xs font-medium text-muted transition hover:bg-gray-50 hover:text-foreground xl:hidden cursor-pointer"
            >
              Hide
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {sidebarRoute === "editor" && <CVForm />}
          {sidebarRoute === "templates" && <TemplatePicker />}
          {sidebarRoute === "ai" && <AiAssistant />}
        </div>
      </motion.section>

      {/* ================= DOWNLOAD SUCCESS ================= */}
      <DownloadSuccess open={downloaded} onClose={() => setDownloaded(false)} />

      {/* ================= PREVIEW ================= */}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <span className="text-xs">Edit CV</span>
              </Button>
            )}

            {/* New CV */}
            <Button variant="outline" size="sm" onClick={handleNewCv}>
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
              onClick={handleDownloadPDF}
              size="sm"
              className="gap-1.5 bg-primary hover:bg-primary-dark"
            >
              <FaFileDownload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download PDF</span>

              <span className="sm:hidden">Download</span>
            </Button>
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