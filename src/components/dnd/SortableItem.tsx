"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  handleClassName?: string;
}

export function SortableItem({
  id,
  children,
  className,
  handleClassName,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "z-50 opacity-80 shadow-lg rounded-lg",
        className,
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-muted hover:text-foreground opacity-100 transition-opacity rounded-l-lg hover:bg-gray-50",
          handleClassName,
          isDragging && "opacity-100 cursor-grabbing",
        )}
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
}
