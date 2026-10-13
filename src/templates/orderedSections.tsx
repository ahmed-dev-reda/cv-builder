import * as React from "react";
import type { ResumeState, SectionId } from "@/lib/features/resumeSlice";

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
];

function isSectionId(value: unknown): value is SectionId {
  return (
    typeof value === "string" &&
    (DEFAULT_SECTION_ORDER as string[]).includes(value)
  );
}

/**
 * Returns the user-defined section order, falling back to the canonical
 * order for legacy CV data saved before reordering existed.
 */
export function getSectionOrder(state: Pick<ResumeState, "sectionOrder">): SectionId[] {
  const order = (state as { sectionOrder?: unknown }).sectionOrder;
  if (
    Array.isArray(order) &&
    order.length === DEFAULT_SECTION_ORDER.length &&
    order.every(isSectionId) &&
    new Set(order).size === DEFAULT_SECTION_ORDER.length
  ) {
    return order as SectionId[];
  }
  return DEFAULT_SECTION_ORDER;
}

/**
 * Renders complete section blocks in the given order with stable keys.
 * Every template uses this so editor, preview, and PDF share one order.
 */
export function OrderedSections({
  order,
  blocks,
}: {
  order: SectionId[];
  blocks: Record<SectionId, React.ReactNode>;
}) {
  return (
    <>
      {order.map((id) => (
        <React.Fragment key={id}>{blocks[id]}</React.Fragment>
      ))}
    </>
  );
}
