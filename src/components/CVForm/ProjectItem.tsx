"use client";

import {
  deleteProject,
  Project,
  updateProject,
  updateProjectTechnologies,
} from "@/lib/features/resumeSlice";

import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useState } from "react";

export default function ProjectItem({
  project,
  inputClasses,
}: {
  project: Project;
  inputClasses: string;
}) {
  const dispatch = useDispatch();

  const [technology, setTechnology] = useState("");

  function addTechnology() {
    const value = technology.trim();

    if (!value) return;

    dispatch(
      updateProjectTechnologies({
        id: project.id,
        technologies: [...project.technologies, value],
      }),
    );

    setTechnology("");
  }

  function removeTechnology(index: number) {
    dispatch(
      updateProjectTechnologies({
        id: project.id,
        technologies: project.technologies.filter(
          (_, technologyIndex) => technologyIndex !== index,
        ),
      }),
    );
  }

  return (
    <div className="relative mb-4 rounded-sm border border-gray-300 bg-[#edf0f9a7] p-4">
      {/* Delete Project */}
      <button
        type="button"
        className="absolute right-3 top-3 cursor-pointer text-red-600"
        onClick={() => dispatch(deleteProject(project.id))}
      >
        <FaRegTrashAlt size={16} />
      </button>

      {/* Project Name */}
      <div>
        <label
          className="text-sm font-semibold"
          htmlFor={`projectName-${project.id}`}
        >
          Project Name
        </label>

        <input
          type="text"
          className={inputClasses}
          id={`projectName-${project.id}`}
          value={project.name}
          onChange={(e) =>
            dispatch(
              updateProject({
                id: project.id,
                data: {
                  name: e.target.value,
                },
              }),
            )
          }
        />
      </div>

      {/* URL + Dates */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label
            className="text-sm font-semibold"
            htmlFor={`projectUrl-${project.id}`}
          >
            Project URL
          </label>

          <input
            type="url"
            className={inputClasses}
            id={`projectUrl-${project.id}`}
            placeholder="https://example.com"
            value={project.url ?? ""}
            onChange={(e) =>
              dispatch(
                updateProject({
                  id: project.id,
                  data: {
                    url: e.target.value,
                  },
                }),
              )
            }
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold"
            htmlFor={`projectStartDate-${project.id}`}
          >
            Start Date
          </label>

          <input
            type="text"
            className={inputClasses}
            id={`projectStartDate-${project.id}`}
            value={project.startDate ?? ""}
            onChange={(e) =>
              dispatch(
                updateProject({
                  id: project.id,
                  data: {
                    startDate: e.target.value,
                  },
                }),
              )
            }
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold"
            htmlFor={`projectEndDate-${project.id}`}
          >
            End Date
          </label>

          <input
            type="text"
            className={inputClasses}
            id={`projectEndDate-${project.id}`}
            value={project.endDate ?? ""}
            onChange={(e) =>
              dispatch(
                updateProject({
                  id: project.id,
                  data: {
                    endDate: e.target.value,
                  },
                }),
              )
            }
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-5">
        <label
          className="text-sm font-semibold"
          htmlFor={`projectDescription-${project.id}`}
        >
          Description
        </label>

        <textarea
          className={`${inputClasses} min-h-24 resize-y`}
          id={`projectDescription-${project.id}`}
          placeholder="Describe your project..."
          value={project.description}
          onChange={(e) =>
            dispatch(
              updateProject({
                id: project.id,
                data: {
                  description: e.target.value,
                },
              }),
            )
          }
        />
      </div>

      {/* Technologies */}
      <div className="mt-5">
        <label className="text-sm font-semibold">Technologies</label>

        <div className="mt-2 flex gap-2">
          <input
            type="text"
            className={inputClasses}
            placeholder="e.g. React"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTechnology();
              }
            }}
          />

          <button
            type="button"
            className="shrink-0 rounded-sm bg-[#0D47A1] px-4 text-sm font-semibold text-white hover:bg-[#0a3a85]"
            onClick={addTechnology}
          >
            Add
          </button>
        </div>

        {project.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <div
                key={`${tech}-${index}`}
                className="flex items-center gap-2 rounded-sm bg-white px-2 py-1 text-sm shadow-sm"
              >
                <span>{tech}</span>

                <button
                  type="button"
                  className="cursor-pointer text-red-600 hover:text-red-700"
                  onClick={() => removeTechnology(index)}
                >
                  <FaRegTrashAlt size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
