import {
  removeSkill,
  SectionName,
  setSkills,
  type Single,
} from "@/lib/features/resumeSlice";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

// Skill Fields
export default function Skills({
  inputClasses,
  section,
  children,
}: {
  inputClasses: string;
  section: SectionName;
  children: React.ReactNode;
}) {
  const skills = useSelector((state: RootState) => state.resume.skills);
  const dispatch = useDispatch();

  const [showSkills, setShowSkills] = useState<boolean>(false);
  const [skill, setSkill] = useState<Single>({ id: uuidv4(), name: "" });
  function createNewSkill(skill: string) {
    if (skill.length > 2) {
      dispatch(setSkills({ id: uuidv4(), name: skill }));
      setSkill({ id: uuidv4(), name: "" });
    }
  }

  return (
    <div
      className={`mt-4 flex-1 basis-sm overflow-hidden border border-[#C3C6D7] rounded-md shadow-md shadow-gray-300/45 transition-all ${showSkills ? "max-h-dvh" : "max-h-11"}`}
    >
      <div className="flex items-center justify-between border-b border-b-[#C3C6D7] bg-[#F8F9FF] px-4 py-2">
        {children}

        <button
          className={`cursor-pointer transition-all ${!showSkills && "rotate-180"}`}
          onClick={() => setShowSkills(!showSkills)}
        >
          <IoIosArrowDown size={25} />
        </button>
      </div>
      <div className="bg-white p-4">
        {/* Add Skill */}
        <div className="flex w-full overflow-hidden rounded-lg border border-gray-300 transition-all focus-within:border-[#0D47A1] focus-within:ring-2 focus-within:ring-[#0D47A1]/10">
          <input
            type="text"
            name="skillName"
            id="skillName"
            placeholder="e.g. React, TypeScript, Next.js"
            className="min-w-0 flex-1 px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            value={skill.name}
            onChange={(e) =>
              setSkill((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <button
            type="button"
            className="cursor-pointer px-5 py-2 text-sm font-medium text-white bg-[#0D47A1] transition-colors hover:bg-[#093575]"
            onClick={() => createNewSkill(skill.name)}
          >
            Add
          </button>
        </div>

        {/* Skills */}
        {skills.length > 0 ? (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Added skills
            </p>

            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C7DAFA] bg-[#E8F0FE] px-3 py-1.5 text-sm font-medium text-[#173B69] transition-colors hover:bg-[#DCEAFF]"
                >
                  <span>{skill.name}</span>

                  <button
                    type="button"
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    onClick={() => dispatch(removeSkill(skill.id))}
                  >
                    <FaRegTrashAlt size={11} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-center text-sm text-gray-400">
            Add your technical skills above
          </p>
        )}
      </div>
    </div>
  );
}
