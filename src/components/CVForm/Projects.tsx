"use client";

import * as React from "react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/lib/store";
import { addProject } from "@/lib/features/resumeSlice";
import ProjectItem from "./ProjectItem";
import { FaPlus } from "react-icons/fa";
import { SortableProvider } from "../dnd/SortableProvider";
import { SortableItem } from "../dnd/SortableItem";

export default function Projects({
  inputClasses,
  children,
}: {
  inputClasses: string;
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

  const projectIds = state.projects.map((project) => project.id);

  const handleReorder = (newOrder: string[]) => {
    const newProjects = newOrder.map((id) =>
      state.projects.find((project) => project.id === id),
    ).filter(Boolean);

    dispatch({
      type: "resume/setProjects",
      payload: newProjects,
    });
  };

  return (
    <div>
      <div
        className={`mt-4 overflow-hidden rounded-lg border border-border shadow-sm transition-all ${
          showProjects ? "max-h-dvh" : "max-h-11"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
          {children}

          <button
            className={`cursor-pointer transition-all ${
              !showProjects && "rotate-180"
            }`}
            onClick={() => setShowProjects(!showProjects)}
          >
            <IoIosArrowDown className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-surface p-4">
          <SortableProvider id="project-entries" items={projectIds} onReorder={handleReorder}>
            {state.projects.map((project) => (
              <SortableItem key={project.id} id={project.id}>
                <ProjectItem
                  key={project.id}
                  project={project}
                  inputClasses={inputClasses}
                />
              </SortableItem>
            ))}
          </SortableProvider>

          <button
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary-200 p-1 text-center text-lg font-semibold text-primary transition hover:bg-primary-50"
            onClick={createNewProject}
          >
            <FaPlus className="h-4 w-4" />
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
