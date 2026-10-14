"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { AppDispatch, RootState } from "@/lib/store";
import { setTemplate, TemplateType } from "@/lib/features/resumeSlice";
import { cn } from "@/lib/utils";

import simple from "@/thumbnails/simple.jpg";
import minimalist from "@/thumbnails/minimalist.jpg";
import classicOne from "@/thumbnails/classic_one.jpg";
import classicTwo from "@/thumbnails/classic_two.png";
import minimalistTwo from "@/thumbnails/minimalist_two.png";
import classicThree from "@/thumbnails/classic_three.png";
import classicFour from "@/thumbnails/classic_four.png";

const templates: Array<{
  id: TemplateType;
  name: string;
  description: string;
  image: StaticImageData;
}> = [
  { id: "simple", name: "Simple", description: "Clean and minimal", image: simple },
  { id: "minimalist", name: "Minimalist", description: "Less is more", image: minimalist },
  { id: "classicOne", name: "Classic One", description: "Traditional layout", image: classicOne },
  { id: "classicTwo", name: "Classic Two", description: "Elegant and formal", image: classicTwo },
  { id: "minimalistTwo", name: "Minimalist Two", description: "Modern minimal", image: minimalistTwo },
  { id: "classicThree", name: "Classic Three", description: "Professional", image: classicThree },
  { id: "classicFour", name: "Classic Four", description: "Bold and structured", image: classicFour },
];

export default function TemplatePicker() {
  const dispatch = useDispatch<AppDispatch>();
  const current = useSelector((state: RootState) => state.resume.template);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Choose a Template</h2>
        <p className="text-xs text-muted">Select a design for your CV</p>
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

                {/* Template preview thumbnail */}
                <div
                  className={cn(
                    "mb-2 aspect-4/5 w-full overflow-hidden rounded border border-border bg-white",
                    isActive && "border-primary/30",
                  )}
                >
                  <Image
                    src={tmpl.image}
                    alt={`${tmpl.name} template preview`}
                    width={300}
                    height={375}
                    className="h-full w-full object-cover object-top"
                  />
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
