"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";

// Global motion settings: respects the OS "reduce motion" preference
// while keeping all in-app animations declared at usage sites.
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
