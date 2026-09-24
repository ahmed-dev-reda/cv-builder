"use client";

import { setTemplate } from "@/lib/features/resumeSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const templates = [
  { id: "simple", label: "Simple" },
  { id: "minimalist", label: "Minimalist" },
  { id: "classicOne", label: "ClassicOne" },
  { id: "classicTwo", label: "ClassicTwo" },
  { id: "minimalistTwo", label: "MinimalistTwo" },
  { id: "classicThree", label: "ClassicThree" },
  { id: "classicFour", label: "ClassicFour" },
] as const;

export default function BuilderHeader() {
  const dispatch = useDispatch<AppDispatch>();

  const template = useSelector((state: RootState) => state.resume.template);

  const [open, setOpen] = useState(false);

  const selectedTemplate =
    templates.find((item) => item.id === template) ?? templates[0];

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between bg-inherit px-6 py-3"
    >
      <h1 className="hidden xl:block mr-4 text-lg font-semibold text-[#1e1e1e]">
        Resume Builder
      </h1>
      <div className="flex items-center gap-2 flex-col md:flex-row">
        <span className="text-sm">Choose Template: </span>
        <div className="relative">
          {/* Button */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="
            inline-flex items-center justify-center gap-2
            rounded-lg
            border border-gray-300
            bg-white
            px-3 py-1
            text-sm font-medium
            text-gray-700
          "
          >
            {selectedTemplate.label}

            <FaChevronDown
              className={`h-3 w-3 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="
              absolute right-0 top-full z-50
              mt-2
              w-44
              rounded-lg
              border border-gray-200
              bg-white
              p-2
              shadow-lg
            "
            >
              {templates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    dispatch(setTemplate(item.id));
                    setOpen(false);
                  }}
                  className={`
                  flex w-full items-center
                  rounded-md
                  px-2 py-1
                  text-left text-sm
                  transition-colors
                  ${
                    template === item.id
                      ? "bg-blue-50 text-[#0D47A1]"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                >
                  {item.label}

                  {template === item.id && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
