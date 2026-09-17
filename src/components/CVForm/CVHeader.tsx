import {
  inter,
  roboto,
  openSans,
  lato,
  montserrat,
  poppins,
  merriweather,
  playfairDisplay,
  oswald,
  nunito,
} from "@/lib/fonts";

import { setColor, setFont } from "@/lib/features/resumeSlice";
import { RootState } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa";
import { VscSettingsCompact } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";

const fonts = [
  {
    name: "Inter",
    className: inter.className,
  },
  {
    name: "Roboto",
    className: roboto.className,
  },
  {
    name: "Open Sans",
    className: openSans.className,
  },
  {
    name: "Lato",
    className: lato.className,
  },
  {
    name: "Montserrat",
    className: montserrat.className,
  },
  {
    name: "Poppins",
    className: poppins.className,
  },
  {
    name: "Merriweather",
    className: merriweather.className,
  },
  {
    name: "Playfair Display",
    className: playfairDisplay.className,
  },
  {
    name: "Oswald",
    className: oswald.className,
  },
  {
    name: "Nunito",
    className: nunito.className,
  },
];

export default function Progress({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const dispatch = useDispatch();

  const selectedFont = useSelector((state: RootState) => state.resume.font);

  const [openFont, setOpenFont] = useState(false);
  const [custom, setCustom] = useState("#4A2C5A");

  const colors = [
    "#1F3864",
    "#000000",
    "#333333",
    "#1E4D2B",
    "#6E1F2E",
    "#168F8B",
  ];

  // Get selected font object
  const currentFont =
    fonts.find((font) => font.className === selectedFont) ?? fonts[0];

  return (
    <div className="p-8 shadow shadow-gray-300">
      <h2 className="mb-2 flex gap-4 text-3xl font-semibold">
        <Link href="/" className="transition-all hover:-translate-x-px">
          <BiLeftArrowAlt size={35} />
        </Link>

        <span>Edit Details</span>
      </h2>

      {/* Profile Completion */}
      <div>
        <h4 className="flex justify-between text-sm font-bold text-[#004AC6]">
          Profile Completion
          <span className="text-[#434655]">{percentage.toFixed()}%</span>
        </h4>

        <div className="relative h-1 overflow-hidden rounded-xl bg-[#D3E4FE]">
          <span
            className="absolute h-full bg-[#004AC6] transition-[width] duration-200 ease"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Colors */}
      <div className="mt-4 flex gap-2">
        {colors.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => dispatch(setColor(item))}
            className={`size-8 rounded-full border-2 shadow-xl shadow-blue-500/25 ${
              color === item
                ? "border-slate-700 -translate-y-0.5"
                : "border-transparent shadow-transparent"
            }`}
            style={{
              backgroundColor: item,
            }}
          />
        ))}

        <label
          htmlFor="color"
          className="group relative block size-8 cursor-pointer overflow-hidden rounded-full"
          style={{ backgroundColor: custom }}
        >
          <VscSettingsCompact
            className="
              absolute inset-0 m-auto size-full rounded-full
              bg-black/50 p-1 text-white opacity-0
              transition-opacity duration-200
              group-hover:opacity-100
            "
          />

          <input
            type="color"
            id="color"
            value={custom}
            onChange={(e) => {
              const value = e.target.value;

              setCustom(value);
              dispatch(setColor(value));
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>

      {/* Font */}
      <div className="relative mt-4 z-99">
        {/* Button */}
        <button
          type="button"
          onClick={() => setOpenFont((prev) => !prev)}
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
          <span className={currentFont.className}>{currentFont.name}</span>

          <FaChevronDown
            className={`h-3 w-3 transition-transform ${
              openFont ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {openFont && (
          <div
            className="
              absolute left-0 top-full z-50
              mt-2
              w-48
              rounded-lg
              border border-gray-200
              bg-white
              p-2
              shadow-lg
            "
          >
            {fonts.map((font) => (
              <button
                key={font.name}
                type="button"
                onClick={() => {
                  dispatch(setFont(font.className));
                  setOpenFont(false);
                }}
                className={`
                  flex w-full items-center
                  rounded-md
                  px-2 py-2
                  text-left text-sm
                  transition-colors
                  ${
                    selectedFont === font.className
                      ? "bg-blue-50 text-[#0D47A1]"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className={font.className}>{font.name}</span>

                {selectedFont === font.className && (
                  <span className="ml-auto">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
