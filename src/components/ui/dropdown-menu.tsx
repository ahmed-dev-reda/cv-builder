"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

const DropdownMenuContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

const DropdownMenu = ({
  trigger,
  children,
  align = "end",
  className,
}: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className={cn("relative inline-block", className)}>
        <div onClick={() => setOpen(!open)}>{trigger}</div>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className={cn(
                "absolute z-50 mt-2 min-w-[8rem] rounded-md border border-border bg-surface p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100",
                align === "end" && "right-0",
                align === "start" && "left-0",
                align === "center" && "left-1/2 -translate-x-1/2",
              )}
            >
              {children}
            </div>
          </>
        )}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
});
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator };
