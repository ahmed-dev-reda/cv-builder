"use client";

import * as React from "react";
import { FileText, LayoutTemplate, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarRoute = "editor" | "templates" | "ai";

const routes: Array<{
  id: SidebarRoute;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "editor", label: "Editor", icon: FileText },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "ai", label: "AI Assistant", icon: Sparkles },
];

interface BuilderSidebarProps {
  active: SidebarRoute;
  onChange: (route: SidebarRoute) => void;
}

export default function BuilderSidebar({ active, onChange }: BuilderSidebarProps) {
  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-surface py-3 sm:w-16">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = active === route.id;

        return (
          <button
            key={route.id}
            onClick={() => onChange(route.id)}
            title={route.label}
            className={cn(
              "group flex w-11 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-all cursor-pointer",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted hover:bg-gray-50 hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-muted group-hover:text-foreground",
              )}
            />
            <span className="leading-tight">{route.label}</span>
          </button>
        );
      })}
    </aside>
  );
}