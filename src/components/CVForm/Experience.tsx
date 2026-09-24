import { addExperience, SectionName } from "@/lib/features/resumeSlice";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ExperienceItem from "./ExperienceItem";
import { FaPlus } from "react-icons/fa";
import SectionTitle from "./reusable/SectionTitle";
export default function Experience({
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
  const [showExperiences, setShowExperiences] = useState<boolean>(false);
  function createNewExperience() {
    dispatch(
      addExperience({
        id: uuidv4(),
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        points: [],
      }),
    );
  }

  return (
    <div>
      <div
        className={`mt-4 overflow-hidden border border-[#C3C6D7] rounded-md shadow-lg shadow-gray-300/45
           transition-all ${showExperiences ? "max-h-dvh" : "max-h-11"}`}
      >
        <div className="flex items-center justify-between border-b border-b-[#C3C6D7] bg-[#F8F9FF] px-4 py-2">
          {children}
          <button
            className={`cursor-pointer transition-all ${!showExperiences && "rotate-180"}`}
            onClick={() => setShowExperiences(!showExperiences)}
          >
            <IoIosArrowDown size={25} />
          </button>
        </div>
        <div className="bg-white p-4">
          {state.experience.map((exp) => (
            <ExperienceItem
              exp={exp}
              inputClasses={inputClasses}
              key={exp.id}
            />
          ))}
          <button
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-2
             border-dashed border-[#B4C5FF] p-1 text-center text-lg font-semibold text-[#004AC6]"
            onClick={createNewExperience}
          >
            <FaPlus size={15} /> Add Experience
          </button>
        </div>
      </div>
    </div>
  );
}
