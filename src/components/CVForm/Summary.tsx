import { type SectionName, updateSummary } from "@/lib/features/resumeSlice";
import { RootState } from "@/lib/store";
import { useState } from "react";

import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

export default function Summary({
  inputClasses,
  section,
  children,
}: {
  inputClasses: string;
  section: SectionName;
  children: React.ReactNode;
}) {
  const summary = useSelector((state: RootState) => state.resume.summary);
  const dispatch = useDispatch();
  const [showSummary, setShowSummary] = useState<boolean>(false);

  return (
    <div
      className={`mt-4 overflow-hidden border border-[#C3C6D7] rounded-md shadow-lg shadow-gray-300/45 transition-all ${showSummary ? "max-h-dvh" : "max-h-11"}`}
    >
      <div className="flex items-center justify-between border-b border-b-[#C3C6D7] bg-[#F8F9FF] px-4 py-2">
        {children}
        <button
          className={`cursor-pointer transition-all ${!showSummary && "rotate-180"}`}
          onClick={() => setShowSummary(!showSummary)}
        >
          <IoIosArrowDown size={25} />
        </button>
      </div>
      <textarea
        name="summary"
        id="summary"
        className="h-70 w-full resize-none bg-white p-4 focus:outline-none"
        placeholder="Results-oriented Engineering Executive with a proven track..."
        value={summary}
        onChange={(e) => {
          dispatch(updateSummary(e.target.value));
        }}
      ></textarea>
    </div>
  );
}
