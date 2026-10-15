"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store";

import { templates } from "@/data/templates";
import Image from "next/legacy/image";

import { setTemplate, TemplateType } from "@/lib/features/resumeSlice";

export default function TemplatePicker() {
  const templateName = useSelector((state: RootState) => state.resume.template);
  const dispatch = useDispatch<AppDispatch>();

  const handleChangeTemplate = (name: TemplateType) => {
    dispatch(setTemplate(name));
  };
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Choose a Template
        </h2>
        <p className="text-xs text-muted">
          Live preview with your current CV data
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <div
              key={template.name}
              className="overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md relative"
            >
              {templateName === template.name && (
                <div className="absolute size-full bg-blue-900/40 inset-0 z-50" />
              )}
              <div className="aspect-4/5 overflow-hidden bg-primary-50/30 ">
                <div className="h-full w-full transition-transform duration-300 hover:scale-[1.03]">
                  <button
                    onClick={() => handleChangeTemplate(template.name)}
                    className="size-full cursor-pointer"
                  >
                    <Image
                      src={template.image}
                      alt={`${template.name} template`}
                      width={500}
                      height={625}
                      className="h-full w-full object-contain"
                    />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <h3 className="font-semibold capitalize">{template.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
