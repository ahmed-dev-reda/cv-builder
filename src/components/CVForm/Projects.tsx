"use client";

import { addProject, SectionName } from "@/lib/features/resumeSlice";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import ProjectItem from "./ProjectItem";

export default function Projects({
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

  const [showProjects, setShowProjects] = useState<boolean>(false);

  function createNewProject() {
    dispatch(
      addProject({
        id: uuidv4(),
        name: "",
        description: "",
        technologies: [],
        url: "",
        startDate: "",
        endDate: "",
      }),
    );
  }

  return (
    <div>
      <div
        className={`mt-4 overflow-hidden rounded-md border border-[#C3C6D7] shadow-lg
          shadow-gray-300/45 transition-all ${
            showProjects ? "max-h-dvh" : "max-h-11"
          }`}
      >
        <div className="flex items-center justify-between border-b border-b-[#C3C6D7] bg-[#F8F9FF] px-4 py-2">
          {children}

          <button
            type="button"
            className={`cursor-pointer transition-all ${
              !showProjects && "rotate-180"
            }`}
            onClick={() => setShowProjects(!showProjects)}
          >
            <IoIosArrowDown size={25} />
          </button>
        </div>

        <div className="bg-white p-4">
          {state.projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              inputClasses={inputClasses}
            />
          ))}

          <button
            type="button"
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2
              rounded-sm border-2 border-dashed border-[#B4C5FF] p-1
              text-center text-lg font-semibold text-[#004AC6]"
            onClick={createNewProject}
          >
            <FaPlus size={15} />
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
