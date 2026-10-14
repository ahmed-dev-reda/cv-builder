"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { AppDispatch, RootState } from "@/lib/store";
import { setTemplate, TemplateType } from "@/lib/features/resumeSlice";
import { cn } from "@/lib/utils";

import Simple from "@/templates/Simple";
import Minimalist from "@/templates/Minimalist";
import ClassicOne from "@/templates/ClassicOne";
import ClassicTwo from "@/templates/ClassicTwo";
import MinimalistTwo from "@/templates/MinimalistTwo";
import ClassicThree from "@/templates/ClassicThree";
import ClassicFour from "@/templates/ClassicFour";

const templates: Array<{
  id: TemplateType;
  name: string;
  description: string;
  Component: React.ElementType;
}> = [
  { id: "simple", name: "Simple", description: "Clean and minimal", Component: Simple },
  { id: "minimalist", name: "Minimalist", description: "Less is more", Component: Minimalist },
  { id: "classicOne", name: "Classic One", description: "Traditional layout", Component: ClassicOne },
  { id: "classicTwo", name: "Classic Two", description: "Elegant and formal", Component: ClassicTwo },
  { id: "minimalistTwo", name: "Minimalist Two", description: "Modern minimal", Component: MinimalistTwo },
  { id: "classicThree", name: "Classic Three", description: "Professional", Component: ClassicThree },
  { id: "classicFour", name: "Classic Four", description: "Bold and structured", Component: ClassicFour },
];

// Card inner width (~200px) relative to the fixed 794px template canvas.
const MINIATURE_SCALE = 0.25;

function TemplateMiniature({ Component, label }: { Component: React.ElementType; label: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none h-full w-full origin-top-left select-none overflow-hidden bg-white"
      style={{ width: 794, transform: `scale(${MINIATURE_SCALE})` }}
    >
      {/* Live render of the actual template with the current CV data */}
      <Component />
      <span className="sr-only">{label} preview</span>
    </div>
  );
}

const MemoMiniature = React.memo(TemplateMiniature);

export default function TemplatePicker() {
  const dispatch = useDispatch<AppDispatch>();
  const current = useSelector((state: RootState) => state.resume.template);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Choose a Template</h2>
        <p className="text-xs text-muted">Live preview with your current CV data</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {templates.map((tmpl, index) => {
            const isActive = current === tmpl.id;

            return (
              <motion.button
                key={tmpl.id}
                onClick={() => dispatch(setTemplate(tmpl.id))}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                  delay: Math.min(index * 0.04, 0.24),
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={isActive}
                aria-label={`Use ${tmpl.name} template`}
                className={cn(
                  "group relative flex flex-col items-center rounded-lg border-2 p-2 transition-colors cursor-pointer",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-gray-50",
                )}
              >
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute right-1.5 top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-primary"
                  >
                    <Check className="h-2.5 w-2.5 text-white" />
                  </motion.div>
                )}

                {/* Live template preview thumbnail */}
                <div
                  className={cn(
                    "mb-2 aspect-4/5 w-full overflow-hidden rounded border border-border bg-white",
                    isActive && "border-primary/30",
                  )}
                >
                  <MemoMiniature Component={tmpl.Component} label={tmpl.name} />
                </div>

                <span className="text-[11px] font-medium text-foreground">
                  {tmpl.name}
                </span>
                <span className="text-[9px] text-muted">{tmpl.description}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
