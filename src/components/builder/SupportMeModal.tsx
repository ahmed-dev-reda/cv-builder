"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { closeSupportMe } from "@/lib/features/supportMeSlice";
import {
  SUPPORT_ME_LINKS,
  markSupportMeSnoozed,
} from "@/lib/supportMe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SupportMeModal() {
  const open = useSelector((state: RootState) => state.supportMe.open);
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeSupportMe());

  // Close on Escape — the shared Dialog primitive has no built-in key handling.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dispatch]);

  const handleMaybeLater = () => {
    markSupportMeSnoozed();
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-me-title"
        aria-describedby="support-me-description"
        className="max-w-md p-7 text-center"
      >
        <DialogClose aria-label="Close support dialog" autoFocus />

        <DialogHeader className="items-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary-50">
            <FaHeart className="size-6 text-primary" aria-hidden="true" />
          </span>
          <DialogTitle id="support-me-title" className="mt-4 text-2xl">
            Support Me ❤️
          </DialogTitle>
          <DialogDescription
            id="support-me-description"
            className="mt-2 text-center text-sm"
          >
            If Now CV helps you create a better CV, support me by following my
            journey and connecting with me on social media.
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-5 space-y-2 text-left">
          {SUPPORT_ME_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow on ${link.label} (opens in a new tab)`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-px hover:bg-gray-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    link.hoverClass,
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {link.label}
                  <span aria-hidden="true" className="ml-auto text-xs text-muted">
                    ↗
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleMaybeLater}
            className="flex-1"
          >
            Maybe later
          </Button>
          <Button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-primary hover:bg-primary-dark"
          >
            Continue editing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
