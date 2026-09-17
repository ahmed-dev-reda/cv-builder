import { addEducation, SectionName } from "@/lib/features/resumeSlice";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";

import { v4 as uuidv4 } from "uuid";
import EducationJSX from "./EducationItem";
export default function Education({
  inputClasses,
  section,
  children,
}: {
  inputClasses: string;
  section: SectionName;
  children: React.ReactNode;
}) {
  const state = useSelector((state: RootState) => state.resume);
  const dispatch = useDispatch();

  // Handlers
  const [showEducations, setShowEducations] = useState<boolean>(false);
  function createNewEducation() {
    dispatch(
      addEducation({
        id: uuidv4(),
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        points: [],
      }),
    );
  }
  return (
    <div>
      <div
        className={`mt-4 overflow-hidden border border-[#C3C6D7] rounded-md shadow-lg shadow-gray-300/45 transition-all ${showEducations ? "max-h-dvh" : "max-h-11"}`}
      >
        <div className="flex items-center justify-between border-b border-b-[#C3C6D7] bg-[#F8F9FF] px-4 py-2">
          {children}
          <button
            className={`cursor-pointer transition-all ${!showEducations && "rotate-180"}`}
            onClick={() => setShowEducations(!showEducations)}
          >
            <IoIosArrowDown size={25} />
          </button>
        </div>
        <div className="bg-white p-4">
          {state.education.map((edu) => (
            <EducationJSX edu={edu} inputClasses={inputClasses} key={edu.id} />
          ))}
          <button
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-2 border-dashed border-[#B4C5FF] p-1 text-center text-lg font-semibold text-[#004AC6]"
            onClick={createNewEducation}
          >
            <FaPlus size={15} /> Add Education
          </button>
        </div>
      </div>
    </div>
  );
}
