"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds (e.g. `index * 0.06`). */
  delay?: number;
  /** Vertical rise distance in px. */
  distance?: number;
  as?: "div" | "span";
}

// Fades + rises content into view the first time it enters the viewport.
// Respects the OS reduced-motion setting via the global MotionProvider.
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  as = "div",
}: RevealProps) {
  const Tag = as === "span" ? motion.span : motion.div;

  return (
    <Tag
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
