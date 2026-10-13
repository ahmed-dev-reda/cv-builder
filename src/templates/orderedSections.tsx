import * as React from "react";
import type { ResumeState, OrderableSectionId } from "@/lib/features/resumeSlice";

export const DEFAULT_SECTION_ORDER: OrderableSectionId[] = [
  "summary",
  "experience",
  "education",
  "projects",
];

function isOrderableSectionId(value: unknown): value is OrderableSectionId {
  return (
    typeof value === "string" &&
    (DEFAULT_SECTION_ORDER as string[]).includes(value)
  );
}

/**
 * Returns the user-defined section order, falling back to the canonical
 * order for legacy CV data. Orders saved before skills was removed from
 * ordering still contain "skills" — it is stripped here.
 */
export function getSectionOrder(state: Pick<ResumeState, "sectionOrder">): OrderableSectionId[] {
  const order = (state as { sectionOrder?: unknown }).sectionOrder;
  if (!Array.isArray(order)) return DEFAULT_SECTION_ORDER;
  const stripped = (order as unknown[]).filter(isOrderableSectionId);
  if (
    stripped.length === DEFAULT_SECTION_ORDER.length &&
    new Set(stripped).size === DEFAULT_SECTION_ORDER.length
  ) {
    return stripped;
  }
  return DEFAULT_SECTION_ORDER;
}

/**
 * Renders complete section blocks in the given order with stable keys.
 * Every template uses this so editor, preview, and PDF share one order.
 * Skills is fixed (rendered last by each template) and not part of the order.
 */
export function OrderedSections({
  order,
  blocks,
}: {
  order: OrderableSectionId[];
  blocks: Record<OrderableSectionId, React.ReactNode>;
}) {
  return (
    <>
      {order.map((id) => (
        <React.Fragment key={id}>{blocks[id]}</React.Fragment>
      ))}
    </>
  );
}
