"use client";

import * as React from "react";
import { useSelector } from "react-redux";
import type { ComponentType, RefObject } from "react";
import type { RootState } from "@/lib/store";

/** A4 page size in px at 96dpi (matches the existing 794x1123 layout). */
export const CV_PAGE_WIDTH = 794;
export const CV_PAGE_HEIGHT = 1123;
/** Blank breathing room kept at the bottom of every full page (and the top
 * of every continuation page), so content never touches sheet edges. */
export const CV_PAGE_PADDING = 16;
/** Usable content height per page = full height minus the bottom padding. */
export const CV_CONTENT_HEIGHT = CV_PAGE_HEIGHT - CV_PAGE_PADDING;
/** Visual gap between sheets in the preview (collapsed to 0 in PDF). */
export const CV_PAGE_GAP = 32;
/** Safety cap so a corrupt measurement can never spawn endless pages. */
const MAX_PAGES = 20;

interface PaginatedPreviewProps {
  Template: ComponentType;
  containerRef: RefObject<HTMLDivElement | null>;
  /** Current preview zoom (measurement unscales rects by this factor). */
  zoom: number;
  onPageCountChange: (count: number) => void;
}

interface Atom {
  top: number;
  height: number;
}

/**
 * Automatic A4 pagination shared by every template.
 *
 * How it works: the full CV flow is rendered once per sheet inside a
 * fixed 794x1123 window, shifted up by that page's start offset. Each page
 * shows exactly one slice [start, nextStart) — slices never overlap, so no
 * content is ever duplicated or lost. A new page appears only when the
 * remaining element height truly exceeds the sheet. Offsets come from
 * measuring the real rendered DOM (first flow): top-level blocks are packed
 * greedily, snapping page starts to the last block boundary within the
 * usable height (1123 - 16px), so entries aren't sliced mid-item and every
 * full page keeps 16px blank at the bottom. Blocks taller than a page are
 * descended one level; a single item taller than a page is allowed to
 * split. The stacked fixed-height sheets also make Puppeteer's PDF output
 * match the preview page-for-page.
 */
export default function PaginatedPreview({
  Template,
  containerRef,
  zoom,
  onPageCountChange,
}: PaginatedPreviewProps) {
  // Page slices: exact, non-overlapping [offset, offset + height) windows
  // into the flow. Slices tile the full height with no gaps or duplicates.
  const [pages, setPages] = React.useState<
    Array<{ offset: number; height: number }>
  >([{ offset: 0, height: CV_PAGE_HEIGHT }]);
  const lastReportedRef = React.useRef(1);
  const resumeData = useSelector((state: RootState) => state.resume);

  const recalc = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const flow = container.querySelector<HTMLElement>("[data-cv-flow]");
    if (!flow) return;

    const scale = zoom > 0 ? zoom : 1;
    const flowRect = flow.getBoundingClientRect();
    const total = flow.scrollHeight;

    if (total <= 0) return;

    // Collect paginatable atoms: direct children of the flow; any child
    // taller than a page is descended one level so its entries can split
    // across pages instead of forcing a mid-item cut higher up.
    const atoms: Atom[] = [];
    const toLayoutPx = (px: number) => px / scale;
    for (const child of Array.from(flow.children)) {
      const el = child as HTMLElement;
      const rect = el.getBoundingClientRect();
      const height = toLayoutPx(rect.height);
      const top = toLayoutPx(rect.top - flowRect.top);
      if (height <= 0) continue;
      if (height <= CV_CONTENT_HEIGHT || el.children.length === 0) {
        atoms.push({ top, height });
      } else {
        let descended = false;
        for (const grand of Array.from(el.children)) {
          const g = grand as HTMLElement;
          const gRect = g.getBoundingClientRect();
          const gHeight = toLayoutPx(gRect.height);
          if (gHeight <= 0) continue;
          atoms.push({
            top: toLayoutPx(gRect.top - flowRect.top),
            height: gHeight,
          });
          descended = true;
        }
        if (!descended) atoms.push({ top, height });
      }
    }
    atoms.sort((a, b) => a.top - b.top);

    // Greedy pack: a new page appears only when the remaining element
    // height truly exceeds the sheet (start + 1123 < total). Page starts
    // snap to the last atom top within the usable height (1123 - 16px), so
    // every full page keeps 16px blank at the bottom and slices tile
    // exactly with no overlap or duplication.
    const slices: Array<{ offset: number; height: number }> = [];
    let start = 0;
    let guard = 0;
    while (start + CV_PAGE_HEIGHT < total && guard < MAX_PAGES) {
      guard += 1;
      const limit = start + CV_CONTENT_HEIGHT;
      let next = -1;
      for (const atom of atoms) {
        if (atom.top > start + 1 && atom.top <= limit) next = atom.top;
      }
      if (next < 0 || next <= start) {
        // No snap point (e.g. one giant item): fall back to fixed windows.
        next = start + CV_CONTENT_HEIGHT;
      }
      next = Math.min(next, total);
      slices.push({
        offset: Math.round(start),
        height: Math.round(next - start),
      });
      start = next;
    }
    // Last (or only) page takes the remainder, capped at one sheet.
    if (guard < MAX_PAGES) {
      slices.push({
        offset: Math.round(start),
        height: Math.round(Math.min(total - start, CV_PAGE_HEIGHT)),
      });
    }

    setPages((prev) => {
      if (
        prev.length === slices.length &&
        prev.every(
          (p, i) =>
            p.offset === slices[i].offset && p.height === slices[i].height,
        )
      ) {
        return prev;
      }
      return slices;
    });
    if (slices.length !== lastReportedRef.current) {
      lastReportedRef.current = slices.length;
      onPageCountChange(slices.length);
    }
  }, [containerRef, zoom, onPageCountChange]);

  // Recalc on content/template/font/order edits, zoom changes, resizes, and
  // webfont loads. All setState happens inside async callbacks (rAF /
  // observers), never synchronously in the effect body.
  React.useEffect(() => {
    let cancelled = false;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!cancelled) recalc();
      });
    };

    schedule();

    const container = containerRef.current;
    const observer = new ResizeObserver(schedule);
    if (container) observer.observe(container);
    window.addEventListener("resize", schedule);
    let fontsDone = false;
    document.fonts?.ready
      .then(() => {
        if (!fontsDone && !cancelled) {
          fontsDone = true;
          schedule();
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [recalc, containerRef, resumeData]);

  return (
    <div ref={containerRef} className={`cv-pages ${resumeData.font}`}>
      {pages.map((page, index) => (
        <div key={`${index}-${page.offset}`} className="cv-sheet">
          <div
            className="cv-window"
            style={{
              height: page.height + (index > 0 ? CV_PAGE_PADDING : 0),
              paddingTop: index > 0 ? CV_PAGE_PADDING : 0,
            }}
          >
            <div
              className="cv-flow"
              data-cv-flow
              aria-hidden={index > 0}
              style={{ transform: `translateY(${-page.offset}px)` }}
            >
              <Template />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
